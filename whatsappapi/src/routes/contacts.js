const express = require('express');
const authMiddleware = require('../middleware/auth');
const Contact = require('../models/Contact');
const waMgr = require('../services/whatsappManager');

const router = express.Router();
router.use(authMiddleware);

function encodeChatId(chatId) { return Buffer.from(chatId).toString('base64url'); }
function decodeChatId(enc) { return Buffer.from(enc, 'base64url').toString('utf8'); }

// ── GET /api/contacts/:chatIdEnc  — get or auto-create contact record ─────────
router.get('/:chatIdEnc', async (req, res) => {
    try {
        const chatId = decodeChatId(req.params.chatIdEnc);
        const phone = chatId.replace(/@.*$/, '');
        const isGroup = chatId.endsWith('@g.us');

        let contact = await Contact.findOne({ userId: req.user._id, chatId });

        // Auto-create stub if not exists
        if (!contact) {
            contact = await Contact.create({
                userId: req.user._id,
                chatId,
                contactPhone: phone,
                isGroup,
            });
        }

        // Auto-fetch live profile from WhatsApp (max once per 10 minutes)
        const stale = !contact.lastFetched ||
            (Date.now() - new Date(contact.lastFetched).getTime() > 10 * 60 * 1000);

        if (stale) {
            const client = waMgr.getClient(req.user._id.toString());
            if (client) {
                try {
                    const waContact = await client.getContactById(chatId);
                    const picUrl = await waContact.getProfilePicUrl().catch(() => null);

                    contact.waName = waContact.pushname || waContact.name || null;
                    contact.about = waContact.statusMessage || null;
                    contact.profilePicUrl = picUrl || contact.profilePicUrl;
                    contact.lastFetched = new Date();
                    if (!contact.displayName) contact.displayName = contact.waName;
                    await contact.save();
                } catch (_) { /* WhatsApp fetch failed silently */ }
            }
        }

        res.json({ success: true, contact });
    } catch (err) {
        console.error('Get contact error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── PUT /api/contacts/:chatIdEnc  — update displayName, phone, or notes ───────
router.put('/:chatIdEnc', async (req, res) => {
    try {
        const oldChatId = decodeChatId(req.params.chatIdEnc);
        const { displayName, notes, contactPhone, labels } = req.body;

        let contact = await Contact.findOne({ userId: req.user._id, chatId: oldChatId });
        if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });

        if (displayName !== undefined) contact.displayName = displayName;
        if (notes !== undefined) contact.notes = notes;
        if (labels !== undefined) contact.labels = labels;

        // If phone changed, we update contactPhone AND chatId so it stays linked to WhatsApp correctly
        if (contactPhone && contactPhone !== contact.contactPhone) {
            const newChatId = contact.isGroup ? `${contactPhone}@g.us` : `${contactPhone}@c.us`;

            // Ensure no collision with existing
            const existing = await Contact.findOne({ userId: req.user._id, chatId: newChatId });
            if (existing && existing._id.toString() !== contact._id.toString()) {
                return res.status(400).json({ success: false, message: 'A contact with this phone number already exists' });
            }

            contact.contactPhone = contactPhone;
            contact.chatId = newChatId;
        }

        await contact.save();
        res.json({ success: true, contact });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── POST /api/contacts/:chatIdEnc/labels  — add a label ─────────────────────
router.post('/:chatIdEnc/labels', async (req, res) => {
    try {
        const chatId = decodeChatId(req.params.chatIdEnc);
        const { name, color } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'name required' });

        // Remove existing label with same name, then push new
        const contact = await Contact.findOneAndUpdate(
            { userId: req.user._id, chatId },
            {
                $pull: { labels: { name } },              // remove old if exists
            },
            { new: true, upsert: true }
        );
        contact.labels.push({ name, color: color || '#6c47ff' });
        await contact.save();

        res.json({ success: true, contact });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── DELETE /api/contacts/:chatIdEnc/labels/:labelName  — remove a label ──────
router.delete('/:chatIdEnc/labels/:labelName', async (req, res) => {
    try {
        const chatId = decodeChatId(req.params.chatIdEnc);
        const labelName = decodeURIComponent(req.params.labelName);

        const contact = await Contact.findOneAndUpdate(
            { userId: req.user._id, chatId },
            { $pull: { labels: { name: labelName } } },
            { new: true }
        );
        res.json({ success: true, contact });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET /api/contacts/labels/all  — all unique labels used by this user ──────
router.get('/labels/all', async (req, res) => {
    try {
        const contacts = await Contact.find({ userId: req.user._id, 'labels.0': { $exists: true } })
            .select('labels').lean();

        const labelMap = {};
        contacts.forEach(c => c.labels.forEach(l => { labelMap[l.name] = l.color; }));
        const labels = Object.entries(labelMap).map(([name, color]) => ({ name, color }));

        res.json({ success: true, labels });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET /api/contacts/filter/:labelName  — chats with a specific label ───────
router.get('/filter/:labelName', async (req, res) => {
    try {
        const labelName = decodeURIComponent(req.params.labelName);
        const contacts = await Contact.find({
            userId: req.user._id,
            'labels.name': labelName,
        }).lean();

        res.json({ success: true, chatIds: contacts.map(c => c.chatId) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET /api/contacts  — list all contacts (with optional search) ─────────
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const search = req.query.search ? req.query.search.trim() : '';
        const skip = (page - 1) * limit;

        const filter = { userId: req.user._id };
        if (search) {
            filter.$or = [
                { displayName: { $regex: search, $options: 'i' } },
                { waName: { $regex: search, $options: 'i' } },
                { contactPhone: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Contact.countDocuments(filter);
        const contacts = await Contact.find(filter)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.json({ success: true, contacts, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── POST /api/contacts/sync  — sync all contacts from WhatsApp ────────
router.post('/sync', async (req, res) => {
    try {
        const client = waMgr.getClient(req.user._id.toString());
        if (!client) {
            return res.status(400).json({ success: false, message: 'WhatsApp client not connected' });
        }

        const waContacts = await client.getContacts();
        let syncedCount = 0;

        const bulkOps = [];
        for (const conn of waContacts) {
            if (!conn.id || !conn.id._serialized) continue;

            const chatId = conn.id._serialized;
            const phone = chatId.replace(/@.*$/, '');

            // Only allow +91 followed by exactly 10 digits
            if (!/^91\d{10}$/.test(phone)) continue;

            const isGroup = conn.isGroup || chatId.endsWith('@g.us');
            const waName = conn.pushname || conn.name || null;

            bulkOps.push({
                updateOne: {
                    filter: { userId: req.user._id, chatId },
                    update: {
                        $set: {
                            contactPhone: phone,
                            isGroup,
                            ...(waName && { waName })
                        },
                        $setOnInsert: {
                            userId: req.user._id,
                            chatId
                        }
                    },
                    upsert: true
                }
            });
            syncedCount++;
        }

        if (bulkOps.length > 0) {
            await Contact.bulkWrite(bulkOps);
        }

        // Clean up any existing contacts that do not match the +91 format
        const deleted = await Contact.deleteMany({
            userId: req.user._id,
            contactPhone: { $not: /^91\d{10}$/ }
        });

        res.json({ success: true, message: `Synced ${syncedCount} contacts. Removed ${deleted.deletedCount} non-Indian numbers.`, count: syncedCount });
    } catch (err) {
        console.error('Sync contacts error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── DELETE /api/contacts/clean  — remove all invalid (non-Indian) contacts ────
router.delete('/clean', async (req, res) => {
    try {
        const result = await Contact.deleteMany({
            userId: req.user._id,
            contactPhone: { $not: /^91\d{10}$/ }
        });
        res.json({ success: true, deleted: result.deletedCount });
    } catch (err) {
        console.error('Clean contacts error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── DELETE /api/contacts/:chatIdEnc  — delete a contact entirely ──────────────
router.delete('/:chatIdEnc', async (req, res) => {
    try {
        const chatId = decodeChatId(req.params.chatIdEnc);
        await Contact.findOneAndDelete({ userId: req.user._id, chatId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
