import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import {
  FiSave,
  FiCalendar,
  FiDollarSign,
  FiSearch,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { backendDomainN } from "../../../Common/index";

const CreateSalaryPage = () => {
  const currentYear = new Date().getFullYear();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  // const [tax, setTax] = useState("");
  const [dataNotFound, setDataNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingData, setSavingData] = useState(false);

  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // console.log("selected : ", selectedEmployee);

  const handleOpenSalaryModal = (employee, index) => {
    // Initialize the fields if they don't exist
    const employeeWithFields = {
      ...employee,
      index,
      additionalFields: employee.additionalFields || [
        { description: "Basic Salary", amount: "" },
        { description: "HRA", amount: "" },
        { description: "Convenience", amount: "" }
      ],
      deductionFields: employee.deductionFields || [
        { description: "ESI", amount: "" },
        { description: "PF", amount: "" }
      ],
    };
    setSelectedEmployee(employeeWithFields);
    setSalaryModalOpen(true);
  };

  const handleCloseSalaryModal = () => {
    setSelectedEmployee(null);
    setSalaryModalOpen(false);
  };

  // Calculate totals for salary modal
  const calculateTotals = (employee) => {
    if (!employee) return { totalAdditional: 0, totalDeductions: 0, netSalary: 0 ,  totalPayableSalary: 0};
    
    const totalAdditional = (employee.additionalFields || []).reduce((sum, field) => {
      return sum + (parseFloat(field.amount) || 0);
    }, 0);
    
    const totalDeductions = (employee.deductionFields || []).reduce((sum, field) => {
      return sum + (parseFloat(field.amount) || 0);
    }, 0);
    
    const netSalary = totalAdditional - totalDeductions;

     // Calculate Total Payable Salary = (net salary * present) / totalDays
    const present = parseFloat(employee.present) || 0;
    const totalDays = parseFloat(employee.totalDays) || getTotalDaysInMonth(selectedMonth, selectedYear);
    const totalPayableSalary = totalDays > 0 ? (netSalary * present) / totalDays : 0;
    
    return {
      totalAdditional,
      totalDeductions,
      netSalary,
      totalPayableSalary

    };
  };

  // Updated field change handler for modal
  const handleModalFieldChange = (fieldIndex, fieldType, key, value) => {
    setSelectedEmployee(prev => {
      if (!prev) return null;
      
      const updated = { ...prev };
      
      if (fieldType === "additional") {
        updated.additionalFields = [...(prev.additionalFields || [])];
        updated.additionalFields[fieldIndex] = {
          ...updated.additionalFields[fieldIndex],
          [key]: value
        };
      } else if (fieldType === "deduction") {
        updated.deductionFields = [...(prev.deductionFields || [])];
        updated.deductionFields[fieldIndex] = {
          ...updated.deductionFields[fieldIndex],
          [key]: value
        };
      }
      
      // Also update the main employees array
      const updatedEmployees = [...employees];
      const actualIndex = indexOfFirstRecord + prev.index;
      if (updatedEmployees[actualIndex]) {
        updatedEmployees[actualIndex] = {
          ...updatedEmployees[actualIndex],
          additionalFields: updated.additionalFields,
          deductionFields: updated.deductionFields
        };
        setEmployees(updatedEmployees);
      }
      
      return updated;
    });
  };

  // Updated add field handler for modal
  const handleModalAddField = (fieldType) => {
    setSelectedEmployee(prev => {
      if (!prev) return null;
      
      const updated = { ...prev };
      
      if (fieldType === "additional") {
        updated.additionalFields = [
          ...(prev.additionalFields || []),
          { description: "", amount: "" }
        ];
      } else if (fieldType === "deduction") {
        updated.deductionFields = [
          ...(prev.deductionFields || []),
          { description: "", amount: "" }
        ];
      }
      
      // Also update the main employees array
      const updatedEmployees = [...employees];
      const actualIndex = indexOfFirstRecord + prev.index;
      if (updatedEmployees[actualIndex]) {
        updatedEmployees[actualIndex] = {
          ...updatedEmployees[actualIndex],
          additionalFields: updated.additionalFields,
          deductionFields: updated.deductionFields
        };
        setEmployees(updatedEmployees);
      }
      
      return updated;
    });
  };

  // Updated remove field handler for modal
  const handleModalRemoveField = (fieldIndex, fieldType) => {
    setSelectedEmployee(prev => {
      if (!prev) return null;
      
      const updated = { ...prev };
      
      if (fieldType === "additional") {
        updated.additionalFields = prev.additionalFields.filter((_, i) => i !== fieldIndex);
      } else if (fieldType === "deduction") {
        updated.deductionFields = prev.deductionFields.filter((_, i) => i !== fieldIndex);
      }
      
      // Also update the main employees array
      const updatedEmployees = [...employees];
      const actualIndex = indexOfFirstRecord + prev.index;
      if (updatedEmployees[actualIndex]) {
        updatedEmployees[actualIndex] = {
          ...updatedEmployees[actualIndex],
          additionalFields: updated.additionalFields,
          deductionFields: updated.deductionFields
        };
        setEmployees(updatedEmployees);
      }
      
      return updated;
    });
  };

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

  const filteredEmployees = employees?.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = page * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentEmployees = filteredEmployees?.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
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

  // Add new functions for handling additional fields and deductions
  const addNewField = (index, fieldType) => {
    const updatedEmployees = [...employees];
    const actualIndex = indexOfFirstRecord + index;

    // Initialize the arrays if they don't exist
    if (!updatedEmployees[actualIndex].additionalFields) {
      updatedEmployees[actualIndex].additionalFields = [];
    }
    if (!updatedEmployees[actualIndex].deductionFields) {
      updatedEmployees[actualIndex].deductionFields = [];
    }

    if (fieldType === "additional") {
      updatedEmployees[actualIndex].additionalFields.push({
        description: "",
        amount: "",
      });
      // Update selected employee state as well
      setSelectedEmployee((prev) => ({
        ...prev,
        additionalFields: [
          ...(prev.additionalFields || []),
          { description: "", amount: "" },
        ],
      }));
    } else if (fieldType === "deduction") {
      updatedEmployees[actualIndex].deductionFields.push({
        description: "",
        amount: "",
      });
      // Update selected employee state as well
      setSelectedEmployee((prev) => ({
        ...prev,
        deductionFields: [
          ...(prev.deductionFields || []),
          { description: "", amount: "" },
        ],
      }));
    }

    setEmployees(updatedEmployees);
  };

  const removeField = (employeeIndex, fieldIndex, fieldType) => {
    const updatedEmployees = [...employees];
    const actualIndex = indexOfFirstRecord + employeeIndex;

    if (fieldType === "additional") {
      updatedEmployees[actualIndex].additionalFields.splice(fieldIndex, 1);
      // Update selected employee state as well
      setSelectedEmployee((prev) => ({
        ...prev,
        additionalFields: prev.additionalFields.filter((_, i) => i !== fieldIndex),
      }));
    } else if (fieldType === "deduction") {
      updatedEmployees[actualIndex].deductionFields.splice(fieldIndex, 1);
      // Update selected employee state as well
      setSelectedEmployee((prev) => ({
        ...prev,
        deductionFields: prev.deductionFields.filter((_, i) => i !== fieldIndex),
      }));
    }

    setEmployees(updatedEmployees);
  };

  const handleFieldChange = (employeeIndex, fieldIndex, fieldType, key, value) => {
    const updatedEmployees = [...employees];
    const actualIndex = indexOfFirstRecord + employeeIndex;

    if (fieldType === "additional") {
      updatedEmployees[actualIndex].additionalFields[fieldIndex][key] = value;
      // Update selected employee state as well
      setSelectedEmployee((prev) => ({
        ...prev,
        additionalFields: prev.additionalFields.map((field, i) =>
          i === fieldIndex ? { ...field, [key]: value } : field
        ),
      }));
    } else if (fieldType === "deduction") {
      updatedEmployees[actualIndex].deductionFields[fieldIndex][key] = value;
      // Update selected employee state as well
      setSelectedEmployee((prev) => ({
        ...prev,
        deductionFields: prev.deductionFields.map((field, i) =>
          i === fieldIndex ? { ...field, [key]: value } : field
        ),
      }));
    }

    setEmployees(updatedEmployees);
  };

  const handleSave = () => {

    // Validate that all employees have basic salary set
    const employeesWithoutBasicSalary = [];
    
    employees.forEach((employee) => {
      const basicSalaryField = employee.additionalFields?.find(
        field => field.description === "Basic Salary"
      );
      
      const basicSalaryAmount = parseFloat(basicSalaryField?.amount) || 0;
      
      if (basicSalaryAmount <= 0) {
        employeesWithoutBasicSalary.push({
          name: employee.name,
          employeeCode: employee.employeeCode
        });
      }
    });

    // If there are employees without basic salary, show error and don't proceed
    if (employeesWithoutBasicSalary.length > 0) {
      const employeeNames = employeesWithoutBasicSalary
        .map(emp => `${emp.name} (${emp.employeeCode})`)
        .join(", ");
      
      if (employeesWithoutBasicSalary.length === 1) {
        toast.error(
          `Please set Basic Salary for ${employeeNames}. Basic Salary must be greater than 0.`,
          { duration: 5000 }
        );
      } else {
        toast.error(
          `Please set Basic Salary for the following employees: ${employeeNames}. All Basic Salaries must be greater than 0.`,
          { duration: 6000 }
        );
      }
      return;
    }

     // If validation passes, open confirmation modal
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
      bankNumber: employee.accountNo,
      bankName: employee.bankName,
      ifscCode: employee.ifscCode,
      branch: employee.branch,
      allLeaves: employee["all leaves"],
      present: employee.present,
      month: `${selectedMonth}-${selectedYear}`,
      totalDays: getTotalDaysInMonth(selectedMonth, selectedYear),
      year: selectedYear,
      additionalFields: employee.additionalFields || [],
      deductionFields: employee.deductionFields || [],
    }));

    console.log("Employees:", employees, "Payload:", payload);
    // return;

    try {
      const response = await axios.post(
        `${backendDomainN}/salary/process`,
        payload
      );
      if (response.status === 200) {
        toast.success("Salary data saved successfully!");
      }
    } catch (error) {
      toast.error( error?.response?.data?.message || "Error saving salary data");
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

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Select Period Box */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <FiCalendar className="mr-2 text-indigo-600" />
                  Select Period
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Month
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full border cursor-pointer border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option
                          key={i + 1}
                          value={(i + 1).toString().padStart(2, "0")}
                        >
                          {new Date(0, i).toLocaleString("default", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full border cursor-pointer border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={currentYear - i}>
                          {currentYear - i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-md p-5 border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
                  <svg className="mr-2 w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Salary Creation Instructions
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                    <p><span className="font-medium">Attendance: </span>Ensure that attendance is marked before salary is created </p>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                    <p><span className="font-medium">Select Period:</span> Choose the month and year for salary processing</p>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
                    <p><span className="font-medium">Add Salary Details:</span> Click "Add Salary" for each employee to set salary components</p>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mr-3 mt-0.5 flex-shrink-0">4</span>
                    <p><span className="font-medium">Default Fields:</span> Basic Salary, HRA, Convenience (Additional) | ESI, PF (Deductions)</p>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mr-3 mt-0.5 flex-shrink-0">5</span>
                    <p><span className="font-medium">Calculation:</span> System calculates Total Payable = (Net Salary × Present Days) ÷ Total Days</p>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mr-3 mt-0.5 flex-shrink-0">6</span>
                    <p><span className="font-medium">Review & Save:</span> Verify all details and click "Save Data" to process salaries</p>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mr-3 mt-0.5 flex-shrink-0">7</span>
                    <p><span className="font-medium">Again:</span> You can't create a salary for the same month and year more than once</p>
                  </div>
                  <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <span className="font-semibold">💡 Tip:</span> Ensure attendance data is accurate before processing salaries. You can adjust leave counts if needed.
                    </p>
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
                      {new Date(selectedYear, selectedMonth - 1).toLocaleString(
                        "default",
                        { month: "long" }
                      )}{" "}
                      {selectedYear}
                    </h3>
                    <p className="text-gray-600">
                      Total Days:{" "}
                      <span className="font-semibold">
                        {getTotalDaysInMonth(selectedMonth, selectedYear)}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100 flex items-center">
                      <FiUsers className="text-indigo-600 mr-2" />
                      <span className="text-gray-700">
                        <span className="font-semibold">
                          {filteredEmployees.length}
                        </span>{" "}
                        Employees
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
                <span className="ml-3 text-lg text-gray-600">
                  Loading employee data...
                </span>
              </div>
            )}

            {/* No Data Found Message */}
            {dataNotFound && !loading && (
              <div className="bg-white rounded-xl shadow-md p-10 border border-gray-200 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-red-100 p-3 mb-4">
                    <FiXCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Data Found
                  </h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    No employee attendance data found for{" "}
                    {new Date(selectedYear, selectedMonth - 1).toLocaleString(
                      "default",
                      { month: "long" }
                    )}{" "}
                    {selectedYear}
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
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Actions
                        </th>
                        {/* <th className="px-4 py-3 text-left font-semibold border-b">
                          Deduction Field
                        </th> */}
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Leave Count
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Present Count
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Total Days</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Employee Code
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Bank Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Account Number
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          IFSC Code
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Branch
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Pan Number
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Aadher Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentEmployees.map((employee, index) => (
                        <tr
                          key={employee.employeeCode}
                          className="hover:bg-blue-50 transition-colors duration-150"
                        >
                          {/* <td className="px-4 py-3">
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => addNewField(index, "additional")}
                                className="flex items-center cursor-pointer justify-center bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded transition-colors duration-200"
                              >
                                <FiPlus className="mr-1" /> Add Field
                              </button>

                              {employee.additionalFields &&
                                employee.additionalFields.map(
                                  (field, fieldIndex) => (
                                    <div
                                      key={fieldIndex}
                                      className="bg-blue-50 p-2 rounded space-y-2"
                                    >
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-blue-700">
                                          Additional Field {fieldIndex + 1}
                                        </span>
                                        <button
                                          onClick={() =>
                                            removeField(
                                              index,
                                              fieldIndex,
                                              "additional"
                                            )
                                          }
                                          className="text-red-500 cursor-pointer hover:text-red-700"
                                        >
                                          <FiTrash2 size={14} />
                                        </button>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Description"
                                        value={field.description}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            index,
                                            fieldIndex,
                                            "additional",
                                            "description",
                                            e.target.value
                                          )
                                        }
                                        className="border border-gray-300 rounded-lg p-1 w-full text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      />
                                      <input
                                        type="number"
                                        placeholder="Amount"
                                        value={field.amount}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            index,
                                            fieldIndex,
                                            "additional",
                                            "amount",
                                            e.target.value
                                          )
                                        }
                                        className="border border-gray-300 rounded-lg p-1 w-full text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      />
                                    </div>
                                  )
                                )}
                            </div>
                          </td> */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                handleOpenSalaryModal(employee, index)
                              }
                              className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                            >
                              <FiPlus className="mr-1" /> Add Salary
                            </button>
                          </td>
                          {/* <td className="px-4 py-3">
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => addNewField(index, "deduction")}
                                className="flex items-center cursor-pointer justify-center bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded transition-colors duration-200"
                              >
                                <FiPlus className="mr-1" /> Add Deduction
                              </button>

                              {employee.deductionFields &&
                                employee.deductionFields.map(
                                  (field, fieldIndex) => (
                                    <div
                                      key={fieldIndex}
                                      className="bg-red-50 p-2 rounded space-y-2"
                                    >
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-red-700">
                                          Deduction Field {fieldIndex + 1}
                                        </span>
                                        <button
                                          onClick={() =>
                                            removeField(
                                              index,
                                              fieldIndex,
                                              "deduction"
                                            )
                                          }
                                          className="text-red-500 cursor-pointer hover:text-red-700"
                                        >
                                          <FiTrash2 size={14} />
                                        </button>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Description"
                                        value={field.description}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            index,
                                            fieldIndex,
                                            "deduction",
                                            "description",
                                            e.target.value
                                          )
                                        }
                                        className="border border-gray-300 rounded-lg p-1 w-full text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      />
                                      <input
                                        type="number"
                                        placeholder="Amount"
                                        value={field.amount}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            index,
                                            fieldIndex,
                                            "deduction",
                                            "amount",
                                            e.target.value
                                          )
                                        }
                                        className="border border-gray-300 rounded-lg p-1 w-full text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                      />
                                    </div>
                                  )
                                )}
                            </div>
                          </td> */}

                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={employee["all leaves"] ?? 0}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "all leaves",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded-lg p-1.5 w-24 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FiCheckCircle className="mr-1" />
                              {employee?.present || "0"}
                            </span>
                          </td>
                          {/* <td className="px-4 py-3 font-medium text-gray-700">₹{employee?.baseSalary || "N/A"}</td> */}
                          <td className="px-4 py-3 font-medium text-gray-700">
                            {employee?.totalDays}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-700">
                            {employee?.employeeCode}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-700">
                            {employee?.name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {employee?.bankName || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {employee?.accountNo || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {employee?.ifscCode || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {employee?.branch || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {employee?.email || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {employee?.panNumber || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {employee?.aadherNumber || "N/A"}
                          </td>
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
                  <label className="text-sm text-gray-600">
                    Records per page:
                  </label>
                  <select
                    value={recordsPerPage}
                    onChange={(e) => {
                      setRecordsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer bg-white"
                  >
                    {[10, 20, 30, 50].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                    className="p-1.5 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="p-1.5 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
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
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages}
                    className="p-1.5 cursor-pointer rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstRecord + 1} to{" "}
                  {Math.min(indexOfLastRecord, filteredEmployees.length)} of{" "}
                  {filteredEmployees.length} employees
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Confirm Salary Processing
              </h3>
              <p className="text-gray-600">
                Are you sure you want to process salary for{" "}
                {filteredEmployees.length} employees for{" "}
                {new Date(selectedYear, selectedMonth - 1).toLocaleString(
                  "default",
                  { month: "long" }
                )}{" "}
                {selectedYear}?
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

      {/* Salary Modal */}
      {salaryModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Add Salary Details for{" "}
                <span className="text-blue-600"> {selectedEmployee.name} </span>
              </h3>
              <button
                onClick={handleCloseSalaryModal}
                className="text-gray-400 cursor-pointer hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Additional Fields Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-blue-800">
                    Additional Fields
                  </h4>
                  <button
                    onClick={() => handleModalAddField("additional")}
                    className="flex items-center cursor-pointer px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    <FiPlus className="mr-1" /> Add Field
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedEmployee.additionalFields?.map(
                    (field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className="bg-white p-3 rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-blue-700">
                            {field.description || `Field ${fieldIndex + 1}`}
                          </span>
                          {fieldIndex >= 3 && (
                            <button
                              onClick={() =>
                                handleModalRemoveField(fieldIndex, "additional")
                              }
                              className="text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Description"
                            value={field.description || ""}
                            onChange={(e) =>
                              handleModalFieldChange(
                                fieldIndex,
                                "additional",
                                "description",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                            disabled={fieldIndex < 3}
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={field.amount || ""}
                            onChange={(e) =>
                              handleModalFieldChange(
                                fieldIndex,
                                "additional",
                                "amount",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
                
                {/* Additional Fields Total */}
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Total Additional:</span>
                    <span className="text-lg font-bold text-blue-900">
                      ₹{calculateTotals(selectedEmployee).totalAdditional.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deduction Fields Section */}
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-red-800">
                    Deduction Fields
                  </h4>
                  <button
                    onClick={() => handleModalAddField("deduction")}
                    className="flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 cursor-pointer"
                  >
                    <FiPlus className="mr-1" /> Add Deduction
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedEmployee.deductionFields?.map(
                    (field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className="bg-white p-3 rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-red-700">
                            {field.description || `Field ${fieldIndex + 1}`}
                          </span>
                          {fieldIndex >= 2 && (
                            <button
                              onClick={() =>
                                handleModalRemoveField(fieldIndex, "deduction")
                              }
                              className="text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Description"
                            value={field.description || ""}
                            onChange={(e) =>
                              handleModalFieldChange(
                                fieldIndex,
                                "deduction",
                                "description",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                            disabled={fieldIndex < 2}
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={field.amount || ""}
                            onChange={(e) =>
                              handleModalFieldChange(
                                fieldIndex,
                                "deduction",
                                "amount",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
                
                {/* Deduction Fields Total */}
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-800">Total Deductions:</span>
                    <span className="text-lg font-bold text-red-900">
                      ₹{calculateTotals(selectedEmployee).totalDeductions.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Calculation */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Gross Salary</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{calculateTotals(selectedEmployee).totalAdditional.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Deductions</p>
                  <p className="text-xl font-bold text-red-600">
                    ₹{calculateTotals(selectedEmployee).totalDeductions.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net Salary</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{calculateTotals(selectedEmployee).netSalary.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Payable Salary</p>
                  <p className="text-xl font-bold text-purple-600">
                    ₹{calculateTotals(selectedEmployee).totalPayableSalary.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ({selectedEmployee.present || 0}/{selectedEmployee.totalDays || getTotalDaysInMonth(selectedMonth, selectedYear)} days)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={handleCloseSalaryModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button> 
              <button
                onClick={() => {
                  handleCloseSalaryModal();
                  // Add any save logic here if needed
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSalaryPage;
