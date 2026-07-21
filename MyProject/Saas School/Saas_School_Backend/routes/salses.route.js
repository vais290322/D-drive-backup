import {Router} from "express";
import { createInvoice, deleteInvoice, getAllInvoice, updateInvoice } from "../controllers/salses.controller.js";


const router = Router();

router.post("/create-invoice/:schoolId", createInvoice);
router.get("/get-all-invoice/:schoolId", getAllInvoice);
router.put("/update-invoice/:schoolId/:id", updateInvoice);
router.delete("/delete-invoice/:schoolId/:id", deleteInvoice);

export default router;
