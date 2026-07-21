import mongoose from "mongoose";
import Item from "../Models/item.model.js";
import MnsPurchaseOrderNew from "../Models/mnsPurchaseOrderNew.model.js";
import InvoiceMns from "../invoicemodel/invoice-mns.model.js";
import Bank from "../Models/bank.model.js";
import PurchaseAccount from "../Models/purchaseAccount.model.js";
import { Ledger } from "../Models/ledgerAccount.model.js";
import { ServiceAccount } from "../Models/serviceAccount.model.js";
import Expense from "../Models/expense.model.js";
import ImprestFund from "../Models/imprestFund.model.js";
import Withdraw from "../Models/withdraw.model.js";
import DepositCredit from "../Models/depositCredit.model.js";
import Perfoma from "../Models/perfoma.model.js";
import Service from "../Models/service.model.js";
import GroupName from "../Models/group.model.js";
import PurchaseWindow from "../Models/purchasewindow.model.js";
import MoneyTransfer from "../Models/moneyTransfer.model.js";

// Helper function to validate date range
const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { isValid: false, message: "Both start date and end date are required" };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, message: "Invalid date format" };
  }

  if (start > end) {
    return { isValid: false, message: "Start date cannot be after end date" };
  }

  return { isValid: true };
};

// 1. Inventory Reports
export const getInventoryReport = async (req, res) => {
  try {
    const { group, lowStock, sortBy, order } = req.query;

    // Build query based on filters
    let query = {};

    if (group) {
      query.group = group;
    }

    if (lowStock === 'true') {
      // Define low stock threshold (e.g., less than 10 items)
      query.quantity = { $lt: 10 };
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions = { item_name: 1 }; // Default sort by name
    }

    const items = await Item.find(query).sort(sortOptions);

    // Calculate inventory statistics
    const totalItems = await Item.countDocuments();
    const totalStock = await Item.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);

    const totalValue = await Item.aggregate([
      { $group: { _id: null, total: { $sum: "$total_prize" } } }
    ]);

    // Group items by category
    const itemsByGroup = await Item.aggregate([
      {
        $group: {
          _id: "$group",
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: "$total_prize" }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        items,
        stats: {
          totalItems,
          totalStock: totalStock.length > 0 ? totalStock[0].total : 0,
          totalValue: totalValue.length > 0 ? totalValue[0].total : 0,
          itemsByGroup
        }
      }
    });
  } catch (error) {
    console.error("Error generating inventory report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating inventory report",
      error: error.message
    });
  }
};

// 2. Sales Reports
export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, customerName, paymentStatus } = req.query;

    // Validate date range if provided
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }
    }

    // Build query based on filters
    let query = {};

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (customerName) {
      query["receiverDetails.name"] = { $regex: customerName, $options: "i" };
    }

    if (paymentStatus) {
      if (paymentStatus === 'paid') {
        query.isPaid = true;
      } else if (paymentStatus === 'unpaid') {
        query.isPaid = false;
      }
    }

    // Get invoices
    const invoices = await InvoiceMns.find(query).sort({ date: -1 });

    // Calculate sales statistics
    const totalSales = invoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0);
    const totalPaid = invoices.reduce((sum, invoice) => sum + (invoice.isPaid ? invoice.grandTotal : 0), 0);
    const totalUnpaid = totalSales - totalPaid;

    // Group sales by date
    const salesByDate = await InvoiceMns.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalSales: { $sum: "$grandTotal" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top selling items
    const topSellingItems = await InvoiceMns.aggregate([
      { $match: query },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.item_id",
          itemName: { $first: "$items.itemName" },
          totalQuantity: { $sum: "$items.quantity" },
          totalAmount: { $sum: "$items.amount" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        invoices,
        stats: {
          totalSales,
          totalPaid,
          totalUnpaid,
          invoiceCount: invoices.length,
          salesByDate,
          topSellingItems
        }
      }
    });
  } catch (error) {
    console.error("Error generating sales report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating sales report",
      error: error.message
    });
  }
};

// 3. Purchase Reports
export const getPurchaseReport = async (req, res) => {
  try {
    const { startDate, endDate, vendorName, paymentStatus } = req.query;

    // Validate date range if provided
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }
    }

    // Build query based on filters
    let query = {};

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (vendorName) {
      query.vendorName = { $regex: vendorName, $options: "i" };
    }

    if (paymentStatus) {
      if (paymentStatus === 'paid') {
        query.paidOne = true;
      } else if (paymentStatus === 'unpaid') {
        query.paidOne = false;
      }
    }

    // Get purchase orders
    const purchaseOrders = await MnsPurchaseOrderNew.find(query).sort({ date: -1 });

    // Calculate purchase statistics
    const totalPurchases = purchaseOrders.reduce((sum, po) => {
      return sum + (po.totalAmount || po.items.reduce((itemSum, item) => itemSum + item.amount, 0));
    }, 0);

    const totalPaid = purchaseOrders.reduce((sum, po) => {
      const amount = po.totalAmount || po.items.reduce((itemSum, item) => itemSum + item.amount, 0);
      return sum + (po.paidOne ? amount : 0);
    }, 0);

    const totalUnpaid = totalPurchases - totalPaid;

    // Group purchases by date
    const purchasesByDate = await MnsPurchaseOrderNew.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalPurchases: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top purchased items
    const topPurchasedItems = await MnsPurchaseOrderNew.aggregate([
      { $match: query },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.item_id",
          itemName: { $first: "$items.itemName" },
          totalQuantity: { $sum: "$items.quantity" },
          totalAmount: { $sum: "$items.amount" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    // Group by vendor
    const purchasesByVendor = await MnsPurchaseOrderNew.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$vendorName",
          totalAmount: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        purchaseOrders,
        stats: {
          totalPurchases,
          totalPaid,
          totalUnpaid,
          purchaseOrderCount: purchaseOrders.length,
          purchasesByDate,
          topPurchasedItems,
          purchasesByVendor
        }
      }
    });
  } catch (error) {
    console.error("Error generating purchase report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating purchase report",
      error: error.message
    });
  }
};

