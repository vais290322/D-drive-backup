// import HoldingItems from "../Models/holdingItem.model.js";
import SnigdhaHoldingItems from "../SnigdhaModels/snigdhaHoldingitem.model.js"

export const setHoldingItems = async (item) => {
    try {
        // Validate the input to ensure it matches the schema
        if (!item || typeof item !== "object") {
            throw new Error("Invalid input: item must be an object");
        }
        const {
            item_name,
            _id,
            item_id,
            unit_prize,
            sellingPrice,
            total_prize,
            quantity,
            seller_details,
            buyier_details,
            imported,
            exported,
            hsnCode,
            cgst,
            igst,
            sgst,
        } = item;

        // Create a new HoldingItem document and save it to the database
        const newItem = new SnigdhaHoldingItems({
            item_name,
            inventory_id: _id,
            item_id,
            unit_prize,
            sellingPrice,
            total_prize,
            quantity,
            seller_details,
            buyier_details,
            imported,
            exported,
            hsnCode,
            cgst,
            igst,
            sgst,
        });
        const result = await newItem.save();
        if(!result){
            return { success: false, message: "Failed to add item to inventory", data: null };
        }

        return { success: true, message: "Item added successfully", data: result };
    } catch (error) {
        console.error("Error in setHoldingItems:", error);
        return { success: false, message: error.message || "Internal Server Error" };
    }
};

export const deleteHoldingItem = async (itemId) => {
    try {
        // Use the _id from the item in the items_details array
        const item = await SnigdhaHoldingItems.findOne({ inventory_id:itemId });
  
        if (!item) {
          return { success: false, message: "Inventory item not found" };
        }
       const result = await SnigdhaHoldingItems.deleteOne({ inventory_id:itemId});
        if(!result){
            return { success: false, message: "Failed to delete item from inventory", data: null
        }
    }
        return { success: true, message: "Item deleted successfully", data: result };
    
        
    } catch (error) {
        console.error("Error deleting item:", error);
        return { success: false, message: error.message || "Internal Server Error" };
    }
};

export const getAllHoldingData = async (req, res) => {
    try {
        const allHoldingData = await SnigdhaHoldingItems.find(); // Fetch all holding items

        // Instead of returning 404, return an empty array with a message
        if (allHoldingData.length === 0) {
            return res.status(200).json({ success: true, message: "No holding data found", data: [] });
        }

        return res.status(200).json({ success: true, data: allHoldingData });
    } catch (error) {
        console.error("Error in getAllHoldingData:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const updateHoldingItem = async (itemId, updatedDetails) => {
    try {

        // Find the item by inventory_id
        const item = await SnigdhaHoldingItems.findOneAndUpdate({ inventory_id:itemId }, updatedDetails, {
            new: true, // Returns updated document
          });

        if (!item) {
            return { success: false, message: "Inventory item not found" };
        }


        return { success: true, message: "Item updated successfully" };
        
    } catch (error) {
        console.error("Error updating item:", error);
        return { success: false, message: error.message || "Internal Server Error" };
    }
};

export const deleteAllHoldingData = async () => {
    try {
        // Delete all documents in the HoldingItems collection
        const result = await SnigdhaHoldingItems.deleteMany({});

        if (result.deletedCount === 0) {
            return { success: false, message: "No items found to delete" };
        }

        return { success: true, message: `${result.deletedCount} items deleted successfully` };
    } catch (error) {
        console.log("Error deleting all holding data:", error);
        return { success: false, message: error.message || "Internal Server Error" };
    }
};