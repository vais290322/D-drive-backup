const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
