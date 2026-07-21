import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Example: Kilogram, Liter, Piece
    symbol: { type: String }, // Example: kg, L, pcs
    measure: { type: Object }, // Example: { conversionFactor: 1000, baseUnit: "g" }
  },
  { timestamps: true }
);

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;