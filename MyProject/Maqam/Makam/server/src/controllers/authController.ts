/**
 * Authentication Controller
 * 
 * Handles user registration, login, and authentication
 * Supports both MongoDB and mock database for development
 */

import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken, AuthRequest } from '../middleware/auth';
import { mockDB } from '../config/mockDatabase';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Check if we're using mock database
const useMockDB = () => {
  return mongoose.connection.readyState !== 1; // Not connected to MongoDB
};

/**
 * Register new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username, full_name, phone, role } = req.body;

    // Validate required fields
    if (!email || !password || !username) {
      res.status(400).json({ error: 'Email, password, and username are required' });
      return;
    }

    if (useMockDB()) {
      // Use mock database
      const existingUser = await mockDB.findUserByEmail(email) || await mockDB.findUserByUsername(username);
      
      if (existingUser) {
        res.status(400).json({ error: 'User with this email or username already exists' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = await mockDB.createUser({
        email,
        password: hashedPassword,
        username,
        full_name,
        phone,
        role: role || 'user',
        email_verified: false,
        phone_verified: false,
      });

      // Generate token
      const token = generateToken(user._id);

      // Return user and token
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      });
    } else {
      // Use MongoDB
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        res.status(400).json({ error: 'User with this email or username already exists' });
        return;
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        username,
        full_name,
        phone,
        role: role || 'user',
      });

      // Generate token
      const token = generateToken(user._id.toString());

      // Return user and token
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      });
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (useMockDB()) {
      // Use mock database
      const user = await mockDB.findUserByEmail(email);

      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Update last login
      await mockDB.updateUser(user._id, { last_login: new Date() });

      // Generate token
      const token = generateToken(user._id);

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user and token
      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      });
    } else {
      // Use MongoDB
      const user = await User.findOne({ email });

      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Update last login
      user.last_login = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id.toString());

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user and token
      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url,
        },
        token,
      });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear cookie
    res.clearCookie('token');

    res.json({ message: 'Logout successful' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        full_name: req.user.full_name,
        phone: req.user.phone,
        role: req.user.role,
        avatar_url: req.user.avatar_url,
        email_verified: req.user.email_verified,
        phone_verified: req.user.phone_verified,
        created_at: req.user.created_at,
      },
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { full_name, phone, avatar_url } = req.body;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        full_name,
        phone,
        avatar_url,
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * Change password
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    // Get user with password
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(current_password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }

    // Update password
    user.password = new_password;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
