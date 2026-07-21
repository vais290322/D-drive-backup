const express = require('express');
const router = express.Router();
const { createTax, getTaxes, getTaxById, updateTax, deleteTax } = require('../controller/tax.controller');
const { authenticate, authorize } = require('../middleware/authorization');

// Create tax (admin only)
router.post('/addtax', authenticate, authorize(["admin","staff"]), createTax);

// Get all taxes (public)
router.get('/gettax', getTaxes);

// Get single tax (public)
router.get('/taxbyid/:id', getTaxById);

// Update tax (admin only)
router.put('/updatetax/:id', authenticate, authorize(["admin","staff"]), updateTax);

// Delete tax (admin only)
router.delete('/taxdelete/:id', authenticate, authorize(["admin","staff"]), deleteTax);

module.exports = router;