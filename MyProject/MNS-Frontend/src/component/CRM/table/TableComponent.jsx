import React, { useEffect, useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaEye } from "react-icons/fa"; // Added eye icon for view button
import AddCustomer from "../AddCustomer";
import urls from "../../../common/url";
import toast from "react-hot-toast";

const { getAllCustomerUrl, createCustomerUrl ,deleteCustomerUrl,updateCustomerUrl} = urls;

const TableComponent = () => {
  

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  // Added state for view customer details
  const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);
  const [customerToView, setCustomerToView] = useState(null);

  // For filtering dropdowns, we use existing segments/statuses from Data
  const uniqueSegments = [...new Set(data?.map(item => item.segment))];
  const uniqueStatuses = [...new Set(data?.map(item => item.status))];

  const getAllCustomerData = async () => {
    try {
      const customerData = await fetch(getAllCustomerUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const res = await customerData.json();
      // console.log("customerData", res);
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
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    } else if (filterType === "status") {
      setSelectedStatuses((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
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
      item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.companyEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = selectedSegments.length === 0 || selectedSegments.includes(item.segment);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
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
      if(res){
        toast.success("Customer created successfully");
        getAllCustomerData();
      }
      
      // Optionally, add the new customer to the table state:
      const newId = data.length ? Math.max(...data.map((item) => item.id)) + 1 : 1;
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
      const updateData = await fetch(`${updateCustomerUrl}/${updatedCustomer.id}`,{
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCustomer),
      })
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
      })
      const res = await deleteCustomer.json();
      if(res){
        toast.success("Customer deleted successfully");
        setData((prev) => prev.filter((c) => c.id !== id));
        getAllCustomerData();
      }

     
    
    setIsDeleteConfirmationOpen(false);
    } catch (error) {
      toast.error("Server Error");
    }

   
  };

  // Inline component for editing a customer.
  const EditCustomerModal = ({ customer, setIsEditCustomerOpen, handelUpdate }) => {
    const [editCustomer, setEditCustomer] = useState(customer);
    const segments = ["Leads", "Prospects", "Clients"];
    const statuses = ["Engaged", "Inactive"];

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "companyAddress") {
        setEditCustomer((prev) => ({
          ...prev,
          companyAddress: value
            .split(",")
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
        }));
      } else {
        setEditCustomer((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handelUpdate(editCustomer);
      setIsEditCustomerOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl overflow-y-auto max-h-full">
          <h2 className="text-2xl font-bold mb-4">Edit Customer</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={editCustomer.companyName}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Company Address</label>
              <textarea
                name="companyAddress"
                value={editCustomer.companyAddress.join(", ")}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                placeholder="Separate addresses with commas"
                rows="3"
              />
            </div>
            <div>
              <label className="block mb-1">Landline Number</label>
              <input
                type="text"
                name="landlineNumber"
                value={editCustomer.landlineNumber}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Company Number</label>
              <input
                type="text"
                name="companyNumber"
                value={editCustomer.companyNumber}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Company Email</label>
              <input
                type="email"
                name="companyEmail"
                value={editCustomer.companyEmail}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Company Demand</label>
              <input
                type="text"
                name="companyDemand"
                value={editCustomer.companyDemand}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Company Category</label>
              <input
                type="text"
                name="companyCategory"
                value={editCustomer.companyCategory}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Company Alternate Number</label>
              <input
                type="text"
                name="companyAlternateNumber"
                value={editCustomer.companyAlternateNumber}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Contact Person Name</label>
              <input
                type="text"
                name="contactPersonName"
                value={editCustomer.contactPersonName}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Contact Person Email</label>
              <input
                type="email"
                name="contactPersonEmail"
                value={editCustomer.contactPersonEmail}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Contact Phone Number</label>
              <input
                type="text"
                name="contactPhoneNumber"
                value={editCustomer.contactPhoneNumber}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Alternate Number</label>
              <input
                type="text"
                name="AlternateNumber"
                value={editCustomer.alternateNumber}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Person Address</label>
              <textarea
                name="personAddress"
                value={editCustomer.personAddress}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                rows="3"
              />
            </div>
            <div>
              <label className="block mb-1">Segment</label>
              <select
                name="segment"
                value={editCustomer.segment}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              >
                {segments.map((segment) => (
                  <option key={segment} value={segment}>
                    {segment}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={editCustomer.status}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsEditCustomerOpen(false)}
                className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // New function to handle viewing customer details
  const handleViewCustomer = (customer) => {
    setCustomerToView(customer);
    setIsViewCustomerOpen(true);
  };


  const ViewCustomerModal = ({ customer, setIsViewCustomerOpen }) => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh] border-t-4 border-blue-600">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              <span className="text-blue-600">Customer Details:</span> {customer.companyName}
            </h2>
            <button 
              onClick={() => setIsViewCustomerOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-700 mb-3 border-b pb-2">Company Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-700">Company Name:</span> <span className="text-gray-800">{customer.companyName}</span></p>
                <p><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-800">{customer.companyEmail}</span></p>
                <p><span className="font-medium text-gray-700">Landline:</span> <span className="text-gray-800">{customer.landlineNumber || "N/A"}</span></p>
                <p><span className="font-medium text-gray-700">Company Number:</span> <span className="text-gray-800">{customer.companyNumber || "N/A"}</span></p>
                <p><span className="font-medium text-gray-700">Alternate Number:</span> <span className="text-gray-800">{customer.companyAlternateNumber || "N/A"}</span></p>
                <p><span className="font-medium text-gray-700">Category:</span> <span className="text-gray-800">{customer.companyCategory || "N/A"}</span></p>
                <p><span className="font-medium text-gray-700">Demand:</span> <span className="text-gray-800">{customer.companyDemand || "N/A"}</span></p>
                <p><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-800">{customer.companyAddress ? customer.companyAddress.join(", ") : "N/A"}</span></p>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-700 mb-3 border-b pb-2">Contact Person Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-800">{customer.contactPersonName || "N/A"}</span></p>
                <p><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-800">{customer.contactPersonEmail || "N/A"}</span></p>
                <p><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-800">{customer.contactPhoneNumber || "N/A"}</span></p>
                <p><span className="font-medium text-gray-700">Alternate Number:</span> <span className="text-gray-800">{customer.alternateNumber || "N/A"}</span></p>
                <p><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-800">{customer.personAddress || "N/A"}</span></p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-purple-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-purple-700 mb-3 border-b pb-2">Status Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium text-gray-700">Segment:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    customer.segment === "Leads" ? "bg-yellow-100 text-yellow-800" : 
                    customer.segment === "Prospects" ? "bg-blue-100 text-blue-800" : 
                    "bg-green-100 text-green-800"
                  }`}>
                    {customer.segment}
                  </span>
                </p>
              </div>
              <div>
                <p><span className="font-medium text-gray-700">Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    customer.status === "Engaged" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
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


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3">Customer Management</h1>
        
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="py-4 px-4 border border-gray-200 rounded-lg shadow-sm bg-white flex gap-5 items-center">
              <label className="block font-medium text-gray-700">Segment:</label>
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
                    <label htmlFor={segment} className="capitalize cursor-pointer text-gray-600 hover:text-blue-600">
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
                    <label htmlFor={status} className="capitalize cursor-pointer text-gray-600 hover:text-blue-600">
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 cursor-pointer text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Customer
            </button>
            
            <button
              onClick={resetFilters}
              className="bg-gradient-to-r from-gray-500 cursor-pointer to-gray-600 text-white px-4 py-2 rounded-lg shadow hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">S.No</th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">Company Name</th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">Email</th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">Landline</th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">Segment</th>
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">Status</th>
                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRows.map((item, index) => (
                <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-left text-gray-700">
                    {indexOfFirstRow + index + 1}
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{item.companyName}</td>
                  <td className="px-4 py-3 text-gray-600">{item.companyEmail}</td>
                  <td className="px-4 py-3 text-gray-600">{item.landlineNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.segment === "Leads" ? "bg-yellow-100 text-yellow-800" : 
                      item.segment === "Prospects" ? "bg-blue-100 text-blue-800" : 
                      "bg-green-100 text-green-800"
                    }`}>
                      {item.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "Engaged" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 mt-2">No customers found matching your criteria</p>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Add New Customer</h2>
            <AddCustomer setIsAddCustomerOpen={setIsAddCustomerOpen} handelSave={handelSave} />
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
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Confirm Delete</h2>
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg">
                Are you sure you want to delete <strong>{customerToDelete.companyName}</strong>?
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
    </div>
  );
};

export default TableComponent;