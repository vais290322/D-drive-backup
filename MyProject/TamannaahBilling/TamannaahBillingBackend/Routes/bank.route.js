import express from "express";
import {
  createBank,
  getAllBanks,
  getBankById,
  updateBank,
  deleteBank,
  updateBankBalance
} from "../Controllers/bank.controller.js";

const router = express.Router();

// Create a new bank account
router.post("/create", createBank);

// Get all bank accounts
router.get("/all", getAllBanks);

// Get a single bank account by ID
router.get("/:id", getBankById);

// Update a bank account
router.put("/update/:id", updateBank);

// Delete a bank account
router.delete("/delete/:id", deleteBank);

// Update bank balance (deposit or deduction)
router.patch("/balance/:id", updateBankBalance);

export default router;