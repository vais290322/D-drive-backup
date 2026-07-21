import React, { useState, useRef, useEffect } from 'react';
import { FaFilePdf, FaFileExcel, FaPrint, FaSearch, FaFilter } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast'; 


const fetchAllInvoice = import.meta.env.VITE_REACT_FETCH_INVOICE

const SnigdhaGstReportPage = () => {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterGstType, setFilterGstType] = useState('all');
  const [allinvoice, setAllInvoice] = useState([]);
  const componentRef = useRef(); 
  
  
  // Filter data based on search query and GST type
  const filteredData = allinvoice?.filter(item => {
    const matchesSearch = 
      (item?.invoiceNumber?.toLowerCase() || '').includes(searchQuery?.toLowerCase()) || 
      (item?.receiverDetails?.name?.toLowerCase() || '').includes(searchQuery?.toLowerCase()) ||
      (item?.receiverDetails?.gstin?.toLowerCase() || '').includes(searchQuery?.toLowerCase());
    
    // Determine GST type based on invoice data structure
    const invoiceGstType = 
      (item?.igstAmount > 0 && item?.cgstAmount === 0 && item?.sgstAmount === 0) ? 'igst' : 'regular';
    
    const matchesGstType = filterGstType === 'all' || invoiceGstType === filterGstType;
    
    return matchesSearch && matchesGstType;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  // Calculate totals from real invoice data
  const totals = filteredData?.reduce((acc, item) => {
    return {
      taxableAmount: acc.taxableAmount + (parseFloat(item?.taxAmount || 0) || 0),
      total: acc.total + (parseFloat(item?.grandTotal || 0) || 0)
    };
  }, { taxableAmount: 0, total: 0 });
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  // Handle printing
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: 'GST_Report',
      // Add print styles to ensure proper formatting
      pageStyle: `
        @media print {
          body {
            font-family: 'Arial', sans-serif;
          }
          .print\\:hidden {
            display: none !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .text-right {
            text-align: right;
          }
        }
      `
    });
    
  // Handle Excel export
  const handleExcelExport = () => {
    // Transform data for export - match the table structure exactly
    const exportData = filteredData.map(item => ({
      'Invoice No': item?.invoiceNumber || '',
      'Date': item?.date || '',
      'Customer': item?.receiverDetails?.name || '',
      'GSTIN': item?.receiverDetails?.gstin || '',
      'Taxable Amount': parseFloat(item?.gstAmount || 0),
      'Total': parseFloat(item?.grandTotal || 0)
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");
    
    // Add totals row - match the table structure
    XLSX.utils.sheet_add_json(worksheet, [{
      'Invoice No': 'Total',
      'Date': '',
      'Customer': '',
      'GSTIN': '',
      'Taxable Amount': totals.taxableAmount,
      'Total': totals.total
    }], { skipHeader: true, origin: -1 });
    
    // Save file
    XLSX.writeFile(workbook, `GST_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  // Handle PDF export
  const handlePdfExport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('GST Report', 14, 22);
    
    // Add date range if selected
    if (dateRange.from && dateRange.to) {
      doc.setFontSize(12);
      doc.text(`Period: ${dateRange.from} to ${dateRange.to}`, 14, 30);
    }
    
    // Create table - match the table structure exactly
    const tableColumn = ["Invoice No", "Date", "Customer", "GSTIN", "Taxable Amount", "Total"];
    const tableRows = [];
    
    filteredData.forEach(item => {
      const rowData = [
        item?.invoiceNumber || '',
        item?.date || '',
        item?.receiverDetails?.name || '',
        item?.receiverDetails?.gstin || '',
        parseFloat(item?.gstAmount || 0).toFixed(2),
        parseFloat(item?.grandTotal || 0).toFixed(2)
      ];
      tableRows.push(rowData);
    });
    
    // Add totals row - match the table structure
    tableRows.push([
      'Total', '', '', '',
      totals.taxableAmount.toFixed(2),
      totals.total.toFixed(2)
    ]);
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    doc.save(`GST_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };


  const getAllInvoices = async() => {
    try {
      const getAllData = await fetch(fetchAllInvoice,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const jsonData = await getAllData.json()
      // console.log("Invoice Data", jsonData) 
      
      toast.success("Successfully fetched Invoice Data")
      setAllInvoice(jsonData.data || [])
    } catch (error) {
      toast.error("Server error")
      // console.error(error)
    }
  }

  useEffect(()=> {
    getAllInvoices()
  },[])

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6" ref={componentRef}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">GST Report in Snigdha</h1>
        
        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">From:</span>
              <input 
                type="date" 
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">To:</span>
              <input 
                type="date" 
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">GST Type:</span>
              <select 
                value={filterGstType}
                onChange={(e) => setFilterGstType(e.target.value)}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="regular">Regular (CGST/SGST)</option>
                <option value="igst">IGST</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <button 
              onClick={handlePdfExport}
              className="flex items-center cursor-pointer gap-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
            >
              <FaFilePdf /> PDF
            </button>
            <button 
              onClick={handleExcelExport}
              className="flex items-center cursor-pointer gap-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
            >
              <FaFileExcel /> Excel
            </button>
            {/* <button 
              onClick={handlePrint}
              className="flex items-center cursor-pointer gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              <FaPrint /> Print
            </button> */}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-6 print:hidden">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Invoice No, Customer, or GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSTIN</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taxable Amount</th>
                {/* <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">CGST</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">SGST</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">IGST</th> */}
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems?.map((item) => (
               
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item?.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900"> {new Date(item?.date).toLocaleDateString()} </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item?.receiverDetails?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item?.receiverDetails?.gstin}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item?.taxAmount)}</td>
                  {/* <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.cgst)}</td> */}
                  {/* <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.sgst)}</td> */}
                  {/* <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.igst)}</td> */}
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{formatCurrency(item?.grandTotal)}</td>
                </tr>
              ))}
              {/* Summary row */}
              <tr className="bg-gray-100 font-bold">
                <td colSpan="4" className="px-4 py-3 text-sm text-gray-900">Total</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(totals.taxableAmount)}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{formatCurrency(totals.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="ml-2">entries</span>
          </div>
          
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
            </span>
            
            <div className="flex">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 cursor-pointer border rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
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
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 cursor-pointer border-t border-b border-r ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 cursor-pointer border-t border-b border-r rounded-r-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Taxable Amount</h3>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(totals.taxableAmount)}</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Total Amount</h3>
            <p className="text-2xl font-bold text-red-900">{formatCurrency(totals.total)}</p>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default SnigdhaGstReportPage;
