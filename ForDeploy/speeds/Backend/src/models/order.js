import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
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
      enum: ["COD", "PREPAID"],
      default: "COD",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    // paidAmount: {
    //   type: Number,
    //   default: 0,
    // },
    // itemsPrice: {
    //   type: Number,
    //   required: true,
    // },
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
    // isAdmin: {
    //   type: Boolean,
    //   default: false,
    // },
    // razorpayPaymentId: {
    //   type: String,
    // },
    cancelledAt: {
      type: Date,
    },
    addressLine1: {
      type: String,
    },
    addressLine2: {
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
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    district: {
      type: String,
    },
    landmark: {
      type: String,
    },
    type: {
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
    // delivery: {
    //   channel_order_id: { type: String }, // e.g., "Envia", "Shiprocket"
    //   order_id: { type: String }, // e.g., "Envia", "Shiprocket"
    //   shipment_id: { type: String }, // e.g., "Envia", "Shiprocket"
    //   awb_code: { type: String },
    //   courier_company: { type: String }, // e.g., "Booked", "In Transit", "Delivered", "Failed"
    //   tracking_url: { type: String },
    //   status: { type: String }, // e.g., "Booked", "In Transit", "Delivered", "Failed"
    //   response: {},
    // },
    // trackingDetails: {
    //   type: Object,
    //   default: null,
    // }, // Store raw response or extra info
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
