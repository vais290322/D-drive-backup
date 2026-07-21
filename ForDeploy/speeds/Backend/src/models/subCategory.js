import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "sub_categories", timestamps: true }
);

export default mongoose.model("SubCategory", subCategorySchema);
