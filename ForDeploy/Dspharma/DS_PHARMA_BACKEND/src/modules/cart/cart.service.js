import mongoose from "mongoose";
import MargProducts from "../mastersync/marg_products.model.js";
import Cart from "./cart.model.js";

function parsePrice(val) {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number" && Number.isFinite(val)) return val;
  const cleaned = String(val).replace(/[^0-9.-]+/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export const addToCartService = async (
  userId,
  { rid, image, quantity = 1 },
) => {
  const existing = await Cart.findOne({ rid, user: userId });
  if (existing) {
    const error = new Error("This product is already in the cart");
    error.statusCode = 400;
    throw error;
  }

  const product = await MargProducts.findOne({ rid });
  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const qty = Number(quantity) || 0;
  const mrp = parsePrice(product?.MRP);

  const cart = new Cart({
    user: userId,
    image,
    rid,
    quantity: qty,
    price: mrp * qty,
  });

  await cart.save();
  return cart;
};

export const getCartService = async (userId) => {
  const cart = await Cart.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "marg_products",
        localField: "rid",
        foreignField: "rid",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    { $project: { __v: 0 } },
  ]);

  return cart;
};

export const updateCartItemService = async (cartId, userId, quantity) => {
  const cartItem = await Cart.findOne({ user: userId, _id: cartId });
  if (!cartItem) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  const product = await MargProducts.findOne({ rid: cartItem.rid });
  const unitPrice = parsePrice(product?.MRP);
  const qty = Number(quantity) || 0;

  cartItem.quantity = qty;
  cartItem.price = unitPrice * qty;
  await cartItem.save();

  return cartItem;
};

export const removeCartItemService = async (cartId) => {
  const cart = await Cart.findByIdAndDelete(cartId);
  return cart;
};
