require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { initializeDatabase } = require('./mongodb');
const { router: authRoutes, authenticateToken } = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const itemsRoutes = require('./routes/items');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 9712;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Limit URL-encoded payload size
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize MongoDB database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://roni:Vais%402025@cluster0.ptrxdbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
initializeDatabase(MONGODB_URI);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/settings', settingsRoutes);

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'unix.html'));
});

// Admin panel route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});