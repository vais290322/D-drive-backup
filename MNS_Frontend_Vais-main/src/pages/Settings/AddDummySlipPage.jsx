import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendDomainA } from "../../common/index";
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaFilePdf, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AddDummySlipPage = () => {
  // State for dummy slips data
  const [dummySlips, setDummySlips] = useState([]);
  const [filteredSlips, setFilteredSlips] = useState([]);
  const [paginatedSlips, setPaginatedSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
    bankId: '',
    minAmount: '',
    maxAmount: '',
    voucherNumber: '',
    invoiceNumber: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // State for modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSlip, setCurrentSlip] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    date: new Date().toISOString().split('T')[0],
    voucherNumber: '',
    customerName: '',
    amount: '',
    bankId: '',
    invoiceNumber: ''
  });
  
  // State for banks (for dropdown)
  const [banks, setBanks] = useState([]);
//   console.log("bnaks : ",banks)
  
  // State for alerts
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch dummy slips data on component mount
  useEffect(() => {
    fetchDummySlips();
    fetchBanks();
  }, []);

  // Apply filters and search when they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [dummySlips, searchTerm, filters]);

  // Update paginated slips when filtered slips or pagination settings change
  useEffect(() => {
    paginateSlips();
  }, [filteredSlips, currentPage, itemsPerPage]);

  // Calculate total pages when total items or items per page changes
  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Fetch all dummy slips from the API
  const fetchDummySlips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/dummy-slip/all`);
      // Ensure dummySlips is always an array
      const slipsData = Array.isArray(response.data?.data) ? response?.data?.data : [];
      setDummySlips(slipsData);
      setFilteredSlips(slipsData);
      setTotalItems(slipsData.length);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dummy slips');
      setDummySlips([]);
      setFilteredSlips([]);
      setTotalItems(0);
      setLoading(false);
    }
  };

  // Fetch all banks for dropdown
  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/bank/all`);
    //   console.log('Banks:', response.data);
      setBanks(Array.isArray(response?.data?.data) ? response.data?.data : []);
    } catch (err) {
      console.error('Failed to fetch banks:', err);
    }
  };

  // Apply filters and search to the dummy slips data
  const applyFiltersAndSearch = () => {
    // Ensure dummySlips is an array before trying to filter
    if (!Array.isArray(dummySlips)) {
      setFilteredSlips([]);
      setTotalItems(0);
      return;
    }
    
    let filtered = [...dummySlips];
    
    // Apply search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(slip => 
        slip.companyName?.toLowerCase().includes(search) ||
        slip.customerName?.toLowerCase().includes(search) ||
        slip.voucherNumber?.toLowerCase().includes(search) ||
        slip.invoiceNumber?.toLowerCase().includes(search)
      );
    }
    
    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(slip => new Date(slip.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(slip => new Date(slip.date) <= new Date(filters.endDate));
    }
    
    // Apply customer name filter
    if (filters.customerName) {
      filtered = filtered.filter(slip => 
        slip.customerName.toLowerCase().includes(filters.customerName.toLowerCase())
      );
    }
    
    // console.log("filtered : ",filtered)
    // Apply bank filter
    if (filters.bankId) {
      filtered = filtered.filter(slip => slip.bankId._id === filters.bankId);
    }
    
    // Apply amount filters
    if (filters.minAmount) {
      filtered = filtered.filter(slip => slip.amount >= parseFloat(filters.minAmount));
    }
    
    if (filters.maxAmount) {
      filtered = filtered.filter(slip => slip.amount <= parseFloat(filters.maxAmount));
    }
    
    // Apply voucher number filter
    if (filters.voucherNumber) {
      filtered = filtered.filter(slip => 
        slip.voucherNumber.toLowerCase().includes(filters.voucherNumber.toLowerCase())
      );
    }
    
    // Apply invoice number filter
    if (filters.invoiceNumber) {
      filtered = filtered.filter(slip => 
        slip.invoiceNumber?.toLowerCase().includes(filters.invoiceNumber.toLowerCase())
      );
    }
    
    setFilteredSlips(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Paginate the filtered slips
  const paginateSlips = () => {
    if (!Array.isArray(filteredSlips)) {
      setPaginatedSlips([]);
      return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedSlips(filteredSlips.slice(startIndex, endIndex));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      customerName: '',
      bankId: '',
      minAmount: '',
      maxAmount: '',
      voucherNumber: '',
      invoiceNumber: ''
    });
    setSearchTerm('');
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      companyName: '',
      companyAddress: '',
      date: new Date().toISOString().split('T')[0],
      voucherNumber: '',
      customerName: '',
      amount: '',
      bankId: '',
      invoiceNumber: ''
    });
  };

  // Open edit modal with slip data
  const openEditModal = (slip) => {
    setCurrentSlip(slip);
    setFormData({
      companyName: slip.companyName,
      companyAddress: slip.companyAddress,
      date: new Date(slip.date).toISOString().split('T')[0],
      voucherNumber: slip.voucherNumber,
      customerName: slip.customerName,
      amount: slip.amount,
      bankId: slip.bankId,
      invoiceNumber: slip.invoiceNumber || ''
    });
    setEditModalOpen(true);
  };

  // Handle add dummy slip form submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendDomainA}/api/v1/dummy-slip/create`, formData);
      setAddModalOpen(false);
      resetForm();
      fetchDummySlips();
      setAlert({
        open: true,
        message: 'Dummy slip added successfully',
        severity: 'success'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || 'Failed to add dummy slip',
        severity: 'error'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    }
  };

  // Handle edit dummy slip form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendDomainA}/api/v1/dummy-slip/update/${currentSlip._id}`, formData);
      setEditModalOpen(false);
      resetForm();
      fetchDummySlips();
      setAlert({
        open: true,
        message: 'Dummy slip updated successfully',
        severity: 'success'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || 'Failed to update dummy slip',
        severity: 'error'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    }
  };

  // Handle delete dummy slip
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dummy slip?')) {
      try {
        await axios.delete(`${backendDomainA}/api/v1/dummy-slip/delete/${id}`);
        fetchDummySlips();
        setAlert({
          open: true,
          message: 'Dummy slip deleted successfully',
          severity: 'success'
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      } catch (err) {
        setAlert({
          open: true,
          message: err.response?.data?.message || 'Failed to delete dummy slip',
          severity: 'error'
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      }
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Dummy Slips Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`, 14, 30);
    
    // Define the columns for the table
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Company', dataKey: 'companyName' },
      { header: 'Voucher #', dataKey: 'voucherNumber' },
      { header: 'Customer', dataKey: 'customerName' },
      { header: 'Invoice #', dataKey: 'invoiceNumber' },
      { header: 'Amount', dataKey: 'amount' }
    ];
    
    // Ensure filteredSlips is an array before mapping
    const slipsToExport = Array.isArray(filteredSlips) ? filteredSlips : [];
    
    // Prepare the data
    const data = slipsToExport.map(slip => ({
      date: formatDate(slip.date),
      companyName: slip.companyName,
      voucherNumber: slip.voucherNumber,
      customerName: slip.customerName,
      invoiceNumber: slip.invoiceNumber || '-',
      amount: `₹${slip.amount.toLocaleString()}`
    }));
    
    // Generate the table
    doc.autoTable({
      head: [columns.map(column => column.header)],
      body: data.map(item => columns.map(column => item[column.dataKey])),
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Save the PDF
    doc.save('dummy-slips-report.pdf');
  };

  // Get bank name by ID
  const getBankName = (bankId) => {
    const bank = banks.find(bank => bank._id === bankId);
    return bank ? bank.name : 'Unknown Bank';
  };

  const generateSlipPDF = (slip) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });
    
    // Get bank details
    const bank = banks.find(b => b._id === slip.bankId) || { name: 'N/A', branch: 'N/A' };
    // console.log("bank : ",slip)
    // Add white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 148, 210, 'F');
    
    // Add header with company name (dark background)
    doc.setFillColor(51, 51, 51);
    doc.rect(0, 0, 148, 20, 'F');
    
    // Company name in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(slip.companyName.toUpperCase(), 74, 12, { align: 'center' });
    
    // Company address
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(slip.companyAddress, 74, 25, { align: 'center' });
    
    // Add title bar
    doc.setFillColor(220, 220, 220);
    doc.rect(0, 35, 148, 10, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('PAYMENT RECEIPT', 74, 42, { align: 'center' });
    
    // Add content area with subtle border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(10, 50, 128, 110, 3, 3, 'S');
    
    // Add receipt details with modern layout
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    
    // Left column labels
    const leftX = 20;
    doc.text('Receipt No:', leftX, 60);
    doc.text('Date:', leftX, 70);
    doc.text('Customer Name:', leftX, 80);
    doc.text('Amount:', leftX, 90);
    
    // Right column labels
    const rightX = 85;
    doc.text('Bank:', rightX, 60);
    doc.text('Branch:', rightX, 70);
    doc.text('Invoice Number:', rightX, 80);
    
    // Left column values
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(slip.voucherNumber, leftX, 65);
    doc.text(formatDate(slip.date), leftX, 75);
    doc.text(slip.customerName, leftX, 85);
    
    // Format amount with proper spacing
    const amountStr = ` ${parseFloat(slip.amount).toLocaleString('en-IN')}`;
    doc.text(amountStr, leftX, 95);
    
    // Right column values
    doc.text(slip?.bankId?.bankName || 'N/A', rightX, 65);
    doc.text(slip?.bankId?.branch || 'N/A', rightX, 75);
    doc.text(slip.invoiceNumber || 'N/A', rightX, 85);
    
    // Add horizontal separator line
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 105, 128, 105);
    
    // Amount in words section
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Amount in words:', 20, 115);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    // Format the amount in words with proper wrapping
    const wordsText = numberToWords(slip.amount);
    const splitWords = doc.splitTextToSize(wordsText, 100);
    doc.text(splitWords, 20, 120);
    
    // Add signature section with modern styling
    doc.setDrawColor(150, 150, 150);
    doc.setLineDashPattern([1, 1], 0);
    
    // Signature lines
    doc.line(20, 145, 60, 145);
    doc.line(88, 145, 128, 145);
    
    // Signature labels
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Authorized Signature', 40, 150, { align: 'center' });
    doc.text('Receiver\'s Signature', 108, 150, { align: 'center' });
    
    // Add footer with subtle styling
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 170, 148, 15, 'F');
    
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text('This is a computer generated receipt and does not require a physical signature.', 74, 178, { align: 'center' });
    
    // Save the PDF with the slip's voucher number
    doc.save(`payment_receipt_${slip.voucherNumber}.pdf`);
  };
  
  // Convert number to words for the receipt
  const numberToWords = (num) => {
    const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const formatTens = (num) => {
      if (num < 10) return single[num];
      else if (num < 20) return double[num - 10];
      else {
        return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + single[num % 10] : '');
      }
    };
    
    if (num === 0) return 'Zero Rupees Only';
    
    let words = '';
    
    // Handle crores
    if (Math.floor(num / 10000000) > 0) {
      words += numberToWords(Math.floor(num / 10000000)) + ' Crore ';
      num %= 10000000;
    }
    
    // Handle lakhs
    if (Math.floor(num / 100000) > 0) {
      words += numberToWords(Math.floor(num / 100000)) + ' Lakh ';
      num %= 100000;
    }
    
    // Handle thousands
    if (Math.floor(num / 1000) > 0) {
      words += numberToWords(Math.floor(num / 1000)) + ' Thousand ';
      num %= 1000;
    }
    
    // Handle hundreds
    if (Math.floor(num / 100) > 0) {
      words += numberToWords(Math.floor(num / 100)) + ' Hundred ';
      num %= 100;
    }
    
    if (num > 0) {
      if (words !== '') words += 'and ';
      words += formatTens(num);
    }
    
    return words + ' Rupees Only';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Alert */}
      {alert.open && (
        <div className={`mb-4 p-4 rounded-lg ${
          alert.severity === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {alert.message}
        </div>
      )}
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dummy Slips Management</h1>
        <p className="text-gray-600">Add, edit, and manage dummy slips for your business</p>
      </div>
      
      {/* Actions Bar */}
      <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Dummy Slip
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={exportToPDF}
                  className="flex cursor-pointer items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaFilePdf className="mr-2" />
                  PDF
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search slips..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FaFilter className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={filters.customerName}
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
                      <option key={bank._id} value={bank._id}>{bank.bankName}</option>
                    ))}
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
                  <label htmlFor="voucherNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Voucher Number
                  </label>
                  <input
                    type="text"
                    id="voucherNumber"
                    name="voucherNumber"
                    value={filters.voucherNumber}
                    onChange={handleFilterChange}
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
                    value={filters.invoiceNumber}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4  py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dummy Slips Table */}
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
              onClick={fetchDummySlips}
              className="mt-4  px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : paginatedSlips.length === 0 ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">No Dummy Slips Found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || Object.values(filters).some(val => val !== '') 
                ? 'Try adjusting your search or filters' 
                : 'Add your first dummy slip to get started'}
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Add New Dummy Slip
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
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voucher #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSlips.map((slip) => (
                    <tr key={slip._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(slip.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {slip.companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {slip.voucherNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {slip.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {slip?.bankId?.bankName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {slip.invoiceNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{slip.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => generateSlipPDF(slip)}
                            className="text-red-600 cursor-pointer hover:text-red-900 focus:outline-none"
                            title="Generate PDF"
                          >
                            <FaFilePdf className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => openEditModal(slip)}
                            className="text-indigo-600 cursor-pointer hover:text-indigo-900 focus:outline-none"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(slip._id)}
                            className="text-red-600 cursor-pointer hover:text-red-900 focus:outline-none"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-700 mr-4">
                  Showing {paginatedSlips.length} of {totalItems} entries
                </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
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
                          className={`relative cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            currentPage === page + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white text-gray-500 hover:bg-gray-50'
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
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
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

      {/* Add Dummy Slip Modal */}
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Dummy Slip</h3>
                    <form onSubmit={handleAddSubmit}>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                            Company Address
                          </label>
                          <textarea
                            id="companyAddress"
                            name="companyAddress"
                            value={formData.companyAddress}
                            onChange={handleInputChange}
                            required
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
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
                          <label htmlFor="voucherNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Voucher Number
                          </label>
                          <input
                            type="text"
                            id="voucherNumber"
                            name="voucherNumber"
                            value={formData.voucherNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Name
                          </label>
                          <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
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
                          <label htmlFor="bankId" className="block text-sm font-medium text-gray-700 mb-1">
                            Bank
                          </label>
                          <select
                            id="bankId"
                            name="bankId"
                            value={formData.bankId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Bank</option>
                            {banks.map(bank => (
                              <option key={bank._id} value={bank._id}>{bank.bankName}</option>
                            ))}
                          </select>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Add Dummy Slip
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddModalOpen(false);
                            resetForm();
                          }}
                          className="mt-3 cursor-pointer w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
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

      {/* Edit Dummy Slip Modal */}
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Dummy Slip</h3>
                    <form onSubmit={handleEditSubmit}>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="edit-companyName" className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            id="edit-companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                            Company Address
                          </label>
                          <textarea
                            id="edit-companyAddress"
                            name="companyAddress"
                            value={formData.companyAddress}
                            onChange={handleInputChange}
                            required
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
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
                          <label htmlFor="edit-voucherNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Voucher Number
                          </label>
                          <input
                            type="text"
                            id="edit-voucherNumber"
                            name="voucherNumber"
                            value={formData.voucherNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-customerName" className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Name
                          </label>
                          <input
                            type="text"
                            id="edit-customerName"
                            name="customerName"
                            value={formData.customerName}
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
                          <label htmlFor="edit-bankId" className="block text-sm font-medium text-gray-700 mb-1">
                            Bank
                          </label>
                          <select
                            id="edit-bankId"
                            name="bankId"
                            value={formData.bankId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Bank</option>
                            {banks.map(bank => (
                              <option key={bank._id} value={bank._id}>{bank.bankName}</option>
                            ))}
                          </select>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Update Dummy Slip
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditModalOpen(false);
                            resetForm();
                          }}
                          className="mt-3 cursor-pointer w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
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

export default AddDummySlipPage;
                  