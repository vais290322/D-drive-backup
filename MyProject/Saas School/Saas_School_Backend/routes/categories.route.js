import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/categories.controller.js";

const router = Router();

router.post("/", createCategory);
router.get("/:schoolId", getAllCategories);
router.put("/:id", updateCategory);
router.delete("/:id/:schoolId", deleteCategory);

export default router;
