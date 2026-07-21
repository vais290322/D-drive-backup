import express from "express";
import { getItemSalesAnalytics, getSalesAnalytics, getSalesAnalyticsByDateRange } from "../SnigdhaControllers/snigdhaParchaseOrder.controller.js";

const router = express.Router();

// In your Snigdha routes file
router.get('/analytics/sales', getSalesAnalytics);
router.get('/analytics/items', getItemSalesAnalytics);
router.get('/analytics/date-range', getSalesAnalyticsByDateRange);

export default router;