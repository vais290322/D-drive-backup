import express from 'express';
import invoiceController from '../Controllers/invoice.controller.js';


const router = express.Router();



// Create a new invoice
router
.post('/create', invoiceController.createInvoice)
.get('/invoices', invoiceController.getAllInvoices)


// Get a single invoice by ID
.get('/invoices/:id', invoiceController.getInvoiceById)

// Update an invoice by ID
.put('/update/:id', invoiceController.updateInvoice)

// Delete an invoice by ID
.delete('/delete/:id', invoiceController.deleteInvoice)

// Get an invoice by its invoice number
.get('/invoices/number/:invoiceNumber', invoiceController.getInvoiceByInvoiceNumber)

// Get invoices by customer name
.get('/invoices/customer/:customerName', invoiceController.getInvoicesByCustomerName)

// for analysis for invoice 

// In your routes file


export default router;


