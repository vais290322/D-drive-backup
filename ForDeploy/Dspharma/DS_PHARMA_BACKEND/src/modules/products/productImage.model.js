import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
  {
    // Row ID (Identity) - Auto-incremented unique identifier
    rid: {
      type: String,
      required: true,
    },

    images: [],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

const ProductImage = mongoose.model("ProductImage", productImageSchema);

export default ProductImage;
