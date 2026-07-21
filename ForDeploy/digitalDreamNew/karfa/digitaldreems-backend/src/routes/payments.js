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

        // Update EMI schedule
        const schedules = await EmiSchedule.find({ loan_id, status: { $in: ['pending', 'overdue', 'partial'] } })
            .sort({ emi_number: 1 });

        let remainingAmount = amount_paid;
        for (const schedule of schedules) {
            if (remainingAmount <= 0) break;

            const dueAmount = schedule.emi_amount - schedule.paid_amount;
            const paymentForThis = Math.min(remainingAmount, dueAmount);

            schedule.paid_amount += paymentForThis;
            if (schedule.paid_amount >= schedule.emi_amount) {
                schedule.status = 'paid';
                schedule.paid_date = payment_date || new Date();
            } else {
                schedule.status = 'partial';
            }

            await schedule.save();
            remainingAmount -= paymentForThis;
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
        const penalty = await Penalty.create(req.body);
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
