import CurrentItems from "../Models/currentItems.model.js";
import HoldingItems from "../Models/holdingItem.model.js";
import { deleteAllHoldingData } from "./holdingItems.controller.js";
import PurchaseOrder from "../Models/ParchaseOrder.model.js";
import InvoiceMns from "../invoicemodel/invoice-mns.model.js";
import SnigdhaCurrentItems from "../SnigdhaModels/snigdhaCurrentitems.model.js";
import Company from "../Models/company.model.js";


export const addAllFromHoldingItems = async (req, res) => {
  try {
    const holdingItems = await HoldingItems.find();

    // Using a for...of loop to handle async operations correctly
    for (const item of holdingItems) {
      const success = await setCurrentData(item);
      if (!success) {
        return res
          .status(500)
          .json({
            success: false,
            message: `Failed to add item: ${item.inventory_id}`,
          });
      }
    }

    await deleteAllHoldingData();
    return res
      .status(200)
      .json({ success: true, message: "All items added successfully" });
  } catch (error) {
    console.log("Error in addAllFromHoldingItems:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

export const setCurrentData = async (item) => {
  try {
    // Extract only the necessary fields for CurrentItems if needed
    const newData = new CurrentItems({
      item_name: item.item_name,
      inventory_id: item.inventory_id,
      item_id: item.item_id,
      unit_prize: item.unit_prize,
      sellingPrice: item.sellingPrice,
      total_prize: item.total_prize,
      quantity: item.quantity,
      seller_details: item.seller_details,
      buyier_details: item.buyier_details,
      imported: item.imported,
      exported: item.exported,
      hsnCode: item.hsnCode,
      cgst: item.cgst,
      igst: item.igst,
      sgst: item.sgst,
    });

    const result = await newData.save();
    if (!result) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("Error saving item in setCurrentData:", error);
    return false;
  }
};

export const updateCurrentData = async (item) => {
  try {
    if (!item.item_id) {
      throw new Error("Item ID is required for updating the item");
    }

    const updatedItem = await CurrentItems.findOneAndUpdate(
      { item_id: item.item_id }, // Find the item by item_id
      {
        $set: {
          item_name: item.item_name,
          inventory_id: item.inventory_id,
          unit_prize: item.unit_prize,
          sellingPrice: item.sellingPrice,
          total_prize: item.total_prize,
          quantity: item.quantity,
          seller_details: item.seller_details,
          buyier_details: item.buyier_details,
          imported: item.imported,
          exported: item.exported,
          hsnCode: item.hsnCode,
          cgst: item.cgst,
          igst: item.igst,
          sgst: item.sgst,
        },
      },
      { new: true, upsert: false } // Return the updated document but don't create a new one if not found
    );

    if (!updatedItem) {
      return { success: false, message: "Item not found for update" };
    }

    return {
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    };
  } catch (error) {
    console.error("Error updating item in updateCurrentData:", error);
    return {
      success: false,
      message: error.message || "Internal Server Error",
    };
  }
};

export const getAllCurrentItems = async (req, res) => {
  try {
    // Fetch all current items from the CurrentItems collection
    const items = await CurrentItems.find();

    // If no items found, send a response indicating so
    if (items.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No items found" });
    }

    // Send the fetched items as the response
    return res
      .status(200)
      .json({
        success: true,
        message: "Items fetched successfully",
        data: items,
      });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

export const addOneCurrentItemFromHoldingItems = async (req, res) => {
  try {
    const { id } = req.params;
    const holdingItem = await HoldingItems.findOne({ item_id: id });
    if (!holdingItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in holding items" });
    }

    const currentItem = await CurrentItems.findOne({ item_id: id });

    if (!currentItem) {
      const holdingItem = await HoldingItems.findOne({ item_id: id });
      console.log(holdingItem);
      const result = await setCurrentData(holdingItem);
      if (!result) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to add item" });
      }
      await HoldingItems.deleteOne({ item_id: id });
      return res
        .status(200)
        .json({
          success: true,
          message: "Item added successfully",
          data: result,
        });
    }
    // const holdingItem = await HoldingItems.findOne({item_id:id})
    const { unit_prize, quantity,sellingPrice } = holdingItem;
    const prev_unit_prize = currentItem.unit_prize;
    const prev_sellingPrice = currentItem.sellingPrice;
    const prev_quantity = currentItem.quantity;
    currentItem.unit_prize = Math.floor((unit_prize + prev_unit_prize) / 2);
    currentItem.sellingPrice = Math.floor((sellingPrice + prev_sellingPrice) / 2);
    currentItem.quantity = quantity + prev_quantity;
    currentItem.total_prize = currentItem.unit_prize * currentItem.quantity;
    const result = await updateCurrentData(currentItem);
    if (!result) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to add item" });
    }
    await HoldingItems.deleteOne({ item_id: id });
    return res
      .status(200)
      .json({ success: true, message: "Item added successfully" });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sellCurrentItem = async (req, res) => {
  try {
    const sellingItemId = req.params.item_id;
    const sellingItemQuantity = parseInt(req.params.quantity, 10); // Convert quantity to integer

    const sellingItem = await CurrentItems.findOne({ item_id: sellingItemId });

    if (!sellingItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in current items" });
    }

    if (sellingItemQuantity > sellingItem.quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough quantity in stock" });
    }

    // If selling quantity matches available quantity, delete the entire item
    if (sellingItemQuantity === sellingItem.quantity) {
      const isDeleted = await CurrentItems.deleteOne({
        item_id: sellingItemId,
      });
      if (!isDeleted) {
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to remove item from inventory",
          });
      }
      return res
        .status(200)
        .json({
          success: true,
          message: "Item sold completely and removed from inventory",
        });
    }

    // Otherwise, update the item's quantity and total price
    sellingItem.quantity -= sellingItemQuantity;
    sellingItem.total_prize = sellingItem.unit_prize * sellingItem.quantity;

    const result = await updateCurrentData(sellingItem);

    if (!result.success) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to sell item" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Item sold successfully",
        data: sellingItem,
      });
  } catch (error) {
    console.error("Error in sellCurrentItem:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};


export const getItemById = async (req, res) => {
  try {
    const { item_id } = req.params;
    // console.log("id : ",item_id);
    
    if (!item_id) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }

    const item = await CurrentItems.findOne({ item_id });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Item details retrieved successfully",
        data: item,
      });
  } catch (error) {
    console.error("Error in getItemById:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

export const getItemDetailsAndPurchaseOrders = async (req, res) => {
  try {
    const { item_id } = req.params;
    // console.log(item_id);
    if (!item_id) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }

    // Get item details
    const item = await CurrentItems.findOne({ item_id });

    // Find all purchase orders containing this item
    const purchaseOrders = await InvoiceMns.find({
      "items.id": item_id
    });

    // Prepare response data
    const responseData = {
      itemDetails: item || null,
      purchaseOrders: purchaseOrders || [],
      purchaseOrdersCount: purchaseOrders ? purchaseOrders.length : 0
    };

    // If both item and purchase orders are not found
    if (!item && (!purchaseOrders || purchaseOrders.length === 0)) {
      return res
        .status(404)
        .json({ 
          success: false, 
          message: "No data found for this item ID",
          data: responseData
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Item details and purchase orders retrieved successfully",
        data: responseData
      });
  } catch (error) {
    console.error("Error in getItemDetailsAndPurchaseOrders:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

export const getItemsByHsnCode = async (req, res) => {
  try {
    const { hsnCode } = req.params;
    
    if (!hsnCode) {
      return res
        .status(400)
        .json({ success: false, message: "HSN Code is required" });
    }

    // Find all items with the matching HSN code
    const items = await CurrentItems.find({ hsnCode });

    // If no items found, return appropriate response
    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ 
          success: false, 
          message: `No items found with HSN Code: ${hsnCode}`,
          data: []
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: `Found ${items.length} items with HSN Code: ${hsnCode}`,
        data: items
      });
  } catch (error) {
    console.error("Error in getItemsByHsnCode:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

export const transferItemsByHsnCode = async (req, res) => {
  try {
    const { hsnCode, quantity } = req.body;

    // console.log("hsn : ", hsnCode, quantity);
    
    if (!hsnCode) {
      return res
        .status(400)
        .json({ success: false, message: "HSN Code is required" });
    }
    
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Valid quantity is required" });
    }
    
    const transferQuantity = Number(quantity);
    
    // Find items with the matching HSN code in regular inventory
    const regularItem = await CurrentItems.findOne({ hsnCode });
    
    if (!regularItem) {
      return res
        .status(404)
        .json({ 
          success: false, 
          message: `No items found with HSN Code: ${hsnCode} in regular inventory`
        });
    }
    
    // Check if there's enough quantity in regular inventory
    if (transferQuantity > regularItem.quantity) {
      return res
        .status(400)
        .json({ 
          success: false, 
          message: `Not enough quantity in regular inventory. Available: ${regularItem.quantity}, Requested: ${transferQuantity}`
        });
    }
    
    // Check if the item exists in Snigdha inventory
    let snigdhaItem = await SnigdhaCurrentItems.findOne({ hsnCode });
    
    // If the item doesn't exist in Snigdha inventory, create it
    if (!snigdhaItem) {
      snigdhaItem = new SnigdhaCurrentItems({
        item_name: regularItem.item_name,
        inventory_id: regularItem.inventory_id,
        item_id: regularItem.item_id,
        unit_prize: regularItem.unit_prize,
        sellingPrice: regularItem.sellingPrice,
        total_prize: regularItem.unit_prize * transferQuantity,
        quantity: transferQuantity,
        seller_details: regularItem.seller_details,
        buyier_details: regularItem.buyier_details,
        imported: regularItem.imported,
        exported: regularItem.exported,
        hsnCode: regularItem.hsnCode,
        cgst: regularItem.cgst,
        igst: regularItem.igst,
        sgst: regularItem.sgst,
      });
      
      await snigdhaItem.save();
    } else {
      // If the item exists, update its quantity and total price
      snigdhaItem.quantity += transferQuantity;
      snigdhaItem.total_prize = snigdhaItem.unit_prize * snigdhaItem.quantity;
      await snigdhaItem.save();
    }
    
    // Update regular inventory
    // If transferring all quantity, delete the item
    if (transferQuantity === regularItem.quantity) {
      await CurrentItems.deleteOne({ _id: regularItem._id });
    } else {
      // Otherwise, reduce the quantity
      regularItem.quantity -= transferQuantity;
      regularItem.total_prize = regularItem.unit_prize * regularItem.quantity;
      await regularItem.save();
    }
    
    // Create a purchase order record in regular purchase model
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const itemForPurchase = {
      item_id: regularItem.item_id,
      item_name: regularItem.item_name,
      quantity: transferQuantity,
      unit_prize: regularItem.unit_prize,
      sellingPrice: regularItem.sellingPrice,
      total_prize: regularItem.unit_prize * transferQuantity,
      hsnCode: regularItem.hsnCode,
      cgst: regularItem.cgst,
      igst: regularItem.igst,
      sgst: regularItem.sgst
    };
    
    const totalAmount = regularItem.unit_prize * transferQuantity;
    
    // Get a default company for the purchase order
    const companyDetails = await Company.findOne();
    
    if (!companyDetails) {
      console.warn("No company found for purchase order, using default values");
    }
    
    const purchaseOrder = new PurchaseOrder({
      date: formattedDate,
      vendorQuoteRef: `Transfer-${Date.now()}`,
      buyer: "Snigdha Inventory",
      requestedBy: "System Transfer",
      contactPerson: "Snigdha Admin",
      contactPersonNumber: "N/A",
      department: "Inventory Management",
      poDescription: `Transfer of ${transferQuantity} units of item with HSN Code: ${hsnCode} to Snigdha inventory`,
      billLocation: "Snigdha Warehouse",
      shipLocation: "Snigdha Warehouse",
      items: [itemForPurchase],
      companyDetails: companyDetails || {
        name: "Snigdha Inventory",
        address: "Snigdha Warehouse Address",
        contactNumber: "N/A"
      },
      paymentTerms: "Internal Transfer",
      totalAmount: totalAmount,
      clientId: companyDetails ? companyDetails._id : "Snigdha",
      status: "Completed"
    });
    
    await purchaseOrder.save();
    
    return res
      .status(200)
      .json({
        success: true,
        message: `Successfully transferred ${transferQuantity} units of item with HSN Code: ${hsnCode} from regular inventory to Snigdha inventory`,
        data: {
          regularItem: regularItem.quantity > 0 ? regularItem : "Item removed from regular inventory",
          snigdhaItem,
          purchaseOrder
        }
      });
      
  } catch (error) {
    console.error("Error in transferItemsByHsnCode:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

