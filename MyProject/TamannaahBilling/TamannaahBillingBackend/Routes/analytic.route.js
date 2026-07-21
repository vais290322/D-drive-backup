import express from "express";
import { getItemSalesAnalytics, getSalesAnalytics, getSalesAnalyticsByDateRange } from "../Controllers/ParchaseOrder.controller.js";


const router = express.Router();


// In your routes file
router.get('/analytics/sales', getSalesAnalytics);
router.get('/analytics/items', getItemSalesAnalytics);
router.get('/analytics/date-range', getSalesAnalyticsByDateRange);

export default router;