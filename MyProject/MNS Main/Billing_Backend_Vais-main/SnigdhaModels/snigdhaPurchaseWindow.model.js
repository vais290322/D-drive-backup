import mongoose from "mongoose";

const snigdhaPurchaseWindowSchema = new mongoose.Schema({
  invoiceNumber: { 
    type: String,
    required: true
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SnigdhaPurchaseOrderNew',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  }, 
  vendorName: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SnigdhaBank',
    required: true
  },
  noteType: {
    type: String,
    // required: true
  },
}, { timestamps: true });

const SnigdhaPurchaseWindow = mongoose.model('SnigdhaPurchaseWindow', snigdhaPurchaseWindowSchema);
export default SnigdhaPurchaseWindow; 