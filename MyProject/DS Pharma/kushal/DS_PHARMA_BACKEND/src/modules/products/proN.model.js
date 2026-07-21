import mongoose from "mongoose";

const proNSchema = new mongoose.Schema(
  {
    // Row ID (Identity) - Auto-incremented unique identifier
    Rid: {
      type: Number,
      required: true,
    },

    // Item Category Code
    CatCode: {
      type: String,
      maxlength: 6,
      default: "",
    },

    // Item Code
    Code: {
      type: String,
      maxlength: 22,
      required: true,
    },

    // Item Name
    Name: {
      type: String,
      maxlength: 45,
      required: true,
    },

    // Current Stock
    Stock: {
      type: Number,
      default: 0,
    },

    // General Remark (combination of MRP, Rate, Schemes, etc. - Not mandatory)
    Remark: {
      type: String,
      maxlength: 200,
      default: "",
    },

    // Name of Product Company (Marketed By)
    Company: {
      type: String,
      maxlength: 40,
      default: "",
    },

    // Shop Code
    ShopCode: {
      type: String,
      default: "",
    },

    // Maximum Retail Price
    MRP: {
      type: Number,
      default: 0.0,
    },

    // Billing Price
    Rate: {
      type: Number,
      default: 0.0,
    },

    // Deal on (10 if deal is 10+1)
    Deal: {
      type: Number,
      default: 0,
    },

    // Free Qty (1 if deal is 10+1)
    Free: {
      type: Number,
      default: 0,
    },

    // Purchase Price
    Prate: {
      type: Number,
      default: 0.0,
    },

    // If product is deleted or not (0=not deleted, 1=deleted)
    Is_Deleted: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    // Current Running batch of the item
    CurBatch: {
      type: String,
      maxlength: 12,
      default: "",
    },

    // Expiry Date of current batch
    Exp: {
      type: String,
      maxlength: 20,
      default: "",
    },

    // Product Company Code
    GCode: {
      type: String,
      maxlength: 6,
      default: "",
    },

    // Marg Code
    MargCode: {
      type: String,
      maxlength: 200,
      default: "",
    },

    // Conversion
    Conversion: {
      type: String,
      maxlength: 200,
      default: "",
    },

    // Salt
    Salt: {
      type: String,
      maxlength: 6,
      default: "",
    },

    // ENCODE
    ENCODE: {
      type: String,
      maxlength: 25,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: "products", // Collection name in MongoDB
  },
);

const ProN = mongoose.model("ProN", proNSchema);

export default ProN;
