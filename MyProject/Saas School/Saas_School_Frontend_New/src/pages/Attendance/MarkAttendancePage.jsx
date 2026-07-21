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
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { Button } from "@/components/ui/button";
import ToggleButtonComponent from "@/components/ForAttendance/ToggleButtonComponent";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, CheckCircle, Save, Search, UserCheck } from "lucide-react";
import mainUrlApi from "@/common/main";

// Import the tour steps and TourButton component
import TourButton from "@/components/Tour/TourButton";
import { markAttendancePageSteps } from "@/components/Tour/Steps/AttendanceSteps/Steps";

const MarkAttendancePage = () => {
  const { theme } = useTheme();
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [searchClass, setSearchClass] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = new Date();
  const formattedDate = formatDate(today);

  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
  });

  const searchClassForAttendance = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `${mainUrlApi.attendance.url}/${schoolId}/attendance/students?className=${searchData.className}&section=${searchData.section}`
      );
      if (response) {
        toast.success("Data fetched successfully");
        const sortedData = response?.data.sort((a, b) => a.rollNo - b.rollNo);
        setSearchClass(sortedData);
        setInitialized(false); // Reset initialization when new data is loaded
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    } finally {
      setLoading(false);
    }
  };

  const [attendanceData, setAttendanceData] = useState({});
  const [initialized, setInitialized] = useState(false);

  // Initialize attendance data with all roll numbers as "A"
  useEffect(() => {
    if (!initialized && searchClass.length > 0) {
      const initialAttendance = searchClass.reduce((acc, student) => {
        acc[student.rollNo] = "A"; // Default to "A"
        return acc;
      }, {});
      setAttendanceData(initialAttendance);
      setInitialized(true); // Ensure this runs only once per searchClass load
    }
  }, [searchClass, initialized]);

  const dataLength = searchClass?.length;

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = searchClass?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Update attendance status
  const toggleAttendanceStatus = (rollNo) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [rollNo]: prevData[rollNo] === "P" ? "A" : "P",
    }));
  };

  // Calculate attendance statistics
  const presentCount = Object.values(attendanceData).filter(
    (status) => status === "P"
  ).length;
  const absentCount = Object.values(attendanceData).filter(
    (status) => status === "A"
  ).length;
  const totalStudents = searchClass.length;
  const attendancePercentage =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const handleSaveAttendance = async () => {
    try {
      setSaveLoading(true);
      const response = await axios.post(
        `${mainUrlApi.attendance.url}/${schoolId}/attendance/record?className=${searchData.className}&section=${searchData.section}&attendanceDate=${formattedDate}`,
        attendanceData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success(response.data || "Attendance saved successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data || "Error saving attendance");
    } finally {
      setSaveLoading(false);
    }
  };

  // Mark all present or absent
  const markAllAs = (status) => {
    if (searchClass.length === 0) return;

    const newAttendanceData = {};
    searchClass.forEach((student) => {
      newAttendanceData[student.rollNo] = status;
    });

    setAttendanceData(newAttendanceData);
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
              Attendance Management
              <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
            </h1>
            <p className="mt-2 text-sm md:text-base opacity-80">
              Mark and manage daily student attendance
            </p>
          </div>
          <div>
            <TourButton
              steps={markAttendancePageSteps}
              tourName={"mark-attendance-page-tour"}
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
              Search Students
            </h2>

            <form
              onSubmit={searchClassForAttendance}
              className="flex flex-col sm:flex-row items-end gap-4"
            >
              <div className="w-full sm:w-auto">
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
                    className={`w-full sm:w-[180px] ${
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

              <div className="w-full sm:w-auto">
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
                    className={`w-full sm:w-[180px] ${
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

              <div className="w-full sm:w-auto">
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
                      Searching...
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
        {searchClass.length > 0 && (
          <div
            className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
              theme === "light"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
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
                  <UserCheck className="mr-2 h-5 w-5" />
                  Mark Attendance
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
                    {formattedDate}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-4 attendance-stats">
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
                    Present:
                  </span>
                  <span className={`ml-1 text-sm font-bold text-green-500`}>
                    {presentCount}/{totalStudents} ({attendancePercentage}%)
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 mark-all-buttons">
                <Button
                  onClick={() => markAllAs("P")}
                  variant="outline"
                  className={`text-xs ${
                    theme === "light"
                      ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Mark All Present
                </Button>
                <Button
                  onClick={() => markAllAs("A")}
                  variant="outline"
                  className={`text-xs ${
                    theme === "light"
                      ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Mark All Absent
                </Button>
                <Button
                  onClick={handleSaveAttendance}
                  disabled={saveLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {saveLoading ? (
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save All
                    </>
                  )}
                </Button>
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
                    {[
                      "S.No",
                      "Student Name",
                      "Roll No",
                      "Class (Section)",
                      "Status",
                      "Mark Attendance",
                    ].map((header, index) => (
                      <TableHead
                        key={index}
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-gray-200" : "text-gray-700"
                        } font-semibold text-sm text-left`}
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData?.map((item, index) => (
                    <TableRow
                      key={item.id || index}
                      className={`transition-colors hover:bg-opacity-10 ${
                        theme === "light"
                          ? "hover:bg-gray-600 border-t border-gray-700"
                          : "hover:bg-gray-100 border-t border-gray-200"
                      }`}
                    >
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 font-medium ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.studentName}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.rollNo}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.className} ({item.section})
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attendanceData[item.rollNo] === "P"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {attendanceData[item.rollNo] === "P"
                            ? "Present"
                            : "Absent"}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <ToggleButtonComponent
                          isOn={attendanceData[item.rollNo] === "P"}
                          onToggle={() => toggleAttendanceStatus(item.rollNo)}
                        />
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
            >
              <PaginationComponent
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalPages={totalPages}
                onRowsPerPageChange={setRowsPerPage}
                onPageChange={setCurrentPage}
                className={`${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && searchClass.length === 0 && (
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
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
                Select a class and section to mark attendance
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendancePage;
