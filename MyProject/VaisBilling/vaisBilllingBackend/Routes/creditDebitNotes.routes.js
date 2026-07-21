import express from "express";
import {
  createCreditDebitNote,
  approveCreditDebitNote,
  rejectCreditDebitNote,
  getAllCreditDebitNotes,
  getCreditDebitNoteById,
  deleteCreditDebitNote
} from "../Controllers/creditDebitNotes.controller.js";

const router = express.Router();

// Create a new credit/debit note
router.post("/create", createCreditDebitNote);

// Approve a credit/debit note
router.put("/approve/:id", approveCreditDebitNote);

// Reject a credit/debit note
router.put("/reject/:id", rejectCreditDebitNote);

// Get all credit/debit notes
router.get("/all", getAllCreditDebitNotes);

// Get a single credit/debit note by ID
router.get("/:id", getCreditDebitNoteById);

// Delete a credit/debit note
router.delete("/delete/:id", deleteCreditDebitNote);

export default router;