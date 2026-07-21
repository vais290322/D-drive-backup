const express = require('express');
const BankCustomer = require('../../models/banking/BankCustomer');
const BankAccount = require('../../models/banking/BankAccount');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Get all bank customers with accounts
router.get('/', authenticate, async (req, res) => {
    try {
        const customers = await BankCustomer.find()
            .sort({ created_at: -1 })
            .lean();

        // Get accounts for each customer
        const customersWithAccounts = await Promise.all(
            customers.map(async (customer) => {
                const accounts = await BankAccount.find({ customer_id: customer._id }).lean();
                return {
                    ...customer,
                    accounts
                };
            })
        );

        return res.json(customersWithAccounts);
    } catch (err) {
        console.error('Get bank customers error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get bank customer by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const customer = await BankCustomer.findById(req.params.id).lean();
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const accounts = await BankAccount.find({ customer_id: customer._id }).lean();

        return res.json({
            ...customer,
            accounts
        });
    } catch (err) {
        console.error('Get bank customer error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create bank customer
router.post('/', authenticate, async (req, res) => {
    try {
        const customer = await BankCustomer.create(req.body);
        return res.status(201).json({ ...customer.toObject(), accounts: [] });
    } catch (err) {
        console.error('Create bank customer error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Update bank customer
router.put('/:id', authenticate, async (req, res) => {
    try {
        const customer = await BankCustomer.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const accounts = await BankAccount.find({ customer_id: customer._id }).lean();

        return res.json({
            ...customer,
            accounts
        });
    } catch (err) {
        console.error('Update bank customer error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Delete bank customer
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const customer = await BankCustomer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        // Also delete associated accounts
        await BankAccount.deleteMany({ customer_id: req.params.id });

        return res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (err) {
        console.error('Delete bank customer error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

module.exports = router;
