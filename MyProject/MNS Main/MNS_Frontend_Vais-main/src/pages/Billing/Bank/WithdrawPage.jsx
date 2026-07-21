import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendDomainA } from "../../../common/index";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const WithdrawPage = () => {
  // State for withdrawals data
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for form dialog
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // State for transaction type options
  const [mainType, setMainType] = useState('');
  const [subType, setSubType] = useState('');
  
  // State for form data
  const [formData, setFormData] = useState({
    transactionType: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    personName: '',
    voucherNumber: '',
    description: '',
    bankId: ''
  });
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    bankId: '',
    transactionType: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // pagination state variables
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginatedWithdrawals, setPaginatedWithdrawals] = useState([]);

    // Close export menu when clicking outside
    useEffect(() => {
      function handleClickOutside(event) {
        if (exportMenuOpen && !event.target.closest('.export-dropdown')) {
          setExportMenuOpen(false);
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [exportMenuOpen]);



  // State for alerts
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch all withdrawals and banks on component mount
  useEffect(() => {
    fetchWithdrawals();
    fetchBanks();
  }, []);

  // Apply filters and search when withdrawals or filter criteria change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [withdrawals, filters, searchTerm]);

  // Update paginated withdrawals when filtered withdrawals or pagination settings change
  useEffect(() => {
    paginateWithdrawals();
  }, [filteredWithdrawals, currentPage, itemsPerPage]);


  const paginateWithdrawals = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setPaginatedWithdrawals(filteredWithdrawals.slice(indexOfFirstItem, indexOfLastItem));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };


  // Function to fetch all withdrawals
  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/withdraw/all`);
      // console.log("response from withdraw : ", response.data.data);
      setWithdrawals(response.data.data || []);
      setFilteredWithdrawals(response.data.data || []);
    } catch (error) {
      showAlert('Failed to fetch withdrawals', 'error');
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all banks
  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/bank/all`);
      setBanks(response.data.data || []);
      
      // Set default bank if available
      if (response.data.data && response.data.data.length > 0 && !formData.bankId) {
        setFormData(prev => ({
          ...prev,
          bankId: response.data.data[0]._id
        }));
      }
    } catch (error) {
      showAlert('Failed to fetch banks', 'error');
      console.error('Error fetching banks:', error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? Number(value) : value
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      bankId: '',
      transactionType: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
    });
    setSearchTerm('');
  };

  // Apply filters and search
  const applyFiltersAndSearch = () => {
    let result = [...withdrawals];

    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.personName && item.personName.toLowerCase().includes(searchLower)) ||
        (item.voucherNumber && item.voucherNumber.toLowerCase().includes(searchLower)) ||
        (item.description && item.description.toLowerCase().includes(searchLower)) 
        
      );
    }

    // Apply bank filter
    if (filters.bankId) {
      result = result.filter(item => {
        const itemBankId = item.bankId?._id || item.bankId;
        return itemBankId === filters.bankId;
      });
    }

    // Apply transaction type filter
    if (filters.transactionType) {
      result = result.filter(item => 
        item.transactionType && item.transactionType.startsWith(filters.transactionType)
      );
    }

    // Apply date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter(item => new Date(item.date) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(item => new Date(item.date) <= toDate);
    }

    // Apply amount range filter
    if (filters.amountMin) {
      result = result.filter(item => item.amount >= Number(filters.amountMin));
    }

    if (filters.amountMax) {
      result = result.filter(item => item.amount <= Number(filters.amountMax));
    }

    setFilteredWithdrawals(result);
  };

  // Handle transaction type change
  const handleMainTypeChange = (e) => {
    const type = e.target.value;
    setMainType(type);
    setSubType('');
    
    // Reset the transaction type in form data
    setFormData({
      ...formData,
      transactionType: ''
    });
  };

  // Handle sub type change
  const handleSubTypeChange = (e) => {
    const subTypeValue = e.target.value;
    setSubType(subTypeValue);
    
    // Combine main type and subtype for the full transaction type
    const fullType = mainType === 'cheque' 
      ? `cheque_${subTypeValue}` 
      : `transfer_${subTypeValue}`;
    
    setFormData({
      ...formData,
      transactionType: fullType
    });
  };

  // Open dialog for adding new withdrawal
  const handleAddNew = () => {
    setFormData({
      transactionType: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      personName: '',
      voucherNumber: '',
      description: '',
      bankId: banks.length > 0 ? banks[0]._id : ''
    });
    setMainType('');
    setSubType('');
    setIsEdit(false);
    setOpen(true);
  };

  // Open dialog for editing withdrawal
  const handleEdit = (withdrawal) => {
    // Parse the transaction type to set main type and subtype
    let mainTypeValue = '';
    let subTypeValue = '';
    
    if (withdrawal.transactionType.startsWith('cheque_')) {
      mainTypeValue = 'cheque';
      subTypeValue = withdrawal.transactionType.replace('cheque_', '');
    } else if (withdrawal.transactionType.startsWith('transfer_')) {
      mainTypeValue = 'transfer';
      subTypeValue = withdrawal.transactionType.replace('transfer_', '');
    }
    
    setMainType(mainTypeValue);
    setSubType(subTypeValue);
    
    setFormData({
      transactionType: withdrawal.transactionType,
      date: new Date(withdrawal.date).toISOString().split('T')[0],
      amount: withdrawal.amount,
      personName: withdrawal.personName,
      voucherNumber: withdrawal.voucherNumber,
      description: withdrawal.description,
      bankId: withdrawal.bankId
    });
    setCurrentId(withdrawal._id);
    setIsEdit(true);
    setOpen(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!formData.transactionType || !formData.date || !formData.amount || 
        !formData.personName || !formData.voucherNumber || !formData.description || !formData.bankId) {
      showAlert('Please fill all required fields', 'error');
      return;
    }
    
    try {
      if (isEdit) {
       const response =  await axios.put(`${backendDomainA}/api/v1/withdraw/update/${currentId}`, formData);
       if(response.success){
         showAlert(response.data.message,'success');
       }else{
        showAlert(response.data.message,'error');
       }
      } else {
      const response =  await axios.post(`${backendDomainA}/api/v1/withdraw/create`, formData);
      if(response.success){
        showAlert(response.data.message,'success');
      }else{
        showAlert(response.data.message,'error');}
      }
      setOpen(false);
      fetchWithdrawals();
    } catch (error) {
      showAlert(error.response?.data?.message || 'Operation failed', 'error');
      console.error('Error submitting form:', error);
    }
  };

  // Handle withdrawal deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this withdrawal?')) {
      try {
        await axios.delete(`${backendDomainA}/api/v1/withdraw/delete/${id}`);
        showAlert('Withdrawal deleted successfully', 'success');
        fetchWithdrawals();
      } catch (error) {
        showAlert('Failed to delete withdrawal', 'error');
        console.error('Error deleting withdrawal:', error);
      }
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    console.log("Exporting to Excel...");
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    
    // Prepare data for export
    const exportData = filteredWithdrawals.map(item => ({
      'Date': new Date(item.date).toLocaleDateString(),
      'Bank': getBankName(item.bankId?._id || item.bankId),
      'Transaction Type': formatTransactionType(item.transactionType),
      'Person Name': item.personName,
      'Voucher Number': item.voucherNumber,
      'Amount': item.amount,
      'Description': item.description
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = { Sheets: { 'Withdrawals': ws }, SheetNames: ['Withdrawals'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    
    // Create download link
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Withdrawals_${new Date().toISOString().split('T')[0]}${fileExtension}`;
    link.click();
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Withdrawals Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Prepare table data
    const tableColumn = ["Date", "Bank", "Transaction Type", "Person", "Voucher No.", "Amount", "Description"];
    const tableRows = [];
    
    filteredWithdrawals.forEach(item => {
      const rowData = [
        new Date(item.date).toLocaleDateString(),
        getBankName(item.bankId?._id || item.bankId),
        formatTransactionType(item.transactionType),
        item.personName,
        item.voucherNumber,
        `${item.amount.toLocaleString()}`,
        item.description.length > 20 ? item.description.substring(0, 20) + '...' : item.description
      ];
      tableRows.push(rowData);
    });
    
    // Generate PDF table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [220, 53, 69], textColor: 255 },
      margin: { top: 40 },
      styles: { overflow: 'linebreak' },
      columnStyles: { 
        6: { cellWidth: 40 } // Description column wider
      }
    });
    
    // Save PDF
    doc.save(`Withdrawals_Report_${new Date().toISOString().split('T')[0]}.pdf`);
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

  // Format transaction type for display
  const formatTransactionType = (type) => {
    if (!type) return 'N/A';
    
    if (type.startsWith('cheque_')) {
      const subType = type.replace('cheque_', '');
      return `Cheque (${subType === 'self' ? 'Self' : 'Other'})`;
    } else if (type.startsWith('transfer_')) {
      const subType = type.replace('transfer_', '');
      return `Transfer (${subType.toUpperCase()})`;
    }
    
    return type;
  };

  // Find bank name by ID
  const getBankName = (bankId) => {
    const bank = banks.find(b => b._id === bankId);
    return bank ? bank.bankName : 'Unknown Bank';
  };

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

      {/* Modern Page Header */}
      <div className="mb-8 bg-gradient-to-r from-red-600 to-pink-700 rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white p-3 rounded-lg shadow-md mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Withdrawals Management</h1>
              <p className="text-red-100 mt-1">Manage all your bank withdrawals in one place</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              className="flex items-center  px-4 py-2 cursor-pointer bg-white text-red-600 rounded-lg shadow-md hover:bg-red-50 transition-colors"
              onClick={handleAddNew}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Withdrawal
            </button>
            <button 
              className="flex items-center cursor-pointer px-4 py-2 bg-red-800 bg-opacity-30 text-white border border-red-300 border-opacity-30 rounded-lg hover:bg-opacity-40 transition-colors"
              onClick={fetchWithdrawals}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by person name, voucher number, or description..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          {/* for download in pdf or exel  */}
          <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              {/* Replace the dropdown with direct buttons */}
              <div className="relative">
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="flex items-center cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {exportMenuOpen && (
                  <div className="export-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={exportToExcel}
                      className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-t-md"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export to Excel
                      </div>
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-b-md"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Export to PDF
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
        
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bankId" className="block text-sm font-medium text-gray-700 mb-1">
                  Bank
                </label>
                <select
                  id="bankId"
                  name="bankId"
                  value={filters.bankId}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">All Banks</option>
                  {banks.map(bank => (
                    <option key={bank._id} value={bank._id}>
                      {bank.bankName} - {bank.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  id="transactionType"
                  name="transactionType"
                  value={filters.transactionType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">All Types</option>
                  <option value="cheque">Cheque</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <input
                    type="date"
                    id="dateFrom"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                    Date To
                  </label>
                  <input
                    type="date"
                    id="dateTo"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="amountMin" className="block text-sm font-medium text-gray-700 mb-1">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    id="amountMin"
                    name="amountMin"
                    value={filters.amountMin}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="amountMax" className="block text-sm font-medium text-gray-700 mb-1">
                      Max Amount
                    </label>
                    <input
                      type="number"
                      id="amountMax"
                      name="amountMax"
                      value={filters.amountMax}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end md:col-span-3 mt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 cursor-pointer py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mr-2"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
  
        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : filteredWithdrawals.length === 0 ? (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mt-4">No withdrawals found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
              <button
                onClick={handleAddNew}
                className="mt-4 cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add Your First Withdrawal
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Person Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voucher Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
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
                  {paginatedWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(withdrawal.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {getBankName(withdrawal.bankId?._id || withdrawal.bankId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          withdrawal.transactionType?.startsWith('cheque') 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {formatTransactionType(withdrawal.transactionType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {withdrawal.personName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {withdrawal.voucherNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{withdrawal.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {withdrawal.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(withdrawal)}
                          className="text-indigo-600 cursor-pointer hover:text-indigo-900 mr-3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(withdrawal._id)}
                          className="text-red-600 cursor-pointer hover:text-red-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}

{paginatedWithdrawals.length > 0 && (
                    <>
                      {/* Page Summary */}
                      <tr className="bg-gray-100 font-medium">
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          <strong>Page Total:</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹{paginatedWithdrawals.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                        </td>
                        <td colSpan="2"></td>
                      </tr>
                      
                      {/* Grand Total */}
                      <tr className="bg-red-50 font-medium">
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-red-900 text-right">
                          <strong>Grand Total ({filteredWithdrawals.length} withdrawals):</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-900">
                          ₹{filteredWithdrawals.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                        </td>
                        <td colSpan="2"></td>
                      </tr>
                    </>
                  )}


                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* for pagination  */}
        {filteredWithdrawals.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredWithdrawals.length / itemsPerPage)}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === Math.ceil(filteredWithdrawals.length / itemsPerPage)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredWithdrawals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredWithdrawals.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredWithdrawals.length}</span> results
                </p>
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">Items per page:</label>
                  <select
                    id="itemsPerPage"
                    name="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, Math.ceil(filteredWithdrawals.length / itemsPerPage)) }, (_, i) => {
                    // Logic to show pages around current page
                    let pageNum;
                    const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);
                    
                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // If near the start
                      pageNum = i + 1;
                      if (i === 4) pageNum = totalPages;
                    } else if (currentPage >= totalPages - 2) {
                      // If near the end
                      pageNum = totalPages - 4 + i;
                    } else {
                      // In the middle
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-red-50 border-red-500 text-red-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredWithdrawals.length / itemsPerPage)}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      currentPage === Math.ceil(filteredWithdrawals.length / itemsPerPage)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
  
        {/* Add/Edit Modal */}
        {open && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-2xl">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <div className="flex items-center">
                    <div className="bg-red-100 rounded-full p-2 mr-3">
                      {isEdit ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {isEdit ? 'Edit Withdrawal' : 'Add New Withdrawal'}
                    </h2>
                  </div>
                  <button 
                    className="text-gray-500  hover:text-gray-700 cursor-pointer focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bank Selection */}
                    <div className="mb-4">
                      <label htmlFor="bankId" className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Account*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <select
                          id="bankId"
                          name="bankId"
                          value={formData.bankId}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        >
                          <option value="">Select Bank Account</option>
                          {banks.map(bank => (
                            <option key={bank._id} value={bank._id}>
                              {bank.bankName} - {bank.accountNumber}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
  
                    {/* Date */}
                    <div className="mb-4">
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          id="date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
  
                    {/* Transaction Type - Main Type */}
                    <div className="mb-4">
                      <label htmlFor="mainType" className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Type*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <select
                          id="mainType"
                          name="mainType"
                          value={mainType}
                          onChange={handleMainTypeChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        >
                          <option value="">Select Transaction Type</option>
                          <option value="cheque">Cheque</option>
                          <option value="transfer">Transfer</option>
                        </select>
                      </div>
                    </div>
  
                    {/* Transaction Sub Type */}
                    {mainType && (
                      <div className="mb-4">
                        <label htmlFor="subType" className="block text-sm font-medium text-gray-700 mb-1">
                          {mainType === 'cheque' ? 'Cheque Type*' : 'Transfer Type*'}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                          <select
                            id="subType"
                            name="subType"
                            value={subType}
                            onChange={handleSubTypeChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            required
                          >
                            <option value="">Select {mainType === 'cheque' ? 'Cheque' : 'Transfer'} Type</option>
                            {mainType === 'cheque' ? (
                              <>
                                <option value="self">Self Cheque</option>
                                <option value="other">Other Cheque</option>
                              </>
                            ) : (
                              <>
                                <option value="neft">NEFT</option>
                                <option value="imps">IMPS</option>
                                <option value="rtgs">RTGS</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                    )}
  
                    {/* Amount */}
                    <div className="mb-4">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.amount}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
  
                    {/* Person Name */}
                    <div className="mb-4">
                      <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-1">
                        Person Name*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          id="personName"
                          name="personName"
                          type="text"
                          value={formData.personName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
  
                    {/* Voucher Number */}
                    <div className="mb-4">
                      <label htmlFor="voucherNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Voucher Number*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        </div>
                        <input
                          id="voucherNumber"
                          name="voucherNumber"
                          type="text"
                          value={formData.voucherNumber}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
  
                    {/* Description */}
                    <div className="mb-4 md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description*
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                        </div>
                        <textarea
                          id="description"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      onClick={handleSubmit}
                    >
                      {isEdit ? 'Update Withdrawal' : 'Add Withdrawal'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default WithdrawPage;