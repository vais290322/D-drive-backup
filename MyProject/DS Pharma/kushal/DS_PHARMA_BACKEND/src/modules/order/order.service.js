import { fetchMasterOrderData } from "../../marg/fetchMasterData.js";
import ApiError from "../../utils/apiError.js";

export const createOrderService = async (salesManId, payload) => {
  try {
    const newOrder = await fetchMasterOrderData(salesManId, payload);

    console.log("newOrder", newOrder);

    return newOrder;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
