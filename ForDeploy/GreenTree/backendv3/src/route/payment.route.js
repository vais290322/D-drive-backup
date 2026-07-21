const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controller/payment.controller');
const { authenticate, authorize } = require('../middleware/authorization');

// Create Razorpay order (user or admin)
router.post('/order', authenticate, authorize(['user']), createOrder);

// Verify payment signature (user or admin)
router.post('/verify', authenticate, authorize(['user']), verifyPayment);

module.exports = router;