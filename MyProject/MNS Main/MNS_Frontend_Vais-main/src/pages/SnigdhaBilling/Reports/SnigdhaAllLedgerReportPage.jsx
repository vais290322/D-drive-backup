import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
import XLSX from "xlsx-js-style";
import ExcelJS from "exceljs";
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
  // console.log(data);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState("all");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

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
        return filterType === "income"
          ? type === "income"
          : filterType === "service"
            ? type === "service"
            : type === "expense";
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
  const totalInvoiceValue = filtered.reduce(
    (sum, item) => sum + (parseFloat(item.totalInvoicesValue) || 0),
    0
  );

  // Pagination logic
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // console.log("paginated : ",paginated)

  const downloadPDFInView = () => {
    const data = {
      customerName: selected?.name,
      totalPaid: selected?.totalPaidAmount,
      totalDue: selected?.totalDueAmount,
      totalInvoices: selected?.totalInvoices,
      pendingAmount: selected?.pendingAmount,
      transactions: selected?.allTransactions || [],
      totalInvoicesValue: selected?.totalInvoicesValue,
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
      [
        "Total Invoices Value:",
        `${parseFloat(data.totalInvoicesValue || 0).toLocaleString()}`,
      ],
      ["Total Paid:", `${parseFloat(data.totalPaid || 0).toLocaleString()}`],
      ["Total Due:", `${parseFloat(data.totalDue || 0).toLocaleString()}`],
      ["Total Invoices:", data.totalInvoices || 0],

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
        transaction.type === "income" || transaction.type === "service"
          ? "Credit"
          : "Debit" || "N/A",
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
    const fileName = `${data.customerName || "Customer"
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
${t.paymentDetails && t.paymentDetails.length > 0
              ? t.paymentDetails
                .map(
                  (p) =>
                    `   - Date: ${p.paymentDate} | Amount: ₹${parseFloat(
                      p.paymentAmount || 0
                    ).toLocaleString()} | Mode: ${p.paymentMode} | Txn ID: ${p.transactionId
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
    console.log("data", data[0].invoice.receiverDetails.name);
    // Find min & max dates from paymentDetails or transaction date
    let allDates = [];
    data.forEach((transaction) => {
      if (transaction.paymentDetails?.length > 0) {
        transaction.paymentDetails.forEach((payment) => {
          if (payment.paymentDate) allDates.push(new Date(payment.paymentDate));
        });
      }
    });

    let fromDate = allDates.length
      ? new Date(Math.min(...allDates)).toLocaleDateString()
      : "";
    let toDate = allDates.length
      ? new Date(Math.max(...allDates)).toLocaleDateString()
      : "";
    let name = data[0].invoice.receiverDetails.name
    // Prepare data for Excel
    const wsData = [
      ["Vaibhav Service Limited"],
      ["Ledger Accounts"],
      [`From: ${fromDate}   To: ${toDate}`],
      [],
      [
        "Invoice Number",
        "Type",
        "Total Amount",
        "Payment Date",
        "Payment Amount",
      ],
    ];

    let lastInvoiceNumber = null;
    let lastType = null;
    let lastAmount = null;

    let totalAmountSum = 0;
    let totalPaymentSum = 0;

    // Push transaction rows
    data.forEach((transaction) => {
      let invoiceNum = transaction.invoiceNumber || "";
      const isSameInvoice = invoiceNum === lastInvoiceNumber;

      if (isSameInvoice) {
        invoiceNum = "REPEAT";
      } else {
        lastInvoiceNumber = transaction.invoiceNumber || "";
      }

      let currentType =
        transaction.type === "income" || transaction.type === "service"
          ? "Credit"
          : "Debit";
      // let typeDisplay = currentType;
      let typeDisplay = isSameInvoice ? "REPEAT" : currentType;

      if (lastType !== null && currentType === lastType) {
        typeDisplay = "REPEAT";
      }
      lastType = currentType;

      let currentAmount = parseFloat(transaction.totalAmount || 0).toFixed(2);
      // let amountDisplay = currentAmount;
      let amountDisplay = isSameInvoice ? "REPEAT" : currentAmount;


      // if (lastAmount !== null && currentAmount === lastAmount ) {
      //   amountDisplay = "REPEAT";
      // }

      lastAmount = currentAmount;

      // if (amountDisplay !== "REPEAT") {
      //   totalAmountSum += parseFloat(currentAmount);
      // }

      if (!isSameInvoice) {
        totalAmountSum += parseFloat(currentAmount);
      }

      if (transaction.paymentDetails && transaction.paymentDetails.length > 0) {
        transaction.paymentDetails.forEach((payment) => {
          wsData.push([
            invoiceNum,
            typeDisplay,
            amountDisplay,
            payment.paymentDate || "",
            parseFloat(payment.paymentAmount || 0),
          ]);

          totalPaymentSum += parseFloat(payment.paymentAmount || 0);

          invoiceNum = "REPEAT";
          typeDisplay = "REPEAT";
          amountDisplay = "REPEAT";
        });
      } else {
        wsData.push([invoiceNum, typeDisplay, amountDisplay, "", ""]);
      }
    });

    // Add totals and balance before creating the worksheet
    wsData.push([]);
    wsData.push([
      "TOTAL",
      "",
      totalAmountSum.toFixed(2),
      "",
      totalPaymentSum.toFixed(2),
    ]);

    let balance = totalAmountSum - totalPaymentSum;
    wsData.push(["BALANCE", "", "", "", balance.toFixed(2)]);

    // Create worksheet after all data is added
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Define border style
    const borderStyle = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    };

    // Apply borders to all cells with data
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);

        // Skip if cell doesn't exist
        if (!ws[cell_ref]) continue;

        // Apply border style
        ws[cell_ref].s = ws[cell_ref].s || {};
        ws[cell_ref].s.border = borderStyle;

        // Special styling for headers (row 4 - zero-indexed)
        if (R === 4) {
          ws[cell_ref].s = {
            ...ws[cell_ref].s,
            font: { bold: true },
            fill: { fgColor: { rgb: "D3D3D3" } } // light gray background
          };
        }

        // Special styling for totals and balance rows
        if (R >= range.e.r - 2) { // Last 3 rows (empty, TOTAL, BALANCE)
          ws[cell_ref].s = {
            ...ws[cell_ref].s,
            font: { bold: true }
          };
        }
      }
    }

    // Merge heading cells
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
    ];

    // Apply styles to headings
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          {
            v: `${name}`,
            s: {
              font: { bold: true, sz: 20 },
              alignment: { horizontal: "center" },
              border: borderStyle
            },
          },
        ],
      ],
      { origin: "A1" }
    );

    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          {
            v: "Ledger Accounts",
            s: {
              font: { bold: true, sz: 14 },
              alignment: { horizontal: "center" },
              border: borderStyle
            },
          },
        ],
      ],
      { origin: "A2" }
    );

    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          {
            v: `From: ${fromDate}   To: ${toDate}`,
            s: {
              font: { bold: true, sz: 12 },
              alignment: { horizontal: "center" },
              border: borderStyle
            },
          },
        ],
      ],
      { origin: "A3" }
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger Report");

    // Set column widths for better visibility
    ws['!cols'] = [
      { wch: 15 }, // Invoice Number
      { wch: 10 }, // Type
      { wch: 15 }, // Total Amount
      { wch: 15 }, // Payment Date
      { wch: 15 }  // Payment Amount
    ];

    XLSX.writeFile(wb, `${selected?.name}_transaction_report.xlsx`);
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
            ? row.allTransactions[0].type === "income" ||
              row.allTransactions[0].type === "service"
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
      `snigdha_ledger_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };




  const downloadLedgerExcel = async () => {
    if (filtered.length === 0) {
      alert("No data to export");
      return;
    }
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(" Ledger");

      // Set column widths - only 6 columns now
      worksheet.columns = [
        { header: "Date", key: "date", width: 12 },
        { header: "Customer", key: "customerVendor", width: 25 },
        { header: "TXN No.", key: "txnNo", width: 15 },
        { header: "Type", key: "type", width: 12 },
        { header: "Inv Amount", key: "invAmount", width: 15 },
        { header: "Payment", key: "payment", width: 12 },
        { header: "Pending Amount", key: "pendingAmount", width: 18 }
      ];

      // Add title and header styling
      worksheet.mergeCells('A1:G1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'All Ledger';
      titleCell.font = { bold: true, size: 16 };
      titleCell.alignment = { horizontal: 'center' };

      worksheet.mergeCells('A2:G2');
      const subtitleCell = worksheet.getCell('A2');
      subtitleCell.value = 'Sales Ledger Accounts';
      subtitleCell.font = { bold: true, size: 12 };
      subtitleCell.alignment = { horizontal: 'center' };

      worksheet.mergeCells('A3:G3');
      const dateRangeCell = worksheet.getCell('A3');

      // Handle date range
      let fromDateStr = 'N/A';
      let toDateStr = 'N/A';

      if (dateRange.from && dateRange.to) {
        fromDateStr = new Date(dateRange.from).toLocaleDateString('en-GB');
        toDateStr = new Date(dateRange.to).toLocaleDateString('en-GB');
      } else if (dateRange.from) {
        fromDateStr = new Date(dateRange.from).toLocaleDateString('en-GB');
        toDateStr = 'Present';
      } else if (dateRange.to) {
        fromDateStr = 'Beginning';
        toDateStr = new Date(dateRange.to).toLocaleDateString('en-GB');
      } else {
        // Calculate from actual data
        if (filtered.length > 0) {
          let allDates = [];
          filtered.forEach(ledger => {
            if (ledger.allTransactions && ledger.allTransactions.length > 0) {
              ledger.allTransactions.forEach(transaction => {
                if (transaction.paymentDetails && transaction.paymentDetails.length > 0) {
                  transaction.paymentDetails.forEach(payment => {
                    if (payment.paymentDate) {
                      allDates.push(new Date(payment.paymentDate));
                    }
                  });
                }
                if (transaction.invoice && transaction.invoice.date) {
                  allDates.push(new Date(transaction.invoice.date));
                }
              });
            }
          });

          if (allDates.length > 0) {
            allDates.sort((a, b) => a - b);
            fromDateStr = allDates[0].toLocaleDateString('en-GB');
            toDateStr = allDates[allDates.length - 1].toLocaleDateString('en-GB');
          } else {
            const currentDate = new Date().toLocaleDateString('en-GB');
            fromDateStr = currentDate;
            toDateStr = currentDate;
          }
        }
      }

      dateRangeCell.value = `From Date: ${fromDateStr} to ${toDateStr}`;
      dateRangeCell.font = { size: 10 };
      dateRangeCell.alignment = { horizontal: 'center' };

      // Add headers at row 5
      const headerRow = worksheet.getRow(5);
      headerRow.values = ["Date", "Customer/Vendor", "TXN No.", "Type", "Inv Amount", "Payment", "Pending Amount"];

      // Style header row
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
      headerRow.alignment = { horizontal: "center", vertical: "middle" };
      headerRow.height = 20;
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });

      let currentRow = 6;
      let grandTotalInvAmount = 0;
      let grandTotalPayment = 0;
      let grandTotalPending = 0;

      // Helper function to format date
      const formatDateForExcel = (dateString) => {
        if (!dateString) return '';
        try {
          return new Date(dateString).toLocaleDateString('en-GB');
        } catch {
          return dateString;
        }
      };

      // Helper function to style data rows
      const styleDataRow = (row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };
          cell.alignment = { vertical: "middle", horizontal: "left" };
        });

        // Right align amount columns
        const amountCell5 = row.getCell(5); // Inv Amount
        const amountCell6 = row.getCell(6); // Payment
        const amountCell7 = row.getCell(7); // Pending Amount

        [amountCell5, amountCell6, amountCell7].forEach(cell => {
          if (cell.value !== "" && cell.value != null && cell.value !== undefined && cell.value !== 0) {
            cell.alignment = { horizontal: "right", vertical: "middle" };
            cell.numFmt = '#,##0.00';
          }
        });

        // Center align date and type columns
        row.getCell(1).alignment = { horizontal: "center", vertical: "middle" }; // Date
        row.getCell(4).alignment = { horizontal: "center", vertical: "middle" }; // Type
      };

      // Sort filtered data by name
      const sortedData = [...filtered].sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      // Process each customer/vendor
      sortedData.forEach((ledger) => {
        const customerStartRow = currentRow;
        let customerTotalInvAmount = 0;
        let customerTotalPayment = 0;
        let customerPendingAmount = parseFloat(ledger.pendingAmount) || 0;

        const transactions = ledger.allTransactions || [];

        // Sort transactions by invoice date or payment date
        const sortedTransactions = [...transactions].sort((a, b) => {
          const dateA = new Date(a.invoice?.date || a.paymentDetails?.[0]?.paymentDate || 0);
          const dateB = new Date(b.invoice?.date || b.paymentDetails?.[0]?.paymentDate || 0);
          return dateA - dateB;
        });

        // Process each transaction
        sortedTransactions.forEach((transaction, transactionIndex) => {
          const invoiceAmount = parseFloat(transaction.totalAmount) || 0;

          // Add main transaction row (Sales/Purchase)
          const transactionData = [
            formatDateForExcel(transaction.invoice?.date || new Date()),
            transactionIndex === 0 ? ledger.name : "", // Only show name on first row
            transaction.invoiceNumber || "",
            transaction.type === 'income' || transaction.type === 'service' ? 'Sales' : 'Purchase',
            invoiceAmount,
            "", // Empty payment column
            "" // Empty pending amount column for transaction rows
          ];

          const transactionRow = worksheet.addRow(transactionData);
          styleDataRow(transactionRow);
          currentRow++;

          customerTotalInvAmount += invoiceAmount;

          // Add payment rows
          if (transaction.paymentDetails && Array.isArray(transaction.paymentDetails) && transaction.paymentDetails.length > 0) {
            const sortedPayments = [...transaction.paymentDetails].sort((a, b) => {
              return new Date(a.paymentDate) - new Date(b.paymentDate);
            });

            sortedPayments.forEach((payment) => {
              const paymentAmount = parseFloat(payment.paymentAmount) || 0;
              const paymentData = [
                formatDateForExcel(payment.paymentDate),
                "", // Empty customer name
                payment.transactionId || "",
                "Rcpt",
                "", // Empty inv amount
                paymentAmount,
                "" // Empty pending amount for payment rows
              ];

              const paymentRow = worksheet.addRow(paymentData);
              styleDataRow(paymentRow);
              currentRow++;
              customerTotalPayment += paymentAmount;
            });
          }
        });

        // Add customer total row
        if (sortedTransactions.length > 0) {
          const customerTotalData = [
            "",
            "",
            "",
            "",
            customerTotalInvAmount,
            customerTotalPayment,
            customerPendingAmount
          ];

          const customerTotalRow = worksheet.addRow(customerTotalData);
          customerTotalRow.font = { bold: true };
          customerTotalRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFACD" } }; // Light yellow
          styleDataRow(customerTotalRow);
          currentRow++;
        }

        // Merge customer name cells if multiple rows
        const customerEndRow = currentRow - 2; // -2 because we added a total row
        if (customerEndRow > customerStartRow) {
          try {
            worksheet.mergeCells(`B${customerStartRow}:B${customerEndRow}`);
            const mergedCell = worksheet.getCell(`B${customerStartRow}`);
            mergedCell.value = ledger.name;
            mergedCell.alignment = { vertical: "middle", horizontal: "left" };
            mergedCell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" }
            };
          } catch (error) {
            console.log("Merge error:", error);
          }
        }

        grandTotalInvAmount += customerTotalInvAmount;
        grandTotalPayment += customerTotalPayment;
        grandTotalPending += customerPendingAmount;
      });

      // Add empty row before grand total
      worksheet.addRow([]);
      currentRow++;

      // Add Grand Total row
      const grandTotalData = [
        "",
        "",
        "",
        "Total",
        grandTotalInvAmount,
        grandTotalPayment,
        grandTotalPending
      ];

      const grandTotalRow = worksheet.addRow(grandTotalData);
      grandTotalRow.font = { bold: true };
      grandTotalRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9EDF7" } };
      grandTotalRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thick" },
          left: { style: "thin" },
          bottom: { style: "thick" },
          right: { style: "thin" }
        };
      });

      // Format number columns in grand total
      [5, 6, 7].forEach((colIndex) => {
        const cell = grandTotalRow.getCell(colIndex);
        cell.alignment = { horizontal: "right", vertical: "middle" };
        cell.numFmt = '#,##0.00';
      });

      // Center align "Total" text
      grandTotalRow.getCell(4).alignment = { horizontal: "center", vertical: "middle" };

      // Save the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `all_ledger_report_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("Excel export completed successfully!");
      alert("Excel exported successfully!");

    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Failed to export Excel: " + error.message);
    }
  };

  const downloadPDF = async () => {
    if (filtered.length === 0) {
      alert("No data to export");
      return;
    }

    try {
      // Ensure jsPDF is loaded
      if (typeof window.jsPDF === "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
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

      // Helper function to format date
      const formatDateForPDF = (dateString) => {
        if (!dateString) return '';
        try {
          return new Date(dateString).toLocaleDateString('en-GB');
        } catch {
          return dateString;
        }
      };

      // Set up fonts and colors
      doc.setFont("helvetica");

      // Title
      doc.setFontSize(18);
      doc.setTextColor(30, 64, 175);
      doc.text("Ledger", 105, 15, { align: "center" });

      // Subtitle
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Sales Ledger Accounts", 105, 23, { align: "center" });

      // Date range
      let fromDateStr = 'N/A';
      let toDateStr = 'N/A';

      if (dateRange.from && dateRange.to) {
        fromDateStr = new Date(dateRange.from).toLocaleDateString('en-GB');
        toDateStr = new Date(dateRange.to).toLocaleDateString('en-GB');
      } else if (dateRange.from) {
        fromDateStr = new Date(dateRange.from).toLocaleDateString('en-GB');
        toDateStr = 'Present';
      } else if (dateRange.to) {
        fromDateStr = 'Beginning';
        toDateStr = new Date(dateRange.to).toLocaleDateString('en-GB');
      } else {
        // Calculate from actual data
        if (filtered.length > 0) {
          let allDates = [];
          filtered.forEach(ledger => {
            if (ledger.allTransactions && ledger.allTransactions.length > 0) {
              ledger.allTransactions.forEach(transaction => {
                if (transaction.paymentDetails && transaction.paymentDetails.length > 0) {
                  transaction.paymentDetails.forEach(payment => {
                    if (payment.paymentDate) {
                      allDates.push(new Date(payment.paymentDate));
                    }
                  });
                }
                if (transaction.invoice && transaction.invoice.date) {
                  allDates.push(new Date(transaction.invoice.date));
                }
              });
            }
          });

          if (allDates.length > 0) {
            allDates.sort((a, b) => a - b);
            fromDateStr = allDates[0].toLocaleDateString('en-GB');
            toDateStr = allDates[allDates.length - 1].toLocaleDateString('en-GB');
          } else {
            const currentDate = new Date().toLocaleDateString('en-GB');
            fromDateStr = currentDate;
            toDateStr = currentDate;
          }
        }
      }

      doc.setFontSize(10);
      doc.text(`From Date: ${fromDateStr} to ${toDateStr}`, 105, 30, { align: "center" });

      // Table setup
      const startY = 40;
      let currentY = startY;
      const pageHeight = doc.internal.pageSize.height;
      const marginBottom = 20;

      // Column definitions
      const columns = [
        { header: "Date", width: 20, x: 10 },
        { header: "Customer", width: 40, x: 30 },
        { header: "TXN No.", x: 70, width: 25 },
        { header: "Type", x: 95, width: 18 },
        { header: "Inv Amount", x: 113, width: 25 },
        { header: "Payment", x: 138, width: 25 },
        { header: "Pending Amount", x: 163, width: 27 }
      ];

      // Helper function to draw table headers
      const drawHeaders = (y) => {
        doc.setFillColor(70, 130, 180); // Steel blue
        doc.rect(10, y - 5, 180, 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");

        columns.forEach(col => {
          doc.text(col.header, col.x + 1, y + 1);
        });

        // Reset colors
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        return y + 8;
      };

      // Helper function to check if new page is needed
      const checkNewPage = (requiredSpace) => {
        if (currentY + requiredSpace > pageHeight - marginBottom) {
          doc.addPage();
          currentY = 20;
          currentY = drawHeaders(currentY);
        }
      };

      // Draw initial headers
      currentY = drawHeaders(currentY);

      // Sort filtered data by name
      const sortedData = [...filtered].sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      let grandTotalInvAmount = 0;
      let grandTotalPayment = 0;
      let grandTotalPending = 0;

      // Process each customer/vendor
      sortedData.forEach((ledger, ledgerIndex) => {
        let customerTotalInvAmount = 0;
        let customerTotalPayment = 0;
        let customerPendingAmount = parseFloat(ledger.pendingAmount) || 0;

        const transactions = ledger.allTransactions || [];

        // Sort transactions by invoice date or payment date
        const sortedTransactions = [...transactions].sort((a, b) => {
          const dateA = new Date(a.invoice?.date || a.paymentDetails?.[0]?.paymentDate || 0);
          const dateB = new Date(b.invoice?.date || b.paymentDetails?.[0]?.paymentDate || 0);
          return dateA - dateB;
        });

        let customerStartY = currentY;
        let customerRowsData = []; // Store all row data for this customer

        // First, collect all transaction and payment data for this customer
        sortedTransactions.forEach((transaction) => {
          const invoiceAmount = parseFloat(transaction.totalAmount) || 0;

          // Add transaction row data
          customerRowsData.push({
            type: 'transaction',
            date: formatDateForPDF(transaction.invoice?.date || new Date()),
            txnNo: transaction.invoiceNumber || "",
            rowType: transaction.type === 'income' || transaction.type === 'service' ? 'Sales' : 'Purchase',
            invAmount: invoiceAmount,
            payment: '',
            pending: ''
          });

          customerTotalInvAmount += invoiceAmount;

          // Add payment rows
          if (transaction.paymentDetails && Array.isArray(transaction.paymentDetails) && transaction.paymentDetails.length > 0) {
            const sortedPayments = [...transaction.paymentDetails].sort((a, b) => {
              return new Date(a.paymentDate) - new Date(b.paymentDate);
            });

            sortedPayments.forEach((payment) => {
              const paymentAmount = parseFloat(payment.paymentAmount) || 0;
              customerRowsData.push({
                type: 'payment',
                date: formatDateForPDF(payment.paymentDate),
                txnNo: payment.transactionId || "",
                rowType: 'Rcpt',
                invAmount: '',
                payment: paymentAmount,
                pending: ''
              });
              customerTotalPayment += paymentAmount;
            });
          }
        });

        // Now draw all rows for this customer
        const customerNameStartY = currentY;
        let customerNameEndY = currentY;

        customerRowsData.forEach((rowData, rowIndex) => {
          // Check space for row
          checkNewPage(6);

          const rowY = currentY;

          // Alternate row coloring
          if ((ledgerIndex + rowIndex) % 2 === 0) {
            doc.setFillColor(248, 249, 250);
            doc.rect(10, rowY - 2, 180, 6, 'F');
          }

          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");

          // Date
          doc.text(rowData.date, 11, rowY + 2);

          // Don't draw customer name here - we'll draw it later as merged cell


          // Transaction Number
          doc.text(rowData.txnNo.substring(0, 15), 71, rowY + 2);

          // Type
          doc.text(rowData.rowType, 96, rowY + 2);

          // Invoice Amount
          if (rowData.invAmount !== '') {
            doc.text(rowData.invAmount.toFixed(2), 133, rowY + 2, { align: 'right' });
          }

          // Payment Amount
          if (rowData.payment !== '') {
            doc.text(rowData.payment.toFixed(2), 158, rowY + 2, { align: 'right' });
          }

          // Draw border (skip customer name column for now)
          doc.setLineWidth(0.1);
          doc.setDrawColor(200, 200, 200);
          // Draw all borders except customer name column
          doc.rect(10, rowY - 2, 20, 6); // Date column
          doc.rect(70, rowY - 2, 25, 6); // TXN No column
          doc.rect(95, rowY - 2, 18, 6); // Type column
          doc.rect(113, rowY - 2, 25, 6); // Inv Amount column
          doc.rect(138, rowY - 2, 25, 6); // Payment column
          doc.rect(163, rowY - 2, 27, 6); // Pending Amount column

          currentY += 6;
          customerNameEndY = currentY;
        });

        // Now draw the merged customer name cell
        if (customerRowsData.length > 0) {
          const cellHeight = customerNameEndY - customerNameStartY;
          const cellY = customerNameStartY - 2;

          // Draw customer name cell background and border
          doc.setFillColor(255, 255, 255);
          doc.rect(30, cellY, 40, cellHeight, 'FD');

          // Calculate center position for text
          const textY = customerNameStartY + (cellHeight / 2) + 1;

          // Draw customer name centered
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          const customerName = ledger.name.substring(0, 25);
          doc.text(customerName, 50, textY, { align: 'center' });
        }

        // Add customer total row
        if (sortedTransactions.length > 0) {
          checkNewPage(8);

          // Customer total background
          doc.setFillColor(255, 248, 220); // Light yellow
          doc.rect(10, currentY - 2, 180, 6, 'F');

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);

          // Customer totals
          doc.text(customerTotalInvAmount.toFixed(2), 133, currentY + 2, { align: 'right' });
          doc.text(customerTotalPayment.toFixed(2), 158, currentY + 2, { align: 'right' });
          doc.text(customerPendingAmount.toFixed(2), 185, currentY + 2, { align: 'right' });

          // Draw border with thicker bottom line
          doc.setLineWidth(0.2);
          doc.rect(10, currentY - 2, 180, 6);

          currentY += 8; // Extra space after customer total
        }

        grandTotalInvAmount += customerTotalInvAmount;
        grandTotalPayment += customerTotalPayment;
        grandTotalPending += customerPendingAmount;
      });

      // Add grand total
      checkNewPage(12);

      // Empty row before grand total
      currentY += 4;

      // Grand total background
      doc.setFillColor(217, 237, 247); // Light blue
      doc.rect(10, currentY - 2, 180, 8, 'F');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);

      // "Total" label
      doc.text("Total", 105, currentY + 3, { align: 'center' });

      // Grand totals
      doc.text(grandTotalInvAmount.toFixed(2), 133, currentY + 3, { align: 'right' });
      doc.text(grandTotalPayment.toFixed(2), 158, currentY + 3, { align: 'right' });
      doc.text(grandTotalPending.toFixed(2), 185, currentY + 3, { align: 'right' });

      // Draw thick border for grand total
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.rect(10, currentY - 2, 180, 8);

      // Add page numbers and generation date to all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(128, 128, 128);

        // Generation date
        doc.text(
          `Generated on: ${new Date().toLocaleString()}`,
          10,
          pageHeight - 5
        );

        // Page number
        doc.text(
          `Page ${i} of ${pageCount}`,
          200 - 10,
          pageHeight - 5,
          { align: 'right' }
        );
      }

      // Save the PDF
      const fileName = `all_ledger_report_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);

      console.log("PDF export completed successfully!");
      alert("PDF exported successfully!");

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
                  Snigdha Master Ledger Report
                </h1>
                <p className="text-gray-600">
                  Comprehensive financial overview
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadLedgerExcel}
                className="flex items-center gap-2 bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                disabled={filtered.length === 0}
              >
                <Download size={16} />
                Excel
              </button>
              {/* <button
                onClick={downloadExcel}
                className="flex items-center gap-2 bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                disabled={filtered.length === 0}
              >
                <Download size={16} />
                Excel
              </button> */}
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
                <p className="text-sm text-gray-600">Total Invoices Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{totalInvoiceValue.toLocaleString()}
                </p>
              </div>
              <Receipt className="w-8 h-8 text-blue-600" />
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
                        Total
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
                    {/* <th className="px-6 py-4 text-left font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Pending
                      </div>
                    </th> */}
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
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${row.allTransactions[0].type === "income"
                                ? "bg-green-100 text-green-700"
                                : row.allTransactions[0].type === "service"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                              {row.allTransactions[0].type === "income" ||
                                row.allTransactions[0].type === "service" ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {row.allTransactions[0].type === "income" ||
                                row.allTransactions[0].type === "service"
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
                            row.totalInvoicesValue || 0
                          ).toLocaleString()}
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
                        {/* <td className="px-6 py-4 font-medium text-red-600">
                          ₹{parseFloat(row.pendingAmount || 0).toLocaleString()}
                        </td> */}
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

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <Receipt className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Total Invoices Value
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-blue-700">
                          {selected.totalInvoicesValue}
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

                      {/* <div className="bg-red-50 rounded-lg p-4">
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
                      </div> */}

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
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${t.type === "income"
                                      ? "bg-green-100 text-green-700"
                                      : t.type === "service"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-yellow-100 text-yellow-700"
                                      }`}
                                  >
                                    {t.type === "income" ||
                                      t.type === "service" ? (
                                      <TrendingUp className="w-3 h-3" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3" />
                                    )}
                                    {t.type === "income" || t.type === "service"
                                      ? "Credit"
                                      : "Debit"}
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
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${t.isPaid
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
                                className={`px-2 py-1 rounded-full text-xs font-medium ${t.isPaid
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
                  {/* <LedgerReport /> */}
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
