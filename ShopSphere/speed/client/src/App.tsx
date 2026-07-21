import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CustomerDashboard from "@/pages/CustomerDashboard";
import AuthPage from "@/pages/AuthPage";
import DemoLogin from "@/pages/DemoLogin";
import DemoLoginSimple from "@/pages/DemoLoginSimple";
import About from "@/pages/About";
import Categories from "@/pages/Categories";
import TrackOrder from "@/pages/TrackOrder";
import LoyaltyProgram from "@/pages/LoyaltyProgram";
import HelpCenter from "@/pages/HelpCenter";
import ShippingInfo from "@/pages/ShippingInfo";
import ReturnsRefunds from "@/pages/ReturnsRefunds";
import TermsConditions from "@/pages/TermsConditions";
import CategoryProducts from "@/pages/CategoryProducts";
import RoleSelection from "@/pages/RoleSelection";
// Role-based dashboards
import SupAdminDashboard from "@/roles/supadmin/SupAdminDashboard";
import AdminRoleDashboard from "@/roles/admin/AdminDashboard";
import StaffDashboard from "@/roles/staff/StaffDashboard";
import DeliveryDashboard from "@/roles/delivery/DeliveryDashboard";
// User components
import UserDashboard from "@/roles/user/UserDashboard";
import ProfileManagement from "@/roles/user/ProfileManagement";
import AddressManagement from "@/roles/user/AddressManagement";
import OrderHistory from "@/roles/user/OrderHistory";
import Wishlist from "@/roles/user/Wishlist";
import UserSettings from "@/roles/user/UserSettings";
// Role-specific pages
// Admin pages
import UserManagementPage from "@/roles/admin/UserManagementPage";
import StaffManagementPage from "@/roles/admin/StaffManagementPage";
import ProductCatalogPage from "@/roles/admin/ProductCatalogPage";
import OrderProcessingPage from "@/roles/admin/OrderProcessingPage";
import DeliveryManagementPage from "@/roles/admin/DeliveryManagementPage";
import StoreSettingsPage from "@/roles/admin/StoreSettingsPage";
// Staff pages
import ProductManagementPage from "@/roles/staff/ProductManagementPage";
import OrderManagementPage from "@/roles/staff/OrderManagementPage";
import InventoryManagementPage from "@/roles/staff/InventoryManagementPage";
import PriceUpdatesPage from "@/roles/staff/PriceUpdatesPage";
import TaskListPage from "@/roles/staff/TaskListPage";
// Delivery pages
import DeliveryRoutesPage from "@/roles/delivery/DeliveryRoutesPage";
import TodaysSchedulePage from "@/roles/delivery/TodaysSchedulePage";
import InTransitPage from "@/roles/delivery/InTransitPage";
import DeliveredPage from "@/roles/delivery/DeliveredPage";
import PendingPickupPage from "@/roles/delivery/PendingPickupPage";
// SupAdmin pages
import RoleManagementPage from "@/roles/supadmin/RoleManagementPage";
import SupAdminUserManagementPage from "@/roles/supadmin/UserManagementPage";
import PermissionsPage from "@/roles/supadmin/PermissionsPage";
import SystemSettingsPage from "@/roles/supadmin/SystemSettingsPage";
import DatabasePage from "@/roles/supadmin/DatabasePage";
import AuditLogsPage from "@/roles/supadmin/AuditLogsPage";
import AddCategory from "./roles/admin/AddCategory";
import AddSubCategory from "./roles/admin/AddSubCategory";
import AllCategoryProducts from "./pages/AllCategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/demo-login" component={DemoLoginSimple} />
      <Route path="/dashboard/customer" component={CustomerDashboard} />
      <Route path="/dashboard/user" component={UserDashboard} />
      <Route path="/dashboard/user/profile" component={ProfileManagement} />
      <Route path="/dashboard/user/address" component={AddressManagement} />
      <Route path="/dashboard/user/orders" component={OrderHistory} />
      <Route path="/dashboard/user/wishlist" component={Wishlist} />
      <Route path="/dashboard/user/settings" component={UserSettings} />
      <Route path="/dashboard/roles" component={RoleSelection} />
      {/* Role-based dashboards */}
      <Route path="/dashboard/supadmin" component={SupAdminDashboard} />
      <Route path="/dashboard/admin" component={AdminRoleDashboard} />
      <Route path="/dashboard/staff" component={StaffDashboard} />
      <Route path="/dashboard/delivery" component={DeliveryDashboard} />
      {/* Admin role pages */}
      <Route path="/dashboard/admin/users" component={UserManagementPage} />
      <Route path="/dashboard/admin/staff" component={StaffManagementPage} />
      <Route path="/dashboard/admin/products" component={ProductCatalogPage} />
      <Route path="/dashboard/admin/orders" component={OrderProcessingPage} />
      <Route path="/dashboard/admin/delivery" component={DeliveryManagementPage} />
      <Route path="/dashboard/admin/settings" component={StoreSettingsPage} />
      <Route path="/dashboard/admin/categories" component={AddCategory} />
      <Route path="/dashboard/admin/sub-categories" component={AddSubCategory} />
      {/* Staff role pages */}
      <Route path="/dashboard/staff/products" component={ProductManagementPage} />
      <Route path="/dashboard/staff/orders" component={OrderManagementPage} />
      <Route path="/dashboard/staff/inventory" component={InventoryManagementPage} />
      <Route path="/dashboard/staff/pricing" component={PriceUpdatesPage} />
      <Route path="/dashboard/staff/tasks" component={TaskListPage} />
      {/* Delivery role pages */}
      <Route path="/dashboard/delivery/routes" component={DeliveryRoutesPage} />
      <Route path="/dashboard/delivery/schedule" component={TodaysSchedulePage} />
      <Route path="/dashboard/delivery/transit" component={InTransitPage} />
      <Route path="/dashboard/delivery/delivered" component={DeliveredPage} />
      <Route path="/dashboard/delivery/pending" component={PendingPickupPage} />
      {/* SupAdmin role pages */}
      <Route path="/dashboard/supadmin/roles" component={RoleManagementPage} />
      <Route path="/dashboard/supadmin/users" component={SupAdminUserManagementPage} />
      <Route path="/dashboard/supadmin/permissions" component={PermissionsPage} />
      <Route path="/dashboard/supadmin/system" component={SystemSettingsPage} />
      <Route path="/dashboard/supadmin/database" component={DatabasePage} />
      <Route path="/dashboard/supadmin/audit" component={AuditLogsPage} />
      <Route path="/about" component={About} />
      <Route path="/categories/:categoryID" component={Categories} />
      <Route path="/sub-categories/:categoryId" component={CategoryProducts} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/loyalty" component={LoyaltyProgram} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/shipping" component={ShippingInfo} />
      <Route path="/returns" component={ReturnsRefunds} />
      <Route path="/terms" component={TermsConditions} />
      <Route path="/all-category-products/:categoryID" component={AllCategoryProducts} />
      <Route path="/product-details/:productID" component={ProductDetails} />
      <Route path="/cart" component={Cart} />
       
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;