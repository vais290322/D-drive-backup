import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { FiRefreshCw, FiDownload, FiCalendar, FiSearch, FiClock, FiUser, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { backendDomainN1 } from "../../../common/index";

const RfidAttendanceReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    searchTerm: "",
    date: "",
    month: "",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const formatProductivityTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
 
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${backendDomainN1}/api/attendance/logs`
      );
      const data = await response.json();
      setAttendanceData(data);
      toast.success("Attendance data fetched successfully!");
    } catch (error) {
      toast.error("Failed to fetch attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    const interval = setInterval(fetchAttendanceData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = attendanceData.filter((record) => {
    const matchesSearch = record.employeeName
      ?.toLowerCase()
      .includes(filters.searchTerm.toLowerCase());

    let recordDate = record.firstScanTime
      ? new Date(record.firstScanTime)
      : null;
    const checkInDate = recordDate
      ? recordDate.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
      : "";
    const checkInMonth = checkInDate ? checkInDate.split("-")[1] : "";

    const matchesDate = !filters.date || checkInDate === filters.date;
    const matchesMonth =
      !filters.month || checkInMonth === filters.month.split("-")[1];

    return matchesSearch && matchesDate && matchesMonth;
  });

  const pageCount = Math.ceil(filteredData.length / recordsPerPage);
  const currentRecords = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const downloadCSV = async () => {
    if (!selectedDate) {
      toast.error("Please select a valid month and year");
      return;
    }

    setDownloadLoading(true);
    // Extract year and month from input value (YYYY-MM)
    const [year, month] = selectedDate.split("-");

    const url = `${backendDomainN1}/api/attendance/download-monthly-productivity/${month}/${year}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const csvText = await response.text();
      const rows = csvText.split("\n");

      if (rows.length < 2) {
        toast.error("No data available for this month and year");
        return;
      }

      let formattedCSV = `Productivity count of ${month}/${year}\n\n`;
      formattedCSV += "Employee Code, Name, Department, Productivity Count (HH:MM)\n";

      for (let i = 1; i < rows.length; i++) {
        let cols = rows[i].split(",");
        if (cols.length >= 4) {
          let formattedTime = formatProductivityTime(parseInt(cols[3].trim()));
          formattedCSV += `${cols[0]}, ${cols[1]}, ${cols[2]}, ${formattedTime}\n`;
        }
      }

      const blob = new Blob([formattedCSV], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `monthly_productivity_${month}_${year}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download CSV file");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">RFID Attendance Report</h1>
                <p className="text-indigo-100">
                  View and manage employee attendance records with RFID tracking
                </p>
              </div>
              <div className="mt-4 md:mt-0">
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
            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Employee</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={filters.searchTerm}
                    onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Month</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="month"
                    value={filters.month}
                    onChange={(e) => setFilters((prev) => ({ ...prev, month: e.target.value }))}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
            
            {/* Download Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-indigo-100 shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">Export Monthly Productivity Report</h3>
                  <p className="text-sm text-gray-600">Download employee productivity data for a specific month</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="month"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Select month & year"
                    />
                  </div>
                  
                  <button
                    onClick={downloadCSV}
                    disabled={downloadLoading || !selectedDate}
                    className="inline-flex cursor-pointer items-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md hover:from-indigo-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadLoading ? (
                      <BiLoaderCircle className="animate-spin mr-2" />
                    ) : (
                      <FiDownload className="mr-2" />
                    )}
                    Download CSV
                  </button>
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
                            className="px-4 py-3 text-left font-semibold border-b"
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
                            <td className="px-4 py-3 flex items-center">
                              <FiUser className="mr-2 text-gray-400" />
                              <span className="font-medium text-gray-700">{record.employeeName}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {record.firstScanTime
                                ? new Date(record.firstScanTime).toLocaleDateString(
                                    "en-CA",
                                    { timeZone: "Asia/Kolkata" }
                                  )
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {record.firstScanTime
                                ? new Date(record.firstScanTime).toLocaleTimeString(
                                    "en-IN",
                                    { timeZone: "Asia/Kolkata" }
                                  )
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3">
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
                            <td className="px-4 py-3 text-gray-600">
                              {record.statusMassage}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {record.secondScanTime
                                ? new Date(record.secondScanTime).toLocaleDateString(
                                    "en-CA",
                                    { timeZone: "Asia/Kolkata" }
                                  )
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {record.secondScanTime
                                ? new Date(record.secondScanTime).toLocaleTimeString(
                                    "en-IN",
                                    { timeZone: "Asia/Kolkata" }
                                  )
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
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
                                {filters.searchTerm || filters.date || filters.month
                                  ? "Try adjusting your search filters to see more results"
                                  : "There are no attendance records available yet"}
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
              <div className="flex justify-center mt-8">
                <nav className="flex items-center bg-white px-4 py-3 rounded-lg shadow-md">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      First
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  </div>
                  
                  <div className="mx-4 flex items-center">
                    {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                      // Show 5 pages at most, centered around current page
                      let pageNum;
                      if (pageCount <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pageCount - 2) {
                        pageNum = pageCount - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 mx-1 cursor-pointer rounded-full flex items-center justify-center ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pageCount}
                      className="px-2 py-1 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => handlePageChange(pageCount)}
                      disabled={currentPage === pageCount}
                      className="px-2 py-1 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Last
                    </button>
                  </div>
                  
                  <div className="ml-4 text-sm text-gray-600">
                    Page {currentPage} of {pageCount} ({filteredData.length} records)
                  </div>
                </nav>
              </div>
            )}
            
            {/* Records Per Page Selector */}
            <div className="flex justify-end mt-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Records per page:</label>
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing records per page
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer bg-white"
                >
                  {[10, 25, 50].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RfidAttendanceReport;