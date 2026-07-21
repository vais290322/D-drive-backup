import { Router } from "express";
import { authToken } from "../middlewares/authToken.js";
import{
    uploadProductController,
    updateProductController,
    searchProductController,
    getProductDetailsController,
    getProductController,getCategoryWiseProductController,
    getCategoryProductOneController,filterProductController,
    productCategory,
    fetchCategory,
    deleteProductController,
    fetchAllProduct
} from "../controllers/product.controller.js"


const router=Router();

router.route("/upload-product").post(authToken,uploadProductController)

router.route("/delete-product").delete(authToken,deleteProductController)

router.route("/get-product").get(getProductController)

router.route("/update-product").post(authToken,updateProductController)

router.route("/get-categoryProduct").get(getCategoryProductOneController)

router.route("/category-product").post
(getCategoryWiseProductController)

router.route("/product-details").post
(getProductDetailsController)

router.route("/search").get
(searchProductController)

router.route("/filter-product").post
(filterProductController)

router.route("/product-category").post
(productCategory)

router.route("/fetch-product-category").get
(fetchCategory)

router.route("/fetch-all-product").get
(fetchAllProduct)



export default router