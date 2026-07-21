const express = require('express');
const BankAccount = require('../../models/banking/BankAccount');
const BankCustomer = require('../../models/banking/BankCustomer');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Get all bank accounts with customer data
router.get('/', authenticate, async (req, res) => {
    try {
        const accounts = await BankAccount.find()
            .sort({ created_at: -1 })
            .lean();

        // Get customer for each account
        const accountsWithCustomer = await Promise.all(
            accounts.map(async (account) => {
                const customer = await BankCustomer.findById(account.customer_id).lean();
                return {
                    ...account,
                    customer
                };
            })
        );

        return res.json(accountsWithCustomer);
    } catch (err) {
        console.error('Get bank accounts error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get bank account by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const account = await BankAccount.findById(req.params.id).lean();
        if (!account) return res.status(404).json({ message: 'Account not found' });

        const customer = await BankCustomer.findById(account.customer_id).lean();

        return res.json({
            ...account,
            customer
        });
    } catch (err) {
        console.error('Get bank account error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get bank account by account number
router.get('/number/:accountNumber', authenticate, async (req, res) => {
    try {
        const account = await BankAccount.findOne({ account_number: req.params.accountNumber }).lean();
        if (!account) return res.status(404).json({ message: 'Account not found' });

        const customer = await BankCustomer.findById(account.customer_id).lean();

        return res.json({
            ...account,
            customer
        });
    } catch (err) {
        console.error('Get bank account by number error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get accounts by customer ID
router.get('/customer/:customerId', authenticate, async (req, res) => {
    try {
        const accounts = await BankAccount.find({ customer_id: req.params.customerId })
            .sort({ created_at: -1 })
            .lean();

        return res.json(accounts);
    } catch (err) {
        console.error('Get accounts by customer error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create bank account
router.post('/', authenticate, async (req, res) => {
    try {
        // Check if account number already exists
        const existing = await BankAccount.findOne({ account_number: req.body.account_number });
        if (existing) {
            return res.status(400).json({ message: 'Account number already exists' });
        }

        const account = await BankAccount.create(req.body);
        const customer = await BankCustomer.findById(account.customer_id).lean();

        return res.status(201).json({
            ...account.toObject(),
            customer
        });
    } catch (err) {
        console.error('Create bank account error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Update bank account
router.put('/:id', authenticate, async (req, res) => {
    try {
        const account = await BankAccount.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!account) return res.status(404).json({ message: 'Account not found' });

        const customer = await BankCustomer.findById(account.customer_id).lean();

        return res.json({
            ...account,
            customer
        });
    } catch (err) {
        console.error('Update bank account error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Delete bank account
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const account = await BankAccount.findByIdAndDelete(req.params.id);
        if (!account) return res.status(404).json({ message: 'Account not found' });

        return res.json({ success: true, message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete bank account error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

module.exports = router;
