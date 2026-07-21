import express from 'express';
import { register, login, getProfile, getAllUsers, logout } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get user profile
router.get('/profile', auth, getProfile);

// Get all users
router.get('/users', auth, getAllUsers);

// Logout user
router.post('/logout', auth, logout);

export default router;