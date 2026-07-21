import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { FiRefreshCw, FiSearch, FiClock, FiUser, FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";
import { backendDomainN1 } from "../../../common/index";

const TodaysAttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    searchTerm: "",
    date: "",
    month: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendDomainN1}/api/attendance/today`);
      setAttendanceData(response?.data);
      toast.success("Today's attendance data fetched successfully!");
    } catch (error) {
      console.error("Failed to fetch attendance data", error);
      toast.error("Failed to fetch attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAttendanceData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = attendanceData.filter((record) => {
    const matchesSearch = record.employeeName
      ?.toLowerCase()
      .includes(filters.searchTerm.toLowerCase());

    return matchesSearch;
  });

  const pageCount = Math.ceil(filteredData.length / recordsPerPage);
  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Today's Attendance Report</h1>
                <p className="text-blue-100">
                  Real-time view of today's employee attendance records
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
                  <FiCalendar className="mr-2" />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <button
                  onClick={fetchAttendanceData}
                  disabled={loading}
                  className="inline-flex cursor-pointer items-center px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
                >
                  {loading ? (
                    <BiLoaderCircle className="animate-spin mr-2" />
                  ) : (
                    <FiRefreshCw className="mr-2" />
                  )}
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Employee</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by employee name..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-md p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Present Employees</p>
                    <h3 className="text-2xl font-bold text-green-900 mt-1">
                      {filteredData.filter(record => record.status === "Present").length}
                    </h3>
                  </div>
                  <div className="bg-green-200 rounded-full p-3">
                    <FiCheckCircle className="h-6 w-6 text-green-700" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl shadow-md p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800">Absent Employees</p>
                    <h3 className="text-2xl font-bold text-red-900 mt-1">
                      {filteredData.filter(record => record.status !== "Present").length}
                    </h3>
                  </div>
                  <div className="bg-red-200 rounded-full p-3">
                    <FiXCircle className="h-6 w-6 text-red-700" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-md p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total Employees</p>
                    <h3 className="text-2xl font-bold text-blue-900 mt-1">
                      {filteredData.length}
                    </h3>
                  </div>
                  <div className="bg-blue-200 rounded-full p-3">
                    <FiUser className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <BiLoaderCircle className="animate-spin text-indigo-600 w-12 h-12" />
                    <span className="ml-3 text-lg text-gray-600">Loading attendance data...</span>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                        {[
                          "Employee",
                          "Check In Date",
                          "Check In Time",
                          "Status",
                          "Message",
                          "Check Out Date",
                          "Check Out Time",
                          "Productivity",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left font-semibold border-b text-center"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentRecords.length > 0 ? (
                        currentRecords.map((record, index) => (
                          <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
                            <td className="px-4 py-3 flex items-center justify-center">
                              <FiUser className="mr-2 text-gray-400" />
                              <span className="font-medium text-gray-700">{record.employeeName}</span>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600">
                              {record.firstScanTime
                                ? new Date(record.firstScanTime).toLocaleDateString(
                                    "en-CA",
                                    { timeZone: "Asia/Kolkata" }
                                  )
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600">
                              {record.firstScanTime
                                ? new Date(record.firstScanTime).toLocaleTimeString(
                                    "en-IN",
                                    { timeZone: "Asia/Kolkata" }
                                  )
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  record.status === "Present"
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                }`}
                              >
                                {record.status === "Present" ? (
                                  <FiCheckCircle className="mr-1" />
                                ) : (
                                  <FiXCircle className="mr-1" />
                                )}
                                {record.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600">
                              {record.statusMassage}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600">
                              {record.secondScanTime
                                ? new Date(record.secondScanTime).toLocaleDateString(
                                    "en-CA",
                                    { timeZone: "Asia/Kolkata" }
                                  )
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-600">
                              {record.secondScanTime
                                ? new Date(record.secondScanTime).toLocaleTimeString(
                                    "en-IN",
                                    { timeZone: "Asia/Kolkata" }
                                  )
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center">
                                <FiClock className="mr-2 text-indigo-500" />
                                <div>
                                  <span className="font-medium text-gray-700">
                                    {Math.floor(record.productivityCount / 60)}h {record.productivityCount % 60}m
                                  </span>
                                  <span className="text-xs text-gray-500 ml-1">/ 8h</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-12">
                            <div className="flex flex-col items-center justify-center">
                              <div className="rounded-full bg-gray-100 p-3 mb-4">
                                <FiClock className="h-8 w-8 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-1">No attendance records found</h3>
                              <p className="text-gray-500 max-w-md">
                                {filters.searchTerm
                                  ? "Try adjusting your search criteria to see more results"
                                  : "There are no attendance records available for today yet"}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            
            {/* Pagination Controls */}
            {filteredData.length > 0 && (
              <div className="flex justify-between items-center mt-8">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <span className="text-sm text-gray-600">
                    Page <span className="font-semibold">{currentPage}</span> of{" "}
                    <span className="font-semibold">{pageCount || 1}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 cursor-pointer py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                    disabled={currentPage === pageCount || pageCount === 0}
                    className="px-4 cursor-pointer py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    Next
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <label className="text-sm text-gray-600 mr-2">Records per page:</label>
                  <select
                    value={recordsPerPage}
                    onChange={(e) => {
                      setRecordsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing records per page
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer bg-white"
                  >
                    {[10, 25, 50].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Data refreshes automatically every 5 minutes. Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TodaysAttendancePage;