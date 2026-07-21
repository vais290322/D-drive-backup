import express from "express";
import InvoiceController from "../Controllers/invoice-mns.controller.js";

const router = express.Router();

// Create a new invoice
router.post("/create", InvoiceController.createInvoice);

// Get all invoices (with optional filters)
router.get("/", InvoiceController.getInvoices);

// Get an invoice by ID
router.get("/:id", InvoiceController.getInvoiceById);

// Update an invoice by ID
router.put("/update/:id", InvoiceController.updateInvoice);

// Delete an invoice by ID
router.delete("/delete/:id", InvoiceController.deleteInvoice);

// Get an invoice by invoice number
router.get("/invoice-number/:invoiceNumber", InvoiceController.getInvoiceByInvoiceNumber);

// Get invoices by customer name
router.get("/customer/:customerName", InvoiceController.getInvoicesByCustomerName);

export default router;
