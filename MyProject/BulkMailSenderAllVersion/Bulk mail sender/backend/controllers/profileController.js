import Profile from '../models/Profile.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Get Profile ─────────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      // Return empty profile template
      profile = { userId: req.user._id, companyName: '', address: '', phone: '', website: '', facebook: '', instagram: '', youtube: '', logo: null };
    }
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile.', error: error.message });
  }
};

// ─── Update Profile ──────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { companyName, address, phone, website, facebook, instagram, youtube } = req.body;

    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = new Profile({ userId: req.user._id });
    }

    if (companyName !== undefined) profile.companyName = companyName;
    if (address !== undefined) profile.address = address;
    if (phone !== undefined) profile.phone = phone;
    if (website !== undefined) profile.website = website;
    if (facebook !== undefined) profile.facebook = facebook;
    if (instagram !== undefined) profile.instagram = instagram;
    if (youtube !== undefined) profile.youtube = youtube;

    await profile.save();

    return res.status(200).json({ success: true, message: 'Profile updated.', profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  }
};

// ─── Upload Company Logo ─────────────────────────────────────────────────────
export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No logo file uploaded.' });
    }

    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new Profile({ userId: req.user._id });
    }

    // Delete old logo if exists
    if (profile.logo && fs.existsSync(profile.logo)) {
      fs.unlinkSync(profile.logo);
    }

    profile.logo = req.file.path;
    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Logo uploaded.',
      logo: req.file.path,
      logoUrl: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to upload logo.', error: error.message });
  }
};
