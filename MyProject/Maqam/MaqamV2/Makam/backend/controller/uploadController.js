import { uploadFile, deleteFile } from '../services/storageService.js';
import fs from 'fs';

/**
 * Upload File Controller
 */
export const uploadFileController = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const result = await uploadFile(req.file.path, 'public');

        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temp file:', err);
        });

        res.status(201).json({
            message: 'File uploaded successfully',
            data: result.data,
        });
    } catch (error) {
        console.error('Upload Controller Error:', error);

        if (req.file) {
            fs.unlink(req.file.path, (e) => {
                if (e) console.error('Error deleting temp file on error:', e);
            });
        }

        res.status(500).json({ error: error.message || 'File upload failed' });
    }
};

/**
 * Delete File Controller
 */
export const deleteFileController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'File ID is required' });
            return;
        }

        await deleteFile(id);

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Delete Controller Error:', error);
        res.status(500).json({ error: error.message || 'File deletion failed' });
    }
};
