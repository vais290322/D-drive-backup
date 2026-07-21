/**
 * Authentication Routes
 */

import express from 'express';
import {
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
} from '../controller/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/security.js';

const router = express.Router();

// Public routes with strict rate limiting
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
