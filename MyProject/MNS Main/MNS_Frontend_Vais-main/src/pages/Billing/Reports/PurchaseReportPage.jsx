import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
// import * as XLSX from 'xlsx';
import {
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  FileDownload as ExcelIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { backendDomainA } from '../../../Common/index';
import XLSX from "xlsx-js-style";
import ExcelJS from 'exceljs';

const PurchaseReportPage = () => {
  // State variables
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('orders'); // 'orders', 'items', 'vendors'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportSummary, setReportSummary] = useState({
    totalOrders: 0,
    totalAmount: 0,
    totalItems: 0,
    uniqueVendors: 0,
    totalTaxAmount: 0,
    totalTaxableAmount: 0
  });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);

  console.log("report summary : ", selectedOrder)

  // Fetch all purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendDomainA}/api/v1/po/all`);

      if (response && response.data && response.data.purchaseOrders) {
        const purchaseData = response.data.purchaseOrders;
        setPurchaseOrders(purchaseData);
        setFilteredPurchaseOrders(purchaseData);

        // Extract unique vendors and items for filters
        const uniqueVendors = [...new Set(purchaseData.map(po =>
          po.receiverDetails?.name).filter(Boolean))];

        setVendors(uniqueVendors.map(name => ({ name })));

        // Extract all items from all purchase orders
        const allItems = [];
        purchaseData.forEach(po => {
          if (po.items && Array.isArray(po.items)) {
            po.items.forEach(item => {
              if (item.itemName) {
                allItems.push({
                  name: item.itemName,
                  id: item.item_id || ''
                });
              }
            });
          }
        });

        // Get unique items by name
        const uniqueItems = [...new Map(allItems.map(item =>
          [item.name, item])).values()];

        setItems(uniqueItems);

        // Calculate report summary
        calculateReportSummary(purchaseData);

        toast.success('Purchase data loaded successfully');
      } else {
        setPurchaseOrders([]);
        setFilteredPurchaseOrders([]);
        toast.error('No purchase data found');
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast.error('Failed to fetch purchase data');
      setPurchaseOrders([]);
      setFilteredPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics for the report
  const calculateReportSummary = (data) => {
    if (!Array.isArray(data)) return;

    const totalOrders = data.length;

    const totalAmount = data.reduce((sum, po) =>
      sum + (parseFloat(po.grandTotal) || 0), 0);

    const totalTaxAmount = data.reduce((sum, po) =>
      sum + (parseFloat(po.taxAmount) || 0), 0);

    const totalTaxableAmount = data.reduce((sum, po) =>
      sum + (parseFloat(po.taxableAmount) || 0), 0);


    // Count total items purchased
    let totalItems = 0;
    data.forEach(po => {
      if (po.items && Array.isArray(po.items)) {
        po.items.forEach(item => {
          totalItems += (parseInt(item.quantity) || 0);
        });
      }
    });

    // Count unique vendors
    const uniqueVendors = new Set(data.map(po =>
      po.receiverDetails?.name).filter(Boolean)).size;

    setReportSummary({
      totalOrders,
      totalAmount,
      totalItems,
      uniqueVendors,
      totalTaxAmount,
      totalTaxableAmount
    });
  };

  // Initial data fetch
  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  // Apply filters when search criteria change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, searchField, dateRange, selectedVendor, selectedItem, purchaseOrders, viewMode]);

  // Apply all filters to the purchase orders
  const applyFilters = () => {
    if (!Array.isArray(purchaseOrders)) return;

    let result = [...purchaseOrders];

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // Set to end of day

      result = result.filter(po => {
        const poDate = new Date(po.date);
        return poDate >= fromDate && poDate <= toDate;
      });
    }

    // Apply vendor filter
    if (selectedVendor) {
      result = result.filter(po =>
        po.receiverDetails?.name === selectedVendor);
    }

    // Apply item filter
    if (selectedItem) {
      result = result.filter(po => {
        if (!po.items || !Array.isArray(po.items)) return false;
        return po.items.some(item => item.itemName === selectedItem);
      });
    }

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      result = result.filter(po => {
        if (searchField === 'all') {
          return (
            (po.invoiceNumber && po.invoiceNumber.toLowerCase().includes(term)) ||
            (po.receiverDetails?.name && po.receiverDetails.name.toLowerCase().includes(term)) ||
            (po.receiverDetails?.phoneNumber && po.receiverDetails.phoneNumber.toLowerCase().includes(term)) ||
            (po.items && Array.isArray(po.items) && po.items.some(item =>
              item.itemName && item.itemName.toLowerCase().includes(term)))
          );
        } else if (searchField === 'invoiceNumber') {
          return po.invoiceNumber && po.invoiceNumber.toLowerCase().includes(term);
        } else if (searchField === 'vendorName') {
          return po.receiverDetails?.name && po.receiverDetails.name.toLowerCase().includes(term);
        } else if (searchField === 'itemName') {
          return po.items && Array.isArray(po.items) && po.items.some(item =>
            item.itemName && item.itemName.toLowerCase().includes(term));
        }
        return false;
      });
    }

    setFilteredPurchaseOrders(result);
    calculateReportSummary(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSearchField('all');
    setDateRange({ from: '', to: '' });
    setSelectedVendor('');
    setSelectedItem('');
    setFilteredPurchaseOrders(purchaseOrders);
    calculateReportSummary(purchaseOrders);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredPurchaseOrders)
    ? filteredPurchaseOrders.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(
    (Array.isArray(filteredPurchaseOrders) ? filteredPurchaseOrders.length : 0) / itemsPerPage
  );

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  // View purchase order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate PDF report
  const generatePDF1 = () => {
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF("l", "mm", "a4");
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const bottomMargin = 20;

      // Add title
      doc.setFontSize(18);
      doc.text('Purchase Report For MNS ', 14, 22);

      // Add report metadata dynamically
      let currentY = 30;
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, currentY);
      currentY += 7;

      if (dateRange.from && dateRange.to) {
        doc.text(`Date Range: ${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`, 14, currentY);
        currentY += 7;
      }

      if (selectedVendor) {
        doc.text(`Vendor: ${selectedVendor}`, 14, currentY);
        currentY += 7;
      }

      if (selectedItem) {
        doc.text(`Item: ${selectedItem}`, 14, currentY);
        currentY += 7;
      }

      // Add summary section
      currentY += 5; // Add some space
      doc.setFontSize(12);
      doc.text('Overall Summary', 14, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.text(`Total Orders: ${reportSummary.totalOrders}`, 14, currentY);
      doc.text(`Total Tax Amount: ${reportSummary.totalTaxAmount.toFixed(2)}`, 80, currentY);
      doc.text(`Total Taxable Amount: ${reportSummary.totalTaxableAmount.toFixed(2)}`, 150, currentY);
      doc.text(`Total Amount: ${reportSummary.totalAmount.toFixed(2)}`, 210, currentY);
      doc.text(`Total Items: ${reportSummary.totalItems}`, 14, currentY + 6);
      doc.text(`Unique Vendors: ${reportSummary.uniqueVendors}`, 80, currentY + 6);
      currentY += 15;

      // Add table data
      const tableColumn = viewMode === 'items'
        ? ["Item Name", "Total Quantity", "Average Price", "Total Value"]
        : viewMode === 'vendors'
          ? ["Vendor Name", "Orders", "Total Value"]
          : [];

      let tableRows = [];

      if (viewMode === 'orders') {
        filteredPurchaseOrders.forEach((po, index) => {
          // --- Dynamic positioning for each purchase order ---
          const poHeaderHeight = 45; // Estimated height for PO details before table

          // Add a new page if the content won't fit
          if (currentY + poHeaderHeight > pageHeight - bottomMargin) {
            doc.addPage();
            currentY = 20; // Reset Y on new page
          }

          // Add a separator line between orders
          if (index > 0) {
            doc.setDrawColor(180, 180, 180);
            doc.line(14, currentY - 7, pageWidth - 14, currentY - 7);
          }

          // Order header
          doc.setFontSize(14);
          doc.text(`Order Invoice Summary #${index + 1}`, 14, currentY);
          currentY += 10;

          // Order information grid
          doc.setFontSize(10);
          const lineHeight = 7;

          // Basic Info
          doc.text(`Invoice Number: ${po.invoiceNumber || 'N/A'}`, 14, currentY);
          doc.text(`Date: ${formatDate(po.date)}`, 120, currentY);
          doc.text(`Vendor: ${po.receiverDetails?.name || 'N/A'}`, 220, currentY);
          currentY += lineHeight;

          doc.text(`Phone: ${po.receiverDetails?.phoneNumber || 'N/A'}`, 14, currentY);
          doc.text(`Payment Type: ${po.paymentType || 'N/A'}`, 120, currentY);
          doc.text(`Address: ${po.receiverDetails?.address || 'N/A'}`, 220, currentY);
          currentY += lineHeight;

          // Financial Info
          doc.text(`Total Tax Amount: ${parseFloat(po?.taxAmount || 0).toFixed(2)}`, 14, currentY);
          doc.text(`Total Taxable Amount: ${parseFloat(po?.taxableAmount || 0).toFixed(2)}`, 120, currentY);
          doc.text(`Grand Total: ${parseFloat(po?.grandTotal || 0).toFixed(2)}`, 220, currentY);
          currentY += lineHeight * 2;

          // Items table
          if (po.items && po.items.length > 0) {
            doc.setFontSize(12);
            doc.text('Items Details:', 14, currentY);
            currentY += 8;

            const tableHeaders = [
              'Item Name',
              'Qty',
              'Unit',
              'Unit Price',
              'CGST',
              'SGST',
              'IGST',
              'Tax Amount',
              'Taxable Amount',
              'Total'
            ];

            const tableData = po.items.map(item => [
              `${item.itemName} (${item.hsnCode || 'N/A'})`,
              item.quantity?.toString() || '0',
              item.uom || 'N/A',
              `${parseFloat(item.unitPrice || 0).toFixed(2)}`,
              `${item.cgst || 0}%`,
              `${item.sgst || 0}%`,
              `${item.igst || 0}%`,
              `${parseFloat(item.taxAmount || 0).toFixed(2)}`,
              `${((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toFixed(2)}`,
              `${parseFloat(item.amount || 0).toFixed(2)}`
            ]);

            doc.autoTable({
              head: [tableHeaders],
              body: tableData,
              startY: currentY,
              theme: 'grid',
              styles: {
                fontSize: 8,
                cellPadding: 2
              },
              headStyles: {
                fillColor: [66, 139, 202],
                textColor: 255,
                fontSize: 8
              },
              // Let autoTable handle page breaks automatically
            });
            currentY = doc.lastAutoTable.finalY + 15; // Update Y and add margin
          } else {
            currentY += 10; // Add space if no items
          }
        });
      }


      else if (viewMode === 'items') {
        // Items summary table
        const itemSummary = {};

        filteredPurchaseOrders.forEach(po => {
          if (po.items && Array.isArray(po.items)) {
            po.items.forEach(item => {
              if (!item.itemName) return;

              if (!itemSummary[item.itemName]) {
                itemSummary[item.itemName] = {
                  quantity: 0,
                  totalValue: 0,
                  pricePoints: 0,
                  totalPrice: 0
                };
              }

              const quantity = parseInt(item.quantity) || 0;
              const unitPrice = parseFloat(item.unitPrice) || 0;
              const value = quantity * unitPrice;

              itemSummary[item.itemName].quantity += quantity;
              itemSummary[item.itemName].totalValue += value;

              if (unitPrice > 0) {
                itemSummary[item.itemName].pricePoints += 1;
                itemSummary[item.itemName].totalPrice += unitPrice;
              }
            });
          }
        });

        tableRows = Object.entries(itemSummary).map(([itemName, data]) => [
          itemName,
          data.quantity.toString(),
          `${(data.pricePoints > 0 ? data.totalPrice / data.pricePoints : 0).toFixed(2)}`,
          `${data.totalValue.toFixed(2)}`
        ]);
      } else {
        // Vendors summary table
        const vendorSummary = {};

        filteredPurchaseOrders.forEach(po => {
          const vendorName = po.receiverDetails?.name;
          if (!vendorName) return;

          if (!vendorSummary[vendorName]) {
            vendorSummary[vendorName] = {
              orders: 0,
              totalValue: 0
            };
          }

          vendorSummary[vendorName].orders += 1;
          vendorSummary[vendorName].totalValue += parseFloat(po.grandTotal || 0);
        });

        tableRows = Object.entries(vendorSummary).map(([vendorName, data]) => [
          vendorName,
          data.orders.toString(),
          `${data.totalValue.toFixed(2)}`
        ]);
      }

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255
        }
      });

      // Save the PDF
      doc.save('purchase_report.pdf');
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

    // Generate PDF report
  const generatePDF = () => {
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF("l", "mm", "a4");
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const bottomMargin = 20;

      // Add title
      doc.setFontSize(18);
      doc.text('Purchase Report For MNS ', 14, 22);

      // Add report metadata dynamically
      let currentY = 30;
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, currentY);
      currentY += 7;

      if (dateRange.from && dateRange.to) {
        doc.text(`Date Range: ${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`, 14, currentY);
        currentY += 7;
      }

      if (selectedVendor) {
        doc.text(`Vendor: ${selectedVendor}`, 14, currentY);
        currentY += 7;
      }

      if (selectedItem) {
        doc.text(`Item: ${selectedItem}`, 14, currentY);
        currentY += 7;
      }

      // Add summary section
      currentY += 5; // Add some space
      doc.setFontSize(12);
      doc.text('Overall Summary', 14, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.text(`Total Orders: ${reportSummary.totalOrders}`, 14, currentY);
      doc.text(`Total Tax Amount: ${reportSummary.totalTaxAmount.toFixed(2)}`, 80, currentY);
      doc.text(`Total Taxable Amount: ${reportSummary.totalTaxableAmount.toFixed(2)}`, 150, currentY);
      doc.text(`Total Amount: ${reportSummary.totalAmount.toFixed(2)}`, 210, currentY);
      doc.text(`Total Items: ${reportSummary.totalItems}`, 14, currentY + 6);
      doc.text(`Unique Vendors: ${reportSummary.uniqueVendors}`, 80, currentY + 6);
      currentY += 15;

      // Add table data
      const tableColumn = viewMode === 'items'
        ? ["Item Name", "Total Quantity", "Average Price", "Total Value"]
        : viewMode === 'vendors'
          ? ["Vendor Name", "Orders", "Total Value"]
          : [];

      let tableRows = [];

      if (viewMode === 'orders') {
        // Create table columns
        const tableColumn = [
          "Vendor Name",
          "Invoice No",
          "Date",
          "Item Name",
          "HSN Code",
          "Quantity",
          "Unit Price",
          "Tax Amount",
          "Taxable Amount",
          "Total Amount",
          "Payment Type",
        ];

        // Prepare table rows without complex merging
        const tableRows = [];

        filteredPurchaseOrders.forEach((po) => {
          if (po.items && Array.isArray(po.items) && po.items.length > 0) {
            // Add items for this purchase order
            po.items.forEach((item, index) => {
              const row = [
                index === 0 ? po.receiverDetails?.name || 'N/A' : "", // Only show vendor name in first row
                index === 0 ? po.invoiceNumber || 'N/A' : "", // Only show invoice number in first row
                index === 0 ? new Date(po.date).toLocaleDateString("en-GB") : "", // Only show date in first row
                item.itemName || 'N/A',
                item.hsnCode || 'N/A',
                item.quantity || 0,
                parseFloat(item.unitPrice || 0).toFixed(2),
                parseFloat(item.taxAmount || 0).toFixed(2),
                ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toFixed(2),
                parseFloat(item.amount || 0).toFixed(2),
                index === 0 ? po.paymentType || 'N/A' : "", // Only show payment type in first row
              ];
              tableRows.push(row);
            });

            // Add subtotal row
            tableRows.push([
              {
                content: `INVOICE ${po.invoiceNumber} SUBTOTAL - Taxable: ${parseFloat(po.taxableAmount || 0).toFixed(2)} | Tax: ${parseFloat(po.taxAmount || 0).toFixed(2)} | Total: ${parseFloat(po.grandTotal || 0).toFixed(2)}`,
                colSpan: 11,
                styles: {
                  fontStyle: "bold",
                  fillColor: [240, 240, 240],
                  halign: "right",
                  textColor: [0, 0, 0],
                },
              },
            ]);

            // Add empty row for spacing
            tableRows.push([
              { content: "", colSpan: 11, styles: { cellPadding: 2, fillColor: [255, 255, 255] } },
            ]);
          }
        });

        // Generate the table
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 75,
          theme: "grid",
          tableWidth: "100%",
          styles: {
            fontSize: 9,
            cellPadding: 3,
            textColor: [0, 0, 0],
            lineWidth: 0,
          },
          headStyles: {
            fillColor: [66, 139, 202],
            halign: "center",
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          columnStyles: {
            0: { cellWidth: "auto", halign: "left" },
            1: { cellWidth: "auto", halign: "center" },
            2: { cellWidth: "auto", halign: "center" },
            3: { cellWidth: "auto", halign: "left" },
            4: { cellWidth: "auto", halign: "center" },
            5: { cellWidth: "auto", halign: "right" },
            6: { cellWidth: "auto", halign: "right" },
            7: { cellWidth: "auto", halign: "right" },
            8: { cellWidth: "auto", halign: "right" },
            9: { cellWidth: "auto", halign: "right" },
            10: { cellWidth: "auto", halign: "center" },
          },
          didParseCell: function (data) {
            if (data.cell.raw?.content) {
              data.cell.styles = {
                ...data.cell.styles,
                ...data.cell.raw.styles,
              };
            }

            // Apply styles for empty cells in first columns when they should appear merged
            if ([0, 1, 2, 10].includes(data.column.index) && data.cell.text === "") {
              data.cell.styles.fillColor = data.cell.styles.fillColor || [255, 255, 255];
              data.cell.styles.lineWidth = 0.1;
              data.cell.styles.lineColor = [200, 200, 200];
            }

            // Align numbers right
            if ([5, 6, 7, 8, 9].includes(data.column.index) && !data.cell.raw?.content) {
              data.cell.styles.halign = "right";
            }
          },
          margin: { top: 30, left: 14, right: 14 },
          didDrawPage: function (data) {
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.text(
              `Page ${pageCount}`,
              doc.internal.pageSize.width - 40,
              doc.internal.pageSize.height - 10
            );
            if (data.pageNumber > 1) {
              doc.setFontSize(16);
              doc.text("Purchase Report For MNS", 14, 20);
              doc.setFontSize(10);
              doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
            }
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
            textColor: [0, 0, 0],
          },
        });

        // Add grand total at the end
        const finalY = doc.lastAutoTable.finalY + 10;
        if (finalY < doc.internal.pageSize.height - 20) {
          doc.setFontSize(12);
          doc.setFont(undefined, "bold");
          doc.text(
            `GRAND TOTAL: ${reportSummary.totalAmount.toFixed(2)}`,
            doc.internal.pageSize.width - 30,
            finalY,
            { align: "right" }
          );
        }
      }

      else if (viewMode === 'items') {
        // Items summary table
        const itemSummary = {};

        filteredPurchaseOrders.forEach(po => {
          if (po.items && Array.isArray(po.items)) {
            po.items.forEach(item => {
              if (!item.itemName) return;

              if (!itemSummary[item.itemName]) {
                itemSummary[item.itemName] = {
                  quantity: 0,
                  totalValue: 0,
                  pricePoints: 0,
                  totalPrice: 0
                };
              }

              const quantity = parseInt(item.quantity) || 0;
              const unitPrice = parseFloat(item.unitPrice) || 0;
              const value = quantity * unitPrice;

              itemSummary[item.itemName].quantity += quantity;
              itemSummary[item.itemName].totalValue += value;

              if (unitPrice > 0) {
                itemSummary[item.itemName].pricePoints += 1;
                itemSummary[item.itemName].totalPrice += unitPrice;
              }
            });
          }
        });

        tableRows = Object.entries(itemSummary).map(([itemName, data]) => [
          itemName,
          data.quantity.toString(),
          `${(data.pricePoints > 0 ? data.totalPrice / data.pricePoints : 0).toFixed(2)}`,
          `${data.totalValue.toFixed(2)}`
        ]);
      } else {
        // Vendors summary table
        const vendorSummary = {};

        filteredPurchaseOrders.forEach(po => {
          const vendorName = po.receiverDetails?.name;
          if (!vendorName) return;

          if (!vendorSummary[vendorName]) {
            vendorSummary[vendorName] = {
              orders: 0,
              totalValue: 0
            };
          }

          vendorSummary[vendorName].orders += 1;
          vendorSummary[vendorName].totalValue += parseFloat(po.grandTotal || 0);
        });

        tableRows = Object.entries(vendorSummary).map(([vendorName, data]) => [
          vendorName,
          data.orders.toString(),
          `${data.totalValue.toFixed(2)}`
        ]);
      }

      if (viewMode !== 'orders') {
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 70,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [66, 139, 202],
            textColor: 255
          }
        });
      }

      // Save the PDF
      doc.save('purchase_report.pdf');
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsGeneratingPdf(false);
    }
  };


  // Generate Excel report with proper styling
  const generateExcel = () => {
    setIsGeneratingExcel(true);

    try {
      if (viewMode === 'orders') {
        // Use ExcelJS for better styling support (if available)
        if (viewMode === 'orders') {
          const workbook = XLSX.utils.book_new();

          // Company Info
          const companyInfo = [
            ["MNS Secure Solutions"],
            ["AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064"],
            ["GSTIN: GSTN-19BTFPR0457K2ZT"],
            ["Email: mnssecuresolutions@gmail.com | Phone: 9073656557"],
            ["STATE: West Bengal (19)"],
            [""], // blank row for spacing
          ];

          const headerRow = [
            "Invoice ID", "Date", "Item Name", "HSN Code", "Unit",
            "Quantity", "Unit Price", "Net Amount", "Tax Rate",
            "Tax Amount", "Total Amount", "Vendor Name", "Payment Type"
          ];

          const worksheet = XLSX.utils.aoa_to_sheet([headerRow]);

          // Style header row
          headerRow.forEach((_, colIndex) => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
            worksheet[cellRef].s = {
              fill: { fgColor: { rgb: "4287f5" } },   // Blue background
              font: { bold: true, color: { rgb: "FFFFFF" } }, // White text
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
              }
            };
          });

          // Prepare rows
          let rowIndex = 1; // Start after header
          let merges = [];

          // Group items by invoice
          filteredPurchaseOrders.forEach((po) => {
            const startRow = rowIndex;
            const itemCount = po.items?.length || 0;

            // Add items
            po.items?.forEach((item) => {
              const row = [
                po.invoiceNumber || 'N/A',
                formatDate(po.date),
                item.itemName || '',
                item.hsnCode || '',
                item.unit || '',
                item.quantity || 0,
                item.unitPrice || 0,
                item.netAmount || 0,
                item.taxRate || 0,
                item.taxAmount || 0,
                item.amount || 0,
                po.receiverDetails?.name || 'N/A',
                po.paymentType || 'cash'
              ];
              XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: rowIndex++ });
            });

            // Merge invoice-level columns if multiple items
            if (itemCount > 1) {
              merges.push(
                { s: { r: startRow, c: 0 }, e: { r: startRow + itemCount - 1, c: 0 } }, // Invoice ID
                { s: { r: startRow, c: 1 }, e: { r: startRow + itemCount - 1, c: 1 } }, // Date
                { s: { r: startRow, c: 11 }, e: { r: startRow + itemCount - 1, c: 11 } }, // Vendor
                { s: { r: startRow, c: 12 }, e: { r: startRow + itemCount - 1, c: 12 } }  // Payment Type
              );
            }

            // Add subtotal row
            const subtotalRow = [
              `Invoice ${po.invoiceNumber} Subtotal`,
              "",
              "",
              "",
              "",
              "",
              "",
              `Taxable: ${po.taxableAmount?.toFixed(2) || '0.00'}`,
              "",
              `Tax: ${po.taxAmount?.toFixed(2) || '0.00'}`,
              `Total: ${po.grandTotal?.toFixed(2) || '0.00'}`,
              "",
              ""
            ];
            XLSX.utils.sheet_add_aoa(worksheet, [subtotalRow], { origin: rowIndex++ });

            // Style subtotal row
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
                  right: { style: "thin", color: { rgb: "000000" } }
                }
              };
            }

            // Add empty row for spacing
            XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: rowIndex++ });
          });

          // Apply merges
          worksheet['!merges'] = merges;

          // Set column widths
          worksheet['!cols'] = [
            { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 12 },
            { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 25 },
            { wch: 10 }, { wch: 25 }, { wch: 25 }, { wch: 25 },
            { wch: 15 }
          ];

          // Style merged cells
          merges.forEach(range => {
            for (let r = range.s.r; r <= range.e.r; r++) {
              for (let c = range.s.c; c <= range.e.c; c++) {
                const cellRef = XLSX.utils.encode_cell({ r, c });
                if (!worksheet[cellRef]) worksheet[cellRef] = { v: "" };
                worksheet[cellRef].s = {
                  alignment: { horizontal: "center", vertical: "center" },
                  font: { bold: true }
                };
              }
            }
          });

          // Add summary section
          const summaryStart = rowIndex + 1;
          const summaryData = [
            ["Summary", ""],
            ["Total Orders", filteredPurchaseOrders.length],
            ["Total Taxable Amount", reportSummary.totalTaxableAmount],
            ["Total Tax Amount", reportSummary.totalTaxAmount],
            ["Total Amount", reportSummary.totalAmount],
            ["Total Items", reportSummary.totalItems],
            ["Unique Vendors", reportSummary.uniqueVendors]
          ];

          XLSX.utils.sheet_add_aoa(worksheet, summaryData, { origin: summaryStart });

          // Style summary section
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
                  right: { style: "thin", color: { rgb: "000000" } }
                }
              };
            }
          }

          // Append worksheet to workbook
          XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Orders");

          // Save file
          XLSX.writeFile(
            workbook,
            `MNS_Purchase_Report_${new Date().toISOString().split("T")[0]}.xlsx`
          );

        } else {
          // Fallback to basic XLSX without styling
          const data = filteredPurchaseOrders.map(po => ({
            'Invoice Number': po.invoiceNumber || 'N/A',
            'Date': formatDate(po.date),
            'Vendor': po.receiverDetails?.name || 'N/A',
            'Phone': po.receiverDetails?.phoneNumber || 'N/A',
            'Payment Type': po.paymentType || 'cash',
            'Items Count': po.items?.length || 0,
            'Total Amount': parseFloat(po.grandTotal || 0).toFixed(2)
          }));

          // Add total row
          const totalAmount = filteredPurchaseOrders.reduce((sum, po) =>
            sum + (parseFloat(po.grandTotal) || 0), 0);

          data.push({
            'Invoice Number': 'Total',
            'Date': '',
            'Vendor': '',
            'Phone': '',
            'Payment Type': '',
            'Items Count': '',
            'Total Amount': totalAmount.toFixed(2)
          });

          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Purchase Orders');
          XLSX.writeFile(wb, `purchase_report_${new Date().toISOString().split('T')[0]}.xlsx`);
        }

      } else if (viewMode === 'items') {
        // Use ExcelJS for proper styling (items view)
        if (typeof ExcelJS !== 'undefined') {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Purchase Items Details');

          // Set column widths
          worksheet.columns = [
            { header: 'Item Name', key: 'itemName', width: 25 },
            { header: 'Total Quantity', key: 'totalQuantity', width: 15 },
            { header: 'Average Price', key: 'averagePrice', width: 15 },
            { header: 'Total Value', key: 'totalValue', width: 15 },
            { header: 'Vendors Count', key: 'vendorsCount', width: 15 },
            { header: 'Vendors', key: 'vendors', width: 50 }
          ];

          // Add title
          worksheet.mergeCells('A1:F1');
          const titleCell = worksheet.getCell('A1');
          titleCell.value = "Purchase Item's Details";
          titleCell.font = { bold: true, size: 14, color: { argb: 'FF000000' } };
          titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB8CCE4' } };
          titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
          titleCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          // Style header row (row 2)
          const headerRow = worksheet.getRow(2);
          headerRow.values = ['Item Name', 'Total Quantity', 'Average Price', 'Total Value', 'Vendors Count', 'Vendors'];
          headerRow.font = { bold: true, color: { argb: 'FF000000' } };
          headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
          headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
          headerRow.height = 20;

          headerRow.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });

          // Prepare items summary data
          const itemSummary = {};

          filteredPurchaseOrders.forEach(po => {
            if (po.items && Array.isArray(po.items)) {
              po.items.forEach(item => {
                if (!item.itemName) return;

                if (!itemSummary[item.itemName]) {
                  itemSummary[item.itemName] = {
                    quantity: 0,
                    totalValue: 0,
                    pricePoints: 0,
                    totalPrice: 0,
                    vendors: new Set()
                  };
                }

                const quantity = parseInt(item.quantity) || 0;
                const unitPrice = parseFloat(item.unitPrice) || 0;
                const value = quantity * unitPrice;

                itemSummary[item.itemName].quantity += quantity;
                itemSummary[item.itemName].totalValue += value;

                if (unitPrice > 0) {
                  itemSummary[item.itemName].pricePoints += 1;
                  itemSummary[item.itemName].totalPrice += unitPrice;
                }

                if (po.receiverDetails?.name) {
                  itemSummary[item.itemName].vendors.add(po.receiverDetails.name);
                }
              });
            }
          });

          // Add data rows
          let totalQuantity = 0;
          let totalValue = 0;
          let currentRow = 3;

          Object.entries(itemSummary).forEach(([itemName, data]) => {
            const avgPrice = data.pricePoints > 0 ? data.totalPrice / data.pricePoints : 0;

            totalQuantity += data.quantity;
            totalValue += data.totalValue;

            const row = worksheet.addRow({
              itemName: itemName,
              totalQuantity: data.quantity,
              averagePrice: avgPrice,
              totalValue: data.totalValue,
              vendorsCount: data.vendors.size,
              vendors: Array.from(data.vendors).join(', ')
            });

            // Style data row
            row.eachCell((cell, colNumber) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };

              // Alignment and formatting based on column
              if (colNumber === 1 || colNumber === 6) { // Item Name, Vendors
                cell.alignment = { horizontal: 'left', vertical: 'middle' };
              } else if (colNumber === 2 || colNumber === 5) { // Total Quantity, Vendors Count
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.numFmt = '0';
              } else if (colNumber === 3 || colNumber === 4) { // Average Price, Total Value
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.numFmt = '#,##0.00';
              }
            });

            currentRow++;
          });

          // Add Total row
          const totalRow = worksheet.addRow({
            itemName: 'Total:-',
            totalQuantity: totalQuantity,
            averagePrice: totalValue / totalQuantity, // Overall average
            totalValue: totalValue,
            vendorsCount: '',
            vendors: ''
          });

          // Style total row
          totalRow.font = { bold: true };
          totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6E6E6' } };

          totalRow.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: 'thick' },
              left: { style: 'thin' },
              bottom: { style: 'thick' },
              right: { style: 'thin' }
            };

            if (colNumber === 1 || colNumber === 6) { // Item Name, Vendors
              cell.alignment = { horizontal: 'left', vertical: 'middle' };
            } else if (colNumber === 2 || colNumber === 5) { // Total Quantity, Vendors Count
              cell.alignment = { horizontal: 'center', vertical: 'middle' };
              cell.numFmt = '0';
            } else if (colNumber === 3 || colNumber === 4) { // Average Price, Total Value
              cell.alignment = { horizontal: 'right', vertical: 'middle' };
              cell.numFmt = '#,##0.00';
            }
          });

          // Save the file
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `purchase_items_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
          });

        } else {
          // Fallback to basic XLSX without styling
          const itemSummary = {};

          filteredPurchaseOrders.forEach(po => {
            if (po.items && Array.isArray(po.items)) {
              po.items.forEach(item => {
                if (!item.itemName) return;

                if (!itemSummary[item.itemName]) {
                  itemSummary[item.itemName] = {
                    quantity: 0,
                    totalValue: 0,
                    pricePoints: 0,
                    totalPrice: 0,
                    vendors: new Set()
                  };
                }

                const quantity = parseInt(item.quantity) || 0;
                const unitPrice = parseFloat(item.unitPrice) || 0;
                const value = quantity * unitPrice;

                itemSummary[item.itemName].quantity += quantity;
                itemSummary[item.itemName].totalValue += value;

                if (unitPrice > 0) {
                  itemSummary[item.itemName].pricePoints += 1;
                  itemSummary[item.itemName].totalPrice += unitPrice;
                }

                if (po.receiverDetails?.name) {
                  itemSummary[item.itemName].vendors.add(po.receiverDetails.name);
                }
              });
            }
          });

          const data = Object.entries(itemSummary).map(([itemName, data]) => ({
            'Item Name': itemName,
            'Total Quantity': data.quantity,
            'Average Price': (data.pricePoints > 0 ? data.totalPrice / data.pricePoints : 0).toFixed(2),
            'Total Value': data.totalValue.toFixed(2),
            'Vendors Count': data.vendors.size,
            'Vendors': Array.from(data.vendors).join(', ')
          }));

          // Add total row
          const totalQuantity = data.reduce((sum, item) => sum + parseInt(item['Total Quantity']), 0);
          const totalValue = data.reduce((sum, item) => sum + parseFloat(item['Total Value']), 0);

          data.push({
            'Item Name': 'Total:-',
            'Total Quantity': totalQuantity,
            'Average Price': (totalValue / totalQuantity).toFixed(2),
            'Total Value': totalValue.toFixed(2),
            'Vendors Count': '',
            'Vendors': ''
          });

          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Items Summary');
          XLSX.writeFile(wb, `purchase_items_report_${new Date().toISOString().split('T')[0]}.xlsx`);
        }

      } else {
        // Use ExcelJS for proper styling (vendors view)
        if (typeof ExcelJS !== 'undefined') {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Purchase Vendors Details');

          // Set column widths
          worksheet.columns = [
            { header: 'Vendor Name', key: 'vendorName', width: 30 },
            { header: 'Phone Number', key: 'phoneNumber', width: 15 },
            { header: 'Address', key: 'address', width: 20 },
            { header: 'Orders Count', key: 'ordersCount', width: 15 },
            { header: 'Total Value', key: 'totalValue', width: 15 },
            { header: 'Unique Items', key: 'uniqueItems', width: 15 },
            { header: 'Items', key: 'items', width: 50 }
          ];

          // Add title
          worksheet.mergeCells('A1:G1');
          const titleCell = worksheet.getCell('A1');
          titleCell.value = "Purchases Vendor's Details";
          titleCell.font = { bold: true, size: 14, color: { argb: 'FF000000' } };
          titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB8CCE4' } };
          titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
          titleCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          // Style header row (row 2)
          const headerRow = worksheet.getRow(2);
          headerRow.values = ['Vendor Name', 'Phone Number', 'Address', 'Orders Count', 'Total Value', 'Unique Items', 'Items'];
          headerRow.font = { bold: true, color: { argb: 'FF000000' } };
          headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
          headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
          headerRow.height = 20;

          headerRow.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });

          // Prepare vendors summary data
          const vendorSummary = {};

          filteredPurchaseOrders.forEach(po => {
            const vendorName = po.receiverDetails?.name;
            if (!vendorName) return;

            if (!vendorSummary[vendorName]) {
              vendorSummary[vendorName] = {
                orders: 0,
                totalValue: 0,
                items: new Set(),
                phoneNumber: po.receiverDetails?.phoneNumber || 'N/A',
                address: po.receiverDetails?.address || 'N/A'
              };
            }

            vendorSummary[vendorName].orders += 1;
            vendorSummary[vendorName].totalValue += parseFloat(po.grandTotal || 0);

            if (po.items && Array.isArray(po.items)) {
              po.items.forEach(item => {
                if (item.itemName) {
                  vendorSummary[vendorName].items.add(item.itemName);
                }
              });
            }
          });

          // Add data rows
          let totalOrders = 0;
          let totalValue = 0;
          let currentRow = 3;

          Object.entries(vendorSummary).forEach(([vendorName, data]) => {
            totalOrders += data.orders;
            totalValue += data.totalValue;

            const row = worksheet.addRow({
              vendorName: vendorName,
              phoneNumber: data.phoneNumber,
              address: data.address,
              ordersCount: data.orders,
              totalValue: data.totalValue,
              uniqueItems: data.items.size,
              items: Array.from(data.items).join(', ')
            });

            // Style data row
            row.eachCell((cell, colNumber) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };

              // Alignment and formatting based on column
              if (colNumber === 1 || colNumber === 2 || colNumber === 3 || colNumber === 7) {
                // Vendor Name, Phone, Address, Items
                cell.alignment = { horizontal: 'left', vertical: 'middle' };
              } else if (colNumber === 4 || colNumber === 6) {
                // Orders Count, Unique Items
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.numFmt = '0';
              } else if (colNumber === 5) {
                // Total Value
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.numFmt = '#,##0.00';
              }
            });

            currentRow++;
          });

          // Add Total row
          const totalRow = worksheet.addRow({
            vendorName: 'TOTAL',
            phoneNumber: '',
            address: '',
            ordersCount: '',
            totalValue: totalValue,
            uniqueItems: '',
            items: ''
          });

          // Style total row
          totalRow.font = { bold: true };
          totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6E6E6' } };

          totalRow.eachCell((cell, colNumber) => {
            cell.border = {
              top: { style: 'thick' },
              left: { style: 'thin' },
              bottom: { style: 'thick' },
              right: { style: 'thin' }
            };

            if (colNumber === 1 || colNumber === 2 || colNumber === 3 || colNumber === 7) {
              // Vendor Name, Phone, Address, Items
              cell.alignment = { horizontal: 'left', vertical: 'middle' };
            } else if (colNumber === 4 || colNumber === 6) {
              // Orders Count, Unique Items
              cell.alignment = { horizontal: 'center', vertical: 'middle' };
              cell.numFmt = '0';
            } else if (colNumber === 5) {
              // Total Value
              cell.alignment = { horizontal: 'right', vertical: 'middle' };
              cell.numFmt = '#,##0.00';
            }
          });

          // Save the file
          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `purchase_vendors_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
          });

        } else {
          // Fallback to basic XLSX without styling
          const vendorSummary = {};

          filteredPurchaseOrders.forEach(po => {
            const vendorName = po.receiverDetails?.name;
            if (!vendorName) return;

            if (!vendorSummary[vendorName]) {
              vendorSummary[vendorName] = {
                orders: 0,
                totalValue: 0,
                items: new Set(),
                phoneNumber: po.receiverDetails?.phoneNumber || 'N/A',
                address: po.receiverDetails?.address || 'N/A'
              };
            }

            vendorSummary[vendorName].orders += 1;
            vendorSummary[vendorName].totalValue += parseFloat(po.grandTotal || 0);

            if (po.items && Array.isArray(po.items)) {
              po.items.forEach(item => {
                if (item.itemName) {
                  vendorSummary[vendorName].items.add(item.itemName);
                }
              });
            }
          });

          const data = Object.entries(vendorSummary).map(([vendorName, data]) => ({
            'Vendor Name': vendorName,
            'Phone Number': data.phoneNumber,
            'Address': data.address,
            'Orders Count': data.orders,
            'Total Value': data.totalValue.toFixed(2),
            'Unique Items': data.items.size,
            'Items': Array.from(data.items).join(', ')
          }));

          // Add total row
          const totalValue = data.reduce((sum, vendor) => sum + parseFloat(vendor['Total Value']), 0);

          data.push({
            'Vendor Name': 'TOTAL',
            'Phone Number': '',
            'Address': '',
            'Orders Count': '',
            'Total Value': totalValue.toFixed(2),
            'Unique Items': '',
            'Items': ''
          });

          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Vendors Summary');
          XLSX.writeFile(wb, `purchase_vendors_report_${new Date().toISOString().split('T')[0]}.xlsx`);
        }
      }

      toast.success('Excel report generated successfully');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel report');
    } finally {
      setIsGeneratingExcel(false);
    }
  };

  // Get item-wise summary data
  const getItemSummary = () => {
    const itemSummary = {};

    filteredPurchaseOrders.forEach(po => {
      if (po.items && Array.isArray(po.items)) {
        po.items.forEach(item => {
          if (!item.itemName) return;

          if (!itemSummary[item.itemName]) {
            itemSummary[item.itemName] = {
              quantity: 0,
              totalValue: 0,
              vendors: new Set(),
              lastPurchaseDate: null
            };
          }

          const quantity = parseInt(item.quantity) || 0;
          const unitPrice = parseFloat(item.unitPrice) || 0;
          const value = quantity * unitPrice;

          itemSummary[item.itemName].quantity += quantity;
          itemSummary[item.itemName].totalValue += value;

          if (po.receiverDetails?.name) {
            itemSummary[item.itemName].vendors.add(po.receiverDetails.name);
          }

          // Track last purchase date
          const poDate = new Date(po.date);
          if (!itemSummary[item.itemName].lastPurchaseDate ||
            poDate > new Date(itemSummary[item.itemName].lastPurchaseDate)) {
            itemSummary[item.itemName].lastPurchaseDate = po.date;
          }
        });
      }
    });

    return Object.entries(itemSummary).map(([itemName, data]) => ({
      name: itemName,
      quantity: data.quantity,
      totalValue: data.totalValue,
      vendorCount: data.vendors.size,
      lastPurchaseDate: data.lastPurchaseDate
    }));
  };

  // console.log("Item Summary:", getItemSummary());

  // Get vendor-wise summary data
  const getVendorSummary = () => {
    const vendorSummary = {};

    filteredPurchaseOrders.forEach(po => {
      const vendorName = po.receiverDetails?.name;
      if (!vendorName) return;

      if (!vendorSummary[vendorName]) {
        vendorSummary[vendorName] = {
          orders: 0,
          totalValue: 0,
          items: new Set(),
          lastOrderDate: null,
          phoneNumber: po.receiverDetails?.phoneNumber || 'N/A'
        };
      }

      vendorSummary[vendorName].orders += 1;
      vendorSummary[vendorName].totalValue += parseFloat(po.grandTotal || 0);

      // Track last order date
      const poDate = new Date(po.date);
      if (!vendorSummary[vendorName].lastOrderDate ||
        poDate > new Date(vendorSummary[vendorName].lastOrderDate)) {
        vendorSummary[vendorName].lastOrderDate = po.date;
      }

      if (po.items && Array.isArray(po.items)) {
        po.items.forEach(item => {
          if (item.itemName) {
            vendorSummary[vendorName].items.add(item.itemName);
          }
        });
      }
    });

    return Object.entries(vendorSummary).map(([vendorName, data]) => ({
      name: vendorName,
      orders: data.orders,
      totalValue: data.totalValue,
      itemCount: data.items.size,
      lastOrderDate: data.lastOrderDate,
      phoneNumber: data.phoneNumber
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Purchase Report For MNS012
          </h2>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={viewMode === 'orders' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setViewMode('orders')}
              startIcon={<CalendarIcon />}
              size="small"
            >
              Orders
            </Button>
            <Button
              variant={viewMode === 'items' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setViewMode('items')}
              startIcon={<InventoryIcon />}
              size="small"
            >
              Items
            </Button>
            <Button
              variant={viewMode === 'vendors' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setViewMode('vendors')}
              startIcon={<PersonIcon />}
              size="small"
            >
              Vendors
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <div className="text-blue-500 text-sm font-medium mb-1">Total Orders</div>
            <div className="text-2xl font-bold">{reportSummary.totalOrders}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <div className="text-green-500 text-sm font-medium mb-1">Total Tax Amount</div>
            <div className="text-2xl font-bold">₹{reportSummary.totalTaxAmount.toFixed(2)}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <div className="text-green-500 text-sm font-medium mb-1">Total Taxable Amount</div>
            <div className="text-2xl font-bold">₹{reportSummary.totalTaxableAmount.toFixed(2)}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <div className="text-green-500 text-sm font-medium mb-1">Total Amount</div>
            <div className="text-2xl font-bold">₹{reportSummary.totalAmount.toFixed(2)}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <div className="text-purple-500 text-sm font-medium mb-1">Total Items's Quantity</div>
            <div className="text-2xl font-bold">{reportSummary.totalItems}</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg shadow-sm">
            <div className="text-amber-500 text-sm font-medium mb-1">Unique Vendors</div>
            <div className="text-2xl font-bold">{reportSummary.uniqueVendors}</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow">
              <TextField
                fullWidth
                variant="outlined"
                placeholder={`Search ${viewMode === 'orders' ? 'purchase orders' : viewMode === 'items' ? 'items' : 'vendors'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </div>

            <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
              <InputLabel>Search In</InputLabel>
              <Select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                label="Search In"
              >
                <MenuItem value="all">All Fields</MenuItem>
                <MenuItem value="invoiceNumber">Invoice Number</MenuItem>
                <MenuItem value="vendorName">Vendor Name</MenuItem>
                <MenuItem value="itemName">Item Name</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterIcon />}
              size="small"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={resetFilters}
              startIcon={<RefreshIcon />}
              size="small"
            >
              Reset
            </Button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                  <TextField
                    fullWidth
                    label="Date From"
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <TextField
                    fullWidth
                    label="Date To"
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Vendor</InputLabel>
                    <Select
                      value={selectedVendor}
                      onChange={(e) => setSelectedVendor(e.target.value)}
                      label="Vendor"
                    >
                      <MenuItem value="">All Vendors</MenuItem>
                      {vendors.map((vendor, index) => (
                        <MenuItem key={index} value={vendor.name}>
                          {vendor.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Item</InputLabel>
                    <Select
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      label="Item"
                    >
                      <MenuItem value="">All Items</MenuItem>
                      {items.map((item, index) => (
                        <MenuItem key={index} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          )}

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outlined"
              color="primary"
              onClick={generatePDF}
              startIcon={isGeneratingPdf ? <CircularProgress size={20} /> : <PdfIcon />}
              size="small"
              disabled={isGeneratingPdf || filteredPurchaseOrders.length === 0}
            >
              Export PDF
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={generateExcel}
              startIcon={isGeneratingExcel ? <CircularProgress size={20} /> : <ExcelIcon />}
              size="small"
              disabled={isGeneratingExcel || filteredPurchaseOrders.length === 0}
            >
              Export Excel
            </Button>
            <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
              <InputLabel>Items Per Page</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Items Per Page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Data Tables */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <CircularProgress />
            <span className="ml-3">Loading purchase data...</span>
          </div>
        ) : filteredPurchaseOrders.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <InfoIcon color="info" style={{ fontSize: 48 }} />
            <Typography variant="h6" className="mt-2 mb-1">No Purchase Orders Found</Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your search criteria or filters to see more results.
            </Typography>
          </div>
        ) : (
          <>
            {/* Orders View */}
            {viewMode === 'orders' && (
              <TableContainer component={Paper} className="mb-4">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">Invoice No.</TableCell>
                      <TableCell className="font-bold">Date</TableCell>
                      <TableCell className="font-bold">Vendor</TableCell>
                      <TableCell className="font-bold">Phone</TableCell>
                      <TableCell className="font-bold">Items</TableCell>
                      <TableCell className="font-bold">Tax Amount</TableCell>
                      <TableCell className="font-bold">Taxable Amount</TableCell>
                      <TableCell className="font-bold">Amount</TableCell>
                      <TableCell className="font-bold">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((po, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{po.invoiceNumber || 'N/A'}</TableCell>
                        <TableCell>{formatDate(po.date)}</TableCell>
                        <TableCell>{po.receiverDetails?.name || 'N/A'}</TableCell>
                        <TableCell>{po.receiverDetails?.phoneNumber || 'N/A'}</TableCell>
                        <TableCell>{po.items?.length || 0}</TableCell>
                        <TableCell>{po?.taxAmount.toFixed(2) || 0}</TableCell>
                        <TableCell>{po?.taxableAmount.toFixed(2) || 0}</TableCell>
                        <TableCell>₹{parseFloat(po.grandTotal.toFixed(2) || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => viewOrderDetails(po)}
                            color="primary"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Items View */}
            {viewMode === 'items' && (
              <TableContainer component={Paper} className="mb-4">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">Item Name</TableCell>
                      <TableCell className="font-bold">Total Quantity</TableCell>
                      <TableCell className="font-bold">Average Price</TableCell>
                      {/* <TableCell className="font-bold">CGST</TableCell> */}
                      {/* <TableCell className="font-bold">SGST</TableCell> */}
                      {/* <TableCell className="font-bold">IGST</TableCell> */}
                      {/* <TableCell className="font-bold">TAX Amount</TableCell> */}
                      {/* <TableCell className="font-bold">Taxable Amount</TableCell> */}
                      <TableCell className="font-bold">Total Value</TableCell>
                      <TableCell className="font-bold">Vendors</TableCell>
                      <TableCell className="font-bold">Last Purchase</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getItemSummary().slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          ₹{(item.totalValue / item.quantity).toFixed(2)}
                        </TableCell>
                        {/* <TableCell>₹{item.cgst}</TableCell> */}
                        <TableCell>₹{item.totalValue.toFixed(2)}</TableCell>
                        <TableCell>{item.vendorCount}</TableCell>
                        <TableCell>{formatDate(item.lastPurchaseDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Vendors View */}
            {viewMode === 'vendors' && (
              <TableContainer component={Paper} className="mb-4">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">Vendor Name</TableCell>
                      <TableCell className="font-bold">Phone Number</TableCell>
                      <TableCell className="font-bold">Orders</TableCell>
                      <TableCell className="font-bold">Total Value</TableCell>
                      <TableCell className="font-bold">Unique Items</TableCell>
                      <TableCell className="font-bold">Last Order</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getVendorSummary().slice(indexOfFirstItem, indexOfLastItem).map((vendor, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{vendor.name}</TableCell>
                        <TableCell>{vendor.phoneNumber}</TableCell>
                        <TableCell>{vendor.orders}</TableCell>
                        <TableCell>₹{vendor.totalValue.toFixed(2)}</TableCell>
                        <TableCell>{vendor.itemCount}</TableCell>
                        <TableCell>{formatDate(vendor.lastOrderDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center">
              <Typography variant="body2" color="textSecondary">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPurchaseOrders.length)} of {filteredPurchaseOrders.length} entries
              </Typography>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="small"
              />
            </div>
          </>
        )}
      </div>

      {/* Purchase Order Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <span>Purchase Order Details</span>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Invoice Number</Typography>
                  <Typography variant="body1">{selectedOrder.invoiceNumber || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                  <Typography variant="body1">{formatDate(selectedOrder.date)}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Vendor</Typography>
                  <Typography variant="body1">{selectedOrder.receiverDetails?.name || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{selectedOrder.receiverDetails?.phoneNumber || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Payment Type</Typography>
                  <Typography variant="body1">{selectedOrder.paymentType || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                  <Typography variant="body1">{selectedOrder?.receiverDetails?.address || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Total Tax Amount</Typography>
                  <Typography variant="body1">₹{parseFloat(selectedOrder?.taxAmount || 0).toFixed(2)}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Total Taxable Amount</Typography>
                  <Typography variant="body1">₹{parseFloat(selectedOrder?.taxableAmount || 0).toFixed(2)}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Total Amount</Typography>
                  <Typography variant="body1">₹{parseFloat(selectedOrder?.grandTotal || 0).toFixed(2)}</Typography>
                </div>
              </div>

              <Divider className="my-4" />

              <Typography variant="h6" className="mb-3">Items</Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">Item Name</TableCell>
                      <TableCell className="font-bold">Quantity</TableCell>
                      <TableCell className="font-bold">Unit</TableCell>
                      <TableCell className="font-bold">Unit Price</TableCell>
                      <TableCell className="font-bold">CGST</TableCell>
                      <TableCell className="font-bold">SGST</TableCell>
                      <TableCell className="font-bold">IGST</TableCell>
                      <TableCell className="font-bold">Tax Amount</TableCell>
                      <TableCell className="font-bold">Taxable Amount</TableCell>
                      <TableCell className="font-bold">Total</TableCell>
                    </TableRow>
                  </TableHead> 
                  <TableBody> 
                    {selectedOrder.items && Array.isArray(selectedOrder.items) ? (
                      selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.itemName || 'N/A'} ({item?.hsnCode})</TableCell>
                          <TableCell>{item.quantity || 0}</TableCell>
                          <TableCell>{item.unit || 0}</TableCell>
                          <TableCell>₹{parseFloat(item.unitPrice || 0).toFixed(2)}</TableCell>
                          <TableCell>{selectedOrder.taxGroup ===
                            "State Tax" ? item?.cgst :0 || 0} %</TableCell>
                          <TableCell>{selectedOrder.taxGroup ===
                            "State Tax" ? item?.sgst :0 || 0} %</TableCell>
                          <TableCell>{selectedOrder.taxGroup ===
                            "Other Tax" ? item?.igst :0 || 0} %</TableCell>
                          <TableCell>₹{item?.taxAmount || 0} </TableCell>

                          <TableCell>
                            ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toFixed(2)}
                          </TableCell>
                          <TableCell>₹{item?.amount || 0} </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No items found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedOrder.notes && (
                <>
                  <Divider className="my-4" />
                  <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                  <Typography variant="body2">{selectedOrder.notes}</Typography>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseReportPage;


