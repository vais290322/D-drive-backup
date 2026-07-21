import express from "express";
import {
  createPurchaseAccount,
  getAllPurchaseAccounts,
  getPurchaseAccountById,
  updatePurchaseAccount,
  deletePurchaseAccount,
  getPurchaseAccountsByInvoiceId,
  getPurchaseAccountsByVendorName,
  getPurchaseAccountsByPaymentStatus
} from "../SnigdhaControllers/snigdhaPurchaseAccount.controller.js";

const router = express.Router();

// Create a new purchase account
router.post("/create", createPurchaseAccount);

// Get all purchase accounts
router.get("/all", getAllPurchaseAccounts);

// Get a single purchase account by ID
router.get("/:id", getPurchaseAccountById);

// Update a purchase account (add payment)
router.put("/update/:id", updatePurchaseAccount);

// Delete a purchase account
router.delete("/delete/:id", deletePurchaseAccount);

// Get purchase accounts by invoice ID
router.get("/invoice/:invoiceId", getPurchaseAccountsByInvoiceId);

// Get purchase accounts by vendor name
router.get("/vendor/:vendorName", getPurchaseAccountsByVendorName);

// Get purchase accounts by payment status
router.get("/status/:isPaid", getPurchaseAccountsByPaymentStatus);

export default router;