const mongoose = require('mongoose');
const { getNextSequence } = require('./Counter');

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
  whatsapp_number: { type: String },
  permanent_address: { type: String },
  current_address: { type: String },
  city: { type: String },
  district: { type: String },
  state: { type: String },
  pin_code: { type: String },
  address_proof_url: [
    {
      fileUrl: { type: String },
      fileId: { type: String }
    }
  ],

  // KYC Documents
  aadhaar_number: { type: String },
  pan_number: { type: String },
  voter_id: { type: String },
  driving_license: { type: String },
  aadhaar_front_url: [
    {
      fileUrl: { type: String },
      fileId: { type: String }
    }
  ],
  // aadhaar_front_url: { type: String },
  aadhaar_back_url: [
    {
      fileUrl: { type: String },
      fileId: { type: String }
    }
  ],
  pan_card_url: [
    {
      fileUrl: { type: String },
      fileId: { type: String }
    }
  ],
  // photo_url:{type:String},
  photo_url: [
    {
      fileUrl: { type: String },
      fileId: { type: String }
    }
  ],
  signature_url: [
    {
      fileUrl: { type: String },
      fileId: { type: String }
    }
  ],
  voter_id_url: [
    {
      fileUrl: { type: String },
      fileId: { type: String }
    }
  ],
  driving_license_url: [
    {
      fileUrl: { type: String },
      fileId: { type: String }
    }
  ],
  other_doc_name: { type: String },
  other_doc_number: { type: String },
  other_doc_url: [
    {
      fileUrl: { type: String },
      fileId: { type: String }
    }
  ],

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

  // Call Tracking
  last_call_date: { type: Date },
  next_followup_date: { type: Date },
  feedback: { type: String },

  // Manual Loan Details
  manual_loan_details: {
    loan_id: { type: String },
    loan_purpose: { type: String },
    agreement_number: { type: String },
    item_name: { type: String },
    item_serial_number: { type: String },
    item_description: { type: String },
    loan_amount: { type: Number },
    processing_fee: { type: Number },
    insurance_fee: { type: Number },
    emi_amount: { type: Number },
    emi_start_date: { type: Date },
    emi_end_date: { type: Date },
    interest_rate: { type: Number },
  },

  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Auto-generate customer_code if creating new customer
CustomerSchema.pre('validate', async function (next) {
  this.updated_at = new Date();

  // Only auto-generate if this is a new customer and customer_code is not provided
  if (this.isNew && !this.customer_code) {
    try {
      const seq = await getNextSequence('customer');
      this.customer_code = `CUST${String(seq).padStart(6, '0')}`;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

module.exports = mongoose.model('Customer', CustomerSchema);

