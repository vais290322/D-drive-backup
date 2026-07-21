const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  loan_code: { type: String, unique: true, required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },

  loan_type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },

  // Financial Details
  principal_amount: { type: Number, required: true },
  processing_fee: { type: Number, default: 0 },
  insurance_fee: { type: Number, default: 0 },
  tenure_months: { type: Number, required: true },

  // Interest Details
  interest_type: {
    type: String,
    enum: ['flat', 'reducing'],
    required: true
  },
  interest_rate: { type: Number, required: true },
  total_interest: { type: Number, required: true },
  total_payable: { type: Number, required: true },
  installment_amount: { type: Number, required: true },

  // Dates
  start_date: { type: Date, required: true },
  first_emi_date: { type: Date, required: true },
  emi_day_of_month: { type: Number, required: true },

  // Status
  status: {
    type: String,
    enum: ['active', 'completed', 'defaulted', 'closed'],
    default: 'active'
  },
  closed_date: { type: Date },

  // Guarantor Information
  guarantor_name: { type: String },
  guarantor_mobile: { type: String },
  guarantor_address: { type: String },
  guarantor_relation: { type: String },

  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Auto-update updated_at on save
LoanSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Loan', LoanSchema);
