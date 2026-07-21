const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    // discountType: {
    //   type: String,
    //   enum: ["percentage", "flat"],
    //   required: true,
    // },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
    },
    categoryName:{
      type: String,
      require:[true, "Category is required"]
    },
    // minPurchase: {
    //   type: Number,
    //   default: 0,
    // },
    // maxDiscount: {
    //   type: Number,
    //   default: 0, // For percentage coupons, optional limit
    // },
    // expiryDate: {
    //   type: Date,
    //   required: [true, "Expiry date is required"],
    // },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
