import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiLoaderCircle } from "react-icons/bi";
import { FiUsers, FiClock, FiSearch, FiSave, FiFilter, FiEdit, FiCheck } from "react-icons/fi";
import { backendDomainN } from '../../../common/index';

const ShiftManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage, setEmployeesPerPage] = useState(5);
  const [modifiedEmployees, setModifiedEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShift, setFilterShift] = useState("All");
  const [fetchLoading, setFetchLoading] = useState(false);

  // Filter employees based on search term and shift filter
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesShift = filterShift === "All" || employee.shift === filterShift;
    
    return matchesSearch && matchesShift;
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handleShiftChange = (employeeCode, shift) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.employeeCode === employeeCode ? { ...employee, shift } : employee
      )
    );

    setModifiedEmployees((prevModified) => {
      const exists = prevModified.find((emp) => emp.employeeCode === employeeCode);
      if (exists) {
        return prevModified.map((emp) =>
          emp.employeeCode === employeeCode ? { ...emp, shift } : emp
        );
      } else {
        const employee = employees.find((emp) => emp.employeeCode === employeeCode);
        return [...prevModified, { employeeCode, name: employee.employeeName, shift, email: employee.email }];
      }
    });
  };

  const handleBulkUpdateClick = () => {
    if (modifiedEmployees.length === 0) {
      toast.error("No employees selected for update.");
      return;
    }
    setShowModal(true); // Show the modal to confirm bulk update
  };

  const confirmBulkUpdate = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendDomainN}/api/shifts/update`, 
        modifiedEmployees,{
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Shifts updated successfully!");
        setModifiedEmployees([]); // Clear the modifiedEmployees array
      }
    } catch (error) {
      toast.error("Failed to update shifts. Please try again.");
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const fetchEmployee = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.get(`${backendDomainN}/api/employees`);
      setEmployees(response?.data?.data);
      toast.success("Employees data loaded successfully!");
    } catch (error) {
      toast.error("Failed to fetch employees. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterChange = (e) => {
    setFilterShift(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Shift Management</h1>
                <p className="text-purple-100">
                  Manage employee shift schedules efficiently
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center">
                  <FiClock className="mr-2" />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-2">Search Employees</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="searchTerm"
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by name, code or email..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <label htmlFor="filterShift" className="block text-sm font-medium text-gray-700 mb-2">Filter by Shift</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFilter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="filterShift"
                    value={filterShift}
                    onChange={handleFilterChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="All">All Shifts</option>
                    <option value="Day">Day Shift</option>
                    <option value="Night">Night Shift</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <label htmlFor="employeesPerPage" className="block text-sm font-medium text-gray-700 mb-2">Employees per page</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="employeesPerPage"
                    value={employeesPerPage}
                    onChange={(e) => {
                      setEmployeesPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing records per page
                    }}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value={5}>5 employees</option>
                    <option value={10}>10 employees</option>
                    <option value={15}>15 employees</option>
                    <option value={20}>20 employees</option>
                    <option value={50}>50 employees</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredEmployees.length}</span> employees found
                {modifiedEmployees.length > 0 && (
                  <span className="ml-2 text-indigo-600">
                    (<span className="font-medium">{modifiedEmployees.length}</span> changes pending)
                  </span>
                )}
              </div>
              
              <button
                onClick={handleBulkUpdateClick}
                className={`inline-flex cursor-pointer items-center px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                ${modifiedEmployees.length > 0 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg" 
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                disabled={modifiedEmployees.length === 0}
              >
                <FiSave className="mr-2" />
                Save Changes ({modifiedEmployees.length})
              </button>
            </div>
            
            {/* Display Employees Data */}
            <div className="mt-8">
              {fetchLoading ? (
                <div className="flex justify-center items-center py-20">
                  <BiLoaderCircle className="animate-spin text-indigo-600 w-12 h-12" />
                  <span className="ml-3 text-lg text-gray-600">Loading employees data...</span>
                </div>
              ) : filteredEmployees.length > 0 ? (
                <div className="overflow-auto rounded-lg border border-gray-300 shadow-lg">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                      <tr>
                        <th className="border border-gray-300 px-4 py-3 text-center">Employee Code</th>
                        <th className="border border-gray-300 px-4 py-3 text-center">Employee Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-center">Email</th>
                        <th className="border border-gray-300 px-4 py-3 text-center">Current Shift</th>
                        <th className="border border-gray-300 px-4 py-3 text-center">Change Shift</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEmployees.map((employee) => {
                        const isModified = modifiedEmployees.some(
                          (emp) => emp.employeeCode === employee.employeeCode
                        );
                        
                        return (
                          <tr 
                            key={employee.employeeCode} 
                            className={`text-center hover:bg-gray-50 transition-colors duration-150 ${
                              isModified ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="border border-gray-300 px-4 py-3">{employee.employeeCode}</td>
                            <td className="border border-gray-300 px-4 py-3">{employee.employeeName}</td>
                            <td className="border border-gray-300 px-4 py-3">{employee.email}</td>
                            <td className="border border-gray-300 px-4 py-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                employee.shift === "Day" 
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200" 
                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                              }`}>
                                <FiClock className="mr-1" />
                                {employee.shift}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <div className="flex items-center justify-center">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiEdit className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <select
                                    value={employee.shift}
                                    onChange={(e) => handleShiftChange(employee.employeeCode, e.target.value)}
                                    className={`pl-9 pr-8 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer ${
                                      isModified 
                                        ? "border-indigo-300 bg-indigo-50" 
                                        : "border-gray-300"
                                    }`}
                                  >
                                    <option value="Day">Day</option>
                                    <option value="Night">Night</option>
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                                {isModified && (
                                  <span className="ml-2 flex items-center text-xs text-indigo-600">
                                    <FiCheck className="h-3 w-3 mr-1" />
                                    Changed
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                    <FiUsers className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterShift !== "All" 
                      ? "Try adjusting your search criteria" 
                      : "There are no employees in the system yet"}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination controls */}
            {filteredEmployees.length > 0 && (
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show 5 pages at most, centered around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
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
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 rounded-md cursor-pointer text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Last
                    </button>
                  </div>
                  
                  <div className="ml-4 text-sm text-gray-600">
                    Page {currentPage} of {totalPages} ({filteredEmployees.length} records)
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Shift Updates</h2>
            <p className="mb-6 text-gray-600">
              You are about to update shifts for <span className="font-semibold text-indigo-600">{modifiedEmployees.length}</span> employees. 
              This action cannot be undone. Do you want to continue?
            </p>
            
            <div className="max-h-40 overflow-auto mb-6 rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-700">Employee</th>
                    <th className="px-3 py-2 text-right text-gray-700">New Shift</th>
                  </tr>
                </thead>
                <tbody>
                  {modifiedEmployees.map((emp) => (
                    <tr key={emp.employeeCode} className="border-t border-gray-200">
                      <td className="px-3 py-2 text-left">
                        <div className="font-medium text-gray-800">{emp.name}</div>
                        <div className="text-xs text-gray-500">{emp.employeeCode}</div>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          emp.shift === "Day" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          <FiClock className="mr-1" />
                          {emp.shift}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkUpdate}
                className="px-4 cursor-pointer py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <BiLoaderCircle className="animate-spin mr-2 inline" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2 inline" />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManagementPage;