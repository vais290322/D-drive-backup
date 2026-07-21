import type { ComponentType } from "react";
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  Package, 
  FileText, 
  DollarSign, 
  UserCog,
  Settings as SettingsIcon,
  Building2,
  TrendingUp,
  Landmark,
  ArrowDownToLine,
  ArrowUpFromLine,
  Receipt,
  BarChart3,
  type LucideIcon
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import CustomerForm from "./pages/CustomerForm";
import CustomerDetail from "./pages/CustomerDetail";
import CustomerLedger from "./pages/CustomerLedger";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Loans from "./pages/Loans";
import LoanForm from "./pages/LoanForm";
import LoanDetail from "./pages/LoanDetail";
import Collections from "./pages/Collections";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import CustomersReport from "./pages/reports/CustomersReport";
import ActiveLoansReport from "./pages/reports/ActiveLoansReport";
import CompletedLoansReport from "./pages/reports/CompletedLoansReport";
import DelayedEMIsReport from "./pages/reports/DelayedEMIsReport";
import TodayCollectionReport from "./pages/reports/TodayCollectionReport";
import FinancialReport from "./pages/reports/FinancialReport";
import CRMDashboard from "./pages/crm/CRMDashboard";
import Companies from "./pages/crm/Companies";
import CompanyForm from "./pages/crm/CompanyForm";
import Contacts from "./pages/crm/Contacts";
import ContactForm from "./pages/crm/ContactForm";
import Deals from "./pages/crm/Deals";
import DealForm from "./pages/crm/DealForm";
import BankingDashboard from "./pages/banking/BankingDashboard";
import BankCustomers from "./pages/banking/Customers";
import CustomerFormBanking from "./pages/banking/CustomerForm";
import CustomerDetailsBanking from "./pages/banking/CustomerDetails";
import Deposit from "./pages/banking/Deposit";
import Withdraw from "./pages/banking/Withdraw";
import Statement from "./pages/banking/Statement";
import BankingReports from "./pages/banking/Reports";

