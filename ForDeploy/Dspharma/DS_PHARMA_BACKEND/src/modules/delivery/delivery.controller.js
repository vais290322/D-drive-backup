import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import { registerDeliveryService } from "./delivery.service.js";
import ApiError from "../../utils/apiError.js";

export const registerDelivery = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!email || !phone) {
    throw new ApiError(400, "Email and phone are required");
  }

  const delivery = await registerDeliveryService(name, email, phone, address);
  res
    .status(201)
    .json(
      new ApiResponse(201, delivery, "Delivery registered successfully"),
    );
});

export const assignDelivery = asyncHandler(async (req, res) => {
  const { orderId, deliveryId } = req.body;

  if (!orderId || !deliveryId) {
    throw new ApiError(400, "Order ID and delivery ID are required");
  }

  const delivery = await assignDeliveryService(orderId, deliveryId);
  res
    .status(200)
    .json(new ApiResponse(200, delivery, "Delivery assigned successfully"));
});
