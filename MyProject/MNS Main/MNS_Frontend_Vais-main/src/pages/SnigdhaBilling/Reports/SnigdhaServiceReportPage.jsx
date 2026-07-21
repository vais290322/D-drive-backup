import React, { useState, useRef, useEffect } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import XLSX from "xlsx-js-style";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";
import axios from "axios";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { backendDomainS } from "../../../Common/index";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const SnigdhaServicesReportPage = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [uniqueFilters, setUniqueFilters] = useState({
    descriptions: [],
    hsnCodes: [],
    customers: [],
    uoms: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const componentRef = useRef();

  // Fetch service invoices
  const fetchServiceInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendDomainS}/api/v1/service-invoice/`
      );
      if (response.data?.success !== false) {
        const processed = processInvoiceData(response.data.data || []);
        setServicesData(processed);
        extractUniqueFilterValues(processed);
        toast.success("Service data loaded successfully");
      } else {
        toast.error(response.data?.message || "Failed to load service data");
      }
    } catch (error) {
      toast.error("Error loading service data");
    } finally {
      setLoading(false);
    }
  };

  // Flatten invoices → items for reporting
  const processInvoiceData = (invoices) => {
    const items = [];
    const invoiceTotalsMap = new Map();

    invoices.forEach((invoice) => {
      if (!Array.isArray(invoice.items)) return;

      invoiceTotalsMap.set(invoice.invoiceNumber, {
        grandTotal: parseFloat(invoice.grandTotal) || 0,
        taxableAmount: parseFloat(invoice.taxableAmount) || 0,
        taxAmount: parseFloat(invoice.taxAmount) || 0,
      });

      invoice.items.forEach((item) => {
        const cgstAmt =
          ((parseFloat(item.grossAmount) || 0) * (parseFloat(item.cgst) || 0)) /
          100;
        const sgstAmt =
          ((parseFloat(item.grossAmount) || 0) * (parseFloat(item.sgst) || 0)) /
          100;
        const igstAmt =
          ((parseFloat(item.grossAmount) || 0) * (parseFloat(item.igst) || 0)) /
          100;
        const taxAmt = cgstAmt + sgstAmt + igstAmt;

        items.push({
          invoiceId: invoice.invoiceNumber,
          date: invoice.date,
          description: item.description || "N/A",
          hsnCode: item.hsnCode || "N/A",
          uom: item.uom || "PCS",
          quantity: parseFloat(item.quantity) || 0,
          sellingPrice: parseFloat(item.sellingPrice) || 0,
          grossAmount: parseFloat(item.grossAmount) || 0,
          cgst: parseFloat(item.cgst) || 0,
          sgst: parseFloat(item.sgst) || 0,
          igst: parseFloat(item.igst) || 0,
          netAmount: parseFloat(item.netAmount) || 0,
          taxRate: parseFloat(item.taxRate) || 0,
          taxAmount: parseFloat(item.taxAmount ?? taxAmt) || 0,
          amount:
            parseFloat(item.amount) ||
            parseFloat(item.grossAmount) + taxAmt ||
            0,
          customerName: invoice?.receiverDetails?.name || "N/A",
          paymentType: invoice.paymentType || "N/A",
          invoiceTotals: invoiceTotalsMap.get(invoice.invoiceNumber),
        });
      });
    });

    return items;
  };

  // Extract unique filter values
  const extractUniqueFilterValues = (data) => {
    const descriptions = [...new Set(data.map((item) => item.description))];
    const hsnCodes = [...new Set(data.map((item) => item.hsnCode))];
    const customers = [...new Set(data.map((item) => item.customerName))];
    const uoms = [...new Set(data.map((item) => item.uom))];
    setUniqueFilters({ descriptions, hsnCodes, customers, uoms });
  };

  useEffect(() => {
    fetchServiceInvoices();
  }, []);

  // Filter data based on search query and filters
  const filteredData = servicesData.filter((item) => {
    // Search query
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      (item.description?.toLowerCase() || "").includes(search) ||
      (item.customerName?.toLowerCase() || "").includes(search) ||
      (item.hsnCode?.toLowerCase() || "").includes(search) ||
      (item.uom?.toLowerCase() || "").includes(search) ||
      (item.invoiceId?.toLowerCase() || "").includes(search);

    // Date range filter
    const itemDate = new Date(item.date);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;
    const matchesDateRange =
      (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);

    // Type-specific filter
    let matchesTypeFilter = true;
    if (filterType !== "all" && filterValue) {
      switch (filterType) {
        case "description":
          matchesTypeFilter = item.description === filterValue;
          break;
        case "hsnCode":
          matchesTypeFilter = item.hsnCode === filterValue;
          break;
        case "uom":
          matchesTypeFilter = item.uom === filterValue;
          break;
        default:
          matchesTypeFilter = true;
      }
    }

    const matchesCustomerFilter =
      selectedCustomers.length === 0 ||
      selectedCustomers.includes(item.customerName);

    return (
      matchesSearch &&
      matchesDateRange &&
      matchesTypeFilter &&
      matchesCustomerFilter
    );
  });

  const resetFilters = () => {
    setDateRange({ from: "", to: "" });
    setFilterType("all");
    setFilterValue("");
    setSearchQuery("");
    setSelectedCustomers([]);
  };

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Prepare table data with subtotals per invoice
  const prepareTableData = () => {
    const groupedByInvoice = {};
    sortedData.forEach((item) => {
      if (!groupedByInvoice[item.invoiceId]) {
        groupedByInvoice[item.invoiceId] = [];
      }
      groupedByInvoice[item.invoiceId].push(item);
    });

    const table = [];
    Object.keys(groupedByInvoice).forEach((invoiceId) => {
      const invoiceItems = groupedByInvoice[invoiceId];

      // Add all items
      invoiceItems.forEach((item) => {
        table.push({ ...item, isSubtotal: false });
      });

      // Subtotal row using invoice totals
      const totals = invoiceItems[0].invoiceTotals || {
        grandTotal: invoiceItems.reduce(
          (sum, it) => sum + (parseFloat(it.amount) || 0),
          0
        ),
        taxableAmount: invoiceItems.reduce(
          (sum, it) => sum + (parseFloat(it.grossAmount) || 0),
          0
        ),
        taxAmount: invoiceItems.reduce(
          (sum, it) => sum + (parseFloat(it.taxAmount) || 0),
          0
        ),
      };

      table.push({
        invoiceId,
        isSubtotal: true,
        totalAmount: totals.grandTotal,
        amount: totals.taxableAmount,
        taxAmount: totals.taxAmount,
        date: invoiceItems[0].date,
        customerName: invoiceItems[0].customerName,
        description: `Subtotal for ${invoiceId}`,
        hsnCode: "",
        uom: "",
        quantity: "",
        sellingPrice: "",
        grossAmount: "",
        cgst: "",
        sgst: "",
        igst: "",
      });
    });

    return table;
  };

  const tableDataWithSubtotals = prepareTableData();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableDataWithSubtotals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(tableDataWithSubtotals.length / itemsPerPage);
  // console.log("current item : ", currentItems);
  // Summary stats
  const totalSales = filteredData.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const totalTaxSales = filteredData.reduce(
    (sum, item) => sum + (item.taxAmount || 0),
    0
  );
  const totalGrossSales = filteredData.reduce(
    (sum, item) => sum + (item.grossAmount || 0),
    0
  );
  const totalServices = filteredData.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalInvoices = [...new Set(filteredData.map((item) => item.invoiceId))]
    .length;

  // Charts
  const prepareChartData = () => {
    const serviceQuantities = {};
    filteredData.forEach((item) => {
      const key = item.description;
      if (!serviceQuantities[key]) serviceQuantities[key] = 0;
      serviceQuantities[key] += item.quantity || 0;
    });

    const topServices = Object.entries(serviceQuantities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const dateSales = {};
    filteredData.forEach((item) => {
      const d = new Date(item.date).toLocaleDateString();
      if (!dateSales[d]) dateSales[d] = 0;
      dateSales[d] += item.amount || 0;
    });
    const sortedDates = Object.keys(dateSales).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return {
      topServices: {
        labels: topServices.map((s) => s[0]),
        data: topServices.map((s) => s[1]),
      },
      salesTrend: {
        labels: sortedDates,
        data: sortedDates.map((d) => dateSales[d]),
      },
    };
  };
  const chartData = prepareChartData();

  // Helpers
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount || 0);

  const handleCustomerSelection = (customer) => {
    setSelectedCustomers((prev) =>
      prev.includes(customer)
        ? prev.filter((c) => c !== customer)
        : [...prev, customer]
    );
  };

  const selectAllCustomers = () => {
    if (selectedCustomers.length === uniqueFilters.customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers([...uniqueFilters.customers]);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Excel export
  const handleExcelExport = () => {
    const grouped = {};
    tableDataWithSubtotals.forEach((row) => {
      if (!row.isSubtotal) {
        if (!grouped[row.invoiceId]) {
          grouped[row.invoiceId] = {
            date: row.date,
            customerName: row.customerName,
            paymentType: row.paymentType,
            items: [],
          };
        }
        grouped[row.invoiceId].items.push(row);
      }
    });

    const workbook = XLSX.utils.book_new();

    const headerRow = [
      "Invoice ID",
      "Date",
      "Service Description",
      "HSN Code",
      "Unit",
      "Quantity",
      "Rate",
      "Gross Amount",
      "CGST%",
      "CGST Amt",
      "SGST%",
      "SGST Amt",
      "IGST%",
      "IGST Amt",
      "Total Amount",
      "Customer",
      "Payment Type",
    ];

    // Create sheet with title row + header row
    const titleText = "Snigdha's Service report";
    const aoa = [[titleText], headerRow]; // title at row 0, header at row 1
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);

    // Prepare merges array starting with title merge across all header columns
    const merges = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: headerRow.length - 1 },
      },
    ];

    // Style the title cell (A1)
    const titleCellRef = XLSX.utils.encode_cell({ r: 0, c: 0 });
    if (!worksheet[titleCellRef]) worksheet[titleCellRef] = { v: titleText };
    worksheet[titleCellRef].s = {
      font: { name: "Calibri", sz: 16, bold: true, color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "E3F2FD" } },
      border: {
        top: { style: "thin", color: { rgb: "BFBFBF" } },
        bottom: { style: "thin", color: { rgb: "BFBFBF" } },
        left: { style: "thin", color: { rgb: "BFBFBF" } },
        right: { style: "thin", color: { rgb: "BFBFBF" } },
      },
    };

    // Style header row (now at r = 1)
    headerRow.forEach((_, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: 1, c: colIndex });
      if (!worksheet[cellRef]) worksheet[cellRef] = { v: headerRow[colIndex] };
      worksheet[cellRef].s = {
        fill: { fgColor: { rgb: "4287F5" } },
        font: { bold: true, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    });

    // Data rows should start after title + header => r = 2
    let rowIndex = 2;

    Object.entries(grouped).forEach(([invoiceId, group]) => {
      const startRow = rowIndex;
      const itemCount = group.items.length;

      group.items.forEach((item) => {
        const cgstAmt = ((item.grossAmount || 0) * (item.cgst || 0)) / 100;
        const sgstAmt = ((item.grossAmount || 0) * (item.sgst || 0)) / 100;
        const igstAmt = ((item.grossAmount || 0) * (item.igst || 0)) / 100;

        const row = [
          invoiceId,
          new Date(group.date).toLocaleDateString("en-GB"),
          item.description,
          item.hsnCode,
          item.uom,
          item.quantity,
          item.sellingPrice,
          item.grossAmount,
          item.cgst,
          cgstAmt,
          item.sgst,
          sgstAmt,
          item.igst,
          igstAmt,
          item.amount,
          group.customerName,
          group.paymentType,
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: rowIndex++ });
      });

      if (itemCount > 1) {
        merges.push(
          {
            s: { r: startRow, c: 0 },
            e: { r: startRow + itemCount - 1, c: 0 },
          }, // Invoice ID
          {
            s: { r: startRow, c: 1 },
            e: { r: startRow + itemCount - 1, c: 1 },
          }, // Date
          {
            s: { r: startRow, c: 15 },
            e: { r: startRow + itemCount - 1, c: 15 },
          }, // Customer
          {
            s: { r: startRow, c: 16 },
            e: { r: startRow + itemCount - 1, c: 16 },
          } // Payment
        );
      }

      const subtotalItem = tableDataWithSubtotals.find(
        (it) => it.isSubtotal && it.invoiceId === invoiceId
      );
      if (subtotalItem) {
        const subtotalRow = [
          `Invoice ${invoiceId} Subtotal`,
          "",
          "",
          "",
          "",
          "",
          "",
          `Taxable: ${subtotalItem.amount.toFixed(2)}`,
          "",
          `Tax: ${subtotalItem.taxAmount.toFixed(2)}`,
          "",
          "",
          "",
          "",
          `Total: ${subtotalItem.totalAmount.toFixed(2)}`,
          "",
          "",
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [subtotalRow], {
          origin: rowIndex++,
        });

        // Style subtotal row
        for (let c = 0; c < headerRow.length; c++) {
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex - 1, c });
          if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
          worksheet[cellRef].s = {
            fill: { fgColor: { rgb: "FFF9C4" } },
            font: { bold: true, color: { rgb: "000000" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
        rowIndex++;
      }

      XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: rowIndex++ });
    });

    // append grouped merges (including title merge)
    worksheet["!merges"] = merges;

    worksheet["!cols"] = [
      { wch: 25 }, // Invoice
      { wch: 12 }, // Date
      { wch: 28 }, // Description
      { wch: 10 }, // HSN
      { wch: 8 }, // Unit
      { wch: 10 }, // Qty
      { wch: 12 }, // Rate
      { wch: 14 }, // Gross
      { wch: 8 }, // CGST%
      { wch: 12 }, // CGST Amt
      { wch: 8 }, // SGST%
      { wch: 12 }, // SGST Amt
      { wch: 8 }, // IGST%
      { wch: 12 }, // IGST Amt
      { wch: 14 }, // Total
      { wch: 20 }, // Customer
      { wch: 14 }, // Payment
    ];

    // Style merged columns (center align) for the invoice/group merges (skip title merge)
    merges.slice(1).forEach((range) => {
      for (let r = range.s.r; r <= range.e.r; r++) {
        for (let c = range.s.c; c <= range.e.c; c++) {
          const cellRef = XLSX.utils.encode_cell({ r, c });
          if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
          worksheet[cellRef].s = {
            alignment: { horizontal: "center", vertical: "center" },
            font: { bold: true },
          };
        }
      }
    });

    // Summary section
    const summaryStart = rowIndex + 1;
    const summaryData = [
      ["Summary", ""],
      ["Total Gross Amount", totalGrossSales],
      ["Total Tax Amount", totalTaxSales],
      ["Total Amount", totalSales],
      ["Total Services", totalServices],
      ["Total Invoices", totalInvoices],
    ];
    XLSX.utils.sheet_add_aoa(worksheet, summaryData, { origin: summaryStart });

    for (let r = 0; r < summaryData.length; r++) {
      for (let c = 0; c < 2; c++) {
        const cellRef = XLSX.utils.encode_cell({ r: summaryStart + r, c });
        if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
        worksheet[cellRef].s = {
          fill: { fgColor: { rgb: "C8E6C9" } },
          font: { bold: true, color: { rgb: "000000" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Snigdha Services Report"
    );
    XLSX.writeFile(
      workbook,
      `Snigdha_Services_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // PDF export
  const handlePdfExport = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(16);
    doc.text("Snigdha Services Report", 14, 16);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    doc.setFontSize(12);
    doc.text("Summary", 14, 30);

    doc.setFontSize(10);
    doc.text(`Total Gross Amount: ${totalGrossSales.toFixed(2)}`, 14, 36);
    doc.text(`Total Tax Amount: ${totalTaxSales.toFixed(2)}`, 14, 42);
    doc.text(`Total Amount: ${totalSales.toFixed(2)}`, 14, 48);
    doc.text(`Total Services: ${totalServices}`, 14, 54);
    doc.text(`Total Invoices: ${totalInvoices}`, 14, 60);

    const columns = [
      "Client",
      "Invoice ID",
      "Date",
      "Dsc",
      "HSN",
      "Unit",
      "Qty",
      "Rate",
      "Gross",
      "CGST%",
      "CGST",
      "SGST%",
      "SGST",
      "IGST%",
      "IGST",
      "Total",
    ];
    const rows = [];

    tableDataWithSubtotals.forEach((item) => {
      if (item.isSubtotal) {
        rows.push([
          "", // Customer
          `Subtotal ${item.invoiceId}`,
          "",
          "",
          "",
          "",
          "",
          "",
          item.amount?.toFixed(2) || "",
          "",
          item.taxAmount?.toFixed(2) || "",
          "",
          "",
          "",
          "",
          item.totalAmount?.toFixed(2) || "",
        ]);
      } else {
        const cgstAmt = ((item.grossAmount || 0) * (item.cgst || 0)) / 100;
        const sgstAmt = ((item.grossAmount || 0) * (item.sgst || 0)) / 100;
        const igstAmt = ((item.grossAmount || 0) * (item.igst || 0)) / 100;
        rows.push([
          item.customerName || "",
          item.invoiceId || "",
          new Date(item.date).toLocaleDateString("en-GB"),
          item.description || "",
          item.hsnCode || "",
          item.uom || "",
          item.quantity?.toString() || "",
          item.sellingPrice?.toFixed?.(2) ||
            (item.sellingPrice || "").toString(),
          item.grossAmount?.toFixed?.(2) || (item.grossAmount || "").toString(),
          (item.cgst || 0).toString(),
          cgstAmt.toFixed(2),
          (item.sgst || 0).toString(),
          sgstAmt.toFixed(2),
          (item.igst || 0).toString(),
          igstAmt.toFixed(2),
          item.amount?.toFixed?.(2) || (item.amount || "").toString(),
        ]);
      }
    });

    doc.autoTable({
      startY: 68,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: {
        fontSize: 6,
        cellPadding: 1,
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 8,
        halign: "center",
        valign: "middle",
        lineColor: [0, 0, 0],
        lineWidth: 0.4,
      },
      didParseCell: (data) => {
        // Bold subtotal row
        const rowData = data.table.body[data.row.index]?.raw;
        if (
          rowData &&
          typeof rowData[1] === "string" &&
          rowData[1].startsWith("Subtotal")
        ) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [255, 249, 196]; // Light yellow
        }
      },
    });

    doc.save(
      `Snigdha_Services_Report_${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" ref={componentRef}>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Snigdha's Service Invoice Report
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExcelExport}
              className="flex items-center gap-2 px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            >
              <FaFileExcel /> Export Excel
            </button>
            <button
              onClick={handlePdfExport}
              className="flex items-center gap-2 px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              <FaFilePdf /> Export PDF
            </button>
            {/* <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              <FaPrint /> Print
            </button> */}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded border">
            <div className="text-sm text-gray-500">Total Gross Amount</div>
            <div className="text-xl font-semibold">
              {formatCurrency(totalGrossSales)}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded border">
            <div className="text-sm text-gray-500">Total Tax Amount</div>
            <div className="text-xl font-semibold">
              {formatCurrency(totalTaxSales)}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded border">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-xl font-semibold">
              {formatCurrency(totalSales)}
            </div>
          </div>
          {/* <div className="bg-purple-50 p-4 rounded border">
            <div className="text-sm text-gray-500">Total Services</div>
            <div className="text-xl font-semibold">{totalServices}</div>
          </div> */}
          <div className="bg-gray-50 p-4 rounded border">
            <div className="text-sm text-gray-500">Total Invoices</div>
            <div className="text-xl font-semibold">{totalInvoices}</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search service description, HSN, customer, invoice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border rounded p-2 pl-8"
                />
                <FaSearch className="absolute top-2.5 left-2 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters((s) => !s)}
                className="flex items-center gap-2 px-4 cursor-pointer py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                <FaFilter />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setFilterValue("");
                  }}
                  className="w-full border rounded p-2"
                >
                  <option value="all">All</option>
                  <option value="description">Service Description</option>
                  <option value="hsnCode">HSN Code</option>
                  <option value="uom">Unit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter Value
                </label>
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select</option>
                  {filterType === "description" &&
                    uniqueFilters.descriptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  {filterType === "hsnCode" &&
                    uniqueFilters.hsnCodes.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  {filterType === "uom" &&
                    uniqueFilters.uoms.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                </select>
              </div>

              {/* Customers multi-select */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customers
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm cursor-pointer"
                    onClick={selectAllCustomers}
                  >
                    {selectedCustomers.length === uniqueFilters.customers.length
                      ? "Unselect All"
                      : "Select All"}
                  </button>
                  {uniqueFilters.customers.map((c) => {
                    const selected = selectedCustomers.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => handleCustomerSelection(c)}
                        className={`px-3 py-1 rounded text-sm border cursor-pointer ${
                          selected
                            ? "bg-green-100 text-green-700"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Sort and per page */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="border rounded p-1 text-sm"
              >
                <option value="date">Date</option>
                <option value="description">Description</option>
                <option value="hsnCode">HSN Code</option>
                <option value="customerName">Customer</option>
                <option value="amount">Amount</option>
              </select>
              <button
                onClick={() =>
                  setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
                }
                className="px-2 py-1 border rounded text-sm flex items-center gap-1 cursor-pointer"
              >
                {sortDirection === "asc" ? (
                  <FaSortAmountUp />
                ) : (
                  <FaSortAmountDown />
                )}
                {sortDirection.toUpperCase()}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded p-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Sl.No.
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Invoice ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                HSN
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Unit
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                Qty
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                Rate
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                Gross
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                Tax Rate (%)
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                Tax Amount
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((item, index) => {
              const isSubtotal = item.isSubtotal;
              return (
                <tr
                  key={`${item.invoiceId}-${index}`}
                  className={`transition-colors ${
                    isSubtotal ? "bg-yellow-50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm  text-gray-900 ${
                      isSubtotal ? "text-yellow-600 font-bold " : ""
                    } `}
                  >
                    {isSubtotal
                      ? `Subtotal: ${item.invoiceId}`
                      : item.invoiceId}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-gray-600 ${
                      isSubtotal ? "text-yellow-600 font-bold " : ""
                    } `}
                  >
                    {item.date
                      ? new Date(item.date).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-gray-900 ${
                      isSubtotal ? "text-yellow-600 font-bold " : ""
                    } `}
                  >
                    {item.customerName || ""}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-gray-900 ${
                      isSubtotal ? "text-yellow-600 font-bold " : ""
                    } `}
                  >
                    {item.description || ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.hsnCode || ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.uom || ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {isSubtotal ? "" : item.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {isSubtotal ? "" : (item.sellingPrice ?? 0).toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-right text-gray-900 ${
                      isSubtotal ? "text-yellow-600 font-bold " : ""
                    } `}
                  >
                    {isSubtotal
                      ? (item.amount ?? 0).toFixed(2)
                      : (item.netAmount ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {isSubtotal ? " " : item.taxRate ?? 0}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-right text-gray-900 ${
                      isSubtotal ? "text-yellow-600 font-bold " : ""
                    } `}
                  >
                    {isSubtotal
                      ? (item.taxAmount ?? 0).toFixed(2)
                      : (item.taxAmount ?? 0).toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-right text-gray-900 ${
                      isSubtotal ? "text-yellow-600 font-bold " : ""
                    } `}
                  >
                    {isSubtotal
                      ? (item.totalAmount ?? 0).toFixed(2)
                      : (item.amount ?? 0).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex justify-between items-center p-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            {tableDataWithSubtotals.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
            {Math.min(indexOfLastItem, tableDataWithSubtotals.length)} of{" "}
            {tableDataWithSubtotals.length} rows
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
              Prev
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">
            Top Services by Quantity
          </h3>
          <Pie
            data={{
              labels: chartData.topServices.labels,
              datasets: [
                {
                  data: chartData.topServices.data,
                  backgroundColor: [
                    "#60A5FA",
                    "#34D399",
                    "#FBBF24",
                    "#F472B6",
                    "#A78BFA",
                  ],
                },
              ],
            }}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <Bar
            data={{
              labels: chartData.salesTrend.labels,
              datasets: [
                {
                  label: "Amount",
                  data: chartData.salesTrend.data,
                  backgroundColor: "#34D399",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
              scales: {
                y: { ticks: { callback: (v) => formatCurrency(v) } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};



export default SnigdhaServicesReportPage;
