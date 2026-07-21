import express from 'express';
import {
  createMoneyTransfer,
  getAllMoneyTransfers,
  getMoneyTransferById,
  getMoneyTransfersByBankId,
  getMoneyTransfersByDateRange
} from '../SnigdhaControllers/snigdhaMoneyTransfer.controller.js';
// import { verifyToken } from '../Middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
// router.use(verifyToken);

// Create a new money transfer
router.post('/', createMoneyTransfer);

// Get all money transfers
router.get('/', getAllMoneyTransfers);

// Get a single money transfer by ID
router.get('/:id', getMoneyTransferById);

// Get money transfers by bank ID (either source or destination)
router.get('/bank/:bankId', getMoneyTransfersByBankId);

// Get money transfers by date range
router.get('/date-range', getMoneyTransfersByDateRange);

export default router;