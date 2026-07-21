import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  forgotPassword, 
  resetPassword, 
  changeRole, 
  getCurrentUser, 
  getAllUser
} from '../Controllers/auth.controller.js';
import { authenticate, authorize } from '../Middelwares/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',authenticate ,logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.get('/all-users',  getAllUser);
router.put('/change-role', authenticate, authorize('admin'), changeRole);

export default router;