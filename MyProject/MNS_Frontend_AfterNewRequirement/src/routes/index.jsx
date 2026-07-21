import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "../pages/DashboardPage";
import ClientListPage from "../pages/CRM/ClientListPage";
// import ModifyDeletePage from "../pages/CRM/ModifyDeletePage";
import AddInvoicePage from "../pages/Billing/Invoice/AddInvoicePage";
import ViewInvoicePge from "../pages/Billing/Invoice/ViewInvoicePge";
import AddProductPage from "../pages/Billing/Inventory/AddProductPage";
import GstReportPage from "../pages/Billing/Reports/GstReportPage";
import BlanceSheetPage from "../pages/Billing/Reports/BlanceSheetPage";
import ProfitLossPage from "../pages/Billing/Reports/ProfitLossPage";
// import AssetPage from "../pages/Billing/Reports/AssetPage";
import RaisePoPage from "../pages/Billing/PO/RaisePoPage";
import ReceivedPoPage from "../pages/Billing/PO/ReceivedPoPage";
// import CasualLaborPage from "../pages/HRM/IndirectStaff/CasualLaborPage";
// import SecurityGuardPage from "../pages/HRM/IndirectStaff/SecurityGuardPage";
// import HouseKeepingPge from "../pages/HRM/IndirectStaff/HouseKeepingPge";
// import AdminPage from "../pages/Operation/AdminPage";
import RecruitmentTrainingPage from "../pages/Operation/RecruitmentTrainingPage";
// import AddTax from "../pages/Billing/Tax/AddTax";
// import CreateCoupon from "../pages/Billing/Coupons/CreateCoupon";
import SetUnitsPage from "../pages/Billing/SetUnits/SetUnitsPage";
import CustomerManagementPage from "../pages/CRM/CustomerManagementPage";
import ApplyLeavePage from "../pages/HRM/Leavemanagement/ApplyLeavePage";
import ApproveLeavePage from "../pages/HRM/Leavemanagement/ApproveLeavePage";
import LeaveReportPage from "../pages/HRM/Leavemanagement/LeaveReportPage";
import LeaveForEmployeePage from "../pages/HRM/LeaveForEmpolyeePage";
import MarkAttendancePage from "../pages/HRM/Attendance/MarkAttendancePage";
import AttendanceReportPage from "../pages/HRM/Attendance/AttendanceReportPage";
import ShiftManagementPage from "../pages/HRM/Attendance/ShiftManagementPage";
import CreateSalaryPage from "../pages/HRM/PayrollManagement/CreateSalaryPage";
// import ViewSalaryPage from "../pages/HRM/PayrollManagement/ViewSalaryPage";
// import ViewSalaryHistoryPage from "../pages/HRM/PayrollManagement/ViewSalaryHistoryPage";
import TaxCalculationPage from "../pages/HRM/PayrollManagement/TaxCalculationPage";
import ProcessBonuessPage from "../pages/HRM/PayrollManagement/ProcessBonuessPage";
import SalarySlipPage from "../pages/HRM/PayrollManagement/SalarySlipPage";
import ManageDeductionsPage from "../pages/HRM/PayrollManagement/ManageDeductionsPage";
import AddClientPage from "../pages/Billing/PO/AddClientPage";
import TaskManagement from "../pages/Operation/TaskManagement";

import EmployeeManagementPage from "../pages/HRM/EmployeeManagement/EmployeeManagementPage";
import AddEmployee from "../component/Employee/AddEmployee";
import { AddCandidate } from "../component/RecruitmentOnboarding/AddCandidate";
import AddItemPage from "../pages/Billing/Inventory/AddItemPage";
import RegisterEmployeePage from "../pages/HRM/RFIDAttendance/RegisterEmployeePage";
import RfidAttendanceReport from "../pages/HRM/RFIDAttendance/RfidAttendanceReport";
import TodaysAttendancePage from "../pages/HRM/RFIDAttendance/TodaysAttendancePage";
import ProjectManagementPage from "../pages/Operation/ProjectManagementPage";
import Resource from "../pages/Operation/Resource";
import InventoryAdjustmentPage from "../pages/Billing/Inventory/InventoryAdjustmentPage";
import InventoryReportPage from "../pages/Billing/Reports/InventoryReportPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import AllUserPage from "../pages/Settings/AllUserPage";
import ProtectedRouteComponent from "../component/protected/ProtectedRouteComponent";
import ErrorPage from "../pages/ErrorPage";
import InventoryManagementPage from "../component/InventoryManagement/InventoryManagementPage";

