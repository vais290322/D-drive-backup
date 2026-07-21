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
import {
  Download,
  Sparkles,
  Clock,
  AlertTriangle,
  Search,
  Eye,
  X,
} from "lucide-react";
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
import NewMarksheetComponent from "@/components/ForResult/NewMarksheetComponent";
import resultUrlApi from "@/common/result";
import mainUrlApi from "@/common/main";

const backendUrl = import.meta.env.VITE_REACT_BASE_URL_LOCAL;

const BASE_URL = `${backendUrl}/api/additionalSubjectMarkRegister`;

// ─── Grade helpers ───────────────────────────────────────────────────────────

/**
 * Given a percentage (0-100) and the gradeSystem array (each entry has
 * scaleStartMarks, scaleEndMarks, letterGrade, performanceIndicator),
 * returns the matching grade object or a default FAIL grade.
 */
const getGradeFromPercentage = (percentage, gradeSystem) => {
  console.log("percentage",percentage)
  console.log("gradeSystem",gradeSystem)
  if (!gradeSystem || gradeSystem.length === 0) {
    // Fallback default scale
    const defaults = [
      { min: 90, max: 100, letterGrade: "AA", performanceIndicator: "Outstanding" },
      { min: 80, max: 89,  letterGrade: "A+", performanceIndicator: "Excellent" },
      { min: 70, max: 79,  letterGrade: "A",  performanceIndicator: "Very Good" },
      { min: 60, max: 69,  letterGrade: "B+", performanceIndicator: "Good" },
      { min: 50, max: 59,  letterGrade: "B",  performanceIndicator: "Average" },
      { min: 40, max: 49,  letterGrade: "C",  performanceIndicator: "Below Average" },
      { min: 33, max: 39,  letterGrade: "D",  performanceIndicator: "Pass" },
      { min: 0,  max: 32,  letterGrade: "F",  performanceIndicator: "Fail" },
    ];
    const match = defaults.find((g) => percentage >= g.min && percentage <= g.max);
    return match || { letterGrade: "F", performanceIndicator: "Fail" };
  }

  // gradeSystem entries store integer-based percentage ranges (e.g. 35–44).
  // Floor the percentage so that 44.29 correctly matches the 35–44 bucket.
  const roundedPercentage = Math.floor(percentage);
  const match = gradeSystem.find((g) => {
    const start = parseFloat(g.scaleStartMarks);
    const end   = parseFloat(g.scaleEndMarks);
    return roundedPercentage >= start && roundedPercentage <= end;
  });

  return match
    ? { letterGrade: match.letterGrade, performanceIndicator: match.performanceIndicator }
    : { letterGrade: "F", performanceIndicator: "Fail" };
};

/**
 * Re-derives grade, result and overallGrade for one student entry.
 * Mutates nothing – returns a NEW student object.
 */
const recalculateMarksheet = (student, gradeSystem) => {
  if (!student || !student.subjects) return student;

  let totalObtained = 0;
  let totalFull     = 0;
  let anyFail       = false;

  const recalcSubjects = student.subjects.map((subj) => {
    const writtenFull  = parseFloat(subj.subjectFullMark)  || 0;
    const projectFull  = parseFloat(subj.projectFullMark)  || 0;
    const fullMarks    = writtenFull + projectFull;

    const writtenObt   = parseFloat(subj.writtenMarks)     || 0;
    const projectObt   = parseFloat(subj.projectMarks)     || 0;
    const marksObtained = writtenObt + projectObt;

    const percentage = fullMarks > 0 ? (marksObtained / fullMarks) * 100 : 0;
    const gradeInfo  = getGradeFromPercentage(percentage, gradeSystem);

    if (gradeInfo.letterGrade === "F") anyFail = true;

    totalObtained += marksObtained;
    totalFull     += fullMarks;

    return {
      ...subj,
      fullMarks,          // computed full marks
      marksObtained,      // computed marks obtained
      totalMarks: marksObtained,  // keep API field in sync
      percentage: parseFloat(percentage.toFixed(2)),
      grade: gradeInfo.letterGrade,
      performanceIndicator: gradeInfo.performanceIndicator,
    };
  });

  const overallPercentage = totalFull > 0 ? (totalObtained / totalFull) * 100 : 0;
  const overallGradeInfo  = getGradeFromPercentage(overallPercentage, gradeSystem);
  const result            = anyFail ? "F" : "P";

  return {
    ...student,
    subjects:        recalcSubjects,
    totalMarks:      totalObtained,
    overallGrade:    overallGradeInfo.letterGrade,
    result,
  };
};

const MarksheetPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const allClass = useSelector((state) => state.class.classNames);
  const allSection = useSelector((state) => state.section.sectionNames);
  const examTypeData = useSelector((state) => state.examType.examType) || [];
  const [gradeSystem, setGradeSystem] = useState([]);

  const role = useSelector((state) => state.auth.user);
  const userDetails = useSelector(state=>state.auth.userDetails);
  const instituteName = useSelector(state=>state.institute.institute);
    const [signaturePreview, setSignaturePreview] = useState(null);
  // console.log("role : ", userDetails,role );

  // console.log("grade system : ", gradeSystem)


  // Search state
  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
    examType: "",
  });

  // Results state
  const [marksheetData, setMarksheetData] = useState([]);
  const [publishMessage, setPublishMessage] = useState("");

  // additional marksheet data 
  const [additioinalMarksheetData,setAdditioinalMarksheetData] = useState([]);
  // console.log("all marks data : ",additioinalMarksheetData);

  // View state
  const [viewStudent, setViewStudent] = useState(null);
  // console.log("viewStudent : ",viewStudent);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const dataLength = marksheetData?.length;
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = marksheetData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // console.log("paginatedData : ",paginatedData);

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

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

  // Search for marksheets
    const searchMarkSheet = async (e) => {
      e.preventDefault();
      
      // Different validation for student vs other roles
      if (role === "student") {
        if (!searchData.examType) {
          toast.error("Please select exam type");
          return;
        }
      } else {
        if (!searchData.className || !searchData.section || !searchData.examType) {
          toast.error("Please select class, section and exam type");
          return;
        }
      }
      
      try {
        setLoading(true);
        setPublishMessage("");
        
        const targetClass = role === "student" ? userDetails.className : searchData.className;
        const targetExam = searchData.examType;

        let dateMsg = null;
        let showMarksheet = true;
        
        if (role === "student") {
          try {
            const dateRes = await axios.get(`${resultUrlApi.resultDate.search.url}/${schoolId}`, {
              params: {
                className: targetClass,
                examType: targetExam
              }
            });
            
            if (dateRes.data && dateRes.data.data && dateRes.data.data.length > 0) {
               const publishDateStr = dateRes.data.data[0].resultPublishDate;
               const publishDateObj = new Date(publishDateStr);
               const currentDate = new Date();
               
               // Strip times for accurate day comparison
               const pDateOnly = new Date(publishDateObj.getFullYear(), publishDateObj.getMonth(), publishDateObj.getDate());
               const cDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

               if (cDateOnly < pDateOnly) {
                  showMarksheet = false;
                  const diffTime = Math.abs(pDateOnly - cDateOnly);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const formattedDate = publishDateObj.toLocaleDateString('en-GB').replace(/\//g, "-");
                  dateMsg = `Result publish date : ${formattedDate}, ${diffDays} days remaining..`;
               }
            } else {
               showMarksheet = false;
               dateMsg = "Result publish date not added";
            }
          } catch (dateErr) {
             showMarksheet = false;
             dateMsg = "Result publish date not added";
          }
        }

        if (!showMarksheet) {
           setMarksheetData([]);
           setGradeSystem([]);
           setPublishMessage(dateMsg);
           return;
        }
        
        // Different API URL based on role
        const apiUrl = role === "student"
          ? `https://collage.vaisacademy.com/service6/api/marksheet/student/${schoolId}?className=${userDetails.className}&section=${userDetails.section}&examType=${searchData.examType}&roll=${userDetails?.rollNo}`
          : `https://collage.vaisacademy.com/service6/api/marksheet/class-section/${schoolId}?className=${searchData.className}&section=${searchData.section}&examType=${searchData.examType}`;

          const additionalApiUrl = role === "student"
            ? `${BASE_URL}/additionalMarksheetData?schoolId=${schoolId}&className=${userDetails.className}&section=${userDetails.section}&examType=${searchData.examType}`
            : `${BASE_URL}/additionalMarksheetData?schoolId=${schoolId}&className=${searchData.className}&section=${searchData.section}&examType=${searchData.examType}`;



        const response = await axios.get(apiUrl);
        const additionalResponse = await axios.get(additionalApiUrl);
        // console.log("additionalResponse : ", additionalResponse);
        if(additionalResponse.data.success){
          setAdditioinalMarksheetData(additionalResponse.data.data.markSheets);
        }
  
        if (
          response.data &&
          response.data.data &&
          response.data.data.markSheets
        ) {
          const scale = response.data.data.gradeScale || [];
          // Recalculate grades on the frontend using percentage-based scale
          const recalculated = response.data.data.markSheets.map((student) =>
            recalculateMarksheet(student, scale)
          );
          setMarksheetData(recalculated);
          setGradeSystem(scale);
          toast.success("Marksheet data retrieved successfully");
        } else {
          setMarksheetData([]);
          setGradeSystem([]);
          toast.info("No marksheet data found");
        }
      } catch (error) {
        // console.error("Error fetching marksheet data:", error);
        toast.error(
          error.response?.data?.message || "Error searching marksheet data"
        );
        setMarksheetData([]);
      } finally {
        setLoading(false);
      }
    };

  // View student details
  const handleViewStudent = (student) => {
    const additionalData = additioinalMarksheetData.find(
      (item) => item.roll == student.roll
    );

    // Merge additional subjects if present, then re-run grade calculation
    const merged = additionalData?.subjects?.length > 0
      ? { ...student, subjects: [...student.subjects, ...additionalData.subjects] }
      : student;

    // Recalculate with merged subjects (additional subjects may shift the overall grade)
    const studentData = recalculateMarksheet(merged, gradeSystem);

    setViewStudent(studentData);
  };

  // Close view modal
  const handleCloseView = () => {
    setViewStudent(null);
  };

  const handleGenerateMarksheet = (student) => {
    if (!student) {
      toast.error("Student data is missing");
      return;
    }

    const doc = new jsPDF();

    // Add border
    doc.setDrawColor(120, 81, 169);
    doc.setLineWidth(5);
    doc.rect(5, 5, 200, 287);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(120, 81, 169);
    doc.text(`${instituteName?.schoolName}`, 60, 20);

    doc.setFontSize(14);
    doc.text("MARKSHEET", 85, 30);

    doc.setDrawColor(120, 81, 169);
    doc.setLineWidth(1);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Student Details Section
    doc.text(`NAME : ${student.name}`, 20, 50);
    doc.text(`CLASS : ${student.class}`, 120, 50);
    doc.text(`SEC : ${student.section}`, 20, 60);
    doc.text(`ROLL NO : ${student.roll}`, 120, 60);
    doc.text(`EXAM : ${student.examType}`, 20, 70);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SUBJECT WISE MARKS", 70, 85);

    // Prepare subject data for table
    const subjectData = student.subjects.map((subject) => [
      subject.subject,
      subject.subjectFullMark,
      subject.writtenMarks.toString(),
      subject.projectFullMark,
      subject.projectMarks.toString(),
      subject.totalMarks.toString(),
      subject.grade,
    ]);

    // Marksheet Table
    doc.autoTable({
      startY: 90,
      head: [["SUBJECT","Subject's Full Marks", "WRITTEN", "Project's Full Marks", "PROJECT", "TOTAL", "GRADE"]],
      body: subjectData,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [120, 81, 169], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 230, 250] },
    });

    const finalY = doc.autoTable.previous.finalY + 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`ALL TOTAL : ${student.totalMarks}`, 20, finalY);
    doc.text(`GRADE : ${student.overallGrade}`, 90, finalY);
    doc.text(`RESULT : ${student.result}`, 160, finalY);

    // Signature Section
    const signatureY = finalY + 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CLASS TEACHER", 20, signatureY);
    doc.text("PARENT", 90, signatureY);
    doc.text("PRINCIPAL", 160, signatureY);

    // Grade scale table
    const gradeScale =
      gradeSystem.length > 0
        ? gradeSystem.map((grade) => [
            `${grade.scaleStartMarks}-${grade.scaleEndMarks}`,
            grade.letterGrade,
            grade.performanceIndicator,
          ])
        : [
            ["90-100", "O+", "OUTSTANDING"],
            ["80-89", "A+", "EXCELLENT"],
            ["70-79", "A", "VERY GOOD"],
            ["60-69", "B+", "GOOD"],
            ["50-59", "B", "AVERAGE"],
            ["40-49", "C", "BELOW AVERAGE"],
            ["<40", "F", "FAIL"],
          ];

    // Check if grade scale table will fit on current page, if not move to next page
    const pageHeight = doc.internal.pageSize.height;
    const gradeTableHeight = (gradeScale.length + 1) * 8; // Approximate height for header + rows
    const gradeStartY = signatureY + 15; // Start after signature section
    
    if (gradeStartY + gradeTableHeight > pageHeight - 40) {
      doc.addPage();
      var gradeTableStartY = 20;
    } else {
      var gradeTableStartY = gradeStartY;
    }

    doc.autoTable({
      startY: gradeTableStartY,
      head: [["GRADE SCALE", "GRADE", "PERFORMANCE"]],
      body: gradeScale,
      theme: "grid",
      styles: { fontSize: 10, fillColor: [242, 230, 255] },
      headStyles: { fillColor: [120, 81, 169], textColor: [255, 255, 255] },
    });

    // Get the final Y position after grade scale table
    const gradeTableFinalY = doc.autoTable.previous.finalY + 10;
    
    // Check if we need a new page for footer content
    // const pageHeight = doc.internal.pageSize.height;
    const requiredSpace = 40; // Space needed for footer content
    
    if (gradeTableFinalY + requiredSpace > pageHeight - 20) {
      doc.addPage();
      var currentY = 20; // Start from top of new page
    } else {
      var currentY = gradeTableFinalY;
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("KEEP NOTES:", 20, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(
      "P - for Successful Candidate\nF - for Unsuccessful Candidate",
      20,
      currentY + 5,
      { maxWidth: 170 }
    );

    // Open PDF in a new tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
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
        <div className="mb-6 flex justify-between">
          <div
            className={`${theme === "light" ? "text-white" : "text-gray-800"}`}
          >
            <h1 className="text-2xl md:text-3xl font-bold relative inline-block">
              Student Marksheets
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
            </h1>
            <p className="mt-2 text-sm md:text-base opacity-80">
              Generate and download student marksheets for different exams
            </p>
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
            className={`searchBox p-4 sm:p-6 border-b ${
              theme === "light" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                theme === "light" ? "text-white" : "text-gray-800"
              }`}
            >
              Search Marksheets
            </h2>



            <form
              onSubmit={searchMarkSheet}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            >
              {/* Class Dropdown - Only show for non-student roles */}
              {role !== "student" && (
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
              )}

              {/* Section Dropdown - Only show for non-student roles */}
              {role !== "student" && (
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
              )}

              {/* Exam Type Dropdown - Show for all roles */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "light" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Exam Type
                </label>
                <Select
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, examType: value })
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
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Exam Type</SelectLabel>
                      {examTypeData?.map((item, index) => (
                        <SelectItem key={index} value={item.examTypeName}>
                          {capitalizeFirstLetter(item.examTypeName)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
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
            <div className="registerAvailable mb-4 md:mb-0">
              <h2
                className={`text-xl font-bold ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                Marksheet Results
              </h2>
              <p
                className={`text-sm mt-1 ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {marksheetData?.length || 0} records found
              </p>
            </div>

            {marksheetData.length > 0 && (
              <div
                className={`px-4 py-2 rounded-lg ${
                  theme === "light" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <span
                  className={`font-medium ${
                    theme === "light" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Class:
                </span>
                <span
                  className={`ml-2 font-bold ${
                    theme === "light" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {searchData.className || userDetails?.className } ({searchData.section || userDetails?.section})
                </span>
                <span className={`mx-2 text-gray-500`}>|</span>
                <span
                  className={`font-medium ${
                    theme === "light" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Exam:
                </span>
                <span
                  className={`ml-2 font-bold ${
                    theme === "light" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {searchData.examType}
                </span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : publishMessage ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <svg
                className="w-16 h-16 mb-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p
                className={`text-xl font-bold ${
                  theme === "light" ? "text-purple-300" : "text-purple-600"
                }`}
              >
                {publishMessage}
              </p>
            </div>
          ) : marksheetData?.length === 0 ? (
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
                className={`text-lg font-medium ${
                  theme === "light" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No marksheet data found
              </p>
              <p
                className={`text-sm mt-2 ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Use the search form above to view student marksheets
              </p>
            </div>
          ) : (
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
                      "Roll No",
                      "Student Name",
                      "Class",
                      "Section",
                      "Total Marks",
                      // "Grade",
                      "Result",
                      "Actions",
                    ].map((header, index) => (
                      <TableHead
                        key={index}
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-gray-200" : "text-gray-700"
                        } font-semibold text-sm ${
                          header === "Actions" ? "text-right" : "text-left"
                        }`}
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData?.map((item, index) => (
                    <TableRow
                      key={index}
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
                        {item.roll}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.name}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.class}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.section}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                            parseInt(item.totalMarks) >= 80
                              ? "bg-green-100 text-green-800"
                              : parseInt(item.totalMarks) >= 60
                              ? "bg-blue-100 text-blue-800"
                              : parseInt(item.totalMarks) >= 40
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.totalMarks}
                        </span>
                      </TableCell>
                      {/* <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.overallGrade}
                        </span>
                      </TableCell> */}
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.result === "P"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.result === "P" ? "PASS" : "FAIL"}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 text-right ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${
                              theme === "light"
                                ? "border-gray-600 text-gray-600 hover:bg-gray-700"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                            onClick={() => handleViewStudent(item)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>

                          {/* <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
                            onClick={() => handleGenerateMarksheet(item)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button> */}
                          
                            <NewMarksheetComponent marksheetData={item} gradeSystem={gradeSystem} signaturePreview={signaturePreview} additionalMarksheetData={additioinalMarksheetData} />

                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination with improved styling */}
          {marksheetData?.length > 0 && (
            <div
              className={`p-4 border-t ${
                theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
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
          )}
        </div>
      </div>

      {/* View Student Modal */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div
            className={`relative w-full max-w-4xl rounded-lg shadow-xl overflow-hidden ${
              theme === "light"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`flex justify-between items-center p-4 border-b ${
                theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3 className="text-xl font-bold">Student Marksheet Details</h3>
              <button
                onClick={handleCloseView}
                className={`p-1 rounded-full hover:bg-opacity-10 ${
                  theme === "light" ? "hover:bg-gray-600" : "hover:bg-gray-200"
                }`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* Student Info */}
              <div
                className={`mb-6 p-4 rounded-lg ${
                  theme === "light" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Student Name
                    </h4>
                    <p className="text-lg font-semibold">{viewStudent.name}</p>
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Roll Number
                    </h4>
                    <p className="text-lg font-semibold">{viewStudent.roll}</p>
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Class & Section
                    </h4>
                    <p className="text-lg font-semibold">
                      {viewStudent.class} ({viewStudent.section})
                    </p>
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Exam Type
                    </h4>
                    <p className="text-lg font-semibold">
                      {viewStudent.examType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject Marks */}
              <h4 className="text-lg font-bold mb-4">Subject Marks</h4>
              <div className="overflow-x-auto mb-6">
                <table
                  className={`w-full border-collapse ${
                    theme === "light" ? "text-white" : "text-gray-800"
                  }`}
                >
                  <thead>
                    <tr
                      className={`${
                        theme === "light" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <th className="px-4 py-3 text-left">Subject</th>
                      <th className="px-4 py-3 text-center">Full Marks</th>
                      <th className="px-4 py-3 text-center">Written Marks</th>
                      <th className="px-4 py-3 text-center">Project Marks</th>
                      <th className="px-4 py-3 text-center">Total Marks</th>
                      <th className="px-4 py-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewStudent.subjects.map((subject, index) => {
                      const isFail = subject.grade === "F";
                      return (
                        <tr
                          key={index}
                          className={`border-t ${
                            theme === "light"
                              ? "border-gray-700"
                              : "border-gray-200"
                          } ${isFail ? "bg-red-900 bg-opacity-20" : ""}`}
                        >
                          <td className="px-4 py-3 font-medium">
                            {subject.subject}
                          </td>
                          {/* Full Marks = Written Full + Project Full */}
                          <td className="px-4 py-3 text-center">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium mb-1 text-green-300">
                                W: {subject.subjectFullMark ?? 0}
                              </span>
                              {parseFloat(subject.projectFullMark) > 0 && (
                                <span className="text-xs font-medium text-blue-300">
                                  P: {subject.projectFullMark}
                                </span>
                              )}
                              <span className="text-xs font-semibold text-yellow-300">
                                Total: {subject.fullMarks ?? (parseFloat(subject.subjectFullMark || 0) + parseFloat(subject.projectFullMark || 0))}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {subject.writtenMarks}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {subject.projectMarks}
                          </td>
                          {/* Marks Obtained = writtenMarks + projectMarks */}
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
                                isFail
                                  ? "bg-red-100 text-red-800"
                                  : subject.percentage >= 80
                                  ? "bg-green-100 text-green-800"
                                  : subject.percentage >= 60
                                  ? "bg-blue-100 text-blue-800"
                                  : subject.percentage >= 40
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {subject.marksObtained ?? subject.totalMarks}
                              {subject.percentage !== undefined && (
                                <span className="ml-1 text-xs opacity-70">({subject.percentage}%)</span>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isFail
                                  ? "bg-red-100 text-red-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {subject.grade || "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Result Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div
                  className={`p-4 rounded-lg ${
                    theme === "light" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <h4
                    className={`text-sm font-medium mb-1 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Total Marks
                  </h4>
                  <p className="text-2xl font-bold">{viewStudent.totalMarks}</p>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    theme === "light" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <h4
                    className={`text-sm font-medium mb-1 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Overall Grade
                  </h4>
                  <p className="text-2xl font-bold">
                    {viewStudent.overallGrade}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    theme === "light" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <h4
                    className={`text-sm font-medium mb-1 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Result
                  </h4>
                  <p
                    className={`text-2xl font-bold ${
                      viewStudent.result === "P"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {viewStudent.result === "P" ? "PASS" : "FAIL"}
                  </p>
                </div>
              </div>

              {/* Grade Scale */}
              <h4 className="text-lg font-bold mb-4">Grade Scale</h4>
              <div className="overflow-x-auto mb-6">
                <table
                  className={`w-full border-collapse ${
                    theme === "light" ? "text-white" : "text-gray-800"
                  }`}
                >
                  <thead>
                    <tr
                      className={`${
                        theme === "light" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <th className="px-4 py-3 text-left">Marks Range</th>
                      <th className="px-4 py-3 text-left">Grade</th>
                      <th className="px-4 py-3 text-left">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeSystem.length > 0
                      ? gradeSystem.map((grade, index) => (
                          <tr
                            key={index}
                            className={`border-t ${
                              theme === "light"
                                ? "border-gray-700"
                                : "border-gray-200"
                            }`}
                          >
                            <td className="px-4 py-2">{`${grade.scaleStartMarks}-${grade.scaleEndMarks}`}</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {grade.letterGrade}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              {grade.performanceIndicator}
                            </td>
                          </tr>
                        ))
                      : [
                          ["90-100", "O+", "OUTSTANDING"],
                          ["80-89", "A+", "EXCELLENT"],
                          ["70-79", "A", "VERY GOOD"],
                          ["60-69", "B+", "GOOD"],
                          ["50-59", "B", "AVERAGE"],
                          ["40-49", "C", "BELOW AVERAGE"],
                          ["<40", "F", "FAIL"],
                        ].map((grade, index) => (
                          <tr
                            key={index}
                            className={`border-t ${
                              theme === "light"
                                ? "border-gray-700"
                                : "border-gray-200"
                            }`}
                          >
                            <td className="px-4 py-2">{grade[0]}</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {grade[1]}
                              </span>
                            </td>
                            <td className="px-4 py-2">{grade[2]}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={`flex justify-end p-4 border-t ${
                theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <Button
                variant="outline"
                className={`mr-2 ${
                  theme === "light"
                    ? "border-gray-600 text-gray-600 hover:bg-gray-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                onClick={handleCloseView}
              >
                Close
              </Button>
              {/* <Button
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
                onClick={() => handleGenerateMarksheet(viewStudent)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksheetPage;