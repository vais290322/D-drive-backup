import mongoose from "mongoose";

const productcategorySchema = new mongoose.Schema(
  {
    rid: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  productcategorySchema,
);

export default ProductCategory;
