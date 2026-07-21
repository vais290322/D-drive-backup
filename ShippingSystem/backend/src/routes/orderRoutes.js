const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders
router.get('/', orderController.getAllOrders);

// Create a new order
router.post('/', orderController.createOrder);

// Create a dummy order
router.post('/create-dummy', orderController.createDummyOrder);

// Process Shiprocket order
router.post('/process-shiprocket', orderController.processShiprocketOrder);

// Get a single order
router.get('/:id', orderController.getOrderById);

// Update an order
router.put('/:id', orderController.updateOrder);

// Delete an order
router.delete('/:id', orderController.deleteOrder);

// Track shipment
router.get('/track/:orderId', orderController.trackShipment);

module.exports = router;