import express from "express";
import {
  createLedger,
  getAllLedgers,
  getLedgerById,
  updateLedger,
  deleteLedger,
  getLedgersByInvoiceId,
} from "../SnigdhaControllers/snigdhaLadgerAccount.controller.js";

const router = express.Router();

// Create a new ledger entry
router.post("/create", createLedger);

// Get all ledger entries
router.get("/all", getAllLedgers);

// Get a single ledger entry by ID
router.get("/by-id/:id", getLedgerById);

// Update a ledger entry (add payment details)
router.put("/update/:id", updateLedger);

// Delete a ledger entry
router.delete("/delete/:id", deleteLedger);

// Get ledger entries by invoice ID
router.get("/invoice/:invoiceId", getLedgersByInvoiceId);

export default router;