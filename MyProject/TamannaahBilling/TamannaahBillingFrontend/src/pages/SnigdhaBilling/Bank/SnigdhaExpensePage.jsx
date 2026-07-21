import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendDomainS } from "../../../common/index";
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaFilePdf, FaFileExcel, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SnigdhaExpensePage = () => {
  // State for expenses data
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [paginatedExpenses, setPaginatedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    paymentMethod: '',
    minAmount: '',
    maxAmount: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // State for modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    voucherNumber: '',
    paymentPersonName: '',
    amount: '',
    description: '',
    paymentMethod: 'Cash',
    bankId: ''
  });
  
  // State for banks (for dropdown)
  const [banks, setBanks] = useState([]);
  
  // State for alerts
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch expenses data on component mount and when pagination, search or filters change
  useEffect(() => {
    fetchExpenses();
  }, [currentPage, itemsPerPage, searchTerm, filters]);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, filters, expenses]);


  // Fetch banks for dropdown
  useEffect(() => {
    fetchBanks();
  }, []);

  // Update paginated data whenever filtered data or pagination settings change
  useEffect(() => {
    paginateData();
  }, [filteredExpenses, currentPage, itemsPerPage]);

  
   // Function to fetch expenses data
   const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/expense/all`);
      if (response.data && response.data.data) {
        const expensesData = response.data.data;
        setExpenses(expensesData);
        // Don't set filtered expenses here, let the applyFiltersAndSearch function handle it
        setError(null);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to fetch expenses. Please try again later.');
      setExpenses([]);
      setFilteredExpenses([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch banks
  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/bank/all`);
    //   console.log("Banks: ", response.data.data)
      setBanks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  // Apply filters and search
  const applyFiltersAndSearch = () => {
    if (!expenses || expenses.length === 0) {
      setFilteredExpenses([]);
      setTotalItems(0);
      return;
    }

    let result = [...expenses];
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(expense => 
        (expense.voucherNumber && expense.voucherNumber.toLowerCase().includes(searchLower)) ||
        (expense.paymentPersonName && expense.paymentPersonName.toLowerCase().includes(searchLower)) ||
        (expense.description && expense.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply date filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      result = result.filter(expense => new Date(expense.date) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(expense => new Date(expense.date) <= endDate);
    }
    
    // Apply payment method filter
    if (filters.paymentMethod) {
      result = result.filter(expense => expense.paymentMethod === filters.paymentMethod);
    }
    
    // Apply amount filters
    if (filters.minAmount && !isNaN(parseFloat(filters.minAmount))) {
      result = result.filter(expense => expense.amount >= parseFloat(filters.minAmount));
    }
    
    if (filters.maxAmount && !isNaN(parseFloat(filters.maxAmount))) {
      result = result.filter(expense => expense.amount <= parseFloat(filters.maxAmount));
    }
    
    setFilteredExpenses(result);
    setTotalItems(result.length);
  };

    // Paginate the filtered data
  const paginateData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedExpenses(filteredExpenses.slice(startIndex, endIndex));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      paymentMethod: '',
      minAmount: '',
      maxAmount: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

    // Handle add form submission
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        
        try {
          const response = await axios.post(`${backendDomainS}/api/v1/expense/create`, formData);
          if(response.data && response.data.success) {
            showAlert(response.data.message || 'Expense added successfully', 'success');
            setAddModalOpen(false);
            resetForm();
            await fetchExpenses();
            applyFiltersAndSearch(); // Apply filters after fetching new data
          } else {
            showAlert(response.data.message || 'Failed to add expense', 'error');
          }
        } catch (error) {
          showAlert(error.response?.data?.message || 'Failed to add expense', 'error');
        }
      };
    
      // Handle edit form submission
      const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        try {
          const response = await axios.put(`${backendDomainS}/api/v1/expense/update/${currentExpense._id}`, formData);
          if(response.data && response.data.success) {
            showAlert(response.data.message || 'Expense updated successfully', 'success');
            setEditModalOpen(false);
            resetForm();
            await fetchExpenses();
            applyFiltersAndSearch(); // Apply filters after fetching new data
          } else {
            showAlert(response.data.message || 'Failed to update expense', 'error');
          }
        } catch (error) {
          showAlert(error.response?.data?.message || 'Failed to update expense', 'error');
        }
      };
    
      // Handle delete expense
      const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
          return;
        }
        
        try {
          const response = await axios.delete(`${backendDomainS}/api/v1/expense/delete/${id}`);
          if(response.data && response.data.success) {
            showAlert(response.data.message || 'Expense deleted successfully', 'success');
            await fetchExpenses();
            applyFiltersAndSearch(); // Apply filters after fetching new data
          } else {
            showAlert(response.data.message || 'Failed to delete expense', 'error');
          }
        } catch (error) {
          showAlert(error.response?.data?.message || 'Failed to delete expense', 'error');
        }
      };

  // Open edit modal and set form data
  const openEditModal = (expense) => {
    setCurrentExpense(expense);
    setFormData({
      date: new Date(expense.date).toISOString().split('T')[0],
      voucherNumber: expense.voucherNumber,
      paymentPersonName: expense.paymentPersonName,
      amount: expense.amount,
      description: expense.description,
      paymentMethod: expense.paymentMethod,
      bankId: expense.bankId?._id || ''
    });
    setEditModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      voucherNumber: '',
      paymentPersonName: '',
      amount: '',
      description: '',
      paymentMethod: 'Cash',
      bankId: ''
    });
    setCurrentExpense(null);
  };

  // Show alert message
  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message,
      severity
    });
    
    // Auto hide alert after 5 seconds
    setTimeout(() => {
      setAlert(prev => ({ ...prev, open: false }));
    }, 5000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

//   for pdf 
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Expense Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy')}`, 14, 30);
    
    // Define table columns
    const tableColumn = ["Date", "Voucher #", "Person", "Amount", "Payment Method", "Description"];
    
    // Define table rows
    const tableRows = filteredExpenses.map(expense => [
      formatDate(expense.date),
      expense.voucherNumber,
      expense.paymentPersonName,
      `${expense.amount.toLocaleString()}`,
      expense.paymentMethod === 'Bank'? `Bank Transfer (${expense.bankId?.bankName}) `: 'Cash', 
      expense.description.substring(0, 30) + (expense.description.length > 30 ? '...' : '')
    ]);
    
    // Generate table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      columnStyles: {
        3: { halign: 'right' }
      }
    });
    
    // Save PDF
    doc.save('expense_report.pdf');
  };

  // Prepare CSV data for export
  const prepareCSVData = () => {
    const csvData = [
      ['Date', 'Voucher Number', 'Payment Person', 'Amount', 'Description', 'Payment Method',]
    ];
    
    filteredExpenses.forEach(expense => {
      csvData.push([
        formatDate(expense.date),
        expense.voucherNumber,
        expense.paymentPersonName,
        expense.amount,
        expense.description,
        expense.paymentMethod === 'Bank'? `Bank Transfer (${expense.bankId?.bankName}) `: 'Cash'
      ]);
    });
    
    return csvData;
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Alert Message */}
      {alert.open && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          alert.severity === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="flex items-center">
            {alert.severity === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white p-3 rounded-lg shadow-md mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Expense Management</h1>
              <p className="text-purple-100 mt-1">Track and manage all your expenses</p>
            </div>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg shadow-md hover:bg-purple-50 transition-colors flex items-center cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Add New Expense
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by voucher number, person name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center cursor-pointer"
              >
                <FaFilter className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center cursor-pointer"
              >
                <FaFilePdf className="mr-2" />
                PDF
              </button>
              <CSVLink
                data={prepareCSVData()}
                filename="expense_report.csv"
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center cursor-pointer"
              >
                <FaFileExcel className="mr-2" />
                Excel
              </CSVLink>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={filters.paymentMethod}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Methods</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    id="minAmount"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Amount
                  </label>
                  <input
                    type="number"
                    id="maxAmount"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">Error Loading Data</h3>
            <p className="text-gray-500 mt-2">{error}</p>
            <button
              onClick={fetchExpenses}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : paginatedExpenses.length === 0 ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">No Expenses Found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || Object.values(filters).some(val => val !== '') 
                ? 'Try adjusting your search or filters' 
                : 'Add your first expense to get started'}
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Add New Expense
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voucher #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Person
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {expense.voucherNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {expense.paymentPersonName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          expense.paymentMethod === 'Cash' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {expense.paymentMethod} {expense.paymentMethod === 'Bank' && expense.bankId && `(${expense.bankId.bankName})`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => openEditModal(expense)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                        >
                          <FaEdit className="inline" />
                        </button>
                        <button 
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          <FaTrash className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))}

{/* Summary Rows */}
{paginatedExpenses.length > 0 && (
                    <>
                      {/* Page Summary */}
                      <tr className="bg-gray-100 font-medium">
                        <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          <strong>Page Total:</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹{paginatedExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                        </td>
                        <td colSpan="3"></td>
                      </tr>
                      
                      {/* Grand Total */}
                      <tr className="bg-purple-50 font-medium">
                        <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 text-right">
                          <strong>Grand Total ({filteredExpenses.length} expenses):</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-900">
                          ₹{filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                        </td>
                        <td colSpan="3"></td>
                      </tr>
                    </>
                  )}


                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-700 mr-2">
                  Rows per page:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700 ml-4">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                </span>
              </div>
              <div className="flex">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1  rounded-l-md border ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  Previous
                </button>
                {[...Array(Math.min(totalPages, 5)).keys()].map(page => {
                  const pageNumber = page + 1 + Math.max(0, currentPage - 3);
                  return pageNumber <= totalPages ? (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3  py-1 border-t border-b ${
                        currentPage === pageNumber
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } cursor-pointer`}
                    >
                      {pageNumber}
                    </button>
                  ) : null;
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r-md border ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>


           {/* Add Expense Modal */}
           {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Add New Expense</h2>
                <button 
                  onClick={() => setAddModalOpen(false)}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="voucherNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Voucher Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="voucherNumber"
                      name="voucherNumber"
                      value={formData.voucherNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter voucher number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="paymentPersonName" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="paymentPersonName"
                    name="paymentPersonName"
                    value={formData.paymentPersonName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter payment person name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter expense description"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                    </select>
                  </div>
                  
                  {formData.paymentMethod === 'Bank' && (
                    <div>
                      <label htmlFor="bankId" className="block text-sm font-medium text-gray-700 mb-1">
                        Bank <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="bankId"
                        name="bankId"
                        value={formData.bankId}
                        onChange={handleInputChange}
                        required={formData.paymentMethod === 'Bank'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select Bank</option>
                        {banks.map(bank => (
                          <option key={bank._id} value={bank._id}>
                            {bank.bankName} - {bank.accountNumber} - ₹{bank.currentAmount}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 cursor-pointer py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Edit Expense</h2>
                <button 
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="edit-date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-voucherNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Voucher Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-voucherNumber"
                      name="voucherNumber"
                      value={formData.voucherNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter voucher number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-paymentPersonName" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-paymentPersonName"
                    name="paymentPersonName"
                    value={formData.paymentPersonName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter payment person name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="edit-amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter expense description"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="edit-paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                    </select>
                  </div>
                  
                  {formData.paymentMethod === 'Bank' && (
                    <div>
                      <label htmlFor="edit-bankId" className="block text-sm font-medium text-gray-700 mb-1">
                        Bank <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="edit-bankId"
                        name="bankId"
                        value={formData.bankId}
                        onChange={handleInputChange}
                        required={formData.paymentMethod === 'Bank'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select Bank</option>
                        {banks.map(bank => (
                          <option key={bank._id} value={bank._id}>
                            {bank.bankName} - {bank.accountNumber} - ₹{bank.currentAmount}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 cursor-pointer py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Update Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnigdhaExpensePage;

