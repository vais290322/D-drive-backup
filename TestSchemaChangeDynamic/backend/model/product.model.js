// model/product.model.js
import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    data: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
