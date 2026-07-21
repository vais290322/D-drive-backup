import ResponseHandler from "../Middelwares/ResponseHandler.js";
import SnigdhaCompany from "../SnigdhaModels/snigdhaCompany.model.js";
import SnigdhaPurchaseOrder from "../SnigdhaModels/snigdhaParchaseOrder.model.js"
import SnigdhaCurrentItems from "../SnigdhaModels/snigdhaCurrentitems.model.js"

import Invoice from "../invoicemodel/invoice.model.js"


export const getAllPurchaseOrders = async (req, res) => {
    try {
        // Fetch all purchase orders from the database
        const purchaseOrders = await SnigdhaPurchaseOrder.find().sort({ createdAt: -1 }) // Sort by creation date in descending order;

        // Check if there are no purchase orders
        if (!purchaseOrders || purchaseOrders.length === 0) {
            return ResponseHandler.error(res, "No purchase orders found", 404);
        }

        // Return success response
        ResponseHandler.success(res, purchaseOrders, "Purchase orders retrieved successfully");
    } catch (error) {
        console.error("Error fetching purchase orders:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};

export const deletePurchaseOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the purchase order exists
        const purchaseOrder = await SnigdhaPurchaseOrder.findById(id);
        if (!purchaseOrder) {
            return ResponseHandler.error(res, "Purchase order not found", 404);
        }

        // Delete the purchase order
        await SnigdhaPurchaseOrder.findByIdAndDelete(id);

        // Return success response
        ResponseHandler.success(res, null, "Purchase order deleted successfully");
    } catch (error) {
        console.error("Error deleting purchase order:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
}; 


const updateCurrentData = async (item) => {
    try {
        await item.save();
        return { success: true };
    } catch (error) {
        console.error("Error updating current item:", error);
        return { success: false, error };
    }
};


export const createPurchaseOrder = async (req, res) => {
    try {
        // Extract required fields
        const {
            date,
            vendorQuoteRef,
            buyer,
            requestedBy,
            contactPerson,
            contactPersonNumber,
            department,
            poDescription,
            billLocation,
            shipLocation,
            items,
            clientId,
            paymentTerms,
            status
        } = req.body;
        
        // Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            return ResponseHandler.error(res, "At least one item is required", 400);
        }

        // Process each item to check inventory and reduce quantities and prices accordingly
        for (const item of items) {
            const currentItem = await SnigdhaCurrentItems.findOne({ item_id: item.item_id });
            
            if (!currentItem) {
                return ResponseHandler.error(res, `Item ${item.item_id} not found in inventory`, 404);
            }
            
            const orderQuantity = Number(item.quantity);
            
            if (orderQuantity > currentItem.quantity) {
                return ResponseHandler.error(res, `Not enough quantity in stock for item ${item.item_id}`, 400);
            }
            
            // If order quantity matches available quantity, delete the entire item
            if (orderQuantity === currentItem.quantity) {
                const isDeleted = await SnigdhaCurrentItems.deleteOne({ item_id: item.item_id });
                if (!isDeleted) {
                    return ResponseHandler.error(res, `Failed to remove item ${item.item_id} from inventory`, 500);
                }
            } else {
                // Otherwise, update the item's quantity and total price
                currentItem.quantity -= orderQuantity;
                currentItem.total_prize = currentItem.unit_prize * currentItem.quantity;
                
                const result = await updateCurrentData(currentItem);
                
                if (!result.success) {
                    return ResponseHandler.error(res, `Failed to update inventory for item ${item.item_id}`, 500);
                }
            }
        }

        const totalAmount = items?.reduce((acc, item) => {
            const quantity = Number(item.quantity);
            const itemTotal = quantity * item.sellingPrice;
            item.total_prize = itemTotal; // update the item with its total
            return acc + itemTotal;
        }, 0);
          
        const companyDetails = await SnigdhaCompany.findById(clientId);
  
        // If the company is not found
        if (!companyDetails) {
            return ResponseHandler.error(res, "Company not found", 404);
        }
        
        const newPurchaseOrder = new SnigdhaPurchaseOrder({
            date,
            vendorQuoteRef,
            buyer,
            requestedBy,
            contactPerson,
            contactPersonNumber,
            department,
            poDescription,
            billLocation,
            shipLocation,
            items,
            companyDetails,
            paymentTerms,
            totalAmount,
            clientId,  
            status
        });

        await newPurchaseOrder.save();

        ResponseHandler.success(res, newPurchaseOrder, "Purchase order created successfully and inventory updated", 201);
    } catch (error) {
        console.error("Error creating purchase order:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};


export const getPurchaseOrdersByItemId = async (req, res) => {
    try {
        const { item_id } = req.params;
        // console.log("item id : ", item_id);

        if (!item_id) {
            return ResponseHandler.error(res, "Item ID is required", 400);
        }

        // Find all purchase orders that contain the specified item_id in their items array
        const purchaseOrders = await SnigdhaPurchaseOrder.find({
            "items.item_id": item_id
        });

        if (!purchaseOrders || purchaseOrders.length === 0) {
            return ResponseHandler.error(res, `No purchase orders found containing item ${item_id}`, 404);
        }

        ResponseHandler.success(
            res, 
            purchaseOrders, 
            `Found ${purchaseOrders.length} purchase orders containing item ${item_id}`
        );
    } catch (error) {
        console.error("Error finding purchase orders by item ID:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};


export const getSalesAnalytics = async (req, res) => {
    try {
        // Get all invoices
        const invoices = await Invoice.find();
        
        if (!invoices || invoices.length === 0) {
            return ResponseHandler.error(res, "No invoices found", 404);
        }

        let totalSales = 0;
        let totalProfit = 0;
        let totalGoodsValue = 0;
        let itemsSold = 0;
        let totalSellingAmount = 0; // New field for sum of all grandTotals
        
        // Calculate total selling amount from invoice grandTotals
        for (const invoice of invoices) {
            totalSellingAmount += Number(invoice.grandTotal) || 0;
        }
        
        // Process each invoice
        for (const invoice of invoices) {
            if (invoice.items && Array.isArray(invoice.items)) {
                // Process each item in the invoice
                for (const item of invoice.items) {
                    const quantity = Number(item.quantity) || 0;
                    const sellingPrice = Number(item.sellingPrice) || 0;
                    const unitPrice = Number(item.unit_prize) || 0;
                    
                    // Calculate sales (sellingPrice * quantity)
                    const itemSales = sellingPrice * quantity;
                    totalSales += itemSales;
                    
                    // Calculate goods value (unitPrice * quantity)
                    const itemGoodsValue = unitPrice * quantity;
                    totalGoodsValue += itemGoodsValue;
                    
                    // Calculate profit (sales - goods value)
                    const itemProfit = itemSales - itemGoodsValue;
                    totalProfit += itemProfit;
                    
                    // Count total items sold
                    itemsSold += quantity;
                }
            }
        }
        
        // Prepare response data
        const analyticsData = {
            totalSellingAmount: parseFloat(totalSellingAmount.toFixed(2)), // New field with sum of all invoice grandTotals
            totalSales: parseFloat(totalSales.toFixed(2)),
            totalProfit: parseFloat(totalProfit.toFixed(2)),
            totalGoodsValue: parseFloat(totalGoodsValue.toFixed(2)),
            profitMargin: parseFloat(((totalProfit / totalSales) * 100).toFixed(2)),
            totalInvoices: invoices.length,
            itemsSold: itemsSold
        };
        
        ResponseHandler.success(
            res,
            analyticsData,
            "Sales analytics retrieved successfully"
        );
    } catch (error) {
        console.error("Error calculating sales analytics:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};

export const getItemSalesAnalytics = async (req, res) => {
    try {
        // Get all invoices
        const invoices = await Invoice.find();
        
        if (!invoices || invoices.length === 0) {
            return ResponseHandler.error(res, "No invoices found", 404);
        }

        // Map to track item-wise sales data
        const itemAnalytics = new Map();
        
        // Process each invoice
        for (const invoice of invoices) {
            if (invoice.items && Array.isArray(invoice.items)) {
                // Process each item in the invoice
                for (const item of invoice.items) {
                    const itemId = item.id || item.item_id;
                    const itemName = item.name || item.item_name;
                    const quantity = Number(item.quantity) || 0;
                    const sellingPrice = Number(item.sellingPrice) || 0;
                    const unitPrice = Number(item.unit_prize) || 0;
                    
                    // Calculate values
                    const itemSales = sellingPrice * quantity;
                    const itemGoodsValue = unitPrice * quantity;
                    const itemProfit = itemSales - itemGoodsValue;
                    
                    // Update or create item analytics
                    if (itemAnalytics.has(itemId)) {
                        const existingData = itemAnalytics.get(itemId);
                        existingData.quantitySold += quantity;
                        existingData.totalSales += itemSales;
                        existingData.totalGoodsValue += itemGoodsValue;
                        existingData.totalProfit += itemProfit;
                        existingData.invoiceCount += 1;
                    } else {
                        itemAnalytics.set(itemId, {
                            itemId,
                            itemName,
                            quantitySold: quantity,
                            totalSales: itemSales,
                            totalGoodsValue: itemGoodsValue,
                            totalProfit: itemProfit,
                            invoiceCount: 1
                        });
                    }
                }
            }
        }
        
        // Convert map to array and calculate profit margins
        const itemsAnalyticsArray = Array.from(itemAnalytics.values()).map(item => ({
            ...item,
            totalSales: parseFloat(item.totalSales.toFixed(2)),
            totalProfit: parseFloat(item.totalProfit.toFixed(2)),
            totalGoodsValue: parseFloat(item.totalGoodsValue.toFixed(2)),
            profitMargin: parseFloat(((item.totalProfit / item.totalSales) * 100).toFixed(2))
        }));
        
        // Sort by total sales (highest first)
        itemsAnalyticsArray.sort((a, b) => b.totalSales - a.totalSales);
        
        ResponseHandler.success(
            res,
            itemsAnalyticsArray,
            "Item-wise sales analytics retrieved successfully"
        );
    } catch (error) {
        console.error("Error calculating item sales analytics:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};

export const getSalesAnalyticsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return ResponseHandler.error(res, "Start date and end date are required", 400);
        }
        
        // Parse dates and set time to start and end of day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        // Get invoices within date range
        const invoices = await Invoice.find({
            date: { $gte: start, $lte: end }
        });
        
        if (!invoices || invoices.length === 0) {
            return ResponseHandler.error(res, "No invoices found in the specified date range", 404);
        }

        let totalSales = 0;
        let totalProfit = 0;
        let totalGoodsValue = 0;
        let itemsSold = 0;
        let totalSellingAmount = 0; // New field for sum of all grandTotals
        
        // Calculate total selling amount from invoice grandTotals
        for (const invoice of invoices) {
            totalSellingAmount += Number(invoice.grandTotal) || 0;
        }
        
        // Process each invoice
        for (const invoice of invoices) {
            if (invoice.items && Array.isArray(invoice.items)) {
                // Process each item in the invoice
                for (const item of invoice.items) {
                    const quantity = Number(item.quantity) || 0;
                    const sellingPrice = Number(item.sellingPrice) || 0;
                    const unitPrice = Number(item.unit_prize) || 0;
                    
                    // Calculate values
                    const itemSales = sellingPrice * quantity;
                    totalSales += itemSales;
                    
                    const itemGoodsValue = unitPrice * quantity;
                    totalGoodsValue += itemGoodsValue;
                    
                    const itemProfit = itemSales - itemGoodsValue;
                    totalProfit += itemProfit;
                    
                    itemsSold += quantity;
                }
            }
        }
        
        // Prepare response data
        const analyticsData = {
            startDate: start,
            endDate: end,
            totalSellingAmount: parseFloat(totalSellingAmount.toFixed(2)), // New field with sum of all invoice grandTotals
            totalSales: parseFloat(totalSales.toFixed(2)),
            totalProfit: parseFloat(totalProfit.toFixed(2)),
            totalGoodsValue: parseFloat(totalGoodsValue.toFixed(2)),
            profitMargin: parseFloat(((totalProfit / totalSales) * 100).toFixed(2)),
            totalInvoices: invoices.length,
            itemsSold: itemsSold
        };
        
        ResponseHandler.success(
            res,
            analyticsData,
            "Sales analytics for date range retrieved successfully"
        );
    } catch (error) {
        console.error("Error calculating sales analytics by date range:", error);
        ResponseHandler.error(res, error.message || "Internal Server Error", 500);
    }
};