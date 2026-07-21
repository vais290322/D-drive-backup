import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../common/api';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from 'exceljs';

import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

const ReportsPage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    studentId: '',
    startDate: '',
    endDate: ''
  });
  
  // New state variables for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchAttendanceData();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/v1/students');
      setStudents(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch students');
    }
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get(`/api/v1/attendance/report?${params.toString()}`);
      setAttendanceData(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAttendanceData();
  };

  const handleResetFilters = () => {
    setFilters({
      studentId: '',
      startDate: '',
      endDate: ''
    });
    // Fetch data without filters
    fetchAttendanceData();
  };

  // Search functionality
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter data based on search term
  const filteredData = attendanceData.filter(record => {
    const studentName = record.student?.name || record?.name || '';
    const studentId = record.student?.studentId || '';
    const status = record.status || '';
    const late = record.isLate ? 'Yes':'No';
    const className = record.student?.className || '';
    const section = record.student?.section || '';

    const searchLower = searchTerm.toLowerCase();
    
    return (
      studentName.toLowerCase().includes(searchLower) ||
      studentId.toLowerCase().includes(searchLower) ||
      status.toLowerCase().includes(searchLower) ||
      late.toLowerCase().includes(searchLower) ||
      className.toLowerCase().includes(searchLower) ||
      section.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // console.log("currentItems",currentItems)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Attendance Report for All Students', 14, 22);
  
      doc.setFontSize(10);
      let filterText = 'Filters: ';
      if (filters.studentId && Array.isArray(students)) {
        const student = students.find(s => s._id.toString() === filters.studentId.toString());
        filterText += `Student: ${student?.name || 'Unknown'}, `;
      }
      if (filters.startDate) filterText += `From: ${new Date(filters.startDate).toLocaleDateString("en-GB")}, `;
      if (filters.endDate) filterText += `To: ${new Date(filters.endDate).toLocaleDateString("en-GB")}, `;
      if (filterText.endsWith(', ')) filterText = filterText.slice(0, -2);
      if (filterText === 'Filters:') filterText += ' None';
      doc.text(filterText, 14, 30);
  
      if (!attendanceData || !Array.isArray(attendanceData)) {
        toast.error('No attendance data available to export');
        return;
      }
  
      const tableColumn = ['S.No', 'Student', `Class`,`Section`, 'Roll','Date', 'Check In', 'Check Out', 'Total Hours', 'Status'];
      const tableRows = [];
  
      filteredData.forEach((record, index) => {
        const recordData = [
          (index + 1).toString(),
          record.student?.name || 'Unknown',
          record.student?.className || 'Unknown',
          record.student?.section || 'Unknown',
          record.student?.studentId || 'Unknown',
          new Date(record.date).toLocaleDateString("en-GB"),
          record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-',
          record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-',
          (record.totalHours ?? '-').toString(),
          record.status?.charAt(0).toUpperCase() + record.status?.slice(1) || '-'
        ];
        tableRows.push(recordData);
      });
  
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 135, 245] }
      });
  
      doc.save('attendance-report.pdf');
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    }
  };
  

  // Export to Excel
  const exportToExcel = () => {
    try {
      // Prepare data
      const excelData = filteredData.map((record, index) => ({
        'S.No': index + 1,
        'Student Name': record.student?.name || 'Unknown',
        'Class': record.student?.className || 'Unknown',
        'Section': record.student?.section || 'Unknown',
        'Roll Number': record.student?.studentId || 'Unknown',
        'Date': new Date(record.date).toLocaleDateString("en-GB"),
        'Check In': record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-',
        'Check Out': record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-',
        'Total Hours': record.totalHours,
        'Status': record.status.charAt(0).toUpperCase() + record.status.slice(1)
      }));
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Save the file
      saveAs(data, 'attendance-report.xlsx');
      toast.success('Excel exported successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to export Excel');
    }
  };

  const formatHoursAndMinutes = (totalHours) => {
    if (!totalHours && totalHours !== 0) return '-';
    
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    
    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
  };

  // Add new state variables for monthly report
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [monthlyReportData, setMonthlyReportData] = useState(null);
  const [monthlyFilters, setMonthlyFilters] = useState({
    month: new Date().getMonth() + 1, // Current month (1-12)
    year: new Date().getFullYear() // Current year
  });
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  // console.log("monthlyReportData",monthlyReportData)
  
  // Handle monthly filter change
  const handleMonthlyFilterChange = (e) => {
    const { name, value } = e.target;
    setMonthlyFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Fetch monthly report data
  const fetchMonthlyReport = async () => {
    try {
      setLoadingMonthly(true);
      
      // Build query params
      const params = new URLSearchParams();
      params.append('month', monthlyFilters.month);
      params.append('year', monthlyFilters.year);
      
      const response = await api.get(`/api/v1/attendance/monthly-report?${params.toString()}`);
      setMonthlyReportData(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch monthly report');
    } finally {
      setLoadingMonthly(false);
    }
  };
  
  // Handle monthly filter submit
  const handleMonthlyFilterSubmit = (e) => {
    e.preventDefault();
    fetchMonthlyReport();
  };
  
  // Export monthly report to Excel

  const exportMonthlyToExcel = () => {
  try {
    if (
      !monthlyReportData ||
      !monthlyReportData.students ||
      monthlyReportData.students.length === 0
    ) {
      toast.error('No data to export');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${monthlyReportData.month}-${monthlyReportData.year}`);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[monthlyReportData.month - 1];
    const year = monthlyReportData.year;

    /* ✅ Step 1: Build header rows
       Added: Class, Section
    */
    const headerRow = ['Student ID', 'Name', 'Class', 'Section', 'Email'];

    for (let day = 1; day <= monthlyReportData.daysInMonth; day++) {
      const dayStr = day.toString().padStart(2, '0');
      const monthStr = monthlyReportData.month.toString().padStart(2, '0');
      headerRow.push(`${dayStr}-${monthStr}-${year}`, ''); // Two columns: IN + OUT
    }

    const subHeaderRow = ['', '', '', '', '']; // 5 static columns
    for (let day = 1; day <= monthlyReportData.daysInMonth; day++) {
      subHeaderRow.push('Check In');
      subHeaderRow.push('Check Out');
    }

    /* ✅ Step 2: Set column widths */
    const allColumns = [
      { width: 15 }, // ID
      { width: 20 }, // Name
      { width: 12 }, // Class
      { width: 12 }, // Section
      { width: 25 }, // Email
    ];

    for (let day = 1; day <= monthlyReportData.daysInMonth; day++) {
      allColumns.push({ width: 10 }); // Check In
      allColumns.push({ width: 10 }); // Check Out
    }

    worksheet.columns = allColumns;

    /* ✅ Step 3: Add header rows */
    worksheet.addRow(headerRow);
    worksheet.addRow(subHeaderRow);

    /* ✅ Step 4: Add student data */
    monthlyReportData.students.forEach(student => {
      const dataRow = [
        student.studentId,
        student.name,
        student.className,   // ✅ new column
        student.section,     // ✅ new column
        student.email,
      ];

      student.attendance.forEach(day => {
        dataRow.push(day.checkIn || '');
        dataRow.push(day.checkOut || '');
      });

      worksheet.addRow(dataRow);
    });

    /* ✅ Step 5: Merge date cells in header row */
    for (let day = 0; day < monthlyReportData.daysInMonth; day++) {
      const startCol = 6 + day * 2;  // now starts after 5 fixed columns
      const endCol = startCol + 1;
      worksheet.mergeCells(1, startCol, 1, endCol);
    }

    /* ✅ Step 6: Header styling */
    [worksheet.getRow(1), worksheet.getRow(2)].forEach(row => {
      row.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4287F5' }, // Blue
        };
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFFFF' }, // White
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    /* ✅ Step 7: Freeze first two rows */
    worksheet.views = [{ state: 'frozen', ySplit: 2 }];

    /* ✅ Step 8: Export */
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `attendance-monthly-report-${monthName}-${year}.xlsx`);
      toast.success('Monthly report exported successfully');
    });

  } catch (error) {
    console.error('Excel export error:', error);
    toast.error('Failed to export Excel');
  }
};


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"> Students' Attendance Reports</h1>
        <div className="flex space-x-3">
          {/* Toggle between regular and monthly reports */}
          <button
            onClick={() => setShowMonthlyReport(false)}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${!showMonthlyReport ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Regular Report
          </button>
          <button
            onClick={() => setShowMonthlyReport(true)}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${showMonthlyReport ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Monthly Report
          </button>
          
          {/* Export buttons */}
          {!showMonthlyReport ? (
            <>
              <button
                onClick={exportToPDF}
                disabled={loading || filteredData.length === 0}
                className="px-4 py-2 bg-red-600 text-white cursor-pointer rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export PDF
              </button>
              <button
                onClick={exportToExcel}
                disabled={loading || filteredData.length === 0}
                className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export Excel
              </button>
            </>
          ) : (
            <button
              onClick={exportMonthlyToExcel}
              disabled={loadingMonthly || !monthlyReportData}
              className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export Monthly Excel
            </button>
          )}
        </div>
      </div>

      {/* Show either regular or monthly report UI */}
      {!showMonthlyReport ? (
        <>
          {/* Regular Report UI */}
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Filter Reports</h2>
            <form onSubmit={handleFilterSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student
                  </label>
                  <select
                    name="studentId"
                    value={filters.studentId}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Students</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Search Box */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search by student name, roll, late, class,  section or status..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredData.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student's Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check Out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Hours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Late
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((record, index) => (
                        <tr key={record._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{indexOfFirstItem + index + 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{record.student?.name || record?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{record.student?.studentId || ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{record.student?.className || record?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{record.student?.section || ''}, {record.student?.studentId   || ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString("en-GB")}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatHoursAndMinutes(record.totalHours)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'present' ? 'bg-green-100 text-green-800' : record.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.isLate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {record.isLate ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination Controls */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                    </select>
                    <span className="text-sm text-gray-700 ml-2">entries</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-4">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                    </span>
                    <nav className="flex">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border cursor-pointer border-gray-300 rounded-l-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
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
                            onClick={() => paginate(pageNum)}
                            className={`px-3 py-1 border-t border-b cursor-pointer border-gray-300 ${currentPage === pageNum ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 border cursor-pointer border-gray-300 rounded-r-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No attendance records found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add attendance records</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Monthly Report UI */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Attendance Report</h2>
            <form onSubmit={handleMonthlyFilterSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    name="month"
                    value={monthlyFilters.month}
                    onChange={handleMonthlyFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    name="year"
                    value={monthlyFilters.year}
                    onChange={handleMonthlyFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Monthly Report Preview */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loadingMonthly ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : monthlyReportData && monthlyReportData.students && monthlyReportData.students.length > 0 ? (
              <div className="overflow-x-auto">
                <p className="p-4 text-lg font-semibold">
                  Monthly Report Preview - {monthlyReportData.students.length} Students
                </p>
                <p className="px-4 pb-4 text-sm text-gray-600">
                  Showing data for {new Date(monthlyReportData.year, monthlyReportData.month - 1).toLocaleString('default', { month: 'long' })} {monthlyReportData.year}
                </p>
                <p className="px-4 pb-4 text-sm text-gray-600">
                  Click "Export Monthly Excel" to download the complete report in Excel format.
                </p>
                
                {/* Sample preview of the data */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-yellow-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Section Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Days Present
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Days Absent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyReportData?.students?.map((student, index) => {
                      // Count days present (has check-in and not holiday)
                      const daysPresent = student.attendance.filter(day => 
                        day.checkIn !== "-" && day.checkIn !== "HOLIDAY"
                      ).length;
                      
                      // Count days absent (not present and not holiday)
                      const daysAbsent = student.attendance.filter(day => 
                        day.checkIn === "-"
                      ).length;
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.studentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.className}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.section}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {daysPresent}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {daysAbsent}
                          </td>
                        </tr>
                      );
                    })}
                    {/* {monthlyReportData.students.length > 5 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          ... and {monthlyReportData.students.length - 5} more students
                        </td>
                      </tr>
                    )} */}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No monthly report data available</p>
                <p className="text-sm text-gray-400 mt-1">Select a month and year, then click "Generate Report"</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;