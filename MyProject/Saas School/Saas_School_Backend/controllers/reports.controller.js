import Purchase from "../models/Purchase.model.js";
import Sales from "../models/Salses.model.js";
import Inventory from "../models/Inventory.model.js";
import Categories from "../models/Categories.model.js";
import SubCategories from "../models/SubCategories.model.js";

// Helper function to get date range for today
const getTodayDateRange = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
};

// Helper function to get date range for custom period
const getDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

// ==================== TODAY'S REPORTS ====================

// Get Today's Sales Report
export const getTodaySalesReport = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { startOfDay, endOfDay } = getTodayDateRange();
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        const sales = await Sales.find({
            schoolId,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ date: -1 });

        const summary = {
            totalTransactions: sales.length,
            totalGrossAmount: sales.reduce((sum, sale) => sum + sale.grossAmount, 0),
            totalDiscount: sales.reduce((sum, sale) => sum + sale.discount, 0),
            totalNetAmount: sales.reduce((sum, sale) => sum + sale.netAmount, 0),
            totalAmount: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
            totalItemsSold: sales.reduce((sum, sale) =>
                sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            )
        };

        res.status(200).json({
            success: true,
            message: "Today's sales report fetched successfully",
            data: {
                summary,
                transactions: sales,
                reportDate: new Date().toISOString().split('T')[0]
            },
            totalSalesAmount: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching today's sales report",
            error: true,
            data: null
        });
    }
};

// Get Today's Purchase Report
export const getTodayPurchaseReport = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { startOfDay, endOfDay } = getTodayDateRange();
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        const purchases = await Purchase.find({
            schoolId,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ date: -1 });

        const summary = {
            totalTransactions: purchases.length,
            totalGrossAmount: purchases.reduce((sum, purchase) => sum + purchase.grossAmount, 0),
            totalDiscount: purchases.reduce((sum, purchase) => sum + purchase.discount, 0),
            totalNetAmount: purchases.reduce((sum, purchase) => sum + purchase.netAmount, 0),
            totalAmount: purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0),
            totalItemsPurchased: purchases.reduce((sum, purchase) =>
                sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            )
        };

        res.status(200).json({
            success: true,
            message: "Today's purchase report fetched successfully",
            data: {
                summary,
                transactions: purchases,
                reportDate: new Date().toISOString().split('T')[0]
            },
            error: false,
            
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching today's purchase report",
            error: true,
            data: null
        });
    }
};

// Get Today's Overall Report (Sales + Purchase)
export const getTodayOverallReport = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { startOfDay, endOfDay } = getTodayDateRange();
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        const [sales, purchases] = await Promise.all([
            Sales.find({
                schoolId,
                date: { $gte: startOfDay, $lte: endOfDay }
            }),
            Purchase.find({
                schoolId,
                date: { $gte: startOfDay, $lte: endOfDay }
            })
        ]);

        const salesSummary = {
            totalTransactions: sales.length,
            totalAmount: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
            totalDiscount: sales.reduce((sum, sale) => sum + sale.discount, 0),
            totalItems: sales.reduce((sum, sale) =>
                sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            )
        };

        const purchaseSummary = {
            totalTransactions: purchases.length,
            totalAmount: purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0),
            totalDiscount: purchases.reduce((sum, purchase) => sum + purchase.discount, 0),
            totalItems: purchases.reduce((sum, purchase) =>
                sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            )
        };

        const profitLoss = salesSummary.totalAmount - purchaseSummary.totalAmount;

        res.status(200).json({
            success: true,
            message: "Today's overall report fetched successfully",
            data: {
                sales: salesSummary,
                purchases: purchaseSummary,
                profitLoss,
                netRevenue: salesSummary.totalAmount,
                netExpenditure: purchaseSummary.totalAmount,
                reportDate: new Date().toISOString().split('T')[0]
            },
            error: false,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching today's overall report",
            error: true,
            data: null
        });
    }
};

