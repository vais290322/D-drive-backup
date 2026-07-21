import Party from "./party.model.js";

export const getPartiesService = async (page, limit, query = "") => {
  try {
    const parties = await Party.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
        { GSTIN: { $regex: query, $options: "i" } },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalParties = await Party.countDocuments({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
        { GSTIN: { $regex: query, $options: "i" } },
      ],
    });
    const totalPages = Math.ceil(totalParties / limit);

    return { parties, totalPages, totalParties };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const getPartyDetailsService = async (rid) => {
  try {
    const party = await Party.findOne({ rid });
    return party;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const getAllPartiesService = async () => {
  try {
    const parties = await Party.find();
    return parties;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
