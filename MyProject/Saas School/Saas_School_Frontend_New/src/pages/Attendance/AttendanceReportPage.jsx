import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { Button } from "@/components/ui/button";
import { Calendar, Download, FileBarChart, Search } from "lucide-react";
import DateTableComponent from "@/components/ForAttendance/DateTableComponent";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import mainUrlApi from "@/common/main";

import TourButton from "@/components/Tour/TourButton";
import { attendanceReportPageSteps } from "@/components/Tour/Steps/AttendanceSteps/Steps";

const AttendanceReportPage = () => {
  const [month, setMonth] = useState(11); // Default month (December)
  const [year, setYear] = useState(2024); // Default year
  const [showMonth, setShowMonth] = useState("");
  const [showYear, setShowYear] = useState("");
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allClass = useSelector((state) => state.class.classNames);
  const allSection = useSelector((state) => state.section.sectionNames);
  const [attendanceData, setAttendanceData] = useState([]);
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const generateDates = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get total days in the month
    return Array.from({ length: daysInMonth }, (_, i) => i + 1); // Create an array from 1 to daysInMonth
  };

  const dates = generateDates(month, year);

  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
    month: "",
  });

  const dataLength = attendanceData.length;

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = attendanceData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const fetchAttendanceReport = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `${mainUrlApi.attendance.url}/${schoolId}/attendance/student-attendance1?className=${searchData.className}&section=${searchData.section}&month=${searchData.month}`
      );
      if (response) {
        setAttendanceData(response?.data);
        toast.success(response?.data?.message || "Data fetched successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch the data");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const attendanceReport = document.getElementById("forpdf");
    const downloadButton = document.querySelector(".download-button"); // Adjust selector if needed
    const paginationComponent = document.querySelector("#pagination-component"); // Adjust selector if needed

    // Temporarily hide the "Download All" button and Pagination component
    if (downloadButton) {
      downloadButton.style.display = "none";
    }
    if (paginationComponent) {
      paginationComponent.style.display = "none";
    }

    // Generate the PDF
    html2canvas(attendanceReport, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.5); // Lower quality for smaller size (50%)
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, "", "FAST"); // Use FAST compression
      pdf.save("AttendanceReport.pdf");

      // Restore visibility of the "Download All" button and Pagination component
      if (downloadButton) {
        downloadButton.style.display = "";
      }
      if (paginationComponent) {
        paginationComponent.style.display = "";
      }
    });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const handleMonthChange = (e) => {
    const [selectedYear, selectedMonth] = e.target.value.split("-");

    setMonth(Number(selectedMonth));
    setShowMonth(selectedMonth);
    setShowYear(selectedYear);
    setYear(Number(selectedYear));
    setSearchData({ ...searchData, month: selectedMonth + "/" + selectedYear });
  };

  // Calculate attendance statistics
  const getTotalPresentCount = () => {
    return attendanceData.reduce((total, student) => {
      return (
        total +
        Object.values(student.attendance).filter((status) => status === "P")
          .length
      );
    }, 0);
  };

  const getTotalAbsentCount = () => {
    return attendanceData.reduce((total, student) => {
      return (
        total +
        Object.values(student.attendance).filter((status) => status === "A")
          .length
      );
    }, 0);
  };

  const getAttendancePercentage = () => {
    const totalPresent = getTotalPresentCount();
    const totalEntries = attendanceData.reduce((total, student) => {
      return (
        total +
        Object.values(student.attendance).filter(
          (status) => status === "P" || status === "A"
        ).length
      );
    }, 0);

    return totalEntries > 0
      ? Math.round((totalPresent / totalEntries) * 100)
      : 0;
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto py-8 px-4">
        {/* Page Header with Gradient */}
        <div
          className={`mb-6 ${
            theme === "light" ? "text-white" : "text-gray-800"
          } flex justify-between items-center`}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold relative inline-block">
              Attendance Reports
              <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
            </h1>
            <p className="mt-2 text-sm md:text-base opacity-80">
              View and analyze student attendance records
            </p>
          </div>
          <div className="flex-shrink-0">
            <TourButton
              steps={attendanceReportPageSteps}
              tourName={"attendance-report-tour"}
            />
          </div>
        </div>

        {/* Search Section */}
        <div
          className={`mb-6 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            theme === "light"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div
            className={`p-4 sm:p-6 border-b ${
              theme === "light" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                theme === "light" ? "text-white" : "text-gray-800"
              }`}
            >
              Search Attendance Records
            </h2>

            <form
              onSubmit={fetchAttendanceReport}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "light" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Class
                </label>
                <Select
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, className: value })
                  }
                  required
                >
                  <SelectTrigger
                    className={`w-full ${
                      theme === "light"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Class</SelectLabel>
                      {allClass.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "light" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Section
                </label>
                <Select
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, section: value })
                  }
                  required
                >
                  <SelectTrigger
                    className={`w-full ${
                      theme === "light"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Section</SelectLabel>
                      {allSection.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "light" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Month
                </label>
                <input
                  type="month"
                  onChange={handleMonthChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === "light"
                      ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                      : "bg-white border-gray-300 focus:border-purple-500"
                  } focus:outline-none`}
                  required
                />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Results Card */}
        {attendanceData.length > 0 ? (
          <div
            className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
              theme === "light"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
            id="forpdf"
          >
            {/* Card Header */}
            <div
              className={`flex flex-col md:flex-row justify-between items-center p-4 sm:p-6 border-b ${
                theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="mb-4 md:mb-0">
                <h2
                  className={`text-xl font-bold flex items-center ${
                    theme === "light" ? "text-white" : "text-gray-800"
                  }`}
                >
                  <FileBarChart className="mr-2 h-5 w-5" />
                  Attendance Report
                </h2>
                <div className="flex items-center mt-1">
                  <Calendar
                    className={`h-4 w-4 mr-1 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {showMonth} - {showYear}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-0">
                <div
                  className={`px-3 py-2 rounded-lg ${
                    theme === "light" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      theme === "light" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Class:
                  </span>
                  <span
                    className={`ml-1 text-sm font-bold ${
                      theme === "light" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {searchData.className} ({searchData.section})
                  </span>
                </div>

                <div
                  className={`px-3 py-2 rounded-lg ${
                    theme === "light" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      theme === "light" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Attendance:
                  </span>
                  <span className={`ml-1 text-sm font-bold text-green-500`}>
                    {getAttendancePercentage()}%
                  </span>
                </div>
              </div>

              <div className="download-button">
                <Button
                  onClick={downloadPDF}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-6 border-b ${
                theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div
                className={`rounded-lg p-4 ${
                  theme === "light" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p
                      className={`text-sm ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Total Students
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        theme === "light" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {attendanceData.length}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${
                      theme === "light" ? "bg-gray-600" : "bg-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg p-4 ${
                  theme === "light" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p
                      className={`text-sm ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Present Count
                    </p>
                    <p className={`text-2xl font-bold text-green-500`}>
                      {getTotalPresentCount()}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${
                      theme === "light" ? "bg-gray-600" : "bg-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg p-4 ${
                  theme === "light" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p
                      className={`text-sm ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Absent Count
                    </p>
                    <p className={`text-2xl font-bold text-red-500`}>
                      {getTotalAbsentCount()}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${
                      theme === "light" ? "bg-gray-600" : "bg-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader
                  className={`${
                    theme === "light" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <TableRow>
                    <TableHead
                      className={`px-4 py-3 ${
                        theme === "light" ? "text-gray-200" : "text-gray-700"
                      } font-semibold text-sm text-left`}
                    >
                      Roll No
                    </TableHead>
                    <TableHead
                      className={`px-4 py-3 ${
                        theme === "light" ? "text-gray-200" : "text-gray-700"
                      } font-semibold text-sm text-left`}
                    >
                      <DateTableComponent month={month} year={year} />
                    </TableHead>
                    <TableHead
                      className={`px-4 py-3 ${
                        theme === "light" ? "text-gray-200" : "text-gray-700"
                      } font-semibold text-sm text-left`}
                    >
                      Present Count
                    </TableHead>
                    <TableHead
                      className={`px-4 py-3 ${
                        theme === "light" ? "text-gray-200" : "text-gray-700"
                      } font-semibold text-sm text-left`}
                    >
                      Absent Count
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow
                      key={item.id}
                      className={`transition-colors hover:bg-opacity-10 ${
                        theme === "light"
                          ? "hover:bg-gray-600 border-t border-gray-700"
                          : "hover:bg-gray-100 border-t border-gray-200"
                      }`}
                    >
                      <TableCell
                        className={`px-4 py-3 font-medium ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.rollNo}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {/* Render attendance for each date */}
                        <div
                          className="grid gap-1"
                          style={{
                            gridTemplateColumns: `repeat(${dates.length}, minmax(25px, 1fr))`,
                          }}
                        >
                          {Object.keys(item.attendance).map((date) => (
                            <span
                              key={date}
                              className={`flex justify-center items-center p-1 rounded-md text-xs font-medium ${
                                item.attendance[date] === "P"
                                  ? "bg-green-100 text-green-800"
                                  : item.attendance[date] === "A"
                                  ? "bg-red-100 text-red-800"
                                  : item.attendance[date] === "S"
                                  ? "bg-blue-100 text-blue-800"
                                  : item.attendance[date] === "-"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-transparent"
                              }`}
                            >
                              {item.attendance[date]}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {
                            Object.values(item.attendance).filter(
                              (status) => status === "P"
                            ).length
                          }
                        </span>
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {
                            Object.values(item.attendance).filter(
                              (status) => status === "A"
                            ).length
                          }
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination with improved styling */}
            <div
              className={`p-4 border-t ${
                theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
              id="pagination-component"
            >
              <PaginationComponent
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalPages={totalPages}
                onRowsPerPageChange={handleRowsPerPageChange}
                onPageChange={setCurrentPage}
                className={`${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              />
            </div>
          </div>
        ) : (
          !loading && (
            <div
              className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                theme === "light"
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <svg
                  className="w-16 h-16 mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <p
                  className={`text-lg font-medium ${
                    theme === "light" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  No attendance data
                </p>
                <p
                  className={`text-sm mt-2 ${
                    theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Select a class, section, and month to view attendance reports
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AttendanceReportPage;
