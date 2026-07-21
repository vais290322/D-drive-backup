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
import PdfFormate from "./PdfFormate";
import MnsProductPdf from "./MnsProductPdf";

const fetchInvoice = import.meta.env.VITE_REACT_FETCH_INVOICE_MNS;
const deleteInvoice = import.meta.env.VITE_BASE_URL_C;
const updateInvoice = import.meta.env.VITE_BASE_URL_C;
const Item_fetch_url = import.meta.env.VITE_REACT_FETCH_ITEMS;

const ViewInvoicePageS = () => {
  const [itemsData, setItemsData] = useState([]);
  const [allinvoice, setAllInvoice] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  //  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRef = useRef(null);

  console.log("current items new : ", filteredInvoices);
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      const filtered = top100Films.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (index, suggestion) => {
    if (!suggestion) return;

    console.log("Selected suggestion:", suggestion); // Log the suggestion to see all available fields

    // Create a copy of the items array
    const updatedItems = [...selectedInvoice.items];

    // Update the selected item with the suggestion data
    updatedItems[index] = {
      ...updatedItems[index],
      itemName: suggestion.item_name || "",
      sellingPrice: suggestion.sellingPrice || 0,
      quantity: 1,
      discountAmount: 0,
      taxRate: suggestion.taxRate || 0,
      query: suggestion.item_name || "",
      filteredSuggestions: [],
      cgst: suggestion.cgst || 0,
      group: suggestion.group || "",
      gst: suggestion.gst || 0,
      hsnCode: suggestion.hsnCode || "", // Ensure hsnCode is set from suggestion
      igst: suggestion.igst || 0,
      item_id: suggestion.item_id || 0,
      unit_prize: suggestion.unit_prize || "",
      openningStock: suggestion.openningStock || 0,
      discount: suggestion.discount || 0,
      total_prize: suggestion.total_prize || 0,
      taxAmount: suggestion.taxAmount || 0,
      grossAmount: suggestion.grossAmount || 0,
      uom: suggestion.uom || "", // Ensure uom is set from suggestion
      netAmount: suggestion.netAmount || 0,
      sgst: suggestion.sgst || 0,
    };

    // Update the selectedInvoice with the new items array
    setSelectedInvoice({
      ...selectedInvoice,
      items: updatedItems,
    });
  };

  const [selectedInvoice, setSelectedInvoice] = useState({
    items: [
      {
        itemName: "",
        quantity: 1,
        sellingPrice: 0,
        discountAmount: 0,
        taxRate: 0,
        taxAmount: 0,
        grossAmount: 0,
        query: "", // Add empty query
        filteredSuggestions: [], // Add empty suggestions array
        cgst: 0,
        group: "",
        gst: 0,
        hsnCode: "",
        igst: 0,
        item_id: "",
        unit_prize: "",
        openningStock: 0,
        discount: 0,
        total_prize: 0,
        taxAmount: 0,
        grossAmount: 0,
        uom: "",
        netAmount: 0,
        sgst: 0,
      },
    ],
  });

  console.log("selected invoice new : ", selectedInvoice);

  const handleRemoveItem = (index) => {
    if (!selectedInvoice || selectedInvoice.items.length <= 1) return;

    const updatedItems = selectedInvoice.items.filter((_, i) => i !== index);

    setSelectedInvoice({
      ...selectedInvoice,
      items: updatedItems,
    });
  };

  const handleItemQueryChange = (index, e) => {
    const value = e.target.value;

    // Create a copy of the items array
    const updatedItems = [...selectedInvoice.items];

    // Update the query for this specific item
    updatedItems[index] = {
      ...updatedItems[index],
      query: value,
      filteredSuggestions: value
        ? itemsData.filter(
            (item) =>
              item.item_name &&
              item.item_name.toLowerCase().includes(value.toLowerCase())
          )
        : [],
    };

    // console.log(
    //   "Filtered suggestions:",
    //   updatedItems[index].filteredSuggestions
    // );

    // Update the selectedInvoice with the new items array
    setSelectedInvoice({
      ...selectedInvoice,
      items: updatedItems,
    });
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
      console.log("Items Data:", data.data);
      setItemsData(data.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items data");
    }
  };

  // console.log("selectedInvoice", selectedInvoice);
  const handleAddItem = () => {
    if (!selectedInvoice) return;

    setSelectedInvoice({
      ...selectedInvoice,
      items: [
        ...selectedInvoice.items,
        {
          itemName: "",
          quantity: 1,
          sellingPrice: 0,
          discountAmount: 0,
          taxRate: 0,
          taxAmount: 0,
          grossAmount: 0,
          query: "", // Add empty query
          filteredSuggestions: [], // Add empty suggestions array
          // Add all the additional properties
          cgst: 0,
          group: "",
          gst: 0,
          hsnCode: "", // Ensure hsnCode is initialized
          igst: 0,
          item_id: "",
          unit_prize: "",
          openningStock: 0,
          discount: 0,
          total_prize: 0,
          uom: "", // Ensure uom is initialized
          netAmount: 0,
          sgst: 0,
        },
      ],
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...selectedInvoice.items];
    updatedItems[index][field] = value;

    setSelectedInvoice({
      ...selectedInvoice,
      items: updatedItems,
    });
  };

  const calculateGrossAmount = (item) => {
    const price = parseFloat(item.sellingPrice) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const discount = parseFloat(item.discountAmount) || 0;
    const taxRate = parseFloat(item.taxRate) || 0;

    const subtotal = price * quantity - discount;
    const taxAddAmount = (subtotal * taxRate) / 100;
    return {
      grossAmount: subtotal.toFixed(2),
      taxAmount: taxAddAmount.toFixed(2),
    };
  };

  const getAllInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(fetchInvoice, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      // console.log("All Invoices:", jsonData);

      if (!response.ok) {
        throw new Error(jsonData?.message || "Failed to fetch invoices");
      }
      const sortedInvoices = (jsonData.data || []).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setAllInvoice(sortedInvoices);
      setFilteredInvoices(sortedInvoices);
      //   console.log("Invoices:", jsonData.data);
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

  // Apply search and filters
  useEffect(() => {
    let result = [...allinvoice];

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
  }, [searchTerm, searchField, allinvoice, dateRange, paymentFilter]);

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
  };

  const handlePrintInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPdfPreview(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowPdfPreview(false);
    setSelectedInvoice(null);
    setIsEditMode(false);
  };

  const handleEditInvoice = (invoice) => {
    // Add query and filteredSuggestions to each item
    const itemsWithQuery = invoice.items.map((item) => ({
      ...item,
      query: item.itemName || "", // Initialize query with the existing itemName
      filteredSuggestions: [],
    }));

    setSelectedInvoice({
      ...invoice,
      items: itemsWithQuery,
    });
    setIsEditMode(true);
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
    try {
      // Calculate updated values for each item before saving
      const updatedItems = selectedInvoice.items.map((item) => {
        // Calculate the gross amount and tax amount
        const { grossAmount, taxAmount } = calculateGrossAmount(item);

        // Calculate net amount (gross + tax)
        const netAmount = (
          parseFloat(grossAmount) + parseFloat(taxAmount)
        ).toFixed(2);

        return {
          itemName: item.itemName,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          discountAmount: item.discountAmount,
          taxRate: item.taxRate,
          // Ensure these values are properly set
          taxAmount: parseFloat(taxAmount) || 0,
          grossAmount: parseFloat(grossAmount) || 0,
          netAmount: parseFloat(netAmount) || 0,
          // Include all the additional properties
          cgst: item.cgst || 0,
          group: item.group || "",
          gst: item.gst || 0,
          hsnCode: item.hsnCode || "",
          igst: item.igst || 0,
          item_id: item.item_id || 0,
          unit_prize: item.unit_prize || "",
          openningStock: item.openningStock || 0,
          discount: item.discount || 0,
          total_prize: item.total_prize || 0,
          uom: item.uom || "",
          sgst: item.sgst || 0,
        };
      });

      // console.log("Updated items with calculated values:", updatedItems);

      // Calculate totals
      const taxableAmount = updatedItems
        .reduce((sum, item) => sum + parseFloat(item.grossAmount), 0)
        .toFixed(2);

      const totalTaxAmount = updatedItems
        .reduce((sum, item) => sum + parseFloat(item.taxAmount), 0)
        .toFixed(2);

      const grandTotal = updatedItems
        .reduce((sum, item) => sum + parseFloat(item.netAmount), 0)
        .toFixed(2);

      const totalDiscount = updatedItems
        .reduce((sum, item) => sum + parseFloat(item.discountAmount || 0), 0)
        .toFixed(2);

      const updateData = {
        invoiceNumber: selectedInvoice.invoiceNumber,
        date: selectedInvoice.date,
        paymentType: selectedInvoice.paymentType,
        receiverDetails: selectedInvoice.receiverDetails,
        items: updatedItems, // Use the updated items with calculated values
        discount: parseFloat(totalDiscount),
        taxableAmount: parseFloat(taxableAmount),
        taxAmount: parseFloat(totalTaxAmount),
        grandTotal: parseFloat(grandTotal),
        poDate: selectedInvoice.PoDate,
        poNumber: selectedInvoice.PoNumber,

      };

      // console.log("Update payload:", updateData);

      const response = await fetch(
        `${updateInvoice}/api/v3/mns/invoices/update/${selectedInvoice._id}`,
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
      // console.error("Update Error:", error);
      toast.error(error.message || "Failed to update invoice");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Invoice Management
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
                  <option value="card">Credit</option>
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
                          {invoice?.invoiceNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(invoice.date)}
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
                          ₹{invoice.grandTotal?.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              invoice.paymentType.toLowerCase() === "cash"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {invoice.paymentType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex justify-center gap-2">
                            <IconButton
                              onClick={() => handleEditInvoice(invoice)}
                              size="small"
                              className="text-blue-500 hover:bg-blue-50"
                              title="Edit Invoice"
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
                            {/* <IconButton
                              onClick={() => handleDelete(invoice)}
                              size="small"
                              className="text-red-500 hover:bg-red-50"
                              title="Delete Invoice"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton> */}
                            <IconButton
                              onClick={() => handlePrintInvoice(invoice)}
                              size="small"
                              className="text-green-500 hover:bg-green-50"
                              title="Download Invoice"
                            >
                              <DownloadIcon fontSize="small" />
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
        maxWidth="md"
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
                          value={selectedInvoice?.invoiceNumber}
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
                          value={selectedInvoice.date}
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
                          value={selectedInvoice.paymentType}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              paymentType: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        >
                          <option value="Cash">Cash</option>
                          <option value="Card">Credit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Po Date
                        </label>
                        <input
                          type="date"
                          value={selectedInvoice.PoDate}
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              PoDate: e.target.value,
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
                          value={selectedInvoice?.PoNumber}
                          className="w-full p-2 border rounded bg-gray-100"
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              PoNumber: e.target.value,
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
                        {selectedInvoice?.invoiceNumber}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Date:</span>{" "}
                        {formatDate(selectedInvoice?.date)}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Payment Type:
                        </span>{" "}
                        {selectedInvoice?.paymentType}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Location :
                        </span>{" "}
                        {selectedInvoice?.location || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-3 text-gray-700 border-b pb-2">
                    Customer Details
                  </h3>
                  {isEditMode ? (
                    <>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Name
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
                            placeholder="Customer Name"
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
                              selectedInvoice.receiverDetails?.phoneNumber || ""
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
                            value={
                              selectedInvoice.receiverDetails?.address || ""
                            }
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
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium text-gray-600">
                            Name:
                          </span>{" "}
                          {selectedInvoice.receiverDetails?.name}
                        </p>
                        <p>
                          <span className="font-medium text-gray-600">
                            Phone:
                          </span>{" "}
                          {selectedInvoice.receiverDetails?.phoneNumber}
                        </p>
                        <p>
                          <span className="font-medium text-gray-600">
                            Address:
                          </span>{" "}
                          {selectedInvoice.receiverDetails?.address}
                        </p>
                      </div>
                    </>
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
                            <th className="p-2 text-right text-gray-600">
                              Quantity
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Price
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Discount Amount
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Tax Rate (%)
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Tax Add Amount (%)
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Gross Amount
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items?.map((item, index) => (
                            <tr key={index} className=" hover:bg-gray-100">
                              <td className="p-2 relative">
                                <div className="relative">
                                  <input
                                    type="text"
                                    className="w-full border rounded px-2 py-1"
                                    placeholder="Search..."
                                    value={item.query}
                                    onChange={(e) =>
                                      handleItemQueryChange(index, e)
                                    }
                                  />
                                  {item.filteredSuggestions &&
                                    item.filteredSuggestions.length > 0 && (
                                      <ul className="relative left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow-md z-50 h-64 w-64 overflow-y-auto">
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
                                </div>
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
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  value={item.sellingPrice}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "sellingPrice",
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
                                {/* ₹{calculateGrossAmount(item).taxAmount} */}
                                <input
                                  type="number"
                                  value={calculateGrossAmount(item).taxAmount}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "taxAmount",
                                      e.target.value
                                    )
                                  }
                                  readOnly
                                  className="w-full text-right border rounded px-2 py-1"
                                />
                              </td>
                              <td className="p-2 text-right font-medium">
                                {/* ₹{calculateGrossAmount(item).grossAmount} */}
                                <input
                                  type="number"
                                  value={calculateGrossAmount(item).grossAmount}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "grossAmount",
                                      e.target.value
                                    )
                                  }
                                  readOnly
                                  className="w-full text-right border rounded px-2 py-1"
                                />
                              </td>
                              <td className="p-2 text-right flex gap-2">
                                <button
                                  type="button"
                                  onClick={handleAddItem}
                                  className="mt-2 px-2 py-0 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(index)}
                                  className="mt-2 px-2 py-0 bg-red-400 text-white rounded hover:bg-red-500"
                                >
                                  -
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="w-64 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal :</span>
                        <span>
                          ₹
                          {selectedInvoice.items
                            ?.reduce((sum, item) => {
                              const { grossAmount } =
                                calculateGrossAmount(item);
                              return sum + parseFloat(grossAmount || 0);
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tax : </span>
                        <span>
                          ₹{" "}
                          {selectedInvoice.items
                            ?.reduce((sum, item) => {
                              const { taxAmount } = calculateGrossAmount(item);
                              return sum + parseFloat(taxAmount || 0);
                            }, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>
                          ₹
                          {selectedInvoice.items
                            ?.reduce((sum, item) => {
                              const { grossAmount, taxAmount } =
                                calculateGrossAmount(item);
                              return (
                                sum +
                                parseFloat(grossAmount || 0) +
                                parseFloat(taxAmount || 0)
                              );
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
                          <tr className="bg-gray-100">
                            <th className="p-2 text-left text-gray-600">
                              Item
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Quantity
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Price
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Discount Amount
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Tax Rate (%)
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Tax Add Amount (%)
                            </th>
                            <th className="p-2 text-right text-gray-600">
                              Gross Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items?.map((item, index) => {
                            console.log(item);
                            return (
                              <tr key={index} className=" hover:bg-gray-100">
                                <td className="p-2">
                                  <input
                                    type="text"
                                    className="w-full focus:outline-none px-2 py-1"
                                    placeholder="Search..."
                                    value={item.itemName}
                                    onChange={(e) =>
                                      handleItemQueryChange(index, e)
                                    }
                                    readOnly
                                  />
                                  {item.filteredSuggestions &&
                                    item.filteredSuggestions.length > 0 && (
                                      <ul className="absolute w-64 bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10 max-h-60 overflow-y-auto">
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
                                    readOnly
                                    className="w-full text-right focus:outline-none px-2 py-1"
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  <input
                                    type="number"
                                    value={item.sellingPrice}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "sellingPrice",
                                        e.target.value
                                      )
                                    }
                                    readOnly
                                    className="w-full text-right focus:outline-none px-2 py-1"
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
                                    readOnly
                                    className="w-full text-right focus:outline-none px-2 py-1"
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
                                    readOnly
                                    className="w-full text-right focus:outline-none px-2 py-1"
                                  />
                                </td>
                                <td className="p-2 text-right font-medium">
                                  {/* ₹{calculateGrossAmount(item).taxAmount} */}
                                  <input
                                    type="number"
                                    value={calculateGrossAmount(item).taxAmount}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "taxAmount",
                                        e.target.value
                                      )
                                    }
                                    readOnly
                                    className="w-full text-right focus:outline-none px-2 py-1"
                                  />
                                </td>
                                <td className="p-2 text-right font-medium">
                                  {/* ₹{calculateGrossAmount(item).grossAmount} */}
                                  <input
                                    type="number"
                                    value={
                                      calculateGrossAmount(item).grossAmount
                                    }
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "grossAmount",
                                        e.target.value
                                      )
                                    }
                                    readOnly
                                    className="w-full text-right focus:outline-none px-2 py-1"
                                  />
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
            {/* <PdfFormate invoiceData={selectedInvoice} /> */}
            <MnsProductPdf invoiceData={selectedInvoice} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ViewInvoicePageS;
