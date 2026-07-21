import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendDomainS } from '../../Common/index';
import { FaRupeeSign } from 'react-icons/fa';
import { Dialog, DialogContent, DialogTitle, IconButton, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const PaymentAndViewCustomerBlanceComponent = ({ customerId, open, onClose }) => {
  const [customerBalance, setCustomerBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // console.log('Customer Balance Component:', { customerId, open, onClose });

  useEffect(() => {
    if (open && customerId) {
      fetchCustomerBalance();
    }
  }, [open, customerId]);

  useEffect(() => {
    if (!open) {
      setCustomerBalance(null);
      setError(null);
    }
  }, [open]);

  const fetchCustomerBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${backendDomainS}/api/v1/credit-debit-notes/snigdha-customer-blance/${customerId}`);
      setCustomerBalance(response.data.data);
    } catch (err) {
      setError(err.response.data.message || 'Failed to fetch customer balance');
      console.error('Error fetching customer balance:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center bg-indigo-50">
        <span className="text-xl font-semibold">Customer Balance Details</span>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
            <span className="ml-3">Loading customer balance...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : customerBalance ? (
          <div className="p-4">
            {/* Customer Info */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <p><span className="font-medium">Customer Name:</span> {customerBalance.customerName || 'N/A'}</p>
                <p><span className="font-medium">Customer ID:</span> {customerBalance.customerId || 'N/A'}</p>
                <p><span className="font-medium">Created At:</span> {formatDate(customerBalance.createdAt)}</p>
                <p><span className="font-medium">Last Updated:</span> {formatDate(customerBalance.updatedAt)}</p>
              </div>
            </div>

            {/* Balance Summary */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Balance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Available Credit</p>
                  <p className="text-xl font-bold text-green-600 flex items-center">
                    <FaRupeeSign className="mr-1" size={16} />
                    {customerBalance.availableCredit?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Total Credit</p>
                  <p className="text-xl font-bold text-blue-600 flex items-center">
                    <FaRupeeSign className="mr-1" size={16} />
                    {customerBalance.totalCredit?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Total Debit</p>
                  <p className="text-xl font-bold text-red-600 flex items-center">
                    <FaRupeeSign className="mr-1" size={16} />
                    {customerBalance.totalDebit?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Applied Invoices */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Applied Invoices</h3>
              {customerBalance.appliedInvoices && customerBalance.appliedInvoices.length > 0 ? (
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
                      {customerBalance.appliedInvoices.map((invoice, index) => (
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

            {/* Transaction History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Transaction History</h3>
              {customerBalance.history && customerBalance.history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Source</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Ref</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Invoice Number</th>
                        <th className="border border-gray-200 px-4 py-2 text-right">Amount</th>
                        <th className="border border-gray-200 px-4 py-2 text-right">Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerBalance.history.map((entry, index) => (
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
                          <td className="border border-gray-200 px-4 py-2 text-right font-medium">
                            {formatCurrency(entry.usedInInvoice || 0)}
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
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No customer balance data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentAndViewCustomerBlanceComponent;