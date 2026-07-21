const express = require('express');
const authMiddleware = require('../middleware/auth');
const InboxMessage = require('../models/InboxMessage');
const waMgr = require('../services/whatsappManager');
const { downloadAndSaveMedia } = require('../services/mediaHelper');


const router = express.Router();
router.use(authMiddleware);

// ── Helper: decode chatId from URL-safe base64 ─────────────────────────────
function encodeChatId(chatId) { return Buffer.from(chatId).toString('base64url'); }
function decodeChatId(enc) { return Buffer.from(enc, 'base64url').toString('utf8'); }

// GET /api/inbox/chats  — conversation list with last message per chat
router.get('/chats', async (req, res) => {
    try {
        const pipeline = [
            { $match: { userId: req.user._id } },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: '$chatId',
                    lastMessage: { $first: '$body' },
                    lastTime: { $first: '$timestamp' },
                    lastDir: { $first: '$direction' },
                    contactName: { $first: '$contactName' },
                    contactPhone: { $first: '$contactPhone' },
                    isGroup: { $first: '$isGroup' },
                    unread: {
                        $sum: {
                            $cond: [{ $eq: ['$direction', 'received'] }, 1, 0],
                        },
                    },
                },
            },
            { $sort: { lastTime: -1 } },
        ];

        const chats = await InboxMessage.aggregate(pipeline);
        const result = chats.map(c => ({
            chatId: c._id,
            chatIdEnc: encodeChatId(c._id),
            contactName: c.contactName || c.contactPhone || c._id.replace('@c.us', '').replace('@g.us', ''),
            contactPhone: c.contactPhone,
            lastMessage: c.lastMessage,
            lastTime: c.lastTime,
            lastDir: c.lastDir,
            isGroup: c.isGroup,
        }));

        res.json({ success: true, chats: result });
    } catch (err) {
        console.error('Inbox chats error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch chats' });
    }
});

// GET /api/inbox/chats/:chatIdEnc/messages?page=1&limit=50
router.get('/chats/:chatIdEnc/messages', async (req, res) => {
    try {
        const chatId = decodeChatId(req.params.chatIdEnc);
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 50);
        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            InboxMessage.find({ userId: req.user._id, chatId })
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            InboxMessage.countDocuments({ userId: req.user._id, chatId }),
        ]);

        const contact = messages.length ? {
            name: messages[0].contactName || messages[0].contactPhone,
            phone: messages[0].contactPhone,
            isGroup: messages[0].isGroup,
        } : {};

        res.json({
            success: true,
            chatId,
            contact,
            messages: messages.reverse(), // chronological order
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error('Inbox messages error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
});

// POST /api/inbox/chats/:chatIdEnc/send — send from the inbox chat view
router.post('/chats/:chatIdEnc/send', async (req, res) => {
    try {
        const chatId = decodeChatId(req.params.chatIdEnc);
        const { message } = req.body;
        if (!message) return res.status(400).json({ success: false, message: 'message is required' });

        const client = waMgr.getClient(req.user._id.toString());
        if (!client) return res.status(503).json({ success: false, message: 'WhatsApp not connected.' });

        const sentMsg = await client.sendMessage(chatId, message);

        // Log sent message to inbox
        const phone = chatId.replace('@c.us', '').replace('@g.us', '');
        await InboxMessage.create({
            userId: req.user._id,
            chatId,
            contactName: null,
            contactPhone: phone,
            body: message,
            direction: 'sent',
            waMessageId: sentMsg.id?.id || null,
            timestamp: new Date(),
            isGroup: chatId.endsWith('@g.us'),
        });

        res.json({ success: true, message: 'Sent' });
    } catch (err) {
        console.error('Inbox send error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/inbox/chats/:chatIdEnc/poll?since=<iso>  — lightweight poll for new messages
router.get('/chats/:chatIdEnc/poll', async (req, res) => {
    try {
        const chatId = decodeChatId(req.params.chatIdEnc);
        const since = req.query.since ? new Date(req.query.since) : new Date(0);

        const messages = await InboxMessage.find({
            userId: req.user._id,
            chatId,
            timestamp: { $gt: since },
        })
            .sort({ timestamp: 1 })
            .limit(50)
            .lean();

        res.json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Poll failed' });
    }
});

// DELETE /api/inbox/chats/:chatIdEnc  — clear chat history (local DB only)
router.delete('/chats/:chatIdEnc', async (req, res) => {
    try {
        const chatId = decodeChatId(req.params.chatIdEnc);
        const result = await InboxMessage.deleteMany({ userId: req.user._id, chatId });
        res.json({ success: true, deleted: result.deletedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to clear chat' });
    }
});

// ── Sync State (in-memory per user) ────────────────────────────────────────
const syncState = new Map();  // userId -> { running, progress, total, saved, done, error }

// GET /api/inbox/sync/status
router.get('/sync/status', (req, res) => {
    const uid = req.user._id.toString();
    const state = syncState.get(uid) || { running: false, done: false };
    res.json({ success: true, ...state });
});

// POST /api/inbox/sync  — load ALL historical messages from WhatsApp
router.post('/sync', async (req, res) => {
    const uid = req.user._id.toString();

    // Don't double-run
    if (syncState.get(uid)?.running) {
        return res.json({ success: true, message: 'Sync already in progress', ...syncState.get(uid) });
    }

    const client = waMgr.getClient(uid);
    if (!client) {
        return res.status(503).json({ success: false, message: 'WhatsApp not connected. Please connect first.' });
    }

    const msgLimit = Math.min(parseInt(req.body?.limit) || 100, 500); // per-chat limit

    syncState.set(uid, { running: true, done: false, progress: 0, total: 0, saved: 0, skipped: 0, error: null });

    // Respond immediately — sync runs in background
    res.json({ success: true, message: 'Sync started', limit: msgLimit });

    // ── Background sync ──────────────────────────────────────────
    (async () => {
        try {
            console.log(`[Sync] Starting for user ${uid} (${msgLimit} msgs/chat)`);
            const chats = await client.getChats();

            const state = syncState.get(uid);
            state.total = chats.length;
            console.log(`[Sync] ${chats.length} chats found`);

            for (let i = 0; i < chats.length; i++) {
                const chat = chats[i];
                state.progress = i + 1;

                try {
                    const messages = await chat.fetchMessages({ limit: msgLimit });

                    for (const msg of messages) {
                        // Skip system/empty messages
                        if (msg.type === 'e2e_notification' || msg.type === 'notification_template') continue;
                        if (!msg.body && !msg.hasMedia && !msg.type) continue;

                        // Dedup check
                        const exists = await InboxMessage.exists({ userId: req.user._id, waMessageId: msg.id.id });
                        if (exists) { state.skipped++; continue; }

                        const contactInfo = chat.isGroup
                            ? { name: chat.name, phone: chat.id.user }
                            : { name: chat.name || null, phone: chat.id.user };

                        // Download media if present
                        let mediaData = { hasMedia: false, mediaType: null, mediaUrl: null, mimeType: null, caption: null, fileName: null };
                        if (msg.hasMedia) {
                            mediaData = await downloadAndSaveMedia(msg, uid);
                        }

                        await InboxMessage.create({
                            userId: req.user._id,
                            chatId: chat.id._serialized,
                            contactName: contactInfo.name,
                            contactPhone: contactInfo.phone,
                            body: msg.body || mediaData.caption || '',
                            direction: msg.fromMe ? 'sent' : 'received',
                            waMessageId: msg.id.id,
                            timestamp: new Date(msg.timestamp * 1000),
                            isGroup: chat.isGroup,
                            ...mediaData,
                        });
                        state.saved++;
                    }
                } catch (chatErr) {
                    console.warn(`[Sync] Skip chat ${chat.id._serialized}: ${chatErr.message}`);
                }
            }

            state.running = false;
            state.done = true;
            console.log(`[Sync] Done for ${uid}: ${state.saved} saved, ${state.skipped} already existed`);
        } catch (err) {
            const state = syncState.get(uid);
            if (state) { state.running = false; state.done = true; state.error = err.message; }
            console.error(`[Sync] Error for ${uid}:`, err.message);
        }
    })();
});

module.exports = router;

