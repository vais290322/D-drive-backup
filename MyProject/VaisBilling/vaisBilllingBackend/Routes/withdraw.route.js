import express from "express";
import {
  createWithdraw,
  getAllWithdraws,
  getWithdrawById,
  updateWithdraw, 
  deleteWithdraw,
  getWithdrawsByBankId,
  getWithdrawsByType
} from "../Controllers/withdraw.controller.js";

const router = express.Router(); 

// Create a new withdrawal
router.post("/create", createWithdraw);

// Get all withdrawals
router.get("/all", getAllWithdraws);

// Get a single withdrawal by ID
router.get("/:id", getWithdrawById);

// Update a withdrawal
router.put("/update/:id", updateWithdraw);

// Delete a withdrawal
router.delete("/delete/:id", deleteWithdraw);

// Get withdrawals by bank ID
router.get("/bank/:bankId", getWithdrawsByBankId);

// Get withdrawals by transaction type
router.get("/type/:type", getWithdrawsByType);

export default router;