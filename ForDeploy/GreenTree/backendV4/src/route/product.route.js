const express = require("express");
const router = express.Router();
const { createCloudinaryUpload } = require("../config/cloudinary");
const upload = createCloudinaryUpload("products");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsUsersearch,
  getProductBycategoryuser,
  getProductByproducttypeuser,
  getProductByIduser,
  getProductBysubcategoryuser,
  getcatrgoryByproduct,
  getFilteredProducts,
  dashboard,
  getArriveProducts,
  getTopDealProducts
} = require("../controller/product.controller");                                                                                                                                                                       
const {authenticate, authorize} = require('../middleware/authorization.js');
// Single product upload - multiple images
router.post("/product",authenticate,authorize(["admin","staff"]), upload.array("images", 6), createProduct);
router.put("/product/:id",authenticate,authorize(["admin","staff"]), upload.array("images", 6), updateProduct);
router.get("/product",authenticate,authorize(["admin","staff"]), getProducts);
router.get("/product/:id",authenticate,authorize(["admin","staff"]), getProductById);
router.get("/dashboard",authenticate,authorize(["admin","staff"]), dashboard);
router.delete("/product/:id",authenticate,authorize(["admin","staff"]), deleteProduct);

router.get("/productusersearch", getProductsUsersearch);
router.get("/productusercategory/:category", getProductBycategoryuser);
router.get("/productusersubcategory/:subCategory", getProductBysubcategoryuser);
router.get("/productuserproducttype", getProductByproducttypeuser);
router.get("/productbyid/:id", getProductByIduser);
router.get("/categorywishproduct", getcatrgoryByproduct);
router.get("/getfilterproduct", getFilteredProducts);
router.get("/topdeal", getTopDealProducts);
router.get("/arriveproduct", getArriveProducts);

module.exports = router;

