import express from "express";
import { createCompany, deleteCompany, getCompanies, getCompanyById, updateCompany } from "../Controllers/company.controller.js";

const CompanyRouter = express.Router();

// Route to create a new company
CompanyRouter
.post("/create", createCompany)
.put("/update/:id", updateCompany)
.delete("/delete/:id", deleteCompany)
.get("/all", getCompanies)
.get("/get-one-by-id/:id",getCompanyById)


export default CompanyRouter;