import mongoose from "mongoose";

const stypeSchema = new mongoose.Schema(
  {
    // Row ID (Identity) - Auto-incremented unique identifier
    Rid: {
      type: Number,
      required: true,
    },

    // Sub Master Code - For company 'AREA' for category 'CATEGO', 'AREA', 'ROUT'
    Sgcode: {
      type: String,
      maxlength: 6,
      default: "",
    },

    // Submaster Code
    Scode: {
      type: String,
      maxlength: 6,
      required: true,
    },

    // Name of area/company/route
    Name: {
      type: String,
      maxlength: 45,
      required: true,
    },

    // 0=non deleted, 1=deleted
    Is_Deleted: {
      type: String,
      maxlength: 6,
      enum: ["0", "1"],
      default: "0",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: "stypes", // Collection name in MongoDB
  },
);

const Stype = mongoose.model("Stype", stypeSchema);

export default Stype;