// import SnigdhaSetUnitPage from "../pages/SnigdhaBilling/SetUnits/SnigdhaSetUnitPage"
import SnigdhaAddItemPage from "../pages/SnigdhaBilling/Inventory/SnigdhaAddItemPage";
import SnigdhaAddProductPage from "../pages/SnigdhaBilling/Inventory/SnigdhaAddProductPage"
import SnigdhaInventoryManagementPage from "../pages/SnigdhaBilling/Inventory/SnigdhaInventoryManagementPage";
import SnigdhaAddClientPage from "../pages/SnigdhaBilling/PO/SnigdhaAddClientPage";
import SnigdhaSellProductPage from "../pages/SnigdhaBilling/PO/SnigdhaSellProductPage";
import SnigdhaAllSellListPage from "../pages/SnigdhaBilling/PO/SnigdhaAllSellListPage";
import SnigdhaProfitLossPage from "../pages/SnigdhaBilling/Reports/SnigdhaProfitLossPage";
import SnigdhaInventoryReportPage from '../pages/SnigdhaBilling/Reports/SnigdhaInventoryReportPage'
// import AddItemFromSnigdhaPage from "../pages/Billing/Inventory/AddItemFromSnigdhaPage";
import AddInvoicePageS from "../pages/SnigdhaBilling/Invoice/AddInvoicePageS";
import ViewInvoicePageS from "../pages/SnigdhaBilling/Invoice/ViewInvoicePageS";
// import AddBank from "../pages/Settings/AddBank";
import ServiceInvoiceReports from "../pages/Billing/Reports/ServiceInvoiceReports";
import ViewPerfomaInvoicePage from "../pages/Billing/Invoice/ViewPerfomaInvoicePage";
import ProductPaymentInvoice from "../pages/Billing/Invoice/ProductPaymentInvoice";
import ViewProductPaymentInvoice from "../pages/Billing/Invoice/ViewProductPaymentInvoice";
import ManageLadgerPage from "../pages/SnigdhaBilling/Invoice/ManageLadgerPage";
import SnigdhaAddPaymentInvoicePage from "../pages/SnigdhaBilling/Invoice/SnigdhaAddPaymentInvoicePage";
import SnigdhaGstReportPage from "../pages/SnigdhaBilling/Reports/SnigdhaGstReportPage";
import ViewServicePerfomaPage from "../pages/Billing/Invoice/ViewServicePerfomaPage";
import PurchaseOrderPage from "../pages/SnigdhaBilling/PurchaseOrder/PurchaseOrderPage";
import ViewPurchaseOrderPage from "../pages/SnigdhaBilling/PurchaseOrder/ViewPurchaseOrderPage";
import MNSPurchaseOrderPage from "../pages/Billing/PurchaseOrder/MNSPurchaseOrderPage";
import MNSViewPurchaseOrderPage from "../pages/Billing/PurchaseOrder/MNSViewPurchaseOrderPage";

