import mongoose from "mongoose";

const subItemSchema = new mongoose.Schema({
  serial: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  inward: {
    type: Number,
    default: 0, // Receipts
  },
  outward: {
    type: Number,
    default: 0, // Issues
  },
  closing: {
    type: Number,
    default: 0, // calculated as inward - outward
  }
});

const ledgerDaySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    serialNumber: {
      type: Number,
      required: true,
    },
    opening: {
      type: Number,
      default: 0,
    },
    receipts: {
      type: Number,
      default: 0,
    },
    issues: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    closing: {
      type: Number,
      default: 0,
    },
    subItems: [subItemSchema],
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one ledger day document per unique date
ledgerDaySchema.index({ user: 1, date: 1 }, { unique: true });

export const LedgerDay = mongoose.model("LedgerDay", ledgerDaySchema);
export const SubItem = mongoose.model("SubItem", subItemSchema);
