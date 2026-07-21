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

PenaltySchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        // Handle both ObjectId and populated loan object
        if (ret.loan_id) {
            if (typeof ret.loan_id === 'object' && ret.loan_id._id) {
                // If populated, extract the _id
                ret.loan_id = ret.loan_id._id.toString();
            } else if (ret.loan_id.toString) {
                // If ObjectId, convert to string
                ret.loan_id = ret.loan_id.toString();
            }
        }
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Penalty', PenaltySchema);
