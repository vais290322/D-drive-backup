import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { FiCalendar, FiUsers, FiSearch, FiFilter, FiDownload, FiPrinter, FiCheck, FiX, FiClock, FiSun, FiMoon } from "react-icons/fi";
import { backendDomainN } from "../../../common/index";

const AttendanceReportPage = () => {
  const [viewType, setViewType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch attendance data based on the view type
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const url =
        viewType === "daily"
          ? `${backendDomainN}/api/attendance/date/${selectedDate
              .split("-")
              .reverse()
              .join("-")}`
          : `${backendDomainN}/month-attendance/date/${
              selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth
            }-${selectedYear}`;

      const response = await axios.get(url);
      if (response.status === 200) {
        setAttendanceData(response?.data?.data[0]);
        toast.success("Data fetched successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [viewType, selectedDate, selectedMonth, selectedYear]);

  const handleSearch = () => {
    fetchAttendanceData();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setPage(1); // Reset page to 1 when changing records per page
  };

  // Filter employees based on search input
  const filteredEmployees = attendanceData
    ? attendanceData.employees.filter((employee) =>
        employee.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Paginate daily data
  const indexOfLastRecord = page * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredEmployees.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);

  // Paginate monthly data (same pagination logic but for monthly view)
  const currentMonthlyData = filteredEmployees.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalMonthlyPages = Math.ceil(filteredEmployees.length / recordsPerPage);

  // Function to export data to CSV
  const exportToCSV = () => {
    setExportLoading(true);
    try {
      if (!attendanceData || !attendanceData.employees || attendanceData.employees.length === 0) {
        toast.error("No data to export");
        return;
      }

      let csvContent = "";
      
      if (viewType === "daily") {
        // Headers for daily view
        csvContent = "Employee Code,Name,Attendance\n";
        
        // Data rows for daily view
        attendanceData.employees.forEach(employee => {
          csvContent += `${employee.employeeCode},${employee.name},${employee.attendance}\n`;
        });
      } else {
        // Headers for monthly view
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        let headers = "Employee Code,Name,Total Present,Total Leave";
        
        for (let i = 1; i <= daysInMonth; i++) {
          headers += `,Day ${i}`;
        }
        csvContent = headers + "\n";
        
        // Data rows for monthly view
        attendanceData.employees.forEach(employee => {
          const attendance = Array.isArray(employee.attendance) ? employee.attendance : [];
          const totalPresent = attendance.filter(
            status => status === "present" || status === "Sunday" || status === "holiday"
          ).length;
          const totalLeave = attendance.filter(
            status => status === "absent" || status === "on leave"
          ).length;
          
          let row = `${employee.employeeCode},${employee.name},${totalPresent},${totalLeave}`;
          
          attendance.forEach(status => {
            row += `,${status}`;
          });
          
          csvContent += row + "\n";
        });
      }
      
      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `attendance_report_${attendanceData.date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export successful!");
    } catch (error) {
      toast.error("Failed to export data");
      console.error("Export error:", error);
    } finally {
      setExportLoading(false);
    }
  };

  // Function to print the report
  const printReport = () => {
    window.print();
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "on leave":
        return "bg-yellow-100 text-yellow-800";
      case "holiday":
        return "bg-gray-100 text-gray-800";
      case "Sunday":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case "present":
        return <FiCheck className="mr-1" />;
      case "absent":
        return <FiX className="mr-1" />;
      case "on leave":
        return <FiClock className="mr-1" />;
      case "holiday":
        return <FiSun className="mr-1" />;
      case "Sunday":
        return <FiMoon className="mr-1" />;
      default:
        return <FiCheck className="mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Attendance Report</h1>
                <p className="text-blue-100">
                  {viewType === "daily" 
                    ? `Daily report for ${selectedDate}` 
                    : `Monthly report for ${new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })} ${selectedYear}`
                  }
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
                  <FiCalendar className="mr-2" />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <label htmlFor="viewType" className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFilter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="viewType"
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="daily">Daily View</option>
                    <option value="monthly">Monthly View</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {viewType === "daily" ? (
                <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer"
                      >
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i} value={selectedYear - i}>
                            {selectedYear - i}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <label htmlFor="recordsPerPage" className="block text-sm font-medium text-gray-700 mb-2">Records per page</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="recordsPerPage"
                    value={recordsPerPage}
                    onChange={handleRecordsPerPageChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value={10}>10 records</option>
                    <option value={20}>20 records</option>
                    <option value={30}>30 records</option>
                    <option value={50}>50 records</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search employees by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSearch}
                  className="inline-flex cursor-pointer items-center px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <BiLoaderCircle className="animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <FiSearch className="mr-2" />
                      Search
                    </>
                  )}
                </button>
                
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                  bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg"
                  disabled={exportLoading || !attendanceData}
                >
                  {exportLoading ? (
                    <>
                      <BiLoaderCircle className="animate-spin mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FiDownload className="mr-2" />
                      Export CSV
                    </>
                  )}
                </button>
                
                <button
                  onClick={printReport}
                  className="inline-flex items-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                  bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-md hover:shadow-lg"
                  disabled={!attendanceData}
                >
                  <FiPrinter className="mr-2" />
                  Print
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  <FiCheck className="mr-1" />
                  Present
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                  <FiX className="mr-1" />
                  Absent
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  <FiClock className="mr-1" />
                  On Leave
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  <FiSun className="mr-1" />
                  Holiday
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  <FiMoon className="mr-1" />
                  Sunday
                </div>
              </div>
            </div>

            {/* Display Attendance Data */}
            <div className="mt-8">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <BiLoaderCircle className="animate-spin text-indigo-600 w-12 h-12" />
                  <span className="ml-3 text-lg text-gray-600">Loading attendance data...</span>
                </div>
              ) : attendanceData && attendanceData.employees && attendanceData.employees.length > 0 ? (
                viewType === "daily" ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Attendance Report for {attendanceData.date}</h2>
                    <div className="overflow-auto rounded-lg border border-gray-300 shadow-lg">
                      <table className="w-full border-collapse text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                          <tr>
                            <th className="border border-gray-300 px-4 py-3 text-center">Employee Code</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Name</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Attendance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map((employee) => (
                            <tr key={employee.employeeCode} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="border border-gray-300 px-4 py-3 text-center">{employee.employeeCode}</td>
                              <td className="border border-gray-300 px-4 py-3 text-center">{employee.name}</td>
                              <td className="border border-gray-300 px-4 py-3 text-center">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(employee.attendance)}`}>
                                  {getAttendanceIcon(employee.attendance)}
                                  {employee.attendance}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Monthly Attendance Report for {attendanceData.date}</h2>
                    <div className="overflow-auto rounded-lg border border-gray-300 shadow-lg">
                      <table className="w-full border-collapse text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                          <tr>
                            <th className="border border-gray-300 px-4 py-3 text-center sticky left-0 bg-gray-50 z-10">Employee Code</th>
                            <th className="border border-gray-300 px-4 py-3 text-center sticky left-[100px] bg-gray-50 z-10">Name</th>
                            <th className="border border-gray-300 px-4 py-3 text-center bg-green-50">Total Present</th>
                            <th className="border border-gray-300 px-4 py-3 text-center bg-red-50">Total Leave</th>
                            {Array.from({ length: new Date(selectedYear, selectedMonth, 0).getDate() }, (_, i) => (
                              <th
                                key={`day-${i + 1}`}
                                className={`border border-gray-300 px-4 py-3 text-center font-medium ${
                                  new Date(selectedYear, selectedMonth - 1, i + 1).getDay() === 0 
                                    ? "bg-blue-50" 
                                    : "bg-gray-50"
                                }`}
                              >
                                {i + 1}
                                <div className="text-xs font-normal">
                                  {new Date(selectedYear, selectedMonth - 1, i + 1).toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentMonthlyData.map((employee) => {
                            const attendance = Array.isArray(employee.attendance) ? employee.attendance : [];
                            const totalPresent = attendance.filter(
                              (status) => status === "present" || status === "Sunday" || status === "holiday"
                            ).length;
                            const totalLeave = attendance.filter(
                              (status) => status === "absent" || status === "on leave"
                            ).length;

                            return (
                              <tr key={employee.employeeCode} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="border border-gray-300 px-4 py-3 text-center sticky left-0 bg-white z-10">{employee.employeeCode}</td>
                                <td className="border border-gray-300 px-4 py-3 text-center sticky left-[100px] bg-white z-10">{employee.name}</td>
                                <td className="border border-gray-300 px-4 py-3 text-center text-green-700 font-bold bg-green-50">
                                  {totalPresent}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center text-red-700 font-bold bg-red-50">
                                  {totalLeave}
                                </td>
                                {attendance.map((status, index) => {
                                  const dayOfWeek = new Date(selectedYear, selectedMonth - 1, index + 1).getDay();
                                  const isSunday = dayOfWeek === 0;
                                  
                                  return (
                                    <td
                                      key={index}
                                      className={`border border-gray-300 px-4 py-3 text-center ${
                                        isSunday ? "bg-blue-50" : getAttendanceColor(status)
                                      }`}
                                    >
                                      <div className="flex items-center justify-center">
                                        {getAttendanceIcon(status)}
                                        <span>{status}</span>
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                    <FiUsers className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No attendance data found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? "Try adjusting your search criteria" : "There is no attendance data for the selected period"}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination controls */}
            {attendanceData && attendanceData.employees && attendanceData.employees.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center bg-white px-4 py-3 rounded-lg shadow-md">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={page === 1}
                      className="px-2 py-1 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      First
                    </button>
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-2 py-1 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                  </div>
                  
                  <div className="mx-4 flex items-center">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show 5 pages at most, centered around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 cursor-pointer mx-1 rounded-full flex items-center justify-center ${
                            page === pageNum
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
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-2 py-1 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={page === totalPages}
                      className="px-2 py-1 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Last
                    </button>
                  </div>
                  
                  <div className="ml-4 text-sm text-gray-600">
                    Page {page} of {totalPages} ({filteredEmployees.length} records)
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportPage;