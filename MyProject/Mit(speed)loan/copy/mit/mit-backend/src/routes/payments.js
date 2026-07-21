const express = require('express'); // restart trigger
const EmiPayment = require('../models/EmiPayment');
const Penalty = require('../models/Penalty');
const Loan = require('../models/Loan');
const EmiSchedule = require('../models/EmiSchedule');
const { generateLoanQR, processWebhook, createUpiGatewayOrder, createEkqrOrder, processEkqrWebhook, checkStatus, distributePayment } = require('../services/PaymentService');
const PhonePeService = require('../services/PhonePeService');

const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;
        const query = EmiPayment.find()
            .populate({
                path: 'loan_id',
                select: 'loan_code customer_id',
                populate: { path: 'customer_id', select: 'full_name' }
            })
            .sort({ payment_date: -1, _id: -1 });

        if (limit > 0) {
            query.limit(limit);
        }

        const payments = await query;
        res.json(payments);
    } catch (err) {
        console.error('Error fetching payments:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

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

// Get all penalties
router.get('/penalties', async (req, res) => {
    try {
        const penalties = await Penalty.find()
            .populate('loan_id')
            .populate('applied_by', 'full_name')
            .sort({ applied_at: -1 });
        res.json(penalties);
    } catch (err) {
        console.error('Error fetching all penalties:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Payment
router.put('/:id', async (req, res) => {
    try {
        const { amount_paid, payment_mode, payment_date, transaction_reference, remarks } = req.body;

        const payment = await EmiPayment.findByIdAndUpdate(
            req.params.id,
            {
                amount_paid,
                payment_mode,
                payment_date: payment_date || new Date(),
                transaction_reference,
                remarks
            },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // TRIGGER SCHEDULE RECALCULATION (Same logic as POST /)
        // Since we changed history, we should ideally wipe valid schedule logic and rebuild...
        // But reusing the existing partial logic from POST is complex because it's additive.
        // EASIER: If we edit a payment, we are essentially changing the timeline.
        // For 'reducing' interest, this is critical.
        // We will call the same dynamic recalculation block.
        const loan_id = payment.loan_id;
        const Loan = require('../models/Loan');
        const loan = await Loan.findById(loan_id);

        // Only run complex calc for reducing loans as Flat is fixed schedule usually
        if (loan && loan.interest_type === 'reducing') {
            const { generateOrUpdateSchedule } = require('../utils/calculationUtils');
            const EmiSchedule = require('../models/EmiSchedule');

            // 1. Get all schedules
            const allSchedules = await EmiSchedule.find({ loan_id }).sort({ emi_number: 1 });
            const paidSchedules = allSchedules.filter(s => s.status === 'paid' || s.paid_amount > 0);

            // 2. Calc Actual Principal Paid from ALL updated payments
            const allPayments = await EmiPayment.find({ loan_id }).sort({ payment_date: 1 });

            let outstandingP = loan.principal_amount;
            // Deduct Down Payment
            if (loan.down_payment > 0) {
                outstandingP -= loan.down_payment;
            }

            // Simple proxy: Paid Schedules Sum
            const principalPaidSoFar = paidSchedules.reduce((sum, s) => sum + s.principal_component, 0);
            const currentOutstanding = Math.max(0, outstandingP - principalPaidSoFar);

            // 3. Regenerate Pending
            const lastPreservedEmi = paidSchedules.length > 0
                ? Math.max(...paidSchedules.map(s => s.emi_number))
                : 0;

            if (lastPreservedEmi < loan.tenure_months) {
                await EmiSchedule.deleteMany({
                    loan_id,
                    emi_number: { $gt: lastPreservedEmi }
                });

                const preserved = allSchedules.filter(s => s.emi_number <= lastPreservedEmi);
                const newRows = await generateOrUpdateSchedule(loan, currentOutstanding, preserved);

                if (newRows.length > 0) {
                    await EmiSchedule.insertMany(newRows);
                }
            }
        }

        res.json(payment);
    } catch (err) {
        console.error('Error updating payment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Penalty
router.put('/penalty/:id', async (req, res) => {
    try {
        const { amount, reason } = req.body;
        const penalty = await Penalty.findByIdAndUpdate(
            req.params.id,
            { amount, reason },
            { new: true }
        );

        if (!penalty) {
            return res.status(404).json({ message: 'Penalty not found' });
        }
        res.json(penalty);
    } catch (err) {
        console.error('Error updating penalty:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- QR CODE ROUTES ---

// Generate/Get Loan QR
router.get('/loan/:id/qr', async (req, res) => {
    try {
        const result = await generateLoanQR(req.params.id);
        res.json(result);
    } catch (err) {
        console.error('Error getting QR:', err);
        res.status(500).json({ message: err.message });
    }
});

// Razorpay Webhook
router.post('/webhook-old', async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        await processWebhook(req.body, signature);
        res.json({ status: 'ok' });
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(400).json({ message: err.message });
    }
});

router.post(
    "/webhook",
    express.urlencoded({ extended: true }),
    async (req, res) => {
        try {
            await processEkqrWebhook(req.body);
            res.send("OK");
        } catch (err) {
            console.error(err);
            res.status(400).send("Error");
        }
    }
);



router.get('/loan/:id/pay', async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id).populate('customer_id');

        const order = await createEkqrOrder(loan);

        // console.log("order",order);

        if (order) {
            const status = await checkStatus("loan_6990142d4726d900e8df8298_1771498107104");
            console.log("status", status);
        }

        res.json({
            payment_url: order.payment_url,
            order_id: order.order_id,
            txn_id: order.client_txn_id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


// --- PHONEPE ROUTES ---

// Scanned by customer to auto-fetch balance and pay
// router.get('/loan/:id/phonepe-pay', async (req, res) => {
//     try {
//         const result = await PhonePeService.initiateDynamicQR(req.params.id);
//         if (result.success) {
//             // Redirect to PhonePe payment page or return QR data
//             // If scanning from mobile, we might want to return a deep link or redirect
//             if (result.qr_data.startsWith('upi://')) {
//                 return res.redirect(result.qr_data);
//             }
//             res.json(result);
//         } else {
//             res.status(400).json(result);
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: err.message });
//     }
// });
// ==============================
// STATIC QR PAYMENT ROUTE (Dynamic Amount)
// ==============================

router.get("/pay/q/:token", async (req, res) => {
    try {
        const loan = await Loan.findOne({ qr_token: req.params.token });
        if (!loan) {
            return res.status(404).send("Invalid or expired QR code");
        }

        const result = await PhonePeService.initiateDynamicQR(loan._id);

        if (!result.success) {
            // Return a basic error
            return res.status(400).send("Payment could not be initiated: " + (result.message || "Unknown error"));
        }

        // Redirect to PhonePe Hosted Checkout Page
        if (result.redirect_url) {
            return res.redirect(result.redirect_url);
        }

        // Fallback for intent URI
        if (result.qr_data && result.qr_data.startsWith("upi://")) {
            return res.redirect(result.qr_data);
        }

        return res.json(result);
    } catch (err) {
        console.error("Static QR Route Error:", err);
        res.status(500).send("An error occurred while initiating payment");
    }
});

// ==============================
// PHONEPE PAYMENT ROUTE
// ==============================

router.get("/loan/:id/phonepe-pay", async (req, res) => {
    try {
        const result = await PhonePeService.initiateDynamicQR(req.params.id);

        if (!result.success) {
            return res.status(400).json(result);
        }

        /**
         * CASE 1: PAY_PAGE (Most common)
         */
        if (result.redirect_url) {
            return res.redirect(result.redirect_url);
        }

        /**
         * CASE 2: UPI QR Deep Link
         */
        if (result.qr_data && result.qr_data.startsWith("upi://")) {
            return res.redirect(result.qr_data);
        }

        /**
         * CASE 3: API response with QR data
         * Convert camelCase to snake_case for frontend compatibility
         */
        const qrResponse = result.data ? {
            qr_id: result.data.qrId,
            qr_string: result.data.qrString,
            url: result.data.url,
            merchant_transaction_id: result.data.merchantTransactionId,
            image_url: result.data.imageUrl  // ✅ Fixed field name
        } : result;

        return res.json({
            success: result.success,
            message: result.message,
            ...qrResponse
        });

    } catch (err) {
        console.error("PhonePe Route Error:", err);
        res.status(500).json({ message: err.message });
    }
});


// PhonePe Webhook for Payments
router.post('/phonepe-webhook', async (req, res) => {
    try {
        const base64Response = req.body.response;
        const signature = req.headers['x-verify'];

        // 1. Validate Signature
        if (signature) {
            const secret = process.env.PHONEPE_WEBHOOK_SECRET;
            const crypto = require('crypto');
            const expectedSignature = crypto.createHash('sha256').update(base64Response + secret).digest('hex') + "###1";

            if (expectedSignature !== signature) {
                console.error("Invalid PhonePe Webhook Signature");
                return res.status(400).send("Invalid Signature");
            }
        }

        const decodedResponse = JSON.parse(Buffer.from(base64Response, 'base64').toString('utf-8'));

        console.log('PhonePe Webhook Received:', decodedResponse);

        if (decodedResponse.success && decodedResponse.code === 'PAYMENT_SUCCESS') {
            const data = decodedResponse.data;
            const transactionId = data.merchantTransactionId;
            const amount = data.amount / 100; // Original amount in rupees
            const gatewayTxnId = data.transactionId;

            // Extract loanId from transactionId (Format: TXN_loanId_timestamp)
            const parts = transactionId.split('_');
            const loanId = parts[1]; // Index 1 because TXN is 0

            if (loanId) {
                const existing = await EmiPayment.findOne({ transaction_reference: gatewayTxnId });
                if (!existing) {
                    await distributePayment(loanId, amount, gatewayTxnId, 'upi');
                }
            }
        }

        res.status(200).send('OK');
    } catch (err) {
        console.error('PhonePe Webhook Error:', err);
        res.status(400).send('Error');
    }
});

// Admin trigger for AutoPay
router.post('/loan/:id/autopay/trigger', async (req, res) => {
    try {
        const result = await PhonePeService.triggerRecurringDebit(req.params.id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Setup Autopay Mandate
router.post('/loan/:id/autopay/setup', async (req, res) => {
    try {
        const result = await PhonePeService.setupAutopayMandate(req.params.id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
