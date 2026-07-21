import mongoose from "mongoose";

const dummySlipSchema = new mongoose.Schema({
  companyName:{
    type:String,
    required:true
  },
  companyAddress:{
    type:String,
    required:true
  },
  date: {
    type: Date,
    required: true
  },
  voucherNumber: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank'
  },
  invoiceNumber: {
    type: String,
    // required: true
  }
}, { timestamps: true });

const DummySlip = mongoose.model('DummySlip', dummySlipSchema);
export default DummySlip;