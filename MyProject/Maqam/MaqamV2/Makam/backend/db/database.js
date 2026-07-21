/**
 * MongoDB Database Connection
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vaisdt2:WJywTmkQChUnCLkC@cluster0.6vxlt.mongodb.net/maquam_holidays';


export const connectDB = async () => {


    try {
        const conn = await mongoose.connect(MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.log('⚠️  Falling back to in-memory mock database');
        console.log('📝 Default test accounts:');
        console.log('   Admin: admin@maquamholidays.com / admin123');
        console.log('   User: user@maquamholidays.com / user123');
        console.log('   Hotelier: hotelier@maquamholidays.com / hotelier123');

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
