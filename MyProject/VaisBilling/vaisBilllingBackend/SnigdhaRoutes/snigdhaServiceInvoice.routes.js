import express from "express";
import {
  createServiceInvoice,
  getAllServiceInvoices,
  getServiceInvoiceById,
  updateServiceInvoice,
  deleteServiceInvoice,
  getInvoicesByDateRange,
} from "../SnigdhaControllers/snigdhaServiceInvoice.controller.js";

const router = express.Router();

// Create new service invoice
router.post("/", createServiceInvoice);

// Get all service invoices
router.get("/", getAllServiceInvoices);

// Get invoices by date range
router.get("/date-range", getInvoicesByDateRange);

// Get single service invoice by ID
router.get("/:id", getServiceInvoiceById);

// Update service invoice
router.put("/:id", updateServiceInvoice);

// Delete service invoice
router.delete("/:id", deleteServiceInvoice);

export default router;
