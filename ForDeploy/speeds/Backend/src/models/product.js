import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
    },
    sku: {
      type: String,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    openingStock: {
      type: Number,
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    weight:{
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
      reviewCount: {
      type: Number,
      default: 0,
    },
    dimensions: {
      type: String,
      default: "",
    },
    images: [
      // {
      //   url: {
      //     type: String,
      //     required: true,
      //   },
      //   publicId: {
      //     type: String,
      //     required: true,
      //   },
      // },
    ],
    stockQuantity: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "products", timestamps: true }
);

export default mongoose.model("Product", productSchema);