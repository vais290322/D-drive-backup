/**
 * Express Server for Maquam Holidays
 *
 * MongoDB + Express backend API
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './db/database.js';
import logger from './config/logger.js';
import { securityHeaders, requestLogger, errorLogger, apiRateLimiter } from './middleware/security.js';

// Import routes
import authRoutes from './route/authRoutes.js';
import hotelRoutes from './route/hotelRoutes.js';
import bookingRoutes from './route/bookingRoutes.js';
import amadeusRoutes from './route/amadeusRoutes.js';
import uploadRoutes from './route/uploadRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(securityHeaders);
app.use(requestLogger);

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting (applied globally)
app.use('/api', apiRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Maquam Holidays API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/amadeus', amadeusRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error logging middleware
app.use(errorLogger);

// Error handler
app.use((err, req, res, next) => {
  logger.error('Server error:', { error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 API: http://localhost:${PORT}`);
      logger.info(`🏥 Health: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info('✅ Security: Helmet + Rate Limiting enabled');
      logger.info('📊 Logging: Winston + Morgan active');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
