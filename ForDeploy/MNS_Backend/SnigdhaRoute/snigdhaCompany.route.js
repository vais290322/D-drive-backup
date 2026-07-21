import express from "express";
import { createCompany, deleteCompany, getCompanies, getCompanyById, updateCompany } from "../SnigdhaControllers/snigdhaCompany.controller.js";

const snigdhaCompanyRouter = express.Router();

// Route to create a new company
snigdhaCompanyRouter
.post("/create", createCompany)
.put("/update/:id", updateCompany)
.delete("/delete/:id", deleteCompany)
.get("/all", getCompanies)
.get("/get-one-by-id/:id",getCompanyById)


export default snigdhaCompanyRouter;