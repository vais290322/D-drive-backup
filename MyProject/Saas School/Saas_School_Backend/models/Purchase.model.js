import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true },
  categoryId: { type: Schema.Types.ObjectId, ref:"Categories", required: true },
  subCategoryId: { type: Schema.Types.ObjectId, ref:"SubCategories", },
  category: { type: String, required: true },
  subCategory: { type: String, },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
});

const purchaseSchema = new Schema(
  {
    schoolId: { type: String, required: true },
    purchaseNo: { type: String, required: true, unique: true },
    date: { type: Date, required: true, default: Date.now },

    sellerName: { type: String, required: true },
    sellerPhone: { type: String },
    sellerAddress: { type: String },

    items: {
      type: [itemSchema],
      required: true,
      validate: [
        (val) => val.length > 0,
        "At least one item is required",
      ],
    },

    grossAmount: { type: Number, required: true },
    discount: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    roundOff: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    createdBy:{
      name: { type: String },
      email: { type: String },
      role: { type: String },
    }
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);
