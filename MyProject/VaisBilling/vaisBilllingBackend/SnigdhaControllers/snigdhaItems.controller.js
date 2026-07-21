// import Item from "../Models/item.model.js";
import SnigdhaItem from "../SnigdhaModels/snigdhaItem.model.js"

export const createItem = async (req, res) => {
    try { 
        const { 
            item_name, 
            item_id, 
            group, 
            openingStock,
            unit_prize, 
            sellingPrice,
            total_prize, 
            quantity, 
            hsnCode, 
            uom,
            gst,
        } = req.body;

        // console.log("req : ",req.body)
        // console.log("hi ")

        // Check if all required fields are provided
        if (!item_name || !item_id || !group || !hsnCode  ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Check if the item_id already exists in the database
        const existingItem = await SnigdhaItem.findOne({ item_id });
        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: "Item with the same item_id already exists"
            });
        }

        // Check if the item_name already exists (case-insensitive and trimmed)
        const normalizedItemName = item_name.trim().toLowerCase();
        const existingItemName = await SnigdhaItem.findOne({
            item_name: { $regex: new RegExp(`^${normalizedItemName}$`, 'i') }
        });
        
        if (existingItemName) {
            return res.status(400).json({
                success: false,
                message: "Item with the same name already exists"
            });
        }

        // Create a new item
        const newItem = new SnigdhaItem({
            item_name,
            item_id,
            group,
            openingStock : Number(openingStock) || quantity || 0,
            unit_prize: Number(unit_prize) || 0 ,
            sellingPrice : Number(sellingPrice) || 0,
            total_prize : Number(total_prize) || 0,
            quantity : Number(quantity) || openingStock || 0,
            hsnCode,
            uom,
            gst,
            created_date: new Date(),
            updated_date: new Date()
        });

        // Save the item to the database
        await newItem.save();

        // Respond with the created item
        res.status(201).json({
            success: true,
            message: "Item Created Successfully",
            data: newItem
        });
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getAllItems = async (req, res) => {
    try {
        // Fetch all items from the database
        const items = await SnigdhaItem.find();

        // Check if any items were found
        if (items.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: "No items found", 
                data: [] 
            });
        }

        // Respond with the list of items
        res.status(200).json({ 
            success: true, 
            message: "Items retrieved successfully", 
            data: items 
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};

export const updateItem = async (req, res) => {
    try {
      const { item_id } = req.params;
      if (!item_id) {
        return res.status(400).json({
          success: false,
          message: "Item ID is required",
        });
      }
  
      // List only the allowed fields for update
      const allowedFields = [
        "item_name",
        "group",
        "unit_prize",
        "sellingPrice",
        "openingStock",
        "total_prize",
        "quantity",
        "hsnCode",
        "hsnCode",
        "gst",
        "uom",
      ];
  
      // Build the update object by filtering req.body
      const updateData = allowedFields.reduce((acc, key) => {
        if (req.body[key] !== undefined) acc[key] = req.body[key];
        return acc;
      }, { updated_date: new Date() });
      
      // Get the current item to use its values if needed
      const item = await SnigdhaItem.findOne({ _id: item_id });
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }
      
      // If quantity or unit_prize is updated, recalculate total_prize
      if (updateData.quantity !== undefined || updateData.unit_prize !== undefined) {
        const newQuantity = Number(updateData.quantity !== undefined ? updateData.quantity : item.quantity);
        const newUnitPrice = Number(updateData.unit_prize !== undefined ? updateData.unit_prize : item.unit_prize);
        updateData.total_prize = newQuantity * newUnitPrice;
      }
  
      // Update the item and return the new document
      const updatedItem = await SnigdhaItem.findOneAndUpdate({ _id: item_id }, updateData, { new: true });
  
      res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: updatedItem,
      });
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
};

// Add a new function to update item stock
export const updateItemStock = async (req, res) => {
    try {
        const { item_id } = req.params;
        const { quantity, operation } = req.body;
        
        if (!item_id) {
            return res.status(400).json({
                success: false,
                message: "Item ID is required"
            });
        }
        
        if (!quantity || !operation) {
            return res.status(400).json({
                success: false,
                message: "Quantity and operation (add/subtract) are required"
            });
        }
        
        const item = await SnigdhaItem.findOne({ _id: item_id });
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }
        
        let newQuantity;
        
        if (operation === 'add') {
            newQuantity = Number(item.quantity) + Number(quantity);
        } else if (operation === 'subtract') {
            newQuantity = Number(item.quantity) - Number(quantity);
            if (newQuantity < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot reduce stock below zero"
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Operation must be either 'add' or 'subtract'"
            });
        }
        
        // Calculate the new total_prize based on the new quantity and current unit_prize
        const newTotalPrice = newQuantity * Number(item.unit_prize);
        
        const updatedItem = await SnigdhaItem.findOneAndUpdate(
            { _id: item_id },
            { 
                quantity: newQuantity,
                total_prize: newTotalPrice,
                updated_date: new Date()
            },
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            message: "Item stock updated successfully",
            data: updatedItem
        });
    } catch (error) {
        console.error("Error updating item stock:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { item_id } = req.params;

        // Check if item_id is provided
        if (!item_id) {
            return res.status(400).json({
                success: false,
                message: "Item ID is required",
            });
        }

        // Find and delete the item by item_id
        const deletedItem = await SnigdhaItem.findOneAndDelete({ _id: item_id });
        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        // Respond with success message
        res.status(200).json({
            success: true,
            message: "Item deleted successfully",
            data: deletedItem,
        });
    } catch (error) {
        // console.error("Error deleting item:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const searchItem = async (req, res) => {
    try {
        const { item_id } = req.params;

        // Search for item by item_id
        const item = await SnigdhaItem.findOne({ item_id });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        // Respond with the found item
        res.status(200).json({
            success: true,
            message: "Item found",
            data: item,
        });
    } catch (error) {
        console.error("Error searching item:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