// 4. Financial Reports
export const getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    // Validate date range
    const validation = validateDateRange(startDate, endDate);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Prepare date filter
    const dateFilter = { $gte: start, $lte: end };

    // Initialize response object
    const financialData = {
      summary: {},
      details: {}
    };

    // Get all financial data based on type
    if (!type || type === 'all' || type === 'income') {
      // Sales income
      const salesIncome = await InvoiceMns.aggregate([
        { $match: { date: dateFilter } },
        {
          $group: {
            _id: null,
            total: { $sum: "$grandTotal" },
            count: { $sum: 1 }
          }
        }
      ]);

      // Service income
      const serviceIncome = await Service.aggregate([
        { $match: { date: dateFilter } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]);

      // Deposits
      const deposits = await DepositCredit.aggregate([
        { $match: { date: dateFilter } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]);

      financialData.details.income = {
        sales: salesIncome.length > 0 ? salesIncome[0] : { total: 0, count: 0 },
        services: serviceIncome.length > 0 ? serviceIncome[0] : { total: 0, count: 0 },
        deposits: deposits.length > 0 ? deposits[0] : { total: 0, count: 0 }
      };

      financialData.summary.totalIncome =
        (salesIncome.length > 0 ? salesIncome[0].total : 0) +
        (serviceIncome.length > 0 ? serviceIncome[0].total : 0) +
        (deposits.length > 0 ? deposits[0].total : 0);
    }

    if (!type || type === 'all' || type === 'expense') {
      // Purchase expenses
      const purchaseExpenses = await MnsPurchaseOrderNew.aggregate([
        { $match: { date: dateFilter } },
        {
          $group: {
            _id: null,
            total: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } },
            count: { $sum: 1 }
          }
        }
      ]);

      // General expenses
      const generalExpenses = await Expense.aggregate([
        { $match: { date: dateFilter } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]);

      // Withdrawals
      const withdrawals = await Withdraw.aggregate([
        { $match: { date: dateFilter } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]);

      financialData.details.expenses = {
        purchases: purchaseExpenses.length > 0 ? purchaseExpenses[0] : { total: 0, count: 0 },
        general: generalExpenses.length > 0 ? generalExpenses[0] : { total: 0, count: 0 },
        withdrawals: withdrawals.length > 0 ? withdrawals[0] : { total: 0, count: 0 }
      };

      financialData.summary.totalExpenses =
        (purchaseExpenses.length > 0 ? purchaseExpenses[0].total : 0) +
        (generalExpenses.length > 0 ? generalExpenses[0].total : 0) +
        (withdrawals.length > 0 ? withdrawals[0].total : 0);
    }

    // Calculate profit/loss
    if (!type || type === 'all') {
      financialData.summary.profitLoss = financialData.summary.totalIncome - financialData.summary.totalExpenses;
    }

    // Get monthly breakdown
    if (!type || type === 'all' || type === 'monthly') {
      // Monthly income
      const monthlyIncome = await InvoiceMns.aggregate([
        { $match: { date: dateFilter } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
            total: { $sum: "$grandTotal" }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Monthly expenses
      const monthlyExpenses = await MnsPurchaseOrderNew.aggregate([
        { $match: { date: dateFilter } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
            total: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      financialData.details.monthly = {
        income: monthlyIncome,
        expenses: monthlyExpenses
      };
    }

    // Get bank balances
    const bankBalances = await Bank.find().select('bankName accountNumber currentBalance');
    financialData.details.bankBalances = bankBalances;

    // Get imprest fund balance
    const imprestFund = await ImprestFund.findOne().select('currentAmount');
    financialData.details.imprestFund = imprestFund;

    return res.status(200).json({
      success: true,
      data: financialData
    });
  } catch (error) {
    console.error("Error generating financial report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating financial report",
      error: error.message
    });
  }
};

// 5. Accounts Receivable Report
export const getAccountsReceivableReport = async (req, res) => {
  try {
    const { dueOnly, sortBy, order } = req.query;

    // Build query
    let query = {};
    if (dueOnly === 'true') {
      query.isPaid = false;
      query.dueAmount = { $gt: 0 };
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions = { dueAmount: -1 }; // Default sort by highest due amount
    }

    // Get ledger accounts with due amounts
    const ledgerAccounts = await Ledger.find(query)
      .sort(sortOptions)
      .populate('invoiceId', 'date receiverDetails');

    // Get service accounts with due amounts
    const serviceAccounts = await ServiceAccount.find(query)
      .sort(sortOptions)
      .populate('invoiceId', 'date clientName');

    // Calculate statistics
    const totalReceivable = await Ledger.aggregate([
      { $match: { isPaid: false } },
      { $group: { _id: null, total: { $sum: "$dueAmount" } } }
    ]);

    const totalServiceReceivable = await ServiceAccount.aggregate([
      { $match: { isPaid: false } },
      { $group: { _id: null, total: { $sum: "$dueAmount" } } }
    ]);

    // Aging analysis (0-30, 31-60, 61-90, >90 days)
    const currentDate = new Date();

    const agingAnalysis = {
      '0-30': { count: 0, amount: 0 },
      '31-60': { count: 0, amount: 0 },
      '61-90': { count: 0, amount: 0 },
      '>90': { count: 0, amount: 0 }
    };

    // Process ledger accounts for aging
    for (const account of ledgerAccounts) {
      if (!account.isPaid && account.invoiceId && account.invoiceId.date) {
        const invoiceDate = new Date(account.invoiceId.date);
        const daysDiff = Math.floor((currentDate - invoiceDate) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 30) {
          agingAnalysis['0-30'].count++;
          agingAnalysis['0-30'].amount += account.dueAmount;
        } else if (daysDiff <= 60) {
          agingAnalysis['31-60'].count++;
          agingAnalysis['31-60'].amount += account.dueAmount;
        } else if (daysDiff <= 90) {
          agingAnalysis['61-90'].count++;
          agingAnalysis['61-90'].amount += account.dueAmount;
        } else {
          agingAnalysis['>90'].count++;
          agingAnalysis['>90'].amount += account.dueAmount;
        }
      }
    }

    // Process service accounts for aging
    for (const account of serviceAccounts) {
      if (!account.isPaid && account.invoiceId && account.invoiceId.date) {
        const invoiceDate = new Date(account.invoiceId.date);
        const daysDiff = Math.floor((currentDate - invoiceDate) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 30) {
          agingAnalysis['0-30'].count++;
          agingAnalysis['0-30'].amount += account.dueAmount;
        } else if (daysDiff <= 60) {
          agingAnalysis['31-60'].count++;
          agingAnalysis['31-60'].amount += account.dueAmount;
        } else if (daysDiff <= 90) {
          agingAnalysis['61-90'].count++;
          agingAnalysis['61-90'].amount += account.dueAmount;
        } else {
          agingAnalysis['>90'].count++;
          agingAnalysis['>90'].amount += account.dueAmount;
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        ledgerAccounts,
        serviceAccounts,
        stats: {
          totalReceivable: totalReceivable.length > 0 ? totalReceivable[0].total : 0,
          totalServiceReceivable: totalServiceReceivable.length > 0 ? totalServiceReceivable[0].total : 0,
          totalDueAccounts: ledgerAccounts.length + serviceAccounts.length,
          agingAnalysis
        }
      }
    });
  } catch (error) {
    console.error("Error generating accounts receivable report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating accounts receivable report",
      error: error.message
    });
  }
};

// 6. Accounts Payable Report
export const getAccountsPayableReport = async (req, res) => {
  try {
    const { dueOnly, sortBy, order } = req.query;

    // Build query
    let query = {};
    if (dueOnly === 'true') {
      query.isPaid = false;
      query.dueAmount = { $gt: 0 };
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions = { dueAmount: -1 }; // Default sort by highest due amount
    }

    // Get purchase accounts with due amounts
    const purchaseAccounts = await PurchaseAccount.find(query)
      .sort(sortOptions)
      .populate('invoiceId', 'date vendorName');

    // Calculate statistics
    const totalPayable = await PurchaseAccount.aggregate([
      { $match: { isPaid: false } },
      { $group: { _id: null, total: { $sum: "$dueAmount" } } }
    ]);

    // Aging analysis (0-30, 31-60, 61-90, >90 days)
    const currentDate = new Date();

    const agingAnalysis = {
      '0-30': { count: 0, amount: 0 },
      '31-60': { count: 0, amount: 0 },
      '61-90': { count: 0, amount: 0 },
      '>90': { count: 0, amount: 0 }
    };

    // Process purchase accounts for aging
    for (const account of purchaseAccounts) {
      if (!account.isPaid && account.invoiceId && account.invoiceId.date) {
        const invoiceDate = new Date(account.invoiceId.date);
        const daysDiff = Math.floor((currentDate - invoiceDate) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 30) {
          agingAnalysis['0-30'].count++;
          agingAnalysis['0-30'].amount += account.dueAmount;
        } else if (daysDiff <= 60) {
          agingAnalysis['31-60'].count++;
          agingAnalysis['31-60'].amount += account.dueAmount;
        } else if (daysDiff <= 90) {
          agingAnalysis['61-90'].count++;
          agingAnalysis['61-90'].amount += account.dueAmount;
        } else {
          agingAnalysis['>90'].count++;
          agingAnalysis['>90'].amount += account.dueAmount;
        }
      }
    }

    // Group by vendor
    const payablesByVendor = await PurchaseAccount.aggregate([
      { $match: { isPaid: false } },
      {
        $group: {
          _id: "$vendorName",
          totalDue: { $sum: "$dueAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalDue: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        purchaseAccounts,
        stats: {
          totalPayable: totalPayable.length > 0 ? totalPayable[0].total : 0,
          totalDueAccounts: purchaseAccounts.length,
          agingAnalysis,
          payablesByVendor
        }
      }
    });
  } catch (error) {
    console.error("Error generating accounts payable report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating accounts payable report",
      error: error.message
    });
  }
};



// 7. Tax Reports (completing the implementation)
export const getTaxReport = async (req, res) => {
  try {
    const { startDate, endDate, taxType } = req.query;

    // Validate date range
    const validation = validateDateRange(startDate, endDate);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Prepare date filter
    const dateFilter = { $gte: start, $lte: end };

    // Initialize tax data
    const taxData = {
      collected: {},
      paid: {},
      summary: {}
    };

    // Get tax collected from sales
    const salesTax = await InvoiceMns.aggregate([
      { $match: { date: dateFilter } },
      {
        $group: {
          _id: null,
          totalTax: { $sum: "$taxAmount" },
          totalCGST: { $sum: "$cgstAmount" },
          totalSGST: { $sum: "$sgstAmount" },
          totalIGST: { $sum: "$igstAmount" },
          count: { $sum: 1 }
        }
      }
    ]);

    taxData.collected.sales = salesTax.length > 0 ? salesTax[0] : {
      totalTax: 0, totalCGST: 0, totalSGST: 0, totalIGST: 0, count: 0
    };

    // Get tax paid on purchases
    const purchaseTax = await MnsPurchaseOrderNew.aggregate([
      { $match: { date: dateFilter } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalCGST: { $sum: "$items.cgst" },
          totalSGST: { $sum: "$items.sgst" },
          totalIGST: { $sum: "$items.igst" },
          count: { $sum: 1 }
        }
      }
    ]);

    taxData.paid.purchases = purchaseTax.length > 0 ? {
      ...purchaseTax[0],
      totalTax: (purchaseTax[0].totalCGST || 0) + (purchaseTax[0].totalSGST || 0) + (purchaseTax[0].totalIGST || 0)
    } : { totalTax: 0, totalCGST: 0, totalSGST: 0, totalIGST: 0, count: 0 };

    // Calculate net tax
    taxData.summary = {
      netCGST: taxData.collected.sales.totalCGST - taxData.paid.purchases.totalCGST,
      netSGST: taxData.collected.sales.totalSGST - taxData.paid.purchases.totalSGST,
      netIGST: taxData.collected.sales.totalIGST - taxData.paid.purchases.totalIGST,
      netTax: taxData.collected.sales.totalTax - taxData.paid.purchases.totalTax
    };

    // Get monthly breakdown
    const monthlyTaxCollected = await InvoiceMns.aggregate([
      { $match: { date: dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalTax: { $sum: "$taxAmount" },
          totalCGST: { $sum: "$cgstAmount" },
          totalSGST: { $sum: "$sgstAmount" },
          totalIGST: { $sum: "$igstAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyTaxPaid = await MnsPurchaseOrderNew.aggregate([
      { $match: { date: dateFilter } },
      { $unwind: "$items" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalCGST: { $sum: "$items.cgst" },
          totalSGST: { $sum: "$items.sgst" },
          totalIGST: { $sum: "$items.igst" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    taxData.details = {
      monthlyCollected: monthlyTaxCollected,
      monthlyPaid: monthlyTaxPaid
    };

    // Get tax details by HSN code if requested
    if (!taxType || taxType === 'hsn') {
      const taxByHSN = await InvoiceMns.aggregate([
        { $match: { date: dateFilter } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.hsnCode",
            totalAmount: { $sum: "$items.amount" },
            totalTax: { $sum: "$items.taxAmount" },
            totalCGST: { $sum: "$items.cgstAmount" },
            totalSGST: { $sum: "$items.sgstAmount" },
            totalIGST: { $sum: "$items.igstAmount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { totalTax: -1 } }
      ]);

      taxData.details.byHSN = taxByHSN;
    }

    return res.status(200).json({
      success: true,
      data: taxData
    });
  } catch (error) {
    console.error("Error generating tax report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating tax report",
      error: error.message
    });
  }
};

// 8. Inventory Movement Report
export const getInventoryMovementReport = async (req, res) => {
  try {
    const { startDate, endDate, itemId, group } = req.query;

    // Validate date range
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }
    }

    // Build query for items
    let itemQuery = {};
    if (itemId) {
      itemQuery.item_id = itemId;
    }
    if (group) {
      itemQuery.group = group;
    }

    // Get items
    const items = await Item.find(itemQuery).sort({ item_name: 1 });

    // Prepare date filter for transactions
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Initialize movement data
    const movementData = [];

    // For each item, get inflow (purchases) and outflow (sales)
    for (const item of items) {
      // Get purchase data (inflow)
      let purchaseQuery = { "items.item_id": item.item_id };
      if (startDate && endDate) {
        purchaseQuery.date = dateFilter;
      }

      const purchases = await MnsPurchaseOrderNew.aggregate([
        { $match: purchaseQuery },
        { $unwind: "$items" },
        { $match: { "items.item_id": item.item_id } },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$items.quantity" },
            totalAmount: { $sum: "$items.amount" }
          }
        }
      ]);

      // Get sales data (outflow)
      let salesQuery = { "items.item_id": item.item_id };
      if (startDate && endDate) {
        salesQuery.date = dateFilter;
      }

      const sales = await InvoiceMns.aggregate([
        { $match: salesQuery },
        { $unwind: "$items" },
        { $match: { "items.item_id": item.item_id } },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$items.quantity" },
            totalAmount: { $sum: "$items.amount" }
          }
        }
      ]);

      // Calculate net movement
      const inflow = purchases.length > 0 ? purchases[0].totalQuantity : 0;
      const outflow = sales.length > 0 ? sales[0].totalQuantity : 0;
      const netMovement = inflow - outflow;

      // Add to movement data
      movementData.push({
        item_id: item.item_id,
        item_name: item.item_name,
        group: item.group,
        currentStock: item.quantity,
        inflow,
        outflow,
        netMovement,
        openingStock: item.quantity - netMovement,
        inflowValue: purchases.length > 0 ? purchases[0].totalAmount : 0,
        outflowValue: sales.length > 0 ? sales[0].totalAmount : 0
      });
    }

    // Calculate summary statistics
    const summary = {
      totalItems: movementData.length,
      totalInflow: movementData.reduce((sum, item) => sum + item.inflow, 0),
      totalOutflow: movementData.reduce((sum, item) => sum + item.outflow, 0),
      totalNetMovement: movementData.reduce((sum, item) => sum + item.netMovement, 0),
      totalInflowValue: movementData.reduce((sum, item) => sum + item.inflowValue, 0),
      totalOutflowValue: movementData.reduce((sum, item) => sum + item.outflowValue, 0)
    };

    return res.status(200).json({
      success: true,
      data: {
        items: movementData,
        summary
      }
    });
  } catch (error) {
    console.error("Error generating inventory movement report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating inventory movement report",
      error: error.message
    });
  }
};

// 9. Profit Margin Report
export const getProfitMarginReport = async (req, res) => {
  try {
    const { startDate, endDate, itemId, group, minMargin, maxMargin } = req.query;

    // Validate date range if provided
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }
    }

    // Build query for invoices
    let query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Get all sales with item details
    const sales = await InvoiceMns.aggregate([
      { $match: query },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "items",
          localField: "items.item_id",
          foreignField: "item_id",
          as: "itemDetails"
        }
      },
      { $unwind: "$itemDetails" },
      {
        $project: {
          date: 1,
          invoiceNumber: 1,
          "receiverDetails.name": 1,
          itemId: "$items.item_id",
          itemName: "$items.itemName",
          group: "$itemDetails.group",
          quantity: "$items.quantity",
          costPrice: "$itemDetails.unit_prize",
          sellingPrice: "$items.rate",
          totalCost: { $multiply: ["$items.quantity", "$itemDetails.unit_prize"] },
          totalSale: "$items.amount",
          profit: { $subtract: ["$items.amount", { $multiply: ["$items.quantity", "$itemDetails.unit_prize"] }] }
        }
      }
    ]);

    // Filter by item ID if provided
    let filteredSales = sales;
    if (itemId) {
      filteredSales = sales.filter(sale => sale.itemId === itemId);
    }

    // Filter by group if provided
    if (group) {
      filteredSales = filteredSales.filter(sale => sale.group === group);
    }

    // Calculate profit margin for each sale
    const salesWithMargin = filteredSales.map(sale => {
      const profitMargin = sale.totalCost > 0 ? (sale.profit / sale.totalCost) * 100 : 0;
      return {
        ...sale,
        profitMargin: parseFloat(profitMargin.toFixed(2))
      };
    });

    // Filter by margin range if provided
    let marginFilteredSales = salesWithMargin;
    if (minMargin) {
      marginFilteredSales = marginFilteredSales.filter(sale => sale.profitMargin >= parseFloat(minMargin));
    }
    if (maxMargin) {
      marginFilteredSales = marginFilteredSales.filter(sale => sale.profitMargin <= parseFloat(maxMargin));
    }

    // Group by item for summary
    const itemGroups = {};
    marginFilteredSales.forEach(sale => {
      if (!itemGroups[sale.itemId]) {
        itemGroups[sale.itemId] = {
          itemId: sale.itemId,
          itemName: sale.itemName,
          group: sale.group,
          totalQuantity: 0,
          totalCost: 0,
          totalSale: 0,
          totalProfit: 0,
          sales: []
        };
      }

      itemGroups[sale.itemId].totalQuantity += sale.quantity;
      itemGroups[sale.itemId].totalCost += sale.totalCost;
      itemGroups[sale.itemId].totalSale += sale.totalSale;
      itemGroups[sale.itemId].totalProfit += sale.profit;
      itemGroups[sale.itemId].sales.push(sale);
    });

    // Calculate average profit margin for each item
    const itemSummary = Object.values(itemGroups).map(group => {
      const avgMargin = group.totalCost > 0 ? (group.totalProfit / group.totalCost) * 100 : 0;
      return {
        ...group,
        avgProfitMargin: parseFloat(avgMargin.toFixed(2))
      };
    });

    // Sort by profit margin
    itemSummary.sort((a, b) => b.avgProfitMargin - a.avgProfitMargin);

    // Calculate overall summary
    const totalCost = marginFilteredSales.reduce((sum, sale) => sum + sale.totalCost, 0);
    const totalSale = marginFilteredSales.reduce((sum, sale) => sum + sale.totalSale, 0);
    const totalProfit = marginFilteredSales.reduce((sum, sale) => sum + sale.profit, 0);
    const overallMargin = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return res.status(200).json({
      success: true,
      data: {
        sales: marginFilteredSales,
        itemSummary,
        summary: {
          totalItems: itemSummary.length,
          totalSales: marginFilteredSales.length,
          totalCost,
          totalSale,
          totalProfit,
          overallMargin: parseFloat(overallMargin.toFixed(2))
        }
      }
    });
  } catch (error) {
    console.error("Error generating profit margin report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating profit margin report",
      error: error.message
    });
  }
};

