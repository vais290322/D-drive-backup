const express = require('express');
const router = express.Router();
const {
    createEnquiry,
    getAllEnquiries,
    getEnquiryById,
    deleteEnquiry
} = require('../controller/enquiry.controller');
const { authenticate, authorize } = require('../middleware/authorization');

// Create enquiry (public)
router.post('/enquiry', createEnquiry);

// Get all enquiries (admin only)
router.get('/getenquiry', authenticate, authorize(["admin","staff"]), getAllEnquiries);

// Get single enquiry (admin only)
router.get('/getenquirybyid/:id', authenticate, authorize(["admin","staff"]), getEnquiryById);


// Delete enquiry (admin only)
router.delete('/deleteenquiry/:id', authenticate, authorize(["admin","staff"]), deleteEnquiry);

module.exports = router;