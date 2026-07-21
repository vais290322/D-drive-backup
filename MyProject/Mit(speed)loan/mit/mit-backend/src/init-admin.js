/**
 * Initialize Default Admin User
 * Run this script to create the first admin user: node src/init-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Profile = require('./models/Profile');

const DEFAULT_ADMIN = {
    email: 'admin@mitelectroworld.com',
    password: 'admin123',
    full_name: 'System Administrator',
    role: 'super_admin',
    status: 'approved',
    phone: ''
};

async function initAdmin() {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mitelectroworld';
        await mongoose.connect(uri, { autoIndex: true });
        console.log('✓ Connected to MongoDB');

        // Check if admin already exists
        const existing = await Profile.findOne({ email: DEFAULT_ADMIN.email });
        if (existing) {
            console.log(`ℹ Admin user already exists: ${DEFAULT_ADMIN.email}`);
            console.log(`  Role: ${existing.role}`);
            console.log(`  Status: ${existing.status}`);
            process.exit(0);
        }

        // Create admin user
        const hash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
        const admin = await Profile.create({
            ...DEFAULT_ADMIN,
            password: hash,
            approved_at: new Date()
        });

        console.log('\n✓ Default admin user created successfully!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  Email:    ', DEFAULT_ADMIN.email);
        console.log('  Password: ', DEFAULT_ADMIN.password);
        console.log('  Role:     ', admin.role);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('⚠️  IMPORTANT: Change the password after first login!\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating admin user:', err);
        process.exit(1);
    }
}

initAdmin();