// ==================== ALL TIME REPORTS ====================

// Get All Time Sales Report
export const getAllTimeSalesReport = async (req, res) => {
    try {
        const { schoolId } = req.params;
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        const sales = await Sales.find({ schoolId }).sort({ date: -1 });

        const summary = {
            totalTransactions: sales.length,
            totalGrossAmount: sales.reduce((sum, sale) => sum + sale.grossAmount, 0),
            totalDiscount: sales.reduce((sum, sale) => sum + sale.discount, 0),
            totalNetAmount: sales.reduce((sum, sale) => sum + sale.netAmount, 0),
            totalAmount: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
            totalItemsSold: sales.reduce((sum, sale) =>
                sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            ),
            averageTransactionValue: sales.length > 0
                ? sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length
                : 0
        };

        // Get first and last transaction dates
        const firstTransaction = sales.length > 0 ? sales[sales.length - 1].date : null;
        const lastTransaction = sales.length > 0 ? sales[0].date : null;

        res.status(200).json({
            success: true,
            message: "All time sales report fetched successfully",
            data: {
                summary,
                firstTransaction,
                lastTransaction,
                recentTransactions: sales.slice(0, 10) // Last 10 transactions
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching all time sales report",
            error: true,
            data: null
        });
    }
};

// Get All Time Purchase Report
export const getAllTimePurchaseReport = async (req, res) => {
    try {
        const { schoolId } = req.params;
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        const purchases = await Purchase.find({ schoolId }).sort({ date: -1 });

        const summary = {
            totalTransactions: purchases.length,
            totalGrossAmount: purchases.reduce((sum, purchase) => sum + purchase.grossAmount, 0),
            totalDiscount: purchases.reduce((sum, purchase) => sum + purchase.discount, 0),
            totalNetAmount: purchases.reduce((sum, purchase) => sum + purchase.netAmount, 0),
            totalAmount: purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0),
            totalItemsPurchased: purchases.reduce((sum, purchase) =>
                sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            ),
            averageTransactionValue: purchases.length > 0
                ? purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0) / purchases.length
                : 0
        };

        // Get first and last transaction dates
        const firstTransaction = purchases.length > 0 ? purchases[purchases.length - 1].date : null;
        const lastTransaction = purchases.length > 0 ? purchases[0].date : null;

        res.status(200).json({
            success: true,
            message: "All time purchase report fetched successfully",
            data: {
                summary,
                firstTransaction,
                lastTransaction,
                recentTransactions: purchases.slice(0, 10) // Last 10 transactions
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching all time purchase report",
            error: true,
            data: null
        });
    }
};

// Get All Time Overall Report
export const getAllTimeOverallReport = async (req, res) => {
    try {
        const { schoolId } = req.params;
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        const [sales, purchases] = await Promise.all([
            Sales.find({ schoolId }),
            Purchase.find({ schoolId })
        ]);

        const salesSummary = {
            totalTransactions: sales.length,
            totalAmount: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
            totalDiscount: sales.reduce((sum, sale) => sum + sale.discount, 0),
            totalItems: sales.reduce((sum, sale) =>
                sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            ),
            averageValue: sales.length > 0
                ? sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length
                : 0
        };

        const purchaseSummary = {
            totalTransactions: purchases.length,
            totalAmount: purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0),
            totalDiscount: purchases.reduce((sum, purchase) => sum + purchase.discount, 0),
            totalItems: purchases.reduce((sum, purchase) =>
                sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            ),
            averageValue: purchases.length > 0
                ? purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0) / purchases.length
                : 0
        };

        const profitLoss = salesSummary.totalAmount - purchaseSummary.totalAmount;

        res.status(200).json({
            success: true,
            message: "All time overall report fetched successfully",
            data: {
                sales: salesSummary,
                purchases: purchaseSummary,
                profitLoss,
                profitMargin: salesSummary.totalAmount > 0
                    ? ((profitLoss / salesSummary.totalAmount) * 100).toFixed(2) + '%'
                    : '0%',
                netRevenue: salesSummary.totalAmount,
                netExpenditure: purchaseSummary.totalAmount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching all time overall report",
            error: true,
            data: null
        });
    }
};

