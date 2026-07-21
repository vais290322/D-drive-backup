import mongoose from "mongoose";

const purchaseWindowSchema = new mongoose.Schema({

  invoiceNumber: { 
    type: String,
    required: true
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MnsPurchaseOrderNew',
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

  vendorName: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  transactionId: {
    type: String, 
    // required: true
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank',
    required: true
  },
  noteType: {
    type: String,
    // required: true
  },

}, { timestamps: true });

const PurchaseWindow = mongoose.model('PurchaseWindow', purchaseWindowSchema);
export default PurchaseWindow;