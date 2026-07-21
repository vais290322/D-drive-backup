const express = require('express');
const authMiddleware = require('../middleware/auth');
const Template = require('../models/Template');

const router = express.Router();

router.use(authMiddleware);

// GET /api/templates
router.get('/', async (req, res) => {
    try {
        const templates = await Template.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, templates });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch templates' });
    }
});

// POST /api/templates
router.post('/', async (req, res) => {
    try {
        const { name, body } = req.body;
        if (!name || !body) {
            return res.status(400).json({ success: false, message: 'Name and body are required' });
        }

        const template = await Template.create({ userId: req.user._id, name, body });
        res.status(201).json({ success: true, template });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create template' });
    }
});

// PUT /api/templates/:id
router.put('/:id', async (req, res) => {
    try {
        const { name, body } = req.body;
        const template = await Template.findOne({ _id: req.params.id, userId: req.user._id });
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        if (name) template.name = name;
        if (body) template.body = body;
        await template.save();

        res.json({ success: true, template });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update template' });
    }
});

// DELETE /api/templates/:id
router.delete('/:id', async (req, res) => {
    try {
        const template = await Template.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }
        res.json({ success: true, message: 'Template deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete template' });
    }
});

module.exports = router;
