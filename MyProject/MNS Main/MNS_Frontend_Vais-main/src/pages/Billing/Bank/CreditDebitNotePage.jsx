import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendDomainA } from "../../../Common/index";
import { format } from "date-fns";
import {
  FaTrash,
  FaFilePdf,
  FaFileExcel,
  FaPlus,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";
import { Download, Eye } from "lucide-react";
import CreditDebitNotePdf from "./CreditDebitNotePdf";

const CreditDebitNotePage = () => {
  // State for notes data
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [paginatedNotes, setPaginatedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerCredit, setCustomerCredit] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
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
  const [showFilters, setShowFilters] = useState(false);

  // State for modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    noteType: "credit",
    description: "",
    invoiceNumber: "",
    amount: "",
    type: "product",
    reason: "",
  });

  // New state variables for customer/vendor selection
  const [entityType, setEntityType] = useState(""); // "customer" or "vendor"
  const [invoiceType, setInvoiceType] = useState(""); // "product" or "service"
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [productInvoices, setProductInvoices] = useState([]);
  const [serviceInvoices, setServiceInvoices] = useState([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [selectedInvoiceItems, setSelectedInvoiceItems] = useState([]);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [editableItems, setEditableItems] = useState([]);
  const [itemTotals, setItemTotals] = useState({
    totalAmount: 0,
    totalQuantity: 0,
    totalGrossAmount: 0,
    totalTaxAmount: 0,
  });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNoteForView, setSelectedNoteForView] = useState(null);

  // State for alerts
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch notes data on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch product invoices
  const fetchProductInvoices = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_FETCH_INVOICE_MNS
      );
      if (response.data && response.data.data) {
        setProductInvoices(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product invoices:", error);
      setAlert({
        open: true,
        message: "Failed to load product invoices",
        severity: "error",
      });
    }
  };

  // Fetch service invoices
  const fetchServiceInvoices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL_C}/api/v1/service/get-all`
      );
      if (response.data && response.data.data) {
        setServiceInvoices(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching service invoices:", error);
      setAlert({
        open: true,
        message: "Failed to load service invoices",
        severity: "error",
      });
    }
  };

  // Fetch purchase invoices
  const fetchPurchaseInvoices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL_C}/api/v1/po/all`
      );
      if (response.data && response.data.purchaseOrders) {
        setPurchaseInvoices(response.data.purchaseOrders);
      }
    } catch (error) {
      console.error("Error fetching purchase invoices:", error);
      setAlert({
        open: true,
        message: "Failed to load purchase invoices",
        severity: "error",
      });
    }
  };

  // Load all invoice data when component mounts
  useEffect(() => {
    fetchProductInvoices();
    fetchServiceInvoices();
    fetchPurchaseInvoices();
  }, []);

  // Extract unique customers from product invoices
  useEffect(() => {
    if (productInvoices.length > 0) {
      const uniqueCustomers = [
        ...new Map(
          productInvoices
            .filter(
              (invoice) =>
                invoice.receiverDetails && invoice.receiverDetails.name
            )
            .map((invoice) => [
              invoice.receiverDetails.name,
              {
                name: invoice.receiverDetails.name,
                id: invoice.receiverDetails.id || invoice._id,
                phoneNumber: invoice.receiverDetails.phoneNumber,
              },
            ])
        ).values(),
      ];
      setCustomers((prevCustomers) => {
        // Merge with existing customers from service invoices
        const mergedCustomers = [...prevCustomers];
        uniqueCustomers.forEach((customer) => {
          if (!mergedCustomers.some((c) => c.name === customer.name)) {
            mergedCustomers.push(customer);
          }
        });
        return mergedCustomers;
      });
    }
  }, [productInvoices]);

  // Extract unique customers from service invoices
  useEffect(() => {
    if (serviceInvoices.length > 0) {
      const uniqueCustomers = [
        ...new Map(
          serviceInvoices
            .filter(
              (invoice) =>
                invoice.receiverDetails && invoice.receiverDetails.name
            )
            .map((invoice) => [
              invoice.receiverDetails.name,
              {
                name: invoice.receiverDetails.name,
                id: invoice.receiverDetails.id || invoice._id,
                phoneNumber: invoice.receiverDetails.phoneNumber,
              },
            ])
        ).values(),
      ];
      setCustomers((prevCustomers) => {
        // Merge with existing customers from product invoices
        const mergedCustomers = [...prevCustomers];
        uniqueCustomers.forEach((customer) => {
          if (!mergedCustomers.some((c) => c.name === customer.name)) {
            mergedCustomers.push(customer);
          }
        });
        return mergedCustomers;
      });
    }
  }, [serviceInvoices]);

  // Extract unique vendors from purchase invoices
  useEffect(() => {
    if (purchaseInvoices.length > 0) {
      const uniqueVendors = [
        ...new Map(
          purchaseInvoices
            .filter(
              (invoice) =>
                invoice.receiverDetails && invoice.receiverDetails.name
            )
            .map((invoice) => [
              invoice.receiverDetails.name,
              {
                name: invoice.receiverDetails.name,
                id: invoice.receiverDetails.id || invoice._id,
                phoneNumber: invoice.receiverDetails.phoneNumber,
              },
            ])
        ).values(),
      ];
      setVendors(uniqueVendors);
    }
  }, [purchaseInvoices]);

  // Apply filters and search when they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [notes, searchTerm, filters]);

  // Update paginated notes when filtered notes or pagination settings change
  useEffect(() => {
    paginateNotes();
  }, [filteredNotes, currentPage, itemsPerPage]);

  // Calculate total pages when total items or items per page changes
  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Fetch all notes from the API
  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${backendDomainA}/api/v1/credit-debit-notes/all`
      );
      // Ensure notes is always an array
      const notesData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setNotes(notesData);
      setFilteredNotes(notesData);
      setTotalItems(notesData.length);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notes");
      setNotes([]);
      setFilteredNotes([]);
      setTotalItems(0);
      setLoading(false);
    }
  };

  // Apply filters and search to the notes data
  const applyFiltersAndSearch = () => {
    if (!Array.isArray(notes)) {
      setFilteredNotes([]);
      setTotalItems(0);
      return;
    }

    let filtered = [...notes];

    // Apply search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title?.toLowerCase().includes(search) ||
          note.description?.toLowerCase().includes(search) ||
          note.invoiceNumber?.toLowerCase().includes(search) ||
          note.referenceNumber?.toLowerCase().includes(search)
      );
    }

    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(
        (note) => new Date(note.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (note) => new Date(note.date) <= new Date(filters.endDate)
      );
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter((note) => note.type === filters.type);
    }

    // Apply noteType filter
    if (filters.noteType) {
      filtered = filtered.filter((note) => note.noteType === filters.noteType);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((note) => note.status === filters.status);
    }

    // Apply amount filters
    if (filters.minAmount) {
      filtered = filtered.filter(
        (note) => note.amount >= parseFloat(filters.minAmount)
      );
    }

    if (filters.maxAmount) {
      filtered = filtered.filter(
        (note) => note.amount <= parseFloat(filters.maxAmount)
      );
    }

    // Apply title filter
    if (filters.title) {
      filtered = filtered.filter((note) =>
        note.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    setFilteredNotes(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Paginate the filtered notes
  const paginateNotes = () => {
    if (!Array.isArray(filteredNotes)) {
      setPaginatedNotes([]);
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedNotes(filteredNotes.slice(startIndex, endIndex));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset all filters
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
    setSearchTerm("");
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      noteType: "credit",
      description: "",
      invoiceNumber: "",
      amount: "",
      type: "product",
      reason: "",
    });
  };

  // Handle entity type change (customer or vendor)
  const handleEntityTypeChange = (e) => {
    const type = e.target.value;
    setEntityType(type);
    setInvoiceType(""); // Reset invoice type
    setSelectedEntity(""); // Reset selected entity
    setInvoices([]); // Reset invoices

    // Update form data type based on entity type
    if (type === "vendor") {
      setFormData({
        ...formData,
        type: "purchase",
      });
    } else {
      setFormData({
        ...formData,
        type: "",
      });
    }
  };

  // Handle invoice type change (product or service)
  const handleInvoiceTypeChange = (e) => {
    const type = e.target.value;
    setInvoiceType(type);
    setSelectedEntity(""); // Reset selected entity
    setInvoices([]); // Reset invoices

    // Update form data type based on invoice type
    setFormData({
      ...formData,
      type: type,
    });
  };

  // Handle entity selection (customer or vendor)
  const handleEntityChange = (e) => {
    const entityName = e.target.value;
    setSelectedEntity(entityName);
    setFormData({
      ...formData,
      invoiceNumber: "",
    });

    // Filter invoices based on selected entity
    if (entityType === "customer") {
      if (invoiceType === "product") {
        const filteredInvoices = productInvoices.filter(
          (invoice) =>
            invoice.receiverDetails &&
            invoice.receiverDetails.name === entityName
        );
        setInvoices(filteredInvoices);
      } else if (invoiceType === "service") {
        const filteredInvoices = serviceInvoices.filter(
          (invoice) =>
            invoice.receiverDetails &&
            invoice.receiverDetails.name === entityName
        );
        setInvoices(filteredInvoices);
      }
    } else if (entityType === "vendor") {
      const filteredInvoices = purchaseInvoices.filter(
        (invoice) =>
          invoice.receiverDetails && invoice.receiverDetails.name === entityName
      );
      setInvoices(filteredInvoices);
    }
  };

  // Handle invoice selection
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
            originalAmount: item.amount || item.quantity * item.sellingPrice, // Before Amount
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
            beforeAmount: item.amount || item.quantity * item.sellingPrice, // Original total amount
            afterAmount: item.amount || item.quantity * item.sellingPrice, // Will be updated on edit
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
      taxRate =
        parseFloat(updatedItems[index].cgst) +
        parseFloat(updatedItems[index].sgst);
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

    console.log("Edited Items", editedItems);

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

    console.log({
      totalAmount,
      totalQuantity,
      totalGrossAmount,
      totalTaxAmount,
    })

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

  // Handle add note form submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
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
          originalSellingPrice:
            item.originalSellingPrice ||
            item.sellingPrice ||
            item.newSellingPrice ||
            0,
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
        totalBefore: editedItems.reduce(
          (sum, item) => sum + item.beforeAmount,
          0
        ),
        totalAfter: editedItems.reduce(
          (sum, item) => sum + item.afterAmount,
          0
        ),
        totalFinalAmount: editedItems.reduce(
          (sum, item) => sum + item.finalAmount,
          0
        ),
      };

      console.log("noteData", noteData);

      await axios.post(
        `${backendDomainA}/api/v1/credit-debit-notes/create`,
        noteData
      );
      setAddModalOpen(false);
      resetForm();
      fetchNotes();
      setAlert({
        open: true,
        message: "Note created successfully",
        severity: "success",
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || "Failed to create note",
        severity: "error",
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    }
  };

  // Handle approve note
  const handleApprove = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to approve this note? This will affect the invoice and ledger."
      )
    ) {
      try {
        await axios.put(
          `${backendDomainA}/api/v1/credit-debit-notes/approve/${id}`
        );
        fetchNotes();
        setAlert({
          open: true,
          message: "Note approved successfully",
          severity: "success",
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      } catch (err) {
        setAlert({
          open: true,
          message: err.response?.data?.message || "Failed to approve note",
          severity: "error",
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      }
    }
  };

  // Handle reject note
  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this note?")) {
      try {
        await axios.put(
          `${backendDomainA}/api/v1/credit-debit-notes/reject/${id}`
        );
        fetchNotes();
        setAlert({
          open: true,
          message: "Note rejected successfully",
          severity: "success",
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      } catch (err) {
        setAlert({
          open: true,
          message: err.response?.data?.message || "Failed to reject note",
          severity: "error",
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      }
    }
  };

  // Handle delete note
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(
          `${backendDomainA}/api/v1/credit-debit-notes/delete/${id}`
        );
        fetchNotes();
        setAlert({
          open: true,
          message: "Note deleted successfully",
          severity: "success",
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      } catch (err) {
        setAlert({
          open: true,
          message: err.response?.data?.message || "Failed to delete note",
          severity: "error",
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      }
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Credit/Debit Notes Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), "dd/MM/yyyy")}`, 14, 30);

    // Define the columns for the table
    const columns = [
      { header: "Date", dataKey: "date" },
      { header: "Reference #", dataKey: "referenceNumber" },
      { header: "Title", dataKey: "title" },
      { header: "Invoice #", dataKey: "invoiceNumber" },
      { header: "Type", dataKey: "type" },
      { header: "Note Type", dataKey: "noteType" },
      { header: "Status", dataKey: "status" },
      { header: "Amount", dataKey: "amount" },
    ];

    // Ensure filteredNotes is an array before mapping
    const notesToExport = Array.isArray(filteredNotes) ? filteredNotes : [];

    // Prepare the data
    const data = notesToExport.map((note) => ({
      date: formatDate(note.date),
      referenceNumber: note.referenceNumber,
      title: note.title,
      invoiceNumber: note.invoiceNumber,
      type: note.type,
      noteType: note.noteType,
      status: note.status,
      amount: `₹${note.amount.toLocaleString()}`,
    }));

    // Generate the table
    doc.autoTable({
      head: [columns.map((column) => column.header)],
      body: data.map((item) => columns.map((column) => item[column.dataKey])),
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    // Save the PDF
    doc.save("credit-debit-notes-report.pdf");
  };

  // Prepare CSV data for export
  const csvData = [
    [
      "Date",
      "Reference #",
      "Title",
      "Invoice #",
      "Type",
      "Note Type",
      "Status",
      "Amount",
      "Reason",
      "Description",
    ],
    ...(Array.isArray(filteredNotes)
      ? filteredNotes.map((note) => [
          formatDate(note.date),
          note.referenceNumber,
          note.title,
          note.invoiceNumber,
          note.type,
          note.noteType,
          note.status,
          note.amount,
          note.reason,
          note.description,
        ])
      : []),
  ];

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

    // Company logo placeholder (you can replace with actual logo)
    pdf.setFillColor(255, 255, 255);
    pdf.circle(margin + 8, 17, 8, "F");
    pdf.setFillColor(26, 35, 126);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("MNS", margin + 4, 20);

    // Company name with modern styling
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(255, 255, 255);
    pdf.text("MNS SECURE SOLUTION", margin + 25, 18);

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

    pdf.text("MNS Secure Solutions PVT LTD", margin + 5, companyCardY + 3);
    pdf.text(
      "Address: AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA-700064",
      margin + 5,
      companyCardY + 10
    );
    pdf.text(
      "Phone: +91 9614544973 |  Email: info@mnssecuresolutions.com  |  GSTIN: 19AAQCM5971R1Z6",
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
      `${
        note.invoiceDetails?.totalPayableAmount?.toLocaleString() ||
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
      `Generated on: ${new Date().toLocaleString()} | Powered by MNS Secure Solutions PVT LTD`,
      pageWidth / 2,
      footerY + 8,
      { align: "center" }
    );

    // Save the PDF with a more descriptive filename
    const timestamp = new Date().toISOString().slice(0, 10);
    pdf.save(
      `${note.noteType.toUpperCase()}-Note-${
        note.referenceNumber
      }-${timestamp}.pdf`
    );
  };

  const handleView = (note) => {
    setSelectedNoteForView(note);
    setShowViewModal(true);
  };

  return (
    <div className="p-6 md:max-w-8xl mx-auto">
      {/* Alert */}
      {alert.open && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            alert.severity === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Credit/Debit Notes Management
        </h1>
        <p className="text-gray-600">
          Create and manage credit and debit notes for your business
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Note
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={exportToPDF}
                  className="flex cursor-pointer items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaFilePdf className="mr-2" />
                  PDF
                </button>
                <CSVLink
                  data={csvData}
                  filename="credit-debit-notes-report.csv"
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaFileExcel className="mr-2" />
                  CSV
                </CSVLink>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FaFilter className="mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        ) : paginatedNotes.length === 0 ? (
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
                  {paginatedNotes.map((note) => (
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
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            note.type === "product"
                              ? "bg-blue-100 text-blue-800"
                              : note.type === "service"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {note.type.charAt(0).toUpperCase() +
                            note.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            note.noteType === "credit"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {note.noteType.charAt(0).toUpperCase() +
                            note.noteType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            note.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : note.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {note.status.charAt(0).toUpperCase() +
                            note.status.slice(1)}
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
                          {note.status !== "approved" && (
                            <button
                              onClick={() => handleDelete(note._id)}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                              title="Delete Note"
                            >
                              <FaTrash />
                            </button>
                          )}
                          <button
                            onClick={() => handleView(note)}
                            className="text-pink-600 hover:text-green-900 cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye />
                          </button>

                          {/* <button
                            onClick={() => exportNoteToPDF(note)}
                            className="text-blue-600 cursor-pointer hover:text-blue-900 focus:outline-none"
                            title="Download PDF"
                          >
                            <FaFilePdf className="h-5 w-5" />
                          </button> */}
                          <CreditDebitNotePdf pdfData={note}/>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-700 mr-4">
                  Showing {paginatedNotes.length} of {totalItems} entries
                </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>

              <div className="flex justify-center">
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 cursor-pointer hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">First</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L3.414 10l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 cursor-pointer hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page Numbers */}
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
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === pageNum
                            ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 cursor-pointer hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 cursor-pointer hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Last</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M12.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L16.586 10l-4.293 4.293a1 1 0 000 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Note Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-y-scroll shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full max-h-[90vh]">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Add New Credit/Debit Note
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleAddSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Title *
                            </label>
                            <input
                              type="text"
                              id="title"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="date"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Date *
                            </label>
                            <input
                              type="date"
                              id="date"
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="noteType"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Note Type *
                            </label>
                            <select
                              id="noteType"
                              name="noteType"
                              value={formData.noteType}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="credit">Credit Note</option>
                              <option value="debit">Debit Note</option>
                            </select>
                          </div>
                          {/* Entity Type Selection (Customer or Vendor) */}
                          <div>
                            <label
                              htmlFor="entityType"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Select Entity Type *
                            </label>
                            <select
                              id="entityType"
                              value={entityType}
                              onChange={handleEntityTypeChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Entity Type</option>
                              <option value="customer">Customer</option>
                              <option value="vendor">Vendor</option>
                            </select>
                          </div>

                          {/* Invoice Type Selection (Product or Service) - Only show if Customer is selected */}
                          {entityType === "customer" && (
                            <div>
                              <label
                                htmlFor="invoiceType"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Select Invoice Type *
                              </label>
                              <select
                                id="invoiceType"
                                value={invoiceType}
                                onChange={handleInvoiceTypeChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Invoice Type</option>
                                <option value="product">Product Invoice</option>
                                {/* <option value="service">Service Invoice</option> */}
                              </select>
                            </div>
                          )}

                          {/* Customer Selection - Only show if Customer and Invoice Type are selected */}
                          {entityType === "customer" && invoiceType && (
                            <div>
                              <label
                                htmlFor="customer"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Select Customer *
                              </label>
                              <select
                                id="customer"
                                value={selectedEntity}
                                onChange={handleEntityChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Customer</option>
                                {customers.map((customer, index) => (
                                  <option key={index} value={customer.name}>
                                    {customer.name}{" "}
                                    {customer.phoneNumber
                                      ? `(${customer.phoneNumber})`
                                      : ""}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Vendor Selection - Only show if Vendor is selected */}
                          {entityType === "vendor" && (
                            <div>
                              <label
                                htmlFor="vendor"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Select Vendor *
                              </label>
                              <select
                                id="vendor"
                                value={selectedEntity}
                                onChange={handleEntityChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Vendor</option>
                                {vendors.map((vendor, index) => (
                                  <option key={index} value={vendor.name}>
                                    {vendor.name}{" "}
                                    {vendor.phoneNumber
                                      ? `(${vendor.phoneNumber})`
                                      : ""}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Invoice Number Selection - Only show if Entity is selected */}
                          {selectedEntity && (
                            <div>
                              <label
                                htmlFor="invoiceNumber"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Invoice Number *
                              </label>
                              <select
                                id="invoiceNumber"
                                name="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={handleInvoiceChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Invoice Number</option>
                                {invoices.map((invoice, index) => (
                                  <option
                                    key={index}
                                    value={invoice.invoiceNumber}
                                  >
                                    {invoice.invoiceNumber} - ₹
                                    {invoice.grandTotal ||
                                      invoice.total?.grandTotal ||
                                      0}
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
                                      {(
                                        itemTotals.totalGrossAmount || 0
                                      ).toFixed(2)}
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
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Amount (₹) *
                            </label>
                            <input
                              type="number"
                              id="amount"
                              name="amount"
                              value={formData.amount}
                              onChange={handleInputChange}
                              required
                              min="0"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="reason"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Reason *
                            </label>
                            <input
                              type="text"
                              id="reason"
                              name="reason"
                              value={formData.reason}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                          >
                            Create
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAddModalOpen(false);
                              resetForm();
                              setEntityType("");
                              setInvoiceType("");
                              setSelectedEntity("");
                              setInvoices([]);
                            }}
                            className="mt-3 w-full cursor-pointer inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showItemsModal && (
        <>
          <div className="fixed inset-0 z-20  overflow-y-auto ">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"> </div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-y-scroll shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full max-h-[85vh]">
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
                                    <span
                                      className={
                                        item.finalAmount >= 0
                                          ? "text-green-600 font-bold"
                                          : "text-red-600 font-bold"
                                      }
                                    >
                                      {item.finalAmount >= 0 ? "+" : ""}₹
                                      {(item.finalAmount || 0).toFixed(2)}
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
                      setItemTotals({
                        totalAmount: 0,
                        totalQuantity: 0,
                      });
                      setFormData((prev) => ({
                        ...prev,
                        amount: "",
                      }));
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

      {/* Edit Note Modal */}
      {editModalOpen && currentNote && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
              {/* Modal content would go here, similar to the Add Note Modal */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Edit Credit/Debit Note
                    </h3>
                    {/* Form fields would go here, similar to the Add Note Modal */}
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditModalOpen(false);
                          setCurrentNote(null);
                        }}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedNoteForView && (
        <div className="fixed inset-0 z-30 overflow-y-auto">
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl leading-6 font-bold text-gray-900">
                        {selectedNoteForView.noteType.charAt(0).toUpperCase() +
                          selectedNoteForView.noteType.slice(1)}{" "}
                        Note Details
                      </h3>
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          selectedNoteForView.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedNoteForView.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedNoteForView.status.charAt(0).toUpperCase() +
                          selectedNoteForView.status.slice(1)}
                      </span>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Basic Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Reference Number:
                            </span>
                            <span className="text-gray-900">
                              {selectedNoteForView.referenceNumber}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Title:
                            </span>
                            <span className="text-gray-900">
                              {selectedNoteForView.title}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Date:
                            </span>
                            <span className="text-gray-900">
                              {formatDate(selectedNoteForView.date)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Type:
                            </span>
                            <span className="text-gray-900 capitalize">
                              {selectedNoteForView.type}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Note Type:
                            </span>
                            <span className="text-gray-900 capitalize">
                              {selectedNoteForView.noteType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Amount:
                            </span>
                            <span className="text-gray-900 font-bold">
                              ₹{selectedNoteForView.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Invoice Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Invoice Number:
                            </span>
                            <span className="text-gray-900">
                              {selectedNoteForView.invoiceNumber}
                            </span>
                          </div>
                          {selectedNoteForView.invoiceDetails
                            ?.receiverDetails && (
                            <>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                  Customer/Vendor:
                                </span>
                                <span className="text-gray-900">
                                  {
                                    selectedNoteForView.invoiceDetails
                                      .receiverDetails.name
                                  }
                                </span>

                                {customerCredit && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">
                                    Avail. Credit: ₹
                                    {(
                                      customerCredit.availableCredit || 0
                                    ).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                  GSTIN:
                                </span>
                                <span className="text-gray-900">
                                  {selectedNoteForView.invoiceDetails
                                    .receiverDetails.gstin || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-600">
                                  Phone:
                                </span>
                                <span className="text-gray-900">
                                  {selectedNoteForView.invoiceDetails
                                    .receiverDetails.phoneNumber || "N/A"}
                                </span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Invoice Date:
                            </span>
                            <span className="text-gray-900">
                              {formatDate(
                                selectedNoteForView.invoiceDetails?.date
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">
                              Original Invoice Amount:
                            </span>
                            <span className="text-gray-900 font-bold">
                              ₹
                              {(
                                selectedNoteForView.invoiceDetails
                                  ?.grandTotal ||
                                selectedNoteForView.invoiceDetails
                                  ?.totalPayableAmount ||
                                0
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Totals Summary */}
                    {(selectedNoteForView.totalGrossAmount ||
                      selectedNoteForView.totalTaxAmount) && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h4 className="text-lg font-semibold text-blue-900 mb-3">
                          Amount Breakdown
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <span className="block text-sm font-medium text-blue-600">
                              Gross Amount
                            </span>
                            <span className="text-lg font-bold text-blue-900">
                              ₹
                              {(
                                selectedNoteForView.totalGrossAmount || 0
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="block text-sm font-medium text-blue-600">
                              Tax Amount
                            </span>
                            <span className="text-lg font-bold text-blue-900">
                              ₹
                              {(
                                selectedNoteForView.totalTaxAmount || 0
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="block text-sm font-medium text-blue-600">
                              Total Amount
                            </span>
                            <span className="text-lg font-bold text-blue-900">
                              ₹{selectedNoteForView.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Products/Items Section */}
                    {selectedNoteForView.products &&
                      selectedNoteForView.products.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">
                            Selected Items (
                            {selectedNoteForView.products.length})
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Item
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Original Qty
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    New Qty
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Original Price
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    New Price
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tax Rate
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tax Amount
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Gross Amount
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {selectedNoteForView.products.map(
                                  (product, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-4 py-4 whitespace-nowrap">
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {product.itemName}
                                          </div>
                                          {product.description && (
                                            <div className="text-xs text-gray-500">
                                              {product.description}
                                            </div>
                                          )}
                                          {product.hsnCode && (
                                            <div className="text-xs text-gray-400">
                                              HSN: {product.hsnCode}
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {product.originalQuantity}{" "}
                                        {product.uom && (
                                          <span className="text-xs text-gray-500">
                                            {product.uom}
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        {product.newQuantity}{" "}
                                        {product.uom && (
                                          <span className="text-xs text-gray-500">
                                            {product.uom}
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        ₹
                                        {product.originalSellingPrice?.toLocaleString()}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        ₹
                                        {product.newSellingPrice?.toLocaleString()}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {product.taxRate?.toFixed(2)}%
                                        {(product.cgst > 0 ||
                                          product.sgst > 0) && (
                                          <div className="text-xs text-gray-500">
                                            CGST: {product.cgst}% + SGST:{" "}
                                            {product.sgst}%
                                          </div>
                                        )}
                                        {product.igst > 0 && (
                                          <div className="text-xs text-gray-500">
                                            IGST: {product.igst}%
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        ₹{product.taxAmount?.toLocaleString()}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        ₹{product.grossAmount?.toLocaleString()}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                        ₹
                                        {(
                                          product.totalAmount ||
                                          product.editedAmount
                                        )?.toLocaleString()}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    {/* Original Invoice Items */}
                    {selectedNoteForView.invoiceDetails?.items &&
                      selectedNoteForView.invoiceDetails.items.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">
                            Original Invoice Items (
                            {selectedNoteForView.invoiceDetails.items.length})
                          </h4>
                          <div className="overflow-x-auto max-h-60">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Item
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit Price
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Selling Price
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tax Rate
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {selectedNoteForView.invoiceDetails.items.map(
                                  (item, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-4 py-4 whitespace-nowrap">
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">
                                            {item.itemName}
                                          </div>
                                          {item.description && (
                                            <div className="text-xs text-gray-500">
                                              {item.description}
                                            </div>
                                          )}
                                          {item.hsnCode && (
                                            <div className="text-xs text-gray-400">
                                              HSN: {item.hsnCode}
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.quantity}{" "}
                                        {item.uom && (
                                          <span className="text-xs text-gray-500">
                                            {item.uom}
                                          </span>
                                        )}
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
                                            CGST: {item.cgst}% + SGST:{" "}
                                            {item.sgst}%
                                          </div>
                                        )}
                                        {item.igst > 0 && (
                                          <div className="text-xs text-gray-500">
                                            IGST: {item.igst}%
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                        ₹{item.amount?.toLocaleString()}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    {/* Description and Reason */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Description
                        </h4>
                        <p className="text-gray-700">
                          {selectedNoteForView.description ||
                            "No description provided"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Reason
                        </h4>
                        <p className="text-gray-700">
                          {selectedNoteForView.reason || "No reason provided"}
                        </p>
                      </div>
                    </div>

                    {/* Customer/Vendor Address */}
                    {selectedNoteForView.invoiceDetails?.receiverDetails
                      ?.address && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Address Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-600">
                              Address:
                            </span>
                            <p className="text-gray-700">
                              {
                                selectedNoteForView.invoiceDetails
                                  .receiverDetails.address
                              }
                            </p>
                          </div>
                          {selectedNoteForView.invoiceDetails.receiverDetails
                            .deliveryAddress && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Delivery Address:
                              </span>
                              <p className="text-gray-700">
                                {
                                  selectedNoteForView.invoiceDetails
                                    .receiverDetails.deliveryAddress
                                }
                              </p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.receiverDetails
                            .state && (
                            <div>
                              <span className="font-medium text-gray-600">
                                State:
                              </span>
                              <p className="text-gray-700">
                                {
                                  selectedNoteForView.invoiceDetails
                                    .receiverDetails.state
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Invoice Details */}
                    {selectedNoteForView.invoiceDetails && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Additional Invoice Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedNoteForView.invoiceDetails.location && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Location:
                              </span>
                              <p className="text-gray-700">
                                {selectedNoteForView.invoiceDetails.location}
                              </p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.paymentType && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Payment Type:
                              </span>
                              <p className="text-gray-700 capitalize">
                                {selectedNoteForView.invoiceDetails.paymentType}
                              </p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.taxGroup && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Tax Group:
                              </span>
                              <p className="text-gray-700">
                                {selectedNoteForView.invoiceDetails.taxGroup}
                              </p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.poNumber && (
                            <div>
                              <span className="font-medium text-gray-600">
                                PO Number:
                              </span>
                              <p className="text-gray-700">
                                {selectedNoteForView.invoiceDetails.poNumber}
                              </p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.poDate && (
                            <div>
                              <span className="font-medium text-gray-600">
                                PO Date:
                              </span>
                              <p className="text-gray-700">
                                {formatDate(
                                  selectedNoteForView.invoiceDetails.poDate
                                )}
                              </p>
                            </div>
                          )}
                          {selectedNoteForView.invoiceDetails.vendorCode && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Vendor Code:
                              </span>
                              <p className="text-gray-700">
                                {selectedNoteForView.invoiceDetails.vendorCode}
                              </p>
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
                  onClick={() => exportNoteToPDF(selectedNoteForView)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  <Download />
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

export default CreditDebitNotePage;
