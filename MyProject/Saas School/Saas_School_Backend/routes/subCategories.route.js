import {Router} from "express";
import { createSubCategories, deleteSubCategories, getAllSubCategories, getSubCategoriesByCategoryId, updateSubCategories } from "../controllers/subCategories.controller.js";
const router = Router();

router.post("/", createSubCategories);
router.get("/:schoolId", getAllSubCategories);
router.get("/:categoryId/:schoolId", getSubCategoriesByCategoryId);
router.put("/:id", updateSubCategories);
router.delete("/:id/:schoolId", deleteSubCategories);

export default router;
