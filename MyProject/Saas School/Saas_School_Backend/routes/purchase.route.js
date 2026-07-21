import {Router} from "express";
import { createPurchase, getAllPurchase, updatePurchase, deletePurchase } from "../controllers/purchase.controller.js";

const router = Router();

router.post("/create/:schoolId", createPurchase);
router.get("/all/:schoolId", getAllPurchase);
router.put("/update/:schoolId/:id", updatePurchase);
router.delete("/delete/:schoolId/:id", deletePurchase);

export default router;
