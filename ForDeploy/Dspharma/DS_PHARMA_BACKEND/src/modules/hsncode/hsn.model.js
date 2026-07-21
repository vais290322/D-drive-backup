import mongoose from "mongoose";

const hsnSchema = new mongoose.Schema(
  {
    hsnCode: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    taxRate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const HSN = mongoose.model("HSN", hsnSchema);
export default HSN;
