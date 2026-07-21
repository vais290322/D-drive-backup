import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { createOrderService } from "./order.service.js";

export const createOrder = asyncHandler(async (req, res) => {
  try {
    const { salesManId } = req.params;
    const payload = req.body;

    const data = await createOrderService(String(salesManId), payload);

    res
      .status(200)
      .json(
        new ApiResponse(200, data, "Order created successfully"),
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});