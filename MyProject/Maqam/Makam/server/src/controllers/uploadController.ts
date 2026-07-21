
import { Request, Response } from 'express';
import { uploadFile, deleteFile } from '../services/storageService';
import fs from 'fs';

/**
 * Upload File Controller
 */
export const uploadFileController = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        // Upload to VaisBucket
        const result = await uploadFile(req.file.path, 'public');

        // Delete local temp file after upload
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temp file:', err);
        });

        res.status(201).json({
            message: 'File uploaded successfully',
            data: result.data, // Returns fileUrl, fileId, etc.
        });
    } catch (error: any) {
        console.error('Upload Controller Error:', error);

        // Clean up local file even on error
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
export const deleteFileController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'File ID is required' });
            return;
        }

        await deleteFile(id);

        res.json({ message: 'File deleted successfully' });
    } catch (error: any) {
        console.error('Delete Controller Error:', error);
        res.status(500).json({ error: error.message || 'File deletion failed' });
    }
};
