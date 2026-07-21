import mongoose from "mongoose";

const proNSchema = new mongoose.Schema(
  {
    // Row ID (Identity) - Auto-incremented unique identifier
    rid: {
      type: String,
      required: true,
    },

    // Item Category Code
    catcode: {
      type: String,
      maxlength: 6,
      default: "",
    },

    // Item Code
    code: {
      type: String,
      maxlength: 22,
      required: true,
    },

    // Item Name
    name: {
      type: String,
      maxlength: 45,
      required: true,
    },

    // Current Stock
    stock: {
      type: String,
      default: 0,
    },

    // General Remark (combination of MRP, Rate, Schemes, etc. - Not mandatory)
    remark: {
      type: String,
      maxlength: 200,
      default: "",
    },

    // Name of Product Company (Marketed By)
    company: {
      type: String,
      maxlength: 40,
      default: "",
    },

    // Shop Code
    shopcode: {
      type: String,
      default: "",
    },

    // Maximum Retail Price
    MRP: {
      type: String,
      default: 0.0,
    },

    // Billing Price
    Rate: {
      type: String,
      default: 0.0,
    },

    // Deal on (10 if deal is 10+1)
    Deal: {
      type: String,
      default: 0,
    },

    // Free Qty (1 if deal is 10+1)
    Free: {
      type: String,
      default: 0,
    },

    // Purchase Price
    Prate: {
      type: String,
      default: 0.0,
    },

    // If product is deleted or not (0=not deleted, 1=deleted)
    Is_Deleted: {
      type: String,
      enum: ["0", "1"],
      default: "0",
    },

    // Current Running batch of the item
    curbatch: {
      type: String,
      maxlength: 12,
      default: "",
    },

    // Expiry Date of current batch
    exp: {
      type: String,
      maxlength: 20,
      default: "",
    },

    // Product Company Code
    gcode: {
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
    remarks: {
      type: String,
      maxlength: 200,
      default: "",
    },
    Gcode6: {
      type: String,
      maxlength: 6,
      default: "",
    },
    ProductCode: {
      type: String,
      maxlength: 200,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: "products", // Collection name in MongoDB
  },
);

// Indexes for performance optimization
proNSchema.index({ Is_Deleted: 1 }); // Filter by deleted status
proNSchema.index({ rid: 1 }); // Lookup by rid
proNSchema.index({ name: 1 }); // Search by name
proNSchema.index({ company: 1 }); // Search by company
proNSchema.index({ code: 1 }); // Search by code
proNSchema.index({ stock: 1 }); // Filter by stock
proNSchema.index({ Is_Deleted: 1, name: 1 }); // Compound index for common queries

const ProN = mongoose.model("ProN", proNSchema);

export default ProN;
