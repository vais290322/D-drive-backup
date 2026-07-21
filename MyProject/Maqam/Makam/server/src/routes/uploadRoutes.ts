
import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFileController, deleteFileController } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Configure Multer for temp storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Routes
// POST /api/upload
// @ts-ignore
router.post('/', authenticate, upload.single('file'), uploadFileController);

// DELETE /api/upload/:id
router.delete('/:id', authenticate, deleteFileController);

export default router;
