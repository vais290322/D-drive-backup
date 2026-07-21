// import React, { useState, useRef, useEffect } from 'react';
// import { FaFilePdf, FaFileExcel, FaPrint, FaSearch, FaFilter } from 'react-icons/fa';
// import { useReactToPrint } from 'react-to-print';
// import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import toast from 'react-hot-toast';

// const fetchAllInvoice = import.meta.env.VITE_REACT_FETCH_ALL_INVOICE_MNS

// const groupInvoices = (invoices) => {
//   return invoices.map((inv, idx) => {
//     const items = inv.items || [];
//     // Calculate tax columns for each item
//     const integratedTaxAmounts = [];
//     const centralTaxAmounts = [];
//     const stateTaxAmounts = [];
//     items.forEach(i => {
//       let integrated = 0, central = 0, state = 0;
//       if ((i.cgst > 0 || i.sgst > 0) && i.taxAmount > 0) {
//         central = Number(i.taxAmount) / 2;
//         state = Number(i.taxAmount) / 2;
//         integrated = 0;
//       } else if (i.igst > 0 && i.taxAmount > 0) {
//         integrated = Number(i.taxAmount);
//         central = 0;
//         state = 0;
//       }
//       integratedTaxAmounts.push(integrated);
//       centralTaxAmounts.push(central);
//       stateTaxAmounts.push(state);
//     });

//     return {
//       slNo: idx + 1,
//       invoiceNumber: inv.invoiceNumber,
//       date: inv.date,
//       customer: inv.receiverDetails?.name,
//       gstin: inv.receiverDetails?.gstin,
//       hsn: items.map(i => i.hsnCode).join(', '),
//       description: items.map(i => i.description || i.itemName).join(', '),
//       uqc: items.map(i => i.unit || "NO").join(', '),
//       quantity: items.map(i => i.quantity).join(', '),
//       invoiceValue: inv.grandTotal,
//       rate: items.map(i => (i.taxRate || i.taxRatePercent || i.taxRate || 0) + '%').join(', '),
//       taxableValue: items.map(i => i.netAmount || i.amount).join(', '),
//       integratedTaxAmount: integratedTaxAmounts.join(', '),
//       centralTaxAmount: centralTaxAmounts.join(', '),
//       stateTaxAmount: stateTaxAmounts.join(', '),
//     };
//   });
// };

// const GstReportPage = () => {
//   const [dateRange, setDateRange] = useState({ from: '', to: '' });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [filterGstType, setFilterGstType] = useState('all');
//   const [allinvoice, setAllInvoice] = useState([]);
//   const componentRef = useRef();

//   console.log("allinvoice in mns gst report page", allinvoice)

//   // Filter data based on search query and GST type
//   const filteredData = allinvoice?.filter(item => {
//     const matchesSearch =
//       (item?.invoiceNumber?.toLowerCase() || '').includes(searchQuery?.toLowerCase()) ||
//       (item?.receiverDetails?.name?.toLowerCase() || '').includes(searchQuery?.toLowerCase()) ||
//       (item?.receiverDetails?.gstin?.toLowerCase() || '').includes(searchQuery?.toLowerCase());

//     // Determine GST type based on invoice data structure
//     const invoiceGstType =
//       (item?.igstAmount > 0 && item?.cgstAmount === 0 && item?.sgstAmount === 0) ? 'igst' : 'regular';

//     const matchesGstType = filterGstType === 'all' || invoiceGstType === filterGstType;

//     let matchesDateRange = true;
//     if (dateRange.from && dateRange.to) {
//       const invoiceDate = new Date(item?.date);
//       const fromDate = new Date(dateRange.from);
//       const toDate = new Date(dateRange.to);

//       // Set time to beginning and end of day to include the full day range
//       fromDate.setHours(0, 0, 0, 0);
//       toDate.setHours(23, 59, 59, 999);

//       matchesDateRange = invoiceDate >= fromDate && invoiceDate <= toDate;
//     }

//     return matchesSearch && matchesGstType && matchesDateRange;
//   });

//   const groupedRows = groupInvoices(filteredData);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const paginatedRows = groupedRows.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(groupedRows.length / itemsPerPage);

//   // Calculate totals from real invoice data
//   const totals = groupedRows?.reduce((acc, item) => {
//     return {
//       taxableAmount: acc.taxableAmount + (parseFloat(item?.taxAmount || 0) || 0),
//       total: acc.total + (parseFloat(item?.grandTotal || 0) || 0)
//     };
//   }, { taxableAmount: 0, total: 0 });

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };
//   // Handle printing
//     const handlePrint = useReactToPrint({
//       content: () => componentRef.current,
//       documentTitle: 'GST_Report',
//       // Add print styles to ensure proper formatting
//       pageStyle: `
//         @media print {
//           body {
//             font-family: 'Arial', sans-serif;
//           }
//           .print\\:hidden {
//             display: none !important;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//           }
//           th, td {
//             padding: 8px;
//             text-align: left;
//             border-bottom: 1px solid #ddd;
//           }
//           th {
//             background-color: #f2f2f2;
//             font-weight: bold;
//           }
//           .text-right {
//             text-align: right;
//           }
//         }
//       `
//     });

//   // Handle Excel export
//   const handleExcelExport = () => {
//     const exportData = groupedRows?.map(item => ({
//       'Sl. No.': item.slNo,
//       'Invoice No': item.invoiceNumber || '',
//       'Date': item.date ? new Date(item.date).toLocaleDateString() : '',
//       'Customer': item.customer || '',
//       'GSTIN': item.gstin || '',
//       'HSN': item.hsn,
//       'Description': item.description,
//       'UQC': item.uqc,
//       'Total Quantity': item.quantity,
//       'Invoice Value': item.invoiceValue,
//       'Rate': item.rate,
//       'Taxable Value': item.taxableValue,
//       'Integrated Tax Amount': item.integratedTaxAmount,
//       'Central Tax Amount': item.centralTaxAmount,
//       'State/UT Tax Amount': item.stateTaxAmount,
//     }));

//     // Add totals row
//     exportData.push({
//       'Sl. No.': 'Total',
//       'Invoice Value': groupedRows.reduce((a, b) => a + (parseFloat(b.invoiceValue) || 0), 0),
//       'Taxable Value': groupedRows.reduce((a, b) => a + (parseFloat(b.taxableValue) || 0), 0),
//       'Integrated Tax Amount': groupedRows.reduce((a, b) => a + (parseFloat(b.integratedTaxAmount) || 0), 0),
//       'Central Tax Amount': groupedRows.reduce((a, b) => a + (parseFloat(b.centralTaxAmount) || 0), 0),
//       'State/UT Tax Amount': groupedRows.reduce((a, b) => a + (parseFloat(b.stateTaxAmount) || 0), 0),
//     });

