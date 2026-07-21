import express from "express";
import {
  createDummySlip,
  getAllDummySlips,
  getDummySlipById,
  getDummySlipByVoucherNumber,
  updateDummySlip,
  deleteDummySlip,
  getDummySlipsByCustomerName,
  getDummySlipsByBankId,
  getDummySlipsByDateRange,
  getDummySlipsByInvoiceNumber
} from "../Controllers/dummySlip.controller.js";

const router = express.Router();

// Create a new dummy slip 
router.post("/create", createDummySlip);

// Get all dummy slips
router.get("/all", getAllDummySlips);

// Get a single dummy slip by ID
router.get("/:id", getDummySlipById);

// Get dummy slip by voucher number
router.get("/voucher/:voucherNumber", getDummySlipByVoucherNumber);

// Update a dummy slip
router.put("/update/:id", updateDummySlip);

// Delete a dummy slip
router.delete("/delete/:id", deleteDummySlip);

// Get dummy slips by customer name
router.get("/customer/:customerName", getDummySlipsByCustomerName);

// Get dummy slips by bank ID
router.get("/bank/:bankId", getDummySlipsByBankId);

// Get dummy slips by date range
router.get("/date-range", getDummySlipsByDateRange);

// Get dummy slips by invoice number
router.get("/invoice/:invoiceNumber", getDummySlipsByInvoiceNumber);

export default router;