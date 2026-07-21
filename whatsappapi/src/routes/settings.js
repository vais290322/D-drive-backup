const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// GET /api/settings/developer -> Get API Key, Webhook URL, Webhook Secret
router.get('/developer', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            apiKey: user.apiKey,
            webhookUrl: user.webhookUrl || '',
            webhookSecret: user.webhookSecret || ''
        });
    } catch (err) {
        console.error('[Settings] Error fetching developer settings:', err);
        res.status(500).json({ error: 'Server error fetching developer settings' });
    }
});

// PUT /api/settings/developer -> Update Webhook URL / Secret
router.put('/developer', auth, async (req, res) => {
    try {
        const { webhookUrl, webhookSecret } = req.body;
        const user = await User.findById(req.user.id);

        if (webhookUrl !== undefined) user.webhookUrl = webhookUrl.trim();
        if (webhookSecret !== undefined) user.webhookSecret = webhookSecret.trim();

        await user.save();

        res.json({
            message: 'Settings updated successfully',
            webhookUrl: user.webhookUrl,
            webhookSecret: user.webhookSecret
        });
    } catch (err) {
        console.error('[Settings] Error saving developer settings:', err);
        res.status(500).json({ error: 'Server error saving developer settings' });
    }
});

// POST /api/settings/developer/regenerate -> Generate a fresh API Key
router.post('/developer/regenerate', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.apiKey = uuidv4();
        await user.save();

        res.json({
            message: 'API Key regenerated successfully',
            apiKey: user.apiKey
        });
    } catch (err) {
        console.error('[Settings] Error regenerating API Key:', err);
        res.status(500).json({ error: 'Server error regenerating API Key' });
    }
});

module.exports = router;
