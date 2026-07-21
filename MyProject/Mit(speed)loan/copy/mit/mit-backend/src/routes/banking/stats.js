const express = require('express');
const BankCustomer = require('../../models/banking/BankCustomer');
const BankAccount = require('../../models/banking/BankAccount');
const BankTransaction = require('../../models/banking/BankTransaction');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Get banking dashboard statistics
router.get('/', authenticate, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [customers, accounts, transactions] = await Promise.all([
            BankCustomer.countDocuments(),
            BankAccount.find().lean(),
            BankTransaction.find({ transaction_date: { $gte: today } }).lean()
        ]);

        const activeAccounts = accounts.filter(a => a.status === 'active');
        const totalBalance = activeAccounts.reduce((sum, a) => sum + Number(a.balance || 0), 0);

        const depositsToday = transactions
            .filter(t => t.transaction_type === 'deposit')
            .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        const withdrawalsToday = transactions
            .filter(t => t.transaction_type === 'withdrawal')
            .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        return res.json({
            total_customers: customers,
            total_accounts: accounts.length,
            active_accounts: activeAccounts.length,
            total_deposits_today: depositsToday,
            total_withdrawals_today: withdrawalsToday,
            total_balance: totalBalance,
            total_transactions_today: transactions.length
        });
    } catch (err) {
        console.error('Get banking stats error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get daily transaction summary
router.get('/daily-summary', authenticate, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start and end dates are required' });
        }

        const transactions = await BankTransaction.find({
            transaction_date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).lean();

        // Group by date
        const summaryMap = new Map();

        transactions.forEach((t) => {
            const date = new Date(t.transaction_date).toISOString().split('T')[0];
            const existing = summaryMap.get(date) || {
                date,
                total_deposits: 0,
                total_withdrawals: 0,
                transaction_count: 0,
                net_change: 0
            };

            if (t.transaction_type === 'deposit') {
                existing.total_deposits += Number(t.amount || 0);
            } else {
                existing.total_withdrawals += Number(t.amount || 0);
            }

            existing.transaction_count += 1;
            existing.net_change = existing.total_deposits - existing.total_withdrawals;

            summaryMap.set(date, existing);
        });

        return res.json(Array.from(summaryMap.values()));
    } catch (err) {
        console.error('Get daily summary error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get customer balance summary
router.get('/customer-balance', authenticate, async (req, res) => {
    try {
        const accounts = await BankAccount.find().lean();

        const summaries = await Promise.all(
            accounts.map(async (account) => {
                const customer = await BankCustomer.findById(account.customer_id).lean();
                if (!customer) return null;

                const transactions = await BankTransaction.find({ account_id: account._id })
                    .sort({ transaction_date: -1 })
                    .limit(1)
                    .lean();

                return {
                    customer_id: customer._id,
                    customer_name: customer.full_name,
                    account_number: account.account_number,
                    balance: Number(account.balance || 0),
                    last_transaction_date: transactions[0]?.transaction_date || null
                };
            })
        );

        // Filter out nulls and sort by balance
        const filtered = summaries.filter(s => s !== null);
        filtered.sort((a, b) => b.balance - a.balance);

        return res.json(filtered);
    } catch (err) {
        console.error('Get customer balance summary error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
