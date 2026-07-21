const mongoose = require("mongoose");

const maincategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      }, 
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("MainCategory", maincategorySchema);
