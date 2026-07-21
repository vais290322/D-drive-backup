

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

// const fetchAllInvoice = import.meta.env.VITE_REACT_FETCH_INVOICE;

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

// const SnigdhaGstReportPage = () => {
//   const [dateRange, setDateRange] = useState({ from: "", to: "" });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [filterGstType, setFilterGstType] = useState("all");
//   const [allinvoice, setAllInvoice] = useState([]);
//   const componentRef = useRef();

//   // console.log("allinvoice in snigdha gst report page", allinvoice);

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

//   // Modified pagination - work with invoices instead of individual items
//   const totalInvoices = groupedRows.length;
//   const totalPages = Math.ceil(totalInvoices / itemsPerPage);

//   // Calculate which invoices to show on current page
//   const indexOfLastInvoice = currentPage * itemsPerPage;
//   const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
//   const paginatedInvoices = groupedRows.slice(
//     indexOfFirstInvoice,
//     indexOfLastInvoice
//   );

//   // Flatten items for display (only for current page invoices)
//   const getFlattenedItems = (invoices) => {
//     const items = [];

//     invoices.forEach((invoice) => {
//       invoice.items.forEach((item, index) => {
//         items.push({
//           ...item,
//           isFirstItem: index === 0,
//           itemCount: invoice.items.length,
//           rowSpan: index === 0 ? invoice.items.length : 0,
//           uniqueId: `${invoice.invoiceNumber}-${index}`,
//         });
//       });
//     });
//     return items;
//   };

//   // Get flattened items for current page only
//   const currentPageItems = getFlattenedItems(paginatedInvoices);

//   // Get all items for totals calculation and export
//   const allItems = getFlattenedItems(groupedRows);

//   // Update page change handler
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//       // Scroll to top of table when page changes
//       document
//         .querySelector(".overflow-x-scroll")
//         ?.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   // Update the items per page handler
//   const handleItemsPerPageChange = (e) => {
//     const newItemsPerPage = Number(e.target.value);
//     setItemsPerPage(newItemsPerPage);
//     // Reset to first page when changing items per page
//     setCurrentPage(1);
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
//     documentTitle: "GST_Report_Snigdha",
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
//       `GST_Report_Snigdha_${new Date().toISOString().split("T")[0]}.xlsx`
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
//     doc.text("GST Report - Snigdha", 14, 18);

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

//     doc.save(
//       `GST_Report_Snigdha_${new Date().toISOString().split("T")[0]}.pdf`
//     );
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
//     getAllInvoices();
//   }, []);

//   return (
//     <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
//       <div
//         className="bg-white rounded-lg shadow-lg p-6 mb-6"
//         ref={componentRef}
//       >
//         <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//           Snigdha GST Report
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
//         <div className="overflow-x-scroll">
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
//                   style={{ maxWidth: "220px" }}
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
//               {currentPageItems?.map((row, idx) => (
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
//                   <td
//                     className="border border-black px-2 py-1 text-xs overflow-hidden"
//                     style={{
//                       maxWidth: "200px",
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                     title={row.description}
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
//               onChange={handleItemsPerPageChange}
//               className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {[5, 10, 25, 50, 100].map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//             <span className="ml-2">invoices per page</span>
//           </div>

//           <div className="flex items-center">
//             <span className="mr-4 text-sm text-gray-600">
//               Showing {totalInvoices === 0 ? 0 : indexOfFirstInvoice + 1} to{" "}
//               {Math.min(indexOfLastInvoice, totalInvoices)} of {totalInvoices}{" "}
//               invoices
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

// export default SnigdhaGstReportPage;




import React, { useState, useRef, useEffect } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";

const fetchAllInvoice = import.meta.env.VITE_REACT_FETCH_INVOICE;

