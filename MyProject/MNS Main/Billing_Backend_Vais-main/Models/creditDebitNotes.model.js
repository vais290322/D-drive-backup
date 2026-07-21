import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true
  },
  itemName: {
    type: String,
    // required: true
  },
  originalQuantity: {
    type: Number,
    required: true
  },
  originalSellingPrice: {
    type: Number,
    required: true
  },
  newQuantity: {
    type: Number,
    required: true
  },
  newSellingPrice: {
    type: Number,
    required: true
  },
  editedAmount: {
    type: Number,
    required: true
  },
  hsnCode: {
    type: String
  },
  uom: {
    type: String
  },
  description: {
    type: String
  },
  cgst: {
    type: Number,
    default: 0
  },
  sgst: {
    type: Number,
    default: 0
  },
  igst: {
    type: Number,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  grossAmount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  afterAmount:{
    type: Number,
    // required: true
  },
  beforeAmount:{
    type: Number,
    // required: true
  },

  finalAmount:{
    type:Number,
    // required: true
  }



}, { _id: false });

const creditDebitNoteSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
    }, 
    date: {
      type: Date,
      required: true 
    },
    noteType: {
      type: String,
      enum: ['credit', 'debit'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    invoiceNumber: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true 
    },
    type: {
      type: String,
      enum: ['product', 'service', 'purchase'],
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    referenceNumber: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    // New fields added based on your payload
    products: [productSchema],
    invoiceDetails: {
      type: mongoose.Schema.Types.Mixed
    },
    totalGrossAmount: {
      type: Number,
      default: 0
    },
    totalTaxAmount: {
      type: Number,
      default: 0
    },
    appliedAmount:{
      type:Number,
      default:0
    },
    totalAfter:{
      type:Number,
      default:0
    },
    totalBefore:{
      type:Number,
      default:0
    },
    totalFinalAmount:{
      type:Number,
      default:0
    }
}, { timestamps: true });

const CreditDebitNote = mongoose.model('CreditDebitNote', creditDebitNoteSchema);
export default CreditDebitNote;