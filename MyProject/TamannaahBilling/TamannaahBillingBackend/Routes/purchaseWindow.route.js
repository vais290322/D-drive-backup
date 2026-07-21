import express from "express";
import {
  createPurchaseWindow,
  getAllPurchaseWindows,
  getPurchaseWindowById,
  updatePurchaseWindow,
  deletePurchaseWindow,
  getPurchaseWindowsByInvoiceId,
  getPurchaseWindowsByBankId
} from "../Controllers/purchaseWindow.controller.js";

const router = express.Router();

// Create a new purchase window
router.post("/create", createPurchaseWindow);

// Get all purchase windows
router.get("/all", getAllPurchaseWindows);

// Get a single purchase window by ID
router.get("/:id", getPurchaseWindowById); 

// Update a purchase window
router.put("/update/:id", updatePurchaseWindow);

// Delete a purchase window
router.delete("/delete/:id", deletePurchaseWindow);

// Get purchase windows by invoice ID
router.get("/invoice/:invoiceId", getPurchaseWindowsByInvoiceId);

// Get purchase windows by bank ID
router.get("/bank/:bankId", getPurchaseWindowsByBankId);

export default router;