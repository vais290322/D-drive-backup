import express from "express";
import {
  createServiceLedger,
  getAllServiceLedgers,
  getServiceLedgerById,
  updateServiceLedger,
  deleteServiceLedger,
} from "../SnigdhaControllers/snigdhaServiceLedgerAccount.controller.js";

const router = express.Router();

// Create new service ledger entry
router.post("/", createServiceLedger);

// Get all service ledger entries
router.get("/", getAllServiceLedgers);

// Get single service ledger by ID
router.get("/:id", getServiceLedgerById);

// Update service ledger
router.put("/:id", updateServiceLedger);

// Delete service ledger
router.delete("/:id", deleteServiceLedger);

export default router;
