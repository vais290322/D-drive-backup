import mongoose from "mongoose";

const snigdhaCreditDebitNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }, 
  date: {
    type: Date,
    required: true 
  },
  noteType: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true 
  },
  type: {
    type: String,
    enum: ['product', 'service', 'purchase'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  referenceNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

const SnigdhaCreditDebitNote = mongoose.model('SnigdhaCreditDebitNote', snigdhaCreditDebitNoteSchema);
export default SnigdhaCreditDebitNote;