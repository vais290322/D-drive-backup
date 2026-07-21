import ResponseHandler from "../Middelwares/ResponseHandler.js";
import Company from "../Models/company.model.js";
import PurchaseOrder from "../Models/ParchaseOrder.model.js";
import CurrentItems from "../Models/currentItems.model.js";


export const getAllPurchaseOrders = async (req, res) => {
    try {
        // Fetch all purchase orders from the database
        const purchaseOrders = await PurchaseOrder.find();

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
        const purchaseOrder = await PurchaseOrder.findById(id);
        if (!purchaseOrder) {
            return ResponseHandler.error(res, "Purchase order not found", 404);
        }

        // Delete the purchase order
        await PurchaseOrder.findByIdAndDelete(id);

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

        // Process each item to check inventory and reduce quantities
        for (const item of items) {
            const currentItem = await CurrentItems.findOne({ item_id: item.item_id });
            
            if (!currentItem) {
                return ResponseHandler.error(res, `Item ${item.item_id} not found in inventory`, 404);
            }
            
            const orderQuantity = Number(item.quantity);
            
            if (orderQuantity > currentItem.quantity) {
                return ResponseHandler.error(res, `Not enough quantity in stock for item ${item.item_id}`, 400);
            }
            
            // If order quantity matches available quantity, delete the entire item
            if (orderQuantity === currentItem.quantity) {
                const isDeleted = await CurrentItems.deleteOne({ item_id: item.item_id });
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
          
        const companyDetails = await Company.findById(clientId);
  
        // If the company is not found
        if (!companyDetails) {
            return ResponseHandler.error(res, "Company not found", 404);
        }
        
        const newPurchaseOrder = new PurchaseOrder({
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

        if (!item_id) {
            return ResponseHandler.error(res, "Item ID is required", 400);
        }

        // Find all purchase orders that contain the specified item_id in their items array
        const purchaseOrders = await PurchaseOrder.find({
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


