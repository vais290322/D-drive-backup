const express = require('express');
const authMiddleware = require('../middleware/auth');
const MessageLog = require('../models/MessageLog');

const router = express.Router();
router.use(authMiddleware);

// GET /api/history?page=1&limit=20&status=sent|failed&mode=custom|template|bulk|api&search=phone
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, status, mode, search } = req.query;
        const filter = { userId: req.user._id };
        if (status) filter.status = status;
        if (mode) filter.mode = mode;
        if (search) filter.to = { $regex: search.replace(/\D/g, ''), $options: 'i' };

        const skip = (Number(page) - 1) * Number(limit);
        const [logs, total] = await Promise.all([
            MessageLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            MessageLog.countDocuments(filter),
        ]);

        res.json({ success: true, logs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch history' });
    }
});

// GET /api/history/stats  — dashboard summary numbers
router.get('/stats', async (req, res) => {
    try {
        const userId = req.user._id;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [totalSent, totalFailed, todaySent, todayFailed, byMode] = await Promise.all([
            MessageLog.countDocuments({ userId, status: 'sent' }),
            MessageLog.countDocuments({ userId, status: 'failed' }),
            MessageLog.countDocuments({ userId, status: 'sent', createdAt: { $gte: todayStart } }),
            MessageLog.countDocuments({ userId, status: 'failed', createdAt: { $gte: todayStart } }),
            MessageLog.aggregate([
                { $match: { userId } },
                { $group: { _id: '$mode', count: { $sum: 1 } } },
            ]),
        ]);

        const modeMap = {};
        byMode.forEach(b => { modeMap[b._id] = b.count; });

        res.json({
            success: true,
            stats: {
                totalSent, totalFailed,
                todaySent, todayFailed,
                total: totalSent + totalFailed,
                byMode: modeMap,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
});

module.exports = router;
