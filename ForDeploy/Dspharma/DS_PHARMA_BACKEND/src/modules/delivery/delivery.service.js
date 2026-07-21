import ApiError from "../../utils/apiError.js";
import margOrder from "../order/order.model.js";
import { DeliveryAgent, DeliveryAssignment } from "./delivery.model.js";

export const registerDeliveryService = async (name, email, phone, address) => {
  try {
    const existingDelivery = await DeliveryAgent.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingDelivery) {
      throw new ApiError(400, "Delivery agent already exists");
    }

    const delivery = await DeliveryAgent.create({
      name,
      email,
      phone,
      address,
    });

    return delivery;
  } catch (error) {
    throw new ApiError(500, "Failed to register delivery");
  }
};

export const assignDeliveryService = async (orderId, deliveryAgentId) => {
  try {
    const validOrderId = await margOrder.findOne({ orderId });

    if (!validOrderId) {
      throw new ApiError(404, "Invalid order ID");
    }

    const checkIfAlreadyAssigned = await DeliveryAssignment.findOne({
      orderId,
    });

    if (checkIfAlreadyAssigned) {
      throw new ApiError(400, "Order is already assigned to a delivery agent");
    }

    const validDeliveryId = await DeliveryAgent.findOne({ deliveryAgentId });

    if (!validDeliveryId) {
      throw new ApiError(404, "Invalid delivery agent ID");
    }

    const delivery = await DeliveryAssignment.create({
      orderId,
      deliveryAgentId,
    });

    return delivery;
  } catch (error) {
    throw new ApiError(500, "Failed to assign delivery");
  }
};
