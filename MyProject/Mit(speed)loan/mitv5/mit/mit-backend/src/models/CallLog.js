const mongoose = require('mongoose');

const CallLogSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    next_followup_date: {
        type: Date
    },
    feedback: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
});

module.exports = mongoose.model('CallLog', CallLogSchema);