// 10. Customer/Vendor Analysis Report
export const getBusinessPartnerReport = async (req, res) => {
  try {
    const { startDate, endDate, type, partnerId, minAmount, maxAmount } = req.query;

    // Validate date range
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }
    }

    // Prepare date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Initialize response data
    const reportData = {
      partners: [],
      summary: {}
    };

    // Get data based on partner type
    if (!type || type === 'customer') {
      // Build query for customer invoices
      let query = {};
      if (Object.keys(dateFilter).length > 0) {
        query.date = dateFilter;
      }
      if (partnerId) {
        query["receiverDetails.name"] = partnerId;
      }

      // Get customer sales data
      const customerSales = await InvoiceMns.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$receiverDetails.name",
            totalAmount: { $sum: "$grandTotal" },
            totalTax: { $sum: "$taxAmount" },
            invoiceCount: { $sum: 1 },
            firstPurchase: { $min: "$date" },
            lastPurchase: { $max: "$date" },
            invoices: { $push: { id: "$_id", date: "$date", amount: "$grandTotal", isPaid: "$isPaid" } }
          }
        },
        { $sort: { totalAmount: -1 } }
      ]);

      // Filter by amount range if provided
      let filteredCustomers = customerSales;
      if (minAmount) {
        filteredCustomers = filteredCustomers.filter(customer => customer.totalAmount >= parseFloat(minAmount));
      }
      if (maxAmount) {
        filteredCustomers = filteredCustomers.filter(customer => customer.totalAmount <= parseFloat(maxAmount));
      }

      // Add to report data
      reportData.partners = filteredCustomers.map(customer => ({
        name: customer._id,
        type: 'customer',
        totalAmount: customer.totalAmount,
        totalTax: customer.totalTax,
        transactionCount: customer.invoiceCount,
        firstTransaction: customer.firstPurchase,
        lastTransaction: customer.lastPurchase,
        transactions: customer.invoices
      }));

      // Calculate customer summary
      reportData.summary.customers = {
        count: filteredCustomers.length,
        totalAmount: filteredCustomers.reduce((sum, customer) => sum + customer.totalAmount, 0),
        totalTax: filteredCustomers.reduce((sum, customer) => sum + customer.totalTax, 0),
        totalTransactions: filteredCustomers.reduce((sum, customer) => sum + customer.invoiceCount, 0)
      };
    }

    if (!type || type === 'vendor') {
      // Build query for vendor purchases
      let query = {};
      if (Object.keys(dateFilter).length > 0) {
        query.date = dateFilter;
      }
      if (partnerId) {
        query.vendorName = partnerId;
      }

      // Get vendor purchase data
      const vendorPurchases = await MnsPurchaseOrderNew.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$vendorName",
            totalAmount: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } },
            purchaseCount: { $sum: 1 },
            firstPurchase: { $min: "$date" },
            lastPurchase: { $max: "$date" },
            purchases: { $push: { id: "$_id", date: "$date", amount: "$totalAmount", isPaid: "$paidOne" } }
          }
        },
        { $sort: { totalAmount: -1 } }
      ]);

      // Filter by amount range if provided
      let filteredVendors = vendorPurchases;
      if (minAmount) {
        filteredVendors = filteredVendors.filter(vendor => vendor.totalAmount >= parseFloat(minAmount));
      }
      if (maxAmount) {
        filteredVendors = filteredVendors.filter(vendor => vendor.totalAmount <= parseFloat(maxAmount));
      }

      // Add to report data if customer data wasn't requested
      if (type === 'vendor') {
        reportData.partners = filteredVendors.map(vendor => ({
          name: vendor._id,
          type: 'vendor',
          totalAmount: vendor.totalAmount,
          transactionCount: vendor.purchaseCount,
          firstTransaction: vendor.firstPurchase,
          lastTransaction: vendor.lastPurchase,
          transactions: vendor.purchases
        }));
      } else {
        // Add vendor data to existing customer data
        const vendorData = filteredVendors.map(vendor => ({
          name: vendor._id,
          type: 'vendor',
          totalAmount: vendor.totalAmount,
          transactionCount: vendor.purchaseCount,
          firstTransaction: vendor.firstPurchase,
          lastTransaction: vendor.lastPurchase,
          transactions: vendor.purchases
        }));

        reportData.partners = [...reportData.partners, ...vendorData];
      }

      // Calculate vendor summary
      reportData.summary.vendors = {
        count: filteredVendors.length,
        totalAmount: filteredVendors.reduce((sum, vendor) => sum + vendor.totalAmount, 0),
        totalTransactions: filteredVendors.reduce((sum, vendor) => sum + vendor.purchaseCount, 0)
      };
    }

    // Sort partners by total amount if both types are included
    if (!type) {
      reportData.partners.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    return res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error("Error generating business partner report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating business partner report",
      error: error.message
    });
  }
};

// 11. Consolidated Report (Dashboard Summary)
export const getDashboardReport = async (req, res) => {
  try {
    // Get current date and first day of month for default date range
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Get date parameters with defaults
    const { startDate = firstDayOfMonth.toISOString(), endDate = currentDate.toISOString() } = req.query;

    // Validate date range
    const validation = validateDateRange(startDate, endDate);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Prepare date filter
    const dateFilter = { $gte: start, $lte: end };

    // Initialize dashboard data
    const dashboardData = {
      summary: {},
      charts: {},
      recentActivity: {}
    };

    // Get sales summary
    const salesSummary = await InvoiceMns.aggregate([
      { $match: { date: dateFilter } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$grandTotal" },
          totalTax: { $sum: "$taxAmount" },
          count: { $sum: 1 },
          paid: { $sum: { $cond: ["$isPaid", "$grandTotal", 0] } },
          unpaid: { $sum: { $cond: ["$isPaid", 0, "$grandTotal"] } }
        }
      }
    ]);

    // Get purchase summary
    const purchaseSummary = await MnsPurchaseOrderNew.aggregate([
      { $match: { date: dateFilter } },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } },
          count: { $sum: 1 },
          paid: { $sum: { $cond: ["$paidOne", { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] }, 0] } },
          unpaid: { $sum: { $cond: ["$paidOne", 0, { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] }] } }
        }
      }
    ]);

    // Get expense summary
    const expenseSummary = await Expense.aggregate([
      { $match: { date: dateFilter } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get inventory summary
    const inventorySummary = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalStock: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$unit_prize"] } },
          lowStock: { $sum: { $cond: [{ $lt: ["$quantity", 10] }, 1, 0] } }
        }
      }
    ]);

    // Get bank account summary
    const bankSummary = await Bank.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$currentBalance" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get imprest fund balance
    const imprestFund = await ImprestFund.findOne().select('currentAmount');

    // Add summaries to dashboard data
    dashboardData.summary = {
      sales: salesSummary.length > 0 ? {
        total: salesSummary[0].totalSales,
        count: salesSummary[0].count,
        paid: salesSummary[0].paid,
        unpaid: salesSummary[0].unpaid
      } : { total: 0, count: 0, paid: 0, unpaid: 0 },

      purchases: purchaseSummary.length > 0 ? {
        total: purchaseSummary[0].totalPurchases,
        count: purchaseSummary[0].count,
        paid: purchaseSummary[0].paid,
        unpaid: purchaseSummary[0].unpaid
      } : { total: 0, count: 0, paid: 0, unpaid: 0 },

      expenses: expenseSummary.length > 0 ? {
        total: expenseSummary[0].totalExpenses,
        count: expenseSummary[0].count
      } : { total: 0, count: 0 },

      inventory: inventorySummary.length > 0 ? {
        totalItems: inventorySummary[0].totalItems,
        totalStock: inventorySummary[0].totalStock,
        totalValue: inventorySummary[0].totalValue,
        lowStock: inventorySummary[0].lowStock
      } : { totalItems: 0, totalStock: 0, totalValue: 0, lowStock: 0 },

      finance: {
        bankBalance: bankSummary.length > 0 ? bankSummary[0].totalBalance : 0,
        imprestFund: imprestFund ? imprestFund.currentAmount : 0,
        totalCash: (bankSummary.length > 0 ? bankSummary[0].totalBalance : 0) +
          (imprestFund ? imprestFund.currentAmount : 0)
      }
    };

    // Calculate profit/loss
    dashboardData.summary.profitLoss = {
      revenue: dashboardData.summary.sales.total,
      expenses: dashboardData.summary.purchases.total + dashboardData.summary.expenses.total,
      net: dashboardData.summary.sales.total - (dashboardData.summary.purchases.total + dashboardData.summary.expenses.total)
    };

    // Get daily sales and purchases for chart
    const dailySales = await InvoiceMns.aggregate([
      { $match: { date: dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$grandTotal" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dailyPurchases = await MnsPurchaseOrderNew.aggregate([
      { $match: { date: dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top selling items
    const topSellingItems = await InvoiceMns.aggregate([
      { $match: { date: dateFilter } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.item_id",
          itemName: { $first: "$items.itemName" },
          totalQuantity: { $sum: "$items.quantity" },
          totalAmount: { $sum: "$items.amount" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    // Get top customers
    const topCustomers = await InvoiceMns.aggregate([
      { $match: { date: dateFilter } },
      {
        $group: {
          _id: "$receiverDetails.name",
          totalAmount: { $sum: "$grandTotal" },
          invoiceCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 }
    ]);

    // Add chart data
    dashboardData.charts = {
      dailySales,
      dailyPurchases,
      topSellingItems,
      topCustomers
    };

    // Get recent activities
    // Get recent activities
    const recentInvoices = await InvoiceMns.find()
      .sort({ date: -1 })
      .limit(5)
      .select('date invoiceNumber receiverDetails.name grandTotal isPaid');

    const recentPurchases = await MnsPurchaseOrderNew.find()
      .sort({ date: -1 })
      .limit(5)
      .select('date vendorName totalAmount paidOne');

    const recentExpenses = await Expense.find()
      .sort({ date: -1 })
      .limit(5)
      .select('date description amount category');

    // Add recent activities to dashboard data
    dashboardData.recentActivity = {
      invoices: recentInvoices,
      purchases: recentPurchases,
      expenses: recentExpenses
    };

    // Get pending payments
    const pendingReceivables = await Ledger.find({ isPaid: false })
      .sort({ dueAmount: -1 })
      .limit(5)
      .populate('invoiceId', 'date receiverDetails');

    const pendingPayables = await PurchaseAccount.find({ isPaid: false })
      .sort({ dueAmount: -1 })
      .limit(5)
      .populate('invoiceId', 'date vendorName');

    dashboardData.recentActivity.pendingPayments = {
      receivables: pendingReceivables,
      payables: pendingPayables
    };

    return res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error("Error generating dashboard report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating dashboard report",
      error: error.message
    });
  }
};

// 12. Item Performance Report
export const getItemPerformanceReport = async (req, res) => {
  try {
    const { startDate, endDate, itemId, group, sortBy = 'salesQuantity', order = 'desc' } = req.query;

    // Validate date range
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }
    }

    // Prepare date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Build item query
    let itemQuery = {};
    if (itemId) {
      itemQuery.item_id = itemId;
    }
    if (group) {
      itemQuery.group = group;
    }

    // Get all items matching the query
    const items = await Item.find(itemQuery);
    const itemIds = items.map(item => item.item_id);

    // Get sales data for these items
    let salesQuery = {};
    if (Object.keys(dateFilter).length > 0) {
      salesQuery.date = dateFilter;
    }
    if (itemIds.length > 0) {
      salesQuery["items.item_id"] = { $in: itemIds };
    }

    const salesData = await InvoiceMns.aggregate([
      { $match: salesQuery },
      { $unwind: "$items" },
      { $match: itemIds.length > 0 ? { "items.item_id": { $in: itemIds } } : {} },
      {
        $group: {
          _id: "$items.item_id",
          itemName: { $first: "$items.itemName" },
          salesQuantity: { $sum: "$items.quantity" },
          salesAmount: { $sum: "$items.amount" },
          salesCount: { $sum: 1 },
          lastSold: { $max: "$date" }
        }
      }
    ]);

    // Create a map of sales data by item ID
    const salesMap = {};
    salesData.forEach(item => {
      salesMap[item._id] = item;
    });

    // Combine item data with sales data
    const performanceData = items.map(item => {
      const sales = salesMap[item.item_id] || {
        salesQuantity: 0,
        salesAmount: 0,
        salesCount: 0,
        lastSold: null
      };

      // Calculate turnover rate (sales quantity / average inventory)
      const turnoverRate = item.quantity > 0 ? sales.salesQuantity / item.quantity : 0;

      // Calculate days of supply (current quantity / average daily sales)
      const periodInDays = startDate && endDate ?
        Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 30;

      const avgDailySales = sales.salesQuantity / periodInDays;
      const daysOfSupply = avgDailySales > 0 ? Math.ceil(item.quantity / avgDailySales) : null;

      return {
        itemId: item.item_id,
        itemName: item.item_name,
        group: item.group,
        currentStock: item.quantity,
        costPrice: item.unit_prize,
        salesQuantity: sales.salesQuantity,
        salesAmount: sales.salesAmount,
        salesCount: sales.salesCount,
        lastSold: sales.lastSold,
        turnoverRate: parseFloat(turnoverRate.toFixed(2)),
        daysOfSupply,
        inventoryValue: item.quantity * item.unit_prize
      };
    });

    // Sort the performance data
    let sortField = sortBy;
    if (sortBy === 'turnover') sortField = 'turnoverRate';
    if (sortBy === 'supply') sortField = 'daysOfSupply';

    performanceData.sort((a, b) => {
      // Handle null values in sorting
      if (a[sortField] === null && b[sortField] === null) return 0;
      if (a[sortField] === null) return 1;
      if (b[sortField] === null) return -1;

      return order === 'desc' ?
        b[sortField] - a[sortField] :
        a[sortField] - b[sortField];
    });

    // Calculate summary statistics
    const summary = {
      totalItems: performanceData.length,
      totalSalesQuantity: performanceData.reduce((sum, item) => sum + item.salesQuantity, 0),
      totalSalesAmount: performanceData.reduce((sum, item) => sum + item.salesAmount, 0),
      totalInventoryValue: performanceData.reduce((sum, item) => sum + item.inventoryValue, 0),
      avgTurnoverRate: performanceData.length > 0 ?
        parseFloat((performanceData.reduce((sum, item) => sum + item.turnoverRate, 0) / performanceData.length).toFixed(2)) : 0
    };

    // Identify top performers and slow movers
    const topPerformers = [...performanceData]
      .sort((a, b) => b.salesAmount - a.salesAmount)
      .slice(0, 5);

    const slowMovers = [...performanceData]
      .filter(item => item.currentStock > 0)
      .sort((a, b) => a.turnoverRate - b.turnoverRate)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      data: {
        items: performanceData,
        summary,
        topPerformers,
        slowMovers
      }
    });
  } catch (error) {
    console.error("Error generating item performance report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating item performance report",
      error: error.message
    });
  }
};

// 13. Service Performance Report
export const getServicePerformanceReport = async (req, res) => {
  try {
    const { startDate, endDate, serviceId, sortBy = 'revenue', order = 'desc' } = req.query;

    // Validate date range
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }
    }

    // Prepare date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Build service query
    let serviceQuery = {};
    if (serviceId) {
      serviceQuery._id = serviceId;
    }

    // Get all services
    const services = await Service.find(serviceQuery);
    const serviceIds = services.map(service => service._id.toString());

    // Get service invoice data
    let invoiceQuery = {};
    if (Object.keys(dateFilter).length > 0) {
      invoiceQuery.date = dateFilter;
    }

    const serviceInvoices = await Perfoma.find(invoiceQuery);

    // Process service performance data
    const performanceData = services.map(service => {
      // Find invoices for this service
      const serviceRevenue = serviceInvoices
        .filter(invoice =>
          invoice.services.some(s => s.serviceId.toString() === service._id.toString())
        )
        .reduce((total, invoice) => {
          const serviceItem = invoice.services.find(s =>
            s.serviceId.toString() === service._id.toString()
          );
          return total + (serviceItem ? serviceItem.amount : 0);
        }, 0);

      const serviceCount = serviceInvoices
        .filter(invoice =>
          invoice.services.some(s => s.serviceId.toString() === service._id.toString())
        ).length;

      // Find the last date this service was sold
      const lastServiceInvoice = [...serviceInvoices]
        .filter(invoice =>
          invoice.services.some(s => s.serviceId.toString() === service._id.toString())
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      return {
        serviceId: service._id,
        serviceName: service.serviceName,
        description: service.description,
        basePrice: service.price,
        revenue: serviceRevenue,
        count: serviceCount,
        lastSold: lastServiceInvoice ? lastServiceInvoice.date : null,
        avgRevenuePerService: serviceCount > 0 ? serviceRevenue / serviceCount : 0
      };
    });

    // Sort the performance data
    performanceData.sort((a, b) => {
      if (sortBy === 'revenue') {
        return order === 'desc' ? b.revenue - a.revenue : a.revenue - b.revenue;
      } else if (sortBy === 'count') {
        return order === 'desc' ? b.count - a.count : a.count - b.count;
      } else if (sortBy === 'avgRevenue') {
        return order === 'desc' ?
          b.avgRevenuePerService - a.avgRevenuePerService :
          a.avgRevenuePerService - b.avgRevenuePerService;
      }
      return 0;
    });

    // Calculate summary statistics
    const summary = {
      totalServices: performanceData.length,
      totalRevenue: performanceData.reduce((sum, service) => sum + service.revenue, 0),
      totalServiceCount: performanceData.reduce((sum, service) => sum + service.count, 0),
      avgRevenuePerService: performanceData.reduce((sum, service) => sum + service.revenue, 0) /
        performanceData.reduce((sum, service) => sum + service.count, 1)
    };

    // Identify top performing services
    const topServices = [...performanceData]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      data: {
        services: performanceData,
        summary,
        topServices
      }
    });
  } catch (error) {
    console.error("Error generating service performance report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating service performance report",
      error: error.message
    });
  }
};

