import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  // Bypass all authentication checks
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // Bypass role authorization
    next();
  };
};