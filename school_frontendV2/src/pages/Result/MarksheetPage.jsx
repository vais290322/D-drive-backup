import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PreviewOutlined } from "@mui/icons-material";
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

import jsPDF from "jspdf";
import "jspdf-autotable";
import { teacherRoutine } from "@/common/routines";

const MarksheetPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allClass = useSelector((state) => state.class.classNames);
  const allSection = useSelector((state) => state.section.sectionNames);
  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
    rollNo: "",
    studentName: "",
  });
  // table data
  const data = [
    {
      Admission_Id: "Sc1-2024-001",
      rollNo: "112",
      studentName: "ayan dey",
      classSectoin: "V (A)",
    },
  ];
  // console.log("data : ", data);
  const dataLength = data.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const searchMarkSheet = async (e) => {
    e.preventDefault();
    try {
      // console.log("searchData : ", searchData);
      const response = await axios.get(
        `${teacherRoutine}/api/v1/admit-card/search?className=${searchData.className}&section=${searchData.section}&rollNo=${searchData.rollNo}&studentName=${searchData.studentName}`
      );
      // console.log("response : ", response);

      if (response) {
        toast.success("Data fetched successfully");
        // const sortedData = response.data.sort((a, b) => a.rollNo - b.rollNo);
        // dispatch(setSearchClass(sortedData));
        // setSearchClass(sortedData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    }
  };

  const handleGenerateMarksheet = () => {
    const student = {
        name: "John Doe",
        section: "A",
        class: "One",
        school: "ABC Public School",
        rollNo: "12345",
        address: "123 Main Street, City",
        marksheet: [
            ["SUB-1", "85", "9", "94", "AA"],
            ["SUB-2", "88", "7", "95", "A+"],
            ["SUB-3", "80", "10", "90", "A"],
            ["SUB-4", "78", "8", "86", "B+"],
            ["SUB-5", "92", "9", "99", "AA"],
            ["SUB-5", "92", "9", "99", "AA"],
            ["SUB-5", "92", "9", "99", "AA"],
            ["SUB-5", "92", "9", "99", "AA"],
            ["SUB-5", "92", "9", "99", "AA"],
            ["SUB-5", "92", "9", "99", "AA"],
        ],
        gradeScale: [
          ["90-100", "AA", "OUTSTANDING"],
          ["80-89", "A+", "EXCELLENT"],
          ["60-79", "A", "VERY GOOD"],
          ["45-59", "B+", "GOOD"],
      ],

    };

    const doc = new jsPDF();

    // Add border
    doc.setDrawColor(120, 81, 169);
    doc.setLineWidth(5);
    doc.rect(5, 5, 200, 287);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(120, 81, 169);
    doc.text("ABC PUBLIC SCHOOL", 60, 20);
    
    doc.setFontSize(14);
    doc.text("MARKSHEET", 85, 30);
    
    doc.setDrawColor(120, 81, 169);
    doc.setLineWidth(1);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    // Student Details Section with more gap
    doc.text(`NAME : ${student.name}`, 20, 50);
    doc.text(`CLASS : ${student.class}`, 120, 50);
    doc.text(`SEC : ${student.section}`, 20, 60);
    doc.text(`ROLL NO : ${student.rollNo}`, 120, 60);

   
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SUBJECT WISE MARKS", 70, 75);

    // Marksheet Table
    doc.autoTable({
        startY: 80,
        head: [["SUBJECT", "WRITTEN (90)", "PROJECT (10)", "TOTAL (100)", "GRADE"]],
        body: student.marksheet,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [120, 81, 169], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 230, 250] },
    });

    const finalY = doc.autoTable.previous.finalY + 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ALL TOTAL : 658", 20, finalY);
    doc.text("GRADE : A+", 90, finalY);
    doc.text("RESULT : P", 160, finalY);

    doc.autoTable({
      startY: finalY + 10,
      head: [["GRADE SCALE", "GRADE", "PERFORMANCE"]],
      body: student.gradeScale,
      theme: "grid",
      styles: { fontSize: 10, fillColor: [242, 230, 255] },
      headStyles: { fillColor: [120, 81, 169], textColor: [255, 255, 255] },
  });

    doc.setFontSize(10);
    doc.text("KEEP NOTES:", 20, finalY + 60);
    doc.setFont("helvetica", "normal");
    doc.text(
        "P - for Successful Candidate\nComp - Compartmental Candidate\nX - for Unsuccessful Candidate",
        20, finalY + 65, { maxWidth: 170 }
    );

    // Footer Section
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CLASS TEACHER", 20, finalY + 100);
    doc.text("PARENT", 90, finalY + 100);
    doc.text("PRINCIPAL", 160, finalY + 100);

    // Open PDF in a new tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
};


const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh] `}
    >
      <div className={`  `}>
        {/* for search function  */}
        <div
          className={`mt-6 flex items-center justify-start mx-4 sm:mx-14 gap-4 h-20 ${
            theme === "light" ? "bg-[#212121]" : "bg-white"
          } `}
        >
          <p className="text-2xl font-semibold hidden sm:block ml-2">
            Search Marksheet{" "}
          </p>

          <button onClick={handleGenerateMarksheet} style={{ padding: "10px 20px", background: "purple", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Generate Marksheet</button>;


          <form
            onSubmit={searchMarkSheet}
            className="flex items-center gap-2 w-full"
          >
            <Select
              className="border-red-600 border "
              onValueChange={(value) =>
                setSearchData({ ...searchData, className: value })
              }
              required
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
              required
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
              type="text"
              placeholder="Search by roll no"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm"
            />
            <input
              type="text"
              placeholder="Search by student name"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm "
            />

            <Button
              type="submit"
              className="bg-[#452B90] hover:bg-[#c29732] mr-2"
            >
              Search
            </Button>
          </form>
        </div>

        {/* for table and add new class rooms */}
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
            <div>
              <span className="text-[1rem] sm:text-[1.5rem] font-bold">
                All Marksheet
              </span>
            </div>

            {/* <div>
              <Button
                className="bg-[#452B90] hover:bg-[#c29732]"
                onClick={editStudent}
              >
                <Download /> Download All
              </Button>
            </div> */}
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
                  // <div className="flex items-center space-x-2 ">
                  //   <Switch id="select All" />
                  // </div>,
                  "Admission Id",
                  "Roll No",
                  "Student Name",
                  "Class (Section)",
                  // "Preview",
                  "Download",
                ].map((header, index) => (
                  <TableHead
                    key={index}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold  ${
                      header === "Download" || header === "Preview"
                        ? "text-right"
                        : "text-left"
                    } ${header === "Preview" ? "hidden sm:table-cell" : ""} `}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow
                  key={index+1}
                  className={`hover:bg-gray-50 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  {/* <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <div className="flex items-center space-x-2 ">
                      <Switch id="select" />
                    </div>
                  </TableCell> */}

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.Admission_Id}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.rollNo}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.studentName}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.classSectoin}
                  </TableCell>
                  {/* for action  */}
                  {/* <TableCell
                    className={`px-4 py-2 border text-right ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } hidden sm:table-cell `}
                  >
                    <Button
                      className="bg-[#452B90] hover:bg-[#c29732]"
                      onClick={() => editStudent(item.id)}
                    >
                      <PreviewOutlined />{" "}
                      <span className="hidden sm:inline">Preview</span>
                    </Button>
                  </TableCell> */}

                  <TableCell
                    className={`px-4 py-2 border  text-right ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <Button
                      className="bg-[#452B90] hover:bg-[#c29732]"
                      onClick={() => editStudent(item.id)}
                    >
                      <Download />{" "}
                      <span className="hidden sm:inline">Download</span>
                    </Button>
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
            onRowsPerPageChange={handleRowsPerPageChange}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default MarksheetPage;
