const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transaction_id: { type: String, unique: true, sparse: true }, // Gateway ID (e.g., pay_...)
    loan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'failed', 'refunded', 'processed', 'SUCCESS', 'PENDING', 'FAILED'],
        default: 'created'
    },
    payment_method: { type: String }, // card, netbanking, wallet, upi, phonepe
    gateway: { type: String, default: 'razorpay' },

    // PhonePe specific fields
    phonepe_merchant_transaction_id: { type: String, unique: true, sparse: true }, // loanId
    phonepe_transaction_id: { type: String, unique: true, sparse: true }, // PhonePe's transaction ID
    phonepe_utr: { type: String }, // Unique Transaction Reference from UPI

    // Webhook verification
    verified: { type: Boolean, default: false }, // Whether payment was verified with PhonePe API
    webhook_id: { type: String }, // Unique ID to track webhook processing
    webhook_data: { type: Object }, // Raw webhook payload

    // EMI update tracking (for idempotency)
    emi_updated: {
        emi_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EmiSchedule' },
        emi_number: { type: Number },
        previous_status: { type: String },
        new_status: { type: String }
    },

    // Raw response from gateway for auditing
    raw_response: { type: Object },

    // Event type if triggered by webhook
    event_type: { type: String },
    remarks: { type: String },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

TransactionSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

// Index for fast lookups
TransactionSchema.index({ phonepe_merchant_transaction_id: 1 });
TransactionSchema.index({ phonepe_transaction_id: 1 });
TransactionSchema.index({ loan_id: 1, created_at: -1 });
TransactionSchema.index({ webhook_id: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
