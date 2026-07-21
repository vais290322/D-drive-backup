const express = require('express');
const Activity = require('../../models/crm/Activity');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Get activities with optional filters
router.get('/', authenticate, async (req, res) => {
    try {
        const { contactId, companyId, dealId } = req.query;

        const filter = {};
        if (contactId) filter.contact_id = contactId;
        if (companyId) filter.company_id = companyId;
        if (dealId) filter.deal_id = dealId;

        const activities = await Activity.find(filter)
            .populate('contact_id')
            .populate('company_id')
            .populate('deal_id')
            .sort({ activity_date: -1 })
            .lean();

        // Transform to match frontend expected format
        const transformed = activities.map(a => ({
            ...a,
            contact: a.contact_id,
            company: a.company_id,
            deal: a.deal_id,
            contact_id: a.contact_id?._id,
            company_id: a.company_id?._id,
            deal_id: a.deal_id?._id
        }));

        return res.json(transformed);
    } catch (err) {
        console.error('Get activities error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create activity
router.post('/', authenticate, async (req, res) => {
    try {
        const activity = await Activity.create(req.body);
        const populated = await Activity.findById(activity._id)
            .populate('contact_id')
            .populate('company_id')
            .populate('deal_id')
            .lean();

        // Transform to match frontend expected format
        const transformed = {
            ...populated,
            contact: populated.contact_id,
            company: populated.company_id,
            deal: populated.deal_id,
            contact_id: populated.contact_id?._id,
            company_id: populated.company_id?._id,
            deal_id: populated.deal_id?._id
        };

        return res.status(201).json(transformed);
    } catch (err) {
        console.error('Create activity error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Delete activity
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        return res.json({ success: true, message: 'Activity deleted successfully' });
    } catch (err) {
        console.error('Delete activity error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

module.exports = router;
