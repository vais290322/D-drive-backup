const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String },
  phone: { type: String, default: '' },
  role: { type: String, default: 'data_entry' },
  status: { type: String, default: 'approved' },
  approved_by: { type: String, default: null },
  approved_at: { type: Date, default: null },
  created_at: { type: Date, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Profile', ProfileSchema);
