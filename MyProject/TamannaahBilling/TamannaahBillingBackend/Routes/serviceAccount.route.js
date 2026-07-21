import express from "express";
import {
  createServiceAccount,
  getAllServiceAccounts,
  getServiceAccountById,
  updateServiceAccount,
  deleteServiceAccount,
  getServiceAccountsByInvoiceId
} from "../Controllers/serviceAccount.controller.js";

const router = express.Router();

// Create a new service account entry
router.post("/create", createServiceAccount);

// Get all service account entries
router.get("/all", getAllServiceAccounts);

// Get a single service account entry by ID
router.get("/:id", getServiceAccountById);

// Update a service account entry (add payment details)
router.put("/update/:id", updateServiceAccount);

// Delete a service account entry
router.delete("/delete/:id", deleteServiceAccount);

// Get service account entries by invoice ID
router.get("/invoice/:invoiceId", getServiceAccountsByInvoiceId);

export default router;