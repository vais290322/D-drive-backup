const mongoose = require('mongoose');

const creditDebitSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  particular: { type: String, required: true },
  type: { type: String, required: true },
  amountType: { type: String, required: true, enum: ['Credit', 'Debit'] },
  paymentMode: { type: String, required: true },
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
//   balance: { type: Number, required: true }
});
module.exports = mongoose.model('CreditDebit', creditDebitSchema);
