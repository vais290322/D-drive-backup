import invoiceRepository from '../repository/invoice-repository.js';
import SnigdhaCurrentItems from "../SnigdhaModels/snigdhaCurrentitems.model.js";
import SnigdhaItem from '../SnigdhaModels/snigdhaItem.model.js';
import mongoose from 'mongoose';
import Invoice from '../invoicemodel/invoice.model.js';

class InvoiceService {
   
    async createInvoice(data) {
        try {
            // Check if invoice number already exists
            if (data.invoiceNumber) {
                const existingInvoice = await invoiceRepository.getInvoiceByInvoiceNumber(data.invoiceNumber);
                if (existingInvoice) {
                    throw new Error(`Invoice with number ${data.invoiceNumber} already exists.`);
                }
            }
    
            const inventoryItems = [];
    
            // Step 1: Validate stock availability
            for (const item of data.items) {
                const inventoryItem = await SnigdhaItem.findOne({ item_id: item.id });
    
                if (!inventoryItem) {
                    throw new Error(`Item with ID ${item.id} not found in inventory.`);
                }
    
                // console.log(`Checking stock for ${inventoryItem.item_name}: available=${inventoryItem.quantity}, requested=${item.quantity}`);
    
                if (inventoryItem.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for item: ${inventoryItem.item_name}`);
                }
                inventoryItem.group = item.group
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
        // The inventory check and update is now handled in the repository
        const updatedInvoice = await invoiceRepository.updateInvoice(id, updateData);
        if (!updatedInvoice) {
            throw new Error('Invoice not found or could not be updated');
        }
        return updatedInvoice;
    }

    async deleteInvoice(id) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid invoice ID');
            }
    
            const invoice = await Invoice.findById(id).session(session);
            if (!invoice) {
                throw new Error('Invoice not found');
            }
            
            // Restore inventory quantities for all items in the invoice
            if (invoice.items && invoice.items.length > 0) {
                for (const item of invoice.items) {
                    const inventoryItem = await SnigdhaItem.findOne({ item_id: item.id }).session(session);
                    if (inventoryItem) {
                        // Add back the quantity that was reduced when invoice was created
                        inventoryItem.quantity += Number(item.quantity);
                        inventoryItem.total_prize = inventoryItem.unit_prize * inventoryItem.quantity;
                        await inventoryItem.save({ session });
                    }
                }
            }
    
            // Delete the invoice
            const result = await Invoice.findByIdAndDelete(id).session(session);
            
            await session.commitTransaction();
            session.endSession();
            
            return result;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Error deleting invoice:", error);
            throw error;
        }
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