import PublicRouteComponent from '../component/protected/PublicRouteComponent';
import AddBankPage from "../pages/Billing/Bank/AddBankPage";
import BankDetailsPage from "../pages/Billing/Bank/BankDetailsPage";
import WithdrawPage from "../pages/Billing/Bank/WithdrawPage";
import ImprestFundPage from "../pages/Billing/Bank/ImprestFundPage";
import ExpensePage from "../pages/Billing/Bank/ExpensePage";
import DepositPage from "../pages/Billing/Bank/DepositPage";
import AddNotePage from "../pages/Billing/Bank/AddNotePage";
import AddDummySlipPage from "../pages/Settings/AddDummySlipPage";
import MoneyTransfer from "../pages/Billing/Bank/MoneyTransfer";
import VendorPage from "../pages/CRM/VendorPage";
import BankStatementPage from "../pages/Billing/Bank/BankStatementPage";
import ManagePurchasePage from "../pages/Billing/Bank/ManagePurchasePage";
import SalesReportPage from "../pages/Billing/Reports/SalsesReportPage";
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
import AddPurchasePaymentPage from "../pages/Billing/PurchaseOrder/AddPurchasePaymentPage";
import UpdatePurchasePaymentPage from "../pages/Billing/PurchaseOrder/UpdatePurchasePaymentPage";
import AddGroupPage from "../pages/Settings/AddGroupPage";
import ServicePayment from "../pages/Billing/Invoice/ServiceLedger/ServicePayment";
import ServiceLedgerPayment from "../pages/Billing/Invoice/ServiceLedger/ServiceLedgerPayment";
import SnigdhaAddPurchasePaymentPage from "../pages/SnigdhaBilling/PurchaseOrder/SnigdhaAddPurchasePaymentPage";
import SnigdhaUpdatePurchasePaymentPage from "../pages/SnigdhaBilling/PurchaseOrder/SnigdhaUpdatePurchasePaymentPage";
import NewProfitLossPage from "../pages/Billing/Reports/NewProfitLossPage";
import MasterLedgerReportPage from "../pages/Billing/Reports/MasterLedgerReportPage";
import SnigdhaNewProfitLossPage from "../pages/SnigdhaBilling/Reports/SnigdhaNewProfitLossPage";
import SnigdhaMasterLedgerReportPage from "../pages/SnigdhaBilling/Reports/SnigdhaMasterLedgerReportPage";
import SnigdhaAllLedgerReportPage from "../pages/SnigdhaBilling/Reports/SnigdhaAllLedgerReportPage";
import MnsAllLedgerReportPage from "../pages/Billing/Reports/MnsAllLedgerReportPage";
import AcctualProfitLossPage from "../pages/Billing/Reports/AcctualProfitLossPage";
import SigdhaAcctualProfitLossPage from "../pages/SnigdhaBilling/Reports/SigdhaAcctualProfitLossPage";

