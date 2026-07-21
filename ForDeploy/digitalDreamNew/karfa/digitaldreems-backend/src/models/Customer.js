const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  customer_code: { type: String, unique: true, required: true },
  full_name: { type: String, required: true },
  father_name: { type: String },
  mother_name: { type: String },
  spouse_name: { type: String },
  date_of_birth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', null] },
  nationality: { type: String },
  marital_status: { type: String, enum: ['single', 'married', 'divorced', 'widowed', null] },
  marriage_anniversary: { type: Date },
  email: { type: String },
  mobile_primary: { type: String, required: true },
  mobile_secondary: { type: String },
  permanent_address: { type: String },
  current_address: { type: String },
  city: { type: String },
  district: { type: String },
  state: { type: String },
  pin_code: { type: String },
  address_proof_url: { type: String },

  // KYC Documents
  aadhaar_number: { type: String },
  pan_number: { type: String },
  voter_id: { type: String },
  driving_license: { type: String },
  aadhaar_front_url: { type: String },
  aadhaar_back_url: { type: String },
  pan_card_url: { type: String },
  photo_url: { type: String },
  signature_url: { type: String },

  // KYC Status
  kyc_status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  kyc_verified_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  kyc_verified_at: { type: Date },
  kyc_remarks: { type: String },
  kyc_photo_url: { type: String },

  // Banking Details
  bank_name: { type: String },
  account_holder_name: { type: String },
  account_number: { type: String },
  ifsc_code: { type: String },
  branch_name: { type: String },
  cancelled_cheque_url: { type: String },

  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Auto-update updated_at on save
CustomerSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Customer', CustomerSchema);

