const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Title', titleSchema);