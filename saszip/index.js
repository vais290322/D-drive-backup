const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saas_signup', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const razorpayRoutes = require('./razorpay');

// Simple test route
app.get('/', (req, res) => {
  res.send('SaaS Signup Backend API is running!');
});

// Example user signup endpoint
app.post('/api/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Here you would typically validate input and save to database
    console.log('User signup attempt:', { name, email });
    
    // For now, just return a success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { name, email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during signup process',
      error: error.message
    });
  }
});

// Use routes
app.use('/api/razorpay', razorpayRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});