import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { backendDomainS } from '../../../Common/index';
import { format } from 'date-fns';
import { FaDownload, FaSearch, FaFilter, FaFilePdf, FaFileExcel, FaCalendarAlt } from 'react-icons/fa';
import { BsBank2 } from 'react-icons/bs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const SnigdhaBankStatementPage = () => {
  // State for bank selection and data
  const [selectedBankId, setSelectedBankId] = useState('');
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({})

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    transactionType: ''
  });

  // Fetch all banks on component mount
  useEffect(() => {
    fetchBanks();
  }, []);

  // Apply filters and search when they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [transactions, searchTerm, filters]);

  // Update pagination when filtered transactions change
  useEffect(() => {
    setTotalItems(filteredTransactions.length);
    setTotalPages(Math.ceil(filteredTransactions.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredTransactions, itemsPerPage]);

  // Fetch all banks
  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/bank/all`);
      if (response.data?.success) {
        setBanks(response.data.data || []);
      } else {
        toast.error('Failed to fetch banks');
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Failed to fetch banks');
    }
  };

  // Fetch bank details
  const fetchBankDetails = async (bankId) => {
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/bank/${bankId}`);
      // console.log("all transactions from snigdha bank's statement page : ", response)
      if (response.data?.success) {
        setSelectedBank(response.data.data);
      } else {
        setSelectedBank(null);
        toast.error('Failed to fetch bank details');
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      setSelectedBank(null);
      toast.error('Failed to fetch bank details');
    }
  };

  // Fetch transactions for selected bank
  const fetchTransactions = async (bankId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendDomainS}/api/v1/reports/bank-transactions/${bankId}`
      );

      // console.log("all transactions from snigdha bank statement : ", response);

      if (response?.data?.success) {
        setTransactions(response?.data?.data?.transactions || []);
        setFilteredTransactions(response?.data?.data?.transactions || []);
        setTotalItems(response?.data?.data?.transactions?.length || 0);
        setTotalPages(Math.ceil((response?.data?.data?.transactions?.length || 0) / itemsPerPage));
        setSummary(response?.data?.data?.stats || {});
      } else {
        setTransactions([]);
        setFilteredTransactions([]);
        setTotalItems(0);
        setTotalPages(0);
        toast.error('No transactions found');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
      setFilteredTransactions([]);
      setTotalItems(0);
      setTotalPages(0);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  // Handle bank selection
  const handleBankChange = (e) => {
    const bankId = e.target.value;
    setSelectedBankId(bankId);

    if (bankId) {
      fetchBankDetails(bankId);
      fetchTransactions(bankId);
    } else {
      setSelectedBank(null);
      setTransactions([]);
      setFilteredTransactions([]);
    }
  };

  // Apply filters and search
  const applyFiltersAndSearch = () => {
    if (!transactions.length) {
      setFilteredTransactions([]);
      return;
    }

    let filtered = [...transactions];

    // Apply search term (search in description)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.description?.toLowerCase().includes(search)
      );
    }

    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.date) <= new Date(filters.endDate)
      );
    }

    // Apply amount filters
    if (filters.minAmount) {
      filtered = filtered.filter(transaction =>
        transaction.amount >= parseFloat(filters.minAmount)
      );
    }

    if (filters.maxAmount) {
      filtered = filtered.filter(transaction =>
        transaction.amount <= parseFloat(filters.maxAmount)
      );
    }

    // Apply transaction type filter
    if (filters.transactionType) {
      filtered = filtered.filter(transaction =>
        transaction.type === filters.transactionType
      );
    }

    setFilteredTransactions(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      transactionType: ''
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

  const transactionsWithBalance = useMemo(() => {
    if (!selectedBank) return [];
    let running = selectedBank.openingAmount || 0;
    return filteredTransactions.map(tx => {
      const isCredit = tx.type === 'deposit' || tx.type === 'transferCredit';
      running = isCredit ? running + tx.amount : running - tx.amount;
      return {
        ...tx,
        balance: running
      };
    });
  }, [filteredTransactions, selectedBank]);

  // Get paginated transactions
  const getPaginatedTransactions = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return transactionsWithBalance.slice(start, start + itemsPerPage);
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


  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title & bank details
    doc.setFontSize(18);
    doc.setTextColor(0, 83, 156);
    doc.text(`Tamanna's Bank Statement - ${selectedBank?.bankName || 'Unknown Bank'}`, 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Bank Name: ${selectedBank?.bankName || 'N/A'}`, 14, 28);
    doc.text(`Account Number: ${selectedBank?.accountNumber || 'N/A'}`, 14, 34);
    doc.text(`Account Holder: ${selectedBank?.accountHolderName || 'N/A'}`, 14, 40);
    doc.text(`Opening Balance: ${(selectedBank?.openingAmount || 0).toLocaleString()}`, 14, 46);
    doc.text(`Current Balance: ${(selectedBank?.currentAmount || 0).toLocaleString()}`, 14, 52);
    doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`, 14, 58);

    // Table columns (now with Transaction ID and Balance)
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Name', dataKey: 'name' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Transaction ID', dataKey: 'txId' },
      { header: 'Debit', dataKey: 'debit' },
      { header: 'Credit', dataKey: 'credit' },
      { header: 'Type', dataKey: 'type' },
      { header: 'Balance', dataKey: 'balance' },
    ];

    // Build table data with running balance
    let running = selectedBank?.openingAmount || 0;
    const data = filteredTransactions.map(tx => {
      const isCredit = tx.type === 'deposit' || tx.type === 'transferCredit';
      running = isCredit ? running + tx.amount : running - tx.amount;

      return {
        date: formatDate(tx.date),
        name: `${tx.paymentPersonName || tx?.invoiceId?.receiverDetails?.name || tx?.personName || tx?.transferBy}` ,
        description: tx.description,
        txId: `${tx?.paymentMethod || ''} - ${tx?.transactionId || tx?.voucherNumber || ''}`,
        debit: !isCredit ? tx.amount.toLocaleString() : '',
        credit: isCredit ? tx.amount.toLocaleString() : '',
        type: tx.type,
        balance: running.toLocaleString(),
      };
    });

    // Summary row
    const totalDebit = filteredTransactions
      .filter(t => !(t.type === 'deposit' || t.type === 'transferCredit'))
      .reduce((sum, t) => sum + t.amount, 0);
    const totalCredit = filteredTransactions
      .filter(t => t.type === 'deposit' || t.type === 'transferCredit')
      .reduce((sum, t) => sum + t.amount, 0);
    // const netChange = calculateNetChange(filteredTransactions);
    // const finalBalance = (selectedBank?.openingAmount || 0) ;

    data.push({
      date: '',
      description: `Summary (${filteredTransactions.length} txns)`,
      txId: '',
      debit: totalDebit.toLocaleString(),
      credit: totalCredit.toLocaleString(),
      // type: `Net Change: ${netChange >= 0 ? '+' : '-'}${Math.abs(netChange).toLocaleString()}`,
      // balance:     finalBalance.toLocaleString(),
    });

    // Draw the table
    doc.autoTable({
      head: [columns.map(c => c.header)],
      body: data.map(row => columns.map(c => row[c.dataKey])),
      startY: 62,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 83, 156] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Save
    doc.save(
      `bank_statement_tamanna_${selectedBank?.bankName || 'unknown'}_${format(new Date(), 'yyyyMMdd')}.pdf`
    );
  };

  // Export to Excel (blue headers + green summary)
  const exportToExcel = () => {
    // 1. Build rows with running balance
    let running = selectedBank?.openingAmount || 0;
    const data = filteredTransactions.map(tx => {
      const isCredit = tx.type === 'deposit' || tx.type === 'transferCredit';
      running = isCredit ? running + tx.amount : running - tx.amount;

      return {
        Date: formatDate(tx.date),
        Name: `${tx.paymentPersonName || tx?.invoiceId?.receiverDetails?.name || tx?.personName || tx?.transferBy}` ,
        Description: tx.description,
        'Transaction ID': `${tx?.paymentMethod || ''} - ${tx?.transactionId || tx?.voucherNumber || ''}`,
        Debit: isCredit ? '' : tx.amount,
        Credit: isCredit ? tx.amount : '',
        'Transaction Type': tx.type,
        Balance: running,
      };
    });

    // 2. Summary calculations
    const totalDebit = filteredTransactions
      .filter(t => !(t.type === 'deposit' || t.type === 'transferCredit'))
      .reduce((sum, t) => sum + t.amount, 0);
    const totalCredit = filteredTransactions
      .filter(t => t.type === 'deposit' || t.type === 'transferCredit')
      .reduce((sum, t) => sum + t.amount, 0);
    // const netChange = calculateNetChange(filteredTransactions);
    // const finalBalance = (selectedBank?.openingAmount || 0) + netChange;

    // 3. Create worksheet and top‐matter
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [
      ['Tamanna Bank Statement'],
      [],
      ['Bank Details:'],
      [`Bank Name: ${selectedBank?.bankName || 'N/A'}`],
      [`Account Number: ${selectedBank?.accountNumber || 'N/A'}`],
      [`Account Holder: ${selectedBank?.accountHolderName || 'N/A'}`],
      [`Opening Balance: ₹${(selectedBank?.openingAmount || 0).toLocaleString()}`],
      [`Current Balance: ₹${(selectedBank?.currentAmount || 0).toLocaleString()}`],
      [`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`],
      [],
      [],
    ], { origin: 'A1' });

    // 4. Add header row (row 12)
    const headers = ['Date','Name', 'Description', 'Transaction ID', 'Debit', 'Credit', 'Transaction Type', 'Balance'];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A12' });

    // 5. Add data rows starting at A13
    XLSX.utils.sheet_add_json(ws, data, { origin: 'A13', skipHeader: true });

    // 6. Add summary row below data
    const summaryRowIdx = 13 + data.length + 1;
    XLSX.utils.sheet_add_aoa(ws, [[
      'Summary',
      `Total Transactions: ${filteredTransactions.length}`,
      '',
      '',
      totalDebit,
      totalCredit,
      // `Net Change: ${netChange}`,
      // finalBalance
    ]], { origin: `A${summaryRowIdx}` });

    // 7. Column widths
    ws['!cols'] = [
      { wch: 12 }, { wch: 40 }, { wch: 25 },
      { wch: 12 }, { wch: 12 }, { wch: 18 },
      { wch: 12 }
    ];

    // 8. Style headers (blue fill #1F4E79, white bold text, centered)
    headers.forEach((_, colIdx) => {
      const cellRef = XLSX.utils.encode_cell({ r: 11, c: colIdx });
      if (!ws[cellRef]) return;
      ws[cellRef].s = {
        fill: { fgColor: { rgb: "1F4E79" } },
        font: { bold: true, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    });

    // 9. Style summary row (green fill #C6E0B4, bold text)
    for (let c = 0; c < headers.length; c++) {
      const ref = XLSX.utils.encode_cell({ r: summaryRowIdx - 1, c });
      if (!ws[ref]) continue;
      ws[ref].s = {
        fill: { fgColor: { rgb: "C6E0B4" } },
        font: { bold: true },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" }
        }
      };
    }

    // 10. Create workbook & save
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bank Statement');
    XLSX.writeFile(
      wb,
      `bank_statement_tamanna_${selectedBank?.bankName || 'unknown'}_${format(new Date(), 'yyyyMMdd')}.xlsx`
    );
  };

  const calculateNetChange = (transactions) => {
    return transactions.reduce((net, transaction) => {
      if (transaction.type === "deposit" || transaction.type === "transferCredit") {
        return selectedBank.currentAmount
      } else {
        return net - transaction.amount;
      }
    }, 0);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tamanna's Bank Statement</h1>
        <p className="text-gray-600">View and download transaction history for your bank accounts</p>
      </div>

      {/* Bank Selection */}
      <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank Account</label>
              <div className="relative">
                <select
                  className="block cursor-pointer w-full pl-3 pr-10 py-2 text-base border-green-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedBankId}
                  onChange={handleBankChange}
                >
                  <option value="" className='cursor-pointer'>-- Select a Bank --</option>
                  {banks.map(bank => (
                    <option key={bank._id} value={bank._id} className='cursor-pointer'>
                      {bank.bankName} - {bank.accountNumber}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <BsBank2 className="h-4 w-4" />
                </div>
              </div>
            </div>

            {selectedBank && (
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={exportToPDF}
                  className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!filteredTransactions.length}
                >
                  <FaFilePdf className="mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={exportToExcel}
                  className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={!filteredTransactions.length}
                >
                  <FaFileExcel className="mr-2" />
                  Export Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bank Details */}
      {selectedBank && (
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-12 w-12 bg-white text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                {selectedBank.bankName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4 text-white">
                <h1 className="text-2xl font-bold">{selectedBank.bankName}</h1>
                <p className="text-blue-100">Account: {selectedBank.accountNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Current Balance</p>
                <p className="text-white text-2xl font-bold">
                  ₹{selectedBank.currentAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Opening Balance</p>
                <p className="text-white text-2xl font-bold">
                  ₹{selectedBank.openingAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Account Holder</p>
                <p className="text-white text-xl">{selectedBank?.accountHolderName}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">IFSC Code</p>
                <p className="text-white text-xl">{selectedBank?.ifscCode}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Total Deposit</p>
                <p className="text-white text-xl"> ₹ {summary?.totalDeposits || 0}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Total Withdrawal</p>
                <p className="text-white text-xl"> ₹ {summary?.totalWithdrawals || 0}</p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Total Purchases</p>
                <p className="text-white text-xl"> ₹ {summary?.totalPurchases || 0}</p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Total Transactions</p>
                <p className="text-white text-xl"> ₹ {summary?.totalTransactions || 0}</p>
              </div>

              {/* <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Total Transfer Credits</p>
                <p className="text-white text-xl"> ₹ {summary?.totalTransferCredits || 0}</p>
              </div> */}
              {/* <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-sm">Total Transfer Debits</p>
                <p className="text-white text-xl"> ₹ {summary?.totalTransferDebits || 0}</p>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {selectedBank && (
        <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="w-full md:w-1/3 relative mb-4 md:mb-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaFilter className="mr-2 h-4 w-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

                {showFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
                  <input
                    type="number"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Min Amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
                  <input
                    type="number"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Max Amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                  <select
                    name="transactionType"
                    value={filters.transactionType}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="expense">Expense</option>
                    <option value="purchase">Purchase</option>
                    <option value="transferCredit">Transfer Credit</option>
                    <option value="transferDebit">Transfer Debit</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transactions Table */}
      {selectedBank && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Transaction History
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Show</span>
              <select
                className="border border-gray-300 rounded-md text-sm"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-500">entries</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Debit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPaginatedTransactions().length > 0 ? (
                      getPaginatedTransactions().map((transaction, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.paymentPersonName || transaction?.invoiceId?.receiverDetails?.name || transaction?.personName || transaction?.transferBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(transaction?.paymentMethod)} - {transaction?.transactionId || transaction?.voucherNumber}
                          </td>

                          {/* Debit column */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                            {(transaction.type !== "deposit" &&
                              transaction.type !== "transferCredit")
                              ? `- ₹${transaction.amount.toLocaleString()}`
                              : ""}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {(transaction.type === "deposit" ||
                              transaction.type === "transferCredit")
                              ? `+ ₹${transaction.amount.toLocaleString()}`
                              : ""}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === "deposit" ||
                                  transaction.type === "transferCredit"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                                }`}
                            >
                              {transaction.type}
                            </span>
                          </td>

                          {/* <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              transaction.transactionType === "deposit" ||
                              transaction.transactionType === "transferCredit"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.transactionType === "deposit" ||
                            transaction.transactionType === "transferCredit"
                              ? "+"
                              : "-"}
                            ₹{transaction.amount.toLocaleString()}
                          </td> */}

                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.balance >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                          >
                            ₹{transaction.balance.toLocaleString()}
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot className="bg-gray-100">
                    <tr className="font-medium">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Summary
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Total Transactions: {filteredTransactions.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {/* Total Transactions: {filteredTransactions.length} */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {`- ₹${filteredTransactions
                          .filter(t => t.type !== "deposit" && t.type !== "transferCredit")
                          .reduce((sum, t) => sum + t.amount, 0)
                          .toLocaleString()}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {`+ ₹${filteredTransactions
                          .filter(t => t.type === "deposit" || t.type === "transferCredit")
                          .reduce((sum, t) => sum + t.amount, 0)
                          .toLocaleString()}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Net Change
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={
                          calculateNetChange(filteredTransactions) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }>
                          {calculateNetChange(filteredTransactions) >= 0 ? "+" : "-"}
                          {/* ₹{Math.abs(calculateNetChange(filteredTransactions)).toLocaleString()} */}
                          ₹{selectedBank.currentAmount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  </tfoot>

                </table>
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{totalItems}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-blue-600 cursor-pointer hover:bg-blue-50'
                        }`}
                    >
                      First
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-blue-600 cursor-pointer hover:bg-blue-50'
                        }`}
                    >
                      Previous
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
                          className={`px-3 py-1 rounded-md ${currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-blue-600 cursor-pointer hover:bg-blue-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white cursor-pointer text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                      Next
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-blue-600 cursor-pointer hover:bg-blue-50'
                        }`}
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* No Bank Selected Message */}
      {!selectedBank && !loading && (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <BsBank2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Bank Account Selected
          </h2>
          <p className="text-gray-500 mb-6">
            Please select a bank account from the dropdown above to view transaction history.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 max-w-md mx-auto">
            <p className="font-medium mb-2">💡 Tip:</p>
            <p>
              You can filter transactions by date, amount, and transaction type once you select a bank account.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnigdhaBankStatementPage;

