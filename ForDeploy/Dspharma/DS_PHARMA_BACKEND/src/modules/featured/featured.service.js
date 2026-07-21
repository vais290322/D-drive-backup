import Featured from "./featured.model.js";
import Product from "../products/proN.model.js";

export const addToFeaturedService = async (productId) => {
  const existing = await Featured.findOne({ productId });
  if (existing) {
    const error = new Error("This product is already featured");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const featured = new Featured({ productId });
  await featured.save();
  return featured;
};

export const removeFeaturedItemService = async (id) => {
  const featured = await Featured.findByIdAndDelete(id);
  if (!featured) {
    const error = new Error("Featured item not found");
    error.statusCode = 404;
    throw error;
  }
  return featured;
};

export const getFeaturedService = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  const currentPage = parseInt(page, 10);
  const perPage = parseInt(limit, 10);
  const skip = (currentPage - 1) * perPage;

  const populateMatch = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

  const featured = await Featured.find({})
    .populate({ path: "productId", match: populateMatch })
    .skip(skip)
    .limit(perPage)
    .lean();

  const filteredFeatured = featured.filter((item) => item.productId);

  const all = await Featured.find({})
    .populate({ path: "productId", match: populateMatch, select: "_id" })
    .lean();

  const total = all.filter((item) => item.productId).length;

  return {
    data: filteredFeatured,
    pagination: {
      total,
      page: currentPage,
      limit: perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
};
