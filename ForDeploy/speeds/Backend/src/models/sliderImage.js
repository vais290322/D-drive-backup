import mongoose from "mongoose";

const SliderImageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    caption: { type: String },
    link: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { collection: "slider_images", timestamps: true }
);

export default mongoose.model("SliderImage", SliderImageSchema);
