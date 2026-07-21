import mongoose from 'mongoose';

const mailAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // User-defined label for identification
  label: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    enum: ['gmail', 'hostinger', 'godaddy', 'other'],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  // Stored password or app password (base64 encoded for basic obfuscation)
  encryptedPassword: {
    type: String,
    required: true,
  },
  // SMTP config – auto-filled for known domains, custom for 'other'
  host: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  secure: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('MailAccount', mailAccountSchema);
