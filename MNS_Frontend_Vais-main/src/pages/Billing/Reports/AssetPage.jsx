import React, { useState, useRef } from 'react';
import { FaFilePdf, FaFileExcel, FaPrint, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AssetPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const componentRef = useRef();

  // Dummy data for assets
  const assetsData = [
    { id: 1, name: 'Dell XPS 15 Laptop', category: 'Computer Equipment', purchaseDate: '2022-05-15', purchasePrice: 125000, currentValue: 95000, location: 'Main Office', assignedTo: 'John Smith', status: 'Active', description: 'High-performance laptop for development team' },
    { id: 2, name: 'HP LaserJet Pro Printer', category: 'Office Equipment', purchaseDate: '2021-11-20', purchasePrice: 45000, currentValue: 30000, location: 'Main Office', assignedTo: 'Admin Department', status: 'Active', description: 'Network printer for office use' },
    { id: 3, name: 'Conference Room Table', category: 'Furniture', purchaseDate: '2020-03-10', purchasePrice: 75000, currentValue: 45000, location: 'Conference Room A', assignedTo: 'Facilities', status: 'Active', description: 'Large conference table with 12 seats' },
    { id: 4, name: 'Toyota Innova', category: 'Vehicles', purchaseDate: '2019-08-22', purchasePrice: 1800000, currentValue: 1200000, location: 'Company Garage', assignedTo: 'Operations Department', status: 'Active', description: 'Company vehicle for client visits' },
    { id: 5, name: 'Office Building', category: 'Real Estate', purchaseDate: '2015-01-15', purchasePrice: 25000000, currentValue: 35000000, location: 'City Center', assignedTo: 'Company', status: 'Active', description: 'Main office building with 3 floors' },
    { id: 6, name: 'Cisco Network Switch', category: 'IT Infrastructure', purchaseDate: '2021-06-30', purchasePrice: 85000, currentValue: 65000, location: 'Server Room', assignedTo: 'IT Department', status: 'Active', description: '48-port managed switch' },
    { id: 7, name: 'Executive Desk', category: 'Furniture', purchaseDate: '2020-07-12', purchasePrice: 35000, currentValue: 25000, location: 'CEO Office', assignedTo: 'CEO', status: 'Active', description: 'Executive desk with drawers' },
    { id: 8, name: 'Air Conditioner', category: 'Office Equipment', purchaseDate: '2021-04-18', purchasePrice: 55000, currentValue: 45000, location: 'Main Office', assignedTo: 'Facilities', status: 'Active', description: '2-ton split AC unit' },
    { id: 9, name: 'Server Rack', category: 'IT Infrastructure', purchaseDate: '2020-09-05', purchasePrice: 120000, currentValue: 90000, location: 'Server Room', assignedTo: 'IT Department', status: 'Active', description: '42U server rack with cooling' },
    { id: 10, name: 'Office Chairs (20)', category: 'Furniture', purchaseDate: '2022-02-28', purchasePrice: 150000, currentValue: 135000, location: 'Main Office', assignedTo: 'Facilities', status: 'Active', description: 'Ergonomic office chairs' },
    { id: 11, name: 'Projector', category: 'Office Equipment', purchaseDate: '2021-08-14', purchasePrice: 65000, currentValue: 50000, location: 'Conference Room B', assignedTo: 'Facilities', status: 'Active', description: 'HD projector with screen' },
    { id: 12, name: 'Land Plot', category: 'Real Estate', purchaseDate: '2018-11-30', purchasePrice: 15000000, currentValue: 18000000, location: 'Industrial Area', assignedTo: 'Company', status: 'Active', description: 'Land for future expansion' },
    { id: 13, name: 'MacBook Pro', category: 'Computer Equipment', purchaseDate: '2022-01-10', purchasePrice: 180000, currentValue: 150000, location: 'Design Department', assignedTo: 'Sarah Johnson', status: 'Active', description: 'For graphic design work' },
    { id: 14, name: 'Security Camera System', category: 'Security Equipment', purchaseDate: '2021-05-20', purchasePrice: 250000, currentValue: 200000, location: 'Entire Building', assignedTo: 'Security Department', status: 'Active', description: '16-camera security system' },
    { id: 15, name: 'Microwave Oven', category: 'Kitchen Equipment', purchaseDate: '2022-03-15', purchasePrice: 12000, currentValue: 10000, location: 'Pantry', assignedTo: 'Facilities', status: 'Active', description: 'For employee use' },
    { id: 16, name: 'Water Dispenser', category: 'Kitchen Equipment', purchaseDate: '2021-12-05', purchasePrice: 25000, currentValue: 20000, location: 'Pantry', assignedTo: 'Facilities', status: 'Active', description: 'Hot and cold water dispenser' },
    { id: 17, name: 'Filing Cabinets (5)', category: 'Furniture', purchaseDate: '2020-10-15', purchasePrice: 75000, currentValue: 50000, location: 'Records Room', assignedTo: 'Admin Department', status: 'Active', description: 'For document storage' },
    { id: 18, name: 'UPS System', category: 'IT Infrastructure', purchaseDate: '2021-07-22', purchasePrice: 180000, currentValue: 150000, location: 'Server Room', assignedTo: 'IT Department', status: 'Active', description: 'Backup power supply' },
    { id: 19, name: 'Reception Desk', category: 'Furniture', purchaseDate: '2020-05-10', purchasePrice: 45000, currentValue: 30000, location: 'Reception Area', assignedTo: 'Facilities', status: 'Active', description: 'Custom-built reception desk' },
    { id: 20, name: 'Old Photocopier', category: 'Office Equipment', purchaseDate: '2018-04-20', purchasePrice: 85000, currentValue: 15000, location: 'Storage Room', assignedTo: 'Unassigned', status: 'Inactive', description: 'Replaced with newer model' },
  ];

  // Get unique categories for filter
  const categories = ['all', ...new Set(assetsData.map(item => item.category))];
  
  // Get unique statuses for filter
  const statuses = ['all', ...new Set(assetsData.map(item => item.status))];

  // Filter data based on search query, category and status
  const filteredData = assetsData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
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

  // Calculate totals
  const totalAssetValue = filteredData?.reduce((sum, item) => sum + item.currentValue, 0);
  const totalPurchaseValue = filteredData?.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalDepreciation = totalPurchaseValue - totalAssetValue;
  const activeAssets = filteredData.filter(item => item.status === 'Active').length;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

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

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Asset_Register',
  });

  // Handle Excel export
  const handleExcelExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
      'Asset Name': item.name,
      'Category': item.category,
      'Purchase Date': formatDate(item.purchaseDate),
      'Purchase Price': item.purchasePrice,
      'Current Value': item.currentValue,
      'Depreciation': item.purchasePrice - item.currentValue,
      'Location': item.location,
      'Assigned To': item.assignedTo,
      'Status': item.status,
      'Description': item.description
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asset Register");
    
    // Add summary data
    const summaryData = [
      { Summary: 'Total Asset Value', Value: totalAssetValue },
      { Summary: 'Total Purchase Value', Value: totalPurchaseValue },
      { Summary: 'Total Depreciation', Value: totalDepreciation },
      { Summary: 'Active Assets', Value: activeAssets },
      { Summary: 'Total Assets', Value: filteredData.length }
    ];
    
    const summaryWS = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWS, "Summary");
    
    // Save file
    XLSX.writeFile(workbook, `Asset_Register_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Handle PDF export
  const handlePdfExport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Asset Register', 14, 22);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Create table
    const tableColumn = ["Asset Name", "Category", "Purchase Date", "Purchase Price", "Current Value", "Location", "Status"];
    const tableRows = [];
    
    filteredData.forEach(item => {
      const rowData = [
        item.name,
        item.category,
        formatDate(item.purchaseDate),
        formatCurrency(item.purchasePrice).replace('₹', 'Rs.'),
        formatCurrency(item.currentValue).replace('₹', 'Rs.'),
        item.location,
        item.status
      ];
      tableRows.push(rowData);
    });
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Add summary
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.text('Summary', 14, finalY + 15);
    
    const summaryData = [
      ['Total Asset Value', formatCurrency(totalAssetValue).replace('₹', 'Rs.')],
      ['Total Purchase Value', formatCurrency(totalPurchaseValue).replace('₹', 'Rs.')],
      ['Total Depreciation', formatCurrency(totalDepreciation).replace('₹', 'Rs.')],
      ['Active Assets', activeAssets.toString()],
      ['Total Assets', filteredData.length.toString()]
    ];
    
    doc.autoTable({
      body: summaryData,
      startY: finalY + 20,
      theme: 'plain',
      styles: { fontSize: 10 }
    });
    
    doc.save(`Asset_Register_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6" ref={componentRef}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Asset Register</h1>
        
        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center">
            <span className="mr-2 whitespace-nowrap">Category:</span>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <button 
              onClick={handlePdfExport}
              className="flex items-center cursor-pointer gap-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
            >
              <FaFilePdf /> PDF
            </button>
            <button 
              onClick={handleExcelExport}
              className="flex items-center cursor-pointer gap-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
            >
              <FaFileExcel /> Excel
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center cursor-pointer gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              <FaPrint /> Print
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-6 print:hidden">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by asset name, location, or assigned to..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Assets</h3>
            <p className="text-2xl font-bold text-blue-900">{filteredData.length}</p>
            <p className="text-sm text-blue-700 mt-1">Active: {activeAssets}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Current Value</h3>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(totalAssetValue)}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Purchase Value</h3>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalPurchaseValue)}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Depreciation</h3>
            <p className="text-2xl font-bold text-amber-900">{formatCurrency(totalDepreciation)}</p>
            <p className="text-sm text-amber-700 mt-1">
              {((totalDepreciation / totalPurchaseValue) * 100).toFixed(1)}% of purchase value
            </p>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Asset Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('purchaseDate')}
                >
                  <div className="flex items-center">
                    Purchase Date
                    {sortField === 'purchaseDate' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('purchasePrice')}
                >
                  <div className="flex items-center justify-end">
                    Purchase Price
                    {sortField === 'purchasePrice' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('currentValue')}
                >
                  <div className="flex items-center justify-end">
                    Current Value
                    {sortField === 'currentValue' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('location')}
                >
                  <div className="flex items-center">
                    Location
                    {sortField === 'location' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('assignedTo')}
                >
                  <div className="flex items-center">
                    Assigned To
                    {sortField === 'assignedTo' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center justify-center">
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.purchaseDate)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.purchasePrice)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.currentValue)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.assignedTo}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 print:hidden">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="ml-2">entries</span>
          </div>
          
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
            </span>
            
            <div className="flex">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border cursor-pointer rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 cursor-pointer border-t border-b border-r ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 cursor-pointer py-1 border-t border-b border-r rounded-r-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetPage;