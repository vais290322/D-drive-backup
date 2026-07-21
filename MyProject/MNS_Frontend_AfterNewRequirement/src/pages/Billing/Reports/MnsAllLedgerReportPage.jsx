import React, { useEffect, useState } from "react";
import {
  Download,
  FileText,
  Filter,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  TrendingDown,
  Receipt,
  Calendar,
  CreditCard,
  Eye,
  X,
  DollarSign
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import { FaChevronDown } from "react-icons/fa6";
import { backendDomainA } from "../../../common";

const MnsAllLedgerReportPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllLedgers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [data, search, filterType, amountRange, statusFilter]);

  // Fetch data from your MNS API endpoint
  const fetchAllLedgers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendDomainA}/api/v1/mns-all-ledger`);
      const json = await response.json();
      setData(json || []);
      setFilteredData(json || []);
    } catch (err) {
      console.error("Error fetching ledger data:", err);
      setData([]);
      setFilteredData([]);
    }
    setLoading(false);
  };

  // Apply filters
  const applyFilters = () => {
    let result = [...data];

    if (search) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      result = result.filter(item => item.type === filterType);
    }

    if (amountRange.min || amountRange.max) {
      result = result.filter(item => {
        const amount = parseFloat(item.totalAmount);
        const min = amountRange.min ? parseFloat(amountRange.min) : 0;
        const max = amountRange.max ? parseFloat(amountRange.max) : Infinity;
        return amount >= min && amount <= max;
      });
    }

    if (statusFilter !== 'all') {
      result = result.filter(item => 
        statusFilter === 'pending' ? item.totalDueAmount > 0 : item.totalDueAmount === 0
      );
    }

    setFilteredData(result);
    setPage(0);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setFilterType('all');
    setAmountRange({ min: '', max: '' });
    setStatusFilter('all');
    setFilteredData(data);
  };

  // Handle view details
  const handleView = (row) => {
    setSelected(row);
    setModalOpen(true);
  };

  // Format currency 
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  // Export to Excel
  const downloadExcel = () => {
    if (filteredData.length === 0) return;
    
    const headers = ['Name', 'Type', 'Total Paid', 'Total Due', 'Total Invoices', 'Pending Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        `"${row.name}"`,
        row.type==='income' ? 'Credit' : 'Debit' || 'N/A',
        row.totalPaidAmount || 0,
        row.totalDueAmount || 0,
        row.totalInvoices || 0,
        row.pendingAmount || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mns_ledger_report_${dayjs().format('YYYY-MM-DD')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('MNS Ledger Report', 105, 15, { align: 'center' });
    
    // Add report metadata
    doc.setFontSize(10);
    doc.text(`Generated on: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 20, 25);
    
    // Create table
    const tableColumns = [
      'Name',
      'Type',
      'Total Paid',
      'Total Due',
      'Invoices',
      'Pending'
    ];

    const tableRows = filteredData.map(row => [
      row.name,
      row.type==='income' ? 'Credit' : 'Debit' || 'N/A',
      formatCurrency(row.totalPaidAmount),
      formatCurrency(row.totalDueAmount),
      row.totalInvoices,
      formatCurrency(row.pendingAmount)
    ]);

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold'
      }
    });

    doc.save(`mns_ledger_report_${dayjs().format('YYYY-MM-DD')}.pdf`);
  };

  // Handle change of rows per page
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Calculate pagination
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  // Calculate totals
  const totals = {
    paid: filteredData.reduce((sum, item) => sum + (parseFloat(item.totalPaidAmount) || 0), 0),
    due: filteredData.reduce((sum, item) => sum + (parseFloat(item.totalDueAmount) || 0), 0),
    pending: filteredData.reduce((sum, item) => sum + (parseFloat(item.pendingAmount) || 0), 0)
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">MNS Billing Master Ledger Report</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <input
                type="text"
                placeholder="Search by customer/vendor name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
              />
              <button
                type="submit"
                className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 cursor-pointer bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              {showFilters ? (
                <X className="w-4 h-4 text-red-500" />
              ) : (
                <FaChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Filter by Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  >
                    <option value="all">All</option>
                    <option value="income">Credit</option>
                    <option value="expense">Debit</option>
                  </select>
                </div>

                {/* Filter by Amount Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={amountRange.min}
                      onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={amountRange.max}
                      onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    />
                  </div>
                </div>

                {/* Filter by Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="cleared">Cleared</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export to Excel
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-md hover:bg-red-700 transition flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Export to PDF
          </button>
        </div>

        {/* Ledger Table */}
        {loading ? (
          <div className="text-center py-10 text-lg text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Sl.No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Total Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Total Due</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Total Invoices</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-400">
                      No records found.
                    </td>
                  </tr>
                )}
                {paginatedData.map((ledger, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {page * rowsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{ledger.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ledger.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ledger.type==="income" ? "Credit" : "Debit"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-green-600 font-medium">
                      {formatCurrency(ledger.totalPaidAmount)}
                    </td>
                    <td className="px-4 py-3 text-red-600 font-medium">
                      {formatCurrency(ledger.totalDueAmount)}
                    </td>
                    <td className="px-4 py-3">{ledger.totalInvoices}</td>
                    <td className="px-4 py-3">
                      {ledger.totalDueAmount > 0 ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Cleared
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="px-3 py-1 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        onClick={() => handleView(ledger)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="flex justify-between items-center p-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    className="px-2 py-1 border rounded-md text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">
                    Page {page + 1} of {Math.ceil(filteredData.length / rowsPerPage)} ({filteredData.length} records)
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 cursor-pointer py-1 border rounded disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className="px-3 py-1 cursor-pointer border rounded disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(Math.ceil(filteredData.length / rowsPerPage) - 1, p + 1))}
                    disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal for invoice and payment details */}
        {modalOpen && selected && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                className="absolute top-3 right-3 cursor-pointer text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-2">
                  {selected.name}
                </h2>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Type: <span className="font-medium">{selected.type==="income" ? "Credit" : "Debit"}</span></span>
                  <span>Total Invoices: <span className="font-medium">{selected.totalInvoices}</span></span>
                  <span>Total Paid: <span className="font-medium text-green-600">{formatCurrency(selected.totalPaidAmount)}</span></span>
                  <span>Total Due: <span className="font-medium text-red-600">{formatCurrency(selected.totalDueAmount)}</span></span>
                </div>
              </div>

              <div className="space-y-6">
                {selected.invoices.map((invoice, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Invoice: {invoice.invoiceNumber}
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                          <span>Total: <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span></span>
                          <span>Paid: <span className="font-medium text-green-600">{formatCurrency(invoice.totalPaidAmount)}</span></span>
                          <span>Due: <span className="font-medium text-red-600">{formatCurrency(invoice.dueAmount)}</span></span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        invoice.isPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>

                    {invoice.paymentDetails && invoice.paymentDetails.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Payment History:</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Date</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Amount</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Mode</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Transaction ID</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {invoice.paymentDetails.map((payment, payIdx) => (
                                <tr key={payIdx} className="hover:bg-gray-50">
                                  <td className="px-3 py-2">{formatDate(payment.paymentDate)}</td>
                                  <td className="px-3 py-2 font-medium text-green-600">
                                    {formatCurrency(payment.paymentAmount)}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                      {payment.paymentMode}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-gray-600">{payment.transactionId}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  className="px-6 py-2 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700"
                  onClick={() => setModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MnsAllLedgerReportPage;