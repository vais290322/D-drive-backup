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
        let activeLoansCount = await Loan.countDocuments({ status: 'active' });
        let completedLoansCount = await Loan.countDocuments({ status: { $in: ['completed', 'closed'] } });

        // Include Manual Loans in counts
        const customersWithManualLoans = await Customer.find({
            'manual_loan_details.loan_amount': { $exists: true, $ne: null }
        }).lean();

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        customersWithManualLoans.forEach(cust => {
            if (cust.manual_loan_details) {
                const { emi_start_date, emi_end_date } = cust.manual_loan_details;
                if (emi_start_date && emi_end_date) {
                    const start = new Date(emi_start_date);
                    const end = new Date(emi_end_date);

                    if (currentDate >= start && currentDate <= end) {
                        activeLoansCount++;
                    } else if (currentDate > end) {
                        completedLoansCount++;
                    }
                }
            }
        });

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

        // Add Manual Loans to Financials
        customersWithManualLoans.forEach(cust => {
            if (cust.manual_loan_details && cust.manual_loan_details.loan_amount) {
                const details = cust.manual_loan_details;
                const amount = details.loan_amount || 0;
                totalDisbursed += amount;

                // Estimate Outstanding
                // Estimate Outstanding based on Remaining EMIs
                if (details.emi_start_date && details.emi_end_date && details.emi_amount) {
                    const start = new Date(details.emi_start_date);
                    const end = new Date(details.emi_end_date);
                    const now = new Date();

                    if (now > end) {
                        // Loan completed/closed
                        return;
                    }

                    // Calculate total months (approximate)
                    let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

                    // Calculate months passed
                    let monthsPassed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
                    if (now.getDate() < start.getDate()) monthsPassed--;
                    if (monthsPassed < 0) monthsPassed = 0;

                    const remainingMonths = Math.max(0, totalMonths - monthsPassed);
                    const estimatedOutstanding = remainingMonths * details.emi_amount;

                    totalOutstanding += estimatedOutstanding;
                } else {
                    // If insufficient details to calculate EMI-based outstanding, fallback to principal
                    // This prevents under-reporting if we only have the principal amount
                    totalOutstanding += amount;
                }
            }
        });

        res.json({
            total_customers: totalCustomers,
            active_loans: activeLoansCount,
            completed_loans: completedLoansCount,
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

// Helper to check if a date is within 'days' range
const isWithinDays = (targetDateStr, days) => {
    if (!targetDateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(targetDateStr);
    const currentYear = today.getFullYear();

    // Create date for this year
    const targetThisYear = new Date(currentYear, target.getMonth(), target.getDate());

    // Handle end of year wrap around for next year (e.g. Dec 30 checking for Jan 2)
    const targetNextYear = new Date(currentYear + 1, target.getMonth(), target.getDate());

    // Check range
    const diffTime = targetThisYear - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= days) return true;

    // Check next year wrap around
    const diffNext = targetNextYear - today;
    const diffDaysNext = Math.ceil(diffNext / (1000 * 60 * 60 * 24));

    return (diffDaysNext >= 0 && diffDaysNext <= days);
};

// Helper for absolute date difference (for loans which have specific years)
const isDateApproaching = (targetDateStr, days) => {
    if (!targetDateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (diffDays >= 0 && diffDays <= days);
};

// Logic for upcoming events
router.get('/dashboard-events', async (req, res) => {
    try {
        console.log("Creating upcoming events report...");
        const events = [];
        const customers = await Customer.find();
        console.log(`Found ${customers.length} customers to check.`);

        // 1. Birthdays & Anniversaries (3 days)
        customers.forEach(cust => {
            if (isWithinDays(cust.date_of_birth, 3)) {
                const dob = new Date(cust.date_of_birth);
                const showDate = new Date(new Date().getFullYear(), dob.getMonth(), dob.getDate()); // Show for this year
                events.push({
                    type: 'birthday',
                    message: `Celebrating the birthday of ${cust.full_name}`,
                    date: showDate,
                    customer_name: cust.full_name,
                    customer_phone: cust.mobile_primary,
                    customer_id: cust._id
                });
            }
            if (isWithinDays(cust.marriage_anniversary, 3)) {
                const anniv = new Date(cust.marriage_anniversary);
                const showDate = new Date(new Date().getFullYear(), anniv.getMonth(), anniv.getDate());
                events.push({
                    type: 'anniversary',
                    message: `Commemorating the anniversary of ${cust.full_name}`,
                    date: showDate,
                    customer_name: cust.full_name,
                    customer_phone: cust.mobile_primary,
                    customer_id: cust._id
                });
                console.log("Added Anniversary event for:", cust.full_name);
            }

            // Manual Loan Closure (25 days)
            if (cust.manual_loan_details && cust.manual_loan_details.emi_end_date) {
                if (isDateApproaching(cust.manual_loan_details.emi_end_date, 25)) {
                    const endDate = new Date(cust.manual_loan_details.emi_end_date);
                    events.push({
                        type: 'loan_closure',
                        message: `Scheduled loan maturity for ${cust.full_name}`,
                        date: endDate,
                        customer_name: cust.full_name,
                        customer_phone: cust.mobile_primary,
                        customer_id: cust._id
                    });
                }
            }
        });

        // 2. System Loans Closure (25 days)
        const activeLoans = await Loan.find({ status: 'active' }).populate('customer_id');
        for (const loan of activeLoans) {
            // Calculate end date based on start date * tenure
            // Or assume first_emi_date is start of repayment
            if (loan.start_date && loan.tenure_months) {
                const startDate = new Date(loan.start_date);
                const endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + loan.tenure_months);

                if (isDateApproaching(endDate.toISOString(), 25)) {
                    events.push({
                        type: 'loan_closure',
                        message: `Scheduled loan maturity for ${loan.customer_id.full_name}`,
                        date: endDate,
                        customer_name: loan.customer_id.full_name,
                        customer_phone: loan.customer_id.mobile_primary,
                        customer_id: loan.customer_id._id
                    });
                }
            }
        }

        // Sort events by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(events);
    } catch (err) {
        console.error("Error fetching dashboard events:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Active loans report
router.get('/active-loans', async (req, res) => {
    try {
        const loans = await Loan.find({ status: 'active' })
            .populate('customer_id', 'full_name mobile_primary customer_code')
            .populate('product_id', 'product_code brand model')
            .sort({ created_at: -1 })
            .lean(); // Use lean for easier modification

        // Manually add loan_id field since .lean() bypasses toJSON transform
        loans.forEach(loan => {
            loan.id = loan._id.toString();
            loan.loan_id = loan.loan_code;
        });

        // Fetch active manual loans
        const customersWithManualActiveLoans = await Customer.find({
            'manual_loan_details.loan_amount': { $exists: true, $ne: null }
        }).lean();

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const manualLoans = [];
        customersWithManualActiveLoans.forEach(cust => {
            if (cust.manual_loan_details) {
                const { emi_start_date, emi_end_date, loan_amount, emi_amount, interest_rate, loan_id, agreement_number } = cust.manual_loan_details;

                // Check if active
                let isActive = false;
                if (emi_start_date && emi_end_date) {
                    const start = new Date(emi_start_date);
                    const end = new Date(emi_end_date);
                    if (currentDate >= start && currentDate <= end) {
                        isActive = true;
                    }
                } else if (loan_amount) {
                    // Start or end date missing but has amount, assume active for safety or check flag?
                    // Let's assume active if not closed explicitly?
                    // Better to rely on dates as per dashboard logic
                    isActive = false; // Default false if dates missing
                }

                if (isActive) {
                    // Create object shape matching Loan schema for frontend
                    manualLoans.push({
                        _id: cust._id, // Use customer ID as key or create fake ID? Frontend uses _id for links
                        id: cust._id.toString(),
                        loan_id: loan_id || `MAN-${cust.customer_code}`,
                        loan_code: loan_id || `MAN-${cust.customer_code}`,
                        customer_id: {
                            _id: cust._id,
                            full_name: cust.full_name,
                            customer_code: cust.customer_code,
                            mobile_primary: cust.mobile_primary
                        },
                        principal_amount: loan_amount,
                        tenure_months: 12, // Placeholder or calculate
                        interest_rate: interest_rate || 0,
                        total_payable: (emi_amount && emi_start_date && emi_end_date)
                            ? emi_amount * ((new Date(emi_end_date).getFullYear() - new Date(emi_start_date).getFullYear()) * 12 + (new Date(emi_end_date).getMonth() - new Date(emi_start_date).getMonth()))
                            : loan_amount,
                        status: 'active',
                        start_date: emi_start_date,
                        first_emi_date: emi_start_date, // Critical for calculations
                        installment_amount: emi_amount, // Critical for ledger
                        interest_type: 'flat', // Default for manual loans
                        next_payment_date: new Date(), // Placeholder
                        is_manual: true // Flag for frontend if needed
                    });
                }
            }
        });

        res.json([...loans, ...manualLoans]);
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

// Completed loans report
router.get('/completed-loans', async (req, res) => {
    try {
        const loans = await Loan.find({ status: { $in: ['completed', 'closed'] } })
            .populate('customer_id', 'full_name mobile_primary customer_code')
            .populate('product_id', 'product_code brand model')
            .sort({ updated_at: -1 })
            .lean();

        // Manually add loan_id field since .lean() bypasses toJSON transform
        loans.forEach(loan => {
            loan.id = loan._id.toString();
            loan.loan_id = loan.loan_code;
        });

        // Fetch completed manual loans
        const customersWithManualLoans = await Customer.find({
            'manual_loan_details.loan_amount': { $exists: true, $ne: null }
        }).lean();

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const manualLoans = [];
        customersWithManualLoans.forEach(cust => {
            if (cust.manual_loan_details) {
                const { emi_start_date, emi_end_date, loan_amount, emi_amount, interest_rate, loan_id } = cust.manual_loan_details;

                // Check if completed (past end date)
                let isCompleted = false;
                if (emi_end_date) {
                    const end = new Date(emi_end_date);
                    if (currentDate > end) {
                        isCompleted = true;
                    }
                }

                if (isCompleted) {
                    manualLoans.push({
                        _id: cust._id,
                        id: cust._id.toString(),
                        loan_id: loan_id || `MAN-${cust.customer_code}`,
                        loan_code: loan_id || `MAN-${cust.customer_code}`,
                        customer_id: {
                            _id: cust._id,
                            full_name: cust.full_name,
                            customer_code: cust.customer_code,
                            mobile_primary: cust.mobile_primary
                        },
                        principal_amount: loan_amount,
                        tenure_months: 12, // Placeholder
                        interest_rate: interest_rate || 0,
                        total_payable: (emi_amount && emi_start_date && emi_end_date)
                            ? emi_amount * ((new Date(emi_end_date).getFullYear() - new Date(emi_start_date).getFullYear()) * 12 + (new Date(emi_end_date).getMonth() - new Date(emi_start_date).getMonth()))
                            : loan_amount,
                        status: 'completed',
                        start_date: emi_start_date,
                        first_emi_date: emi_start_date,
                        installment_amount: emi_amount,
                        interest_type: 'flat',
                        updated_at: emi_end_date, // Use end date as completion date
                        request_date: emi_end_date, // Use end date as completion date
                        is_manual: true
                    });
                }
            }
        });

        res.json([...loans, ...manualLoans]);
    } catch (err) {
        console.error('Error fetching completed loans:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
