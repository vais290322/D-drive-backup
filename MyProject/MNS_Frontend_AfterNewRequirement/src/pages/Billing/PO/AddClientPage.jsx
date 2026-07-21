import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";
import { backendDomainA } from "../../../common/index";

const AddClientPage = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [submitLodading, setSubmitLodading] = useState(false);
  const [editLodading, setEditLodading] = useState(false);
  const [deleteLodading, setDeleteLodading] = useState(false);
  const [newClient, setNewClient] = useState({
    companyName: "",
    companyAddress: "",
    ph_no: "",
    email: "",
    GST_IN: "",
    panNo: "",
  });

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `${backendDomainA}/api/v1/company/all`
      );
      console.log("response : ", response);
      setData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setSubmitLodading(true);
      // console.log("new ", newClient);
      const response = await axios.post(
        `${backendDomainA}/api/v1/company/create`,
        newClient
      );
      // console.log("response : ", response);
      if (response) {
        setData([...data, response.data.data]);
        setIsModalOpen(false);
        setNewClient({
          companyName: "",
          companyAddress: "",
          ph_no: "",
          email: "",
          GST_IN: "",
          panNo: "",
        });
        fetchClients();
        toast.success("Client added successfully");
      }
    } catch (error) {
      // console.log("error : ", error);
      toast.error(error?.response?.data?.message || "Failed to add client");
    }finally{
      setSubmitLodading(false);
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      setEditLodading(true);
     const response = await axios.put(
        `${backendDomainA}/api/v1/company/update/${selectedClient._id}`,
        selectedClient
      );
      if (response) {
        fetchClients();
        setIsEditModalOpen(false);
        toast.success("Client updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update client");
    } finally {
      setEditLodading(false);
    }
  };

  const handleDelete = (client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLodading(true);
      const resonse = await axios.delete(
        `${backendDomainA}/api/v1/company/delete/${selectedClient._id}`
      );
      if (resonse) {
        fetchClients();
        setIsDeleteModalOpen(false);
        toast.success("Client deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete client");
    } finally {
      setDeleteLodading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 bg-white p-4">
        <h1 className="text-2xl font-semibold">All Clients in MNS </h1>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600"
        >
          Add New Client
        </button>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-200">
              <th className="border px-4 py-2">S.No</th>
              <th className="border px-4 py-2">Company Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Number</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">GSTIN</th>
              <th className="border px-4 py-2">Pan Number</th>
              <th className="border px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => (
              <tr key={item.id} className="hover:bg-blue-50">
                <td className="border px-4 py-2">
                  {indexOfFirstRow + index + 1}
                </td>
                <td className="border px-4 py-2">{item.companyName}</td>
                <td className="border px-4 py-2">{item.email}</td>
                <td className="border px-4 py-2">{item.ph_no}</td>
                <td className="border px-4 py-2">{item.companyAddress}</td>
                <td className="border px-4 py-2">{item.GST_IN}</td>
                <td className="border px-4 py-2">{item.panNo}</td>
                <td className="border px-4 py-2 text-right">
                  <button
                    className="mr-2 cursor-pointer"
                    onClick={() => handleEdit(item)}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(item)}
                  >
                    <MdDeleteForever size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between items-center p-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange("prev")}
            className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 "
          >
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
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange("next")}
            className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 "
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sx flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[60%]">
            <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
            <input
              type="text"
              name="companyName"
              required
              placeholder="Company Name"
              className="border p-2 w-full mb-2"
              onChange={handleInputChange}
            />
            <input
              type="textarea"
              name="companyAddress"
              required
              placeholder="Company Address"
              className="border p-2 w-full mb-2"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="ph_no"
              placeholder="Phone Number"
              required
              className="border p-2 w-full mb-2"
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="border p-2 w-full mb-2"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="GST_IN"
              required
              placeholder="GSTIN"
              className="border p-2 w-full mb-2"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="panNo"
              required
              placeholder="PAN Number"
              className="border p-2 w-full mb-2"
              onChange={handleInputChange}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>
              
              {
                submitLodading ? (<button
                  className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                  <LuLoader className="animate-spin w-6 h-6" />
                </button>
                ) :(
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                  Save
                </button>)
              }

            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sx flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Client</h2>
            <input
              type="text"
              value={selectedClient.companyName}
              onChange={(e) =>
                setSelectedClient({
                  ...selectedClient,
                  companyName: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
              placeholder="Company Name"
            />
            <input
              type="text"
              value={selectedClient.email}
              onChange={(e) =>
                setSelectedClient({ ...selectedClient, email: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Email"
            />
            <input
              type="text"
              value={selectedClient.ph_no}
              onChange={(e) =>
                setSelectedClient({ ...selectedClient, ph_no: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Phone Number"
            />
            <input
              type="text"
              value={selectedClient.companyAddress}
              onChange={(e) =>
                setSelectedClient({
                  ...selectedClient,
                  companyAddress: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
              placeholder="Address"
            />
            <input
              type="text"
              value={selectedClient.GST_IN}
              onChange={(e) =>
                setSelectedClient({ ...selectedClient, GST_IN: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="GSTIN"
            />
            <input
              type="text"
              value={selectedClient.panNo}
              onChange={(e) =>
                setSelectedClient({ ...selectedClient, panNo: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="PAN Number"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>   

              {
                editLodading ? (<button
                  className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                  <LuLoader className="animate-spin w-6 h-6" />
                </button>
                ) :(
                  <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                  Update
                </button>)
              }

            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sx flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4  ">
              Are you sure you want to delete{" "}
              <span className="font-bold underline ">
                {" "}
                {selectedClient.companyName}?{" "}
              </span>{" "}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>
              

              {
                deleteLodading ? (<button
                  className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
                >
                  <LuLoader className="animate-spin w-6 h-6" />
                </button>
                ) :(
                  <button
                onClick={confirmDelete}
                className="border border-red-800 bg-gradient-to-b from-red-500 to-red-800 
                hover:from-red-800 hover:to-red-800 text-white font-bold py-2 
                px-4 rounded cursor-pointer"
              >
                Delete
              </button>)
              }

            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default AddClientPage;
