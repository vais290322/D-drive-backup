import mongoose from "mongoose";

const snigdhaDepositCreditSchema = new mongoose.Schema({
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
    ref: 'Invoice' || 'SnigdhaServiceInvoice' ,
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SnigdhaBank',
    required: true
  },
}, { timestamps: true });

const SnigdhaDepositCredit = mongoose.model('SnigdhaDepositCredit', snigdhaDepositCreditSchema);
export default SnigdhaDepositCredit;