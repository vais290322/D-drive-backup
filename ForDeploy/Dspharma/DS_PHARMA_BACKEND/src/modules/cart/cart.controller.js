import {
  addToCartService,
  getCartService,
  updateCartItemService,
  removeCartItemService,
} from "./cart.service.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await addToCartService(userId, req.body);
    res.status(201).json({ message: "Cart updated successfully", data: cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get cart by user
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await getCartService(userId);

    res.status(200).json({ message: "Cart found", data: cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Update product quantity in cart
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;
    await updateCartItemService(id, userId, quantity);
    res
      .status(200)
      .json({ message: "Cart item quantity updated successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Remove product from cart
export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await removeCartItemService(id);
    res.status(200).json({ message: "Product removed from cart", data: cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
