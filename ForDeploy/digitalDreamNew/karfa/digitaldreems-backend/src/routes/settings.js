const express = require('express');
const BusinessSettings = require('../models/BusinessSettings');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Get business settings
router.get('/', authenticate, async (req, res) => {
    try {
        let settings = await BusinessSettings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = await BusinessSettings.create({
                company_name: 'Digital Dreems',
                tagline: 'Loan Management CRM'
            });
        }
        res.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update business settings
router.put('/', authenticate, async (req, res) => {
    try {
        let settings = await BusinessSettings.findOne();
        if (!settings) {
            settings = await BusinessSettings.create(req.body);
        } else {
            settings = await BusinessSettings.findByIdAndUpdate(
                settings._id,
                req.body,
                { new: true, runValidators: true }
            );
        }
        res.json(settings);
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
