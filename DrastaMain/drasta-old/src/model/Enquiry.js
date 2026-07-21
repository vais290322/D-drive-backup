const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  contactNo: { type: String, required: [true, 'Contact number is required'] },
  subject: { type: String, required: [true, 'Subject is required'] },
  message: { type: String, required: [true, 'Enquiry message is required'] },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);