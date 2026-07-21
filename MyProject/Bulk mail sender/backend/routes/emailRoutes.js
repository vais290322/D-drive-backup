import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as emailController from '../controllers/emailController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Routes
router.post('/extract-emails', upload.single('excelFile'), emailController.extractEmails);
router.post('/send-emails', upload.array('attachments'), emailController.sendEmails);
router.get('/campaigns', emailController.getCampaigns);
router.get('/campaigns/:id', emailController.getCampaignById);

// Upload logo route
router.post('/upload-logo', upload.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No logo uploaded' });
  }
  
  return res.status(200).json({
    success: true,
    logo: {
      path: req.file.path,
      filename: req.file.filename
    }
  });
});

export default router;