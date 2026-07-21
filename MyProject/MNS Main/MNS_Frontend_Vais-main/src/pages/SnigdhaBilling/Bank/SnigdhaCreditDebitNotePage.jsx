import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";
import { backendDomainA, backendDomainS } from "../../../Common/index";
import { Eye } from "lucide-react";

import SnigdhaCreditDebitNotePdf from "./SnigdhaCreditDebitNotePdf"

const SnigdhaCreditDebitNotePage = () => {
  // State variables
  const [notes, setNotes] = useState([]);
  const [paginatedNotes, setPaginatedNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    noteType: "",
    status: "",
    minAmount: "",
    maxAmount: "",
    title: "",
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    noteType: "credit",
    invoiceNumber: "",
    amount: "",
    reason: "",
    description: "",
  });
  const [entityType, setEntityType] = useState("");
  const [invoiceType, setInvoiceType] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [productInvoices, setProductInvoices] = useState([]);
  const [serviceInvoices, setServiceInvoices] = useState([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [alertInfo, setAlertInfo] = useState(null);

  const [customerCredit, setCustomerCredit] = useState(null);
  const [customerCreditHistory, setCustomerCreditHistory] = useState([]);

  // for new requirenment or all items in invoice
  const [selectedInvoiceItems, setSelectedInvoiceItems] = useState([]);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [editableItems, setEditableItems] = useState([]);
  const [itemTotals, setItemTotals] = useState({
    totalAmount: 0,
    totalQuantity: 0,
    totalGrossAmount: 0,
    totalTaxAmount: 0,
  });

  // View Details Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNoteForView, setSelectedNoteForView] = useState(null);


  // Fetch all notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${backendDomainS}/api/v1/credit-debit-notes/all`
      );
      // console.log("notes response : ", response);
      if (response.data && response.data.success) {
        setNotes(response?.data?.data || []);
        // setTotalItems(response?.data?.notes?.length);
        setTotalItems(response?.data?.count);
        updatePagination(response?.data?.data, currentPage, itemsPerPage);
      } else {
        throw new Error(response.data?.message || "Failed to fetch notes");
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err.message || "An error occurred while fetching notes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch product invoices
  const fetchProductInvoices = async () => {
    try {
      const response = await axios.get(
        `${backendDomainA}/api/v2/invoice/invoices`
      );
      // console.log("product response : ", response);
      if (response.data && response.data.success) {
        setProductInvoices(response.data.data || []);
        // Extract unique customers
        const uniqueCustomers = [];
        const customerMap = new Map();
        response.data.data.forEach((invoice) => {
          if (
            invoice.receiverDetails &&
            invoice.receiverDetails.name &&
            !customerMap.has(invoice.receiverDetails.name)
          ) {
            customerMap.set(invoice.receiverDetails.name, true);
            uniqueCustomers.push({
              name: invoice.receiverDetails.name,
              phoneNumber: invoice.receiverDetails.phoneNumber || "",
            });
          }
        });
        setCustomers((prev) => [...prev, ...uniqueCustomers]);
      }
    } catch (err) {
      console.error("Error fetching product invoices:", err);
    }
  };

  // Fetch service invoices
  const fetchServiceInvoices = async () => {
    try {
      const response = await axios.get(
        `${backendDomainS}/api/v1/service-invoice/`
      );
      if (response.data && response.data.success) {
        setServiceInvoices(response.data.data || []);
        // Extract unique customers
        const uniqueCustomers = [];
        const customerMap = new Map();
        response.data.data.forEach((invoice) => {
          if (
            invoice.receiverDetails &&
            invoice.receiverDetails.name &&
            !customerMap.has(invoice.receiverDetails.name)
          ) {
            customerMap.set(invoice.receiverDetails.name, true);
            uniqueCustomers.push({
              name: invoice.receiverDetails.name,
              phoneNumber: invoice.receiverDetails.phoneNumber || "",
            });
          }
        });
        setCustomers((prev) => [...prev, ...uniqueCustomers]);
      }
    } catch (err) {
      console.error("Error fetching service invoices:", err);
    }
  };

  // Fetch purchase invoices
  const fetchPurchaseInvoices = async () => {
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/po/all`);
      if (response.data && response.data.purchaseOrders) {
        setPurchaseInvoices(response.data.purchaseOrders || []);
        // Extract unique vendors
        const uniqueVendors = [];
        const vendorMap = new Map();
        response.data.purchaseOrders.forEach((invoice) => {
          if (
            invoice.receiverDetails &&
            invoice.receiverDetails.name &&
            !vendorMap.has(invoice.receiverDetails.name)
          ) {
            vendorMap.set(invoice.receiverDetails.name, true);
            uniqueVendors.push({
              name: invoice.receiverDetails.name,
              phoneNumber: invoice.receiverDetails.phoneNumber || "",
            });
          }
        });
        setVendors(uniqueVendors);
      }
    } catch (err) {
      console.error("Error fetching purchase invoices:", err);
    }
  };

  // Update pagination
  const updatePagination = (data, page, perPage) => {
    const filteredData = applyFiltersAndSearch(data);
    const totalFilteredItems = filteredData?.length;
    const totalFilteredPages = Math.ceil(totalFilteredItems / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = filteredData?.slice(startIndex, endIndex);

    setPaginatedNotes(paginatedData);
    setTotalItems(totalFilteredItems);
    setTotalPages(totalFilteredPages);
  };

  // Apply filters and search
  const applyFiltersAndSearch = (data) => {
    return data?.filter((note) => {
      // Apply search term
      if (
        searchTerm &&
        !(
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.referenceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          note.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (note.invoiceDetails?.receiverDetails?.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }

      // Apply filters
      if (
        filters.startDate &&
        new Date(note.date) < new Date(filters.startDate)
      ) {
        return false;
      }
      if (filters.endDate && new Date(note.date) > new Date(filters.endDate)) {
        return false;
      }
      if (filters.type && note.type !== filters.type) {
        return false;
      }
      if (filters.noteType && note.noteType !== filters.noteType) {
        return false;
      }
      if (filters.status && note.status !== filters.status) {
        return false;
      }
      if (filters.minAmount && note.amount < parseFloat(filters.minAmount)) {
        return false;
      }
      if (filters.maxAmount && note.amount > parseFloat(filters.maxAmount)) {
        return false;
      }
      if (
        filters.title &&
        !note.title.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      noteType: "credit",
      invoiceNumber: "",
      amount: "",
      reason: "",
      description: "",
    });
  };

  // Handle entity type change
  const handleEntityTypeChange = (e) => {
    const type = e.target.value;
    setEntityType(type);
    setInvoiceType(""); // Reset invoice type
    setSelectedEntity(""); // Reset selected entity
    setInvoices([]); // Reset invoices
  };

  // Handle invoice type change
  const handleInvoiceTypeChange = (e) => {
    const type = e.target.value;
    setInvoiceType(type);
    setSelectedEntity(""); // Reset selected entity
    setInvoices([]); // Reset invoices
  };

  // Handle entity change
  const handleEntityChange = (e) => {
    const entity = e.target.value;
    setSelectedEntity(entity);

    // Filter invoices based on selected entity
    if (entityType === "customer") {
      if (invoiceType === "product") {
        const filtered = productInvoices?.filter(
          (invoice) => invoice.receiverDetails?.name === entity
        );
        setInvoices(filtered);
      } else if (invoiceType === "service") {
        const filtered = serviceInvoices?.filter(
          (invoice) => invoice.receiverDetails?.name === entity
        );
        setInvoices(filtered);
      }
    } else if (entityType === "vendor") {
      const filtered = purchaseInvoices?.filter(
        (invoice) => invoice.receiverDetails?.name === entity
      );
      setInvoices(filtered);
    }
  };

  // Handle invoice change
  const handleInvoiceChange = (e) => {
    const invoiceNumber = e.target.value;
    setFormData((prev) => ({
      ...prev,
      invoiceNumber,
    }));

    // Find the selected invoice
    const selectedInvoice = invoices.find(
      (invoice) => invoice.invoiceNumber === invoiceNumber
    );

    if (selectedInvoice) {
      // Set the invoice details in form data
      setFormData((prev) => ({
        ...prev,
        invoiceDetails: selectedInvoice,
      }));

      // Set the invoice items for editing // after new requirenment on 19.09.2025
      if (selectedInvoice.items && selectedInvoice.items.length > 0) {
        setSelectedInvoiceItems(selectedInvoice.items);
        setEditableItems(
          selectedInvoice.items.map((item) => ({
            ...item,
            originalQuantity: item.quantity,
            originalSellingPrice: item.sellingPrice,
            originalAmount: item.amount || (item.quantity * item.sellingPrice), // Before Amount
            newQuantity: item.quantity,
            newSellingPrice: item.sellingPrice,
            isEdited: false,
            editedAmount: item.quantity * item.sellingPrice,
            // Add tax-related fields
            cgst: item.cgst || 0,
            sgst: item.sgst || 0,
            igst: item.igst || 0,
            taxRate: item.taxRate || 0,
            taxAmount: item.taxAmount || 0,
            calculatedTaxRate: 0,
            calculatedTaxAmount: 0,
            calculatedGrossAmount: item.quantity * item.sellingPrice,
            calculatedTotalAmount: item.quantity * item.sellingPrice,
            // Amount tracking fields
            beforeAmount: item.amount || (item.quantity * item.sellingPrice), // Original total amount
            afterAmount: item.amount || (item.quantity * item.sellingPrice), // Will be updated on edit
            finalAmount: 0, // Difference (after - before)
          }))
        );
      } else {
        setSelectedInvoiceItems([]);
        setEditableItems([]);
      }
    }
  };

  // Handle item editing // after new requirenment
  const handleItemEdit = (index, field, value) => {
    const updatedItems = [...editableItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
      isEdited: true,
    };

    // Calculate edited amount
    const quantity =
      field === "newQuantity"
        ? parseFloat(value) || 0
        : updatedItems[index].newQuantity;
    const sellingPrice =
      field === "newSellingPrice"
        ? parseFloat(value) || 0
        : updatedItems[index].newSellingPrice;
    updatedItems[index].editedAmount = quantity * sellingPrice;

    // Calculate afterAmount (new total with tax) and finalAmount (difference)
    const grossAmount = quantity * sellingPrice;
    let taxRate = 0;
    let taxAmount = 0;

    // Calculate tax
    if (updatedItems[index].cgst > 0 && updatedItems[index].sgst > 0) {
      taxRate = parseFloat(updatedItems[index].cgst) + parseFloat(updatedItems[index].sgst);
      taxAmount = (grossAmount * taxRate) / 100;
    } else if (updatedItems[index].igst > 0) {
      taxRate = parseFloat(updatedItems[index].igst);
      taxAmount = (grossAmount * taxRate) / 100;
    } else if (updatedItems[index].taxRate > 0) {
      taxRate = parseFloat(updatedItems[index].taxRate);
      taxAmount = (grossAmount * taxRate) / 100;
    }

    const afterAmount = grossAmount + taxAmount;
    const beforeAmount = updatedItems[index].beforeAmount || 0;
    const finalAmount = afterAmount - beforeAmount;

    updatedItems[index].afterAmount = afterAmount;
    updatedItems[index].finalAmount = finalAmount;

    setEditableItems(updatedItems);
    calculateItemTotals(updatedItems);
  };

  // Calculate totals for edited items // after new requirenment
  const calculateItemTotals = (items) => {
    const editedItems = items.filter((item) => item.isEdited);
    const totalGrossAmount = editedItems.reduce(
      (sum, item) => sum + item.newQuantity * item.newSellingPrice,
      0
    );

    // Calculate tax for each item
    let totalTaxAmount = 0;
    const itemsWithTax = editedItems.map((item) => {
      const grossAmount = item.newQuantity * item.newSellingPrice;
      let taxRate = 0;
      let taxAmount = 0;

      // Check if item has tax rates
      if (item.cgst > 0 && item.sgst > 0) {
        taxRate = parseFloat(item.cgst) + parseFloat(item.sgst);
        taxAmount = (grossAmount * taxRate) / 100;
      } else if (item.igst > 0) {
        taxRate = parseFloat(item.igst);
        taxAmount = (grossAmount * taxRate) / 100;
      } else if (item.taxRate > 0) {
        taxRate = parseFloat(item.taxRate);
        taxAmount = (grossAmount * taxRate) / 100;
      }

      totalTaxAmount += taxAmount;

      return {
        ...item,
        calculatedTaxRate: taxRate,
        calculatedTaxAmount: taxAmount,
        calculatedGrossAmount: grossAmount,
        calculatedTotalAmount: grossAmount + taxAmount,
      };
    });

    const totalAmount = totalGrossAmount + totalTaxAmount;
    const totalQuantity = editedItems.reduce(
      (sum, item) => sum + item.newQuantity,
      0
    );

    setItemTotals({
      totalAmount,
      totalQuantity,
      totalGrossAmount,
      totalTaxAmount,
    });

    // Update editable items with calculated values
    const updatedEditableItems = [...editableItems];
    itemsWithTax.forEach((itemWithTax, index) => {
      const originalIndex = editedItems.findIndex(
        (item) =>
          item.itemName === itemWithTax.itemName && item.id === itemWithTax.id
      );
      if (originalIndex !== -1) {
        const actualIndex = updatedEditableItems.findIndex(
          (item) =>
            item.itemName === itemWithTax.itemName && item.id === itemWithTax.id
        );
        if (actualIndex !== -1) {
          updatedEditableItems[actualIndex] = {
            ...updatedEditableItems[actualIndex],
            ...itemWithTax,
          };
        }
      }
    });
    setEditableItems(updatedEditableItems);

    // Update the form amount with calculated total
    setFormData((prev) => ({
      ...prev,
      amount: totalAmount.toString(),
    }));
  };

  // Toggle item selection // after new requirenment
  const toggleItemSelection = (index) => {
    const updatedItems = [...editableItems];
    updatedItems[index].isEdited = !updatedItems[index].isEdited;

    if (!updatedItems[index].isEdited) {
      // Reset to original values if deselected
      updatedItems[index].newQuantity = updatedItems[index].originalQuantity;
      updatedItems[index].newSellingPrice =
        updatedItems[index].originalSellingPrice;
      updatedItems[index].editedAmount =
        updatedItems[index].originalQuantity *
        updatedItems[index].originalSellingPrice;
    }

    setEditableItems(updatedItems);
    calculateItemTotals(updatedItems);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      type: "",
      noteType: "",
      status: "",
      minAmount: "",
      maxAmount: "",
      title: "",
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updatePagination(notes, page, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const perPage = parseInt(e.target.value);
    setItemsPerPage(perPage);
    setCurrentPage(1); // Reset to first page
    updatePagination(notes, 1, perPage);
  };

  // Handle add submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Get only edited items for the products array // new requirenment
      const editedItems = editableItems.filter((item) => item.isEdited);

      const noteData = {
        ...formData,
        type: entityType === "customer" ? invoiceType : "purchase",
        status: "pending",
        referenceNumber: `NOTE-${Math.floor(
          Math.random() * 10000
        )}-${Math.floor(Math.random() * 10000)}`,
        products: editedItems.map((item) => ({
          // new requirenment
          itemId: item.item_id || item.id || item._id,
          itemName: item.itemName,
          originalQuantity: item.originalQuantity,
          originalSellingPrice: item.originalSellingPrice || item.sellingPrice || item.newSellingPrice || 0,
          newQuantity: item.newQuantity,
          newSellingPrice: item.newSellingPrice || item.sellingPrice || 0,
          editedAmount: item.calculatedTotalAmount || item.editedAmount,
          hsnCode: item.hsnCode,
          uom: item.uom,
          description: item.description,
          // Add tax fields
          cgst: item.cgst || 0,
          sgst: item.sgst || 0,
          igst: item.igst || 0,
          taxRate: item.calculatedTaxRate || item.taxRate || 0,
          taxAmount: item.calculatedTaxAmount || item.taxAmount || 0,
          grossAmount:
            item.calculatedGrossAmount ||
            item.newQuantity * item.newSellingPrice,
          totalAmount: item.calculatedTotalAmount || item.editedAmount,

          beforeAmount: Number(item.beforeAmount.toFixed(2)) || 0,
          afterAmount: Number(item.afterAmount.toFixed(2)) || 0,
          finalAmount: Number(item.finalAmount.toFixed(2)) || 0,

        })),
        // Add total amounts
        totalGrossAmount: itemTotals.totalGrossAmount || 0,
        totalTaxAmount: itemTotals.totalTaxAmount || 0,
        totalBefore: editedItems.reduce((sum, item) => sum + item.beforeAmount, 0) ,
        totalAfter: editedItems.reduce((sum, item) => sum + item.afterAmount, 0) ,
        totalFinalAmount: editedItems.reduce((sum, item) => sum + item.finalAmount, 0) ,
      };

      // console.log("ntoe data : ", noteData);
      // return;

      const response = await axios.post(
        `${backendDomainS}/api/v1/credit-debit-notes/create`,
        noteData
      );

      if (response.data && response.data.success) {
        toast.success("Note added successfully");
        setAddModalOpen(false);
        resetForm();
        setEntityType("");
        setInvoiceType("");
        setSelectedEntity("");
        setInvoices([]);
        setSelectedInvoiceItems([]); // new requirenment
        setEditableItems([]); // new requirenment
        setShowItemsModal(false); // new requirenment
        setItemTotals({ totalAmount: 0, totalQuantity: 0, totalGrossAmount: 0, totalTaxAmount: 0 }); // new requirenment
        fetchNotes();
      } else {
        throw new Error(response.data?.message || "Failed to add note");
      }
    } catch (err) {
      console.error("Error adding note:", err);
      toast.error(err?.response?.data.message || "An error occurred while adding note");
    } finally {
      setLoading(false);
    }
  };

  // Handle approve
  const handleApprove = async (id) => {
    const isConfirmed = window.confirm(
    "Are you sure you want to approve this note? , after you con't rollback."
  );

  if (!isConfirmed) return;
    try {
      setLoading(true);
      const response = await axios.put(
        `${backendDomainS}/api/v1/credit-debit-notes/approve/${id}`
      );

      if (response.data && response.data.success) {
        toast.success("Note approved successfully");
        fetchNotes();
      } else {
        throw new Error(response.data?.message || "Failed to approve note");
      }
    } catch (err) {
      console.error("Error approving note:", err);
      toast.error(err.message || "An error occurred while approving note");
    } finally {
      setLoading(false);
    }
  };

  // Handle reject
  const handleReject = async (id) => {
    const isConfirmed = window.confirm(
    "Are you sure you want to reject this note? , after you con't rollback."
  );

  if (!isConfirmed) return;
    try {
      setLoading(true);
      const response = await axios.put(
        `${backendDomainS}/api/v1/credit-debit-notes/reject/${id}`
      );

      if (response.data && response.data.success) {
        toast.success("Note rejected successfully");
        fetchNotes();
      } else {
        throw new Error(response.data?.message || "Failed to reject note");
      }
    } catch (err) {
      console.error("Error rejecting note:", err);
      toast.error(err.message || "An error occurred while rejecting note");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `${backendDomainS}/api/v1/credit-debit-notes/delete/${id}`
      );

      if (response.data && response.data.success) {
        toast.success("Note deleted successfully");
        fetchNotes();
      } else {
        throw new Error(response.data?.message || "Failed to delete note");
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error(err?.response?.data.message || "An error occurred while deleting note");
    } finally {
      setLoading(false);
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Date",
      "Customer/Vendor",
      "Invoice #",
      "Type",
      "Note Type",
      "Status",
      "Amount",
    ];
    const tableRows = [];

    paginatedNotes.forEach((note) => {
      const noteData = [
        formatDate(note.date),
        note.invoiceDetails?.receiverDetails?.name || "",
        note.invoiceNumber,
        note.type.charAt(0).toUpperCase() + note.type?.slice(1),
        note.noteType.charAt(0).toUpperCase() + note.noteType?.slice(1),
        note.status.charAt(0).toUpperCase() + note.status?.slice(1),
        `${note.amount.toLocaleString()}`,
      ];
      tableRows.push(noteData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.text("Credit/Debit Notes Report", 14, 15);
    doc.save(`credit-debit-notes-report-${new Date().getTime()}.pdf`);
  };

  // Export note to PDF
  const exportNoteToPDF = (note) => {
    // Create a new jsPDF instance
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    // Helper function to add gradient-like effect
    const addGradientHeader = () => {
      // Main header background with gradient effect
      pdf.setFillColor(26, 35, 126); // Deep blue
      pdf.rect(0, 0, pageWidth, 35, "F");

      // Add a lighter overlay for gradient effect
      pdf.setFillColor(63, 81, 181); // Lighter blue
      pdf.rect(0, 0, pageWidth, 25, "F");

      // Add subtle pattern overlay
      pdf.setFillColor(92, 107, 192); // Even lighter blue
      pdf.rect(0, 0, pageWidth, 15, "F");
    };

    // Helper function to create modern card-style boxes
    const createModernCard = (x, y, width, height, title, content) => {
      // Card shadow effect
      pdf.setFillColor(220, 220, 220);
      pdf.roundedRect(x + 1, y + 1, width, height, 3, 3, "F");

      // Main card background
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(x, y, width, height, 3, 3, "F");

      // Card border
      pdf.setDrawColor(230, 230, 230);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(x, y, width, height, 3, 3, "S");

      // Title bar with icon area
      pdf.setFillColor(248, 249, 250);
      pdf.roundedRect(x, y, width, 12, 3, 3, "F");
      pdf.rect(x, y + 6, width, 6, "F");

      // Add colored accent bar
      pdf.setFillColor(63, 81, 181);
      pdf.rect(x, y, 4, 12, "F");

      // Title text
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(52, 58, 64);
      pdf.text(title, x + 8, y + 8);

      return y + 15; // Return content start position
    };

    // Helper function to add decorative elements
    const addDecorations = () => {
      // Add corner decorations
      pdf.setFillColor(255, 193, 7); // Golden yellow
      pdf.circle(15, 15, 3, "F");
      pdf.circle(pageWidth - 15, 15, 3, "F");

      // Add side accent lines
      pdf.setDrawColor(255, 193, 7);
      pdf.setLineWidth(2);
      pdf.line(5, 40, 5, pageHeight - 40);
      pdf.line(pageWidth - 5, 40, pageWidth - 5, pageHeight - 40);
    };

    // Create beautiful header
    addGradientHeader();
    addDecorations();

    // Company name with modern styling
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(255, 255, 255);
    pdf.text("Snigdha Enterprise", margin + 25, 18);

    // Note type badge
    const noteTypeTitle = note.noteType.toUpperCase() + " NOTE";
    const badgeWidth = 50;
    const badgeX = pageWidth - margin - badgeWidth;

    pdf.setFillColor(255, 193, 7);
    pdf.roundedRect(badgeX, 8, badgeWidth, 18, 9, 9, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(52, 58, 64);
    pdf.text(noteTypeTitle, badgeX + 25, 18, { align: "center" });

    let currentY = 45;

    // Company Information Card
    const companyCardY = createModernCard(
      margin,
      currentY,
      pageWidth - margin * 2,
      35,
      "Company Information",
      null
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(73, 80, 87);

    pdf.text("Snigdha Enterprise PVT LTD", margin + 5, companyCardY + 3);
    pdf.text(
      "Address: AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064",
      margin + 5,
      companyCardY + 10
    );
    pdf.text(
      "Phone: +91 9073656557 |  Email: snigdhaenterprise2015@gmail.com  |  GSTIN: 19BTFPR0457K2Z7",
      margin + 5,
      companyCardY + 17
    );

    currentY += 45;

    // Note Details Card
    const noteCardY = createModernCard(
      margin,
      currentY,
      pageWidth - margin * 2,
      55,
      "Note Details",
      null
    );

    // Create two-column layout for note details
    const leftColX = margin + 5;
    const rightColX = pageWidth / 2 + 5;
    const detailSpacing = 7;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(108, 117, 125);

    // Left column labels
    let detailY = noteCardY + 3;
    pdf.text("Reference Number:", leftColX, detailY);
    pdf.text("Date:", leftColX, detailY + detailSpacing);
    pdf.text("Title:", leftColX, detailY + detailSpacing * 2);
    pdf.text("Invoice Number:", leftColX, detailY + detailSpacing * 3);
    pdf.text("Name:", leftColX, detailY + detailSpacing * 4);

    // Right column labels
    pdf.text("Type:", rightColX, detailY);
    pdf.text("Note Type:", rightColX, detailY + detailSpacing);
    pdf.text("Status:", rightColX, detailY + detailSpacing * 2);
    pdf.text("Amount:", rightColX, detailY + detailSpacing * 3);
    pdf.text("Invoice Value:", rightColX, detailY + detailSpacing * 4);

    // Values
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(52, 58, 64);

    // Left column values
    pdf.text(note.referenceNumber || "N/A", leftColX + 35, detailY);
    pdf.text(
      formatDate(note.date) || "N/A",
      leftColX + 35,
      detailY + detailSpacing
    );
    pdf.text(note.title || "N/A", leftColX + 35, detailY + detailSpacing * 2);
    pdf.text(
      note.invoiceNumber || "N/A",
      leftColX + 35,
      detailY + detailSpacing * 3
    );
    pdf.text(
      note.invoiceDetails?.receiverDetails?.name || "N/A",
      leftColX + 35,
      detailY + detailSpacing * 4
    );

    // Right column values with color coding
    pdf.text(
      note.type.charAt(0).toUpperCase() + note.type.slice(1) || "N/A",
      rightColX + 25,
      detailY
    );
    pdf.text(
      note.noteType.charAt(0).toUpperCase() + note.noteType.slice(1) || "N/A",
      rightColX + 25,
      detailY + detailSpacing
    );

    // Status with color
    const status =
      note.status.charAt(0).toUpperCase() + note.status.slice(1) || "N/A";
    if (status.toLowerCase() === "approved") {
      pdf.setTextColor(40, 167, 69);
    } else if (status.toLowerCase() === "pending") {
      pdf.setTextColor(255, 193, 7);
    } else if (status.toLowerCase() === "rejected") {
      pdf.setTextColor(220, 53, 69);
    }
    pdf.text(status, rightColX + 25, detailY + detailSpacing * 2);

    // Amount with emphasis
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(40, 167, 69);
    pdf.text(
      `${note.amount.toLocaleString() || "0"}`,
      rightColX + 25,
      detailY + detailSpacing * 3
    );
    pdf.text(
      `${note.invoiceDetails?.totalPayableAmount?.toLocaleString() ||
      note.invoiceDetails?.grandTotal?.toLocaleString() ||
      note.invoiceDetails?.total?.totalPayableAmount?.toLocaleString() ||
      note.invoiceDetails?.total?.grandTotal?.toLocaleString() ||
      "0"
      }`,
      rightColX + 25,
      detailY + detailSpacing * 4
    );

    currentY += 65;

    // Description Card
    const descCardY = createModernCard(
      margin,
      currentY,
      pageWidth - margin * 2,
      60,
      "Description & Reason",
      null
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(73, 80, 87);

    // Description
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(108, 117, 125);
    pdf.text("Description:", margin + 5, descCardY + 5);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(52, 58, 64);
    const descriptionText = note.description || "No description provided";
    const descriptionLines = pdf.splitTextToSize(
      descriptionText,
      pageWidth - margin * 2 - 20
    );
    pdf.text(descriptionLines, margin + 5, descCardY + 12);

    // Reason
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(108, 117, 125);
    pdf.text("Reason:", margin + 5, descCardY + 30);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(52, 58, 64);
    const reasonText = note.reason || "No reason provided";
    const reasonLines = pdf.splitTextToSize(
      reasonText,
      pageWidth - margin * 2 - 20
    );
    pdf.text(reasonLines, margin + 5, descCardY + 37);

    currentY += 70;

    // Signature Section with modern styling
    const sigY = currentY + 10;

    // Signature boxes
    const sigBoxWidth = 70;
    const sigBoxHeight = 25;

    // Left signature box
    pdf.setFillColor(248, 249, 250);
    pdf.roundedRect(margin, sigY, sigBoxWidth, sigBoxHeight, 3, 3, "F");
    pdf.setDrawColor(206, 212, 218);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(margin, sigY, sigBoxWidth, sigBoxHeight, 3, 3, "S");

    // Right signature box
    pdf.roundedRect(
      pageWidth - margin - sigBoxWidth,
      sigY,
      sigBoxWidth,
      sigBoxHeight,
      3,
      3,
      "F"
    );
    pdf.roundedRect(
      pageWidth - margin - sigBoxWidth,
      sigY,
      sigBoxWidth,
      sigBoxHeight,
      3,
      3,
      "S"
    );

    // Signature lines and labels
    pdf.setDrawColor(108, 117, 125);
    pdf.setLineWidth(1);
    pdf.line(margin + 5, sigY + 15, margin + sigBoxWidth - 5, sigY + 15);
    pdf.line(
      pageWidth - margin - sigBoxWidth + 5,
      sigY + 15,
      pageWidth - margin - 5,
      sigY + 15
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(108, 117, 125);
    pdf.text("Authorized Signatory", margin + sigBoxWidth / 2, sigY + 22, {
      align: "center",
    });
    pdf.text(
      "Customer/Vendor",
      pageWidth - margin - sigBoxWidth / 2,
      sigY + 22,
      { align: "center" }
    );

    // Footer with modern styling
    const footerY = pageHeight - 25;

    // Footer background
    pdf.setFillColor(248, 249, 250);
    pdf.rect(0, footerY - 5, pageWidth, 30, "F");

    // Footer border
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.5);
    pdf.line(0, footerY - 5, pageWidth, footerY - 5);

    // Footer text
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(8);
    pdf.setTextColor(108, 117, 125);
    pdf.text(
      "This is a computer-generated document and does not require a physical signature.",
      pageWidth / 2,
      footerY + 2,
      { align: "center" }
    );
    pdf.text(
      `Generated on: ${new Date().toLocaleString()} | Powered by Snigdha Enterprise PVT LTD`,
      pageWidth / 2,
      footerY + 8,
      { align: "center" }
    );

    // Save the PDF with a more descriptive filename
    const timestamp = new Date().toISOString().slice(0, 10);
    pdf.save(
      `${note.noteType.toUpperCase()}-Note-${note.referenceNumber
      }-${timestamp}.pdf`
    );
  };

  // Export note to Excel
  const exportNoteToExcel = async (note) => {
    try {
      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Snigdha Enterprise";
      workbook.lastModifiedBy = "Snigdha System";
      workbook.created = new Date();
      workbook.modified = new Date();

      // Add a worksheet
      const worksheet = workbook.addWorksheet(
        `${note.noteType.toUpperCase()} NOTE`
      );

      // Add company header
      worksheet.mergeCells("A1:H1");
      const companyHeader = worksheet.getCell("A1");
      companyHeader.value = "Snigdha Enterprice PVT LTD";
      companyHeader.font = {
        name: "Arial",
        size: 16,
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
      companyHeader.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2C3E50" },
      };
      companyHeader.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      worksheet.getRow(1).height = 30;

      // Add note type header
      worksheet.mergeCells("A2:H2");
      const noteTypeHeader = worksheet.getCell("A2");
      noteTypeHeader.value = `${note.noteType.toUpperCase()} NOTE - ${note.referenceNumber
        }`;
      noteTypeHeader.font = {
        name: "Arial",
        size: 14,
        bold: true,
      };
      noteTypeHeader.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      worksheet.getRow(2).height = 25;

      // Add company information
      worksheet.mergeCells("A4:H4");
      const companyInfoHeader = worksheet.getCell("A4");
      companyInfoHeader.value = "COMPANY INFORMATION";
      companyInfoHeader.font = {
        name: "Arial",
        size: 12,
        bold: true,
      };
      companyInfoHeader.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      worksheet.mergeCells("A5:H5");
      worksheet.getCell("A5").value = "Snigdha Enterprise  PVT LTD";
      worksheet.getCell("A5").font = { bold: true };

      worksheet.mergeCells("A6:H6");
      worksheet.getCell("A6").value =
        "Address: AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064";

      worksheet.mergeCells("A7:H7");
      (worksheet.getCell("A7").value =
        "Phone: +91 9073656557 |  Email: snigdhaenterprise2015@gmail.com  |  GSTIN: 19BTFPR0457K2Z7"),
        // Add note information
        worksheet.mergeCells("A9:H9");
      const noteInfoHeader = worksheet.getCell("A9");
      noteInfoHeader.value = "NOTE INFORMATION";
      noteInfoHeader.font = {
        name: "Arial",
        size: 12,
        bold: true,
      };
      noteInfoHeader.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add note details in a table format
      worksheet.getCell("A10").value = "Reference Number";
      worksheet.getCell("B10").value = note.referenceNumber || "N/A";
      worksheet.getCell("A10").font = { bold: true };

      worksheet.getCell("A11").value = "Date";
      worksheet.getCell("B11").value = formatDate(note.date) || "N/A";
      worksheet.getCell("A11").font = { bold: true };

      worksheet.getCell("A12").value = "Title";
      worksheet.getCell("B12").value = note.title || "N/A";
      worksheet.getCell("A12").font = { bold: true };

      worksheet.getCell("A13").value = "Invoice Number";
      worksheet.getCell("B13").value = note.invoiceNumber || "N/A";
      worksheet.getCell("A13").font = { bold: true };

      worksheet.getCell("A14").value = "Name";
      worksheet.getCell("B14").value =
        note.invoiceDetails?.receiverDetails?.name || "N/A";
      worksheet.getCell("A14").font = { bold: true };

      worksheet.getCell("D10").value = "Type";
      worksheet.getCell("E10").value =
        note.type.charAt(0).toUpperCase() + note.type.slice(1) || "N/A";
      worksheet.getCell("D10").font = { bold: true };

      worksheet.getCell("D11").value = "Note Type";
      worksheet.getCell("E11").value =
        note.noteType.charAt(0).toUpperCase() + note.noteType.slice(1) || "N/A";
      worksheet.getCell("D11").font = { bold: true };

      worksheet.getCell("D12").value = "Status";
      worksheet.getCell("E12").value =
        note.status.charAt(0).toUpperCase() + note.status.slice(1) || "N/A";
      worksheet.getCell("D12").font = { bold: true };

      worksheet.getCell("D13").value = "Amount";
      worksheet.getCell("E13").value = `₹${note.amount.toLocaleString() || "0"
        }`;
      worksheet.getCell("D13").font = { bold: true };

      worksheet.getCell("D14").value = "Invoice Value";
      worksheet.getCell("E14").value = `₹${note.invoiceDetails?.totalPayableAmount?.toLocaleString() ||
        note.invoiceDetails?.grandTotal?.toLocaleString() ||
        note.invoiceDetails?.total?.totalPayableAmount?.toLocaleString() ||
        note.invoiceDetails?.total?.grandTotal?.toLocaleString() ||
        "0"
        }`;
      worksheet.getCell("D14").font = { bold: true };

      // Add description and reason
      worksheet.mergeCells("A15:H15");
      const descriptionHeader = worksheet.getCell("A15");
      descriptionHeader.value = "DESCRIPTION & REASON";
      descriptionHeader.font = {
        name: "Arial",
        size: 12,
        bold: true,
      };
      descriptionHeader.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      worksheet.mergeCells("A16:H16");
      worksheet.getCell("A16").value = `Description: ${note.description || "No description provided"
        }`;

      worksheet.mergeCells("A17:H17");
      worksheet.getCell("A17").value = `Reason: ${note.reason || "No reason provided"
        }`;

      // Add signature section
      worksheet.mergeCells("A19:H19");
      const signatureHeader = worksheet.getCell("A19");
      signatureHeader.value = "SIGNATURES";
      signatureHeader.font = {
        name: "Arial",
        size: 12,
        bold: true,
      };
      signatureHeader.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      worksheet.getCell("A20").value = "Authorized Signatory";
      worksheet.getCell("A20").font = { bold: true };

      worksheet.getCell("E20").value = "Customer/Vendor Signature";
      worksheet.getCell("E20").font = { bold: true };

      // Add footer
      worksheet.mergeCells("A22:H22");
      worksheet.getCell("A22").value =
        "This is a computer-generated document and does not require a physical signature.";
      worksheet.getCell("A22").font = { italic: true };
      worksheet.getCell("A22").alignment = { horizontal: "center" };

      worksheet.mergeCells("A23:H23");
      worksheet.getCell(
        "A23"
      ).value = `Generated on: ${new Date().toLocaleString()}`;
      worksheet.getCell("A23").font = { italic: true };
      worksheet.getCell("A23").alignment = { horizontal: "center" };

      // Set column widths
      worksheet.columns.forEach((column) => {
        column.width = 15;
      });

      // Generate the Excel file and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${note.noteType}-note-${note.referenceNumber}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel Export Error:", error);
      setAlert({
        open: true,
        message: "Failed to export to Excel",
        severity: "error",
      });
    }
  };

  // Prepare CSV data
  const csvData = () => {
    const header = [
      "Date",
      "Customer/Vendor",
      "Reference #",
      "Title",
      "Invoice #",
      "Type",
      "Note Type",
      "Status",
      "Amount",
    ];

    const rows = paginatedNotes?.map((note) => [
      formatDate(note.date),
      note.invoiceDetails?.receiverDetails?.name || "",
      note.referenceNumber,
      note.title,
      note.invoiceNumber,
      note.type.charAt(0).toUpperCase() + note.type?.slice(1),
      note.noteType.charAt(0).toUpperCase() + note.noteType?.slice(1),
      note.status.charAt(0).toUpperCase() + note.status?.slice(1),
      `${note.amount.toLocaleString()}`,
    ]);

    return [header, ...rows]
      ?.map((row) => row?.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  };

  // Export to CSV
  const exportToCSV = () => {
    const csv = csvData();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `credit-debit-notes-report-${new Date().getTime()}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load data on component mount
  useEffect(() => {
    fetchNotes();
    fetchProductInvoices();
    fetchServiceInvoices();
    fetchPurchaseInvoices();
  }, []);

  // Update pagination when filters or search term changes
  useEffect(() => {
    updatePagination(notes, currentPage, itemsPerPage);
  }, [filters, searchTerm]);

  // Handle view full details
  const handleView = (note) => {
    setSelectedNoteForView(note);
    setShowViewModal(true);
  };

  return (
    <div className="p-6 md:max-w-8xl mx-auto">
      {/* Alert */}
      {alertInfo && (
        <div
          className={`mb-4 p-4 rounded-lg ${alertInfo.type === "success"
              ? "bg-green-100 text-green-800"
              : alertInfo.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
        >
          {alertInfo.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Credit/Debit Notes Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage credit and debit notes for customers and vendors
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setAddModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg  hover:bg-blue-700 transition-colors cursor-pointer flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Note
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                    clipRule="evenodd"
                  />
                </svg>
                Export to PDF
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 001 1h12a1 1 0 001-1V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0010.586 3H4a1 1 0 00-1 1v13zm9-11.586l3.586 3.586H12V5.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Export to CSV
              </button>
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg ${showFilters
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                  } hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer`}
                title="Toggle Filters"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Advanced Filters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                    <option value="purchase">Purchase</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="noteType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Note Type
                  </label>
                  <select
                    id="noteType"
                    name="noteType"
                    value={filters.noteType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Note Types</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="minAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Min Amount
                  </label>
                  <input
                    type="number"
                    id="minAmount"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Max Amount
                  </label>
                  <input
                    type="number"
                    id="maxAmount"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">
              Error Loading Data
            </h3>
            <p className="text-gray-500 mt-2">{error}</p>
            <button
              onClick={fetchNotes}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : paginatedNotes?.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">
              No Notes Found
            </h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || Object.values(filters).some((val) => val !== "")
                ? "Try adjusting your search or filters"
                : "Add your first note to get started"}
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Add New Note
            </button>
          </div>
        ) : (
          <>
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
                      Customer/Vendor Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reference #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Invoice #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Note Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedNotes?.map((note) => (
                    <tr key={note._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(note.date)}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900  overflow-hidden text-ellipsis"
                        title={
                          note?.invoiceDetails?.receiverDetails?.name || ""
                        }
                        style={{ maxWidth: "30px", width: "30px" }}
                      >
                        {note?.invoiceDetails?.receiverDetails?.name || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {note.referenceNumber}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900  overflow-hidden text-ellipsis"
                        title={note.title}
                        style={{ maxWidth: "90px", width: "90px" }}
                      >
                        {note.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {note.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${note.type === "product"
                              ? "bg-blue-100 text-blue-800"
                              : note.type === "service"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {note.type.charAt(0).toUpperCase() +
                            note.type?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${note.noteType === "credit"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {note.noteType.charAt(0).toUpperCase() +
                            note.noteType?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${note.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : note.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {note.status.charAt(0).toUpperCase() +
                            note.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{note.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {note.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(note._id)}
                                className="text-green-600 hover:text-green-900 cursor-pointer"
                                title="Approve"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleReject(note._id)}
                                className="text-red-600 hover:text-red-900 cursor-pointer"
                                title="Reject"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          {
                            note.status !=="approved" && (<button
                            onClick={() => handleDelete(note._id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Delete Note"
                          >
                            <FaTrash />
                          </button>)
                          }
                          {/* <button
                            onClick={() => exportNoteToPDF(note)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Export to PDF"
                          >
                            <FaFilePdf />
                          </button>
                          <button
                            onClick={() => exportNoteToExcel(note)}
                            className="text-green-600 hover:text-green-900 cursor-pointer"
                            title="Export to Excel"
                          >
                            <FaFileExcel />
                          </button> */}
                          <button
                            onClick={() => handleView(note)}
                            className="text-pink-600 hover:text-green-900 cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye />
                          </button>

                          <SnigdhaCreditDebitNotePdf pdfData={note} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex items-center">
                <label
                  htmlFor="itemsPerPage"
                  className="mr-2 text-sm text-gray-700"
                >
                  Show:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div className="flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>

              <div className="hidden sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {paginatedNotes?.length}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">First</span>
                      <span>First</span>
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <span>Prev</span>
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
                          className={`relative inline-flex items-center px-4 py-2 border ${currentPage === pageNum
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            } text-sm font-medium cursor-pointer`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <span>Next</span>
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Last</span>
                      <span>Last</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Note Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Add New Credit/Debit Note
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="date"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Date
                          </label>
                          <input
                            type="date"
                            name="date"
                            id="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="noteType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Note Type
                          </label>
                          <select
                            name="noteType"
                            id="noteType"
                            value={formData.noteType}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="credit">Credit Note</option>
                            <option value="debit">Debit Note</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="entityType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Entity Type
                          </label>
                          <select
                            name="entityType"
                            id="entityType"
                            value={entityType}
                            onChange={handleEntityTypeChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select Entity Type</option>
                            <option value="customer">Customer</option>
                            <option value="vendor">Vendor</option>
                          </select>
                        </div>

                        {entityType === "customer" && (
                          <div>
                            <label
                              htmlFor="invoiceType"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Invoice Type
                            </label>
                            <select
                              name="invoiceType"
                              id="invoiceType"
                              value={invoiceType}
                              onChange={handleInvoiceTypeChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="">Select Invoice Type</option>
                              <option value="product">Product Invoice</option>
                              <option value="service">Service Invoice</option>
                            </select>
                          </div>
                        )}

                        {((entityType === "customer" && invoiceType) ||
                          entityType === "vendor") && (
                            <div>
                              <label
                                htmlFor="selectedEntity"
                                className="block text-sm font-medium text-gray-700"
                              >
                                {entityType === "customer"
                                  ? "Customer"
                                  : "Vendor"}
                              </label>
                              <select
                                name="selectedEntity"
                                id="selectedEntity"
                                value={selectedEntity}
                                onChange={handleEntityChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              >
                                <option value="">
                                  Select{" "}
                                  {entityType === "customer"
                                    ? "Customer"
                                    : "Vendor"}
                                </option>
                                {entityType === "customer"
                                  ? customers?.map((customer) => (
                                    <option
                                      key={customer.name}
                                      value={customer.name}
                                    >
                                      {customer.name}
                                    </option>
                                  ))
                                  : vendors?.map((vendor) => (
                                    <option
                                      key={vendor.name}
                                      value={vendor.name}
                                    >
                                      {vendor.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          )}

                        {selectedEntity && (
                          <div>
                            <label
                              htmlFor="invoiceNumber"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Invoice Number
                            </label>
                            <select
                              name="invoiceNumber"
                              id="invoiceNumber"
                              value={formData.invoiceNumber}
                              onChange={handleInvoiceChange}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="">Select Invoice</option>
                              {invoices?.map((invoice) => (
                                <option
                                  key={invoice.invoiceNumber}
                                  value={invoice.invoiceNumber}
                                >
                                  {invoice.invoiceNumber} - Total{" "}
                                  {invoice?.totalPayableAmount ||
                                    invoice?.grandTotal ||
                                    invoice?.total?.totalPayableAmount ||
                                    invoice?.total?.grandTotal}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Item Selection Button  after new requirenment */}
                        {formData.invoiceNumber &&
                          selectedInvoiceItems.length > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Invoice Items
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowItemsModal(true)}
                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                              >
                                Select & Edit Items(
                                {selectedInvoiceItems.length} items available)
                              </button>
                              {editableItems.filter((item) => item.isEdited)
                                .length > 0 && (
                                  <div className="mt-2 p-3 bg-green-50 rounded-md">
                                    <p className="text-sm text-green-800">
                                      <strong>Selected Items: </strong>{" "}
                                      {
                                        editableItems.filter(
                                          (item) => item.isEdited
                                        ).length
                                      }
                                    </p>
                                    <p className="text-sm text-green-800">
                                      <strong>Gross Amount: </strong> ₹
                                      {(itemTotals.totalGrossAmount || 0).toFixed(
                                        2
                                      )}
                                    </p>
                                    <p className="text-sm text-green-800">
                                      <strong>Tax Amount: </strong> ₹
                                      {(itemTotals.totalTaxAmount || 0).toFixed(
                                        2
                                      )}
                                    </p>
                                    <p className="text-sm text-green-800">
                                      <strong>Total Amount: </strong> ₹
                                      {itemTotals.totalAmount.toFixed(2)}
                                    </p>
                                  </div>
                                )}
                            </div>
                          )}

                        <div>
                          <label
                            htmlFor="amount"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Amount
                          </label>
                          <input
                            type="number"
                            name="amount"
                            id="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            readOnly={
                              editableItems.filter((item) => item.isEdited)
                                .length > 0
                            } // after new requirenment
                          />
                          {/* after new requirenment  */}
                          {editableItems.filter((item) => item.isEdited)
                            .length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                Amount is calculated automatically from selected
                                items
                              </p>
                            )}
                        </div>

                        <div>
                          <label
                            htmlFor="reason"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Reason
                          </label>
                          <input
                            type="text"
                            name="reason"
                            id="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center cursor-pointer rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center cursor-pointer rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setAddModalOpen(false);
                      resetForm();
                      setEntityType("");
                      setInvoiceType("");
                      setSelectedEntity("");
                      setInvoices([]);
                      // after new requirenment
                      setSelectedInvoiceItems([]);
                      setEditableItems([]);
                      setShowItemsModal(false);
                      setItemTotals({
                        totalAmount: 0,
                        totalQuantity: 0,
                        totalGrossAmount: 0,
                        totalTaxAmount: 0,
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Items Selection Modal */}

      {showItemsModal && (
        <>
          <div className="fixed inset-0 z-20 overflow-y-auto ">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"> </div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full ">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Select & Edit Invoice Items
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">
                                {" "}
                                Selected Items:{" "}
                              </span>{" "}
                              {
                                editableItems.filter((item) => item.isEdited)
                                  .length
                              }
                            </div>
                            <div>
                              <span className="font-medium">
                                {" "}
                                Gross Amount:{" "}
                              </span>{" "}
                              ₹{(itemTotals.totalGrossAmount || 0).toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium"> Tax Amount: </span>{" "}
                              ₹{(itemTotals.totalTaxAmount || 0).toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">
                                {" "}
                                Total Amount:{" "}
                              </span>{" "}
                              ₹{itemTotals.totalAmount.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </h3>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Select
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Original Qty
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                New Quantity
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Original Price
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                New Selling Price
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tax Rate (%)
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tax Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gross Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Before Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                After Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Final Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {editableItems.map((item, index) => (
                              <tr
                                key={index}
                                className={item.isEdited ? "bg-blue-50" : ""}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    checked={item.isEdited}
                                    onChange={() => toggleItemSelection(index)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.itemName}
                                  {item.description && (
                                    <div className="text-xs text-gray-500">
                                      {" "}
                                      {item.description}{" "}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {item.originalQuantity}
                                  {item.uom && (
                                    <span className="text-xs text-gray-500 ml-1">
                                      {" "}
                                      {item.uom}{" "}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="number"
                                    value={item.newQuantity}
                                    onChange={(e) =>
                                      handleItemEdit(
                                        index,
                                        "newQuantity",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    disabled={!item.isEdited}
                                    min="0"
                                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  ₹{item.originalSellingPrice}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="number"
                                    value={item.newSellingPrice}
                                    onChange={(e) =>
                                      handleItemEdit(
                                        index,
                                        "newSellingPrice",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    disabled={!item.isEdited}
                                    min="0"
                                    step="0.01"
                                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                  />
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {item.isEdited ? (
                                    <span className="text-blue-600 font-medium">
                                      {item.calculatedTaxRate
                                        ? item.calculatedTaxRate.toFixed(2)
                                        : "0.00"}
                                      %
                                    </span>
                                  ) : (
                                    <span className="text-gray-500">
                                      {(
                                        (item.cgst || 0) +
                                        (item.sgst || 0) +
                                        (item.igst || 0) +
                                        (item.taxRate || 0)
                                      ).toFixed(2)}
                                      %
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {item.isEdited ? (
                                    <span className="text-blue-600 font-medium">
                                      ₹
                                      {item.calculatedTaxAmount
                                        ? item.calculatedTaxAmount.toFixed(2)
                                        : "0.00"}
                                    </span>
                                  ) : (
                                    <span className="text-gray-500">
                                      ₹{(item.taxAmount || 0).toFixed(2)}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {item.isEdited ? (
                                    <span className="text-blue-600 font-medium">
                                      ₹
                                      {item.calculatedGrossAmount
                                        ? item.calculatedGrossAmount.toFixed(2)
                                        : "0.00"}
                                    </span>
                                  ) : (
                                    <span className="text-gray-500">
                                      ₹
                                      {(
                                        item.originalQuantity *
                                        item.originalSellingPrice
                                      ).toFixed(2)}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.isEdited && (
                                    <span className="text-green-600 font-bold">
                                      ₹
                                      {item.calculatedTotalAmount
                                        ? item.calculatedTotalAmount.toFixed(2)
                                        : item.editedAmount.toFixed(2)}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  <span className="text-gray-900">
                                    ₹{(item.beforeAmount || 0).toFixed(2)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  {item.isEdited ? (
                                    <span className="text-blue-600 font-bold">
                                      ₹{(item.afterAmount || 0).toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className="text-gray-500">
                                      ₹{(item.beforeAmount || 0).toFixed(2)}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  {item.isEdited && (
                                    <span className={item.finalAmount >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                      {item.finalAmount >= 0 ? '+' : ''}₹{(item.finalAmount || 0).toFixed(2)}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowItemsModal(false)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                  >
                    Apply Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowItemsModal(false);
                      // Reset all items to unedited state
                      setEditableItems((prev) =>
                        prev.map((item) => ({
                          ...item,
                          isEdited: false,
                          newQuantity: item.originalQuantity,
                          newSellingPrice: item.originalSellingPrice,
                          editedAmount:
                            item.originalQuantity * item.originalSellingPrice,
                        }))
                      );
                      setItemTotals({ totalAmount: 0, totalQuantity: 0 });
                      setFormData((prev) => ({ ...prev, amount: "" }));
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showViewModal && selectedNoteForView && (
        <div className="fixed inset-0 z-30 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl leading-6 font-bold text-gray-900">
                        {selectedNoteForView.noteType.charAt(0).toUpperCase() +
                          selectedNoteForView.noteType.slice(1)} Note Details
                      </h3>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${selectedNoteForView.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedNoteForView.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {selectedNoteForView.status.charAt(0).toUpperCase() +
                          selectedNoteForView.status.slice(1)}
                      </span>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Reference Number:</span>
                            <span className="text-gray-900">{selectedNoteForView.referenceNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Title:</span>
                            <span className="text-gray-900">{selectedNoteForView.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Date:</span>
                            <span className="text-gray-900">{formatDate(selectedNoteForView.date)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Type:</span>
                            <span className="text-gray-900 capitalize">{selectedNoteForView.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Note Type:</span>
                            <span className="text-gray-900 capitalize">{selectedNoteForView.noteType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Amount:</span>
                            <span className="text-gray-900 font-bold">₹{selectedNoteForView.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Invoice Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Invoice Number:</span>
                            <span className="text-gray-900">{selectedNoteForView.invoiceNumber}</span>
                          </div>
                          {selectedNoteForView.invoiceDetails?.receiverDetails && (
                            <>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Customer/Vendor:</span>
                                <span className="text-gray-900">{selectedNoteForView.invoiceDetails.receiverDetails.name}</span>

                                {customerCredit && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">Avail. Credit: ₹{(customerCredit.availableCredit || 0).toLocaleString()}</span>
                                )}
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-600">GSTIN:</span>
                                <span className="text-gray-900">{selectedNoteForView.invoiceDetails.receiverDetails.gstin || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Phone:</span>
                                <span className="text-gray-900">{selectedNoteForView.invoiceDetails.receiverDetails.phoneNumber || 'N/A'}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Invoice Date:</span>
                            <span className="text-gray-900">{formatDate(selectedNoteForView.invoiceDetails?.date)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Original Invoice Amount:</span>
                            <span className="text-gray-900 font-bold">
                              ₹{(selectedNoteForView.invoiceDetails?.grandTotal ||
                                selectedNoteForView.invoiceDetails?.totalPayableAmount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Totals Summary */}
                    {(selectedNoteForView.totalGrossAmount || selectedNoteForView.totalTaxAmount) && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h4 className="text-lg font-semibold text-blue-900 mb-3">Amount Breakdown</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <span className="block text-sm font-medium text-blue-600">Gross Amount</span>
                            <span className="text-lg font-bold text-blue-900">
                              ₹{(selectedNoteForView.totalGrossAmount || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="block text-sm font-medium text-blue-600">Tax Amount</span>
                            <span className="text-lg font-bold text-blue-900">
                              ₹{(selectedNoteForView.totalTaxAmount || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="block text-sm font-medium text-blue-600">Total Amount</span>
                            <span className="text-lg font-bold text-blue-900">
                              ₹{selectedNoteForView.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Products/Items Section */}
                    {selectedNoteForView.products && selectedNoteForView.products.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Selected Items ({selectedNoteForView.products.length})
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Qty</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Qty</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Rate</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedNoteForView.products.map((product, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{product.itemName}</div>
                                      {product.description && (
                                        <div className="text-xs text-gray-500">{product.description}</div>
                                      )}
                                      {product.hsnCode && (
                                        <div className="text-xs text-gray-400">HSN: {product.hsnCode}</div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {product.originalQuantity} {product.uom && <span className="text-xs text-gray-500">{product.uom}</span>}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    {product.newQuantity} {product.uom && <span className="text-xs text-gray-500">{product.uom}</span>}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    ₹{product.originalSellingPrice?.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    ₹{product.newSellingPrice?.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {product.taxRate?.toFixed(2)}%
                                    {(product.cgst > 0 || product.sgst > 0) && (
                                      <div className="text-xs text-gray-500">
                                        CGST: {product.cgst}% + SGST: {product.sgst}%
                                      </div>
                                    )}
                                    {product.igst > 0 && (
                                      <div className="text-xs text-gray-500">IGST: {product.igst}%</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    ₹{product.taxAmount?.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    ₹{product.grossAmount?.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                    ₹{(product.totalAmount || product.editedAmount)?.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Original Invoice Items */}
                    {selectedNoteForView.invoiceDetails?.items && selectedNoteForView.invoiceDetails.items.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Original Invoice Items ({selectedNoteForView.invoiceDetails.items.length})
                        </h4>
                        <div className="overflow-x-auto max-h-60">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Rate</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedNoteForView.invoiceDetails.items.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                                      {item.description && (
                                        <div className="text-xs text-gray-500">{item.description}</div>
                                      )}
                                      {item.hsnCode && (
                                        <div className="text-xs text-gray-400">HSN: {item.hsnCode}</div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {item.quantity} {item.uom && <span className="text-xs text-gray-500">{item.uom}</span>}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    ₹{item.unitPrice?.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    ₹{item.sellingPrice?.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {item.taxRate?.toFixed(2)}%
                                    {(item.cgst > 0 || item.sgst > 0) && (
                                      <div className="text-xs text-gray-500">
                                        CGST: {item.cgst}% + SGST: {item.sgst}%
                                      </div>
                                    )}
                                    {item.igst > 0 && (
                                      <div className="text-xs text-gray-500">IGST: {item.igst}%</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    ₹{item.amount?.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Description and Reason */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700">{selectedNoteForView.description || 'No description provided'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Reason</h4>
                        <p className="text-gray-700">{selectedNoteForView.reason || 'No reason provided'}</p>
                      </div>
                    </div>

                    {/* Customer/Vendor Address */}
                    {selectedNoteForView.invoiceDetails?.receiverDetails?.address && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Address Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-600">Address:</span>
                            <p className="text-gray-700">{selectedNoteForView.invoiceDetails.receiverDetails.address}</p>
                          </div>
                          {selectedNoteForView.invoiceDetails.receiverDetails.deliveryAddress && (
                            <div>
                              <span className="font-medium text-gray-600">Delivery Address:</span>
                              <p className="text-gray-700">{selectedNoteForView.invoiceDetails.receiverDetails.deliveryAddress}</p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.receiverDetails.state && (
                            <div>
                              <span className="font-medium text-gray-600">State:</span>
                              <p className="text-gray-700">{selectedNoteForView.invoiceDetails.receiverDetails.state}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Invoice Details */}
                    {selectedNoteForView.invoiceDetails && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Invoice Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedNoteForView.invoiceDetails.location && (
                            <div>
                              <span className="font-medium text-gray-600">Location:</span>
                              <p className="text-gray-700">{selectedNoteForView.invoiceDetails.location}</p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.paymentType && (
                            <div>
                              <span className="font-medium text-gray-600">Payment Type:</span>
                              <p className="text-gray-700 capitalize">{selectedNoteForView.invoiceDetails.paymentType}</p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.taxGroup && (
                            <div>
                              <span className="font-medium text-gray-600">Tax Group:</span>
                              <p className="text-gray-700">{selectedNoteForView.invoiceDetails.taxGroup}</p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.poNumber && (
                            <div>
                              <span className="font-medium text-gray-600">PO Number:</span>
                              <p className="text-gray-700">{selectedNoteForView.invoiceDetails.poNumber}</p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.poDate && (
                            <div>
                              <span className="font-medium text-gray-600">PO Date:</span>
                              <p className="text-gray-700">{formatDate(selectedNoteForView.invoiceDetails.poDate)}</p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.vendorCode && (
                            <div>
                              <span className="font-medium text-gray-600">Vendor Code:</span>
                              <p className="text-gray-700">{selectedNoteForView.invoiceDetails.vendorCode}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  // onClick={() => exportNoteToPDF(selectedNoteForView)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  <SnigdhaCreditDebitNotePdf pdfData={selectedNoteForView} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedNoteForView(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default SnigdhaCreditDebitNotePage;
