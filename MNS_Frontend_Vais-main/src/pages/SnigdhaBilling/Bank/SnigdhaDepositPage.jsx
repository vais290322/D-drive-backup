import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendDomainS } from "../../../common/index";
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaFilePdf, FaFileExcel, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HiOutlineCurrencyRupee } from "react-icons/hi";

const SnigdhaDepositPage = () => {
  // State for deposits data
  const [deposits, setDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [paginatedDeposits, setPaginatedDeposits] = useState([]);
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
    maxAmount: '',
    bankId: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // State for modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    transactionId: '',
    invoiceNumber: '',
    paymentMethod: 'Cash',
    invoiceId: '',
    bankId: ''
  });
  
  // State for banks and invoices (for dropdowns)
  const [banks, setBanks] = useState([]);
 
  
  // State for alerts
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch deposits data on component mount
  useEffect(() => {
    fetchDeposits();
    fetchBanks();
    
  }, []);

  // Apply filters and search whenever they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, filters, deposits]);

  // Update paginated data whenever filtered data or pagination settings change
  useEffect(() => {
    paginateData();
  }, [filteredDeposits, currentPage, itemsPerPage]);

  // Function to fetch deposits data
  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/deposit-credit/all`);
      console.log('Deposits data:', response);
      if (response.data && response.data.data) {
        setDeposits(response.data.data);
        setError(null);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
      setError('Failed to fetch deposits. Please try again later.');
      setDeposits([]);
      setFilteredDeposits([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch banks
  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/bank/all`);
      if (response.data && response.data.data) {
        setBanks(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };



  // Apply filters and search
  const applyFiltersAndSearch = () => {
    if (!deposits || deposits.length === 0) {
      setFilteredDeposits([]);
      setTotalItems(0);
      return;
    }

    let result = [...deposits];
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(deposit => 
        (deposit.transactionId && deposit.transactionId.toLowerCase().includes(searchLower)) ||
        (deposit.invoiceNumber && deposit.invoiceNumber.toLowerCase().includes(searchLower)) ||
        deposit.bankId?.bankName?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply date filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      result = result.filter(deposit => new Date(deposit.date) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(deposit => new Date(deposit.date) <= endDate);
    }
    
    // Apply payment method filter
    if (filters.paymentMethod) {
      result = result.filter(deposit => deposit.paymentMethod === filters.paymentMethod);
    }
    
    // Apply amount filters
    if (filters.minAmount && !isNaN(parseFloat(filters.minAmount))) {
      result = result.filter(deposit => deposit.amount >= parseFloat(filters.minAmount));
    }
    
    if (filters.maxAmount && !isNaN(parseFloat(filters.maxAmount))) {
      result = result.filter(deposit => deposit.amount <= parseFloat(filters.maxAmount));
    }

    // Apply bank filter
    if (filters.bankId) {
      result = result.filter(deposit => deposit.bankId?._id === filters.bankId);
    }
    
    setFilteredDeposits(result);
    setTotalItems(result.length);
    setCurrentPage(1);
  };

  // Paginate the filtered data
  const paginateData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedDeposits(filteredDeposits.slice(startIndex, endIndex));
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
      const response = await axios.post(`${backendDomainS}/api/v1/deposit-credit/create`, formData);
      if (response.data && response.data.success) {
        showAlert(response.data.message || 'Deposit added successfully', 'success');
        setAddModalOpen(false);
        resetForm();
        await fetchDeposits();
        applyFiltersAndSearch();
      } else {
        showAlert(response.data.message || 'Failed to add deposit', 'error');
      }
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to add deposit', 'error');
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`${backendDomainS}/api/v1/deposit-credit/update/${currentDeposit._id}`, formData);
      if (response.data && response.data.success) {
        showAlert(response.data.message || 'Deposit updated successfully', 'success');
        setEditModalOpen(false);
        resetForm();
        await fetchDeposits();
        applyFiltersAndSearch();
      } else {
        showAlert(response.data.message || 'Failed to update deposit', 'error');
      }
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to update deposit', 'error');
    }
  };

  // Handle delete deposit
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deposit? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await axios.delete(`${backendDomainS}/api/v1/deposit-credit/delete/${id}`);
      if (response.data && response.data.success) {
        showAlert(response.data.message || 'Deposit deleted successfully', 'success');
        await fetchDeposits();
        applyFiltersAndSearch();
      } else {
        showAlert(response.data.message || 'Failed to delete deposit', 'error');
      }
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to delete deposit', 'error');
    }
  };

  // Open edit modal and set form data
  const openEditModal = (deposit) => {
    setCurrentDeposit(deposit);
    setFormData({
      date: new Date(deposit.date).toISOString().split('T')[0],
      amount: deposit.amount,
      transactionId: deposit.transactionId,
      invoiceNumber: deposit.invoiceNumber,
      paymentMethod: deposit.paymentMethod,
      invoiceId: deposit.invoiceId?._id || deposit.invoiceId || '',
      bankId: deposit.bankId?._id || deposit.bankId || ''
    });
    setEditModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      transactionId: '',
      invoiceNumber: '',
      paymentMethod: 'Cash',
      invoiceId: '',
      bankId: ''
    });
    setCurrentDeposit(null);
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

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Deposit Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy')}`, 14, 30);
    
    // Define table columns
    const tableColumn = ["Date", "Transaction ID", "Invoice #", "Amount", "Payment Method", "Bank"];
    
    // Define table rows
    const tableRows = filteredDeposits.map(deposit => [
      formatDate(deposit.date),
      deposit.transactionId,
      deposit.invoiceNumber,
      `₹${deposit.amount.toLocaleString()}`,
      deposit.paymentMethod,
      deposit.bankId?.bankName || 'N/A'
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
    doc.save('deposit_report.pdf');
  };

  // Prepare CSV data for export
  const prepareCSVData = () => {
    const csvData = [
      ['Date', 'Transaction ID', 'Invoice Number', 'Amount', 'Payment Method', 'Bank']
    ];
    
    filteredDeposits.forEach(deposit => {
      csvData.push([
        formatDate(deposit.date),
        deposit.transactionId,
        deposit.invoiceNumber,
        deposit.amount,
        deposit.paymentMethod,
        deposit.bankId?.bankName || 'N/A'
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
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white p-3 rounded-lg shadow-md mr-4">
              
              <HiOutlineCurrencyRupee className='w-8 h-8 '/>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Deposit Management</h1>
              <p className="text-blue-100 mt-1">Track and manage all your deposits</p>
            </div>
          </div>
          {/* <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition-colors flex items-center cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Add New Deposit
          </button> */}
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
                placeholder="Search by transaction ID, invoice number..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                filename="deposit_report.csv"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Methods</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cheque">Cheque</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="bankId" className="block text-sm font-medium text-gray-700 mb-1">
                    Bank
                  </label>
                  <select
                    id="bankId"
                    name="bankId"
                    value={filters.bankId}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Banks</option>
                    {banks.map(bank => (
                      <option key={bank._id} value={bank._id}>
                        {bank.bankName} - {bank.accountNumber}
                      </option>
                    ))}
                  </select>
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

      {/* Deposits Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">Error Loading Data</h3>
            <p className="text-gray-500 mt-2">{error}</p>
            <button
              onClick={fetchDeposits}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : paginatedDeposits.length === 0 ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">No Deposits Found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || Object.values(filters).some(val => val !== '') 
                ? 'Try adjusting your search or filters' 
                : 'Add your first deposit to get started'}
            </p>
            {/* <button
              onClick={() => setAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Add New Deposit
            </button> */}
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
                      Transaction ID
                    </th>
                    {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice Type
                    </th> */}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedDeposits?.map((deposit) => (
                    <tr key={deposit._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(deposit.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {deposit.transactionId}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {deposit?.invoiceType}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {deposit.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{deposit.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          deposit.paymentMethod === 'Cash' 
                            ? 'bg-green-100 text-green-800' 
                            : deposit.paymentMethod === 'Bank Transfer'
                            ? 'bg-blue-100 text-blue-800'
                            : deposit.paymentMethod === 'UPI'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {deposit.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {deposit.bankId?.bankName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(deposit)}
                            className="text-indigo-600 cursor-pointer hover:text-indigo-900 focus:outline-none"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(deposit._id)}
                            className="text-red-600 cursor-pointer hover:text-red-900 focus:outline-none"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

 {/* Summary Rows */}
 {paginatedDeposits?.length > 0 && (
                    <>
                      {/* Page Summary */}
                      <tr className="bg-gray-100 font-medium">
                        <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          <strong>Page Total:</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹{paginatedDeposits.reduce((sum, deposit) => sum + deposit.amount, 0).toLocaleString()}
                        </td>
                        <td colSpan="3"></td>
                      </tr>
                      
                      {/* Grand Total */}
                      <tr className="bg-blue-50 font-medium">
                        <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 text-right">
                          <strong>Grand Total ({filteredDeposits.length} deposits):</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                          ₹{filteredDeposits.reduce((sum, deposit) => sum + deposit.amount, 0).toLocaleString()}
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
                <span className="text-sm text-gray-700 mr-4">
                  Showing {paginatedDeposits.length} of {totalItems} entries
                </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
              
              <div className="flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">First</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L3.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(totalPages).keys()].map((page) => {
                    // Show only a window of pages around the current page
                    if (
                      page + 1 === 1 ||
                      page + 1 === totalPages ||
                      (page + 1 >= currentPage - 1 && page + 1 <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page + 1}
                          onClick={() => handlePageChange(page + 1)}
                          className={`relative cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === page + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page + 1}
                        </button>
                      );
                    } else if (
                      page + 1 === currentPage - 2 ||
                      page + 1 === currentPage + 2
                    ) {
                      return (
                        <span
                          key={page + 1}
                          className="relative cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Last</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M12.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L16.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Deposit Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Deposit</h3>
                    <form onSubmit={handleAddSubmit}>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                            Transaction ID
                          </label>
                          <input
                            type="text"
                            id="transactionId"
                            name="transactionId"
                            value={formData.transactionId}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Number
                          </label>
                          <input
                            type="text"
                            id="invoiceNumber"
                            name="invoiceNumber"
                            value={formData.invoiceNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Method
                          </label>
                          <select
                            id="paymentMethod"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Cheque">Cheque</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice
                          </label>
                          <input
                            id="invoiceId"
                            name="invoiceId"
                            value={formData.invoiceNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                            

                        </div>
                        <div>
                          <label htmlFor="bankId" className="block text-sm font-medium text-gray-700 mb-1">
                            Bank
                          </label>
                          <select
                            id="bankId"
                            name="bankId"
                            value={formData.bankId}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Bank</option>
                            {banks.map(bank => (
                              <option key={bank._id} value={bank._id}>
                                {bank.bankName} - {bank.accountNumber}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Add Deposit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddModalOpen(false);
                            resetForm();
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Deposit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Deposit</h3>
                    <form onSubmit={handleEditSubmit}>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            id="edit-date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            id="edit-amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                            Transaction ID
                          </label>
                          <input
                            type="text"
                            id="edit-transactionId"
                            name="transactionId"
                            value={formData.transactionId}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Number
                          </label>
                          <input
                            type="text"
                            id="edit-invoiceNumber"
                            name="invoiceNumber"
                            value={formData.invoiceNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Method
                          </label>
                          <select
                            id="edit-paymentMethod"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Cheque">Cheque</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="edit-invoiceId" className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice
                          </label>
                          <input
                            id="edit-invoiceId"
                            name="invoiceId"
                            value={formData.invoiceNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                            
                        </div>
                        <div>
                          <label htmlFor="edit-bankId" className="block text-sm font-medium text-gray-700 mb-1">
                            Bank
                          </label>
                          <select
                            id="edit-bankId"
                            name="bankId"
                            value={formData.bankId}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Bank</option>
                            {banks.map(bank => (
                              <option key={bank._id} value={bank._id}>
                                {bank.bankName} - {bank.accountNumber}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Update Deposit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditModalOpen(false);
                            resetForm();
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnigdhaDepositPage;

