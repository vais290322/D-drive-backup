import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    images: [],
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
