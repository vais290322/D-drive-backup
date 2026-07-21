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
import { Download } from "lucide-react";
import DateTableComponent from "@/components/ForAttendance/DateTableComponent";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import mainUrlApi from "@/common/main";

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
  // console.log("attendanceData : ", attendanceData);


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

  // console.log("searchData : ", searchData);

  const dataLength = attendanceData.length;

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = attendanceData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const fetchAttendanceReport = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `${mainUrlApi.attendance.url}/attendance/student-attendance1?className=${searchData.className}&section=${searchData.section}&month=${searchData.month}`
      );
      // console.log("response : ", response);
      if (response) {
        setLoading(false);
        setAttendanceData(response.data);
        toast.success(response.data.message || "Data fetched successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch the data");
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

  return (
    <div
      className={`${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh]`}
    >
      <div>
        {/* Search and month selection */}
        <div
          className={`mt-6 flex items-center justify-start mx-4 sm:mx-14 gap-4 h-20 ${
            theme === "light" ? "bg-[#212121]" : "bg-white"
          }`}
        >
          <p className="text-2xl font-semibold ml-2 hidden sm:block ">
            Search Attendance
          </p>
          <form
            onSubmit={fetchAttendanceReport}
            className="flex items-center gap-2 w-full"
          >
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

            <input
              type="month"
              onChange={handleMonthChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm"
            />
            <Button className="bg-[#452B90] hover:bg-[#c29732]">Search</Button>
          </form>
        </div>

        {/* Table and download section */}
        <div
          className={`mt-4 border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)] bg-[#212121]"
              : "border-slate-200 bg-white"
          }`}
           id="forpdf"
        >
          {/* Page Header Section */}
          <div
            className={` flex justify-between items-center p-3 sm:p-4 border-b-[1px] ${
              theme === "light"
                ? "border-[rgba(193,193,193,0.3)]"
                : "border-slate-200"
            }`} 
           
          >
            <div>
              <span className="text-[1rem] sm:text-[1.5rem] font-bold">
                Attendance Report
              </span>
            </div>
            <div>
              <span className="text-[1rem] sm:text-[1.5rem] font-bold">
                {showMonth} - {showYear}
              </span>
            </div>
            <div className="download-button">
              <Button onClick={downloadPDF} className="bg-[#452B90] hover:bg-[#c29732] flex items-center gap-2">
                <Download  /> <span>Download All</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          <Table className="table-auto w-full border-collapse border border-slate-200"  >
            <TableHeader
              className={`bg-gray-100 text-left ${
                theme === "light" ? "bg-[#212121]" : "light"
              }`}
            >
              <TableRow>
                {[
                  "Roll No",
                  // "Student Name",
                  <DateTableComponent month={month} year={year} />,
                  "Present Count",
                  "Absent Count",
                ].map((header, index) => (
                  <TableHead
                    key={index}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold  ${
                      header === "Download" ? "text-right" : "text-left"
                    }`}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.map((item) => (
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
                    } `}
                  >
                    {item.rollNo}
                  </TableCell>
                  {/* next version  */}
                  {/* <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.studentName}
                  </TableCell> */}
                  <TableCell
                    className={`py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {/* Render attendance for each date */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${dates.length}, 1fr)`,
                        gap: "8px",
                        padding: "4px 0",
                      }}
                    >
                      {Object.keys(item.attendance).map((date) => (
                        <span
                          key={date}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "5px",
                            // border: "1px solid #ccc", // Optional: Border to define the cell
                            minWidth: "30px", // Ensures all cells have the same width
                            textAlign: "center",

                            color:
                              item.attendance[date] === "P"
                                ? "green"
                                : item.attendance[date] === "A"
                                ? "red"
                                : item.attendance[date] === "S"
                                ? "blue"
                                : item.attendance[date] === "-"
                                ? "purple"
                                : "transparent",
                          }}
                        >
                          {item.attendance[date]}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {Object.values(item.attendance).filter(
                      (status) => status === "P"
                    ).length}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {Object.values(item.attendance).filter(
                      (status) => status === "A"
                    ).length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Section */}
          <div  id="pagination-component">  
          <PaginationComponent
           
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            onRowsPerPageChange={handleRowsPerPageChange}
            onPageChange={setCurrentPage}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportPage;
