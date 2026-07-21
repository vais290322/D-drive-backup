import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload, cloudinary } from '../utils/cloudinary.js';

const router = express.Router();

// @route   POST /api/uploads
// @desc    Upload a file
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      }); 
    }
    
    res.status(200).json({
      success: true,
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        fileName: req.file.originalname,
        fileType: req.file.mimetype
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/uploads/:publicId
// @desc    Delete a file
// @access  Private
router.delete('/:publicId', protect, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    await cloudinary.uploader.destroy(publicId);
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;