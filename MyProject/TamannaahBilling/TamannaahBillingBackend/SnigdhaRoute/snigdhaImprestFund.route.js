import express from "express";
import {
  createImprestFund,
  getAllImprestFunds,
  getImprestFundById,
  updateImprestFund,
  deductFromImprestFund,
  deleteImprestFund, 
  getImprestFundHistory
} from "../SnigdhaControllers/snigdhaImprestFund.controller.js";

const router = express.Router(); 

// Create a new imprest fund
router.post("/create", createImprestFund);

// Get all imprest funds
router.get("/all", getAllImprestFunds);

// Get a single imprest fund by ID
router.get("/:id", getImprestFundById);

// Update an imprest fund (add amount)
router.put("/update/:id", updateImprestFund);

// Deduct from imprest fund
router.put("/deduct/:id", deductFromImprestFund);

// Delete an imprest fund
router.delete("/delete/:id", deleteImprestFund);

// Get imprest fund history
router.get("/history/:id", getImprestFundHistory);

export default router;