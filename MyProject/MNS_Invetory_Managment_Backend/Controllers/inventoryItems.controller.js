
import InventoryItem from "../Models/inventoryStore.model.js";
import { deleteHoldingItem, getAllHoldingData, setHoldingItems, updateHoldingItem } from "./holdingItems.controller.js";


export const createInventoryItem = async (req, res) => {
  try {
    const {
      item_name,
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
    } = req.body;

    // Check if required fields are present
    if (!item_name || !item_id || !unit_prize || !total_prize || !quantity || !seller_details || !buyier_details) {
      return res.status(400).json({success: false, message: "All fields are required" });
    }


    // Create a new inventory item
    const newItem = new InventoryItem({
      item_name,
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

    // Save to database
   const savedItem =  await newItem.save();
   if(!savedItem){
    return res.status(400).json({ success: false, message: "Failed to create inventory item" });
   }
    await setHoldingItems(savedItem);

    res.status(201).json({ success: true,message: "Inventory item created successfully", data: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false,message: "Server Error", error: error.message });
  }
};

export const getAllInventoryItems = async (req, res) => {
    try {
      // Fetch all inventory items
      const inventoryItems = await InventoryItem.find();
  
      // Check if there are any items in the database
      if (inventoryItems.length === 0) {
        return res.status(404).json({ success: false, message: "No inventory items found" });
      }
  
      res.status(200).json({ success: true, message: "All data retrive successfully" , data: inventoryItems });
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  };

export const deleteInventoryItem = async (req, res) => {
    try {
      const { item_id } = req.params;
  
      // Check if item exists
      const item = await InventoryItem.findOne({ _id:item_id });
  
      if (!item) {
        return res.status(404).json({ success: false, message: "Inventory item not found" });
      }
  
      // Delete item from database
      await InventoryItem.deleteOne({ _id:item_id });
      await deleteHoldingItem(item_id)
  
      res.status(200).json({ success: true, message: "Inventory item deleted successfully",data: item });
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  };

export const updateInventoryItem = async (req, res) => {
    try {
      const { item_id } = req.params;
      const updateData = req.body;
  
      // Check if the item exists
      const item = await InventoryItem.findById({ _id:item_id });
  
      if (!item) {
        return res.status(404).json({ success: false, message: "Inventory item not found" });
      }
  
      // Update item with new data
      const updatedItem = await InventoryItem.findOneAndUpdate({ _id:item_id }, updateData, {
        new: true, // Returns updated document
      });
      if (!updatedItem) {
        return res.status(404).json({ success: false, message: "No update was made" });
      }
      
      const newItem = await updateHoldingItem(item_id, updateData)
      console.log(newItem);
      
  
      res.status(200).json({
        success: true,
        message: "Inventory item updated successfully",
        data: updatedItem,
      });
    } catch (error) {
      console.error("Error updating inventory item:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  };


export const getInventoryItemsByDate = async (req, res) => {
    try {
      const { date } = req.params; // Extract date from request parameters
  
      if (!date) {
        return res.status(400).json({ success: false, message: "Date is required" });
      }
  
      // Convert date to match the full day (00:00:00 to 23:59:59)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Find inventory items created within the given date range
      const inventoryItems = await InventoryItem.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
  
      // Check if any items exist for the given date
      if (inventoryItems.length === 0) {
        return res.status(404).json({ success: false, message: "No inventory items found for this date" });
      }
  
      res.status(200).json({
        success: true,
        message: "Inventory items retrieved successfully",
        data: inventoryItems,
      });
    } catch (error) {
      console.error("Error fetching inventory items by date:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  };

  export const getInventoryItemsByDatePeriod = async (req, res) => {
    try {
      const { start_date, end_date } = req.params;
  
      // Check if both start_date and end_date are provided
      if (!start_date || !end_date) {
        return res.status(400).json({ success: false, message: "Both start_date and end_date are required" });
      }
  
      // Convert start_date and end_date to Date objects with time set to 00:00:00 for start date and 23:59:59 for end date
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      // Set the time for start date to 00:00:00
      startDate.setHours(0, 0, 0, 0);
      // Set the time for end date to 23:59:59
      endDate.setHours(23, 59, 59, 999);
  
      // Validate the provided dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid date format" });
      }
  
      // Find inventory items created within the given date range
      const inventoryItems = await InventoryItem.find({
        createdAt: { $gte: startDate, $lte: endDate },
      });
  
      // Check if any items were found
      if (inventoryItems.length === 0) {
        return res.status(404).json({ success: false, message: "No inventory items found for the given date range" });
      }
  
      res.status(200).json({
        success: true,
        message: "Inventory items retrieved successfully",
        data: inventoryItems,
      });
    } catch (error) {
      console.error("Error fetching inventory items by date range:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  };  