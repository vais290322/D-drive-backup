import mongoose from "mongoose";

const margUserSchema = new mongoose.Schema(
  {
    // Row ID (Identity) - Auto-incremented unique identifier
    RowId: {
      type: Number,
      required: true,
    },

    // Mobile App User ID
    UserId: {
      type: String,
      maxlength: 50,
      default: "",
    },

    // Mobile Name User Name
    Name: {
      type: String,
      maxlength: 100,
      required: true,
    },

    // User Address-1
    Address1: {
      type: String,
      maxlength: 60,
      default: "",
    },

    // User Address-2
    Address2: {
      type: String,
      maxlength: 60,
      default: "",
    },

    // User Address-3
    Address3: {
      type: String,
      maxlength: 60,
      default: "",
    },

    // User Phone
    Phone: {
      type: String,
      maxlength: 25,
      default: "",
    },

    // User Mobile
    Mobile: {
      type: String,
      maxlength: 25,
      default: "",
    },

    // User email id
    Email: {
      type: String,
      maxlength: 50,
      default: "",
    },

    // 1=deleted, 0=non deleted
    Is_Deleted: {
      type: String,
      maxlength: 1,
      enum: ["0", "1"],
      default: "0",
    },

    // User Type (S-Sales Man)
    Type: {
      type: String,
      maxlength: 1,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const MargUser = mongoose.model("MargUser", margUserSchema);

export default MargUser;
