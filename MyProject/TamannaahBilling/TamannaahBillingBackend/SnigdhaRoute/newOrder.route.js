import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder
} from '../SnigdhaControllers/newOrder.controller.js';

const router = express.Router();

// Create a new order
router.post('/create', createOrder);

// Get all orders
router.get('/all', getAllOrders);

// Get single order
router.get('/:id', getOrder);

// Update order
router.put('/update/:id', updateOrder);

// Delete order
router.delete('/delete/:id', deleteOrder);

export default router;