import {
  addToWishlistService,
  getWishlistService,
  getAdminWishlistService,
  removeFromWishlistService,
} from "./wishlist.service.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productCode, image } = req.body;
    if (!productCode || !image)
      return res
        .status(400)
        .json({ message: "productCode and image are required" });
    const data = await addToWishlistService(userId, { productCode, image });
    res.status(201).json({ message: "Product added to wishlist", data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await getWishlistService(userId);
    if (!data || data.length === 0)
      return res.status(404).json({ message: "Wishlist not found" });
    res.status(200).json({ message: "Wishlist fetched successfully", data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getAdminWishlist = async (req, res) => {
  try {
    const result = await getAdminWishlistService(req.query);
    res
      .status(200)
      .json({ message: "Wishlist fetched successfully", ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    await removeFromWishlistService(req.params.id, userId);
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
