const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../mongodb');

const router = express.Router();

// JWT Secret Key - Use environment variable or fallback to default
const JWT_SECRET = process.env.JWT_SECRET || 'unix-restaurant-secret-key-change-in-production';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    
    req.user = user;
    next();
  });
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Find the admin user
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Compare passwords
    const validPassword = await bcrypt.compare(password, admin.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
});

// Change password route (requires authentication)
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Find the admin user
    const admin = await Admin.findById(userId);
    
    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, admin.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the password
    admin.password = hashedPassword;
    await admin.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password', error: err.message });
  }
});

// Verify token route
router.get('/verify-token', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Token is valid',
    user: {
      id: req.user.id,
      username: req.user.username
    }
  });
});

module.exports = { router, authenticateToken };