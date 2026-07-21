const mongoose = require("mongoose");

const codSettingSchema = new mongoose.Schema(
  {
    isCODEnabled: {
      type: Boolean,
      default: true, // COD enabled by default
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cod", codSettingSchema);
