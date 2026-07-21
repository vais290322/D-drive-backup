import { Router } from "express";
import { createProduct, getAllProducts } from "../controller/product.controller.js";



const router = Router();


router.post("/create", createProduct)
router.get('/get-products',getAllProducts)


export default router;