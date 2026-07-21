const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BankCustomer', required: true },
    account_number: { type: String, required: true, unique: true },
    account_type: { type: String, required: true },
    balance: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['active', 'closed', 'suspended'],
        default: 'active'
    },
    opening_date: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

BankAccountSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('BankAccount', BankAccountSchema);
