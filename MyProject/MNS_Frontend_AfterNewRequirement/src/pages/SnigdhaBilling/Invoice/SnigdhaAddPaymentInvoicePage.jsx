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
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as BankIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { CircularProgress } from "@mui/material";
import { IndianRupee } from "lucide-react";
import SnigdhaPaymentSlip from "../../../component/Slip/SnigdhaPaymentSlip";

const fetchInvoice = import.meta.env.VITE_REACT_FETCH_INVOICE;
const createLadgerApi = import.meta.env.VITE_REACT_CREATE_LADGER_SIN;
const fetchBank = import.meta.env.VITE_BASE_URL_C;

const SnigdhaAddPaymentInvoicePage = () => {
  const [allinvoice, setAllInvoice] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
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

  // for slip 
  const [shouldDownloadReceipt, setShouldDownloadReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // productDetails is used as the payload for the create ladger API
  const [productDetails, setProductDetails] = useState({
    invoiceId: "",
    invoiceNumber: "",
    totalAmount: "",
    paymentDetails: [
      {
        paymentDate: "",
        paymentAmount: "",
        paymentMode: "",
        transactionId: "",
      },
    ],
  });

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
        console.error("Error fetching banks:", error);
        toast.error("Failed to fetch banks");
      }
    };
    fetchBanks();
  }, [])

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

    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59);
      result = result.filter((invoice) => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
    }

    if (paymentFilter !== "all") {
      result = result.filter(
        (invoice) =>
          invoice.paymentType.toLowerCase() === paymentFilter.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((invoice) => {
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
    setCurrentPage(1);
  }, [searchTerm, searchField, allinvoice, dateRange, paymentFilter]);

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
    setFilteredInvoices(allinvoice);
  };

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
    setSelectedInvoice(invoice);
    setIsEditMode(true);
    setUpdateButton(true);
    setProductDetails({
      invoiceId: invoice._id,
      invoiceNumber: invoice.invoiceNumber || "",
      totalAmount: invoice.grandTotal || "",
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

  // Save update by posting data to the API endpoint after validation
  const handleSaveEdit = async () => {
    // Validate payment amount is not greater than grand total
    const paymentAmount =
      parseFloat(productDetails.paymentDetails[0].paymentAmount) || 0;
    const grandTotal = parseFloat(selectedInvoice.grandTotal) || 0;
    if (paymentAmount > grandTotal) {
      // toast.error("Payment Amount cannot exceed the Grand Total")
      return;
    }

    try {
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
      // console.log("jsonData in snigdha ", jsonData);

      if (!response.ok) {
        throw new Error(jsonData.message || "Failed to create ladger");
      }

      toast.success("Ladger created successfully");
      // Remove update button after successful creation
      setUpdateButton(false);
      getAllInvoices();
      handleCloseDialog();
      // setEditMode(false)

      const receiptPayload = {
        invoiceNumber: jsonData.data.invoiceNumber,
        paymentAmount: productDetails.paymentDetails[0].paymentAmount,
        paymentMode: productDetails.paymentDetails[0].paymentMode,
        paymentDate: productDetails.paymentDetails[0].paymentDate,
        transactionId: productDetails.paymentDetails[0].transactionId,
        customerName: jsonData.data?.invoiceId?.receiverDetails?.name,
        location: jsonData.data?.invoiceId?.location || ' ',
        grandTotal: jsonData.data?.invoiceId?.grandTotal || 0,

      };

      // Set receipt data and trigger download
      setReceiptData(receiptPayload);
      setShouldDownloadReceipt(true);

    } catch (error) {
      // console.error("Update Error:", error);
      toast.error(error.message || "Failed to create ladger");
    }
  };

  const handleReceiptDownloadComplete = () => {
    setShouldDownloadReceipt(false);
    setReceiptData(null);
    toast.success("Receipt downloaded successfully!");
  };

  useEffect(() => {
    if (productDetails.paymentDetails[0].paymentMode === "Cash") {
      const cashBanks = banks.filter(
        (bank) => bank.accountNumber && /^0{4,}/.test(bank.accountNumber)
      
      );
      if (cashBanks.length > 0 && !productDetails.paymentDetails[0].bankId) {
        setProductDetails((prev) => ({
          ...prev,
          paymentDetails: [
            {
              ...prev.paymentDetails[0],
              bankId: cashBanks[0]._id,
            },
          ],
        }));
      }
    }
  }, [productDetails.paymentDetails[0].paymentMode, banks]);

  const isCashAccount = (accountNumber) => {
    return /^0{4,}/.test(accountNumber);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add Receipt for Invoice in Snigdha
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
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="NetBanking">Net Banking</option>
                  <option value="Cheque">Cheque</option>
                  <option value="BankTransfer">Bank Transfer</option>

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
                            className={`px-2 py-1 rounded-full text-xs font-medium ${invoice.paymentType.toLowerCase() === "cash"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                              }`}
                          >
                            {invoice.paymentType}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex justify-center gap-2">
                            {
                              !invoice?.paidOne && (<IconButton
                                onClick={() => handleEditInvoice(invoice)}
                                size="small"
                                className="text-blue-500 hover:bg-blue-50"
                                title="Edit Invoice"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              )
                            }


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
                  </tbody>

                  <tfoot>
                    <tr className="bg-gray-200 font-semibold">
                      <td colSpan={4} className="px-4 py-3 text-right text-gray-700">Total Amount:</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-bold">
                        ₹{currentItems.reduce((total, invoice) => total + (invoice.grandTotal || 0), 0).toFixed(2)}
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
          className: "overflow-hidden",
        }}
      >
        <DialogTitle className="flex items-center justify-between bg-indigo-50 border-b">
          <span className="text-xl font-semibold flex items-center">
            {isEditMode ? (
              <>
                <PaymentIcon className="mr-2 text-indigo-600" />
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
            {isEditMode && updateButton && (
              <button
                onClick={handleSaveEdit}
                className="mr-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <IndianRupee className="mr-1" fontSize="small" />
                Save Payment
              </button>
            )}
            <IconButton onClick={handleCloseDialog} size="small" className="bg-gray-100 hover:bg-gray-200">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                    <ReceiptIcon className="mr-2 text-indigo-600" fontSize="small" />
                    Invoice Information
                  </h3>
                  {isEditMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <ReceiptIcon fontSize="small" className="mr-1 text-gray-500" />
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
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <CalendarIcon fontSize="small" className="mr-1 text-gray-500" />
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
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <PaymentIcon fontSize="small" className="mr-1 text-gray-500" />
                          Payment Type
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
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        >
                          <option value="">select payment mode</option>
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
                          <BankIcon fontSize="small" className="mr-1 text-gray-500" />
                          Select Bank *
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
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        >
                          <option value="">Select Bank Account</option>
                          {banks
                            .filter((bank) => {
                              if (productDetails.paymentDetails[0].paymentMode === "Cash") {
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
                        {productDetails.paymentDetails[0].paymentMode &&
                          !productDetails.paymentDetails[0].bankId && (
                            <p className="mt-1 text-xs text-amber-600">
                              Please select a bank account for this payment method
                            </p>
                          )}
                      </div>


                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <CreditCardIcon fontSize="small" className="mr-1 text-gray-500" />
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
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="Enter transaction ID"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <IndianRupee fontSize="small" className="mr-1 text-gray-500" />
                          Payment Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                          <input
                            type="number"
                            value={productDetails.paymentDetails[0].paymentAmount}
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
                            className="w-full p-2 pl-7 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            placeholder="0.00"
                          />
                        </div>
                        {selectedInvoice &&
                          parseFloat(
                            productDetails.paymentDetails[0].paymentAmount || 0
                          ) > parseFloat(selectedInvoice.grandTotal || 0) && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <span className="material-icons text-sm mr-1">error</span>
                              Payment Amount cannot be greater than Grand Total.
                            </p>
                          )}
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-md mt-4">
                        <p className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Invoice Total:</span>
                          <span className="text-indigo-700 font-bold">₹{selectedInvoice.grandTotal?.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <ReceiptIcon fontSize="small" className="mr-1 text-gray-400" />
                          Invoice Number:
                        </span>
                        <span className="text-gray-800 font-medium">#{selectedInvoice?.invoiceNumber}</span>
                      </p>
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <CalendarIcon fontSize="small" className="mr-1 text-gray-400" />
                          Date:
                        </span>
                        <span className="text-gray-800">{formatDate(selectedInvoice?.date)}</span>
                      </p>
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <PaymentIcon fontSize="small" className="mr-1 text-gray-400" />
                          Payment Type:
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedInvoice.paymentType.toLowerCase() === "cash"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                          }`}>
                          {selectedInvoice?.paymentType}
                        </span>
                      </p>
                      <p className="flex justify-between items-center py-2">
                        <span className="font-medium text-gray-600 flex items-center">
                          <IndianRupee fontSize="small" className="mr-1 text-gray-400" />
                          Total Amount:
                        </span>
                        <span className="text-indigo-700 font-bold">₹{selectedInvoice.grandTotal?.toFixed(2)}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                    <PersonIcon className="mr-2 text-indigo-600" fontSize="small" />
                    Customer Details
                  </h3>
                  {isEditMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <PersonIcon fontSize="small" className="mr-1 text-gray-500" />
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={selectedInvoice.receiverDetails?.name || ""}
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <span className="material-icons-outlined text-sm mr-1">phone</span>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={selectedInvoice.receiverDetails?.phoneNumber || ""}
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                          <span className="material-icons-outlined text-sm mr-1">location_on</span>
                          Address
                        </label>
                        <textarea
                          value={selectedInvoice.receiverDetails?.address || ""}
                          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                          rows="3"
                          readOnly
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <PersonIcon fontSize="small" className="mr-1 text-gray-400" />
                          Name:
                        </span>
                        <span className="text-gray-800">{selectedInvoice.receiverDetails?.name || "N/A"}</span>
                      </p>
                      <p className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600 flex items-center">
                          <span className="material-icons-outlined text-sm mr-1">phone</span>
                          Phone:
                        </span>
                        <span className="text-gray-800">{selectedInvoice.receiverDetails?.phoneNumber || "N/A"}</span>
                      </p>
                      <p className="flex justify-between py-2">
                        <span className="font-medium text-gray-600 flex items-center">
                          <span className="material-icons-outlined text-sm mr-1">location_on</span>
                          Address:
                        </span>
                        <span className="text-gray-800 text-right">{selectedInvoice.receiverDetails?.address || "N/A"}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                  <ShoppingCartIcon className="mr-2 text-indigo-600" fontSize="small" />
                  Items
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full mb-4">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-800">
                        <th className="p-2 text-left rounded-l-md">Item</th>
                        <th className="p-2 text-right">Quantity</th>
                        <th className="p-2 text-right">Price</th>
                        <th className="p-2 text-right">Discount</th>
                        <th className="p-2 text-right">Tax Rate</th>
                        <th className="p-2 text-right rounded-r-md">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items?.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{item.itemName}</td>
                          <td className="p-2 text-right">{item.quantity}</td>
                          <td className="p-2 text-right">₹{item.sellingPrice}</td>
                          <td className="p-2 text-right">₹{item?.discountAmount || 0}</td>
                          <td className="p-2 text-right">{item?.taxRate || 0}%</td>
                          <td className="p-2 text-right font-medium">₹{item.grossAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-64 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between mb-2 py-1 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₹{selectedInvoice.taxableAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 py-1 border-b border-gray-100">
                    <span className="text-gray-600">Tax:</span>
                    <span>₹{selectedInvoice.taxAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 mt-2">
                    <span>Total:</span>
                    <span className="text-indigo-700">₹{selectedInvoice.grandTotal?.toFixed(2)}</span>
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

export default SnigdhaAddPaymentInvoicePage;

