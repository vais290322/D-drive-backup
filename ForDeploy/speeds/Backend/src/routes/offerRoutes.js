import express from "express";
import {
  createOffer,
  updateOffer,
  getOfferById,
  getAllOffers,
  deleteOffer,
} from "../controllers/offerController.js";
import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", requireAuth, isAdmin(["ADMIN","STAFF"]), createOffer);
router.put("/:id", requireAuth, isAdmin(["ADMIN","STAFF"]), updateOffer);
router.get("/:id", requireAuth, isAdmin(["ADMIN","STAFF"]), getOfferById);
router.get("/", getAllOffers);
router.delete("/:id", requireAuth, isAdmin(["ADMIN","STAFF"]), deleteOffer);
export default router;
