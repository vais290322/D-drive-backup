const express = require('express');
const authMiddleware = require('../middleware/auth');
const Template = require('../models/Template');
const MessageLog = require('../models/MessageLog');
const waMgr = require('../services/whatsappManager');

const router = express.Router();
router.use(authMiddleware);

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const phoneIdx = headers.indexOf('phone');
    if (phoneIdx === -1) throw new Error('CSV must have a "phone" column');
    return lines.slice(1).map((line, i) => {
        const cols = line.match(/(".*?"|[^,]+|(?<=,)(?=,)|(?<=,)$|^(?=,))/g) || [];
        const row = cols.map(c => c.replace(/^"|"$/g, '').trim());
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = row[idx] || ''; });
        obj._line = i + 2;
        return obj;
    }).filter(r => r.phone);
}

async function resolveChatId(client, phone) {
    const digits = phone.replace(/\D/g, '');
    const numberId = await client.getNumberId(digits);
    if (!numberId) throw new Error(`${digits} is not on WhatsApp`);
    return numberId._serialized;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

router.post('/bulk', async (req, res) => {
    const { csv, mode, message, templateId, delayMs = 2000 } = req.body;
    if (!csv) return res.status(400).json({ success: false, message: 'CSV data is required' });
    if (!['custom', 'template'].includes(mode)) return res.status(400).json({ success: false, message: 'mode must be "custom" or "template"' });

    // Lazily boot or wait for the client
    const client = await waMgr.ensureClientReady(req.user._id.toString()).catch(() => null);
    if (!client) return res.status(503).json({ success: false, message: 'WhatsApp not connected or failed to initialize for this account.' });

    let contacts;
    try { contacts = parseCSV(csv); } catch (err) { return res.status(400).json({ success: false, message: `CSV parse error: ${err.message}` }); }
    if (contacts.length === 0) return res.status(400).json({ success: false, message: 'No valid contacts in CSV' });
    if (contacts.length > 500) return res.status(400).json({ success: false, message: 'Maximum 500 contacts per batch' });

    let templateBody = null, tplDoc = null;
    if (mode === 'template') {
        if (!templateId) return res.status(400).json({ success: false, message: 'templateId is required' });
        tplDoc = await Template.findOne({ _id: templateId, userId: req.user._id });
        if (!tplDoc) return res.status(404).json({ success: false, message: 'Template not found' });
        templateBody = tplDoc.body;
    } else {
        if (!message) return res.status(400).json({ success: false, message: 'message is required for custom mode' });
    }

    const results = [];
    const delay = Math.max(500, Math.min(Number(delayMs) || 2000, 10000));
    const logsToInsert = [];

    for (const contact of contacts) {
        const { phone, _line, ...variables } = contact;
        const body = mode === 'template' ? waMgr.fillTemplate(templateBody, variables) : waMgr.fillTemplate(message, variables);
        let status = 'sent', error = null;
        try {
            const chatId = await resolveChatId(client, phone);
            await client.sendMessage(chatId, body);
        } catch (err) {
            status = 'failed';
            error = err.message;
        }
        results.push({ phone, status, error, line: _line });
        logsToInsert.push({ userId: req.user._id, to: phone, body, mode: 'bulk', templateId: tplDoc?._id || null, templateName: tplDoc?.name || null, status, error, source: 'dashboard' });
        if (contact !== contacts[contacts.length - 1]) await sleep(delay);
    }

    // Bulk-insert all logs once
    await MessageLog.insertMany(logsToInsert);

    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;
    res.json({ success: true, summary: { total: contacts.length, sent, failed }, results });
});

module.exports = router;
