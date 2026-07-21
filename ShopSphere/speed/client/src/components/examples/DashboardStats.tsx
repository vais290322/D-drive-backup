import { DashboardStats } from "../DashboardStats";
import { ShoppingCart, Users, Package, TrendingUp } from "lucide-react";

export default function DashboardStatsExample() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStats
        title="Total Orders"
        value="1,234"
        icon={ShoppingCart}
        description="Active orders"
        trend={{ value: 12.5, isPositive: true }}
      />
      <DashboardStats
        title="Total Customers"
        value="856"
        icon={Users}
        description="Registered users"
        trend={{ value: 8.3, isPositive: true }}
      />
      <DashboardStats
        title="Products"
        value="342"
        icon={Package}
        description="In stock"
      />
      <DashboardStats
        title="Revenue"
        value="₹2.4M"
        icon={TrendingUp}
        description="This month"
        trend={{ value: 15.2, isPositive: true }}
      />
    </div>
  );
}
