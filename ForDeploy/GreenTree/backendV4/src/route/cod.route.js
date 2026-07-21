const express = require('express');
const router = express.Router();
const { updateCODStatus,getCODStatus } = require('../controller/cod.controller');
const { authenticate, authorize } = require('../middleware/authorization');

// Create tax (admin only)
router.put('/cod', authenticate, authorize(["admin","staff"]), updateCODStatus);
// Get all taxes (public)
router.get('/cod',getCODStatus);

module.exports = router;
