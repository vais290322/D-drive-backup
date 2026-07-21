import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true 
  },
  lotNo: {
    type: String,
    required: true
  },
  dNo: {
    type: String,
    required: true
  },
  dName: {
    type: String,
    required: true
  },
  item_id:{
    type: String,
    required: true
  },
  embroideryMan: {
    type: String,
    required: true
  },
  totalPrice:{
    type: Number,
    default:0
  },
  date: {
    type: Date,
    required: true
  },
  sizes: [sizeSchema]
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);