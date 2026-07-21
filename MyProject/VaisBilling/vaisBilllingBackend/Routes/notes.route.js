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
  getNotesByAmountType,
  getNotesByTitle,
  getFilteredNotes,
  getTotalAmountByType
} from "../Controllers/notes.controller.js";

const router = express.Router();

// Create a new note
router.post("/create", createNote); 

// Get all notes
router.get("/all", getAllNotes);

// Get a single note by ID
router.get("/:id", getNoteById);

// Update a note
router.put("/update/:id", updateNote);

// Delete a note
router.delete("/delete/:id", deleteNote);

// Get notes by type
router.get("/type/:type", getNotesByType);

// Get notes by invoice number
router.get("/invoice/:invoiceNumber", getNotesByInvoiceNumber);

// Get notes by date range
router.get("/date-range", getNotesByDateRange);

// Get notes by amount type
router.get("/amount-type/:amountType", getNotesByAmountType);

// Get notes by title
router.get("/title/:title", getNotesByTitle);

// Get notes with advanced filtering
router.get("/filter", getFilteredNotes);

// Get total amount of notes by type
router.get("/total-amount", getTotalAmountByType);

export default router;