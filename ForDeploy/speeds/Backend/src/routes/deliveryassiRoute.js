import { Router } from "express";
import {
  assignDelivery,
  getAssignments,
  getAllAssignments,
  updateStatus                                                                                                                                        
} from "../controllers/deliveryassiController.js";

import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/",requireAuth,isAdmin(["ADMIN","STAFF"]), assignDelivery);
router.get("/:id",requireAuth,isAdmin(["DELIVERY"]), getAssignments);
router.put("/:id",requireAuth,isAdmin(["DELIVERY"]), updateStatus);
router.get("/allassignments/:id",requireAuth,isAdmin(["ADMIN","STAFF"]), getAllAssignments);

export default router;