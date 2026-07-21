import React, { useEffect, useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight, FaPlus } from "react-icons/fa6";
import {
  FaEdit,
  FaUpload,
  FaFileExcel,
  FaCheckCircle,
  FaExclamationCircle,
  FaWindowClose,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaEye } from "react-icons/fa"; // Added eye icon for view button
import AddCustomer from "../AddCustomer";
import urls from "../../../Common/url";
import toast from "react-hot-toast";
import { backendDomainR1 } from "../../../Common/index";
import * as XLSX from "xlsx";
import NewProjectFormComponent from "../../Operation/NewProjectFormComponent";
import { DownloadIcon } from "lucide-react";
import ExcelJS from "exceljs";

const {
  getAllCustomerUrl,
  createCustomerUrl,
  deleteCustomerUrl,
  updateCustomerUrl,
} = urls;

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  // Added state for view customer details
  const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);
  const [customerToView, setCustomerToView] = useState(null);

  // for upload

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [orderDetails, setOrderDetails] = useState(null);

  // for upload funciton

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        setUploadError("Please upload an Excel file (.xlsx or .xls)");
        setUploadFile(null);
        return;
      }

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size exceeds 10MB limit");
        setUploadFile(null);
        return;
      }

      setUploadFile(file);
      setUploadError(null);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await fetch(`${backendDomainR1}/api/v1/mns/crm/upload`, {
        method: "POST",
        body: formData,
      });

      // console.log('Upload response status:', response.status);

      // Check if the response is successful based on status code
      if (response.ok) {
        // Try to parse as JSON, but handle text response as well
        let result;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
        } else {
          // If not JSON, get the text response
          const textResult = await response.text();
          // console.log('Text response:', textResult);

          // Consider the upload successful if we got a 2xx status code
          result = {
            success: true,
            message: "Customers uploaded successfully",
          };
        }

        toast.success("Customers uploaded successfully!");

        // Close modal and reset
        setIsUploadModalOpen(false);
        setUploadFile(null);

        // Refresh customer list
        getAllCustomerData();
      } else {
        // Handle error response
        let errorMessage;
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.message || "Failed to upload customers";
        } catch (e) {
          // If error response is not JSON
          const textError = await response.text();
          errorMessage = textError || `Server error: ${response.status}`;
        }

        setUploadError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      // console.error('Upload error:', error);
      setUploadError("An error occurred during upload");
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  // For filtering dropdowns, we use existing segments/statuses from Data
  const uniqueSegments = [...new Set(data?.map((item) => item.segment))];
  const uniqueStatuses = [...new Set(data?.map((item) => item.status))];

  const getAllCustomerData = async () => {
    try {
      const customerData = await fetch(getAllCustomerUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const res = await customerData.json();
      console.log("customerData", res);
      setData(res?.data || []);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getAllCustomerData();
  }, []);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "segment") {
      setSelectedSegments((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else if (filterType === "status") {
      setSelectedStatuses((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const resetFilters = () => {
    setSelectedSegments([]);
    setSelectedStatuses([]);
    setSearchTerm("");
  };

  const filteredData = data?.filter((item) => {
    const matchesSearch =
      item.companyName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item.companyEmail?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesSegment =
      selectedSegments.length === 0 || selectedSegments.includes(item.segment);
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
    return matchesSearch && matchesSegment && matchesStatus;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Save handler for the AddCustomer component.
  // It receives the new customer data, posts it to the API, and then updates the table.
  const handelSave = async (customer) => {
    // console.log("Customer", customer);
    try {
      const addCustomer = await fetch(createCustomerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
      const res = await addCustomer.json();
      if (res) {
        toast.success("Customer created successfully");
        getAllCustomerData();
      }

      // Optionally, add the new customer to the table state:
      const newId = data?.length
        ? Math.max(...data.map((item) => item.id)) + 1
        : 1;
      const customerToAdd = { id: newId, ...customer };
      setData((prev) => [...prev, customerToAdd]);
      setIsAddCustomerOpen(false);
    } catch (error) {
      // console.log(error);
      toast.error("Server Error");
    }
  };

  // Update handler for editing a customer.
  const handelUpdate = async (updatedCustomer) => {
    try {
      const updateData = await fetch(
        `${updateCustomerUrl}/${updatedCustomer.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCustomer),
        }
      );
      const res = await updateData.json();
      if (res.message !== "Clients updated successfully") {
        toast.error("Client not updated");
        return;
      }
      console.log(res);
      setData((prev) =>
        prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
      );
      toast.success("Customer updated successfully");
    } catch (error) {
      // console.log(error);
      toast.error("Server Error");
    }
  };

  // Delete handler for removing a customer.
  const handleDelete = async (id) => {
    // Optionally, call your API to delete the customer.
    try {
      const deleteCustomer = await fetch(`${deleteCustomerUrl}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const res = await deleteCustomer.json();
      if (res) {
        toast.success("Customer deleted successfully");
        setData((prev) => prev.filter((c) => c.id !== id));
        getAllCustomerData();
      }

      setIsDeleteConfirmationOpen(false);
    } catch (error) {
      toast.error("Server Error");
    }
  };

  // Handler for viewing customer details
  const handleViewCustomer = (customer) => {
    setCustomerToView(customer);
    setIsViewCustomerOpen(true);
  };

  // Inline component for editing a customer.
  const EditCustomerModal = ({
    customer,
    setIsEditCustomerOpen,
    handelUpdate,
  }) => {
    const [editCustomer, setEditCustomer] = useState(customer);
    const segments = ["Leads", "Prospects", "Clients"];
    const statuses = ["Engaged", "Inactive"];

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditCustomer((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // Process addresses before saving
      const processedCustomer = {
        ...editCustomer,
        companyAddress: editCustomer.companyAddress
          ? Array.isArray(editCustomer.companyAddress)
            ? editCustomer.companyAddress
            : editCustomer.companyAddress
              .split(",")
              .map((addr) => addr.trim())
              .filter((addr) => addr !== "")
          : [],
        deliveryAddress: editCustomer.deliveryAddress
          ? Array.isArray(editCustomer.deliveryAddress)
            ? editCustomer.deliveryAddress
            : editCustomer.deliveryAddress
              .split(",")
              .map((addr) => addr.trim())
              .filter((addr) => addr !== "")
          : [],
      };

      handelUpdate(processedCustomer);
      setIsEditCustomerOpen(false);
    };




    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh] border-t-4 border-blue-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-3">
            Edit Customer
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Client Name*
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={editCustomer.companyName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Company Category */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Client Category
                  </label>
                  <input
                    type="text"
                    name="companyCategory"
                    value={editCustomer.companyCategory}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Company Email */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Client Email
                  </label>
                  <input
                    type="email"
                    name="companyEmail"
                    value={editCustomer.companyEmail}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Company Number */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Client Number
                  </label>
                  <input
                    type="text"
                    name="companyNumber"
                    value={editCustomer.companyNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Company Alternate Number */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Client Alternate Number
                  </label>
                  <input
                    type="text"
                    name="companyAlternateNumber"
                    value={editCustomer.companyAlternateNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Landline Number */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Landline Number
                  </label>
                  <input
                    type="text"
                    name="landlineNumber"
                    value={editCustomer.landlineNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* GST Number */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={editCustomer.gstNumber || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* PAN Number */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={editCustomer.panNumber || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* state  */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={editCustomer.state || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editCustomer.location || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>


              </div>

              {/* Company Address as Textarea - Full Width */}
              <div className="mt-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Client Address
                </label>
                <textarea
                  name="companyAddress"
                  value={
                    Array.isArray(editCustomer.companyAddress)
                      ? editCustomer.companyAddress.join(", ")
                      : editCustomer.companyAddress || ""
                  }
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Separate addresses with commas"
                  rows="2"
                />
              </div>

              {/* Delivery Address as Textarea - Full Width */}
              <div className="mt-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Delivery Address
                </label>
                <textarea
                  name="deliveryAddress"
                  value={
                    Array.isArray(editCustomer.deliveryAddress)
                      ? editCustomer.deliveryAddress.join(", ")
                      : editCustomer.deliveryAddress || ""
                  }
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Separate delivery addresses with commas"
                  rows="2"
                />
              </div>
            </div>

            {/* Contact Person Section */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-green-800">
                Contact Person Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Person Name */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    name="contactPersonName"
                    value={editCustomer.contactPersonName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Contact Person Email */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Contact Person Email
                  </label>
                  <input
                    type="email"
                    name="contactPersonEmail"
                    value={editCustomer.contactPersonEmail}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Contact Phone Number */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    name="contactPhoneNumber"
                    value={editCustomer.contactPhoneNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Alternate Number */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Alternate Number
                  </label>
                  <input
                    type="text"
                    name="alternateNumber"
                    value={editCustomer.alternateNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Banking Details Section */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-purple-800">
                Banking Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bank Name */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={editCustomer.bankName || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Account Number */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={editCustomer.accountNumber || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* IFSC Code */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={editCustomer.ifscCode || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Bank Branch */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Bank Branch
                  </label>
                  <input
                    type="text"
                    name="bankBranch"
                    value={editCustomer.bankBranch || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Account Holder Name */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={editCustomer.accountHolderName || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Classification Section */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-yellow-800">
                Classification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Segment Select */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Segment
                  </label>
                  <select
                    name="segment"
                    value={editCustomer.segment}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {segments.map((segment) => (
                      <option key={segment} value={segment}>
                        {segment}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Select */}
                <div className="flex flex-col">
                  <label className="block mb-1 font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editCustomer.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsEditCustomerOpen(false)}
                className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-5 py-2 rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors duration-300 flex items-center"
              >
                <FaEdit className="mr-2" /> Update Client
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleAddOrder = (item) => {
    setIsAddRecordOpen(true);
    setOrderDetails(item);
  }

  const ViewCustomerModal = ({ customer, setIsViewCustomerOpen }) => {
    console.log("Customer in ViewCustomerModal:", customer);
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh] border-t-4 border-blue-600">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              <span className="text-blue-600">Customer Details:</span>{" "}
              {customer.companyName}
            </h2>
            <button
              onClick={() => setIsViewCustomerOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-700 mb-3 border-b pb-2">
                Company Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-700">
                    Company Name:
                  </span>{" "}
                  <span className="text-gray-800">{customer.companyName}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  <span className="text-gray-800">
                    {customer.companyEmail || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Landline:</span>{" "}
                  <span className="text-gray-800">
                    {customer.landlineNumber || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Company Number:
                  </span>{" "}
                  <span className="text-gray-800">
                    {customer.companyNumber || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Alternate Number:
                  </span>{" "}
                  <span className="text-gray-800">
                    {customer.companyAlternateNumber || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Category:</span>{" "}
                  <span className="text-gray-800">
                    {customer.companyCategory || "N/A"}
                  </span>
                </p>
                {/* <p>
                  <span className="font-medium text-gray-700">Demand:</span>{" "}
                  <span className="text-gray-800">
                    {customer.companyDemand || "N/A"}
                  </span>
                </p> */}
                <p>
                  <span className="font-medium text-gray-700">GST Number:</span>{" "}
                  <span className="text-gray-800">
                    {customer.gstNumber || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">PAN Number:</span>{" "}
                  <span className="text-gray-800">
                    {customer.panNumber || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Location:</span>{" "}
                  <span className="text-gray-800">
                    {customer.location || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">State:</span>{" "}
                  <span className="text-gray-800">
                    {customer.state || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Address:</span>{" "}
                  <span className="text-gray-800">
                    {Array.isArray(customer.companyAddress)
                      ? customer.companyAddress.join(", ")
                      : customer.companyAddress || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Delivery Address:
                  </span>{" "}
                  <span className="text-gray-800">
                    {Array.isArray(customer.deliveryAddress)
                      ? customer.deliveryAddress.join(", ")
                      : customer.deliveryAddress || "N/A"}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-700 mb-3 border-b pb-2">
                Contact Person Details
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-700">Name:</span>{" "}
                  <span className="text-gray-800">
                    {customer.contactPersonName || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  <span className="text-gray-800">
                    {customer.contactPersonEmail || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Phone:</span>{" "}
                  <span className="text-gray-800">
                    {customer.contactPhoneNumber || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Alternate Number:
                  </span>{" "}
                  <span className="text-gray-800">
                    {customer.alternateNumber || "N/A"}
                  </span>
                </p>
              </div>

              <h3 className="text-lg font-semibold text-indigo-700 mt-6 mb-3 border-b pb-2">
                Banking Details
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-700">Bank Name:</span>{" "}
                  <span className="text-gray-800">
                    {customer.bankName || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Account Number:
                  </span>{" "}
                  <span className="text-gray-800">
                    {customer.accountNumber || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">IFSC Code:</span>{" "}
                  <span className="text-gray-800">
                    {customer.ifscCode || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Bank Branch:
                  </span>{" "}
                  <span className="text-gray-800">
                    {customer.bankBranch || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    Account Holder:
                  </span>{" "}
                  <span className="text-gray-800">
                    {customer.accountHolderName || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-purple-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-purple-700 mb-3 border-b pb-2">
              Status Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-medium text-gray-700">Segment:</span>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${customer.segment === "Leads"
                      ? "bg-yellow-100 text-yellow-800"
                      : customer.segment === "Prospects"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                      }`}
                  >
                    {customer.segment}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${customer.status === "Engaged"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {customer.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsViewCustomerOpen(false)}
              className="bg-gradient-to-r cursor-pointer from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };


  const downloadTemplateFile = () => {
    // Create a workbook with a template sheet
    const workbook = XLSX.utils.book_new();

    // Define the headers/columns for the template that match the exact payload structure
    const headers = [
      "ClientName",
      "ClientEmail",
      "ClientNumber",
      "ClientAlternateNumber",
      "LandlineNumber",
      "GSTNumber",
      "PANNumber",
      "State",
      "ClientAddress",
      "DeliveryAddress",
      "ContactPersonName",
      "ContactPersonEmail",
      "ContactPhoneNumber",
      "AlternateNumber",
      "BankName",
      "AccountNumber",
      "IFSCCode",
      "BankBranch",
      "AccountHolderName",
      "Segment",
      "Status",
      "ClientCategory",
      "companyDemand",
      "location",

    ];

    // Create sample data row with empty values
    const sampleData = headers.map(() => "");

    // Add a second row with sample data for reference
    const exampleRow = [
      "ABC Company Ltd",
      "contact@abccompany.com",
      "9876543210",
      "9876543211",
      "044-12345678",
      "22AAAAA0000A1Z5",
      "AAAAA0000A",
      "WB",
      "123 Main Street, City, State, PIN",
      "456 Warehouse Area, City, State, PIN",
      "John Doe",
      "john.doe@abccompany.com",
      "9876543212",
      "9876543213",
      "HDFC Bank",
      "12345678901234",
      "HDFC0001234",
      "Chennai Main Branch",
      "ABC Company Ltd",
      "Clients", // Valid values: Leads, Prospects, Clients
      "Engaged", // Valid values: Engaged, Inactive
      "Manufacturing",
      "High",
      "Chennai",
    ];

    // Create worksheet with headers and sample data
    const wsData = [headers, sampleData, exampleRow];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths for better readability
    const colWidths = headers.map(() => ({ wch: 20 }));
    ws["!cols"] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, ws, "Customer Template");

    // Add a notes sheet with instructions
    const notesData = [
      ["Instructions for filling the template:"],
      [""],
      ["1. Do not change the column headers - they must match exactly with the system fields"],
      ["2. Required fields: companyName, companyEmail, companyNumber, contactPersonName, contactPersonEmail, contactPhoneNumber, segment, status"],
      ["3. Valid segment values: Leads, Prospects, Clients"],
      ["4. Valid status values: Engaged, Inactive"],
      ["5. For GST Number, follow the format: 22AAAAA0000A1Z5"],
      ["6. For PAN Number, follow the format: AAAAA0000A"],
      ["7. Phone numbers should be numeric only"],
      ["8. The second row contains example data for reference"],
      ["9. Delete the example row before uploading"],
      ["10. For addresses, use comma-separated values if multiple addresses are needed"],
    ];

    const notesSheet = XLSX.utils.aoa_to_sheet(notesData);
    XLSX.utils.book_append_sheet(workbook, notesSheet, "Instructions");

    // Generate the Excel file and trigger download
    XLSX.writeFile(workbook, "Customer_Upload_Template.xlsx");

    toast.success("Template downloaded successfully");
  };

  const downloadAllCustomersAsExcel = () => {
  // Use exceljs for better formatting
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Customers');

  // Define columns
  worksheet.columns = [
    { header: 'S.No', key: 'sno', width: 8 },
    { header: 'Company Name', key: 'companyName', width: 25 },
    { header: 'Email', key: 'companyEmail', width: 25 },
    { header: 'Location', key: 'location', width: 18 },
    { header: 'Landline', key: 'landlineNumber', width: 15 },
    { header: 'Segment', key: 'segment', width: 12 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Category', key: 'companyCategory', width: 15 },
    { header: 'GST Number', key: 'gstNumber', width: 18 },
    { header: 'PAN Number', key: 'panNumber', width: 18 },
    { header: 'Client Number', key: 'companyNumber', width: 15 },
    { header: 'Alternate Number', key: 'companyAlternateNumber', width: 15 },
    { header: 'Contact Person Name', key: 'contactPersonName', width: 20 },
    { header: 'Contact Person Email', key: 'contactPersonEmail', width: 20 },
    { header: 'Contact Phone Number', key: 'contactPhoneNumber', width: 18 },
    { header: 'Bank Name', key: 'bankName', width: 18 },
    { header: 'Account Number', key: 'accountNumber', width: 18 },
    { header: 'IFSC Code', key: 'ifscCode', width: 15 },
    { header: 'Bank Branch', key: 'bankBranch', width: 15 },
    { header: 'Account Holder Name', key: 'accountHolderName', width: 20 },
    { header: 'Company Address', key: 'companyAddress', width: 30 },
    { header: 'Delivery Address', key: 'deliveryAddress', width: 30 },
    { header: 'Demand', key: 'companyDemand', width: 15 },
    { header: 'State', key: 'state', width: 12 },
  ];

  // Add header row color
  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1976D2' }, // Blue
    };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Add data rows
  data.forEach((item, idx) => {
    worksheet.addRow({
      sno: idx + 1,
      companyName: item.companyName || '',
      companyEmail: item.companyEmail || '',
      location: item.location || '',
      landlineNumber: item.landlineNumber || '',
      segment: item.segment || '',
      status: item.status || '',
      companyCategory: item.companyCategory || '',
      gstNumber: item.gstNumber || '',
      panNumber: item.panNumber || '',
      companyNumber: item.companyNumber || '',
      companyAlternateNumber: item.companyAlternateNumber || '',
      contactPersonName: item.contactPersonName || '',
      contactPersonEmail: item.contactPersonEmail || '',
      contactPhoneNumber: item.contactPhoneNumber || '',
      bankName: item.bankName || '',
      accountNumber: item.accountNumber || '',
      ifscCode: item.ifscCode || '',
      bankBranch: item.bankBranch || '',
      accountHolderName: item.accountHolderName || '',
      companyAddress: Array.isArray(item.companyAddress) ? item.companyAddress.join(', ') : item.companyAddress || '',
      deliveryAddress: Array.isArray(item.deliveryAddress) ? item.deliveryAddress.join(', ') : item.deliveryAddress || '',
      companyDemand: item.companyDemand || '',
      state: item.state || '',
    });
  });

  // Download file
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MNS_All_Customers_List.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  });
  toast.success('Excel file downloaded!');
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3">
          Customer Management
        </h1>

        {/* Filters and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by company name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="py-4 px-4 border border-gray-200 rounded-lg shadow-sm bg-white flex gap-5 items-center">
              <label className="block font-medium text-gray-700">
                Segment:
              </label>
              <div className="flex flex-wrap gap-3">
                {uniqueSegments.map((segment) => (
                  <div key={segment} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={segment}
                      checked={selectedSegments.includes(segment)}
                      onChange={() => handleFilterChange("segment", segment)}
                      className="accent-blue-500 cursor-pointer h-4 w-4"
                    />
                    <label
                      htmlFor={segment}
                      className="capitalize cursor-pointer text-gray-600 hover:text-blue-600"
                    >
                      {segment}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-4 px-4 border border-gray-200 rounded-lg shadow-sm bg-white flex gap-5 items-center">
              <label className="block font-medium text-gray-700">Status:</label>
              <div className="flex flex-wrap gap-3">
                {uniqueStatuses.map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={status}
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleFilterChange("status", status)}
                      className="accent-blue-500 cursor-pointer h-4 w-4"
                    />
                    <label
                      htmlFor={status}
                      className="capitalize cursor-pointer text-gray-600 hover:text-blue-600"
                    >
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => downloadAllCustomersAsExcel()}
              className="bg-gradient-to-r from-sky-500 to-yellow-600 cursor-pointer text-white px-4 py-2 rounded-lg shadow hover:from-sky-600 hover:to-yellow-700 transition-all duration-300 flex items-center gap-2"
            >
              <DownloadIcon className="h-5 w-5" />
              Download Excel
            </button>

            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 cursor-pointer text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Customer
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
            >
              <FaUpload className="mr-2" />
              Bulk Upload
            </button>

            <button
              onClick={resetFilters}
              className="bg-gradient-to-r from-gray-500 cursor-pointer to-gray-600 text-white px-4 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">
                  S.No
                </th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">
                  Company Name
                </th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">
                  Email
                </th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">
                  Location
                </th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">
                  Landline
                </th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">
                  Segment
                </th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">
                  Status
                </th>
                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRows.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-3 text-left text-gray-700">
                    {indexOfFirstRow + index + 1}
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {item.companyName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.companyEmail}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.location}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.landlineNumber}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${item.segment === "Leads"
                        ? "bg-yellow-100 text-yellow-800"
                        : item.segment === "Prospects"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                        }`}
                    >
                      {item.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === "Engaged"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors p-1 hover:bg-blue-100 rounded"
                        onClick={() => handleViewCustomer(item)}
                        title="View Details"
                      >
                        <FaEye size={18} />
                      </button>
                      <button
                        className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors p-1 hover:bg-blue-100 rounded"
                        onClick={() => handleAddOrder(item)}
                        title="Add Order"
                      >
                        <FaPlus size={18} />
                      </button>
                      <button
                        className="text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors p-1 hover:bg-indigo-100 rounded"
                        onClick={() => {
                          setCustomerToEdit(item);
                          setIsEditCustomerOpen(true);
                        }}
                        title="Edit Customer"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-colors p-1 hover:bg-red-100 rounded"
                        onClick={() => {
                          setCustomerToDelete(item);
                          setIsDeleteConfirmationOpen(true);
                        }}
                        title="Delete Customer"
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Results Message */}
        {currentRows.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
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
            <p className="text-gray-500 mt-2">
              No customers found matching your criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex flex-wrap justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange("prev")}
            className="bg-gradient-to-r  from-blue-500 to-indigo-600 text-white px-4 py-2 cursor-pointer rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaCircleChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Rows per page:</span>
              <select
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>

            <span className="text-gray-600 font-medium">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange("next")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 cursor-pointer text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <FaCircleChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal Popup for Adding a Customer */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh] border-t-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">
              Add New Customer
            </h2>
            <AddCustomer
              setIsAddCustomerOpen={setIsAddCustomerOpen}
              handelSave={handelSave}
            />
          </div>
        </div>
      )}

      {isAddRecordOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh] border-t-4 border-blue-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-800 border-b pb-3">
                Add New Record
              </h2>
              <FaWindowClose
                onClick={() => setIsAddRecordOpen(false)}
                className="text-2xl cursor-pointer text-red-600 hover:text-gray-800"
              />
            </div>
            <NewProjectFormComponent orderDetails={orderDetails} />
          </div>
        </div>
      )}

      {/* Modal Popup for Editing a Customer */}
      {isEditCustomerOpen && customerToEdit && (
        <EditCustomerModal
          customer={customerToEdit}
          setIsEditCustomerOpen={setIsEditCustomerOpen}
          handelUpdate={handelUpdate}
        />
      )}

      {/* Modal Popup for Viewing a Customer */}
      {isViewCustomerOpen && customerToView && (
        <ViewCustomerModal
          customer={customerToView}
          setIsViewCustomerOpen={setIsViewCustomerOpen}
        />
      )}

      {/* Modal Popup for Delete Confirmation */}
      {isDeleteConfirmationOpen && customerToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border-t-4 border-red-600">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
              Confirm Delete
            </h2>
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-lg">
                Are you sure you want to delete{" "}
                <strong>{customerToDelete.companyName}</strong>?
              </p>
            </div>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteConfirmationOpen(false)}
                className="bg-gray-500 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(customerToDelete.id)}
                className="bg-red-500 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <MdDeleteForever size={20} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* for bulk upload  */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md overflow-y-auto max-h-[90vh] border-t-4 border-green-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Bulk Upload Customers
              </h2>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadFile(null);
                  setUploadError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4">
                Upload an Excel file with customer data. Please ensure your file
                follows the required format.
              </p>

              <div className="mt-2">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FaFileExcel className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".xlsx, .xls"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      XLSX or XLS up to 10MB
                    </p>
                  </div>
                </div>
                {uploadFile && (
                  <div className="mt-3 flex items-center text-sm text-green-600">
                    <FaCheckCircle className="mr-2" />
                    <span>File selected: {uploadFile.name}</span>
                  </div>
                )}
                {uploadError && (
                  <div className="mt-3 flex items-center text-sm text-red-600">
                    <FaExclamationCircle className="mr-2" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <a
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  onClick={downloadTemplateFile} // Add this onClick handler
                  href="#" // Add href attribute
                  style={{ cursor: "pointer" }} // Add cursor style
                >
                  <FaFileExcel className="mr-1" />
                  Download Template
                </a>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadFile(null);
                  setUploadError(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkUpload}
                disabled={!uploadFile || isUploading}
                className={`${!uploadFile || isUploading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer"
                  } text-white px-4 py-2 rounded-md transition-colors flex items-center`}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
