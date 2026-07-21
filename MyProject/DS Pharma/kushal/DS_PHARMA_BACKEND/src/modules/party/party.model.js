import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    // Row ID (Identity) - Auto-incremented unique identifier
    rid: {
      type: Number,
      required: true,
    },

    // Area code
    area: {
      type: String,
      maxlength: 6,
      default: "",
    },

    // Ledger Code
    code: {
      type: String,
      maxlength: 6,
      required: true,
    },

    // Party Address
    address: {
      type: String,
      maxlength: 150,
      default: "",
    },

    // Name
    name: {
      type: String,
      maxlength: 45,
      required: true,
    },

    // Current Ledger balance
    balance: {
      type: Number,
      default: 0.0,
    },

    // PDC Amount of Ledger
    pdc: {
      type: Number,
      default: 0.0,
    },

    // Ledger Type (Group - Debtor, creditor, sales man etc)
    gcode: {
      type: String,
      maxlength: 6,
      default: "",
    },

    // Ledger Opening as on start of the financial year
    opening: {
      type: Number,
      default: 0.0,
    },

    // 1=deleted, 0=non deleted
    is_deleted: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    // Phone number-1
    phone1: {
      type: String,
      maxlength: 12,
      default: "",
    },

    // Phone number-2
    phone2: {
      type: String,
      maxlength: 12,
      default: "",
    },

    // Phone number-3
    phone3: {
      type: String,
      maxlength: 12,
      default: "",
    },

    // Phone number-4
    phone4: {
      type: String,
      maxlength: 12,
      default: "",
    },

    // Email Id-1
    email1: {
      type: String,
      maxlength: 45,
      default: "",
    },

    // Email Id-2
    email2: {
      type: String,
      maxlength: 45,
      default: "",
    },

    // Email Id-3
    email3: {
      type: String,
      maxlength: 45,
      default: "",
    },

    // Bank Name For Payment
    bank: {
      type: String,
      maxlength: 45,
      default: "",
    },

    // Bank Branch Name
    branch: {
      type: String,
      maxlength: 45,
      default: "",
    },

    // Marg Code
    margCode: {
      type: String,
      maxlength: 20,
      default: "",
    },

    // GSTN
    gstn: {
      type: String,
      maxlength: 15,
      default: "",
    },

    // DlNo
    dlNo: {
      type: String,
      maxlength: 45,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: "parties", // Collection name in MongoDB
  },
);

const Party = mongoose.model("Party", partySchema);

export default Party;
