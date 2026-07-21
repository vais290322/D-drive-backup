const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactUsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    contact: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    subject: {
        type: String,
        required: true
    },
    enquiry: {
        type: String,
        required: true
    },
    
});

module.exports = mongoose.model('ContactUs', ContactUsSchema);