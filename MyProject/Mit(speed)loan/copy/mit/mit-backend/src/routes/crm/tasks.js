const express = require('express');
const Task = require('../../models/crm/Task');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Get tasks with optional filters
router.get('/', authenticate, async (req, res) => {
    try {
        const { contactId, companyId, dealId, status } = req.query;

        const filter = {};
        if (contactId) filter.contact_id = contactId;
        if (companyId) filter.company_id = companyId;
        if (dealId) filter.deal_id = dealId;
        if (status) filter.status = status;

        const tasks = await Task.find(filter)
            .populate('contact_id')
            .populate('company_id')
            .populate('deal_id')
            .sort({ due_date: 1 })
            .lean();

        // Transform to match frontend expected format
        const transformed = tasks.map(t => ({
            ...t,
            contact: t.contact_id,
            company: t.company_id,
            deal: t.deal_id,
            contact_id: t.contact_id?._id,
            company_id: t.company_id?._id,
            deal_id: t.deal_id?._id
        }));

        return res.json(transformed);
    } catch (err) {
        console.error('Get tasks error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create task
router.post('/', authenticate, async (req, res) => {
    try {
        const task = await Task.create(req.body);
        const populated = await Task.findById(task._id)
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
        console.error('Create task error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Update task
router.put('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: new Date() },
            { new: true, runValidators: true }
        ).populate('contact_id').populate('company_id').populate('deal_id').lean();

        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Transform to match frontend expected format
        const transformed = {
            ...task,
            contact: task.contact_id,
            company: task.company_id,
            deal: task.deal_id,
            contact_id: task.contact_id?._id,
            company_id: task.company_id?._id,
            deal_id: task.deal_id?._id
        };

        return res.json(transformed);
    } catch (err) {
        console.error('Update task error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Mark task as complete
router.post('/:id/complete', authenticate, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                status: 'completed',
                completed_at: new Date(),
                updated_at: new Date()
            },
            { new: true, runValidators: true }
        ).populate('contact_id').populate('company_id').populate('deal_id').lean();

        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Transform to match frontend expected format
        const transformed = {
            ...task,
            contact: task.contact_id,
            company: task.company_id,
            deal: task.deal_id,
            contact_id: task.contact_id?._id,
            company_id: task.company_id?._id,
            deal_id: task.deal_id?._id
        };

        return res.json(transformed);
    } catch (err) {
        console.error('Complete task error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Delete task
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        return res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Delete task error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

module.exports = router;
