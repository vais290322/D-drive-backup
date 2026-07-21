import mongoose from "mongoose";

const snigdhaWithdrawSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  personName: {
    type: String,
    required: true 
  },
  voucherNumber: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SnigdhaBank',
    required: true
  },
}, { timestamps: true });

const SnigdhaWithdraw = mongoose.model('SnigdhaWithdraw', snigdhaWithdrawSchema);
export default SnigdhaWithdraw;