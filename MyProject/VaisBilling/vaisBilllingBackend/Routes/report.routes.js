import express from 'express';
import {
  getSalesReport,
  getPurchaseReport,
//   getExpenseReport,
  getInventoryReport,
  getFinancialReport,
  getTaxReport,
  getAccountsReceivableReport,
  getInventoryMovementReport,
  getProfitMarginReport,
  getBusinessPartnerReport,
  getDashboardReport,
  getItemPerformanceReport,
  getServicePerformanceReport,
  generateCustomReport,
  getBankTransactionReport,
  getAllBankTransactionsReport
} from '../Controllers/report.controller.js';
// import { verifyToken } from '../Middleware/auth.js';

const router = express.Router(); 

// Apply authentication middleware to all routes
// router.use(verifyToken);

// 1. Sales Report
router.get('/sales', getSalesReport);

// 2. Purchase Report
router.get('/purchases', getPurchaseReport);

// 3. Expense Report
// router.get('/expenses', getExpenseReport);

// 4. Inventory Report
router.get('/inventory', getInventoryReport);

// 5. Financial Report
router.get('/financial', getFinancialReport);

// 6. Tax Report
router.get('/tax', getTaxReport);

// 7. Accounts Receivable Report
router.get('/accounts-receivable', getAccountsReceivableReport);

// 8. Inventory Movement Report
router.get('/inventory-movement', getInventoryMovementReport);

// 9. Profit Margin Report
router.get('/profit-margin', getProfitMarginReport);

// 10. Business Partner (Customer/Vendor) Report
router.get('/business-partners', getBusinessPartnerReport);

// 11. Dashboard Report
router.get('/dashboard', getDashboardReport);

// 12. Item Performance Report
router.get('/item-performance', getItemPerformanceReport);

// 13. Service Performance Report
router.get('/service-performance', getServicePerformanceReport);

// 14. Custom Report Generator
router.post('/custom', generateCustomReport);

// 15. Bank Transaction Report
router.get('/bank-transactions/:bankId', getBankTransactionReport);

// 16. All Bank Transactions Report
router.get('/all-bank-transactions', getAllBankTransactionsReport);

export default router; 