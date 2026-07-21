import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import { fetchCustomerDashboardDataService } from "./dashboard.service.js";
import {
  fetchExpiringProductsService,
  fetchLowStockProductsService,
} from "../products/product.service.js";

export const fetchCustomerDashboardData = asyncHandler(async (req, res) => {
  const customerData = await fetchCustomerDashboardDataService();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        customerData,
        "Customer dashboard data fetched successfully",
      ),
    );
});

export const fetchLowStockProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const lowStockProducts = await fetchLowStockProductsService(page, limit);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        lowStockProducts,
        "Low stock products fetched successfully",
      ),
    );
});

export const fetchExpiringProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, days = 30 } = req.query;

  const expiringProducts = await fetchExpiringProductsService(
    page,
    limit,
    days,
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        expiringProducts,
        "Expiring products fetched successfully",
      ),
    );
});
