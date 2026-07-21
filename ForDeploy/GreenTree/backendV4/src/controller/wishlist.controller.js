const Wishlist = require("../models/wishlist.models");
const Product = require("../models/product.models");
const User = require("../models/register.models");

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    // const user = await User.findOne({userId:userId});

    // const wishlist = await Wishlist.findById({ products: productId });
    // if (wishlist) {
    //   return res.status(400).json({ message: "Product already in wishlist" });
    // }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const data = new Wishlist({
      user: userId,
      products: productId,
    });

    await data.save();
    // const populatedWishlist = await wishlist.populate("products");
    res.status(200).json({
      message: "Product added to wishlist",
      // wishlist: populatedWishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    // const user_id = await User.findOne({userId:userId});
    const wishlist = await Wishlist.find({ user:userId}).populate("products");
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res
      .status(200)
      .json({ message: "Wishlist Fetch Successfull", data: wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getadminWishlist = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);

    let filter = {};

    // 🔍 Search by user name or email
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      if (users.length > 0) {
        filter.user = { $in: users.map((u) => u._id) };
      } else {
        // If no users match, return empty result early
        return res.status(200).json({
          message: "No matching wishlists found",
          data: [],
          pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage,
            limit: perPage,
          },
        });
      }
    }

    // 🔹 Get total count for pagination
    const total = await Wishlist.countDocuments(filter);

    // 🔹 Fetch paginated data
    const wishlist = await Wishlist.find(filter)
      .populate("user", "name email phone")
      .populate("products")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (!wishlist || wishlist.length === 0) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({
      message: "Wishlist fetched successfully",
      data: wishlist,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / perPage),
        currentPage,
        limit: perPage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    // const user_id = await User.findOne({userId:userId});
    const { id } = req.params;
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    await Wishlist.findByIdAndDelete({_id:id},{ _id: id });

    res.status(200).json({
      message: "Product delete from wishlist",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
