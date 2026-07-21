import ResponseHandler from "../Middelwares/ResponseHandler.js";
// import Unit from "../Models/ProductsUnit.model.js";
import SnigdhaUnit from "../SnigdhaModels/snigdhaProductsUnit.model.js"

// Create a new unit
export const createUnit = async (req, res) => {
    try {
        const { name, symbol, measure } = req.body;
        
        if (!name || !symbol || !measure) {
            return ResponseHandler.error(res, "All fields are required", 400);
        }

        const newUnit = new SnigdhaUnit({ name, symbol, measure });
        await newUnit.save();

        ResponseHandler.success(res, newUnit, "Unit created successfully", 201);
    } catch (error) {
        console.error("Error creating unit:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};

// Get all units
export const getAllUnits = async (req, res) => {
    try {
        const units = await SnigdhaUnit.find();

        if (!units || units.length === 0) {
            return ResponseHandler.error(res, "No units found", 404);
        }

        ResponseHandler.success(res, units, "Units retrieved successfully");
    } catch (error) {
        console.error("Error fetching units:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};

// Get a single unit by ID
export const getUnitById = async (req, res) => {
    try {
        const { id } = req.params;
        const unit = await SnigdhaUnit.findById(id);

        if (!unit) {
            return ResponseHandler.error(res, "Unit not found", 404);
        }

        ResponseHandler.success(res, unit, "Unit retrieved successfully");
    } catch (error) {
        console.error("Error fetching unit:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};

// Update a unit
export const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, symbol, measure } = req.body;

        const updatedUnit = await SnigdhaUnit.findByIdAndUpdate(
            id,
            { name, symbol, measure },
            { new: true }
        );

        if (!updatedUnit) {
            return ResponseHandler.error(res, "Unit not found", 404);
        }

        ResponseHandler.success(res, updatedUnit, "Unit updated successfully");
    } catch (error) {
        console.error("Error updating unit:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};

// Delete a unit
export const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUnit = await SnigdhaUnit.findByIdAndDelete(id);

        if (!deletedUnit) {
            return ResponseHandler.error(res, "Unit not found", 404);
        }

        ResponseHandler.success(res, null, "Unit deleted successfully");
    } catch (error) {
        console.error("Error deleting unit:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};