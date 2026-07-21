

const express = require('express');
const router = express.Router();
const {
  createTrustee,
  getTrustees,
  getTrusteeById,
  updateTrustee,
  deleteTrustee
} = require('../controller/trusteeController');

const multer = require('multer');
const { storage } = require('../config/cloudinary');
// const upload = multer({ storage });

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 File filter - file info:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Enhanced middleware with detailed logging
const handleUpload = (req, res, next) => {
  console.log('🚀 Starting upload middleware...');
  console.log('📋 Content-Type:', req.get('Content-Type'));
  console.log('📦 Raw body keys:', Object.keys(req.body || {}));
  
  upload.single('img')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      console.error('Error type:', err.constructor.name);
      return res.status(400).json({ 
        success: false, 
        message: 'File upload failed', 
        error: err.message 
      });
    }
    
    console.log('✅ Multer processed without errors');
    console.log('📄 After multer - req.file:', req.file);
    console.log('📝 After multer - req.body:', req.body);
    next();
  });
};

// Upload image using multer middleware
router.post('/trustees', handleUpload, createTrustee);
router.get('/trustees', getTrustees);
router.get('/trustees/:id', getTrusteeById);
router.put('/trustees/:id', handleUpload, updateTrustee);
router.delete('/trustees/:id', deleteTrustee);

module.exports = router;
