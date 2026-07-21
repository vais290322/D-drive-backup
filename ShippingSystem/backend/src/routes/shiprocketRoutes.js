const express = require('express');
const router = express.Router();
const shiprocketController = require('../controllers/shiprocketController');

// Get token
router.get('/token', shiprocketController.getToken);

// Check serviceability
router.get('/serviceability', shiprocketController.checkServiceability);

// Create order
router.post('/orders', shiprocketController.createOrder);

// Assign AWB
router.post('/assign-awb', shiprocketController.assignAWB);

// Generate pickup
router.post('/generate-pickup', shiprocketController.generatePickup);

// Generate manifest
router.post('/generate-manifest', shiprocketController.generateManifest);

// Print manifest
router.post('/print-manifest', shiprocketController.printManifest);

// Generate label
router.post('/generate-label', shiprocketController.generateLabel);

// Print invoice
router.post('/print-invoice', shiprocketController.printInvoice);

// Track shipment
router.get('/track/:awb_code', shiprocketController.trackShipment);

// Process complete order
router.post('/process-order', shiprocketController.processCompleteOrder);

module.exports = router;