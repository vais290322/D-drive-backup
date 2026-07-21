const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const { createAdvisor, getAdvisors, deleteAdvisor } = require('../controller/advisorController');

// router.post('/advisor', upload.single('image'), createAdvisor);

router.post(
  '/advisor',
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) return next(err);      // Pass multer errors to your error handler
      next();
    });
  },
  createAdvisor
);
router.get('/advisor', getAdvisors);
router.delete('/advisor/:id', deleteAdvisor);

module.exports = router;