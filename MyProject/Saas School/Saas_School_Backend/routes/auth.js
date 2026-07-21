import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id, schoolId, role) => {
  return jwt.sign({ id, schoolId, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, schoolId } = req.body;
    
    // Validate input
    if (!email || !password || !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password and school ID'
      });
    }
    
    // Check if user exists
    const user = await User.findOne({ email, schoolId });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user._id, user.schoolId, user.role);
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    // Return user data
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        // Student specific fields
        admissionNumber: user.admissionNumber,
        className: user.className,
        section: user.section,
        // Teacher specific fields
        teacherId: user.teacherId,
        teacherName: user.teacherName,
        subjects: user.subjects,
        classes: user.classes,
        sections: user.sections
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      schoolId: req.user.schoolId,
      // Student specific fields
      admissionNumber: req.user.admissionNumber,
      className: req.user.className,
      section: req.user.section,
      // Teacher specific fields
      teacherId: req.user.teacherId,
      teacherName: req.user.teacherName,
      subjects: req.user.subjects,
      classes: req.user.classes,
      sections: req.user.sections
    }
  });
});

// @route   POST /api/auth/social-feed-token
// @desc    Generate token for social feed using existing user data
// @access  Public
router.post('/social-feed-token', async (req, res) => {
  try {
    const { userId, role, schoolId } = req.body;
    
    // Validate input
    if (!userId || !role || !schoolId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId, role and schoolId'
      });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify school ID matches
    if (user.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        message: 'School ID mismatch'
      });
    }
    
    // Generate token
    const token = generateToken(user._id, user.schoolId, user.role);
    
    // Return token
    res.status(200).json({
      success: true,
      token
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