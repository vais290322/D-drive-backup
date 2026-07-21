const mongoose = require('mongoose');

const BankCustomerSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    photo_url: { type: String },
    father_name: { type: String },
    mother_name: { type: String },
    date_of_birth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other', null] },
    marital_status: { type: String, enum: ['single', 'married', 'divorced', 'widowed', null] },
    nationality: { type: String },
    occupation: { type: String },
    annual_income: { type: Number },
    pan_number: { type: String },
    aadhaar_number: { type: String },
    alternate_phone: { type: String },
    emergency_contact_name: { type: String },
    emergency_contact_phone: { type: String },
    permanent_address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    alternate_bank_name: { type: String },
    alternate_bank_account_number: { type: String },
    alternate_bank_ifsc: { type: String },
    alternate_bank_branch: { type: String },
    next_payment_date: { type: Date },
    payment_feedback_history: [{
        date: { type: Date, default: Date.now },
        feedback: { type: String },
        created_by: { type: String },
        payment_date: { type: Date }
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

BankCustomerSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('BankCustomer', BankCustomerSchema);
