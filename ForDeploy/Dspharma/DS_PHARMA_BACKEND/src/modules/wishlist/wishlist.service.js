import mongoose from "mongoose";
import Wishlist from "./wishlist.model.js";
import Product from "../products/proN.model.js";
import Party from "../party/party.model.js";

export const addToWishlistService = async (userId, { productCode, image }) => {
  const existing = await Wishlist.findOne({ user: userId, productCode });
  if (existing) {
    const error = new Error("Product already in wishlist");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOne({ rid: productCode });
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const entry = new Wishlist({ user: userId, productCode, image });
  await entry.save();
  return entry;
};

export const getWishlistService = async (userId) => {
  const wishlist = await Wishlist.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "products",
        localField: "productCode",
        foreignField: "rid",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    { $project: { __v: 0 } },
  ]);
  return wishlist;
};

export const getAdminWishlistService = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  const currentPage = parseInt(page, 10);
  const perPage = parseInt(limit, 10);

  let filter = {};

  if (search) {
    const parties = await Party.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email1: { $regex: search, $options: "i" } },
        { phone1: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    if (parties.length === 0) {
      return {
        data: [],
        pagination: {
          total: 0,
          page: currentPage,
          limit: perPage,
          totalPages: 0,
        },
      };
    }
    filter.user = { $in: parties.map((p) => p._id) };
  }

  const total = await Wishlist.countDocuments(filter);
  const wishlist = await Wishlist.find(filter)
    .populate("user", "name phone1 email1 rid")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);

  return {
    data: wishlist,
    pagination: {
      total,
      page: currentPage,
      limit: perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
};

export const removeFromWishlistService = async (id, userId) => {
  const entry = await Wishlist.findOneAndDelete({ _id: id, user: userId });
  if (!entry) {
    const error = new Error("Wishlist item not found");
    error.statusCode = 404;
    throw error;
  }
  return entry;
};
