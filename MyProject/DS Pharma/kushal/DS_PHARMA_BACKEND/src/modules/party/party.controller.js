import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { getAllPartiesService, getPartiesService, getPartyDetailsService } from "./party.service.js";

export const getParties = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query = "" } = req.query;
  const { parties, totalPages, totalParties } = await getPartiesService(
    page,
    limit,
    query.trim().toLowerCase(),
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        parties,
        totalParties,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Parties fetched successfully",
    ),
  );
});

export const getAllParties = asyncHandler(async (req, res) => {
  const parties = await getAllPartiesService();

  res
    .status(200)
    .json(new ApiResponse(200, parties, "Parties fetched successfully"));
});

export const getPartyDetails = asyncHandler(async (req, res) => {
  const { rid } = req.params;

  const party = await getPartyDetailsService(rid);

  res
    .status(200)
    .json(new ApiResponse(200, party, "Party details fetched successfully"));
});
