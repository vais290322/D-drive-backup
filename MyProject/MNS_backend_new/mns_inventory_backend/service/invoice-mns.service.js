import InvoiceRepository from '../repository/invoice-mns-repository.js';
import MNSCurrentItems from "../Models/currentItems.model.js"
class InvoiceService {
    async createInvoice(data) {
        console.log(data)
        try {
            const inventoryItems = [];

            // Step 1: Validate stock availability
            for (const item of data.items) {
                const inventoryItem = await MNSCurrentItems.findOne({ item_id: item.id });

                if (!inventoryItem) {
                    throw new Error(`Item with ID ${item.id} not found in inventory.`);
                }

                console.log(
                    `Checking stock for ${inventoryItem.item_name}: available=${inventoryItem.quantity}, requested=${item.quantity}`
                );

                if (inventoryItem.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for item: ${inventoryItem.item_name}`);
                }

                // Store inventory item reference for later stock reduction
                inventoryItems.push({ inventoryItem, quantityToReduce: item.quantity });
            }

            // Step 2: Create invoice first
            const invoice = await InvoiceRepository.createInvoice(data);

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
            return await InvoiceRepository.updateInvoice(id, updateData);
        } catch (error) {
            throw new Error(`Error in updateInvoice service: ${error.message}`);
        }
    }

    async deleteInvoice(id) {
        try {
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