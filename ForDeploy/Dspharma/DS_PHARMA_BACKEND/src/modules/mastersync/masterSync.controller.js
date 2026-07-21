import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
    syncMasterOrderDataService,
    syncMasterOrderDispatchDataService,
    syncMastersDataService,
} from "./masterSync.service.js";

export const syncMastersData = asyncHandler(async (req, res) => {
  try {
    const { datetime = "", index = 0 } = req.body || {};

    const data = await syncMastersDataService(datetime, index);

    res
      .status(200)
      .json(new ApiResponse(200, data, "Master data synced successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const syncMasterOrderDispatchData = asyncHandler(async (req, res) => {
  try {
    const { datetime = "", index = 0, type = "S" } = req.query;

    const { salesManId } = req.params;

    const data = await syncMasterOrderDispatchDataService(
      String(salesManId),
      datetime,
      index,
      type,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data,
          "Master order dispatch data synced successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const syncMasterOrderData = asyncHandler(async (req, res) => {
  try {
    const { salesManId } = req.params;
    const payload = req.body;

    const data = await syncMasterOrderDataService(
      String(salesManId),
      "S",
      payload,
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, data, "Master order data synced successfully"),
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
