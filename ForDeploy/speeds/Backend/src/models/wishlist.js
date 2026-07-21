import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth_users",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { collection: "wishlists", timestamps: true }
);

// Ensure a user can only have one wishlist entry per product
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);