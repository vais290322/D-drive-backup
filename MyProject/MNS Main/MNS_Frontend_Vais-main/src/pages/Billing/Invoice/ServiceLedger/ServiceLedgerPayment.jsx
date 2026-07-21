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
  DialogActions,
  CircularProgress
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  AccountBalanceWallet as VoucherIcon,
} from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import html2canvas from "html2canvas";
import { IoMdDownload } from "react-icons/io";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import MNSPaymentSlip from "../../../../component/Slip/MNSPaymentSlip";
import MnsPaymentAndViewCustomerBlanceComponent from "../../../../component/PaymentForCreditDebitNote/MnsPaymentAndViewCustomerBlanceComponent"
import { backendDomainA } from "../../../../Common/index";
import { FaStreetView } from "react-icons/fa";
import { Calendar, FileText, Hash, IndianRupee } from "lucide-react";
// const fetchInvoice = import.meta.env.VITE_BASE_URL_C;
const fetchInvoice = import.meta.env.VITE_BASE_URL_C;
const fetchBank = import.meta.env.VITE_BASE_URL_C;
const deleteInvoice = import.meta.env.VITE_BASE_URL_C;
const updateInvoice = import.meta.env.VITE_BASE_URL_C;

const ServiceLedgerPayment = () => {
  const [allinvoice, setAllInvoice] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  // console.log("selected ; ", selectedInvoice);

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [updateButton, setUpdateButton] = useState(true);
  const [allServiceData, setAllServiceData] = useState("");

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [banks, setBanks] = useState([]);

  // for slip
  const [shouldDownloadReceipt, setShouldDownloadReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // for customer blance on 10-01-2026
  const [openCustomerBalance, setOpenCustomerBalance] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // for voucher 10-01-2026
  const [openVoucherDialog, setOpenVoucherDialog] = useState(false);
  const [voucherNotes, setVoucherNotes] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  const fetchBanks = async () => {
    try {
      const response = await fetch(`${fetchBank}/api/v1/bank/all`);
      const data = await response.json();
      if (response.ok) {
        setBanks(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch banks");
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error("Failed to fetch banks");
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);
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
    pdf.text("MNS SECURE SOLUTION", margin, 15);

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
      `Date: ${formatDate(selectedInvoice?.invoiceId?.date) || "N/A"}`,
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
  const [serviceDetails, setserviceDetails] = useState({
    invoiceId: "",
    invoiceNumber: "",
    invoiceType: "Service",
    paymentDetails: [
      {
        paymentDate: "",
        paymentAmount: "",
        paymentMode: "",
        transactionId: "",
      },
    ],
    totalAmount: "",
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
      const response = await fetch(
        `${fetchInvoice}/api/v1/service-account/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const jsonData = await response.json();
      console.log("jsonData", jsonData);

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
  const getAllServiceInvoiceDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${fetchInvoice}/api/v1/service/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const allData = await response.json();
      console.log("...", allData);

      if (!response.ok) {
        throw new Error(jsonData?.message || "Failed to fetch invoices");
      }

      setAllServiceData(allData.data);
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
    getAllServiceInvoiceDetails();
  }, []);

  // Add a new state for amount range filter
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [statusFilter, setStatusFilter] = useState("all");

  // Apply search and filters
  useEffect(() => {
    let result = [...allinvoice];

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
            (invoice?.invoiceId?.total?.grandTotal &&
              invoice?.invoiceId?.total?.grandTotal.toString().includes(term))
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
            invoice?.invoiceId?.total?.grandTotal &&
            invoice?.invoiceId?.total?.grandTotal.toString().includes(term)
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
  // console.log("currentItem",currentItems);

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
    setSelectedVoucher(null);
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
    setserviceDetails({
      invoiceId: invoice._id,
      invoiceNumber: invoice.invoiceNumber || "",
      totalAmount: invoice.grandTotal || "",
      invoiceType: "Service",
      paymentDetails: [
        {
          paymentDate: invoice.date ? invoice.date.split("T")[0] : "",
          paymentAmount: invoice.paymentAmount || "",
          paymentMode: invoice.paymentType || "",
          transactionId: invoice.transactionId || "",
        },
      ],
    });
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

  useEffect(() => {
    if (data?.paymentMode !== 'Voucher') {
      setSelectedVoucher(null);
    }
  }, [data?.paymentMode])

  // Save update by posting data to the API endpoint after validation
  const handleSaveEdit = async () => {
    const paymentAmount =
      parseFloat(data.paymentAmount) || 0;
    const grandTotal = parseFloat(selectedInvoice.dueAmount.toFixed(2)) || 0;

    // console.log("payment mode , payment amount, due amount : ", data.paymentMode, data.paymentAmount, grandTotal,selectedVoucher)

    if (data.paymentMode === 'Voucher' && selectedVoucher) {
      console.log("Voucher selected")
    } else {
      if (paymentAmount > grandTotal) {
        toast.error("Payment Amount cannot exceed the Due Amount12")
        return;
      }
    }

    try {
      const payload = {
        invoiceId: selectedInvoice._id,
        invoiceNumber: selectedInvoice.invoiceNumber || "",
        invoiceType: "Service",
        totalAmount: selectedInvoice.totalAmount || "",
        paymentDetails: [
          {
            ...data,
            paymentAmount: Number(data.paymentAmount), // Ensure paymentAmount is a number
          },
        ],
      };

let voucherDetails = null;

      if (data.paymentMode === "Voucher" && selectedVoucher) {
        voucherDetails = [{
          noteId: selectedVoucher._id,
          noteNumber: selectedVoucher.referenceNumber,
          noteType: selectedVoucher && selectedVoucher?.noteType || null,
          amount: data.paymentAmount,
          date: data.paymentDate || new Date().toISOString().split("T")[0],
          customerId: selectedInvoice?.invoiceId?.receiverDetails?.id
        }];
      }


      const paymentDetails = [{
        paymentDate: data.paymentDate,
        paymentAmount: data.paymentAmount,
        paymentMode: data.paymentMode,
        transactionId: data.transactionId,
        bankId: data.bankId, // Use data.bankId directly
        noteType: selectedVoucher && selectedVoucher?.noteType || null,

      }];

      // console.log("payment Details : ", paymentDetails);
      // console.log("Voucher Details : ", voucherDetails);
      // return;


      const response = await fetch(
        `${updateInvoice}/api/v1/service-account/update/${selectedInvoice._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          body: JSON.stringify({ paymentDetails, voucherDetails }),
        }
      );

      const jsonData = await response.json();

      console.log("jsonData from service ledger : ", jsonData);

      if (!response.ok) {
        throw new Error(jsonData.message || "Failed to create ladger");
      }

      toast.success("Ledger created successfully");
      // Remove update button after successful creation
      setUpdateButton(false);
      getAllInvoices();
      handleCloseDialog();
      // isEditMode(false);

      const receiptPayload = {
        invoiceNumber: jsonData.data.invoiceNumber,
        paymentAmount: data.paymentAmount,
        paymentMode: data?.paymentMode,
        paymentDate: data.paymentDate,
        transactionId: data.transactionId,
        customerName: jsonData.data?.invoiceId?.customerName,
        location: jsonData.data?.invoiceId?.location || " ",
        grandTotal: jsonData.data?.totalAmount || 0,
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

  // Add useEffect for auto-selecting cash bank
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


  // for view customer balnce
  const handleViewCustomerBalance = (customerId) => {
    setSelectedCustomerId(customerId);
    setOpenCustomerBalance(true);
  };

  // Function to fetch credit/debit notes for voucher selection
  const fetchVoucherNotes = async (customerId) => {
    if (!customerId) return;

    try {
      setLoadingVouchers(true);
      const response = await fetch(`${backendDomainA}/api/v1/credit-debit-notes/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      if (!response.ok) {
        throw new Error(jsonData?.message || "Failed to fetch credit/debit notes");
      }
      // console.log("jsonData in voucher notes", jsonData);

      // Filter notes by customer and approved status
      const customerNotes = (jsonData.data || [])
        .filter(note =>
          note.status === 'approved' &&
          note.invoiceDetails?.receiverDetails?.id === customerId
        )
        .map(note => ({
          ...note,
          availableAmount: (note.totalFinalAmount || note.amount) - (note.appliedAmount || 0)
        }))
        .filter(note => note.availableAmount > 0); // Only show notes with available balance

      setVoucherNotes(customerNotes);
    } catch (error) {
      console.error("Error fetching voucher notes:", error);
      toast.error(error.message || "Error fetching credit/debit notes");
    } finally {
      setLoadingVouchers(false);
    }
  };

  // Handle voucher selection
  const handleVoucherSelection = (note) => {
    // console.log("Selected Voucher:", note);
    setSelectedVoucher(note);

    // For debit notes, use the full amount; for credit notes, use available amount
    let amountToApply;
    if (note?.noteType === 'debit') {
      // For debit notes, use the full amount as it represents what customer owes us
      amountToApply = parseFloat(note.totalFinalAmount || note.amount || 0);
    } else {
      // For credit notes, use the available amount
      // amountToApply = parseFloat(note.availableAmount || 0);

      // Auto-fill payment details based on selected voucher
      const maxAmount = Math.min(
        parseFloat(note.availableAmount || 0),
        parseFloat(selectedInvoice.dueAmount || 0) - parseFloat(data.paymentAmount || 0)
      );
      amountToApply = maxAmount;

    }

    // Auto-fill payment details based on selected voucher
    setData((prev) => ({
      ...prev,
      paymentAmount: amountToApply.toFixed(2),
      transactionId:
        note && note?.noteType === "credit"
          ? `Auto applied from Credit Note - ${note.referenceNumber}`
          : "", // debit voucher → no auto transaction ID
    }));

    // Close the dialog after applying
    handleCloseVoucherDialog();
  };

  // Handle opening voucher dialog
  const handleOpenVoucherDialog = () => {
    if (!selectedInvoice?.invoiceId?.receiverDetails?.id) {
      toast.error("Customer information not available");
      return;
    }

    fetchVoucherNotes(selectedInvoice?.invoiceId?.receiverDetails?.id);
    setOpenVoucherDialog(true);
  };

  // Handle closing voucher dialog
  const handleCloseVoucherDialog = () => {
    setOpenVoucherDialog(false);
    setVoucherNotes([]);
  };

  // console.log("payment amount and due amount : ", data.paymentAmount, selectedInvoice.dueAmount)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <MnsPaymentAndViewCustomerBlanceComponent
        customerId={selectedCustomerId}
        open={openCustomerBalance}
        onClose={() => setOpenCustomerBalance(false)}
      />
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Service Ledger Management
          </h2>
          <button
            onClick={handleDownloadAllInvoices}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <IoMdDownload className="text-lg" />
            Export to Excel
          </button>
        </div>

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
              className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <FilterIcon fontSize="small" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <RefreshIcon fontSize="small" />
              Reset
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Type
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="all">Select All</option>
                    <option value="cash">Cash</option>
                    <option value="credit">Credit</option>
                    {/* <option value="UPI">UPI</option>
                    <option value="NetBanking">Net Banking</option>
                    <option value="Cheque">Cheque</option>
                    <option value="BankTransfer">Bank Transfer</option> */}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Range (₹)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={amountRange.min}
                        onChange={(e) =>
                          setAmountRange({
                            ...amountRange,
                            min: e.target.value,
                          })
                        }
                        className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={amountRange.max}
                        onChange={(e) =>
                          setAmountRange({
                            ...amountRange,
                            max: e.target.value,
                          })
                        }
                        className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sl.No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No invoices found
                  </td>
                </tr>
              ) : (
                currentItems?.map((invoice, index) => (
                  <tr
                    key={invoice._id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice?.invoiceId?.receiverDetails?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice?.invoiceId?.date) || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{invoice?.totalAmount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      ₹{invoice?.totalPaidAmount?.toFixed(2) || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                      ₹{invoice?.dueAmount?.toFixed(2) || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice?.isPaid === true
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                          }`}
                      >
                        {invoice?.isPaid === true ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => viewInvoice(invoice)}
                          className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors"
                          title="View Invoice"
                        >
                          <RemoveRedEyeIcon fontSize="small" />
                        </button>
                        <IconButton
                          onClick={() => handleViewCustomerBalance(invoice?.invoiceId?.receiverDetails?.id)}
                          size="small"
                          title="View Customer Balance"
                          disabled={!invoice?.invoiceId?.receiverDetails?.id}
                        >
                          <FaStreetView fontSize="small" className="text-green-500 hover:bg-green-50" />
                        </IconButton>
                        {invoice?.isPaid !== true && (
                          <button
                            onClick={() => handleEditInvoice(invoice)}
                            className="text-indigo-600 cursor-pointer hover:text-indigo-900 transition-colors"
                            title="Record Payment"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gray-100 font-semibold border-t-2 border-gray-300">
              <tr>
                <td colSpan={4} className="px-6 py-3 text-right text-gray-700">
                  Summary (All Invoices)
                </td>
                <td className="px-6 py-3 text-right text-gray-900">
                  ₹
                  {filteredInvoices
                    ?.reduce(
                      (sum, invoice) =>
                        sum + (parseFloat(invoice.totalAmount) || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td className="px-6 py-3 text-right text-green-600">
                  ₹
                  {filteredInvoices
                    ?.reduce(
                      (sum, invoice) =>
                        sum + (parseFloat(invoice.totalPaidAmount) || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td className="px-6 py-3 text-right text-orange-600">
                  ₹
                  {filteredInvoices
                    ?.reduce(
                      (sum, invoice) =>
                        sum + (parseFloat(invoice.dueAmount) || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td className="px-6 py-3 text-center text-gray-600">
                  {filteredInvoices?.length} invoice(s)
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
              <option value={2000}>2000</option>
            </select>
            <span className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredInvoices.length)} of{" "}
              {filteredInvoices.length} entries
            </span>
          </div>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="medium"
          />
        </div>
      </div>

      {/* Invoice Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditMode ? "Record Payment" : "Invoice Details"}
            </h2>
            <div className="flex items-center gap-2">
              {!isEditMode && (
                <button
                  onClick={handleDownloadInvoice}
                  className="flex items-center cursor-pointer gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                >
                  <IoMdDownload className="text-lg" />
                  Download PDF
                </button>
              )}
              <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="p-6">
          {selectedInvoice && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">
                  Invoice Details
                </h3>
                {isEditMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Date *
                      </label>
                      <input
                        type="date"
                        name="paymentDate"
                        value={data.paymentDate}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Type *
                      </label>
                      <select
                        name="paymentMode"
                        value={data.paymentMode}
                        // onChange={handleChange}
                        onChange={(e) => {
                          const value = e.target.value;

                          setData((prev) => ({
                            ...prev,
                            paymentMode: value,
                            // Reset transactionId for non-voucher modes
                            transactionId: value === "Voucher" ? prev.transactionId : ""
                          }));

                          // Open voucher dialog when selecting Voucher
                          if (value === "Voucher") {
                            handleOpenVoucherDialog();
                          }
                        }}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                      >
                        <option value="">Select Payment Mode</option>
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="UPI">UPI</option>
                        <option value="NetBanking">Net Banking</option>
                        <option value="Cheque">Cheque</option>
                        <option value="BankTransfer">Bank Transfer</option>
                        <option value="Voucher">Voucher</option>
                      </select>
                    </div>

                    {/* Add hidden fields for voucher note type and number */}
                    {data.paymentMode === 'Voucher' && selectedVoucher && (
                      <>
                        <input
                          type="hidden"
                          name="voucherNoteType"
                          value={selectedVoucher?.noteType}
                        />
                        <input
                          type="hidden"
                          name="voucherNoteNumber"
                          value={selectedVoucher.referenceNumber}
                        />
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Account *
                      </label>
                      <select
                        name="bankId"
                        value={data.bankId || ""}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Select Bank Account</option>
                        {banks
                          .filter((bank) => {
                            // If payment mode is Cash, only show banks with account numbers containing "0000"
                            if (data.paymentMode === "Cash") {
                              return (
                                bank.accountNumber &&
                                /^0{4,}/.test(bank.accountNumber)
                              );
                            }
                            // For other payment modes, show regular banks (not cash accounts)
                            return (
                              bank.accountNumber &&
                              !/^0{4,}/.test(bank.accountNumber)
                            );
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={data.transactionId}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Enter transaction reference"
                        readOnly={data.paymentMode === 'Voucher' && selectedVoucher && selectedVoucher?.noteType === 'credit'}
                      />
                    </div>

                    {data.paymentMode === 'Voucher' && selectedVoucher && (
                      <p className="mt-1 text-xs text-gray-500">
                        Auto-filled from {selectedVoucher?.noteType === 'credit' ? 'Credit' : 'Debit'} Note: {selectedVoucher.referenceNumber}
                      </p>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Amount *
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          name="paymentAmount"
                          value={data.paymentAmount}
                          onChange={handleChange}
                          className="w-full p-2.5 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="0.00"
                          required
                          min={0}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      {selectedInvoice &&
                        parseFloat(data.paymentAmount || 0) >
                        parseFloat(selectedInvoice.dueAmount.toFixed(2) || 0) && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">

                            Payment amount cannot exceed due amount.
                          </p>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">
                            Total Invoice Amount:{" "}
                            <span className="font-medium text-gray-900">
                              ₹{selectedInvoice?.totalAmount?.toFixed(2)}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Due Amount:{" "}
                            <span className="font-medium text-orange-600">
                              ₹{selectedInvoice?.dueAmount?.toFixed(2)}
                            </span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">New Payment:</p>
                          <p className="text-lg font-bold text-indigo-600">
                            ₹{parseFloat(data.paymentAmount || 0).toFixed(2)}
                          </p>
                          {parseFloat(data.paymentAmount || 0) > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {parseFloat(data.paymentAmount || 0) >=
                                parseFloat(selectedInvoice?.dueAmount || 0)
                                ? "This will complete the payment"
                                : `Remaining: ₹${(
                                  parseFloat(
                                    selectedInvoice?.dueAmount || 0
                                  ) - parseFloat(data.paymentAmount || 0)
                                ).toFixed(2)}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveEdit}
                      disabled={
                        !data.paymentDate ||
                        !data.paymentAmount ||
                        !data.paymentMode ||
                        parseFloat(data.paymentAmount) <= 0 ||
                        parseFloat(data.paymentAmount) >
                        parseFloat(selectedInvoice?.dueAmount.toFixed(2) || 0)
                      }
                      className={`w-full mt-4  py-2.5 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2
                        ${!data.paymentDate ||
                          !data.paymentAmount ||
                          !data.paymentMode ||
                          parseFloat(data.paymentAmount) <= 0 ||
                          parseFloat(data.paymentAmount) >
                          parseFloat(selectedInvoice?.dueAmount.toFixed(2) || 0)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 cursor-pointer hover:bg-indigo-700 transition-colors"
                        }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Record Payment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3" ref={invoiceRef}>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Invoice Number:
                      </span>
                      <span className="text-gray-800">
                        {selectedInvoice?.invoiceNumber}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">Date:</span>
                      <span className="text-gray-800">
                        {formatDate(selectedInvoice?.invoiceId?.date)}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Payment Status:
                      </span>
                      <span
                        className={
                          selectedInvoice?.isPaid === true
                            ? "text-green-600 font-medium"
                            : "text-orange-600 font-medium"
                        }
                      >
                        {selectedInvoice?.isPaid === true ? "Paid" : "Pending"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Total Amount:
                      </span>
                      <span className="text-gray-800">
                        ₹{selectedInvoice?.totalAmount}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Paid Amount:
                      </span>
                      <span className="text-green-600 font-medium">
                        ₹{selectedInvoice?.totalPaidAmount?.toFixed(2)}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Due Amount:
                      </span>
                      <span className="text-orange-600 font-medium">
                        ₹{selectedInvoice?.dueAmount?.toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">
                  {isEditMode ? "Payment History" : "Customer Details"}
                </h3>
                {isEditMode ? (
                  <div>
                    {selectedInvoice?.paymentDetails &&
                      selectedInvoice.paymentDetails.length > 0 ? (
                      <div className="space-y-4">
                        {selectedInvoice?.paymentDetails.map(
                          (payment, index) => (
                            <div
                              key={index}
                              className="p-3 border border-gray-200 rounded-md bg-gray-50"
                            >
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-600">
                                  Date:
                                </span>
                                <span className="text-sm text-gray-800">
                                  {formatDate(payment.paymentDate)}
                                </span>
                              </div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-600">
                                  Amount:
                                </span>
                                <span className="text-sm text-green-600 font-medium">
                                  ₹
                                  {parseFloat(payment.paymentAmount).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-600">
                                  Method:
                                </span>
                                <span className="text-sm text-gray-800">
                                  {payment.paymentMode}
                                </span>
                              </div>
                              {payment.transactionId && (
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-600">
                                    Transaction ID:
                                  </span>
                                  <span className="text-sm text-gray-800">
                                    {payment.transactionId}
                                  </span>
                                </div>
                              )}
                              {payment.chequeNumber && (
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-600">
                                    Cheque Number:
                                  </span>
                                  <span className="text-sm text-gray-800">
                                    {payment.chequeNumber}
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p>No payment history available</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Customer Name:
                      </span>
                      <span className="text-gray-800">
                        {selectedInvoice?.invoiceId?.receiverDetails?.name ||
                          "N/A"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="text-gray-800">
                        {selectedInvoice?.invoiceId?.receiverDetails?.phone ||
                          "N/A"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="text-gray-800">
                        {selectedInvoice?.invoiceId?.receiverDetails?.email ||
                          "N/A"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Address:
                      </span>
                      <span className="text-gray-800 text-right">
                        {selectedInvoice?.invoiceId?.receiverDetails?.address ||
                          "N/A"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        GST Number:
                      </span>
                      <span className="text-gray-800">
                        {selectedInvoice?.invoiceId?.receiverDetails
                          ?.gstNumber || "N/A"}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isEditMode && selectedInvoice && (
            <div className="mt-6">
              <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">
                Payment History
              </h3>
              {selectedInvoice?.paymentDetails &&
                selectedInvoice.paymentDetails.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Method
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Transaction ID
                        </th>
                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bank
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedInvoice.paymentDetails.map((payment, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.paymentDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                            ₹{parseFloat(payment.paymentAmount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.paymentMode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.transactionId ||
                              (payment.chequeNumber
                                ? `Cheque #${payment.chequeNumber}`
                                : "-")}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.bankName || "-"}
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                  <p>No payment history available</p>
                </div>
              )}
            </div>
          )}

          {!isEditMode && selectedInvoice && (
            <div className="mt-6">
              <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">
                Service Details
              </h3>
              {selectedInvoice?.invoiceId?.items &&
                selectedInvoice.invoiceId.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left text-gray-600">
                          Description
                        </th>
                        <th className="p-2 text-right text-gray-600">
                          No of Person
                        </th>
                        <th className="p-2 text-right text-gray-600">
                          Number of Duties
                        </th>
                        <th className="p-2 text-right text-gray-600">
                          Rate per month per Perso
                        </th>
                        <th className="p-2 text-right text-gray-600">
                          Month Days
                        </th>
                        {/* <th className="p-2 text-right text-gray-600">
                          Tax (%)
                        </th> */}
                        <th className="p-2 text-right text-gray-600">
                          Gross Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedInvoice.invoiceId.items.map((service, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {service.description || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {service.noOfPerson}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {parseFloat(service.noOfDuites)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            ₹{parseFloat(service.rate).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {parseFloat(service.month)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {parseFloat(service.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-3 text-right text-sm font-medium text-gray-900"
                        >
                          Subtotal:
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹
                          {parseFloat(
                            selectedInvoice?.invoiceId?.total?.grossAmount || 0
                          ).toFixed(2)}
                        </td>
                      </tr>
                      {selectedInvoice?.invoiceId?.total?.discount > 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-6 py-3 text-right text-sm font-medium text-gray-900"
                          >
                            Discount:
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-red-600">
                            -₹
                            {parseFloat(
                              selectedInvoice?.invoiceId?.total?.discount || 0
                            ).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {selectedInvoice?.invoiceId?.total?.tax > 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-6 py-3 text-right text-sm font-medium text-gray-900"
                          >
                            Tax (
                            {selectedInvoice?.invoiceId?.total?.taxPercentage ||
                              0}
                            %):
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹
                            {parseFloat(
                              selectedInvoice?.invoiceId?.total?.tax || 0
                            ).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-3 text-right text-sm font-bold text-gray-900"
                        >
                          Grand Total:
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹
                          {parseFloat(
                            selectedInvoice?.invoiceId?.total.totalPayableAmount || selectedInvoice?.invoiceId?.total?.grandTotal || 0
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  {/* Summary Section */}
                  <div className="flex justify-between">

                    <div className="w-full max-w-72  bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden mr-1">
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-green-600 to-green-500 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-lg">Debit Note Summary</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-green-100 text-sm font-medium">Total Amount</p>
                            <p className="text-white text-2xl font-bold">
                              ₹{selectedInvoice?.totalDebitNoteAmount?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                          {selectedInvoice?.debitNoteHistory?.map((item, index) => (
                            <div
                              key={index}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-green-300"
                            >
                              {/* Card Header */}
                              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                    Debit Note #{index + 1}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-green-600 font-bold text-lg">
                                  <IndianRupee className="w-5 h-5" />
                                  <span>{item.amount?.toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Card Details */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-start gap-2">
                                  <Hash className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Reference Number</p>
                                    <p className="text-sm text-gray-800 font-semibold">{item.referenceNumber}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Date</p>
                                    <p className="text-sm text-gray-800">{new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2 sm:col-span-2">
                                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Reason</p>
                                    <p className="text-sm text-gray-800">{item.reason}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Empty State */}
                        {(!selectedInvoice?.debitNoteHistory || selectedInvoice.debitNoteHistory.length === 0) && (
                          <div className="text-center py-12">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No debit notes available</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full max-w-72  bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden mr-2">
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-red-600 to-red-500 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-lg">Credit Note Summary</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-red-100 text-sm font-medium">Total Amount</p>
                            <p className="text-white text-2xl font-bold">
                              ₹{selectedInvoice?.creditApplied?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                          {selectedInvoice?.creditNoteAdjustments?.map((item, index) => (
                            <div
                              key={index}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-green-300"
                            >
                              {/* Card Header */}
                              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                                    Credit Note #{index + 1}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-red-600 font-bold text-lg">
                                  <IndianRupee className="w-5 h-5" />
                                  <span>{item.amount?.toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Card Details */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-start gap-2">
                                  <Hash className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Reference Number</p>
                                    <p className="text-sm text-gray-800 font-semibold">{item.noteNumber}</p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Date</p>
                                    <p className="text-sm text-gray-800">{new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                  </div>
                                </div>

                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Empty State */}
                        {(!selectedInvoice?.creditNoteAdjustments || selectedInvoice.creditNoteAdjustments.length === 0) && (
                          <div className="text-center py-12">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No credit notes available</p>
                          </div>
                        )}
                      </div>
                    </div>



                    <div className="w-64 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex justify-between mb-2 py-1 border-b border-gray-100">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>₹{selectedInvoice?.totalAmount?.toFixed(2)}</span>
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
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                  <p>No service details available</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      {showPdfPreview && (
        <Dialog
          open={showPdfPreview}
          onClose={() => setShowPdfPreview(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Invoice Preview
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                >
                  <IoMdDownload className="text-lg" />
                  Download
                </button>
                <IconButton
                  onClick={() => setShowPdfPreview(false)}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="mt-4" ref={pdfRef}>
              {/* PDF content will be rendered here */}
              {selectedInvoice && (
                <div className="p-6 bg-white">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        INVOICE
                      </h1>
                      <p className="text-gray-600">
                        #{selectedInvoice.invoiceNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-bold text-gray-900">
                        Company Name
                      </h2>
                      <p className="text-gray-600">123 Business Street</p>
                      <p className="text-gray-600">City, State, ZIP</p>
                      <p className="text-gray-600">Phone: (123) 456-7890</p>
                      <p className="text-gray-600">Email: info@company.com</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-gray-600 font-bold mb-2">Bill To:</h3>
                      <p className="font-medium">
                        {selectedInvoice?.invoiceId?.receiverDetails?.name}
                      </p>
                      <p>
                        {selectedInvoice?.invoiceId?.receiverDetails?.address}
                      </p>
                      <p>
                        Phone:{" "}
                        {selectedInvoice?.invoiceId?.receiverDetails?.phone}
                      </p>
                      <p>
                        Email:{" "}
                        {selectedInvoice?.invoiceId?.receiverDetails?.email}
                      </p>
                      {selectedInvoice?.invoiceId?.receiverDetails
                        ?.gstNumber && (
                          <p>
                            GST:{" "}
                            {
                              selectedInvoice?.invoiceId?.receiverDetails
                                ?.gstNumber
                            }
                          </p>
                        )}
                    </div>
                    <div>
                      <h3 className="text-gray-600 font-bold mb-2">
                        Invoice Details:
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-gray-600">Invoice Number:</p>
                        <p className="font-medium">
                          {selectedInvoice.invoiceNumber}
                        </p>
                        <p className="text-gray-600">Date:</p>
                        <p className="font-medium">
                          {formatDate(selectedInvoice?.invoiceId?.date)}
                        </p>
                        <p className="text-gray-600">Payment Status:</p>
                        <p
                          className={
                            selectedInvoice?.isPaid
                              ? "font-medium text-green-600"
                              : "font-medium text-orange-600"
                          }
                        >
                          {selectedInvoice?.isPaid ? "Paid" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <table className="min-w-full border border-gray-200 mb-8">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 border-b border-gray-200 text-left">
                          Service
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">
                          Description
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-right">
                          Qty
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-right">
                          Rate
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice?.invoiceId?.serviceDetails?.map(
                        (service, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="py-2 px-4 border-b border-gray-200">
                              {service.serviceName}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {service.description || "-"}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-right">
                              {service.quantity}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-right">
                              ₹{parseFloat(service.rate).toFixed(2)}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-right">
                              ₹{parseFloat(service.amount).toFixed(2)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  <div className="flex justify-end mb-8">
                    <div className="w-64">
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Subtotal:</span>
                        <span>
                          ₹
                          {parseFloat(
                            selectedInvoice?.invoiceId?.total?.subTotal || 0
                          ).toFixed(2)}
                        </span>
                      </div>
                      {selectedInvoice?.invoiceId?.total?.discount > 0 && (
                        <div className="flex justify-between py-2">
                          <span className="font-medium">Discount:</span>
                          <span className="text-red-600">
                            -₹
                            {parseFloat(
                              selectedInvoice?.invoiceId?.total?.discount || 0
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {selectedInvoice?.invoiceId?.total?.tax > 0 && (
                        <div className="flex justify-between py-2">
                          <span className="font-medium">
                            Tax (
                            {selectedInvoice?.invoiceId?.total?.taxPercentage ||
                              0}
                            %):
                          </span>
                          <span>
                            ₹
                            {parseFloat(
                              selectedInvoice?.invoiceId?.total?.tax || 0
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
                        <span>Total:</span>
                        <span>
                          ₹
                          {parseFloat(
                            selectedInvoice?.invoiceId?.total?.totalPayableAmount || selectedInvoice?.invoiceId?.total?.grandTotal || 0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="font-medium">Paid Amount:</span>
                        <span className="text-green-600">
                          ₹
                          {parseFloat(
                            selectedInvoice?.totalPaidAmount || 0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 font-bold">
                        <span>Balance Due:</span>
                        <span className="text-orange-600">
                          ₹
                          {parseFloat(selectedInvoice?.dueAmount || 0).toFixed(
                            2
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-bold mb-2">Payment Information:</h3>
                    <div className="mb-4">
                      <p className="text-gray-600">
                        Payment Terms: Due on receipt
                      </p>
                      <p className="text-gray-600">
                        Account Name: Company Name
                      </p>
                      <p className="text-gray-600">
                        Account Number: 1234567890
                      </p>
                      <p className="text-gray-600">Bank: Sample Bank</p>
                      <p className="text-gray-600">IFSC: BANK0123456</p>
                    </div>
                    <p className="text-center text-gray-500 mt-8">
                      Thank you for your business!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Voucher Selection Dialog */}
      <Dialog open={openVoucherDialog} onClose={handleCloseVoucherDialog} maxWidth="md" fullWidth>
        <DialogTitle className="flex justify-between items-center bg-indigo-50">
          <span className="text-xl font-semibold flex items-center">
            <VoucherIcon className="mr-2 text-indigo-600" />
            Select Credit/Debit Note for Payment
          </span>
          <IconButton onClick={handleCloseVoucherDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loadingVouchers ? (
            <div className="flex justify-center items-center py-10">
              <CircularProgress />
              <span className="ml-3">Loading credit/debit notes...</span>
            </div>
          ) : voucherNotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left">Note Number</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-200 px-4 py-2 text-right">Amount</th>
                    <th className="border border-gray-200 px-4 py-2 text-right">Available</th>
                    <th className="border border-gray-200 px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {voucherNotes.map((note) => (
                    <tr key={note._id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">{note.referenceNumber}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${note && note?.noteType === 'credit'
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}>
                          {note?.noteType === 'credit' ? 'Credit Note' : 'Debit Note'}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {formatDate(note.date)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-right">
                        ₹{parseFloat(note.totalFinalAmount || note.amount || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-right font-medium">
                        ₹{parseFloat(note.availableAmount || 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        <button
                          onClick={() => handleVoucherSelection(note)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No approved credit/debit notes available for this customer</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleCloseVoucherDialog}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>

      {/* Add the MNS Payment Slip component here */}
      {receiptData && (
        <MNSPaymentSlip
          paymentData={receiptData}
          shouldDownload={shouldDownloadReceipt}
          onDownloadComplete={handleReceiptDownloadComplete}
        />
      )}
    </div>
  );
};


export default ServiceLedgerPayment;
