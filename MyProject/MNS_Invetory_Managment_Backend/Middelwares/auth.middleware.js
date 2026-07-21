import jwt from 'jsonwebtoken';
import { Auth } from '../Models/auth.model.js';

// Middleware to authenticate user using JWT token from cookies
export const authenticate = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token  || req.body.token ;
    // console.log("body : ",req.body.token )
    // console.log("token : ",token)

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded : ",decoded);

    // Find user with the id from token
    const user = await Auth.findById(decoded._id).select('-password');
    console.log("usr : ",user);

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

// Middleware to check if user has required role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not authorized to access this resource`,
      });
    }

    next();
  };
};