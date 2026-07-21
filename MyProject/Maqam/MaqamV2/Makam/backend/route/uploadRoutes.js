import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFileController, deleteFileController } from '../controller/uploadController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Configure Multer for temp storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Routes
router.post('/', authenticate, upload.single('file'), uploadFileController);
router.delete('/:id', authenticate, deleteFileController);

export default router;
