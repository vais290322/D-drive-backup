const express = require('express');
const Company = require('../../models/crm/Company');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Get all companies
router.get('/', authenticate, async (req, res) => {
    try {
        const companies = await Company.find()
            .sort({ created_at: -1 })
            .lean();

        return res.json(companies);
    } catch (err) {
        console.error('Get companies error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get company by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).lean();
        if (!company) return res.status(404).json({ message: 'Company not found' });

        return res.json(company);
    } catch (err) {
        console.error('Get company error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create company
router.post('/', authenticate, async (req, res) => {
    try {
        const company = await Company.create(req.body);
        return res.status(201).json(company);
    } catch (err) {
        console.error('Create company error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Update company
router.put('/:id', authenticate, async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!company) return res.status(404).json({ message: 'Company not found' });

        return res.json(company);
    } catch (err) {
        console.error('Update company error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Delete company
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        return res.json({ success: true, message: 'Company deleted successfully' });
    } catch (err) {
        console.error('Delete company error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

module.exports = router;
