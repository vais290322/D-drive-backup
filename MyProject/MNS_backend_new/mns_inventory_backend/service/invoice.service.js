import invoiceRepository from '../repository/invoice-repository.js';
import SnigdhaCurrentItems from "../SnigdhaModels/snigdhaCurrentitems.model.js"
class InvoiceService {
   
    // async createInvoice(data) {
    //     const session = await SnigdhaCurrentItems.startSession();
    //     session.startTransaction();
    
    //     try {
    //         for (const item of data.items) {
    //             const inventoryItem = await SnigdhaCurrentItems.findOne({ item_id: item.id }).session(session);
    //             if (!inventoryItem) {
    //                 throw new Error(`Item with ID ${item.id} not found in inventory.`);
    //             }
    
    //             console.log(`Inventory for ${inventoryItem.item_name}: available=${inventoryItem.quantity}, requested=${item.quantity}`);
    
    //             if (inventoryItem.quantity < item.quantity) {
    //                 throw new Error(`Insufficient stock for item: ${inventoryItem.item_name}`);
    //             }
    
    //             inventoryItem.quantity -= item.quantity;
    //             await inventoryItem.save({ session });
    //         }
    
    //         const invoice = await invoiceRepository.createInvoice(data);
    //         await session.commitTransaction();
    //         session.endSession();
    
    //         return invoice;
    //     } catch (error) {
    //         await session.abortTransaction();
    //         session.endSession();
    //         throw error; // Re-throw the error after rollback
    //     }
    // }
    // async createInvoice(data) {
    //     try {
    //         for (const item of data.items) {
    //             // Find the inventory item by item_id
    //             const inventoryItem = await SnigdhaCurrentItems.findOne({ item_id: item.id });
    
    //             if (!inventoryItem) {
    //                 throw new Error(`Item with ID ${item.id} not found in inventory.`);
    //             }
    
    //             console.log(`Inventory for ${inventoryItem.item_name}: available=${inventoryItem.quantity}, requested=${item.quantity}`);
    
    //             // Use reduceStock() to safely update stock
    //             await inventoryItem.reduceStock(item.quantity);
    //         }
    
    //         // Create the invoice after all items are processed successfully
    //         const invoice = await invoiceRepository.createInvoice(data);
            
    //         return invoice;
    //     } catch (error) {
    //         console.error("Error creating invoice:", error);
    //         throw error;
    //     }
    // }
    async  createInvoice(data) {
        try {
            const inventoryItems = [];
    
            // Step 1: Validate stock availability
            for (const item of data.items) {
                const inventoryItem = await SnigdhaCurrentItems.findOne({ item_id: item.id });
    
                if (!inventoryItem) {
                    throw new Error(`Item with ID ${item.id} not found in inventory.`);
                }
    
                console.log(`Checking stock for ${inventoryItem.item_name}: available=${inventoryItem.quantity}, requested=${item.quantity}`);
    
                if (inventoryItem.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for item: ${inventoryItem.item_name}`);
                }
    
                // Store inventory item reference for later stock reduction
                inventoryItems.push({ inventoryItem, quantityToReduce: item.quantity });
            }
    
            // Step 2: Create invoice first
            const invoice = await invoiceRepository.createInvoice(data);
    
            // Step 3: Only after invoice creation, reduce stock
            for (const { inventoryItem, quantityToReduce } of inventoryItems) {
                inventoryItem.quantity -= quantityToReduce;
                inventoryItem.total_prize = inventoryItem.unit_prize * inventoryItem.quantity;
                await inventoryItem.save();
            }
    
            return invoice;
        } catch (error) {
            console.error("Error creating invoice:", error);
            throw error;
        }
    }
    
    
    
    
    

    async getInvoiceById(id) {
        const invoice = await invoiceRepository.getInvoiceById(id);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        return invoice;
    }

    async getAllInvoices(filter = {}) {
        return await invoiceRepository.getInvoices(filter);
    }

    async updateInvoice(id, updateData) {
        const updatedInvoice = await invoiceRepository.updateInvoice(id, updateData);
        if (!updatedInvoice) {
            throw new Error('Invoice not found or could not be updated');
        }
        return updatedInvoice;
    }

  async deleteInvoice(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid invoice ID');
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
        throw new Error('Invoice not found');
    }

    return await Invoice.findByIdAndDelete(id);
}


    async getInvoiceByInvoiceNumber(invoiceNumber) {
        const invoice = await invoiceRepository.getInvoiceByInvoiceNumber(invoiceNumber);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        return invoice;
    }

    async getInvoicesByCustomerName(customerName) {
        return await invoiceRepository.getInvoicesByCustomerName(customerName);
    }
}

export default new InvoiceService();
