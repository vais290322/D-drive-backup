import mongoose from "mongoose";
import SnigdhaItem from "../SnigdhaModels/snigdhaItem.model.js";
import SnigdhaPurchaseOrderNew from "../SnigdhaModels/SnigdhaPurchaseOrderNew.model.js";
import Invoice from "../invoicemodel/invoice.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
import SnigdhaPurchaseAccount from "../SnigdhaModels/snigdhaPurchaseAccount.model.js";
import { SngidhaLedger } from "../SnigdhaModels/snigdhaLadgerAccount.model.js";
import SnigdhaExpense from "../SnigdhaModels/snigdhaExpense.model.js";
import SnigdhaImprestFund from "../SnigdhaModels/snigdhaImprestFund.model.js";
import SnigdhaWithdraw from "../SnigdhaModels/snigdhaWithdraw.model.js";
import SnigdhaDepositCredit from "../SnigdhaModels/snigdhaDepositCredit.model.js";
import SnigdhaNotes from "../SnigdhaModels/snigdhaNotes.model.js";
import SnigdhaMoneyTransfer from "../SnigdhaModels/snigdhaMoneyTransfer.model.js";
import SnigdhaPurchaseWindow from "../SnigdhaModels/snigdhaPurchaseWindow.model.js";

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
    
    const items = await SnigdhaItem.find(query).sort(sortOptions);
    
    // Calculate inventory statistics
    const totalItems = await SnigdhaItem.countDocuments();
    const totalStock = await SnigdhaItem.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);
    
    const totalValue = await SnigdhaItem.aggregate([
      { $group: { _id: null, total: { $sum: "$total_prize" } } }
    ]);
    
    // Group items by category
    const itemsByGroup = await SnigdhaItem.aggregate([
      { $group: { 
        _id: "$group", 
        count: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
        totalValue: { $sum: "$total_prize" }
      }}
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
    const invoices = await Invoice.find(query).sort({ date: -1 });
    
    // Calculate sales statistics
    const totalSales = invoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0);
    const totalPaid = invoices.reduce((sum, invoice) => sum + (invoice.isPaid ? invoice.grandTotal : 0), 0);
    const totalUnpaid = totalSales - totalPaid;
    
    // Group sales by date
    const salesByDate = await Invoice.aggregate([
      { $match: query },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        totalSales: { $sum: "$grandTotal" },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Top selling items
    const topSellingItems = await Invoice.aggregate([
      { $match: query },
      { $unwind: "$items" },
      { $group: {
        _id: "$items.item_id",
        itemName: { $first: "$items.itemName" },
        totalQuantity: { $sum: "$items.quantity" },
        totalAmount: { $sum: "$items.amount" }
      }},
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
    const purchaseOrders = await SnigdhaPurchaseOrderNew.find(query).sort({ date: -1 });
    
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
    const purchasesByDate = await SnigdhaPurchaseOrderNew.aggregate([
      { $match: query },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        totalPurchases: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Top purchased items
    const topPurchasedItems = await SnigdhaPurchaseOrderNew.aggregate([
      { $match: query },
      { $unwind: "$items" },
      { $group: {
        _id: "$items.item_id",
        itemName: { $first: "$items.itemName" },
        totalQuantity: { $sum: "$items.quantity" },
        totalAmount: { $sum: "$items.amount" }
      }},
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);
    
    // Group by vendor
    const purchasesByVendor = await SnigdhaPurchaseOrderNew.aggregate([
      { $match: query },
      { $group: {
        _id: "$vendorName",
        totalAmount: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } },
        count: { $sum: 1 }
      }},
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
      const salesIncome = await Invoice.aggregate([
        { $match: { date: dateFilter } },
        { $group: {
          _id: null,
          total: { $sum: "$grandTotal" },
          count: { $sum: 1 }
        }}
      ]);
      
      // Deposits
      const deposits = await SnigdhaDepositCredit.aggregate([
        { $match: { date: dateFilter } },
        { $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }}
      ]);
      
      financialData.details.income = {
        sales: salesIncome.length > 0 ? salesIncome[0] : { total: 0, count: 0 },
        deposits: deposits.length > 0 ? deposits[0] : { total: 0, count: 0 }
      };
      
      financialData.summary.totalIncome = 
        (salesIncome.length > 0 ? salesIncome[0].total : 0) +
        (deposits.length > 0 ? deposits[0].total : 0);
    }
    
    if (!type || type === 'all' || type === 'expense') {
      // Purchase expenses
      const purchaseExpenses = await SnigdhaPurchaseOrderNew.aggregate([
        { $match: { date: dateFilter } },
        { $group: {
          _id: null,
          total: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } },
          count: { $sum: 1 }
        }}
      ]);
      
      // General expenses
      const generalExpenses = await SnigdhaExpense.aggregate([
        { $match: { date: dateFilter } },
        { $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }}
      ]);
      
      // Withdrawals
      const withdrawals = await SnigdhaWithdraw.aggregate([
        { $match: { date: dateFilter } },
        { $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }}
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
      const monthlyIncome = await Invoice.aggregate([
        { $match: { date: dateFilter } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$grandTotal" }
        }},
        { $sort: { _id: 1 } }
      ]);
      
      // Monthly expenses
      const monthlyExpenses = await SnigdhaPurchaseOrderNew.aggregate([
        { $match: { date: dateFilter } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } }
        }},
        { $sort: { _id: 1 } }
      ]);
      
      financialData.details.monthly = {
        income: monthlyIncome,
        expenses: monthlyExpenses
      };
    }
    
    // Get bank balances
    const bankBalances = await SnigdhaBank.find().select('bankName accountNumber currentAmount');
    financialData.details.bankBalances = bankBalances;
    
    // Get imprest fund balance
    const imprestFund = await SnigdhaImprestFund.findOne().select('currentAmount');
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
    const ledgerAccounts = await SngidhaLedger.find(query)
      .sort(sortOptions)
      .populate('invoiceId', 'date receiverDetails');
    
    // Calculate statistics
    const totalReceivable = await SngidhaLedger.aggregate([
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
    
    return res.status(200).json({
      success: true,
      data: {
        ledgerAccounts,
        stats: {
          totalReceivable: totalReceivable.length > 0 ? totalReceivable[0].total : 0,
          totalDueAccounts: ledgerAccounts.length,
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
    const purchaseAccounts = await SnigdhaPurchaseAccount.find(query)
      .sort(sortOptions)
      .populate('invoiceId', 'date vendorName');
    
    // Calculate statistics
    const totalPayable = await SnigdhaPurchaseAccount.aggregate([
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
    const payablesByVendor = await SnigdhaPurchaseAccount.aggregate([
      { $match: { isPaid: false } },
      { $group: {
        _id: "$vendorName",
        totalDue: { $sum: "$dueAmount" },
        count: { $sum: 1 }
      }},
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

// 7. Bank Transaction Report
export const getBankTransactionReport = async (req, res) => {
  try {
    const { bankId } = req.params;
    const { startDate, endDate, transactionType } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bank ID format"
      });
    }
    
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
    
    // Find the bank
    const bank = await SnigdhaBank.findById(bankId);
    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Bank not found"
      });
    }
    
    // Prepare date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    // Initialize transactions array
    let transactions = [];
    
    // Get deposits
    if (!transactionType || transactionType === 'deposit') {
      let depositQuery = { bankId };
      if (startDate && endDate) {
        depositQuery.date = dateFilter;
      }
      
      const deposits = await SnigdhaDepositCredit.find(depositQuery)
        .sort({ date: -1 });
      
      deposits.forEach(deposit => {
        transactions.push({
          type: 'deposit',
          date: deposit.date,
          amount: deposit.amount,
          description: deposit.description || `This  deposit from invoice ${deposit.invoiceNumber}`,
          reference: deposit.reference,
          id: deposit._id,
          transactionId: deposit.transactionId,
          paymentMethod: deposit.paymentMethod,
          invoiceNumber: deposit.invoiceNumber,
          invoiceId: deposit.invoiceId,
          bankId: deposit.bankId
        });
      });
    }
    
    // Get withdrawals
    if (!transactionType || transactionType === 'withdraw') {
      let withdrawQuery = { bankId };
      if (startDate && endDate) {
        withdrawQuery.date = dateFilter;
      }
      
      const withdrawals = await SnigdhaWithdraw.find(withdrawQuery)
        .sort({ date: -1 });
      
      withdrawals.forEach(withdrawal => {
        transactions.push({
          type: 'withdraw',
          date: withdrawal.date,
          amount: withdrawal.amount,
          description: withdrawal.description,
          reference: withdrawal.reference,
          id: withdrawal._id,
          voucherNumber: withdrawal.voucherNumber,
          personName: withdrawal.personName,
          bankId: withdrawal.bankId,
          paymentMethod: withdrawal.transactionType
        });
      });
    }

    // Get expenses paid from this bank
if (!transactionType || transactionType === 'expense') {
  let expenseQuery = { 
    bankId: bankId,
    paymentMethod: 'Bank'
  };
  if (startDate && endDate) {
    expenseQuery.date = dateFilter;
  }
  
  const expenses = await SnigdhaExpense.find(expenseQuery)
    .sort({ date: -1 });
  
  expenses.forEach(expense => {
    transactions.push({
      type: 'expense',
      date: expense.date,
      amount: expense.amount,
      description: expense.description,
      reference: `Voucher: ${expense.voucherNumber}`,
      paymentPersonName: expense.paymentPersonName,
      id: expense._id,
      voucherNumber: expense.voucherNumber,
      bankId: expense.bankId,
      paymentMethod: expense.paymentMethod
    });
  });
}
    
    // Get purchase window transactions
    if (!transactionType || transactionType === 'purchase') {
      let purchaseQuery = { bankId };
      if (startDate && endDate) {
        purchaseQuery.date = dateFilter;
      }
      
      // Import SnigdhaPurchaseWindow if not already imported
      const purchaseWindows = await SnigdhaPurchaseWindow.find(purchaseQuery)
        .populate('invoiceId', 'invoiceNumber')
        .sort({ date: -1 });
      
      purchaseWindows.forEach(purchase => {
        transactions.push({
          type: 'purchase',
          date: purchase.date,
          amount: purchase.amount,
          description: `Purchase payment for ${purchase.vendorName}`,
          reference: `Invoice: ${purchase.invoiceNumber || (purchase.invoiceId ? purchase.invoiceId.invoiceNumber : 'N/A')}`,
          paymentMethod: purchase.paymentMethod,
          vendorName: purchase.vendorName,
          id: purchase._id,
          transactionId: purchase.transactionId,
          invoiceNumber: purchase.invoiceNumber,
          invoiceId: purchase.invoiceId,
          bankId: purchase.bankId
        });
      });
    }
    
    // Get money transfers (outgoing)
    if (!transactionType || transactionType === 'transfer') {
      let transferFromQuery = { transferFromBankId: bankId };
      if (startDate && endDate) {
        transferFromQuery.date = dateFilter;
      }
      
      const transfersOut = await SnigdhaMoneyTransfer.find(transferFromQuery)
        .populate('transferToBankId', 'bankName accountNumber')
        .sort({ date: -1 });
      
      transfersOut.forEach(transfer => {
        transactions.push({
          type: 'transferDebit',
          date: transfer.date,
          amount: transfer.transferAmount,
          description: transfer.transferNote,
          reference: `To: ${transfer.transferToBankId.bankName} (${transfer.transferToBankId.accountNumber})`,
          transferBy: transfer.transferBy,
          id: transfer._id,
          paymentMethod: 'Bank Transfer',
         
        });
      });
      
      // Get money transfers (incoming)
      let transferToQuery = { transferToBankId: bankId };
      if (startDate && endDate) {
        transferToQuery.date = dateFilter;
      }
      
      const transfersIn = await SnigdhaMoneyTransfer.find(transferToQuery)
        .populate('transferFromBankId', 'bankName accountNumber')
        .sort({ date: -1 });
      
      transfersIn.forEach(transfer => {
        transactions.push({
          type: 'transferCredit',
          date: transfer.date,
          amount: transfer.transferAmount,
          description: transfer.transferNote,
          reference: `From: ${transfer.transferFromBankId.bankName} (${transfer.transferFromBankId.accountNumber})`,
          transferBy: transfer.transferBy,
          id: transfer._id,
          paymentMethod: 'Bank Transfer',
        });
      });
    }
    
    // Sort transactions by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate summary statistics
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit' || t.type === 'transfer_in')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdraw' || t.type === 'transfer_out' || t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate purchase-specific statistics
    const totalPurchases = transactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const purchaseCount = transactions.filter(t => t.type === 'purchase').length;
    
    return res.status(200).json({
      success: true,
      data: {
        bank: {
          id: bank._id,
          name: bank.bankName,
          accountNumber: bank.accountNumber,
          currentBalance: bank.currentAmount
        },
        transactions,
        stats: {
          totalTransactions: transactions.length,
          totalDeposits,
          totalWithdrawals,
          totalPurchases,
          purchaseCount,
          netMovement: totalDeposits - totalWithdrawals
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

// 8. Dashboard Report
export const getDashboardReport = async (req, res) => {
    try {
      // Get current date and first day of month
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      // Prepare date filters
      const thisMonthFilter = { $gte: firstDayOfMonth, $lte: currentDate };
      
      // Get previous month date range
      const lastMonthFirstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      const lastMonthFilter = { $gte: lastMonthFirstDay, $lte: lastMonthLastDay };
      
      // Initialize dashboard data
      const dashboardData = {
        summary: {},
        recentActivity: {},
        trends: {}
      };
      
      // 1. Get sales summary
      const thisMonthSales = await Invoice.aggregate([
        { $match: { date: thisMonthFilter } },
        { $group: {
          _id: null,
          total: { $sum: "$grandTotal" },
          count: { $sum: 1 }
        }}
      ]);
      
      const lastMonthSales = await Invoice.aggregate([
        { $match: { date: lastMonthFilter } },
        { $group: {
          _id: null,
          total: { $sum: "$grandTotal" },
          count: { $sum: 1 }
        }}
      ]);
      
      // 2. Get purchase summary
      const thisMonthPurchases = await SnigdhaPurchaseOrderNew.aggregate([
        { $match: { date: thisMonthFilter } },
        { $group: {
          _id: null,
          total: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } },
          count: { $sum: 1 }
        }}
      ]);
      
      const lastMonthPurchases = await SnigdhaPurchaseOrderNew.aggregate([
        { $match: { date: lastMonthFilter } },
        { $group: {
          _id: null,
          total: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } },
          count: { $sum: 1 }
        }}
      ]);
      
      // 3. Get expense summary
      const thisMonthExpenses = await SnigdhaExpense.aggregate([
        { $match: { date: thisMonthFilter } },
        { $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }}
      ]);
      
      const lastMonthExpenses = await SnigdhaExpense.aggregate([
        { $match: { date: lastMonthFilter } },
        { $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }}
      ]);
      
      // 4. Get bank balances
      const bankBalances = await SnigdhaBank.find().select('bankName accountNumber currentAmount');
      const totalBankBalance = bankBalances.reduce((sum, bank) => sum + bank.currentAmount, 0);
      
      // 5. Get imprest fund balance
      const imprestFund = await SnigdhaImprestFund.findOne().select('currentAmount');
      
      // 6. Get accounts receivable summary
      const accountsReceivable = await SngidhaLedger.aggregate([
        { $match: { isPaid: false } },
        { $group: { _id: null, total: { $sum: "$dueAmount" }, count: { $sum: 1 } } }
      ]);
      
      // 7. Get accounts payable summary
      const accountsPayable = await SnigdhaPurchaseAccount.aggregate([
        { $match: { isPaid: false } },
        { $group: { _id: null, total: { $sum: "$dueAmount" }, count: { $sum: 1 } } }
      ]);
      
      // 8. Get inventory summary
      const inventory = await SnigdhaItem.aggregate([
        { $group: { 
          _id: null, 
          totalItems: { $sum: 1 },
          totalStock: { $sum: "$quantity" },
          totalValue: { $sum: "$total_prize" }
        }}
      ]);
      
      // 9. Get low stock items
      const lowStockItems = await SnigdhaItem.find({ quantity: { $lt: 10 } })
        .sort({ quantity: 1 })
        .limit(5);
      
      // 10. Get recent activities
      // Recent invoices
      const recentInvoices = await Invoice.find()
        .sort({ date: -1 })
        .limit(5)
        .select('date receiverDetails grandTotal isPaid');
      
      // Recent purchases
      const recentPurchases = await SnigdhaPurchaseOrderNew.find()
        .sort({ date: -1 })
        .limit(5)
        .select('date vendorName totalAmount paidOne');
      
      // Recent expenses
      const recentExpenses = await SnigdhaExpense.find()
        .sort({ date: -1 })
        .limit(5)
        .select('date expenseType amount description');
      
      // Recent bank transactions
      const recentDeposits = await SnigdhaDepositCredit.find()
        .sort({ date: -1 })
        .limit(3)
        .populate('bankId', 'bankName')
        .select('date amount description bankId');
      
      const recentWithdrawals = await SnigdhaWithdraw.find()
        .sort({ date: -1 })
        .limit(3)
        .populate('bankId', 'bankName')
        .select('date amount description bankId');
      
      // 11. Get notes
      const notes = await SnigdhaNotes.find()
        .sort({ createdAt: -1 })
        .limit(5);
      
      // 12. Calculate month-over-month changes
      const thisMonthSalesTotal = thisMonthSales.length > 0 ? thisMonthSales[0].total : 0;
      const lastMonthSalesTotal = lastMonthSales.length > 0 ? lastMonthSales[0].total : 0;
      const salesChange = lastMonthSalesTotal === 0 ? 100 : 
        ((thisMonthSalesTotal - lastMonthSalesTotal) / lastMonthSalesTotal) * 100;
      
      const thisMonthPurchasesTotal = thisMonthPurchases.length > 0 ? thisMonthPurchases[0].total : 0;
      const lastMonthPurchasesTotal = lastMonthPurchases.length > 0 ? lastMonthPurchases[0].total : 0;
      const purchasesChange = lastMonthPurchasesTotal === 0 ? 100 : 
        ((thisMonthPurchasesTotal - lastMonthPurchasesTotal) / lastMonthPurchasesTotal) * 100;
      
      const thisMonthExpensesTotal = thisMonthExpenses.length > 0 ? thisMonthExpenses[0].total : 0;
      const lastMonthExpensesTotal = lastMonthExpenses.length > 0 ? lastMonthExpenses[0].total : 0;
      const expensesChange = lastMonthExpensesTotal === 0 ? 100 : 
        ((thisMonthExpensesTotal - lastMonthExpensesTotal) / lastMonthExpensesTotal) * 100;
      
      // 13. Calculate profit for current month
      const thisMonthProfit = thisMonthSalesTotal - (thisMonthPurchasesTotal + thisMonthExpensesTotal);
      const lastMonthProfit = lastMonthSalesTotal - (lastMonthPurchasesTotal + lastMonthExpensesTotal);
      const profitChange = lastMonthProfit === 0 ? 100 : 
        ((thisMonthProfit - lastMonthProfit) / Math.abs(lastMonthProfit)) * 100;
      
      // Assemble dashboard data
      dashboardData.summary = {
        sales: {
          thisMonth: thisMonthSalesTotal,
          lastMonth: lastMonthSalesTotal,
          change: salesChange.toFixed(2),
          count: thisMonthSales.length > 0 ? thisMonthSales[0].count : 0
        },
        purchases: {
          thisMonth: thisMonthPurchasesTotal,
          lastMonth: lastMonthPurchasesTotal,
          change: purchasesChange.toFixed(2),
          count: thisMonthPurchases.length > 0 ? thisMonthPurchases[0].count : 0
        },
        expenses: {
          thisMonth: thisMonthExpensesTotal,
          lastMonth: lastMonthExpensesTotal,
          change: expensesChange.toFixed(2),
          count: thisMonthExpenses.length > 0 ? thisMonthExpenses[0].count : 0
        },
        profit: {
          thisMonth: thisMonthProfit,
          lastMonth: lastMonthProfit,
          change: profitChange.toFixed(2)
        },
        bankBalance: totalBankBalance,
        imprestFund: imprestFund ? imprestFund.currentAmount : 0,
        accountsReceivable: accountsReceivable.length > 0 ? accountsReceivable[0].total : 0,
        accountsPayable: accountsPayable.length > 0 ? accountsPayable[0].total : 0,
        inventory: inventory.length > 0 ? {
          totalItems: inventory[0].totalItems,
          totalStock: inventory[0].totalStock,
          totalValue: inventory[0].totalValue
        } : { totalItems: 0, totalStock: 0, totalValue: 0 }
      };
      
      dashboardData.recentActivity = {
        invoices: recentInvoices,
        purchases: recentPurchases,
        expenses: recentExpenses,
        bankTransactions: {
          deposits: recentDeposits,
          withdrawals: recentWithdrawals
        },
        notes: notes,
        lowStockItems: lowStockItems
      };
      
      // Get sales trend for last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      
      const salesTrend = await Invoice.aggregate([
        { $match: { date: { $gte: sixMonthsAgo } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$grandTotal" }
        }},
        { $sort: { _id: 1 } }
      ]);
      
      const purchasesTrend = await SnigdhaPurchaseOrderNew.aggregate([
        { $match: { date: { $gte: sixMonthsAgo } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: { $cond: [{ $ifNull: ["$totalAmount", false] }, "$totalAmount", { $sum: "$items.amount" }] } }
        }},
        { $sort: { _id: 1 } }
      ]);
      
      const expensesTrend = await SnigdhaExpense.aggregate([
        { $match: { date: { $gte: sixMonthsAgo } } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$amount" }
        }},
        { $sort: { _id: 1 } }
      ]);
      
      dashboardData.trends = {
        sales: salesTrend,
        purchases: purchasesTrend,
        expenses: expensesTrend
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
      const banks = await SnigdhaBank.find().lean();
  
      // Get deposits for all banks
      const depositQuery = {};
      if (Object.keys(dateFilter).length > 0) {
        depositQuery.date = dateFilter;
      }
      const deposits = await SnigdhaDepositCredit.find(depositQuery)
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
      const withdrawals = await SnigdhaWithdraw.find(withdrawQuery)
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
      const purchaseWindows = await SnigdhaPurchaseWindow.find(purchaseWindowQuery)
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
      const expenses = await SnigdhaExpense.find(expenseQuery)
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
      const transferDebits = await SnigdhaMoneyTransfer.find(transferDebitQuery)
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
      const transferCredits = await SnigdhaMoneyTransfer.find(transferCreditQuery)
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

