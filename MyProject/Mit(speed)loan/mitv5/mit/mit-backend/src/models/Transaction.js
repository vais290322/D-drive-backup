const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transaction_id: { type: String, required: true, unique: true }, // Gateway ID (e.g., pay_...)
    loan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'failed', 'refunded', 'processed'],
        default: 'created'
    },
    method: { type: String }, // card, netbanking, wallet, upi
    gateway: { type: String, default: 'razorpay' },

    // Raw response from gateway for auditing
    raw_response: { type: Object },

    // Webhook event type if triggered by webhook
    event_type: { type: String },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

TransactionSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
