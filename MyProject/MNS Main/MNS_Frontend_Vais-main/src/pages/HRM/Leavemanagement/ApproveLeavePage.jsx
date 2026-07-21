import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { FiCalendar, FiClock, FiUser, FiFileText, FiCheck, FiX, FiList, FiFilter } from "react-icons/fi";
import { backendDomainN } from "../../../common/index";

const ApproveLeavePage = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch leave applications
  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendDomainN}/api/leaves`);
        setLeaveApplications(response.data?.data || []);
      } catch (error) {
        toast.error("Failed to fetch leave applications.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveApplications();
  }, []);

  // Filter applications by status
  const filteredApplications = statusFilter === "All" 
    ? leaveApplications 
    : leaveApplications.filter(app => app.status === statusFilter);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplications.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(filteredApplications.length / recordsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleStatusChange = (id, status) => {
    setLeaveApplications((prev) =>
      prev.map((application) =>
        application.id === id ? { ...application, status } : application
      )
    );
  };

  const handleSave = (application) => {
    setSelectedApplication(application);
    setStatusForm({ status: application.status });
  };

  const handleDirectAction = (application, status) => {
    setSelectedApplication(application);
    setStatusForm({ status });
    handleStatusSubmit(null, status);
  };

  const handleStatusSubmit = async (e, directStatus = null) => {
    if (e) e.preventDefault();
    if (!selectedApplication) return;

    try {
      setLoading(true);
      
      const statusToUse = directStatus || statusForm.status;
      selectedApplication.status = statusToUse;
      
      const response = await axios.post(
        `${backendDomainN}/api/leaves/approve-reject/${selectedApplication.id}`,
        selectedApplication,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        toast.success(
          `Leave application for ${selectedApplication.employeeName} has been updated to ${statusToUse}.`
        );
        setLeaveApplications((prev) =>
          prev.map((app) =>
            app.id === selectedApplication.id
              ? { ...app, status: statusToUse, isSaved: true }
              : app
          )
        );
      }
    } catch (error) {
      toast.error("Something went wrong while saving the application.");
    } finally {
      setLoading(false);
      setSelectedApplication(null);
      setStatusForm({ status: "" });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-2">Leave Approval Dashboard</h1>
          <p className="text-blue-100">Review and manage employee leave requests</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center">
              <FiList className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold">Leave Applications</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center space-x-2">
                <FiFilter className="text-gray-500" />
                <span className="text-gray-700 font-medium">Filter by status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                >
                  <option value="All">All Applications</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">Show:</span>
                <select
                  value={recordsPerPage}
                  onChange={handleRecordsPerPageChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={30}>30 per page</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <BiLoaderCircle className="animate-spin text-indigo-600 w-12 h-12" />
                <span className="ml-3 text-lg text-gray-600">Loading applications...</span>
              </div>
            ) : currentRecords.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <FiFileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No leave applications found</h3>
                <p className="text-gray-500">
                  {statusFilter !== "All" 
                    ? `There are no ${statusFilter.toLowerCase()} applications at the moment.`
                    : "There are no leave applications to display."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {currentRecords.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className={`px-4 py-3 ${
                      application.status === "Pending" ? "bg-yellow-50 border-l-4 border-yellow-400" :
                      application.status === "Approved" ? "bg-green-50 border-l-4 border-green-400" :
                      "bg-red-50 border-l-4 border-red-400"
                    }`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                            {application.employeeName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                              {application.employeeName}
                            </h2>
                            <p className="text-sm text-gray-500">
                              Employee Code: {application.employeeCode || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            application.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                            application.status === "Approved" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {application.status === "Pending" && <FiClock className="mr-1" />}
                            {application.status === "Approved" && <FiCheck className="mr-1" />}
                            {application.status === "Rejected" && <FiX className="mr-1" />}
                            {application.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start">
                          <FiFileText className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Leave Description</p>
                            <p className="text-gray-800">{application.leaveDescription}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FiClock className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Duration</p>
                            <p className="text-gray-800">{application.totalLeaveDays} day{application.totalLeaveDays !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Start Date</p>
                            <p className="text-gray-800">{formatDate(application.leaveStartDate)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">End Date</p>
                            <p className="text-gray-800">{formatDate(application.leaveEndDate)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end mt-4 space-x-3">
                        {application.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleDirectAction(application, "Approved")}
                              className="inline-flex cursor-pointer items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <FiCheck className="mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleDirectAction(application, "Rejected")}
                              className="inline-flex cursor-pointer items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <FiX className="mr-2" />
                              Reject
                            </button>
                            <button
                              onClick={() => handleSave(application)}
                              className="inline-flex cursor-pointer items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FiFileText className="mr-2" />
                              Review
                            </button>
                          </>
                        ) : (
                          <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
                            application.status === "Approved" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {application.status === "Approved" ? (
                              <>
                                <FiCheck className="mr-2" />
                                Approved
                              </>
                            ) : (
                              <>
                                <FiX className="mr-2" />
                                Rejected
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && currentRecords.length > 0 && (
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1}
                  className="inline-flex items-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                  bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                >
                  Previous
                </button>

                <div className="flex items-center cursor-pointer bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-gray-700 font-medium">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                </div>

                <button
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="inline-flex cursor-pointer items-center px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                  bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md mx-4 animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
              <h3 className="text-xl font-semibold">
                Update Leave Status
              </h3>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                    {selectedApplication.employeeName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {selectedApplication.employeeName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedApplication.leaveStartDate)} - {formatDate(selectedApplication.leaveEndDate)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Leave Description</p>
                  <p className="text-gray-800">{selectedApplication.leaveDescription}</p>
                </div>
              </div>
              
              <form onSubmit={handleStatusSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <div className="relative">
                    <select
                      value={statusForm.status}
                      onChange={(e) =>
                        setStatusForm({ ...statusForm, status: e.target.value })
                      }
                      className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm appearance-none bg-white"
                      required
                    >
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Pending" disabled>
                        Pending
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedApplication(null)}
                    className="px-4 py-2 border cursor-pointer border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <BiLoaderCircle className="animate-spin mr-2" size={20} />
                        <span>Processing...</span>
                      </>
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveLeavePage;