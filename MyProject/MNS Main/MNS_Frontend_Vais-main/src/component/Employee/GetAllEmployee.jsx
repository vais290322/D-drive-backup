import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import UpdateEmployee from "./UpdateEmployee";
import { ChevronLeft, ChevronRight, Search, Filter, RefreshCw, Delete } from "lucide-react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UpdateIcon from '@mui/icons-material/Update';
import toast from "react-hot-toast";
import { DeleteOutline } from "@mui/icons-material";

const getEmployeeUri = import.meta.env.VITE_REACT_GET_EMPLOYEE;

const GetAllEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getEmployeeUri);
        setEmployees(response?.data);
        setFilteredEmployees(response?.data?.data || []);
      } catch (error) {
        // console.error("Error fetching employees", error);
        toast.error("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Apply search and filters
  useEffect(() => {
    if (!employees?.data) return;
    
    let results = [...employees.data];
    
    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(employee => 
        employee.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      
      results = results.filter(employee => {
        if (searchField === "all") {
          return (
            (employee.employeeName && employee.employeeName.toLowerCase().includes(term)) ||
            (employee.employeeCode && employee.employeeCode.toLowerCase().includes(term)) ||
            (employee.email && employee.email.toLowerCase().includes(term)) ||
            (employee.phone && employee.phone.toLowerCase().includes(term)) ||
            (employee.city && employee.city.toLowerCase().includes(term)) ||
            (employee.state && employee.state.toLowerCase().includes(term))
          );
        } else if (searchField === "name") {
          return employee.employeeName && employee.employeeName.toLowerCase().includes(term);
        } else if (searchField === "code") {
          return employee.employeeCode && employee.employeeCode.toLowerCase().includes(term);
        } else if (searchField === "email") {
          return employee.email && employee.email.toLowerCase().includes(term);
        } else if (searchField === "phone") {
          return employee.phone && employee.phone.toLowerCase().includes(term);
        } else if (searchField === "location") {
          return (
            (employee.city && employee.city.toLowerCase().includes(term)) ||
            (employee.state && employee.state.toLowerCase().includes(term))
          );
        }
        return false;
      });
    }
    
    setFilteredEmployees(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, searchField, statusFilter, employees]);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
  };

  const handleUpdateSuccess = () => {
    setEditingEmployee(null);
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(getEmployeeUri);
        setEmployees(response?.data);
        setFilteredEmployees(response?.data?.data || []);
      } catch (error) {
        // console.error("Error fetching employees", error);
        toast.error("Error fetching employees");
      }
    };
    fetchEmployees();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSearchField("all");
    setStatusFilter("all");
    setFilteredEmployees(employees?.data || []);
  };

