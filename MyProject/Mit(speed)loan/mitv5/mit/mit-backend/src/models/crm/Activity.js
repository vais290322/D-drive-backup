const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    deal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
    activity_type: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    activity_date: { type: Date, required: true },
    duration_minutes: { type: Number },
    outcome: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
