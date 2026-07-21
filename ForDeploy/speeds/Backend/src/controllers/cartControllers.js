import Cart from "../models/cart.js";
import Product from "../models/product.js";

export async function addToCart(req, res) {
  try {
    const { productId, quantity = 1, userId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "userId and productId are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if product already exists in user's cart
    // let cartItem = await Cart.findOne({ user: userId, product: productId });
    
    // if (cartItem) {
    //   // Update quantity if product already in cart
    //   cartItem.quantity += quantity;
    //   cartItem.totalAmount = cartItem.quantity * cartItem.price;
    //   await cartItem.save();
    //   await cartItem.populate("product");
    //   return res.status(200).json({ success: true, message: "Cart updated", data: cartItem });
    // }

    // Create new cart item if not exist
    const cart = await Cart.create({
      user: userId,
      product: productId,
      quantity,
      price: product.price,
      totalAmount: product.price * quantity,
    });

    await cart.populate("product");

    res.status(201).json({ success: true, message: "Item added to cart", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export async function getUserCart(req, res) {
  try {
    const userId = req.params.id;

    const cart = await Cart.find({ user: userId }).populate("product");

    if (!cart) {
      return res.status(400).json({ success: true, message: "Cart is empty"});
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateCartItem(req, res) {
  try {
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.product = productId;
    cart.quantity = quantity;
    cart.price = cart.price; // assuming price remains same
    cart.totalAmount = cart.quantity * cart.price;

    await cart.save();

    res.status(200).json({ success: true, message: "Cart updated", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function removeCartItem(req, res) {
  try {
    const { id } = req.params;

    const cart = await Cart.findOneAndDelete({_id: id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    res.status(200).json({ success: true, message: "Item removed", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function clearCart(req, res) {
  try {
    const userId = req.params.id;

    await Cart.deleteMany({ user: userId });

    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

