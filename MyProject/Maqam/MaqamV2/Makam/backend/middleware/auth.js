/**
 * JWT Authentication Middleware
 *
 * Protects routes and verifies JWT tokens
 */

import jwt from 'jsonwebtoken';
import { User } from '../model/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header or cookie
        const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        // Attach user to request
        req.user = user;
        req.userId = user._id.toString();

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/**
 * Check if user has required role
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }

        next();
    };
};

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '7d',
    });
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');

            if (user) {
                req.user = user;
                req.userId = user._id.toString();
            }
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
