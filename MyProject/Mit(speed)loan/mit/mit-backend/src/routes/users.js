const express = require('express');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Get all users (or filtered)
router.get('/', authenticate, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const users = await Profile.find(filter)
            .select('-password')
            .sort({ created_at: -1 });

        return res.json(users);
    } catch (err) {
        console.error('Get users error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get single user by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const user = await Profile.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.json(user);
    } catch (err) {
        console.error('Get user error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/:id', authenticate, async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.password; // Don't allow password update through this endpoint
        delete updates.email; // Don't allow email change

        updates.updated_at = new Date();

        const user = await Profile.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.json(user);
    } catch (err) {
        console.error('Update user error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Update user role
router.patch('/:id/role', authenticate, async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) return res.status(400).json({ message: 'Role is required' });

        const user = await Profile.findByIdAndUpdate(
            req.params.id,
            { role, updated_at: new Date() },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.json(user);
    } catch (err) {
        console.error('Update role error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Approve user
router.post('/:id/approve', authenticate, async (req, res) => {
    try {
        const { approved_by } = req.body;

        const user = await Profile.findByIdAndUpdate(
            req.params.id,
            {
                status: 'approved',
                approved_by,
                approved_at: new Date(),
                updated_at: new Date()
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.json({ success: true, message: 'User approved successfully', user });
    } catch (err) {
        console.error('Approve user error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Reject user
router.post('/:id/reject', authenticate, async (req, res) => {
    try {
        const user = await Profile.findByIdAndUpdate(
            req.params.id,
            {
                status: 'rejected',
                updated_at: new Date()
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.json({ success: true, message: 'User rejected successfully', user });
    } catch (err) {
        console.error('Reject user error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create user by admin
router.post('/create', authenticate, async (req, res) => {
    try {
        const { email, password, full_name, role, created_by } = req.body;

        if (!email || !password || !full_name || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existing = await Profile.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await Profile.create({
            email,
            password: hash,
            full_name,
            role,
            status: 'approved', // Auto-approved when created by admin
            approved_by: created_by,
            approved_at: new Date()
        });

        return res.json({
            success: true,
            message: 'User created successfully',
            user: {
                id: user._id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Create user error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