// ==================== INVENTORY REPORTS ====================

// Get Current Inventory Report
export const getInventoryReport = async (req, res) => {
    try {
        const { schoolId } = req.params;
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        const inventory = await Inventory.find({ schoolId })
            .populate('categoryId', 'name')
            .populate('subCategoryId', 'name')
            .sort({ stock: 1 });

        const summary = {
            totalItems: inventory.length,
            totalStock: inventory.reduce((sum, item) => sum + item.stock, 0),
            totalValue: inventory.reduce((sum, item) => sum + item.totalPrice, 0),
            totalPurchaseStock: inventory.reduce((sum, item) => sum + item.totalPurchaseStock, 0),
            totalSellStock: inventory.reduce((sum, item) => sum + item.totalSellStock, 0),
            lowStockItems: inventory.filter(item => item.stock < 10).length,
            outOfStockItems: inventory.filter(item => item.stock === 0).length
        };

        const lowStockItems = inventory.filter(item => item.stock < 10 && item.stock > 0);
        const outOfStockItems = inventory.filter(item => item.stock === 0);

        res.status(200).json({
            success: true,
            message: "Inventory report fetched successfully",
            data: {
                summary,
                lowStockItems,
                outOfStockItems,
                allItems: inventory
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching inventory report",
            error: true,
            data: null
        });
    }
};

// ==================== CATEGORY-WISE REPORTS ====================

// Get Category-wise Sales Report
export const getCategoryWiseSalesReport = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { startDate, endDate } = req.query;
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        let dateFilter = { schoolId };
        if (startDate && endDate) {
            const { start, end } = getDateRange(startDate, endDate);
            dateFilter.date = { $gte: start, $lte: end };
        }

        const sales = await Sales.find(dateFilter);

        // Aggregate by category
        const categoryMap = new Map();

        sales.forEach(sale => {
            sale.items.forEach(item => {
                const categoryKey = item.category;
                if (!categoryMap.has(categoryKey)) {
                    categoryMap.set(categoryKey, {
                        category: item.category,
                        categoryId: item.categoryId,
                        totalQuantity: 0,
                        totalAmount: 0,
                        transactions: 0
                    });
                }
                const categoryData = categoryMap.get(categoryKey);
                categoryData.totalQuantity += item.quantity;
                categoryData.totalAmount += item.totalPrice;
                categoryData.transactions += 1;
            });
        });

        const categoryReport = Array.from(categoryMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);

        res.status(200).json({
            success: true,
            message: "Category-wise sales report fetched successfully",
            data: {
                totalCategories: categoryReport.length,
                categories: categoryReport
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching category-wise sales report",
            error: true,
            data: null
        });
    }
};

// Get Category-wise Purchase Report
export const getCategoryWisePurchaseReport = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { startDate, endDate } = req.query;
        
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        let dateFilter = { schoolId };
        if (startDate && endDate) {
            const { start, end } = getDateRange(startDate, endDate);
            dateFilter.date = { $gte: start, $lte: end };
        }

        const purchases = await Purchase.find(dateFilter);

        // Aggregate by category
        const categoryMap = new Map();

        purchases.forEach(purchase => {
            purchase.items.forEach(item => {
                const categoryKey = item.category;
                if (!categoryMap.has(categoryKey)) {
                    categoryMap.set(categoryKey, {
                        category: item.category,
                        categoryId: item.categoryId,
                        totalQuantity: 0,
                        totalAmount: 0,
                        transactions: 0
                    });
                }
                const categoryData = categoryMap.get(categoryKey);
                categoryData.totalQuantity += item.quantity;
                categoryData.totalAmount += item.totalPrice;
                categoryData.transactions += 1;
            });
        });

        const categoryReport = Array.from(categoryMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);

        res.status(200).json({
            success: true,
            message: "Category-wise purchase report fetched successfully",
            data: {
                totalCategories: categoryReport.length,
                categories: categoryReport
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching category-wise purchase report",
            error: true,
            data: null
        });
    }
};

