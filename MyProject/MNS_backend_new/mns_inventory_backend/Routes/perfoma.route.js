import express from "express";
import {
  createPerfoma,
  getAllPerfomas,
  getPerfomaById,
  getPerfomaByInvoiceNumber,
  updatePerfoma,
  deletePerfoma,
  getPerfomasByReceiverId
} from "../Controllers/perfoma.controller.js";

const router = express.Router();

// Create a new perfoma invoice
router.post("/create", createPerfoma);

// Get all perfoma invoices
router.get("/all", getAllPerfomas);

// Get a single perfoma invoice by ID
router.get("by-id/:id", getPerfomaById);

// Get perfoma invoice by invoice number
router.get("/invoice/:invoiceNumber", getPerfomaByInvoiceNumber);

// Update a perfoma invoice
router.put("/update/:id", updatePerfoma);

// Delete a perfoma invoice 
router.delete("/delete/:id", deletePerfoma);

// Get perfoma invoices by receiver ID
router.get("/receiver/:receiverId", getPerfomasByReceiverId);

export default router;