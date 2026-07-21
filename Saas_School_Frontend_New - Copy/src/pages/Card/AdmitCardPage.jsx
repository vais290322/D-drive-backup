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
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PreviewRounded } from "@mui/icons-material";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Modal from "@/components/ForCard/ModalComponent";
import mainUrlApi from "@/common/main";
import jsPDF from "jspdf";
import "jspdf-autotable";
import routineUrlApi, { teacherRoutine } from "@/common/routines";

const AdmitCardPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allClass = useSelector((state) => state?.class?.classNames);
  const allSection = useSelector((state) => state?.section?.sectionNames);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const schoolInfo = useSelector((state) => state?.institute?.institute) || [];
  const examTypeData = useSelector((state) => state?.examType?.examType) || [];
  const [examType, setExamType] = useState("");
  const [examRoutine, setExamRoutine] = useState("");
  const [currentStudent, setCurrentStudent] = useState("");
  const schoolId=useSelector((state)=>state?.auth?.schoolId);
  
  // console.log("school : ",schoolInfo)

  // console.log("exam routine : ", examRoutine);
  // console.log("current student : ", currentStudent);



  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
  });

  const [searchClass, setSearchClass] = useState([]);

  
  const dataLength = searchClass.length;

  const searchClassForAdmitCard = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.get(
          `${mainUrlApi.searchAdmitCard.url}/${schoolId}/attendance/students?className=${searchData.className}&section=${searchData.section}`
        );
        if (response) {
          // console.log("response : ", response);
          toast.success("Data fetched successfully");
          const sortedData = response.data.sort((a, b) => a.rollNo - b.rollNo);
          // dispatch(setSearchClass(sortedData));
          setSearchClass(sortedData);

          // console.log("searchData : ", searchData, examType);
          const examData = await axios.get(
            `${routineUrlApi.getExamRoutine.url}/${schoolId}/search?className=${searchData.className}&examType=${examType}`
          );
          // console.log("dta : ", examData);
          if(examData){
            setExamRoutine(examData?.data?.data);
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error searching data");
      }
    }; 



  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = searchClass.slice(
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

 
  const downloadAdmitCard = async () => {
    const student = {
        name: currentStudent?.studentName || "karfa",
        section: currentStudent?.section || "",
        class: currentStudent?.className || "",
        school: schoolInfo?.schoolName || "",
        rollNo: currentStudent?.rollNo || "",
        admissionNumber: currentStudent?.admissionNumber || "",
        examType: examRoutine?.[0]?.examType || "N/A",
        examRoutine: examRoutine?.[0]?.subjects?.map((subject) => [
            subject.subjectName,
            subject.examDate,
            `${subject.startTime} - ${subject.endTime}`,
        ]) || [],
    };
  
    const doc = new jsPDF();
  
    // Add border
    doc.setDrawColor(110, 60, 140);
    doc.setLineWidth(5);
    doc.rect(5, 5, 200, 287);
  
    // Header Section school name address debabrata karfa
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(student.school, 105, 20, { align: "center" });
  
    doc.setFontSize(14);
    doc.text("ADMIT CARD", 105, 30, { align: "center" });
  
    doc.setFillColor(236, 233, 245);
    doc.rect(15, 45, 180, 35, "F");
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
  
    // Student Details Section
    doc.text(`NAME : ${student.name}`, 20, 55);
    doc.text(`SEC : ${student.section}`, 120, 55);
    doc.text(`CLASS : ${student.class}`, 20, 65);
    doc.text(`ROLL NO : ${student.rollNo}`, 120, 65);
    doc.text(`ADMISSION NUMBER : ${student.admissionNumber}`, 20, 75);
    doc.text(`Exam Type : ${student.examType}`, 120, 75);
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("EXAM ROUTINE", 80, 90);
  
    // Exam Routine Table
    doc.autoTable({
        startY: 100,
        head: [["SUBJECT", "EXAM DATE", "TIME"]],
        body: student.examRoutine,
        theme: "grid",
        styles: { fontSize: 10, fillColor: [236, 233, 245] },
        headStyles: { fillColor: [120, 81, 169], textColor: [255, 255, 255] },
    });
  
    // Footer Section
    const finalY = doc.autoTable.previous.finalY + 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("KEEP NOTES:", 20, finalY);
    doc.setFont("helvetica", "normal");
    const notes = [
        "1. Report at the exam center at least 30 minutes before the exam starts.",
        "2. Carry your Admit Card. Entry without it is not allowed.",
        "3. Bring necessary stationery; borrowing is prohibited.",
        "4. Mobile phones, smartwatches, and electronic devices are not allowed.",
        "5. Follow the dress code (if applicable).",
        "6. Any unfair practice will lead to immediate disqualification.",
        "7. Read the question paper instructions carefully before starting.",
        "8. In case of emergency, inform the invigilator immediately."
    ];
  
    let yPos = finalY + 10;
    notes.forEach(note => {
        doc.text(note, 20, yPos, { maxWidth: 170 });
        yPos += 7;
    });
  
    doc.text(
        "This is a system-generated admit card, no signature required.",
        50, yPos + 20, { maxWidth: 170 }
    );
  
    // Download PDF
    doc.save("Admit_Card.pdf");
  };

  const handleGenerateAdmitCard = () => {
    const student = {
        name: "John Doe",
        section: "A",
        class: "One",
        school: "ABC Public School",
        rollNo: "12345",
        address: "123 Main Street, City",
        examType: "Regular",
        examRoutine: [
            ["English", "20.02.25", "08:00 AM - 10:00 AM"],
            ["Bengali", "21.02.25", "10:00 AM - 12:00 PM"],
            ["Hindi", "22.02.25", "12:00 PM - 02:00 PM"],
            ["Hindi", "22.02.25", "12:00 PM - 02:00 PM"],
            ["Hindi", "22.02.25", "12:00 PM - 02:00 PM"],
            ["Hindi", "22.02.25", "12:00 PM - 02:00 PM"],
            ["Hindi", "22.02.25", "12:00 PM - 02:00 PM"],
        ],
    };

    const doc = new jsPDF();

    // Add border
    doc.setDrawColor(110, 60, 140);
    doc.setLineWidth(5);
    doc.rect(5, 5, 200, 287);

    // Header Section school name address
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(student.school, 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.text("ADMIT CARD", 105, 30, { align: "center" });

    doc.setFillColor(236, 233, 245);
    doc.rect(15, 45, 180, 35, "F");

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Student Details Section
    doc.text(`NAME : ${student.name}`, 20, 55);
    doc.text(`SEC : ${student.section}`, 120, 55);
    doc.text(`CLASS : ${student.class}`, 20, 65);
    doc.text(`ROLL NO : ${student.rollNo}`, 120, 65);
    doc.text(`ADDRESS : ${student.address}`, 20, 75);
    doc.text(`Exam Type : ${student.examType}`, 120, 75);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("EXAM ROUTINE", 80, 90);

    // Exam Routine Table
    doc.autoTable({
        startY: 100,
        head: [["SUBJECT", "EXAM DATE", "TIME"]],
        body: student.examRoutine,
        theme: "grid",
        styles: { fontSize: 10 , fillColor: [236, 233, 245]  },
        headStyles: { fillColor: [120, 81, 169], textColor: [255, 255, 255] },
    });

    // Footer Section
    const finalY = doc.autoTable.previous.finalY + 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("KEEP NOTES:", 20, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        20, finalY + 10, { maxWidth: 170 }
    );

    doc.text(
      "This is a system generated admit card  no signature required",
      50, finalY + 90, { maxWidth: 170 }
  );

    // Open PDF in a new tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
};

useEffect(() => {
  if (currentStudent) {
    downloadAdmitCard();
  }
}, [currentStudent]); 


  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh] min-h-screen md:h-auto `}
    >
      <div className={`  `}>
        {/* for search function  */}
        <div
          className={`mt-6 flex items-center justify-start mx-4 sm:mx-14 gap-4 h-20 ${
            theme === "light" ? "bg-[#212121]" : "bg-white"
          } `}
        >
          <p className="text-2xl font-semibold ml-2 hidden sm:block">
            Search Admit Card{" "}
          </p>
          
          <form
            onSubmit={searchClassForAdmitCard}
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

            <select
                id="examType"
                className=" border rounded p-2 mt-1"
                required
                value={examType}
                onChange={(e) =>
                  setExamType(e.target.value)
                }
              >
                <option value="" disabled>Select examType</option>
                {examTypeData?.map((item,index) => (
                  <option key={index} value={item.examTypeName}>
                    {item.examTypeName}
                  </option>
                ))}
              </select>

            {/* next version  */}
            {/* <input
              type="text"
              value={searchData.rollNo}
              onChange={(e) =>
                setSearchData({ ...searchData, rollNo: e.target.value })
              }
              placeholder="Search by roll no"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm"
            />
            <input
              type="text"
              value={searchData.studentName}
              onChange={(e) =>
                setSearchData({ ...searchData, studentName: e.target.value })
              }
              placeholder="Search by student name"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm"
            /> */}

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
                All Admit Card
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
                  "S.No",
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
                    } ${header === "Preview" && "hidden sm:table-cell"} `}
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
                  {/* next version  */}
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
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.admissionNumber}
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
                    {item.className} ({item.section})
                  </TableCell>
                  {/* for action  */}
                  {/* next version  */}
                  {/* <TableCell
                    className={`px-4 py-2 border text-right ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } hidden sm:table-cell `}
                  >
                    <Button
                      className="bg-[#452B90] hover:bg-[#c29732]"
                      onClick={() => handlePreviewClick(item.id)}
                    >
                      <PreviewRounded /> Preview
                    </Button>
                  </TableCell> */}

                  <TableCell
                    className={`px-4 py-2 border text-right ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <Button
                      className="bg-[#452B90] hover:bg-[#c29732]"
                      onClick={(e) =>{
                        setCurrentStudent(item);
                      }}
                    >
                      <Download /> Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/*  Modal for Previewing the PDF next version */}
          {/* <Modal isOpen={isPreviewOpen} onClose={closePreview}>
            <div style={{ height: "100%" }}>
              {selectedPdf && (
                <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.15.349/pdf.worker.min.js">
                  <Viewer fileUrl={selectedPdf} />
                </Worker>
              )}
            </div>
          </Modal> */}

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

export default AdmitCardPage;
