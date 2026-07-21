import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChartLine, FaChartBar, FaChartPie, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { backendDomainR1, backendDomainS } from "../../Common/index";

// Constants
const fetchInventoryUrl = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN;
const fetchAllInvoice = import.meta.env.VITE_REACT_FETCH_INVOICE;

const TodaysOverview = () => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    totalSales: 0,
    totalProductInvoice: 0,
    totalProductCash: 0,
    totalProductCredit: 0,
    totalServiceSalse: 0,
    totalServiceInvoice: 0,
    totalServiceCash: 0,
    totalServiceCredit: 0,
    totalPurchaseBuy: 0,
    totalPurchaseInvoice: 0,
    totalPurchaseCash: 0,
    totalPurchaseCredit: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalExpenses: 0,
  });
  const [currentInventory, setCurrentInventory] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [profitLossData, setProfitLossData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [todaysInvoiceItems, setTodaysInvoiceItems] = useState([]); // New state for today's invoice items

  const fetchTodaysExpense = async () => {
    const response = await axios.get(`${backendDomainS}/api/v1/expense/all`);
    if (response?.data?.success) {
      const today = new Date().toISOString().split("T")[0];
      const filteredExpense = response?.data?.data?.filter(
        (expense) => expense.createdAt?.split("T")[0] === today
      );
      setTotalExpenses(
        filteredExpense?.reduce((acc, expense) => acc + expense.amount, 0)
      );
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchTodaysExpense();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all required data in parallel
      const today = new Date().toISOString().split("T")[0];

      const [
        salesResponse,
        serviceResponse,
        purchaseResponse,
        profitLossResponse,
        inventoryResponse,
        transactionsResponse,
      ] = await Promise.all([
        axios.get(fetchAllInvoice),
        axios.get(`${backendDomainS}/api/v1/service-invoice/`),
        axios.get(`${backendDomainS}/api/v1/po/all`),
        axios.get(`${backendDomainS}/api/v1/profit-loss/snigdha-profit-loss`),
        axios.get(fetchInventoryUrl),
        axios.get(
          `${backendDomainS}/api/v1/reports/all-bank-transactions?startDate="${today}"&endDate="${today}"`
        ),
      ]);

      // Process data
      const salesData = salesResponse?.data?.data;
      const serviceData = serviceResponse?.data?.data;
      const purchaseData = purchaseResponse?.data?.purchaseOrders;
      const profitLossData = profitLossResponse?.data?.data;
      const inventoryData = inventoryResponse?.data?.data;
      const transactionsData =
        transactionsResponse?.data?.data?.transactions || [];

      setSalesData(salesData);
      setProfitLossData(profitLossData);
      setCurrentInventory(inventoryData);
      setRecentTransactions(transactionsData.slice(0, 5));

      // Calculate today's stats
      processData(salesData, profitLossData, serviceData, purchaseData);

      toast.success("Today's overview data loaded successfully");
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load some dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const processData = (
    salesData,
    profitLossData,
    serviceData,
    purchaseData
  ) => {
    if (!salesData || !profitLossData) return;

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Initialize counters
    let totalSales = 0;
    let totalProductInvoice = 0;
    let totalProductCash = 0;
    let totalProductCredit = 0;
    let totalServiceSales = 0;
    let totalServiceInvoice = 0;
    let totalServiceCash = 0;
    let totalServiceCredit = 0;
    let totalPurchaseBuy = 0;
    let totalPurchaseInvoice = 0;
    let totalPurchaseCash = 0;
    let totalPurchaseCredit = 0;
    let totalProfit = 0;
    let totalOrders = 0;
    let allInvoiceItems = [];

    // Process Product Invoices
    if (salesData) {
      const todayProductInvoices = salesData?.filter(
        (invoice) => invoice.createdAt?.split("T")[0] === today
      );

      totalProductInvoice = todayProductInvoices.length;
      totalOrders += totalProductInvoice;

      // Extract all items from today's invoices
      todayProductInvoices.forEach((invoice) => {
        const amount =
          parseFloat(invoice.totalPayableAmount || invoice?.grandTotal) || 0;
        const profit = parseFloat(invoice.profit) || 0;

        totalSales += amount;
        totalProfit += profit;

        // Check payment type
        if (invoice.paymentType?.toLowerCase() === "cash") {
          totalProductCash += amount;
        } else {
          totalProductCredit += amount;
        }

        // Extract items from invoice
        if (invoice.items && Array.isArray(invoice.items)) {
          invoice.items.forEach(item => {
            allInvoiceItems.push({
              ...item,
              invoiceNumber: invoice.invoiceNumber || invoice.invoiceNo,
              invoiceDate: invoice.createdAt
            });
          });
        }
      });

      // Set today's invoice items
      setTodaysInvoiceItems(allInvoiceItems);
    }

    // Process Service Invoices
    if (serviceData) {
      const todayServiceInvoices = serviceData.filter(
        (invoice) => invoice.createdAt?.split("T")[0] === today
      );

      totalServiceInvoice = todayServiceInvoices.length;
      totalOrders += totalServiceInvoice;

      todayServiceInvoices.forEach((invoice) => {
        const amount =
          parseFloat(invoice.totalPayableAmount || invoice?.grandTotal) || 0;
        const profit = parseFloat(invoice.profit) || 0;

        totalServiceSales += amount;
        totalProfit += profit;

        // Check payment type
        if (invoice.paymentType?.toLowerCase() === "cash") {
          totalServiceCash += amount;
        } else {
          totalServiceCredit += amount;
        }
      });
    }

    // Process Purchase Invoices
    if (purchaseData) {
      const todayPurchaseInvoices = purchaseData.filter(
        (invoice) => invoice.createdAt?.split("T")[0] === today
      );

      totalPurchaseInvoice = todayPurchaseInvoices.length;

      todayPurchaseInvoices.forEach((invoice) => {
        const amount = parseFloat(invoice.grandTotal) || 0;

        totalPurchaseBuy += amount;

        // Check payment type
        if (invoice.paymentType?.toLowerCase() === "cash") {
          totalPurchaseCash += amount;
        } else {
          totalPurchaseCredit += amount;
        }
      });
    }

    // Set today's stats
    setTodayStats({
      totalSales,
      totalProductInvoice,
      totalProductCash,
      totalProductCredit,
      totalServiceSalse: totalServiceSales,
      totalServiceInvoice,
      totalServiceCash,
      totalServiceCredit,
      totalPurchaseBuy,
      totalPurchaseInvoice,
      totalPurchaseCash,
      totalPurchaseCredit,
      totalProfit,
      totalOrders,
      totalExpenses: profitLossData.todayExpenses || 0,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-purple-600 text-4xl" />
        <p className="ml-4 text-lg text-gray-700">Loading today's data...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Today's Key Metrics */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Today's Sales</h3>
          <p className="text-2xl font-bold text-gray-800">
            ₹{todayStats.totalSales.toLocaleString()}
          </p>
          <p className="text-sm font-bold text-blue-600">
            Total invoices : {todayStats.totalProductInvoice}
          </p>
          <div className="flex items-center mt-2">
            <FaChartLine className="text-green-500 mr-1" />
            <span className="text-xs text-gray-500">Today</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">
            Today's Service Salse
          </h3>
          <p className="text-2xl font-bold text-gray-800">
            ₹{todayStats.totalServiceSalse.toLocaleString()}
          </p>
          <p className="text-sm font-bold text-green-600">
            Total invoices : {todayStats.totalServiceInvoice}
          </p>
          <div className="flex items-center mt-2">
            <FaChartBar className="text-blue-500 mr-1" />
            <span className="text-xs text-gray-500">Today</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Today's Orders</h3>
          <p className="text-2xl font-bold text-gray-800">
            {todayStats.totalOrders.toLocaleString()}
          </p>
          <div className="flex items-center mt-2">
            <FaChartPie className="text-purple-500 mr-1" />
            <span className="text-xs text-gray-500">Today</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">
            Today's Purchase
          </h3>
          <p className="text-2xl font-bold text-gray-800">
            ₹{todayStats.totalPurchaseBuy.toLocaleString()}
          </p>
          <p className="text-sm font-bold text-red-600">
            Total invoices : {todayStats.totalPurchaseInvoice}
          </p>
          <div className="flex items-center mt-2">
            <FaChartBar className="text-red-500 mr-1" />
            <span className="text-xs text-gray-500">Today</span>
          </div>
        </div>
      </div>

      {/* Today's Invoice Items - Replacing Inventory Status */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Today's Sold Items
        </h2>
        <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
          {todaysInvoiceItems.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todaysInvoiceItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.itemName || item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity || item.qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sellingPrice || item.rate || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(item.sellingPrice || item.rate || 0) * (item.quantity || item.qty || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.invoiceNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4 text-gray-500">No items sold today</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Recent Transactions
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transaction
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Invoice Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.description ||
                        transaction.narration ||
                        "Transaction"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(transaction.amount || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.transactionType === "transferCredit" || transaction.transactionType==="deposit"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.paymentMethod} -{" "}
                        {transaction.transactionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.invoiceType}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No transactions today
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's Business Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Today's Business Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-md font-medium mb-3 text-gray-700">
              Sales Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Product's Cash Sales:
                </span>
                <span className="font-medium">
                  {todayStats.totalProductCash || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Product's Credit Sales:
                </span>
                <span className="font-medium">
                  {todayStats?.totalProductCredit || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Service's Cash Sales:
                </span>
                <span className="font-medium">
                  {todayStats.totalServiceCash || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Service's Credit Sales:
                </span>
                <span className="font-medium">
                  {todayStats?.totalServiceCredit || 0}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium text-gray-700">
                  Total:
                </span>
                <span className="font-bold text-gray-800">
                  {todayStats.totalSales + todayStats.totalServiceSalse}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-md font-medium mb-3 text-gray-700">
              Expense Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Purchase's Cash :</span>
                <span className="font-medium">
                  {todayStats?.totalPurchaseCash || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Purchase's Credit :
                </span>
                <span className="font-medium">
                  {todayStats?.totalPurchaseCredit || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expense :</span>
                <span className="font-medium">{totalExpenses || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Other :</span>
                <span className="font-medium">
                  {formatCurrency(profitLossData?.todayOtherExpenses || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium text-gray-700">
                  Total:
                </span>
                <span className="font-bold text-gray-800">
                  {todayStats?.totalPurchaseBuy + totalExpenses || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysOverview;
