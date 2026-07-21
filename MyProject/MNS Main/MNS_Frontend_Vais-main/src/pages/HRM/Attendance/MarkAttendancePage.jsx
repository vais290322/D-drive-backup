import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { FiCalendar, FiUsers, FiCheck, FiX, FiClock, FiSun, FiMoon, FiAlertCircle, FiSave, FiSearch } from "react-icons/fi";
import { backendDomainN } from "../../../Common/index";
import ManualAttendnceComponent from "../../../component/HRM/ManualAttendnceComponent";

const MarkAttendancePage = () => {
    const [employees, setEmployees] = useState([]);
    const [viewType, setViewType] = useState("daily");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [currentDate, setCurrentDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage, setEmployeesPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [attendanceMode, setAttendanceMode] = useState("manual");

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatMonth = (month, year) => {
        const formattedMonth = String(month).padStart(2, "0");
        return `${formattedMonth}-${year}`;
    };

    useEffect(() => {
        const today = new Date();

        if (viewType === "monthly") {
            const year = today.getFullYear();
            const days = new Date(year, selectedMonth, 0).getDate();
            setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
            setCurrentDate(formatMonth(selectedMonth, year));

            setEmployees((prevEmployees) =>
                prevEmployees.map((employee) => ({
                    ...employee,
                    attendance: Array.from({ length: days }, () => "present"),
                }))
            );
        } else {
            setDaysInMonth([]);
            setEmployees((prevEmployees) =>
                prevEmployees.map((employee) => ({
                    ...employee,
                    attendance: "present", // Default to present for daily view
                }))
            );
            setCurrentDate(formatDate(today));
        }
    }, [viewType, selectedMonth]);

    const handleAttendanceChange = (id, value, day) => {
        setEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
                employee.id === id
                    ? {
                        ...employee,
                        attendance: viewType === "monthly"
                            ? employee.attendance.map((att, index) => (index === day - 1 ? value : att))
                            : value,
                    }
                    : employee
            )
        );
    };

    const handleSubmit = async () => {
        setIsModalOpen(true);
    };

    const confirmSubmit = async () => {
        try {
            setLoading(true);
            const data = {
                viewType,
                employees: employees.map((employee) => ({
                    employeeCode: employee.employeeCode,
                    name: employee.employeeName,
                    attendance: viewType === "monthly"
                        ? employee.attendance.map((att, index) => {
                            // If the day is Sunday, set attendance as "Sunday"
                            const dayOfWeek = getDayName(new Date(new Date().getFullYear(), selectedMonth - 1, index + 1));
                            return dayOfWeek === "Sunday" ? "Sunday" : att;
                        })
                        : employee.attendance || "present",
                })),
                date: currentDate,
            };
    
            // Use different URLs based on the viewType
            const url = viewType === "monthly" 
                ? `${backendDomainN}/month-attendance`  // Monthly attendance URL
                : `${backendDomainN}/api/attendance`;  // Daily attendance URL
    
            const response = await axios.post(url, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (response) {
                toast.success("Attendance data submitted successfully!");
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Failed to submit attendance data. Please try again.");
        }
        finally{
            setLoading(false);
        }
    };

    const fetchEmployee = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${backendDomainN}/api/employees`);
            setEmployees(response?.data?.data || []);
        } catch (error) {
            toast.error("Failed to fetch employees. Please refresh the page.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, []);

    // Filter employees based on search term
    const filteredEmployees = employees.filter(employee => 
        employee.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getDayName = (date) => {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[date.getDay()];
    };

    const getAttendanceColor = (status) => {
        switch (status) {
            case "present":
                return "bg-green-100 text-green-800 border-green-200";
            case "absent":
                return "bg-red-100 text-red-800 border-red-200";
            case "on leave":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "holiday":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "Sunday":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-green-100 text-green-800 border-green-200";
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
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="p-6">
                        <div className="flex justify-center space-x-4 mb-4">
                            {/* <button
                                onClick={() => setAttendanceMode("regular")}
                                className={`px-6 py-3 rounded-lg transition-all cursor-pointer duration-200 ${
                                    attendanceMode === "regular"
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Regular Attendance
                            </button> */}
                            <button
                                onClick={() => setAttendanceMode("manual")}
                                className={`px-6 py-3 rounded-lg transition-all cursor-pointer duration-200 ${
                                    attendanceMode === "manual"
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Manual Attendance
                            </button>
                        </div>
                    </div>
                </div>

                {
                    attendanceMode === "regular" ? (<div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Attendance Management</h1>
                                <p className="text-blue-100">
                                    {viewType === "daily" 
                                        ? `Daily attendance for ${currentDate}` 
                                        : `Monthly attendance for ${new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}`
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                                <label htmlFor="viewType" className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiCalendar className="h-5 w-5 text-gray-400" />
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
                            
                            {viewType === "monthly" && (
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
                            )}
                            
                            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                                <label htmlFor="employeesPerPage" className="block text-sm font-medium text-gray-700 mb-2">Employees per page</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUsers className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="employeesPerPage"
                                        value={employeesPerPage}
                                        onChange={(e) => setEmployeesPerPage(Number(e.target.value))}
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer"
                                    >
                                        <option value="5">5 employees</option>
                                        <option value="10">10 employees</option>
                                        <option value="15">15 employees</option>
                                        <option value="25">25 employees</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search employees by name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                />
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

                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <BiLoaderCircle className="animate-spin text-indigo-600 w-12 h-12" />
                                <span className="ml-3 text-lg text-gray-600">Loading employees...</span>
                            </div>
                        ) : currentEmployees.length === 0 ? (
                            <div className="text-center py-16 px-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                                    <FiUsers className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
                                <p className="text-gray-500">
                                    {searchTerm ? "Try adjusting your search criteria" : "There are no employees to display"}
                                </p>
                            </div>
                        ) : (
                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6 ${viewType === "daily" ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
                                {currentEmployees.map((employee) => (
                                    <div key={employee.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">
                                                    {employee.employeeName?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">{employee.employeeName}</h3>
                                                    <p className="text-sm text-gray-500">ID: {employee.employeeCode}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            {viewType === "daily" ? (
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-sm font-medium text-gray-500 flex items-center">
                                                            <FiCalendar className="mr-1" />
                                                            {getDayName(new Date())} - {new Date().toLocaleDateString()}
                                                        </span>
                                                        
                                                        {getDayName(new Date()) === "Sunday" && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                <FiMoon className="mr-1" />
                                                                Weekend
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="relative">
                                                        <select
                                                            value={getDayName(new Date()) === "Sunday" ? "Sunday" : employee.attendance || "present"}
                                                            onChange={(e) => handleAttendanceChange(employee.id, e.target.value)}
                                                            className={`block w-full pl-3 pr-10 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer ${
                                                                getAttendanceColor(getDayName(new Date()) === "Sunday" ? "Sunday" : employee.attendance || "present")
                                                            }`}
                                                            disabled={getDayName(new Date()) === "Sunday"}
                                                        >
                                                            <option value="Sunday" disabled>Sunday</option>
                                                            <option value="present">Present</option>
                                                            <option value="absent">Absent</option>
                                                            <option value="on leave">On Leave</option>
                                                            <option value="holiday">Holiday</option>
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 mb-3">Monthly Attendance</h4>
                                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                                                        {daysInMonth.map((day) => {
                                                            const dayOfWeek = getDayName(new Date(new Date().getFullYear(), selectedMonth - 1, day));
                                                            const isSunday = dayOfWeek === "Sunday";
                                                            const attendanceValue = isSunday ? "Sunday" : employee.attendance[day - 1] || "present";
                                                            
                                                            return (
                                                                <div key={day} className="flex flex-col">
                                                                    <div className="flex justify-between items-center mb-1">
                                                                        <span className="text-xs font-medium text-gray-500">Day {day}</span>
                                                                        {isSunday && (
                                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                                Sun
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    <div className="relative">
                                                                        <select
                                                                            value={attendanceValue}
                                                                            onChange={(e) => handleAttendanceChange(employee.id, e.target.value, day)}
                                                                            className={`block w-full pl-2 pr-6 py-1.5 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer ${
                                                                                getAttendanceColor(attendanceValue)
                                                                            }`}
                                                                            disabled={isSunday}
                                                                        >
                                                                            <option value="Sunday" disabled>Sunday</option>
                                                                            <option value="present">Present</option>
                                                                            <option value="absent">Absent</option>
                                                                            <option value="on leave">On Leave</option>
                                                                            <option value="holiday">Holiday</option>
                                                                        </select>
                                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                                                                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isLoading && filteredEmployees.length > 0 && (
                            <div className="flex justify-between items-center mb-6">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="inline-flex cursor-pointer items-center px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                                    bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                                    <span className="text-gray-700 font-medium">
                                        Page {currentPage} of {totalPages || 1}
                                    </span>
                                </div>

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex cursor-pointer items-center px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                                    bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <button
                                onClick={handleSubmit}
                                className="inline-flex cursor-pointer items-center px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                                bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg"
                            >
                                <FiSave className="mr-2" />
                                Submit Attendance
                            </button>
                        </div>
                    </div>
                </div>): (<ManualAttendnceComponent />)
                }
                
            </div>

            {attendanceMode === "regular" && isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md mx-4 animate-fadeIn">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
                            <h3 className="text-xl font-semibold flex items-center">
                                <FiAlertCircle className="mr-2" />
                                Confirm Attendance Submission
                            </h3>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to submit the attendance data? This action cannot be undone.
                            </p>
                            
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 cursor-pointer py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 cursor-pointer rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {loading ? (
                                        <>
                                            <BiLoaderCircle className="animate-spin mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <FiCheck className="mr-2" />
                                            Confirm
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarkAttendancePage;