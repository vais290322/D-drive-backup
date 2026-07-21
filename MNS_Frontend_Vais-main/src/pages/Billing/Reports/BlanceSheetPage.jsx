import React, { useState, useRef, useEffect } from 'react';
import { FaFilePdf, FaFileExcel, FaPrint, FaSearch, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import toast from 'react-hot-toast';
import { backendDomainA } from '../../../common/index';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const BlanceSheetPage = () => {
  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Jan 1 of current year
    endDate: new Date().toISOString().split('T')[0], // Today
  });
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  
  // State for financial data
  const [financialData, setFinancialData] = useState({
    assets: [],
    liabilities: [],
    equity: [],
    income: [],
    expenses: []
  });
  
  // State for summary data
  const [summary, setSummary] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    bankBalance: 0,
    accountsReceivable: 0,
    accountsPayable: 0
  });
  
  // Refs for printing
  const componentRef = useRef();
  
  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchFinancialData();
  }, [dateRange]);
  
  // Function to fetch financial data
  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // Fetch bank balances
      const bankResponse = await axios.get(`${backendDomainA}/api/v1/bank/all`);
      const banks = bankResponse.data.data || [];
      
      // Fetch invoices (income)
      const invoiceResponse = await axios.get(`${backendDomainA}/api/v1/invoice/all`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
      });
      const invoices = invoiceResponse.data.data || [];
      
      // Fetch purchases (expenses)
      const purchaseResponse = await axios.get(`${backendDomainA}/api/v1/purchase-window/all`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
      });
      const purchases = purchaseResponse.data.data || [];
      
      // Fetch inventory (assets)
      const inventoryResponse = await axios.get(`${backendDomainA}/api/v1/inventory/all`);
      const inventory = inventoryResponse.data.data || [];
      
      // Process and organize data
      processFinancialData(banks, invoices, purchases, inventory);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Failed to fetch financial data');
      
      // Use dummy data if API fails
      useDummyData();
    } finally {
      setLoading(false);
    }
  };
  
  // Process and organize financial data
  const processFinancialData = (banks, invoices, purchases, inventory) => {
    // Calculate total bank balance
    const totalBankBalance = banks.reduce((sum, bank) => sum + (bank.currentBalance || 0), 0);
    
    // Calculate total accounts receivable (unpaid invoices)
    const accountsReceivable = invoices
      .filter(invoice => invoice.paymentStatus !== 'paid')
      .reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);
    
    // Calculate total accounts payable (unpaid purchases)
    const accountsPayable = purchases
      .filter(purchase => purchase.paymentStatus !== 'paid')
      .reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    
    // Calculate total income
    const totalIncome = invoices.reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);
    
    // Calculate total expenses
    const totalExpenses = purchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    
    // Calculate net profit
    const netProfit = totalIncome - totalExpenses;
    
    // Calculate inventory value
    const inventoryValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
    
    // Organize assets
    const assets = [
      { id: 1, category: 'Current Assets', name: 'Cash and Cash Equivalents', amount: totalBankBalance },
      { id: 2, category: 'Current Assets', name: 'Accounts Receivable', amount: accountsReceivable },
      { id: 3, category: 'Current Assets', name: 'Inventory', amount: inventoryValue },
      // Add more asset categories as needed
    ];
    
    // Organize liabilities
    const liabilities = [
      { id: 1, category: 'Current Liabilities', name: 'Accounts Payable', amount: accountsPayable },
      // Add more liability categories as needed
    ];
    
    // Organize equity (simplified)
    const equity = [
      { id: 1, category: 'Owner\'s Equity', name: 'Capital', amount: totalBankBalance + accountsReceivable + inventoryValue - accountsPayable },
      { id: 2, category: 'Owner\'s Equity', name: 'Retained Earnings', amount: netProfit },
    ];
    
    // Organize income
    const income = invoices.map((invoice, index) => ({
      id: index + 1,
      category: 'Sales Revenue',
      name: `Invoice #${invoice.invoiceNumber}`,
      date: invoice.date,
      amount: invoice.grandTotal || 0
    }));
    
    // Organize expenses
    const expenses = purchases.map((purchase, index) => ({
      id: index + 1,
      category: 'Operating Expenses',
      name: `Purchase #${purchase.invoiceNumber}`,
      date: purchase.date,
      amount: purchase.amount || 0
    }));
    
    // Update state with processed data
    setFinancialData({
      assets,
      liabilities,
      equity,
      income,
      expenses
    });
    
    // Update summary
    setSummary({
      totalAssets: totalBankBalance + accountsReceivable + inventoryValue,
      totalLiabilities: accountsPayable,
      totalEquity: totalBankBalance + accountsReceivable + inventoryValue - accountsPayable + netProfit,
      totalIncome,
      totalExpenses,
      netProfit,
      bankBalance: totalBankBalance,
      accountsReceivable,
      accountsPayable
    });
  };
  
  // Use dummy data if API fails
  const useDummyData = () => {
    // Dummy data for Balance Sheet
    const assets = [
      { id: 1, category: 'Current Assets', name: 'Cash and Cash Equivalents', amount: 1250000 },
      { id: 2, category: 'Current Assets', name: 'Accounts Receivable', amount: 875000 },
      { id: 3, category: 'Current Assets', name: 'Inventory', amount: 1450000 },
      { id: 4, category: 'Current Assets', name: 'Short-term Investments', amount: 650000 },
      { id: 5, category: 'Current Assets', name: 'Prepaid Expenses', amount: 125000 },
      { id: 6, category: 'Fixed Assets', name: 'Property, Plant and Equipment', amount: 3750000 },
      { id: 7, category: 'Fixed Assets', name: 'Less: Accumulated Depreciation', amount: -850000 },
      { id: 8, category: 'Fixed Assets', name: 'Land', amount: 2250000 },
      { id: 9, category: 'Intangible Assets', name: 'Goodwill', amount: 750000 },
      { id: 10, category: 'Intangible Assets', name: 'Patents and Trademarks', amount: 450000 },
      { id: 11, category: 'Other Assets', name: 'Long-term Investments', amount: 1850000 },
      { id: 12, category: 'Other Assets', name: 'Deferred Tax Assets', amount: 175000 },
    ];
    
    const liabilities = [
      { id: 13, category: 'Current Liabilities', name: 'Accounts Payable', amount: 650000 },
      { id: 14, category: 'Current Liabilities', name: 'Short-term Loans', amount: 450000 },
      { id: 15, category: 'Current Liabilities', name: 'Current Portion of Long-term Debt', amount: 375000 },
      { id: 16, category: 'Current Liabilities', name: 'Accrued Expenses', amount: 225000 },
      { id: 17, category: 'Current Liabilities', name: 'Income Tax Payable', amount: 175000 },
      { id: 18, category: 'Long-term Liabilities', name: 'Long-term Debt', amount: 2750000 },
      { id: 19, category: 'Long-term Liabilities', name: 'Deferred Tax Liabilities', amount: 325000 },
      { id: 20, category: 'Long-term Liabilities', name: 'Pension Obligations', amount: 950000 },
    ];
    
    const equity = [
      { id: 21, category: 'Shareholders\' Equity', name: 'Common Stock', amount: 3500000 },
      { id: 22, category: 'Shareholders\' Equity', name: 'Retained Earnings', amount: 2850000 },
      { id: 23, category: 'Shareholders\' Equity', name: 'Additional Paid-in Capital', amount: 1250000 },
      { id: 24, category: 'Shareholders\' Equity', name: 'Treasury Stock', amount: -750000 },
      { id: 25, category: 'Shareholders\' Equity', name: 'Accumulated Other Comprehensive Income', amount: 125000 },
    ];
    
    // Calculate totals
    const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);
    
    // Update state with dummy data
    setFinancialData({
      assets,
      liabilities,
      equity,
      income: [],
      expenses: []
    });
    
    // Update summary with dummy data
    setSummary({
      totalAssets,
      totalLiabilities,
      totalEquity,
      totalIncome: 5000000,
      totalExpenses: 3500000,
      netProfit: 1500000,
      bankBalance: 1250000,
      accountsReceivable: 875000,
      accountsPayable: 650000
    });
  };
  
  // Filter data based on search query
  const filteredAssets = financialData.assets.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredLiabilities = financialData.liabilities.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredEquity = financialData.equity.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Pagination logic
  const indexOfLastAsset = currentPage * itemsPerPage;
  const indexOfFirstAsset = indexOfLastAsset - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstAsset, indexOfLastAsset);
  
  const indexOfLastLiability = currentPage * itemsPerPage;
  const indexOfFirstLiability = indexOfLastLiability - itemsPerPage;
  const currentLiabilities = filteredLiabilities.slice(indexOfFirstLiability, indexOfLastLiability);
  
  const indexOfLastEquity = currentPage * itemsPerPage;
  const indexOfFirstEquity = indexOfLastEquity - itemsPerPage;
  const currentEquity = filteredEquity.slice(indexOfFirstEquity, indexOfLastEquity);
  
  // Calculate total pages
  const totalAssetPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const totalLiabilityPages = Math.ceil(filteredLiabilities.length / itemsPerPage);
  const totalEquityPages = Math.ceil(filteredEquity.length / itemsPerPage);
  const totalPages = Math.max(totalAssetPages, totalLiabilityPages, totalEquityPages);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  // Handle date range change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  // Handle print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Balance Sheet',
  });
  
  // Handle export to Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Assets worksheet
    const assetsData = [
      ['Category', 'Name', 'Amount'],
      ...financialData.assets.map(item => [item.category, item.name, item.amount])
    ];
    const assetsWs = XLSX.utils.aoa_to_sheet(assetsData);
    XLSX.utils.book_append_sheet(workbook, assetsWs, 'Assets');
    
    // Liabilities worksheet
    const liabilitiesData = [
      ['Category', 'Name', 'Amount'],
      ...financialData.liabilities.map(item => [item.category, item.name, item.amount])
    ];
    const liabilitiesWs = XLSX.utils.aoa_to_sheet(liabilitiesData);
    XLSX.utils.book_append_sheet(workbook, liabilitiesWs, 'Liabilities');
    
    // Equity worksheet
    const equityData = [
      ['Category', 'Name', 'Amount'],
      ...financialData.equity.map(item => [item.category, item.name, item.amount])
    ];
    const equityWs = XLSX.utils.aoa_to_sheet(equityData);
    XLSX.utils.book_append_sheet(workbook, equityWs, 'Equity');
    
    // Summary worksheet
    const summaryData = [
      ['Metric', 'Amount'],
      ['Total Assets', summary.totalAssets],
      ['Total Liabilities', summary.totalLiabilities],
      ['Total Equity', summary.totalEquity],
      ['Total Income', summary.totalIncome],
      ['Total Expenses', summary.totalExpenses],
      ['Net Profit', summary.netProfit]
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWs, 'Summary');
    
    // Save the workbook
    XLSX.writeFile(workbook, 'Balance_Sheet.xlsx');
  };
  
  // Handle export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Balance Sheet', 14, 22);
    doc.setFontSize(12);
    doc.text(`Period: ${dateRange.startDate} to ${dateRange.endDate}`, 14, 30);
    
    // Add summary
    doc.setFontSize(14);
    doc.text('Summary', 14, 40);
    doc.autoTable({
      startY: 45,
      head: [['Metric', 'Amount']],
      body: [
        ['Total Assets', `₹${summary.totalAssets.toLocaleString()}`],
        ['Total Liabilities', `₹${summary.totalLiabilities.toLocaleString()}`],
        ['Total Equity', `₹${summary.totalEquity.toLocaleString()}`],
        ['Total Income', `₹${summary.totalIncome.toLocaleString()}`],
        ['Total Expenses', `₹${summary.totalExpenses.toLocaleString()}`],
        ['Net Profit', `₹${summary.netProfit.toLocaleString()}`]
      ],
    });
    
    // Add assets
    doc.setFontSize(14);
    doc.text('Assets', 14, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['Category', 'Name', 'Amount']],
      body: financialData.assets.map(item => [
        item.category,
        item.name,
        `₹${item.amount.toLocaleString()}`
      ]),
    });
    
    // Add liabilities
    doc.setFontSize(14);
    doc.text('Liabilities', 14, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['Category', 'Name', 'Amount']],
      body: financialData.liabilities.map(item => [
        item.category,
        item.name,
        `₹${item.amount.toLocaleString()}`
      ]),
    });
    
    // Add equity
    doc.setFontSize(14);
    doc.text('Equity', 14, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['Category', 'Name', 'Amount']],
      body: financialData.equity.map(item => [
        item.category,
        item.name,
        `₹${item.amount.toLocaleString()}`
      ]),
    });
    
    // Save the PDF
    doc.save('Balance_Sheet.pdf');
  };
  
  // Prepare chart data for assets
  const assetChartData = {
    labels: financialData.assets.map(item => item.name),
    datasets: [
      {
        label: 'Assets',
        data: financialData.assets.map(item => item.amount),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare chart data for income vs expenses
  const incomeExpenseChartData = {
    labels: ['Income', 'Expenses', 'Net Profit'],
    datasets: [
      {
        label: 'Amount',
        data: [summary.totalIncome, summary.totalExpenses, summary.netProfit],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Balance Sheet</h1>
      
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              className="border rounded px-3 py-2 text-sm"
            />
            <span className="mx-2">to</span>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
          
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="border rounded pl-10 pr-4 py-2 w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FaPrint className="mr-2" /> Print
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <FaFileExcel className="mr-2" /> Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <FaFilePdf className="mr-2" /> PDF
          </button>
        </div>
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Printable content */}
      <div ref={componentRef} className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Balance Sheet</h2>
          <p className="text-gray-600">
            Period: {dateRange.startDate} to {dateRange.endDate}
          </p>
        </div>
        
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Assets</h3>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(summary.totalAssets)}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Balance:</span>
                <span className="font-medium">{formatCurrency(summary.bankBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accounts Receivable:</span>
                <span className="font-medium">{formatCurrency(summary.accountsReceivable)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Liabilities</h3>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(summary.totalLiabilities)}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Accounts Payable:</span>
                <span className="font-medium">{formatCurrency(summary.accountsPayable)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Equity</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.totalEquity)}</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Income</h3>
            <p className="text-3xl font-bold text-purple-600">{formatCurrency(summary.totalIncome)}</p>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Expenses</h3>
            <p className="text-3xl font-bold text-yellow-600">{formatCurrency(summary.totalExpenses)}</p>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Net Profit</h3>
            <p className={`text-3xl font-bold ${summary.netProfit >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              {formatCurrency(summary.netProfit)}
            </p>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Asset Distribution</h3>
            <div className="h-64">
              <Pie data={assetChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
            <div className="h-64">
              <Bar 
                data={incomeExpenseChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
        
        {/* Balance Sheet Tables */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Assets</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left border-b">Category</th>
                  <th className="py-3 px-4 text-left border-b">Name</th>
                  <th className="py-3 px-4 text-right border-b">Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentAssets.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{item.category}</td>
                    <td className="py-3 px-4 border-b">{item.name}</td>
                    <td className="py-3 px-4 text-right border-b">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold">
                  <td className="py-3 px-4 border-b" colSpan="2">Total Assets</td>
                  <td className="py-3 px-4 text-right border-b">{formatCurrency(summary.totalAssets)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Liabilities</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left border-b">Category</th>
                  <th className="py-3 px-4 text-left border-b">Name</th>
                  <th className="py-3 px-4 text-right border-b">Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentLiabilities.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{item.category}</td>
                    <td className="py-3 px-4 border-b">{item.name}</td>
                    <td className="py-3 px-4 text-right border-b">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-red-50 font-semibold">
                  <td className="py-3 px-4 border-b" colSpan="2">Total Liabilities</td>
                  <td className="py-3 px-4 text-right border-b">{formatCurrency(summary.totalLiabilities)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Equity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left border-b">Category</th>
                  <th className="py-3 px-4 text-left border-b">Name</th>
                  <th className="py-3 px-4 text-right border-b">Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentEquity.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{item.category}</td>
                    <td className="py-3 px-4 border-b">{item.name}</td>
                    <td className="py-3 px-4 text-right border-b">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-green-50 font-semibold">
                  <td className="py-3 px-4 border-b" colSpan="2">Total Equity</td>
                  <td className="py-3 px-4 text-right border-b">{formatCurrency(summary.totalEquity)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Accounting Equation Verification */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Accounting Equation</h3>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center mb-4 md:mb-0">
              <p className="text-gray-600">Assets</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalAssets)}</p>
            </div>
            <div className="text-center mb-4 md:mb-0">
              <p className="text-3xl">=</p>
            </div>
            <div className="text-center mb-4 md:mb-0">
              <p className="text-gray-600">Liabilities</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalLiabilities)}</p>
            </div>
            <div className="text-center mb-4 md:mb-0">
              <p className="text-3xl">+</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Equity</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalEquity)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              } text-sm font-medium`}
            >
              <span className="sr-only">First</span>
              <span className="h-5 w-5 flex justify-center items-center">«</span>
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 border ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              } text-sm font-medium`}
            >
              <span className="sr-only">Previous</span>
              <span className="h-5 w-5 flex justify-center items-center">‹</span>
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === pageNum
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 border ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              } text-sm font-medium`}
            >
              <span className="sr-only">Next</span>
              <span className="h-5 w-5 flex justify-center items-center">›</span>
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              } text-sm font-medium`}
            >
              <span className="sr-only">Last</span>
              <span className="h-5 w-5 flex justify-center items-center">»</span>
            </button>
          </nav>
        </div>
      )}
      
      {/* Items per page selector */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BlanceSheetPage;