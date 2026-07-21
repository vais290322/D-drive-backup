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

// import * as XLSX from "xlsx";
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

const fetchInvoiceUrl = import.meta.env.VITE_REACT_FETCH_ALL_INVOICE_MNS;

const SalsesReportPage = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [salesData, setSalesData] = useState([]);
  // console.log("salse data : ", salesData)
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [uniqueFilters, setUniqueFilters] = useState({
    itemIds: [],
    groups: [],
    hsnCodes: [],
    customers: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedHsn, setSelectedHsn] = useState([]);
  const componentRef = useRef();
  // console.log("groups : ", uniqueFilters)
  // Fetch sales data
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(fetchInvoiceUrl);
      // console.log("fetch salse data : ", response);

      if (response.data.success) {
        // Process the invoice data to extract sales information
        const processedData = processInvoiceData(response.data.data);
        setSalesData(processedData);

        // Extract unique filter values
        extractUniqueFilterValues(processedData);

        toast.success("Sales data loaded successfully");
      } else {
        toast.error(response.data.message || "Failed to load sales data");
      }
    } catch (error) {
      // console.error("Error fetching sales data:", error);
      toast.error("Error loading sales data");
    } finally {
      setLoading(false);
    }
  };

  // Process invoice data to extract sales information
  const processInvoiceData = (invoices) => {
    const salesItems = [];

    // Create a map to store invoice totals
    const invoiceTotalsMap = new Map();

    invoices.forEach((invoice) => {
      // Skip if no items or not an array
      if (!Array.isArray(invoice.items)) return;

      // Store invoice totals
      invoiceTotalsMap.set(invoice.invoiceNumber, {
        grandTotal: parseFloat(invoice.grandTotal) || 0,
        taxableAmount: parseFloat(invoice.taxableAmount) || 0,
        taxAmount: parseFloat(invoice.taxAmount) || 0,
      });

      invoice.items.forEach((item) => {
        // console.log("item : ", item)
        // Create a sales record for each item
        salesItems.push({
          invoiceId: invoice.invoiceNumber,
          date: invoice.date,
          itemId: item.item_id || "N/A",
          itemName: item.itemName || "N/A",
          hsnCode: item.hsnCode || "N/A",
          uom: item?.uom || "PCS",
          quantity: parseInt(item.quantity) || 0,
          sellingPrice: parseInt(item?.sellingPrice) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          amount: parseFloat(item.amount) || 0,
          taxAmount: parseFloat(item.taxAmount) || 0,
          totalAmount: parseFloat(item.amount) || 0,
          taxRate: parseFloat(item.taxRate) || 0,
          grossAmount: parseFloat(item.grossAmount) || 0,

          // totalAmount: parseFloat(item.amount) + parseFloat(item.taxAmount) || 0,

          group: item.group || "Main Group",
          customerName: invoice.receiverDetails?.name || "N/A",
          paymentType: invoice.paymentType || "N/A",
          // Add reference to invoice totals
          invoiceTotals: invoiceTotalsMap.get(invoice.invoiceNumber),
        });
      });
    });

    return salesItems;
  };

  // Extract unique filter values
  const extractUniqueFilterValues = (data) => {
    const itemIds = [...new Set(data.map((item) => item.itemId))];
    const groups = [...new Set(data.map((item) => item.group))];
    const hsnCodes = [...new Set(data.map((item) => item.hsnCode))];
    const customers = [...new Set(data.map((item) => item.customerName))];
    setUniqueFilters({
      itemIds,
      groups,
      hsnCodes,
      customers,
    });
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Filter data based on search query and filters
  const filteredData = salesData.filter((item) => {
    // Search query filter
    const matchesSearch =
      (item.itemName.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.itemId.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.customerName.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      // (item.hsnCode.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.group.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.invoiceId.toLowerCase() || "").includes(searchQuery.toLowerCase());

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
        case "itemId":
          matchesTypeFilter = item.itemId === filterValue;
          break;
        case "group":
          matchesTypeFilter = item.group === filterValue;
          break;
        case "hsnCode":
          matchesTypeFilter = item.hsnCode === filterValue;
          break;
        default:
          matchesTypeFilter = true;
      }
    }

    const matchedHsnFilter =
      selectedHsn.length === 0 || selectedHsn.includes(item.hsnCode);

    const matchesCustomerFilter =
      selectedCustomers.length === 0 ||
      selectedCustomers.includes(item.customerName);

    return (
      matchesSearch &&
      matchesDateRange &&
      matchesTypeFilter &&
      matchesCustomerFilter &&
      matchedHsnFilter
    );
  });

  // Handle customer selection
  const handleCustomerSelection = (customer) => {
    setSelectedCustomers((prev) => {
      if (prev.includes(customer)) {
        return prev.filter((c) => c !== customer);
      } else {
        return [...prev, customer];
      }
    });
  };

  // Handle hsn selection
  const handleHsnSelection = (hsn) => {
    setSelectedHsn((prev) => {
      if (prev.includes(hsn)) {
        return prev.filter((c) => c !== hsn);
      } else {
        return [...prev, hsn];
      }
    });
  };

  // Select all customers
  const selectAllCustomers = () => {
    if (selectedCustomers.length === uniqueFilters.customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers([...uniqueFilters.customers]);
    }
  };

  // Select all hsn
  const selectAllHsn = () => {
    if (selectedHsn.length === uniqueFilters.hsnCodes.length) {
      setSelectedHsn([]);
    } else {
      setSelectedHsn([...uniqueFilters.hsnCodes]);
    }
  };

  const resetFilters = () => {
    setDateRange({ from: "", to: "" });
    setFilterType("all");
    setFilterValue("");
    setSearchQuery("");
    setSelectedCustomers([]); // Reset selected customers
  };

  // Sort data
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

  // console.log("sorted data : ", sortedData)

  // Prepare table data with subtotals
  const prepareTableData = () => {
    // Group data by invoice ID
    const groupedByInvoice = {};
    sortedData.forEach((item) => {
      if (!groupedByInvoice[item.invoiceId]) {
        groupedByInvoice[item.invoiceId] = [];
      }
      groupedByInvoice[item.invoiceId].push(item);
    });

    const tableData = [];

    Object.keys(groupedByInvoice).forEach((invoiceId) => {
      const invoiceItems = groupedByInvoice[invoiceId];

      // Add all items for this invoice
      invoiceItems.forEach((item) => {
        tableData.push({
          ...item,
          isSubtotal: false,
        });
      });

      // Get invoice totals from the first item
      const invoiceTotals = invoiceItems[0].invoiceTotals || {
        // Fallback values if invoiceTotals is not available
        grandTotal: invoiceItems.reduce(
          (sum, item) => sum + parseFloat(item.totalAmount || 0),
          0
        ),
        taxableAmount: invoiceItems.reduce(
          (sum, item) => sum + parseFloat(item.amount || 0),
          0
        ),
        taxAmount: invoiceItems.reduce(
          (sum, item) => sum + parseFloat(item.taxAmount || 0),
          0
        ),
      };

      // Add subtotal row for this invoice
      tableData.push({
        invoiceId: invoiceId,
        isSubtotal: true,
        totalAmount: invoiceTotals.grandTotal,
        amount: invoiceTotals.taxableAmount,
        taxAmount: invoiceTotals.taxAmount,
        // Add these properties to avoid rendering errors
        date: invoiceItems[0].date,
        customerName: invoiceItems[0].customerName,
        itemName: `Subtotal for ${invoiceId}`,
        itemId: "",
        quantity: "",
        unitPrice: "",
        sellingPrice: "",
      });
    });

    return tableData;
  };

  // Get table data with subtotals
  const tableDataWithSubtotals = prepareTableData();

  // Calculate pagination with the new table data that includes subtotals
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableDataWithSubtotals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(tableDataWithSubtotals.length / itemsPerPage);

  console.log("current items from salse report : ", currentItems);

  // Calculate summary statistics
  const totalSales = filteredData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  const totalGrossSales = filteredData.reduce(
    (sum, item) => sum + item.grossAmount,
    0
  );

  const totalTaxSales = filteredData.reduce(
    (sum, item) => sum + item.taxAmount,
    0
  );

  const totalItems = filteredData.reduce((sum, item) => sum + item.quantity, 0);
  const totalInvoices = [...new Set(filteredData.map((item) => item.invoiceId))]
    .length;

  // Group data for charts
  const prepareChartData = () => {
    // Group by item for top selling items
    const itemSales = {};
    filteredData.forEach((item) => {
      if (!itemSales[item.itemName]) {
        itemSales[item.itemName] = 0;
      }
      itemSales[item.itemName] += item.quantity;
    });

    // Sort and get top 5
    const topItems = Object.entries(itemSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Group by date for sales trend
    const dateSales = {};
    filteredData.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString();
      if (!dateSales[date]) {
        dateSales[date] = 0;
      }
      dateSales[date] += item.totalAmount;
    });

    // Sort dates
    const sortedDates = Object.keys(dateSales).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return {
      topItems: {
        labels: topItems.map((item) => item[0]),
        data: topItems.map((item) => item[1]),
      },
      salesTrend: {
        labels: sortedDates,
        data: sortedDates.map((date) => dateSales[date]),
      },
    };
  };

  const chartData = prepareChartData();

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
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

  // Handle Excel export
  const handleExcelExport = () => {
    // Group items by invoice
    const groupedItems = {};
    tableDataWithSubtotals.forEach((item) => {
      if (!item.isSubtotal) {
        if (!groupedItems[item.invoiceId]) {
          groupedItems[item.invoiceId] = {
            date: item.date,
            customerName: item.customerName,
            paymentType: item.paymentType,
            items: [],
          };
        }
        groupedItems[item.invoiceId].items.push(item);
      }
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();

    // 🏢 Company Info
    const companyInfo = [
      ["MNS Secure Solutions"],
      ["AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064"],
      ["GSTIN: GSTN-19BTFPR0457K2Z7"],
      ["Email: mnssecuresolutions@gmail.com | Phone: 9073656557"],
      ["STATE: West Bengal (19)"],
      [""], // blank row for spacing
    ];

    const headerRow = [
      "Invoice ID",
      "Date",
      "Item ID",
      "Item Name",
      "Unit",
      "HSN Code",
      "Group",
      "Quantity",
      "Unit Price",
      "Gross Amount",
      "Tax Rate",
      "Tax Amount",
      "Total Amount",
      "Customer",
      "Payment Type",
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headerRow]);

    // Style header row
    headerRow.forEach((_, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      worksheet[cellRef].s = {
        fill: { fgColor: { rgb: "4287f5" } }, // Blue background
        font: { bold: true, color: { rgb: "FFFFFF" } }, // White text
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    });

    // Prepare rows
    let rowIndex = 1; // Start after header
    let merges = [];

    Object.entries(groupedItems).forEach(([invoiceId, group]) => {
      const startRow = rowIndex;
      const itemCount = group.items.length;

      // Add items
      group.items.forEach((item) => {
        const row = [
          invoiceId,
          new Date(group.date).toLocaleDateString("en-GB"),
          item.itemId,
          item.itemName,
          item.uom,
          item.hsnCode,
          item.group,
          item.quantity,
          item.sellingPrice,
          item.grossAmount,
          item.taxRate,
          item.taxAmount,
          item.totalAmount,
          group.customerName,
          group.paymentType,
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: rowIndex++ });
      });

      // Merge invoice-level columns
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
            s: { r: startRow, c: 13 },
            e: { r: startRow + itemCount - 1, c: 13 },
          }, // Customer
          {
            s: { r: startRow, c: 14 },
            e: { r: startRow + itemCount - 1, c: 14 },
          } // Payment Type
        );
      }

      // Add subtotal row
      const subtotalItem = tableDataWithSubtotals.find(
        (item) => item.isSubtotal && item.invoiceId === invoiceId
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
          "",
          "",
          `Taxable: ${subtotalItem.amount.toFixed(2)}`,
          "",
          `Tax: ${subtotalItem.taxAmount.toFixed(2)}`,
          `Total: ${subtotalItem.totalAmount.toFixed(2)}`,
          "",
          "",
          "",
          "",
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [subtotalRow], {
          origin: rowIndex++,
        });

        // 🎨 Style subtotal row (light yellow background)
        for (let c = 0; c < headerRow.length; c++) {
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex - 1, c });
          if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
          worksheet[cellRef].s = {
            fill: { fgColor: { rgb: "FFF9C4" } }, // Light Yellow
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

      // Empty row for spacing
      XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: rowIndex++ });
    });

    // Apply merges
    worksheet["!merges"] = merges;

    // Set column widths
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 12 },
      { wch: 10 },
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 12 },
      { wch: 20 },
      { wch: 12 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
    ];

    // ✅ Style merged columns (center aligned, middle)
    merges.forEach((range) => {
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

    // ✅ Add summary at the end of same sheet
    const summaryStart = rowIndex + 1;
    const summaryData = [
      ["Summary", ""],
      ["Total Gross Sales", totalGrossSales],
      ["Total Tax Sales", totalTaxSales],
      ["Total Sales", totalSales],
      ["Total Items Sold", totalItems],
      ["Total Invoices", totalInvoices],
    ];
    XLSX.utils.sheet_add_aoa(worksheet, summaryData, { origin: summaryStart });
    // 🎨 Style summary section (light green background)
    for (let r = 0; r < summaryData.length; r++) {
      for (let c = 0; c < 2; c++) {
        const cellRef = XLSX.utils.encode_cell({ r: summaryStart + r, c });
        if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
        worksheet[cellRef].s = {
          fill: { fgColor: { rgb: "C8E6C9" } }, // Light Green
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

    // Append to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "MNS Sales Report");

    // Save file
    XLSX.writeFile(
      workbook,
      `MNS_Sales_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };
  // Handle PDF export
  const handlePdfExport1 = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("MNS Sales Report", 14, 22);

    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Add summary
    doc.setFontSize(14);
    doc.text("Summary", 14, 40);

    doc.setFontSize(10);
    doc.text(`Total Sales: ${totalSales}`, 14, 50);
    doc.text(`Total Items Sold: ${totalItems}`, 14, 58);
    doc.text(`Total Invoices: ${totalInvoices}`, 14, 66);

    // Create table
    const tableColumn = [
      "Customer Name",
      "Invoice ID",
      "Date",
      "Item ID",
      "Item Name",
      "Quantity",
      "Unit Price",
      "Total",
    ];
    const tableRows = [];

    // Use the same table data with subtotals that the UI uses
    const tableDataWithSubtotals = prepareTableData();

    tableDataWithSubtotals.forEach((item) => {
      if (item.isSubtotal) {
        // Add a subtotal row
        tableRows.push([
          "", // Customer Name
          `Invoice ${item.invoiceId} Subtotal`, // Invoice ID
          "", // Date
          "", // Item ID
          "", // Item Name
          "", // Quantity
          `Taxable: ${item.amount.toFixed(2)}\nTax: ${item.taxAmount.toFixed(
            2
          )}`, // Unit Price
          item.totalAmount.toFixed(2), // Total
        ]);
      } else {
        // Add regular item row
        const rowData = [
          item.customerName,
          item.invoiceId,
          new Date(item.date).toLocaleDateString("en-GB"),
          item.itemId,
          item.itemName,
          item.quantity,
          item.sellingPrice,
          item.totalAmount,
        ];
        tableRows.push(rowData);
      }
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      // Add special styling for subtotal rows
      didParseCell: function (data) {
        if (
          data.row.raw &&
          data.row.raw[1] &&
          data.row.raw[1].startsWith("Invoice ") &&
          data.row.raw[1].includes("Subtotal")
        ) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
    });

    // Save file
    doc.save(`MNS_Sales_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handlePdfExport2 = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("MNS Sales Report", 14, 22);

    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Add summary
    doc.setFontSize(14);
    doc.text("Summary", 14, 40);

    doc.setFontSize(10);
    doc.text(`Total Gross Sales: ${totalGrossSales.toFixed(2)}`, 14, 50);
    doc.text(`Total Tax Sales: ${totalTaxSales.toFixed(2)}`, 70, 50);
    doc.text(`Total Sales: ${totalSales.toFixed(2)}`, 140, 50);
    doc.text(`Total Items Sold: ${totalItems}`, 14, 58);
    doc.text(`Total Invoices: ${totalInvoices}`, 14, 66);

    // Create table with modified columns
    const tableColumn = [
      "Item ID",
      "Item Name",
      "Quantity",
      "Unit Price",
      "Gross Amount",
      "Tax Amount",
      "Total",
    ];

    // Group items by invoice
    const groupedItems = {};
    tableDataWithSubtotals.forEach((item) => {
      if (!item.isSubtotal) {
        if (!groupedItems[item.invoiceId]) {
          groupedItems[item.invoiceId] = {
            date: item.date,
            customerName: item.customerName,
            paymentType: item.paymentType,
            items: [],
          };
        }
        groupedItems[item.invoiceId].items.push(item);
      }
    });

    // console.log("grouped items for pdf export : ", groupedItems)

    // Prepare table rows with invoice headers
    const tableRows = [];
    Object.entries(groupedItems).forEach(([invoiceId, group]) => {
      // Add invoice header
      tableRows.push([
        {
          content: `Invoice: ${invoiceId}  |  Date: ${new Date(
            group.date
          ).toLocaleDateString("en-GB")}  |  Customer: ${
            group.customerName
          }  |  Payment Method: ${group.paymentType || "N/A"}`,
          colSpan: 7,
          styles: {
            fontStyle: "bold",
            fillColor: [240, 240, 240],
            halign: "left",
          },
        },
      ]);

      // Add items for this invoice
      group.items.forEach((item) => {
        tableRows.push([
          item.itemId,
          item.itemName,
          item.quantity,
          item.sellingPrice.toFixed(2),
          item.grossAmount.toFixed(2),
          item.taxAmount.toFixed(2),
          item.totalAmount.toFixed(2),
        ]);
      });

      // Add subtotal row
      const subtotalItem = tableDataWithSubtotals.find(
        (item) => item.isSubtotal && item.invoiceId === invoiceId
      );
      if (subtotalItem) {
        tableRows.push([
          {
            content: `Subtotal - Taxable: ${subtotalItem.amount.toFixed(
              2
            )} | Tax: ${subtotalItem.taxAmount.toFixed(
              2
            )} | Total: ${subtotalItem.totalAmount.toFixed(2)}`,
            colSpan: 7,
            styles: {
              fontStyle: "bold",
              fillColor: [245, 245, 245],
              halign: "right",
            },
          },
        ]);
      }

      // Add empty row for spacing between invoices
      tableRows.push([{ content: "", colSpan: 7, styles: { cellPadding: 2 } }]);
    });

    // Generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,

        lineWidth: { top: 0, bottom: 0, left: 0.2, right: 0.2 }, // only vertical borders
        lineColor: [0, 0, 0], // black vertical lines
      },
      headStyles: {
        fillColor: [66, 139, 202],
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Item ID
        1: { cellWidth: 50 }, // Item Name
        2: { cellWidth: 20 }, // Quantity
        3: { cellWidth: 20 }, // Unit Price
        4: { cellWidth: 25 }, // Gross Amount
        5: { cellWidth: 25 }, // Tax Amount
        6: { cellWidth: 25 }, // Total
      },
      didParseCell: function (data) {
        // Center align numbers
        if (data.column.index > 1 && !data.cell.raw?.content) {
          data.cell.styles.halign = "center";
        }
      },
    });

    // Save file
    doc.save(`MNS_Sales_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handlePdfExport = () => {
    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;
    // Add title
    doc.setFontSize(18);
    doc.text("MNS Sales Report", margin, 22);
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 30);
    // Add summary
    doc.setFontSize(14);
    doc.text("Summary", margin, 40);
    doc.setFontSize(10);
    doc.text(`Total Gross Sales: ${totalGrossSales.toFixed(2)}`, margin, 50);
    doc.text(`Total Tax Sales: ${totalTaxSales.toFixed(2)}`, margin + 56, 50);
    doc.text(`Total Sales: ${totalSales.toFixed(2)}`, margin + 126, 50);
    doc.text(`Total Items Sold: ${totalItems}`, margin, 58);
    doc.text(`Total Invoices: ${totalInvoices}`, margin, 66);
    // Table columns
    const tableColumn = [
      "Invoice No",
      "Customer Name",
      "Payment Method",
      "Date",
      "Item ID",
      "Item Name",
      "Quantity",
      "Unit Price",
      "Gross Amount",
      "Tax Amount",
      "Total",
    ];
    // Group items by invoice
    const groupedItems = {};
    tableDataWithSubtotals.forEach((item) => {
      if (!item.isSubtotal) {
        if (!groupedItems[item.invoiceId]) {
          groupedItems[item.invoiceId] = {
            date: item.date,
            customerName: item.customerName,
            paymentType: item.paymentType,
            items: [],
          };
        }
        groupedItems[item.invoiceId].items.push(item);
      }
    });
    const tableRows = [];
    let currentRowIndex = 0;
    Object.entries(groupedItems).forEach(([invoiceId, group]) => {
      const itemCount = group.items.length;
      // Add item rows with invoice info
      group.items.forEach((item, index) => {
        tableRows.push([
          index === 0 ? invoiceId : "",
          index === 0 ? group.customerName : "",
          index === 0 ? group.paymentType || "N/A" : "",
          index === 0 ? new Date(group.date).toLocaleDateString("en-GB") : "",
          item.itemId,
          item.itemName,
          item.quantity,
          item.sellingPrice.toFixed(2),
          item.grossAmount.toFixed(2),
          item.taxAmount.toFixed(2),
          item.totalAmount.toFixed(2),
        ]);
        currentRowIndex++;
      });
      // Add subtotal row
      const subtotalItem = tableDataWithSubtotals.find(
        (item) => item.isSubtotal && item.invoiceId === invoiceId
      );
      if (subtotalItem) {
        tableRows.push([
          {
            content: `Subtotal - Taxable: ${subtotalItem.amount.toFixed(
              2
            )} | Tax: ${subtotalItem.taxAmount.toFixed(
              2
            )} | Total: ${subtotalItem.totalAmount.toFixed(2)}`,
            colSpan: 11,
            styles: {
              fontStyle: "bold",
              fillColor: [245, 245, 245],
              halign: "right",
              lineWidth: 0.1,
              lineColor: [200, 200, 200],
            },
          },
        ]);
        currentRowIndex++;
      }
      // Empty row for spacing
      tableRows.push([
        {
          content: "",
          colSpan: 11,
          styles: {
            cellPadding: 2,
            lineWidth: 0,
          },
        },
      ]);
      currentRowIndex++;
    });
    // Calculate available width for table (page width minus margins)
    const availableWidth = pageWidth - margin * 2;
    // Generate table with full width and header borders
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      margin: { top: 30, left: margin, right: margin },
      tableWidth: "wrap",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        halign: "center",
        valign: "middle",
        // lineWidth: 0.1, // Add subtle borders for all cells
        lineColor: [200, 200, 200], // Light gray borders
        cellWidth: "wrap",
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        textColor: 255,
        // lineWidth: 0.5, // Thicker borders for header
        // lineColor: [50, 100, 150], // Darker blue borders for header
      },
      bodyStyles: {
        // lineWidth: 0.1, // Thinner borders for body
        // lineColor: [220, 220, 220], // Lighter gray for body borders
      },
      columnStyles: {
        // Distribute columns proportionally based on content importance
        0: { cellWidth: availableWidth * 0.08 }, // Invoice No
        1: { cellWidth: availableWidth * 0.12 }, // Customer Name
        2: { cellWidth: availableWidth * 0.1 }, // Payment Method
        3: { cellWidth: availableWidth * 0.08 }, // Date
        4: { cellWidth: availableWidth * 0.07 }, // Item ID
        5: { cellWidth: availableWidth * 0.18 }, // Item Name (more space)
        6: { cellWidth: availableWidth * 0.06 }, // Quantity
        7: { cellWidth: availableWidth * 0.08 }, // Unit Price
        8: { cellWidth: availableWidth * 0.09 }, // Gross Amount
        9: { cellWidth: availableWidth * 0.07 }, // Tax Amount
        10: { cellWidth: availableWidth * 0.07 }, // Total
      },
      didParseCell: function (data) {
        // Right align numeric columns
        if (
          [6, 7, 8, 9, 10].includes(data.column.index) &&
          !data.cell.raw?.content
        ) {
          data.cell.styles.halign = "center";
        }
        // Center align header cells
        if (data.section === "head") {
          data.cell.styles.halign = "center";
        }
        // Remove borders for empty cells in grouped rows
        if (data.cell.raw === "" && data.section === "body") {
          data.cell.styles.lineWidth = 0;
        }
        // Special styling for subtotal rows
        if (
          data.cell.raw?.content &&
          data.cell.raw.content.includes("Subtotal")
        ) {
          data.cell.styles.lineWidth = 0.3;
          data.cell.styles.lineColor = [150, 150, 150];
        }
      },
      willDrawCell: function (data) {
        // Add subtle row striping for better readability
        if (
          data.section === "body" &&
          data.row.index % 2 === 0 &&
          !data.cell.raw?.content?.includes("Subtotal")
        ) {
          doc.setFillColor(250, 250, 250);
          doc.rect(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            "F"
          );
        }
        // Draw thicker bottom border for header
        if (data.section === "head" && data.row.index === 0) {
          doc.setDrawColor(50, 100, 150);
          doc.setLineWidth(0.5);
          doc.line(
            data.cell.x,
            data.cell.y + data.cell.height,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height
          );
        }
      },
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          pageWidth - margin,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
        if (data.pageNumber > 1) {
          doc.setFontSize(16);
          doc.text("MNS Sales Report", margin, 20);
          doc.setFontSize(10);
          doc.text(
            `Generated on: ${new Date().toLocaleDateString()}`,
            margin,
            28
          );
        }
      },
    });
    // Add grand total aligned to right
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(
      `GRAND TOTAL: ${totalSales.toFixed(2)}`,
      pageWidth - margin,
      finalY,
      { align: "right" }
    );
    // Save PDF
    doc.save(`MNS_Sales_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        ref={componentRef}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          MNS Sales Report
        </h1>

        {/* Filters and Actions */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex flex-wrap items-center space-x-2 mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="flex cursor-pointer items-center space-x-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center space-x-2">
            <button
              className="flex cursor-pointer items-center space-x-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              onClick={handleExcelExport}
            >
              <FaFileExcel />
              <span>Excel</span>
            </button>

            <button
              className="flex cursor-pointer items-center space-x-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              onClick={handlePdfExport}
            >
              <FaFilePdf />
              <span>PDF</span>
            </button>

            {/* <button
              className="flex cursor-pointer items-center space-x-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              onClick={handlePrint}
            >
              <FaPrint />
              <span>Print</span>
            </button> */}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Advanced Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                  />
                  <span className="self-center">to</span>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter Type
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setFilterValue(""); // Reset filter value when type changes
                  }}
                >
                  <option value="all">All</option>
                  <option value="itemId">Item ID</option>
                  <option value="group">Group</option>
                  <option value="hsnCode">HSN Code</option>
                </select>
              </div>

              {filterType !== "all" ||
                (filterType != "hsnCode" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter Value
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                    >
                      <option value="">Select a value</option>
                      {filterType === "itemId" &&
                        uniqueFilters.itemIds.map((id) => (
                          <option key={id} value={id}>
                            {id}
                          </option>
                        ))}
                      {filterType === "group" &&
                        uniqueFilters.groups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                    </select>
                  </div>
                ))}
            </div>

            {/* HSN Selection Filter */}
            {filterType === "hsnCode" && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    HSN Filter
                  </label>
                  <button
                    onClick={selectAllHsn}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {selectAllHsn.length === uniqueFilters.hsnCodes.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                  <div className="flex flex-wrap gap-2">
                    {uniqueFilters.hsnCodes.map((code) => (
                      <div
                        key={code}
                        onClick={() => handleHsnSelection(code)}
                        className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                          selectedHsn.includes(code)
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
                {selectedHsn.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {selectedHsn.length} HSN
                    {selectedHsn.length !== 1 ? "s" : ""} selected
                  </div>
                )}
              </div>
            )}

            {/* Customer Selection Filter */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Customer Filter
                </label>
                <button
                  onClick={selectAllCustomers}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {selectedCustomers.length === uniqueFilters.customers.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                <div className="flex flex-wrap gap-2">
                  {uniqueFilters.customers.map((customer) => (
                    <div
                      key={customer}
                      onClick={() => handleCustomerSelection(customer)}
                      className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                        selectedCustomers.includes(customer)
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {customer}
                    </div>
                  ))}
                </div>
              </div>
              {selectedCustomers.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {selectedCustomers.length} customer
                  {selectedCustomers.length !== 1 ? "s" : ""} selected
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Total Gross Sales
            </h3>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(totalGrossSales)}
            </p>
          </div>
          <div className="bg-sky-100 border border-sky-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Total Tax Sales
            </h3>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(totalTaxSales)}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Total Sales
            </h3>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(totalSales)}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Items Sold
            </h3>
            <p className="text-2xl font-bold text-green-900">{totalItems}</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              Total Invoices
            </h3>
            <p className="text-2xl font-bold text-purple-900">
              {totalInvoices}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Top Selling Items
            </h3>
            <div className="h-64">
              {chartData.topItems.labels.length > 0 ? (
                <Bar
                  data={{
                    labels: chartData.topItems.labels,
                    datasets: [
                      {
                        label: "Quantity Sold",
                        data: chartData.topItems.data,
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sales Trend
            </h3>
            <div className="h-64">
              {chartData.salesTrend.labels.length > 0 ? (
                <Bar
                  data={{
                    labels: chartData.salesTrend.labels,
                    datasets: [
                      {
                        label: "Sales Amount",
                        data: chartData.salesTrend.data,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sl.No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <span>Date</span>
                    {sortField === "date" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="text-blue-500" />
                      ) : (
                        <FaSortAmountDown className="text-blue-500" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleSort("invoiceId")}
                  >
                    <span>Invoice</span>
                    {sortField === "invoiceId" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="text-blue-500" />
                      ) : (
                        <FaSortAmountDown className="text-blue-500" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleSort("itemId")}
                  >
                    <span>Item ID</span>
                    {sortField === "itemId" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="text-blue-500" />
                      ) : (
                        <FaSortAmountDown className="text-blue-500" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleSort("itemName")}
                  >
                    <span>Item Name</span>
                    {sortField === "itemName" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="text-blue-500" />
                      ) : (
                        <FaSortAmountDown className="text-blue-500" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleSort("quantity")}
                  >
                    <span>Quantity</span>
                    {sortField === "quantity" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="text-blue-500" />
                      ) : (
                        <FaSortAmountDown className="text-blue-500" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleSort("unitPrice")}
                  >
                    <span>Unit Price</span>
                    {sortField === "unitPrice" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="text-blue-500" />
                      ) : (
                        <FaSortAmountDown className="text-blue-500" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleSort("unitPrice")}
                  >
                    <span>Selling Price</span>
                    {sortField === "unitPrice" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="text-blue-500" />
                      ) : (
                        <FaSortAmountDown className="text-blue-500" />
                      ))}
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleSort("totalAmount")}
                  >
                    <span>Total</span>
                    {sortField === "totalAmount" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="text-blue-500" />
                      ) : (
                        <FaSortAmountDown className="text-blue-500" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleSort("customerName")}
                  >
                    <span>Customer</span>
                    {sortField === "customerName" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="text-blue-500" />
                      ) : (
                        <FaSortAmountDown className="text-blue-500" />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) =>
                  item.isSubtotal ? (
                    // Render subtotal row
                    <tr
                      key={`subtotal-${index}`}
                      className="bg-gray-100 font-semibold"
                    >
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                        {/* Leave serial number cell empty for subtotal */}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                        {/* Date cell empty for subtotal */}
                      </td>
                      <td
                        className="px-6 py-2 whitespace-nowrap text-sm text-gray-800"
                        colSpan="2"
                      >
                        Invoice {item.invoiceId} Subtotal:
                      </td>
                      <td
                        className="px-6 py-2 whitespace-nowrap text-sm text-gray-800"
                        colSpan="3"
                      >
                        {/* Item details cells empty for subtotal */}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                        Taxable: {formatCurrency(item.amount)}
                        <br />
                        Tax: {formatCurrency(item.taxAmount)}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                        {formatCurrency(item.totalAmount)}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                        {/* Customer cell empty for subtotal */}
                      </td>
                    </tr>
                  ) : (
                    // Render regular item row
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage +
                          index +
                          1 -
                          currentItems
                            .slice(0, index)
                            .filter((i) => i.isSubtotal).length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.invoiceId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.item_id || item.itemId || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.sellingPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.customerName}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {loading ? "Loading data..." : "No sales data found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, sortedData.length)} of{" "}
              {sortedData.length} entries
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 cursor-pointer hover:bg-blue-50 border"
                }`}
              >
                First
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 cursor-pointer hover:bg-blue-50 border"
                }`}
              >
                Prev
              </button>

              {[...Array(Math.min(5, totalPages))].map((_, i) => {
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
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 cursor-pointer rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 hover:bg-blue-50 border"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 cursor-pointer hover:bg-blue-50 border"
                }`}
              >
                Next
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100  text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 cursor-pointer hover:bg-blue-50 border"
                }`}
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* Items per page selector */}
        <div className="flex justify-end mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} MNS Billing System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SalsesReportPage;
