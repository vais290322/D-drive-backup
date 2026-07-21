/**
 * PhonePe Payment Routes
 * Webhook endpoint, payment status checking, and QR management
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const phonepeController = require('../controllers/phonepeController');

/**
 * ✅ WEBHOOK ENDPOINT
 * POST /api/phonepe/webhook
 * 
 * PhonePe will POST payment notifications here
 * Must NOT require authentication (PhonePe can't authenticate)
 * Must NOT validate bearer token
 * MUST return 200 OK immediately
 * 
 * Security: Validates X-VERIFY signature header
 */
router.post('/webhook', phonepeController.handlePhonePeWebhook);

/**
 * ✅ CHECK PAYMENT STATUS
 * GET /api/phonepe/status/:merchantTransactionId
 * 
 * Frontend can call this to check if payment was successful
 * Useful for polling after customer completes payment
 */
router.get('/status/:merchantTransactionId', phonepeController.checkPaymentStatus);

/**
 * ✅ REGENERATE STATIC QR
 * POST /api/phonepe/qr/regenerate/:loanId
 * 
 * Admin can regenerate QR code for a loan
 * Requires authentication
 */
router.post('/qr/regenerate/:loanId', auth, phonepeController.regenerateStaticQR);

/**
 * ✅ GET PAYMENT HISTORY
 * GET /api/phonepe/history/:loanId
 * 
 * Get all PhonePe transactions and EMI schedule for a loan
 * Requires authentication
 */
router.get('/history/:loanId', auth, phonepeController.getLoanPaymentHistory);

module.exports = router;
