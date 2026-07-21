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
import { Download, Search, Archive } from "lucide-react";
import { TbFileReport } from "react-icons/tb";
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
import "@react-pdf-viewer/core/lib/styles/index.css";
import mainUrlApi from "@/common/main";
import jsPDF from "jspdf";
import "jspdf-autotable";
import routineUrlApi from "@/common/routines";
import TourButton from "@/components/Tour/TourButton";
import { admitCardPageSteps } from "@/components/Tour/Steps/CardSteps/Steps";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


const AdmitCardPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const allClass = useSelector((state) => state?.class?.classNames);
  const allSection = useSelector((state) => state?.section?.sectionNames);
  const schoolInfo = useSelector((state) => state?.institute?.institute) || [];
  const examTypeData = useSelector((state) => state?.examType?.examType) || [];
  const [examType, setExamType] = useState("");
  const [examRoutine, setExamRoutine] = useState([]);
  const [currentStudent, setCurrentStudent] = useState("");
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [signaturePreview, setSignaturePreview] = useState(null);

  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
  });

  // console.log("schoolInfo : ", signaturePreview, schoolInfo.schoolLogo)

  const [searchClass, setSearchClass] = useState([]);

  const dataLength = searchClass.length;

  const searchClassForAdmitCard = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `${mainUrlApi.searchAdmitCard.url}/${schoolId}/attendance/students?className=${searchData.className}&section=${searchData.section}`
      );
      if (response) {
        toast.success("Data fetched successfully");
        const sortedData = response.data.sort((a, b) => a.rollNo - b.rollNo);
        setSearchClass(sortedData);

        const examData = await axios.get(
          `${routineUrlApi.getExamRoutine.url}/${schoolId}/search?className=${searchData.className}&examType=${examType}`
        );
        if (examData) {
          setExamRoutine(examData?.data?.data || []);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    } finally {
      setLoading(false);
    }
  };


  // Headmaster Signature Photo Functions
  const fetchHeadmasterSignature = async () => {
    try {
      const response = await axios.get(
        `${mainUrlApi.headmasterSignaturePhoto.url}/${schoolId}`
      );
      // console.log("response : ", response)
      if (response?.data?.success && response?.data?.data) {

        setSignaturePreview(response.data.data.photo.fileUrl);
      }
    } catch (error) {
      // Don't show error toast if signature doesn't exist (it's optional)
      if (error?.response?.status !== 404) {
        console.error("Error fetching headmaster signature:", error);
      }
    }
  };
  useEffect(() => {
    fetchHeadmasterSignature();
  }, [schoolId]);


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


  const formatTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Function to generate a single admit card PDF
  const generateAdmitCardPDF =  (studentData) => {
    const student = {
      name: studentData?.studentName || "Student",
      section: studentData?.section || "",
      class: studentData?.className || "",
      school: schoolInfo?.schoolName || "",
      schoolLogo: schoolInfo?.schoolLogo || "",
      schoolEmail: schoolInfo?.schoolEmail || "",
      schoolPhone: schoolInfo?.schoolPhone || "",
      rollNo: studentData?.rollNo || "",
      admissionNumber: studentData?.admissionNumber || "",
      examType: examRoutine?.[0]?.examType || "N/A",
      examRoutine:
        examRoutine?.[0]?.subjects?.sort((a, b) => new Date(a.examDate) - new Date(b.examDate)).map((subject) => [
          subject.subjectName,
          `${new Date(subject.examDate).toLocaleDateString("en-GB")} (${new Date(subject.examDate).toLocaleDateString("en-US", { weekday: "long" })})`,
          `${formatTo12Hour(subject.startTime)} - ${formatTo12Hour(subject.endTime)}` || "N/A",
        ]) || [],
      invigilator: " ",
    };

    const doc = new jsPDF();

    // Add border
    doc.setDrawColor(110, 60, 140);
    doc.setLineWidth(5);
    doc.rect(5, 5, 200, 287);

    // Header Section school name address debabrata karfa
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.addImage(student.schoolLogo, "PNG", 10, 10, 30, 30);
    doc.text(student.school, 105, 13, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Email: ${student.schoolEmail}`, 105, 18, { align: "center" });
    doc.text(`Phone: ${student.schoolPhone}`, 105, 23, { align: "center" });

    doc.setFontSize(14);
    doc.text("ADMIT CARD", 105, 30, { align: "center" });

    doc.setFillColor(236, 233, 245);
    doc.rect(15, 40, 180, 35, "F");

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Student Details Section
    doc.text(`NAME : ${student.name}`, 20, 50);
    doc.text(`SEC : ${student.section}`, 120, 50);
    doc.text(`CLASS : ${student.class}`, 20, 60);
    doc.text(`ROLL NO : ${student.rollNo}`, 120, 60);
    doc.text(`ADMISSION NUMBER : ${student.admissionNumber}`, 20, 70);
    doc.text(`Exam Type : ${student.examType}`, 120, 70);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("EXAM ROUTINE", 80, 85);

    // Exam Routine Table
    doc.autoTable({
      startY: 90,
      head: [["SUBJECT", "EXAM DATE", "TIME", "Invigilator's Signature"]],
      body: student.examRoutine,
      theme: "grid",
      styles: { fontSize: 10, fillColor: [236, 233, 245] },
      headStyles: { fillColor: [120, 81, 169], textColor: [255, 255, 255] },
    });

    // Footer Section
    const finalY = doc.autoTable.previous.finalY + 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("KEEP NOTES:", 20, finalY);
    doc.setFont("helvetica", "normal");
    const notes = [
      "1. Report at the exam center at least 30 minutes before the exam starts.",
      "2. Carry your Admit Card. Entry without it is not allowed.",
      "3. Bring necessary stationery; borrowing is prohibited.",
      "4. Mobile phones, smartwatches, and electronic devices are not allowed.",
      "5. Follow the dress code.",
      "6. Any unfair practice will lead to immediate disqualification.",
      "7. Read the question paper instructions carefully before starting.",
      "8. In case of emergency, inform the invigilator immediately.",
    ];

    let yPos = finalY + 10;
    notes.forEach((note) => {
      doc.text(note, 20, yPos, { maxWidth: 170 });
      yPos += 7;
    });

    doc.text(
      "This is a system-generated admit card, no signature required.",
      20,
      yPos + 10,
      { maxWidth: 170 },
    );

    doc.addImage(signaturePreview, "PNG", 130, yPos + 10, 60, 10);

    doc.setLineWidth(0.5)
    doc.line(130, yPos + 20, 190, yPos + 20,);
    doc.text("Headmaster", 160, yPos + 26, { align: "center" });
    doc.text(`${student.school}`, 160, yPos + 30, { align: "center" });

    return doc.output('blob');
  };

  const downloadAdmitCard = async () => {
    try {
      if (!currentStudent || !examRoutine || examRoutine.length === 0) {
        toast.error("Cannot generate admit card. Missing student or exam data.");
        return;
      }

      const pdfBlob = generateAdmitCardPDF(currentStudent);
      const fileName = `Admit_Card_${currentStudent.studentName.replace(/\s+/g, '_')}_${currentStudent.rollNo}.pdf`;
      saveAs(pdfBlob, fileName);

      // Reset current student after download
      setTimeout(() => {
        setCurrentStudent("");
      }, 500);
    } catch (error) {
      console.error("Error generating admit card:", error);
      toast.error("Failed to generate admit card. Please try again.");
    }
  };

  // Function to download all admit cards as a zip file
  const downloadAllAdmitCards = async () => {
    try {
      setBulkDownloading(true);

      // Create a new JSZip instance
      const zip = new JSZip();

      // Create a folder for the admit cards
      const admitCardsFolder = zip.folder("admit_cards");

      // Generate PDFs for each student and add to zip
      const totalStudents = searchClass.length;
      let processedCount = 0;

      // Show initial toast
      const toastId = toast.loading(`Preparing admit cards (0/${totalStudents})...`);

      // Process students in batches to avoid browser freezing
      const batchSize = 5;
      for (let i = 0; i < searchClass.length; i += batchSize) {
        const batch = searchClass.slice(i, i + batchSize);

        // Process each student in the current batch
        for (const student of batch) {
          const pdfBlob = generateAdmitCardPDF(student);
          const fileName = `Admit_Card_${student.studentName.replace(/\s+/g, '_')}_${student.rollNo}.pdf`;
          admitCardsFolder.file(fileName, pdfBlob);

          processedCount++;
          // Update toast message every 5 students or at the end
          if (processedCount % 5 === 0 || processedCount === totalStudents) {
            toast.loading(`Preparing admit cards (${processedCount}/${totalStudents})...`, {
              id: toastId,
            });
          }
        }

        // Small delay to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Generate the zip file
      toast.loading("Generating zip file...", { id: toastId });
      const zipContent = await zip.generateAsync({ type: "blob" });

      // Create a download link for the zip file
      const zipFileName = `Admit_Cards_${searchData.className}_${searchData.section}_${examType.replace(/\s+/g, '_')}.zip`;
      saveAs(zipContent, zipFileName);

      toast.success("All admit cards downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error generating bulk admit cards:", error);
      toast.error("Failed to generate admit cards. Please try again.");
    } finally {
      setBulkDownloading(false);
    }
  };

  useEffect(() => {
    if (currentStudent && examRoutine && examRoutine.length > 0) {
      downloadAdmitCard();
    }
  }, [currentStudent]);

  return (
    <div
      className={`min-h-screen ${theme === "light"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-800"
        }`}
    >
      <div className="container mx-auto py-8 px-4">
        {/* Page Header with Gradient */}
        <div
          className={`mb-6 ${theme === "light" ? "text-white" : "text-gray-800"
            }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold relative inline-block">
                Admit Card Management
                <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
              </h1>
              <p className="mt-2 text-sm md:text-base opacity-80">
                Generate and download student admit cards for exams
              </p>
            </div>
            <div className="flex items-center h-full">
              <TourButton steps={admitCardPageSteps} tourName="admit_card" />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div
          className={`mb-6 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${theme === "light"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
            }`}
        >
          <div
            className={`p-4 sm:p-6 border-b ${theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${theme === "light" ? "text-white" : "text-gray-800"
                }`}
            >
              Search Students
            </h2>

            <form
              onSubmit={searchClassForAdmitCard}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-gray-300" : "text-gray-700"
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
                    className={`w-full ${theme === "light"
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
                  className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-gray-300" : "text-gray-700"
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
                    className={`w-full ${theme === "light"
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
                  className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Exam Type
                </label>
                <Select onValueChange={(value) => setExamType(value)} required>
                  <SelectTrigger
                    className={`w-full ${theme === "light"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white"
                      }`}
                  >
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Exam Type</SelectLabel>
                      {examTypeData?.map((item, index) => (
                        <SelectItem key={index} value={item.examTypeName}>
                          {item.examTypeName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
        <div
          className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${theme === "light"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
            }`}
        >
          {/* Card Header */}
          <div
            className={`flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-b ${theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <div className="mb-4 sm:mb-0">
              <h2
                className={`text-xl font-bold flex items-center ${theme === "light" ? "text-white" : "text-gray-800"
                  }`}
              >
                <TbFileReport className="mr-2 h-5 w-5" />
                Student Admit Cards
              </h2>
              <p
                className={`text-sm mt-1 ${theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {searchClass?.length || 0} students found
              </p>
            </div>

            {searchClass.length > 0 && (
              // In the Card Header section, modify the buttons to only show when examRoutine length > 0
              <div className="flex flex-col sm:flex-row gap-3">
                <div
                  className={`px-4 py-2 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                >
                  <span
                    className={`font-medium ${theme === "light" ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Class:
                  </span>
                  <span
                    className={`ml-2 font-bold ${theme === "light" ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {searchData.className} ({searchData.section})
                  </span>
                  <span className={`mx-2 text-gray-500`}>|</span>
                  <span
                    className={`font-medium ${theme === "light" ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Exam:
                  </span>
                  <span
                    className={`ml-2 font-bold ${theme === "light" ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {examType}
                  </span>
                </div>

                {/* Only show Bulk Download Button if examRoutine length > 0 */}
                {examRoutine.length > 0 && (
                  <Button
                    onClick={downloadAllAdmitCards}
                    disabled={bulkDownloading || searchClass.length === 0}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {bulkDownloading ? (
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
                        Processing...
                      </>
                    ) : (
                      <>
                        <Archive className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Download All as ZIP</span>
                        <span className="sm:hidden">Bulk</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : searchClass?.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <p
                className={`text-lg font-medium ${theme === "light" ? "text-red-600 bg-yellow-200 px-1" : "text-red-600 bg-yellow-200 px-1"
                  }`}
              >
                Please create your exam routine for this class, section and exam type first
              </p>
              <p
                className={`text-lg font-medium ${theme === "light" ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                No students found
              </p>
              <p
                className={`text-sm mt-2 ${theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Select a class, section, and exam type to view students
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader
                  className={`${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                >
                  <TableRow>
                    {[
                      "S.No",
                      "Admission ID",
                      "Roll No",
                      "Student Name",
                      "Class (Section)",
                      "Action",
                    ].map((header, index) => (
                      <TableHead
                        key={index}
                        className={`px-4 py-3 ${theme === "light" ? "text-gray-200" : "text-gray-700"
                          } font-semibold text-sm ${header === "Action" ? "text-right" : "text-left"
                          }`}
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((student, index) => (
                    <TableRow
                      key={student.id || index}
                      className={`${theme === "light"
                          ? "border-gray-700 hover:bg-gray-700/50"
                          : "border-gray-200 hover:bg-gray-100/50"
                        }`}
                    >
                      <TableCell
                        className={`px-4 py-3 ${theme === "light" ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${theme === "light" ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        {student.admissionNumber}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${theme === "light" ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        {student.rollNo}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 font-medium ${theme === "light" ? "text-white" : "text-gray-900"
                          }`}
                      >
                        {student.studentName}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${theme === "light" ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        {student.className} ({student.section})
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 text-right ${theme === "light" ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        {examRoutine.length > 0 ? (
                          <Button
                            onClick={() => setCurrentStudent(student)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-500">No exam data</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination with improved styling */}
          {searchClass?.length > 0 && (
            <div
              className={`p-4 border-t ${theme === "light" ? "border-gray-700" : "border-gray-200"
                }`}
            >
              <PaginationComponent
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalPages={totalPages}
                onRowsPerPageChange={handleRowsPerPageChange}
                onPageChange={setCurrentPage}
                className={`${theme === "light" ? "text-white" : "text-gray-800"
                  }`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmitCardPage;
