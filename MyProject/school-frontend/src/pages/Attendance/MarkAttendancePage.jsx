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
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setSearchClass } from "@/utils/attendance/attendanceSlice";
import mainUrlApi from "@/common/main";

const MarkAttendancePage = () => {
  const { theme } = useTheme();
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  // const searchClass = useSelector((state) => state.attendance.searchClass) || [];

  const [searchClass, setSearchClass] = useState([]);

  // console.log("searchClass : ", searchClass);

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

  // console.log("searchData : ", searchData);

  const searchClassForAttendance = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${mainUrlApi.attendance.url}/attendance/students?className=${searchData.className}&section=${searchData.section}`
      );
      if (response) {
        // console.log("response : ", response);
        toast.success("Data fetched successfully");
        const sortedData = response.data.sort((a, b) => a.rollNo - b.rollNo);
        setSearchClass(sortedData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
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

  const dataLength = searchClass.length;
  // console.log("attendanceData : ", attendanceData);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = searchClass.slice(
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

  const handleSaveAttendance = async () => {
    try {
      // console.log("Attendance Data to Save:", attendanceData);
      // console.log("formattedDate : ", formattedDate);
      const response = await axios.post(`${mainUrlApi.attendance.url}/attendance/record?className=${searchData.className}&section=${searchData.section}&attendanceDate=${formattedDate} `, attendanceData,{
        headers: {
          "Content-Type": "application/json",
      }});
      if (response) {
      toast.success(response.data  ||"Attendance saved successfully!");
      }
     
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving attendance");
    }
  };

  return (
    <div
      className={`${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh]`}
    >
      {/* Search function */}
      <div
        className={`mt-6 flex items-center justify-start mx-4 sm:mx-14 gap-4 h-20 ${
          theme === "light" ? "bg-[#212121]" : "bg-white"
        }`}
      >
        <p className="text-2xl font-semibold ml-2 hidden sm:block">
          Search Attendance
        </p>
        <form onSubmit={searchClassForAttendance} className="flex items-center gap-2">
          <Select
            className="border-red-600 border "
            onValueChange={(value) =>
              setSearchData({ ...searchData, className: value })
            }
          >
            <SelectTrigger className="w-[180px] ">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>class</SelectLabel>
                {allClass.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {capitalizeFirstLetter(item)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            className="border-red-600 border "
            onValueChange={(value) =>
              setSearchData({ ...searchData, section: value })
            }
          >
            <SelectTrigger className="w-[180px] ">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>sections</SelectLabel>
                {allSection.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {capitalizeFirstLetter(item)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            type="submit"
            className="bg-[#452B90] hover:bg-[#c29732] mr-2"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Attendance Table */}
      <div
        className={`mt-4 border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
          theme === "light"
            ? "border-[rgba(193,193,193,0.3)] bg-[#212121]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Page Header Section */}
        <div
          className={`flex justify-between items-center p-3 sm:p-4 border-b-[1px] ${ 
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)]"
              : "border-slate-200"
          }`}
        >
          <span className="text-[1rem] sm:text-[1.5rem] font-bold">
            Give Today's Attendance
          </span>

          <div className="text-[1rem] sm:text-[1.5rem] font-bold">
            {formattedDate}
          </div>

          <div>
            <Button
              onClick={handleSaveAttendance}
              className="bg-[#452B90] hover:bg-[#c29732]"
            >
              Save All
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table className="table-auto w-full border-collapse border border-slate-200">
          <TableHeader
            className={`bg-gray-100 text-left ${
              theme === "light" ? "bg-[#212121]" : "light"
            }`}
          >
            <TableRow>
              {[
                "S.No",
                "Student Name",
                "Roll No",
                "Class (Section)",
                "Attendance",
                "Attendance Mark",
              ].map((header, index) => (
                <TableHead
                  key={index}
                  className={`px-4 py-2 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)] text-white"
                      : "border-slate-200 text-black"
                  } font-semibold`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.id}
                className={`hover:bg-gray-50 border ${
                  theme === "light"
                    ? "border-[rgba(193,193,193,0.3)]"
                    : "border-slate-200"
                }`}
              >
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {item.studentName}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {item.rollNo}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {item.className}({item.section})
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {attendanceData[item.rollNo] || "A"}
                </TableCell>
                <TableCell
                  className={`px-4 py-2 border text-left ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
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

        {/* Pagination Section */}
        <PaginationComponent
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          onRowsPerPageChange={setRowsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MarkAttendancePage;
