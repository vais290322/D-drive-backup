import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  source: { type: String, enum: ["credit_note", "debit_note", "apply", "manual"], required: true },
  ref: { type: String },
  invoiceNumber:{type:String},
  amount: { type: Number, required: true },
  appliedToInvoiceNumber: [],
  date: { type: Date, default: Date.now },
  usedInInvoice:{type:Number,default:0}

}, { _id: false });

const customerBalanceSchema = new mongoose.Schema({
  customerId: { type: String, required: true, index: true },
  customerName: { type: String },
  availableCredit: { type: Number, default: 0 },
  totalCredit: { type: Number, default: 0 },
  totalDebit: { type: Number, default: 0 },
  appliedInvoices:[{
    invoiceNumber:{type:String},
    amount:{type:Number},
    date:{type:Date,default:new Date()},
    source:{type:String},
    ref:{type:String},
    noteType:{type:String},
  }],
  history: [historySchema]
}, { timestamps: true });

export default mongoose.model("SnigdhaCustomerBalance", customerBalanceSchema);  

