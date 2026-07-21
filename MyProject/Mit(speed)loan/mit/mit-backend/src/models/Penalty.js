const mongoose = require('mongoose');

const PenaltySchema = new mongoose.Schema({
    loan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
    penalty_type: {
        type: String,
        enum: ['cheque_bounce', 'ecs_return', 'late_emi', 'manual'],
        required: true
    },
    amount: { type: Number, required: true },
    reason: { type: String },
    applied_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    applied_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Penalty', PenaltySchema);