// 14. Custom Report Generator
export const generateCustomReport = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      entities,
      filters,
      groupBy,
      metrics,
      sortBy,
      order,
      limit
    } = req.body;

    // Validate date range if provided
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }
    }

    // Initialize results
    const reportResults = {};

    // Process each requested entity
    for (const entity of entities) {
      let query = {};
      let dateField = 'date';

      // Apply date filter if provided
      if (startDate && endDate) {
        query[dateField] = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }

      // Apply custom filters
      if (filters && filters[entity]) {
        for (const [field, value] of Object.entries(filters[entity])) {
          if (typeof value === 'object' && !Array.isArray(value)) {
            // Handle operators like $gt, $lt, etc.
            query[field] = value;
          } else {
            query[field] = value;
          }
        }
      }

      // Select the appropriate model based on entity
      let Model;
      switch (entity) {
        case 'sales':
          Model = InvoiceMns;
          break;
        case 'purchases':
          Model = MnsPurchaseOrderNew;
          break;
        case 'inventory':
          Model = Item;
          break;
        case 'expenses':
          Model = Expense;
          break;
        case 'services':
          Model = Perfoma;
          break;
        default:
          continue; // Skip unknown entities
      }

      // Build aggregation pipeline
      const pipeline = [];

      // Start with matching the query
      pipeline.push({ $match: query });

      // Handle special cases for nested data
      if (entity === 'sales' && (groupBy === 'item' || metrics.some(m => m.startsWith('item.')))) {
        pipeline.push({ $unwind: "$items" });
      }

      if (entity === 'purchases' && (groupBy === 'item' || metrics.some(m => m.startsWith('item.')))) {
        pipeline.push({ $unwind: "$items" });
      }

      // Group by specified field if provided
      if (groupBy) {
        const groupStage = { $group: { _id: null } };

        // Set the group by field
        if (groupBy === 'month') {
          groupStage.$group._id = { $dateToString: { format: "%Y-%m", date: "$date" } };
        } else if (groupBy === 'day') {
          groupStage.$group._id = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        } else if (groupBy === 'customer' && entity === 'sales') {
          groupStage.$group._id = "$receiverDetails.name";
        } else if (groupBy === 'vendor' && entity === 'purchases') {
          groupStage.$group._id = "$vendorName";
        } else if (groupBy === 'item' && (entity === 'sales' || entity === 'purchases')) {
          groupStage.$group._id = entity === 'sales' ? "$items.item_id" : "$items.item_id";
          // Add item name to the group
          groupStage.$group.itemName = { $first: entity === 'sales' ? "$items.itemName" : "$items.itemName" };
        } else if (groupBy === 'category' && entity === 'expenses') {
          groupStage.$group._id = "$category";
        } else if (groupBy === 'group' && entity === 'inventory') {
          groupStage.$group._id = "$group";
        } else {
          groupStage.$group._id = `$${groupBy}`;
        }

        // Add metrics to the group stage
        for (const metric of metrics) {
          if (metric === 'count') {
            groupStage.$group.count = { $sum: 1 };
          } else if (metric === 'sum' && entity === 'sales') {
            groupStage.$group.totalAmount = { $sum: "$grandTotal" };
            groupStage.$group.totalTax = { $sum: "$taxAmount" };
          } else if (metric === 'sum' && entity === 'purchases') {
            groupStage.$group.totalAmount = {
              $sum: {
                $cond: [
                  { $ifNull: ["$totalAmount", false] },
                  "$totalAmount",
                  { $sum: "$items.amount" }
                ]
              }
            };
          } else if (metric === 'sum' && entity === 'expenses') {
            groupStage.$group.totalAmount = { $sum: "$amount" };
          } else if (metric === 'avg' && entity === 'sales') {
            groupStage.$group.avgAmount = { $avg: "$grandTotal" };
          } else if (metric === 'avg' && entity === 'purchases') {
            groupStage.$group.avgAmount = {
              $avg: {
                $cond: [
                  { $ifNull: ["$totalAmount", false] },
                  "$totalAmount",
                  { $sum: "$items.amount" }
                ]
              }
            };
          } else if (metric === 'avg' && entity === 'expenses') {
            groupStage.$group.avgAmount = { $avg: "$amount" };
          } else if (metric === 'min' && entity === 'sales') {
            groupStage.$group.minAmount = { $min: "$grandTotal" };
          } else if (metric === 'min' && entity === 'purchases') {
            groupStage.$group.minAmount = {
              $min: {
                $cond: [
                  { $ifNull: ["$totalAmount", false] },
                  "$totalAmount",
                  { $sum: "$items.amount" }
                ]
              }
            };
          } else if (metric === 'min' && entity === 'expenses') {
            groupStage.$group.minAmount = { $min: "$amount" };
          } else if (metric === 'max' && entity === 'sales') {
            groupStage.$group.maxAmount = { $max: "$grandTotal" };
          } else if (metric === 'max' && entity === 'purchases') {
            groupStage.$group.maxAmount = {
              $max: {
                $cond: [
                  { $ifNull: ["$totalAmount", false] },
                  "$totalAmount",
                  { $sum: "$items.amount" }
                ]
              }
            };
          } else if (metric === 'max' && entity === 'expenses') {
            groupStage.$group.maxAmount = { $max: "$amount" };
          } else if (metric === 'item.quantity' && (entity === 'sales' || entity === 'purchases')) {
            groupStage.$group.totalQuantity = { $sum: "$items.quantity" };
          }
        }

        pipeline.push(groupStage);
      }

      // Sort results if specified
      if (sortBy) {
        const sortStage = { $sort: {} };
        sortStage.$sort[sortBy] = order === 'desc' ? -1 : 1;
        pipeline.push(sortStage);
      }

      // Limit results if specified
      if (limit) {
        pipeline.push({ $limit: parseInt(limit) });
      }

      // Execute the aggregation
      let results;
      if (pipeline.length > 0) {
        results = await Model.aggregate(pipeline);
      } else {
        results = await Model.find(query).limit(limit ? parseInt(limit) : 0);
      }

      // Store the results
      reportResults[entity] = results;
    }

    return res.status(200).json({
      success: true,
      data: reportResults
    });
  } catch (error) {
    console.error("Error generating custom report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating custom report",
      error: error.message
    });
  }
};


