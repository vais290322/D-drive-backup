import express from 'express';
import { getProfitLossByDateRange, getProfitLossDetails } from '../controllers/profitLoss.controller.js';

const router = express.Router();

router.get('/profit-loss-details', getProfitLossDetails);
router.get('/profit-loss-by-date', getProfitLossByDateRange);
export default router;