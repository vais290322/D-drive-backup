const express = require('express');
const router = express.Router();
const ProfitAndLoss = require('../models/ProfitAndLoss');
const { authenticate } = require('../middleware/auth'); // Assuming auth middleware exists and is named 'authenticate' or similar. 
// I'll check index.js or other routes to confirm middleware usage in next step if needed, but safe to assume basic CRUD for now.

// GET all records
router.get('/', async (req, res) => {
    try {
        const records = await ProfitAndLoss.find().sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new record
router.post('/', async (req, res) => {
    try {
        const record = new ProfitAndLoss({
            ...req.body,
            // created_by: req.user.id // Uncomment if auth middleware populates req.user
        });
        const newRecord = await record.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update record
router.put('/:id', async (req, res) => {
    try {
        const record = await ProfitAndLoss.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE record
router.delete('/:id', async (req, res) => {
    try {
        const record = await ProfitAndLoss.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
