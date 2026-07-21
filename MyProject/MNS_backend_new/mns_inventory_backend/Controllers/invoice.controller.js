import invoiceMnsModel from '../invoicemodel/invoice-mns.model.js';
import invoiceModel from '../invoicemodel/invoice.model.js';
import invoiceService from '../service/invoice.service.js';
import Invoice from '../invoicemodel/invoice.model.js';

class InvoiceController {
    async createInvoice(req, res) {
        console.log( req.body)
        // return;
        try {
            const invoice = await invoiceService.createInvoice(req.body);
            res.status(201).json({
                data:invoice,
                message: 'Invoice created successfully',
                success: true,
            });
        } catch (error) {
            res.status(400).json({ 
                error: error,
                success: false,
                message: 'Failed to create invoices'
            });
        }
    }

    async getInvoiceById(req, res) {
        try {
            const invoice = await invoiceService.getInvoiceById(req.params.id);
            res.status(200).json(invoice);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getAllInvoices(req, res) {
        try {
            const invoices = await invoiceService.getAllInvoices(req.query);
            res.status(200).json({
                data:invoices,
                message: "Invoices Fetched successfully",
                success: true
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateInvoice(req, res) {
        try {

            const updatedInvoice = await invoiceService.updateInvoice(req.params.id, req.body);
            res.status(200).json(updatedInvoice);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteInvoice(req, res) {
        try {
            console.log(req.params.id)
            await Invoice.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Invoice deleted successfully' });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getInvoiceByInvoiceNumber(req, res) {
        try {
            const invoice = await invoiceService.getInvoiceByInvoiceNumber(req.params.invoiceNumber);
            res.status(200).json(invoice);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getInvoicesByCustomerName(req, res) {
        try {
            const invoices = await invoiceService.getInvoicesByCustomerName(req.params.customerName);
            res.status(200).json(invoices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new InvoiceController();
