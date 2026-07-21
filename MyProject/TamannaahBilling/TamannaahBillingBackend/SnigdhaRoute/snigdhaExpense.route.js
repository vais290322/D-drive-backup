import express from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByPaymentMethod,
  getExpensesByBankId
} from "../SnigdhaControllers/snigdhaExpense.controller.js";

const router = express.Router();
 
// Create a new expense
router.post("/create", createExpense);

// Get all expenses
router.get("/all", getAllExpenses);

// Get a single expense by ID
router.get("/:id", getExpenseById);

// Update an expense
router.put("/update/:id", updateExpense);

// Delete an expense
router.delete("/delete/:id", deleteExpense);

// Get expenses by payment method
router.get("/method/:method", getExpensesByPaymentMethod);

// Get expenses by bank ID
router.get("/bank/:bankId", getExpensesByBankId);

export default router;