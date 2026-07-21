import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaFilePdf, FaFileExcel, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { backendDomainA } from "../../../common";

const AcctualProfitLossPage = () => {
  const [profitLossData, setProfitLossData] = useState(null);
  const [dateRangeData, setDateRangeData] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const componentRef = useRef();

  // Fetch initial profit loss data
  useEffect(() => {
    fetchProfitLossDetails();
  }, []);

  // Fetch profit loss details
  const fetchProfitLossDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendDomainA}/api/v1/profit-loss/profit-loss-details`);
      setProfitLossData(response.data.data);
    } catch (error) {
      toast.error('Error fetching profit loss details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch profit loss by date range
  const fetchProfitLossByDate = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Please select both start and end dates');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${backendDomainA}/api/v1/profit-loss/profit-loss-by-date?startDate=${dateRange.from}&endDate=${dateRange.to}`
      );
      setDateRangeData(response.data.data);
    } catch (error) {
      toast.error('Error fetching profit loss by date range');
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF export
  const handlePdfExport = () => {
    const doc = new jsPDF();
    const data = dateRangeData || profitLossData;
    const companyDetails = {
      name: "MNS Secure Solutions PVT LTD",
      address: "AB-79, SALT LAKE CITY, SECTOR-I,",
      city: "Kolkata, West Bengal 700064",
      phone: "+91 9614544973",
      email: "info@mnssecuresolutions.com"
    };

    // Add company details
    doc.setFontSize(20);
    doc.text(companyDetails.name, 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(companyDetails.address, 105, 30, { align: 'center' });
    doc.text(companyDetails.city, 105, 35, { align: 'center' });
    doc.text(`Phone: ${companyDetails.phone}`, 105, 40, { align: 'center' });
    doc.text(`Email: ${companyDetails.email}`, 105, 45, { align: 'center' });

    // Add report title and date range
    doc.setFontSize(16);
    doc.text('Profit & Loss Statement', 105, 60, { align: 'center' });
    if (dateRange.from && dateRange.to) {
      doc.setFontSize(12);
      doc.text(`For the Period: ${dateRange.from} to ${dateRange.to}`, 105, 70, { align: 'center' });
    }

    const tableData = [
      [{ content: 'Income', style: { fontStyle: 'bold' } }],
      ['Product Invoice Sales', data.productInvoice.totalPaidInvoiceValue.toFixed(2)],
      ['Service Invoice Sales', data.serviceInvoice.totalPaidServiceInvoiceValue.toFixed(2)],
      [{ content: 'Total Income', style: { fontStyle: 'bold' } },
       { content: (data.productInvoice.totalPaidInvoiceValue + data.serviceInvoice.totalPaidServiceInvoiceValue).toFixed(2), 
         style: { fontStyle: 'bold' } }],
      ['', ''],
      [{ content: 'Expenses', style: { fontStyle: 'bold' } }],
      ['Purchase Expenses', data.purchaseInvoice.totalPaidPurchaseInvoiceValue.toFixed(2)],
      [{ content: 'Total Expenses', style: { fontStyle: 'bold' } },
       { content: data.purchaseInvoice.totalPaidPurchaseInvoiceValue.toFixed(2),
         style: { fontStyle: 'bold' } }],
      ['', ''],
      [{ content: 'Net Profit/Loss', style: { fontStyle: 'bold' } },
       { content: (data.productInvoice.totalPaidInvoiceValue + 
                  data.serviceInvoice.totalPaidServiceInvoiceValue - 
                  data.purchaseInvoice.totalPaidPurchaseInvoiceValue).toFixed(2),
         style: { fontStyle: 'bold' } }]
    ];

    doc.autoTable({
      startY: 80,
      head: [['Description', 'Amount']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: 40,
        fontStyle: 'bold'
      }
    });

    doc.save('mns_profit-loss-statement.pdf');
  };

  // Handle Excel export
  const handleExcelExport = () => {
    const data = dateRangeData || profitLossData;
    const totalIncome = data.productInvoice.totalPaidInvoiceValue + data.serviceInvoice.totalPaidServiceInvoiceValue;
    const totalExpenses = data.purchaseInvoice.totalPaidPurchaseInvoiceValue;
    const netProfitLoss = totalIncome - totalExpenses;

    const wsData = [
      ['MNS Secure Solutions PVT LTD.'],
      ['AB-79, SALT LAKE CITY, SECTOR-I,'],
      ['Kolkata, West Bengal 700064'],
      ['Phone: +91 9614544973'],
      ['Email: info@mnssecuresolutions.com'],
      [''],
      ['Profit & Loss Statement'],
      [dateRange.from && dateRange.to ? `For the Period: ${dateRange.from} to ${dateRange.to}` : ''],
      [''],
      ['Description', 'Amount (₹)'],
      ['Income', ''],
      ['Product Invoice Sales', data.productInvoice.totalPaidInvoiceValue.toFixed(2)],
      ['Service Invoice Sales', data.serviceInvoice.totalPaidServiceInvoiceValue.toFixed(2)],
      ['Total Income', totalIncome.toFixed(2)],
      [''],
      ['Expenses', ''],
      ['Purchase Expenses', data.purchaseInvoice.totalPaidPurchaseInvoiceValue.toFixed(2)],
      ['Total Expenses', totalExpenses.toFixed(2)],
      [''],
      ['Net Profit/Loss', netProfitLoss.toFixed(2)]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profit Loss Statement');
    
    // Style the header
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }
    ];

    XLSX.writeFile(wb, 'profit-loss-statement.xlsx');
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6" ref={componentRef}>
        {/* Company Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">MNS Secure Solutions PVT LTD</h1>
          <p className="text-gray-600">AB-79, SALT LAKE CITY, SECTOR-I,</p>
          <p className="text-gray-600">Kolkata, West Bengal 700064</p>
          <p className="text-gray-600">Phone: +91 9614544973</p>
          <p className="text-gray-600">Email: info@mnssecuresolutions.com</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Profit & Loss Statement</h2>
        {dateRange.from && dateRange.to && (
          <p className="text-center text-gray-600 mb-6">
            For the Period: {dateRange.from} to {dateRange.to}
          </p>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">From:</span>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">To:</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={fetchProfitLossByDate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePdfExport}
              className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
            >
              <FaFilePdf /> PDF
            </button>
            <button
              onClick={handleExcelExport}
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
            >
              <FaFileExcel /> Excel
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Income Section */}
                <tr className="bg-gray-50">
                  <td colSpan="2" className="px-6 py-4 font-bold text-gray-800">Income</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-600">Product Invoice Sales</td>
                  <td className="px-6 py-4 text-right text-gray-800">
                    ₹{(dateRangeData || profitLossData)?.productInvoice.totalPaidInvoiceValue.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-600">Service Invoice Sales</td>
                  <td className="px-6 py-4 text-right text-gray-800">
                    ₹{(dateRangeData || profitLossData)?.serviceInvoice.totalPaidServiceInvoiceValue.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-gray-50 font-bold">
                  <td className="px-6 py-4">Total Income</td>
                  <td className="px-6 py-4 text-right">
                    ₹{((dateRangeData || profitLossData)?.productInvoice.totalPaidInvoiceValue + 
                       (dateRangeData || profitLossData)?.serviceInvoice.totalPaidServiceInvoiceValue).toFixed(2)}
                  </td>
                </tr>

                {/* Expenses Section */}
                <tr className="bg-gray-50">
                  <td colSpan="2" className="px-6 py-4 font-bold text-gray-800">Expenses</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-600">Purchase Expenses</td>
                  <td className="px-6 py-4 text-right text-gray-800">
                    ₹{(dateRangeData || profitLossData)?.purchaseInvoice.totalPaidPurchaseInvoiceValue.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-gray-50 font-bold">
                  <td className="px-6 py-4">Total Expenses</td>
                  <td className="px-6 py-4 text-right">
                    ₹{(dateRangeData || profitLossData)?.purchaseInvoice.totalPaidPurchaseInvoiceValue.toFixed(2)}
                  </td>
                </tr>

                {/* Net Profit/Loss */}
                <tr className="bg-gray-100 font-bold text-lg">
                  <td className="px-6 py-4">Net Profit/Loss</td>
                  <td className={`px-6 py-4 text-right ${
                    ((dateRangeData || profitLossData)?.productInvoice.totalPaidInvoiceValue +
                     (dateRangeData || profitLossData)?.serviceInvoice.totalPaidServiceInvoiceValue -
                     (dateRangeData || profitLossData)?.purchaseInvoice.totalPaidPurchaseInvoiceValue) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    ₹{((dateRangeData || profitLossData)?.productInvoice.totalPaidInvoiceValue +
                        (dateRangeData || profitLossData)?.serviceInvoice.totalPaidServiceInvoiceValue -
                        (dateRangeData || profitLossData)?.purchaseInvoice.totalPaidPurchaseInvoiceValue).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcctualProfitLossPage;