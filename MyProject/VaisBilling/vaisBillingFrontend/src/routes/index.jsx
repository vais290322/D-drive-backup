import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "../pages/DashboardPage";
// import SetUnitsPage from "../pages/Billing/SetUnits/SetUnitsPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import AllUserPage from "../pages/Settings/AllUserPage";
import ProtectedRouteComponent from "../component/protected/ProtectedRouteComponent";
import ErrorPage from "../pages/ErrorPage";
import SnigdhaAddItemPage from "../pages/SnigdhaBilling/Inventory/SnigdhaAddItemPage";
import SnigdhaAddProductPage from "../pages/SnigdhaBilling/Inventory/SnigdhaAddProductPage";
import SnigdhaInventoryManagementPage from "../pages/SnigdhaBilling/Inventory/SnigdhaInventoryManagementPage";
import SnigdhaAddClientPage from "../pages/SnigdhaBilling/PO/SnigdhaAddClientPage";
import SnigdhaSellProductPage from "../pages/SnigdhaBilling/PO/SnigdhaSellProductPage";
import SnigdhaAllSellListPage from "../pages/SnigdhaBilling/PO/SnigdhaAllSellListPage";
import SnigdhaProfitLossPage from "../pages/SnigdhaBilling/Reports/SnigdhaProfitLossPage";
import SnigdhaInventoryReportPage from "../pages/SnigdhaBilling/Reports/SnigdhaInventoryReportPage";
import AddInvoicePageS from "../pages/SnigdhaBilling/Invoice/AddInvoicePageS";
import ViewInvoicePageS from "../pages/SnigdhaBilling/Invoice/ViewInvoicePageS";
import ManageLadgerPage from "../pages/SnigdhaBilling/Invoice/ManageLadgerPage";
import SnigdhaAddPaymentInvoicePage from "../pages/SnigdhaBilling/Invoice/SnigdhaAddPaymentInvoicePage";
import SnigdhaGstReportPage from "../pages/SnigdhaBilling/Reports/SnigdhaGstReportPage";
import PurchaseOrderPage from "../pages/SnigdhaBilling/PurchaseOrder/PurchaseOrderPage";
import ViewPurchaseOrderPage from "../pages/SnigdhaBilling/PurchaseOrder/ViewPurchaseOrderPage";
import PublicRouteComponent from "../component/protected/PublicRouteComponent";
import AddDummySlipPage from "../pages/Settings/AddDummySlipPage";
import SnigdhaAddBankPage from "../pages/SnigdhaBilling/Bank/SnigdhaAddBankPage";
import SnigdhaBankDetailsPage from "../pages/SnigdhaBilling/Bank/SnigdhaBankDetailsPage";
import SnigdhaDepositPage from "../pages/SnigdhaBilling/Bank/SnigdhaDepositPage";
import SnigdhaWithdrawPage from "../pages/SnigdhaBilling/Bank/SnigdhaWithdrawPage";
import SnigdhaImprestFundPage from "../pages/SnigdhaBilling/Bank/SnigdhaImprestFundPage";
import SnigdhaExpensePage from "../pages/SnigdhaBilling/Bank/SnigdhaExpensePage";
import SnigdhaManagePurchaseTransactionPage from "../pages/SnigdhaBilling/Bank/SnigdhaManagePurchaseTransactionPage";
import SnigdhaAddNotePage from "../pages/SnigdhaBilling/Bank/SnigdhaAddNotePage";
import SnigdhaMoneyTransferPage from "../pages/SnigdhaBilling/Bank/SnigdhaMoneyTransferPage";
import SnigdhaBankStatementPage from "../pages/SnigdhaBilling/Bank/SnigdhaBankStatementPage";
import SnigdhaSalesReportPage from "../pages/SnigdhaBilling/Reports/SnigdhaSalesReportPage";
import AddGroupPage from "../pages/Settings/AddGroupPage";
import SnigdhaAddPurchasePaymentPage from "../pages/SnigdhaBilling/PurchaseOrder/SnigdhaAddPurchasePaymentPage";
import SnigdhaUpdatePurchasePaymentPage from "../pages/SnigdhaBilling/PurchaseOrder/SnigdhaUpdatePurchasePaymentPage";
import SnigdhaNewProfitLossPage from "../pages/SnigdhaBilling/Reports/SnigdhaNewProfitLossPage";
import SnigdhaMasterLedgerReportPage from "../pages/SnigdhaBilling/Reports/SnigdhaMasterLedgerReportPage";
import SnigdhaAllLedgerReportPage from "../pages/SnigdhaBilling/Reports/SnigdhaAllLedgerReportPage";
import SigdhaAcctualProfitLossPage from "../pages/SnigdhaBilling/Reports/SigdhaAcctualProfitLossPage";
import SnigdhaPurchaseReportPage from "../pages/SnigdhaBilling/Reports/SnigdhaPurchaseReportPage";
import SnigdhaProfitPage from "../pages/SnigdhaBilling/Reports/SnigdhaProfitPage";
import SnigdhaCustomerManagementPage from "../pages/SNIGDHACRM/SnigdhaCustomerManagementPage";
import SnigdhaClientListPage from "../pages/SNIGDHACRM/SnigdhaClientListPage";
import SnigdhaVendorPage from "../pages/SNIGDHACRM/SnigdhaVendorPage";
import SnigdhaAddPaymentServicePage from "../pages/SnigdhaBilling/ServiceRecepit/SnigdhaAddPaymentServicePage";
import SnigdhaUpdatePaymentServicePage from "../pages/SnigdhaBilling/ServiceRecepit/SnigdhaUpdatePaymentServicePage";
import SnigdhaViewServiceInvoicePage from "../pages/SnigdhaBilling/Invoice/SnigdhaViewServiceInvoicePage";
import SnigdhaViewPerfomaInvoicePage from "../pages/SnigdhaBilling/Invoice/SnigdhaViewPerfomaInvoicePage";
import SnigdhaCreditDebitNotePage from "../pages/SnigdhaBilling/Bank/SnigdhaCreditDebitNotePage";
import SnigdhaSetUnitPage from "../pages/SnigdhaBilling/SetUnits/SnigdhaSetUnitPage";

