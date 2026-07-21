import mongoose from "mongoose";

const titleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    color: { type: String, default: "#000000" },
    speed: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Title = mongoose.model("Title", titleSchema);

export default Title;
