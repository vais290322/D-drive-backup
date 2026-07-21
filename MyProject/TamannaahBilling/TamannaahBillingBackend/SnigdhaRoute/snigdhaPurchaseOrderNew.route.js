import express from 'express';
import {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrder,
    deletePurchaseOrder,
    getPurchaseOrdersByVendor,
    updatePaymentStatus
} from '../SnigdhaControllers/SnigdhaPurchaseOrderNew.controller.js';

const router = express.Router();

// Create a new purchase order
router.post('/create', createPurchaseOrder);

// Get all purchase orders
router.get('/all', getAllPurchaseOrders);

// Get a single purchase order by ID
router.get('/:id', getPurchaseOrderById);

// Update a purchase order
router.put('/update/:id', updatePurchaseOrder);

// Delete a purchase order
router.delete('/delete/:id', deletePurchaseOrder);

// Get purchase orders by vendor code
router.get('/vendor/:vendorCode', getPurchaseOrdersByVendor);

// Update payment status
router.patch('/payment-status/:id', updatePaymentStatus);

export default router;