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
  DialogActions
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
import { backendDomainA } from "../../../Common/index";
import MNSPaymentSlip from "../../../component/Slip/MNSPaymentSlip";
import MnsPaymentAndViewVendorBlanceComponent from "../../../component/PaymentForCreditDebitNote/MnsPaymentAndViewVendorBlanceComponent";
import { FaStreetView } from "react-icons/fa";


const fetchInvoice = import.meta.env.VITE_BASE_URL_C;



const AddPurchasePaymentPage = () => {
  const [banks, setBanks] = useState([]);
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
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all"); // Add this line

  // for slip 
  const [shouldDownloadReceipt, setShouldDownloadReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // for vendor blance on 09-01-2026
  const [openVendorBalance, setOpenVendorBalance] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  // for voucher same above date
  const [openVoucherDialog, setOpenVoucherDialog] = useState(false);
  const [voucherNotes, setVoucherNotes] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loadingVouchers, setLoadingVouchers] = useState(false);


  // productDetails is used as the payload for the create ladger API
  const [productDetails, setProductDetails] = useState({
    invoiceId: "",
    invoiceNumber: "",
    totalAmount: "",
    vendorName: "",
    paymentDetails: [
      {
        paymentDate: "",
        paymentAmount: "",
        paymentMode: "",
        transactionId: "",
        bankId: "",
        noteType: ""
      },
    ],
  });

  const getAllInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendDomainA}/api/v1/po/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      // console.log("All Invoices:", jsonData.purchaseOrders);
      if (!response.ok) {
        throw new Error(jsonData?.message || "Failed to fetch invoices");
      }
      const sortedInvoices = (jsonData.purchaseOrders || []).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setAllInvoice(sortedInvoices);
      setFilteredInvoices(sortedInvoices);
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

  const fetchBanks = async () => {
    try {
      const response = await fetch(`${fetchInvoice}/api/v1/bank/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      if (!response.ok) {
        throw new Error(jsonData?.message || "Failed to fetch banks");
      }
      setBanks(jsonData.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error.message || "Error fetching banks");
    }
  };

  // Add this useEffect to fetch banks when component mounts
  useEffect(() => {
    fetchBanks();
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

    // Add payment status filtering
    if (paymentStatusFilter !== "all") {
      result = result.filter((invoice) => {
        if (paymentStatusFilter === "paid") {
          return invoice.paidOne === true;
        } else if (paymentStatusFilter === "unpaid") {
          return invoice.paidOne !== true;
        }
        return true;
      });
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
  }, [searchTerm, searchField, allinvoice, dateRange, paymentFilter, paymentStatusFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(
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
    setPaymentStatusFilter("all"); // Add this line
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
    setSelectedVoucher(null);
  };

  // When editing, populate selectedInvoice and productDetails
  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsEditMode(true);
    setUpdateButton(true);
    setProductDetails({
      invoiceId: invoice._id,
      invoiceNumber: invoice.invoiceNumber || "",
      totalAmount: Number((invoice.totalPayableAmount || invoice.grandTotal || 0).toFixed(2)),
      vendorName: invoice.receiverDetails?.name || "",
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
    if (productDetails?.paymentDetails?.[0]?.paymentMode !== 'Voucher') {
      setSelectedVoucher(null);
    }
  }, [productDetails?.paymentDetails?.[0]?.paymentMode])

  // Save update by posting data to the API endpoint after validation
  const handleSaveEdit = async () => {
    // Validate payment amount is not greater than grand total
    const paymentAmount =
      parseFloat(productDetails.paymentDetails[0].paymentAmount) || 0;
    const grandTotal = parseFloat(selectedInvoice.totalPayableAmount.toFixed(2) || selectedInvoice?.grandTotal.toFixed(2) || 0);
    if (productDetails.paymentDetails[0].paymentMode === 'Voucher' && selectedVoucher) {
      console.log("Voucher selected")
    } else {
      if (paymentAmount > grandTotal) {
        toast.error("Payment Amount cannot exceed the Grand Total")
        return;
      }
    }

    try {
      const updateData = { ...productDetails };

      // Add voucher information if payment mode is Voucher
      if (productDetails.paymentDetails[0].paymentMode === 'Voucher' && selectedVoucher) {
        updateData.voucherDetails = [{
          noteType: selectedVoucher?.noteType,
          noteNumber: selectedVoucher.referenceNumber,
          noteId: selectedVoucher._id,
          amount: Number(productDetails.paymentDetails[0].paymentAmount) || 0,
          date: productDetails.paymentDetails[0].date || new Date().toISOString().split("T")[0],
          vendorId: selectedInvoice?.receiverDetails?.id || null,
        }];
      }

      // console.log("Update Data:", updateData);
      // return;

      const response = await fetch(
        `${backendDomainA}/api/v1/purchase-account/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          body: JSON.stringify(updateData),
        }
      );

      const jsonData = await response.json();

      // console.log("jsonData from purchase : ", jsonData);

      if (!response.ok) {
        throw new Error(jsonData.message || "Failed to create ladger");
      }

      toast.success("Ladger created successfully");
      // Remove update button after successful creation
      setUpdateButton(false);
      getAllInvoices();
      handleCloseDialog();
      setIsEditMode(false);

      const receiptPayload = {
        invoiceNumber: jsonData.data.invoiceNumber,
        paymentAmount: productDetails.paymentDetails[0].paymentAmount,
        paymentMode: productDetails.paymentDetails[0].paymentMode,
        paymentDate: productDetails.paymentDetails[0].paymentDate,
        transactionId: productDetails.paymentDetails[0].transactionId,
        customerName: jsonData.data?.invoiceId?.receiverDetails?.name,
        location: jsonData.data?.invoiceId?.location || ' ',
        grandTotal: jsonData.data?.invoiceId?.grandTotal || 0,
        vendor: true,
      };

      // Set receipt data and trigger download
      setReceiptData(receiptPayload);
      setShouldDownloadReceipt(true);
      setSelectedVoucher(null);

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


  const handleViewVendorBalance = (vendorId) => {
    setSelectedVendorId(vendorId);
    setOpenVendorBalance(true);
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
      console.log("jsonData in voucher notes", jsonData);

      // Filter notes by customer and approved status
      const customerNotes = (jsonData.data || [])
        .filter(note =>
          note.status === 'approved' &&
          note.invoiceDetails?.receiverDetails?.id === customerId
        )
        .map(note => ({
          ...note,
          availableAmount: (note.totalFinalAmount || note.amount)  - (note.appliedAmount || 0)
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
    setSelectedVoucher(note);

    // For Credit notes, use the full amount; for debit notes, use available amount
    let amountToApply;
    if (note?.noteType === 'debit') {
      // For debit notes, use the full amount as it represents what vendor owes us
      amountToApply = parseFloat(note.totalFinalAmount || note.amount || 0);
    } else {
      // For credit notes, use the available amount
      // amountToApply = parseFloat(note.availableAmount || 0);

      // Auto-fill payment details based on selected voucher
      const maxAmount = Math.min(
        parseFloat(note.availableAmount || 0),
        parseFloat(selectedInvoice.totalPayableAmount.toFixed(2) || selectedInvoice.grandTotal.toFixed(2) || 0) - parseFloat(productDetails.paymentDetails[0].paymentAmount || 0)
      );
      amountToApply = maxAmount;

    }

    // Auto-fill payment details based on selected voucher
    setProductDetails(prev => ({
      ...prev,
      paymentDetails: [
        {
          ...prev.paymentDetails[0],
          paymentAmount: amountToApply.toFixed(2),
          transactionId: note?.noteType === 'credit'
            ? `Auto applied from Credit Note - ${note.referenceNumber}`
            : '', // Leave empty for debit notes as per requirement
          noteType: note?.noteType,
        }
      ]
    }));

    // Close the dialog after applying
    handleCloseVoucherDialog();
  };

  // Handle opening voucher dialog
  const handleOpenVoucherDialog = () => {
    if (!selectedInvoice?.receiverDetails?.id) {
      toast.error("Vendor information not available");
      return;
    }

    fetchVoucherNotes(selectedInvoice.receiverDetails.id);
    setOpenVoucherDialog(true);
  };


  // Handle closing voucher dialog
  const handleCloseVoucherDialog = () => {
    setOpenVoucherDialog(false);

    setVoucherNotes([]);
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <MnsPaymentAndViewVendorBlanceComponent
        vendorId={selectedVendorId}
        open={openVendorBalance}
        onClose={() => setOpenVendorBalance(false)}
      />
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add Payment For Purchase
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
                  {/* <option value="UPI">UPI</option>
                  <option value="NetBanking">Net Banking</option>
                  <option value="Cheque">Cheque</option>
                  <option value="BankTransfer">Bank Transfer</option> */}
                </select>
              </div>
              {/* Add Payment Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
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
                        Vendor Name
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
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {invoice?.receiverDetails?.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ₹{invoice?.totalPayableAmount?.toFixed(2) || invoice?.grandTotal?.toFixed(2)}
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
                            {!invoice?.paidOne && (
                              <IconButton
                                onClick={() => handleEditInvoice(invoice)}
                                size="small"

                                title="Edit Invoice"
                              >
                                <EditIcon fontSize="small" className="text-blue-500 hover:bg-blue-50" />
                              </IconButton>
                            )}
                            <IconButton
                              onClick={() => handleViewVendorBalance(invoice?.receiverDetails?.id)}
                              size="small"
                              title="View Vendor Balance"
                              disabled={!invoice?.receiverDetails?.id}
                            >
                              <FaStreetView fontSize="small" className="text-green-500 hover:bg-green-50" />
                            </IconButton>

                            <IconButton
                              onClick={() => viewInvoice(invoice)}
                              size="small"

                              title="View Invoice"
                            >
                              <RemoveRedEyeIcon fontSize="small" className="text-indigo-500 hover:bg-indigo-50" />
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
        <DialogTitle className="flex items-center justify-between bg-gray-50 border-b">
          <span className="text-xl font-semibold">
            {isEditMode ? "Edit Invoice" : "Invoice Details"}
          </span>
          <div>
            {isEditMode && updateButton && (
              <button
                onClick={handleSaveEdit}
                className="mr-2 px-4 cursor-pointer py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Save
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
                          value={productDetails.invoiceNumber}
                          onChange={(e) =>
                            setProductDetails({
                              ...productDetails,
                              invoiceNumber: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
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
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vendor Name
                        </label>
                        <input
                          type="text"
                          value={productDetails.vendorName || ""}
                          onChange={(e) =>
                            setProductDetails({
                              ...productDetails,
                              vendorName: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                          placeholder="Enter vendor name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Type
                        </label>
                        <select
                          value={productDetails.paymentDetails[0].paymentMode}
                          onChange={(e) => {
                            setProductDetails({
                              ...productDetails,
                              paymentDetails: [
                                {
                                  ...productDetails.paymentDetails[0],
                                  paymentMode: e.target.value,

                                  // Reset transaction ID when changing payment mode except for Voucher
                                  transactionId: e.target.value === 'Voucher'
                                    ? productDetails.paymentDetails[0].transactionId
                                    : ''
                                },
                              ],
                            })
                            // Open voucher dialog when Voucher is selected
                            if (e.target.value === 'Voucher') {
                              handleOpenVoucherDialog();
                            }
                          }}
                          className="w-full p-2 border rounded"
                        >
                          <option value=" ">select a payment method</option>
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
                      {productDetails.paymentDetails[0].paymentMode === 'Voucher' && selectedVoucher && (
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
                          className="w-full p-2 border rounded"
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
                          className="w-full p-2 border rounded"
                          readOnly={productDetails.paymentDetails[0].paymentMode === 'Voucher' && selectedVoucher && selectedVoucher?.noteType === 'credit'}
                        />
                        {productDetails.paymentDetails[0].paymentMode === 'Voucher' && selectedVoucher && (
                          <p className="mt-1 text-xs text-gray-500">
                            Auto-filled from {selectedVoucher?.noteType === 'credit' ? 'Credit' : 'Debit'} Note: {selectedVoucher.referenceNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Amount
                        </label>
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
                          className="w-full p-2 border rounded"
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e') {
                              e.preventDefault();
                            }
                          }}
                          min="0"

                        />
                        {selectedInvoice && productDetails?.paymentDetails?.[0]?.paymentMode !== "Voucher" &&
                          parseFloat(
                            productDetails.paymentDetails[0].paymentAmount || 0
                          ) > parseFloat(selectedInvoice.totalPayableAmount.toFixed(2) || selectedInvoice.grandTotal.toFixed(2) || 0) && (
                            <p className="text-red-500 text-sm mt-1">
                              Payment Amount cannot be greater than Grand Total.
                            </p>
                          )}
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
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-3 text-gray-700 border-b pb-2">
                  Items
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left text-gray-600">Item</th>
                        <th className="p-2 text-right text-gray-600">
                          Quantity
                        </th>
                        <th className="p-2 text-right text-gray-600">Price</th>
                        <th className="p-2 text-right text-gray-600">
                          Discount Amount
                        </th>
                        <th className="p-2 text-right text-gray-600">
                          Tax Rate (%)
                        </th>
                        <th className="p-2 text-right text-gray-600">
                          Gross Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items?.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100">
                          <td className="p-2 font-medium">{item.itemName}</td>
                          <td className="p-2 text-right">{item.quantity}</td>
                          <td className="p-2 text-right">₹{item.unitPrice}</td>
                          <td className="p-2 text-right">
                            ₹{item?.discountAmount}
                          </td>
                          <td className="p-2 text-right">{item?.taxRate}%</td>
                          <td className="p-2 text-right font-medium">
                            ₹{item.grossAmount}
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
                    <span>₹{selectedInvoice.taxableAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax :</span>
                    <span>₹{selectedInvoice.taxAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>₹{selectedInvoice.totalPayableAmount?.toFixed(2) || selectedInvoice.grandTotal?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${note && note.noteType === 'credit'
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}>
                          {note && note?.noteType === 'credit' ? 'Credit Note' : 'Debit Note'}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {formatDate(note.date)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-right">
                        ₹{parseFloat(note.amount || 0).toFixed(2)}
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
              <p className="text-gray-500">No approved credit/debit notes available for this vendor</p>
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

export default AddPurchasePaymentPage;


