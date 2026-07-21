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
  DeleteForever,
} from "@mui/icons-material";
import { PiRecycleThin } from "react-icons/pi";
import { MdSettingsBackupRestore } from "react-icons/md";
import PdfFormate from "./ViewPDF";

const fetchInvoice = import.meta.env.VITE_BASE_URL_C;
const deleteInvoice = import.meta.env.VITE_BASE_URL_C;
const updateInvoice = import.meta.env.VITE_BASE_URL_C;
const Item_fetch_url = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN;
const ViewInvoicePageS = () => {
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
  const [showDeletedInvoices, setShowDeletedInvoices] = useState(false);

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [items, setItems] = useState([{}]);

  const calculateGrossAmount = (item) => {
    // console.log("item : ", item);

    const quantity = Number(item.quantity) || 0;
    const sellingPrice = Number(item.sellingPrice) || 0;
    const discount = Number(item.discountAmount) || 0;
    const taxRate = Number(item.taxRate) || 0;

    const grossAmount = Number(parseFloat(quantity * sellingPrice).toFixed(2));
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
        items.reduce((total, item) => total + Number(item.grossAmount), 0)
      ) || 0;
    const discount =
      Number(
        items.reduce((total, item) => total + Number(item.discountAmount), 0)
      ) || 0;
    const netAmount = grossAmount - discount;
    const taxAmount =
      Number(
        items.reduce((total, item) => total + Number(item.taxAmount), 0)
      ) || 0;

    const grandTotal = netAmount + taxAmount;

    const totalPayableAmount =
      Number(parseFloat(grandTotal).toFixed(2)) +
      Number(parseFloat(selectedInvoice.transportationCharges).toFixed(2)) +
      Number(selectedInvoice.roundOff) || 0;

    console.log({
      grossAmount,
      discount,
      netAmount,
      taxAmount,
      grandTotal,
      totalPayableAmount,
    });

    setSelectedInvoice((prevInvoice) => ({
      ...prevInvoice,
      discount,
      taxableAmount: netAmount,
      taxAmount,
      grandTotal,
      totalPayableAmount,
    }));
  };

  const handleItemQueryChange = (index, e) => {
    const query = e.target.value;
    const updatedItems = [...selectedInvoice.items];

    updatedItems[index] = {
      ...updatedItems[index],
      query,
      itemName: query, // Sync itemName with query
      filteredSuggestions: [],
    };

    if (query.trim() !== "") {
      const filteredSuggestions = itemsData.filter(
        (item) =>
          item.item_name &&
          item.item_name.toLowerCase().includes(query.toLowerCase())
      );
      updatedItems[index].filteredSuggestions = filteredSuggestions;
    }

    setSelectedInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: updatedItems,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const invoiceItems = [...selectedInvoice.items];

    // console.log("items : ", invoiceItems);

    if (field === "taxRate") {
      if (selectedInvoice.taxGroup === "State Tax") {
        invoiceItems[index] = {
          ...invoiceItems[index],
          cgst: value / 2,
          sgst: value / 2,
          igst: 0,
        };
      } else if (selectedInvoice.taxGroup === "Other Tax") {
        invoiceItems[index] = {
          ...invoiceItems[index],
          cgst: 0,
          sgst: 0,
          igst: value,
        };
      } else {
        invoiceItems[index] = {
          ...invoiceItems[index],
          cgst: 0,
          sgst: 0,
          igst: 0,
        };
      }
    }

    invoiceItems[index] = {
      ...invoiceItems[index],
      [field]: value,
    };

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

    // console.log("updatedItems : ", invoiceItems);

    calculateTotals(invoiceItems);

    setSelectedInvoice((prev) => ({
      ...prev,
      items: invoiceItems,
    }));
  };

  const handleSelect = (index, suggestion) => {
    const updatedItems = [...selectedInvoice.items];

    console.log(suggestion);

    updatedItems[index] = {
      ...updatedItems[index],
      id: suggestion.item_id || updatedItems[index].item_id,
      itemName: suggestion.item_name,
      sellingPrice: suggestion.sellingPrice || 0,
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

    console.log(updatedItems);

    calculateTotals(updatedItems);

    setSelectedInvoice((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleAddItem = () => {
    setSelectedInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: [...prevInvoice.items, {}],
    }));
  };

  const handleDeleteItem = (index) => {
    if (selectedInvoice.items.length === 1) return;

    const updatedItems = selectedInvoice.items.filter((_, i) => i !== index);

    calculateTotals(updatedItems);

    setSelectedInvoice((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // const handleDeleteItem = (index) => {
  //   const updatedItems = [...items];
  //   updatedItems.splice(index, 1);
  //   setItems(updatedItems);
  // };

  const calculateGross = (item) => {
    // If an item is provided, calculate for that item
    if (item) {
      const base = item.quantity * item.sellingPrice;
      const discount = Number(item.discountAmount || 0);
      const tax = ((base - discount) * item.taxRate) / 100;
      return (base - discount + tax).toFixed(2);
    }

    // Otherwise calculate totals for all items
    if (!items || items.length === 0) return { subtotal: 0, tax: 0, total: 0 };

    let subtotal = 0;
    let taxAmount = 0;

    items.forEach((item) => {
      const itemSubtotal =
        item.quantity * item.sellingPrice - (Number(item.discountAmount) || 0);
      subtotal += itemSubtotal;
      taxAmount += (itemSubtotal * item.taxRate) / 100;
    });

    const total = subtotal + taxAmount;

    return {
      subtotal: subtotal.toFixed(2),
      tax: taxAmount.toFixed(2),
      total: total.toFixed(2),
    };
  };

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
      setItemsData(data.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items data");
    }
  };

  const getAllInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${fetchInvoice}/api/v2/invoice/invoices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      // console.log("jsondata", jsonData);

      if (!response.ok) {
        throw new Error(jsonData?.message || "Failed to fetch invoices");
      }
      const sortedInvoices = (jsonData.data || []).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      // setAllInvoice(sortedInvoices);
      // setFilteredInvoices(sortedInvoices);
      setAllInvoice(jsonData.data);
      setFilteredInvoices(jsonData.data);
      // console.log("Invoices:", jsonData.data);
      toast.success("Successfully fetched invoices");
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error.message || "Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInvoices();
  }, []);

  // Apply search and filters
  useEffect(() => {
    let result = [...allinvoice];

    // Filter based on deleted status
    result = result.filter(
      (invoice) => invoice.isDeleted === showDeletedInvoices
    );

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
          invoice.paymentType.toLowerCase() === paymentFilter.toLowerCase()
      );
    }

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      result = result?.filter((invoice) => {
        if (searchField === "all") {
          return (
            (invoice.invoiceNumber &&
              invoice.invoiceNumber.toLowerCase().includes(term)) ||
            (invoice.receiverDetails?.name &&
              invoice.receiverDetails.name.toLowerCase().includes(term)) ||
            (invoice.receiverDetails?.phoneNumber &&
              invoice.receiverDetails.phoneNumber
                .toLowerCase()
                .includes(term)) ||
            (invoice.paymentType &&
              invoice.paymentType.toLowerCase().includes(term)) ||
            (invoice.grandTotal && invoice.grandTotal.toString().includes(term))
          );
        } else if (searchField === "invoiceNumber") {
          return (
            invoice.invoiceNumber &&
            invoice.invoiceNumber.toLowerCase().includes(term)
          );
        } else if (searchField === "customerName") {
          return (
            invoice.receiverDetails?.name &&
            invoice.receiverDetails.name.toLowerCase().includes(term)
          );
        } else if (searchField === "phone") {
          return (
            invoice.receiverDetails?.phoneNumber &&
            invoice.receiverDetails.phoneNumber.toLowerCase().includes(term)
          );
        } else if (searchField === "paymentType") {
          return (
            invoice.paymentType &&
            invoice.paymentType.toLowerCase().includes(term)
          );
        } else if (searchField === "amount") {
          return (
            invoice.grandTotal && invoice.grandTotal.toString().includes(term)
          );
        }
        return false;
      });
    }

    setFilteredInvoices(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    searchTerm,
    searchField,
    allinvoice,
    dateRange,
    paymentFilter,
    showDeletedInvoices,
  ]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

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
    setOpenDialog(true);
    const itemsWithQuery = (invoice.items || []).map((item) => ({
      ...item,
      query: item.itemName || "", // Set query to itemName for display in input field
      filteredSuggestions: [],
    }));

    setItems(itemsWithQuery);
  };

  const handlePrintInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPdfPreview(true);
  };

  // Soft delete secions
  const handleDelete = async (invoice) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await fetch(
          `${deleteInvoice}/api/v2/invoice/softDelete/${invoice._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonData = await response.json();
        // console.log("Delete Response:", jsonData);

        // console.log("Delete Response:", response);

        if (!response.ok) {
          throw new Error(jsonData?.message || "Failed to delete invoice");
        }

        toast.success(jsonData?.message || "Invoice deleted successfully");
        getAllInvoices();
      } catch (error) {
        console.error("Delete Error:", error);
        toast.error(error.message || "Failed to delete invoice");
      }
    }
  };
  //  delete secions
  const permanentDeleteInvoice = async (invoice) => {
    if (
      window.confirm(
        "Are you sure you want to delete this invoice parmanent, you can't restore this invoice again?"
      )
    ) {
      try {
        const response = await fetch(
          `${deleteInvoice}/api/v2/invoice/delete/${invoice._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonData = await response.json();
        // console.log("Delete Response:", jsonData);

        // console.log("Delete Response:", response);

        if (!response.ok) {
          throw new Error(jsonData?.error || "Failed to delete invoice");
        }

        toast.success(jsonData?.message || "Invoice deleted successfully");
        getAllInvoices();
      } catch (error) {
        console.error("Delete Error:", error);
        toast.error(error.message || "Failed to delete invoice");
      }
    }
  };

  const restoreInvoice = async (invoice) => {
    if (window.confirm("Are you sure you want to restore this invoice?")) {
      try {
        const response = await fetch(
          `${deleteInvoice}/api/v2/invoice/restore/${invoice._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonData = await response.json();
        // console.log("Delete Response:", jsonData);

        // console.log("Delete Response:", response);

        if (!response.ok) {
          throw new Error(jsonData?.message || "Failed to restore invoice");
        }

        toast.success(jsonData?.message || "Invoice Restore  successfully");
        getAllInvoices();
      } catch (error) {
        // console.error("Restore Error:", error);
        toast.error(error.message || "Failed to delete invoice");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowPdfPreview(false);
    setSelectedInvoice(null);
    setIsEditMode(false);
    // Reset items when closing the dialog
    setItems([
      {
        itemName: "",
        quantity: 1,
        sellingPrice: 0,
        discountAmount: 0,
        taxRate: 0,
      },
    ]);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsEditMode(true);
    setOpenDialog(true);

    // Set the items state with the selected invoice's items
    // and make sure to set the query field to the item name
    const itemsWithQuery = (invoice.items || []).map((item) => ({
      ...item,
      query: item.itemName || "", // Set query to itemName for display in input field
      filteredSuggestions: [],
    }));

    setItems(itemsWithQuery);
  };

  // Update the formatDate function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const handleSaveEdit = async () => {
    try {
      const totals = calculateGross();

      // Create a complete version of items with all properties
      const completeItems = items.map((item) => {
        // console.log("Item Data from update :", item);
        const originalItemData = itemsData.find(
          (originalItem) => originalItem.item_name === item.itemName
        );

        const grossAmount = item.quantity * item.sellingPrice;
        const discountAmount = Number(item.discountAmount || 0);
        const netAmount = grossAmount - discountAmount;
        const taxAmount = (netAmount * item.taxRate) / 100;

        return {
          id: item.id,
          itemName: item.itemName,
          description: item.description || "",
          quantity: Number(item.quantity),
          uom: item.uom || originalItemData?.uom || "",
          hsnCode: item.hsnCode || originalItemData?.hsnCode || "",
          cgst: Number(item.cgst || 0),
          sgst: Number(item.sgst || 0),
          igst: Number(item.igst || 0),
          unitPrice: Number(item.unitPrice || item.sellingPrice || 0),
          grossAmount: grossAmount,
          discountRate:
            grossAmount > 0
              ? ((discountAmount / grossAmount) * 100).toFixed(2)
              : 0,
          discountAmount: discountAmount,
          netAmount: netAmount,
          taxRate: Number(item.taxRate || 0),
          taxAmount: taxAmount,
          amount: netAmount + taxAmount,
          sellingPrice: Number(item.sellingPrice || 0),
        };
      });
      // Calculate total discount from all items
      const totalDiscount = completeItems.reduce(
        (sum, item) => sum + (parseFloat(item.discountAmount) || 0),
        0
      );

      const updateData = {
        invoiceNumber: selectedInvoice.invoiceNumber,
        date: selectedInvoice.date,
        paymentType: selectedInvoice.paymentType,
        receiverDetails: selectedInvoice.receiverDetails,
        items: completeItems, // Use the complete items with all properties
        taxableAmount: parseFloat(totals.subtotal),
        taxAmount: parseFloat(totals.tax),
        grandTotal: parseFloat(totals.total),
        totalPayableAmount: parseFloat(totals.total),
        roundOff: 0, // update later
        poNumber: selectedInvoice.poNumber || "",
        poDate: selectedInvoice.poDate || null,
        discount: parseFloat(totalDiscount),
      };

      const response = await fetch(
        `${updateInvoice}/api/v2/invoice/update/${selectedInvoice._id}`,
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
        throw new Error(
          jsonData.error || jsonData.message || "Failed to update invoice"
        );
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {showDeletedInvoices ? "Deleted Invoices" : "Invoice Management"}
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
              onClick={() => setShowDeletedInvoices(!showDeletedInvoices)}
              className={`flex items-center cursor-pointer gap-1 px-4 py-2 ${showDeletedInvoices
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
                } rounded hover:bg-gray-200 transition-colors`}
            >
              {showDeletedInvoices ? (
                <MdSettingsBackupRestore fontSize="small" />
              ) : (
                <PiRecycleThin fontSize="small" />
              )}
              {showDeletedInvoices
                ? "View Active Invoices"
                : "View Deleted Invoices"}
            </button>

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
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Customer
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
                          {invoice?.invoiceNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(invoice?.date)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="font-medium">
                            {invoice.receiverDetails.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {invoice.receiverDetails.phoneNumber}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ₹
                          {invoice?.totalPayableAmount.toFixed(2) ||
                            invoice.grandTotal?.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${invoice.paymentType.toLowerCase() === "cash"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                              }`}
                          >
                            {invoice.paymentType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex justify-end gap-2">
                            {showDeletedInvoices ? (
                              <>
                                <IconButton
                                  onClick={() => restoreInvoice(invoice)}
                                  size="small"
                                  className="text-green-500 hover:bg-green-50 "
                                  title="Restore Invoice"
                                >
                                  <MdSettingsBackupRestore
                                    fontSize="small"
                                    className="text-green-500 hover:text-green-700 w-6 h-6"
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    permanentDeleteInvoice(invoice)
                                  }
                                  size="small"
                                  className="text-red-500 hover:bg-red-50 "
                                  title="Delete Invoice permanent "
                                >
                                  <DeleteForever
                                    fontSize="small"
                                    className="text-red-500 hover:text-red-700 w-6 h-6"
                                  />
                                </IconButton>
                              </>
                            ) : (
                              !invoice?.paidOne && (
                                <IconButton
                                  onClick={() => handleDelete(invoice)}
                                  size="small"
                                  className="text-red-500 hover:bg-red-50"
                                  title="Delete Invoice"
                                >
                                  <DeleteIcon
                                    fontSize="small"
                                    className="text-red-500 hover:text-red-700"
                                  />
                                </IconButton>
                              )
                            )}
                            {/* Only show edit button for non-deleted invoices */}
                            {!showDeletedInvoices && (
                              <IconButton
                                onClick={() => handleEditInvoice(invoice)}
                                size="small"
                                className="text-blue-500 hover:bg-blue-50"
                                title="Edit Invoice"
                              >
                                <EditIcon
                                  fontSize="small"
                                  className="text-blue-500 hover:bg-blue-50"
                                />
                              </IconButton>
                            )}
                            <IconButton
                              onClick={() => viewInvoice(invoice)}
                              size="small"
                              className="text-indigo-500 hover:bg-indigo-50"
                              title="View Invoice"
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                              onClick={() => handlePrintInvoice(invoice)}
                              size="small"
                              className="text-green-500 hover:bg-green-50"
                              title="Download Invoice"
                            >
                              <DownloadIcon
                                fontSize="small"
                                className="text-green-500 hover:text-green-700"
                              />
                            </IconButton>
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
            {isEditMode ? "Edit Invoice" : "Invoice Details"}
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Po Date
                        </label>
                        <input
                          type="date"
                          value={selectedInvoice.poDate || ""}
                          // max={new Date().toISOString().split("T")[0]}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              poDate: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Po Number
                        </label>
                        <input
                          type="text"
                          value={selectedInvoice?.poNumber || ""}
                          className="w-full p-2 border rounded "
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              poNumber: e.target.value,
                            })
                          }
                        />
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
                    Customer Details
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
                          Delivery Address
                        </label>
                        <textarea
                          value={selectedInvoice.receiverDetails?.deliveryAddress || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice.receiverDetails,
                                deliveryAddress: e.target.value,
                              },
                            })
                          }
                          placeholder="Delivery Address"
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
              {isEditMode ? (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-3 text-gray-700 border-b pb-2">
                      Items
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full mb-4">
                        <thead>
                          <tr className="bg-gray-100">
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
                          {selectedInvoice.items.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-100 text-sm"
                            >
                              <td className="p-2 relative min-w-68">
                                <input
                                  type="text"
                                  className="w-full border rounded px-2 py-1"
                                  placeholder="Search..."
                                  value={
                                    selectedInvoice.items[index]?.query ||
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
                                    <ul className="absolute w-64 h-64 bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10 max-h-60 overflow-y-auto left-0">
                                      {item.filteredSuggestions.map(
                                        (suggestion, idx) => (
                                          // console.log("suggestion", suggestion),
                                          <li
                                            key={idx}
                                            className="p-2 cursor-pointer  hover:bg-blue-100 text-sm"
                                            onClick={() =>
                                              handleSelect(index, suggestion)
                                            }
                                          >
                                            {suggestion.item_name} (qty:{" "}
                                            {suggestion.quantity}, ₹
                                            {suggestion.sellingPrice})
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                              </td>
                              <td className="p-2 text-left">
                                <input
                                  type="text"
                                  value={
                                    selectedInvoice.items[index]?.hsnCode || ""
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
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  name="quantity"
                                  value={selectedInvoice.items[index]?.quantity}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border px-2 py-1 text-right rounded"
                                />
                              </td>
                              <td className="p-2">
                                {selectedInvoice.items[index]?.uom || "N/A"}
                              </td>
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  name="sellingPrice"
                                  value={
                                    selectedInvoice.items[index]?.sellingPrice
                                  }
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "sellingPrice",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border px-2 py-1 text-right rounded"
                                />
                              </td>
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  name="discountAmount"
                                  value={
                                    selectedInvoice.items[index]?.discountAmount
                                  }
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "discountAmount",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border px-2 py-1 text-right rounded"
                                />
                              </td>
                              <td className="p-2">
                                {selectedInvoice.items[index]?.netAmount || 0}
                              </td>
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  name="taxRate"
                                  value={item.taxRate}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "taxRate",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border px-2 py-1 text-right rounded"
                                />
                              </td>
                              <td className="p-2 text-right">
                                {selectedInvoice.items[index]?.taxAmount || 0}
                              </td>
                              <td className="p-2 text-right font-medium">
                                {selectedInvoice.items[index]?.amount || 0}
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  onClick={() => handleDeleteItem(index)}
                                  className="text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        onClick={handleAddItem}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="w-80 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Gross:</span>
                        <span>
                          ₹
                          {selectedInvoice.items
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
                        <span className="text-gray-600">
                          Transportation Charges:
                        </span>
                        <input
                          type="number"
                          value={selectedInvoice.transportationCharges}
                          onChange={(e) => {
                            const transportationCharges =
                              parseFloat(e.target.value) || 0;
                            const grandTotal =
                              Number(
                                parseFloat(selectedInvoice.grandTotal).toFixed(
                                  2
                                )
                              ) || 0;
                            const roundOff =
                              Number(selectedInvoice.roundOff) || 0;
                            const total = grandTotal + transportationCharges;
                            const decimalPart = grandTotal % 1;
                            let totalPayableAmount = total;

                            if (decimalPart < 0.5) {
                              totalPayableAmount = total - roundOff;
                            } else if (decimalPart >= 0.5) {
                              totalPayableAmount = total + roundOff;
                            }

                            console.log({
                              totalPayableAmount,
                              roundOff,
                              grandTotal,
                              transportationCharges,
                            });

                            setSelectedInvoice((prev) => ({
                              ...prev,
                              transportationCharges,
                              totalPayableAmount,
                            }));
                          }}
                          step={0.01}
                          className="w-[40%] text-right border rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total:</span>
                        <span>
                          ₹
                          {(
                            Number(selectedInvoice.grandTotal) +
                            Number(selectedInvoice.transportationCharges)
                          ).toFixed(2)}
                        </span>
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
                            const transportationCharges =
                              Number(selectedInvoice.transportationCharges) ||
                              0;
                            const total = grandTotal + transportationCharges;
                            const decimalPart = grandTotal % 1;
                            let totalPayableAmount = total;

                            if (decimalPart < 0.5) {
                              totalPayableAmount = total - roundOff;
                            } else if (decimalPart >= 0.5) {
                              totalPayableAmount = total + roundOff;
                            }

                            console.log({
                              totalPayableAmount,
                              roundOff,
                              grandTotal,
                              transportationCharges,
                            });

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
                          ₹
                          {parseFloat(
                            selectedInvoice?.totalPayableAmount
                          ).toFixed(2)}
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
                              Item
                            </th>
                            <th className="p-2 text-left text-gray-600">
                              HSN Code
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Quantity
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
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-100 text-sm"
                            >
                              <td className="p-2 relative min-w-58">
                                <input
                                  type="text"
                                  className="w-full focus:outline-none rounded px-2 py-1"
                                  placeholder="Search..."
                                  value={item.query || ""}
                                  readOnly
                                />
                              </td>
                              <td className="p-2 text-left">
                                <input
                                  type="text"
                                  value={item.hsnCode || ""}
                                  className="w-full focus:outline-none  px-2 py-1"
                                  readOnly
                                />
                              </td>
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  name="quantity"
                                  value={item.quantity}
                                  className="w-full focus:outline-none px-2 py-1 text-right rounded"
                                  readOnly
                                />
                              </td>
                              <td className="p-2">{item?.uom}</td>
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  name="sellingPrice"
                                  value={item.sellingPrice || 0}
                                  className="w-full focus:outline-none px-2 py-1 text-right rounded"
                                  readOnly
                                />
                              </td>
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  name="discountAmount"
                                  value={item.discountAmount}
                                  onChange={(e) =>
                                    handleItemQueryChange(index, e)
                                  }
                                  className="w-full focus:outline-none px-2 py-1 text-right rounded"
                                  readOnly
                                />
                              </td>
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  value={item.netAmount || 0}
                                  className="w-full text-right focus:outline-none px-2 py-1"
                                  readOnly
                                />
                              </td>
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  name="taxRate"
                                  value={item.taxRate}
                                  onChange={(e) =>
                                    handleItemQueryChange(index, e)
                                  }
                                  className="w-full focus:outline-none px-2 py-1 text-right rounded"
                                  readOnly
                                />
                              </td>
                              <td className="p-2 text-right">
                                ₹{item?.taxAmount?.toFixed(2) || 0}
                              </td>
                              <td className="p-2 text-right font-medium">
                                ₹{calculateGross(item)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="flex justify-end">
                        <div className="w-80 bg-gray-50 p-4 rounded-lg">
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
                            <span className="text-gray-600">
                              Transportation Charges:
                            </span>
                            <span>
                              ₹{selectedInvoice.transportationCharges}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Total:</span>
                            <span>
                              ₹
                              {selectedInvoice.grandTotal +
                                Number(selectedInvoice.transportationCharges)}
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
            <PdfFormate invoiceData={selectedInvoice} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ViewInvoicePageS;
