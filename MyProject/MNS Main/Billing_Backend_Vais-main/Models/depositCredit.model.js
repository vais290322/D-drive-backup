import mongoose from "mongoose";

const depositCreditSchema = new mongoose.Schema({

  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true 
  },
  invoiceNumber: {
    type: String, 
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  invoiceType: {
    type: String,
    required: true
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InvoiceMns' || 'Service',
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank',
    required: true
  },
  noteType:{
    type:String
  }
  
}, { timestamps: true });

const DepositCredit = mongoose.model('DepositCredit', depositCreditSchema);
export default DepositCredit;