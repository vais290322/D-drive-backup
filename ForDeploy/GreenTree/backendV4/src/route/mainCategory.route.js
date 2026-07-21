const express = require("express");
const router = express.Router();
const {
  createMainCategory,
  getMainCategories,
  getMainCategoryById,
  updateMainCategory,
  deleteMainCategory,
  getMainCategoryByFilter,
  getMainCategoryall
} = require("../controller/mainCategory.controller");
const { authenticate, authorize } = require("../middleware/authorization");

// CRUD Routes
router.post("/maincategory",authenticate,authorize(["admin","staff"]), createMainCategory);
router.get("/maincategory",authenticate,authorize(["admin","staff"]),getMainCategories);
router.get("/maincategory/:name",authenticate,authorize(["admin","staff"]),getMainCategoryByFilter); //only product
router.get("/maincategorybyid/:id",authenticate,authorize(["admin","staff"]), getMainCategoryById);
router.get("/allmaincategory",authenticate,authorize(["admin","staff"]), getMainCategoryall);
router.put("/maincategory/:id",authenticate,authorize(["admin","staff"]), updateMainCategory);
router.delete("/maincategory/:id",authenticate,authorize(["admin","staff"]), deleteMainCategory);


router.get("/allmaincategoryuser", getMainCategoryall);



module.exports = router;
