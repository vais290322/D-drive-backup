const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    title: { type: String, required: true },
    description: { type: String },
    value: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    stage: { type: String, default: 'prospecting' },
    probability: { type: Number, default: 0 },
    expected_close_date: { type: Date },
    actual_close_date: { type: Date },
    lost_reason: { type: String },
    priority: { type: String, default: 'medium' },
    notes: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

DealSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Deal', DealSchema);
