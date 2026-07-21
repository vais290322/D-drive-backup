import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";
import { BiLoaderCircle } from "react-icons/bi";
import {
  backendDomainN,
  backendDomainR1,
} from "../../common/index";
import { IoMdClose } from "react-icons/io";
import { IoIosCloudDone } from "react-icons/io";

const TaskManagement = () => {
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [isTaskComplete, setIsTaskComplete] = useState(false);

  const [formData, setFormData] = useState({
    employeeCode: "",
    employeeName: "",
    email: "",
    taskDescription: "",
    taskStartDate: "",
    taskEndDate: "",
    taskPrioritization: "",
  });


  const fetchClients = async () => {
    try {
      const response = await axios.get(`${backendDomainR1}/api/v1/mns/task`);
      //   console.log("response : ", response);
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
      item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignDate?.includes(searchTerm)
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const handleEdit = (e, client) => {
    // console.log("client : ", client);
    e.stopPropagation();
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    // console.log("selectedClient : ", selectedClient);
    try {
      const formatedData = [selectedClient];
      // console.log("selectedClient : ", selectedClient);
      setEditLodading(true);
      const response = await axios.put(
        `${backendDomainR1}/api/v1/mns/task/update/${selectedClient.id}`,
        formatedData
      );
      // console.log("response : ", response);
      if (response) {
        fetchClients();
        setIsEditModalOpen(false);
        toast.success("Task updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update Task");
      // console.log("error : ", error);
    } finally {
      setEditLodading(false);
    }
  };

  const handleDelete = (e, client) => {
    e.stopPropagation();
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmTask = (e, client) => {
    e.stopPropagation();
    setSelectedClient(client);
    setIsTaskComplete(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLodading(true);
      const resonse = await axios.delete(
        `${backendDomainR1}/api/v1/mns/task/delete/${selectedClient.id}`
      );
      if (resonse) {
        fetchClients();
        setIsDeleteModalOpen(false);
        toast.success("Task deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setDeleteLodading(false);
    }
  };

  // Add a new state for task completion loading
  const [taskCompletionLoading, setTaskCompletionLoading] = useState(false);

  // Update the confirmTask function to use the loading state
  const confirmTask = async () => {
    try {
      setTaskCompletionLoading(true); // Set loading to true when starting
      const resonse = await axios.put(
        `${backendDomainR1}/api/v1/mns/task/updateTask/${selectedClient.id}`
      );
      if (resonse) {
        fetchClients();
        setIsTaskComplete(false);
        toast.success("Task status updated successfully");
      }
    } catch (error) {
      toast.error("Failed to save status");
    } finally {
      setTaskCompletionLoading(false); // Set loading to false when done
    }
  };

  // Then update the Confirm Completion modal with the loading button
  {isTaskComplete && (
    <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sx flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Completion</h2>
        <p className="mb-4  ">
          Are you sure you this task is completed
          <span className="font-bold underline ">
            {" "}
            {selectedClient.taskName}?{" "}
          </span>{" "}
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setIsTaskComplete(false)}
            className="px-4 py-2  bg-gray-300 rounded cursor-pointer"
            disabled={taskCompletionLoading}
          >
            Cancel
          </button>

          {taskCompletionLoading ? (
            <button className="border border-green-800 bg-gradient-to-b from-green-500 to-green-800 
              text-white font-bold py-2 px-4 rounded cursor-pointer flex items-center justify-center">
              <LuLoader className="animate-spin w-6 h-6 mr-2" />
              Updating...
            </button>
          ) : (
            <button
              onClick={confirmTask}
              className="border  border-green-800 bg-gradient-to-b from-green-500 to-green-800 
              hover:from-green-800 hover:to-green-800 text-white font-bold py-2 
              px-4 rounded cursor-pointer"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  )}

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const fetchEmployeeDetails = async (email) => {
    if (!email.trim()) {
      setFilteredEmails([]);
      return;
    }

    try {
      const response = await axios.get(
        `${backendDomainN}/api/employees/search?email=${encodeURIComponent(
          email
        )}`
      );
      if (response.data.length > 0) {
        const uniqueEmails = [
          ...new Set(response.data.map((emp) => emp.email)),
        ];
        setFilteredEmails(uniqueEmails);
      } else {
        setFilteredEmails([]);
      }
    } catch (error) {
      // console.error("API Error:", error);
      toast.error("Failed to fetch employee details.");
      setFilteredEmails([]);
    }
  };

  const handleEmailSelect = async (selectedEmail) => {
    try {
      const response = await axios.get(
        `${backendDomainN}/api/employees/search?email=${encodeURIComponent(
          selectedEmail
        )}`
      );
      if (response.data.length > 0) {
        const { employeeCode, employeeName } = response.data[0];
        setFormData({
          ...formData,
          email: selectedEmail,
          employeeCode,
          employeeName,
        });
        setEmail(selectedEmail); // Update the email input
        setFilteredEmails([]); // Clear the dropdown
      }
    } catch (error) {
      // console.error("API Error:", error);
      toast.error("Failed to fetch employee details.");
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (email) {
        fetchEmployeeDetails(email);
      } else {
        setFilteredEmails([]);
        setFormData({
          ...formData,
          email: "",
          employeeCode: "",
          employeeName: "",
        });
      }
    }, 300); // Add debounce of 300ms

    return () => clearTimeout(debounceTimer);
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log("formData : ", formData);
    const formatedData = [formData];

    // console.log("formated data : ", formatedData);

    try {
      const response = await axios.post(
        `${backendDomainR1}/api/v1/mns/task/assign`,
        formatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("response : ", response);
      if (response) {
        fetchClients();
        setIsModalOpen(false);
        setFormData({
          email: "",
          employeeCode: "",
          employeeName: "",
          taskDescription: "",
          taskStartDate: "",
          taskEndDate: "",
          taskPrioritization: "",
        });
        toast.success("Task assigned successfully");
      }
    } catch (error) {
      // console.log("err : ", error);
    }
    setTimeout(() => setIsLoading(false), 2000);
  };

  const closeTaskModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 bg-white p-4">
        <h1 className="text-2xl font-semibold">Task Management</h1>
        <input
          type="text"
          placeholder="name,email,assigned date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto px-4"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
        >
          Assign New Task
        </button>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-200">
              <th className="border px-4 py-2">S.No</th>
              <th className="border px-4 py-2">Employee Code</th>
              <th className="border px-4 py-2">Employee Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Task Name</th>
              <th className="border px-4 py-2">Assign Date</th>
              <th className="border px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-blue-50 cursor-pointer"
                onClick={() => setSelectedOrder(item)}
              >
                <td className="border px-4 py-2">
                  {indexOfFirstRow + index + 1}
                </td>
                <td className="border px-4 py-2">{item.employeeCode}</td>
                <td className="border px-4 py-2">{item.employeeName}</td>
                <td className="border px-4 py-2">{item.email}</td>
                <td className="border px-4 py-2">{item.taskName}</td>
                <td className="border px-4 py-2">{item.assignDate}</td>
                <td className="border px-4 py-2 text-right">
                  <button
                    className="mr-2 cursor-pointer"
                    onClick={(e) => handleEdit(e, item)}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className="text-red-500 cursor-pointer mr-2"
                    onClick={(e) => handleDelete(e, item)}
                  >
                    <MdDeleteForever size={16} />
                  </button>
                  <button
                    className="text-green-500 cursor-pointer"
                    onClick={(e) => handleConfirmTask(e, item)}
                  >
                    <IoIosCloudDone size={16} />
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
        <div className="absolute top-0 left-0 h-full bg-black/50 backdrop-blur-sm flex items-center justify-center w-full">
          <div className="bg-white p-6 rounded-lg w-[50%]">
            <button
              onClick={closeTaskModal}
              className="text-gray-500 hover:text-gray-700 cursor-pointer "
            >
              <IoMdClose />
            </button>
            <div className="w-full p-6">
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Send Task
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Employee Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {filteredEmails.length > 0 && (
                  <ul className="border rounded-lg bg-white shadow-md max-h-40 overflow-auto">
                    {filteredEmails.map((email) => (
                      <li
                        key={email}
                        onClick={() => handleEmailSelect(email)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {email}
                      </li>
                    ))}
                  </ul>
                )}
                <input
                  type="text"
                  name="employeeCode"
                  placeholder="Employee Code"
                  value={formData.employeeCode}
                  readOnly
                  className="w-full p-3 border rounded-lg shadow-sm bg-gray-100"
                />
                <input
                  type="text"
                  name="employeeName"
                  placeholder="Employee Name"
                  value={formData.employeeName}
                  readOnly
                  className="w-full p-3 border rounded-lg shadow-sm bg-gray-100"
                />
                <input
                  type="text"
                  name="taskName"
                  placeholder="Task Name"
                  value={formData.taskName}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm"
                  required
                />
                <textarea
                  name="taskDescription"
                  placeholder="Task Description"
                  value={formData.taskDescription}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <label className="text-gray-700">Task Start Date</label>
                <input
                  type="date"
                  name="taskStartDate"
                  value={formData.taskStartDate}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <label className="text-gray-700">Task End Date</label>
                <input
                  type="date"
                  name="taskEndDate"
                  value={formData.taskEndDate}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <label className="text-gray-700">Task Prioritization</label>
                <select
                  name="taskPrioritization"
                  value={formData.taskPrioritization}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button
                  type="submit"
                  className="w-full p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-center"
                >
                  {isLoading ? (
                    <BiLoaderCircle className="animate-spin mr-2" size={20} />
                  ) : null}
                  {isLoading ? "Submitting..." : "Submit Task"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="absolute top-0 left-0 h-full bg-black/50 backdrop-blur-sm flex items-center justify-center w-full">
          <div className="bg-white p-6 rounded-lg w-[60%]">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <IoMdClose />
            </button>
            <div className="w-full p-6">
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Edit Task
              </h2>
              <form className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Employee Email"
                  value={selectedClient?.email || ""}
                  onChange={(e) =>
                    setSelectedClient({
                      ...selectedClient,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  name="employeeCode"
                  placeholder="Employee Code"
                  value={selectedClient?.employeeCode || ""}
                  readOnly
                  className="w-full p-3 border rounded-lg shadow-sm bg-gray-100"
                />

                <input
                  type="text"
                  name="employeeName"
                  placeholder="Employee Name"
                  value={selectedClient?.employeeName || ""}
                  readOnly
                  className="w-full p-3 border rounded-lg shadow-sm bg-gray-100"
                />

                <input
                  type="text"
                  name="taskName"
                  placeholder="Task Name"
                  value={selectedClient?.taskName || ""}
                  onChange={(e) =>
                    setSelectedClient({
                      ...selectedClient,
                      taskName: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg shadow-sm"
                />

                <textarea
                  name="taskDescription"
                  placeholder="Task Description"
                  value={selectedClient?.taskDescription || ""}
                  onChange={(e) =>
                    setSelectedClient({
                      ...selectedClient,
                      taskDescription: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="text-gray-700">
                  Task Start Date : {selectedClient?.taskStartDate || ""}
                </label>
                <input
                  type="date"
                  name="taskStartDate"
                  value={selectedClient?.taskStartDate || ""}
                  onChange={(e) =>
                    setSelectedClient({
                      ...selectedClient,
                      taskStartDate: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="text-gray-700">
                  Task End Date : {selectedClient?.taskEndDate || ""}
                </label>
                <input
                  type="date"
                  name="taskEndDate"
                  value={selectedClient?.taskEndDate || ""}
                  onChange={(e) =>
                    setSelectedClient({
                      ...selectedClient,
                      taskEndDate: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="text-gray-700">
                  Task Prioritization :{" "}
                  {selectedClient?.taskPrioritization || ""}
                </label>
                <select
                  name="taskPrioritization"
                  value={selectedClient?.taskPrioritization || ""}
                  onChange={(e) =>
                    setSelectedClient({
                      ...selectedClient,
                      taskPrioritization: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  {editLodading ? (
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                    >
                      <LuLoader className="animate-spin w-6 h-6 mr-2" />
                      Updating...
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEditSubmit}
                      className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                    >
                      Update Task
                    </button>
                  )}
                </div>
              </form>
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
                {selectedClient.employeeName}?{" "}
              </span>{" "}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>

              {deleteLodading ? (
                <button className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer">
                  <LuLoader className="animate-spin w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={confirmDelete}
                  className="border border-red-800 bg-gradient-to-b from-red-500 to-red-800 
                hover:from-red-800 hover:to-red-800 text-white font-bold py-2 
                px-4 rounded cursor-pointer"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isTaskComplete && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sx flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Completion</h2>
            <p className="mb-4  ">
              Are you sure you this task is completed
              <span className="font-bold underline ">
                {" "}
                {selectedClient.taskName}?{" "}
              </span>{" "}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsTaskComplete(false)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>

              {deleteLodading ? (
                <button className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer">
                  <LuLoader className="animate-spin w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={confirmTask}
                  className="border border-green-800 bg-gradient-to-b from-green-500 to-green-800 
                hover:from-green-800 hover:to-green-800 text-white font-bold py-2 
                px-4 rounded cursor-pointer"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl relative">
            <button
              className="absolute top-2 right-2 cursor-pointer text-red-500 hover:text-red-700"
              onClick={closeModal}
            >
              <IoMdClose size={24} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Full Details</h2>
            <p>
              <strong>Employee Name:</strong> {selectedOrder.employeeName}
            </p>
            <p>
              <strong>Employee Code:</strong> {selectedOrder.employeeCode}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.email}
            </p>
            <p>
              <strong>Assign Date:</strong> {selectedOrder.assignDate}
            </p>
            <p>
              <strong>Completed Date:</strong> {selectedOrder.completedDate}
            </p>
            <p>
              <strong>Task Name:</strong> {selectedOrder.taskName}
            </p>
            <p>
              <strong>Task Description:</strong> {selectedOrder.taskDescription}
            </p>
            <p>
              <strong>Task Ending Date:</strong> {selectedOrder.taskEndDate}
            </p>
            <p>
              <strong>Task Prioritization:</strong>{" "}
              {selectedOrder.taskPrioritization}
            </p>
            <p>
              <strong>Task Start Date:</strong> {selectedOrder.taskStartDate}
            </p>
            <p>
              <strong>Task Status:</strong> {selectedOrder.taskStatus}
            </p>
            <p>
              <strong>Update Date:</strong> {selectedOrder?.updateDate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
