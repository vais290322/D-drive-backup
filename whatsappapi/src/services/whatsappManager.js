const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const InboxMessage = require('../models/InboxMessage');
const User = require('../models/User'); // Import User model to fetch Webhook Secrets
const { downloadAndSaveMedia } = require('./mediaHelper');
const { dispatchWebhook } = require('./webhookEventDispatcher');

// ── Auto-detect Chrome/Chromium executable path ──────────────────────────────
function getChromePath() {
    // 1. Explicit env var always wins
    if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;

    const isWin = process.platform === 'win32';
    if (isWin) {
        const candidates = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
            'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
            'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        ];
        for (const c of candidates) {
            if (fs.existsSync(c)) {
                console.log(`[WhatsApp] Using browser: ${c}`);
                return c;
            }
        }
    } else {
        // Linux/macOS candidates
        const candidates = [
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/usr/local/bin/chromium',
        ];
        for (const c of candidates) {
            if (fs.existsSync(c)) {
                console.log(`[WhatsApp] Using browser: ${c}`);
                return c;
            }
        }
    }

    console.warn('[WhatsApp] ⚠️  No Chrome/Chromium found. Set PUPPETEER_EXECUTABLE_PATH in .env');
    return undefined;
}

const clients = new Map(); // Store connected sessions
const loggedOutUsers = new Set(); // Users who intentionally logged out — skip auto-reconnect
let socketIo = null;

function setSocketIO(io) {
    socketIo = io;
}

const INIT_TIMEOUT_MS = 90_000;

function notifyStatus(userId, status, payload = {}) {
    if (socketIo) {
        socketIo.to(userId).emit('whatsapp_status', { status, ...payload });
    }
}

function getOrCreateClient(userId) {
    if (clients.has(userId)) return clients.get(userId);

    const session = {
        client: null,
        qr: null,
        status: 'initializing',
        error: null,
        initTimer: null,
    };

    const client = new Client({
        authStrategy: new LocalAuth({ clientId: `session-${userId}` }),
        puppeteer: {
            headless: true,
            executablePath: getChromePath(),
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-zygote',
                '--disable-extensions',
                '--disable-background-networking',
                '--disable-features=VizDisplayCompositor',
                '--disable-breakpad',
                '--disable-software-rasterizer',
            ],
        },
        restartOnAuthFail: true,
    });

    session.initTimer = setTimeout(() => {
        if (session.status === 'initializing' || session.status === 'qr') {
            const hint = process.platform === 'win32'
                ? 'Make sure Google Chrome is installed at the default location, or set PUPPETEER_EXECUTABLE_PATH in .env'
                : 'Check if Chromium dependencies are installed: sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2';
            console.error(`[WhatsApp] Init timeout for user ${userId}. ${hint}`);
            session.status = 'error';
            session.error = 'Connection timed out. Please check server logs for dependency issues.';
            notifyStatus(userId, 'error', { error: session.error });
            _destroyClient(userId).catch(() => { });
        }
    }, INIT_TIMEOUT_MS);

    client.on('qr', async (qr) => {
        try {
            session.qr = await qrcode.toDataURL(qr);
            session.status = 'qr';
            session.error = null;
            notifyStatus(userId, 'qr', { qr: session.qr });
        } catch (err) {
            console.error(`[WhatsApp] QR encode error:`, err.message);
        }
    });

    client.on('authenticated', async () => {
        session.status = 'authenticated';
        session.qr = null;
        session.error = null;
        notifyStatus(userId, 'authenticated');
    });

    client.on('ready', async () => {
        session.status = 'ready';
        session.qr = null;
        session.error = null;
        _clearTimer(session);
        console.log(`[WhatsApp] Ready for user ${userId}`);
        notifyStatus(userId, 'ready');

        try {
            const userDoc = await User.findById(userId);
            if (userDoc && userDoc.webhookUrl) {
                dispatchWebhook(userDoc, 'whatsapp_ready', { status: 'ready', userId });
            }
        } catch (e) {
            console.error(`[Webhook] Error finding user ${userId} for ready event dispatch.`, e.message);
        }
    });

    // ── Capture INCOMING messages (text + media) ──────────────────
    client.on('message', async (msg) => {
        try {
            if (msg.fromMe) return;

            const contact = await msg.getContact().catch(() => null);
            const contactName = contact?.pushname || contact?.name || null;
            const contactPhone = msg.from.replace('@c.us', '').replace('@g.us', '');
            const isGroup = msg.from.endsWith('@g.us');

            // Dedup
            const exists = await InboxMessage.exists({ userId, waMessageId: msg.id.id });
            if (exists) return;

            // Download media if present
            const mediaData = await downloadAndSaveMedia(msg, userId);

            const savedMsg = await InboxMessage.create({
                userId,
                chatId: msg.from,
                contactName,
                contactPhone,
                body: msg.body || mediaData.caption || '',
                direction: 'received',
                waMessageId: msg.id.id,
                timestamp: new Date(msg.timestamp * 1000),
                isGroup,
                ...mediaData,
            });

            // Push real-time event
            if (socketIo) {
                socketIo.to(userId).emit('message_received', { message: savedMsg });
            }
            // Dispatch incoming message event out via Webhook
            try {
                const userDoc = await User.findById(userId);
                if (userDoc && userDoc.webhookUrl) {
                    dispatchWebhook(userDoc, 'message_received', { message: savedMsg });
                }
            } catch (e) {
                console.error(`[Webhook] Error dispatching message to ${userId}:`, e.message);
            }

        } catch (err) {
            console.error(`[WhatsApp] Error saving incoming message:`, err.message);
        }
    });

    client.on('auth_failure', (msg) => {
        session.status = 'error';
        session.qr = null;
        session.error = 'Authentication failed. Please try reconnecting.';
        notifyStatus(userId, 'error', { error: session.error });
        _clearTimer(session);
        clients.delete(userId);
    });

    client.on('disconnected', async (reason) => {
        const wasIntentional = loggedOutUsers.has(userId);
        session.status = 'disconnected';
        session.qr = null;
        notifyStatus(userId, 'disconnected');
        _clearTimer(session);
        clients.delete(userId);

        try {
            const userDoc = await User.findById(userId);
            if (userDoc && userDoc.webhookUrl) {
                dispatchWebhook(userDoc, 'whatsapp_disconnected', { status: 'disconnected', reason, userId });
            }
        } catch (e) { }

        // ── Auto-reconnect unless user intentionally logged out ───────────
        if (!wasIntentional) {
            console.log(`[WhatsApp] Unexpected disconnect for ${userId} (${reason}). Auto-reconnecting in 5s...`);
            setTimeout(() => {
                if (!clients.has(userId) && !loggedOutUsers.has(userId)) {
                    console.log(`[WhatsApp] Auto-reconnecting user ${userId}...`);
                    notifyStatus(userId, 'initializing');
                    getOrCreateClient(userId);
                }
            }, 5000);
        } else {
            loggedOutUsers.delete(userId); // Clear the flag after handling
        }
    });

    session.client = client;
    clients.set(userId, session);

    client.initialize().catch((err) => {
        console.error(`[WhatsApp] Initialize error for ${userId}:`, err.message);
        session.status = 'error';
        session.error = `Failed to start: ${err.message}`;
        _clearTimer(session);
        clients.delete(userId);
    });

    return session;
}