// Update your routes configuration
const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    element: <PublicRouteComponent />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />,
      },
    ],
  },

  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRouteComponent />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },

          {
            path: "add-customer",
            element: <SnigdhaCustomerManagementPage />,
          },
          {
            path: "client-list",
            element: <SnigdhaClientListPage />,
          },
          {
            path: "add-vendor",
            element: <SnigdhaVendorPage />,
          },
          // for units
          {
            path: "set-units",
            element: <SnigdhaSetUnitPage />,
          },
          // settings

          {
            path: "all-users",
            element: <AllUserPage />,
          },

          {
            path: "add-dummy-slip",
            element: <AddDummySlipPage />,
          },

          {
            path: "add-groups",
            element: <AddGroupPage />,
          },
          //  for inventory
          {
            path: "add-item",
            element: <SnigdhaAddItemPage />,
          },
          {
            path: "add-product",
            element: <SnigdhaAddProductPage />,
          },

          {
            path: "inventory-management",
            element: <SnigdhaInventoryManagementPage />,
          },

          // for sell

          {
            path: "add-client",
            element: <SnigdhaAddClientPage />,
          },

          {
            path: "sell-product",
            element: <SnigdhaSellProductPage />,
          },
          {
            path: "sell-list",
            element: <SnigdhaAllSellListPage />,
          },

          {
            path: "sales-report",
            element: <SnigdhaSalesReportPage />,
          },
          {
            path: "inventory-report",
            element: <SnigdhaInventoryReportPage />,
          },

          {
            path: "profit-loss",
            element: <SnigdhaNewProfitLossPage />,
          },
          {
            path: "master-ledger",
            element: <SnigdhaAllLedgerReportPage />,
          },
          {
            path: "pending-ledger-report",
            element: <SnigdhaMasterLedgerReportPage />,
          },
          {
            path: "acctually-profit-loss",
            element: <SigdhaAcctualProfitLossPage />,
          },
          {
            path: "purchase-report",
            element: <SnigdhaPurchaseReportPage />,
          },
          {
            path: "profit-report",
            element: <SnigdhaProfitPage />,
          },

          // invoice

          {
            path: "add-invoice",
            element: <AddInvoicePageS />,
          },
          {
            path: "view-invoice",
            element: <ViewInvoicePageS />,
          },

          {
            path: "product-payment-invoice",
            element: <SnigdhaAddPaymentInvoicePage />,
          },
          {
            path: "ladger-report",
            element: <ManageLadgerPage />,
          },
          {
            path: "gst-report",
            element: <SnigdhaGstReportPage />,
          },
          {
            path: "purchase-order",
            element: <PurchaseOrderPage />,
          },
          {
            path: "view-purchase-order",
            element: <ViewPurchaseOrderPage />,
          },

          {
            path: "add-purchase-payment",
            element: <SnigdhaAddPurchasePaymentPage />,
          },
          {
            path: "update-purchase-payment",
            element: <SnigdhaUpdatePurchasePaymentPage />,
          },

          // for snigdha bank
          {
            path: "add-bank",
            element: <SnigdhaAddBankPage />,
          },

          {
            path: "billing/bank/:bankId",
            element: <SnigdhaBankDetailsPage />,
          },

          {
            path: "withdraw",
            element: <SnigdhaWithdrawPage />,
          },
          {
            path: "imprest-fund",
            element: <SnigdhaImprestFundPage />,
          },
          {
            path: "add-expense",
            element: <SnigdhaExpensePage />,
          },
          {
            path: "add-deposit",
            element: <SnigdhaDepositPage />,
          },
          {
            path: "add-note",
            // element: <SnigdhaAddNotePage/>,
            element: <SnigdhaCreditDebitNotePage />,
          },
          {
            path: "money-transfer",
            element: <SnigdhaMoneyTransferPage />,
          },
          {
            path: "bank-statement",
            element: <SnigdhaBankStatementPage />,
          },
          {
            path: "manage-purchase-transaction",
            element: <SnigdhaManagePurchaseTransactionPage />,
          },
          {
            path: "add-service-receipt",
            element: <SnigdhaAddPaymentServicePage />,
          },
          {
            path: "update-service-receipt",
            element: <SnigdhaUpdatePaymentServicePage />,
          },
          {
            path: "view-service-invoice",
            element: <SnigdhaViewServiceInvoicePage />,
          },
          {
            path: "view-proforma-invoice",
            element: <SnigdhaViewPerfomaInvoicePage />,
          },
        ],
      },
    ],
  },
]);

export default router;
