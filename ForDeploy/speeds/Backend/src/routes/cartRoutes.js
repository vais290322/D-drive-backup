import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartControllers.js";

import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", requireAuth, isAdmin(["USER"]), addToCart);
router.get("/all/:id", requireAuth, isAdmin(["USER"]), getUserCart);
router.put("/update/:id", requireAuth, isAdmin(["USER"]), updateCartItem);
router.delete("/remove/:id", requireAuth, isAdmin(["USER"]), removeCartItem);
router.delete("/clearcart/:id", requireAuth, isAdmin(["USER"]), clearCart);
export default router;