// Bank Transaction Report - Get all transactions for a specific bank



export const getBankTransactionReport = async (req, res) => {
  try {
    const { bankId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate bankId
    if (!mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bank ID format"
      });
    }

    // Check if bank exists
    const bank = await Bank.findById(bankId);
    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Bank account not found"
      });
    }

    // Build date filter if provided
    let dateFilter = {};
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day

      dateFilter = { $gte: start, $lte: end };
    }

    // Get deposits for this bank
    const depositQuery = { bankId };
    if (Object.keys(dateFilter).length > 0) {
      depositQuery.date = dateFilter;
    }
    const deposits = await DepositCredit.find(depositQuery)
      .populate('bankId')
      .lean();

    // Add transaction type to deposits
    const depositsWithType = deposits.map(deposit => ({
      ...deposit,
      transactionType: 'deposit',
      description: `Deposit for invoice ${deposit.invoiceNumber}`,
      personName: deposit.invoiceId ? deposit.invoiceId.receiverDetails?.name : 'N/A'
    }));

    // Get withdrawals for this bank
    const withdrawQuery = { bankId };
    if (Object.keys(dateFilter).length > 0) {
      withdrawQuery.date = dateFilter;
    }
    const withdrawals = await Withdraw.find(withdrawQuery)
      .populate('bankId')
      .lean();

    // Add transaction type to withdrawals
    const withdrawalsWithType = withdrawals.map(withdrawal => ({
      ...withdrawal,
      transactionType: 'withdrawal'
    }));

    // Get purchase window transactions for this bank
    const purchaseWindowQuery = { bankId };
    if (Object.keys(dateFilter).length > 0) {
      purchaseWindowQuery.date = dateFilter;
    }
    const purchaseWindows = await PurchaseWindow.find(purchaseWindowQuery)
      .populate('bankId')
      .populate('invoiceId')
      .lean();

    // Add transaction type to purchase windows
    const purchaseWindowsWithType = purchaseWindows.map(purchase => ({
      ...purchase,
      transactionType: 'purchase',
      description: `Purchase payment for invoice ${purchase.invoiceNumber}`,
      personName: purchase.vendorName
    }));

    // Get expenses for this bank (only where paymentMethod is "Bank")
    const expenseQuery = { bankId, paymentMethod: 'Bank' };
    if (Object.keys(dateFilter).length > 0) {
      expenseQuery.date = dateFilter;
    }
    const expenses = await Expense.find(expenseQuery)
      .populate('bankId')
      .lean();

    // Add transaction type to expenses
    const expensesWithType = expenses.map(expense => ({
      ...expense,
      transactionType: 'expense',
      personName: expense.paymentPersonName
    }));

    // Get money transfers where this bank is the source (transferDebit)
    const transferDebitQuery = { transferFromBankId: bankId };
    if (Object.keys(dateFilter).length > 0) {
      transferDebitQuery.date = dateFilter;
    }
    const transferDebits = await MoneyTransfer.find(transferDebitQuery)
      .populate('transferFromBankId')
      .populate('transferToBankId')
      .lean();

    // Add transaction type to transfer debits
    const transferDebitsWithType = transferDebits.map(transfer => ({
      ...transfer,
      transactionType: 'transferDebit',
      amount: transfer.transferAmount,
      description: `Transfer to ${transfer.transferToBankId.bankName} (${transfer.transferToBankId.accountNumber})`,
      personName: transfer.transferBy
    }));

    // Get money transfers where this bank is the destination (transferCredit)
    const transferCreditQuery = { transferToBankId: bankId };
    if (Object.keys(dateFilter).length > 0) {
      transferCreditQuery.date = dateFilter;
    }
    const transferCredits = await MoneyTransfer.find(transferCreditQuery)
      .populate('transferFromBankId')
      .populate('transferToBankId')
      .lean();

    // Add transaction type to transfer credits
    const transferCreditsWithType = transferCredits.map(transfer => ({
      ...transfer,
      transactionType: 'transferCredit',
      amount: transfer.transferAmount,
      description: `Transfer from ${transfer.transferFromBankId.bankName} (${transfer.transferFromBankId.accountNumber})`,
      personName: transfer.transferBy
    }));

    // Merge all transactions
    const allTransactions = [
      ...depositsWithType,
      ...withdrawalsWithType,
      ...expensesWithType,
      ...transferDebitsWithType,
      ...transferCreditsWithType,
      ...purchaseWindowsWithType
    ];

    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

    // Calculate summary statistics
    const totalDeposits = depositsWithType.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const totalWithdrawals = withdrawalsWithType.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const totalExpenses = expensesWithType.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const totalTransferDebits = transferDebitsWithType.reduce((sum, transaction) => sum + Number(transaction.transferAmount), 0);
    const totalTransferCredits = transferCreditsWithType.reduce((sum, transaction) => sum + Number(transaction.transferAmount), 0);
    const totalPurchases = purchaseWindowsWithType.reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    return res.status(200).json({
      success: true,
      data: {
        bankDetails: bank,
        transactions: allTransactions,
        summary: {
          totalTransactions: allTransactions.length,
          totalDeposits,
          totalWithdrawals,
          totalExpenses,
          totalTransferDebits,
          totalTransferCredits,
          totalPurchases,
          netChange: (totalDeposits + totalTransferCredits) -
            (totalWithdrawals + totalExpenses + totalTransferDebits + totalPurchases)
        }
      }
    });
  } catch (error) {
    console.error("Error generating bank transaction report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating bank transaction report",
      error: error.message
    });
  }
};

