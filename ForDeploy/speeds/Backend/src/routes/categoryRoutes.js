import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/", requireAuth, isAdmin(["ADMIN", "STAFF"]), createCategory);
router.get("/", getAllCategories);
router.put("/:id", requireAuth, isAdmin(["ADMIN", "STAFF"]), updateCategory);

export default router;
