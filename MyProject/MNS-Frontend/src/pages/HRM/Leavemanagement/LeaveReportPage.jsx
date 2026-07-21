import axios from "axios";
import React, { useState, useEffect } from "react";
import { backendDomainN } from "../../../common/index";
import { FiSearch, FiFilter, FiDownload, FiCalendar, FiClock, FiUser, FiFileText, FiCheck, FiX, FiAlertCircle, FiList } from "react-icons/fi";
import { BiLoaderCircle } from "react-icons/bi";

const LeaveReportPage = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  const fetchLeaveApplications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendDomainN}/api/leaves`);
      setLeaveApplications(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveApplications();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page on date change
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setDateRange({ startDate: "", endDate: "" });
    setCurrentPage(1);
  };

  // Apply all filters
  const filteredLeaveApplications = leaveApplications.filter((application) => {
    // Text search filter
    const employeeName = application?.employeeName || "";
    const leaveDescription = application?.leaveDescription || "";
    const status = application?.status || "";
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const matchesSearch = 
      employeeName.toLowerCase().includes(lowerSearchTerm) ||
      leaveDescription.toLowerCase().includes(lowerSearchTerm) ||
      status.toLowerCase().includes(lowerSearchTerm);
    
    // Status filter
    const matchesStatus = statusFilter === "All" || application.status === statusFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59); // Set to end of day
      
      const leaveStartDate = new Date(application.leaveStartDate);
      
      matchesDateRange = leaveStartDate >= startDate && leaveStartDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredLeaveApplications.length / rowsPerPage);
  const paginatedData = filteredLeaveApplications.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheck className="mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiX className="mr-1" />
            Rejected
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiAlertCircle className="mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            N/A
          </span>
        );
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

  // Function to export data as CSV
  const exportToCSV = () => {
    // Create CSV header
    let csvContent = "Employee Name,Leave Description,Leave Duration,Start Date,End Date,Total Leave,Status\n";
    
    // Add data rows
    filteredLeaveApplications.forEach(app => {
      const row = [
        app.employeeName || "N/A",
        `"${(app.leaveDescription || "N/A").replace(/"/g, '""')}"`, // Escape quotes in description
        app.totalLeaveDays || "N/A",
        app.leaveStartDate || "N/A",
        app.leaveEndDate || "N/A",
        app.leaveBalance || "N/A",
        app.status || "N/A"
      ].join(",");
      
      csvContent += row + "\n";
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leave_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-2">Leave Report Dashboard</h1>
          <p className="text-blue-100">Comprehensive view of all leave applications</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiFileText className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-semibold">Leave Applications Report</h2>
              </div>
              <button 
                onClick={exportToCSV}
                className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-white text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors duration-200"
              >
                <FiDownload className="mr-1.5" />
                Export CSV
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Filters Section */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name, description, or status"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiFilter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none bg-white"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rows per page</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiList className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none bg-white"
                    >
                      <option value={5}>5 rows</option>
                      <option value={10}>10 rows</option>
                      <option value={20}>20 rows</option>
                      <option value={30}>30 rows</option>
                      <option value={50}>50 rows</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateRangeChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateRangeChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>
                
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{paginatedData.length}</span> of{" "}
                <span className="font-medium">{filteredLeaveApplications.length}</span> applications
              </p>
              
              <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-lg">
                <FiClock className="text-indigo-500 mr-1" />
                <span className="text-xs text-indigo-600">Last updated: {new Date().toLocaleString()}</span>
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <BiLoaderCircle className="animate-spin text-indigo-600 w-12 h-12" />
                <span className="ml-3 text-lg text-gray-600">Loading applications...</span>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiUser className="mr-1" />
                          Employee
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiFileText className="mr-1" />
                          Description
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiClock className="mr-1" />
                          Duration
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" />
                          Start Date
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" />
                          End Date
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiClock className="mr-1" />
                          Balance
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="rounded-full bg-gray-100 p-3 mb-3">
                              <FiSearch className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No applications found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                {application.employeeName?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{application.employeeName || "N/A"}</div>
                                <div className="text-sm text-gray-500">{application.employeeCode || "No ID"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {application.leaveDescription || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{application.totalLeaveDays || "N/A"} days</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(application.leaveStartDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(application.leaveEndDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{application.leaveBalance || "N/A"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(application.status)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredLeaveApplications.length > 0 && (
              <div className="flex justify-between items-center mt-6">
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
    </div>
  );
};

export default LeaveReportPage;