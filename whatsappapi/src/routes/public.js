const express = require('express');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const Template = require('../models/Template');
const MessageLog = require('../models/MessageLog');
const waMgr = require('../services/whatsappManager');

const router = express.Router();
router.use(apiKeyAuth);

async function resolveChatId(client, phone) {
    const digits = phone.replace(/\D/g, '');
    const numberId = await client.getNumberId(digits);
    if (!numberId) throw new Error(`Phone number ${digits} is not registered on WhatsApp`);
    return numberId._serialized;
}

// POST /api/public/send
router.post('/send', async (req, res) => {
    const { to, message } = req.body;
    if (!to || !message) return res.status(400).json({ success: false, message: 'to and message are required' });

    // Lazily boot or wait for the client
    const client = await waMgr.ensureClientReady(req.user._id.toString()).catch(() => null);
    if (!client) return res.status(503).json({ success: false, message: 'WhatsApp not connected or failed to initialize for this account.' });

    let status = 'sent', error = null;
    try {
        const chatId = await resolveChatId(client, to);
        await client.sendMessage(chatId, message);
    } catch (err) {
        status = 'failed';
        error = err.message;
        console.error('Public send error:', err.message);
    }

    await MessageLog.create({ userId: req.user._id, to, body: message, mode: 'api', status, error, source: 'api' });

    if (status === 'failed') return res.status(500).json({ success: false, message: `Failed to send: ${error}` });
    res.json({ success: true, message: 'Message sent' });
});

// POST /api/public/send-template
router.post('/send-template', async (req, res) => {
    const { to, templateName, templateId, variables } = req.body;
    if (!to || (!templateName && !templateId)) return res.status(400).json({ success: false, message: 'to and templateName (or templateId) are required' });

    let template;
    if (templateId) template = await Template.findOne({ _id: templateId, userId: req.user._id });
    else template = await Template.findOne({ name: templateName, userId: req.user._id });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

    // Lazily boot or wait for the client
    const client = await waMgr.ensureClientReady(req.user._id.toString()).catch(() => null);
    if (!client) return res.status(503).json({ success: false, message: 'WhatsApp not connected or failed to initialize for this account.' });

    const filled = waMgr.fillTemplate(template.body, variables || {});
    let status = 'sent', error = null;
    try {
        const chatId = await resolveChatId(client, to);
        await client.sendMessage(chatId, filled);
    } catch (err) {
        status = 'failed';
        error = err.message;
        console.error('Public send-template error:', err.message);
    }

    await MessageLog.create({ userId: req.user._id, to, body: filled, mode: 'api', templateId: template._id, templateName: template.name, status, error, source: 'api' });

    if (status === 'failed') return res.status(500).json({ success: false, message: `Failed to send: ${error}` });
    res.json({ success: true, message: 'Template message sent', sentBody: filled });
});

module.exports = router;
