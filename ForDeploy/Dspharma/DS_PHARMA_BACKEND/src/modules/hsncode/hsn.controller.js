import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { createHsnService, fetchHsnService } from "./hsn.service.js";

export const createHSN = asyncHandler(async (req, res) => {
  const { hsnCode, taxRate } = req.body;

  const hsn = await createHsnService({
    hsnCode,
    taxRate,
  });

  res.status(201).json(new ApiResponse(201, hsn, "HSN created successfully"));
});

export const fetchHSN = asyncHandler(async (req, res) => {
  const hsn = await fetchHsnService();

  res
    .status(200)
    .json(new ApiResponse(200, { hsn }, "HSN fetched successfully"));
});
