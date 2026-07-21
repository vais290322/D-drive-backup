const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  admingetCart
  // clearCart,
} = require("../controller/cart.controller");
const { authenticate, authorize } = require("../middleware/authorization");
// Add or update product quantity
router.post("/cartadd",authenticate,authorize(["user"]), addToCart);
router.get("/cartget",authenticate,authorize(["user"]), getCart);
router.put("/cartupdate/:id",authenticate,authorize(["user"]), updateCartItem);
router.delete("/cartdelete/:id",authenticate,authorize(["user"]), removeCartItem);
router.get("/admincartget",authenticate,authorize(["admin","staff"]), admingetCart);
module.exports = router;
