/**
 * Express Server for Maquam Holidays
 * 
 * MongoDB + Express backend API
 * Updated for PayPal integration
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database';
import logger from './config/logger';
import { securityHeaders, requestLogger, errorLogger, apiRateLimiter } from './middleware/security';

// Import routes
import authRoutes from './routes/authRoutes';
import hotelRoutes from './routes/hotelRoutes';
import bookingRoutes from './routes/bookingRoutes';
import amadeusRoutes from './routes/amadeusRoutes';
import uploadRoutes from './routes/uploadRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(securityHeaders);
app.use(requestLogger);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting (applied globally)
app.use('/api', apiRateLimiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Maquam Holidays API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/amadeus', amadeusRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error logging middleware
app.use(errorLogger);

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
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

console.log("♻️  Restarting server with FINAL DATE LOGIC FIX...");
startServer();

export default app;
