import express from 'express';
import {
  getInventoryReport,
  getSalesReport,
  getPurchaseReport,
  getFinancialReport,
  getAccountsReceivableReport,
  getAccountsPayableReport,
  getBankTransactionReport,
  getDashboardReport,
  getAllBankTransactionsReport
} from '../SnigdhaControllers/snigdhaReport.controller.js';
// import { verifyToken } from '../Middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
// router.use(verifyToken);

// Dashboard report
router.get('/dashboard', getDashboardReport);

// Inventory report
router.get('/inventory', getInventoryReport);

// Sales report
router.get('/sales', getSalesReport);

// Purchase report
router.get('/purchases', getPurchaseReport); 

// Financial report
router.get('/financial', getFinancialReport);

// Accounts receivable report
router.get('/accounts-receivable', getAccountsReceivableReport);

// Accounts payable report
router.get('/accounts-payable', getAccountsPayableReport);

// Bank transaction report
router.get('/bank-transactions/:bankId', getBankTransactionReport);

router.get('/all-bank-transactions', getAllBankTransactionsReport);


export default router;