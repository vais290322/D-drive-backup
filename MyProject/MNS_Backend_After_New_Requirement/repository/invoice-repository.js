import Invoice from '../invoicemodel/invoice.model.js';
import SnigdhaItem from '../SnigdhaModels/snigdhaItem.model.js';
import mongoose from 'mongoose';

class InvoiceRepository {
    async createInvoice(invoiceData) {
        try {
            const invoice = new Invoice(invoiceData);
            return await invoice.save();
        } catch (error) {
            throw new Error(`Error creating invoice: ${error.message}`);
        }
    }

    async getInvoiceById(id) {
        try {
            return await Invoice.findById(id);
        } catch (error) {
            throw new Error(`Error fetching invoice by ID: ${error.message}`);
        }
    }

    async getInvoices(filter = {}) {
        try {
            return await Invoice.find(filter);
        } catch (error) {
            throw new Error(`Error fetching invoices: ${error.message}`);
        }
    }

    async updateInvoice(id, updateData) {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            // Get the original invoice to compare items
            const originalInvoice = await Invoice.findById(id).session(session);
            if (!originalInvoice) {
                throw new Error('Invoice not found');
            }
            
            // If items are being updated, handle inventory changes
            if (updateData.items && Array.isArray(updateData.items)) {
                // First, restore the inventory for original items
                for (const originalItem of originalInvoice.items) {
                    console.log("original item : ",originalItem)
                    const inventoryItem = await SnigdhaItem.findOne({ item_id: originalItem.id }).session(session);
                    if (inventoryItem) {
                        // Restore the quantity that was reduced
                        inventoryItem.quantity += Number(originalItem.quantity);
                        inventoryItem.total_prize = inventoryItem.unit_prize * inventoryItem.quantity;
                        await inventoryItem.save({ session });
                    }
                }
                
                // Then, validate and reduce inventory for new items
                for (const newItem of updateData.items) {
                    console.log("new item : ",newItem)
                    const inventoryItem = await SnigdhaItem.findOne({ item_id: newItem.item_id }).session(session);
                    console.log("inventory item : ",inventoryItem)
                    
                    if (!inventoryItem) {
                        throw new Error(`Item with ID ${newItem.item_id} not found in inventory.`);
                    }
                    
                    if (inventoryItem.quantity < newItem.quantity) {
                        throw new Error(`Insufficient stock for item: ${inventoryItem.item_name}`);
                    }
                    
                    // Reduce inventory
                    inventoryItem.quantity -= Number(newItem.quantity);
                    inventoryItem.total_prize = inventoryItem.unit_prize * inventoryItem.quantity;
                    await inventoryItem.save({ session });
                }
            }
            
            // Update the invoice
            const updatedInvoice = await Invoice.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true, session }
            );
            
            await session.commitTransaction();
            session.endSession();
            
            return updatedInvoice;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new Error(`Error updating invoice: ${error.message}`);
        }
    }

    async deleteInvoice(id) {
        try {
            return await Invoice.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
            throw new Error(`Error deleting invoice: ${error.message}`);
        }
    }

    async getInvoiceByInvoiceNumber(invoiceNumber) {
        try {
            return await Invoice.findOne({ invoiceNumber });
        } catch (error) {
            throw new Error(`Error fetching invoice by number: ${error.message}`);
        }
    }

    async getInvoicesByCustomerName(customerName) {
        try {
            return await Invoice.find({ customerName });
        } catch (error) {
            throw new Error(`Error fetching invoices by customer name: ${error.message}`);
        }
    }
}

export default new InvoiceRepository();
