const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
    },
    website: {
        type: String,
    },
    industry_type: {
        type: String,
        required: true,
    },
    service_type: {
        type: String,
        required: true,
    },
    call_type: {
        type: String,
        enum: ['archive', 'warm-call', 'hot-call','Follow-up,'], // Example enum for call type
        required: true,
    },
    remarks: {
        type: String,
    },
    schedule_date: {
        type: Date,
        required: true,
    },
    created_by: {
        type: String, // Staff name
        required: true,
    },
    updated_by: {
        type: String, // Staff name who updated the record
    },
    updated_date: {
        type: Date,
        default: null,
    },
    staff_id: {
        type: String, // Keeping it as a string (ObjectId from another service)
        required: true,
    },
    role: {
        type: String, 
        default: null
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Client', clientSchema);
