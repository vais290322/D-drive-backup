import mongoose from 'mongoose';

const requestedProductSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
    },
    requestedBy: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    remarks: String,
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected', 'closed'],
      default: 'requested',
    },
  },
  {
    timestamps: true,
  },
);

const RequestedProduct = mongoose.model(
  'RequestedProduct',
  requestedProductSchema,
);

export default RequestedProduct;
