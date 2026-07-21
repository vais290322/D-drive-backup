import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "../pages/DashboardPage";
import ClientListPage from "../pages/CRM/ClientListPage";
import ModifyDeletePage from "../pages/CRM/ModifyDeletePage";
import AddInvoicePage from "../pages/Billing/Invoice/AddInvoicePage";
import ViewInvoicePge from "../pages/Billing/Invoice/ViewInvoicePge";
import AddProductPage from "../pages/Billing/Inventory/AddProductPage";
import GstReportPage from "../pages/Billing/Reports/GstReportPage";
import BlanceSheetPage from "../pages/Billing/Reports/BlanceSheetPage";
import ProfitLossPage from "../pages/Billing/Reports/ProfitLossPage";
import AssetPage from "../pages/Billing/Reports/AssetPage";
import RaisePoPage from "../pages/Billing/PO/RaisePoPage";
import ReceivedPoPage from "../pages/Billing/PO/ReceivedPoPage";
import CasualLaborPage from "../pages/HRM/IndirectStaff/CasualLaborPage";
import SecurityGuardPage from "../pages/HRM/IndirectStaff/SecurityGuardPage";
import HouseKeepingPge from "../pages/HRM/IndirectStaff/HouseKeepingPge";
import AdminPage from "../pages/Operation/AdminPage";
import RecruitmentTrainingPage from "../pages/Operation/RecruitmentTrainingPage";
import AddTax from "../pages/Billing/Tax/AddTax";
import CreateCoupon from "../pages/Billing/Coupons/CreateCoupon";
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
import ViewSalaryPage from "../pages/HRM/PayrollManagement/ViewSalaryPage";
import ViewSalaryHistoryPage from "../pages/HRM/PayrollManagement/ViewSalaryHistoryPage";
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

import SnigdhaSetUnitPage from "../pages/SnigdhaBilling/SetUnits/SnigdhaSetUnitPage"
import SnigdhaAddItemPage from "../pages/SnigdhaBilling/Inventory/SnigdhaAddItemPage";
import SnigdhaAddProductPage from "../pages/SnigdhaBilling/Inventory/SnigdhaAddProductPage"
import SnigdhaInventoryManagementPage from "../pages/SnigdhaBilling/Inventory/SnigdhaInventoryManagementPage";
import SnigdhaAddClientPage from "../pages/SnigdhaBilling/PO/SnigdhaAddClientPage";
import SnigdhaSellProductPage from "../pages/SnigdhaBilling/PO/SnigdhaSellProductPage";
import SnigdhaAllSellListPage from "../pages/SnigdhaBilling/PO/SnigdhaAllSellListPage";
import SnigdhaProfitLossPage from "../pages/SnigdhaBilling/Reports/SnigdhaProfitLossPage";
import SnigdhaInventoryReportPage from '../pages/SnigdhaBilling/Reports/SnigdhaInventoryReportPage'
import AddItemFromSnigdhaPage from "../pages/Billing/Inventory/AddItemFromSnigdhaPage";
import AddInvoicePageS from "../pages/SnigdhaBilling/Invoice/AddInvoicePageS";
import ViewInvoicePageS from "../pages/SnigdhaBilling/Invoice/ViewInvoicePageS";
import AddBank from "../pages/Settings/AddBank";
import ServiceInvoiceReports from "../pages/Billing/Reports/ServiceInvoiceReports";
import ViewPerfomaInvoicePage from "../pages/Billing/Invoice/ViewPerfomaInvoicePage";
import ProductPaymentInvoice from "../pages/Billing/Invoice/ProductPaymentInvoice";
import ViewProductPaymentInvoice from "../pages/Billing/Invoice/ViewProductPaymentInvoice";
import ManageLadgerPage from "../pages/SnigdhaBilling/Invoice/ManageLadgerPage";
import SnigdhaAddPaymentInvoicePage from "../pages/SnigdhaBilling/Invoice/SnigdhaAddPaymentInvoicePage";
import SnigdhaGstReportPage from "../pages/SnigdhaBilling/Reports/SnigdhaGstReportPage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage/>,
  },

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

  {
    path: "/employee-leave-page/:token",
    element: <LeaveForEmployeePage />,
  },

  {
    path: "/",
    element: <App />,
    children: [

      {
        element:<ProtectedRouteComponent/>,
        children:[

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
      // {
      //   path: "modify-client",
      //   element: <ModifyDeletePage />,
      // },

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



      // For Tax
      // {
      //   path: "add-tax",
      //   element: <AddTax />,
      // },
      //for coupons
      // {
      //   path: "/add-coupon",
      //   element: <CreateCoupon />,
      // },

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
        element: <ProfitLossPage />,
      },
      
      {
        path: "service-invoice-reports",
        element: <ServiceInvoiceReports />,
      },
      // {
      //   path: "balance-sheet",
      //   element: <BlanceSheetPage />,
      // },
      // {
      //   path: "asset",
      //   element: <AssetPage />,
      // },

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
        path: "add-bank",
        element: <AddBank />,
      },
      {
        path: "snigdha-set-units",
        element: <SnigdhaSetUnitPage/>,
      },
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

      // {
      //   path: "snigdha-gst-report",
      //   element: <GstReportPage />,
      // },
      {
        path: "snigdha-inventory-report",
        element: <SnigdhaInventoryReportPage />,
      },

      {
        path: "snigdha-profit-loss",
        element: <SnigdhaProfitLossPage />,
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


    ]}
    ],
  },
]);

export default router;