const handleDelete = async (employeeId) => {
  const confirmed = window.confirm("Are you sure you want to delete this employee?");
  if (!confirmed) return;

  try {
    await axios.delete(`${getEmployeeUri}/${employeeId}`);
    toast.success("Employee deleted successfully");

    // Refresh employee list
    const response = await axios.get(getEmployeeUri);
    const employees = response?.data?.data || [];

    setEmployees(employees);
    setFilteredEmployees(employees);
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Failed to delete employee");
  }
};


  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((filteredEmployees?.length || 0) / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-b from-white to-gray-50 p-8 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Employee Management</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              className="border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>
          {/* <button
            onClick={() => navigate("/add-employee")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-green-700 transition-colors cursor-pointer shadow-md flex items-center gap-1"
          >
            <span>+</span> Add Employee
          </button> */}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Fields</option>
              <option value="name">Name</option>
              <option value="code">Employee Code</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="location">Location</option>
            </select>
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          
          <button 
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {filteredEmployees.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} employees
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">No employees found matching your criteria</p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full bg-white">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Sl.No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems?.map((employee) => (
                    <tr key={employee.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">{indexOfFirstItem + currentItems.indexOf(employee) + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {employee.employeeImage ? (
                            <img
                              src={employee.employeeImage}
                              alt={employee.employeeName}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                              {employee?.employeeName?.charAt(0)}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.employeeName}
                            </div>
                            <div className="text-xs font-medium text-blue-600">
                              {employee.employeeCode}
                            </div>
                            <div className="text-xs text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{employee.phone}</div>
                        <div className="text-xs text-gray-500">{employee.city}, {employee.state}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {employee?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setViewingEmployee(employee)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer bg-blue-50 hover:bg-blue-100 p-1 rounded-md transition-colors flex items-center gap-1"
                          >
                            <span>View</span>
                            <MoreVertIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleEdit(employee)}
                            className="text-green-600 hover:text-green-900 cursor-pointer bg-green-50 hover:bg-green-100 p-1 rounded-md transition-colors flex items-center gap-1"
                          >
                            <span>Edit</span>
                            <UpdateIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer bg-green-50 hover:bg-green-100 p-1 rounded-md transition-colors flex items-center gap-1"
                          >
                            <span>Delete</span>
                            <DeleteOutline fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6 mt-4 bg-white rounded-lg shadow-md">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{indexOfFirstItem + 1}</span>
                  {' '}-{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredEmployees?.length || 0)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{filteredEmployees?.length || 0}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {totalPages <= 7 ? (
                    [...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))
                  ) : (
                    <>
                      {[...Array(Math.min(3, currentPage - 1))].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        >
                          {index + 1}
                        </button>
                      ))}
                      {currentPage > 4 && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      )}
                      {currentPage > 3 && currentPage < totalPages - 2 && (
                        <button
                          onClick={() => paginate(currentPage)}
                          className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        >
                          {currentPage}
                        </button>
                      )}
                      {currentPage < totalPages - 3 && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      )}
                      {[...Array(Math.min(3, totalPages - currentPage))].map((_, index) => (
                        <button
                          key={totalPages - index}
                          onClick={() => paginate(totalPages - index)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === totalPages - index
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {totalPages - index}
                        </button>
                      ))}
                    </>
                  )}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View More Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-800">Employee Details</h3>
              <button
                onClick={() => setViewingEmployee(null)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex flex-col items-center">
                {viewingEmployee.employeeImage ? (
                  <img
                    src={viewingEmployee.employeeImage}
                    alt={viewingEmployee.employeeName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-medium">
                    {viewingEmployee?.employeeName?.charAt(0)}
                  </div>
                )}
                <h4 className="text-xl font-semibold mt-4">{viewingEmployee.employeeName}</h4>
                <p className="text-gray-500">{viewingEmployee.employeeCode}</p>
                <span className={`mt-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  viewingEmployee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {viewingEmployee?.status}
                </span>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-800 border-b pb-2">Personal Information</h4>
                  <div className="space-y-2">
                    <p className="text-gray-600"><span className="font-medium">Email:</span> {viewingEmployee.email}</p>
                    <p className="text-gray-600"><span className="font-medium">Gender:</span> {viewingEmployee.gender}</p>
                    <p className="text-gray-600"><span className="font-medium">Blood Group:</span> {viewingEmployee.bloodGroup}</p>
                    <p className="text-gray-600"><span className="font-medium">Religion:</span> {viewingEmployee.religion}</p>
                    <p className="text-gray-600"><span className="font-medium">Phone:</span> {viewingEmployee.phone}</p>
                    <p className="text-gray-600"><span className="font-medium">Designation:</span> {viewingEmployee.designation || "N/A"}</p>
                    <p className="text-gray-600"><span className="font-medium">Marital Status:</span> {viewingEmployee.maritialStatus}</p>
                    <p className="text-gray-600"><span className="font-medium">Joining Date:</span> {viewingEmployee.joiningDate}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-800 border-b pb-2">Address Details</h4>
                  <div className="space-y-2">
                    <p className="text-gray-600"><span className="font-medium">Pin Code:</span> {viewingEmployee.pinCode}</p>
                    <p className="text-gray-600"><span className="font-medium">State:</span> {viewingEmployee.state}</p>
                    <p className="text-gray-600"><span className="font-medium">City:</span> {viewingEmployee.city}</p>
                    <p className="text-gray-600"><span className="font-medium">District:</span> {viewingEmployee.district}</p>
                    <p className="text-gray-600"><span className="font-medium">Country:</span> {viewingEmployee.country}</p>
                    <p className="text-gray-600"><span className="font-medium">Police Station:</span> {viewingEmployee.policeStation}</p>
                    <p className="text-gray-600"><span className="font-medium">Village Post:</span> {viewingEmployee.villPost}</p>
                    <p className="text-gray-600"><span className="font-medium">PF Number :</span> {viewingEmployee.pfNumber}</p>
                    <p className="text-gray-600"><span className="font-medium">ESI Number:</span> {viewingEmployee.esiNumber}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-800 border-b pb-2">Bank Details</h4>
                  <div className="space-y-2">
                    <p className="text-gray-600"><span className="font-medium">Bank Name:</span> {viewingEmployee.bankName}</p>
                    <p className="text-gray-600"><span className="font-medium">IFSC Code:</span> {viewingEmployee.ifscCode}</p>
                    <p className="text-gray-600"><span className="font-medium">Branch:</span> {viewingEmployee.branch}</p>
                    <p className="text-gray-600"><span className="font-medium">Account Holder:</span> {viewingEmployee.accHeadName}</p>
                    <p className="text-gray-600"><span className="font-medium">Account Number:</span> {viewingEmployee.accountNo}</p>
                    {/* <p className="text-gray-600"><span className="font-medium">Base Salary:</span> {viewingEmployee.baseSalary}</p> */}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-800 border-b pb-2">Documents</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 mb-2 font-medium">PAN Details</p>
                      {viewingEmployee.panImage ? (
                        <img
                          src={viewingEmployee.panImage}
                          alt="PAN"
                          className="w-24 h-24 rounded-lg object-cover border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-gray-300 flex items-center justify-center text-white">
                          No Image
                        </div>
                      )}
                      <p className="text-gray-600 mt-2"><span className="font-medium">PAN:</span> {viewingEmployee.panNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2 font-medium">Aadhar Details</p>
                      {viewingEmployee.aatherImage ? (
                        <img
                          src={viewingEmployee.aatherImage}
                          alt="Aadhar"
                          className="w-24 h-24 rounded-lg object-cover border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-gray-300 flex items-center justify-center text-white">
                          No Image
                        </div>
                      )}
                      <p className="text-gray-600 mt-2"><span className="font-medium">Aadhar:</span> {viewingEmployee.aadherNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => handleEdit(viewingEmployee)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mr-2 cursor-pointer"
              >
                Edit Employee
              </button>
              <button
                onClick={() => setViewingEmployee(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} 

      {editingEmployee && (
        <UpdateEmployee
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default GetAllEmployee;