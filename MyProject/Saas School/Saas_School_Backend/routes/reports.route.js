import express from "express";
import {
    getTodaySalesReport,
    getTodayPurchaseReport,
    getTodayOverallReport,
    getAllTimeSalesReport,
    getAllTimePurchaseReport,
    getAllTimeOverallReport,
    getInventoryReport,
    getCategoryWiseSalesReport,
    getCategoryWisePurchaseReport,
    getSalesReportByDateRange,
    getPurchaseReportByDateRange,
    getTopSellingItems,
    getTopPurchasedItems,
    getDashboardReport
} from "../controllers/reports.controller.js";

const router = express.Router();

// ==================== TODAY'S REPORTS ====================
// GET /api/reports/:schoolId/today/sales - Get today's sales report
router.get("/:schoolId/today/sales", getTodaySalesReport);

// GET /api/reports/:schoolId/today/purchases - Get today's purchase report
router.get("/:schoolId/today/purchases", getTodayPurchaseReport);

// GET /api/reports/:schoolId/today/overall - Get today's overall report (sales + purchases)
router.get("/:schoolId/today/overall", getTodayOverallReport);

// ==================== ALL TIME REPORTS ====================
// GET /api/reports/:schoolId/alltime/sales - Get all time sales report
router.get("/:schoolId/alltime/sales", getAllTimeSalesReport);

// GET /api/reports/:schoolId/alltime/purchases - Get all time purchase report
router.get("/:schoolId/alltime/purchases", getAllTimePurchaseReport);

// GET /api/reports/:schoolId/alltime/overall - Get all time overall report
router.get("/:schoolId/alltime/overall", getAllTimeOverallReport);

// ==================== INVENTORY REPORTS ====================
// GET /api/reports/:schoolId/inventory - Get current inventory report
router.get("/:schoolId/inventory", getInventoryReport);

// ==================== CATEGORY-WISE REPORTS ====================
// GET /api/reports/:schoolId/category/sales?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD - Get category-wise sales report
router.get("/:schoolId/category/sales", getCategoryWiseSalesReport);

// GET /api/reports/:schoolId/category/purchases?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD - Get category-wise purchase report
router.get("/:schoolId/category/purchases", getCategoryWisePurchaseReport);

// ==================== DATE RANGE REPORTS ====================
// GET /api/reports/:schoolId/daterange/sales?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD - Get sales report by date range
router.get("/:schoolId/daterange/sales", getSalesReportByDateRange);

// GET /api/reports/:schoolId/daterange/purchases?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD - Get purchase report by date range
router.get("/:schoolId/daterange/purchases", getPurchaseReportByDateRange);

// ==================== TOP ITEMS REPORTS ====================
// GET /api/reports/:schoolId/top/selling?limit=10&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD - Get top selling items
router.get("/:schoolId/top/selling", getTopSellingItems);

// GET /api/reports/:schoolId/top/purchased?limit=10&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD - Get top purchased items
router.get("/:schoolId/top/purchased", getTopPurchasedItems);

// ==================== DASHBOARD REPORT ====================
// GET /api/reports/:schoolId/dashboard - Get complete dashboard report
router.get("/:schoolId/dashboard", getDashboardReport);

export default router;