export interface RouteConfig {
  name: string;
  path: string;
  component: ComponentType;
  visible?: boolean;
  icon?: LucideIcon;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    name: "Dashboard",
    path: "/",
    component: Dashboard,
    visible: true,
    icon: LayoutDashboard,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    component: Dashboard,
    visible: false,
  },
  {
    name: "Login",
    path: "/login",
    component: Login,
    visible: false,
  },
  {
    name: "Customers",
    path: "/customers",
    component: Customers,
    visible: true,
    icon: UsersIcon,
  },
  {
    name: "Add Customer",
    path: "/customers/new",
    component: CustomerForm,
    visible: false,
  },
  {
    name: "Customer Detail",
    path: "/customers/:id",
    component: CustomerDetail,
    visible: false,
  },
  {
    name: "Edit Customer",
    path: "/customers/:id/edit",
    component: CustomerForm,
    visible: false,
  },
  {
    name: "Customer Ledger",
    path: "/customers/:customerId/ledger",
    component: CustomerLedger,
    visible: false,
  },
  {
    name: "Products",
    path: "/products",
    component: Products,
    visible: true,
    icon: Package,
  },
  {
    name: "Add Product",
    path: "/products/new",
    component: ProductForm,
    visible: false,
  },
  {
    name: "Edit Product",
    path: "/products/:id/edit",
    component: ProductForm,
    visible: false,
  },
  {
    name: "Loans",
    path: "/loans",
    component: Loans,
    visible: true,
    icon: FileText,
  },
  {
    name: "Create Loan",
    path: "/loans/new",
    component: LoanForm,
    visible: false,
  },
  {
    name: "Loan Detail",
    path: "/loans/:id",
    component: LoanDetail,
    visible: false,
  },
  {
    name: "Collections",
    path: "/collections",
    component: Collections,
    visible: true,
    icon: DollarSign,
  },
  {
    name: "Users",
    path: "/users",
    component: Users,
    visible: true,
    icon: UserCog,
  },
  {
    name: "Settings",
    path: "/settings",
    component: Settings,
    visible: true,
    icon: SettingsIcon,
  },
  {
    name: "Customers Report",
    path: "/reports/customers",
    component: CustomersReport,
    visible: false,
  },
  {
    name: "Active Loans Report",
    path: "/reports/active-loans",
    component: ActiveLoansReport,
    visible: false,
  },
  {
    name: "Completed Loans Report",
    path: "/reports/completed-loans",
    component: CompletedLoansReport,
    visible: false,
  },
  {
    name: "Delayed EMIs Report",
    path: "/reports/delayed-emis",
    component: DelayedEMIsReport,
    visible: false,
  },
  {
    name: "Today Collection Report",
    path: "/reports/today-collection",
    component: TodayCollectionReport,
    visible: false,
  },
  {
    name: "Financial Report",
    path: "/reports/financial",
    component: FinancialReport,
    visible: false,
  },
  {
    name: "CRM",
    path: "/crm",
    component: CRMDashboard,
    visible: true,
    icon: Building2,
  },
  {
    name: "CRM Dashboard",
    path: "/crm/dashboard",
    component: CRMDashboard,
    visible: false,
  },
  {
    name: "Companies",
    path: "/crm/companies",
    component: Companies,
    visible: false,
  },
  {
    name: "Add Company",
    path: "/crm/companies/new",
    component: CompanyForm,
    visible: false,
  },
  {
    name: "Edit Company",
    path: "/crm/companies/:id/edit",
    component: CompanyForm,
    visible: false,
  },
  {
    name: "Contacts",
    path: "/crm/contacts",
    component: Contacts,
    visible: false,
  },
  {
    name: "Add Contact",
    path: "/crm/contacts/new",
    component: ContactForm,
    visible: false,
  },
  {
    name: "Edit Contact",
    path: "/crm/contacts/:id/edit",
    component: ContactForm,
    visible: false,
  },
  {
    name: "Deals",
    path: "/crm/deals",
    component: Deals,
    visible: false,
  },
  {
    name: "New Deal",
    path: "/crm/deals/new",
    component: DealForm,
    visible: false,
  },
  {
    name: "Edit Deal",
    path: "/crm/deals/:id/edit",
    component: DealForm,
    visible: false,
  },
  {
    name: "Banking",
    path: "/banking",
    component: BankingDashboard,
    visible: true,
    icon: Landmark,
    children: [
      {
        name: "Dashboard",
        path: "/banking/dashboard",
        component: BankingDashboard,
        visible: true,
        icon: LayoutDashboard,
      },
      {
        name: "Customers",
        path: "/banking/customers",
        component: BankCustomers,
        visible: true,
        icon: UsersIcon,
      },
      {
        name: "Deposit",
        path: "/banking/deposit",
        component: Deposit,
        visible: true,
        icon: ArrowDownToLine,
      },
      {
        name: "Withdraw",
        path: "/banking/withdraw",
        component: Withdraw,
        visible: true,
        icon: ArrowUpFromLine,
      },
      {
        name: "Statement",
        path: "/banking/statement",
        component: Statement,
        visible: true,
        icon: Receipt,
      },
      {
        name: "Reports",
        path: "/banking/reports",
        component: BankingReports,
        visible: true,
        icon: BarChart3,
      },
    ],
  },
  {
    name: "Add Bank Customer",
    path: "/banking/customers/new",
    component: CustomerFormBanking,
    visible: false,
  },
  {
    name: "Edit Bank Customer",
    path: "/banking/customers/:id/edit",
    component: CustomerFormBanking,
    visible: false,
  },
  {
    name: "View Bank Customer",
    path: "/banking/customers/:id",
    component: CustomerDetailsBanking,
    visible: false,
  },
];

export default routes;