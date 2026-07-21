import ApiError from "../../utils/apiError.js";
import HSN from "./hsn.model.js";

export const createHsnService = async ({ hsnCode, description, taxRate }) => {
  if (!hsnCode) {
    throw new ApiError(400, "HSN Code is required");
  }

  try {
    const alreadyExists = await HSN.findOne({ hsnCode });

    if (alreadyExists) {
      throw new ApiError(400, "HSN Code already exists");
    }

    const hsn = await HSN.create({ hsnCode, description, taxRate });
    return hsn;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchHsnService = async () => {
  try {
    const hsn = await HSN.find();
    return hsn;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
