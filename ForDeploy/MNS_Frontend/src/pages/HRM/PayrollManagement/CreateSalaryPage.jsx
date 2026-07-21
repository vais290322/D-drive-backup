import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { FiSave, FiCalendar, FiDollarSign, FiSearch, FiUsers, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { backendDomainN } from "../../../common/index";

const CreateSalaryPage = () => {
  const currentYear = new Date().getFullYear();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [tax, setTax] = useState("");
  const [dataNotFound, setDataNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingData, setSavingData] = useState(false);

  useEffect(() => {
    fetchEmployeeData();
  }, [selectedMonth, selectedYear]);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendDomainN}/month-attendance/month/${selectedMonth}-${selectedYear}`
      );
      if (response.status === 200) {
        const data = response?.data?.data;
        setEmployees(data);
        setDataNotFound(data.length === 0);
      }
    } catch (error) {
      toast.error("Error fetching employee data");
      setEmployees([]);
      setDataNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = page * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);

  const getTotalDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedEmployees = [...employees];
    // Calculate the actual index in the full employees array
    const actualIndex = indexOfFirstRecord + index;
    updatedEmployees[actualIndex][field] = value;
    setEmployees(updatedEmployees);
  };

  const handleSave = () => {
    if (!tax) {
      toast.error("Please add tax amount");
      return;
    }

    // Open confirmation modal
    setIsModalOpen(true);
  };

  const confirmSave = async () => {
    setIsModalOpen(false); // Close confirmation modal
    setSavingData(true);

    const payload = employees.map((employee) => ({
      employeeCode: employee.employeeCode,
      name: employee.name,
      email: employee.email,
      panNumber: employee.panNumber,
      aadherNumber: employee.aadherNumber,
      bankName: employee.bankName,
      ifscCode: employee.ifscCode,
      branch: employee.branch,
      baseSalary: employee.baseSalary,
      allLeaves: employee["all leaves"],
      present: employee.present,
      month: `${selectedMonth}-${selectedYear}`,
      totalDays: getTotalDaysInMonth(selectedMonth, selectedYear),
      ptax: tax,
      conveyanceAllowance: employee.convenience || 0,
      year: selectedYear
    }));

    try {
      const response = await axios.post(`${backendDomainN}/salary/process`, payload);
      if (response.status === 200) {
        toast.success("Salary data saved successfully!");
      }
    } catch (error) {
      toast.error("Error saving salary data");
    } finally {
      setSavingData(false);
    }
  };

  const cancelSave = () => {
    setIsModalOpen(false); // Close modal without saving
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Create Salary</h1>
                <p className="text-blue-100">
                  Process monthly salary for employees based on attendance data
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={handleSave}
                  disabled={savingData || dataNotFound}
                  className="inline-flex cursor-pointer items-center px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingData ? (
                    <BiLoaderCircle className="animate-spin mr-2" />
                  ) : (
                    <FiSave className="mr-2" />
                  )}
                  {savingData ? "Saving..." : "Save Data"}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Month and Year Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <FiCalendar className="mr-2 text-indigo-600" />
                  Select Period
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full border cursor-pointer border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                          {new Date(0, i).toLocaleString("default", { month: "long" })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full border cursor-pointer border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={currentYear - i}>{currentYear - i}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <FiDollarSign className="mr-2 text-indigo-600" />
                  Tax Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Professional Tax Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      id="tax"
                      value={tax}
                      onChange={(e) => setTax(e.target.value)}
                      className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Enter tax amount"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Period Summary */}
            {!dataNotFound && !loading && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 mb-6 border border-indigo-100 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-800 mb-1">
                      {new Date(selectedYear, selectedMonth - 1).toLocaleString("default", { month: "long" })} {selectedYear}
                    </h3>
                    <p className="text-gray-600">
                      Total Days: <span className="font-semibold">{getTotalDaysInMonth(selectedMonth, selectedYear)}</span>
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100 flex items-center">
                      <FiUsers className="text-indigo-600 mr-2" />
                      <span className="text-gray-700">
                        <span className="font-semibold">{filteredEmployees.length}</span> Employees
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by employee code or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <BiLoaderCircle className="animate-spin text-indigo-600 w-12 h-12" />
                <span className="ml-3 text-lg text-gray-600">Loading employee data...</span>
              </div>
            )}
            
            {/* No Data Found Message */}
            {dataNotFound && !loading && (
              <div className="bg-white rounded-xl shadow-md p-10 border border-gray-200 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-red-100 p-3 mb-4">
                    <FiXCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Found</h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    No employee attendance data found for {new Date(selectedYear, selectedMonth - 1).toLocaleString("default", { month: "long" })} {selectedYear}
                  </p>
                  <button
                    onClick={fetchEmployeeData}
                    className="px-4 cursor-pointer py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            )}
            
            {/* Table */}
            {!dataNotFound && !loading && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                        <th className="px-4 py-3 text-left font-semibold border-b">Convenience</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Leave Count</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Present Count</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">CTC/year</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Employee Code</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Name</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Bank Name</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Account Number</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">IFSC Code</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Branch</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Email</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Pan Number</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Aadher Number</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentEmployees.map((employee, index) => (
                        <tr key={employee.employeeCode} className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={employee.convenience ?? 0}
                              onChange={(e) => handleInputChange(index, "convenience", e.target.value)}
                              className="border border-gray-300 rounded-lg p-1.5 w-24 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={employee["all leaves"] ?? 0}
                              onChange={(e) => handleInputChange(index, "all leaves", e.target.value)}
                              className="border border-gray-300 rounded-lg p-1.5 w-24 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FiCheckCircle className="mr-1" />
                              {employee?.present || "0"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-700">₹{employee?.baseSalary || "N/A"}</td>
                          <td className="px-4 py-3 font-medium text-gray-700">{employee?.employeeCode}</td>
                          <td className="px-4 py-3 font-medium text-gray-700">{employee?.name}</td>
                          <td className="px-4 py-3 text-gray-600">{employee?.bankName || "N/A"}</td>
                          <td className="px-4 py-3 text-gray-600">{employee?.accountNo || "N/A"}</td>
                          <td className="px-4 py-3 text-gray-600">{employee?.ifscCode || "N/A"}</td>
                          <td className="px-4 py-3 text-gray-600">{employee?.branch || "N/A"}</td>
                          <td className="px-4 py-3 text-gray-600">{employee?.email || "N/A"}</td>
                          <td className="px-4 py-3 text-gray-600">{employee?.panNumber || "N/A"}</td>
                          <td className="px-4 py-3 text-gray-600">{employee?.aadherNumber || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Pagination and Records Per Page */}
            {!dataNotFound && !loading && filteredEmployees.length > 0 && (
              <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Records per page:</label>
                  <select
                    value={recordsPerPage}
                    onChange={(e) => {
                      setRecordsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer bg-white"
                  >
                    {[10, 20, 30, 50].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                    className="p-1.5 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="p-1.5 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  
                  <span className="px-3 py-1 text-sm font-medium text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="p-1.5 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages}
                    className="p-1.5 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredEmployees.length)} of {filteredEmployees.length} employees
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full animate__animated animate__fadeIn mx-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <FiSave className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm Salary Processing</h3>
              <p className="text-gray-600">
                Are you sure you want to process salary for {filteredEmployees.length} employees for {new Date(selectedYear, selectedMonth - 1).toLocaleString("default", { month: "long" })} {selectedYear}?
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelSave}
                className="px-5 py-2.5 cursor-pointer rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="px-5 py-2.5 cursor-pointer rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSalaryPage;