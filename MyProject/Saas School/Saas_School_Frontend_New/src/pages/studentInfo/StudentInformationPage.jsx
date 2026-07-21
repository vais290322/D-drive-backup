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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setStudentInfo } from "@/utils/studentInformation/studentInfoSlice";
import mainUrlApi, { accountApi } from "@/common/main";
import { motion } from "framer-motion";
import {
  EyeIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  HeartIcon,
  GraduationCapIcon,
  Loader2,
  Search,
  BookOpen,
  Users,
  FileText,
  Upload,
  DownloadIcon,
  RefreshCw,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TourButton from "@/components/Tour/TourButton";
import { studentInfoPageSteps } from "@/components/Tour/Steps/StudentinfoSteps/Steps";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import StudentInformationPDFComponent from "@/components/ForStudent/StudentInformationPDFComponent"
import { PDFDownloadLink } from "@react-pdf/renderer";
import { BlobProvider } from "@react-pdf/renderer";

const StudentInformationPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [currentStudent, setCurrentStudent] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [studentImage, setStudentImage] = useState(null);
  const [jointImage, setJointImage] = useState(null);
  const [studentImagePreview, setStudentImagePreview] = useState(null);
  const [jointImagePreview, setJointImagePreview] = useState(null);
  const [rollNoSort, setRollNoSort] = useState(true);
  const [editInput, setEditInput] = useState({
    studentName: "",
    gender: "",
    bloodGroup: "",
    religion: "",
    className: "",
    section: "",
    dob: "",
    academicYear: "",
    country: "",
    pinCode: "",
    state: "",
    district: "",
    policeStation: "",
    city: "",
    villagePost: "",
    phone: "",
    email: "",
    fatherName: "",
    motherName: "",
    rollNo: "",
  });

  // console.log("roll no sort : ", rollNoSort)

  //for pdf
  const [classFee, setClassFee] = useState(null);
  const [pdfFeeData, setPdfFeeData] = useState(null);
  const [pdfStudent, setPdfStudent] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfState, setPdfState] = useState({
    student: null,
    fee: null,
    ready: false,
  });

  const isDarkMode = theme === "light";

  const schooldetails = useSelector((state) => state.institute.institute);
  // console.log("school details : ",schooldetails)

  const studentInfo =
    useSelector((state) => state.studentInfo.studentInfo) || [];
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);
  const schoolId = useSelector((state) => state.auth.schoolId);

  // Search states
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];

  // Filtered Data
  const filteredData = studentInfo
    ?.filter((item) => {
      return (
        (searchClass === "" ||
          item?.className?.toLowerCase()?.includes(searchClass?.toLowerCase()) ||
          item?.rollNo?.toLowerCase()?.includes(searchClass?.toLowerCase())) &&
        (searchSection === "" ||
          item?.section?.toLowerCase()?.includes(searchSection?.toLowerCase())) &&
        (searchAdmissionNumber === "" ||
          item?.admissionNumber
            ?.toLowerCase()
            ?.includes(searchAdmissionNumber?.toLowerCase()) ||
          item?.studentName
            ?.toLowerCase()
            ?.includes(searchAdmissionNumber?.toLowerCase()))
      );
    })
    ?.sort((a, b) => {
      const rollA = Number(a?.rollNo) || 0;
      const rollB = Number(b?.rollNo) || 0;

      return rollNoSort ? rollA - rollB : rollB - rollA;
    });

  const dataLength = filteredData?.length;

  // for fetch the student data
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${mainUrlApi.studentInfo.url}/${schoolId}`
      );

      if (response) {
        dispatch(setStudentInfo(response?.data?.data || []));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch student data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchClassFeeStructure = async (className) => {
    if (!className || !schoolId) return null;

    try {
      const response = await axios.get(
        `${accountApi}/api/fees-structure/${className}/${schoolId}`,
      );

      return response?.data?.data || null;
    } catch (error) {
      console.error("Failed to fetch class fee structure", error);
      return null;
    }
  };

  const handlePdfClick = async (student) => {
    setPdfLoading(true);

    const feeData = await fetchClassFeeStructure(student.className);

    setPdfFeeData(feeData);
    setPdfStudent(student);

    setPdfLoading(false);
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const handleSelectStudent = (item) => {
    setCurrentStudent(item);
  };

  const handleEditClick = (student) => {
    setCurrentStudent(student);
    // console.log("current student : ",student);
    setEditInput({
      studentName: student.studentName || "",
      gender: student.gender || "",
      bloodGroup: student.bloodGroup || "",
      religion: student.religion || "",
      className: student.className || "",
      section: student.section || "",
      dob: student.dob || "",
      academicYear: student.academicYear || "",
      country: student.country || "",
      pinCode: student.pinCode || "",
      state: student.state || "",
      district: student.district || "",
      policeStation: student.policeStation || "",
      city: student.city || "",
      villagePost: student.villagePost || "",
      phone: student.phone || "",
      email: student.email || "",
      fatherName: student.fatherName || "",
      motherName: student.motherName || "",
      rollNo: student.rollNo || "",
    });
    setStudentImagePreview(student.studentImage);
    setJointImagePreview(student.jointImage);
    setEditDialogOpen(true);
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "student") {
      setStudentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (type === "joint") {
      setJointImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setJointImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const changeEventHandler = (e) => {
    setEditInput({
      ...editInput,
      [e.target.name]: e.target.value,
    });
  };

  const updateStudentData = async (e) => {
    e.preventDefault();

    if (!currentStudent?.id) {
      toast.error("Student ID not found");
      return;
    }

    try {
      setUpdateLoading(true);

      // Create FormData for file uploads
      const formData = new FormData();

      // Add all text fields
      Object.keys(editInput).forEach((key) => {
        formData.append(key, editInput[key]);
      });

      // Add images if they exist
      if (studentImage) {
        formData.append("studentImage", studentImage);
      }

      if (jointImage) {
        formData.append("jointImage", jointImage);
      }

      const response = await axios.put(
        `${mainUrlApi.studentInfo.url}/${currentStudent.admissionNumber}/${schoolId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        toast.success("Student information updated successfully!");

        // Update the local state
        const updatedStudentInfo = studentInfo.map((student) =>
          student.id === currentStudent.id
            ? {
              ...student,
              ...editInput,
              studentImage: studentImagePreview,
              jointImage: jointImagePreview,
            }
            : student
        );

        dispatch(setStudentInfo(updatedStudentInfo));
        setEditDialogOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update student information"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleExportExcel = async () => {
    const ExcelJS = (await import("exceljs")).default;
    const { saveAs } = await import("file-saver");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");

    // Define columns with beautiful headers
    worksheet.columns = [
      { header: "S.No", key: "sno", width: 8 },
      { header: "Admission No", key: "admissionNumber", width: 18 },
      { header: "Roll No", key: "rollNo", width: 12 },
      { header: "Student Name", key: "studentName", width: 22 },
      { header: "Class", key: "className", width: 10 },
      { header: "Section", key: "section", width: 10 },
      { header: "Guardian Name", key: "guardianName", width: 22 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Blood Group", key: "bloodGroup", width: 12 },
      { header: "Religion", key: "religion", width: 14 },
      { header: "DOB", key: "dob", width: 14 },
      { header: "Academic Year", key: "academicYear", width: 16 },
      { header: "Country", key: "country", width: 14 },
      { header: "Pin Code", key: "pinCode", width: 10 },
      { header: "State", key: "state", width: 14 },
      { header: "District", key: "district", width: 14 },
      { header: "Police Station", key: "policeStation", width: 16 },
      { header: "City", key: "city", width: 14 },
      { header: "Village/Post", key: "villagePost", width: 16 },
      { header: "Phone", key: "phone", width: 16 },
      { header: "Email", key: "email", width: 22 },
      { header: "Father's Name", key: "fatherName", width: 18 },
      { header: "Mother's Name", key: "motherName", width: 18 },
    ];

    // Add data rows
    (filteredData || []).forEach((item, idx) => {
      worksheet.addRow({
        sno: idx + 1,
        admissionNumber: item.admissionNumber || "",
        rollNo: item.rollNo || "",
        studentName: item.studentName || "",
        className: item.className || "",
        section: item.section || "",
        guardianName:
          item.guardianName || item.fatherName || item.motherName || "",
        gender: item.gender || "",
        bloodGroup: item.bloodGroup || "",
        religion: item.religion || "",
        dob: item.dob || "",
        academicYear: item.academicYear || "",
        country: item.country || "",
        pinCode: item.pincode || "",
        state: item.state || "",
        district: item.district || "",
        policeStation: item.policeStation || "",
        city: item.city || "",
        villagePost: item.villagePost || "",
        phone: item.phone || "",
        email: item.email || "",
        fatherName: item.fatherName || "",
        motherName: item.motherName || "",
      });
    });

    // Style header row
    worksheet.getRow(1).font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 13,
    };
    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF6254FFF" },
    };
    worksheet.getRow(1).border = {
      bottom: { style: "thick", color: { argb: "FF9333EA" } },
    };

    // Zebra striping for rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowNumber % 2 === 0 ? "FFF3F4F6" : "FFFFFFFF" },
        };
      }
      row.alignment = { vertical: "middle", horizontal: "left" };
      row.height = 22;
    });

    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "students.xlsx",
    );
  };

  const handlePdfDownload = async (student) => {
    try {
      setPdfState({ student: null, fee: null, ready: false });

      const feeData = await fetchClassFeeStructure(student.className);

      setPdfState({
        student,
        fee: feeData,
        ready: true,
      });
    } catch (err) {
      toast.error("Failed to prepare PDF");
    }
  };

  //reset
  const handleResetSearch = () => {
    setSearchClass("");
    setSearchSection("");
    setSearchAdmissionNumber("");
    setCurrentPage(1);
  };

  const headers = [
    "S.No",
    "Admission No",
    "Roll No",
    "Student Name",
    "Class(Section)",
    "Guardian Name",
    "Gender",
    "View",
  ];

  if (["vais", "edp", "admin"].includes(role)) {
    headers.push("Action");
  }

  // Updated select classes for consistent styling
  const selectTriggerClasses = `w-full px-3 py-2 ${isDarkMode
    ? "bg-[#0f172a] border-gray-700 text-white"
    : "bg-white border-gray-300 text-gray-900"
    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`;

  const selectContentClasses = isDarkMode
    ? "bg-[#1e293b] border border-gray-700 text-white"
    : "bg-white border border-gray-200";

  return (
    <div
      className={`${theme === "light"
        ? "bg-gray-900 text-white"
        : "bg-gray-50 text-gray-800"
        } font-poppins min-h-screen`}
    >
      <div className="container mx-auto py-6 px-4">
        {/* Page Header with Gradient */}
        <div className="mb-6 flex justify-between items-center">
          <div className=" ">
            <h1 className="text-2xl md:text-3xl font-bold relative inline-block">
              Student Information
              <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
            </h1>
            <p className="mt-2 text-sm md:text-base opacity-80">
              View and manage student records
            </p>
          </div>
          <div>
            <TourButton
              steps={studentInfoPageSteps}
              tourName={"StudentInfoTour"}
            />
          </div>
        </div>

        {/* Search Inputs */}
        <div
          className={`mb-6 p-4 rounded-xl shadow-md ${theme === "light" ? "bg-gray-800" : "bg-white"
            }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-auto">
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <Search className="w-5 h-5 mr-2 text-purple-500" />
                Search Students
              </h2>
            </div>
            <div className="searchBox flex flex-col sm:flex-row gap-3 w-full">
              <div
                className={`flex items-center rounded-md border px-3 ${theme === "light"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
                  }`}
              >
                <BookOpen
                  className={`h-4 w-4 mr-2 ${theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                />
                <Input
                  type="text"
                  placeholder="Search by class or roll no"
                  value={searchClass}
                  onChange={(e) => setSearchClass(e.target.value)}
                  className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${theme === "light"
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                    }`}
                />
              </div>
              <div
                className={`flex items-center rounded-md border px-3 ${theme === "light"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
                  }`}
              >
                <Users
                  className={`h-4 w-4 mr-2 ${theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                />
                <Input
                  type="text"
                  placeholder="Search by section"
                  value={searchSection}
                  onChange={(e) => setSearchSection(e.target.value)}
                  className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${theme === "light"
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                    }`}
                />
              </div>
              <div
                className={`flex items-center rounded-md border px-3 ${theme === "light"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
                  }`}
              >
                <FileText
                  className={`h-4 w-4 mr-2 ${theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                />
                <Input
                  type="text"
                  placeholder="Admission no or name"
                  value={searchAdmissionNumber}
                  onChange={(e) => setSearchAdmissionNumber(e.target.value)}
                  className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${theme === "light"
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                    }`}
                />
              </div>
              <button
                onClick={handleResetSearch}
                className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                type="button"
              >
                <RefreshCw className="mr-2 h-5 w-5 text-white" /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden ${theme === "light"
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
            }`}
        >
          {/* Card Header */}
          <div
            className={`flex justify-between items-center p-4 sm:p-6 border-b ${theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <div>
              <h2 className="studensAvailabe text-xl font-bold flex items-center">
                <UsersIcon className="mr-2 h-5 w-5 text-purple-500" />
                All Students
              </h2>
              <p
                className={`mt-1 text-sm ${theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {dataLength || 0} students found
              </p>
            </div>
            <button
              onClick={handleExportExcel}
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              type="button"
            >
              <DownloadIcon className="mr-2 h-5 w-5 text-white" /> Download Excel
            </button>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setRollNoSort((prev) => !prev)}
            >
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${rollNoSort ? "bg-blue-500" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${rollNoSort ? "translate-x-6" : "translate-x-0"
                    }`}
                />
              </div>

              <span className="select-none">
                Sort by roll no {rollNoSort ? "(Ascending)" : "(Descending)"}
              </span>
            </div>


          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="flex flex-col items-center">
                <Loader2
                  className={`h-12 w-12 animate-spin ${theme === "light" ? "text-purple-400" : "text-purple-600"
                    }`}
                />
                <p
                  className={`mt-4 ${theme === "light" ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  Loading students...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {!filteredData || filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <UsersIcon
                    className={`w-16 h-16 mb-4 ${theme === "light" ? "text-gray-400" : "text-gray-400"
                      }`}
                  />
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
                    Try adjusting your search criteria
                  </p>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader
                        className={`${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                          }`}
                      >
                        <TableRow>
                          {headers.map((header, index) => (
                            <TableHead
                              key={index}
                              className={`px-4 py-3 ${theme === "light"
                                ? "text-gray-200"
                                : "text-gray-700"
                                } font-semibold text-sm ${header === "Action" ? "text-right" : "text-left"
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
                            key={item.id}
                            className={`transition-colors hover:bg-opacity-10 ${theme === "light"
                              ? "hover:bg-gray-600 border-t border-gray-700"
                              : "hover:bg-gray-100 border-t border-gray-200"
                              }`}
                          >
                            <TableCell
                              className={`px-4 py-3 ${theme === "light"
                                ? "text-gray-300"
                                : "text-gray-600"
                                }`}
                            >
                              {(currentPage - 1) * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 font-medium ${theme === "light"
                                ? "text-white"
                                : "text-gray-800"
                                }`}
                            >
                              {item.admissionNumber}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${theme === "light"
                                ? "text-white"
                                : "text-gray-800"
                                }`}
                            >
                              {item.rollNo}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${theme === "light"
                                ? "text-white"
                                : "text-gray-800"
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                {item.studentImage && (
                                  <img
                                    src={item.studentImage}
                                    alt={item.studentName}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                )}
                                <span>{item.studentName}</span>
                              </div>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${theme === "light"
                                ? "text-white"
                                : "text-gray-800"
                                }`}
                            >
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${theme === "light"
                                  ? "bg-purple-900 text-purple-100"
                                  : "bg-purple-100 text-purple-800"
                                  }`}
                              >
                                {item.className} ({item.section})
                              </span>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${theme === "light"
                                ? "text-white"
                                : "text-gray-800"
                                }`}
                            >
                              {item.fatherName} / {item.motherName}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${theme === "light"
                                ? "text-white"
                                : "text-gray-800"
                                }`}
                            >
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.gender?.toLowerCase() === "male"
                                  ? theme === "light"
                                    ? "bg-blue-900 text-blue-100"
                                    : "bg-blue-100 text-blue-800"
                                  : theme === "light"
                                    ? "bg-pink-900 text-pink-100"
                                    : "bg-pink-100 text-pink-800"
                                  }`}
                              >
                                {item.gender}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${theme === "light"
                                ? "text-white"
                                : "text-gray-800"
                                }`}
                            >
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className={`viewButton ${theme === "light"
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : "bg-blue-500 hover:bg-blue-600"
                                      } text-white transition-colors`}
                                    onClick={() => handleSelectStudent(item)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  className={`p-0 overflow-hidden max-w-2xl ${theme === "light"
                                    ? "bg-gray-800 text-white border-gray-700"
                                    : "bg-white text-gray-800 border-gray-200"
                                    }`}
                                >
                                  <DialogHeader
                                    className={`p-6 border-b ${theme === "light"
                                      ? "border-gray-700"
                                      : "border-gray-200"
                                      }`}
                                  >
                                    <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                                      <UserIcon className="text-purple-500 w-6 h-6" />
                                      Student Details
                                    </DialogTitle>
                                  </DialogHeader>

                                  {currentStudent && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="p-6"
                                    >
                                      <div className="flex flex-col md:flex-row gap-6">
                                        {/* Left Column - Images */}
                                        <div className="md:w-1/3 flex flex-col items-center gap-4">
                                          {/* Student Image */}
                                          <div className="text-center">
                                            <div className="relative inline-block">
                                              <img
                                                src={
                                                  currentStudent?.studentImage ||
                                                  "https://via.placeholder.com/150"
                                                }
                                                alt="Student"
                                                className="w-32 h-32 rounded-full object-cover border-4 shadow-md"
                                                style={{
                                                  borderColor:
                                                    theme === "light"
                                                      ? "#4B5563"
                                                      : "#E5E7EB",
                                                }}
                                              />
                                              <div
                                                className={`absolute bottom-0 right-0 rounded-full p-1 ${theme === "light"
                                                  ? "bg-gray-700"
                                                  : "bg-white"
                                                  }`}
                                              >
                                                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                                  <UserIcon className="w-4 h-4" />
                                                </div>
                                              </div>
                                            </div>
                                            <h3 className="mt-3 font-semibold text-lg">
                                              {currentStudent?.studentName}
                                            </h3>
                                            <p
                                              className={`text-sm ${theme === "light"
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                                }`}
                                            >
                                              {currentStudent?.className} (
                                              {currentStudent?.section})
                                            </p>
                                          </div>

                                          {/* Parent Image */}
                                          {currentStudent?.jointImage && (
                                            <div className="text-center mt-4">
                                              <div className="relative inline-block">
                                                <img
                                                  src={
                                                    currentStudent?.jointImage
                                                  }
                                                  alt="Parent"
                                                  className="w-24 h-24 rounded-full object-cover border-2 shadow-md"
                                                  style={{
                                                    borderColor:
                                                      theme === "light"
                                                        ? "#4B5563"
                                                        : "#E5E7EB",
                                                  }}
                                                />
                                                <div
                                                  className={`absolute bottom-0 right-0 rounded-full p-1 ${theme === "light"
                                                    ? "bg-gray-700"
                                                    : "bg-white"
                                                    }`}
                                                >
                                                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                                    <UsersIcon className="w-3 h-3" />
                                                  </div>
                                                </div>
                                              </div>
                                              <p
                                                className={`text-sm mt-2 ${theme === "light"
                                                  ? "text-gray-400"
                                                  : "text-gray-500"
                                                  }`}
                                              >
                                                Parents
                                              </p>
                                            </div>
                                          )}
                                        </div>

                                        {/* Right Column - Details */}
                                        <div className="md:w-2/3">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InfoItem
                                              icon={
                                                <GraduationCapIcon className="w-5 h-5 text-purple-500" />
                                              }
                                              label="Admission No"
                                              value={
                                                currentStudent?.admissionNumber
                                              }
                                              theme={theme}
                                            />
                                            <InfoItem
                                              icon={
                                                <GraduationCapIcon className="w-5 h-5 text-purple-500" />
                                              }
                                              label="Admission Date"
                                              value={
                                                currentStudent?.admissionDate
                                              }
                                              theme={theme}
                                            />
                                            <InfoItem
                                              icon={
                                                <UserIcon className="w-5 h-5 text-purple-500" />
                                              }
                                              label="Roll No"
                                              value={currentStudent?.rollNo}
                                              theme={theme}
                                            />
                                            <InfoItem
                                              icon={
                                                <UserIcon className="w-5 h-5 text-purple-500" />
                                              }
                                              label="Academic Year"
                                              value={
                                                currentStudent?.academicYear
                                              }
                                              theme={theme}
                                            />
                                            <InfoItem
                                              icon={
                                                <CalendarIcon className="w-5 h-5 text-purple-500" />
                                              }
                                              label="Date of Birth"
                                              value={currentStudent?.dob}
                                              theme={theme}
                                            />
                                            <InfoItem
                                              icon={
                                                <UsersIcon className="w-5 h-5 text-purple-500" />
                                              }
                                              label="Father's Name"
                                              value={currentStudent?.fatherName}
                                              theme={theme}
                                            />
                                            <InfoItem
                                              icon={
                                                <UsersIcon className="w-5 h-5 text-purple-500" />
                                              }
                                              label="Mother's Name"
                                              value={currentStudent?.motherName}
                                              theme={theme}
                                            />
                                            <InfoItem
                                              icon={
                                                <UsersIcon className="w-5 h-5 text-purple-500" />
                                              }
                                              label="Gender"
                                              value={currentStudent?.gender}
                                              theme={theme}
                                            />
                                            <InfoItem
                                              icon={
                                                <HeartIcon className="w-5 h-5 text-purple-500" />
                                              }
                                              label="Blood Group"
                                              value={currentStudent?.bloodGroup}
                                              theme={theme}
                                            />
                                            <InfoItem
                                              icon={
                                                <PhoneIcon className="w-5 h-5 text-purple-500" />
                                              }
                                              label="Phone"
                                              value={currentStudent?.phone}
                                              theme={theme}
                                            />

                                            <InfoItem
                                              icon={
                                                <MailIcon className="w-5 h-5  text-purple-500" />
                                              }
                                              label="Email"
                                              value={currentStudent?.email}
                                              theme={theme}
                                            />
                                          </div>

                                          {/* Address Section */}
                                          <div
                                            className={`mt-6 p-4 rounded-lg ${theme === "light"
                                              ? "bg-gray-700"
                                              : "bg-gray-50"
                                              }`}
                                          >
                                            <h4 className="font-semibold mb-2 flex items-center">
                                              <MapPinIcon className="w-5 h-5 text-purple-500 mr-2" />
                                              Address Information
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                              <InfoItem
                                                label="City"
                                                value={currentStudent?.city}
                                                theme={theme}
                                                noIcon
                                              />
                                              <InfoItem
                                                label="State"
                                                value={currentStudent?.state}
                                                theme={theme}
                                                noIcon
                                              />
                                              <InfoItem
                                                label="District"
                                                value={currentStudent?.district}
                                                theme={theme}
                                                noIcon
                                              />
                                              <InfoItem
                                                label="Pin Code"
                                                value={currentStudent?.pinCode}
                                                theme={theme}
                                                noIcon
                                              />
                                              <InfoItem
                                                label="Village/Post"
                                                value={
                                                  currentStudent?.villagePost
                                                }
                                                theme={theme}
                                                noIcon
                                                colSpan={2}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>

                            {["vais", "edp", "admin"].includes(role) && (
                              <TableCell
                                className={`px-4 py-3 ${theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                                  }`}
                              >
                                <div className="flex justify-end items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className={`editButton ${theme === "light"
                                      ? "bg-amber-600 hover:bg-amber-700"
                                      : "bg-amber-500 hover:bg-amber-600"
                                      } text-white transition-colors`}
                                    onClick={() => handleEditClick(item)}
                                  >
                                    <FaEdit className="h-4 w-4" />
                                  </Button>

                                  {pdfStudent?.id === item.id ? (
                                    //  && pdfFeeData
                                    <PDFDownloadLink
                                      document={
                                        <StudentInformationPDFComponent
                                          student={item}
                                          schooldetails={schooldetails}
                                          classFee={pdfFeeData} // ✅ fee data passed
                                        />
                                      }
                                      fileName={`Student_${item.studentName || "Info"}.pdf`}
                                    >
                                      {({ loading }) => (
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                          disabled={loading}
                                          title="Download Student PDF"
                                        >
                                          {loading ? (
                                            "..."
                                          ) : (
                                            <FileText className="h-4 w-4" />
                                          )}
                                        </Button>
                                      )}
                                    </PDFDownloadLink>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                      onClick={() => handlePdfDownload(item)}
                                      title="Download Student PDF"
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                  )}

                                  {/* || role === "admin" */}
                                  {role === "vais" && (
                                    <DeleteComponent
                                      name={item?.studentName}
                                      deletePath={`${mainUrlApi.studentInfo.url}/${item.id}/${schoolId}`}
                                      onDelete={() => {
                                        const updatedData = studentInfo?.filter(
                                          (data) => data.id !== item.id
                                        );
                                        dispatch(setStudentInfo(updatedData));
                                      }}
                                      buttonClassName={`${theme === "light"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-red-500 hover:bg-red-600"
                                        } text-white transition-colors`}
                                    />
                                  )}
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {pdfState.ready && (
                    <BlobProvider
                      document={
                        <StudentInformationPDFComponent
                          student={pdfState.student}
                          schooldetails={schooldetails}
                          classFee={pdfState.fee}
                        />
                      }
                    >
                      {({ blob, loading }) => {
                        if (!loading && blob) {
                          saveAs(
                            blob,
                            `Admission_${pdfState.student.studentName || "Info"}.pdf`,
                          );

                          // reset after download
                          setTimeout(() => {
                            setPdfState({
                              student: null,
                              fee: null,
                              ready: false,
                            });
                          }, 0);
                        }
                        return null;
                      }}
                    </BlobProvider>
                  )}

                  {/* Pagination */}
                  <div
                    className={`p-4 border-t ${theme === "light" ? "border-gray-700" : "border-gray-200"
                      }`}
                  >
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      theme={theme}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className={`p-0 overflow-hidden max-w-3xl ${theme === "light"
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-gray-800 border-gray-200"
            }`}
        >
          <DialogHeader
            className={`p-6 border-b ${theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <FaEdit className="text-purple-500" />
              Edit Student Information
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={updateStudentData}
            className="overflow-y-auto max-h-[70vh]"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Images and Basic Info */}
                <div className="space-y-6">
                  {/* Student Image Upload */}
                  <div
                    className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  >
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <UserIcon className="w-5 h-5 mr-2 text-purple-500" />
                      Student Photo
                    </h3>

                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <img
                          src={
                            studentImagePreview ||
                            "https://via.placeholder.com/150?text=Student+Photo"
                          }
                          alt="Student Preview"
                          className="w-32 h-32 rounded-full object-cover border-4 shadow-md"
                          style={{
                            borderColor:
                              theme === "light" ? "#4B5563" : "#E5E7EB",
                          }}
                        />
                        <label
                          htmlFor="studentImage"
                          className={`absolute bottom-0 right-0 rounded-full p-1 cursor-pointer ${theme === "light" ? "bg-gray-700" : "bg-white"
                            }`}
                        >
                          <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-purple-600 transition-colors">
                            <Upload className="w-4 h-4" />
                          </div>
                        </label>
                      </div>

                      <input
                        type="file"
                        id="studentImage"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "student")}
                        className="hidden"
                      />

                      <Label
                        htmlFor="studentImage"
                        className={`text-sm cursor-pointer px-3 py-1 rounded-md ${theme === "light"
                          ? "bg-gray-600 hover:bg-gray-500"
                          : "bg-gray-200 hover:bg-gray-300"
                          } transition-colors`}
                      >
                        Choose Student Photo
                      </Label>
                    </div>
                  </div>

                  {/* Joint/Parent Image Upload */}
                  <div
                    className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  >
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <UsersIcon className="w-5 h-5 mr-2 text-purple-500" />
                      Parents Photo
                    </h3>

                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <img
                          src={
                            jointImagePreview ||
                            "https://via.placeholder.com/150?text=Parents+Photo"
                          }
                          alt="Parents Preview"
                          className="w-32 h-32 rounded-full object-cover border-4 shadow-md"
                          style={{
                            borderColor:
                              theme === "light" ? "#4B5563" : "#E5E7EB",
                          }}
                        />
                        <label
                          htmlFor="jointImage"
                          className={`absolute bottom-0 right-0 rounded-full p-1 cursor-pointer ${theme === "light" ? "bg-gray-700" : "bg-white"
                            }`}
                        >
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <Upload className="w-4 h-4" />
                          </div>
                        </label>
                      </div>

                      <input
                        type="file"
                        id="jointImage"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "joint")}
                        className="hidden"
                      />

                      <Label
                        htmlFor="jointImage"
                        className={`text-sm cursor-pointer px-3 py-1 rounded-md ${theme === "light"
                          ? "bg-gray-600 hover:bg-gray-500"
                          : "bg-gray-200 hover:bg-gray-300"
                          } transition-colors`}
                      >
                        Choose Parents Photo
                      </Label>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div
                    className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  >
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <UserIcon className="w-5 h-5 mr-2 text-purple-500" />
                      Basic Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="studentName" className="block mb-1">
                          Student Name
                        </Label>
                        <Input
                          id="studentName"
                          name="studentName"
                          value={editInput.studentName}
                          onChange={changeEventHandler}
                          className={`w-full ${theme === "light"
                            ? "bg-gray-600 border-gray-500"
                            : "bg-white border-gray-300"
                            }`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rollNo" className="block mb-1">
                          Roll No.
                        </Label>
                        <Input
                          id="rollNo"
                          name="rollNo"
                          value={editInput.rollNo}
                          onChange={changeEventHandler}
                          className={`w-full ${theme === "light"
                            ? "bg-gray-600 border-gray-500"
                            : "bg-white border-gray-300"
                            }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="gender" className="block mb-1">
                            Gender
                          </Label>
                          <select
                            id="gender"
                            name="gender"
                            value={editInput.gender}
                            onChange={changeEventHandler}
                            className={`w-full rounded-md px-3 py-2 ${theme === "light"
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                              }`}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="bloodGroup" className="block mb-1">
                            Blood Group
                          </Label>
                          <select
                            id="bloodGroup"
                            name="bloodGroup"
                            value={editInput.bloodGroup}
                            onChange={changeEventHandler}
                            className={`w-full rounded-md px-3 py-2 ${theme === "light"
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                              }`}
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="religion" className="block mb-1">
                          Religion
                        </Label>
                        <Input
                          id="religion"
                          name="religion"
                          value={editInput.religion}
                          onChange={changeEventHandler}
                          className={`w-full ${theme === "light"
                            ? "bg-gray-600 border-gray-500"
                            : "bg-white border-gray-300"
                            }`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="dob" className="block mb-1">
                          Date of Birth
                        </Label>
                        <Input
                          id="dob"
                          name="dob"
                          type="date"
                          value={editInput.dob}
                          onChange={changeEventHandler}
                          className={`w-full ${theme === "light"
                            ? "bg-gray-600 border-gray-500"
                            : "bg-white border-gray-300"
                            }`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="dob" className="block mb-1">
                          Academic Year
                        </Label>
                        <Input
                          id="academicYear"
                          name="academicYear"
                          type="academicYear"
                          value={editInput.academicYear}
                          onChange={changeEventHandler}
                          className={`w-full ${theme === "light"
                            ? "bg-gray-600 border-gray-500"
                            : "bg-white border-gray-300"
                            }`}
                        />
                      </div>



                    </div>
                  </div>
                </div>

                {/* Right Column - Academic, Contact, and Address */}
                <div className="space-y-6">
                  {/* Academic Information */}
                  <div
                    className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  >
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <GraduationCapIcon className="w-5 h-5 mr-2 text-purple-500" />
                      Academic Information
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Remove the input field for className and replace with properly configured Select */}
                        <div>
                          <Label htmlFor="className" className="block mb-1">
                            Class
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              changeEventHandler({
                                target: { name: "className", value }
                              })
                            }
                            value={editInput.className}
                          >
                            <SelectTrigger
                              className={`w-full ${theme === "light"
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                }`}
                            >
                              <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent className={`${theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200 text-gray-900"
                              }`}>
                              <SelectGroup>
                                <SelectLabel className={theme === "light" ? "text-gray-300" : ""}>
                                  Class
                                </SelectLabel>
                                {allClass?.map((item, index) => (
                                  <SelectItem
                                    key={index}
                                    value={item}
                                    className={
                                      theme === "light"
                                        ? "text-white hover:bg-slate-700"
                                        : ""
                                    }
                                  >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Replace the input field for section with a Select component */}
                        <div>
                          <Label htmlFor="section" className="block mb-1">
                            Section
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              changeEventHandler({
                                target: { name: "section", value }
                              })
                            }
                            value={editInput.section}
                          >
                            <SelectTrigger
                              className={`w-full ${theme === "light"
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                }`}
                            >
                              <SelectValue placeholder="Select a section" />
                            </SelectTrigger>
                            <SelectContent className={`${theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200 text-gray-900"
                              }`}>
                              <SelectGroup>
                                <SelectLabel className={theme === "light" ? "text-gray-300" : ""}>
                                  Section
                                </SelectLabel>
                                {allSection?.map((item, index) => (
                                  <SelectItem
                                    key={index}
                                    value={item}
                                    className={
                                      theme === "light"
                                        ? "text-white hover:bg-slate-700"
                                        : ""
                                    }
                                  >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div
                    className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  >
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <PhoneIcon className="w-5 h-5 mr-2 text-purple-500" />
                      Contact Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone" className="block mb-1">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={editInput.phone}
                          onChange={changeEventHandler}
                          className={`w-full ${theme === "light"
                            ? "bg-gray-600 border-gray-500"
                            : "bg-white border-gray-300"
                            }`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="block mb-1">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editInput.email}
                          onChange={changeEventHandler}
                          className={`w-full ${theme === "light"
                            ? "bg-gray-600 border-gray-500"
                            : "bg-white border-gray-300"
                            }`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="fatherName" className="block mb-1">
                          Father's Name
                        </Label>
                        <Input
                          id="fatherName"
                          name="fatherName"
                          value={editInput.fatherName}
                          onChange={changeEventHandler}
                          className={`w-full ${theme === "light"
                            ? "bg-gray-600 border-gray-500"
                            : "bg-white border-gray-300"
                            }`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="motherName" className="block mb-1">
                          Mother's Name
                        </Label>
                        <Input
                          id="motherName"
                          name="motherName"
                          value={editInput.motherName}
                          onChange={changeEventHandler}
                          className={`w-full ${theme === "light"
                            ? "bg-gray-600 border-gray-500"
                            : "bg-white border-gray-300"
                            }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div
                    className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                  >
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2 text-purple-500" />
                      Address Information
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="country" className="block mb-1">
                            Country
                          </Label>
                          <Input
                            id="country"
                            name="country"
                            value={editInput.country}
                            onChange={changeEventHandler}
                            className={`w-full ${theme === "light"
                              ? "bg-gray-600 border-gray-500"
                              : "bg-white border-gray-300"
                              }`}
                          />
                        </div>

                        <div>
                          <Label htmlFor="state" className="block mb-1">
                            State
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            value={editInput.state}
                            onChange={changeEventHandler}
                            className={`w-full ${theme === "light"
                              ? "bg-gray-600 border-gray-500"
                              : "bg-white border-gray-300"
                              }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="district" className="block mb-1">
                            District
                          </Label>
                          <Input
                            id="district"
                            name="district"
                            value={editInput.district}
                            onChange={changeEventHandler}
                            className={`w-full ${theme === "light"
                              ? "bg-gray-600 border-gray-500"
                              : "bg-white border-gray-300"
                              }`}
                          />
                        </div>

                        <div>
                          <Label htmlFor="city" className="block mb-1">
                            City
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={editInput.city}
                            onChange={changeEventHandler}
                            className={`w-full ${theme === "light"
                              ? "bg-gray-600 border-gray-500"
                              : "bg-white border-gray-300"
                              }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="policeStation" className="block mb-1">
                            Police Station
                          </Label>
                          <Input
                            id="policeStation"
                            name="policeStation"
                            value={editInput.policeStation}
                            onChange={changeEventHandler}
                            className={`w-full ${theme === "light"
                              ? "bg-gray-600 border-gray-500"
                              : "bg-white border-gray-300"
                              }`}
                          />
                        </div>

                        <div>
                          <Label htmlFor="pinCode" className="block mb-1">
                            Pin Code
                          </Label>
                          <Input
                            id="pinCode"
                            name="pinCode"
                            value={editInput.pinCode}
                            onChange={changeEventHandler}
                            className={`w-full ${theme === "light"
                              ? "bg-gray-600 border-gray-500"
                              : "bg-white border-gray-300"
                              }`}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="villagePost" className="block mb-1">
                          Village/Post
                        </Label>
                        <Input
                          id="villagePost"
                          name="villagePost"
                          value={editInput.villagePost}
                          onChange={changeEventHandler}
                          className={`w-full ${theme === "light"
                            ? "bg-gray-600 border-gray-500"
                            : "bg-white border-gray-300"
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter
              className={`p-4 border-t ${theme === "light" ? "border-gray-700" : "border-gray-200"
                }`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className={`${theme === "light"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateLoading}
                className={`${theme === "light"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-500 hover:bg-purple-600"
                  } text-white transition-colors`}
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Student"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for displaying student information
const InfoItem = ({ icon, label, value, theme, noIcon, colSpan }) => {
  return (
    <div className={colSpan ? `col-span-${colSpan}` : ""}>
      <div className={`flex items-start ${noIcon ? "pl-0" : "pl-1"}`}>
        {!noIcon && <div className="mr-2 mt-0.5">{icon}</div>}
        <div>
          <p
            className={`text-xs ${theme === "light" ? "text-gray-400" : "text-gray-500"
              }`}
          >
            {label}
          </p>
          <p className={`font-medium ${!value && "italic opacity-70"}`}>
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentInformationPage;
