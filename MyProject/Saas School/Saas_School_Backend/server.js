import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import multer from 'multer';

// Routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import notificationRoutes from './routes/notifications.js';
import uploadRoutes from './routes/uploads.js';
import categoriesRoutes from './routes/categories.route.js';
import subCategoriesRoutes from './routes/subCategories.route.js';
import inventoryRoutes from './routes/inventory.route.js';
import purchaseRoutes from './routes/purchase.route.js';
import salesRoutes from './routes/salses.route.js';
import reportsRoutes from './routes/reports.route.js';
import resultPublishDateRoutes from './routes/resultPublishDate.route.js';
import headmasterSignaturePhotoRoutes from './routes/headmasterSignaturePhoto.route.js';
import additionalSubjectMarkRegisterRoutes from './routes/additionalSubjectMarkRegister.route.js';

// Load environment variables
dotenv.config();

// Add or update these middleware configurations
const app = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Use multer middleware in your post routes
// In your routes file:
// router.post('/', upload.single('media'), createPost);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://192.168.0.114:5173',
  'https://vaisacademy.com',
  'https://admin.vaisacademy.com',
];

// Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5174',
//   credentials: true
// }));

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io connection
import initSocket from './utils/socket.js';
const socketUtils = initSocket(io);
app.set('io', socketUtils);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/subCategories', subCategoriesRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/resultPublishDate', resultPublishDateRoutes);
app.use('/api/headmasterSignaturePhoto', headmasterSignaturePhotoRoutes);
app.use('/api/additionalSubjectMarkRegister', additionalSubjectMarkRegisterRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});