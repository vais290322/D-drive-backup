const mongoose = require('mongoose');

const BankTransactionSchema = new mongoose.Schema({
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount', required: true },
    transaction_type: {
        type: String,
        enum: ['deposit', 'withdrawal'],
        required: true
    },
    amount: { type: Number, required: true },
    balance_after: { type: Number, required: true },
    reference_note: { type: String },
    transaction_date: { type: Date, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BankTransaction', BankTransactionSchema);
