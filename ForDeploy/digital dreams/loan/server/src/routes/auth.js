const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await Profile.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const profile = await Profile.create({ email, password: hash, full_name, status: 'pending' });
    return res.json({ success: true, message: 'Registration submitted', id: profile._id });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const profile = await Profile.findOne({ email });
    if (!profile) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, profile.password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    if (profile.status === 'pending') {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    if (profile.status === 'rejected') {
      return res.status(403).json({ message: 'Account rejected' });
    }

    const token = jwt.sign({ id: profile._id, email: profile.email, role: profile.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ success: true, token, user: { id: profile._id, email: profile.email, full_name: profile.full_name, role: profile.role } });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
