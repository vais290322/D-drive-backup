import InvoiceService from "../service/invoice-mns.service.js";

class InvoiceController {
    async createInvoice(req, res) {
        try {
            const invoice = await InvoiceService.createInvoice(req.body);
            return res.status(201).json({ success: true, message: "Invoice created successfully", data: invoice });
        } catch (error) {
            console.error("Error in createInvoice:", error);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async getInvoiceById(req, res) {
        try {
            const invoice = await InvoiceService.getInvoiceById(req.params.id);
            if (!invoice) {
                return res.status(404).json({ success: false, message: "Invoice not found" });
            }
            return res.status(200).json({ success: true, data: invoice });
        } catch (error) {
            console.error("Error in getInvoiceById:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async getInvoices(req, res) { 
        try {
            const invoices = await InvoiceService.getInvoices(req.query);
            return res.status(200).json({ success: true, data: invoices });
        } catch (error) {
            console.error("Error in getInvoices:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async updateInvoice(req, res) {
        try {
            // console.log("Received update request with data:", req.params.id);
            const updatedInvoice = await InvoiceService.updateInvoice(req.params.id, req.body);
            if (!updatedInvoice) {
                return res.status(404).json({ success: false, message: "Invoice not found" });
            }
            return res.status(200).json({ success: true, message: "Invoice updated successfully", data: updatedInvoice });
        } catch (error) {
            // console.error("Error in updateInvoice:", error);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async deleteInvoice(req, res) {
        // console.log("Received ID:", req.params.id);
    
        try {
            const deletedInvoice = await InvoiceService.deleteInvoice(req.params.id);
            if (!deletedInvoice) {
                return res.status(404).json({ success: false, message: "Invoice not found" });
            }
            return res.status(200).json({ success: true, message: "Invoice deleted successfully" });
        } catch (error) {
            console.error("Error in deleteInvoice:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    

    async getInvoiceByInvoiceNumber(req, res) {
        try {
            const invoice = await InvoiceService.getInvoiceByInvoiceNumber(req.params.invoiceNumber);
            if (!invoice) {
                return res.status(404).json({ success: false, message: "Invoice not found" });
            }
            return res.status(200).json({ success: true, data: invoice });
        } catch (error) {
            console.error("Error in getInvoiceByInvoiceNumber:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async getInvoicesByCustomerName(req, res) {
        try {
            const invoices = await InvoiceService.getInvoicesByCustomerName(req.params.customerName);
            return res.status(200).json({ success: true, data: invoices });
        } catch (error) {
            console.error("Error in getInvoicesByCustomerName:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export default new InvoiceController();
