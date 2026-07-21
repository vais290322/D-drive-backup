import ResponseHandler from "../Middelwares/ResponseHandler.js";
// import Company from "../Models/company.model.js";
import SnigdhaCompany from "../SnigdhaModels/snigdhaCompany.model.js"

// Create a new company
export const createCompany = async (req, res) => {
    try {
        const { companyName, companyAddress, panNo, GST_IN, ph_no, email } = req.body;

        // Check if required fields are present
        if (!companyName || !companyAddress || !panNo || !GST_IN || !ph_no || !email) {
            return ResponseHandler.error(res, "All fields are required", 400);
        }

        // Check if company already exists (based on PAN or GST)
        const existingCompany = await SnigdhaCompany.findOne({ 
            $or: [{ panNo }, { GST_IN }]
        });

        if (existingCompany) {
            return ResponseHandler.error(res, "Company with this PAN or GST already exists", 400);
        }

        // Create new company
        const company = await SnigdhaCompany.create(req.body);
        ResponseHandler.success(res, company, "Company created successfully", 201);
    } catch (error) {
        // Handle Mongoose Validation Errors
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return ResponseHandler.error(res, "Validation failed", 400, errors);
        }

        // Handle Duplicate Key Errors (MongoDB E11000 error)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return ResponseHandler.error(res, `${field} already exists`, 400);
        }

        // Handle other unexpected errors
        ResponseHandler.error(res, "Internal Server Error", 500);
    }
};

// Get all companies
export const getCompanies = async (req, res) => {
    try {
        const companies = await SnigdhaCompany.find();

        // If no companies found
        if (!companies || companies.length === 0) {
            return ResponseHandler.error(res, "No companies found", 404);
        }

        ResponseHandler.success(res, companies, "Companies fetched successfully");
    } catch (error) {
        ResponseHandler.error(res, "Internal Server Error", 500);
    }
};

export const getCompanyById = async (req, res) => {
    try {
      const { id } = req.params;
      const company = await SnigdhaCompany.findById(id);
  
      // If the company is not found
      if (!company) {
        return ResponseHandler.error(res, "Company not found", 404);
      }
  
      ResponseHandler.success(res, company, "Company fetched successfully");
    } catch (error) {
      ResponseHandler.error(res, "Internal Server Error", 500);
    }
  };

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedCompany = await SnigdhaCompany.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedCompany) {
            return ResponseHandler.error(res, "Company not found", 404);
        }

        ResponseHandler.success(res, updatedCompany, "Company updated successfully");
    } catch (error) {
        console.error("Error updating company:", error);
        ResponseHandler.error(res, error.message || "Something went wrong", 500);
    }
};

// Delete company by ID with improved error handling
export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCompany = await SnigdhaCompany.findByIdAndDelete(id);

        if (!deletedCompany) {
            return ResponseHandler.error(res, "Company not found", 404);
        }

        ResponseHandler.success(res, null, "Company deleted successfully");
    } catch (error) {
        console.error("Error deleting company:", error);
        ResponseHandler.error(res, error.message || "Something went wrong", 500);
    }
};