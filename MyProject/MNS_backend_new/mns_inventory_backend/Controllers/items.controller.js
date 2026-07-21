import Item from "../Models/item.model.js";

export const createItem = async (req, res) => {
    try {
        const { 
            item_name, 
            item_id, 
            item_description, 
            unit_prize, 
            sellingPrice,
            total_prize, 
            quantity, 
            hsnCode, 
            cgst, 
            igst, 
            sgst 
        } = req.body;

        // Check if all required fields are provided
        if (!item_name || !item_id || !item_description || !unit_prize || !total_prize || !quantity || !hsnCode) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        console.log("item id : ", item_id)

        // Check if the item_id already exists in the database
        const existingItem = await Item.findOne({ item_id });

        console.log("exit item : ", existingItem)

        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: "Item with the same item_id already exists"
            });
        }

        // Create a new item
        const newItem = new Item({
            item_name,
            item_id,
            item_description,
            unit_prize,
            sellingPrice,
            total_prize,
            quantity,
            hsnCode,
            cgst,
            igst,
            sgst,
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
        const items = await Item.find();

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
        "item_description",
        "unit_prize",
        "sellingPrice",
        "total_prize",
        "quantity",
        "hsnCode",
        "cgst",
        "igst",
        "sgst"
      ];
  
      // Build the update object by filtering req.body
      const updateData = allowedFields.reduce((acc, key) => {
        if (req.body[key] !== undefined) acc[key] = req.body[key];
        return acc;
      }, { updated_date: new Date() });
  
      // Update the item and return the new document
      const updatedItem = await Item.findOneAndUpdate({ _id:item_id }, updateData, { new: true });
      if (!updatedItem) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }
  
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
        const deletedItem = await Item.findOneAndDelete({ _id: item_id });
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
        const item = await Item.findOne({ item_id });

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
   