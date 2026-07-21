import React, { useEffect, useState, useRef } from "react";
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
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import axios from "axios";
import { backendDomainA, backendDomainS } from "../../../common";

import { PDFDownloadButton } from "./PurchasePdf";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

// const fetchPurchesOrder = import.meta.env.VITE_REACT_PO_FETCH_ITEMS;
// const deleteInvoice = import.meta.env.VITE_BASE_URL_C;
const updateInvoice = import.meta.env.VITE_BASE_URL_C;
const Item_fetch_url = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN;
const apiUrl = import.meta.env.VITE_BASE_URL_Local;
export default function ViewPurchaseOrderPage() {
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [group, setGroup] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [allinvoice, setAllInvoice] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRef = useRef(null);

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [inventoryItems, setInventoryItems] = useState([]);
  console.log("selectd : ", selectedInvoice);

  const addItem = () => {
    setItems([
      ...items,
      {
        itemName: "",
        group: "",
        unit: "",
        quantity: 1,
        unitPrice: 0,
        discountAmount: 0,
        taxRate: 0,
        grossAmount: 0,
        hsnCode: "", // Add hsnCode property
      },
    ]);
  };
  const [items, setItems] = useState([
    {
      itemName: "",
      quantity: 1,
      item_id: "",
      group: "",
      unit: "",
      unitPrice: 0,
      discountAmount: 0,
      taxRate: 0,
      grossAmount: 0,
      query: "",
      filteredSuggestions: [],
      hsnCode: "", // Add hsnCode property
    },
  ]);
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get(
          `${backendDomainS}/api/v1/inventory/all`
        );
        if (response.data && Array.isArray(response.data.items)) {
          setInventoryItems(response.data.items);
        }
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };

    fetchInventoryItems();
  }, []);
  const calculateGrossAmount = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const discount = parseFloat(item.discountAmount) || 0;
    const taxRate = parseFloat(item.taxRate) || 0;

    const subtotal = quantity * unitPrice - discount;
    const tax = (subtotal * taxRate) / 100;
    return (subtotal + tax).toFixed(2);
  };
  // Replace the current handleItemQueryChange function with this corrected version
  const handleItemQueryChange = (index, e) => {
    const query = e.target.value;
    const updatedItems = [...items];

    // Update both query and itemName when typing
    updatedItems[index] = {
      ...updatedItems[index],
      query,
      itemName: query, // Sync itemName with query
      filteredSuggestions: [],
    };

    if (query.trim() !== "") {
      const filteredSuggestions = inventoryItems.filter(
        (item) =>
          item.item_name &&
          item.item_name.toLowerCase().includes(query.toLowerCase())
      );
      updatedItems[index].filteredSuggestions = filteredSuggestions;
    }

    setItems(updatedItems);
  };
  console.log("items : ", items);
  // Fetch items data when component mounts
  useEffect(() => {
    fetchItemsData(); // Fetch items when component mounts
  }, []);

  const fetchItemsData = async () => {
    try {
      const response = await fetch(`${Item_fetch_url}`);
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      console.log("Items Data:", data.data);
      setInventoryItems(data.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items data");
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    updatedItems[index].grossAmount = calculateGrossAmount(updatedItems[index]);
    setItems(updatedItems);
  };

  const deleteItem = (index) => {
    if (items.length === 1) {
      return;
    }
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const getAllInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendDomainS}/api/v1/po/all`);

      if (response && response.data) {
        // Check if response.data.purchaseOrders exists and is an array
        const purchaseOrders = response.data.purchaseOrders;
        const invoiceData = Array.isArray(purchaseOrders) ? purchaseOrders : [];

        setAllInvoice(invoiceData);
        setFilteredInvoices(invoiceData);
        // console.log("All Invoices:", invoiceData);

        toast.success("Successfully fetched purchase orders");
      } else {
        setAllInvoice([]);
        setFilteredInvoices([]);
        toast.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      setAllInvoice([]);
      setFilteredInvoices([]);
      toast.error("Failed to fetch purchase orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInvoices();
  }, []);

  // Apply search and filters
  useEffect(() => {
    // Make sure allinvoice is an array before spreading
    let result = Array.isArray(allinvoice) ? [...allinvoice] : [];

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // Set to end of day

      result = result.filter((invoice) => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
    }

    // Apply payment type filter
    if (paymentFilter !== "all") {
      result = result.filter(
        (invoice) =>
          invoice.paymentType?.toLowerCase() === paymentFilter.toLowerCase()
      );
    }

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      result = result?.filter((invoice) => {
        if (searchField === "all") {
          return (
            (invoice?.invoiceNumber &&
              invoice?.invoiceNumber?.toLowerCase()?.includes(term)) ||
            (invoice?.receiverDetails?.name &&
              invoice?.receiverDetails?.name?.toLowerCase()?.includes(term)) ||
            (invoice?.receiverDetails?.phoneNumber &&
              invoice?.receiverDetails?.phoneNumber
                ?.toLowerCase()
                ?.includes(term)) ||
            (invoice?.paymentType &&
              invoice?.paymentType?.toLowerCase()?.includes(term)) ||
            (invoice?.grandTotal &&
              invoice?.grandTotal?.toString()?.includes(term))
          );
        } else if (searchField === "invoiceNumber") {
          return (
            invoice?.invoiceNumber &&
            invoice?.invoiceNumber?.toLowerCase()?.includes(term)
          );
        } else if (searchField === "customerName") {
          return (
            invoice?.receiverDetails?.name &&
            invoice?.receiverDetails?.name?.toLowerCase()?.includes(term)
          );
        } else if (searchField === "phone") {
          return (
            invoice?.receiverDetails?.phoneNumber &&
            invoice?.receiverDetails?.phoneNumber?.toLowerCase()?.includes(term)
          );
        } else if (searchField === "paymentType") {
          return (
            invoice?.paymentType &&
            invoice?.paymentType?.toLowerCase()?.includes(term)
          );
        } else if (searchField === "amount") {
          return (
            invoice?.grandTotal &&
            invoice?.grandTotal?.toString()?.includes(term)
          );
        }
        return false;
      });
    }

    setFilteredInvoices(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, searchField, allinvoice, dateRange, paymentFilter]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Ensure filteredInvoices is an array before calling slice
  const currentItems = Array.isArray(filteredInvoices)
    ? filteredInvoices.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(
    (Array.isArray(filteredInvoices) ? filteredInvoices?.length : 0) /
      itemsPerPage
  );
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSearchField("all");
    setDateRange({ from: "", to: "" });
    setPaymentFilter("all");
    setFilteredInvoices(allinvoice);
  };

  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    // Set items from the selected invoice if available, otherwise use default
    if (invoice.items && invoice.items.length > 0) {
      // Add query and filteredSuggestions properties to each item
      const itemsWithQuery = invoice.items.map((item) => ({
        ...item,
        query: item.itemName || "",
        filteredSuggestions: [],
      }));
      setItems(itemsWithQuery);
    } else {
      setItems([
        {
          itemName: "",
          quantity: 1,
          unitPrice: 0,
          discountAmount: 0,
          taxRate: 0,
          grossAmount: 0,
          query: "",
          filteredSuggestions: [],
          hsnCode: "",
        },
      ]);
    }
    setOpenDialog(true);
  };

  const handlePrintInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    const link = document.createElement("a");
    link.innerHTML = "<PDFDownloadButton invoice={invoice} />";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowPdfPreview(false);
    setSelectedInvoice(null);
    setIsEditMode(false);
    // Reset items to default when closing dialog
    setItems([
      {
        itemName: "",
        quantity: 1,
        unitPrice: 0,
        discountAmount: 0,
        taxRate: 0,
        grossAmount: 0,
      },
    ]);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    // Set items from the selected invoice if available, otherwise use default
    if (invoice.items && invoice.items.length > 0) {
      const itemsWithQuery = invoice.items.map((item) => ({
        ...item,
        query: item.itemName || "",
        filteredSuggestions: [],
        itemName: item.itemName || "", // Ensure itemName is included
      }));
      setItems(itemsWithQuery);
    } else {
      setItems([
        {
          itemName: "", // Include itemName in default structure
          quantity: 1,
          unitPrice: 0,
          discountAmount: 0,
          taxRate: 0,
          grossAmount: 0,
          query: "",
          filteredSuggestions: [],
          hsnCode: "",
        },
      ]);
    }
    setIsEditMode(true);
    setOpenDialog(true);
  };
  const handleSelect = (index, suggestion) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      itemName: suggestion.item_name,
      unitPrice: suggestion.sellingPrice || 0,
      query: suggestion.item_name,
      filteredSuggestions: [],
      group: suggestion.group || updatedItems[index].group,
      unit: suggestion.unit || updatedItems[index].unit,
      item_id: suggestion.item_id || updatedItems[index].item_id,
      hsnCode: suggestion.hsnCode || "", // Ensure hsnCode is included
    };

    // Calculate gross amount after updating
    updatedItems[index].grossAmount = calculateGrossAmount(updatedItems[index]);

    setItems(updatedItems);
  };
  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await axios.get(
        `${backendDomainA}/api/v1/units/all-units`
      );
      if (response.data && response.data.data) {
        setSelectedUnit(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      toast.error("Failed to fetch units");
    }
  };
  const fetchGroup = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/group/all`);
      console.log(response.data.groups);
      if (response.data && response.data.groups) {
        setGroup(response.data.groups);
        console.log(response.data.groups);
      }
    } catch (error) {
      console.error("Error fetching group:", error);
      toast.error("Failed to fetch group");
    }
  };
  useEffect(() => {
    fetchGroup();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSaveEdit = async () => {
    try {
      // for (const item of items) {
      //   if (!item.itemName || !item.hsnCode) {
      //     toast.error("Item Name and HSN Code are required for all items.");
      //     return;
      //   }
      // }

      const cleanedItems = items.map((item) => ({
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountAmount: item.discountAmount,
        taxRate: item.taxRate,
        grossAmount: item.grossAmount,
        amount: item.grossAmount,
        group: item.group,
        unit: item.unit,
        item_id: item.item_id || "",
        hsnCode: item.hsnCode, // Ensure hsnCode is used consistently
      }));

      const updateData = {
        invoiceNumber: selectedInvoice.invoiceNumber,
        date: selectedInvoice.date,
        paymentType: selectedInvoice.paymentType,
        receiverDetails: selectedInvoice.receiverDetails,
        items: cleanedItems, // Use cleaned items
        taxableAmount: items.reduce((sum, item) => {
          const quantity = parseFloat(item.quantity) || 0;
          const unitPrice = parseFloat(item.unitPrice) || 0;
          const discount = parseFloat(item.discountAmount) || 0;
          return sum + (quantity * unitPrice - discount);
        }, 0),
        grandTotal: items.reduce((sum, item) => {
          return sum + parseFloat(item.grossAmount || 0);
        }, 0),
      };

      // console.log("Update Data:", updateData);

      const response = await fetch(
        `${backendDomainS}/api/v1/po/update/${selectedInvoice._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const jsonData = await response.json();

      if (!response.ok) {
        throw new Error(jsonData.message || "Failed to update invoice");
      }

      toast.success("Invoice updated successfully");
      setIsEditMode(false);
      getAllInvoices(); // Refresh the list
      handleCloseDialog();
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message || "Failed to update invoice");
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const handleDeleteInvoice = (invoice, event) => {
    event.stopPropagation();
    setInvoiceToDelete(invoice);
    setOpenDeleteDialog(true);
  };
  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${updateInvoice}/s/api/v1/po/delete/${invoiceToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const jsonData = await response.json();

      if (!response.ok) {
        throw new Error(jsonData.message || "Failed to delete purchase order");
      }

      toast.success("Purchase order deleted successfully");
      setOpenDeleteDialog(false);
      setInvoiceToDelete(null);
      getAllInvoices(); // Refresh the list
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.message || "Failed to delete purchase order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Purchase Management for snigdha
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
            <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <option value="cash">Cash</option>
                  <option value="credit">Credit</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredInvoices?.length > 0 ? indexOfFirstItem + 1 : 0}{" "}
              to {Math.min(indexOfLastItem, filteredInvoices?.length)} of{" "}
              {filteredInvoices?.length} invoices
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
            {filteredInvoices?.length === 0 ? (
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
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Vendor
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Amount
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
                    {currentItems.map((invoice, index) => (
                      <tr
                        key={invoice._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {invoice?.invoiceNumber || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(invoice?.date)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="font-medium">
                            {invoice?.receiverDetails?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {invoice?.receiverDetails?.phoneNumber}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ₹{invoice?.grandTotal?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              invoice?.paymentType?.toLowerCase() === "cash"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {invoice?.paymentType || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex justify-center gap-2">
                            <IconButton
                              onClick={() => handleEditInvoice(invoice)}
                              size="small"
                              className="text-blue-500 hover:bg-blue-50"
                              title="Edit PO"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => viewInvoice(invoice)}
                              size="small"
                              className="text-indigo-500 hover:bg-indigo-50"
                              title="View Invoice"
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={(e) => handleDeleteInvoice(invoice, e)}
                              size="small"
                              className="text-red-500 hover:bg-red-50"
                              title="Delete PO"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            {/* <IconButton
                              onClick={() => handlePrintInvoice(invoice)}
                              size="small"
                              className="text-green-500 hover:bg-green-50"
                              title="Download Invoice"
                            >
                              <PDFDownloadButton invoice={invoice} />
                            </IconButton> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="bg-gray-200 font-semibold">
                      <td
                        colSpan={4}
                        className="px-4 py-3 text-right text-gray-700"
                      >
                        Total Amount:
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-bold">
                        ₹
                        {currentItems
                          .reduce(
                            (total, invoice) =>
                              total + (invoice.grandTotal || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
            {/* Delete Confirmation Dialog */}
            <Dialog
              open={openDeleteDialog}
              onClose={() => setOpenDeleteDialog(false)}
              maxWidth="sm"
              PaperProps={{
                style: { borderRadius: "12px" },
              }}
            >
              <DialogTitle className="bg-red-50 text-red-700">
                Confirm Delete
              </DialogTitle>
              <DialogContent className="pt-4">
                <p className="mb-4">
                  Are you sure you want to delete this purchase order? This
                  action cannot be undone.
                </p>
                {invoiceToDelete && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p>
                      <span className="font-medium">Invoice Number:</span>{" "}
                      {invoiceToDelete.invoiceNumber}
                    </p>
                    <p>
                      <span className="font-medium">Vendor:</span>{" "}
                      {invoiceToDelete.receiverDetails?.name}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> ₹
                      {invoiceToDelete.grandTotal?.toFixed(2)}
                    </p>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setOpenDeleteDialog(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </DialogContent>
            </Dialog>
            {/* Pagination */}
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
            </div>
          </>
        )}
      </div>

      {/* Invoice Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { borderRadius: "12px" },
        }}
      >
        <DialogTitle className="flex items-center justify-between bg-gray-50 border-b">
          <span className="text-xl font-semibold">
            {isEditMode ? "Edit PO" : "PO Details"}
          </span>
          <div>
            {isEditMode && (
              <button
                onClick={handleSaveEdit}
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Save Changes
              </button>
            )}
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3 text-gray-700 border-b pb-2">
                    Invoice Information
                  </h3>
                  {isEditMode ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Invoice Number
                        </label>
                        <input
                          type="text"
                          value={selectedInvoice?.invoiceNumber || ""}
                          className="w-full p-2 border rounded bg-gray-100"
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              invoiceNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={selectedInvoice.date || ""}
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              date: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Type
                        </label>
                        <select
                          value={selectedInvoice.paymentType || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              paymentType: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        >
                          <option value="cash">Cash</option>
                          <option value="credit">Credit</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium text-gray-600">
                          Invoice Number:
                        </span>{" "}
                        {selectedInvoice?.invoiceNumber || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Date:</span>{" "}
                        {formatDate(selectedInvoice?.date)}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Payment Type:
                        </span>{" "}
                        {selectedInvoice?.paymentType || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Location:
                        </span>{" "}
                        {selectedInvoice?.location || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3 text-gray-700 border-b pb-2">
                    Vendor Details
                  </h3>
                  {isEditMode ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vendor Name
                        </label>
                        <input
                          type="text"
                          value={selectedInvoice.receiverDetails?.name || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice.receiverDetails,
                                name: e.target.value,
                              },
                            })
                          }
                          placeholder="Vendor Name"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={
                            selectedInvoice?.receiverDetails?.phoneNumber || ""
                          }
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice.receiverDetails,
                                phoneNumber: e.target.value,
                              },
                            })
                          }
                          placeholder="Phone Number"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          value={selectedInvoice.receiverDetails?.address || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice.receiverDetails,
                                address: e.target.value,
                              },
                            })
                          }
                          placeholder="Address"
                          className="w-full p-2 border rounded"
                          rows="3"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium text-gray-600">Name:</span>{" "}
                        {selectedInvoice?.receiverDetails?.name || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Phone:
                        </span>{" "}
                        {selectedInvoice?.receiverDetails?.phoneNumber || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Address:
                        </span>{" "}
                        {selectedInvoice?.receiverDetails?.address || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {isEditMode ? (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-3 text-gray-700 border-b pb-2">
                      Items
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full mb-4">
                        <thead>
                          <tr className="bg-gray-100 text-sm">
                            <th className="p-2 text-left text-gray-600">
                              Item id
                            </th>
                            <th className="p-2 text-left text-gray-600">
                              Item
                            </th>
                            <th className="p-2 text-left text-gray-600">
                              HSN Code
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Quantity
                            </th>
                            <th className="p-2 text-left text-gray-600">
                              Group
                            </th>
                            <th className="p-2 text-left text-gray-600">
                              Unit
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Price
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Discount
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Tax (%)
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Gross
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => {
                            console.log(item);
                            return (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-100 text-sm"
                              >
                                <td className="p-2 text-left">
                                  <input
                                    type="text"
                                    value={item.item_id || ""}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "item_id",
                                        e.target.value
                                      )
                                    }
                                    className="w-full border rounded px-2 py-1"
                                  />
                                </td>

                                <td className="p-2 relative">
                                  <input
                                    type="text"
                                    className="w-full border rounded px-2 py-1"
                                    placeholder="Search..."
                                    value={item.query || item.itemName} // Ensure this is bound to the correct state
                                    onChange={(e) =>
                                      handleItemQueryChange(index, e)
                                    }
                                  />
                                  {item.filteredSuggestions &&
                                    item.filteredSuggestions.length > 0 && (
                                      <ul className="absolute w-64 bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10 max-h-60 overflow-y-auto left-0">
                                        {item.filteredSuggestions.map(
                                          (suggestion, idx) => (
                                            <li
                                              key={idx}
                                              className="p-2 cursor-pointer hover:bg-blue-100"
                                              onClick={() =>
                                                handleSelect(index, suggestion)
                                              }
                                            >
                                              {suggestion.item_name} (quantity:{" "}
                                              {suggestion.quantity})
                                              (sellingPrice:{" "}
                                              {suggestion.sellingPrice})
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                </td>
                                <td className="p-2 text-left">
                                  {" "}
                                  {/* Add HSN Code input */}
                                  <input
                                    type="text"
                                    value={item.hsnCode || ""}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "hsnCode",
                                        e.target.value
                                      )
                                    }
                                    className="w-full border rounded px-2 py-1"
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-right border rounded px-2 py-1"
                                  />
                                </td>
                                <td className="p-2">
                                  <select
                                    value={item.group}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "group",
                                        e.target.value
                                      )
                                    }
                                    className="w-full border rounded px-2 py-1 text-sm"
                                  >
                                    <option value="">Select group</option>
                                    {group.map((groupItem, i) => (
                                      <option
                                        key={i}
                                        value={groupItem.groupName}
                                      >
                                        {groupItem.groupName}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="p-2">
                                  <select
                                    value={item.unit}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "unit",
                                        e.target.value
                                      )
                                    }
                                    className="w-full border rounded px-2 py-1 text-sm"
                                  >
                                    <option value="">Select unit</option>
                                    {selectedUnit.map((unit, i) => (
                                      <option key={i} value={unit.name}>
                                        {unit.name}{" "}
                                        {unit.symbol && `(${unit.symbol})`}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "unitPrice",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-right border rounded px-2 py-1"
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={item.discountAmount}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "discountAmount",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-right border rounded px-2 py-1"
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={item.taxRate}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "taxRate",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-right border rounded px-2 py-1"
                                  />
                                </td>
                                <td className="p-2 text-right font-medium">
                                  ₹{item.grossAmount}
                                </td>
                                <td className="p-2 text-center">
                                  <button
                                    onClick={() => deleteItem(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      <div className="text-right">
                        <button
                          onClick={addItem}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Add Item
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="w-64 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>
                          ₹
                          {items
                            .reduce((sum, item) => {
                              const quantity = parseFloat(item.quantity) || 0;
                              const unitPrice = parseFloat(item.unitPrice) || 0;
                              const discount =
                                parseFloat(item.discountAmount) || 0;
                              return sum + (quantity * unitPrice - discount);
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tax:</span>
                        <span>
                          ₹
                          {items
                            .reduce((sum, item) => {
                              const quantity = parseFloat(item.quantity) || 0;
                              const unitPrice = parseFloat(item.unitPrice) || 0;
                              const discount =
                                parseFloat(item.discountAmount) || 0;
                              const taxRate = parseFloat(item.taxRate) || 0;
                              const subtotal = quantity * unitPrice - discount;
                              return sum + (subtotal * taxRate) / 100;
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>
                          ₹
                          {items
                            .reduce((sum, item) => {
                              return sum + parseFloat(item.grossAmount || 0);
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-3 text-gray-700 border-b pb-2">
                      Items
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full mb-4">
                        <thead>
                          <tr className="bg-gray-100 text-sm">
                            <th className="p-2 text-left text-gray-600">
                              Item id
                            </th>
                            <th className="p-2 text-left text-gray-600">
                              Item
                            </th>
                            <th className="p-2 text-left text-gray-600">
                              HSN Code
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Quantity
                            </th>
                            {/* <th className="p-2 text-left text-gray-600">Group</th>
                        <th className="p-2 text-left text-gray-600">Unit</th> */}
                            <th className="p-2 text-right text-gray-600">
                              Price
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Discount
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Tax (%)
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Gross
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => {
                            console.log(item);
                            return (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-100 text-sm"
                              >
                                <td className="p-2 text-left">
                                  <input
                                    type="text"
                                    value={item.item_id || ""}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "item_id",
                                        e.target.value
                                      )
                                    }
                                    className="w-full focus:outline-none px-2 py-1"
                                    readOnly
                                  />
                                </td>

                                <td className="p-2 relative">
                                  <input
                                    type="text"
                                    className="w-full focus:outline-none px-2 py-1"
                                    placeholder="Search..."
                                    value={item.query || ""} // Ensure this is bound to the correct state
                                    onChange={(e) =>
                                      handleItemQueryChange(index, e)
                                    }
                                  />
                                  {item.filteredSuggestions &&
                                    item.filteredSuggestions.length > 0 && (
                                      <ul className="absolute w-64 bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10 max-h-60 overflow-y-auto left-0">
                                        {item.filteredSuggestions.map(
                                          (suggestion, idx) => (
                                            <li
                                              key={idx}
                                              className="p-2 cursor-pointer hover:bg-blue-100"
                                              onClick={() =>
                                                handleSelect(index, suggestion)
                                              }
                                            >
                                              {suggestion.item_name} (quantity:{" "}
                                              {suggestion.quantity})
                                              (sellingPrice:{" "}
                                              {suggestion.sellingPrice})
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                </td>
                                <td className="p-2 text-left">
                                  {" "}
                                  {/* Add HSN Code input */}
                                  <input
                                    type="text"
                                    value={item.hsnCode || ""}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "hsnCode",
                                        e.target.value
                                      )
                                    }
                                    className="w-full focus:outline-none  px-2 py-1"
                                    readOnly
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-right focus:outline-none px-2 py-1"
                                    readOnly
                                  />
                                </td>
                                {/* <td className="p-2">
                              <select
                                value={item.group}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "group",
                                    e.target.value
                                  )
                                }
                                className="w-full focus:outline-none px-2 py-1 text-sm"
                                readOnly
                              >
                                <option value="">Select group</option>
                                {group.map((groupItem, i) => (
                                  <option key={i} value={groupItem.groupName}>
                                    {groupItem.groupName}
                                  </option>
                                ))}
                              </select>
                            </td> */}
                                {/* <td className="p-2">
                              <select
                                value={item.unit}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "unit",
                                    e.target.value
                                  )
                                }
                                className="w-full focus:outline-none px-2 py-1 text-sm"
                                readOnly
                              >
                                <option value="">Select unit</option>
                                {selectedUnit.map((unit, i) => (
                                  <option key={i} value={unit.name}>
                                    {unit.name}{" "}
                                    {unit.symbol && `(${unit.symbol})`}
                                  </option>
                                ))}
                              </select>
                            </td> */}
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "unitPrice",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-right focus:outline-none px-2 py-1"
                                    readOnly
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={item.discountAmount}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "discountAmount",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-right focus:outline-none px-2 py-1"
                                    readOnly
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={item.taxRate}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "taxRate",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-right focus:outline-none px-2 py-1"
                                    readOnly
                                  />
                                </td>
                                <td className="p-2 text-right font-medium">
                                  ₹{item.grossAmount}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      {showPdfPreview && selectedInvoice && (
        <Dialog
          open={showPdfPreview}
          onClose={() => setShowPdfPreview(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            style: { borderRadius: "12px" },
          }}
        >
          <DialogTitle className="flex justify-between items-center bg-gray-50 border-b">
            <span className="text-xl font-semibold">Invoice Preview</span>
            <IconButton onClick={() => setShowPdfPreview(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {/* Uncomment and use the appropriate PDF component */}
            {/* <MnsProductPdf invoiceData={selectedInvoice} /> */}
            <div className="p-4 text-center">
              <p>
                <PDFDownloadButton invoice={selectedInvoice} />
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
