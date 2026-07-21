const Cart = require("../models/cart.models");
const Product = require("../models/product.models");
const User = require("../models/register.models");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({ quiet: true });

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity=1 } = req.body;
    
    //  const user = await User.findOne({userId:userId});
    //  console.log(user);
    // Check if product exists
    const data = await Cart.findOne({product:productId , user:userId});
    if (data) return res.status(404).json({ message: "This Product already have cart" });
    
    const product = await Product.findById(productId);

    console.log(product, quantity);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = new Cart({
      user: userId,
      product: productId,
      quantity: quantity,
      price: product.sellingprice * quantity,
    });
    await cart.save();

    // Send WhatsApp message using Fast2SMS API
    // const user = await User.findById(userId);
    // const phone = user?.phone; // Ensure phone is in correct format (country code + number)

    // if (phone) {
    //   try {
    //     await axios.post(
    //       "https://www.fast2sms.com/dev/bulkV2",
    //       {
    //         route: "whatsapp",
    //         sender_id: "YOUR_WHATSAPP_SENDER_ID", // <-- Add this line with your approved Sender ID
    //         message: `Hi ${user.name}, you have added ${product.name} to your cart at Green Tree Nursery. This is a confirmation message. Click here ${process.env.CLIENT_URL}/product/${product._id} to checkout. Thank you.`,
    //         numbers: phone.toString(),
    //       },
    //       {
    //         headers: {
    //           authorization: process.env.FAST2SMS_API_KEY,
    //           "Content-Type": "application/json"
    //         }
    //       }
    //     );
    //   } catch (smsError) {
    //     console.error(
    //       "WhatsApp SMS error:",
    //       smsError?.response?.data || smsError.message
    //     );
    //     // Optionally, you can send a warning in the response
    //   }
    // }

    res.status(200).json({ message: "Cart updated successfully", data: cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart by user
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    // const user_id = await User.findOne({userId:userId});
    const cart = await Cart.find({ user:userId})
      .populate("product")
      .populate("user", "phone");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json({ message: "Cart found", data: cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product quantity in cart
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    // const user_id = await User.findOne({userId:userId});
    const id = req.params.id;
    const { quantity } = req.body;

    // Find the cart item for this user and product
    const cartItem = await Cart.findOne({ user: userId, _id: id });
    if (!cartItem)
      return res.status(404).json({ message: "Cart item not found" });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      message: "Cart item quantity updated successfully",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove product from cart
exports.removeCartItem = async (req, res) => {
  try {
    const id = req.params.id;
    const cart = await Cart.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Product removed from cart", data: cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.admingetCart = async (req, res) => {
  try {
    let { search = "", page = 1, limit = 10 } = req.query;

    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);

    let filter = {};

    if (search) {
      // 🔹 First, find matching users
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      // 🔹 Find matching products
      const products = await Product.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      // 🔹 Build filter using matched user & product IDs
      filter = {
        $or: [
          { user: { $in: users.map((u) => u._id) } },
          { product: { $in: products.map((p) => p._id) } },
        ],
      };
    }

    // 🔹 Count total items for pagination
    const total = await Cart.countDocuments(filter);

    // 🔹 Fetch carts with populated data
    const cart = await Cart.find(filter)
      .populate("product", "name price category image")
      .populate("user", "name email address phone street city state postalCode")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    if (!cart || cart.length === 0) {
      return res.status(404).json({ message: "No cart items found" });
    }

    res.status(200).json({
      message: "Cart fetched successfully",
      data: cart,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / perPage),
        currentPage,
        limit: perPage,
      },
    });
  } catch (error) {
    console.error("Error fetching admin cart:", error);
    res.status(500).json({ message: error.message });
  }
};
