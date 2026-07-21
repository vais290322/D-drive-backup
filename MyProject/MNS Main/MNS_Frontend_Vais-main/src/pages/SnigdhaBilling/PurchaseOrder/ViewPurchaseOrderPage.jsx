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
  Grid,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ContentCopy,
} from "@mui/icons-material";
import axios from "axios";
import { backendDomainA, backendDomainS } from "../../../Common/index";

import { PDFDownloadButton } from "./PurchasePdf";


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
  const [showDialog, setShowDialog] = useState(false);
  // console.log("selectd invoice : ", selectedInvoice);

  const addItem = () => {
    // console.log("Adding item...", selectedInvoice.items);
    setSelectedInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: [...prevInvoice.items, {}],
    }));
  };

  const [items, setItems] = useState([{}]);

  const calculateGrossAmount = (item) => {
    // console.log("item : ", item);

    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discountAmount) || 0;
    const taxRate = Number(item.taxRate) || 0;

    const grossAmount = Number(parseFloat(quantity * unitPrice).toFixed(2));
    const netAmount = Number(parseFloat(grossAmount - discount).toFixed(2));

    const taxAmount = Number(
      parseFloat((netAmount * taxRate) / 100).toFixed(2)
    );

    const amount = Number(parseFloat(netAmount + taxAmount).toFixed(2));

    return {
      grossAmount,
      netAmount,
      taxAmount,
      amount,
    };
  };

  const calculateTotals = (items) => {
    const grossAmount =
      Number(
        items.reduce((total, item) => total + Number(item?.grossAmount || 0), 0)
      ) || 0;
    const discount =
      Number(
        items.reduce((total, item) => total + Number(item?.discountAmount || 0), 0)
      ) || 0;
    const netAmount = grossAmount - discount;
    const taxAmount =
      Number(
        items.reduce((total, item) => total + Number(item?.taxAmount || 0), 0)
      ) || 0;

    const grandTotal = netAmount + taxAmount;

    const totalPayableAmount =
      Number(parseFloat(grandTotal).toFixed(2)) +
      Number(selectedInvoice.roundOff) || 0;

    // console.log({
    //   grossAmount,
    //   discount,
    //   netAmount,
    //   taxAmount,
    //   grandTotal,
    //   totalPayableAmount,
    // });

    setSelectedInvoice((prevInvoice) => ({
      ...prevInvoice,
      discount,
      taxableAmount: netAmount,
      taxAmount,
      grandTotal,
      totalPayableAmount,
    }));
  };

  // Replace the current handleItemQueryChange function with this corrected version
  const handleItemQueryChange = (index, e) => {
    const query = e.target.value;
    const updatedItems = [...selectedInvoice.items];

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

    // console.log("filtered suggestions : ", updatedItems[index].filteredSuggestions)

    setSelectedInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: updatedItems,
    }));
  };
  // console.log("items : ", items);
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
      // console.log("Items Data:", data.data);
      setInventoryItems(data.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items data");
    }
  };

  const handleItemChange = (index, field, value) => {
    const invoiceItems = [...selectedInvoice.items];

    // console.log("items : ", invoiceItems);
    invoiceItems[index] = {
      ...invoiceItems[index],
      [field]: value,
    };

    if(selectedInvoice?.taxGroup === "State Tax"){
      invoiceItems[index] = {
        ...invoiceItems[index],
        cgst: Number(value)/2 || 0,
        sgst: Number(value)/2 || 0,
        igst: 0,
      };

    }else{
      invoiceItems[index] = {
        ...invoiceItems[index],
        cgst: 0,
        sgst: 0,
        igst: Number(value) || 0,
      };
    }

    invoiceItems[index].grossAmount = calculateGrossAmount(
      invoiceItems[index]
    ).grossAmount;
    invoiceItems[index].netAmount = calculateGrossAmount(
      invoiceItems[index]
    ).netAmount;
    invoiceItems[index].taxAmount = calculateGrossAmount(
      invoiceItems[index]
    ).taxAmount;
    invoiceItems[index].amount = calculateGrossAmount(
      invoiceItems[index]
    ).amount;

    console.log("updatedItems : ", invoiceItems);

    calculateTotals(invoiceItems);

    setSelectedInvoice((prev) => ({
      ...prev,
      items: invoiceItems,
    }));
  };

  const deleteItem = (index) => {
    if (selectedInvoice.items.length === 1) return;

    const updatedItems = selectedInvoice.items.filter((_, i) => i !== index);

    calculateTotals(updatedItems);

    setSelectedInvoice((prev) => ({
      ...prev,
      items: updatedItems,
    }));
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

        // toast.success("Successfully fetched purchase orders");
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
    const updatedItems = [...selectedInvoice.items];

    console.log("suggestion : ", suggestion)

    updatedItems[index] = {
      ...updatedItems[index],
      itemName: suggestion.item_name,
      unitPrice: Number(suggestion.unit_prize) || 0,
      taxRate: Number(suggestion.gst) || 0,
      query: suggestion.item_name,
      filteredSuggestions: [],
      group: updatedItems[index].group || suggestion.group || "",
      uom: updatedItems[index].uom || suggestion.uom || "",
      item_id: suggestion.item_id || updatedItems[index].item_id,
      hsnCode: suggestion.hsnCode || "",
      quantity: 1,
      cgst: selectedInvoice.taxGroup === "State Tax" ? Number(suggestion.cgst) || (Number(suggestion.gst) / 2) : 0,
      sgst: selectedInvoice.taxGroup === "State Tax" ? Number(suggestion.sgst) || (Number(suggestion.gst) / 2) : 0,
      igst: selectedInvoice.taxGroup === "Other Tax" ? Number(suggestion.igst) || Number(suggestion.gst) : 0,
    };

    // Calculate gross amount after updating
    updatedItems[index].grossAmount = calculateGrossAmount(
      updatedItems[index]
    ).grossAmount;
    updatedItems[index].netAmount = calculateGrossAmount(
      updatedItems[index]
    ).netAmount;
    updatedItems[index].taxAmount = calculateGrossAmount(
      updatedItems[index]
    ).taxAmount;
    updatedItems[index].amount = calculateGrossAmount(
      updatedItems[index]
    ).amount;

    calculateTotals(updatedItems);

    setSelectedInvoice((prev) => ({
      ...prev,
      items: updatedItems,
    }));
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
        // console.log(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      toast.error("Failed to fetch units");
    }
  };

  const fetchGroup = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/group/all`);
      // console.log(response.data.groups);
      if (response.data && response.data.groups) {
        setGroup(response.data.groups);
        // console.log(response.data.groups);
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

  const handleSaveEditOld = async () => {
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
        uom: item.uom,
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
          return sum + parseFloat(item?.grossAmount || 0);
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

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `${backendDomainS}/api/v1/po/update/${selectedInvoice._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(selectedInvoice),
        }
      );

      const jsonData = await response.json();

      if (!response.ok) {
        throw new Error(jsonData.message || "Failed to update invoice");
      }

      toast.success("Invoice updated successfully");
      setIsEditMode(false);
      getAllInvoices();
      handleCloseDialog();
      setShowDialog(true);
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
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
                <option value={2000}>2000</option>
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
                        Grn No.
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
                      <th className="px-4 py-3 text-end text-sm font-semibold text-gray-600">
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
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {invoice?.grnNumber || "N/A"}
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
                          ₹{invoice?.totalPayableAmount?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${invoice?.paymentType?.toLowerCase() === "cash"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                              }`}
                          >
                            {invoice?.paymentType || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex justify-end gap-2">
                            {!invoice?.paidOne && (
                              <IconButton
                                onClick={(e) => handleDeleteInvoice(invoice, e)}
                                size="small"
                                title="Delete PO"
                              >
                                <DeleteIcon
                                  fontSize="small"
                                  className="text-red-500 hover:bg-red-50"
                                />
                              </IconButton>
                            )}
                            <IconButton
                              onClick={() => handleEditInvoice(invoice)}
                              size="small"
                              title="Edit PO"
                            >
                              <EditIcon
                                fontSize="small"
                                className="text-blue-500 hover:bg-blue-50"
                              />
                            </IconButton>
                            <IconButton
                              onClick={() => viewInvoice(invoice)}
                              size="small"
                              title="View Invoice"
                            >
                              <SearchIcon
                                fontSize="small"
                                className="text-indigo-500 hover:bg-indigo-50"
                              />
                            </IconButton>

                            <IconButton
                              onClick={() => handlePrintInvoice(invoice)}
                              size="small"
                              className="text-green-500 hover:bg-green-50"
                              title="Download Invoice"
                            >
                              <PDFDownloadButton invoice={invoice} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="bg-gray-200 font-semibold">
                      <td
                        colSpan={5}
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
                    className="px-4 py-2 bg-gray-200 cursor-pointer text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
        maxWidth="xl"
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
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
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
                  {selectedInvoice && isEditMode ? (
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
                          Tax Group
                        </label>
                        <select
                          value={selectedInvoice.taxGroup || ""}
                          onChange={(e) => {
                            const taxGroup = e.target.value;
                            const updatedItems = selectedInvoice.items.map(
                              (item) => {
                                const taxRate = Number(item.taxRate) || 0;
                                if (taxGroup === "State Tax") {
                                  return {
                                    ...item,
                                    cgst: taxRate / 2,
                                    sgst: taxRate / 2,
                                    igst: 0,
                                  };
                                } else if (taxGroup === "Other Tax") {
                                  return {
                                    ...item,
                                    cgst: 0,
                                    sgst: 0,
                                    igst: taxRate,
                                  };
                                }
                                return item;
                              }
                            );

                            setSelectedInvoice({
                              ...selectedInvoice,
                              taxGroup,
                              items: updatedItems,
                            });
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="State Tax">State Tax</option>
                          <option value="Other Tax">Other Tax</option>
                        </select>
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
                          Tax Group:
                        </span>{" "}
                        {selectedInvoice?.taxGroup || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Payment Type:
                        </span>{" "}
                        {selectedInvoice?.paymentType || "N/A"}
                      </p>
                      {/* <p>
                        <span className="font-medium text-gray-600">
                          Location:
                        </span>{" "}
                        {selectedInvoice?.location || "N/A"}
                      </p> */}
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3 text-gray-700 border-b pb-2">
                    Vendor Details
                  </h3>
                  {selectedInvoice && isEditMode ? (
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
                          Vendor Code
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={selectedInvoice.vendorCode || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              vendorCode: e.target.value,
                            })
                          }
                          placeholder="Vendor Code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={selectedInvoice.location || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              location: e.target.value,
                            })
                          }
                          placeholder="Location"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor=""
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          State
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={selectedInvoice.receiverDetails?.state || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice.receiverDetails,
                                state: e.target.value,
                              },
                            })
                          }
                          placeholder="State"
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          GSTIN
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          value={selectedInvoice.receiverDetails.gstin || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice.receiverDetails,
                                gstin: e.target.value,
                              },
                            })
                          }
                          placeholder="GSTIN"
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
                          Vendor Code:
                        </span>
                        {selectedInvoice?.vendorCode || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Location:
                        </span>
                        {selectedInvoice?.location || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          State:
                        </span>
                        {selectedInvoice?.receiverDetails?.state || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Phone:
                        </span>
                        {selectedInvoice?.receiverDetails?.phoneNumber || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Address:
                        </span>
                        {selectedInvoice?.receiverDetails?.address || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          GSTIN:
                        </span>
                        {selectedInvoice?.receiverDetails?.gstin || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {selectedInvoice && isEditMode ? (
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
                              Discount (₹)
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Net
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Tax (%)
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Tax Amount
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Amount
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items.map((item, index) => {
                            // console.log(item);
                            return (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-100 text-sm"
                              >
                                <td className="p-2 text-left max-w-28">
                                  <input
                                    type="text"
                                    value={
                                      selectedInvoice.items[index].item_id || ""
                                    }
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

                                <td className="p-2 relative min-w-68">
                                  <input
                                    type="text"
                                    className="w-full border rounded px-2 py-1"
                                    placeholder="Search..."
                                    value={
                                      selectedInvoice.items[index].query ||
                                      selectedInvoice.items[index]?.itemName ||
                                      ""
                                    } // Ensure this is bound to the correct state
                                    onChange={(e) =>
                                      handleItemQueryChange(index, e)
                                    }
                                  />
                                  {selectedInvoice.items[index]
                                    .filteredSuggestions &&
                                    selectedInvoice.items[index]
                                      .filteredSuggestions.length > 0 && (
                                      <ul className="absolute w-64 bg-white border border-gray-200 rounded-md mt-1 shadow-md max-h-60 overflow-y-auto left-0 z-50">
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
                                              (Price:{" "}
                                              {suggestion.unit_prize})
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
                                    value={
                                      selectedInvoice.items[index]?.hsnCode ||
                                      ""
                                    }
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
                                <td className="p-2 text-right max-w-20">
                                  <input
                                    type="number"
                                    value={
                                      selectedInvoice.items[index]?.quantity ||
                                      ""
                                    }
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
                                    value={selectedInvoice.items[index]?.group}
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
                                    {/* Add item's existing group if not in options */}
                                    {item.group &&
                                      !group.some(
                                        (g) => g.groupName === item.group
                                      ) && (
                                        <option value={item.group}>
                                          {item.group}
                                        </option>
                                      )}
                                    {group.map((groupItem, i) => (
                                      <option
                                        key={i}
                                        value={groupItem.groupName}
                                      >
                                        {groupItem.groupName}
                                      </option>
                                    ))}
                                  </select>
                                  {/* Show original group if different */}
                                  {selectedInvoice.items[index]?.group && (
                                    <span className="text-xs text-gray-500">
                                      Original:{" "}
                                      {selectedInvoice.items[index]?.group}
                                    </span>
                                  )}
                                </td>
                                <td className="p-2">
                                  <select
                                    value={
                                      selectedInvoice.items[index]?.uom || ""
                                    }
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "uom",
                                        e.target.value
                                      )
                                    }
                                    className="w-full border rounded px-2 py-1 text-sm"
                                  >
                                    <option value="">Select unit</option>
                                    {/* Add item's existing unit if not in options */}
                                    {item.uom &&
                                      !selectedUnit.some(
                                        (u) => u.name === item.uom
                                      ) && (
                                        <option value={item.uom}>
                                          {item.uom}
                                        </option>
                                      )}
                                    {selectedUnit.map((unit, i) => (
                                      <option key={i} value={unit.name}>
                                        {unit.name}{" "}
                                        {unit.symbol && `(${unit.symbol})`}
                                      </option>
                                    ))}
                                  </select>
                                  {/* Show original unit if different */}
                                  {item.unit && (
                                    <span className="text-xs text-gray-500">
                                      Original:{" "}
                                      {selectedInvoice.items[index]?.unit || ""}
                                    </span>
                                  )}
                                </td>
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={
                                      selectedInvoice.items[index]?.unitPrice ||
                                      0
                                    }
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
                                    value={
                                      selectedInvoice.items[index]
                                        ?.discountAmount || 0
                                    }
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
                                <td className=" text-right">
                                  <input
                                    type="number"
                                    value={
                                      (Number(selectedInvoice.items[index]?.netAmount) ||
                                      0).toFixed(2)
                                    }
                                    min={0}
                                    className="w-20 text-right focus:outline-none py-1"
                                    readOnly
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={
                                      selectedInvoice.items[index]?.taxRate || 0
                                    }
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
                                  ₹
                                  {selectedInvoice.items[
                                    index
                                  ]?.taxAmount?.toFixed(2) || 0}
                                </td>
                                <td className="p-2 text-right font-medium">
                                  ₹
                                  {selectedInvoice.items[
                                    index
                                  ]?.amount?.toFixed(2) || 0}
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
                        <span className="text-gray-600">Gross:</span>
                        <span>
                          ₹
                          {selectedInvoice.items
                            .reduce(
                              (sum, item) =>
                                sum + parseFloat(Number(item.grossAmount) || 0),
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Discount:</span>
                        <span>
                          -₹
                          {selectedInvoice.discount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Taxable:</span>
                        <span>₹{selectedInvoice.taxableAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tax:</span>
                        <span>₹{selectedInvoice.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Grand Total:</span>
                        <span>₹{selectedInvoice.grandTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Round Off:</span>
                        <input
                          type="number"
                          value={selectedInvoice.roundOff}
                          onChange={(e) => {
                            const roundOff = parseFloat(e.target.value) || 0;
                            const grandTotal =
                              Number(
                                parseFloat(selectedInvoice.grandTotal).toFixed(
                                  2
                                )
                              ) || 0;
                            const decimalPart = grandTotal % 1;
                            let totalPayableAmount = grandTotal;

                            if (decimalPart < 0.5 && decimalPart !== 0) {
                              totalPayableAmount = grandTotal - roundOff;
                            } else if (decimalPart >= 0.5) {
                              totalPayableAmount = grandTotal + roundOff;
                            }

                            setSelectedInvoice((prev) => ({
                              ...prev,
                              roundOff,
                              totalPayableAmount,
                            }));
                          }}
                          step={0.01}
                          className="w-[40%] text-right border rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Total Payable:</span>
                        <span>
                          ₹{selectedInvoice?.totalPayableAmount?.toFixed(2)}
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
                              Sl.No
                            </th>
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
                            {/* <th className="p-2 text-left text-gray-600">Group</th> */}
                            <th className="p-2 text-left text-gray-600">
                              Unit
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Price
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Discount (₹)
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Net
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Tax (%)
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Tax Amount
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => {
                            // console.log(item);
                            return (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-100 text-sm"
                              >
                                <td className="p-2 text-left">{index + 1}</td>
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

                                <td className="p-2 relative min-w-58">
                                  <input
                                    type="text"
                                    className="w-full focus:outline-none px-2 py-1"
                                    placeholder="Search..."
                                    value={item.query || ""}
                                    readOnly
                                  />
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

                                <td className="p-2">{item?.uom}</td>
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
                                    value={item.netAmount}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "netAmount",
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
                                  ₹{item?.taxAmount?.toFixed(2) || 0}
                                </td>
                                <td className="p-2 text-right font-medium">
                                  ₹{item?.amount?.toFixed(2) || 0}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      <div className="flex justify-end">
                        <div className="w-64 bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Gross:</span>
                            <span>
                              ₹
                              {items
                                .reduce(
                                  (sum, item) =>
                                    sum + parseFloat(item.grossAmount || 0),
                                  0
                                )
                                .toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Discount:</span>
                            <span>
                              -₹
                              {selectedInvoice.discount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Taxable:</span>
                            <span>
                              ₹{selectedInvoice.taxableAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Tax:</span>
                            <span>
                              ₹
                              {items
                                .reduce((sum, item) => {
                                  const quantity =
                                    parseFloat(item.quantity) || 0;
                                  const unitPrice =
                                    parseFloat(item.unitPrice) || 0;
                                  const discount =
                                    parseFloat(item.discountAmount) || 0;
                                  const taxRate = parseFloat(item.taxRate) || 0;
                                  const subtotal =
                                    quantity * unitPrice - discount;
                                  return sum + (subtotal * taxRate) / 100;
                                }, 0)
                                .toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Grand Total:</span>
                            <span>
                              ₹{selectedInvoice.grandTotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Round Off:</span>
                            <span>₹{selectedInvoice.roundOff.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                            <span>Total Payable:</span>
                            <span>
                              ₹{selectedInvoice.totalPayableAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
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

      {/* {showDialog && (
        <Dialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            elevation: 4,
            sx: {
              borderRadius: "14px",
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "grey.100",
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
            }}
          >
            <span className="text-lg font-semibold">Invoice Preview</span>
            <IconButton
              onClick={() => {
                // console.log("Selected Invoice:", selectedInvoice);
                setSelectedInvoice(null);
                setShowDialog(false);
              }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className="flex items-center gap-2 mt-4">
                  <TextField
                    fullWidth
                    label="Invoice Number"
                    size="small"
                    value={selectedInvoice?.invoiceNumber}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Tooltip title="Copy Invoice Number" arrow>
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedInvoice?.invoiceNumber
                        );
                        toast.success("Invoice Number copied to clipboard");
                      }}
                      sx={{
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "grey.100" },
                      }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="flex items-center gap-2">
                  <TextField
                    fullWidth
                    label="GRN Number"
                    size="small"
                    value={selectedInvoice?.grnNumber}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Tooltip title="Copy GRN Number" arrow>
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedInvoice?.grnNumber
                        );
                        toast.success("GRN Number copied to clipboard");
                      }}
                      sx={{
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "grey.100" },
                      }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )} */}
    </div>
  );
}
