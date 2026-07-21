import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, set } from "date-fns";
import { backendDomainN, backendDomainR1 } from "../../Common/index";
import { FaCloudDownloadAlt, FaEdit, FaTrash } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Select from "react-select";

const getEmployeeUri = import.meta.env.VITE_REACT_GET_EMPLOYEE;

const ManualAttendnceComponent = () => {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Create options for react-select
  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: `${emp.employeeName} - ${emp.employeeCode} - ${emp?.designation || ''}`,
  }));

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: `${project.siteName} - ${project.vendorName}`,
  }));

  const [formData, setFormData] = useState({
    employeeId: "",
    totalDays: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalSeakLeave: 0,
    totalCasualLeave: 0,
    otDays: 0,
    month: "",
    year: new Date().getFullYear(),
    siteName: "",
    siteId: "",
    clientName: "",
    uniformDeductions: 0,
    advancePayment: 0,
  });
  // console.log("url : ",projects)

  // Add new state variables for search, filter and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterSite, setFilterSite] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch Employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(getEmployeeUri);
        setEmployees(response?.data?.data || []);
      } catch (error) {
        toast.error("Failed to fetch employees");
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${backendDomainR1}/api/v1/payroll/fetch/wage-Details`
        );
        // console.log("response : ", response.data);
        setProjects(response?.data?.data || []);
      } catch (error) {
        toast.error("Failed to fetch projects");
      }
    };

    fetchProjects();

    fetchEmployees();
  }, []);

  // Fetch Attendance Data
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendDomainR1}/api/v1/manual-attendance`
      );
      setAttendanceData(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // Add this effect to handle filtering and search
  useEffect(() => {
    let result = [...attendanceData];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (record) =>
          record.employeeName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          record.employeeCode
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          record.siteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply month-year filter
    if (filterMonth || filterYear) {
      result = result.filter((record) => {
        if (!record.months) return false;

        const [recordMonth, recordYear] = record.months.split("-");

        if (filterMonth && filterYear) {
          return (
            recordMonth === filterMonth && recordYear === filterYear.toString()
          );
        } else if (filterMonth) {
          return recordMonth === filterMonth;
        } else if (filterYear) {
          return recordYear === filterYear.toString();
        }
        return true;
      });
    }

    // Apply site filter
    if (filterSite) {
      result = result.filter((record) => record.siteName === filterSite);
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filterMonth, filterYear, attendanceData, filterSite]);

  // Calculate pagination
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const year = formData.year;
  const month = formData.month; // 1 = Jan, 2 = Feb (human format)

  const daysInMonth = new Date(year, month, 0).getDate();
  
  const totalWorkingDays = Number(formData.totalDays) + Number(formData.otDays);

  // console.log("total days on this month and total working days are: ", daysInMonth, totalWorkingDays);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedMonthYear = `${String(formData.month).padStart(2, "0")}-${formData.year
      }`;

      if (totalWorkingDays > daysInMonth*2) {
        toast.error(`Total working days (${totalWorkingDays}) cannot be greater than double the days in month (${daysInMonth*2})`);
        return;
      }


    const submitedData = {
      ...formData,
      months: formattedMonthYear, // override with formatted string
      uniformDeductions: Number(formData.uniformDeductions),
      advancePayment: Number(formData.advancePayment),
    };
    // console.log("submitedData : ",submitedData)
    // return

    try {
      setLoading(true);
      await axios.post(
        `${backendDomainR1}/api/v1/manual-attendance`,
        submitedData
      );
      toast.success("Attendance added successfully");
      setShowModal(false);
      fetchAttendanceData();
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(
        `${backendDomainR1}/api/v1/manual-attendance/${selectedRecord.id}`,
        formData
      );
      toast.success("Attendance updated successfully");
      setShowUpdateModal(false);
      fetchAttendanceData();
      resetForm();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${backendDomainR1}/api/v1/manual-attendance/${selectedRecord.id}`
      );
      toast.success("Attendance deleted successfully");
      setShowDeleteModal(false);
      fetchAttendanceData();
    } catch (error) {
      toast.error("Failed to delete attendance");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      totalDays: 0,
      totalPresent: 0,
      totalAbsent: 0,
      totalSeakLeave: 0,
      totalCasualLeave: 0,
      otDays: 0,
      month: "",
      year: new Date().getFullYear(),
      siteName: "",
      siteId: "",
      clientName: "",
      uniformDeductions: 0,
      advancePayment: 0,
    });
  };

  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );

  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Attendance");

      // Add headers
      worksheet.columns = [
        { header: "Sl.No", key: "slNo", width: 10 },
        { header: "Employee Code", key: "employeeCode", width: 15 },
        { header: "Employee Name", key: "employeeName", width: 25 },
        { header: "Site Name", key: "siteName", width: 25 },
        { header: "Month/Year", key: "months", width: 15 },
        { header: "Total Days", key: "totalDays", width: 12 },
        { header: "Present", key: "totalPresent", width: 12 },
        { header: "Absent", key: "totalAbsent", width: 12 },
        { header: "Sick Leave", key: "totalSeakLeave", width: 12 },
        { header: "Casual Leave", key: "totalCasualLeave", width: 15 },
        { header: "OT Days", key: "otDays", width: 12 },
      ];

      // Add data
      filteredData.forEach((record, index) => {
        worksheet.addRow({
          slNo: index + 1,
          employeeCode: record.employeeCode || "N/A",
          employeeName: record.employeeName || "N/A",
          siteName: record.siteName || "N/A",
          months: record.months || "N/A",
          totalDays: record.totalDays || 0,
          totalPresent: record.totalPresent || 0,
          totalAbsent: record.totalAbsent || 0,
          totalSeakLeave: record.totalSeakLeave || 0,
          totalCasualLeave: record.totalCasualLeave || 0,
          otDays: record.otDays || 0,
        });
      });

      // Style the header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Manual_Attendance_${format(new Date(), "dd-MM-yyyy")}.xlsx`);
      toast.success("Excel file downloaded successfully");
    } catch (error) {
      console.error("Excel Export Error:", error);
      toast.error("Failed to export Excel");
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF("landscape");

      const tableColumn = [
        "Sl.No",
        "Emp Code",
        "Employee",
        "Site Name",
        "Month/Year",
        "Total Days",
        "Present",
        "Absent",
        "SL",
        "CL",
        "OT Days"
      ];

      const tableRows = [];

      filteredData.forEach((record, index) => {
        const rowData = [
          index + 1,
          record.employeeCode || "N/A",
          record.employeeName || "N/A",
          record.siteName || "N/A",
          record.months || "N/A",
          record.totalDays || 0,
          record.totalPresent || 0,
          record.totalAbsent || 0,
          record.totalSeakLeave || 0,
          record.totalCasualLeave || 0,
          record.otDays || 0,
        ];
        tableRows.push(rowData);
      });

      doc.text("Manual Attendance Report", 14, 15);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      doc.save(`Manual_Attendance_${format(new Date(), "dd-MM-yyyy")}.pdf`);
      toast.success("PDF file downloaded successfully");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to export PDF");
    }
  };

  // Add this before the return statement
  const Pagination = () => (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="border rounded p-1"
        >
          {[5, 10, 20, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>
        <span className="px-4 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Modify the return statement to include search and filters
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manual Attendance</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Add Attendance
        </button>
      </div>

      {/* Add Search and Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search by employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Filter by Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Filter by Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filterSite}
            onChange={(e) => setFilterSite(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Filter by Site</option>
            {projects.map((site) => (
              <option key={site.id} value={site.siteName}>
                {site.siteName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterMonth("");
              setFilterYear("");
              setFilterSite("");
            }}
            className="w-full p-2 border rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
        <button
          onClick={exportToPDF}
          className="w-full p-2 border rounded bg-blue-200 hover:bg-blue-300 cursor-pointer flex items-center justify-center"
        >
          <FaCloudDownloadAlt className="mr-2" />
          Export to pdf
        </button>
        <button
          onClick={exportToExcel}
          className="w-full p-2 border rounded bg-green-200 hover:bg-green-300 cursor-pointer flex items-center justify-center"
        >
          <FaCloudDownloadAlt className="mr-2" />
          Export to excel
        </button>
      </div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sl.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Employee Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Site Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Month/Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Present
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Absent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Leaves
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                OT Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRecords.map((record, index) => (
              <tr key={record._id}>
                <td className="px-6 py-4">{indexOfFirstRecord + index + 1}</td>
                <td className="px-6 py-4">{record.employeeCode || "N/A"}</td>
                <td className="px-6 py-4">{record.employeeName || "N/A"}</td>
                <td className="px-6 py-4">{record.siteName || "N/A"}</td>
                <td className="px-6 py-4">{record.months || "N/A"}</td>
                <td className="px-6 py-4">{record.totalDays || "N/A"}</td>
                <td className="px-6 py-4">{record.totalPresent || "N/A"}</td>
                <td className="px-6 py-4">{record.totalAbsent || "N/A"}</td>
                <td className="px-6 py-4">
                  <div>SL: {record.totalSeakLeave}</div>
                  <div>CL: {record.totalCasualLeave}</div>
                </td>
                <td className="px-6 py-4">{record.otDays || 0}</td>
                <td className="px-6 py-4 flex">
                  <button
                    onClick={() => {
                      setSelectedRecord(record);
                      setFormData(record);
                      setShowUpdateModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 mr-2 cursor-pointer"
                  >
                    <FaEdit className="mr-2" /> 
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRecord(record);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <FaTrash className="mr-2" /> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showModal || showUpdateModal) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg min-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {showModal ? "Add Attendance" : "Update Attendance"}
            </h3>
            <form onSubmit={showModal ? handleSubmit : handleUpdate}>
              <div className="mb-4">


                <Select
                  name="employeeId"
                  value={employeeOptions.find(option => option.value === formData.employeeId) || null}
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      employeeId: selectedOption ? selectedOption.value : "",
                    });
                  }}
                  options={employeeOptions}
                  placeholder="Select Employee"
                  isClearable
                  className="basic-multi-select"
                  classNamePrefix="select"
                />

              </div>

              <div className="mb-4">

                 <Select
                  value={projectOptions.find(option => option.value === formData.siteId) || null}
                  onChange={(selectedOption) => {
                    if (!selectedOption) {
                      setFormData({
                        ...formData,
                        siteId: "",
                        siteName: "",
                        clientName: "",
                      });
                      return;
                    }
                    
                    const project = projects.find(
                      (project) => project.id === selectedOption.value
                    );
                    
                    setFormData({
                      ...formData,
                      siteId: selectedOption.value,
                      siteName: project.siteName,
                      clientName: project.vendorName,
                    });
                  }}
                  options={projectOptions}
                  placeholder="Select Task Name"
                  isClearable
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.clientName}
                  placeholder="Client Name"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2">Month</label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block mb-2">Total Days</label>
                  <input
                    type="number"
                    name="totalDays"
                    value={formData.totalDays}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Present Days</label>
                  <input
                    type="number"
                    name="totalPresent"
                    value={formData.totalPresent}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Absent Days</label>
                  <input
                    type="number"
                    name="totalAbsent"
                    value={formData.totalAbsent}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Sick Leave</label>
                  <input
                    type="number"
                    name="totalSeakLeave"
                    value={formData.totalSeakLeave}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Casual Leave</label>
                  <input
                    type="number"
                    name="totalCasualLeave"
                    value={formData.totalCasualLeave}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Over Time Day</label>
                  <input
                    type="number"
                    name="otDays"
                    value={formData.otDays}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"

                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Uniform Deductions</label>
                  <input
                    type="number"
                    name="uniformDeductions"
                    value={formData.uniformDeductions}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"

                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Advance Payment</label>
                  <input
                    type="number"
                    name="advancePayment"
                    value={formData.advancePayment}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"

                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    showModal ? setShowModal(false) : setShowUpdateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded cursor-pointer"
                >
                  Cancel
                </button>
                {loading ? (
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-not-allowed opacity-50 disable "
                  >
                    {showModal ? "Adding..." : "Updating..."}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                  >
                    {showModal ? "Add" : "Update"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this attendance record?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add pagination */}
      <Pagination />
    </div>
  );
};

export default ManualAttendnceComponent;
