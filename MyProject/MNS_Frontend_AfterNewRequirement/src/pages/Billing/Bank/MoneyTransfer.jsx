import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendDomainA } from '../../../common/index';
import { format } from 'date-fns';
import { FaExchangeAlt, FaSearch, FaFilter, FaFilePdf, FaEye, FaCalendarAlt } from 'react-icons/fa';
import { BiTransfer } from 'react-icons/bi';
import { BsBank2 } from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToWords } from 'to-words';

const MoneyTransfer = () => {
  // State for money transfers data
  const [transfers, setTransfers] = useState([]);
  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [paginatedTransfers, setPaginatedTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toWords = new ToWords();
  
  // State for banks
  const [banks, setBanks] = useState([]);

  // console.log("bnaks : ", banks);


  
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
    fromBankId: '',
    toBankId: '',
    minAmount: '',
    maxAmount: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // State for transfer form
  const [transferForm, setTransferForm] = useState({
    date: new Date().toISOString().split('T')[0],
    transferFromBankId: '',
    transferToBankId: '',
    transferAmount: '',
    transferNote: '',
    transferBy: '',
  });
  
  // State for modals
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentTransfer, setCurrentTransfer] = useState(null);
  
  // State for alerts
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchTransfers();
    fetchBanks();
  }, []);

  // Apply filters and search when they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [transfers, searchTerm, filters]);

  // Update paginated transfers when filtered transfers or pagination settings change
  useEffect(() => {
    paginateTransfers();
  }, [filteredTransfers, currentPage, itemsPerPage]);

  // Calculate total pages when total items or items per page changes
  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Fetch all money transfers
  const fetchTransfers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendDomainA}/api/money-transfers`);
      const transfersData = Array.isArray(response.data.data) ? response.data.data : [];
     if(response.data?.success){
        setTransfers(transfersData);
        setFilteredTransfers(transfersData);
        setTotalItems(transfersData.length);
        setLoading(false);
     }else{
      setError(response.data?.message || 'Failed to fetch money transfers');
      setTransfers([]);
      setFilteredTransfers([]);
      setTotalItems(0);
     }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch money transfers');
      setTransfers([]);
      setFilteredTransfers([]);
      setTotalItems(0);
      setLoading(false);
    }
  };

  // Fetch all banks
  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/bank/all`);
      setBanks(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      console.error('Failed to fetch banks:', err);
    }
  };

  // Apply filters and search
  const applyFiltersAndSearch = () => {
    if (!Array.isArray(transfers)) {
      setFilteredTransfers([]);
      setTotalItems(0);
      return;
    }
    
    let filtered = [...transfers];
    
    // Apply search term (search in notes and transferBy)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(transfer => 
        transfer.transferNote?.toLowerCase().includes(search) ||
        transfer.transferBy?.toLowerCase().includes(search)
      );
    }
    
    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(transfer => new Date(transfer.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(transfer => new Date(transfer.date) <= new Date(filters.endDate));
    }
    
    // Apply bank filters
    if (filters.fromBankId) {
      filtered = filtered.filter(transfer => transfer.transferFromBankId === filters.fromBankId);
    }
    
    if (filters.toBankId) {
      filtered = filtered.filter(transfer => transfer.transferToBankId === filters.toBankId);
    }
    
    // Apply amount filters
    if (filters.minAmount) {
      filtered = filtered.filter(transfer => transfer.transferAmount >= parseFloat(filters.minAmount));
    }
    
    if (filters.maxAmount) {
      filtered = filtered.filter(transfer => transfer.transferAmount <= parseFloat(filters.maxAmount));
    }
    
    setFilteredTransfers(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Paginate the filtered transfers
  const paginateTransfers = () => {
    if (!Array.isArray(filteredTransfers)) {
      setPaginatedTransfers([]);
      return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedTransfers(filteredTransfers.slice(startIndex, endIndex));
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
      fromBankId: '',
      toBankId: '',
      minAmount: '',
      maxAmount: '',
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

  // Handle transfer form input change
  const handleTransferFormChange = (e) => {
    const { name, value } = e.target;
    setTransferForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset transfer form
  const resetTransferForm = () => {
    setTransferForm({
      date: new Date().toISOString().split('T')[0],
      transferFromBankId: '',
      transferToBankId: '',
      transferAmount: '',
      transferNote: '',
      transferBy: '',
    });
  };

  // Handle transfer form submission
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that source and destination banks are different
    if (transferForm.transferFromBankId === transferForm.transferToBankId) {
      setAlert({
        open: true,
        message: 'Source and destination banks cannot be the same',
        severity: 'error'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      return;
    }
    
    try {
    const response =  await axios.post(`${backendDomainA}/api/money-transfers`, transferForm);
      if(response.data?.success){
        setTransferModalOpen(false);
        resetTransferForm();
        fetchTransfers();
        setAlert({
          open: true,
          message: response?.data.message ||  'Money transfer created successfully',
          severity: 'success'
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000); 
      }else{
        setAlert({
          open: true,
          message: response?.data.message || 'Failed to create money transfer',
          severity: 'error'
        });
      }
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || 'Failed to create money transfer',
        severity: 'error'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    }
  };

  // Open view modal with transfer data
  const openViewModal = (transfer) => {
    setCurrentTransfer(transfer);
    setViewModalOpen(true);
  };

  // Get bank name by ID
  const getBankName = (bankId) => {
    const bank = banks.find(bank => bank._id === bankId);
    return bank ? bank.name : 'Unknown Bank';
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

  // Generate PDF for a single transfer
  const generateTransferPDF = (transfer) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });
    
    // Get bank details
    const fromBank = banks.find(b => b._id === transfer.transferFromBankId._id) || { bankName: 'N/A', branch: 'N/A' };
    // console.log("from bank" , fromBank);
    const toBank = banks.find(b => b._id === transfer.transferToBankId._id) || { bankName: 'N/A', branch: 'N/A' };
    
    // Add white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 148, 210, 'F');
    
    // Add header with gradient-like effect
    doc.setFillColor(0, 83, 156);
    doc.rect(0, 0, 148, 20, 'F');
    
    // Add title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BANK TRANSFER SLIP', 74, 12, { align: 'center' });
    
    // Add subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Inter-Bank Money Transfer Receipt', 74, 18, { align: 'center' });
    
    // Add date section
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 25, 148, 10, 'F');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text('DATE:', 10, 32);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(formatDate(transfer.date), 22, 32);
    
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text('TRANSFER ID:', 80, 32);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(transfer._id, 104, 32);
    
    // Add main content area
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(10, 40, 128, 120, 3, 3, 'S');
    
    // Add transfer details
    doc.setFillColor(0, 83, 156);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(10, 40, 128, 10, 3, 3, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TRANSFER DETAILS', 74, 47, { align: 'center' });
    
    // From bank section
    doc.setTextColor(0, 83, 156);
    doc.setFontSize(12);
    doc.text('FROM:', 20, 60);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(fromBank.bankName, 20, 68);
    
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(fromBank.branch || 'Branch: N/A', 20, 75);
    
    // Arrow between banks
    doc.setDrawColor(0, 83, 156);
    doc.setLineWidth(1);
    doc.line(60, 67, 88, 67);
    
    // Arrow head
    doc.setFillColor(0, 83, 156);
    doc.triangle(88, 67, 84, 65, 84, 69, 'F');
    
    // To bank section
    doc.setTextColor(0, 83, 156);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TO:', 100, 60);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(toBank.bankName, 100, 68);
    
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(toBank.branch || 'Branch: N/A', 100, 75);
    
    // Amount section
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 85, 108, 25, 'F');
    
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text('AMOUNT:', 25, 95);
    
    // Format amount with proper spacing
    const amountStr = ` ${parseFloat(transfer.transferAmount).toLocaleString('en-IN')}`;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(amountStr, 50, 95, { align: 'center' });
    
    // Amount in words
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Amount in words:', 25, 105);
    
    const wordsText = toWords.convert(transfer.transferAmount,{ currency: true, ignoreDecimal: true });
    // console.log("words text", wordsText);

    const splitWords = doc.splitTextToSize(wordsText, 100);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(splitWords, 73, 105, { align: 'center', maxWidth: 90 });
    
    // Note section
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text('TRANSFER NOTE:', 20, 120);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    const noteText = doc.splitTextToSize(transfer.transferNote, 110);
    doc.text(noteText, 20, 127);
    
    // Transferred by section
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text('TRANSFERRED BY:', 20, 145);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(transfer.transferBy, 60, 145);
    
    // Add signature section
    doc.setDrawColor(150, 150, 150);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(20, 180, 60, 180);
    doc.line(88, 180, 128, 180);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Signature', 40, 186, { align: 'center' });
    doc.text('Receiver\'s Signature', 108, 186, { align: 'center' });
    
    // Add footer
    doc.setFillColor(0, 83, 156);
    doc.rect(0, 190, 148, 15, 'F');
    
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('This is a computer generated receipt and does not require a physical signature.', 74, 200, { align: 'center' });
    
    // Save the PDF
    doc.save(`bank_transfer_${transfer._id.substring(0, 8)}.pdf`);
  };

  // Export all transfers to PDF
  const exportAllToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(0, 83, 156);
    doc.text('Bank Money Transfers Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`, 14, 30);
    
    // Define the columns for the table
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'From Bank', dataKey: 'fromBank' },
      { header: 'To Bank', dataKey: 'toBank' },
      { header: 'Amount', dataKey: 'amount' },
      { header: 'Transferred By', dataKey: 'transferBy' }
    ];
    
    // Prepare the data
    const data = filteredTransfers.map(transfer => ({
      date: formatDate(transfer.date),
      fromBank: getBankName(transfer.transferFromBankId),
      toBank: getBankName(transfer.transferToBankId),
      amount: `${transfer.transferAmount.toLocaleString()}`,
      transferBy: transfer.transferBy
    }));
    
    // Generate the table
    doc.autoTable({
      head: [columns.map(column => column.header)],
      body: data.map(item => columns.map(column => item[column.dataKey])),
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 83, 156] }
    });
    
    // Save the PDF
    doc.save('bank_transfers_report.pdf');
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
        <h1 className="text-2xl font-bold text-gray-800">Bank Money Transfers</h1>
        <p className="text-gray-600">Manage and track money transfers between banks</p>
      </div>
      
      {/* Actions Bar */}
      <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <button
                onClick={() => setTransferModalOpen(true)}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <BiTransfer className="mr-2 text-lg" />
                New Transfer
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={exportAllToPDF}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  <FaFilePdf className="mr-2" />
                  Export All
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search transfers..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
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
                  <label htmlFor="fromBankId" className="block text-sm font-medium text-gray-700 mb-1">
                    From Bank
                  </label>
                  <select
                    id="fromBankId"
                    name="fromBankId"
                    value={filters.fromBankId}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Banks</option>
                    {banks.map(bank => (
                      <option key={`from-${bank._id}`} value={bank._id}>{bank.bankName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="toBankId" className="block text-sm font-medium text-gray-700 mb-1">
                    To Bank
                  </label>
                  <select
                    id="toBankId"
                    name="toBankId"
                    value={filters.toBankId}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Banks</option>
                    {banks.map(bank => (
                      // console.log("bank", bank);
                      <option key={`to-${bank._id}`} value={bank._id}>{bank.bankName}</option>
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

      {/* Transfers Table */}
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
            <p className="mt-4 text-lg font-medium text-gray-800">{error}</p>
            <button
              onClick={fetchTransfers}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : paginatedTransfers.length === 0 ? (
          <div className="p-8 text-center">
            <BsBank2 className="h-16 w-16 mx-auto text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-800">No money transfers found</p>
            <p className="text-gray-600">Create a new transfer or adjust your filters</p>
            <button
              onClick={() => setTransferModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Create New Transfer
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
                      From Bank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To Bank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transferred By
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTransfers.map((transfer) => (
                    <tr key={transfer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(transfer.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                         {transfer?.transferFromBankId?.bankName} - {transfer?.transferFromBankId?.accountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transfer?.transferToBankId?.bankName} - {transfer?.transferToBankId?.accountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{transfer.transferAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transfer.transferBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => generateTransferPDF(transfer)}
                            className="text-red-600 hover:text-red-900 focus:outline-none cursor-pointer"
                            title="Generate PDF"
                          >
                            <FaFilePdf className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openViewModal(transfer)}
                            className="text-blue-600 hover:text-blue-900 focus:outline-none cursor-pointer"
                            title="View Details"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

 {/* Summary Rows */}
 {paginatedTransfers.length > 0 && (
                    <>
                      {/* Page Summary */}
                      <tr className="bg-gray-100 font-medium">
                        <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          <strong>Page Total:</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹{paginatedTransfers.reduce((sum, transfer) => sum + transfer.transferAmount, 0).toLocaleString()}
                        </td>
                        <td colSpan="2"></td>
                      </tr>
                      
                      {/* Grand Total */}
                      <tr className="bg-blue-50 font-medium">
                        <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 text-right">
                          <strong>Grand Total ({filteredTransfers.length} transfers):</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                          ₹{filteredTransfers.reduce((sum, transfer) => sum + transfer.transferAmount, 0).toLocaleString()}
                        </td>
                        <td colSpan="2"></td>
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
                  Showing {paginatedTransfers.length} of {totalItems} entries
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
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
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
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show current page, first and last page, and pages around current page
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there are gaps
                      const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                      const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white text-gray-500 hover:bg-gray-50 cursor-pointer'
                            }`}
                          >
                            {page}
                          </button>
                          {showEllipsisAfter && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
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
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
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
      
      {/* New Transfer Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <BiTransfer className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">New Money Transfer</h3>
                    <div className="mt-4">
                      <form onSubmit={handleTransferSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              id="date"
                              name="date"
                              value={transferForm.date}
                              onChange={handleTransferFormChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="transferFromBankId" className="block text-sm font-medium text-gray-700 mb-1">
                              From Bank
                            </label>
                            <select
                              id="transferFromBankId"
                              name="transferFromBankId"
                              value={transferForm.transferFromBankId}
                              onChange={handleTransferFormChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Source Bank</option>
                              {banks.map(bank => (
                                <option key={`from-modal-${bank._id}`} value={bank._id}>{bank?.bankName} -{bank?.accountNumber} - ₹{bank?.currentAmount}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="transferToBankId" className="block text-sm font-medium text-gray-700 mb-1">
                              To Bank
                            </label>
                            <select
                              id="transferToBankId"
                              name="transferToBankId"
                              value={transferForm.transferToBankId}
                              onChange={handleTransferFormChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Destination Bank</option>
                              {banks.map(bank => (
                                <option key={`to-modal-${bank._id}`} value={bank._id}>{bank.bankName}-{bank?.accountNumber} - ₹{bank?.currentAmount}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="transferAmount" className="block text-sm font-medium text-gray-700 mb-1">
                              Amount
                            </label>
                            <input
                              type="number"
                              id="transferAmount"
                              name="transferAmount"
                              value={transferForm.transferAmount}
                              onChange={handleTransferFormChange}
                              required
                              min="1"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="transferNote" className="block text-sm font-medium text-gray-700 mb-1">
                              Transfer Note
                            </label>
                            <textarea
                              id="transferNote"
                              name="transferNote"
                              value={transferForm.transferNote}
                              onChange={handleTransferFormChange}
                              required
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                          </div>
                          <div>
                            <label htmlFor="transferBy" className="block text-sm font-medium text-gray-700 mb-1">
                              Transferred By
                            </label>
                            <input
                              type="text"
                              id="transferBy"
                              name="transferBy"
                              value={transferForm.transferBy}
                              onChange={handleTransferFormChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={() => setTransferModalOpen(false)}
                            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm cursor-pointer"
                          >
                            Create Transfer
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Transfer Modal */}
      {viewModalOpen && currentTransfer && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaExchangeAlt className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Transfer Details</h3>
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date</p>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(currentTransfer.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Transfer ID</p>
                          <p className="text-sm font-semibold text-gray-900">{currentTransfer._id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">From Bank</p>
                          <p className="text-sm font-semibold text-gray-900">{currentTransfer.transferFromBankId?.bankName} - {currentTransfer.transferFromBankId?.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">To Bank</p>
                          <p className="text-sm font-semibold text-gray-900">{currentTransfer.transferToBankId?.bankName} - {currentTransfer.transferToBankId?.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Amount</p>
                          <p className="text-sm font-semibold text-gray-900">₹{currentTransfer.transferAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Transferred By</p>
                          <p className="text-sm font-semibold text-gray-900">{currentTransfer.transferBy}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Transfer Note</p>
                        <p className="text-sm text-gray-900 mt-1">{currentTransfer.transferNote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => generateTransferPDF(currentTransfer)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  <FaFilePdf className="mr-2" />
                  Generate PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoneyTransfer;