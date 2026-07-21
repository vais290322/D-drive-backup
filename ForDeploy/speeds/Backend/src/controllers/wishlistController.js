import Wishlist from "../models/wishlist.js";

export async function addToWishlist(req, res) {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "userId and productId are required" });
    }

    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Product already in wishlist" });
    }

    const wishlist = await Wishlist.create({ userId, productId });
    await wishlist.populate("productId");
    res
      .status(201)
      .json({ success: true, message: "Added to wishlist", data: wishlist });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Wishlist.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist item not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Removed from wishlist", data: deleted });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getUserWishlist(req, res) {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.find({ userId }).populate("productId");
    res
      .status(200)
      .json({
        success: true,
        message: "User wishlist fetched",
        data: wishlist,
      });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getAllWishlists(req, res) {
  try {
    const wishlists = await Wishlist.find()
      .populate("userId")
      .populate("productId");
    res
      .status(200)
      .json({
        success: true,
        message: "All wishlists fetched",
        data: wishlists,
      });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function clearedWishlistItem(req, res) {
  try {
    const userId = req.params.id;

    await Wishlist.deleteMany({ userId: userId });

    res.status(200).json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
