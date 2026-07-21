import express from "express";
import {
  createProformaInvoice,
  getAllProformaInvoices,
  getProformaInvoiceById,
  updateProformaInvoice,
  deleteProformaInvoice,
} from "../SnigdhaControllers/snigdhaProductProforma.controller.js";

const router = express.Router();

// Create new proforma invoice
router.post("/", createProformaInvoice);

// Get all proforma invoices
router.get("/", getAllProformaInvoices);

// Get single proforma invoice by ID
router.get("/:id", getProformaInvoiceById);

// Update proforma invoice
router.put("/:id", updateProformaInvoice);

// Delete proforma invoice
router.delete("/:id", deleteProformaInvoice);

export default router;
