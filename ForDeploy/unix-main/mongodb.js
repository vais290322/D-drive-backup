const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Define schemas

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  order: {
    type: Number,
    default: 0
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Item Schema
const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: {
    type: String,
    default: ''
  },
  price_half: { 
    type: String, 
    required: false 
  },
  price_full: { 
    type: String, 
    required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true 
  },
  food_type: {
    type: String,
    enum: ['veg', 'non-veg', 'egg'],
    default: 'veg'
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  image_path: { 
    type: String 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Settings Schema
const settingsSchema = new mongoose.Schema({
  restaurant_name: {
    type: String,
    default: 'Restaurant & Dhaba – Bishwanathpur'
  },
  logo_path: {
    type: String
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  operational_hours: {
    type: String
  },
  gst_number: {
    type: String
  },
  trade_license: {
    type: String
  },
  show_gst: {
    type: Boolean,
    default: false
  },
  show_trade_license: {
    type: Boolean,
    default: false
  },

});

// Create models
const Category = mongoose.model('Category', categorySchema);
const Item = mongoose.model('Item', itemSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Settings = mongoose.model('Settings', settingsSchema);

// Initialize database function
async function initializeDatabase(connectionString) {
  try {
    // Connect to MongoDB
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB successfully');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Check if settings exist, if not create default settings
    const settingsExist = await Settings.findOne({});
    if (!settingsExist) {
      const defaultSettings = new Settings({
        restaurant_name: 'Restaurant & Dhaba – Bishwanathpur',
        phone: '8016791627, 9734423221',
        operational_hours: '10:00 AM - 10:00 PM'
      });
      
      await defaultSettings.save();
      console.log('Default restaurant settings created');
    }

    // Check if admin exists, if not create default admin
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      
      const defaultAdmin = new Admin({
        username: 'admin',
        password: hashedPassword
      });
      
      await defaultAdmin.save();
      console.log('Default admin user created');
    }

    // Populate initial categories if none exist
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      const categories = [
        { name: 'Appetizers' },
        { name: 'Main Courses' },
        { name: 'Desserts' },
        { name: 'Beverages' }
      ];
      
      await Category.insertMany(categories);
      console.log('Initial categories created');
      
      // Add sample menu items
      const appetizers = await Category.findOne({ name: 'Appetizers' });
      const mainCourses = await Category.findOne({ name: 'Main Courses' });
      const desserts = await Category.findOne({ name: 'Desserts' });
      const beverages = await Category.findOne({ name: 'Beverages' });
      
      const items = [
        {
          name: 'Garlic Bread',
          price_full: '4.99',
          price_half: '2.99',
          category: appetizers._id,
          food_type: 'veg',
          available: true
        },
        {
          name: 'Mozzarella Sticks',
          price_full: '6.99',
          price_half: '3.99',
          category: appetizers._id,
          food_type: 'veg',
          available: true
        },
        {
          name: 'Spaghetti Bolognese',
          price_full: '12.99',
          price_half: '7.99',
          category: mainCourses._id,
          food_type: 'non-veg',
          available: true
        },
        {
          name: 'Grilled Salmon',
          price_full: '16.99',
          price_half: '9.99',
          category: mainCourses._id,
          food_type: 'non-veg',
          available: true
        },
        {
          name: 'Chocolate Cake',
          price_full: '5.99',
          category: desserts._id,
          food_type: 'veg',
          available: true
        },
        {
          name: 'Ice Cream',
          price_full: '3.99',
          category: desserts._id,
          food_type: 'veg',
          available: true
        },
        {
          name: 'Soda',
          price_full: '1.99',
          category: beverages._id,
          food_type: 'veg',
          available: true
        },
        {
          name: 'Coffee',
          price_full: '2.99',
          category: beverages._id,
          food_type: 'veg',
          available: true
        }
      ];
      
      await Item.insertMany(items);
      console.log('Sample menu items created');
    }
    
    return true;
  } catch (err) {
    console.error('Database initialization error:', err);
    return false;
  }
}

module.exports = {
  Category,
  Item,
  Admin,
  Settings,
  initializeDatabase
};