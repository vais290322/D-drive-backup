import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    discountPercentage: { type: Number, required: true },
    active: { type: Boolean, default: true },
    validFrom: { type: Date, default: Date.now },
    validTo: { type: Date , default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Offer", OfferSchema);