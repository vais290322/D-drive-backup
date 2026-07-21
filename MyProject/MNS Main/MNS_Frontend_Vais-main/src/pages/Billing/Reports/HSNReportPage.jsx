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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { backendDomainA } from "../../../Common/index";
const fetchAllInvoice = import.meta.env.VITE_REACT_FETCH_ALL_INVOICE_MNS;

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
      isServiceInvoice: false,
      paymentType: inv.paymentType
    };
  });
};

const HSNReportPage = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterGstType, setFilterGstType] = useState("all");
  const [filterInvoiceType, setFilterInvoiceType] = useState("all");
  const [allinvoice, setAllInvoice] = useState([]);
  const [allServiceInvoice, setAllServiceInvoice] = useState([]);
  const componentRef = useRef();


  const groupedRows = groupInvoices(allinvoice);

  const modifiedServiceInvoice = allServiceInvoice.map((inv, idx) => {
    const invoiceNumber = inv.invoiceNumber;
    const date = inv.date;
    const customer = inv.receiverDetails?.name;
    const gstin = inv.receiverDetails?.gstin;
    const uqc = null;
    const quantity = null;
    const invoiceValue = inv.total?.totalPayableAmount || inv.total?.grandTotal;
    const rate = Number(inv.total?.igst) > 0 ? Number(inv.total?.igst) : (Number(inv.total?.cgst) + Number(inv.total?.sgst)) + "%";
    const taxableValue = inv.total?.grossAmount;
    const integratedTaxAmount = Number(inv.total?.igstAmount) > 0 ? Number(inv.total?.igstAmount) : 0;
    const centralTaxAmount = Number(inv.total?.cgstAmount) > 0 ? Number(inv.total?.cgstAmount) : 0;
    const stateTaxAmount = Number(inv.total?.sgstAmount) > 0 ? Number(inv.total?.sgstAmount) : 0;
    const items = inv.items;
    const totalInvoiceValue = inv.total?.totalPayableAmount || inv.total?.grandTotal;

    const expandedItems = items.map((item) => {
      return {
        invoiceNumber,
        date,
        customer,
        gstin,
        hsn: item.sacCode || item.hsnCode,
        description: item.description || " ",
        uqc,
        quantity,
        invoiceValue: invoiceValue.toFixed(2),
        rate,
        taxableValue: taxableValue.toFixed(2),
        integratedTaxAmount: integratedTaxAmount.toFixed(2),
        centralTaxAmount: centralTaxAmount.toFixed(2),
        stateTaxAmount: stateTaxAmount.toFixed(2),
      }
    })


    return {
      slNo: idx + 1,
      invoiceNumber,
      date,
      customer,
      gstin,
      items: expandedItems,
      totalInvoiceValue: totalInvoiceValue.toFixed(2),
      isServiceInvoice: true,
      paymentType: inv.paymentType
    };
  });

  const mergedInvoices = [
    ...groupedRows,
    ...modifiedServiceInvoice
  ];

  const sortedInvoices = mergedInvoices.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Filter data based on search query and GST type
  const filteredInvoices = sortedInvoices.filter((inv) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      inv.invoiceNumber?.toLowerCase().includes(query) ||
      inv.customer?.toLowerCase().includes(query) ||
      inv.gstin?.toLowerCase().includes(query) ||
      inv.items?.some(item =>
        (item.hsn || "").toLowerCase().includes(query) ||
        (item.description || "").toLowerCase().includes(query)
      );

    // GST filter (based on item tax)
    const matchesGstType =
      filterGstType === "all" ||
      inv.items.some(item =>
        filterGstType === "igst"
          ? Number(item.integratedTaxAmount) > 0
          : Number(item.centralTaxAmount) > 0 || Number(item.stateTaxAmount) > 0
      );

    // invoice type or payment type cash or credit

    const matchPaymentType = filterInvoiceType === "all" || inv.paymentType === filterInvoiceType;

    // Date range filter
    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const invoiceDate = new Date(inv.date);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);

      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      matchesDateRange =
        invoiceDate >= fromDate && invoiceDate <= toDate;
    }

    return matchesSearch && matchesGstType && matchesDateRange && matchPaymentType;
  });

  const finalInvoices = filteredInvoices.map((inv, index) => ({
    ...inv,
    slNo: index + 1
  }));


  // Modified pagination - work with invoices instead of individual items
  const totalInvoices = finalInvoices.length;
  const totalPages = Math.ceil(totalInvoices / itemsPerPage);

  // Calculate which invoices to show on current page
  const indexOfLastInvoice = currentPage * itemsPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - itemsPerPage;
  const paginatedInvoices = finalInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  // Flatten items for display (only for current page invoices)
  const getFlattenedItems = (invoices) => {
    const items = [];
    // console.log("invoices ", invoices)

    invoices.forEach((invoice) => {
      // If searching for HSN code, only include matching items with exact match
      const filteredItems = searchQuery && !(
        (invoice.invoiceNumber?.toLowerCase() || "").includes(searchQuery?.toLowerCase()) ||
        (invoice.customer?.toLowerCase() || "").includes(searchQuery?.toLowerCase()) ||
        (invoice.gstin?.toLowerCase() || "").includes(searchQuery?.toLowerCase())
      )
        ? invoice.items.filter(item =>
          (item.hsn || item.hsnCode || "") === searchQuery
        )
        : invoice.items;

      // Add filtered items to the display list
      filteredItems.forEach((item, index) => {
        items.push({
          ...item,
          isFirstItem: index === 0,
          itemCount: filteredItems.length,
          rowSpan: index === 0 ? filteredItems.length : 0,
          uniqueId: `${invoice.invoiceNumber}-${index}`,
          isServiceInvoice: invoice.isServiceInvoice
        });
      });
    });
    return items;
  };

  // Get flattened items for current page only
  const currentPageItems = getFlattenedItems(paginatedInvoices);

  // console.log("final invoice : ", sortedInvoices)
  // Get all items for totals calculation and export
  const allItems = getFlattenedItems(finalInvoices);

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

  const getAllServiceInvoices = async () => {
    try {
      const getAllData = await fetch(`${backendDomainA}/api/v1/service/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await getAllData.json();
      // const reversedData = [...(jsonData.data || [])].reverse();
      const sortedData = [...(jsonData.data || [])].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      toast.success("Successfully fetched Invoice Data");
      setAllServiceInvoice(sortedData || []);
    } catch (error) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    getAllServiceInvoices();
    getAllInvoices();
  }, []);

  const handleResetFilter = () => {
    setSearchQuery("");
    setFilterGstType("all");
    setDateRange({ from: "", to: "" });
    setFilterInvoiceType("all");
  };

  // Handle Excel export
  const handleHsnGstWiseExcelExport1 = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("HSN and GST Wise Report");

      // Group by HSN and then by GST Rate
      const hsnGroups = {};
      filteredData.forEach((invoice) => {
        invoice.items?.forEach((item) => {
          const hsn = item.hsnCode || "";
          const gstRate = item.taxRate || item.taxRatePercent || 0;

          if (!hsnGroups[hsn]) {
            hsnGroups[hsn] = {};
          }

          if (!hsnGroups[hsn][gstRate]) {
            hsnGroups[hsn][gstRate] = [];
          }

          // Find existing item with same description or create new
          let existingItem = hsnGroups[hsn][gstRate].find(
            existing => existing.description === (item.description || item.itemName || "")
          );

          if (!existingItem) {
            existingItem = {
              gstRate: gstRate,
              description: item.description || item.itemName || "",
              uqc: item.uom || "NO",
              totalQuantity: 0,
              invoiceValue: 0,
              taxableValue: 0,
              integratedTaxAmount: 0,
              centralTaxAmount: 0,
              stateTaxAmount: 0
            };
            hsnGroups[hsn][gstRate].push(existingItem);
          }

          let integrated = 0, central = 0, state = 0;
          if ((item.cgst > 0 || item.sgst > 0) && item.taxAmount > 0) {
            central = Number(item.taxAmount) / 2;
            state = Number(item.taxAmount) / 2;
          } else if (item.igst > 0 && item.taxAmount > 0) {
            integrated = Number(item.taxAmount);
          }

          existingItem.totalQuantity += Number(item.quantity || 0);
          existingItem.invoiceValue += Number(invoice.grandTotal || 0);
          existingItem.taxableValue += Number(item.netAmount || item.amount || 0);
          existingItem.integratedTaxAmount += integrated;
          existingItem.centralTaxAmount += central;
          existingItem.stateTaxAmount += state;
        });
      });

      // Define columns
      worksheet.columns = [
        { header: "Sl. No.", key: "slNo", width: 8 },
        { header: "HSN", key: "hsn", width: 12 },
        { header: "Description", key: "description", width: 35 },
        { header: "UQC", key: "uqc", width: 10 },
        { header: "Total Quantity", key: "totalQuantity", width: 14 },
        { header: "Invoice Value", key: "invoiceValue", width: 14 },
        { header: "Rate", key: "rate", width: 8 },
        { header: "Taxable Value", key: "taxableValue", width: 14 },
        { header: "Integrated Tax Amount", key: "integratedTaxAmount", width: 20 },
        { header: "Central Tax Amount", key: "centralTaxAmount", width: 18 },
        { header: "State/UT Tax Amount", key: "stateTaxAmount", width: 18 }
      ];

      // Remove any extra columns beyond what we need
      const maxColumn = worksheet.columnCount;
      if (maxColumn > 11) {
        for (let i = 12; i <= maxColumn; i++) {
          worksheet.getColumn(i).hidden = true;
        }
      }

      // Style header
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
      headerRow.alignment = { vertical: "middle", horizontal: "center" };
      headerRow.height = 20;
      headerRow.eachCell((cell) => {
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      });

      const sortedHsnCodes = Object.keys(hsnGroups).sort((a, b) => {
        if (!a && !b) return 0;
        if (!a) return 1;
        if (!b) return -1;
        const numA = parseInt(a);
        const numB = parseInt(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      });

      let currentRow = 2;
      let slNo = 1;
      const mergeRanges = [];
      const summaryTotals = {
        totalQuantity: 0,
        invoiceValue: 0,
        taxableValue: 0,
        integratedTaxAmount: 0,
        centralTaxAmount: 0,
        stateTaxAmount: 0
      };

      sortedHsnCodes.forEach((hsn) => {
        const rateGroups = hsnGroups[hsn];
        const sortedRates = Object.keys(rateGroups).sort((a, b) => Number(a) - Number(b));

        let hsnTotal = {
          totalQuantity: 0,
          invoiceValue: 0,
          taxableValue: 0,
          integratedTaxAmount: 0,
          centralTaxAmount: 0,
          stateTaxAmount: 0
        };

        const hsnStartRow = currentRow;
        let hsnHasMultipleRatesOrItems = false;

        // Check if HSN has multiple rates or multiple items
        const totalItemsInHsn = sortedRates.reduce((sum, rate) => sum + rateGroups[rate].length, 0);
        hsnHasMultipleRatesOrItems = sortedRates.length > 1 || totalItemsInHsn > 1;

        sortedRates.forEach((rate) => {
          const items = rateGroups[rate];
          items.sort((a, b) => (a.description || "").localeCompare(b.description || ""));

          const rateStartRow = currentRow;
          let rateHasMultipleItems = items.length > 1;

          let rateTotal = {
            totalQuantity: 0,
            invoiceValue: 0,
            taxableValue: 0,
            integratedTaxAmount: 0,
            centralTaxAmount: 0,
            stateTaxAmount: 0
          };

          // Add individual items
          items.forEach((data, itemIndex) => {
            const isFirstItemInRate = itemIndex === 0;

            const dataRow = worksheet.addRow({
              slNo: !hsnHasMultipleRatesOrItems ? slNo++ : "",
              hsn: "",
              description: data.description,
              uqc: data.uqc,
              totalQuantity: data.totalQuantity,
              invoiceValue: parseFloat(data.invoiceValue.toFixed(2)),
              rate: "", // Will be filled by merge
              taxableValue: parseFloat(data.taxableValue.toFixed(2)),
              integratedTaxAmount: data.integratedTaxAmount ? parseFloat(data.integratedTaxAmount.toFixed(2)) : 0,
              centralTaxAmount: data.centralTaxAmount ? parseFloat(data.centralTaxAmount.toFixed(2)) : 0,
              stateTaxAmount: data.stateTaxAmount ? parseFloat(data.stateTaxAmount.toFixed(2)) : 0
            });

            styleDataRow(dataRow);
            currentRow++;

            rateTotal.totalQuantity += data.totalQuantity;
            rateTotal.invoiceValue += data.invoiceValue;
            rateTotal.taxableValue += data.taxableValue;
            rateTotal.integratedTaxAmount += data.integratedTaxAmount;
            rateTotal.centralTaxAmount += data.centralTaxAmount;
            rateTotal.stateTaxAmount += data.stateTaxAmount;
          });

          // Merge rate column for all items with same rate
          if (items.length > 0) {
            mergeRanges.push({
              startRow: rateStartRow,
              endRow: currentRow - 1,
              column: 7, // Rate column
              value: Number(rate) + "%"
            });
          }

          hsnTotal.totalQuantity += rateTotal.totalQuantity;
          hsnTotal.invoiceValue += rateTotal.invoiceValue;
          hsnTotal.taxableValue += rateTotal.taxableValue;
          hsnTotal.integratedTaxAmount += rateTotal.integratedTaxAmount;
          hsnTotal.centralTaxAmount += rateTotal.centralTaxAmount;
          hsnTotal.stateTaxAmount += rateTotal.stateTaxAmount;
        });

        // Add HSN total row if there are multiple rates or items
        if (hsnHasMultipleRatesOrItems) {
          const totalRow = worksheet.addRow({
            slNo: slNo++,
            hsn: "",
            description: "HSN Total",
            uqc: "",
            totalQuantity: hsnTotal.totalQuantity,
            invoiceValue: parseFloat(hsnTotal.invoiceValue.toFixed(2)),
            rate: "",
            taxableValue: parseFloat(hsnTotal.taxableValue.toFixed(2)),
            integratedTaxAmount: hsnTotal.integratedTaxAmount ? parseFloat(hsnTotal.integratedTaxAmount.toFixed(2)) : "",
            centralTaxAmount: hsnTotal.centralTaxAmount ? parseFloat(hsnTotal.centralTaxAmount.toFixed(2)) : "",
            stateTaxAmount: hsnTotal.stateTaxAmount ? parseFloat(hsnTotal.stateTaxAmount.toFixed(2)) : ""
          });
          styleDataRow(totalRow);
          totalRow.font = { bold: true };
          totalRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF666666" } };
          currentRow++;
        }

        // Merge HSN column
        if (hsnStartRow < currentRow) {
          mergeRanges.push({
            startRow: hsnStartRow,
            endRow: currentRow - 1,
            column: 2, // HSN column
            value: hsn
          });
        }

        summaryTotals.totalQuantity += hsnTotal.totalQuantity;
        summaryTotals.invoiceValue += hsnTotal.invoiceValue;
        summaryTotals.taxableValue += hsnTotal.taxableValue;
        summaryTotals.integratedTaxAmount += hsnTotal.integratedTaxAmount;
        summaryTotals.centralTaxAmount += hsnTotal.centralTaxAmount;
        summaryTotals.stateTaxAmount += hsnTotal.stateTaxAmount;
      });

      // Apply all merges
      mergeRanges.forEach(range => {
        worksheet.mergeCells(range.startRow, range.column, range.endRow, range.column);
        const mergedCell = worksheet.getCell(range.startRow, range.column);
        mergedCell.value = range.value;
        mergedCell.alignment = { vertical: "middle", horizontal: "center" };
        mergedCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });

      // GRAND TOTAL
      const grandTotalRow = worksheet.addRow({
        slNo: "",
        hsn: "",
        description: "GRAND TOTAL",
        uqc: "",
        totalQuantity: summaryTotals.totalQuantity,
        invoiceValue: parseFloat(summaryTotals.invoiceValue.toFixed(2)),
        rate: "",
        taxableValue: parseFloat(summaryTotals.taxableValue.toFixed(2)),
        integratedTaxAmount: parseFloat(summaryTotals.integratedTaxAmount.toFixed(2)),
        centralTaxAmount: parseFloat(summaryTotals.centralTaxAmount.toFixed(2)),
        stateTaxAmount: parseFloat(summaryTotals.stateTaxAmount.toFixed(2))
      });
      grandTotalRow.font = { bold: true };
      grandTotalRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9EDF7" } };
      grandTotalRow.eachCell((cell) => {
        cell.border = { top: { style: "thick" }, left: { style: "thin" }, bottom: { style: "thick" }, right: { style: "thin" } };
      });
      ["totalQuantity", "invoiceValue", "taxableValue", "integratedTaxAmount", "centralTaxAmount", "stateTaxAmount"].forEach((key) => {
        grandTotalRow.getCell(key).alignment = { horizontal: "right", vertical: "middle" };
        grandTotalRow.getCell(key).numFmt = '#,##0.00';
      });

      // Styling function
      function styleDataRow(row) {
        row.eachCell((cell) => {
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
          cell.alignment = { vertical: "middle", horizontal: "left" };
        });
        ["totalQuantity", "invoiceValue", "taxableValue", "integratedTaxAmount", "centralTaxAmount", "stateTaxAmount"].forEach((key) => {
          if (row.getCell(key).value !== "" && row.getCell(key).value != null) {
            row.getCell(key).alignment = { horizontal: "right", vertical: "middle" };
            row.getCell(key).numFmt = '#,##0.00';
          }
        });
        ["slNo", "hsn", "uqc", "rate"].forEach((key) => {
          if (row.getCell(key).value !== "" && row.getCell(key).value != null) {
            row.getCell(key).alignment = { horizontal: "center", vertical: "middle" };
          }
        });
        if (row.getCell("totalQuantity").value !== "" && row.getCell("totalQuantity").value != null) {
          row.getCell("totalQuantity").numFmt = '#,##0';
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "hsnAndGstWiseReport.xlsx");
      toast.success("HSN and GST Wise Excel exported successfully!");
    } catch (error) {
      console.error("Error exporting HSN and GST wise Excel:", error);
      toast.error("Failed to export HSN and GST wise Excel");
    }
  };

  const handleHsnGstWiseExcelExport = async () => {
  try {
    if (!filteredInvoices || filteredInvoices.length === 0) {
      toast.error("No data available");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("HSN GST Summary");

    // ===============================
    // 1️⃣ GROUP BY HSN + GST + DESC
    // ===============================
    const hsnGroups = {};

    filteredInvoices.forEach((invoice) => {
      invoice.items.forEach((item) => {
        const hsn = item.hsn || "SERVICE";
        const gstRate = item.rate || "0%";
        const description = item.description || "";

        if (!hsnGroups[hsn]) hsnGroups[hsn] = {};
        const key = `${gstRate}_${description}`;

        if (!hsnGroups[hsn][key]) {
          hsnGroups[hsn][key] = {
            hsn,
            gstRate,
            description,
            uqc: item.uqc || "",
            totalQuantity: 0,
            taxableValue: 0,
            integratedTaxAmount: 0,
            centralTaxAmount: 0,
            stateTaxAmount: 0,
            invoiceValue: 0,
          };
        }

        const g = hsnGroups[hsn][key];

        g.totalQuantity += Number(item.quantity || 0);
        g.taxableValue += Number(item.taxableValue || 0);
        g.integratedTaxAmount += Number(item.integratedTaxAmount || 0);
        g.centralTaxAmount += Number(item.centralTaxAmount || 0);
        g.stateTaxAmount += Number(item.stateTaxAmount || 0);
        g.invoiceValue += Number(item.invoiceValue || 0);
      });
    });

    // ===============================
    // 2️⃣ SHEET COLUMNS
    // ===============================
    worksheet.columns = [
      { header: "Sl No", key: "slNo", width: 8 },
      { header: "HSN / SAC", key: "hsn", width: 14 },
      { header: "Description", key: "description", width: 36 },
      { header: "UQC", key: "uqc", width: 10 },
      { header: "Quantity", key: "qty", width: 12 },
      { header: "GST %", key: "gst", width: 10 },
      { header: "Taxable Value", key: "taxable", width: 16 },
      { header: "IGST", key: "igst", width: 14 },
      { header: "CGST", key: "cgst", width: 14 },
      { header: "SGST", key: "sgst", width: 14 },
      { header: "Invoice Value", key: "invoice", width: 16 },
    ];

    // Header style
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    // ===============================
    // 3️⃣ FILL DATA + MERGES
    // ===============================
    let rowNo = 2;
    let slNo = 1;
    const mergeRanges = [];

    const grandTotal = {
      qty: 0,
      taxable: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      invoice: 0,
    };

    Object.values(hsnGroups).forEach((rateGroups) => {
      const items = Object.values(rateGroups).sort(
        (a, b) => parseFloat(a.gstRate) - parseFloat(b.gstRate)
      );

      const hsnStart = rowNo;

      items.forEach((item) => {
        const r = worksheet.addRow({
          slNo,
          hsn: item.hsn,
          description: item.description,
          uqc: item.uqc,
          qty: item.totalQuantity,
          gst: item.gstRate,
          taxable: item.taxableValue,
          igst: item.integratedTaxAmount,
          cgst: item.centralTaxAmount,
          sgst: item.stateTaxAmount,
          invoice: item.invoiceValue,
        });

        styleRow(r);
        rowNo++;
        slNo++;

        grandTotal.qty += item.totalQuantity;
        grandTotal.taxable += item.taxableValue;
        grandTotal.igst += item.integratedTaxAmount;
        grandTotal.cgst += item.centralTaxAmount;
        grandTotal.sgst += item.stateTaxAmount;
        grandTotal.invoice += item.invoiceValue;
      });

      if (hsnStart < rowNo - 1) {
        mergeRanges.push({ start: hsnStart, end: rowNo - 1, col: 2 });
      }
    });

    // Apply merges
    mergeRanges.forEach((m) => {
      worksheet.mergeCells(m.start, m.col, m.end, m.col);
      worksheet.getCell(m.start, m.col).alignment = { vertical: "middle", horizontal: "center" };
    });

    // ===============================
    // 4️⃣ GRAND TOTAL ROW
    // ===============================
    const totalRow = worksheet.addRow({
      description: "GRAND TOTAL",
      qty: grandTotal.qty,
      taxable: grandTotal.taxable,
      igst: grandTotal.igst,
      cgst: grandTotal.cgst,
      sgst: grandTotal.sgst,
      invoice: grandTotal.invoice,
    });

    totalRow.font = { bold: true };
    totalRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9EDF7" } };

    totalRow.eachCell((cell) => {
      cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
    });

    // ===============================
    // 5️⃣ SAVE FILE
    // ===============================
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "HSN_GST_Summary.xlsx"
    );

    toast.success("HSN GST Wise Excel exported successfully");
  } catch (err) {
    console.error(err);
    toast.error("Excel export failed");
  }

  // ===============================
  // 6️⃣ STYLE FUNCTION
  // ===============================
  function styleRow(row) {
    row.eachCell((cell) => {
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });

    ["qty", "taxable", "igst", "cgst", "sgst", "invoice"].forEach((k) => {
      row.getCell(k).numFmt = "#,##0.00";
      row.getCell(k).alignment = { horizontal: "right" };
    });

    ["slNo", "hsn", "uqc", "gst"].forEach((k) => {
      row.getCell(k).alignment = { horizontal: "center" };
    });
  }
};


  const handlePdfExport1 = () => {
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text("MNS HSN and GST Wise Report", doc.internal.pageSize.width / 2, 15, { align: "center" });

    // Process data to group by HSN first, then by GST rate
    const hsnGroups = {};
    // console.log("hsn group from pdf : ",hsnGroups)

    filteredInvoices.forEach((invoice) => {
      invoice.items?.forEach((item) => {
        const hsn = item.hsnCode || item?.sacCode;
        const gstRate = item.taxRate || item.taxRatePercent || 0;

        if (!hsnGroups[hsn]) {
          hsnGroups[hsn] = {};
        }

        const key = `${gstRate}_${item.description || item.itemName || ""}`;

        if (!hsnGroups[hsn][key]) {
          hsnGroups[hsn][key] = {
            gstRate: gstRate,
            description: item.description || item.itemName || "",
            uqc: item.uom || "",
            totalQuantity: 0,
            invoiceValue: 0,
            taxableValue: 0,
            integratedTaxAmount: 0,
            centralTaxAmount: 0,
            stateTaxAmount: 0
          };
        }

        // Calculate tax amounts
        let integrated = 0, central = 0, state = 0;
        if ((item.cgst > 0 || item.sgst > 0) && item.taxAmount > 0) {
          central = Number(item.taxAmount) / 2;
          state = Number(item.taxAmount) / 2;
          integrated = 0;
        } else if (item.igst > 0 && item.taxAmount > 0) {
          integrated = Number(item.taxAmount);
          central = 0;
          state = 0;
        }

        // Accumulate values
        const group = hsnGroups[hsn][key];
        group.totalQuantity += Number(item.quantity || 0);
        group.invoiceValue += Number(invoice.grandTotal || 0);
        group.taxableValue += Number(item.netAmount || item.amount || 0);
        group.integratedTaxAmount += integrated;
        group.centralTaxAmount += central;
        group.stateTaxAmount += state;
      });
    });

    // Sort HSN codes
    const sortedHsnCodes = Object.keys(hsnGroups).sort((a, b) => {
      if (!a && !b) return 0;
      if (!a) return 1;
      if (!b) return -1;
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });

    // Prepare table data with merge tracking for both HSN and Rate columns
    const tableData = [];
    const hsnMergeRanges = []; // Track HSN column merges
    const rateMergeRanges = []; // Track Rate column merges
    let slNo = 1;

    sortedHsnCodes.forEach((hsn) => {
      const items = Object.values(hsnGroups[hsn]);

      // Sort items by GST rate and then by description
      items.sort((a, b) => {
        if (a.gstRate !== b.gstRate) {
          return a.gstRate - b.gstRate;
        }
        return (a.description || "").localeCompare(b.description || "");
      });

      // Calculate totals for this HSN
      let hsnTotal = {
        totalQuantity: 0,
        invoiceValue: 0,
        taxableValue: 0,
        integratedTaxAmount: 0,
        centralTaxAmount: 0,
        stateTaxAmount: 0
      };

      items.forEach(data => {
        hsnTotal.totalQuantity += data.totalQuantity;
        hsnTotal.invoiceValue += data.invoiceValue;
        hsnTotal.taxableValue += data.taxableValue;
        hsnTotal.integratedTaxAmount += data.integratedTaxAmount;
        hsnTotal.centralTaxAmount += data.centralTaxAmount;
        hsnTotal.stateTaxAmount += data.stateTaxAmount;
      });

      const hasMultipleItems = items.length > 1;
      const hsnStartIndex = tableData.length;

      if (hasMultipleItems) {
        // Group items by GST rate for rate merging
        const rateGroups = {};
        items.forEach(item => {
          const rate = item.gstRate;
          if (!rateGroups[rate]) {
            rateGroups[rate] = [];
          }
          rateGroups[rate].push(item);
        });

        // Sort rate groups by rate
        const sortedRates = Object.keys(rateGroups).sort((a, b) => Number(a) - Number(b));

        // Add individual item rows and track rate merges
        sortedRates.forEach(rate => {
          const rateItems = rateGroups[rate];
          const rateStartIndex = tableData.length;

          // Add all items with this rate
          rateItems.forEach((data, index) => {
            tableData.push({
              slNo: "",
              hsn: "", // Will be filled by HSN merge logic
              description: data.description,
              uqc: data.uqc,
              totalQuantity: data.totalQuantity,
              invoiceValue: data.invoiceValue.toFixed(2),
              rate: index === 0 && rateItems.length === 1 ? Number(rate) + "%" : "", // Show rate only for single items
              taxableValue: data.taxableValue.toFixed(2),
              integratedTaxAmount: data.integratedTaxAmount.toFixed(2),
              centralTaxAmount: data.centralTaxAmount.toFixed(2),
              stateTaxAmount: data.stateTaxAmount.toFixed(2),
              gstRate: Number(rate) // Store for reference
            });
          });

          // Create rate merge range ONLY for multiple items with same rate
          if (rateItems.length > 1) {
            rateMergeRanges.push({
              startRow: rateStartIndex,
              endRow: tableData.length - 1,
              rate: Number(rate) + "%",
              column: 6 // Rate column index
            });
          }
        });

        // Add HSN Total row
        tableData.push({
          slNo: slNo++,
          hsn: "", // Will be filled by HSN merge logic
          description: "HSN Total",
          uqc: "",
          totalQuantity: hsnTotal.totalQuantity,
          invoiceValue: hsnTotal.invoiceValue.toFixed(2),
          rate: "", // Empty for total row
          taxableValue: hsnTotal.taxableValue.toFixed(2),
          integratedTaxAmount: hsnTotal.integratedTaxAmount.toFixed(2),
          centralTaxAmount: hsnTotal.centralTaxAmount.toFixed(2),
          stateTaxAmount: hsnTotal.stateTaxAmount.toFixed(2),
          isTotal: true
        });

        // Track HSN merge for entire group
        hsnMergeRanges.push({
          startRow: hsnStartIndex,
          endRow: tableData.length - 1,
          hsn: hsn || "",
          column: 1 // HSN column index
        });
      } else {
        // Single item
        const data = items[0];
        tableData.push({
          slNo: slNo++,
          hsn: hsn || "",
          description: data.description,
          uqc: data.uqc,
          totalQuantity: data.totalQuantity,
          invoiceValue: data.invoiceValue.toFixed(2),
          rate: data.gstRate + "%",
          taxableValue: data.taxableValue.toFixed(2),
          integratedTaxAmount: data.integratedTaxAmount.toFixed(2),
          centralTaxAmount: data.centralTaxAmount.toFixed(2),
          stateTaxAmount: data.stateTaxAmount.toFixed(2)
        });
      }
    });

    // Format data for autoTable
    const formattedData = tableData.map((row) => {
      return [
        row.slNo || "",
        row.hsn || "",
        row.description || "",
        row.uqc || "",
        row.totalQuantity || "",
        row.invoiceValue || "",
        row.rate || "",
        row.taxableValue || "",
        row.integratedTaxAmount || "",
        row.centralTaxAmount || "",
        row.stateTaxAmount || ""
      ];
    });

    // Track drawn merges and cell positions
    let drawnMerges = new Set();
    let cellPositions = {};

    // Create the table with custom styling
    doc.autoTable({
      head: [["Sl.No", "HSN", "Description", "UQC", "Total Quantity", "Invoice Value", "Rate", "Taxable Value", "Integrated Tax Amount", "Central Tax Amount", "State/UT Tax Amount"]],
      body: formattedData,
      startY: 25,
      theme: "grid",
      headStyles: {
        fillColor: [68, 114, 196],
        textColor: [255, 255, 255],
        halign: 'center',
        fontSize: 9,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" }, // Sl.No
        1: { cellWidth: 15, halign: "center" }, // HSN
        2: { cellWidth: 45, halign: "left" },   // Description
        3: { cellWidth: 15, halign: "center" }, // UQC
        4: { cellWidth: 20, halign: "right" },  // Total Quantity
        5: { cellWidth: 25, halign: "right" },  // Invoice Value
        6: { cellWidth: 12, halign: "center" }, // Rate
        7: { cellWidth: 25, halign: "right" },  // Taxable Value
        8: { cellWidth: 28, halign: "right" },  // IGST
        9: { cellWidth: 26, halign: "right" },  // CGST
        10: { cellWidth: 26, halign: "right" }  // SGST
      },
      willDrawCell: function (data) {
        // Store cell positions for later use
        cellPositions[`${data.row.index}_${data.column.index}`] = {
          x: data.cell.x,
          y: data.cell.y,
          width: data.cell.width,
          height: data.cell.height
        };

        // Skip header row (data.row.index === -1 for header or section.index === 'head')
        if (data.section === 'head') {
          return; // Don't modify header cells
        }

        // Clear HSN column text for HSN merge ranges (only for data rows)
        if (data.column.index === 1 && data.section === 'body') {
          hsnMergeRanges.forEach(merge => {
            if (data.row.index >= merge.startRow && data.row.index <= merge.endRow) {
              data.cell.text = [];
            }
          });
        }

        // Clear Rate column text for Rate merge ranges (only for multi-item rate groups and data rows)
        if (data.column.index === 6 && data.section === 'body') {
          rateMergeRanges.forEach(merge => {
            if (data.row.index >= merge.startRow && data.row.index <= merge.endRow) {
              data.cell.text = [];
            }
          });
        }
      },
      didDrawCell: function (data) {
        const rowData = tableData[data.row.index];

        // Style HSN Total rows
        if (rowData && rowData.isTotal && data.column.index === 2) {
          doc.setFillColor(200, 200, 200);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(8);
          doc.setFont(undefined, 'bold');

          const text = data.cell.text[0];
          if (text) {
            const textPos = data.cell.getTextPos();
            doc.text(text, textPos.x, textPos.y);
          }
        }
      },
      didDrawPage: function () {
        // Draw HSN merged cells
        hsnMergeRanges.forEach((merge, mergeIndex) => {
          const mergeKey = `hsn_merge_${mergeIndex}`;

          if (!drawnMerges.has(mergeKey)) {
            drawnMerges.add(mergeKey);

            const startCell = cellPositions[`${merge.startRow}_${merge.column}`];
            const endCell = cellPositions[`${merge.endRow}_${merge.column}`];

            if (startCell && endCell) {
              const mergedHeight = (endCell.y + endCell.height) - startCell.y;

              // Clear and redraw merged HSN cell
              doc.setFillColor(255, 255, 255);
              doc.rect(startCell.x, startCell.y, startCell.width, mergedHeight, 'F');
              doc.setDrawColor(0, 0, 0);
              doc.setLineWidth(0.1);
              doc.rect(startCell.x, startCell.y, startCell.width, mergedHeight, 'S');

              // Draw HSN text
              doc.setTextColor(0, 0, 0);
              doc.setFontSize(8);
              doc.setFont(undefined, 'normal');

              const centerX = startCell.x + (startCell.width / 2);
              const centerY = startCell.y + (mergedHeight / 2);

              doc.text(merge.hsn, centerX, centerY, {
                align: 'center',
                baseline: 'middle'
              });
            }
          }
        });

        // Draw Rate merged cells (only for groups with multiple items of same rate)
        rateMergeRanges.forEach((merge, mergeIndex) => {
          const mergeKey = `rate_merge_${mergeIndex}`;

          if (!drawnMerges.has(mergeKey)) {
            drawnMerges.add(mergeKey);

            const startCell = cellPositions[`${merge.startRow}_${merge.column}`];
            const endCell = cellPositions[`${merge.endRow}_${merge.column}`];

            if (startCell && endCell) {
              const mergedHeight = (endCell.y + endCell.height) - startCell.y;

              // Clear and redraw merged Rate cell
              doc.setFillColor(255, 255, 255);
              doc.rect(startCell.x, startCell.y, startCell.width, mergedHeight, 'F');
              doc.setDrawColor(0, 0, 0);
              doc.setLineWidth(0.1);
              doc.rect(startCell.x, startCell.y, startCell.width, mergedHeight, 'S');

              // Draw Rate text
              doc.setTextColor(0, 0, 0);
              doc.setFontSize(8);
              doc.setFont(undefined, 'normal');

              const centerX = startCell.x + (startCell.width / 2);
              const centerY = startCell.y + (mergedHeight / 2);

              doc.text(merge.rate, centerX, centerY, {
                align: 'center',
                baseline: 'middle'
              });
            }
          }
        });
      }
    });

    // Add Grand Total row
    const grandTotal = tableData.reduce((acc, row) => {
      if (row.isTotal || (!row.isTotal && tableData.filter(r => r.hsn === row.hsn).length === 1)) {
        acc.totalQuantity += Number(row.totalQuantity) || 0;
        acc.invoiceValue += parseFloat(row.invoiceValue) || 0;
        acc.taxableValue += parseFloat(row.taxableValue) || 0;
        acc.integratedTaxAmount += parseFloat(row.integratedTaxAmount) || 0;
        acc.centralTaxAmount += parseFloat(row.centralTaxAmount) || 0;
        acc.stateTaxAmount += parseFloat(row.stateTaxAmount) || 0;
      }
      return acc;
    }, {
      totalQuantity: 0,
      invoiceValue: 0,
      taxableValue: 0,
      integratedTaxAmount: 0,
      centralTaxAmount: 0,
      stateTaxAmount: 0
    });

    const finalY = doc.lastAutoTable.finalY;

    doc.autoTable({
      body: [[
        "",
        "",
        "TOTAL",
        "",
        grandTotal.totalQuantity,
        grandTotal.invoiceValue.toFixed(2),
        "",
        grandTotal.taxableValue.toFixed(2),
        grandTotal.integratedTaxAmount.toFixed(2),
        grandTotal.centralTaxAmount.toFixed(2),
        grandTotal.stateTaxAmount.toFixed(2)
      ]],
      startY: finalY,
      theme: "grid",
      styles: {
        fontSize: 9,
        fontStyle: 'bold',
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: 15, halign: "center" },
        2: { cellWidth: 45, halign: "left" },
        3: { cellWidth: 15, halign: "center" },
        4: { cellWidth: 20, halign: "right" },
        5: { cellWidth: 25, halign: "right" },
        6: { cellWidth: 12, halign: "center" },
        7: { cellWidth: 25, halign: "right" },
        8: { cellWidth: 28, halign: "right" },
        9: { cellWidth: 26, halign: "right" },
        10: { cellWidth: 26, halign: "right" }
      }
    });

    doc.save("hsnAndGstWiseReport.pdf");
    toast.success("PDF exported successfully!");
  };

  const handlePdfExport = () => {
    if (!filteredInvoices || filteredInvoices.length === 0) {
      toast.error("No data available to generate PDF");
      return;
    }

    const doc = new jsPDF("landscape", "mm", "a4");

    doc.setFontSize(14);
    doc.text("HSN / SAC Wise GST Summary", 14, 15);

    // ===============================
    // 1️⃣ GROUP DATA BY HSN + RATE
    // ===============================
    const hsnGroups = {};

    filteredInvoices.forEach((invoice) => {
      invoice.items.forEach((item) => {
        const hsn = item.hsn || "SERVICE";
        const rate = item.rate || "0%";
        const description = item.description || "";

        if (!hsnGroups[hsn]) hsnGroups[hsn] = {};

        const key = `${rate}_${description}`;

        if (!hsnGroups[hsn][key]) {
          hsnGroups[hsn][key] = {
            hsn,
            gstRate: rate,
            description,
            uqc: item.uqc || "",
            totalQuantity: 0,
            taxableValue: 0,
            integratedTaxAmount: 0,
            centralTaxAmount: 0,
            stateTaxAmount: 0,
            invoiceValue: 0,
          };
        }

        const g = hsnGroups[hsn][key];

        g.totalQuantity += Number(item.quantity || 0);
        g.taxableValue += Number(item.taxableValue || 0);
        g.integratedTaxAmount += Number(item.integratedTaxAmount || 0);
        g.centralTaxAmount += Number(item.centralTaxAmount || 0);
        g.stateTaxAmount += Number(item.stateTaxAmount || 0);
        g.invoiceValue += Number(item.invoiceValue || 0);
      });
    });

    // ===============================
    // 2️⃣ FLATTEN + SORT DATA
    // ===============================
    const tableRows = [];

    Object.values(hsnGroups).forEach((rateGroups) => {
      const items = Object.values(rateGroups);

      items.sort((a, b) => {
        const ra = parseFloat(a.gstRate);
        const rb = parseFloat(b.gstRate);
        if (ra !== rb) return ra - rb;
        return (a.description || "").localeCompare(b.description || "");
      });

      let hsnPrinted = false;

      items.forEach((item) => {
        tableRows.push({
          hsn: hsnPrinted ? "" : item.hsn,
          description: item.description,
          uqc: item.uqc,
          totalQuantity: item.totalQuantity,
          gstRate: item.gstRate,
          taxableValue: item.taxableValue,
          integratedTaxAmount: item.integratedTaxAmount,
          centralTaxAmount: item.centralTaxAmount,
          stateTaxAmount: item.stateTaxAmount,
          invoiceValue: item.invoiceValue,
        });

        hsnPrinted = true;
      });
    });

    // ===============================
    // 3️⃣ GRAND TOTAL
    // ===============================
    const grandTotal = tableRows.reduce(
      (acc, row) => {
        acc.totalQuantity += Number(row.totalQuantity || 0);
        acc.taxableValue += Number(row.taxableValue || 0);
        acc.integratedTaxAmount += Number(row.integratedTaxAmount || 0);
        acc.centralTaxAmount += Number(row.centralTaxAmount || 0);
        acc.stateTaxAmount += Number(row.stateTaxAmount || 0);
        acc.invoiceValue += Number(row.invoiceValue || 0);
        return acc;
      },
      {
        totalQuantity: 0,
        taxableValue: 0,
        integratedTaxAmount: 0,
        centralTaxAmount: 0,
        stateTaxAmount: 0,
        invoiceValue: 0,
      }
    );

    // ===============================
    // 4️⃣ AUTO TABLE
    // ===============================
    doc.autoTable({
      startY: 20,
      theme: "grid",
      styles: {
        fontSize: 8,
        halign: "right",
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 0,
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
        2: { halign: "center" },
        3: { halign: "right" },
      },
      head: [
        [
          "HSN / SAC",
          "Description",
          "UQC",
          "Qty",
          "GST %",
          "Taxable Value",
          "IGST",
          "CGST",
          "SGST",
          "Invoice Value",
        ],
      ],
      body: [
        ...tableRows.map((row) => [
          row.hsn,
          row.description,
          row.uqc,
          row.totalQuantity.toFixed(2),
          row.gstRate,
          row.taxableValue.toFixed(2),
          row.integratedTaxAmount.toFixed(2),
          row.centralTaxAmount.toFixed(2),
          row.stateTaxAmount.toFixed(2),
          row.invoiceValue.toFixed(2),
        ]),
        [
          "TOTAL",
          "",
          "",
          grandTotal.totalQuantity.toFixed(2),
          "",
          grandTotal.taxableValue.toFixed(2),
          grandTotal.integratedTaxAmount.toFixed(2),
          grandTotal.centralTaxAmount.toFixed(2),
          grandTotal.stateTaxAmount.toFixed(2),
          grandTotal.invoiceValue.toFixed(2),
        ],
      ],
    });

    // ===============================
    // 5️⃣ SAVE PDF
    // ===============================
    doc.save("HSN_GST_Summary.pdf");
  };



  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        ref={componentRef}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          HSN Report
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

            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">Invoice Type:</span>
              <select
                value={filterInvoiceType}
                onChange={(e) => setFilterInvoiceType(e.target.value)}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
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
              onClick={handleHsnGstWiseExcelExport}
              className="flex items-center cursor-pointer gap-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
            >
              <FaFileExcel /> Excel
            </button>
          </div>
        </div>
        <button className="cursor-pointer text-amber-500 hover:text-amber-700 border p-1 rounded bg-amber-200 mb-1" onClick={handleResetFilter}>
          Reset Filter
        </button>
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
                  {/* RATE COLUMN */}
                  {row.isServiceInvoice ? (
                    row.isFirstItem ? (
                      <td
                        className="border border-black px-2 py-1 text-xs text-center align-top"
                        rowSpan={row.rowSpan}
                      >
                        {row.rate}
                      </td>
                    ) : null
                  ) : (
                    <td className="border border-black px-2 py-1 text-xs text-center">
                      {row.rate}
                    </td>
                  )}

                  {/* taxable COLUMN */}
                  {row.isServiceInvoice ? (
                    row.isFirstItem ? (
                      <td
                        className="border border-black px-2 py-1 text-xs text-center align-top"
                        rowSpan={row.rowSpan}
                      >
                        {row.taxableValue}
                      </td>
                    ) : null
                  ) : (
                    <td className="border border-black px-2 py-1 text-xs text-center">
                      {row.taxableValue}
                    </td>
                  )}

                  {row.isServiceInvoice ? (
                    row.isFirstItem ? (
                      <td
                        className="border border-black px-2 py-1 text-xs text-center align-top"
                        rowSpan={row.rowSpan}
                      >
                        {row.integratedTaxAmount || ""}
                      </td>
                    ) : null
                  ) : (
                    <td className="border border-black px-2 py-1 text-xs text-center">
                      {row.integratedTaxAmount || ""}
                    </td>
                  )}

                  {row.isServiceInvoice ? (
                    row.isFirstItem ? (
                      <td
                        className="border border-black px-2 py-1 text-xs text-center align-top"
                        rowSpan={row.rowSpan}
                      >
                        {row.centralTaxAmount || ""}
                      </td>
                    ) : null
                  ) : (
                    <td className="border border-black px-2 py-1 text-xs text-center">
                      {row.centralTaxAmount || ""}
                    </td>
                  )}

                  {row.isServiceInvoice ? (
                    row.isFirstItem ? (
                      <td
                        className="border border-black px-2 py-1 text-xs text-center align-top"
                        rowSpan={row.rowSpan}
                      >
                        {row.stateTaxAmount || ""}
                      </td>
                    ) : null
                  ) : (
                    <td className="border border-black px-2 py-1 text-xs text-center">
                      {row.stateTaxAmount || ""}
                    </td>
                  )}
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
              {[5, 10, 25, 50, 100, 500, 5000].map((size) => (
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
                    className={`px-3 py-1 cursor-pointer border-t border-b border-r ${currentPage === pageNum
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

export default HSNReportPage;

