const express = require('express');
const Customer = require('../models/Customer');
const Loan = require('../models/Loan');
const EmiPayment = require('../models/EmiPayment');
const Penalty = require('../models/Penalty');
const EmiSchedule = require('../models/EmiSchedule');

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        const totalCustomers = await Customer.countDocuments();
        const activeLoans = await Loan.countDocuments({ status: 'active' });
        const completedLoans = await Loan.countDocuments({ status: { $in: ['completed', 'closed'] } });

        // Today's collection
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayPayments = await EmiPayment.find({
            payment_date: { $gte: today, $lt: tomorrow }
        });
        const totalCollectionToday = todayPayments.reduce((sum, p) => sum + p.amount_paid, 0);

        // Delayed EMIs
        const now = new Date();
        const delayedEmis = await EmiSchedule.countDocuments({
            due_date: { $lt: now },
            status: { $in: ['pending', 'partial', 'overdue'] }
        });

        // Total outstanding and disbursed
        const allLoans = await Loan.find({ status: 'active' });
        let totalDisbursed = 0;
        let totalOutstanding = 0;

        for (const loan of allLoans) {
            totalDisbursed += loan.principal_amount;

            const payments = await EmiPayment.find({ loan_id: loan._id });
            const totalPaid = payments.reduce((sum, p) => sum + p.amount_paid, 0);

            const penalties = await Penalty.find({ loan_id: loan._id });
            const totalPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);

            totalOutstanding += (loan.total_payable + totalPenalties - totalPaid);
        }

        res.json({
            total_customers: totalCustomers,
            active_loans: activeLoans,
            completed_loans: completedLoans,
            delayed_emis: delayedEmis,
            total_collection_today: totalCollectionToday,
            total_outstanding: totalOutstanding,
            total_disbursed: totalDisbursed
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Active loans report
router.get('/active-loans', async (req, res) => {
    try {
        const loans = await Loan.find({ status: 'active' })
            .populate('customer_id', 'full_name mobile_primary customer_code')
            .populate('product_id', 'product_code brand model')
            .sort({ created_at: -1 });
        res.json(loans);
    } catch (err) {
        console.error('Error fetching active loans:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delayed EMIs report
router.get('/delayed-emis', async (req, res) => {
    try {
        const now = new Date();
        const delayedSchedules = await EmiSchedule.find({
            due_date: { $lt: now },
            status: { $in: ['pending', 'partial', 'overdue'] }
        })
            .populate({
                path: 'loan_id',
                populate: { path: 'customer_id', select: 'full_name mobile_primary customer_code' }
            })
            .sort({ due_date: 1 });

        res.json(delayedSchedules);
    } catch (err) {
        console.error('Error fetching delayed EMIs:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Today's collection report
router.get('/today-collection', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const payments = await EmiPayment.find({
            payment_date: { $gte: today, $lt: tomorrow }
        })
            .populate({
                path: 'loan_id',
                populate: { path: 'customer_id', select: 'full_name customer_code' }
            })
            .populate('collected_by', 'full_name')
            .sort({ payment_date: -1 });

        res.json(payments);
    } catch (err) {
        console.error('Error fetching today collection:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
