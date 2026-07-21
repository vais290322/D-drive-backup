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
  down_payment: { type: Number, default: 0 },
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

  // QR Code Details (STATIC QR FOR EMI COLLECTION)
  // Generated once when loan is created
  // Used for PhonePe payment collection
  phonepe_qr_data: {
    qrId: { type: String },
    qrString: { type: String }, // Raw UPI string
    url: { type: String }, // Short URL
    merchantTransactionId: { type: String }, // Should be same as loan_id
    imageUrl: { type: String }
  },

  qr_code_url: { type: String },
  qr_token: { type: String, unique: true, sparse: true }, // Secure token for Static QR payment link
  razorpay_qr_id: { type: String },

  // PhonePe Autopay (Subscription) - if needed later
  phonepe_subscription_id: { type: String },

  phonepe_mandate_status: {
    type: String,
    // enum: ['uninitialized', 'pending', 'active', 'revoked', 'expired','CANCELLED'],
    default: 'uninitialized'
  },

  isAutoPaySetup:{
    type:Boolean,
    default:false
  },


  autoPayLink:{
    type:String,
    default:null
  },

  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

LoanSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    ret.loan_id = ret.loan_code; // Map loan_code to loan_id for frontend
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Auto-update updated_at on save
LoanSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();

});

module.exports = mongoose.model('Loan', LoanSchema);
