import React, { useState, useRef, useEffect } from 'react';
import { FaFilePdf, FaFileExcel, FaPrint, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import axios from 'axios';
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

const fetchInvoiceUrl = import.meta.env.VITE_REACT_FETCH_ALL_INVOICE_MNS;

const SalesReportPage = () => {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [uniqueFilters, setUniqueFilters] = useState({
    itemIds: [],
    groups: [],
    hsnCodes: []
  });
  const [showFilters, setShowFilters] = useState(false); // Add this line to define the showFilters state
  const componentRef = useRef();

  // Fetch sales data
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(fetchInvoiceUrl);
      
      if (response.data.success) {
        // Process the invoice data to extract sales information
        const processedData = processInvoiceData(response.data.data);
        setSalesData(processedData);
        
        // Extract unique filter values
        extractUniqueFilterValues(processedData);
        
        toast.success('Sales data loaded successfully');
      } else {
        toast.error(response.data.message || 'Failed to load sales data');
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error('Error loading sales data');
    } finally {
      setLoading(false);
    }
  };

  // Process invoice data to extract sales information
  const processInvoiceData = (invoices) => {
    const salesItems = [];
    
    invoices.forEach(invoice => {
      // Skip if no items or not an array
      if (!Array.isArray(invoice.items)) return;
      
      invoice.items.forEach(item => {
        // Create a sales record for each item
        salesItems.push({
          invoiceId: invoice.invoiceNumber,
          date: invoice.date,
          itemId: item.id || 'N/A',
          itemName: item.itemName || 'N/A',
          hsnCode: item.hsnCode || 'N/A',
          quantity: parseInt(item.quantity) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          amount: parseFloat(item.amount) || 0,
          taxAmount: parseFloat(item.taxAmount) || 0,
          totalAmount: parseFloat(item.amount) + parseFloat(item.taxAmount) || 0,
          // Group can be derived from item category or other fields
          group: item.group || 'Uncategorized',
          customerName: invoice.receiverDetails?.name || 'N/A',
          paymentType: invoice.paymentType || 'N/A'
        });
      });
    });
    
    return salesItems;
  };

  // Extract unique filter values
  const extractUniqueFilterValues = (data) => {
    const itemIds = [...new Set(data.map(item => item.itemId))];
    const groups = [...new Set(data.map(item => item.group))];
    const hsnCodes = [...new Set(data.map(item => item.hsnCode))];
    
    setUniqueFilters({
      itemIds,
      groups,
      hsnCodes
    });
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Filter data based on search query and filters
  const filteredData = salesData.filter(item => {
    // Search query filter
    const matchesSearch = 
      (item.itemName.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.itemId.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.customerName.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.hsnCode.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.group.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.invoiceId.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    // Date range filter
    const itemDate = new Date(item.date);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;
    
    const matchesDateRange = 
      (!fromDate || itemDate >= fromDate) && 
      (!toDate || itemDate <= toDate);
    
    // Type-specific filter
    let matchesTypeFilter = true;
    if (filterType !== 'all' && filterValue) {
      switch (filterType) {
        case 'itemId':
          matchesTypeFilter = item.itemId === filterValue;
          break;
        case 'group':
          matchesTypeFilter = item.group === filterValue;
          break;
        case 'hsnCode':
          matchesTypeFilter = item.hsnCode === filterValue;
          break;
        default:
          matchesTypeFilter = true;
      }
    }
    
    return matchesSearch && matchesDateRange && matchesTypeFilter;
  });
  
  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  // Calculate summary statistics
  const totalSales = filteredData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalItems = filteredData.reduce((sum, item) => sum + item.quantity, 0);
  const totalInvoices = [...new Set(filteredData.map(item => item.invoiceId))].length;
  
  // Group data for charts
  const prepareChartData = () => {
    // Group by item for top selling items
    const itemSales = {};
    filteredData.forEach(item => {
      if (!itemSales[item.itemName]) {
        itemSales[item.itemName] = 0;
      }
      itemSales[item.itemName] += item.quantity;
    });
    
    // Sort and get top 5
    const topItems = Object.entries(itemSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Group by date for sales trend
    const dateSales = {};
    filteredData.forEach(item => {
      const date = new Date(item.date).toLocaleDateString();
      if (!dateSales[date]) {
        dateSales[date] = 0;
      }
      dateSales[date] += item.totalAmount;
    });
    
    // Sort dates
    const sortedDates = Object.keys(dateSales).sort((a, b) => new Date(a) - new Date(b));
    
    return {
      topItems: {
        labels: topItems.map(item => item[0]),
        data: topItems.map(item => item[1])
      },
      salesTrend: {
        labels: sortedDates,
        data: sortedDates.map(date => dateSales[date])
      }
    };
  };
  
  const chartData = prepareChartData();
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Sales_Report',
  });
  
  // Handle Excel export
  const handleExcelExport = () => {
    // Transform data for export
    const exportData = filteredData.map(item => ({
      'Invoice ID': item.invoiceId,
      'Date': new Date(item.date).toLocaleDateString(),
      'Item ID': item.itemId,
      'Item Name': item.itemName,
      'HSN Code': item.hsnCode,
      'Group': item.group,
      'Quantity': item.quantity,
      'Unit Price': item.unitPrice,
      'Amount': item.amount,
      'Tax Amount': item.taxAmount,
      'Total Amount': item.totalAmount,
      'Customer': item.customerName,
      'Payment Type': item.paymentType
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    
    // Add summary data
    const summaryData = [
      { Summary: 'Total Sales', Value: totalSales },
      { Summary: 'Total Items Sold', Value: totalItems },
      { Summary: 'Total Invoices', Value: totalInvoices }
    ];
    
    const summaryWS = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWS, "Summary");
    
    // Save file
    XLSX.writeFile(workbook, `Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  // Handle PDF export
  const handlePdfExport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Sales Report', 14, 22);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add summary
    doc.setFontSize(14);
    doc.text('Summary', 14, 40);
    
    doc.setFontSize(10);
    doc.text(`Total Sales: ${totalSales}`, 14, 50);
    doc.text(`Total Items Sold: ${totalItems}`, 14, 58);
    doc.text(`Total Invoices: ${totalInvoices}`, 14, 66);
    
    // Create table
    const tableColumn = ["Invoice ID", "Date", "Item ID", "Item Name", "Quantity", "Unit Price", "Total"];
    const tableRows = [];
    
    filteredData.forEach(item => {
      const rowData = [
        item.invoiceId,
        new Date(item.date).toLocaleDateString(),
        item.itemId,
        item.itemName,
        item.quantity,
        formatCurrency(item.unitPrice).replace('₹', 'Rs.'),
        formatCurrency(item.totalAmount).replace('₹', 'Rs.')
      ];
      tableRows.push(rowData);
    });
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Save file
    doc.save(`Sales_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6" ref={componentRef}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Report</h1>
        
        {/* Filters and Actions */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex flex-wrap items-center space-x-2 mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className="flex items-center space-x-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter />
                <span>Filters</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center space-x-2">
            <button
              className="flex items-center space-x-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              onClick={handleExcelExport}
            >
              <FaFileExcel />
              <span>Excel</span>
            </button>
            
            <button
              className="flex items-center space-x-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              onClick={handlePdfExport}
            >
              <FaFilePdf />
              <span>PDF</span>
            </button>
            
            {/* <button
              className="flex items-center space-x-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              onClick={handlePrint}
            >
              <FaPrint />
              <span>Print</span>
            </button> */}
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  />
                  <span className="self-center">to</span>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setFilterValue(''); // Reset filter value when type changes
                  }}
                >
                  <option value="all">All</option>
                  <option value="itemId">Item ID</option>
                  <option value="group">Group</option>
                  <option value="hsnCode">HSN Code</option>
                </select>
              </div>
              
              {filterType !== 'all' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter Value</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  >
                    <option value="">Select a value</option>
                    {filterType === 'itemId' && uniqueFilters.itemIds.map(id => (
                      <option key={id} value={id}>{id}</option>
                    ))}
                    {filterType === 'group' && uniqueFilters.groups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                    {filterType === 'hsnCode' && uniqueFilters.hsnCodes.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => {
                  // Reset filters
                  setDateRange({ from: '', to: '' });
                  setFilterType('all');
                  setFilterValue('');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Sales</h3>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalSales)}</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Items Sold</h3>
            <p className="text-2xl font-bold text-green-900">{totalItems}</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Total Invoices</h3>
            <p className="text-2xl font-bold text-purple-900">{totalInvoices}</p>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Items</h3>
            <div className="h-64">
              {chartData.topItems.labels.length > 0 ? (
                <Bar
                  data={{
                    labels: chartData.topItems.labels,
                    datasets: [
                      {
                        label: 'Quantity Sold',
                        data: chartData.topItems.data,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h3>
            <div className="h-64">
              {chartData.salesTrend.labels.length > 0 ? (
                <Bar
                  data={{
                    labels: chartData.salesTrend.labels,
                    datasets: [
                      {
                        label: 'Sales Amount',
                        data: chartData.salesTrend.data,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Sl.No.
    </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('date')}>
                    <span>Date</span>
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-500" /> : <FaSortAmountDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('invoiceId')}>
                    <span>Invoice</span>
                    {sortField === 'invoiceId' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-500" /> : <FaSortAmountDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('itemId')}>
                    <span>Item ID</span>
                    {sortField === 'itemId' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-500" /> : <FaSortAmountDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('itemName')}>
                    <span>Item Name</span>
                    {sortField === 'itemName' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-500" /> : <FaSortAmountDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('hsnCode')}>
                    <span>HSN Code</span>
                    {sortField === 'hsnCode' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-500" /> : <FaSortAmountDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('group')}>
                    <span>Group</span>
                    {sortField === 'group' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-500" /> : <FaSortAmountDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('quantity')}>
                    <span>Quantity</span>
                    {sortField === 'quantity' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-500" /> : <FaSortAmountDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('unitPrice')}>
                    <span>Unit Price</span>
                    {sortField === 'unitPrice' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-500" /> : <FaSortAmountDown className="text-blue-500" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('totalAmount')}>
                    <span>Total</span>
                    {sortField === 'totalAmount' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-500" /> : <FaSortAmountDown className="text-blue-500" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No sales data found
                  </td>
                </tr>
              ) : (
                <>
                  {currentItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.invoiceId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.itemId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.hsnCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.group}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.totalAmount)}
                      </td>
                    </tr>
                  ))}
                  {/* Summary Row */}
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      Page Summary:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currentItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      —
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(currentItems.reduce((sum, item) => sum + item.totalAmount, 0))}
                    </td>
                  </tr>
                  <tr className="bg-blue-50 font-bold">
                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 text-right">
                      Grand Total:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                      {totalItems}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                      —
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                      {formatCurrency(totalSales)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 print:hidden">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} entries
              </span>
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-1">
              <button
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
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
                    className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReportPage;