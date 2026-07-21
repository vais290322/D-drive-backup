import mongoose from "mongoose";

const imprestFundSchema = new mongoose.Schema({
 
  accountHolderName: {
    type: String,
    required: true
  },
  openingAmount: {
    type: Number,
    default: 0,
    required: true
  },
  openingDate: {
    type: Date,
    default: Date.now
  },
  deductionAmount: {
    type: Number,
    default: 0
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  updateAmountAndDate: [
    {
      amount: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    } 
  ],
  beforeUpdateAmount: [
    {
      amount: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
 
}, { timestamps: true });

const ImprestFund = mongoose.model('ImprestFund', imprestFundSchema);
export default ImprestFund;

