const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      default: "COD",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    dueAmount: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paidAt: {
      type: Date,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    razorpayPaymentId: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
    address: {
      type: String,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,   
    },
    postalCode: {
      type: String,
    },
    district: {
      type: String,
    },
    landmark: {
      type: String,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundStatus: {
      type: String,
      enum: ["Pending", "Processing", "Refunded", "Failed"],
      default: "Pending",
    },
    razorpayRefundId: {
      type: String,
    },
    delivery: {
      shipment_id: { type: String }, // e.g., "Envia", "Shiprocket"
      awb_code: { type: String },
      courier_company: { type: String }, // e.g., "Booked", "In Transit", "Delivered", "Failed"
      tracking_url: { type: String },
      status: { type: String }, // e.g., "Booked", "In Transit", "Delivered", "Failed"
      response: {}, // Store raw response or extra info
    },
    trackingDetails: [], // Store raw response or extra info
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
