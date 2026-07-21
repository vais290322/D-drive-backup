import { Router } from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getAllWishlists,
  clearedWishlistItem,
} from "../controllers/wishlistController.js";
import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", requireAuth, isAdmin(["USER"]), addToWishlist);
router.delete("/:id", requireAuth, isAdmin(["USER"]), removeFromWishlist);
router.get("/:userId", requireAuth, isAdmin(["USER"]), getUserWishlist);
router.post("/clear/:id", requireAuth, isAdmin(["USER"]), clearedWishlistItem);
router.get("/", requireAuth, isAdmin(["ADMIN"]), getAllWishlists);

export default router;