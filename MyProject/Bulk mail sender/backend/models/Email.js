import mongoose from 'mongoose';

// Make sure the footer schema includes the phone field
const emailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  footer: {
    name: String,
    address: String,
    phone: String,  // Ensure this field exists
    logo: String,
    depertment: String,
    message: String,
  },
  recipients: [{
    email: String,
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    error: String
  }],
  attachments: [{
    filename: String,
    path: String,
    originalname: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Email', emailSchema);