const groupInvoices = (invoices) => {
  return invoices.map((inv, idx) => {
    const items = inv.items || [];

    // Create expanded rows for each item
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
        uqc: item.uom || "NO",
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

const SnigdhaGstReportPage = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterGstType, setFilterGstType] = useState("all");
  const [allinvoice, setAllInvoice] = useState([]);
  const componentRef = useRef();

  // Filter data based on search query and GST type
  const filteredData = allinvoice?.filter((item) => {

    const hasMatchingHsnCode = item.items?.some(itemData => 
      (itemData.hsnCode || "").toLowerCase().includes(searchQuery?.toLowerCase())
    );

    const matchesSearch =
      (item?.invoiceNumber?.toLowerCase() || "").includes(
        searchQuery?.toLowerCase()
      ) ||
      (item?.receiverDetails?.name?.toLowerCase() || "").includes(
        searchQuery?.toLowerCase()
      ) ||
      (item?.receiverDetails?.gstin?.toLowerCase() || "").includes(
        searchQuery?.toLowerCase()
      ) ||
      hasMatchingHsnCode;


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

  // Modified pagination - work with invoices instead of individual items
  const totalInvoices = groupedRows.length;
  const totalPages = Math.ceil(totalInvoices / itemsPerPage);

  // Calculate which invoices to show on current page
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const paginatedInvoices = groupedRows.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  // Flatten items for display (only for current page invoices)
  const getFlattenedItems = (invoices) => {
    const items = [];

    invoices.forEach((invoice) => {
      invoice.items.forEach((item, index) => {
        items.push({
          ...item,
          isFirstItem: index === 0,
          itemCount: invoice.items.length,
          rowSpan: index === 0 ? invoice.items.length : 0,
          uniqueId: `${invoice.invoiceNumber}-${index}`,
        });
      });
    });
    return items;
  };

  // Get flattened items for current page only
  const currentPageItems = getFlattenedItems(paginatedInvoices);

  // Get all items for totals calculation and export
  const allItems = getFlattenedItems(groupedRows);

  // Update page change handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top of table when page changes
      document
        .querySelector(".overflow-x-scroll")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Update the items per page handler
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    // Reset to first page when changing items per page
    setCurrentPage(1);
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
    documentTitle: "GST_Report_Tamanna",
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

  // Handle Excel export
  const handleExcelExport = () => {
    const exportData = allItems?.map((item, index) => ({
      "Sl. No.": index + 1,
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
    }));

    // Calculate summary totals
    const totalTaxableValue = allItems.reduce((sum, item) => sum + (parseFloat(item.taxableValue) || 0), 0);
    const totalIntegratedTax = allItems.reduce((sum, item) => sum + (parseFloat(item.integratedTaxAmount) || 0), 0);
    const totalCentralTax = allItems.reduce((sum, item) => sum + (parseFloat(item.centralTaxAmount) || 0), 0);
    const totalStateTax = allItems.reduce((sum, item) => sum + (parseFloat(item.stateTaxAmount) || 0), 0);
    const totalInvoiceValue = allItems.reduce((sum, item) => {
      if (item.isFirstItem) {
        return sum + (parseFloat(item.invoiceValue) || 0);
      }
      return sum;
    }, 0);
    
    // Add summary row
    exportData.push({
      "Sl. No.": "",
      "Invoice No": "",
      Date: "",
      Customer: "",
      GSTIN: "",
      HSN: "",
      Description: "SUMMARY TOTAL",
      UQC: "",
      "Total Quantity": "",
      "Invoice Value": totalInvoiceValue.toFixed(2),
      Rate: "",
      "Taxable Value": totalTaxableValue.toFixed(2),
      "Integrated Tax Amount": totalIntegratedTax.toFixed(2),
      "Central Tax Amount": totalCentralTax.toFixed(2),
      "State/UT Tax Amount": totalStateTax.toFixed(2),
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Apply styling to the summary row (last row)
    const lastRow = exportData.length;
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Set bold font for the summary row
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({r: lastRow-1, c: C});
      if (!worksheet[cell]) continue;
      if (!worksheet[cell].s) worksheet[cell].s = {};
      worksheet[cell].s.font = { bold: true };
    }
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GST Report");
    XLSX.writeFile(
      workbook,
      `GST_Report_Tamanna_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // Handle PDF export
  const handlePdfExport = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(18);
    doc.text("GST Report - Tamanna", 14, 18);

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

    const tableRows = allItems.map((item, index) => [
      index + 1,
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

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      theme: "grid",
      styles: { fontSize: 7 },
      margin: { left: 10, right: 10 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    doc.save(
      `GST_Report_Tamanna_${new Date().toISOString().split("T")[0]}.pdf`
    );
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
    getAllInvoices();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        ref={componentRef}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          GST Report
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
            placeholder="Search by Invoice No, Customer, GSTIN, or HSN Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-scroll">
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
                  style={{ maxWidth: "220px" }}
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
              {currentPageItems?.map((row, idx) => (
                // console.log("row ",row),
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
                      {row.invoiceValue}
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

              {/* Totals row (PAGE-WISE) */}
              <tr className="bg-pink-100 font-bold border border-black">
                <td
                  colSpan={8}
                  className="border border-black px-2 py-2 text-right font-bold"
                >
                  Total (This Page)
                </td>
                <td className="border border-black px-2 py-2 text-right font-bold">
                  {currentPageItems
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
                  {currentPageItems
                    .reduce((a, b) => a + (parseFloat(b.taxableValue) || 0), 0)
                    .toFixed(2)}
                </td>
                <td className="border border-black px-2 py-2 text-right font-bold">
                  {currentPageItems
                    .reduce(
                      (a, b) => a + (parseFloat(b.integratedTaxAmount) || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td className="border border-black px-2 py-2 text-right font-bold">
                  {currentPageItems
                    .reduce(
                      (a, b) => a + (parseFloat(b.centralTaxAmount) || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td className="border border-black px-2 py-2 text-right font-bold">
                  {currentPageItems
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
              onChange={handleItemsPerPageChange}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 25, 50, 100,500,5000].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ml-2">invoices per page</span>
          </div>

          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              Showing {totalInvoices === 0 ? 0 : indexOfFirstInvoice + 1} to{" "}
              {Math.min(indexOfLastInvoice, totalInvoices)} of {totalInvoices}{" "}
              invoices
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

export default SnigdhaGstReportPage;
