import express from 'express';
import { 
    getSnigdhaProfitLossDetails,
    getSnigdhaProfitLossByDateRange 
} from '../SnigdhaControllers/snigdhaProfiLoss.controller.js';

const router = express.Router();

router.get('/snigdha-profit-loss', getSnigdhaProfitLossDetails);
router.get('/snigdha-profit-loss-by-date', getSnigdhaProfitLossByDateRange);

export default router;