import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ExternalLink,
  TrendingUp,
  Sparkles,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDataStore from "@/store/useDataStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/admin/components/ui/Card";
import { Eye } from "lucide-react";
import { Button } from "@/admin/components/ui/Button";
import { Badge } from "@/admin/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/admin/components/ui/Table";
import { productService } from "@/services/admin/api/productService";
import { orderService } from "@/services/admin/api/orderService";
import { customerService } from "@/services/admin/api/customerService";
import { adminOrderUrl, dashboardUrl } from "@/config/userApi";
import axios from "axios";

const StatCard = ({
  title,
  value,
  trend,
  trendUp,
  description,
  gradient,
  icon: Icon,
}) => {
  // Ensure Icon is a valid component - provide fallback
  const IconComponent = Icon || Package;

  return (
    <Card variant="gradient" className="relative overflow-hidden group">
      {/* Gradient background for icon */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}
      />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 relative z-10">
        <CardTitle className="text-[8px] sm:text-sm font-semibold text-gray-700">
          {title}
        </CardTitle>
        <div
          className={`p-2 sm:p-3 rounded-xl bg-opacity-10 group-hover:scale-110 transition-transform`}
        >
          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {value}
        </div>
        <div className="flex items-center mt-2 text-[8px] sm:text-xs">
          {trend && (
            <span
              className={`flex items-center font-semibold ${trendUp ? "text-emerald-600" : "text-red-600"}`}
            >
              {trendUp ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {trend}
            </span>
          )}
          <span
            className="ml-2 text-gray-500 font-medium"
            style={{ paddingLeft: "4px" }}
          >
            {description || "from last month"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    sales: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(dashboardUrl.getDashboard, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        if (response.data && response.data.data) {
          const { totalOrderAmount, totalOrders, totalUsers, totalProducts } =
            response.data.data;
          setStats({
            sales: totalOrderAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }),
            orders: totalOrders,
            customers: totalUsers,
            products: totalProducts,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard totals", error);
      }
    };

    const fetchRecentOrders = async () => {
      try {
        const response = await axios.get(adminOrderUrl.getAllOrders, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        // Fetch all and sort descending by date to get the "last" 5
        const allOrders = response.data.data || [];
        const sorted = [...allOrders].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setRecentOrders(sorted.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch recent orders", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
    fetchRecentOrders();
  }, []);

  // Removed store-based order update effect
  /*
  useEffect(() => {
    ...
  }, [orders]);
  */

  const getStatusVariant = (status) => {
    const s = status?.toUpperCase() || "";
    if (["DELIVERED", "RETURN_COMPLETED"].includes(s)) return "success"; // Green
    if (["CANCELLED", "FAILED"].includes(s)) return "destructive"; // Red
    if (["SHIPPED", "RETURN_REQUESTED"].includes(s)) return "warning"; // Yellow
    if (["CONFIRMED", "RETURN_APPROVED", "PROCESSING"].includes(s))
      return "primary"; // Blue
    return "secondary"; // Gray
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto h-full space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 p-2 sm:p-4 lg:p-6"
      style={{
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)",
        padding: "0px 1rem",
      }}
    >
      {/* Header with gradient text */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4"
        style={{ padding: "5px" }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
            Dashboard
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-emerald-500" />
          </h1>
          <p className="text-[8px] sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
      </div>

      {/* Stats Grid with gradients */}
      <div
        className="grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4"
        style={{ padding: "5px" }}
      >
        <StatCard
          title="Total Sales"
          value={stats.sales}
          icon={IndianRupee}
          trend="+12.5%"
          trendUp={true}
          description="vs last month"
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon={ShoppingBag}
          trend="+8.2%"
          trendUp={true}
          description="vs last month"
          gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
        />
        <StatCard
          title="Total Customers"
          value={stats.customers}
          icon={Users}
          trend="+2.1%"
          trendUp={true}
          description="active now"
          gradient="bg-gradient-to-br from-purple-500 to-pink-600"
        />
        <StatCard
          title="Total Products"
          value={stats.products}
          icon={Package}
          trend="+4.5%"
          trendUp={true}
          description="in catalog"
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
      </div>

      {/* Recent Orders & Quick Actions */}
      <div
        className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 lg:grid-cols-7"
        style={{ padding: "5px" }}
      >
        {/* Recent Orders - Premium Table */}
        <Card variant="elevated" className="col-span-7 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-3 sm:pb-4 gap-2 sm:gap-0">
            <div>
              <CardTitle className="text-md sm:text-xl">
                Recent Orders
              </CardTitle>
              <CardDescription className="mt-1 text-[8px] sm:text-sm">
                Latest transactions
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate("/admin/orders")}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-[8px] sm:text-sm"
            >
              <span
                className="text-[8px] sm:text-sm"
                style={{ marginTop: "5px", paddingRight: "5px" }}
              >
                View All
              </span>{" "}
              <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length > 0 ? (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow
                      className="hover:bg-linear-to-r hover:from-emerald-50 hover:to-teal-50"
                      style={{
                        background:
                          "linear-gradient(to right, #f0fdf4, #f0fdfa)",
                      }}
                    >
                      <TableHead
                        className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                        style={{ padding: "8px 5px" }}
                      >
                        Order ID
                      </TableHead>
                      <TableHead
                        className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden md:table-cell"
                        style={{ padding: "8px 5px" }}
                      >
                        Date
                      </TableHead>
                      <TableHead
                        className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden sm:table-cell"
                        style={{ padding: "8px 5px" }}
                      >
                        Customer
                      </TableHead>
                      <TableHead
                        className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden lg:table-cell"
                        style={{ padding: "8px 5px " }}
                      >
                        Items
                      </TableHead>
                      <TableHead
                        className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                        style={{ padding: "8px 5px" }}
                      >
                        Total
                      </TableHead>
                      <TableHead
                        className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden xl:table-cell"
                        style={{ padding: "8px 5px" }}
                      >
                        Payment
                      </TableHead>
                      <TableHead
                        className="font-semibold text-gray-700 text-[8px] sm:text-sm"
                        style={{ padding: "8px 5px" }}
                      >
                        Status
                      </TableHead>
                      <TableHead
                        className="text-right font-semibold text-gray-700 text-[8px] sm:text-sm"
                        style={{ padding: "8px 5px" }}
                      >
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order, index) => (
                      <TableRow
                        key={order._id}
                        className="cursor-pointer hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100"
                        style={{
                          marginBottom:
                            index !== recentOrders.length - 1 ? "5px" : "0",
                        }}
                        onClick={() => navigate("/admin/orders")}
                      >
                        <TableCell
                          className="font-medium text-[8px] sm:text-xs"
                          style={{ padding: "8px 5px" }}
                        >
                          #{order._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell
                          className="text-gray-500 text-[8px] sm:text-xs hidden md:table-cell"
                          style={{ padding: "8px 5px" }}
                        >
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell
                          className="hidden sm:table-cell"
                          style={{ padding: "8px 5px" }}
                        >
                          <div className="font-medium text-gray-900 text-[8px] sm:text-xs">
                            {order.user?.name || "N/A"}
                          </div>
                          <div className="text-[8px] sm:text-xs text-gray-500">
                            {order.user?.email || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-gray-500 text-[8px] sm:text-xs hidden lg:table-cell"
                          style={{ padding: "8px 5px" }}
                        >
                          {order.orderItems?.length || 0} items
                        </TableCell>
                        <TableCell
                          className="font-bold text-[8px] sm:text-xs text-center"
                          style={{ padding: "8px 5px" }}
                        >
                          ₹{order.totalPrice}
                        </TableCell>
                        <TableCell
                          className="hidden xl:table-cell"
                          style={{ padding: "8px 5px 8px 10px" }}
                        >
                          <Badge
                            variant={
                              order.paymentMethod === "PREPAID"
                                ? "success"
                                : "secondary"
                            }
                            className=" font-normal text-[8px] sm:text-xs"
                          >
                            {order.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ padding: "8px 5px" }}>
                          <Badge
                            variant={getStatusVariant(order.orderStatus)}
                            glow
                            className="text-[8px] sm:text-xs"
                          >
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="text-center"
                          style={{ padding: "8px 5px" }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[8px] sm:text-xs h-7 sm:h-8"
                          >
                            <span
                              className="hidden sm:inline"
                              style={{
                                marginTop: "3px",
                                paddingRight: "3px",
                              }}
                            >
                              Details
                            </span>
                            <Eye className="text-center h-3 w-3 sm:h-4 sm:w-4 sm:ml-2" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12 font-medium">
                No recent orders found.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - Premium Cards */}
        <Card variant="gradient" className="col-span-7 lg:col-span-3">
          <CardHeader className="border-b border-emerald-100 pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-[8px] sm:text-sm">
              Manage your store efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6">
            <Button
              variant="outline"
              className="h-20 sm:h-24 flex-col items-center justify-center space-y-1 sm:space-y-2 hover:bg-linear-to-br hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-300 group"
              onClick={() => navigate("/admin/products/new")}
            >
              <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
              </div>
              <span className="font-semibold text-gray-900 text-[8px] sm:text-sm">
                Add Product
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-20 sm:h-24 flex-col items-center justify-center space-y-1 sm:space-y-2 hover:bg-linear-to-br hover:from-blue-50 hover:to-cyan-50 hover:border-blue-300 group"
              onClick={() => navigate("/admin/orders")}
            >
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
              </div>
              <span className="font-semibold text-gray-900 text-[8px] sm:text-sm">
                View Orders
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-20 sm:h-24 flex-col items-center justify-center space-y-1 sm:space-y-2 hover:bg-linear-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 group"
              onClick={() => navigate("/admin/customers")}
            >
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-700" />
              </div>
              <span className="font-semibold text-gray-900 text-[8px] sm:text-sm">
                Customers
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;