import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactDetails: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["new", "read", "closed"], default: "new" },
  },
  { timestamps: true },
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
