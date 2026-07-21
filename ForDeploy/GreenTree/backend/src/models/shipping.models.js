const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    awbNumber: {
      type: String,
      required: true,
    },
    courierCompany: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipping", shippingSchema);