import express from "express";
import { createUnit, deleteUnit, getAllUnits, getUnitById, updateUnit } from "../Controllers/productsUnit.controller.js";

const unitRouter = express.Router();


unitRouter
// Create a new unit
.post("/create-unit", createUnit)
// Get all units
.get("/all-units", getAllUnits)
// Get a single unit by ID
.get("/one-unit/:id", getUnitById)
// Update a unit
.put("/update-unit/:id", updateUnit)
// Delete a unit
.delete("/delete-unit/:id", deleteUnit);   
export default unitRouter;