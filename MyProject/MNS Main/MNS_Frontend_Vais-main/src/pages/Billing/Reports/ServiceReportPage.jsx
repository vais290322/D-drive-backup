import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const ServicesReportPage = () => {
  const fetchBase = import.meta.env.VITE_BASE_URL_C;
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [serviceItems, setServiceItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [uniqueFilters, setUniqueFilters] = useState({
    descriptions: [],
    sacCodes: [],
    customers: [],
    paymentTypes: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState("all");

  const componentRef = useRef();

  const fetchServiceInvoices = async () => {
    try {
      setLoading(true);
      const url = `${fetchBase}/api/v1/service/get-all`;
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response?.data?.data) {
        throw new Error(response?.data?.message || "No data found");
      }

      const sortedInvoices = (response.data.data || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const processed = processServiceInvoiceData(sortedInvoices);
      setServiceItems(processed);
      extractUniqueFilterValues(processed);

      toast.success("Service invoices loaded successfully");
    } catch (err) {
      toast.error(err.message || "Error fetching service invoices");
    } finally {
      setLoading(false);
    }
  };

  const processServiceInvoiceData = (invoices) => {
    const items = [];
    const invoiceTotalsMap = new Map();

    invoices.forEach((invoice) => {
      // console.log("invoice : ", invoice);
      const invId = invoice.invoiceNumber || "N/A";
      const totals = {
        grossAmount: parseFloat(invoice?.total?.grossAmount) || 0,
        taxAmount:
          parseFloat(
            invoice?.total?.cgstAmount +
              invoice?.total?.sgstAmount +
              invoice?.total?.igstAmount
          ) || 0,
        grandTotal: parseFloat(invoice?.total?.grandTotal) || 0,
        payableAmount:
          parseFloat(invoice?.total?.totalPayableAmount) ||
          parseFloat(invoice?.total?.grandTotal) ||
          0,
      };
      invoiceTotalsMap.set(invId, totals);

      const receiver = invoice.receiverDetails || {};
      const paymentType = invoice.paymentType || "N/A";

      if (Array.isArray(invoice.items)) {
        invoice.items.forEach((item) => {
          items.push({
            invoiceId: invId,
            date: invoice.date,
            description: item?.description || "N/A",
            sacCode: item?.sacCode || "N/A",
            noOfPerson: parseInt(item?.noOfPerson) || 0,
            noOfDuites: parseInt(item?.noOfDuites) || 0,
            rate: parseFloat(item?.rate) || 0,
            month: parseInt(item?.month) || 0,
            amount: parseFloat(item?.amount) || 0,
            customerName: receiver?.name || "N/A",
            paymentType,
            invoiceTotals: totals,
          });
        });
      }
    });

    return items;
  };

  const extractUniqueFilterValues = (data) => {
    const descriptions = [...new Set(data.map((d) => d.description))];
    const sacCodes = [...new Set(data.map((d) => d.sacCode))];
    const customers = [...new Set(data.map((d) => d.customerName))];
    const paymentTypes = [...new Set(data.map((d) => d.paymentType))];

    setUniqueFilters({ descriptions, sacCodes, customers, paymentTypes });
  };

  useEffect(() => {
    fetchServiceInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();

    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;

    return serviceItems.filter((item) => {
      const matchesSearch =
        (item.description?.toLowerCase() || "").includes(query) ||
        (item.sacCode?.toLowerCase() || "").includes(query) ||
        (item.customerName?.toLowerCase() || "").includes(query) ||
        (item.invoiceId?.toLowerCase() || "").includes(query) ||
        (String(item.amount) || "").includes(query);

      const itemDate = new Date(item.date);
      const matchesDateRange =
        (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);

      let matchesTypeFilter = true;
      if (filterType !== "all" && filterValue) {
        if (filterType === "description")
          matchesTypeFilter = item.description === filterValue;
        else if (filterType === "sacCode")
          matchesTypeFilter = item.sacCode === filterValue;
        else if (filterType === "paymentType")
          matchesTypeFilter = item.paymentType === filterValue;
      }

      const matchesCustomerFilter =
        selectedCustomers.length === 0 ||
        selectedCustomers.includes(item.customerName);

      const matchesPaymentType =
        selectedPaymentType === "all" ||
        (item.paymentType?.toLowerCase() || "") ===
          selectedPaymentType.toLowerCase();

      return (
        matchesSearch &&
        matchesDateRange &&
        matchesTypeFilter &&
        matchesCustomerFilter &&
        matchesPaymentType
      );
    });
  }, [
    serviceItems,
    searchQuery,
    dateRange,
    filterType,
    filterValue,
    selectedCustomers,
    selectedPaymentType,
  ]);

  const sortedData = useMemo(() => {
    const data = [...filteredData];
    data.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    return data;
  }, [filteredData, sortField, sortDirection]);

  const prepareTableDataWithSubtotals = useMemo(() => {
    const byInvoice = new Map();
    sortedData.forEach((item) => {
      const key = item.invoiceId;
      if (!byInvoice.has(key)) byInvoice.set(key, []);
      byInvoice.get(key).push(item);
    });

    const table = [];
    for (const [invoiceId, items] of byInvoice.entries()) {
      items.forEach((item) => table.push({ ...item, isSubtotal: false }));

      const invTotals = items[0]?.invoiceTotals || {
        grossAmount: items.reduce((s, it) => s + (it.amount || 0), 0),
        taxAmount: 0,
        grandTotal: items.reduce((s, it) => s + (it.amount || 0), 0),
        payableAmount: items.reduce((s, it) => s + (it.amount || 0), 0),
      };

      table.push({
        invoiceId,
        isSubtotal: true,
        amount: invTotals.grossAmount,
        taxAmount: invTotals.taxAmount,
        totalAmount: invTotals.grandTotal,
        payableAmount: invTotals.payableAmount,
        date: items[0]?.date,
        customerName: items[0]?.customerName,
        description: `Subtotal for ${invoiceId}`,
        sacCode: "",
        noOfPerson: "",
        noOfDuites: "",
        rate: "",
        month: "",
        paymentType: items[0]?.paymentType || "N/A",
      });
    }

    return table;
  }, [sortedData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(
    () =>
      prepareTableDataWithSubtotals.slice(indexOfFirstItem, indexOfLastItem),
    [prepareTableDataWithSubtotals, indexOfFirstItem, indexOfLastItem]
  );

  // console.log("current items : ", currentItems);

  const totalPages = Math.ceil(
    prepareTableDataWithSubtotals.length / itemsPerPage
  );

  const uniqueFilteredInvoices = useMemo(() => {
    const map = new Map();
    filteredData.forEach((item) => {
      const id = item.invoiceId;
      if (!map.has(id)) map.set(id, item.invoiceTotals);
    });
    return map;
  }, [filteredData]);

  const totals = useMemo(() => {
    let gross = 0,
      tax = 0,
      grand = 0,
      payable = 0;

    uniqueFilteredInvoices.forEach((t) => {
      gross += t?.grossAmount || 0;
      tax += t?.taxAmount || 0;
      grand += t?.grandTotal || 0;
      payable += t?.payableAmount || t?.grandTotal || 0;
    });

    const servicesCount = filteredData.length;
    const invoicesCount = uniqueFilteredInvoices.size;

    return {
      gross,
      tax,
      grand,
      payable,
      servicesCount,
      invoicesCount,
    };
  }, [filteredData, uniqueFilteredInvoices]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount || 0);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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

  const resetFilters = () => {
    setDateRange({ from: "", to: "" });
    setFilterType("all");
    setFilterValue("");
    setSearchQuery("");
    setSelectedCustomers([]);
    setSelectedPaymentType("all");
  };

  const chartData = useMemo(() => {
    const byService = {};
    filteredData.forEach((item) => {
      const key = item.description || "N/A";
      byService[key] = (byService[key] || 0) + (item.amount || 0);
    });

    const topServices = Object.entries(byService)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const byDateGrand = {};
    uniqueFilteredInvoices.forEach((totals, invoiceId) => {
      const item = filteredData.find((d) => d.invoiceId === invoiceId);
      if (!item) return;
      const d = new Date(item.date).toLocaleDateString();
      byDateGrand[d] = (byDateGrand[d] || 0) + (totals?.grandTotal || 0);
    });
    const sortedDates = Object.keys(byDateGrand).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return {
      topServices: {
        labels: topServices.map(([name]) => name),
        data: topServices.map(([, amt]) => amt),
      },
      serviceTrend: {
        labels: sortedDates,
        data: sortedDates.map((d) => byDateGrand[d]),
      },
    };
  }, [filteredData, uniqueFilteredInvoices]);

  const handlePdfExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("MNS Service Report", 14, 22);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.setFontSize(14);
    doc.text("Summary", 14, 40);
    doc.setFontSize(10);
    doc.text(`Total Taxable: ${totals.gross.toFixed(2)}`, 14, 50);
    doc.text(`Total Tax: ${totals.tax.toFixed(2)}`, 14, 58);
    doc.text(`Total Grand: ${totals.grand.toFixed(2)}`, 14, 66);
    doc.text(`Total Payable: ${totals.payable.toFixed(2)}`, 14, 74);
    // doc.text(`Total Services: ${totals.servicesCount}`, 14, 82);
    doc.text(`Total Invoices: ${totals.invoicesCount}`, 14, 82);

    const columns = [
      "Customer",
      "Invoice No",
      "Date",
      "Description",
      "SAC Code",
      "Month",
      "No. Of Persons",
      "No. Of Duties",
      "Rate",
      "Amount",
      "Payment Type",
    ];
    const rows = [];

    prepareTableDataWithSubtotals.forEach((row) => {
      if (row.isSubtotal) {
        rows.push([
          "",
          `Subtotal - ${row.invoiceId}`,
          "",
          `Taxable: ${row.amount.toFixed(2)}`,
          "",
          "",
          "",
          "",
          `Tax: ${row.taxAmount.toFixed(2)}`,
          `Payable: ${row.payableAmount.toFixed(2)}`,
        ]);
      } else {
        rows.push([
          row.customerName,
          row.invoiceId,
          new Date(row.date).toLocaleDateString("en-GB"),
          row.description,
          row.sacCode,
          row.month,
          row.noOfPerson,
          row.noOfDuites,
          row.rate.toFixed(2),
          row.amount.toFixed(2),
          row.paymentType || "",
        ]);
      }
    });

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 100,
      theme: "grid",
      styles: { fontSize: 6 },
      headStyles: { fillColor: [66, 139, 202] },
      didParseCell: function (data) {
        if (
          data.row.raw &&
          data.row.raw[1] &&
          String(data.row.raw[1]).startsWith("Subtotal - ")
        ) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
    });

    doc.save(
      `MNS_Service_Report_${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  const handleExcelExport = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("MNS Service Report");

      // Header row definition
      const headers = [
        { header: "Invoice No", key: "invoiceId", width: 20 },
        { header: "Date", key: "date", width: 14 },
        { header: "Customer", key: "customer", width: 26 },
        { header: "Description", key: "description", width: 28 },
        { header: "SAC Code", key: "sacCode", width: 12 },
        { header: "No of Persons", key: "noOfPerson", width: 14 },
        { header: "No of Duties", key: "noOfDuites", width: 14 },
        { header: "Rate", key: "rate", width: 14 },
        { header: "Month", key: "month", width: 10 },
        { header: "Amount", key: "amount", width: 16 },
        { header: "Payment Type", key: "paymentType", width: 14 },
        { header: "Taxable Amount", key: "taxableAmount", width: 16 },
        { header: "Tax Amount", key: "taxAmount", width: 14 },
        { header: "Grand Total", key: "grandTotal", width: 16 },
        { header: "Payable Amount", key: "payableAmount", width: 18 },
      ];
      worksheet.columns = headers;

      // Insert title row above header (header will move to row 2)
      const totalColumns = headers.length;
      worksheet.insertRow(1, ["MNS's Service report"]);
      worksheet.mergeCells(1, 1, 1, totalColumns);
      const titleCell = worksheet.getCell(1, 1);
      titleCell.value = "MNS's Service report";
      titleCell.font = { bold: true, size: 16 };
      titleCell.alignment = { vertical: "middle", horizontal: "center" };
      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE3F2FD" }, // Light Blue
      };
      titleCell.border = {
        top: { style: "thin", color: { argb: "FFCCCCCC" } },
        left: { style: "thin", color: { argb: "FFCCCCCC" } },
        right: { style: "thin", color: { argb: "FFCCCCCC" } },
        bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
      };

      // Header styles - header is now at row 2
      const headerRow = worksheet.getRow(2);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1E88E5" }, // Blue header
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFBFBFBF" } },
          left: { style: "thin", color: { argb: "FFBFBFBF" } },
          right: { style: "thin", color: { argb: "FFBFBFBF" } },
          bottom: { style: "thin", color: { argb: "FFBFBFBF" } },
        };
      });

      // Freeze title + header
      worksheet.views = [{ state: "frozen", ySplit: 2 }];

      // Number formats for currency columns
      const currencyKeys = new Set([
        "rate",
        "amount",
        "taxableAmount",
        "taxAmount",
        "grandTotal",
        "payableAmount",
      ]);

      // Add data rows with subtotal styling
      prepareTableDataWithSubtotals.forEach((row) => {
        if (row.isSubtotal) {
          const subtotalRow = worksheet.addRow({
            invoiceId: `Subtotal - ${row.invoiceId}`,
            date: new Date(row.date).toLocaleDateString("en-GB"),
            customer: row.customerName,
            description: "",
            sacCode: "",
            noOfPerson: "",
            noOfDuites: "",
            rate: "",
            month: "",
            amount: "",
            paymentType: row.paymentType || "",
            taxableAmount: Number(
              row.amount?.toFixed ? row.amount.toFixed(2) : row.amount
            ),
            taxAmount: Number(
              row.taxAmount?.toFixed ? row.taxAmount.toFixed(2) : row.taxAmount
            ),
            grandTotal: Number(
              row.totalAmount?.toFixed
                ? row.totalAmount.toFixed(2)
                : row.totalAmount
            ),
            payableAmount: Number(
              row.payableAmount?.toFixed
                ? row.payableAmount.toFixed(2)
                : row.payableAmount
            ),
          });

          // Style subtotal rows (light gray + bold)
          subtotalRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FF333333" } };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF0F0F0" }, // Light Gray
            };
            cell.border = {
              top: { style: "thin", color: { argb: "FFDDDDDD" } },
              left: { style: "thin", color: { argb: "FFDDDDDD" } },
              right: { style: "thin", color: { argb: "FFDDDDDD" } },
              bottom: { style: "thin", color: { argb: "FFDDDDDD" } },
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });

          // Currency formatting
          ["taxableAmount", "taxAmount", "grandTotal", "payableAmount"].forEach(
            (key, idx) => {
              const cell = subtotalRow.getCell(
                headers.findIndex((h) => h.key === key) + 1
              );
              cell.numFmt = "₹ #,##0.00";
            }
          );
        } else {
          const dataRow = worksheet.addRow({
            invoiceId: row.invoiceId,
            date: new Date(row.date).toLocaleDateString("en-GB"),
            customer: row.customerName,
            description: row.description,
            sacCode: row.sacCode,
            noOfPerson: row.noOfPerson,
            noOfDuites: row.noOfDuites,
            rate: Number(row.rate?.toFixed ? row.rate.toFixed(2) : row.rate),
            month: row.month,
            amount: Number(
              row.amount?.toFixed ? row.amount.toFixed(2) : row.amount
            ),
            paymentType: row.paymentType || "",
            taxableAmount: null,
            taxAmount: null,
            grandTotal: null,
            payableAmount: null,
          });

          // Style data rows
          dataRow.eachCell((cell) => {
            cell.border = {
              top: { style: "thin", color: { argb: "FFEFEFEF" } },
              left: { style: "thin", color: { argb: "FFEFEFEF" } },
              right: { style: "thin", color: { argb: "FFEFEFEF" } },
              bottom: { style: "thin", color: { argb: "FFEFEFEF" } },
            };
            cell.alignment = {
              vertical: "middle",
              horizontal: "left",
              wrapText: true,
            };
          });

          // Currency formatting
          ["rate", "amount"].forEach((key) => {
            const cell = dataRow.getCell(
              headers.findIndex((h) => h.key === key) + 1
            );
            cell.numFmt = "₹ #,##0.00";
            cell.alignment = { vertical: "middle", horizontal: "right" };
          });
        }
      });

      // Summary section at bottom of same sheet
      worksheet.addRow([]);
      const summaryTitleRow = worksheet.addRow(["Summary"]);
      worksheet.mergeCells(
        summaryTitleRow.number,
        1,
        summaryTitleRow.number,
        totalColumns
      );
      summaryTitleRow.getCell(1).font = { bold: true, size: 12 };
      summaryTitleRow.getCell(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      summaryTitleRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFF3CD" }, // Light Yellow
      };
      summaryTitleRow.getCell(1).border = {
        top: { style: "thin", color: { argb: "FFCCCCCC" } },
        left: { style: "thin", color: { argb: "FFCCCCCC" } },
        right: { style: "thin", color: { argb: "FFCCCCCC" } },
        bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
      };

      const summaryRows = [
        ["Total Taxable", Number(totals.gross?.toFixed(2))],
        ["Total Tax", Number(totals.tax?.toFixed(2))],
        ["Total Grand", Number(totals.grand?.toFixed(2))],
        ["Total Payable", Number(totals.payable?.toFixed(2))],
        // ["Total Services", totals.servicesCount],
        ["Total Invoices", totals.invoicesCount],
      ];

      summaryRows.forEach(([label, value]) => {
        const r = worksheet.addRow([label, value]);
        r.getCell(1).font = { bold: true, color: { argb: "FF333333" } };
        r.getCell(2).font = { bold: true, color: { argb: "FF333333" } };
        // r.getCell(2).numFmt = typeof value === "number" && label.startsWith("Total ")
        //   ? "₹ #,##0.00"
        //   : undefined;
        r.getCell(1).alignment = { horizontal: "right" };
        r.getCell(2).alignment = { horizontal: "left" };
        // Borders for summary rows
        r.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFE0E0E0" } },
            left: { style: "thin", color: { argb: "FFE0E0E0" } },
            right: { style: "thin", color: { argb: "FFE0E0E0" } },
            bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
          };
        });
      });

      // Export workbook
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `MNS_Service_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Excel exported successfully");
    } catch (err) {
      console.error("Excel export error:", err);
      toast.error(err.message || "Failed to export Excel");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        ref={componentRef}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          MNS Service Report
        </h1>

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
                className="flex cursor-pointer items-center space-x-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 "
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
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Advanced Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    setFilterValue("");
                  }}
                >
                  <option value="all">All</option>
                  <option value="description">Service Description</option>
                  <option value="sacCode">SAC Code</option>
                  <option value="paymentType">Payment Type</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter Value
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  disabled={filterType === "all"}
                >
                  <option value="">
                    {filterType === "all" ? "Not applicable" : "Select value"}
                  </option>
                  {filterType === "description" &&
                    uniqueFilters.descriptions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  {filterType === "sacCode" &&
                    uniqueFilters.sacCodes.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  {filterType === "paymentType" &&
                    uniqueFilters.paymentTypes.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedPaymentType}
                  onChange={(e) => setSelectedPaymentType(e.target.value)}
                >
                  <option value="all">All</option>
                  {uniqueFilters.paymentTypes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customers
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 cursor-pointer "
                  onClick={selectAllCustomers}
                >
                  {selectedCustomers.length === uniqueFilters.customers.length
                    ? "Unselect All"
                    : "Select All"}
                </button>
                {uniqueFilters.customers.map((customer) => (
                  <button
                    key={customer}
                    className={`px-3 py-1 rounded border cursor-pointer ${
                      selectedCustomers.includes(customer)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                    onClick={() => handleCustomerSelection(customer)}
                  >
                    {customer}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  #
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer"
                  onClick={() => handleSort("customerName")}
                >
                  Customer
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer"
                  onClick={() => handleSort("invoiceId")}
                >
                  Invoice No
                  {sortField === "invoiceId" &&
                    (sortDirection === "asc" ? (
                      <FaSortAmountUp className="inline ml-1" />
                    ) : (
                      <FaSortAmountDown className="inline ml-1" />
                    ))}
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortField === "date" &&
                    (sortDirection === "asc" ? (
                      <FaSortAmountUp className="inline ml-1" />
                    ) : (
                      <FaSortAmountDown className="inline ml-1" />
                    ))}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  SAC Code
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                  Month
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                  No. Of Persons
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                  No. Of Duites
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                  Rate
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Payment Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-4 py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                currentItems.map((row, index) =>
                  row.isSubtotal ? (
                    <tr
                      key={`subtotal-${row.invoiceId}`}
                      className="bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-black font-bold">
                        {row.customerName}
                      </td>
                      <td className="px-4 py-3 text-sm  text-black font-bold">
                        Subtotal - {row.invoiceId}
                      </td>
                      <td className="px-4 py-3 text-sm text-black font-bold">
                        {new Date(row.date).toLocaleDateString("en-GB")}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-black font-bold"
                        colSpan={3}
                      >
                        Taxable: {formatCurrency(row.amount)} | Tax:{" "}
                        {formatCurrency(row.taxAmount)} | Grand:{" "}
                        {formatCurrency(row.totalAmount)} | Payable:{" "}
                        {formatCurrency(row.payableAmount)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        —
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        —
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        —
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        —
                      </td>
                      <td className="px-4 py-3 text-sm text-black font-bold">
                        {row.paymentType}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={`${row.invoiceId}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {row.customerName}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {row.invoiceId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(row.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {row.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {row.sacCode}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {row.month}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {row.noOfPerson}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {row.noOfDuites}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {formatCurrency(row.rate)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {formatCurrency(row.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {row.paymentType}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            {prepareTableDataWithSubtotals.length > 0
              ? indexOfFirstItem + 1
              : 0}{" "}
            to {Math.min(indexOfLastItem, prepareTableDataWithSubtotals.length)}{" "}
            of {prepareTableDataWithSubtotals.length} rows
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
            </select>

            <div className="flex items-center gap-2 ml-4">
              <button
                className="px-3 py-1 border rounded cursor-pointer"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} / {totalPages || 1}
              </span>
              <button
                className="px-3 py-1 border rounded cursor-pointer"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-sm text-gray-600">Total Taxable</div>
            <div className="text-xl font-semibold text-blue-700">
              {formatCurrency(totals.gross)}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <div className="text-sm text-gray-600">Total Tax</div>
            <div className="text-xl font-semibold text-yellow-700">
              {formatCurrency(totals.tax)}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-sm text-gray-600">Grand Total</div>
            <div className="text-xl font-semibold text-green-700">
              {formatCurrency(totals.grand)}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <div className="text-sm text-gray-600">Payable Amount</div>
            <div className="text-xl font-semibold text-purple-700">
              {formatCurrency(totals.payable)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Total Services Invoices</div>
            <div className="text-xl font-semibold text-gray-700">
              {totals.invoicesCount}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              Top Services by Amount
            </h3>
            <Pie
              data={{
                labels: chartData.topServices.labels,
                datasets: [
                  {
                    data: chartData.topServices.data,
                    backgroundColor: [
                      "#36A2EB",
                      "#FF6384",
                      "#FFCE56",
                      "#4BC0C0",
                      "#9966FF",
                    ],
                  },
                ],
              }}
            />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Service Trend</h3>
            <Bar
              data={{
                labels: chartData.serviceTrend.labels,
                datasets: [
                  {
                    label: "Grand Total",
                    data: chartData.serviceTrend.data,
                    backgroundColor: "#36A2EB",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: false },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesReportPage;
