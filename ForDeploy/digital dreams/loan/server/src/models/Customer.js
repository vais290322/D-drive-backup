const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String },
  mobile_primary: { type: String },
  customer_code: { type: String, unique: true, sparse: true },
  kyc_status: { type: String, default: 'pending' },
  created_at: { type: Date, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Customer', CustomerSchema);
