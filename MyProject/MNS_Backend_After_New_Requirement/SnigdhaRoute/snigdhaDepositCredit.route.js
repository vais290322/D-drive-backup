import express from "express";
import {
  createDepositCredit,
  getAllDepositCredits,
  getDepositCreditById,
  updateDepositCredit,
  deleteDepositCredit,
  getDepositCreditsByInvoiceId,
  getDepositCreditsByBankId
} from "../SnigdhaControllers/snigdhaDepositCredit.controller.js";

const router = express.Router();  

// Create a new deposit credit entry
router.post("/create", createDepositCredit);

// Get all deposit credit entries
router.get("/all", getAllDepositCredits);

// Get a single deposit credit entry by ID
router.get("/:id", getDepositCreditById);

// Update a deposit credit entry
router.put("/update/:id", updateDepositCredit);

// Delete a deposit credit entry
router.delete("/delete/:id", deleteDepositCredit);

// Get deposit credit entries by invoice ID
router.get("/invoice/:invoiceId", getDepositCreditsByInvoiceId);

// Get deposit credit entries by bank ID
router.get("/bank/:bankId", getDepositCreditsByBankId);

export default router;