// ==================== CUSTOM DATE RANGE REPORTS ====================

// Get Sales Report by Date Range
export const getSalesReportByDateRange = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { startDate, endDate } = req.query;
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        const { start, end } = getDateRange(startDate, endDate);

        const sales = await Sales.find({
            schoolId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        const summary = {
            totalTransactions: sales.length,
            totalGrossAmount: sales.reduce((sum, sale) => sum + sale.grossAmount, 0),
            totalDiscount: sales.reduce((sum, sale) => sum + sale.discount, 0),
            totalNetAmount: sales.reduce((sum, sale) => sum + sale.netAmount, 0),
            totalAmount: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
            totalItemsSold: sales.reduce((sum, sale) =>
                sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            )
        };

        res.status(200).json({
            success: true,
            message: "Sales report by date range fetched successfully",
            data: {
                summary,
                transactions: sales,
                dateRange: { startDate, endDate }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching sales report by date range",
            error: true,
            data: null
        });
    }
};

// Get Purchase Report by Date Range
export const getPurchaseReportByDateRange = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { startDate, endDate } = req.query;
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        const { start, end } = getDateRange(startDate, endDate);

        const purchases = await Purchase.find({
            schoolId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        const summary = {
            totalTransactions: purchases.length,
            totalGrossAmount: purchases.reduce((sum, purchase) => sum + purchase.grossAmount, 0),
            totalDiscount: purchases.reduce((sum, purchase) => sum + purchase.discount, 0),
            totalNetAmount: purchases.reduce((sum, purchase) => sum + purchase.netAmount, 0),
            totalAmount: purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0),
            totalItemsPurchased: purchases.reduce((sum, purchase) =>
                sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
            )
        };

        res.status(200).json({
            success: true,
            message: "Purchase report by date range fetched successfully",
            data: {
                summary,
                transactions: purchases,
                dateRange: { startDate, endDate }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching purchase report by date range",
            error: true,
            data: null
        });
    }
};

// ==================== TOP ITEMS REPORTS ====================

// Get Top Selling Items
export const getTopSellingItems = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { limit = 10, startDate, endDate } = req.query;
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        let dateFilter = { schoolId };
        if (startDate && endDate) {
            const { start, end } = getDateRange(startDate, endDate);
            dateFilter.date = { $gte: start, $lte: end };
        }

        const sales = await Sales.find(dateFilter);

        // Aggregate by item
        const itemMap = new Map();

        sales.forEach(sale => {
            sale.items.forEach(item => {
                const itemKey = item.code;
                if (!itemMap.has(itemKey)) {
                    itemMap.set(itemKey, {
                        name: item.name,
                        code: item.code,
                        category: item.category,
                        subCategory: item.subCategory,
                        totalQuantity: 0,
                        totalRevenue: 0,
                        transactions: 0
                    });
                }
                const itemData = itemMap.get(itemKey);
                itemData.totalQuantity += item.quantity;
                itemData.totalRevenue += item.totalPrice;
                itemData.transactions += 1;
            });
        });

        const topItems = Array.from(itemMap.values())
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, parseInt(limit));

        res.status(200).json({
            success: true,
            message: "Top selling items fetched successfully",
            data: {
                topItems,
                totalUniqueItems: itemMap.size
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching top selling items",
            error: true,
            data: null
        });
    }
};

