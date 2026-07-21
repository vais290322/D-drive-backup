import { Router } from "express";
import {
  createSubCategory,
  updateSubCategory,
  getSubCategoryById,
  getAllSubCategories,
  getSubCategoriesByCategoryId,
  deleteSubCategory,
  searchSubCategories,
} from "../controllers/subCategoryController.js";
import createCloudinaryUpload from "../service/cloudinary.js";
import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";

const upload = createCloudinaryUpload("subcategory");
const router = Router();

router.post(
  "/",
  requireAuth,
  isAdmin(["ADMIN","STAFF"]),
  upload.single("image"),
  createSubCategory
);
router.put(
  "/:id",
  requireAuth,
  isAdmin(["ADMIN","STAFF"]),
  upload.single("image"),
  updateSubCategory
);
router.get("/", getAllSubCategories);
router.get("/search", searchSubCategories);
router.get("/category/:categoryId", getSubCategoriesByCategoryId);
router.get("/:id", getSubCategoryById);
router.delete("/:id", requireAuth, isAdmin(["ADMIN","STAFF"]), deleteSubCategory);

export default router;
