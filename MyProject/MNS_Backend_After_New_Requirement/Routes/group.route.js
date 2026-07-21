import express from "express";
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
} from "../Controllers/group.controller.js";

const router = express.Router();

// Create a new group
router.post("/create", createGroup);

// Get all groups
router.get("/all", getAllGroups);

// Get a single group by ID
router.get("/:id", getGroupById);

// Update a group
router.put("/update/:id", updateGroup);

// Delete a group
router.delete("/delete/:id", deleteGroup);

export default router;