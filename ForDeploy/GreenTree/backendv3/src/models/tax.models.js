const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
    shippingCharge: {
        type: Number,
        required: true
    },
    taxPercentage: {
        type: Number,
        required: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tax', taxSchema);