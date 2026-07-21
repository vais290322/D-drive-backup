import { Router } from "express";
import {
  createShippingPrice,
  updateShippingPrice,
  deleteShippingPrice,
  getShippingPrices,
  shippingPriceInDistance
} from "../controllers/shippingController.js";
import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/", requireAuth, isAdmin(["ADMIN", "STAFF"]), createShippingPrice);

router.put("/:id",requireAuth,isAdmin(["ADMIN", "STAFF"]),updateShippingPrice);

router.delete( "/:id", requireAuth, isAdmin(["ADMIN", "STAFF"]), deleteShippingPrice);

router.get("/", requireAuth, isAdmin(["ADMIN", "STAFF"]), getShippingPrices);

router.post("/distance", requireAuth, isAdmin(["USER"]), shippingPriceInDistance);

export default router;
