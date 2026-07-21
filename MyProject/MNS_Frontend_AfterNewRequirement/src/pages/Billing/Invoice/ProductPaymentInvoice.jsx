import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PdfFormate from "./PdfFormate";
import MNSPaymentSlip from "../../../component/Slip/MNSPaymentSlip";

const fetchInvoice = import.meta.env.VITE_BASE_URL_C;
const createLadgerApi = import.meta.env.VITE_REACT_CREATE_LADGER;
const fetchBank = import.meta.env.VITE_BASE_URL_C;

const ProductPaymentInvoice = () => {
  const [allinvoice, setAllInvoice] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [updateButton, setUpdateButton] = useState(true);
  const [savingPayment, setSavingPayment] = useState(false);

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

  // productDetails is used as the payload for the create ladger API
  const [productDetails, setProductDetails] = useState({
    invoiceId: "",
    invoiceNumber: "",
    totalAmount: "",
    invoiceType: "product",
    paymentDetails: [
      {
        paymentDate: "",
        paymentAmount: "",
        paymentMode: "",
        transactionId: "",
      },
    ],
    // bankId:""
  });

  // Save update by posting data to the API endpoint after validation
  const handleSaveEdit = async () => {
    // Validate payment amount is not greater than grand total
    const paymentAmount =
      parseFloat(productDetails.paymentDetails[0].paymentAmount) || 0;
    const grandTotal = parseFloat(selectedInvoice.grandTotal) || 0;
    if (paymentAmount > grandTotal) {
      toast.error("Payment Amount cannot exceed the Grand Total");
      return;
    }

    try {
      setSavingPayment(true);
      const updateData = {
        ...productDetails,
        totalAmount: selectedInvoice?.grandTotal || "",
        invoiceType: "product",
        paymentDetails: [
          {
            ...productDetails.paymentDetails[0],
            paymentAmount: Number(
              productDetails.paymentDetails[0].paymentAmount
            ), // Ensure paymentAmount is a number
            bankId: productDetails.paymentDetails[0].bankId || null,
          },
        ],
      };

      const response = await fetch(createLadgerApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(updateData),
      });

      const jsonData = await response.json();

      if (!response.ok) {
        throw new Error(jsonData.message || "Failed to create ladger");
      }
      console.log(jsonData);
      toast.success("Payment recorded successfully");
      // Remove update button after successful creation
      setSelectedInvoice(jsonData.data);
      setUpdateButton(false);
      getAllInvoices();
      handleCloseDialog();
      setIsEditMode(false);
      setShowPdfPreview(true);

      // for pdf
      const receiptPayload = {
        invoiceNumber: selectedInvoice.invoiceNumber,
        paymentAmount: productDetails.paymentDetails[0].paymentAmount,
        paymentMode: productDetails.paymentDetails[0].paymentMode,
        paymentDate: productDetails.paymentDetails[0].paymentDate,
        transactionId: productDetails.paymentDetails[0].transactionId,
        customerName: selectedInvoice.receiverDetails?.name,
        location: selectedInvoice.location || "Main Office",
        grandTotal: selectedInvoice.grandTotal,
      };

      // Set receipt data and trigger download
      setReceiptData(receiptPayload);
      setShouldDownloadReceipt(true);
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message || "Failed to create payment record");
    } finally {
      setSavingPayment(false);
    }
  };

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Handle page change in pagination
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSearchField("all");
    setDateRange({ from: "", to: "" });
    setPaymentFilter("all");
    setCurrentPage(1);
    setFilteredInvoices(allinvoice);
  };

  const getAllInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${fetchInvoice}/api/v3/mns/invoices/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      console.log("All Invoices:", jsonData);
      if (!response.ok) {
        throw new Error(jsonData?.message || "Failed to fetch invoices");
      }
      const sortedInvoices = (jsonData.data || []).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setAllInvoice(sortedInvoices);
      setFilteredInvoices(sortedInvoices);
      console.log("Invoices:", jsonData.data);
      toast.success("Successfully fetched invoices");
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error.message || "Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  const fetchBankAccounts = async () => {
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

  // Handle edit invoice (open dialog with invoice details)
  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsEditMode(true);
    setUpdateButton(true);

    // Set product details for the API payload
    setProductDetails({
      invoiceId: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      totalAmount: invoice.grandTotal,
      invoiceType: "product",
      paymentDetails: [
        {
          paymentDate: new Date().toISOString().split("T")[0],
          paymentAmount: invoice.grandTotal,
          paymentMode: "Cash",
          transactionId: "",
          bankId: "",
        },
      ],
    });

    setOpenDialog(true);
  };

  // View invoice details (read-only mode)
  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsEditMode(false);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    // setSelectedInvoice(null);
    setShowPdfPreview(false);
  };

  // Apply filters when search term, date range, or payment filter changes
  useEffect(() => {
    let filtered = [...allinvoice];

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // Set to end of day

      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
    }

    // Apply payment type filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (invoice) =>
          invoice.paymentType?.toLowerCase() === paymentFilter.toLowerCase()
      );
    }

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter((invoice) => {
        if (searchField === "all") {
          return (
            (invoice?.invoiceNumber &&
              invoice.invoiceNumber.toLowerCase().includes(term)) ||
            (invoice?.receiverDetails?.name &&
              invoice.receiverDetails.name.toLowerCase().includes(term)) ||
            (invoice?.receiverDetails?.phoneNumber &&
              invoice.receiverDetails.phoneNumber
                .toLowerCase()
                .includes(term)) ||
            (invoice?.paymentType &&
              invoice.paymentType.toLowerCase().includes(term)) ||
            (invoice?.grandTotal &&
              invoice.grandTotal.toString().includes(term))
          );
        } else if (searchField === "invoiceNumber") {
          return (
            invoice?.invoiceNumber &&
            invoice.invoiceNumber.toLowerCase().includes(term)
          );
        } else if (searchField === "customerName") {
          return (
            invoice?.receiverDetails?.name &&
            invoice.receiverDetails.name.toLowerCase().includes(term)
          );
        } else if (searchField === "phone") {
          return (
            invoice?.receiverDetails?.phoneNumber &&
            invoice.receiverDetails.phoneNumber.toLowerCase().includes(term)
          );
        } else if (searchField === "paymentType") {
          return (
            invoice?.paymentType &&
            invoice.paymentType.toLowerCase().includes(term)
          );
        } else if (searchField === "amount") {
          return (
            invoice?.grandTotal && invoice.grandTotal.toString().includes(term)
          );
        }
        return true;
      });
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [searchTerm, searchField, dateRange, paymentFilter, allinvoice]);

  // Fetch invoices and bank accounts when component mounts
  useEffect(() => {
    getAllInvoices();
    fetchBankAccounts();
  }, []);

  const handleReceiptDownloadComplete = () => {
    setShouldDownloadReceipt(false);
    setReceiptData(null);
    toast.success("Receipt downloaded successfully!");
  };

    // Add this useEffect after your other useEffect hooks
    useEffect(() => {
      // When payment mode changes to Cash, auto-select the first bank with "0000" in account number
      if (productDetails.paymentDetails[0].paymentMode === "Cash") {
        const cashBanks = banks.filter(bank => bank.accountNumber && /^0{4,}/.test(bank.accountNumber)
      );
        if (cashBanks.length > 0 && !productDetails.paymentDetails[0].bankId) {
          setProductDetails({
            ...productDetails,
            paymentDetails: [
              {
                ...productDetails.paymentDetails[0],
                bankId: cashBanks[0]._id,
              },
            ],
          });
        }
      }
    }, [productDetails.paymentDetails[0].paymentMode, banks]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ReceiptIcon
              className="text-blue-600 mr-3"
              style={{ fontSize: 28 }}
            />
            <h2 className="text-2xl font-bold text-gray-800">
              Payment Collection
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            Manage and record payments for product invoices
          </div>
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
                      <SearchIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                size="small"
                className="bg-white"
              />
            </div>

            <FormControl
              variant="outlined"
              size="small"
              style={{ minWidth: 150 }}
              className="bg-white"
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
              className="flex cursor-pointer items-center gap-1 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <FilterIcon fontSize="small" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <button
              onClick={resetFilters}
              className="flex cursor-pointer items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <RefreshIcon fontSize="small" />
              Reset
            </button>
          </div>

          {showFilters && (
            <div className="bg-white cursor-pointer p-5 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm border border-gray-100">
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
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
                className="border rounded-md p-1 text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
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
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="mt-4 text-gray-600">Loading invoices...</p>
            </div>
          </div>
        ) : (
          <>
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="flex justify-center mb-4">
                  <ReceiptIcon
                    style={{ fontSize: 48 }}
                    className="text-gray-400"
                  />
                </div>
                <p className="text-gray-500 text-lg mb-4">
                  No invoices found matching your criteria
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
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
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                        Payment Type
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
                            {!invoice?.paidOne && (
                              <button
                                onClick={() => handleEditInvoice(invoice)}
                                className="p-1 cursor-pointer rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                title="Record Payment"
                              >
                                <EditIcon fontSize="small" />
                              </button>
                            )}

                            <button
                              onClick={() => viewInvoice(invoice)}
                              className="p-1 cursor-pointer rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="View Invoice"
                            >
                              <RemoveRedEyeIcon fontSize="small" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="bg-gray-100 font-semibold">
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { borderRadius: "12px" },
        }}
      >
        <DialogTitle className="flex items-center justify-between bg-indigo-50 border-b">
          <div className="flex items-center">
            <ReceiptIcon className="text-indigo-600 mr-2" />
            <span className="text-xl font-semibold text-gray-800">
              {isEditMode ? "Record Payment" : "Invoice Details"}
            </span>
          </div>
          <div>
            {isEditMode && updateButton && (
              <button
                onClick={handleSaveEdit}
                disabled={savingPayment}
                className={`mr-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center ${
                  savingPayment
                    ? "opacity-70 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {savingPayment ? (
                  <>
                    <CircularProgress
                      size={20}
                      color="inherit"
                      className="mr-2"
                    />
                    Saving...
                  </>
                ) : (
                  "Save Payment"
                )}
              </button>
            )}
            <IconButton
              onClick={handleCloseDialog}
              size="small"
              className="text-gray-500 cursor-pointer"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className="p-0">
          {selectedInvoice && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                    <ReceiptIcon
                      className="text-indigo-500 mr-2"
                      fontSize="small"
                    />
                    Invoice Information
                  </h3>
                  {isEditMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Invoice Number
                        </label>
                        <input
                          type="text"
                          value={productDetails.invoiceNumber}
                          onChange={(e) =>
                            setProductDetails({
                              ...productDetails,
                              invoiceNumber: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Date
                        </label>
                        <input
                          type="date"
                          value={productDetails.paymentDetails[0].paymentDate}
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) =>
                            setProductDetails({
                              ...productDetails,
                              paymentDetails: [
                                {
                                  ...productDetails.paymentDetails[0],
                                  paymentDate: e.target.value,
                                },
                              ],
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Method
                        </label>
                        <select
                          value={productDetails.paymentDetails[0].paymentMode}
                          onChange={(e) =>
                            setProductDetails({
                              ...productDetails,
                              paymentDetails: [
                                {
                                  ...productDetails.paymentDetails[0],
                                  paymentMode: e.target.value,
                                },
                              ],
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                        >
                           <option value="">Select Payment Mode</option>
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="UPI">UPI</option>
                          <option value="NetBanking">Net Banking</option>
                          <option value="Cheque">Cheque</option>
                          <option value="BankTransfer">Bank Transfer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Transaction ID
                        </label>
                        <input
                          type="text"
                          value={productDetails.paymentDetails[0].transactionId}
                          onChange={(e) =>
                            setProductDetails({
                              ...productDetails,
                              paymentDetails: [
                                {
                                  ...productDetails.paymentDetails[0],
                                  transactionId: e.target.value,
                                },
                              ],
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                          placeholder="Enter transaction ID if applicable"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={
                              productDetails.paymentDetails[0].paymentAmount
                            }
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                paymentDetails: [
                                  {
                                    ...productDetails.paymentDetails[0],
                                    paymentAmount: e.target.value,
                                  },
                                ],
                              })
                            }
                            className="w-full p-2 pl-7 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                          />
                        </div>
                        {selectedInvoice &&
                          parseFloat(
                            productDetails.paymentDetails[0].paymentAmount || 0
                          ) > parseFloat(selectedInvoice.grandTotal || 0) && (
                            <p className="text-red-500 text-sm mt-1">
                              Payment Amount cannot be greater than Grand Total.
                            </p>
                          )}
                      </div>
                    

{/* here is the change  */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Bank
                        </label>
                        <select
                          value={productDetails.paymentDetails[0].bankId || ""}
                          onChange={(e) =>
                            setProductDetails({
                              ...productDetails,
                              paymentDetails: [
                                {
                                  ...productDetails.paymentDetails[0],
                                  bankId: e.target.value,
                                },
                              ],
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                        >
                          <option value="">Select Bank</option>
                          {banks
                            .filter(bank => {
                              // If payment mode is Cash, only show banks with account numbers containing 4+ consecutive zeros
                              if (productDetails.paymentDetails[0].paymentMode === "Cash") {
                                return bank.accountNumber && /^0{4,}/.test(bank.accountNumber);
                              }
                              // For other payment modes, show all banks
                              return bank.accountNumber && !/^0{4,}/.test(bank.accountNumber);
                            })
                            .map((bank) => (
                              <option key={bank._id} value={bank._id}>
                                {bank.bankName} ({bank.accountNumber})
                              </option>
                            ))}
                        </select>
                      </div>

                    </div>
                  ) : (
                    <div className="space-y-3">
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
                          {formatDate(selectedInvoice?.date)}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Payment Type:
                        </span>
                        <span className="text-gray-800">
                          {selectedInvoice?.paymentType}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Location:
                        </span>
                        <span className="text-gray-800">
                          {selectedInvoice?.location || "N/A"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">
                    Customer Details
                  </h3>
                  {isEditMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={selectedInvoice.receiverDetails?.name || ""}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
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
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          value={selectedInvoice.receiverDetails?.address || ""}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                          rows="3"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">Name:</span>
                        <span className="text-gray-800">
                          {selectedInvoice.receiverDetails?.name}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Phone:
                        </span>
                        <span className="text-gray-800">
                          {selectedInvoice.receiverDetails?.phoneNumber}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Address:
                        </span>
                        <span className="text-gray-800">
                          {selectedInvoice.receiverDetails?.address}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">
                  Invoice Items
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full mb-4">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 text-left text-sm text-gray-600">
                          Item
                        </th>
                        <th className="p-2 text-right text-sm text-gray-600">
                          Quantity
                        </th>
                        <th className="p-2 text-right text-sm text-gray-600">
                          Price
                        </th>
                        <th className="p-2 text-right text-sm text-gray-600">
                          Discount
                        </th>
                        <th className="p-2 text-right text-sm text-gray-600">
                          Tax (%)
                        </th>
                        <th className="p-2 text-right text-sm text-gray-600">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items?.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium text-gray-800">
                            {item.itemName}
                          </td>
                          <td className="p-2 text-right text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="p-2 text-right text-gray-700">
                            ₹{item.sellingPrice}
                          </td>
                          <td className="p-2 text-right text-gray-700">
                            ₹{item?.discountAmount}
                          </td>
                          <td className="p-2 text-right text-gray-700">
                            {item?.taxRate}%
                          </td>
                          <td className="p-2 text-right font-medium text-gray-800">
                            ₹{item.grossAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-72 bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <div className="flex justify-between mb-2 text-gray-700">
                    <span>Subtotal:</span>
                    <span>₹{selectedInvoice.taxableAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-gray-700">
                    <span>Tax:</span>
                    <span>₹{selectedInvoice.taxAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-indigo-200 pt-2 mt-2 text-gray-800">
                    <span>Total:</span>
                    <span>₹{selectedInvoice.grandTotal?.toFixed(2)}</span>
                  </div>
                  {isEditMode && (
                    <div className="mt-4 pt-4 border-t border-indigo-200">
                      <div className="flex justify-between text-indigo-700 font-medium">
                        <span>Payment Amount:</span>
                        <span>
                          ₹{productDetails.paymentDetails[0].paymentAmount || 0}
                        </span>
                      </div>
                      {parseFloat(
                        productDetails.paymentDetails[0].paymentAmount || 0
                      ) < parseFloat(selectedInvoice.grandTotal || 0) && (
                        <div className="flex justify-between text-orange-600 text-sm mt-2">
                          <span>Remaining:</span>
                          <span>
                            ₹
                            {(
                              parseFloat(selectedInvoice.grandTotal || 0) -
                              parseFloat(
                                productDetails.paymentDetails[0]
                                  .paymentAmount || 0
                              )
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      {showPdfPreview && selectedInvoice && (
        <Dialog
          open={showPdfPreview}
          onClose={() => setShowPdfPreview(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="flex justify-between items-center bg-gray-50">
            <span>Invoice Preview</span>
            <IconButton onClick={() => setShowPdfPreview(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div className="p-4">
              <MNSPaymentSlip invoice={selectedInvoice} />
            </div>
          </DialogContent>
        </Dialog>
      )}

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

export default ProductPaymentInvoice;
