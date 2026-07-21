import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";
import { BiLoaderCircle } from "react-icons/bi";
import { backendDomainN, backendDomainR1 } from "../../Common/index";
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
  const [filteredEmails, setFilteredEmails] = useState(null);
  const [isTaskComplete, setIsTaskComplete] = useState(false);
  const [taskCompletionLoading, setTaskCompletionLoading] = useState(false);

  const [projects, setProjects] = useState([]);

  // console.log("projects : ", projects.siteName);

  const [formData, setFormData] = useState({
    employeeCode: "",
    employeeName: "",
    email: "",
    taskDescription: "",
    taskStartDate: "",
    taskEndDate: "",
    taskPrioritization: "",
    taskName: "",
    taskId: ""
  });

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${backendDomainR1}/api/v1/mns/task`);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch tasks.");
    }
  };

  useEffect(() => {
    // Fetch projects from backend
    fetch(`${backendDomainR1}/api/v1/payroll/fetch/wage-Details`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (Array.isArray(data.data)) {
          setProjects(data.data);
        } else {
          setProjects([]);
        }
      })
      .catch((err) => {
        toast.error("Failed to fetch projects!");
        console.error(err);
      });
  }, []);

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
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleEdit = (e, client) => {
    e.stopPropagation();
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      setEditLodading(true);
      const response = await axios.put(
        `${backendDomainR1}/api/v1/mns/task/update/${selectedClient.id}`,
        [selectedClient]
      );
      if (response) {
        fetchClients();
        setIsEditModalOpen(false);
        toast.success("Task updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update Task");
    } finally {
      setEditLodading(false);
    }
  };

  const handleDelete = (e, client) => {
    e.stopPropagation();
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLodading(true);
      const response = await axios.delete(
        `${backendDomainR1}/api/v1/mns/task/delete/${selectedClient.id}`
      );
      if (response) {
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

  const handleConfirmTask = (e, client) => {
    e.stopPropagation();
    setSelectedClient(client);
    setIsTaskComplete(true);
  };

  const confirmTask = async () => {
    try {
      setTaskCompletionLoading(true);
      const response = await axios.put(
        `${backendDomainR1}/api/v1/mns/task/updateTask/${selectedClient.id}`
      );
      if (response) {
        fetchClients();
        setIsTaskComplete(false);
        toast.success(response.data.message || "Task status updated successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save status");
      // console.error("Error updating task status:", error);
    } finally {
      setTaskCompletionLoading(false);
    }
  };

  const closeModal = () => setSelectedOrder(null);

  const fetchEmployeeDetails = async (email) => {
    if (!email.trim()) {
      setFilteredEmails([]);
      return;
    }
    try {
      const response = await axios.get(
        `${backendDomainN}/api/employees/employees/search?query=${encodeURIComponent(email)}`
      );
     
      if (response.data.length > 0) {
        // console.log("response : ", response.data);
        const uniqueEmails = [...new Set(response.data.map((emp) => `${emp.employeeCode}-${emp.employeeName}-${emp.email}`))];
        // const emailsOnly = uniqueEmails.map((item) => item.split("-").pop());
        setFilteredEmails(uniqueEmails);
      } else {
        setFilteredEmails([]);
      }
    } catch (error) {
      toast.error("Failed to fetch employee details.");
      setFilteredEmails([]);
    }
  };

  const handleEmailSelect = async (selectedEmail) => {
    try {
      const response = await axios.get(
        `${backendDomainN}/api/employees/search?email=${encodeURIComponent(selectedEmail)}`
      );
      if (response.data.length > 0) {
        const { employeeCode, employeeName } = response.data[0];
        setFormData({
          ...formData,
          email: selectedEmail,
          employeeCode,
          employeeName,
        });
        setEmail(selectedEmail);
        setFilteredEmails([]);
      }
    } catch (error) {
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
          taskName: "",
        });
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [email]);

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the field changed is taskName, update taskId too
    if (name === "taskName") {
      const selectedProject = projects.find((project) => project.siteName === value);
      setFormData({
        ...formData,
        taskName: value,
        taskId: selectedProject?.id || "", // safely assign project.id
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendDomainR1}/api/v1/mns/task/assign`,
        [formData],
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response) {
        fetchClients();
        setIsModalOpen(false);
        setFormData({
          email: "",
          employeeCode: "",
          employeeName: "",
          taskName: "",
          taskDescription: "",
          taskStartDate: "",
          taskEndDate: "",
          taskPrioritization: "",
        });
        setEmail("");
        toast.success("Task assigned successfully");
      }
    } catch (error) {
      toast.error("Failed to assign task.");
    }
    setTimeout(() => setIsLoading(false), 2000);
  };

  const closeTaskModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
        <input
          type="text"
          placeholder="Search by name, email, or assigned date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition flex items-center justify-center cursor-pointer"
          aria-label="Assign New Task"
        >
          Assign New Task
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-full table-fixed border-collapse border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              {[
                "S.No",
                "Employee Code",
                "Employee Name",
                "Email",
                "Task Name",
                "Assign Date",
                "Actions",
              ].map((th) => (
                <th
                  key={th}
                  className="px-4 py-3 border text-left font-semibold tracking-wide"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No tasks found.
                </td>
              </tr>
            ) : (
              currentRows.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50 cursor-pointer transition duration-200"
                  onClick={() => setSelectedOrder(item)}
                  tabIndex={0}
                  aria-label={`View details and actions for task ${item.taskName} assigned to ${item.employeeName}`}
                >
                  <td className="border px-3 py-2 whitespace-nowrap text-gray-700 font-semibold">
                    {indexOfFirstRow + index + 1}
                  </td>
                  <td className="border px-3 py-2 text-gray-700">{item.employeeCode}</td>
                  <td className="border px-3 py-2 font-medium text-gray-800">{item.employeeName}</td>
                  <td className="border px-3 py-2 text-blue-600 underline truncate max-w-[150px]">{item.email}</td>
                  <td className="border px-3 py-2 text-gray-700">{item.taskName}</td>
                  <td className="border px-3 py-2 text-gray-500">{item.assignDate}</td>
                  <td className="border px-3 py-2 text-right space-x-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                      onClick={(e) => handleEdit(e, item)}
                      aria-label={`Edit task ${item.taskName}`}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition cursor-pointer"
                      onClick={(e) => handleDelete(e, item)}
                      aria-label={`Delete task ${item.taskName}`}
                    >
                      <MdDeleteForever size={20} />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 transition cursor-pointer"
                      onClick={(e) => handleConfirmTask(e, item)}
                      aria-label={`Mark task ${item.taskName} as completed`}
                    >
                      <IoIosCloudDone size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange("prev")}
            className="disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold px-5 py-2 rounded-md hover:from-green-500 hover:to-pink-500 transition cursor-pointer"
          >
            Previous
          </button>

          <div className="flex items-center space-x-2">
            <label htmlFor="rows" className="text-gray-700 font-medium">
              Rows per page:
            </label>
            <select
              id="rows"
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              {[5, 10, 15, 25, 40, 50, 100, 200, 500].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <span className="text-gray-700 font-semibold">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange("next")}
            className="disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold px-5 py-2 rounded-md hover:from-green-500 hover:to-pink-500 transition cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* Assign Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-6">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <button
              onClick={closeTaskModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition cursor-pointer"
              aria-label="Close assign task modal"
            >
              <IoMdClose size={28} />
            </button>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Assign New Task
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Employee Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                  autoComplete="off"
                />
                {filteredEmails.length > 0 && (
                  <ul className="absolute z-30 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-44 overflow-auto mt-1">
                    {filteredEmails.map((email) => (
                      <li
                        key={email}
                        onClick={() => handleEmailSelect(email.split("-").pop())}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-800 font-medium text-sm"
                      >
                        {email}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="employeeCode"
                  placeholder="Employee Code"
                  value={formData.employeeCode}
                  readOnly
                  className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
                <input
                  type="text"
                  name="employeeName"
                  placeholder="Employee Name"
                  value={formData.employeeName}
                  readOnly
                  className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              {/* <input
                type="text"
                name="taskName"
                placeholder="Task Name"
                value={formData.taskName}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              /> */}

              <select
                name="taskName"
                value={formData.taskName}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                <option value="">Select Task Name</option>
                {projects.map((project, index) => (
                  <option key={index} value={project.siteName}>
                    {project.siteName}- {project.vendorName}
                  </option>
                ))}
              </select>

              <textarea
                name="taskDescription"
                placeholder="Task Description"
                value={formData.taskDescription}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[120px]"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Task Start Date
                  </label>
                  <input
                    type="date"
                    name="taskStartDate"
                    value={formData.taskStartDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Task End Date
                  </label>
                  <input
                    type="date"
                    name="taskEndDate"
                    value={formData.taskEndDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Task Prioritization
                </label>
                <select
                  name="taskPrioritization"
                  value={formData.taskPrioritization}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg font-semibold text-white ${isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  } transition`}
              >
                {isLoading && <BiLoaderCircle className="animate-spin" size={24} />}
                {isLoading ? "Submitting..." : "Submit Task"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-6">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition cursor-pointer"
              aria-label="Close edit task modal"
            >
              <IoMdClose size={28} />
            </button>

            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Edit Task</h2>

            <form className="space-y-6">
              <input
                type="email"
                placeholder="Employee Email"
                value={selectedClient?.email || ""}
                onChange={(e) =>
                  setSelectedClient({ ...selectedClient, email: e.target.value })
                }
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="employeeCode"
                  placeholder="Employee Code"
                  value={selectedClient?.employeeCode || ""}
                  readOnly
                  className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
                <input
                  type="text"
                  name="employeeName"
                  placeholder="Employee Name"
                  value={selectedClient?.employeeName || ""}
                  readOnly
                  className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              {/* <input
                type="text"
                name="taskName"
                placeholder="Task Name"
                value={selectedClient?.taskName || ""}
                onChange={(e) =>
                  setSelectedClient({ ...selectedClient, taskName: e.target.value })
                }
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              /> */}

              <select
                name="taskName"
                value={selectedClient?.taskName || ""}
                onChange={(e) =>
                  setSelectedClient({ ...selectedClient, taskName: e.target.value })
                }
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select Task Name</option>
                {projects.map((project, index) => (
                  <option key={index} value={project.siteName}>
                    {project.siteName}
                  </option>
                ))}
              </select>

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
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[120px]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Task Start Date
                  </label>
                  <input
                    type="date"
                    name="taskStartDate"
                    value={selectedClient?.taskStartDate || ""}
                    onChange={(e) =>
                      setSelectedClient({ ...selectedClient, taskStartDate: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Task End Date
                  </label>
                  <input
                    type="date"
                    name="taskEndDate"
                    value={selectedClient?.taskEndDate || ""}
                    onChange={(e) =>
                      setSelectedClient({ ...selectedClient, taskEndDate: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Task Prioritization
                </label>
                <select
                  name="taskPrioritization"
                  value={selectedClient?.taskPrioritization || ""}
                  onChange={(e) =>
                    setSelectedClient({ ...selectedClient, taskPrioritization: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold text-gray-700 transition cursor-pointer"
                >
                  Cancel
                </button>

                {editLodading ? (
                  <button
                    disabled
                    type="button"
                    className="px-6 py-3 rounded-lg bg-blue-600 cursor-not-allowed text-white font-bold flex items-center gap-2 justify-center"
                  >
                    <LuLoader className="animate-spin" size={24} /> Updating...
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditSubmit}
                    className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white transition flex items-center gap-2 justify-center cursor-pointer"
                  >
                    Update Task
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6 text-gray-700 text-lg">
              Are you sure you want to delete <span className="font-bold underline">{selectedClient?.employeeName}</span>’s task?
            </p>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold cursor-pointer"
              >
                Cancel
              </button>

              {deleteLodading ? (
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg flex items-center gap-2 justify-center cursor-not-allowed">
                  <LuLoader className="animate-spin" size={24} /> Deleting...
                </button>
              ) : (
                <button
                  onClick={confirmDelete}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition cursor-pointer"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Completion Confirm Modal */}
      {isTaskComplete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-4">Confirm Completion</h2>
            <p className="mb-6 text-gray-700 text-lg">
              Are you sure this task <span className="font-bold underline">{selectedClient?.taskName}</span> is completed?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setIsTaskComplete(false)}
                className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 font-semibold transition cursor-pointer"
              >
                Cancel
              </button>

              {taskCompletionLoading ? (
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2 justify-center cursor-not-allowed">
                  <LuLoader className="animate-spin" size={24} /> Updating...
                </button>
              ) : (
                <button
                  onClick={confirmTask}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition cursor-pointer"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 overflow-auto p-6 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto relative p-8">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition cursor-pointer"
              aria-label="Close task details modal"
            >
              <IoMdClose size={28} />
            </button>

            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 border-b pb-3 text-gray-800">
              Full Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base sm:text-lg">
              {[
                ["Employee Name", selectedOrder.employeeName],
                ["Employee Code", selectedOrder.employeeCode],
                ["Email", selectedOrder.email],
                ["Assign Date", selectedOrder.assignDate],
                ["Completed Date", selectedOrder.completedDate || "Not completed"],
                [
                  "Task Status",
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selectedOrder.taskStatus === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {selectedOrder.taskStatus || "Pending"}
                  </span>,
                ],
                ["Task Name", selectedOrder.taskName],
                ["Task Description", <pre className="whitespace-pre-wrap">{selectedOrder.taskDescription}</pre>],
                ["Task Start Date", selectedOrder.taskStartDate],
                ["Task Ending Date", selectedOrder.taskEndDate],
                [
                  "Task Prioritization",
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selectedOrder.taskPrioritization === "High"
                      ? "bg-red-100 text-red-800"
                      : selectedOrder.taskPrioritization === "Medium"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {selectedOrder.taskPrioritization}
                  </span>,
                ],
                ["Update Date", selectedOrder.updateDate || "Not updated"],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-4 rounded shadow-sm"
                  style={{ whiteSpace: label === "Task Description" ? "pre-wrap" : "normal" }}
                >
                  <p className="font-semibold text-gray-800 mb-1">{label}:</p>
                  <div className="text-gray-700">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