//     const worksheet = XLSX.utils.json_to_sheet(exportData);

//     // Get the header keys
//     const headerKeys = Object.keys(exportData[0]);
//     // Set header style: blue background, white bold text
//     headerKeys.forEach((key, idx) => {
//       const cellAddress = XLSX.utils.encode_cell({ r: 0, c: idx });
//       if (!worksheet[cellAddress]) return;
//       worksheet[cellAddress].s = {
//         fill: { fgColor: { rgb: "4472C4" } }, // Blue
//         font: { bold: true, color: { rgb: "FFFFFF" } }, // White bold
//         alignment: { horizontal: "center", vertical: "center" }
//       };
//     });

//     // Create workbook and append worksheet
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");

//     // Enable styles (requires xlsx-style or SheetJS Pro, but most modern SheetJS builds support this)
//     XLSX.writeFile(workbook, `GST_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   // Handle PDF export
//   const handlePdfExport = () => {
//     // Set orientation to landscape and page size to A4
//     const doc = new jsPDF({
//       orientation: "landscape",
//       unit: "mm",
//       format: "a4"
//     });

//     doc.setFontSize(18);
//     doc.text('GST Report', 14, 18);

//     if (dateRange.from && dateRange.to) {
//       doc.setFontSize(12);
//       doc.text(`Period: ${dateRange.from} to ${dateRange.to}`, 14, 26);
//     }

//     const tableColumn = [
//       "Sl. No.", "Invoice No", "Date", "Customer", "GSTIN", "HSN", "Description", "UQC", "Total Quantity",
//       "Invoice Value", "Rate", "Taxable Value", "Integrated Tax Amount", "Central Tax Amount", "State Tax Amount"
//     ];

//     const tableRows = groupedRows.map(item => [
//       item.slNo,
//       item.invoiceNumber || '',
//       item.date ? new Date(item.date).toLocaleDateString() : '',
//       item.customer || '',
//       item.gstin || '',
//       item.hsn,
//       item.description,
//       item.uqc,
//       item.quantity,
//       item.invoiceValue,
//       item.rate,
//       item.taxableValue,
//       item.integratedTaxAmount,
//       item.centralTaxAmount,
//       item.stateTaxAmount,
//     ]);

//     // Add totals row
//     tableRows.push([
//       'Total', '', '', '', '', '', '', '', '',
//       groupedRows.reduce((a, b) => a + (parseFloat(b.invoiceValue) || 0), 0),
//       '',
//       groupedRows.reduce((a, b) => a + (parseFloat(b.taxableValue) || 0), 0),
//       groupedRows.reduce((a, b) => a + (parseFloat(b.integratedTaxAmount) || 0), 0),
//       groupedRows.reduce((a, b) => a + (parseFloat(b.centralTaxAmount) || 0), 0),
//       groupedRows.reduce((a, b) => a + (parseFloat(b.stateTaxAmount) || 0), 0),
//     ]);

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 32,
//       theme: 'grid',
//       styles: { fontSize: 7 },
//       margin: { left: 10, right: 10 },
//       headStyles: { fillColor: [66, 139, 202] },
//       columnStyles: {
//         0: { cellWidth: 10 },   // Sl. No.
//         1: { cellWidth: 22 },   // Invoice No
//         2: { cellWidth: 18 },   // Date
//         3: { cellWidth: 28 },   // Customer
//         4: { cellWidth: 28 },   // GSTIN
//         5: { cellWidth: 18 },   // HSN
//         6: { cellWidth: 28 },   // Description
//         7: { cellWidth: 12 },   // UQC
//         8: { cellWidth: 16 },   // Total Quantity
//         9: { cellWidth: 20 },   // Invoice Value
//         10: { cellWidth: 14 },  // Rate
//         11: { cellWidth: 18 },  // Taxable Value
//         12: { cellWidth: 16 },  // Integrated Tax Amount
//         13: { cellWidth: 18 },  // Central Tax Amount
//         14: { cellWidth: 18 },  // State/UT Tax Amount
//       }
//     });

//     doc.save(`GST_Report_mns_${new Date().toISOString().split('T')[0]}.pdf`);
//   };

//   const getAllInvoices = async() => {
//     try {
//       const getAllData = await fetch(fetchAllInvoice,{
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       const jsonData = await getAllData.json()
//       // console.log("Invoice Data", jsonData)

//       toast.success("Successfully fetched Invoice Data")
//       setAllInvoice(jsonData.data || [])
//     } catch (error) {
//       toast.error("Server error")
//       // console.error(error)
//     }
//   }

//   useEffect(()=> {
//     getAllInvoices()
//   },[])

//   return (
//     <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
//       <div className="bg-white rounded-lg shadow-lg p-6 mb-6" ref={componentRef}>
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">GST Report in MNS</h1>

//         {/* Filters and Actions */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
//           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//             <div className="flex items-center">
//               <span className="mr-2 whitespace-nowrap">From:</span>
//               <input
//                 type="date"
//                 value={dateRange.from}
//                 onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
//                 className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex items-center">
//               <span className="mr-2 whitespace-nowrap">To:</span>
//               <input
//                 type="date"
//                 value={dateRange.to}
//                 onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
//                 className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex items-center">
//               <span className="mr-2 whitespace-nowrap">GST Type:</span>
//               <select
//                 value={filterGstType}
//                 onChange={(e) => setFilterGstType(e.target.value)}
//                 className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All</option>
//                 <option value="regular">Regular (CGST/SGST)</option>
//                 <option value="igst">IGST</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
//             <button
//               onClick={handlePdfExport}
//               className="flex items-center cursor-pointer gap-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
//             >
//               <FaFilePdf /> PDF
//             </button>
//             <button
//               onClick={handleExcelExport}
//               className="flex items-center cursor-pointer gap-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
//             >
//               <FaFileExcel /> Excel
//             </button>
//             {/* <button
//               onClick={handlePrint}
//               className="flex items-center cursor-pointer gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
//             >
//               <FaPrint /> Print
//             </button> */}
//           </div>
//         </div>

