import mongoose from "mongoose";

const bankSchema = new mongoose.Schema({
 
  accountHolderName: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  ifscCode: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  openingAmount: {
    type: Number,
    default: 0,
    required: true
  },

  deductionAmount: {
    type: Number,
    default: 0
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  depositeAmount: {
    type: Number,
    default: 0
  },
  totalProductsNotesAmount: {
    type: Number,
    default: 0
  },
  
  totalServicesNotesAmount: {
    type: Number,
    default: 0
  },
  totalPurchasesNotesAmount: {
    type: Number, 
    default: 0
  },
  totalMoneyTransferCredit:{
    type:Number,
    default:0
  },
  totalMoneyTransferDebit:{
    type:Number,
    default:0
  },
  isDefault: { type: Boolean, default: false }

 
}, { timestamps: true });

const Bank = mongoose.model('Bank', bankSchema);
export default Bank;

