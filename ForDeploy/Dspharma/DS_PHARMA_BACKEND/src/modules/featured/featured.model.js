import mongoose from "mongoose";

const featuredSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProN",
      required: true,
    },
  },
  { timestamps: true },
);

const Featured = mongoose.model("Featured", featuredSchema);

export default Featured;
