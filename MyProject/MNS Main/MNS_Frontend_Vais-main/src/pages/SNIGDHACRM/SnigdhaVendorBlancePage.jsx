import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { backendDomainS } from '../../Common/index';
import { FaEye, FaSearch, FaFilter, FaRedo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const SnigdhaVendorBlancePage = () => {
    const [customerBalances, setCustomerBalances] = useState([]);
    const [filteredBalances, setFilteredBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [minCredit, setMinCredit] = useState('');
    const [maxCredit, setMaxCredit] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // View modal state
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);


    // Fetch customer balances
    const fetchCustomerBalances = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendDomainS}/api/v1/credit-debit-notes/snigdha-vendor-blance`);
            setCustomerBalances(response.data.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch vendor balances');
            console.error('Error fetching vendor balances:', err);
        } finally {
            setLoading(false);
        }
    };

    // Apply filters and sorting
    useEffect(() => {
        let result = [...customerBalances];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(customer =>
                customer.vendorName?.toLowerCase().includes(term) ||
                customer.vendorId?.toLowerCase().includes(term)
            );
        }

        // Apply credit range filters
        if (minCredit !== '') {
            result = result.filter(customer => customer.availableCredit >= parseFloat(minCredit) || 0);
        }
        if (maxCredit !== '') {
            result = result.filter(customer => customer.availableCredit <= parseFloat(maxCredit) || 0);
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'customerName':
                    aValue = a.customerName || '';
                    bValue = b.customerName || '';
                    break;
                case 'availableCredit':
                    aValue = a.availableCredit || 0;
                    bValue = b.availableCredit || 0;
                    break;
                case 'totalCredit':
                    aValue = a.totalCredit || 0;
                    bValue = b.totalCredit || 0;
                    break;
                case 'totalDebit':
                    aValue = a.totalDebit || 0;
                    bValue = b.totalDebit || 0;
                    break;
                default:
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredBalances(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [customerBalances, searchTerm, minCredit, maxCredit, sortBy, sortOrder]);

    // Initialize data on component mount
    useEffect(() => {
        fetchCustomerBalances();
    }, []);

    // Pagination calculations
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredBalances.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredBalances.length / rowsPerPage);

    // Handle page change
    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setMinCredit('');
        setMaxCredit('');
        setSortBy('createdAt');
        setSortOrder('desc');
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Open view modal
    const openViewModal = (customer) => {
        setSelectedCustomer(customer);
        setIsViewModalOpen(true);
    };

    // Close view modal
    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedCustomer(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-lg text-gray-700">Loading Vendor balances...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
                <button
                    onClick={fetchCustomerBalances}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
                    Vendor Balance Management
                </h1>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search by vendor name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                            <FaSearch />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center cursor-pointer gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            <FaFilter /> Filters
                        </button>

                        <button
                            onClick={resetFilters}
                            className="flex items-center cursor-pointer gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <FaRedo /> Reset
                        </button>

                        <button
                            onClick={fetchCustomerBalances}
                            className="flex items-center cursor-pointer gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
                        >
                            <FaRedo /> Refresh
                        </button>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Credit</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={minCredit}
                                    onChange={(e) => setMinCredit(e.target.value)}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Credit</label>
                                <input
                                    type="number"
                                    placeholder="10000"
                                    value={maxCredit}
                                    onChange={(e) => setMaxCredit(e.target.value)}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="createdAt">Date Created</option>
                                    <option value="vendorName">Vendor Name</option>
                                    <option value="availableCredit">Available Credit</option>
                                    <option value="totalCredit">Total Credit</option>
                                    <option value="totalDebit">Total Debit</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Info */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-gray-600">
                        Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredBalances.length)} of {filteredBalances.length} entries
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">S.No</th>
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">Vendor Name</th>
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">Vendor ID</th>
                                <th className="border-b border-gray-200 px-4 py-3 text-right font-semibold">Available Credit</th>
                                <th className="border-b border-gray-200 px-4 py-3 text-right font-semibold">Total Credit</th>
                                <th className="border-b border-gray-200 px-4 py-3 text-right font-semibold">Total Debit</th>
                                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentRows.length > 0 ? (
                                currentRows.map((vendor, index) => (
                                    <tr key={vendor._id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-4 py-3 text-left text-gray-700">{indexOfFirstRow + index + 1}</td>
                                        <td className="px-4 py-3 text-gray-800 font-medium">{vendor.vendorName || 'N/A'}</td>
                                        <td className="px-4 py-3 text-gray-600">{vendor.vendorId || 'N/A'}</td>
                                        <td className="px-4 py-3 text-right font-medium text-green-600">
                                            {formatCurrency(vendor.availableCredit || 0)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-700">
                                            {formatCurrency(vendor.totalCredit || 0)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-700">
                                            {formatCurrency(vendor.totalDebit || 0)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors p-2 hover:bg-blue-100 rounded-full"
                                                onClick={() => openViewModal(vendor)}
                                                title="View Details"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaSearch className="text-4xl mb-3 text-gray-300" />
                                            <p className="text-lg">No vendor balances found</p>
                                            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredBalances.length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange('prev')}
                            className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaChevronLeft size={16} />
                            Previous
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Rows per page:</span>
                                <select
                                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <span className="text-gray-600 font-medium">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                        </div>

                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => handlePageChange('next')}
                            className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <FaChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {isViewModalOpen && selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                Vendor Balance Details
                            </h2>
                            <button
                                onClick={closeViewModal}
                                className="text-gray-500  hover:text-gray-700 text-2xl cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Vendor Information</h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Vendor Name:</span> {selectedCustomer.vendorName || 'N/A'}</p>
                                        <p><span className="font-medium">Vendor ID:</span> {selectedCustomer.vendorId || 'N/A'}</p>
                                        <p><span className="font-medium">Created At:</span> {formatDate(selectedCustomer.createdAt)}</p>
                                        <p><span className="font-medium">Updated At:</span> {formatDate(selectedCustomer.updatedAt)}</p>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-green-800 mb-3">Balance Summary</h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Available Credit:</span>
                                            <span className="ml-2 font-semibold text-green-600">
                                                {formatCurrency(selectedCustomer.availableCredit || 0)}
                                            </span>
                                        </p>
                                        <p><span className="font-medium">Total Credit:</span>
                                            <span className="ml-2 font-semibold">
                                                {formatCurrency(selectedCustomer.totalCredit || 0)}
                                            </span>
                                        </p>
                                        <p><span className="font-medium">Total Debit:</span>
                                            <span className="ml-2 font-semibold">
                                                {formatCurrency(selectedCustomer.totalDebit || 0)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Applied Invoices */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Applied Invoices</h3>
                                {selectedCustomer.appliedInvoices && selectedCustomer.appliedInvoices.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border border-gray-200 px-4 py-2 text-left">Invoice Number</th>
                                                    <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                                                    <th className="border border-gray-200 px-4 py-2 text-left">Source</th>
                                                    <th className="border border-gray-200 px-4 py-2 text-left">Ref</th>
                                                    <th className="border border-gray-200 px-4 py-2 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedCustomer.appliedInvoices.map((invoice, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="border border-gray-200 px-4 py-2">{invoice.invoiceNumber || 'N/A'}</td>
                                                        <td className="border border-gray-200 px-4 py-2">{formatDate(invoice.date)}</td>
                                                        <td className="border border-gray-200 px-4 py-2">{invoice.source || 'N/A'}</td>
                                                        <td className="border border-gray-200 px-4 py-2">{invoice.ref || 'N/A'}</td>
                                                        <td className="border border-gray-200 px-4 py-2 text-right">
                                                            {formatCurrency(invoice.amount || 0)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No applied invoices found</p>
                                )}
                            </div>

                            {/* History */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Transaction History</h3>
                                {selectedCustomer.history && selectedCustomer.history.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                                                    <th className="border border-gray-200 px-4 py-2 text-left">Source</th>
                                                    <th className="border border-gray-200 px-4 py-2 text-left">Ref</th>
                                                    <th className="border border-gray-200 px-4 py-2 text-left">Invoice Number</th>
                                                    <th className="border border-gray-200 px-4 py-2 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedCustomer.history.map((entry, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="border border-gray-200 px-4 py-2">{formatDate(entry.date)}</td>
                                                        <td className="border border-gray-200 px-4 py-2">
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {entry.source || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="border border-gray-200 px-4 py-2">{entry.ref || 'N/A'}</td>
                                                        <td className="border border-gray-200 px-4 py-2">{entry.invoiceNumber || 'N/A'}</td>
                                                        <td className="border border-gray-200 px-4 py-2 text-right font-medium">
                                                            {formatCurrency(entry.amount || 0)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No transaction history found</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t p-4 flex justify-end">
                            <button
                                onClick={closeViewModal}
                                className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SnigdhaVendorBlancePage
