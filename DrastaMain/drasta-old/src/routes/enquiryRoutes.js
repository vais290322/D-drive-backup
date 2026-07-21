const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  deleteEnquiry
} = require('../controller/enquiryController');

// POST a new enquiry
router.post('/enquiry', createEnquiry);

// GET all enquiries (admin)
router.get('/enquiry', getEnquiries);
router.delete('/enquiry/:id', deleteEnquiry);

module.exports = router;
