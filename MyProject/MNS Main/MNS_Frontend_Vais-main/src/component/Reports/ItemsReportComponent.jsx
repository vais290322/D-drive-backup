import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { backendDomainA } from '../../Common/index';

const ItemsReportComponent = () => {
  // State variables
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};

      // Add date range parameters if provided
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await axios.get(`${backendDomainA}/api/v1/item/itemsreport`, { params });

      if (response.data.success) {
        setItems(response.data.data);
        setTotalItems(response.data.data.length);
      } else {
        setError(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Apply filters and search
  const applyFilters = () => {
    fetchData();
  };

  // Reset filters
  const resetFilters = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    fetchData();
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Function to download data as Excel
  const downloadExcel = () => {
    // Use filteredItems instead of items to respect the search filter
    const itemsToExport = filteredItems;

    const workbook = new ExcelJS.Workbook();

    // Create a single worksheet for all items
    const worksheet = workbook.addWorksheet('Stock Ledger Report');

    // Add title
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Stock Ledger Accounts';
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: 'center' };

    // Add date range
    worksheet.mergeCells('A2:H2');
    const dateRangeCell = worksheet.getCell('A2');
    dateRangeCell.value = `From: ${dateRange.startDate || 'DD-MM-YYYY'} to ${dateRange.endDate || 'DD-MM-YYYY'}`;
    dateRangeCell.alignment = { horizontal: 'center' };

    let rowIndex = 3;

    // Process each item - using filteredItems instead of items
    itemsToExport.forEach((item, itemIndex) => {
      // Add item details
      worksheet.mergeCells(`A${rowIndex}:H${rowIndex}`);
      const itemCell = worksheet.getCell(`A${rowIndex}`);
      itemCell.value = `${item.itemName} (${item.item_id}) Available Quantity : ${item.quantity}`;
      itemCell.font = { bold: true };
      rowIndex++;

      // Add headers
      const headers = [
        'Date', 'Tnx No', 'Customer / Vendor', 'Type', 'Rate', 'Purchase Stock', 'Sales Stock',
        'Purchase Amount', 'Sales Amount'
      ];

      const headerRow = worksheet.addRow(headers);

      // Style header row
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCCCCC' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      rowIndex++;

      // Add data rows
      item.report.forEach(transaction => {
        worksheet.addRow([
          transaction.date,
          transaction.invoiceNo,
          transaction?.customerName,
          transaction.type,
          transaction.rate.toFixed(2),
          transaction.purchaseQuantity,
          transaction.salesQuantity,
          transaction.purchaseAmount.toFixed(2),
          transaction.salesAmount.toFixed(2)
        ]);
        rowIndex++;
      });

      // Calculate totals
      const totalPurchaseQty = item.report.slice(1).reduce((sum, t) => sum + t.purchaseQuantity, 0);
      const totalSalesQty = item.report.slice(1).reduce((sum, t) => sum + t.salesQuantity, 0);
      const totalPurchaseAmount = item.report.slice(1).reduce((sum, t) => sum + t.purchaseAmount, 0);
      const totalSalesAmount = item.report.slice(1).reduce((sum, t) => sum + t.salesAmount, 0);

      const totalPurchaseQty1 = item.report.slice(1).reduce((sum, t) => sum + t.purchaseQuantity, 0);
      const balanceStock = totalPurchaseQty1 - totalSalesQty;
      const avgRate = balanceStock > 0 ? totalPurchaseAmount / balanceStock : 0;

      // Add totals row
      const totalsRow = worksheet.addRow(['Balance', '', '', '', '', totalPurchaseQty, totalSalesQty, totalPurchaseAmount.toFixed(2), totalSalesAmount.toFixed(2)]);

      // Style totals row
      totalsRow.eachCell((cell) => {
        cell.font = { bold: true };
      });
      rowIndex++;

      // Add balance row
      worksheet.addRow(['', '', '', '', `Avg Rate: ${item.unitPrice}`, `Balance Stock: ${balanceStock}`, '', `Balance Stock Value: ${(balanceStock * item?.unitPrice).toFixed(2)}`, '']);
      rowIndex++;

      // Add empty row between items
      worksheet.addRow([]);
      rowIndex++;
    });

    // Format columns
    worksheet.columns.forEach(column => {
      column.width = 20;
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Stock_Ledger_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  };

  // Function to download data as PDF
  const downloadPDF = () => {
    try {
      // Use filteredItems instead of items to respect the search filter
      const itemsToExport = filteredItems;

      const doc = new jsPDF('landscape');
      let yPos = 10;

      // Use autoTable for the title and date range instead of text
      doc.autoTable({
        body: [
          [{ content: 'Stock Ledger Accounts', styles: { halign: 'center', fontSize: 16, fontStyle: 'bold' } }],
          [{ content: `From: ${dateRange.startDate || 'DD-MM-YYYY'} to ${dateRange.endDate || 'DD-MM-YYYY'}`, styles: { halign: 'center', fontSize: 12 } }]
        ],
        startY: yPos,
        theme: 'plain',
        styles: { cellPadding: 1 },
        tableWidth: 'auto',
        margin: { left: 10, right: 10 }
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Process each item - using itemsToExport (filteredItems) instead of items
      itemsToExport.forEach((item, itemIndex) => {
        // Check if we need a new page
        if (yPos > doc.internal.pageSize.height - 40 && itemIndex > 0) {
          doc.addPage();
          yPos = 10;
        }

        // Add item header using autoTable
        doc.autoTable({
          body: [
            [{ content: `${item.itemName} (${item.item_id}) Available Quantity : ${item.quantity}`, styles: { fontStyle: 'bold' } }]
          ],
          startY: yPos,
          theme: 'plain',
          styles: { cellPadding: 1 },
          tableWidth: 'auto',
          margin: { left: 10, right: 10 }
        });

        yPos = doc.lastAutoTable.finalY + 5;

        // Prepare table data
        const tableColumn = ['Date', 'Tnx No', 'Customer / Vendor', 'Type', 'Rate', 'Purchase Qty', 'Sales Qty', 'Purchase Amount', 'Sales Amount'];
        const tableRows = [];

        item.report.forEach(transaction => {
          const rowData = [
            transaction.date,
            transaction.invoiceNo,
            transaction?.customerName,
            transaction.type,
            transaction.rate.toFixed(2),
            transaction.purchaseQuantity,
            transaction.salesQuantity,
            transaction.purchaseAmount.toFixed(2),
            transaction.salesAmount.toFixed(2)
          ];
          tableRows.push(rowData);
        });

        // Calculate totals
        const totalPurchaseQty = item.report.slice(1).reduce((sum, t) => sum + t.purchaseQuantity, 0);
        const totalSalesQty = item.report.slice(1).reduce((sum, t) => sum + t.salesQuantity, 0);
        const totalPurchaseAmount = item.report.slice(1).reduce((sum, t) => sum + t.purchaseAmount, 0);
        const totalSalesAmount = item.report.slice(1).reduce((sum, t) => sum + t.salesAmount, 0);

          const totalPurchaseQty1 = item.report.slice(1).reduce((sum, t) => sum + t.purchaseQuantity, 0);
        const balanceStock = totalPurchaseQty1 - totalSalesQty;
        const avgRate = balanceStock > 0 ? totalPurchaseAmount / balanceStock : 0;

        // Add totals row
        tableRows.push([
          'Balance', '', '', '', '',
          totalPurchaseQty,
          totalSalesQty,
          totalPurchaseAmount.toFixed(2),
          totalSalesAmount.toFixed(2)
        ]);

        // Add main table
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: yPos,
          styles: { fontSize: 8, cellPadding: 1 },
          headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 240, 240] },
          rowStyles: row => {
            if (row.index === tableRows.length - 1) {
              return { fontStyle: 'bold' };
            }
            if (tableRows[row.index][2] === 'Opening Balance') {
              return { fillColor: [240, 240, 240] };
            }
          }
        });

        yPos = doc.lastAutoTable.finalY + 5;

        // Add balance information using autoTable instead of text
        doc.autoTable({
          body: [
            [
              { content: `Avg Rate: ${item?.unitPrice.toFixed(2)}`, styles: { fontSize: 8 } },
              { content: `Balance Stock: ${balanceStock}`, styles: { fontSize: 8 } },
              { content: `Balance Stock Value: ${(balanceStock * item?.unitPrice).toFixed(2)}`, styles: { fontSize: 8 } }
            ]
          ],
          startY: yPos,
          theme: 'plain',
          styles: { cellPadding: 1 },
          tableWidth: 'auto',
          margin: { left: 10, right: 10 }
        });

        yPos = doc.lastAutoTable.finalY + 15;
      });

      // Save the PDF
      doc.save(`Stock_Ledger_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Stock Ledger Report</h1>

      {/* Filters Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by item name or ID"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={applyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Download buttons */}
        <div className="flex justify-end mt-2">
          <button
            onClick={downloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2 cursor-pointer "
            disabled={loading || error || items.length === 0}
          >
            <i className="fas fa-file-excel mr-2"></i>
            Download Excel
          </button>
          <button
            onClick={downloadPDF}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer "
            disabled={loading || error || items.length === 0}
          >
            <i className="fas fa-file-pdf mr-2"></i>
            Download PDF
          </button>
        </div>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded p-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}

      {/* Items Table */}
      {!loading && !error && currentItems.length === 0 && (
        <div className="text-center py-4">No items found</div>
      )}

      {!loading && !error && currentItems.length > 0 && (
        <div className="overflow-x-auto">
          {currentItems.map((item, index) => (
            <div key={item.item_id} className="mb-8 border rounded-lg overflow-hidden">
              <div className="bg-gray-200 p-3 flex justify-between items-center">
                <h2 className="text-lg font-semibold">{item.itemName} <span className="text-sm text-gray-600">({item.item_id})</span> <span className="text-sm text-gray-600">Available Quantity : {item.quantity}</span></h2>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {item.report.length} Transactions
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer/Vendor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Amount</th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Quantity</th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {item.report.map((transaction, tIndex) => (
                      <tr key={`${item.item_id}-${tIndex}`} className={transaction.type === 'Opening Balance' ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.invoiceNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction?.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${transaction.type === 'Purchase' ? 'bg-green-100 text-green-800' :
                              transaction.type === 'Sale' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.rate.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.purchaseQuantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.salesQuantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.purchaseAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.salesAmount.toFixed(2)}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium 
                ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Previous
            </button>

            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium 
                  ${currentPage === number
                    ? 'z-10 bg-blue-500 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium 
                ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ItemsReportComponent;

