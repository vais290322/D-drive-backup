import React, { useEffect, useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
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

  const filteredData = data.filter((item) => {
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
    console.log("Customer", customer);
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
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Filters and Actions */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search by company name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <div className="flex gap-4">
          <div className="py-9 px-2 border rounded shadow-md flex gap-5">
            <label className="block font-medium text-xl">Segment</label>
            {uniqueSegments.map((segment) => (
              <div key={segment} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={segment}
                  checked={selectedSegments.includes(segment)}
                  onChange={() => handleFilterChange("segment", segment)}
                  className="accent-blue-500 cursor-pointer"
                />
                <label htmlFor={segment} className="capitalize cursor-pointer">
                  {segment}
                </label>
              </div>
            ))}
          </div>
          <div className="px-2 py-9 border rounded shadow-md flex gap-5">
            <label className="block font-medium text-xl">Status</label>
            {uniqueStatuses.map((status) => (
              <div key={status} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={status}
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleFilterChange("status", status)}
                  className="accent-blue-500 cursor-pointer"
                />
                <label htmlFor={status} className="capitalize cursor-pointer">
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Add Customer
        </button>
        <button
          onClick={resetFilters}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Company Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Landline</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Segment</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-left">
                  {indexOfFirstRow + index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">{item.companyName}</td>
                <td className="border border-gray-300 px-4 py-2">{item.companyEmail}</td>
                <td className="border border-gray-300 px-4 py-2">{item.landlineNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{item.segment}</td>
                <td className={`border border-gray-300 px-4 py-2 ${item.status === "Engaged" ? "text-green-500" : "text-red-500"}`}>
                  {item.status}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  <button
                    className="mr-2"
                    onClick={() => {
                      setCustomerToEdit(item);
                      setIsEditCustomerOpen(true);
                    }}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => {
                      setCustomerToDelete(item);
                      setIsDeleteConfirmationOpen(true);
                    }}
                  >
                    <MdDeleteForever size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button disabled={currentPage === 1} onClick={() => handlePageChange("prev")} className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 " >
          {/* <FaCircleChevronLeft size={16} /> */}
          Previous
        </button>
        <div>
          <select
            className="border p-2 rounded"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button disabled={currentPage === totalPages} onClick={() => handlePageChange("next")} className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 " >
          {/* <FaCircleChevronRight size={16} /> */}
          Next
        </button>
      </div>

      {/* Modal Popup for Adding a Customer */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl overflow-y-auto max-h-full">
            <h2 className="text-2xl font-bold mb-4">Add New Customer</h2>
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

      {/* Modal Popup for Delete Confirmation */}
      {isDeleteConfirmationOpen && customerToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete <strong>{customerToDelete.companyName}</strong>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteConfirmationOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(customerToDelete.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
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