
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({

  date: {
    type: Date,
    required: true
  },
  voucherNumber: {
    type: String,
    required: true
  },
  paymentPersonName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash', 'Bank',]
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank',
    // required: true
  }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;