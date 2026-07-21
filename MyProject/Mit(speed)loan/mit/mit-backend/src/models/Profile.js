const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String },
  phone: { type: String, default: '' },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'loan_manager', 'collection_agent', 'data_entry', 'kyc_verifier'],
    default: 'data_entry'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  approved_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Auto-update updated_at on save
ProfileSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);

