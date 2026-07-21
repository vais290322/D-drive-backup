import express from "express";
import {
  createCreditDebitNote,
  approveCreditDebitNote,
  rejectCreditDebitNote,
  getAllCreditDebitNotes,
  getCreditDebitNoteById,
  deleteCreditDebitNote,
  getAllCustomerBlance,
  getCustomerBlanceByCustomerId,
  getAllVendorBlance,
  getVendorBlanceByVendorId
} from "../Controllers/creditDebitNotes.controller.js";

const router = express.Router();

// Create a new credit/debit note
router.post("/create", createCreditDebitNote);

// Get all customer balance
router.get("/mns-customer-blance", getAllCustomerBlance);
// get all vendor blance
router.get("/mns-vendor-blance", getAllVendorBlance);

// Get customer balance by customer ID
router.get("/mns-customer-blance/:customerId", getCustomerBlanceByCustomerId);
// Get vendor balance by vendor ID
router.get("/mns-vendor-blance/:vendorId", getVendorBlanceByVendorId);

// Approve a credit/debit note
router.put("/approve/:id", approveCreditDebitNote);

// Reject a credit/debit note
router.put("/reject/:id", rejectCreditDebitNote);

// Get all credit/debit notes
router.get("/all", getAllCreditDebitNotes);

// Get a single credit/debit note by ID
router.get("/:id", getCreditDebitNoteById);

// Delete a credit/debit note
router.delete("/delete/:id", deleteCreditDebitNote);

export default router;