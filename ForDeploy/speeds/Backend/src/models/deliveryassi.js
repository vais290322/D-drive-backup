import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    // quantity: { type: Number, required: true, min: 1, default: 1 },
    // price: { type: Number, required: true },
    // totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryAssignment", deliverySchema);