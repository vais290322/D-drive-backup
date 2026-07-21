const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Product description is required"],
    },
    brand: {
      type: String,
      required: [true, "Product brand is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    units: {
      type: String,
      required: [true, "Product units is required"],
      trim: true,
    },
    minimumQuantity: {
      type: Number,
    },
    wholeSellingPrice: {
      type: Number, 
    },
    costprice: {
      type: Number,
      required: [true, "Product price is required"],
    },
    sellingprice: {
      type: Number,
      required: [true, "Product price is required"],
    },
    stock: {
      type: Number,
      default: 0,
      required: [true, "Product stock is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    productType: {
      type: String,
      required: [true, "Product type is required"],
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    length: {
      type: Number,
    },
    width: {
      type: Number, 
    },
    height: {
      type: Number,  
    },
    weight: {
      type: Number,  
    },
    weightUnit: {
      type: String, 
    },
    lengthUnit: {
      type: String, 
    },
    type: {
      type: String,
    },
    image: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
