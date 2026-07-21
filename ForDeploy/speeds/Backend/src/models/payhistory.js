import mongoose from "mongoose";

const payhistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth_users",
      required: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    Date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("payhistory", payhistorySchema);
