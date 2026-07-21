const express = require('express');
const Deal = require('../../models/crm/Deal');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Get all deals with relations
router.get('/', authenticate, async (req, res) => {
    try {
        const deals = await Deal.find()
            .populate('company_id')
            .populate('contact_id')
            .sort({ created_at: -1 })
            .lean();

        // Transform to match frontend expected format
        const transformed = deals.map(d => ({
            ...d,
            company: d.company_id,
            contact: d.contact_id,
            company_id: d.company_id?._id,
            contact_id: d.contact_id?._id
        }));

        return res.json(transformed);
    } catch (err) {
        console.error('Get deals error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get deal by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id)
            .populate('company_id')
            .populate('contact_id')
            .lean();

        if (!deal) return res.status(404).json({ message: 'Deal not found' });

        // Transform to match frontend expected format
        const transformed = {
            ...deal,
            company: deal.company_id,
            contact: deal.contact_id,
            company_id: deal.company_id?._id,
            contact_id: deal.contact_id?._id
        };

        return res.json(transformed);
    } catch (err) {
        console.error('Get deal error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get deals by stage
router.get('/stage/:stage', authenticate, async (req, res) => {
    try {
        const deals = await Deal.find({ stage: req.params.stage })
            .sort({ created_at: -1 })
            .lean();

        return res.json(deals);
    } catch (err) {
        console.error('Get deals by stage error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create deal
router.post('/', authenticate, async (req, res) => {
    try {
        const deal = await Deal.create(req.body);
        const populated = await Deal.findById(deal._id)
            .populate('company_id')
            .populate('contact_id')
            .lean();

        // Transform to match frontend expected format
        const transformed = {
            ...populated,
            company: populated.company_id,
            contact: populated.contact_id,
            company_id: populated.company_id?._id,
            contact_id: populated.contact_id?._id
        };

        return res.status(201).json(transformed);
    } catch (err) {
        console.error('Create deal error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Update deal
router.put('/:id', authenticate, async (req, res) => {
    try {
        const deal = await Deal.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: new Date() },
            { new: true, runValidators: true }
        ).populate('company_id').populate('contact_id').lean();

        if (!deal) return res.status(404).json({ message: 'Deal not found' });

        // Transform to match frontend expected format
        const transformed = {
            ...deal,
            company: deal.company_id,
            contact: deal.contact_id,
            company_id: deal.company_id?._id,
            contact_id: deal.contact_id?._id
        };

        return res.json(transformed);
    } catch (err) {
        console.error('Update deal error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Delete deal
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const deal = await Deal.findByIdAndDelete(req.params.id);
        if (!deal) return res.status(404).json({ message: 'Deal not found' });

        return res.json({ success: true, message: 'Deal deleted successfully' });
    } catch (err) {
        console.error('Delete deal error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

module.exports = router;
