const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    mobile: { type: String },
    title: { type: String },
    department: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postal_code: { type: String },
    linkedin_url: { type: String },
    twitter_handle: { type: String },
    lead_source: { type: String },
    lead_status: { type: String, default: 'new' },
    notes: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

ContactSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Contact', ContactSchema);
