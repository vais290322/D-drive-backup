const express = require('express');
const authMiddleware = require('../middleware/auth');
const waMgr = require('../services/whatsappManager');

const router = express.Router();
router.use(authMiddleware);

// GET /api/whatsapp/status
router.get('/status', (req, res) => {
    const { status, error } = waMgr.getQRAndStatus(req.user._id.toString());
    res.json({ success: true, status, error });
});

// GET /api/whatsapp/qr  — triggers client init & returns current state
router.get('/qr', (req, res) => {
    const userId = req.user._id.toString();

    // If already ready, return immediately
    const existing = waMgr.getQRAndStatus(userId);
    if (existing.status === 'ready') {
        return res.json({ success: true, status: 'ready', qr: null, error: null });
    }

    // If error occurred, don't auto-restart — let user click retry
    if (existing.status === 'error') {
        return res.json({ success: true, status: 'error', qr: null, error: existing.error });
    }

    // Trigger client creation if not yet started
    waMgr.getOrCreateClient(userId);

    const { status, qr, error } = waMgr.getQRAndStatus(userId);
    res.json({ success: true, status, qr, error });
});

// POST /api/whatsapp/connect  — explicit connect/retry
router.post('/connect', async (req, res) => {
    const userId = req.user._id.toString();
    const current = waMgr.getQRAndStatus(userId);

    // If already running or ready, just return current state
    if (['initializing', 'qr', 'authenticated', 'ready'].includes(current.status)) {
        return res.json({ success: true, ...waMgr.getQRAndStatus(userId) });
    }

    // For error/disconnected, clean up and restart
    await waMgr.disconnect(userId);
    waMgr.getOrCreateClient(userId);

    const state = waMgr.getQRAndStatus(userId);
    res.json({ success: true, ...state });
});

// POST /api/whatsapp/disconnect
router.post('/disconnect', async (req, res) => {
    await waMgr.disconnect(req.user._id.toString());
    res.json({ success: true, message: 'WhatsApp disconnected' });
});

// POST /api/whatsapp/change-account — clears saved session so next connect shows a fresh QR
router.post('/change-account', async (req, res) => {
    try {
        await waMgr.logoutAndClearSession(req.user._id.toString());
        res.json({ success: true, message: 'Session cleared. Scan a new QR code to connect.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
