const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true
    },
    customer_phone: {
        type: String
    },
    product_name: {
        type: String,
        required: true
    },
    product_details: {
        type: String
    },
    purchase_date: {
        type: Date
    },
    invoice_no: {
        type: String
    },
    problem_statement: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'Reported', 'Solved'],
        default: 'Open'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
