/**
 * MongoDB Database Connection
 * 
 * Connects to local MongoDB instance or uses mock database for development
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vaisdt2:WJywTmkQChUnCLkC@cluster0.6vxlt.mongodb.net/maquam_holidays';
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || !MONGODB_URI.includes('mongodb://') && !MONGODB_URI.includes('mongodb+srv://');

export const connectDB = async (): Promise<void> => {
  // Check if we should use mock database
  if (USE_MOCK_DB || process.env.NODE_ENV === 'development-mock') {
    console.log('⚠️  MongoDB not available - using in-memory mock database');
    console.log('📝 Default test accounts created:');
    console.log('   Admin: admin@maquamholidays.com / admin123');
    console.log('   User: user@maquamholidays.com / user123');
    console.log('   Hotelier: hotelier@maquamholidays.com / hotelier123');
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error: any) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Falling back to in-memory mock database');
    console.log('📝 Default test accounts:');
    console.log('   Admin: admin@maquamholidays.com / admin123');
    console.log('   User: user@maquamholidays.com / user123');
    console.log('   Hotelier: hotelier@maquamholidays.com / hotelier123');

    // Explicitly disconnect to ensure readyState is 0 (disconnected)
    // This allows controllers to detect that we should use mockDB
    try {
      await mongoose.disconnect();
    } catch (e) {
      console.error('Error disconnecting mongoose:', e);
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
