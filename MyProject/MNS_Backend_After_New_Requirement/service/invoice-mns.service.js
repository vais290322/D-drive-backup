import InvoiceRepository from '../repository/invoice-mns-repository.js';
import Item from "../Models/item.model.js";
import mongoose from 'mongoose';

class InvoiceService {
    // async createInvoice(data) {
    //     try {
    //         // Check if invoice number already exists
    //         if (data.invoiceNumber) {
    //             const existingInvoice = await InvoiceRepository.getInvoiceByInvoiceNumber(data.invoiceNumber);
    //             if (existingInvoice) {
    //                 throw new Error(`Invoice with number ${data.invoiceNumber} already exists.`);
    //             }
    //         }
            
    //         const inventoryItems = [];

    //         // Step 1: Validate stock availability
    //         for (const item of data.items) {
    //             const inventoryItem = await Item.findOne({ item_id: item.item_id });

    //             if (!inventoryItem) {
    //                 throw new Error(`Item with ID ${item.item_id} not found in inventory.`);
    //             }

    //             if (inventoryItem.quantity < item.quantity) {
    //                 throw new Error(`Insufficient stock for item: ${inventoryItem.item_name}`);
    //             }

    //             // Store inventory item reference for later stock reduction
    //             inventoryItems.push({ inventoryItem, quantityToReduce: item.quantity });
    //         }

    //         // Step 2: Create invoice first
    //         const invoice = await InvoiceRepository.createInvoice(data);

    //         // Step 3: Only after invoice creation, reduce stock
    //         for (const { inventoryItem, quantityToReduce } of inventoryItems) {
    //             inventoryItem.quantity -= quantityToReduce;
    //             inventoryItem.total_prize = inventoryItem.unit_prize * inventoryItem.quantity;
    //             await inventoryItem.save();
    //         }

    //         return invoice;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async createInvoice(data) {
        try {
            // Check if invoice number already exists
            if (data.invoiceNumber) {
                const existingInvoice = await InvoiceRepository.getInvoiceByInvoiceNumber(data.invoiceNumber);
                if (existingInvoice) {
                    throw new Error(`Invoice with number ${data.invoiceNumber} already exists.`);
                }
            }
    
            // Validate and update stock in one loop
            for (const item of data.items) {
                const inventoryItem = await Item.findOne({ item_id: item.item_id });
    
                if (!inventoryItem) {
                    throw new Error(`Item with ID ${item.item_id} not found in inventory.`);
                }
    
                if (inventoryItem.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for item: ${inventoryItem.item_name}`);
                }
    
                // Copy required fields from inventory item to invoice item
                  inventoryItem.group = item.group
                
                // Update inventory stock directly
                inventoryItem.quantity -= item.quantity;
                inventoryItem.total_prize = inventoryItem.unit_prize * inventoryItem.quantity;
                await inventoryItem.save();
            }
    
            // Create invoice after stock validation and update
            const invoice = await InvoiceRepository.createInvoice(data);
            return invoice;
    
        } catch (error) {
            throw error;
        }
    }

    async getInvoiceById(id) {
        try {
            return await InvoiceRepository.getInvoiceById(id);
        } catch (error) {
            throw new Error(`Error in getInvoiceById service: ${error.message}`);
        }
    }

    async getInvoices(filter = {}) {
        try {
            return await InvoiceRepository.getInvoices(filter);
        } catch (error) {
            throw new Error(`Error in getInvoices service: ${error.message}`);
        }
    }

    async updateInvoice(id, updateData) {
        try {
            // The inventory check and update is now handled in the repository
            return await InvoiceRepository.updateInvoice(id, updateData);
            // console.log("undefine id new ; ", id)
        } catch (error) {
            // console.log("Error in updateInvoice service: new ", error);
            throw new Error(`Error in updateInvoice service: ${error.message}`);
        }
    }

    async deleteInvoice(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid invoice ID');
            }
            
            // The inventory restoration is now handled in the repository
            return await InvoiceRepository.deleteInvoice(id);
        } catch (error) {
            throw new Error(`Error in deleteInvoice service: ${error.message}`);
        }
    }

    async getInvoiceByInvoiceNumber(invoiceNumber) {
        try {
            return await InvoiceRepository.getInvoiceByInvoiceNumber(invoiceNumber);
        } catch (error) {
            throw new Error(`Error in getInvoiceByInvoiceNumber service: ${error.message}`);
        }
    }

    async getInvoicesByCustomerName(customerName) {
        try {
            return await InvoiceRepository.getInvoicesByCustomerName(customerName);
        } catch (error) {
            throw new Error(`Error in getInvoicesByCustomerName service: ${error.message}`);
        }
    }
}

export default new InvoiceService();