//         {/* Search */}
//         <div className="relative mb-6 print:hidden">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <FaSearch className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search by Invoice No, Customer, or GSTIN..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto rounded-lg shadow-lg border-2 border-blue-300 bg-white">
//           <table className="min-w-full border-separate border-spacing-0">
//             <thead>
//               <tr className="bg-blue-600 text-white">
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-center">Sl. No.</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-left">INV NO.</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-left">INV DATE</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-left">CUSTOMER NAME</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-left">GST NO.</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-left">HSN</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-left">Description</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-left">UQC</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-center">Total Quantity</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-right">Invoice Value</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-right">Rate</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-right">Taxable Value</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-right">Integrated Tax Amount</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-right">Central Tax Amount</th>
//                 <th className="px-4 py-3 border border-blue-300 font-bold text-xs uppercase text-right">State/UT Tax Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedRows.map((row, idx) => (
//                 <tr
//                   key={indexOfFirstItem + idx}
//                   className={`border border-blue-200 ${ (indexOfFirstItem + idx) % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}
//                 >
//                   <td className="px-4 py-2 border border-blue-200 align-top text-center">{indexOfFirstItem + idx + 1}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top">{row.invoiceNumber}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top">{new Date(row.date).toLocaleDateString()}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top">{row.customer}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top">{row.gstin}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top whitespace-pre-line">{row.hsn}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top whitespace-pre-line">{row.description}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top whitespace-pre-line">{row.uqc}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top whitespace-pre-line text-center">{row.quantity}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top text-right">{formatCurrency(row.invoiceValue)}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top whitespace-pre-line text-right">{row.rate}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top whitespace-pre-line text-right">{row.taxableValue}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top whitespace-pre-line text-right">{row.integratedTaxAmount}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top whitespace-pre-line text-right">{row.centralTaxAmount}</td>
//                   <td className="px-4 py-2 border border-blue-200 align-top whitespace-pre-line text-right">{row.stateTaxAmount}</td>
//                 </tr>
//               ))}
//               {/* Totals row */}
//               <tr className="bg-blue-200 font-bold border-t-2 border-blue-400">
//                 <td colSpan={11} className="px-4 py-2 text-right border border-blue-300">Total</td>
//                 <td className="px-4 py-2 text-right border border-blue-300">
//                   {formatCurrency(groupedRows.reduce((a, b) => a + (parseFloat(b.invoiceValue) || 0), 0))}
//                 </td>
//                 <td className="px-4 py-2 text-right border border-blue-300">
//                   {formatCurrency(groupedRows.reduce((a, b) => a + (parseFloat(b.integratedTaxAmount) || 0), 0))}
//                 </td>
//                 <td className="px-4 py-2 text-right border border-blue-300">
//                   {formatCurrency(groupedRows.reduce((a, b) => a + (parseFloat(b.centralTaxAmount) || 0), 0))}
//                 </td>
//                 <td className="px-4 py-2 text-right border border-blue-300">
//                   {formatCurrency(groupedRows.reduce((a, b) => a + (parseFloat(b.stateTaxAmount) || 0), 0))}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
//           <div className="flex items-center mb-4 sm:mb-0">
//             <span className="mr-2">Show</span>
//             <select
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {[5, 10, 25, 50, 100].map(size => (
//                 <option key={size} value={size}>{size}</option>
//               ))}
//             </select>
//             <span className="ml-2">entries</span>
//           </div>

//           <div className="flex items-center">
//             <span className="mr-4 text-sm text-gray-600">
//               Showing {groupedRows.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, groupedRows.length)} of {groupedRows.length} entries
//             </span>

//             <div className="flex">
//               <button
//                 onClick={() => handlePageChange(1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 cursor-pointer border rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 First
//               </button>
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Prev
//               </button>

//               {/* Page numbers */}
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => handlePageChange(pageNum)}
//                     className={`px-3 py-1 cursor-pointer border-t border-b border-r ${
//                       currentPage === pageNum
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-white text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//               <button
//                 onClick={() => handlePageChange(totalPages)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 cursor-pointer border-t border-b border-r rounded-r-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Last
//               </button>
//             </div>
//           </div>
//         </div>
//         {/* Summary Cards */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
//             <h3 className="text-lg font-semibold text-blue-800 mb-2">Taxable Amount</h3>
//             <p className="text-2xl font-bold text-blue-900">{formatCurrency(totals.taxableAmount)}</p>
//           </div>

//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
//             <h3 className="text-lg font-semibold text-red-800 mb-2">Total Amount</h3>
//             <p className="text-2xl font-bold text-red-900">{formatCurrency(totals.total)}</p>
//           </div>
//         </div> */}
//       </div>
//     </div>

//   );
// };

// export default GstReportPage;

// version 2.0.0

// import React, { useState, useRef, useEffect } from "react";
// import {
//   FaFilePdf,
//   FaFileExcel,
//   FaPrint,
//   FaSearch,
//   FaFilter,
// } from "react-icons/fa";
// import { useReactToPrint } from "react-to-print";
// import * as XLSX from "xlsx";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import toast from "react-hot-toast";

// // Mock data for demonstration
// const mockInvoices = [
//   {
//     invoiceNumber: "SSPL/019/08.04.2025",
//     date: "2025-04-08",
//     receiverDetails: {
//       name: "Swiggy Limited (Indore)",
//       gstin: "23AAFCB77070122",
//     },
//     items: [
//       {
//         hsnCode: "999651",
//         description:
//           "Winning of SPL Amount - IFM Quarter-India One - Indore Location",
//         unit: "NO",
//         quantity: 1,
//         amount: 375000,
//         netAmount: 375000,
//         taxRate: 18,
//         cgst: 9,
//         sgst: 9,
//         taxAmount: 67500,
//       },
//     ],
//     grandTotal: 442500,
//   },
//   {
//     invoiceNumber: "SSPL/001/02.04.2025",
//     date: "2025-04-02",
//     receiverDetails: {
//       name: "Swiggy Limited (Kolkata)",
//       gstin: "19AAFCB77070122",
//     },
//     items: [
//       {
//         hsnCode: "2106",
//         description: "Pantry Items",
//         unit: "NO",
//         quantity: 1,
//         amount: 8060,
//         netAmount: 8060,
//         taxRate: 18,
//         cgst: 9,
//         sgst: 9,
//         taxAmount: 1450.8,
//       },
//     ],
//     grandTotal: 9499.0,
//   },
//   {
//     invoiceNumber: "PL/002/25-02.04.2025",
//     date: "2025-04-02",
//     receiverDetails: {
//       name: "Swiggy Limited (Kolkata)",
//       gstin: "19AAFCB77070122",
//     },
//     items: [
//       {
//         hsnCode: "9965",
//         description: "Transporting Cost",
//         unit: "NO",
//         quantity: 1,
//         amount: 4200,
//         netAmount: 4200,
//         taxRate: 18,
//         cgst: 9,
//         sgst: 9,
//         taxAmount: 756,
//       },
//       {
//         hsnCode: "996743",
//         description: "Parking Arrangement",
//         unit: "NO",
//         quantity: 1,
//         amount: 5300,
//         netAmount: 5300,
//         taxRate: 18,
//         cgst: 9,
//         sgst: 9,
//         taxAmount: 954,
//       },
//       {
//         hsnCode: "5518",
//         description: "Sound System",
//         unit: "NO",
//         quantity: 1,
//         amount: 6000,
//         netAmount: 6000,
//         taxRate: 18,
//         cgst: 9,
//         sgst: 9,
//         taxAmount: 1080,
//       },
//       {
//         hsnCode: "9401",
//         description: "Arrangement of chairs,Tables",
//         unit: "NO",
//         quantity: 1,
//         amount: 8500,
//         netAmount: 8500,
//         taxRate: 18,
//         cgst: 9,
//         sgst: 9,
//         taxAmount: 1530,
//       },
//       {
//         hsnCode: "998533",
//         description: "Industrial Cleaning",
//         unit: "NO",
//         quantity: 1,
//         amount: 1500,
//         netAmount: 1500,
//         taxRate: 18,
//         cgst: 9,
//         sgst: 9,
//         taxAmount: 270,
//       },
//       {
//         hsnCode: "4911",
//         description: "Printing Materials",
//         unit: "NO",
//         quantity: 1,
//         amount: 2500,
//         netAmount: 2500,
//         taxRate: 18,
//         cgst: 9,
//         sgst: 9,
//         taxAmount: 450,
//       },
//     ],
//     grandTotal: 33040,
//   },
// ];

// const fetchAllInvoice = import.meta.env.VITE_REACT_FETCH_ALL_INVOICE_MNS || "";

// const groupInvoices = (invoices) => {
//   return invoices.map((inv, idx) => {
//     const items = inv.items || [];

//     // Create expanded rows for each item
//     const expandedItems = items.map((item) => {
//       let integrated = 0,
//         central = 0,
//         state = 0;
//       if ((item.cgst > 0 || item.sgst > 0) && item.taxAmount > 0) {
//         central = Number(item.taxAmount) / 2;
//         state = Number(item.taxAmount) / 2;
//         integrated = 0;
//       } else if (item.igst > 0 && item.taxAmount > 0) {
//         integrated = Number(item.taxAmount);
//         central = 0;
//         state = 0;
//       }

//       return {
//         invoiceNumber: inv.invoiceNumber,
//         date: inv.date,
//         customer: inv.receiverDetails?.name,
//         gstin: inv.receiverDetails?.gstin,
//         hsn: item.hsnCode,
//         description: item.description || item.itemName,
//         uqc: item.unit || "NO",
//         quantity: item.quantity,
//         invoiceValue: inv.grandTotal,
//         rate: (item.taxRate || item.taxRatePercent || 0) + "%",
//         taxableValue: item.netAmount || item.amount,
//         integratedTaxAmount: integrated,
//         centralTaxAmount: central,
//         stateTaxAmount: state,
//       };
//     });

//     return {
//       slNo: idx + 1,
//       invoiceNumber: inv.invoiceNumber,
//       date: inv.date,
//       customer: inv.receiverDetails?.name,
//       gstin: inv.receiverDetails?.gstin,
//       items: expandedItems,
//       totalInvoiceValue: inv.grandTotal,
//     };
//   });
// };

// const GstReportPage = () => {
//   const [dateRange, setDateRange] = useState({ from: "", to: "" });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [filterGstType, setFilterGstType] = useState("all");
//   const [allinvoice, setAllInvoice] = useState(mockInvoices); // Using mock data for demo
//   const componentRef = useRef();

//   // console.log("allinvoice in mns gst report page", allinvoice);

//   // Filter data based on search query and GST type
//   const filteredData = allinvoice?.filter((item) => {
//     const matchesSearch =
//       (item?.invoiceNumber?.toLowerCase() || "").includes(
//         searchQuery?.toLowerCase()
//       ) ||
//       (item?.receiverDetails?.name?.toLowerCase() || "").includes(
//         searchQuery?.toLowerCase()
//       ) ||
//       (item?.receiverDetails?.gstin?.toLowerCase() || "").includes(
//         searchQuery?.toLowerCase()
//       );

//     // Determine GST type based on invoice data structure
//     const invoiceGstType =
//       item?.igstAmount > 0 && item?.cgstAmount === 0 && item?.sgstAmount === 0
//         ? "igst"
//         : "regular";

//     const matchesGstType =
//       filterGstType === "all" || invoiceGstType === filterGstType;

//     let matchesDateRange = true;
//     if (dateRange.from && dateRange.to) {
//       const invoiceDate = new Date(item?.date);
//       const fromDate = new Date(dateRange.from);
//       const toDate = new Date(dateRange.to);

//       // Set time to beginning and end of day to include the full day range
//       fromDate.setHours(0, 0, 0, 0);
//       toDate.setHours(23, 59, 59, 999);

//       matchesDateRange = invoiceDate >= fromDate && invoiceDate <= toDate;
//     }

//     return matchesSearch && matchesGstType && matchesDateRange;
//   });

//   const groupedRows = groupInvoices(filteredData);

//   // Flatten all items for pagination
//   const allItems = [];
//   groupedRows.forEach((invoice) => {
//     invoice.items.forEach((item, itemIndex) => {
//       allItems.push({
//         ...item,
//         isFirstItem: itemIndex === 0,
//         itemCount: invoice.items.length,
//         rowSpan: itemIndex === 0 ? invoice.items.length : 0,
//       });
//     });
//   });

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const paginatedRows = allItems.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(allItems.length / itemsPerPage);

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//     }).format(amount);
//   };

//   // Handle printing
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     documentTitle: "GST_Report",
//     pageStyle: `
//       @media print {
//         body {
//           font-family: 'Arial', sans-serif;
//         }
//         .print\\:hidden {
//           display: none !important;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//         }
//         th, td {
//           padding: 8px;
//           text-align: left;
//           border: 1px solid #000;
//         }
//         th {
//           background-color: #f2f2f2;
//           font-weight: bold;
//         }
//         .text-right {
//           text-align: right;
//         }
//       }
//     `,
//   });

//   // Handle Excel export
//   const handleExcelExport = () => {
//     const exportData = allItems?.map((item, index) => ({
//       "Sl. No.": index + 1,
//       "Invoice No": item.invoiceNumber || "",
//       Date: item.date ? new Date(item.date).toLocaleDateString() : "",
//       Customer: item.customer || "",
//       GSTIN: item.gstin || "",
//       HSN: item.hsn,
//       Description: item.description,
//       UQC: item.uqc,
//       "Total Quantity": item.quantity,
//       "Invoice Value": item.invoiceValue,
//       Rate: item.rate,
//       "Taxable Value": item.taxableValue,
//       "Integrated Tax Amount": item.integratedTaxAmount,
//       "Central Tax Amount": item.centralTaxAmount,
//       "State/UT Tax Amount": item.stateTaxAmount,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");
//     XLSX.writeFile(
//       workbook,
//       `GST_Report_${new Date().toISOString().split("T")[0]}.xlsx`
//     );
//   };

//   // Handle PDF export
//   const handlePdfExport = () => {
//     const doc = new jsPDF({
//       orientation: "landscape",
//       unit: "mm",
//       format: "a4",
//     });

//     doc.setFontSize(18);
//     doc.text("GST Report", 14, 18);

//     if (dateRange.from && dateRange.to) {
//       doc.setFontSize(12);
//       doc.text(`Period: ${dateRange.from} to ${dateRange.to}`, 14, 26);
//     }

//     const tableColumn = [
//       "Sl. No.",
//       "Invoice No",
//       "Date",
//       "Customer",
//       "GSTIN",
//       "HSN",
//       "Description",
//       "UQC",
//       "Total Quantity",
//       "Invoice Value",
//       "Rate",
//       "Taxable Value",
//       "Integrated Tax Amount",
//       "Central Tax Amount",
//       "State Tax Amount",
//     ];

//     const tableRows = allItems.map((item, index) => [
//       index + 1,
//       item.invoiceNumber || "",
//       item.date ? new Date(item.date).toLocaleDateString() : "",
//       item.customer || "",
//       item.gstin || "",
//       item.hsn,
//       item.description,
//       item.uqc,
//       item.quantity,
//       item.invoiceValue,
//       item.rate,
//       item.taxableValue,
//       item.integratedTaxAmount,
//       item.centralTaxAmount,
//       item.stateTaxAmount,
//     ]);

//     doc.autoTable({
//       head: [tableColumn],
//       body: tableRows,
//       startY: 32,
//       theme: "grid",
//       styles: { fontSize: 7 },
//       margin: { left: 10, right: 10 },
//       headStyles: { fillColor: [66, 139, 202] },
//     });

//     doc.save(`GST_Report_mns_${new Date().toISOString().split("T")[0]}.pdf`);
//   };

//   const getAllInvoices = async () => {
//     try {
//       const getAllData = await fetch(fetchAllInvoice, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const jsonData = await getAllData.json();

//       toast.success("Successfully fetched Invoice Data");
//       setAllInvoice(jsonData.data || []);
//     } catch (error) {
//       toast.error("Server error");
//     }
//   };

//   useEffect(() => {
//     getAllInvoices(); // Uncomment when you want to use real API
//   }, []);

//   return (
//     <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
//       <div
//         className="bg-white rounded-lg shadow-lg p-6 mb-6"
//         ref={componentRef}
//       >
//         <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//           MNS Secure Solutions Private Limited
//         </h1>

//         {/* Filters and Actions */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
//           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//             <div className="flex items-center">
//               <span className="mr-2 whitespace-nowrap">From:</span>
//               <input
//                 type="date"
//                 value={dateRange.from}
//                 onChange={(e) =>
//                   setDateRange({ ...dateRange, from: e.target.value })
//                 }
//                 className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex items-center">
//               <span className="mr-2 whitespace-nowrap">To:</span>
//               <input
//                 type="date"
//                 value={dateRange.to}
//                 onChange={(e) =>
//                   setDateRange({ ...dateRange, to: e.target.value })
//                 }
//                 className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex items-center">
//               <span className="mr-2 whitespace-nowrap">GST Type:</span>
//               <select
//                 value={filterGstType}
//                 onChange={(e) => setFilterGstType(e.target.value)}
//                 className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All</option>
//                 <option value="regular">Regular (CGST/SGST)</option>
//                 <option value="igst">IGST</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
//             <button
//               onClick={handlePdfExport}
//               className="flex items-center cursor-pointer gap-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
//             >
//               <FaFilePdf /> PDF
//             </button>
//             <button
//               onClick={handleExcelExport}
//               className="flex items-center cursor-pointer gap-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
//             >
//               <FaFileExcel /> Excel
//             </button>
//             {/* <button
//               onClick={handlePrint}
//               className="flex items-center cursor-pointer gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:blue-700"
//             >
//               <FaPrint /> Print
//             </button> */}
//           </div>
//         </div>

//         {/* Search */}
//         <div className="relative mb-6 print:hidden">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <FaSearch className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search by Invoice No, Customer, or GSTIN..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse border border-black">
//             <thead>
//               <tr className="bg-pink-200">
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   INV NO.
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   INV DATE
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   CUSTOMER NAME
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   GST NO.
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   HSN
//                 </th>
//                 <th
//                   className="border border-black px-2 py-2 text-xs font-bold text-center"
//                   style={{ maxWidth: "200px" }}
//                 >
//                   Description
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   UQC
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   Total Quantity
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   Invoice Value
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   Rate
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   Taxable Value
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   Integrated Tax Amount
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   Central Tax Amount
//                 </th>
//                 <th className="border border-black px-2 py-2 text-xs font-bold text-center">
//                   State/UT Tax Amount
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedRows?.map((row, idx) => (
//                 <tr key={idx} className="border border-black">
//                   {row.isFirstItem ? (
//                     <>
//                       <td
//                         className="border border-black px-2 py-1 text-xs text-center align-top"
//                         rowSpan={row.rowSpan}
//                       >
//                         {row.invoiceNumber}
//                       </td>
//                       <td
//                         className="border border-black px-2 py-1 text-xs text-center align-top"
//                         rowSpan={row.rowSpan}
//                       >
//                         {new Date(row.date).toLocaleDateString()}
//                       </td>
//                       <td
//                         className="border border-black px-2 py-1 text-xs align-top"
//                         rowSpan={row.rowSpan}
//                       >
//                         {row.customer}
//                         <br />
//                         <span className="text-xs text-gray-600">
//                           {row.gstin}
//                         </span>
//                       </td>
//                       <td
//                         className="border border-black px-2 py-1 text-xs text-center align-top"
//                         rowSpan={row.rowSpan}
//                       >
//                         {row.gstin}
//                       </td>
//                     </>
//                   ) : null}

//                   <td className="border border-black px-2 py-1 text-xs text-center">
//                     {row.hsn}
//                   </td>
//                   {/* <td className="border border-black px-2 py-1 text-xs">{row.description}</td> */}
//                   <td
//                     className="border border-black px-2 py-1 text-xs overflow-hidden"
//                     style={{
//                       maxWidth: "200px",
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                     title={row.description} // Shows full text on hover
//                   >
//                     {row.description}
//                   </td>
//                   <td className="border border-black px-2 py-1 text-xs text-center">
//                     {row.uqc}
//                   </td>
//                   <td className="border border-black px-2 py-1 text-xs text-center">
//                     {row.quantity}
//                   </td>

//                   {row.isFirstItem ? (
//                     <>
//                       <td
//                         className="border border-black px-2 py-1 text-xs text-right align-top"
//                         rowSpan={row.rowSpan}
//                       >
//                         {row.invoiceValue}
//                       </td>
//                     </>
//                   ) : null}

//                   <td className="border border-black px-2 py-1 text-xs text-center">
//                     {row.rate}
//                   </td>
//                   <td className="border border-black px-2 py-1 text-xs text-right">
//                     {row.taxableValue}
//                   </td>
//                   <td className="border border-black px-2 py-1 text-xs text-right">
//                     {row.integratedTaxAmount || ""}
//                   </td>
//                   <td className="border border-black px-2 py-1 text-xs text-right">
//                     {row.centralTaxAmount || ""}
//                   </td>
//                   <td className="border border-black px-2 py-1 text-xs text-right">
//                     {row.stateTaxAmount || ""}
//                   </td>
//                 </tr>
//               ))}

//               {/* Totals row */}
//               <tr className="bg-pink-100 font-bold border border-black">
//                 <td
//                   colSpan={8}
//                   className="border border-black px-2 py-2 text-right font-bold"
//                 >
//                   Total
//                 </td>
//                 <td className="border border-black px-2 py-2 text-right font-bold">
//                   {allItems
//                     .reduce((acc, item) => {
//                       if (item.isFirstItem) {
//                         return acc + (parseFloat(item.invoiceValue) || 0);
//                       }
//                       return acc;
//                     }, 0)
//                     .toFixed(2)}
//                 </td>
//                 <td className="border border-black px-2 py-2"></td>
//                 <td className="border border-black px-2 py-2 text-right font-bold">
//                   {allItems
//                     .reduce((a, b) => a + (parseFloat(b.taxableValue) || 0), 0)
//                     .toFixed(2)}
//                 </td>
//                 <td className="border border-black px-2 py-2 text-right font-bold">
//                   {allItems
//                     .reduce(
//                       (a, b) => a + (parseFloat(b.integratedTaxAmount) || 0),
//                       0
//                     )
//                     .toFixed(2)}
//                 </td>
//                 <td className="border border-black px-2 py-2 text-right font-bold">
//                   {allItems
//                     .reduce(
//                       (a, b) => a + (parseFloat(b.centralTaxAmount) || 0),
//                       0
//                     )
//                     .toFixed(2)}
//                 </td>
//                 <td className="border border-black px-2 py-2 text-right font-bold">
//                   {allItems
//                     .reduce(
//                       (a, b) => a + (parseFloat(b.stateTaxAmount) || 0),
//                       0
//                     )
//                     .toFixed(2)}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mt-6 print:hidden">
//           <div className="flex items-center mb-4 sm:mb-0">
//             <span className="mr-2">Show</span>
//             <select
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {[5, 10, 25, 50, 100].map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//             <span className="ml-2">entries</span>
//           </div>

//           <div className="flex items-center">
//             <span className="mr-4 text-sm text-gray-600">
//               Showing {allItems.length === 0 ? 0 : indexOfFirstItem + 1} to{" "}
//               {Math.min(indexOfLastItem, allItems.length)} of {allItems.length}{" "}
//               entries
//             </span>

//             <div className="flex">
//               <button
//                 onClick={() => handlePageChange(1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 cursor-pointer border rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 First
//               </button>
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Prev
//               </button>

//               {/* Page numbers */}
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => handlePageChange(pageNum)}
//                     className={`px-3 py-1 cursor-pointer border-t border-b border-r ${
//                       currentPage === pageNum
//                         ? "bg-blue-600 text-white"
//                         : "bg-white text-gray-700 hover:bg-gray-100"
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//               <button
//                 onClick={() => handlePageChange(totalPages)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 cursor-pointer border-t border-b border-r rounded-r-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Last
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GstReportPage;


// version 3.0.0

import React, { useState, useRef, useEffect } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaSearch,
} from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";

// Mock data for demonstration
const mockInvoices = [
  {
    invoiceNumber: "SSPL/019/08.04.2025",
    date: "2025-04-08",
    receiverDetails: {
      name: "Swiggy Limited (Indore)",
      gstin: "23AAFCB77070122",
    },
    items: [
      {
        hsnCode: "999651",
        description:
          "Winning of SPL Amount - IFM Quarter-India One - Indore Location",
        unit: "NO",
        quantity: 1,
        amount: 375000,
        netAmount: 375000,
        taxRate: 18,
        cgst: 9,
        sgst: 9,
        taxAmount: 67500,
      },
    ],
    grandTotal: 442500,
  },
  {
    invoiceNumber: "SSPL/001/02.04.2025",
    date: "2025-04-02",
    receiverDetails: {
      name: "Swiggy Limited (Kolkata)",
      gstin: "19AAFCB77070122",
    },
    items: [
      {
        hsnCode: "2106",
        description: "Pantry Items",
        unit: "NO",
        quantity: 1,
        amount: 8060,
        netAmount: 8060,
        taxRate: 18,
        cgst: 9,
        sgst: 9,
        taxAmount: 1450.8,
      },
    ],
    grandTotal: 9499.0,
  },
  {
    invoiceNumber: "PL/002/25-02.04.2025",
    date: "2025-04-02",
    receiverDetails: {
      name: "Swiggy Limited (Kolkata)",
      gstin: "19AAFCB77070122",
    },
    items: [
      {
        hsnCode: "9965",
        description: "Transporting Cost",
        unit: "NO",
        quantity: 1,
        amount: 4200,
        netAmount: 4200,
        taxRate: 18,
        cgst: 9,
        sgst: 9,
        taxAmount: 756,
      },
      {
        hsnCode: "996743",
        description: "Parking Arrangement",
        unit: "NO",
        quantity: 1,
        amount: 5300,
        netAmount: 5300,
        taxRate: 18,
        cgst: 9,
        sgst: 9,
        taxAmount: 954,
      },
      {
        hsnCode: "5518",
        description: "Sound System",
        unit: "NO",
        quantity: 1,
        amount: 6000,
        netAmount: 6000,
        taxRate: 18,
        cgst: 9,
        sgst: 9,
        taxAmount: 1080,
      },
      {
        hsnCode: "9401",
        description: "Arrangement of chairs,Tables",
        unit: "NO",
        quantity: 1,
        amount: 8500,
        netAmount: 8500,
        taxRate: 18,
        cgst: 9,
        sgst: 9,
        taxAmount: 1530,
      },
      {
        hsnCode: "998533",
        description: "Industrial Cleaning",
        unit: "NO",
        quantity: 1,
        amount: 1500,
        netAmount: 1500,
        taxRate: 18,
        cgst: 9,
        sgst: 9,
        taxAmount: 270,
      },
      {
        hsnCode: "4911",
        description: "Printing Materials",
        unit: "NO",
        quantity: 1,
        amount: 2500,
        netAmount: 2500,
        taxRate: 18,
        cgst: 9,
        sgst: 9,
        taxAmount: 450,
      },
    ],
    grandTotal: 33040,
  },
];

const fetchAllInvoice = import.meta.env.VITE_REACT_FETCH_ALL_INVOICE_MNS || "";

const groupInvoices = (invoices) => {
  return invoices.map((inv, idx) => {
    const items = inv.items || [];

    // Create expanded rows for each item within this invoice
    const expandedItems = items.map((item) => {
      let integrated = 0,
        central = 0,
        state = 0;
      if ((item.cgst > 0 || item.sgst > 0) && item.taxAmount > 0) {
        central = Number(item.taxAmount) / 2;
        state = Number(item.taxAmount) / 2;
        integrated = 0;
      } else if (item.igst > 0 && item.taxAmount > 0) {
        integrated = Number(item.taxAmount);
        central = 0;
        state = 0;
      }

      return {
        invoiceNumber: inv.invoiceNumber,
        date: inv.date,
        customer: inv.receiverDetails?.name,
        gstin: inv.receiverDetails?.gstin,
        hsn: item.hsnCode,
        description: item.description || item.itemName,
        uqc: item.unit || "NO",
        quantity: item.quantity,
        invoiceValue: inv.grandTotal,
        rate: (item.taxRate || item.taxRatePercent || 0) + "%",
        taxableValue: item.netAmount || item.amount,
        integratedTaxAmount: integrated,
        centralTaxAmount: central,
        stateTaxAmount: state,
      };
    });

    return {
      slNo: idx + 1,
      invoiceNumber: inv.invoiceNumber,
      date: inv.date,
      customer: inv.receiverDetails?.name,
      gstin: inv.receiverDetails?.gstin,
      items: expandedItems,
      totalInvoiceValue: inv.grandTotal,
    };
  });
};

const GstReportPage = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterGstType, setFilterGstType] = useState("all");
  const [allinvoice, setAllInvoice] = useState(mockInvoices); // Using mock data for demo
  const componentRef = useRef();

  // Filter data based on search query and GST type
  const filteredData = allinvoice?.filter((item) => {
    const matchesSearch =
      (item?.invoiceNumber?.toLowerCase() || "").includes(
        searchQuery?.toLowerCase()
      ) ||
      (item?.receiverDetails?.name?.toLowerCase() || "").includes(
        searchQuery?.toLowerCase()
      ) ||
      (item?.receiverDetails?.gstin?.toLowerCase() || "").includes(
        searchQuery?.toLowerCase()
      );

    // Determine GST type based on invoice data structure
    const invoiceGstType =
      item?.igstAmount > 0 && item?.cgstAmount === 0 && item?.sgstAmount === 0
        ? "igst"
        : "regular";

    const matchesGstType =
      filterGstType === "all" || invoiceGstType === filterGstType;

    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const invoiceDate = new Date(item?.date);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);

      // Set time to beginning and end of day to include the full day range
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      matchesDateRange = invoiceDate >= fromDate && invoiceDate <= toDate;
    }

    return matchesSearch && matchesGstType && matchesDateRange;
  });

  const groupedRows = groupInvoices(filteredData);

  // === NEW: Pagination by invoice count ===
  const totalInvoices = groupedRows.length;
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const paginatedInvoices = groupedRows.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(totalInvoices / itemsPerPage);

  // Flatten all items FOR THOSE INVOICES ONLY
  const paginatedRows = [];
  paginatedInvoices.forEach((invoice) => {
    invoice.items.forEach((item, itemIndex) => {
      paginatedRows.push({
        ...item,
        isFirstItem: itemIndex === 0,
        itemCount: invoice.items.length,
        rowSpan: itemIndex === 0 ? invoice.items.length : 0,
      });
    });
  });
  // ========================================

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "GST_Report",
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
          border: 1px solid #000;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .text-right {
          text-align: right;
        }
      }
    `,
  });

  // Handle Excel export (exports ALL filtered rows, not just current page)
  const handleExcelExport = () => {
    // Flatten EVERY filtered invoice's items (not just paginated)
    const allFilteredItems = [];
    groupedRows.forEach((invoice) => {
      invoice.items.forEach((item, idx) => {
        allFilteredItems.push({
          "Sl. No.": idx + 1,
          "Invoice No": item.invoiceNumber || "",
          Date: item.date ? new Date(item.date).toLocaleDateString() : "",
          Customer: item.customer || "",
          GSTIN: item.gstin || "",
          HSN: item.hsn,
          Description: item.description,
          UQC: item.uqc,
          "Total Quantity": item.quantity,
          "Invoice Value": item.invoiceValue,
          Rate: item.rate,
          "Taxable Value": item.taxableValue,
          "Integrated Tax Amount": item.integratedTaxAmount,
          "Central Tax Amount": item.centralTaxAmount,
          "State/UT Tax Amount": item.stateTaxAmount,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(allFilteredItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");
    XLSX.writeFile(
      workbook,
      `GST_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // Handle PDF export (exports ALL filtered rows, not just current page)
  const handlePdfExport = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(18);
    doc.text("GST Report", 14, 18);

    if (dateRange.from && dateRange.to) {
      doc.setFontSize(12);
      doc.text(`Period: ${dateRange.from} to ${dateRange.to}`, 14, 26);
    }

    const tableColumn = [
      "Sl. No.",
      "Invoice No",
      "Date",
      "Customer",
      "GSTIN",
      "HSN",
      "Description",
      "UQC",
      "Total Quantity",
      "Invoice Value",
      "Rate",
      "Taxable Value",
      "Integrated Tax Amount",
      "Central Tax Amount",
      "State Tax Amount",
    ];

    const allFilteredItems = [];
    groupedRows.forEach((invoice, idxInv) => {
      invoice.items.forEach((item) => {
        allFilteredItems.push([
          idxInv + 1,
          item.invoiceNumber || "",
          item.date ? new Date(item.date).toLocaleDateString() : "",
          item.customer || "",
          item.gstin || "",
          item.hsn,
          item.description,
          item.uqc,
          item.quantity,
          item.invoiceValue,
          item.rate,
          item.taxableValue,
          item.integratedTaxAmount,
          item.centralTaxAmount,
          item.stateTaxAmount,
        ]);
      });
    });

    doc.autoTable({
      head: [tableColumn],
      body: allFilteredItems,
      startY: 32,
      theme: "grid",
      styles: { fontSize: 7 },
      margin: { left: 10, right: 10 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    doc.save(`GST_Report_mns_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const getAllInvoices = async () => {
    try {
      const getAllData = await fetch(fetchAllInvoice, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await getAllData.json();

      toast.success("Successfully fetched Invoice Data");
      setAllInvoice(jsonData.data || []);
    } catch (error) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    getAllInvoices(); // Uncomment when you want to use real API
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        ref={componentRef}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          MNS Secure Solutions Private Limited
        </h1>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">From:</span>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">To:</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
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
          <table className="min-w-full border-collapse border border-black">
            <thead>
              <tr className="bg-pink-200">
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  INV NO.
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  INV DATE
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  CUSTOMER NAME
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  GST NO.
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  HSN
                </th>
                <th
                  className="border border-black px-2 py-2 text-xs font-bold text-center"
                  style={{ maxWidth: "200px" }}
                >
                  Description
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  UQC
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  Total Quantity
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  Invoice Value
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  Rate
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  Taxable Value
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  Integrated Tax Amount
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  Central Tax Amount
                </th>
                <th className="border border-black px-2 py-2 text-xs font-bold text-center">
                  State/UT Tax Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, idx) => (
                <tr key={idx} className="border border-black">
                  {row.isFirstItem ? (
                    <>
                      <td
                        className="border border-black px-2 py-1 text-xs text-center align-top"
                        rowSpan={row.rowSpan}
                      >
                        {row.invoiceNumber}
                      </td>
                      <td
                        className="border border-black px-2 py-1 text-xs text-center align-top"
                        rowSpan={row.rowSpan}
                      >
                        {new Date(row.date).toLocaleDateString()}
                      </td>
                      <td
                        className="border border-black px-2 py-1 text-xs align-top"
                        rowSpan={row.rowSpan}
                      >
                        {row.customer}
                        <br />
                        <span className="text-xs text-gray-600">
                          {row.gstin}
                        </span>
                      </td>
                      <td
                        className="border border-black px-2 py-1 text-xs text-center align-top"
                        rowSpan={row.rowSpan}
                      >
                        {row.gstin}
                      </td>
                    </>
                  ) : null}

                  <td className="border border-black px-2 py-1 text-xs text-center">
                    {row.hsn}
                  </td>
                  <td
                    className="border border-black px-2 py-1 text-xs overflow-hidden"
                    style={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={row.description}
                  >
                    {row.description}
                  </td>
                  <td className="border border-black px-2 py-1 text-xs text-center">
                    {row.uqc}
                  </td>
                  <td className="border border-black px-2 py-1 text-xs text-center">
                    {row.quantity}
                  </td>

                  {row.isFirstItem ? (
                    <td
                      className="border border-black px-2 py-1 text-xs text-right align-top"
                      rowSpan={row.rowSpan}
                    >
                      {formatCurrency(row.invoiceValue)}
                    </td>
                  ) : null}

                  <td className="border border-black px-2 py-1 text-xs text-center">
                    {row.rate}
                  </td>
                  <td className="border border-black px-2 py-1 text-xs text-right">
                    {row.taxableValue}
                  </td>
                  <td className="border border-black px-2 py-1 text-xs text-right">
                    {row.integratedTaxAmount || ""}
                  </td>
                  <td className="border border-black px-2 py-1 text-xs text-right">
                    {row.centralTaxAmount || ""}
                  </td>
                  <td className="border border-black px-2 py-1 text-xs text-right">
                    {row.stateTaxAmount || ""}
                  </td>
                </tr>
              ))}

              {/* Totals row FOR CURRENT PAGE */}
              <tr className="bg-pink-100 font-bold border border-black">
                <td
                  colSpan={8}
                  className="border border-black px-2 py-2 text-right font-bold"
                >
                  Total (this page)
                </td>
                <td className="border border-black px-2 py-2 text-right font-bold">
                  {paginatedRows
                    .reduce((acc, item) => {
                      if (item.isFirstItem) {
                        return acc + (parseFloat(item.invoiceValue) || 0);
                      }
                      return acc;
                    }, 0)
                    .toFixed(2)}
                </td>
                <td className="border border-black px-2 py-2"></td>
                <td className="border border-black px-2 py-2 text-right font-bold">
                  {paginatedRows
                    .reduce((a, b) => a + (parseFloat(b.taxableValue) || 0), 0)
                    .toFixed(2)}
                </td>
                <td className="border border-black px-2 py-2 text-right font-bold">
                  {paginatedRows
                    .reduce(
                      (a, b) => a + (parseFloat(b.integratedTaxAmount) || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td className="border border-black px-2 py-2 text-right font-bold">
                  {paginatedRows
                    .reduce(
                      (a, b) => a + (parseFloat(b.centralTaxAmount) || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td className="border border-black px-2 py-2 text-right font-bold">
                  {paginatedRows
                    .reduce(
                      (a, b) => a + (parseFloat(b.stateTaxAmount) || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 print:hidden">
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
              {[5, 10, 25, 50, 100,500,5000]?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ml-2">entries</span>
          </div>

          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              Showing{" "}
              {totalInvoices === 0 ? 0 : indexOfFirstInvoice + 1} to{" "}
              {Math.min(indexOfLastInvoice, totalInvoices)} of {totalInvoices}{" "}
              entries
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
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
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
      </div>
    </div>
  );
};

export default GstReportPage;
