import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import {
  ShoppingCart,
  FileText,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/common/api";

const DashboardComponent = () => {
  const { theme } = useTheme();
  const isDark = theme === "light";
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/reports/${schoolId}/dashboard`);

      if (response.data.success) {
        setDashboardData(response.data.data);

        // Fetch recent sales transactions
        const salesResponse = await api.get(`/reports/${schoolId}/today/sales`);
        if (salesResponse.data.success) {
          setRecentSales(salesResponse.data.data.transactions.slice(0, 5));
        }

        // Fetch recent purchase transactions
        const purchasesResponse = await api.get(`/reports/${schoolId}/today/purchases`);
        if (purchasesResponse.data.success) {
          setRecentPurchases(purchasesResponse.data.data.transactions.slice(0, 5));
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolId) {
      fetchDashboardData();
    }
  }, [schoolId]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className={isDark ? "text-white" : "text-gray-800"}>
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className={`mb-4 ${isDark ? "text-black" : "text-gray-800"}`}>
            {error}
          </p>
          <Button onClick={fetchDashboardData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  // Prepare stats data
  const stats = [
    {
      title: "Today's Sales",
      value: formatCurrency(dashboardData?.today?.sales?.amount),
      subtitle: `${dashboardData?.today?.sales?.transactions || 0} transactions`,
      icon: <ShoppingCart />,
      color: "from-green-500 to-emerald-500",
      change: dashboardData?.today?.sales?.amount,
    },
    {
      title: "Today's Purchases",
      value: formatCurrency(dashboardData?.today?.purchases?.amount),
      subtitle: `${dashboardData?.today?.purchases?.transactions || 0} transactions`,
      icon: <FileText />,
      color: "from-blue-500 to-cyan-500",
      change: dashboardData?.today?.purchases?.amount,
    },
    {
      title: "Inventory Items",
      value: (dashboardData?.inventory?.totalItems || 0).toString(),
      subtitle: `${dashboardData?.inventory?.lowStockItems || 0} low stock`,
      icon: <Package />,
      color: "from-purple-500 to-pink-500",
      alert: (dashboardData?.inventory?.outOfStockItems || 0) > 0,
    },
    {
      title: "Today's Profit/Loss",
      value: formatCurrency(dashboardData?.profitLoss?.today),
      subtitle: `All-time: ${formatCurrency(dashboardData?.profitLoss?.allTime)}`,
      icon: (dashboardData?.profitLoss?.today || 0) >= 0 ? <TrendingUp /> : <TrendingDown />,
      color: (dashboardData?.profitLoss?.today || 0) >= 0
        ? "from-green-500 to-emerald-500"
        : "from-red-500 to-orange-500",
      isProfit: (dashboardData?.profitLoss?.today || 0) >= 0,
    },
  ];

  const badge = (status) =>
    status === "Paid"
      ? "bg-green-600/20 text-green-400 border border-green-600/40"
      : "bg-yellow-600/20 text-yellow-400 border border-yellow-600/40";

  return (
    <div className="space-y-8">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Last updated: {dashboardData?.reportGeneratedAt ? new Date(dashboardData.reportGeneratedAt).toLocaleString('en-IN') : 'N/A'}
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm" className="text-black">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* ===================== Stats ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`rounded-xl p-5 shadow-lg transition-all hover:shadow-xl ${isDark ? "bg-[#0f172a] text-white" : "bg-white text-gray-800"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-400">{s.title}</p>
                <h3 className="text-2xl font-bold mt-1">{s.value}</h3>
                {s.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{s.subtitle}</p>
                )}
                {s.alert && (
                  <p className="text-xs text-red-400 mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {dashboardData?.inventory?.outOfStockItems || 0} out of stock
                  </p>
                )}
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-r ${s.color} text-white`}
              >
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== All-Time Summary ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`rounded-xl p-5 shadow-lg ${isDark ? "bg-[#0f172a] text-white" : "bg-white text-gray-800"
            }`}
        >
          <h4 className="text-sm text-gray-400 mb-2">Total Sales (All-Time)</h4>
          <p className="text-2xl font-bold text-green-500">
            {formatCurrency(dashboardData?.allTime?.sales?.amount)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {dashboardData?.allTime?.sales?.transactions || 0} transactions | {dashboardData?.allTime?.sales?.items || 0} items
          </p>
        </div>

        <div
          className={`rounded-xl p-5 shadow-lg ${isDark ? "bg-[#0f172a] text-white" : "bg-white text-gray-800"
            }`}
        >
          <h4 className="text-sm text-gray-400 mb-2">Total Purchases (All-Time)</h4>
          <p className="text-2xl font-bold text-blue-500">
            {formatCurrency(dashboardData?.allTime?.purchases?.amount)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {dashboardData?.allTime?.purchases?.transactions || 0} transactions | {dashboardData?.allTime?.purchases?.items || 0} items
          </p>
        </div>

        <div
          className={`rounded-xl p-5 shadow-lg ${isDark ? "bg-[#0f172a] text-white" : "bg-white text-gray-800"
            }`}
        >
          <h4 className="text-sm text-gray-400 mb-2">Inventory Value</h4>
          <p className="text-2xl font-bold text-purple-500">
            {formatCurrency(dashboardData?.inventory?.totalValue)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {dashboardData?.inventory?.totalStock || 0} units in stock
          </p>
        </div>
      </div>

      {/* ===================== Recent Sales ===================== */}
      <div
        className={`rounded-xl p-6 shadow-lg ${isDark ? "bg-[#0f172a] text-white" : "bg-white text-gray-800"
          }`}
      >
        <h3 className="text-lg font-bold mb-4">Today's Sales Invoices</h3>

        {recentSales.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No sales transactions today</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-purple-500/30">
            <table className="min-w-full text-sm">
              <thead
                className={`${isDark
                  ? "bg-[#112038] text-gray-200"
                  : "bg-gray-100 text-gray-700"
                  }`}
              >
                <tr>
                  <th className="px-4 py-3 text-left">Invoice No</th>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Student Details</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Items</th>
                  {/* <th className="px-4 py-3 text-center">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr
                    key={sale._id}
                    className={`border-t ${isDark
                      ? "border-purple-500/30 hover:bg-[#1e293b]"
                      : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <td className="px-4 py-3 font-medium">{sale.invoiceNumber}</td>
                    <td className="px-4 py-3">{sale.studentName}</td>
                    <td className="px-4 py-3">{sale.className} - {sale.section} - {sale.rollNumber} </td>
                    <td className="px-4 py-3">{formatDate(sale.date)}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                        {sale.items.length} items
                      </span>
                    </td>
                    {/* <td className="px-4 py-3 text-center">
                      <Button size="sm" variant="outline">
                        <Eye size={16} />
                      </Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================== Recent Purchases ===================== */}
      <div
        className={`rounded-xl p-6 shadow-lg ${isDark ? "bg-[#0f172a] text-white" : "bg-white text-gray-800"
          }`}
      >
        <h3 className="text-lg font-bold mb-4">Today's Purchase Invoices</h3>

        {recentPurchases.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No purchase transactions today</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-purple-500/30">
            <table className="min-w-full text-sm">
              <thead
                className={`${isDark
                  ? "bg-[#112038] text-gray-200"
                  : "bg-gray-100 text-gray-700"
                  }`}
              >
                <tr>
                  <th className="px-4 py-3 text-left">Purchase No</th>
                  <th className="px-4 py-3 text-left">Supplier</th>
                  <th className="px-4 py-3 text-left">Supplier Address</th>
                  <th className="px-4 py-3 text-left">Supplier Ph</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Items</th>
                  {/* <th className="px-4 py-3 text-center">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((purchase) => (
                  <tr
                    key={purchase._id}
                    className={`border-t ${isDark
                      ? "border-purple-500/30 hover:bg-[#1e293b]"
                      : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <td className="px-4 py-3 font-medium">{purchase.purchaseNo}</td>
                    <td className="px-4 py-3">{purchase.sellerName}</td>
                    <td className="px-4 py-3">{purchase.sellerAddress}</td>
                    <td className="px-4 py-3">{purchase.sellerPhone}</td>
                    <td className="px-4 py-3">{formatDate(purchase.date)}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(purchase.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {purchase.items.length} items
                      </span>
                    </td>
                    {/* <td className="px-4 py-3 text-center">
                      <Button size="sm" variant="outline">
                        <Eye size={16} />
                      </Button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
