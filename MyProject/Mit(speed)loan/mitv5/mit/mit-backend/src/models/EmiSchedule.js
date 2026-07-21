const mongoose = require('mongoose');

const EmiScheduleSchema = new mongoose.Schema({
    loan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
    emi_number: { type: Number, required: true },
    due_date: { type: Date, required: true },
    principal_component: { type: Number, required: true },
    interest_component: { type: Number, required: true },
    emi_amount: { type: Number, required: true },
    opening_balance: { type: Number, required: true },
    closing_balance: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'paid', 'overdue', 'partial'],
        default: 'pending'
    },
    paid_amount: { type: Number, default: 0 },
    paid_date: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Auto-update updated_at on save 
EmiScheduleSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
}); 

module.exports = mongoose.model('EmiSchedule', EmiScheduleSchema);
