const mongoose = require("mongoose");

const shippingPriceSchema = new mongoose.Schema({
  pinCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("ShippingPrice", shippingPriceSchema);