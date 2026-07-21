import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  source: { type: String, enum: ["credit_note", "overpayment", "apply", "manual"], required: true },
  ref: { type: String },
  invoiceNumber:{type:String},
  amount: { type: Number, required: true },
  appliedToInvoiceNumber: [],
  date: { type: Date, default: Date.now },
  usedInInvoice:{type:Number,default:0}
}, { _id: false });

const vendorBalanceSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, index: true },
  vendorName: { type: String },
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

export default mongoose.model("SnigdhaVendorBalance", vendorBalanceSchema); 