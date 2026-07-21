const express = require('express');
const router = express.Router();
const razorpayController = require('./razorpayController');

// Create order
router.post('/create-order', razorpayController.createOrder);

// Verify payment and create user
router.post('/verify-payment', razorpayController.verifyPayment);

// Get subscription status
router.get('/subscription/:userId', razorpayController.getSubscriptionStatus);

module.exports = router;