// Update your routes configuration
const router = createBrowserRouter([
  {
    path:"*",
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
    ]
  },
  {
    path: "/employee-leave-page/:token",
    element: <LeaveForEmployeePage />,
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
          // for crm
          {
            path: "add-customer",
            element: <CustomerManagementPage />,
          },
          {
            path: "client-list",
            element: <ClientListPage />,
          },
          {
            path: "add-vendor",
            element: <VendorPage />,
          },
        
        // for billing
        // for invoice
          {
            path: "add-invoice",
            element: <AddInvoicePage />,
          },
          {
            path: "view-invoice",
            element: <ViewInvoicePge />,
          },
          {
            path: "product-payment-invoice",
            element: <ProductPaymentInvoice />,
          },
          {
            path: "view-product-payment-invoice",
            element: <ViewProductPaymentInvoice />,
          },
        
          {
            path: "service-perfroma-invoice",
            element: <ViewServicePerfomaPage />,
          },
          {
            path: "add-service-receipt-mns",
            element: <ServicePayment />,
          },
          {
            path: "update-service-receipt-mns",
            element: <ServiceLedgerPayment />,
          },
        
        // for bank or accounts for mns 

          {
            path: "add-bank-mns",
            element: <AddBankPage/>,
          },
          {
            path: "billing/bank/:bankId",
            element: <BankDetailsPage/>,
          },

          {
            path: "withdraw-mns",
            element: <WithdrawPage/>,
          },
          {
            path: "imprest-fund-mns",
            element: <ImprestFundPage/>,
          },
          {
            path: "add-expense-mns",
            element: <ExpensePage/>,
          },
          {
            path: "add-deposit-mns",
            element: <DepositPage/>,
          },
          {
            path: "add-note-mns",
            element: <AddNotePage/>,
          },
          {
            path: "money-transfer-mns",
            element: <MoneyTransfer/>,
          },
          {
            path: "bank-statement-mns",
            element: <BankStatementPage/>,
          },
          {
            path: "manage-purchase-transaction-mns",
            element: <ManagePurchasePage/>,
          },
        
        // for inventory
        
          {
            path: "add-product",
            element: <AddProductPage />,
          },
          {
            path: "view-proforma-invoice",
            element: <ViewPerfomaInvoicePage />, 
          },
        
        
          {
            path: "inventory-management",
            element: <InventoryManagementPage />,
          },
          
          // for reports
            {
              path: "gst-report",
              element: <GstReportPage />,
            },
            {
              path: "inventory-report",
              element: <InventoryReportPage />,
            },
          
            {
              path: "profit-loss",
              element: <NewProfitLossPage />,
            },
            {
              path: "acctually-profit-loss",
              element: <AcctualProfitLossPage />,
            },
            
            {
              path: "service-invoice-reports",
              element: <ServiceInvoiceReports />,
            },
            {
              path: "master-ledger-report-mns",
              element: <MnsAllLedgerReportPage />,
            },
            {
              path: "pending-ledger-report-mns",
              element: <MasterLedgerReportPage />,
            },
            // {
            //   path: "blance-sheet-mns",
            //   element: <BlanceSheetPage />,
            // },
            {
              path: "salses-report-mns",
              element: <SalesReportPage />,
            },
          
            //  for PO
              {
                path: "add-client",
                element: <AddClientPage />,
              },
            
              {
                path: "raise-po",
                element: <RaisePoPage />,
              },
              {
                path: "received-po",
                element: <ReceivedPoPage />,
              },
            
              {
                path: "inventory-adjustment",
                element: <InventoryAdjustmentPage />,
              },
              // for purchase order 
              {
                path: "mns-purchase-order",
                element: <MNSPurchaseOrderPage />,
              },
              {
                path: "mns-view-purchase-order",
                element: <MNSViewPurchaseOrderPage />,
              },
              {
                path: "add-purchase-payment-mns",
                element: <AddPurchasePaymentPage />,
              },
              {
                path: "update-purchase-payment-mns",
                element: <UpdatePurchasePaymentPage />,
              },



              // for units
              {
                path: "set-units",
                element: <SetUnitsPage />,
              },
            
            // for hrm
          
            {
              path: "employee-management",
              element: <EmployeeManagementPage />,
            },
            {
              path: "add-employee",
              element: <AddEmployee />,
            },
          
            // {
            //   path: "casual-labor",
            //   element: <CasualLaborPage />,
            // },
            // {
            //   path: "house-keeping",
            //   element: <HouseKeepingPge />,
            // },
            // {
            //   path: "security-guard",
            //   element: <SecurityGuardPage />,
            // },
            {
              path: "apply-leave",
              element: <ApplyLeavePage />,
            },
            {
              path: "approve-leave",
              element: <ApproveLeavePage />,
            },
            {
              path: "leave-report",
              element: <LeaveReportPage />,
            },
          
            // for attendance
            {
              path: "mark-attendance",
              element: <MarkAttendancePage />,
            },
            {
              path: "attendance-report",
              element: <AttendanceReportPage />,
            },
            {
              path: "employee-shift-management",
              element: <ShiftManagementPage />,
            },
            // for rfid attendance
            {
              path: "rfid-register-employee",
              element: <RegisterEmployeePage />,
            },
            {
              path: "rfid-attendance-report",
              element: <RfidAttendanceReport />,
            },
            {
              path: "rfid-today-attendance",
              element: <TodaysAttendancePage />,
            },
          
            // for payroll management
          
            {
              path: "create-salary",
              element: <CreateSalaryPage />,
            },
            // {
            //   path: "view-salary",
            //   element: <ViewSalaryPage />,
            // },
            // {
            //   path: "view-salary-history",
            //   element: <ViewSalaryHistoryPage />,
            // },
            {
              path: "tax-calculation",
              element: <TaxCalculationPage />,
            },
            {
              path: "process-bonuses",
              element: <ProcessBonuessPage />,
            },
            {
              path: "salary-slip",
              element: <SalarySlipPage />,
            },
            {
              path: "manage-deductions",
              element: <ManageDeductionsPage />,
            },
          
            // for operation
          
            // {
            //   path: "admin",
            //   element: <AdminPage />,
            // },
            {
              path: "task-management",
              element: <TaskManagement />,
            },
            {
              path: "recruitment-training",
              element: <RecruitmentTrainingPage />,
            },
            {
              path: "add-candidate",
              element: <AddCandidate />,
            },
          
            {
              path: "add-item",
              element: <AddItemPage />,
            },
            {
              path: "add-project",
              element: <ProjectManagementPage />,
            },
            {
              path: "resource",
              element: <Resource />,
            },
          
            // settings 
          
            {
              path: "all-users",
              element: <AllUserPage/>,
            },
            
            {
              path: "add-dummy-slip",
              element: <AddDummySlipPage/>,
            },

            {
              path: "add-groups",
              element: <AddGroupPage />,
            },
            // {
            //   path: "snigdha-set-units",
            //   element: <SnigdhaSetUnitPage/>,
            // },
          //  for inventory 
            {
              path: "snigdha-add-item",
              element: <SnigdhaAddItemPage />,
            },
            {
              path: "snigdha-add-product",
              element: <SnigdhaAddProductPage />,
            },
          
            {
              path: "snigdha-inventory-management",
              element: <SnigdhaInventoryManagementPage />,
            },
          
            // for sell 
          
            {
              path: "snigdha-add-client",
              element: <SnigdhaAddClientPage />,
            },
          
            {
              path: "snigdha-sell-product",
              element: <SnigdhaSellProductPage />,
            },
            {
              path: "snigdha-sell-list",
              element: <SnigdhaAllSellListPage />,
            },
          
            {
              path: "snigdha-sales-report",
              element: <SnigdhaSalesReportPage />,
            },
            {
              path: "snigdha-inventory-report",
              element: <SnigdhaInventoryReportPage />,
            },
          
            {
              path: "snigdha-profit-loss",
              element: <SnigdhaNewProfitLossPage />,
            },
            {
              path: "snigdha-master-ledger",
              element: <SnigdhaAllLedgerReportPage />,
            },
            {
              path: "snigdha-pending-ledger-report",
              element: <SnigdhaMasterLedgerReportPage />,
            },
            {
              path: "snigdha-acctually-profit-loss",
              element: <SigdhaAcctualProfitLossPage />,
            },
          
            // invoice
          
            {
              path: "snigdha-add-invoice",
              element: <AddInvoicePageS />,
            },
            {
              path: "snigdha-view-invoice",
              element: <ViewInvoicePageS />,
            },
          
            {
              path: "snigdha-product-payment-invoice",
              element: <SnigdhaAddPaymentInvoicePage />,
            },
            {
              path: "snigdha-ladger-report",
              element: <ManageLadgerPage />,
            },
            {
              path: "snigdha-gst-report",
              element: <SnigdhaGstReportPage />,
            },
            {
              path: "snigdha-purchase-order",
              element: <PurchaseOrderPage />,
            },
            {
              path: "snigdha-view-purchase-order",
              element: <ViewPurchaseOrderPage />,
            },

            {
              path: "add-purchase-payment-snigdha",
              element: <SnigdhaAddPurchasePaymentPage />,
            },
            {
              path: "update-purchase-payment-snigdha",
              element: <SnigdhaUpdatePurchasePaymentPage />,
            },

            // for snigdha bank
            {
              path: "add-bank-snigdha",
              element: <SnigdhaAddBankPage/>,
            },

            {
              path: "billing/bank/snigdha/:bankId",
              element: <SnigdhaBankDetailsPage/>,
            },
  
            {
              path: "withdraw-snigdha",
              element: <SnigdhaWithdrawPage/>,
            },
            {
              path: "imprest-fund-snigdha",
              element: <SnigdhaImprestFundPage/>,
            },
            {
              path: "add-expense-snigdha",
              element: <SnigdhaExpensePage/>,
            },
            {
              path: "add-deposit-snigdha",
              element: <SnigdhaDepositPage/>,
            },
            {
              path: "add-note-snigdha",
              element: <SnigdhaAddNotePage/>,
            },
            {
              path: "money-transfer-snigdha",
              element: <SnigdhaMoneyTransferPage/>,
            },
            {
              path: "bank-statement-snigdha",
              element: <SnigdhaBankStatementPage/>,
            },
            {
              path: "manage-purchase-transaction-snigdha",
              element: <SnigdhaManagePurchaseTransactionPage/>,
            },

          ],
        },
          ],
        },
        ]);

        export default router;
