import Invoice from '../invoicemodel/invoice.model.js';

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
        try {
            return await Invoice.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
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
