import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
  {
    startRange: { type: Number, required: true },
    endRange: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ShippingPrice", shippingSchema);
