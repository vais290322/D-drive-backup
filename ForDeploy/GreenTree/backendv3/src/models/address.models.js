const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  street: { type: String },
  district: { type: String },
  landmark: { type: String },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Address", addressSchema);