// Get Top Purchased Items
export const getTopPurchasedItems = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { limit = 10, startDate, endDate } = req.query;
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        let dateFilter = { schoolId };
        if (startDate && endDate) {
            const { start, end } = getDateRange(startDate, endDate);
            dateFilter.date = { $gte: start, $lte: end };
        }

        const purchases = await Purchase.find(dateFilter);

        // Aggregate by item
        const itemMap = new Map();

        purchases.forEach(purchase => {
            purchase.items.forEach(item => {
                const itemKey = item.code;
                if (!itemMap.has(itemKey)) {
                    itemMap.set(itemKey, {
                        name: item.name,
                        code: item.code,
                        category: item.category,
                        subCategory: item.subCategory,
                        totalQuantity: 0,
                        totalCost: 0,
                        transactions: 0
                    });
                }
                const itemData = itemMap.get(itemKey);
                itemData.totalQuantity += item.quantity;
                itemData.totalCost += item.totalPrice;
                itemData.transactions += 1;
            });
        });

        const topItems = Array.from(itemMap.values())
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, parseInt(limit));

        res.status(200).json({
            success: true,
            message: "Top purchased items fetched successfully",
            data: {
                topItems,
                totalUniqueItems: itemMap.size
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching top purchased items",
            error: true,
            data: null
        });
    }
};

// ==================== COMPREHENSIVE DASHBOARD REPORT ====================

// Get Complete Dashboard Report
export const getDashboardReport = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { startOfDay, endOfDay } = getTodayDateRange();
        if (!schoolId) {
            return res.status(400).json({
                success: false,
                message: "School ID is required",
                error: true,
                data: null
            });
        }

        // Fetch all data in parallel
        const [
            todaySales,
            todayPurchases,
            allTimeSales,
            allTimePurchases,
            inventory,
            categories,
            subCategories
        ] = await Promise.all([
            Sales.find({ schoolId, date: { $gte: startOfDay, $lte: endOfDay } }),
            Purchase.find({ schoolId, date: { $gte: startOfDay, $lte: endOfDay } }),
            Sales.find({ schoolId }),
            Purchase.find({ schoolId }),
            Inventory.find({ schoolId }),
            Categories.find({ schoolId }),
            SubCategories.find({ schoolId })
        ]);

        // Today's Summary
        const todaySummary = {
            sales: {
                transactions: todaySales.length,
                amount: todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
                items: todaySales.reduce((sum, sale) =>
                    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                )
            },
            purchases: {
                transactions: todayPurchases.length,
                amount: todayPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0),
                items: todayPurchases.reduce((sum, purchase) =>
                    sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                )
            }
        };

        // All Time Summary
        const allTimeSummary = {
            sales: {
                transactions: allTimeSales.length,
                amount: allTimeSales.reduce((sum, sale) => sum + sale.totalAmount, 0),
                items: allTimeSales.reduce((sum, sale) =>
                    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                )
            },
            purchases: {
                transactions: allTimePurchases.length,
                amount: allTimePurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0),
                items: allTimePurchases.reduce((sum, purchase) =>
                    sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                )
            }
        };

        // Inventory Summary
        const inventorySummary = {
            totalItems: inventory.length,
            totalStock: inventory.reduce((sum, item) => sum + item.stock, 0),
            totalValue: inventory.reduce((sum, item) => sum + item.totalPrice, 0),
            lowStockItems: inventory.filter(item => item.stock < 10 && item.stock > 0).length,
            outOfStockItems: inventory.filter(item => item.stock === 0).length,
            lowStockList: inventory.filter(item => item.stock < 10 && item.stock > 0),
            outOfStockList: inventory.filter(item => item.stock === 0)
        };

        // Categories Summary
        const categoriesSummary = {
            totalCategories: categories.length,
            totalSubCategories: subCategories.length
        };

        res.status(200).json({
            success: true,
            message: "Dashboard report fetched successfully",
            data: {
                today: todaySummary,
                allTime: allTimeSummary,
                inventory: inventorySummary,
                categories: categoriesSummary,
                profitLoss: {
                    today: todaySummary.sales.amount - todaySummary.purchases.amount,
                    allTime: allTimeSummary.sales.amount - allTimeSummary.purchases.amount
                },
                reportGeneratedAt: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching dashboard report",
            error: true,
            data: null
        });
    }
};
