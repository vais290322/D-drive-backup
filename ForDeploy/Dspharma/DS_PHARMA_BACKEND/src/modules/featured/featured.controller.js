import {
  addToFeaturedService,
  removeFeaturedItemService,
  getFeaturedService,
} from "./featured.service.js";

export const addToFeatured = async (req, res) => {
  try {
    const { productId } = req.body;
    const featured = await addToFeaturedService(productId);
    res
      .status(201)
      .json({ message: "Featured updated successfully", data: featured });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const removeFeaturedItem = async (req, res) => {
  try {
    const featured = await removeFeaturedItemService(req.params.id);
    res
      .status(200)
      .json({ message: "Product removed from featured", data: featured });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getFeatured = async (req, res) => {
  try {
    const result = await getFeaturedService(req.query);
    res.status(200).json({ message: "Featured found", ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
