import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendDomainS } from "../../../common/index";
import { format } from "date-fns";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaFileInvoice,
  FaMoneyBillWave,
  FaStore,
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SnigdhaManagePurchaseTransactionPage = () => {
  // State for purchase data
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    vendorName: "",
    paymentMethod: "",
    bankId: "",
  });

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    amount: "",
    vendorName: "",
    paymentMethod: "bank",
    bankId: "",
  });

  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchPurchases();
    fetchBanks();
    fetchInvoices();
  }, []);

  // Apply filters and search when they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [purchases, searchTerm, filters]);

  // Update pagination when filtered purchases change
  useEffect(() => {
    setTotalItems(filteredPurchases.length);
    setTotalPages(Math.ceil(filteredPurchases.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredPurchases, itemsPerPage]);

  // Fetch all purchases
  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendDomainS}/api/v1/purchase-window/all`
      );
      if (response.data?.success) {
        setPurchases(response.data.data || []);
        setFilteredPurchases(response.data.data || []);
        setTotalItems(response.data.data?.length || 0);
        setTotalPages(
          Math.ceil((response.data.data?.length || 0) / itemsPerPage)
        );
      } else {
        setPurchases([]);
        setFilteredPurchases([]);
        setTotalItems(0);
        setTotalPages(0);
        toast.error("Failed to fetch purchases");
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
      setPurchases([]);
      setFilteredPurchases([]);
      setTotalItems(0);
      setTotalPages(0);
      toast.error("Failed to fetch purchases");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all banks
  const fetchBanks = async () => {
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/bank/all`);
      if (response.data?.success) {
        setBanks(response.data.data || []);
      } else {
        setBanks([]);
        toast.error("Failed to fetch banks");
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      setBanks([]);
      toast.error("Failed to fetch banks");
    }
  };

  // Fetch all invoices
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        `${backendDomainS}/api/v1/purchase-order/all`
      );
      if (response.data?.success) {
        setInvoices(response.data.data || []);
      } else {
        setInvoices([]);
        toast.error("Failed to fetch purchase transactions");
      }
    } catch (error) {
      console.error("Error fetching Purchase transactions :", error);
      setInvoices([]);
      // toast.error("Failed to fetch invoices");
    }
  };

  // Apply filters and search
  const applyFiltersAndSearch = () => {
    if (!purchases.length) {
      setFilteredPurchases([]);
      return;
    }

    let filtered = [...purchases];

    // Apply search term (search in invoice number or vendor name)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (purchase) =>
          purchase.invoiceNumber?.toLowerCase().includes(search) ||
          purchase.vendorName?.toLowerCase().includes(search)
      );
    }

    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(
        (purchase) => new Date(purchase.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (purchase) => new Date(purchase.date) <= new Date(filters.endDate)
      );
    }

    // Apply amount filters
    if (filters.minAmount) {
      filtered = filtered.filter(
        (purchase) => purchase.amount >= parseFloat(filters.minAmount)
      );
    }

    if (filters.maxAmount) {
      filtered = filtered.filter(
        (purchase) => purchase.amount <= parseFloat(filters.maxAmount)
      );
    }

    // Apply vendor name filter
    if (filters.vendorName) {
      const vendorSearch = filters.vendorName.toLowerCase();
      filtered = filtered.filter((purchase) =>
        purchase.vendorName?.toLowerCase().includes(vendorSearch)
      );
    }

    // Apply payment method filter
    if (filters.paymentMethod) {
      filtered = filtered.filter(
        (purchase) => purchase.paymentMethod === filters.paymentMethod
      );
    }

    // Apply bank filter
    if (filters.bankId) {
      filtered = filtered.filter(
        (purchase) => purchase.bankId === filters.bankId
      );
    }

    setFilteredPurchases(filtered);
  };

  // Handle filter changes
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
      minAmount: "",
      maxAmount: "",
      vendorName: "",
      paymentMethod: "",
      bankId: "",
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

  // Get paginated purchases
  const getPaginatedPurchases = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPurchases.slice(startIndex, endIndex);
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

  // Open modal for creating a new purchase
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      invoiceNumber: "",
      invoiceId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      amount: "",
      vendorName: "",
      paymentMethod: "bank",
      bankId: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for editing a purchase
  const openEditModal = (purchase) => {
    setModalMode("edit");
    setSelectedPurchase(purchase);
    setFormData({
      invoiceNumber: purchase.invoiceNumber || "",
      invoiceId: purchase.invoiceId?._id || purchase.invoiceId || "",
      date: format(new Date(purchase.date), "yyyy-MM-dd"),
      amount: purchase.amount || "",
      vendorName: purchase.vendorName || "",
      paymentMethod: purchase.paymentMethod || "bank",
      bankId: purchase.bankId?._id || purchase.bankId || "",
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPurchase(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.invoiceNumber ||
      !formData.invoiceId ||
      !formData.date ||
      !formData.amount ||
      !formData.vendorName ||
      !formData.paymentMethod ||
      (formData.paymentMethod === "bank" && !formData.bankId)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (modalMode === "create") {
        // Create new purchase
        response = await axios.post(
          `${backendDomainS}/api/v1/purchase-window/create`,
          formData
        );
        if (response.data?.success) {
          toast.success("Purchase created successfully");
          fetchPurchases();
          closeModal();
        } else {
          toast.error(response.data?.message || "Failed to create purchase");
        }
      } else {
        // Update existing purchase
        response = await axios.put(
          `${backendDomainS}/api/v1/purchase-window/update/${selectedPurchase._id}`,
          formData
        );
        if (response.data?.success) {
          toast.success("Purchase updated successfully");
          fetchPurchases();
          closeModal();
        } else {
          toast.error(response.data?.message || "Failed to update purchase");
        }
      }
    } catch (error) {
      console.error(
        `Error ${modalMode === "create" ? "creating" : "updating"} purchase:`,
        error
      );
      toast.error(
        `Failed to ${modalMode === "create" ? "create" : "update"} purchase`
      );
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (purchase) => {
    setPurchaseToDelete(purchase);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPurchaseToDelete(null);
  };

  // Handle delete purchase
  const handleDeletePurchase = async () => {
    if (!purchaseToDelete) return;

    setLoading(true);

    try {
      const response = await axios.delete(
        `${backendDomainS}/api/v1/purchase-window/delete/${purchaseToDelete._id}`
      );

      if (response.data?.success) {
        toast.success("Purchase deleted successfully");
        fetchPurchases();
        closeDeleteModal();
      } else {
        toast.error(response.data?.message || "Failed to delete purchase");
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
      toast.error("Failed to delete purchase");
    } finally {
      setLoading(false);
    }
  };

  // Get bank name by ID
  const getBankName = (bankId) => {
    const bank = banks.find((bank) => bank._id === bankId);
    return bank ? bank.bankName : "Unknown Bank";
  };

  // Get invoice number by ID
  const getInvoiceNumber = (invoiceId) => {
    const invoice = invoices.find((invoice) => invoice._id === invoiceId);
    return invoice ? invoice.invoiceNumber : "Unknown Invoice";
  };

  // ... existing code ...

  // Generate PDF
  const generatePDF = () => { 
    const doc = new jsPDF(); 
  
    // Add title 
    doc.setFontSize(18); 
    doc.text("Purchase Transactions in Tamanna ", 14, 22); 
  
    // Add date 
    doc.setFontSize(11); 
    doc.text(`Generated on: ${format(new Date(), "dd MMM yyyy")}`, 14, 30); 
  
    // Define table columns 
    const tableColumn = ["Sl. No", "Date", "Invoice #", "Vendor", "Amount", "Payment Method", "Bank"]; 
  
    // Define table rows 
    const tableRows = filteredPurchases.map((purchase, index) => [ 
      `${index + 1}.`, 
      formatDate(purchase.date), 
      purchase.invoiceNumber, 
      purchase.vendorName, 
      `${purchase.amount.toLocaleString()}`, 
      purchase.paymentMethod, 
      purchase.bankId ? (typeof purchase.bankId === 'object' ? purchase.bankId.bankName : getBankName(purchase.bankId)) : 'N/A' 
    ]); 
  
    // Calculate total amount
    const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    
    // Add summary row
    tableRows.push([
      '',
      '',
      '',
      'Total:',
      `${totalAmount.toLocaleString()}`,
      '',
      ''
    ]);
  
    // Generate table 
    doc.autoTable({ 
      head: [tableColumn], 
      body: tableRows, 
      startY: 40, 
      styles: { 
        fontSize: 10, 
        cellPadding: 3, 
        overflow: "linebreak", 
      }, 
      columnStyles: { 
        3: { halign: "right" }, 
        4: { halign: "right" }
      }, 
      // Style for the summary row
      didParseCell: function(data) {
        if (data.row.index === tableRows.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [240, 240, 240];
        }
      }
    }); 
  
    // Save PDF 
    doc.save("purchase_report.pdf"); 
  }; 

  // Prepare CSV data for export
 // Prepare CSV data for export
const prepareCSVData = () => {
  const csvData = [
    ['Sl. No', 'Date', 'Invoice Number', 'Vendor', 'Amount', 'Payment Method', 'Bank']
  ];

  filteredPurchases.forEach((purchase, index) => {
    csvData.push([
      `${index + 1}.`,
      formatDate(purchase.date),
      purchase.invoiceNumber,
      purchase.vendorName,
      purchase.amount,
      purchase.paymentMethod,
      purchase.bankId ? (typeof purchase.bankId === 'object' ? purchase.bankId.bankName : getBankName(purchase.bankId)) : 'N/A'
    ]);
  });

  // Calculate total amount
  const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  
  // Add summary row
  csvData.push([
    '',
    '',
    '',
    'Total:',
    totalAmount,
    '',
    ''
  ]);

  return csvData;
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Purchases</h1>
          <p className="text-gray-600">
            Create, view, and manage purchase payments
          </p>
        </div>
        {/* <button
          onClick={openCreateModal}
          className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="mr-2" />
          New Purchase
        </button> */}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="w-full md:w-1/3 relative mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by invoice number or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaFilter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              <button
                onClick={generatePDF}
                className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaFilePdf className="mr-2 h-4 w-4" />
                PDF
              </button>
              
              <CSVLink
                data={prepareCSVData()}
                filename="purchase_report.csv"
                className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaFileExcel className="mr-2 h-4 w-4" />
                Excel
              </CSVLink>

              {showFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Amount
                </label>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Min Amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Amount
                </label>
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Max Amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor
                </label>
                <input
                  type="text"
                  name="vendorName"
                  value={filters.vendorName}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Vendor Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={filters.paymentMethod}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Methods</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="upi">UPI</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-3 lg:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank
                </label>
                <select
                  name="bankId"
                  value={filters.bankId}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Banks</option>
                  {banks.map((bank) => (
                    <option key={bank._id} value={bank._id}>
                      {bank.bankName} - {bank.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
        </div>
      </div>
    
      {/* Purchases Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Purchase Payments
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              className="border border-gray-300 rounded-md text-sm"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sl. No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPaginatedPurchases().length > 0 ? (
                    getPaginatedPurchases().map((purchase, index) => (
                      <tr
                        key={purchase._id || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(currentPage - 1) * itemsPerPage + index + 1}.
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(purchase.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {purchase.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {purchase.vendorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{purchase.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              purchase.paymentMethod === "bank"
                                ? "bg-blue-100 text-blue-800"
                                : purchase.paymentMethod === "cash"
                                ? "bg-green-100 text-green-800"
                                : purchase.paymentMethod === "cheque"
                                ? "bg-purple-100 text-purple-800"
                                : purchase.paymentMethod === "upi"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {purchase.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {purchase.bankId ? (
                            typeof purchase.bankId === "object" ? (
                              purchase.bankId.bankName
                            ) : (
                              getBankName(purchase.bankId)
                            )
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(purchase)}
                            className="text-indigo-600 cursor-pointer hover:text-indigo-900 mr-4"
                          >
                            <FaEdit className="inline h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(purchase)}
                            className="text-red-600 cursor-pointer hover:text-red-900"
                          >
                            <FaTrash className="inline h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No purchase records found
                      </td>
                    </tr>
                  )}

                  {/* Summary Rows */}
                  {getPaginatedPurchases().length > 0 && (
                    <>
                      {/* Page Summary */}
                      <tr className="bg-gray-100 font-medium">
                        <td
                          colSpan="4"
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right"
                        >
                          <strong>Page Total:</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹
                          {getPaginatedPurchases()
                            .reduce((sum, purchase) => sum + purchase.amount, 0)
                            .toLocaleString()}
                        </td>
                        <td colSpan="4"></td>
                      </tr>

                      {/* Payment Method Breakdown */}
                      {/* <tr className="bg-blue-50 font-medium">
                        <td
                          colSpan="3"
                          className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 text-right"
                        >
                          <strong>Bank Payments:</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                          ₹
                          {getPaginatedPurchases()
                            .filter(
                              (purchase) => purchase.paymentMethod === "bank"
                            )
                            .reduce((sum, purchase) => sum + purchase.amount, 0)
                            .toLocaleString()}
                        </td>
                        <td colSpan="3"></td>
                      </tr> */}

                      {/* <tr className="bg-green-50 font-medium">
                        <td
                          colSpan="3"
                          className="px-6 py-4 whitespace-nowrap text-sm text-green-900 text-right"
                        >
                          <strong>Cash Payments:</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900">
                          ₹
                          {getPaginatedPurchases()
                            .filter(
                              (purchase) => purchase.paymentMethod === "cash"
                            )
                            .reduce((sum, purchase) => sum + purchase.amount, 0)
                            .toLocaleString()}
                        </td>
                        <td colSpan="3"></td>
                      </tr> */}

                      {/* Grand Total */}
                      <tr className="bg-gray-200 font-medium">
                        <td
                          colSpan="4"
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right"
                        >
                          <strong>
                            Grand Total ({filteredPurchases.length} purchases):
                          </strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹
                          {filteredPurchases
                            .reduce((sum, purchase) => sum + purchase.amount, 0)
                            .toLocaleString()}
                        </td>
                        <td colSpan="3"></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{" "}
                  of <span className="font-medium">{totalItems}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-blue-600 cursor-pointer hover:bg-blue-50"
                    }`}
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-blue-600 cursor-pointer hover:bg-blue-50"
                    }`}
                  >
                    Previous
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
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white cursor-pointer text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white cursor-pointer text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white cursor-pointer text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* No Purchases Message */}
        {!loading && purchases.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <FaFileInvoice className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Purchase Records Found
            </h2>
            <p className="text-gray-500 mb-6">
              Start by creating a new purchase payment record using the "New
              Purchase" button above.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 max-w-md mx-auto">
              <p className="font-medium mb-2">💡 Tip:</p>
              <p>
                Make sure you have invoices and bank accounts set up before
                creating purchase records.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Purchase Modal */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {modalMode === "create"
                      ? "Create New Purchase"
                      : "Edit Purchase"}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="invoiceNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Invoice Number*
                        </label>
                        <input
                          type="text"
                          id="invoiceNumber"
                          name="invoiceNumber"
                          value={formData.invoiceNumber}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="invoiceId"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Invoice*
                        </label>
                        <select
                          id="invoiceId"
                          name="invoiceId"
                          value={formData.invoiceId}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Invoice</option>
                          {invoices.map((invoice) => (
                            <option key={invoice._id} value={invoice._id}>
                              {invoice.invoiceNumber} -{" "}
                              {invoice.vendorName || "Unknown Vendor"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date*
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="amount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Amount (₹)*
                        </label>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="vendorName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Vendor Name*
                        </label>
                        <input
                          type="text"
                          id="vendorName"
                          name="vendorName"
                          value={formData.vendorName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="paymentMethod"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Payment Method*
                        </label>
                        <select
                          id="paymentMethod"
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="bank">Bank Transfer</option>
                          <option value="cash">Cash</option>
                          <option value="cheque">Cheque</option>
                          <option value="upi">UPI</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {formData.paymentMethod === "bank" && (
                        <div>
                          <label
                            htmlFor="bankId"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Bank Account*
                          </label>
                          <select
                            id="bankId"
                            name="bankId"
                            value={formData.bankId}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          >
                            <option value="">Select Bank Account</option>
                            {banks.map((bank) => (
                              <option key={bank._id} value={bank._id}>
                                {bank.bankName} - {bank.accountNumber}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex cursor-pointer justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={loading}
                      >
                        {loading
                          ? "Processing..."
                          : modalMode === "create"
                          ? "Create"
                          : "Update"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this purchase record? This
                      action cannot be undone.
                    </p>
                    {purchaseToDelete && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-700">
                          Invoice: {purchaseToDelete.invoiceNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Vendor: {purchaseToDelete.vendorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Amount: ₹{purchaseToDelete.amount?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {formatDate(purchaseToDelete.date)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex cursor-pointer justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={closeDeleteModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={handleDeletePurchase}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Delete"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SnigdhaManagePurchaseTransactionPage;
