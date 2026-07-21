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
import MnsServicePdf from "./MnsServicePdf";
// import PdfFormate from "./PdfFormate";

const fetchInvoice = import.meta.env.VITE_BASE_URL_C;
const deleteInvoice = import.meta.env.VITE_BASE_URL_C;
const updateInvoice = import.meta.env.VITE_BASE_URL_C;

const ServiceInvoiceReports = () => {
  const [allinvoice, setAllInvoice] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  // const [selectedInvoice, setSelectedInvoice] = useState(null);
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
  const [selectedInvoice, setSelectedInvoice] = useState({
    items: [
      {
        description: "",
        month: "",
        noOfDuites: 0,
        noOfPerson: 0,
        rate: 0,
        amount: 0,
        taxRate: 0,
      },
    ],
  });
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...selectedInvoice.items];
    updatedItems[index][field] = value;

    // Auto-calculate amount = noOfDuites * rate / month
    const { noOfDuites, rate, month } = updatedItems[index];
    updatedItems[index].amount =
      ((parseFloat(noOfDuites) || 0) * (parseFloat(rate) || 0)) /
      (parseFloat(month) || 1);

    // Calculate subtotal (grossAmount)
    const grossAmount = updatedItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    // Calculate tax amount
    const cgst = parseFloat(selectedInvoice.total?.cgst || 0);
    const sgst = parseFloat(selectedInvoice.total?.sgst || 0);
    const igst = parseFloat(selectedInvoice.total?.igst || 0);
    const taxRate = cgst + sgst + igst;
    const taxAmount = (grossAmount * taxRate) / 100;

    // Calculate grand total
    const grandTotal = grossAmount + taxAmount;

    setSelectedInvoice((prev) => ({
      ...prev,
      items: updatedItems,
      total: {
        ...prev.total,
        grossAmount: grossAmount,
        taxAmount: taxAmount,
        grandTotal: grandTotal,
      },
    }));
  };

  const addItem = () => {
    setSelectedInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          month: "",
          noOfDuites: 0,
          noOfPerson: 0,
          rate: 0,
          amount: 0,
          taxRate: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    // Prevent deletion if there's only one item left
    if (selectedInvoice.items.length <= 1) {
      return;
    }

    const updatedItems = selectedInvoice.items.splice(index + 1, 1);

    const grossAmount = updatedItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    const cgstAmount =
      selectedInvoice.taxGroup === "State Tax"
        ? Number(
            parseFloat(
              (grossAmount * selectedInvoice.total.cgst) / 100
            ).toFixed(2)
          )
        : 0;

    const sgstAmount =
      selectedInvoice.taxGroup === "State Tax"
        ? Number(
            parseFloat(
              (grossAmount * selectedInvoice.total.sgst) / 100
            ).toFixed(2)
          )
        : 0;

    const igstAmount =
      selectedInvoice.taxGroup === "Other Tax"
        ? Number(
            parseFloat(
              (grossAmount * selectedInvoice.total.igst) / 100
            ).toFixed(2)
          )
        : 0;

    const taxAmount =
      selectedInvoice.taxGroup === "State Tax"
        ? cgstAmount + sgstAmount
        : igstAmount;

    const grandTotal = grossAmount + taxAmount;

    let totalPayableAmount = grandTotal;

    const decimalPart = grandTotal % 1;

    if (decimalPart < 0.5) {
      totalPayableAmount = grandTotal - selectedInvoice.total?.roundOff;
    } else {
      totalPayableAmount = grandTotal + selectedInvoice.total?.roundOff;
    }

    setSelectedInvoice((prev) => ({
      ...prev,
      items: updatedItems,
      total: {
        ...prev.total,
        grossAmount,
        cgstAmount,
        sgstAmount,
        igstAmount,
        grandTotal,
        totalPayableAmount,
      },
    }));
  };
  const getAllInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${fetchInvoice}/api/v1/service/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      // console.log("all service invoice after geting all changes  : ", jsonData);

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
            (invoice?.total?.grandTotal &&
              invoice?.total?.grandTotal.toString().includes(term))
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
            invoice?.total?.grandTotal &&
            invoice?.total?.grandTotal.toString().includes(term)
          );
        }
        return false;
      });
    }

    setFilteredInvoices(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, searchField, allinvoice, dateRange, paymentFilter]);

  // console.log("service invoice",invoice);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInvoices?.length / itemsPerPage);

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

  const handleDelete = async (invoice) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await fetch(
          `${deleteInvoice}/api/v1/service/delete/${invoice._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete invoice");
        }

        toast.success("Invoice deleted successfully");
        getAllInvoices();
      } catch (error) {
        console.error("Delete Error:", error);
        toast.error(error.message || "Failed to delete invoice");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowPdfPreview(false);
    setSelectedInvoice(null);
    setIsEditMode(false);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
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

  // Update the handleSaveEdit function to calculate tax amount correctly
  const handleSaveEdit = async () => {
    // console.log("Selected Invoice:", selectedInvoice);
    // return;
    try {
      const response = await fetch(
        `${updateInvoice}/api/v1/service/update/${selectedInvoice._id}`,
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
          Service Invoice Management
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
                        Month
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
                          {invoice?.receiverDetails?.monthYear}
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
                          ₹
                          {invoice.total?.totalPayableAmount ||
                            invoice.total?.grandTotal}
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
                          <div className="flex justify-end gap-2">
                            {!invoice?.paidOne && (
                              <IconButton
                                onClick={() => handleDelete(invoice)}
                                size="small"
                                title="Delete Invoice"
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
                              title="Edit Invoice"
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
                              title="Download Invoice"
                            >
                              <DownloadIcon
                                fontSize="small"
                                className="text-green-700 hover:bg-green-50"
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
                              total + (invoice.total.grandTotal || 0),
                            0
                          )
                          ?.toFixed(2)}
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
                          value={
                            new Date(selectedInvoice.date)
                              .toISOString()
                              .split("T")[0]
                          }
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
                          <option value="cash">Cash</option>
                          <option value="credit">Credit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tax Group
                        </label>
                        <select
                          value={selectedInvoice.taxGroup}
                          onChange={(e) => {
                            if (e.target.value === "State Tax") {
                              const cgst = selectedInvoice.total.igst / 2;
                              const sgst = selectedInvoice.total.igst / 2;

                              const cgstAmount =
                                (selectedInvoice.total.grossAmount * cgst) /
                                100;

                              const sgstAmount =
                                (selectedInvoice.total.grossAmount * sgst) /
                                100;

                              const grandTotal =
                                selectedInvoice.total.grossAmount +
                                cgstAmount +
                                sgstAmount;

                              let totalPayableAmount =
                                grandTotal + selectedInvoice.total.roundOff;

                              const decimalPart = grandTotal % 1;

                              if (decimalPart < 0.5) {
                                totalPayableAmount =
                                  grandTotal - selectedInvoice.total?.roundOff;
                              } else {
                                totalPayableAmount =
                                  grandTotal + selectedInvoice.total?.roundOff;
                              }

                              setSelectedInvoice({
                                ...selectedInvoice,
                                taxGroup: e.target.value,
                                total: {
                                  ...selectedInvoice.total,
                                  cgst,
                                  sgst,
                                  igst: 0,
                                  cgstAmount,
                                  sgstAmount,
                                  igstAmount: 0,
                                  grandTotal,
                                  totalPayableAmount,
                                },
                              });
                            } else if (e.target.value === "Other Tax") {
                              const igst =
                                Number(selectedInvoice.total.cgst) +
                                Number(selectedInvoice.total.sgst);

                              const igstAmount =
                                (selectedInvoice.total.grossAmount * igst) /
                                100;

                              const grandTotal =
                                selectedInvoice.total.grossAmount + igstAmount;

                              let totalPayableAmount =
                                grandTotal + selectedInvoice.total.roundOff;

                              const decimalPart = grandTotal % 1;

                              if (decimalPart < 0.5) {
                                totalPayableAmount =
                                  grandTotal - selectedInvoice.total?.roundOff;
                              } else {
                                totalPayableAmount =
                                  grandTotal + selectedInvoice.total?.roundOff;
                              }

                              setSelectedInvoice({
                                ...selectedInvoice,
                                taxGroup: e.target.value,
                                total: {
                                  ...selectedInvoice.total,
                                  cgst: 0,
                                  sgst: 0,
                                  igst,
                                  cgstAmount: 0,
                                  sgstAmount: 0,
                                  igstAmount,
                                  grandTotal,
                                  totalPayableAmount,
                                },
                              });
                            } else if (e.target.value === "No Tax") {
                              setSelectedInvoice({
                                ...selectedInvoice,
                                taxGroup: e.target.value,
                                total: {
                                  ...selectedInvoice.total,
                                  cgst: 0,
                                  sgst: 0,
                                  igst: 0,
                                  cgstAmount: 0,
                                  sgstAmount: 0,
                                  igstAmount: 0,
                                  grandTotal: selectedInvoice.total.grossAmount,
                                  totalPayableAmount:
                                    selectedInvoice.total.grossAmount +
                                    selectedInvoice.total.roundOff,
                                },
                              });
                            }
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="State Tax">State Tax</option>
                          <option value="Other Tax">Other Tax</option>
                          <option value="No Tax">No Tax</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From Date
                        </label>
                        <input
                          type="date"
                          value={
                            new Date(selectedInvoice?.receiverDetails?.formDate)
                              .toISOString()
                              .split("T")[0]
                          }
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice?.receiverDetails,
                                formDate: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To Date
                        </label>
                        <input
                          type="date"
                          value={
                            new Date(selectedInvoice?.receiverDetails?.toDate)
                              .toISOString()
                              .split("T")[0]
                          }
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice?.receiverDetails,
                                toDate: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Month
                        </label>
                        <input
                          type="text"
                          value={selectedInvoice?.receiverDetails?.monthYear}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice?.receiverDetails,
                                monthYear: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year
                        </label>
                        <input
                          type="text"
                          value={selectedInvoice?.receiverDetails?.year}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice?.receiverDetails,
                                year: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 border rounded"
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
                        {formatDate(selectedInvoice?.date) || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Payment Type:
                        </span>{" "}
                        {selectedInvoice?.paymentType || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Tax Group:
                        </span>{" "}
                        {selectedInvoice?.taxGroup || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          From Date:
                        </span>{" "}
                        {formatDate(
                          selectedInvoice?.receiverDetails?.formDate
                        ) || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          To Date:
                        </span>{" "}
                        {formatDate(selectedInvoice?.receiverDetails?.toDate) ||
                          "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Month:
                        </span>{" "}
                        {selectedInvoice?.receiverDetails?.monthYear || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Year:</span>{" "}
                        {selectedInvoice?.receiverDetails?.year || "N/A"}
                      </p>
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
                          Vendor Code
                        </label>
                        <input
                          type="text"
                          value={
                            selectedInvoice.receiverDetails?.vendorCode || ""
                          }
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice.receiverDetails,
                                vendorCode: e.target.value,
                              },
                            })
                          }
                          placeholder="Vendor Code"
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
                          GST
                        </label>
                        <input
                          value={selectedInvoice?.receiverDetails?.gstin || ""}
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
                          className="w-full p-2 border rounded"
                          rows="3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PF
                        </label>
                        <input
                          value={selectedInvoice?.receiverDetails?.pf || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice.receiverDetails,
                                pf: e.target.value,
                              },
                            })
                          }
                          placeholder="PF"
                          className="w-full p-2 border rounded"
                          rows="3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ESI
                        </label>
                        <input
                          value={selectedInvoice?.receiverDetails?.esi || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              receiverDetails: {
                                ...selectedInvoice.receiverDetails,
                                esi: e.target.value,
                              },
                            })
                          }
                          placeholder="ESI"
                          className="w-full p-2 border rounded"
                          rows="3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Remarks
                        </label>
                        <input
                          value={selectedInvoice?.remark || ""}
                          onChange={(e) =>
                            setSelectedInvoice({
                              ...selectedInvoice,
                              remark: e.target.value,
                            })
                          }
                          placeholder="Remarks"
                          className="w-full p-2 border rounded"
                          rows="3"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium text-gray-600">Name:</span>{" "}
                        {selectedInvoice.receiverDetails?.name || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Vendor Code:
                        </span>{" "}
                        {selectedInvoice.receiverDetails?.vendorCode || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Phone:
                        </span>{" "}
                        {selectedInvoice.receiverDetails?.phoneNumber || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Address:
                        </span>{" "}
                        {selectedInvoice.receiverDetails?.address || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">GST:</span>
                        {selectedInvoice.receiverDetails?.gstin || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">PF:</span>{" "}
                        {selectedInvoice.receiverDetails?.pf || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">ESI:</span>{" "}
                        {selectedInvoice.receiverDetails?.esi || "N/A"}
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
                          <tr className="bg-gray-100">
                            <th className="p-2 text-left text-gray-600">
                              Sac Code
                            </th>
                            <th className="p-2 text-left text-gray-600">
                              Description
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              Month
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              No Of Duties
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              No Of Person
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              Rate
                            </th>
                            {/* <th className="p-2 text-center text-gray-600">
                              Tax Rate
                            </th> */}
                            <th className="p-2 text-center text-gray-600">
                              Amount (₹)
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">
                                <input
                                  type="text"
                                  className="w-full p-1 border rounded"
                                  value={item.sacCode}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "sacCode",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  className="w-full p-1 border rounded"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded text-center"
                                  value={item.month}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "month",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded text-center"
                                  value={item.noOfDuites}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "noOfDuites",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded text-center"
                                  value={item.noOfPerson}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "noOfPerson",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded text-center"
                                  value={item.rate}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "rate",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              {/* <td className="p-2">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded text-center"
                                  value={item.taxRate}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "taxRate",
                                      e.target.value
                                    )
                                  }
                                />
                              </td> */}
                              <td className="p-2 text-center">
                                ₹{item?.amount?.toFixed(2)}
                              </td>
                              <td className="p-2 text-center">
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={addItem}
                                    className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    title="Add Item"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => removeItem(index)}
                                    className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    title="Remove Item"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
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
                          ₹{selectedInvoice.total?.grossAmount?.toFixed(2)}
                        </span>
                      </div>

                      {/* Tax Rate Input Fields */}
                      <div className="mb-2">
                        {selectedInvoice?.taxGroup === "Other Tax" && (
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-gray-600 text-sm">
                              IGST (%):
                            </label>
                            <input
                              type="number"
                              className="w-20 p-1 border rounded text-right"
                              value={selectedInvoice.total?.igst || 0}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                const cgst = parseFloat(
                                  selectedInvoice.total?.cgst || 0
                                );
                                const sgst = parseFloat(
                                  selectedInvoice.total?.sgst || 0
                                );
                                const grossAmount = parseFloat(
                                  selectedInvoice.total?.grossAmount || 0
                                );
                                const igstAmount = (grossAmount * value) / 100;

                                const grandTotal = grossAmount + igstAmount;

                                let totalPayableAmount = grandTotal;

                                const decimalPart = grandTotal % 1;

                                if (decimalPart < 0.5) {
                                  totalPayableAmount =
                                    grandTotal -
                                    selectedInvoice.total?.roundOff;
                                } else {
                                  totalPayableAmount =
                                    grandTotal +
                                    selectedInvoice.total?.roundOff;
                                }

                                setSelectedInvoice((prev) => ({
                                  ...prev,
                                  total: {
                                    ...prev.total,
                                    igst: value,
                                    igstAmount: Number(
                                      parseFloat(igstAmount).toFixed(2)
                                    ),
                                    grandTotal: grandTotal,
                                    totalPayableAmount: Number(
                                      parseFloat(totalPayableAmount).toFixed(2)
                                    ),
                                  },
                                }));
                              }}
                            />
                          </div>
                        )}

                        {selectedInvoice?.taxGroup === "State Tax" && (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-gray-600 text-sm">
                                CGST (%):
                              </label>
                              <input
                                type="number"
                                className="w-20 p-1 border rounded text-right"
                                value={selectedInvoice.total?.cgst || 0}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  const sgst = parseFloat(
                                    selectedInvoice.total?.sgst || 0
                                  );
                                  const igst = parseFloat(
                                    selectedInvoice.total?.igst || 0
                                  );
                                  const grossAmount = parseFloat(
                                    selectedInvoice.total?.grossAmount || 0
                                  );
                                  const cgstAmount =
                                    (grossAmount * value) / 100;

                                  const grandTotal =
                                    grossAmount +
                                    cgstAmount +
                                    selectedInvoice.total?.sgstAmount;

                                  let totalPayableAmount = grandTotal;

                                  const decimalPart = grandTotal % 1;

                                  if (decimalPart < 0.5) {
                                    totalPayableAmount =
                                      grandTotal -
                                      selectedInvoice.total?.roundOff;
                                  } else {
                                    totalPayableAmount =
                                      grandTotal +
                                      selectedInvoice.total?.roundOff;
                                  }

                                  setSelectedInvoice((prev) => ({
                                    ...prev,
                                    total: {
                                      ...prev.total,
                                      cgst: value,
                                      cgstAmount: Number(
                                        parseFloat(cgstAmount).toFixed(2)
                                      ),
                                      grandTotal: grandTotal,
                                      totalPayableAmount: Number(
                                        parseFloat(totalPayableAmount).toFixed(
                                          2
                                        )
                                      ),
                                    },
                                  }));
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-gray-600 text-sm">
                                SGST (%):
                              </label>
                              <input
                                type="number"
                                className="w-20 p-1 border rounded text-right"
                                value={selectedInvoice.total?.sgst || 0}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  const cgst = parseFloat(
                                    selectedInvoice.total?.cgst || 0
                                  );
                                  const igst = parseFloat(
                                    selectedInvoice.total?.igst || 0
                                  );
                                  const grossAmount = parseFloat(
                                    selectedInvoice.total?.grossAmount || 0
                                  );

                                  const sgstAmount =
                                    (grossAmount * value) / 100;

                                  const grandTotal =
                                    grossAmount +
                                    sgstAmount +
                                    selectedInvoice.total?.cgstAmount;

                                  let totalPayableAmount = grandTotal;

                                  const decimalPart = grandTotal % 1;

                                  if (decimalPart < 0.5) {
                                    totalPayableAmount =
                                      grandTotal -
                                      selectedInvoice.total?.roundOff;
                                  } else {
                                    totalPayableAmount =
                                      grandTotal +
                                      selectedInvoice.total?.roundOff;
                                  }

                                  setSelectedInvoice((prev) => ({
                                    ...prev,
                                    total: {
                                      ...prev.total,
                                      sgst: value,
                                      sgstAmount: Number(
                                        parseFloat(sgstAmount).toFixed(2)
                                      ),
                                      grandTotal: grandTotal,
                                      totalPayableAmount: Number(
                                        parseFloat(totalPayableAmount).toFixed(
                                          2
                                        )
                                      ),
                                    },
                                  }));
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">
                          Tax (
                          {parseFloat(selectedInvoice.total?.cgst || 0) +
                            parseFloat(selectedInvoice.total?.sgst || 0) +
                            parseFloat(selectedInvoice.total?.igst || 0)}
                          %) :{" "}
                        </span>
                        <span>
                          ₹
                          {(
                            (parseFloat(
                              selectedInvoice.total?.grossAmount || 0
                            ) *
                              (parseFloat(selectedInvoice.total?.cgst || 0) +
                                parseFloat(selectedInvoice.total?.sgst || 0) +
                                parseFloat(selectedInvoice.total?.igst || 0))) /
                            100
                          )?.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Grand Total :</span>
                        <span>
                          ₹{selectedInvoice.total?.grandTotal?.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <label>Round Off:</label>
                        <input
                          type="number"
                          className="w-20 p-1 border rounded text-right"
                          value={selectedInvoice.total.roundOff}
                          onChange={(e) => {
                            const roundOff = parseFloat(e.target.value) || 0;

                            const grandTotal = selectedInvoice.total.grandTotal;

                            let totalPayableAmount = grandTotal;

                            const decimalPart = grandTotal % 1;

                            if (decimalPart < 0.5) {
                              totalPayableAmount = grandTotal - roundOff;
                            } else {
                              totalPayableAmount = grandTotal + roundOff;
                            }

                            setSelectedInvoice((prev) => ({
                              ...prev,
                              total: {
                                ...prev.total,
                                roundOff: e.target.value,
                                totalPayableAmount: Number(
                                  parseFloat(totalPayableAmount).toFixed(2)
                                ),
                              },
                            }));
                          }}
                        />
                      </div>

                      <div className="flex justify-between mb-2 pt-2 border-t-2">
                        <span className="text-gray-600 font-bold">
                          Payable Amount :
                        </span>
                        <span>
                          ₹
                          {selectedInvoice.total?.totalPayableAmount?.toFixed(
                            2
                          )}
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
                              Sac Code
                            </th>
                            <th className="p-2 text-left text-gray-600">
                              Description
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              Month
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              No Of Duties
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              No Of Person
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              Rate
                            </th>
                            <th className="p-2 text-center text-gray-600">
                              Amount (₹)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">
                                <input
                                  type="text"
                                  className="w-full p-1 focus:outline-none"
                                  value={item.sacCode}
                                  readOnly
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  className="w-full p-1 focus:outline-none min-w-58"
                                  value={item.description}
                                  readOnly
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="w-full p-1 focus:outline-none text-center"
                                  value={item.month}
                                  readOnly
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="w-full p-1 focus:outline-none text-center"
                                  value={item.noOfDuites}
                                  readOnly
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="w-full p-1 focus:outline-none text-center"
                                  value={item.noOfPerson}
                                  readOnly
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  className="w-full p-1 focus:outline-none text-center"
                                  value={item.rate}
                                  readOnly
                                />
                              </td>

                              <td className="p-2 text-center">
                                ₹{item?.amount?.toFixed(2)}
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
                        <span className="text-gray-600 font-semibold">
                          Gross :
                        </span>
                        <span>
                          ₹{selectedInvoice.total?.grossAmount?.toFixed(2)}
                        </span>
                      </div>
                      {selectedInvoice.taxGroup === "State Tax" && (
                        <>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 font-semibold">
                              CGST ({selectedInvoice.total?.cgst || 0}
                              %) :
                            </span>
                            <span>
                              ₹
                              {parseFloat(
                                selectedInvoice.total?.cgstAmount || 0
                              ).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 font-semibold">
                              SGST ({selectedInvoice.total?.sgst || 0}
                              %) :
                            </span>
                            <span>
                              ₹
                              {parseFloat(
                                selectedInvoice.total?.sgstAmount || 0
                              ).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                      {selectedInvoice.taxGroup === "Other Tax" && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 font-semibold">
                            IGST ({selectedInvoice.total?.igst || 0}
                            %) :
                          </span>
                          <span>
                            ₹
                            {parseFloat(
                              selectedInvoice.total?.igstAmount || 0
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 font-semibold">
                          Grand Total :
                        </span>
                        <span>
                          ₹
                          {parseFloat(
                            selectedInvoice.total?.grandTotal || 0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 font-semibold">
                          Round Off :
                        </span>
                        <span>
                          ₹
                          {parseFloat(
                            selectedInvoice.total?.roundOff || 0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2 border-t font-bold pt-2">
                        <span className="text-gray-600 font-semibold">
                          Total Payable :
                        </span>
                        <span>
                          ₹
                          {parseFloat(
                            selectedInvoice.total?.totalPayableAmount || 0
                          ).toFixed(2)}
                        </span>
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
            <MnsServicePdf invoiceData={selectedInvoice} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ServiceInvoiceReports;
