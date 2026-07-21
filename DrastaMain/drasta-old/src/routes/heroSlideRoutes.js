const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary'); // adjust path if needed
const upload = multer({ storage });

const {
  createHeroSlide,
  getHeroSlides,
  getHeroSlideById,
  updateHeroSlide,
  deleteHeroSlide
} = require('../controller/heroSlideController');

// POST: Create Hero Slide
router.post('/sliders', upload.single('image'), createHeroSlide);

// Other routes
router.get('/sliders', getHeroSlides);
router.get('/sliders/:id', getHeroSlideById);
router.put('/sliders/:id', upload.single('image'), updateHeroSlide);
router.delete('/sliders/:id', deleteHeroSlide);

module.exports = router;
