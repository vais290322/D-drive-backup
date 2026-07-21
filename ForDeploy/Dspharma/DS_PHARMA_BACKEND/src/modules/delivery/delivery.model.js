import mongoose from "mongoose";

const deliveryAgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true },
);

export const DeliveryAgent = mongoose.model(
  "DeliveryAgent",
  deliveryAgentSchema,
);

const deliveryAssignmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    deliveryAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAgent",
    },
    status: {
      type: String,
      enum: ["assigned", "picked_up", "delivered", "cancelled"],
      default: "assigned",
    },
  },
  { timestamps: true },
);

export const DeliveryAssignment = mongoose.model(
  "DeliveryAssignment",
  deliveryAssignmentSchema,
);
