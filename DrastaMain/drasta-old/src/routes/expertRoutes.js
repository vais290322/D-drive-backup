const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const {
  addExpert,
  getExperts,
  deleteExpert,
} = require('../controller/expertController');

// POST: Add expert
// router.post('/experts', upload.single('image'), addExpert);

router.post(
  '/experts',
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error('🍎 Multer error:', err);
        return next(err);
      }
      next();
    });
  },
  addExpert
);

// GET: All experts
router.get('/experts', getExperts);

// DELETE: Remove expert by ID
router.delete('/experts/:id', deleteExpert);

module.exports = router;