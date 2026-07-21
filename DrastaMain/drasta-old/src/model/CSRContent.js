const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CSRContentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    pdfLink: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('CSRContent', CSRContentSchema, 'csrcontent');