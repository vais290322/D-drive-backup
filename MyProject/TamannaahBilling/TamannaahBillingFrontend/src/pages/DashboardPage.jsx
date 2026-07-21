import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tab } from "@headlessui/react";
import {
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaSpinner,
  FaBoxOpen,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaUserFriends,
} from "react-icons/fa";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import toast from "react-hot-toast";
import { backendDomainR1, backendDomainS } from "../Common/index";
import TodaysOverview from "../components/dashboard/TodaysOverview";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// const fetchInventoryUrl = import.meta.env.VITE_REACT_FETCH_ITEMS;
const fetchInventoryUrl = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN;
const fetchAllInvoice = import.meta.env.VITE_REACT_FETCH_INVOICE;

const DashboardPage = () => {
  // State for all dashboard data
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalExpenses: 0,
  });
  const [allTimeStats, setAllTimeStats] = useState({
    totalSales: 0,
    totalProductInvoice: 0,
    totalServiceSalse: 0,
    totalServiceInvoice: 0,
    totlaPurchases: 0,
    totalPurchasesInvoice: 0,
    ledgerReport: 0,
    allLedgerReport: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalExpenses: 0,
  });
  const [analyticsData, setAnalyticsData] = useState([
    { name: "GST", value: 0, fill: "#FF5C5C" },
    { name: "Revenue", value: 0, fill: "#007BFF" },
    { name: "Inventory", value: 0, fill: "#4CAF50" },
    { name: "Clients", value: 0, fill: "#FFA500" },
  ]);
  const [chartData, setChartData] = useState({
    profitLoss: [],
    orderVolume: [],
  });
  const [currentInventory, setCurrentInventory] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [profitLossData, setProfitLossData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [bankBalances, setBankBalances] = useState([]);
  const [allinvoice, setAllInvoice] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all required data in parallel
        const [
          salesResponse,
          profitLossResponse,
          inventoryResponse,
          bankResponse,
          transactionsResponse,
          serviceResponse,
          purchaseResponse,
          totalCustomer,
          totalVendor,
          ledgerResponse,
          allLedgerResponse,
        ] = await Promise.all([
          axios.get(`${backendDomainS}/api/v1/analytics/sales`),
          axios.get(`${backendDomainS}/api/v1/profit-loss/snigdha-profit-loss`),
          axios.get(fetchInventoryUrl),
          axios.get(`${backendDomainS}/api/v1/bank/all`),
          axios.get(
            `${backendDomainS}/api/v1/reports/all-bank-transactions?startDate="${
              new Date().toISOString().split("T")[0]
            }"&endDate="${new Date().toISOString().split("T")[0]}"`
          ),
          axios.get(`${backendDomainS}/api/v1/service-invoice/`),
          axios.get(`${backendDomainS}/api/v1/po/all`),
          axios.get(`${backendDomainR1}/api/v1/mns/crm/s`),
          axios.get(`${backendDomainR1}/api/v1/mns/vendor/s`),
          axios.get(`${backendDomainS}/api/v1/master-ledger/master`),
          axios.get(`${backendDomainS}/api/v1/snigdha-all-ledger/all`),
        ]);

        // Process data for charts and analytics after all data is fetched
        const salesData = salesResponse?.data?.data;
        // console.log("salse data : ", salesData)
        const profitLossData = profitLossResponse?.data?.data;
        const serviceData = serviceResponse?.data?.data;
        // console.log("service data : ", serviceData)
        const purchaseData = purchaseResponse?.data?.purchaseOrders;
        // console.log("purchase data : ", purchaseData)
        const customerData = totalCustomer?.data?.data?.length || 0;
        const vendorData = totalVendor?.data?.data?.length || 0;
        const ledgerData = ledgerResponse?.data?.data;
        // console.log("ledger data : ", ledgerData)
        const allLedgerData = allLedgerResponse?.data?.customersAndVendors;
        // console.log("all ledger data : ", allLedgerData)
        const inventoryData = inventoryResponse?.data?.data;
        const bankData = bankResponse?.data?.data || [];
        const transactionsData =
          transactionsResponse?.data?.data?.transactions || [];

        setSalesData(salesData);
        setServiceData(serviceData);
        setProfitLossData(profitLossData);
        setCurrentInventory(inventoryData);
        setBankBalances(bankData);
        setRecentTransactions(transactionsData.slice(0, 5));

        // Extract top selling products
        if (inventoryData && Array.isArray(inventoryData)) {
          const sortedProducts = [...inventoryData]
            .sort(
              (a, b) =>
                (parseInt(b.totalSold) || 0) - (parseInt(a.totalSold) || 0)
            )
            .slice(0, 5);
          setTopSellingProducts(sortedProducts);
        }

        // Process and set the data
        processData(
          salesData,
          profitLossData,
          inventoryData,
          serviceData,
          purchaseData,
          customerData,
          vendorData,
          ledgerData,
          allLedgerData
        );
        toast.success("Dashboard data loaded successfully");
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load some dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const processData = (
    salesData,
    profitLossData,
    inventoryData,
    serviceData,
    purchaseData,
    customerData,
    vendorData,
    ledgerData,
    allLedgerData
  ) => {
    if (!salesData || !profitLossData || !inventoryData) return;

    // Calculate today's stats
    const today = new Date().toISOString().split("T")[0];
    const todaySales =
      salesData.salesByDate?.filter((sale) => sale.date?.startsWith(today)) ||
      [];
    const todayTotalSales = todaySales.reduce(
      (sum, sale) => sum + (sale.amount || 0),
      0
    );
    const todayTotalProfit = todaySales.reduce(
      (sum, sale) => sum + (sale.profit || 0),
      0
    );

    // Set today's stats
    setTodayStats({
      totalSales: todayTotalSales || 0,
      totalProfit: todayTotalProfit || 0,
      totalOrders: todaySales.length || 0,
      totalExpenses: profitLossData.todayExpenses || 0,
    });

    const allServiceData = serviceData?.reduce(
      (total, invoice) =>
        total + (invoice?.totalPayableAmount || invoice?.grandTotal || 0),
      0
    );
    const allPurchaseData = purchaseData?.reduce(
      (total, invoice) =>
        total + (invoice?.totalPayableAmount || invoice?.grandTotal || 0),
      0
    );

    const allTotalPaidamount = allLedgerData?.reduce(
      (total, customer) => total + (customer?.totalPaidAmount || 0),
      0
    );

    // console.log("all service data : ", allServiceData)

    // Set all-time stats
    setAllTimeStats({
      totalSales: salesData.totalSellingAmount || 0,
      totalProductInvoice: salesData?.totalInvoices,
      totalServiceSalse: allServiceData,
      totalServiceInvoice: serviceData?.length || 0,
      totalPurchasesInvoice: purchaseData?.length || 0,
      totlaPurchases: allPurchaseData,
      totalCustomer: customerData,
      totalVendor: vendorData,
      ledgerReport: ledgerData,
      allLedgerReport: allTotalPaidamount,
      totalProfit: salesData.totalProfit || 0,
      totalOrders: salesData.totalOrders || 0,
      totalExpenses: profitLossData.totalExpenses || 0,
    });

    // Calculate inventory stats for analytics
    const totalItems = inventoryData?.length || 0;
    const itemsWithGoodStock =
      inventoryData?.filter((item) => {
        const currentStock = parseInt(item.currentStock) || 0;
        const minStock = parseInt(item.minStock) || 0;
        return currentStock > minStock;
      }).length || 0;

    // Update analytics with inventory percentage (items with good stock)
    const inventoryPercentage =
      totalItems > 0 ? Math.round((itemsWithGoodStock / totalItems) * 100) : 0;
    const gstPercentage =
      Math.round(
        (profitLossData.totalGST / (profitLossData.totalRevenue || 1)) * 100
      ) || 0;

    setAnalyticsData((prev) => [
      { ...prev[0], value: gstPercentage },
      {
        ...prev[1],
        value:
          Math.round(
            (salesData.totalProfit / (salesData.totalSellingAmount || 1)) * 100
          ) || 0,
      },
      { ...prev[2], value: inventoryPercentage },
      { ...prev[3], value: salesData.totalCustomers || 0 },
    ]);

    // Process all data for charts and analytics
    processChartData(salesData, profitLossData);
  };

  const processChartData = (salesData, profitLossData) => {
    // Update analytics data
    if (!salesData || !profitLossData) return;

    // Process profit/loss data for chart
    const profitLossChartData =
      profitLossData.monthlyData?.map((item) => ({
        name: item.month,
        profit: item.profit || 0,
        loss: item.expenses || 0,
      })) || [];

    // Process order volume data for chart
    const orderVolumeChartData =
      salesData.monthlySales?.map((item) => ({
        name: item.month,
        orders: item.count || 0,
      })) || [];

    setChartData({
      profitLoss: profitLossChartData,
      orderVolume: orderVolumeChartData,
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fetchCurrentInventory = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(fetchInventoryUrl);
      setCurrentInventory(response?.data?.data);
      if (response?.data?.success) {
        // toast.success(response?.data?.message)
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching current inventory:", error.message);
      }
    } finally {
      // setLoading(false);
    }
  };

  const getAllInvoices = async () => {
    try {
      const getAllData = await fetch(fetchAllInvoice, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await getAllData.json();
      // console.log("Invoice Data", jsonData)
      if (jsonData?.success) {
        // toast.success("Successfully fetched Invoice Data")
        setAllInvoice(jsonData.data || []);
      }
    } catch (error) {
      toast.error("Server error");
      // console.error(error)
    }
  };

  useEffect(() => {
    fetchCurrentInventory();
    getAllInvoices();
  }, []);

  // Define default inventory data first before using it
  const inventoryData = [
    { name: "In Stock", value: 50, color: "#4ade80" },
    { name: "Low Stock", value: 10, color: "#facc15" },
    { name: "Out of Stock", value: 0, color: "#f87171" },
  ];

  // Calculate inventory status data from real inventory
  const calculateInventoryStatus = () => {
    if (!currentInventory || currentInventory?.length === 0)
      return inventoryData;

    const inStock = currentInventory?.filter(
      (item) => (parseInt(item?.quantity) || 0) > 10
    )?.length;
    const lowStock = currentInventory?.filter(
      (item) =>
        (parseInt(item?.quantity) || 0) > 0 &&
        (parseInt(item?.quantity) || 0) <= 10
    )?.length;
    const outOfStock = currentInventory?.filter(
      (item) => (parseInt(item?.quantity) || 0) === 0
    )?.length;

    const total = inStock + lowStock + outOfStock || 1; // Avoid division by zero

    return [
      {
        name: "In Stock",
        value: Math.round((inStock / total) * 100),
        color: "#4ade80",
        count: inStock,
      },
      {
        name: "Low Stock",
        value: Math.round((lowStock / total) * 100),
        color: "#facc15",
        count: lowStock,
      },
      {
        name: "Out of Stock",
        value: Math.round((outOfStock / total) * 100),
        color: "#f87171",
        count: outOfStock,
      },
    ];
  };

  const realInventoryData = calculateInventoryStatus();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-purple-600 text-4xl" />
          <p className="ml-4 text-lg text-gray-700">
            Loading dashboard data...
          </p>
        </div>
      ) : (
        <>
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>

          {/* Tabs */}
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full cursor-pointer rounded-lg py-2.5 text-sm font-medium leading-5",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                    selected
                      ? "bg-white text-blue-700 shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  )
                }
              >
                All Time Overview
              </Tab>

              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg cursor-pointer py-2.5 text-sm font-medium leading-5",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                    selected
                      ? "bg-white text-blue-700 shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  )
                }
              >
                Today's Overview
              </Tab>
            </Tab.List>
            <Tab.Panels>
              {/* All Time Overview Panel */}
              <Tab.Panel className="rounded-xl bg-white p-4 shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  {/* Key Metrics */}
                  <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Product Sales
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">
                      ₹{allTimeStats.totalSales.toLocaleString()}
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      Total invoices : {allTimeStats.totalProductInvoice}
                    </p>

                    <div className="flex items-center mt-2">
                      <FaChartLine className="text-green-500 mr-1" />
                      <span className="text-xs text-gray-500">All time</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Service Salse
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">
                      ₹{allTimeStats.totalServiceSalse}
                    </p>
                    <p className="text-sm font-bold text-blue-600">
                      Total invoices : {allTimeStats.totalServiceInvoice}
                    </p>
                    <div className="flex items-center mt-2">
                      <FaChartBar className="text-blue-500 mr-1" />
                      <span className="text-xs text-gray-500">All time</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Purchases{" "}
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {allTimeStats.totlaPurchases.toFixed(2)}
                    </p>
                    <p className="text-sm font-bold text-purple-600">
                      Total invoices : {allTimeStats.totalPurchasesInvoice}
                    </p>
                    <div className="flex items-center mt-2">
                      <FaChartPie className="text-purple-500 mr-1" />
                      <span className="text-xs text-gray-500">All time</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Customer/Vendor
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {allTimeStats.totalCustomer} / {allTimeStats.totalVendor}
                    </p>
                    <div className="flex items-center mt-2">
                      <FaChartBar className="text-red-500 mr-1" />
                      <span className="text-xs text-gray-500">All time</span>
                    </div>
                  </div>
                </div>

                {/* Business Analytics */}
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Business Analytics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-green-500">
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-green-600 mb-2">
                        Sales Receivables
                      </h3>
                      <p className="text-2xl font-bold mb-1">
                        {allTimeStats?.ledgerReport?.salesLedger?.totalPending.toFixed(
                          2
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {allTimeStats?.ledgerReport?.salesLedger?.customers
                          ? Object.keys(
                              allTimeStats.ledgerReport.salesLedger.customers
                            ).length
                          : 0}{" "}
                        Customers
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500">
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">
                        Service Receivables
                      </h3>
                      <p className="text-2xl font-bold mb-1">
                        {allTimeStats?.ledgerReport?.serviceLedger?.totalPending.toFixed(
                          2
                        )}{" "}
                      </p>
                      <p className="text-sm text-gray-600">
                        {allTimeStats?.ledgerReport?.serviceLedger?.customers
                          ? Object.keys(
                              allTimeStats.ledgerReport.serviceLedger.customers
                            ).length
                          : 0}{" "}
                        Customers
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-purple-500">
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-purple-600 mb-2">
                        Purchases Payables
                      </h3>
                      <p className="text-2xl font-bold mb-1">
                        {allTimeStats?.ledgerReport?.purchaseLedger?.totalPending.toFixed(
                          2
                        )}{" "}
                      </p>
                      <p className="text-sm text-gray-600">
                        {allTimeStats?.ledgerReport?.purchaseLedger?.vendors
                          ? Object.keys(
                              allTimeStats.ledgerReport.purchaseLedger.vendors
                            ).length
                          : 0}{" "}
                        Vendors
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-orange-600 mb-2">
                        Total Paid Amount
                      </h3>
                      <p className="text-2xl font-bold mb-1">
                        {allTimeStats?.allLedgerReport.toFixed(2)}{" "}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inventory Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Inventory Status
                    </h2>
                    <div className="h-80 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={realInventoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, value }) => `${name} ${value}%`}
                          >
                            {realInventoryData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${value}% (${props.payload.count || 0} items)`,
                              name,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Activity Section */}

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Recent 8 Invoices
                      </h2>
                      {/* <a href="/view-invoice" className="text-blue-600 text-sm hover:underline">View All</a> */}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Invoice
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            {/* <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allinvoice?.slice(0, 8).map((invoice) => (
                            <tr key={invoice._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {invoice?.invoiceNumber || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {invoice?.receiverDetails?.name || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {invoice?.date ||
                                  new Date(
                                    invoice?.createDate
                                  ).toLocaleDateString() ||
                                  "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                {formatCurrency(invoice?.grandTotal || "N/A")}
                              </td>
                              {/* <td className="px-4 py-3 text-sm text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                          invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {invoice.status}
                      </span>
                    </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Bank Balances */}
                <div className="mt-8 mb-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Bank Account Summary
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {bankBalances.length > 0 ? (
                      bankBalances.map((bank, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg shadow border border-gray-100"
                        >
                          <h3 className="text-sm font-medium text-gray-500">
                            {bank.bankName || "Bank Account"}
                          </h3>
                          <p className="text-xl font-bold text-gray-800">
                            {formatCurrency(bank.currentAmount || 0)}
                          </p>
                          <div className="flex items-center mt-2">
                            <FaMoneyBillWave className="text-green-500 mr-1" />
                            <span className="text-xs text-gray-500">
                              {bank.accountNumber
                                ? `A/C: ${bank.accountNumber
                                    .slice(-4)
                                    .padStart(bank.accountNumber.length, "*")}`
                                : "Balance"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-gray-500">No bank accounts found</p>
                      </div>
                    )}
                  </div>
                </div>
              </Tab.Panel>

              {/* Today's Overview Panel */}
              <Tab.Panel className="rounded-xl bg-white p-4 shadow">
                <TodaysOverview />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