export const getAllBankTransactionsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter if provided
    let dateFilter = {};
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day

      dateFilter = { $gte: start, $lte: end };
    }

    // Get all banks
    const banks = await Bank.find().lean();

    // Get deposits for all banks
    const depositQuery = {};
    if (Object.keys(dateFilter).length > 0) {
      depositQuery.date = dateFilter;
    }
    const deposits = await DepositCredit.find(depositQuery)
      .populate('bankId')
      .lean();

    // Add transaction type to deposits
    const depositsWithType = deposits.map(deposit => ({
      ...deposit,
      transactionType: 'deposit',
      description: `Deposit for invoice ${deposit.invoiceNumber}`,
      personName: deposit.invoiceId ? deposit.invoiceId.receiverDetails?.name : 'N/A'
    }));

    // Get withdrawals for all banks
    const withdrawQuery = {};
    if (Object.keys(dateFilter).length > 0) {
      withdrawQuery.date = dateFilter;
    }
    const withdrawals = await Withdraw.find(withdrawQuery)
      .populate('bankId')
      .lean();

    // Add transaction type to withdrawals
    const withdrawalsWithType = withdrawals.map(withdrawal => ({
      ...withdrawal,
      transactionType: 'withdrawal'
    }));

    // Get purchase window transactions for all banks
    const purchaseWindowQuery = {};
    if (Object.keys(dateFilter).length > 0) {
      purchaseWindowQuery.date = dateFilter;
    }
    const purchaseWindows = await PurchaseWindow.find(purchaseWindowQuery)
      .populate('bankId')
      .populate('invoiceId')
      .lean();

    // Add transaction type to purchase windows
    const purchaseWindowsWithType = purchaseWindows.map(purchase => ({
      ...purchase,
      transactionType: 'purchase',
      description: `Purchase payment for invoice ${purchase.invoiceNumber}`,
      personName: purchase.vendorName
    }));

    // Get expenses for all banks (only where paymentMethod is "Bank")
    const expenseQuery = { paymentMethod: 'Bank' };
    if (Object.keys(dateFilter).length > 0) {
      expenseQuery.date = dateFilter;
    }
    const expenses = await Expense.find(expenseQuery)
      .populate('bankId')
      .lean();

    // Add transaction type to expenses
    const expensesWithType = expenses.map(expense => ({
      ...expense,
      transactionType: 'expense',
      personName: expense.paymentPersonName
    }));

    // Get money transfers where this bank is the source (transferDebit)
    const transferDebitQuery = {};
    if (Object.keys(dateFilter).length > 0) {
      transferDebitQuery.date = dateFilter;
    }
    const transferDebits = await MoneyTransfer.find(transferDebitQuery)
      .populate('transferFromBankId')
      .populate('transferToBankId')
      .lean();

    // Add transaction type to transfer debits
    const transferDebitsWithType = transferDebits.map(transfer => ({
      ...transfer,
      transactionType: 'transferDebit',
      amount: transfer.transferAmount,
      description: `Transfer to ${transfer.transferToBankId.bankName} (${transfer.transferToBankId.accountNumber})`,
      personName: transfer.transferBy
    }));

    // Get money transfers where this bank is the destination (transferCredit)
    const transferCreditQuery = {};
    if (Object.keys(dateFilter).length > 0) {
      transferCreditQuery.date = dateFilter;
    }
    const transferCredits = await MoneyTransfer.find(transferCreditQuery)
      .populate('transferFromBankId')
      .populate('transferToBankId')
      .lean();

    // Add transaction type to transfer credits
    const transferCreditsWithType = transferCredits.map(transfer => ({
      ...transfer,
      transactionType: 'transferCredit',
      amount: transfer.transferAmount,
      description: `Transfer from ${transfer.transferFromBankId.bankName} (${transfer.transferFromBankId.accountNumber})`,
      personName: transfer.transferBy
    }));

    // Merge all transactions
    const allTransactions = [
      ...depositsWithType,
      ...withdrawalsWithType,
      ...expensesWithType,
      ...transferDebitsWithType,
      ...transferCreditsWithType,
      ...purchaseWindowsWithType
    ];

    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

    // Calculate summary statistics for each bank
    const bankSummaries = banks.map(bank => {
      const bankTransactions = allTransactions.filter(transaction =>
        transaction.bankId?._id.toString() === bank._id.toString() ||
        transaction.transferFromBankId?._id.toString() === bank._id.toString() ||
        transaction.transferToBankId?._id.toString() === bank._id.toString()
      );

      const totalDeposits = bankTransactions
        .filter(t => t.transactionType === 'deposit')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalWithdrawals = bankTransactions
        .filter(t => t.transactionType === 'withdrawal')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpenses = bankTransactions
        .filter(t => t.transactionType === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalTransferDebits = bankTransactions
        .filter(t => t.transactionType === 'transferDebit')
        .reduce((sum, t) => sum + Number(t.transferAmount), 0);

      const totalTransferCredits = bankTransactions
        .filter(t => t.transactionType === 'transferCredit')
        .reduce((sum, t) => sum + Number(t.transferAmount), 0);

      const totalPurchases = bankTransactions
        .filter(t => t.transactionType === 'purchase')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        bankId: bank._id,
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        currentBalance: bank.currentBalance,
        summary: {
          totalTransactions: bankTransactions.length,
          totalDeposits,
          totalWithdrawals,
          totalExpenses,
          totalTransferDebits,
          totalTransferCredits,
          totalPurchases,
          netChange: (totalDeposits + totalTransferCredits) -
            (totalWithdrawals + totalExpenses + totalTransferDebits + totalPurchases)
        }
      };
    });

    // Calculate overall summary
    const overallSummary = {
      totalTransactions: allTransactions.length,
      totalDeposits: depositsWithType.reduce((sum, t) => sum + Number(t.amount), 0),
      totalWithdrawals: withdrawalsWithType.reduce((sum, t) => sum + Number(t.amount), 0),
      totalExpenses: expensesWithType.reduce((sum, t) => sum + Number(t.amount), 0),
      totalTransferDebits: transferDebitsWithType.reduce((sum, t) => sum + Number(t.transferAmount), 0),
      totalTransferCredits: transferCreditsWithType.reduce((sum, t) => sum + Number(t.transferAmount), 0),
      totalPurchases: purchaseWindowsWithType.reduce((sum, t) => sum + Number(t.amount), 0)
    };

    overallSummary.netChange = (overallSummary.totalDeposits + overallSummary.totalTransferCredits) -
      (overallSummary.totalWithdrawals + overallSummary.totalExpenses +
        overallSummary.totalTransferDebits + overallSummary.totalPurchases);

    return res.status(200).json({
      success: true,
      data: {
        banks: bankSummaries,
        transactions: allTransactions,
        overallSummary
      }
    });
  } catch (error) {
    console.error("Error generating all bank transactions report:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating all bank transactions report",
      error: error.message
    });
  }
};

