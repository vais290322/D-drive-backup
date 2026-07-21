import { Router } from "express";
import {
  deleteProductImage,
  fetchProducts,
  getProductDetails,
  uploadProductImage,
} from "./product.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const productRoute = Router();

productRoute.get("/", fetchProducts);
productRoute.get("/:rid", getProductDetails);
productRoute.put("/uploadImage/:rid", uploadProductImage);

// productRoute.put("/uploadImage/:rid",
//   // upload.single("image"),
//   uploadProductImage,
// );
productRoute.patch("/deleteImage/:rid", deleteProductImage);

export default productRoute;
