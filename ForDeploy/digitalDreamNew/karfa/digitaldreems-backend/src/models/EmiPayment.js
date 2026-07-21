const mongoose = require('mongoose');

const EmiPaymentSchema = new mongoose.Schema({
    loan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
    payment_date: { type: Date, required: true },
    amount_paid: { type: Number, required: true },
    payment_mode: {
        type: String,
        enum: ['cash', 'upi', 'bank_transfer'],
        required: true
    },
    transaction_reference: { type: String },
    collected_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    remarks: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmiPayment', EmiPaymentSchema);
