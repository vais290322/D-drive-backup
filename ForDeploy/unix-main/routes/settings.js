const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Settings } = require('../mongodb');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only specific image types
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, GIF, and WebP image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get restaurant settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne({});
    
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching settings', error: err.message });
  }
});

// Update restaurant settings (requires authentication)
router.put('/', authenticateToken, upload.single('logo'), async (req, res) => {
  try {
    const { 
      restaurant_name, 
      address, 
      phone, 
      email, 
      operational_hours, 
      gst_number, 
      trade_license,
      show_gst,
      show_trade_license
    } = req.body;
    
    // Validate and sanitize inputs
    const sanitizedData = {};
    
    if (restaurant_name !== undefined) {
      if (typeof restaurant_name !== 'string') {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Restaurant name must be a string' });
      }
      sanitizedData.restaurant_name = restaurant_name.trim();
      if (sanitizedData.restaurant_name.length > 100) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Restaurant name cannot exceed 100 characters' });
      }
    }
    
    if (address !== undefined) {
      if (typeof address !== 'string') {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Address must be a string' });
      }
      sanitizedData.address = address.trim();
      if (sanitizedData.address.length > 500) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Address cannot exceed 500 characters' });
      }
    }
    
    if (phone !== undefined) {
      if (typeof phone !== 'string') {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Phone must be a string' });
      }
      sanitizedData.phone = phone.trim();
      if (sanitizedData.phone.length > 20) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Phone cannot exceed 20 characters' });
      }
    }
    
    if (email !== undefined) {
      if (typeof email !== 'string') {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Email must be a string' });
      }
      sanitizedData.email = email.trim();
      if (sanitizedData.email.length > 100) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Email cannot exceed 100 characters' });
      }
    }
    
    if (operational_hours !== undefined) {
      if (typeof operational_hours !== 'string') {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Operational hours must be a string' });
      }
      sanitizedData.operational_hours = operational_hours.trim();
      if (sanitizedData.operational_hours.length > 200) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Operational hours cannot exceed 200 characters' });
      }
    }
    
    if (gst_number !== undefined) {
      if (typeof gst_number !== 'string') {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'GST number must be a string' });
      }
      sanitizedData.gst_number = gst_number.trim();
      if (sanitizedData.gst_number.length > 50) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'GST number cannot exceed 50 characters' });
      }
    }
    
    if (trade_license !== undefined) {
      if (typeof trade_license !== 'string') {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Trade license must be a string' });
      }
      sanitizedData.trade_license = trade_license.trim();
      if (sanitizedData.trade_license.length > 50) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Trade license cannot exceed 50 characters' });
      }
    }
    
    // Find existing settings
    let settings = await Settings.findOne({});
    
    if (!settings) {
      // Create new settings if none exist
      settings = new Settings({});
    }
    
    // Handle logo update
    if (req.file) {
      // If there's a new logo, delete the old one if it exists
      if (settings.logo_path) {
        const oldLogoPath = path.join(__dirname, '../public', settings.logo_path);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      settings.logo_path = `/uploads/${req.file.filename}`;
    }
    
    // Update settings fields with sanitized data
    if (sanitizedData.restaurant_name !== undefined) settings.restaurant_name = sanitizedData.restaurant_name;
    if (sanitizedData.address !== undefined) settings.address = sanitizedData.address;
    if (sanitizedData.phone !== undefined) settings.phone = sanitizedData.phone;
    if (sanitizedData.email !== undefined) settings.email = sanitizedData.email;
    if (sanitizedData.operational_hours !== undefined) settings.operational_hours = sanitizedData.operational_hours;
    if (sanitizedData.gst_number !== undefined) settings.gst_number = sanitizedData.gst_number;
    if (sanitizedData.trade_license !== undefined) settings.trade_license = sanitizedData.trade_license;
    
    // Update visibility settings
    settings.show_gst = show_gst === 'true' || show_gst === true;
    settings.show_trade_license = show_trade_license === 'true' || show_trade_license === true;
    
    await settings.save();
    
    res.status(200).json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (err) {
    // If file was uploaded, delete it since we're not updating the settings
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error updating settings', error: err.message });
  }
});

module.exports = router;