function _clearTimer(session) {
    if (session.initTimer) { clearTimeout(session.initTimer); session.initTimer = null; }
}

async function _destroyClient(userId) {
    if (!clients.has(userId)) return;
    const s = clients.get(userId);
    _clearTimer(s);
    try { await s.client.destroy(); } catch (_) { }
    clients.delete(userId);
}

function getQRAndStatus(userId) {
    if (!clients.has(userId)) return { status: 'disconnected', qr: null, error: null };
    const s = clients.get(userId);
    return { status: s.status, qr: s.qr, error: s.error };
}

function getStatus(userId) {
    return clients.has(userId) ? clients.get(userId).status : 'disconnected';
}

function getClient(userId) {
    if (!clients.has(userId)) return null;
    const s = clients.get(userId);
    return s.status === 'ready' ? s.client : null;
}

// Ensure the client is ready. If not in memory, it will initialize and wait for it.
async function ensureClientReady(userId, timeoutMs = 30000) {
    const session = getOrCreateClient(userId);

    // If already ready, return instantly
    if (session.status === 'ready') return session.client;

    // Wait until it becomes ready or hits an error/qr state
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
            if (session.status === 'ready') {
                clearInterval(interval);
                resolve(session.client);
            } else if (session.status === 'qr' || session.status === 'error' || session.status === 'disconnected') {
                clearInterval(interval);
                reject(new Error(`WhatsApp client failed to start. Status: ${session.status}`));
            } else if (Date.now() - start > timeoutMs) {
                clearInterval(interval);
                reject(new Error('Timeout waiting for WhatsApp client to be ready'));
            }
        }, 500);
    });
}

// Scans `.wwebjs_auth` folder for existing session directories and pre-warms them
async function restoreAllSessions() {
    console.log('[WhatsApp] Booting up background sessions...');
    const authDir = path.join(process.cwd(), '.wwebjs_auth');
    if (!fs.existsSync(authDir)) return;

    try {
        const items = fs.readdirSync(authDir);
        for (const item of items) {
            if (item.startsWith('session-')) {
                // Ensure we handle cases where the folder might accidentally be named 'session-session-ID'
                const userId = item.replace(/^session-/, '');
                if (userId && !userId.startsWith('session-')) {
                    console.log(`[WhatsApp] Auto-restoring session for user: ${userId}`);
                    getOrCreateClient(userId);
                }
            }
        }
    } catch (err) {
        console.error('[WhatsApp] Failed to restore sessions:', err);
    }
}

async function disconnect(userId) {
    loggedOutUsers.add(userId); // Mark as intentional so auto-reconnect is skipped
    await _destroyClient(userId);
}

// Logout and wipe the stored session (forces fresh QR on next connect)
async function logoutAndClearSession(userId) {
    loggedOutUsers.add(userId);
    // Try a graceful WA logout first
    if (clients.has(userId)) {
        const s = clients.get(userId);
        try { await s.client.logout(); } catch (_) { }
    }
    await _destroyClient(userId);

    // Delete the LocalAuth session folder so next connect starts fresh
    const sessionDir = path.join(process.cwd(), '.wwebjs_auth', `session-${userId}`);
    if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
        console.log(`[WhatsApp] Cleared session for user ${userId}`);
    }
    // Short delay then clear the flag so user CAN reconnect with new account
    setTimeout(() => loggedOutUsers.delete(userId), 2000);
}

function fillTemplate(template, variables = {}) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
        variables[key] !== undefined ? variables[key] : `{{${key}}}`
    );
}

module.exports = {
    setSocketIO,
    getOrCreateClient,
    getQRAndStatus,
    getStatus,
    getClient,
    ensureClientReady,
    restoreAllSessions,
    disconnect,
    logoutAndClearSession,
    fillTemplate
};
