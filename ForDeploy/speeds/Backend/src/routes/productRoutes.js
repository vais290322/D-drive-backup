import { Router } from "express";
import {
  createProduct,
  updateProduct,
  getProductById,
  getAllProducts,
  deleteProduct,
  searchProductInAllProducts,
  getProductsByCategoryId,
  getProductsBySubCategoryId,
} from "../controllers/productController.js";
import createCloudinaryUpload from "../service/cloudinary.js";
const uploadCategory = createCloudinaryUpload("product");
const upload = uploadCategory;
import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";
const router = Router();

router.post(
  "/",
  requireAuth,
  isAdmin(["ADMIN", "STAFF"]),
  upload.array("images", 5),
  createProduct
);
router.put(
  "/:id",
  requireAuth,
  isAdmin(["ADMIN", "STAFF"]),
  upload.array("images", 5),
  updateProduct
);
router.get("/:id", getProductById);
router.get("/", getAllProducts);
router.delete("/:id", deleteProduct);
router.get("/search", searchProductInAllProducts);
router.get("/category/:categoryId", getProductsByCategoryId);
router.get("/subcategory/:subCategoryId", getProductsBySubCategoryId);

export default router;
