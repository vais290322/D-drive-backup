const mongoose = require('mongoose');

const BusinessSettingsSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    tagline: { type: String },
    logo_url: { type: String },
    address_line1: { type: String },
    address_line2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String },
    phone: { type: String },
    alternate_phone: { type: String },
    email: { type: String },
    website: { type: String },
    gstin: { type: String },
    pan: { type: String },
    bank_name: { type: String },
    bank_account: { type: String },
    bank_ifsc: { type: String },
    terms_conditions: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Auto-update updated_at on save
BusinessSettingsSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('BusinessSettings', BusinessSettingsSchema);
