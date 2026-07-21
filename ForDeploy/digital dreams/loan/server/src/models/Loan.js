const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  loan_code: { type: String, unique: true, sparse: true },
  customer_id: { type: String, required: true },
  product_id: { type: String },
  principal_amount: { type: Number, default: 0 },
  total_payable: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  created_at: { type: Date, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Loan', LoanSchema);
