const express = require('express');
const BankTransaction = require('../../models/banking/BankTransaction');
const BankAccount = require('../../models/banking/BankAccount');
const BankCustomer = require('../../models/banking/BankCustomer');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Get all transactions with account/customer data
router.get('/', authenticate, async (req, res) => {
    try {
        const transactions = await BankTransaction.find()
            .sort({ transaction_date: -1 })
            .limit(100)
            .lean();

        // Get account and customer for each transaction
        const transactionsWithAccount = await Promise.all(
            transactions.map(async (txn) => {
                const account = await BankAccount.findById(txn.account_id).lean();
                if (account) {
                    const customer = await BankCustomer.findById(account.customer_id).lean();
                    return {
                        ...txn,
                        account: {
                            ...account,
                            customer
                        }
                    };
                }
                return txn;
            })
        );

        return res.json(transactionsWithAccount);
    } catch (err) {
        console.error('Get transactions error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get transactions by account ID
router.get('/account/:accountId', authenticate, async (req, res) => {
    try {
        const transactions = await BankTransaction.find({ account_id: req.params.accountId })
            .sort({ transaction_date: -1 })
            .lean();

        return res.json(transactions);
    } catch (err) {
        console.error('Get transactions by account error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Process deposit
router.post('/deposit', authenticate, async (req, res) => {
    try {
        const { account_id, amount, reference_note, created_by } = req.body;

        try {
            const fs = require('fs');
            fs.appendFileSync('debug_log.txt', `Deposit Request: ${JSON.stringify(req.body)}, User: ${req.user ? req.user.id : 'none'}\n`);
        } catch (e) { console.error(e); }

        if (!account_id || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        // Get account
        const account = await BankAccount.findById(account_id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.status !== 'active') {
            return res.status(400).json({ message: 'Account is not active' });
        }

        // Create transaction
        const transaction = await BankTransaction.create({
            account_id,
            transaction_type: 'deposit',
            amount,
            balance_before: account.balance,
            balance_after: account.balance + amount,
            reference_note,
            created_by: req.user ? req.user.id : undefined,
            transaction_date: new Date()
        });

        // Update account balance
        account.balance += amount;
        account.updated_at = new Date();
        await account.save();

        return res.status(201).json({
            success: true,
            transaction_id: transaction._id.toString(),
            new_balance: account.balance
        });
    } catch (err) {
        console.error('Process deposit error:', err);
        try {
            const fs = require('fs');
            fs.appendFileSync('debug_log.txt', `Deposit Error: ${err.message}\nStack: ${err.stack}\n`);
        } catch (logErr) {
            console.error('Logging failed', logErr);
        }
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Process withdrawal
router.post('/withdrawal', authenticate, async (req, res) => {
    try {
        const { account_id, amount, reference_note, created_by } = req.body;

        try {
            const fs = require('fs');
            fs.appendFileSync('debug_log.txt', `Withdrawal Request: ${JSON.stringify(req.body)}, User: ${req.user ? req.user.id : 'none'}\n`);
        } catch (e) { console.error(e); }

        if (!account_id || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        // Get account
        const account = await BankAccount.findById(account_id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.status !== 'active') {
            return res.status(400).json({ message: 'Account is not active' });
        }

        // Check sufficient balance - REMOVED to allow overdraft
        // if (account.balance < amount) {
        //     return res.status(400).json({ message: 'Insufficient balance' });
        // }

        // Create transaction
        const transaction = await BankTransaction.create({
            account_id,
            transaction_type: 'withdrawal',
            amount,
            balance_before: account.balance,
            balance_after: account.balance - amount,
            reference_note,
            created_by: req.user ? req.user.id : undefined,
            transaction_date: new Date()
        });

        // Update account balance
        account.balance -= amount;
        account.updated_at = new Date();
        await account.save();

        return res.status(201).json({
            success: true,
            transaction_id: transaction.transaction_id,
            new_balance: account.balance
        });
    } catch (err) {
        console.error('Process withdrawal error:', err);
        try {
            const fs = require('fs');
            fs.appendFileSync('debug_log.txt', `Withdrawal Error: ${err.message}\nStack: ${err.stack}\n`);
        } catch (logErr) {
            console.error('Logging failed', logErr);
        }
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

module.exports = router;
