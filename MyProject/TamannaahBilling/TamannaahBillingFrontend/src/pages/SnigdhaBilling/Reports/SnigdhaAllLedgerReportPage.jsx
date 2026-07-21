import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  X,
  RefreshCw,
  Users,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { backendDomainS } from "../../../Common/index";

const SnigdhaAllLedgerReportPage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState("all");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllLedgers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [data, search, filterType, amountRange, statusFilter]);

  const fetchAllLedgers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${backendDomainS}/api/v1/snigdha-all-ledger/all`
      );
      const json = await res.json();
      setData(json.customersAndVendors || []);
    } catch (e) {
      setData([]);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...data];

    // Search filter
    if (search) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      result = result.filter((item) => {
        const type = item.allTransactions?.[0]?.type;
        return filterType === "income" ? type === "income" : filterType === "service"? type==="service" : type === "expense";
      });
    }

    // Amount range filter
    if (amountRange.min || amountRange.max) {
      result = result.filter((item) => {
        const amount = parseFloat(item.totalPaidAmount) || 0;
        const min = parseFloat(amountRange.min) || 0;
        const max = parseFloat(amountRange.max) || Infinity;
        return amount >= min && amount <= max;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => {
        const hasPending = parseFloat(item.pendingAmount) > 0;
        return statusFilter === "pending" ? hasPending : !hasPending;
      });
    }

    setFiltered(result);
    setPage(0);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      applyFilters();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${backendDomainS}/api/v1/snigdha-all-ledger?customerName=${encodeURIComponent(
          search
        )}`
      );
      const json = await res.json();
      if (json.customerName) {
        const searchResult = [
          {
            name: json.customerName,
            totalPaidAmount: json.totalPaidAmount,
            totalDueAmount: json.totalDueAmount,
            totalInvoices: json.totalInvoices,
            pendingAmount: json.pendingAmount,
            allTransactions: json.allTransactions,
          },
        ];
        setData(searchResult);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    }
    setLoading(false);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterType("all");
    setAmountRange({ min: "", max: "" });
    setStatusFilter("all");
    fetchAllLedgers();
  };

  const handleChangePage = (newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleView = (row) => {
    setSelected(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  // Calculate totals
  const totalPaid = filtered.reduce(
    (sum, item) => sum + (parseFloat(item.totalPaidAmount) || 0),
    0
  );
  const totalDue = filtered.reduce(
    (sum, item) => sum + (parseFloat(item.totalDueAmount) || 0),
    0
  );
  const totalPending = filtered.reduce(
    (sum, item) => sum + (parseFloat(item.pendingAmount) || 0),
    0
  );

  // Pagination logic
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const downloadPDFInView = () => {
    const data = {
      customerName: selected?.name,
      totalPaid: selected?.totalPaidAmount,
      totalDue: selected?.totalDueAmount,
      totalInvoices: selected?.totalInvoices,
      pendingAmount: selected?.pendingAmount,
      transactions: selected?.allTransactions || [],
    };

    // Create new PDF document
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: `Transaction Report - ${data.customerName}`,
      author: "Your Company Name",
      creator: "Transaction Management System",
    });

    // Add title
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("TRANSACTION REPORT", 105, 20, { align: "center" });

    // Add a line under title
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Reset font for content
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");

    // Add customer summary information
    let yPosition = 40;
    const summaryData = [
      ["Customer/Vendor:", data.customerName || "N/A"],
      ["Total Paid:", `${parseFloat(data.totalPaid || 0).toLocaleString()}`],
      ["Total Due:", `${parseFloat(data.totalDue || 0).toLocaleString()}`],
      ["Total Invoices:", data.totalInvoices || 0],
      [
        "Pending Amount:",
        `${parseFloat(data.pendingAmount || 0).toLocaleString()}`,
      ],
    ];

    // Create summary table
    doc.autoTable({
      startY: yPosition,
      head: [["Field", "Value"]],
      body: summaryData,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 120 },
      },
      margin: { left: 20, right: 20 },
    });

    // Add transaction details section title
    yPosition = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("TRANSACTION DETAILS", 20, yPosition);

    // Reset font
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");

    // Prepare transaction data for table
    const transactionRows = [];

    data.transactions.forEach((transaction, index) => {
      // Main transaction row
      transactionRows.push([
        index + 1,
        transaction.invoiceNumber || "N/A",
        transaction.type==="income" || transaction.type==="service" ? "Credit" : "Debit" || "N/A",
        `${parseFloat(transaction.totalAmount || 0).toLocaleString()}`,
        `${parseFloat(transaction.dueAmount || 0).toLocaleString()}`,
        `${parseFloat(transaction.totalPaidAmount || 0).toLocaleString()}`,
        transaction.isPaid ? "Paid" : "Unpaid",
      ]);

      // Add payment details as sub-rows if they exist
      if (transaction.paymentDetails && transaction.paymentDetails.length > 0) {
        transaction.paymentDetails.forEach((payment, paymentIndex) => {
          transactionRows.push([
            `${index + 1}.${paymentIndex + 1}`,
            `Payment: ${payment.transactionId || "N/A"}`,
            payment.paymentMode || "N/A",
            `${parseFloat(payment.paymentAmount || 0).toLocaleString()}`,
            payment.paymentDate || "N/A",
            "-",
            "Payment",
          ]);
        });
      }
    });

    // Create transactions table
    doc.autoTable({
      startY: yPosition + 10,
      head: [
        [
          "#",
          "Invoice/Payment ID",
          "Type/Mode",
          "Amount",
          "Due/Date",
          "Paid",
          "Status",
        ],
      ],
      body: transactionRows,
      theme: "striped",
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
      },
      margin: { left: 20, right: 20 },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Add footer with generation date
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        20,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    }

    // Save the PDF
    const fileName = `${
      data.customerName || "Customer"
    }_transaction_report.pdf`;
    doc.save(fileName);

    console.log("PDF download initiated for:", data.customerName);
  };

  const downloadTxtInViewOLd = () => {
    const data = {
      customerName: selected?.name,
      totalPaid: selected?.totalPaidAmount,
      totalDue: selected?.totalDueAmount,
      totalInvoices: selected?.totalInvoices,
      pendingAmount: selected?.pendingAmount,
      transactions: selected?.allTransactions || [],
    };

    // Create a simple PDF content string
    const pdfContent = `
TRANSACTION REPORT
==================
Customer/Vendor: ${data.customerName}
Total Paid: ₹${parseFloat(data.totalPaid || 0).toLocaleString()}
Total Due: ₹${parseFloat(data.totalDue || 0).toLocaleString()}
Total Invoices: ${data.totalInvoices}
Pending Amount: ₹${parseFloat(data.pendingAmount || 0).toLocaleString()}

TRANSACTION DETAILS:
${data.transactions
  .map(
    (t, i) => `
${i + 1}. Invoice: ${t.invoiceNumber}
Type: ${t.type}
Total Amount: ₹${parseFloat(t.totalAmount || 0).toLocaleString()}
Due Amount: ₹${parseFloat(t.dueAmount || 0).toLocaleString()}
Paid Amount: ₹${parseFloat(t.totalPaidAmount || 0).toLocaleString()}
Status: ${t.isPaid ? "Paid" : "Unpaid"}

Payments:
${
  t.paymentDetails && t.paymentDetails.length > 0
    ? t.paymentDetails
        .map(
          (p) =>
            `   - Date: ${p.paymentDate} | Amount: ₹${parseFloat(
              p.paymentAmount || 0
            ).toLocaleString()} | Mode: ${p.paymentMode} | Txn ID: ${
              p.transactionId
            }`
        )
        .join("\n")
    : "   No payments recorded"
}
`
  )
  .join("\n")}

Generated on: ${new Date().toLocaleString()}
    `;

    // Create and download the file
    const blob = new Blob([pdfContent], {
      type: "text/plain",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.customerName}_transaction_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log("PDF download initiated for:", data.customerName);
  };

  const downloadExcelInView = () => {
    const data = selected?.allTransactions || [];

    // Create CSV content (which Excel can open)
    const headers = [
      "Customer/Vendor",
      "Invoice Number",
      "Type",
      "Total Amount",
      "Due Amount",
      "Paid Amount",
      "Status",
      "Payment Date",
      "Payment Amount",
      "Payment Mode",
      "Transaction ID",
    ];

    let csvContent = headers.join(",") + "\n";

    data.forEach((transaction) => {
      if (transaction.paymentDetails && transaction.paymentDetails.length > 0) {
        transaction.paymentDetails.forEach((payment) => {
          const row = [
            selected?.name || "",
            transaction.invoiceNumber || "",
            transaction.type==="income" || transaction.type==="service" ? "Credit" : "Debit" || "",
            parseFloat(transaction.totalAmount || 0),
            parseFloat(transaction.dueAmount || 0),
            parseFloat(transaction.totalPaidAmount || 0),
            transaction.isPaid ? "Paid" : "Unpaid",
            payment.paymentDate || "",
            parseFloat(payment.paymentAmount || 0),
            payment.paymentMode || "",
            payment.transactionId || "",
          ];
          csvContent +=
            row
              .map((field) =>
                typeof field === "string" && field.includes(",")
                  ? `"${field}"`
                  : field
              )
              .join(",") + "\n";
        });
      } else {
        const row = [
          selected?.name || "",
          transaction.invoiceNumber || "",
          transaction.type || "",
          parseFloat(transaction.totalAmount || 0),
          parseFloat(transaction.dueAmount || 0),
          parseFloat(transaction.totalPaidAmount || 0),
          transaction.isPaid ? "Paid" : "Unpaid",
          "",
          "",
          "",
          "",
        ];
        csvContent += row.join(",") + "\n";
      }
    });

    // Create and download the file
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected?.name}_transaction_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log("Excel download initiated for:", selected?.name);
  };

  // Excel Download Function
  const downloadExcel = () => {
    if (filtered.length === 0) {
      alert("No data to export");
      return;
    }
    // Create CSV content
    const headers = [
      "Name",
      "Type",
      "Total Paid",
      "Total Due",
      "Total Invoices",
      "Pending Amount",
    ];
    const csvContent = [
      headers.join(","),
      ...filtered.map((row) =>
        [
          `"${row.name}"`,
          row.allTransactions && row.allTransactions.length > 0
            ? row.allTransactions[0].type === "income" || row.allTransactions[0].type === "service"
              ? "Credit"
              : "Debit"
            : "N/A",
          row.totalPaidAmount || 0,
          row.totalDueAmount || 0,
          row.totalInvoices || 0,
          row.pendingAmount || 0,
        ].join(",")
      ),
    ].join("\n");
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Tamanna_ledger_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = async () => {
    if (filtered.length === 0) {
      alert("No data to export");
      return;
    }
    try {
      if (typeof window.jsPDF === "undefined") {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        document.head.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      doc.setFont("helvetica");
      doc.setFontSize(18);
      doc.setTextColor(30, 64, 175);
      doc.text("Tamanna All Ledger Report", 105, 18, { align: "center" });
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 26, {
        align: "center",
      });
      const headers = [
        "Name",
        "Type",
        "Total Paid",
        "Total Due",
        "Total Invoices",
        "Pending",
      ];
      const colWidths = [45, 30, 30, 30, 30, 30]; // Fits A4 width (total 195mm, with 10mm margin each side)
      const startX = 10;
      let yPosition = 38;
      const rowHeight = 10;
      // Draw header background
      doc.setFillColor(219, 234, 254);
      doc.rect(
        startX,
        yPosition - 7,
        colWidths.reduce((a, b) => a + b, 0),
        rowHeight,
        "F"
      );
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      let xPosition = startX;
      headers.forEach((header, index) => {
        doc.text(header, xPosition + 2, yPosition, {
          maxWidth: colWidths[index] - 4,
        });
        xPosition += colWidths[index];
      });
      yPosition += rowHeight;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      // Table rows
      filtered.forEach((row, index) => {
        if (yPosition > 275) {
          doc.addPage();
          yPosition = 20;
        }
        xPosition = startX;
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(
            xPosition,
            yPosition - 7,
            colWidths.reduce((a, b) => a + b, 0),
            rowHeight,
            "F"
          );
        }
        const rowData = [
          row.name,
          row.allTransactions && row.allTransactions.length > 0
            ? row.allTransactions[0].type === "income" || row.allTransactions[0].type === "service"
              ? "Credit"
              : "Debit"
            : "N/A",
          `${row.totalPaidAmount.toFixed(2) || 0}`,
          `${row.totalDueAmount.toFixed(2) || 0}`,
          `${row.totalInvoices.toFixed(2) || 0}`,
          `${row.pendingAmount.toFixed(2) || 0}`,
        ];
        rowData.forEach((cell, cellIndex) => {
          doc.text(String(cell), xPosition + 2, yPosition, {
            maxWidth: colWidths[cellIndex] - 4,
          });
          xPosition += colWidths[cellIndex];
        });
        yPosition += rowHeight;
      });
      // Totals row (inside table)
      xPosition = startX;
      doc.setFont("helvetica", "bold");
      doc.setFillColor(255, 243, 205); // Light yellow for totals row
      doc.rect(
        xPosition,
        yPosition - 7,
        colWidths.reduce((a, b) => a + b, 0),
        rowHeight,
        "F"
      );
      const totalPaid = filtered.reduce(
        (sum, row) => sum + (Number(row.totalPaidAmount) || 0),
        0
      );
      const totalDue = filtered.reduce(
        (sum, row) => sum + (Number(row.totalDueAmount) || 0),
        0
      );
      const totalPending = filtered.reduce(
        (sum, row) => sum + (Number(row.pendingAmount) || 0),
        0
      );
      const totalsRow = [
        `Total Records: ${filtered.length}`,
        "",
        `${totalPaid.toFixed(2)}`,
        `${totalDue.toFixed(2)}`,
        "",
        `${totalPending.toFixed(2)}`,
      ];
      totalsRow.forEach((cell, cellIndex) => {
        doc.text(String(cell), xPosition + 2, yPosition, {
          maxWidth: colWidths[cellIndex] - 4,
        });
        xPosition += colWidths[cellIndex];
      });
      yPosition += rowHeight;
      // Draw table borders
      let borderYStart = 38 - 7;
      let borderYEnd = yPosition;
      xPosition = startX;
      for (let i = 0; i <= colWidths.length; i++) {
        const x = xPosition + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.line(x, borderYStart, x, borderYEnd);
      }
      for (let i = 0; i <= filtered.length + 2; i++) {
        const y = borderYStart + i * rowHeight;
        doc.line(startX, y, startX + colWidths.reduce((a, b) => a + b, 0), y);
      }
      const fileName = `Tamanna_ledger_report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Master Ledger Report
                </h1>
                <p className="text-gray-600">
                  Comprehensive financial overview
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadExcel}
                className="flex items-center gap-2 bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                disabled={filtered.length === 0}
              >
                <Download size={16} />
                Excel
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 cursor-pointer bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                disabled={filtered.length === 0}
              >
                <FileText size={16} />
                PDF
              </button>
            </div>
            <button
              onClick={fetchAllLedgers}
              className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-800">
                  {filtered.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalPaid.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Due</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{totalDue.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{totalPending.toLocaleString()}
                </p>
              </div>
              <Receipt className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search Customer/Vendor"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 cursor-pointer border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 cursor-pointer border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="income">Credit</option>
                  <option value="expense">Debit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Range
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Min"
                    type="number"
                    value={amountRange.min}
                    onChange={(e) =>
                      setAmountRange({ ...amountRange, min: e.target.value })
                    }
                  />
                  <input
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Max"
                    type="number"
                    value={amountRange.max}
                    onChange={(e) =>
                      setAmountRange({ ...amountRange, max: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Has Pending</option>
                  <option value="completed">No Pending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left  font-semibold ">
                      Sl.No
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Name
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Type
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Total Paid
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        Total Due
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        Total Invoices
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Pending
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center p-8">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-gray-600">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-8">
                        <div className="text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          No data found.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((row, idx) => (
                      <tr
                        key={row.name + idx}
                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {page * rowsPerPage + idx + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-800">
                            {row.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {row.allTransactions &&
                          row.allTransactions.length > 0 ? (
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                row.allTransactions[0].type === "income"
                                  ? "bg-green-100 text-green-700"
                                  : row.allTransactions[0].type === "service"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {row.allTransactions[0].type === "income" || row.allTransactions[0].type === "service" ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {row.allTransactions[0].type === "income" || row.allTransactions[0].type === "service"
                                ? "Credit"
                                : "Debit"}
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-green-600">
                          ₹
                          {parseFloat(
                            row.totalPaidAmount || 0
                          ).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-orange-600">
                          ₹
                          {parseFloat(row.totalDueAmount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700">
                          {row.totalInvoices}
                        </td>
                        <td className="px-6 py-4 font-medium text-red-600">
                          ₹{parseFloat(row.pendingAmount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="flex items-center cursor-pointer gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                            onClick={() => handleView(row)}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">
                Rows per page:
                <select
                  className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                >
                  {[5, 10, 25, 50].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 px-3 py-1 cursor-pointer border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-sm text-gray-700 px-4">
                Page {page + 1} of{" "}
                {Math.ceil(filtered.length / rowsPerPage) || 1}
              </span>
              <button
                className="flex items-center gap-1 px-3 py-1 cursor-pointer border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= Math.ceil(filtered.length / rowsPerPage) - 1}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal for transaction details */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  <h2 className="text-xl font-bold">
                    Transaction Details for {selected?.name}
                  </h2>
                </div>
                <button
                  className="hover:bg-white cursor-pointer hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                  onClick={handleCloseModal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selected?.allTransactions &&
                selected.allTransactions.length > 0 ? (
                  <>
                    {/* Transaction Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <Receipt className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Total Invoices
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-blue-700">
                          {selected.totalInvoices}
                        </span>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-600 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Total Paid
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-green-700">
                          ₹
                          {parseFloat(
                            selected.totalPaidAmount || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-orange-600 mb-1">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-sm font-medium">Total Due</span>
                        </div>
                        <span className="text-2xl font-bold text-orange-700">
                          ₹
                          {parseFloat(
                            selected.totalDueAmount || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                        <span className="text-2xl font-bold text-red-700">
                          ₹
                          {parseFloat(
                            selected.pendingAmount || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
                      <div className="bg-gray-200 px-4 py-3 border-b">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          All Transactions
                        </h3>
                      </div>
                      <div className="overflow-x-auto max-h-64 overflow-y-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-100 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">
                                Type
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">
                                Invoice #
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">
                                Total Amount
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">
                                Due Amount
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">
                                Paid Amount
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selected.allTransactions.map((t, i) => (
                              <tr
                                key={i}
                                className="border-b border-gray-200 hover:bg-gray-50"
                              >
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                      t.type === "income"
                                        ? "bg-green-100 text-green-700"
                                        : t.type === "service" ?
                                        "bg-blue-100 text-blue-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {t.type === "income" || t.type === "service" ? (
                                      <TrendingUp className="w-3 h-3" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3" />
                                    )}
                                    {t.type==="income" || t.type==="service" ? "Credit": "Debit"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-medium">
                                  {t.invoiceNumber}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                  ₹
                                  {parseFloat(
                                    t.totalAmount || 0
                                  ).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 font-medium text-orange-600">
                                  ₹
                                  {parseFloat(
                                    t.dueAmount || 0
                                  ).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 font-medium text-green-600">
                                  ₹
                                  {parseFloat(
                                    t.totalPaidAmount || 0
                                  ).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                      t.isPaid
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {t.isPaid ? "✓ Paid" : "✗ Unpaid"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="bg-gray-200 px-4 py-3 border-b">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Payment Details
                        </h3>
                      </div>
                      <div className="p-4 max-h-64 overflow-y-auto">
                        {selected.allTransactions.map((t, i) => (
                          <div
                            key={i}
                            className="bg-white border rounded-lg p-4 mb-4 last:mb-0"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-gray-800">
                                  Invoice: {t.invoiceNumber}
                                </span>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  t.isPaid
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {t.isPaid ? "Paid" : "Unpaid"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                              <div>
                                <span className="text-gray-600">Total:</span>
                                <span className="ml-1 font-medium">
                                  ₹
                                  {parseFloat(
                                    t.totalAmount || 0
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Due:</span>
                                <span className="ml-1 font-medium text-orange-600">
                                  ₹
                                  {parseFloat(
                                    t.dueAmount || 0
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Paid:</span>
                                <span className="ml-1 font-medium text-green-600">
                                  ₹
                                  {parseFloat(
                                    t.totalPaidAmount || 0
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {t.paymentDetails && t.paymentDetails.length > 0 ? (
                              <div className="border-t pt-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <CreditCard className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-gray-700">
                                    Payment History
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {t.paymentDetails.map((pay, payIdx) => (
                                    <div
                                      key={payIdx}
                                      className="bg-blue-50 rounded-lg p-3 text-sm"
                                    >
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <div>
                                          <span className="text-gray-600">
                                            Date:
                                          </span>
                                          <div className="font-medium">
                                            {pay.paymentDate}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Amount:
                                          </span>
                                          <div className="font-medium text-green-600">
                                            ₹
                                            {parseFloat(
                                              pay.paymentAmount || 0
                                            ).toLocaleString()}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Mode:
                                          </span>
                                          <div className="font-medium">
                                            {pay.paymentMode}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Txn ID:
                                          </span>
                                          <div className="font-medium">
                                            {pay.transactionId}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="border-t pt-3 text-center text-gray-500">
                                <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <span>No payment records found</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <div className="text-gray-600">
                      No transactions found for this record.
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t bg-gray-50 px-6 py-4 rounded-b-xl">
                <div className="flex justify-end gap-3">
                  <button
                    className="flex items-center cursor-pointer gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={handleCloseModal}
                  >
                    <X className="w-4 h-4" />
                    Close
                  </button>
                  <button
                    className="flex items-center cursor-pointer gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      downloadPDFInView();
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                  <button
                    className="flex items-center cursor-pointer gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      downloadExcelInView();
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Export Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnigdhaAllLedgerReportPage;
