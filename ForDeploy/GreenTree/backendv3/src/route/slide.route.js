const express = require('express');
const router = express.Router();
const { createCloudinaryUpload } = require('../config/cloudinary');
const upload = createCloudinaryUpload('slides');
const { createSlide, getSlides, deleteSlide } = require('../controller/slide.controller');
const { authenticate, authorize } = require('../middleware/authorization');

// Create slide (admin only)
router.post('/addslide', authenticate, authorize(["admin","staff"]), upload.single('image'), createSlide);

// Get all slides (public)
router.get('/getslide', getSlides);

// Delete slide (admin only)
router.delete('/deleteslide/:id', authenticate, authorize(["admin","staff"]), deleteSlide);

module.exports = router;