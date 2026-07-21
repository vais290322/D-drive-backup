import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import html2canvas from "html2canvas";
import { IoMdDownload } from "react-icons/io";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { MdOutlinePayments } from "react-icons/md";
import {
  BanknoteIcon,
  CalendarIcon,
  CreditCardIcon,
  HistoryIcon,
  IndianRupee,
  IndianRupeeIcon,
  PersonStandingIcon,
  ReceiptIcon,
  ShoppingCartIcon,
} from "lucide-react";

import SnigdhaPaymentSlip from "../../../component/Slip/SnigdhaPaymentSlip";

// const fetchInvoice = import.meta.env.VITE_BASE_URL_C;
const getAllLadgerApi = import.meta.env.VITE_REACT_GET_ALL_LADGER_SIN;
const updateLagerApi = import.meta.env.VITE_REACT_UPDATE_LADGER_SIN;
const fetchBank = import.meta.env.VITE_BASE_URL_C;

const ViewProductPaymentInvoice = () => {
  const [allinvoice, setAllInvoice] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  // console.log("all itme s  ; ",filteredInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [updateButton, setUpdateButton] = useState(true);

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [banks, setBanks] = useState([]);
  // console.log("banks",banks);

  // for slip 
  const [shouldDownloadReceipt, setShouldDownloadReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handleDownloadAllInvoices = async () => {
    try {
      if (!filteredInvoices || filteredInvoices.length === 0) {
        toast.error("No invoices to download");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Invoices");

      // Define headers and add the header row
      const headers = [
        "Invoice No.",
        "Customer Name",
        "Date",
        "Total Amount",
        "Paid Amount",
        "Due Amount",
        "Status",
      ];
      worksheet.addRow(headers);

      // Style the header row
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4167B8" }, // Blue background
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" }, // White text
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Map and add invoice data rows
      filteredInvoices.forEach((invoice) => {
        const dataRow = [
          invoice.invoiceNumber || "",
          invoice.invoiceId?.receiverDetails?.name || "",
          invoice.invoiceId?.date || "",
          Number(invoice.totalAmount) || 0,
          Number(invoice.totalPaidAmount) || 0,
          Number(invoice.dueAmount) || 0,
          invoice.isPaid ? "Paid" : "Pending",
        ];
        worksheet.addRow(dataRow);
      });

      // Calculate summary values
      const totalAmount = filteredInvoices.reduce(
        (sum, inv) => sum + Number(inv.totalAmount || 0),
        0
      );
      const totalPaid = filteredInvoices.reduce(
        (sum, inv) => sum + Number(inv.totalPaidAmount || 0),
        0
      );
      const totalDue = filteredInvoices.reduce(
        (sum, inv) => sum + Number(inv.dueAmount || 0),
        0
      );

      const summaryRowData = [
        "Total",
        "",
        "",
        totalAmount,
        totalPaid,
        totalDue,
        `Total Invoices: ${filteredInvoices.length}`,
      ];
      const summaryRow = worksheet.addRow(summaryRowData);

      // Style the summary row
      summaryRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4167B8" }, // Blue background
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" }, // White text
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Set column widths
      worksheet.columns = [
        { width: 15 },
        { width: 25 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
      ];

      // Generate the Excel file and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoices_${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Invoices downloaded successfully");
    } catch (error) {
      console.error("Download Error:", error);
      toast.error("Failed to download invoices");
    }
  };

  const invoiceRef = useRef(null);

  const handleDownloadInvoice = () => {
    if (!selectedInvoice) return;

    toast.loading("Generating PDF...");

    // Create a new jsPDF instance
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    // Add a colored header background
    pdf.setFillColor(44, 62, 80);
    pdf.rect(0, 0, pageWidth, 25, "F");

    // Set font styles for header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(255, 255, 255);

    // Add company header
    pdf.text("SNIGDHA ENTERPRISE", margin, 15);

    // Add invoice title
    pdf.setFontSize(16);
    pdf.text("INVOICE", pageWidth - margin - 20, 15);

    // Reset font for content
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    // Add invoice information in a styled box
    let y = 35;

    // Draw invoice info box
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 45, 2, 2, "F");

    // Add invoice information title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(44, 62, 80);
    pdf.text("Invoice Information", margin + 5, y + 8);

    // Add invoice details
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);

    // Left column
    let leftX = margin + 5;
    pdf.text(
      `Invoice Number: ${selectedInvoice?.invoiceNumber || "N/A"}`,
      leftX,
      y + 18
    );
    pdf.text(
      `Date: ${formatDate(selectedInvoice?.createdAt) || "N/A"}`,
      leftX,
      y + 26
    );
    pdf.text(
      `Payment Status: ${selectedInvoice?.isPaid === true ? "Paid" : "Pending"
      }`,
      leftX,
      y + 34
    );

    // Right column
    let rightX = pageWidth / 2 + 10;
    pdf.text(
      `Total Amount: ${selectedInvoice?.totalAmount || 0}`,
      rightX,
      y + 18
    );
    pdf.text(
      `Paid Amount:  ${(selectedInvoice?.totalPaidAmount || 0).toFixed(2)}`,
      rightX,
      y + 26
    );
    pdf.text(
      `Due Amount: ${(selectedInvoice?.dueAmount || 0).toFixed(2)}`,
      rightX,
      y + 34
    );

    // Add customer details in a styled box
    y += 55;

    // Draw customer info box
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 50, 2, 2, "F");

    // Add customer information title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(44, 62, 80);
    pdf.text("Customer Details", margin + 5, y + 8);

    // Add customer details
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);

    // Left column
    pdf.text(
      `Name: ${selectedInvoice?.invoiceId?.receiverDetails?.name || "N/A"}`,
      leftX,
      y + 18
    );
    pdf.text(
      `Phone: ${selectedInvoice?.invoiceId?.receiverDetails?.phoneNumber || "N/A"
      }`,
      leftX,
      y + 26
    );
    pdf.text(
      `Address: ${selectedInvoice?.invoiceId?.receiverDetails?.address || "N/A"
      }`,
      leftX,
      y + 36
    );

    // Right column
    pdf.text(
      `GST: ${selectedInvoice?.invoiceId?.receiverDetails?.gstin || "N/A"}`,
      rightX,
      y + 18
    );
    pdf.text(
      `Location: ${selectedInvoice?.invoiceId?.location || "N/A"}`,
      rightX,
      y + 24
    );
    pdf.text(
      `State: ${selectedInvoice?.invoiceId?.receiverDetails?.state || "N/A"}`,
      rightX,
      y + 30
    );

    // Add payment history if available
    y += 60;

    if (
      selectedInvoice.paymentDetails &&
      selectedInvoice.paymentDetails.length > 0
    ) {
      // Add payment history title with background
      pdf.setFillColor(52, 152, 219);
      pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Payment History", margin + 5, y + 5.5);

      y += 12;

      // Create payment history table
      const paymentHeaders = [
        "Date",
        "Payment Mode",
        "Amount",
        "Transaction ID",
      ];
      const paymentWidths = [
        (pageWidth - margin * 2) * 0.25,
        (pageWidth - margin * 2) * 0.25,
        (pageWidth - margin * 2) * 0.2,
        (pageWidth - margin * 2) * 0.3,
      ];

      // Draw table headers with background
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");

      pdf.setTextColor(60, 60, 60);
      let xPos = margin + 3;

      paymentHeaders.forEach((header, i) => {
        pdf.text(header, xPos, y + 5.5);
        xPos += paymentWidths[i];
      });

      // Draw payment history rows
      y += 8;
      pdf.setFont("helvetica", "normal");

      selectedInvoice.paymentDetails.forEach((payment, index) => {
        // Alternate row background
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");
        }

        xPos = margin + 3;
        pdf.text(formatDate(payment.paymentDate) || "N/A", xPos, y + 5.5);
        xPos += paymentWidths[0];
        pdf.text(payment.paymentMode || "N/A", xPos, y + 5.5);
        xPos += paymentWidths[1];
        pdf.text(`${payment.paymentAmount || 0}`, xPos, y + 5.5);
        xPos += paymentWidths[2];
        pdf.text(payment.transactionId || "N/A", xPos, y + 5.5);
        y += 8;
      });

      // Add some space after the table
      y += 5;
    }

    // Add items table
    if (
      Array.isArray(selectedInvoice?.invoiceId?.items) &&
      selectedInvoice?.invoiceId?.items.length > 0
    ) {
      // Check if we need a new page
      if (y > pageHeight - 80) {
        pdf.addPage();
        y = margin;
      }

      // Add items title with background
      pdf.setFillColor(52, 152, 219);
      pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Items", margin + 5, y + 5.5);

      y += 12;

      // Create items table headers
      const itemHeaders = [
        "Item",
        "Qty",
        "Unit",
        "Price",
        "Discount",
        "Tax",
        "Amount",
      ];
      const itemWidths = [
        (pageWidth - margin * 2) * 0.25,
        (pageWidth - margin * 2) * 0.08,
        (pageWidth - margin * 2) * 0.12,
        (pageWidth - margin * 2) * 0.15,
        (pageWidth - margin * 2) * 0.15,
        (pageWidth - margin * 2) * 0.1,
        (pageWidth - margin * 2) * 0.15,
      ];

      // Draw table headers with background
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");

      pdf.setTextColor(60, 60, 60);
      let xPos = margin + 3;

      itemHeaders.forEach((header, i) => {
        const align = i === 0 ? "left" : "center";
        if (align === "left") {
          pdf.text(header, xPos, y + 5.5);
        } else {
          pdf.text(header, xPos + itemWidths[i] / 2, y + 5.5, {
            align: "center",
          });
        }
        xPos += itemWidths[i];
      });

      // Draw items rows
      y += 8;
      pdf.setFont("helvetica", "normal");

      selectedInvoice?.invoiceId?.items.forEach((item, index) => {
        // Check if we need a new page
        if (y > pageHeight - 20) {
          pdf.addPage();
          y = margin;

          // Redraw headers on new page
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");

          pdf.setFont("helvetica", "bold");
          xPos = margin + 3;

          itemHeaders.forEach((header, i) => {
            const align = i === 0 ? "left" : "center";
            if (align === "left") {
              pdf.text(header, xPos, y + 5.5);
            } else {
              pdf.text(header, xPos + itemWidths[i] / 2, y + 5.5, {
                align: "center",
              });
            }
            xPos += itemWidths[i];
          });

          pdf.setFont("helvetica", "normal");
          y += 8;
        }

        // Alternate row background
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");
        }

        xPos = margin + 3;
        pdf.text(item.itemName || "N/A", xPos, y + 5.5);
        xPos += itemWidths[0];
        pdf.text(`${item.quantity || 0}`, xPos + itemWidths[1] / 2, y + 5.5, {
          align: "center",
        });
        xPos += itemWidths[1];
        pdf.text(item.unit || "pcs", xPos + itemWidths[2] / 2, y + 5.5, {
          align: "center",
        });
        xPos += itemWidths[2];
        pdf.text(
          `${item.sellingPrice || 0}`,
          xPos + itemWidths[3] / 2,
          y + 5.5,
          { align: "center" }
        );
        xPos += itemWidths[3];
        pdf.text(
          `${item.discountAmount || 0}`,
          xPos + itemWidths[4] / 2,
          y + 5.5,
          { align: "center" }
        );
        xPos += itemWidths[4];
        pdf.text(`${item.taxAmount || 0}%`, xPos + itemWidths[5] / 2, y + 5.5, {
          align: "center",
        });
        xPos += itemWidths[5];
        pdf.text(
          `${item.grossAmount || 0}`,
          xPos + itemWidths[6] / 2,
          y + 5.5,
          { align: "center" }
        );

        y += 8;
      });

      // Add some space after the table
      y += 10;
    }

    // Add summary section
    // Check if we need a new page
    if (y > pageHeight - 50) {
      pdf.addPage();
      y = margin;
    }

    // Draw summary box
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(pageWidth - margin - 80, y, 80, 40, 2, 2, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(44, 62, 80);
    pdf.text("Summary", pageWidth - margin - 75, y + 8);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);

    y += 15;
    pdf.text("Subtotal:", pageWidth - margin - 75, y);
    pdf.text(
      `${selectedInvoice.totalAmount || 0}`,
      pageWidth - margin - 10,
      y,
      { align: "right" }
    );

    y += 8;
    pdf.text("Paid Amount:", pageWidth - margin - 75, y);
    pdf.text(
      `${(selectedInvoice.totalPaidAmount || 0).toFixed(2)}`,
      pageWidth - margin - 10,
      y,
      { align: "right" }
    );

    y += 8;
    pdf.setFont("helvetica", "bold");
    pdf.text("Due Amount:", pageWidth - margin - 75, y);
    pdf.text(
      `${(selectedInvoice.dueAmount || 0).toFixed(2)}`,
      pageWidth - margin - 10,
      y,
      { align: "right" }
    );

    // Add footer
    const footerY = pageHeight - 10;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      "This is a computer-generated document. No signature is required.",
      margin,
      footerY
    );
    pdf.text(
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth - margin,
      footerY,
      { align: "right" }
    );
    // Save the PDF
    pdf.save(`Invoice-${selectedInvoice?.invoiceNumber || "download"}.pdf`);
    toast.dismiss();
    toast.success("PDF downloaded successfully!");
  };
  // console.log("item s : ",selectedInvoice)
  // productDetails is used as the payload for the create ladger API
  const [productDetails, setProductDetails] = useState({
    invoiceId: "",
    invoiceNumber: "",
    totalAmount: "",
    paymentDetails: [{}],
  });

  const [data, setData] = useState({
    paymentDate: "",
    paymentAmount: "",
    paymentMode: "",
    transactionId: "",
    bankId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // console.log("data gdhagwd", data);
  const getAllInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(getAllLadgerApi, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      // console.log("jsonData", jsonData);

      if (!response.ok) {
        throw new Error(jsonData?.message || "Failed to fetch invoices");
      }
      const sortedInvoices = (jsonData.data || []).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setAllInvoice(sortedInvoices);
      setFilteredInvoices(sortedInvoices);
      // console.log("Invoices:", jsonData.data);
      toast.success("Successfully fetched invoices");
    } catch (error) {
      // console.error("Fetch Error:", error);
      toast.error(error.message || "Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInvoices();
  }, []);
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(`${fetchBank}/s/api/v1/bank/all`);
        const data = await response.json();
        if (response.ok) {
          setBanks(data.data || []);
        } else {
          throw new Error(data.message || "Failed to fetch banks");
        }
      } catch (error) {
        // console.error("Error fetching banks:", error);
        toast.error("Failed to fetch banks");
      }
    };
    fetchBanks();
  }, []);

  // Add a new state for amount range filter
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("all");

  // Apply search and filters
  useEffect(() => {
    let result = [...allinvoice];

    // console.log("result : ",result);

    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59);
      result = result.filter((invoice) => {
        const invoiceDate = new Date(invoice?.invoiceId?.date);
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
    }

    if (paymentFilter !== "all") {
      result = result.filter(
        (invoice) =>
          invoice?.invoiceId?.paymentType?.toLowerCase() ===
          paymentFilter?.toLowerCase()
      );
    }

    // Add amount range filtering
    if (amountRange.min) {
      result = result.filter(
        (invoice) =>
          parseFloat(invoice?.totalAmount || 0) >= parseFloat(amountRange.min)
      );
    }

    if (amountRange.max) {
      result = result.filter(
        (invoice) =>
          parseFloat(invoice?.totalAmount || 0) <= parseFloat(amountRange.max)
      );
    }

    // Add status filtering
    if (statusFilter !== "all") {
      const isPaid = statusFilter === "paid";
      result = result.filter((invoice) => invoice.isPaid === isPaid);
    }

    if (searchTerm.trim()) {
      const term = searchTerm?.toLowerCase();
      result = result.filter((invoice) => {
        if (searchField === "all") {
          return (
            (invoice.invoiceNumber &&
              invoice.invoiceNumber?.toLowerCase().includes(term)) ||
            (invoice?.invoiceId?.receiverDetails?.name &&
              invoice?.invoiceId?.receiverDetails.name
                ?.toLowerCase()
                .includes(term)) ||
            (invoice?.invoiceId?.receiverDetails?.phoneNumber &&
              invoice?.invoiceId?.receiverDetails.phoneNumber
                ?.toLowerCase()
                .includes(term)) ||
            (invoice?.invoiceId?.paymentType &&
              invoice?.invoiceId?.paymentType?.toLowerCase().includes(term)) ||
            (invoice?.invoiceId?.grandTotal &&
              invoice?.invoiceId?.grandTotal.toString().includes(term))
          );
        } else if (searchField === "invoiceNumber") {
          return (
            invoice.invoiceNumber &&
            invoice.invoiceNumber?.toLowerCase().includes(term)
          );
        } else if (searchField === "customerName") {
          return (
            invoice?.invoiceId?.receiverDetails?.name &&
            invoice?.invoiceId?.receiverDetails.name
              ?.toLowerCase()
              .includes(term)
          );
        } else if (searchField === "phone") {
          return (
            invoice?.invoiceId?.receiverDetails?.phoneNumber &&
            invoice?.invoiceId?.receiverDetails.phoneNumber
              ?.toLowerCase()
              .includes(term)
          );
        } else if (searchField === "paymentType") {
          return (
            invoice?.invoiceId?.paymentType &&
            invoice?.invoiceId?.paymentType?.toLowerCase().includes(term)
          );
        } else if (searchField === "amount") {
          return (
            invoice?.invoiceId?.grandTotal &&
            invoice?.invoiceId?.grandTotal.toString().includes(term)
          );
        }
        return false;
      });
    }
    setFilteredInvoices(result);
    setCurrentPage(1);
  }, [
    searchTerm,
    searchField,
    allinvoice,
    dateRange,
    paymentFilter,
    amountRange,
    statusFilter,
  ]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSearchField("all");
    setDateRange({ from: "", to: "" });
    setPaymentFilter("all");
    setAmountRange({ min: "", max: "" });
    setStatusFilter("all");
    setFilteredInvoices(allinvoice);
  };

  // Update the viewInvoice function to properly set the selected invoice
  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowPdfPreview(false);
    setSelectedInvoice(null);
    setIsEditMode(false);
    setUpdateButton(true);
  };

  // When editing, populate selectedInvoice and productDetails
  const handleEditInvoice = (invoice) => {
    setData({
      paymentDate: "",
      paymentAmount: "",
      paymentMode: "",
      transactionId: "",
    });
    // console.log("invoice", invoice);
    setSelectedInvoice(invoice);
    setIsEditMode(true);
    setUpdateButton(true);

    setOpenDialog(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handleSaveEdit = async () => {
    const paymentAmount =
      parseFloat(productDetails.paymentDetails[0].paymentAmount) || 0;
    const grandTotal = parseFloat(selectedInvoice.grandTotal) || 0;
    if (paymentAmount > grandTotal) {
      // toast.error("Payment Amount cannot exceed the Grand Total")
      return;
    }
    try {
      const paymentDetails = [{
        paymentDate: data.paymentDate,
        paymentAmount: data.paymentAmount,
        paymentMode: data.paymentMode,
        transactionId: data.transactionId,
        bankId: data.bankId // Use data.bankId directly
      }];
      
      const response = await fetch(`${updateLagerApi}/${selectedInvoice._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ paymentDetails: paymentDetails }),
      });
      const jsonData = await response.json();
      if (!response.ok) {
        throw new Error(jsonData.message || "Failed to create ladger");
      }
      toast.success("Ledger created successfully");
      // Remove update button after successful creation
      setUpdateButton(false);
      getAllInvoices();
      handleCloseDialog();
      // setIsEditMode(false);


      const receiptPayload = {
        invoiceNumber: jsonData.data.invoiceNumber,
        paymentAmount: data?.paymentAmount,
        paymentMode: data?.paymentMode,
        paymentDate: data?.paymentDate,
        transactionId: data?.transactionId,
        customerName: jsonData.data?.invoiceId?.receiverDetails?.name,
        location: jsonData.data?.invoiceId?.location || ' ',
        grandTotal: jsonData.data?.invoiceId?.grandTotal || 0,

      };

      // Set receipt data and trigger download
      setReceiptData(receiptPayload);
      setShouldDownloadReceipt(true);


    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message || "Failed to create ladger");
    }
  };

  const handleReceiptDownloadComplete = () => {
    setShouldDownloadReceipt(false);
    setReceiptData(null);
    toast.success("Receipt downloaded successfully!");
  };

  useEffect(() => {
    if (data.paymentMode === "Cash") {
      const cashBanks = banks.filter(
        (bank) => bank.accountNumber && /^0{4,}/.test(bank.accountNumber)
      );
      if (cashBanks.length > 0 && !data.bankId) {
        setData((prevData) => ({
          ...prevData,
          bankId: cashBanks[0]._id,
        }));
      }
    }
  }, [data.paymentMode, banks]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Ledger Management in Snigdha
        </h2>

        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search invoices..."
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

            <FormControl
              variant="outlined"
              size="small"
              style={{ minWidth: 150 }}
            >
              <InputLabel>Search In</InputLabel>
              <Select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                label="Search In"
              >
                <MenuItem value="all">All Fields</MenuItem>
                <MenuItem value="invoiceNumber">Invoice Number</MenuItem>
                <MenuItem value="customerName">Customer Name</MenuItem>
                <MenuItem value="phone">Phone</MenuItem>
                <MenuItem value="paymentType">Payment Type</MenuItem>
                <MenuItem value="amount">Amount</MenuItem>
              </Select>
            </FormControl>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              <FilterIcon fontSize="small" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              <RefreshIcon fontSize="small" />
              Reset
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Type
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="all">All Types</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="NetBanking">Net Banking</option>
                    <option value="Cheque">Cheque</option>
                    <option value="BankTransfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Range (₹)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={amountRange.min}
                      onChange={(e) =>
                        setAmountRange({ ...amountRange, min: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={amountRange.max}
                      onChange={(e) =>
                        setAmountRange({ ...amountRange, max: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full flex justify-center items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    <RefreshIcon fontSize="small" />
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredInvoices.length > 0 ? indexOfFirstItem + 1 : 0}{" "}
              to {Math.min(indexOfLastItem, filteredInvoices.length)} of{" "}
              {filteredInvoices.length} invoices
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border rounded p-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">
                  No invoices found matching your criteria
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Sl.No.
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Invoice No.
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Customer Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Total Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Paid Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Due Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems?.map((invoice, index) => (
                      <tr
                        key={invoice._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {invoice?.invoiceNumber}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {invoice?.invoiceId?.receiverDetails?.name}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {invoice?.invoiceId?.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          ₹{invoice.totalAmount}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ₹{invoice.totalPaidAmount?.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          ₹{invoice.dueAmount?.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${invoice?.isPaid === true
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                              }`}
                          >
                            {invoice?.isPaid === true ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex justify-center gap-2">
                            <IconButton
                              onClick={() => handleEditInvoice(invoice)}
                              size="small"
                              className="text-blue-500 hover:bg-blue-50"
                              title="Edit Invoice"
                              hidden={invoice?.isPaid === true}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => viewInvoice(invoice)}
                              size="small"
                              className="text-indigo-500 hover:bg-indigo-50"
                              title="View Invoice"
                            >
                              <RemoveRedEyeIcon fontSize="small" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                      <td
                        colSpan="4"
                        className="px-4 py-3 text-sm text-gray-900"
                      >
                        Summary (All Invoices)
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ₹
                        {filteredInvoices
                          ?.reduce(
                            (sum, invoice) =>
                              sum + parseFloat(invoice.totalAmount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ₹
                        {filteredInvoices
                          ?.reduce(
                            (sum, invoice) =>
                              sum + parseFloat(invoice.totalPaidAmount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ₹
                        {filteredInvoices
                          ?.reduce(
                            (sum, invoice) =>
                              sum + parseFloat(invoice.dueAmount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td
                        colSpan="2"
                        className="px-4 py-3 text-sm text-gray-500 text-center"
                      >
                        {filteredInvoices.length} invoice(s)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                size="large"
              />
              <button
                onClick={handleDownloadAllInvoices}
                className="px-6 py-2 text-sm bg-blue-700 cursor-pointer text-white text-center rounded-full gap-5 hover:bg-blue-500 transition-colors"
              >
                <div className="flex items-center justify-center gap-2">
                  <IoMdDownload /> Download All
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { borderRadius: "12px" },
          className: "overflow-hidden",
        }}
      >
        <DialogTitle className="flex items-center justify-between bg-indigo-50 border-b">
          <span className="text-xl font-semibold flex items-center">
            {isEditMode ? (
              <>
                <MdOutlinePayments className="mr-2 text-indigo-600" />
                Record Payment
              </>
            ) : (
              <>
                <ReceiptIcon className="mr-2 text-indigo-600" />
                Invoice Details
              </>
            )}
          </span>
          <div>
            {isEditMode && updateButton ? (
              <button
                onClick={handleSaveEdit}
                className="mr-2 cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <IndianRupee className="mr-1" fontSize="small" />
                Save Payment
              </button>
            ) : (
              <button
                onClick={handleDownloadInvoice}
                className="mr-2 cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <IoMdDownload className="mr-1" />
                Download PDF
              </button>
            )}
            <IconButton
              onClick={handleCloseDialog}
              size="small"
              className="bg-gray-100 hover:bg-gray-200"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className="bg-gray-50">
          {selectedInvoice && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                    <ReceiptIcon
                      className="mr-2 text-indigo-600"
                      fontSize="small"
                    />
                    Invoice Information
                  </h3>
                  {isEditMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <CalendarIcon
                            fontSize="small"
                            className="mr-1 text-gray-500"
                          />
                          Payment Date
                        </label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={data.paymentDate}
                          max={new Date().toISOString().split("T")[0]}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <MdOutlinePayments
                            fontSize="small"
                            className="mr-1 text-gray-500"
                          />
                          Payment Type
                        </label>
                        <select
                          name="paymentMode"
                          value={data.paymentMode}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        >
                          <option value="">Select Payment Type</option>
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="UPI">UPI</option>
                          <option value="NetBanking">Net Banking</option>
                          <option value="Cheque">Cheque</option>
                          <option value="BankTransfer">Bank Transfer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <IndianRupeeIcon
                            fontSize="small"
                            className="mr-1 text-gray-500"
                          />
                          Payment Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            name="paymentAmount"
                            value={data.paymentAmount}
                            onChange={handleChange}
                            className="w-full p-2 pl-7 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            placeholder="0.00"
                          />
                        </div>
                        {selectedInvoice &&
                          parseFloat(data.paymentAmount || 0) >
                          parseFloat(selectedInvoice.dueAmount || 0) && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <span className="material-icons text-sm mr-1">
                                error
                              </span>
                              Payment amount cannot exceed due amount.
                            </p>
                          )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <BanknoteIcon fontSize="small" className="mr-1 text-gray-500" />
                          Select Bank *
                        </label>
                        <select
                          name="bankId"
                          value={data.bankId || ""}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        >
                          <option value="">Select Bank Account</option>
                          {banks
                            .filter((bank) => {
                              if (data.paymentMode === "Cash") {
                                return bank.accountNumber && /^0{4,}/.test(bank.accountNumber);
                              }
                              return bank.accountNumber && !/^0{4,}/.test(bank.accountNumber);
                            })
                            .map((bank) => (
                              <option key={bank._id} value={bank._id}>
                                {bank.bankName} - {bank.accountNumber}
                              </option>
                            ))}
                        </select>
                        {data.paymentMode && !data.bankId && (
                          <p className="mt-1 text-xs text-amber-600">
                            Please select a bank account for this payment method
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <CreditCardIcon
                            fontSize="small"
                            className="mr-1 text-gray-500"
                          />
                          Transaction ID
                        </label>
                        <input
                          type="text"
                          name="transactionId"
                          value={data.transactionId}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="Enter transaction ID"
                        />
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-md mt-4">
                        <p className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">
                            Due Amount:
                          </span>
                          <span className="text-indigo-700 font-bold">
                            ₹{selectedInvoice.dueAmount?.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <ReceiptIcon
                            fontSize="small"
                            className="mr-1 text-gray-400"
                          />
                          Invoice Number:
                        </span>
                        <span className="text-gray-800 font-medium">
                          #{selectedInvoice?.invoiceNumber}
                        </span>
                      </p>
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <CalendarIcon
                            fontSize="small"
                            className="mr-1 text-gray-400"
                          />
                          Date:
                        </span>
                        <span className="text-gray-800">
                          {formatDate(selectedInvoice?.createdAt)}
                        </span>
                      </p>
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <MdOutlinePayments
                            fontSize="small"
                            className="mr-1 text-gray-400"
                          />
                          Payment Status:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${selectedInvoice?.isPaid === true
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {selectedInvoice?.isPaid === true
                            ? "Paid"
                            : "Pending"}
                        </span>
                      </p>
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <IndianRupeeIcon
                            fontSize="small"
                            className="mr-1 text-gray-400"
                          />
                          Total Amount:
                        </span>
                        <span className="text-gray-800">
                          ₹{selectedInvoice?.totalAmount}
                        </span>
                      </p>
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <IndianRupee
                            fontSize="small"
                            className="mr-1 text-gray-400"
                          />
                          Paid Amount:
                        </span>
                        <span className="text-green-600 font-medium">
                          ₹{selectedInvoice?.totalPaidAmount?.toFixed(2)}
                        </span>
                      </p>
                      <p className="flex justify-between items-center py-2">
                        <span className="font-medium text-gray-600 flex items-center">
                          <IndianRupeeIcon
                            fontSize="small"
                            className="mr-1 text-gray-400"
                          />
                          Due Amount:
                        </span>
                        <span className="text-indigo-700 font-bold">
                          ₹{selectedInvoice?.dueAmount?.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                    <PersonStandingIcon
                      className="mr-2 text-indigo-600"
                      fontSize="small"
                    />
                    Customer Details
                  </h3>
                  <div className="space-y-3">
                    <p className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600 flex items-center">
                        <PersonStandingIcon
                          fontSize="small"
                          className="mr-1 text-gray-400"
                        />
                        Name:
                      </span>
                      <span className="text-gray-800">
                        {selectedInvoice?.invoiceId?.receiverDetails?.name ||
                          "N/A"}
                      </span>
                    </p>
                    <p className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600 flex items-center">
                        <span className="material-icons-outlined text-sm mr-1">
                          phone
                        </span>
                        Phone:
                      </span>
                      <span className="text-gray-800">
                        {selectedInvoice?.invoiceId?.receiverDetails
                          ?.phoneNumber || "N/A"}
                      </span>
                    </p>
                    <p className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600 flex items-center">
                        <span className="material-icons-outlined text-sm mr-1">
                          location_on
                        </span>
                        Address:
                      </span>
                      <span className="text-gray-800 text-right">
                        {selectedInvoice?.invoiceId?.receiverDetails?.address ||
                          "N/A"}
                      </span>
                    </p>
                    {!isEditMode && (
                      <>
                        <p className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-600 flex items-center">
                            <span className="material-icons-outlined text-sm mr-1">
                              location_city
                            </span>
                            Location:
                          </span>
                          <span className="text-gray-800">
                            {selectedInvoice?.invoiceId?.location || "N/A"}
                          </span>
                        </p>
                        <p className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-600 flex items-center">
                            <span className="material-icons-outlined text-sm mr-1">
                              public
                            </span>
                            State:
                          </span>
                          <span className="text-gray-800">
                            {selectedInvoice?.invoiceId?.receiverDetails
                              ?.state || "N/A"}
                          </span>
                        </p>
                        <p className="flex justify-between items-center py-2">
                          <span className="font-medium text-gray-600 flex items-center">
                            <span className="material-icons-outlined text-sm mr-1">
                              receipt
                            </span>
                            GST:
                          </span>
                          <span className="text-gray-800">
                            {selectedInvoice?.invoiceId?.receiverDetails
                              ?.gstin || "N/A"}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment History Section */}
              {!isEditMode &&
                selectedInvoice.paymentDetails &&
                selectedInvoice.paymentDetails.length > 0 && (
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                      <HistoryIcon
                        className="mr-2 text-indigo-600"
                        fontSize="small"
                      />
                      Payment History
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full mb-4">
                        <thead>
                          <tr className="bg-indigo-50 text-indigo-800">
                            <th className="p-2 text-left rounded-l-md">Date</th>
                            <th className="p-2 text-left">Payment Mode</th>
                            <th className="p-2 text-right">Amount</th>
                            <th className="p-2 text-left rounded-r-md">
                              Transaction ID
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.paymentDetails.map(
                            (payment, index) => (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-50 transition-colors"
                              >
                                <td className="p-2 font-medium">
                                  {formatDate(payment.paymentDate)}
                                </td>
                                <td className="p-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${payment.paymentMode?.toLowerCase() ===
                                      "cash"
                                      ? "bg-green-100 text-green-800"
                                      : payment.paymentMode?.toLowerCase() ===
                                        "card"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-purple-100 text-purple-800"
                                      }`}
                                  >
                                    {payment.paymentMode}
                                  </span>
                                </td>
                                <td className="p-2 text-right font-medium">
                                  ₹{payment.paymentAmount}
                                </td>
                                <td className="p-2 text-gray-600">
                                  {payment.transactionId || "N/A"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Items Section */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <ShoppingCartIcon
                    className="mr-2 text-indigo-600"
                    fontSize="small"
                  />
                  Items
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full mb-4">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-800">
                        <th className="p-2 text-left rounded-l-md">Item</th>
                        <th className="p-2 text-right">Quantity</th>
                        <th className="p-2 text-right">Unit</th>
                        <th className="p-2 text-right">Price</th>
                        <th className="p-2 text-right">Discount</th>
                        <th className="p-2 text-right">Tax (%)</th>
                        <th className="p-2 text-right rounded-r-md">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(selectedInvoice?.invoiceId?.items) ? (
                        selectedInvoice?.invoiceId?.items?.map(
                          (item, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-50 transition-colors"
                            >
                              <td className="p-2 font-medium">
                                {item.itemName || "N/A"}
                              </td>
                              <td className="p-2 text-right">
                                {item.quantity || 0}
                              </td>
                              <td className="p-2 text-right">
                                {item.unit || "pcs"}
                              </td>
                              <td className="p-2 text-right">
                                ₹{item.sellingPrice || 0}
                              </td>
                              <td className="p-2 text-right">
                                ₹{item.discountAmount || 0}
                              </td>
                              <td className="p-2 text-right">
                                {item.taxAmount || 0}%
                              </td>
                              <td className="p-2 text-right font-medium">
                                ₹{item.grossAmount || 0}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="p-4 text-center text-gray-500"
                          >
                            No items available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tax Information */}
              {selectedInvoice.taxGroup && (
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                    <TaxIcon
                      className="mr-2 text-indigo-600"
                      fontSize="small"
                    />
                    Tax Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <DescriptionIcon
                            fontSize="small"
                            className="mr-1 text-gray-400"
                          />
                          Tax Group:
                        </span>
                        <span className="text-gray-800">
                          {selectedInvoice.taxGroup}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <IndianRupeeIcon
                            fontSize="small"
                            className="mr-1 text-gray-400"
                          />
                          Tax Amount:
                        </span>
                        <span className="text-gray-800">
                          ₹{selectedInvoice.taxableAmount}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Section */}
              <div className="flex justify-end">
                <div className="w-64 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between mb-2 py-1 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₹{selectedInvoice.totalAmount}</span>
                  </div>
                  <div className="flex justify-between mb-2 py-1 border-b border-gray-100">
                    <span className="text-gray-600">Paid Amount:</span>
                    <span className="text-green-600">
                      ₹{selectedInvoice.totalPaidAmount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 mt-2">
                    <span>Due Amount:</span>
                    <span className="text-indigo-700">
                      ₹{selectedInvoice.dueAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add the Snigdha Payment Slip component here */}
      {receiptData && (
        <SnigdhaPaymentSlip
          paymentData={receiptData}
          shouldDownload={shouldDownloadReceipt}
          onDownloadComplete={handleReceiptDownloadComplete}
        />
      )}

    </div>
  );
};

export default ViewProductPaymentInvoice;
