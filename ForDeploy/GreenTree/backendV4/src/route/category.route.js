const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryall,
  getCategorybyid,
  updateCategory,
  deleteCategory,
} = require("../controller/category.controller");
const { createCloudinaryUpload } = require("../config/cloudinary");
const uploadCategory = createCloudinaryUpload("categories");
const upload = uploadCategory;
const { authenticate, authorize } = require("../middleware/authorization");

// CRUD ROUTES
router.post("/category",authenticate,authorize(["admin","staff"]), upload.single("image"), createCategory);
router.get("/category",authenticate,authorize(["admin","staff"]), getCategories);
router.get("/allcategory",authenticate,authorize(["admin","staff"]), getCategoryall);
router.get("/category/:id",authenticate,authorize(["admin","staff"]), getCategorybyid);
router.put("/category/:id",authenticate,authorize(["admin","staff"]), upload.single("image"), updateCategory);
router.delete("/category/:id",authenticate,authorize(["admin","staff"]), deleteCategory);


// router.post("/category", upload.single("image"), createCategory);
// router.get("/category", getCategories);
// router.get("/allcategory", getCategoryall);
// router.get("/category/:id", getCategorybyid);
// router.put("/category/:id", upload.single("image"), updateCategory);
// router.delete("/category/:id", deleteCategory);


router.get("/userallcategory",getCategoryall);

module.exports = router;
