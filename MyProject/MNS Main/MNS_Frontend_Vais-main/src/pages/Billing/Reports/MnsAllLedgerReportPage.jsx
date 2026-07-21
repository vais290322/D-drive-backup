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
import isBetween from "dayjs/plugin/isBetween";
import { FaChevronDown } from "react-icons/fa6";
import { backendDomainA } from "../../../Common/index";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import XLSX from "xlsx-js-style";

// Extend dayjs with isBetween plugin
dayjs.extend(isBetween);

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

  // Add date range state
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null
  });

  useEffect(() => {
    fetchAllLedgers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [data, search, filterType, amountRange, statusFilter, dateRange]);

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
        const amount = parseFloat(item?.totalDueAmount || item?.totalPaidAmount);
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

    // Date range filtering
    if (dateRange.from || dateRange.to) {
      result = result.filter(item => {
        return item.invoices.some(invoice => {
          if (invoice.paymentDetails && invoice.paymentDetails.length > 0) {
            return invoice.paymentDetails.some(payment => {
              const paymentDate = dayjs(payment.paymentDate);
              const fromDate = dateRange.from ? dayjs(dateRange.from) : null;
              const toDate = dateRange.to ? dayjs(dateRange.to) : null;

              if (fromDate && toDate) {
                return paymentDate.isBetween(fromDate, toDate, 'day', '[]');
              } else if (fromDate) {
                return paymentDate.isAfter(fromDate, 'day') || paymentDate.isSame(fromDate, 'day');
              } else if (toDate) {
                return paymentDate.isBefore(toDate, 'day') || paymentDate.isSame(toDate, 'day');
              }
              return true;
            });
          }
          return false;
        });
      });
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
    setDateRange({ from: null, to: null });
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
  const downloadExcel = async () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ledger");

      // Set column widths
      worksheet.columns = [
        { header: "Date", key: "date", width: 12 },
        { header: "Customer", key: "customerVendor", width: 25 },
        { header: "TXN No.", key: "txnNo", width: 15 },
        { header: "Type", key: "type", width: 8 },
        { header: "Inv Amount", key: "invAmount", width: 12 },
        { header: "Payment", key: "payment", width: 12 },
        { header: "Pending Amount", key: "pendingAmount", width: 20 }
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

      // Handle date range - use selected date range or calculate from data
      let fromDateStr = 'N/A';
      let toDateStr = 'N/A';

      if (dateRange.from && dateRange.to) {
        // Use selected date range
        fromDateStr = dayjs(dateRange.from).format('DD-MM-YYYY');
        toDateStr = dayjs(dateRange.to).format('DD-MM-YYYY');
      } else if (dateRange.from) {
        // Only from date selected
        fromDateStr = dayjs(dateRange.from).format('DD-MM-YYYY');
        toDateStr = 'Present';
      } else if (dateRange.to) {
        // Only to date selected
        fromDateStr = 'Beginning';
        toDateStr = dayjs(dateRange.to).format('DD-MM-YYYY');
      } else {
        // Calculate from actual data
        if (filteredData.length > 0) {
          let allDates = [];

          filteredData.forEach(ledger => {
            ledger.invoices.forEach(invoice => {
              if (invoice.paymentDetails && invoice.paymentDetails.length > 0) {
                invoice.paymentDetails.forEach(payment => {
                  if (payment.paymentDate) {
                    allDates.push(new Date(payment.paymentDate));
                  }
                });
              }
            });
          });

          if (allDates.length > 0) {
            allDates.sort((a, b) => a - b);
            fromDateStr = dayjs(allDates[0]).format('DD-MM-YYYY');
            toDateStr = dayjs(allDates[allDates.length - 1]).format('DD-MM-YYYY');
          } else {
            const currentDate = dayjs().format('DD-MM-YYYY');
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
          return dayjs(dateString).format('DD/MM/YYYY');
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
        ["invAmount", "payment", "pendingAmount"].forEach((key) => {
          const cell = row.getCell(key);
          if (cell.value !== "" && cell.value != null && cell.value !== undefined) {
            cell.alignment = { horizontal: "right", vertical: "middle" };
            cell.numFmt = '#,##0.00';
          }
        });

        // Center align specific columns
        ["date", "type"].forEach((key) => {
          const cell = row.getCell(key);
          if (cell.value !== "" && cell.value != null && cell.value !== undefined) {
            cell.alignment = { horizontal: "center", vertical: "middle" };
          }
        });
      };

      // Sort filteredData in ascending order by name
      const sortedData = [...filteredData].sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      // Process each customer/vendor in sorted order
      sortedData.forEach((ledger) => {
        const customerStartRow = currentRow;
        let customerTotalInvAmount = 0;
        let customerTotalPayment = 0;
        let customerTotalPending = 0;

        // Sort invoices by invoice number in ascending order
        const sortedInvoices = [...ledger.invoices].sort((a, b) => {
          return a.invoiceNumber.toLowerCase().localeCompare(b.invoiceNumber.toLowerCase());
        });

        // Add invoice rows for this customer
        sortedInvoices.forEach((invoice, invoiceIndex) => {
          const invoiceAmount = parseFloat(invoice.totalAmount) || 0;
          const paidAmount = parseFloat(invoice.totalPaidAmount) || 0;
          const pendingAmount = parseFloat(invoice.dueAmount) || 0;

          // Add invoice row
          const invoiceData = {
            date: formatDateForExcel(invoice.paymentDetails?.[0]?.paymentDate || new Date()),
            customerVendor: invoiceIndex === 0 ? ledger.name : "",
            txnNo: invoice.invoiceNumber || "",
            type: ledger.type === 'income' ? 'Sales' : 'Purchase',
            invAmount: invoiceAmount,
            payment: "",
            pendingAmount: invoiceIndex === sortedInvoices.length - 1 ? pendingAmount : ""
          };

          const invoiceRow = worksheet.addRow(invoiceData);
          styleDataRow(invoiceRow);
          currentRow++;

          // Add payment detail rows - sort by payment date
          if (invoice.paymentDetails && Array.isArray(invoice.paymentDetails) && invoice.paymentDetails.length > 0) {
            const sortedPayments = [...invoice.paymentDetails].sort((a, b) => {
              return new Date(a.paymentDate) - new Date(b.paymentDate);
            });

            sortedPayments.forEach((payment) => {
              const paymentAmount = parseFloat(payment.paymentAmount) || 0;

              const paymentData = {
                date: formatDateForExcel(payment.paymentDate),
                customerVendor: "",
                txnNo: payment.transactionId || "",
                type: "Rcpt",
                invAmount: "",
                payment: paymentAmount,
                pendingAmount: ""
              };

              const paymentRow = worksheet.addRow(paymentData);
              styleDataRow(paymentRow);
              currentRow++;

              customerTotalPayment += paymentAmount;
            });
          }

          customerTotalInvAmount += invoiceAmount;
          customerTotalPending += pendingAmount;
        });

        // Add customer total row if multiple invoices
        if (sortedInvoices.length > 1) {
          const customerTotalData = {
            date: "",
            customerVendor: "",
            txnNo: "",
            type: "",
            invAmount: customerTotalInvAmount,
            payment: customerTotalPayment,
            pendingAmount: customerTotalPending
          };

          const customerTotalRow = worksheet.addRow(customerTotalData);
          customerTotalRow.font = { bold: true };
          customerTotalRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6E6E6" } };
          styleDataRow(customerTotalRow);
          currentRow++;
        } else {
          customerTotalPayment = parseFloat(ledger.totalPaidAmount) || 0;
        }

        // Merge customer name cells if multiple rows
        const customerEndRow = currentRow - 1;
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
        grandTotalPending += customerTotalPending;
      });

      // Add Grand Total row
      const grandTotalData = {
        date: "",
        customerVendor: "",
        txnNo: "",
        type: "Total",
        invAmount: grandTotalInvAmount,
        payment: grandTotalPayment,
        pendingAmount: grandTotalPending
      };

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
      ["invAmount", "payment", "pendingAmount"].forEach((key) => {
        const cell = grandTotalRow.getCell(key);
        cell.alignment = { horizontal: "right", vertical: "middle" };
        cell.numFmt = '#,##0.00';
      });

      // Save the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `mns_all_ledger_report_${dayjs().format('YYYY-MM-DD')}.xlsx`);

      console.log("Excel export completed successfully!");
      // Replace toast with alert if toast is not available
      if (typeof toast !== 'undefined') {
        toast.success("Excel exported successfully!");
      } else {
        alert("Excel exported successfully!");
      }

    } catch (error) {
      console.error("Error exporting Excel:", error);
      // Replace toast with alert if toast is not available
      if (typeof toast !== 'undefined') {
        toast.error("Failed to export Excel: " + error.message);
      } else {
        alert("Failed to export Excel: " + error.message);
      }
    }
  };


  const downloadPDF = async () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    try {
      // Try different ways to access jsPDF
      // const jsPDF = window.jspdf?.jsPDF || window.jsPDF || jspdf.jsPDF;
      const doc = new jsPDF('landscape', 'mm', 'a4');

      // Helper function to format date
      const formatDateForPdf = (dateString) => {
        if (!dateString) return '';
        try {
          return dayjs(dateString).format('DD/MM/YYYY');
        } catch {
          return dateString;
        }
      };

      // Add title and subtitle
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Title
      doc.setFontSize(16);
      doc.setFont("helvetica", 'bold');
      doc.text('Ledger', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;

      // Subtitle
      doc.setFontSize(12);
      doc.text('Sales Ledger Accounts', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;

      // Date Range
      let fromDateStr = 'N/A';
      let toDateStr = 'N/A';

      if (dateRange.from && dateRange.to) {
        fromDateStr = dayjs(dateRange.from).format('DD-MM-YYYY');
        toDateStr = dayjs(dateRange.to).format('DD-MM-YYYY');
      } else if (dateRange.from) {
        fromDateStr = dayjs(dateRange.from).format('DD-MM-YYYY');
        toDateStr = 'Present';
      } else if (dateRange.to) {
        fromDateStr = 'Beginning';
        toDateStr = dayjs(dateRange.to).format('DD-MM-YYYY');
      } else {
        // Calculate from actual data
        if (filteredData.length > 0) {
          let allDates = [];
          filteredData.forEach(ledger => {
            ledger.invoices.forEach(invoice => {
              if (invoice.paymentDetails && invoice.paymentDetails.length > 0) {
                invoice.paymentDetails.forEach(payment => {
                  if (payment.paymentDate) {
                    allDates.push(new Date(payment.paymentDate));
                  }
                });
              }
            });
          });

          if (allDates.length > 0) {
            allDates.sort((a, b) => a - b);
            fromDateStr = dayjs(allDates[0]).format('DD-MM-YYYY');
            toDateStr = dayjs(allDates[allDates.length - 1]).format('DD-MM-YYYY');
          } else {
            const currentDate = dayjs().format('DD-MM-YYYY');
            fromDateStr = currentDate;
            toDateStr = currentDate;
          }
        }
      }

      doc.setFontSize(10);
      doc.setFont("helvetica", 'normal');
      doc.text(`From Date: ${fromDateStr} to ${toDateStr}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Prepare table data
      const tableData = [];
      let grandTotalInvAmount = 0;
      let grandTotalPayment = 0;
      let grandTotalPending = 0;

      // Sort data
      const sortedData = [...filteredData].sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      // Process each customer/vendor
      sortedData.forEach((ledger) => {
        let customerTotalInvAmount = 0;
        let customerTotalPayment = 0;
        let customerTotalPending = 0;
        let isFirstRowForCustomer = true;

        // Sort invoices
        const sortedInvoices = [...ledger.invoices].sort((a, b) => {
          return a.invoiceNumber.toLowerCase().localeCompare(b.invoiceNumber.toLowerCase());
        });

        sortedInvoices.forEach((invoice, invoiceIndex) => {
          const invoiceAmount = parseFloat(invoice.totalAmount) || 0;
          const paidAmount = parseFloat(invoice.totalPaidAmount) || 0;
          const pendingAmount = parseFloat(invoice.dueAmount) || 0;

          // Add invoice row
          tableData.push([
            formatDateForPdf(invoice.paymentDetails?.[0]?.paymentDate || new Date()),
            isFirstRowForCustomer ? ledger.name : "",
            invoice.invoiceNumber || "",
            ledger.type === 'income' ? 'Sales' : 'Purchase',
            invoiceAmount > 0 ? invoiceAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
            "",
            (invoiceIndex === sortedInvoices.length - 1 && pendingAmount > 0) ?
              pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""
          ]);

          isFirstRowForCustomer = false;

          // Add payment rows
          if (invoice.paymentDetails && Array.isArray(invoice.paymentDetails) && invoice.paymentDetails.length > 0) {
            const sortedPayments = [...invoice.paymentDetails].sort((a, b) => {
              return new Date(a.paymentDate) - new Date(b.paymentDate);
            });

            sortedPayments.forEach((payment) => {
              const paymentAmount = parseFloat(payment.paymentAmount) || 0;

              tableData.push([
                formatDateForPdf(payment.paymentDate),
                "",
                payment.transactionId || "",
                "Rcpt",
                "",
                paymentAmount > 0 ? paymentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
                ""
              ]);

              customerTotalPayment += paymentAmount;
            });
          }

          customerTotalInvAmount += invoiceAmount;
          customerTotalPending += pendingAmount;
        });

        // Add customer total row if multiple invoices
        if (sortedInvoices.length > 1) {
          tableData.push([
            "", "", "", "",
            customerTotalInvAmount > 0 ? customerTotalInvAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
            customerTotalPayment > 0 ? customerTotalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
            customerTotalPending > 0 ? customerTotalPending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""
          ]);
        } else {
          customerTotalPayment = parseFloat(ledger.totalPaidAmount) || 0;
        }

        grandTotalInvAmount += customerTotalInvAmount;
        grandTotalPayment += customerTotalPayment;
        grandTotalPending += customerTotalPending;
      });

      // Add Grand Total row
      tableData.push([
        "", "", "", "Total",
        grandTotalInvAmount > 0 ? grandTotalInvAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
        grandTotalPayment > 0 ? grandTotalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
        grandTotalPending > 0 ? grandTotalPending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""
      ]);

      // Check if autoTable is available
      if (doc.autoTable) {
        // Use autoTable for better formatting
        doc.autoTable({
          startY: yPosition,
          head: [['Date', 'Customer', 'TXN No.', 'Type', 'Inv Amount', 'Payment', 'Pending Amount']],
          body: tableData,
          styles: {
            fontSize: 7,
            cellPadding: 3,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            minCellHeight: 8,
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          headStyles: {
            fillColor: [68, 114, 196],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'center',
            minCellHeight: 10
          },
          columnStyles: {
            0: { halign: 'center', cellWidth: 22 },   // Date - slightly smaller
            1: { halign: 'left', cellWidth: 70 },     // Customer/Vendor - wider
            2: { halign: 'left', cellWidth: 35 },     // TXN No. - wider
            3: { halign: 'center', cellWidth: 18 },   // Type - smaller
            4: { halign: 'right', cellWidth: 35 },    // Inv Amount - wider
            5: { halign: 'right', cellWidth: 30 },    // Payment - wider
            6: { halign: 'right', cellWidth: 35 }     // Pending Amount - wider
          },
          alternateRowStyles: {
            fillColor: [248, 248, 248]
          },
          margin: { left: 8, right: 8 },
          tableWidth: 'auto',
          didParseCell: function (data) {
            // Style the grand total row
            if (data.row.index === tableData.length - 1) {
              data.cell.styles.fillColor = [217, 237, 247];
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.lineWidth = 0.5;
              data.cell.styles.fontSize = 8;
            }
            // Style customer total rows (rows with empty first 3 cells but with amounts)
            else if (data.row.raw[0] === "" && data.row.raw[1] === "" && data.row.raw[2] === "" && data.row.raw[3] === "" && data.row.raw[4] !== "") {
              data.cell.styles.fillColor = [230, 230, 230];
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fontSize = 7;
            }
          }
        });
      } else {
        // Fallback: Manual table creation
        const headers = ['Date', 'Customer/Vendor', 'TXN No.', 'Type', 'Inv Amount', 'Payment', 'Pending Amount'];
        const colWidths = [25, 60, 30, 20, 25, 25, 30];
        const startX = 10;
        let currentY = yPosition;

        // Draw headers manually
        doc.setFillColor(68, 114, 196);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", 'bold');
        doc.setFontSize(9);

        let headerX = startX;
        headers.forEach((header, index) => {
          doc.rect(headerX, currentY, colWidths[index], 8, 'F');
          doc.text(header, headerX + colWidths[index] / 2, currentY + 5.5, { align: 'center' });
          headerX += colWidths[index];
        });

        currentY += 8;

        // Draw data rows manually
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", 'normal');
        doc.setFontSize(8);

        tableData.forEach((row, rowIndex) => {
          let cellX = startX;

          // Alternate row colors
          if (rowIndex % 2 === 1) {
            doc.setFillColor(248, 248, 248);
            doc.rect(startX, currentY, colWidths.reduce((sum, width) => sum + width, 0), 6, 'F');
          }

          row.forEach((cellData, colIndex) => {
            const alignment = colIndex === 0 || colIndex === 3 ? 'center' :
              colIndex >= 4 ? 'right' : 'left';

            let textX = cellX + 2;
            if (alignment === 'center') textX = cellX + colWidths[colIndex] / 2;
            if (alignment === 'right') textX = cellX + colWidths[colIndex] - 2;

            if (cellData) {
              doc.text(String(cellData), textX, currentY + 4, { align: alignment });
            }

            doc.rect(cellX, currentY, colWidths[colIndex], 6, 'S');
            cellX += colWidths[colIndex];
          });

          currentY += 6;

          // Check for page break
          if (currentY > 180) {
            doc.addPage();
            currentY = 20;

            // Redraw headers
            let headerX = startX;
            headers.forEach((header, index) => {
              doc.setFillColor(68, 114, 196);
              doc.setTextColor(255, 255, 255);
              doc.setFont("helvetica", 'bold');
              doc.rect(headerX, currentY, colWidths[index], 8, 'F');
              doc.text(header, headerX + colWidths[index] / 2, currentY + 5.5, { align: 'center' });
              headerX += colWidths[index];
            });
            currentY += 8;
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", 'normal');
          }
        });
      }

      // Save the PDF
      const fileName = `mns_all_ledger_report_${dayjs().format('YYYY-MM-DD')}.pdf`;
      doc.save(fileName);

      console.log("PDF export completed successfully!");
      if (typeof toast !== 'undefined') {
        toast.success("PDF exported successfully!");
      } else {
        alert("PDF exported successfully!");
      }

    } catch (error) {
      console.error("Error exporting PDF:", error);
      if (typeof toast !== 'undefined') {
        toast.error("Failed to export PDF: " + error.message);
      } else {
        alert("Failed to export PDF: " + error.message);
      }
    }
  };

  const downloadExcelInView = () => {
    // console.log("Selected :: ", selected);

    const data = selected?.invoices || [];
    let allDates = [];
    data.forEach((transaction) => {
      if (transaction.paymentDetails?.length > 0) {
        transaction.paymentDetails.forEach((payment) => {
          if (payment.paymentDate) allDates.push(new Date(payment.paymentDate));
        });
      }
    });

    const name = selected?.name || "Customer/Vendor";
    let fromDate = allDates.length
      ? new Date(Math.min(...allDates)).toLocaleDateString()
      : "";
    let toDate = allDates.length
      ? new Date(Math.max(...allDates)).toLocaleDateString()
      : "";

    const wsData = [
      [name],
      ["Ledger Accounts"],
      [`From: ${fromDate}   To: ${toDate}`],
      [],
      ["Payment Date", "Invoice Number", "Type", "Total Amount", "Payment Amount"]
    ];

    let lastInvoiceNumber = null;
    let lastType = null;
    let lastAmount = null;
    let totalAmountSum = 0;
    let totalPaymentSum = 0;
    let TotalAmountSum = 0;

    data.forEach((transaction) => {
      let invoiceNum = transaction.invoiceNumber || "";
      if (invoiceNum && invoiceNum === lastInvoiceNumber) {
        invoiceNum = "REPEAT";
      } else {
        lastInvoiceNumber = transaction.invoiceNumber || "";
      }

      let currentType =
        transaction.type === "income" || transaction.type === "service"
          ? "Credit"
          : "Debit";
      let typeDisplay = currentType;
      if (lastType !== null && currentType === lastType) {
        typeDisplay = "REPEAT";
      }
      lastType = currentType;

      let currentAmount = parseFloat(transaction.totalAmount || 0).toFixed(2);
      console.log("currentAmount", currentAmount);
      let amountDisplay = currentAmount;
      if (invoiceNum === lastInvoiceNumber && currentAmount === lastAmount) {
        amountDisplay = "REPEAT";
      } else {
        amountDisplay = currentAmount;
      }

      if (amountDisplay !== "REPEAT") {
        totalAmountSum += parseFloat(currentAmount);
      }
      TotalAmountSum += parseFloat(currentAmount);
      console.log("totalAmountSum", totalAmountSum);

      if (transaction.paymentDetails && transaction.paymentDetails.length > 0) {
        transaction.paymentDetails.forEach((payment) => {
          wsData.push([
            payment.paymentDate || "",
            invoiceNum,
            typeDisplay,
            amountDisplay,
            parseFloat(payment.paymentAmount || 0)
          ]);
          totalPaymentSum += parseFloat(payment.paymentAmount || 0);
          invoiceNum = "REPEAT";
          typeDisplay = "REPEAT";
          amountDisplay = "REPEAT";
        });
      } else {
        wsData.push(["", invoiceNum, typeDisplay, amountDisplay, ""]);
      }
    });

    wsData.push([]);
    wsData.push([
      "TOTAL", "", "", TotalAmountSum.toFixed(2), totalPaymentSum.toFixed(2)
    ]);

    let balance = TotalAmountSum - totalPaymentSum;
    wsData.push(["BALANCE", "", "", "", balance.toFixed(2)]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const borderStyle = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    };

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue;

        ws[cell_ref].s = {
          font: { name: "Calibri", sz: 11 },
          alignment: { vertical: "center", horizontal: "center" },
          border: borderStyle
        };

        if (R === 4) {
          ws[cell_ref].s.fill = { fgColor: { rgb: "FFD966" } }; // yellow header
          ws[cell_ref].s.font.bold = true;
        }

        if (R >= range.e.r - 2) {
          ws[cell_ref].s.font.bold = true;
          ws[cell_ref].s.fill = { fgColor: { rgb: "F4CCCC" } }; // light red
        }
      }
    }

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }
    ];

    XLSX.utils.sheet_add_aoa(
      ws,
      [[{ v: `${name}`, s: { font: { bold: true, sz: 20 }, alignment: { horizontal: "center" } } }]],
      { origin: "A1" }
    );

    XLSX.utils.sheet_add_aoa(
      ws,
      [[{ v: "Ledger Accounts", s: { font: { bold: true, sz: 14 }, alignment: { horizontal: "center" } } }]],
      { origin: "A2" }
    );

    XLSX.utils.sheet_add_aoa(
      ws,
      [[{ v: `From: ${fromDate}   To: ${toDate}`, s: { font: { sz: 12 }, alignment: { horizontal: "center" } } }]],
      { origin: "A3" }
    );

    ws["!cols"] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger Report");
    XLSX.writeFile(wb, `${selected?.name}_transaction_report.xlsx`);
  };



  const downloadPDFInView = () => {
    console.log("selected", selected);
    const data = {
      customerName: selected?.name,
      totalPaid: selected?.totalPaidAmount,
      totalDue: selected?.totalDueAmount,
      totalInvoices: selected?.totalInvoices,
      pendingAmount: selected?.pendingAmount,
      transactions: selected?.paymentDetails || [],
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.from || ''}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.to || ''}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                </div>

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
                    Min Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={amountRange.min}
                    onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={amountRange.max}
                    onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
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
                      <span className={`px-2 py-1 rounded-full text-xs ${ledger.type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {ledger.type === "income" ? "Credit" : "Debit"}
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
                  <span>Type: <span className="font-medium">{selected.type === "income" ? "Credit" : "Debit"}</span></span>
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
                      <span className={`px-3 py-1 rounded-full text-xs ${invoice.isPaid
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

              <div className="border-t bg-gray-50 px-6 py-4 rounded-b-xl">
                <div className="flex justify-end gap-3">
                  <button
                    className="flex items-center cursor-pointer gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setModalOpen(false)}
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

export default MnsAllLedgerReportPage;