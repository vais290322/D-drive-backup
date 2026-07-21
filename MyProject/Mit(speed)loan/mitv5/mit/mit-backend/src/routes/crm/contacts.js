const express = require('express');
const Contact = require('../../models/crm/Contact');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Get all contacts with company data
router.get('/', authenticate, async (req, res) => {
    try {
        const contacts = await Contact.find()
            .populate('company_id')
            .sort({ created_at: -1 })
            .lean();

        // Transform to match frontend expected format
        const transformed = contacts.map(c => ({
            ...c,
            company: c.company_id,
            company_id: c.company_id?._id
        }));

        return res.json(transformed);
    } catch (err) {
        console.error('Get contacts error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get contact by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id)
            .populate('company_id')
            .lean();

        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        // Transform to match frontend expected format
        const transformed = {
            ...contact,
            company: contact.company_id,
            company_id: contact.company_id?._id
        };

        return res.json(transformed);
    } catch (err) {
        console.error('Get contact error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get contacts by company
router.get('/company/:companyId', authenticate, async (req, res) => {
    try {
        const contacts = await Contact.find({ company_id: req.params.companyId })
            .sort({ created_at: -1 })
            .lean();

        return res.json(contacts);
    } catch (err) {
        console.error('Get contacts by company error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create contact
router.post('/', authenticate, async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        const populated = await Contact.findById(contact._id).populate('company_id').lean();

        // Transform to match frontend expected format
        const transformed = {
            ...populated,
            company: populated.company_id,
            company_id: populated.company_id?._id
        };

        return res.status(201).json(transformed);
    } catch (err) {
        console.error('Create contact error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Update contact
router.put('/:id', authenticate, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: new Date() },
            { new: true, runValidators: true }
        ).populate('company_id').lean();

        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        // Transform to match frontend expected format
        const transformed = {
            ...contact,
            company: contact.company_id,
            company_id: contact.company_id?._id
        };

        return res.json(transformed);
    } catch (err) {
        console.error('Update contact error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

// Delete contact
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        return res.json({ success: true, message: 'Contact deleted successfully' });
    } catch (err) {
        console.error('Delete contact error:', err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
});

module.exports = router;
