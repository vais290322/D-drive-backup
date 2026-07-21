import express from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getNotesByType,
  getNotesByInvoiceNumber,
  getNotesByDateRange,
  getNotesSummary,
  searchNotes,
  getNoteStatsByMonth,
  bulkDeleteNotes
} from "../SnigdhaControllers/snigdhaNotes.controller.js";

const router = express.Router();

// Create a new note
router.post("/", createNote);

// Get all notes
router.get("/", getAllNotes);

// Get notes summary
router.get("/summary", getNotesSummary);

// Get notes by date range
router.get("/date-range", getNotesByDateRange);

// Get notes statistics by month
router.get("/stats/monthly", getNoteStatsByMonth);

// Search notes
router.get("/search", searchNotes);

// Get notes by type
router.get("/type/:type", getNotesByType);

// Get notes by invoice number
router.get("/invoice/:invoiceNumber", getNotesByInvoiceNumber);

// Bulk delete notes
router.delete("/bulk", bulkDeleteNotes);

// Get, update, or delete a note by ID
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;