const crypto = require('crypto');

/**
 * Dispatches a webhook to the user's configured webhook URL.
 * Calculates an HMAC SHA256 signature if a webhook secret is provided.
 *
 * @param {Object} user - The mongoose User object containing webhookUrl and webhookSecret.
 * @param {String} eventType - The type of event (e.g., 'message_received', 'whatsapp_ready').
 * @param {Object} payload - The data payload to send.
 */
async function dispatchWebhook(user, eventType, payload) {
    if (!user || !user.webhookUrl) return;

    try {
        const body = {
            event: eventType,
            timestamp: new Date().toISOString(),
            data: payload
        };

        const jsonBody = JSON.stringify(body);
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'WhatsSaaS-Webhook-Dispatcher/1.0'
        };

        // If the user has configured a secret, calculate the HMAC signature
        if (user.webhookSecret) {
            const hmac = crypto.createHmac('sha256', user.webhookSecret);
            const signature = hmac.update(jsonBody).digest('hex');
            headers['x-hub-signature-256'] = signature;
        }

        // Dispatch the webhook using native fetch (Node 18+)
        // We do not await or handle the response to avoid blocking the main thread execution
        fetch(user.webhookUrl, {
            method: 'POST',
            headers: headers,
            body: jsonBody,
            // Timeout after 10 seconds so we don't hold sockets open forever on slow receivers
            signal: AbortSignal.timeout(10000)
        }).then(response => {
            if (!response.ok) {
                console.warn(`[Webhook] Failed to deliver ${eventType} to ${user.email} - Status: ${response.status}`);
            }
        }).catch(err => {
            console.warn(`[Webhook] Delivery error for ${user.email} (${eventType}): ${err.message}`);
        });

    } catch (err) {
        console.error(`[Webhook] Failed to prepare webhook dispatch: ${err.message}`);
    }
}

module.exports = {
    dispatchWebhook
};
