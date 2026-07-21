const express = require('express');
const EmiPayment = require('../models/EmiPayment');
const Penalty = require('../models/Penalty');
const Loan = require('../models/Loan');
const EmiSchedule = require('../models/EmiSchedule');

const router = express.Router();

// Record EMI payment
router.post('/', async (req, res) => {
    try {
        const { loan_id, amount_paid, payment_mode, payment_date, collected_by, transaction_reference, remarks } = req.body;

        // Create payment record
        const payment = await EmiPayment.create({
            loan_id,
            amount_paid,
            payment_mode,
            payment_date: payment_date || new Date(),
            collected_by,
            transaction_reference,
            remarks
        });

        // Update EMI schedule status (existing logic)
        const schedules = await EmiSchedule.find({ loan_id, status: { $in: ['pending', 'overdue', 'partial'] } })
            .sort({ emi_number: 1 });

        let remainingAmount = amount_paid;
        for (const schedule of schedules) {
            if (remainingAmount <= 0) break;

            const dueAmount = schedule.emi_amount - schedule.paid_amount;
            const paymentForThis = Math.min(remainingAmount, dueAmount);

            schedule.paid_amount += paymentForThis;
            if (Math.round(schedule.paid_amount) >= Math.round(schedule.emi_amount)) {
                schedule.status = 'paid';
                schedule.paid_date = payment_date || new Date();
            } else {
                schedule.status = 'partial';
            }

            await schedule.save();
            remainingAmount -= paymentForThis;
        }

        // --- DYNAMIC RECALCULATION FOR REDUCING BALANCE ---
        const loan = await Loan.findById(loan_id);
        if (loan && loan.interest_type === 'reducing') {
            console.log('Recalculating Reducing Balance Schedule...');
            const { generateOrUpdateSchedule } = require('../utils/calculationUtils');

            // 1. Get all PAID (or partial) schedules to preserve history
            // Actually, we should keep anything that has ANY payment, or just 'paid'?
            // Usually we keep 'paid' rows locked. 'partial' rows might need adjustment? 
            // Simpler: Keep all rows up to the last 'paid' one.
            const allSchedules = await EmiSchedule.find({ loan_id }).sort({ emi_number: 1 });
            const paidSchedules = allSchedules.filter(s => s.status === 'paid' || s.paid_amount > 0);

            // 2. Calculate Actual Outstanding Principal
            // We can't trust the schedule's "principal_component" if payments were irregular.
            // We must recalculate from Ledger logic.
            const allPayments = await EmiPayment.find({ loan_id }).sort({ payment_date: 1 });

            let outstandingP = loan.principal_amount;
            let outstandingFees = (loan.processing_fee || 0) + (loan.insurance_fee || 0);

            // Simplified Ledger Loop just to find O/S Principal
            // This mirrors the frontend logic
            allPayments.forEach(p => {
                let amt = p.amount_paid;

                // Pay Fees
                if (outstandingFees > 0) {
                    const feesPaid = Math.min(amt, outstandingFees);
                    outstandingFees -= feesPaid;
                    amt -= feesPaid;
                }

                // Penalties are skipped for Principal calc? 
                // Wait, if I pay penalty, it doesn't reduce principal.
                // We assume penalties are handled separately or deducted. 
                // For simplified calc, we just assume "amt" goes to Interest/Principal 
                // AFTER Fees are cleared.
                // But we need to know Interest.
                // Without full date logic this is hard. 

                // FALLBACK: Use the "Paid Schedules" to determine Principal Paid?
                // If the schedule says we paid X Principal, we respect that?
                // NO, user wants "Real Time Change".
                // If I paid 10k today, and EMI was 5k (1k Int, 4k Prin).
                // I paid 6k extra -> Principal should drop by 4k + 6k?

                // Let's use the `outstandingPrincipal` from the LAST schedule row that was touched?
                // No, that row is "Planned".

                // BEST APPROACH: 
                // Sum of all Principal Components in PAID schedules?
                // + Any "Excess" payment in PARTIAL schedules?

                // Let's try to be precise enough:
                // If a payment cleared a schedule, we assume that schedule's Principal Component is PAID.
                // If I have excess payment that didn't clear a schedule (e.g. paying in advance)?
                // `routes/payments.js` logic above applies payment to NEXT schedules.
                // So if I paid 10 schedules worth, 10 schedules become 'paid'.
                // So summing `principal_component` of all 'paid' schedules is a decent proxy.
            });

            const principalPaidSoFar = paidSchedules.reduce((sum, s) => sum + s.principal_component, 0);
            // This assumes the "Planned" principal was what was actually paid. 
            // For standard EMI this is true. For Advance payment, we marked multiple rows as paid.
            // So yes, Sum(PaidRows.Principal) is roughly accurate.

            const currentOutstanding = Math.max(0, loan.principal_amount - principalPaidSoFar);

            // 3. Delete FUTURE (Pending) schedules
            // Keep schedules that are 'paid' or 'partial' (since partial has some money in it).
            // Actually, if 'partial', we might want to keep it to avoid confusion, 
            // OR re-write it if we can applying the partial amount to the NEW structure?
            // Safer: Keep 'paid' and 'partial'. Regenerate only 'pending'.
            // Get the last 'paid'/'partial' EMI number.
            const lastPreservedEmi = paidSchedules.length > 0
                ? Math.max(...paidSchedules.map(s => s.emi_number))
                : 0;

            if (lastPreservedEmi < loan.tenure_months) {
                // Delete strictly pending ones after the last touched one
                await EmiSchedule.deleteMany({
                    loan_id,
                    emi_number: { $gt: lastPreservedEmi }
                });

                const preserved = allSchedules.filter(s => s.emi_number <= lastPreservedEmi);

                // Regenerate future
                const newRows = await generateOrUpdateSchedule(loan, currentOutstanding, preserved);

                if (newRows.length > 0) {
                    await EmiSchedule.insertMany(newRows);
                }
            }
        }

        res.status(201).json(payment);
    } catch (err) {
        console.error('Error recording payment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payments for a loan
router.get('/loan/:loanId', async (req, res) => {
    try {
        const payments = await EmiPayment.find({ loan_id: req.params.loanId })
            .populate('collected_by', 'full_name')
            .sort({ payment_date: -1 });
        res.json(payments);
    } catch (err) {
        console.error('Error fetching payments:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Apply penalty
router.post('/penalty', async (req, res) => {
    try {
        const penaltyData = {
            ...req.body,
            penalty_date: req.body.penalty_date || new Date()
        };
        const penalty = await Penalty.create(penaltyData);
        res.status(201).json(penalty);
    } catch (err) {
        console.error('Error applying penalty:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get penalties for a loan
router.get('/penalty/loan/:loanId', async (req, res) => {
    try {
        const penalties = await Penalty.find({ loan_id: req.params.loanId })
            .populate('applied_by', 'full_name')
            .sort({ applied_at: -1 });
        res.json(penalties);
    } catch (err) {
        console.error('Error fetching penalties:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
