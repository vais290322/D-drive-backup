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
import { FaChevronDown, FaSearch, FaGraduationCap, FaArrowUp, FaUserGraduate, FaExclamationCircle } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setStudentInfo } from "@/utils/studentInformation/studentInfoSlice";
import mainUrlApi from "@/common/main";
import { motion } from "framer-motion";

const PromoteStudentPage = () => {
  const { theme } = useTheme();
  const [currentStudent, setCurrentStudent] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newSession, setNewSession] = useState("");

  const [newClassname, setNewClassname] = useState("");
  const [newsection, setNewsection] = useState("");
  const [newsession, setNewsession] = useState("");
  const [bulkPromotionDialogOpen, setBulkPromotionDialogOpen] = useState(false);
  const [bulkPromotionLoading, setBulkPromotionLoading] = useState(false);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [includePreviousDue, setIncludePreviousDue] = useState(false);

  const studentInfo =
    useSelector((state) => state.studentInfo.studentInfo) || [];
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);
  const schoolId = useSelector((state) => state.auth.schoolId);
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];

  // Search states
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [itemdata, setItemdata] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${mainUrlApi?.attendance?.url}/${schoolId}/attendance/students?className=${searchClass}&section=${searchSection}`
      );

      console.log("response from search student from promote student : ",response);

      if (response) {
        setFilteredData(response?.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    }
  };

  const handleStudentSelection = (admissionNumber) => {
    setSelectedStudents((prev) =>
      prev.includes(admissionNumber)
        ? prev.filter((id) => id !== admissionNumber)
        : [...prev, admissionNumber]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allAdmissionNumbers = paginatedData.map(
        (item) => item.admissionNumber
      );
      setSelectedStudents(allAdmissionNumbers);
    } else {
      setSelectedStudents([]);
    }
  };

  const editStudent = (e) => {
    e.preventDefault();

    const payload = {
      newClassName,
      newSection,
      newSession,
    };
   
    if(!newClassName || !newSection || !newSession) {
      toast.error("Please fill all the fields");
      return; 
    }
    setPromotionLoading(true); 

    const api = `${mainUrlApi?.admissioin.url}/${itemdata}/promote/${schoolId}`;
    axios
      .post(api, payload)
      .then((response) => {
        if (response) {
        toast.success(response.data.message);
        setPromotionLoading(false); 
        fetchStudentData();
        setNewClassName("");
        setNewSection("");
        setNewSession("");
        setSearchClass("");
        setSearchSection("");
        setSearchAdmissionNumber("");
        setDialogOpen(false); // Close the dialog
        setSelectedStudents([]);
        setFilteredData([]);
       
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error updating student");
      })
      .finally(() => {
        setPromotionLoading(false); // Set loading to false when done
      });
  };

  const dataLength = filteredData?.length;

  // for fetch the student data
  const fetchStudentData = async () => {
    try {
      const response = await axios.get(
        `${mainUrlApi.studentInfo.url}/${schoolId}`
      );

      if (response) {
        dispatch(setStudentInfo(response?.data?.data || []));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

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

  const handleSelectStudent = async (item) => {
    setCurrentStudent(item);
  };

  const headers = [
    "S.No",
    "Admission No",
    "Roll No",
    "Student Name",
    "Class(Section)",
    "Guardian Name",
    "Gender",
    "Action",
  ];

  if (["vais"].includes(role)) {
    headers.push("Action");
  }

  const bulkSubmit = async (e) => {
    e.preventDefault();

    if (paginatedData.length > 0 && selectedStudents.length > 0) {
      setBulkPromotionLoading(true); // Set loading to true when starting
      try {
        const payload = {
          newClassName: newClassname,
          newSection: newsection,
          newSession: newsession,
          currentClassName: paginatedData[0]?.className,
          currentSection: paginatedData[0]?.section,
          currentSession: paginatedData[0]?.academicYear,
          admissionNumbers: selectedStudents,
          includePreviousDue: includePreviousDue,
        };
        if(!newClassname || !newsection || !newsession) {
          toast.error("Please fill all the fields");
          return; 
        }

        const api = `${mainUrlApi?.admissioin?.url}/promote-bulk/${schoolId} `;
        const response = await axios.post(api, payload);
        if (response) {
          toast.success(response.data.message);
          setBulkPromotionDialogOpen(false); // Close the view dialog
          fetchStudentData();
          setSearchClass("");
          setNewClassname("");
          setSearchSection("");
          setNewsection("");
          setNewsession("");
          setFilteredData([]);
          setSelectedStudents([]);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error promoting students"
        );
      } finally {
        setBulkPromotionLoading(false); // Set loading to false when done
      }
    }
    else {
      toast.error(" Which you want to promoted class ? please select ckeckbox");
    }
  };

  return (
    <div className={`min-h-screen py-10 ${
      theme === "light" 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" 
        : "bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 text-gray-800"
    }`}>
      <div className={`container mx-auto max-w-7xl ${
        theme === "light"
          ? "bg-gray-800 border-2 border-gray-700"
          : "bg-white border-2 border-indigo-200"
      } rounded-3xl shadow-2xl p-6 md:p-10`}>
        
        {/* Header with Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
            theme === "light" ? "bg-indigo-700" : "bg-indigo-600"
          }`}>
            <FaGraduationCap className="text-white text-3xl" />
          </div>
          <h1 className={`text-2xl md:text-3xl font-extrabold ${
            theme === "light"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-300"
              : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-600 to-purple-600"
          } drop-shadow-lg`}>
            Student Promotion
          </h1>
        </div>
        
        {/* Search Controls */}
        <div className={`${
          theme === "light" ? "bg-gray-700" : "bg-indigo-50"
        } rounded-2xl p-6 mb-8 shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
            theme === "light" ? "text-blue-300" : "text-blue-700"
          }`}>
            <div className={`p-2 rounded-full ${
              theme === "light" ? "bg-blue-900" : "bg-blue-100"
            }`}>
              <FaSearch className={`${
                theme === "light" ? "text-blue-400" : "text-blue-500"
              }`} />
            </div>
            Search Students
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-auto">
              <label className={`block mb-2 font-medium ${
                theme === "light" ? "text-gray-300" : "text-indigo-700"
              }`}>
                Class
              </label>
              <div className="relative">
                <select
                  className={`w-full sm:w-64 px-4 py-3 rounded-lg ${
                    theme === "light" 
                      ? "bg-gray-600 border-gray-500 text-white focus:ring-indigo-500" 
                      : "border border-indigo-300 focus:ring-indigo-400 text-gray-800"
                  } focus:outline-none focus:ring-2 text-lg appearance-none pr-10`}
                  value={searchClass}
                  onChange={(e) => setSearchClass(e.target.value)}
                >
                  <option value="">Select Class</option>
                  {allClass.map((className, index) => (
                    <option key={index} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className={`block mb-2 font-medium ${
                theme === "light" ? "text-gray-300" : "text-indigo-700"
              }`}>
                Section
              </label>
              <div className="relative">
                <select
                  className={`w-full sm:w-64 px-4 py-3 rounded-lg ${
                    theme === "light" 
                      ? "bg-gray-600 border-gray-500 text-white focus:ring-indigo-500" 
                      : "border border-indigo-300 focus:ring-indigo-400 text-gray-800"
                  } focus:outline-none focus:ring-2 text-lg appearance-none pr-10`}
                  value={searchSection}
                  onChange={(e) => setSearchSection(e.target.value)}
                >
                  <option value="">Select Section</option>
                  {allSection.map((section, index) => (
                    <option key={index} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="w-full sm:w-auto mt-4 sm:mt-8">
              <Button
                onClick={handleSearch}
                className={`w-full sm:w-auto ${
                  theme === "light"
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
                } text-white font-bold px-8 py-3 rounded-lg shadow transition-all duration-200 flex items-center justify-center gap-2`}
              >
                <FaSearch /> Search
              </Button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className={`${
          theme === "light" ? "bg-gray-700" : "bg-white"
        } rounded-2xl shadow-lg p-6 transition-all duration-300`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${
              theme === "light" ? "text-blue-300" : "text-blue-700"
            }`}>
              <div className={`p-2 rounded-full ${
                theme === "light" ? "bg-blue-900" : "bg-blue-100"
              }`}>
                <FaUserGraduate className={`${
                  theme === "light" ? "text-blue-400" : "text-blue-500"
                }`} />
              </div>
              Student List
            </h2>
            
            {paginatedData.length > 0 && (
              <Dialog
                open={bulkPromotionDialogOpen}
                onOpenChange={setBulkPromotionDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className={`${
                      theme === "light"
                        ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                        : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    } text-white font-bold px-6 py-2 rounded-lg shadow transition-all duration-200 flex items-center justify-center gap-2`}
                  >
                    <FaArrowUp /> Bulk Promotion
                  </Button>
                </DialogTrigger>

                <DialogContent
                  className={`sm:max-w-[500px] ${
                    theme === "light" ? "bg-gray-800 text-white" : "bg-white"
                  }`}
                >
                  <DialogHeader>
                    <DialogTitle className={`text-xl font-bold ${
                      theme === "light" ? "text-white" : "text-gray-800"
                    }`}>
                      Bulk Student Promotion
                    </DialogTitle>
                  </DialogHeader>

                  <form className="mt-4">
                    <div className="grid gap-4 py-4 grid-cols-1">
                      <div className="relative w-full">
                        {/* New Class Name Select */}
                        <div className="mb-4">
                          <label className={`block mb-2 text-sm font-medium ${
                            theme === "light" ? "text-gray-300" : "text-gray-700"
                          }`}>
                            New Class
                          </label>
                          <select
                            className={`w-full px-4 py-2 rounded-md ${
                              theme === "light" 
                                ? "bg-gray-700 border-gray-600 text-white" 
                                : "bg-white border-gray-300 text-gray-800"
                            } border`}
                            onChange={(e) => setNewClassname(e.target.value)}
                            value={newClassname}
                            required
                          >
                            <option value="">Select Class</option>
                            {allClass.map((cls, index) => (
                              <option key={index} value={cls}>
                                {cls}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* New Section Select */}
                        <div className="mb-4">
                          <label className={`block mb-2 text-sm font-medium ${
                            theme === "light" ? "text-gray-300" : "text-gray-700"
                          }`}>
                            New Section
                          </label>
                          <select
                            className={`w-full px-4 py-2 rounded-md ${
                              theme === "light" 
                                ? "bg-gray-700 border-gray-600 text-white" 
                                : "bg-white border-gray-300 text-gray-800"
                            } border`}
                            onChange={(e) => setNewsection(e.target.value)}
                            value={newsection}
                            required
                          >
                            <option value="">Select Section</option>
                            {allSection.map((section, index) => (
                              <option key={index} value={section}>
                                {section}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* New Session Select */}
                        <div className="mb-4">
                          <label className={`block mb-2 text-sm font-medium ${
                            theme === "light" ? "text-gray-300" : "text-gray-700"
                          }`}>
                            New Session
                          </label>
                          <select
                            className={`w-full px-4 py-2 rounded-md ${
                              theme === "light" 
                                ? "bg-gray-700 border-gray-600 text-white" 
                                : "bg-white border-gray-300 text-gray-800"
                            } border`}
                            onChange={(e) => setNewsession(e.target.value)}
                            value={newsession}
                            required
                          >
                            <option value="">Select Session</option>
                            {/* Generate session options for current year and next 4 years */}
                            {Array.from({ length: 5 }).map((_, i) => {
                              const year = new Date().getFullYear() + i;
                              const session = `${year}-${year + 1}`;
                              return (
                                <option key={i} value={session}>
                                  {session}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="mb-4">
                          <div className={`p-4 rounded-lg ${
                            theme === "light" ? "bg-gray-700" : "bg-indigo-50"
                          }`}>
                            <div className="flex items-center justify-between">
                              <label className={`text-sm font-medium ${
                                theme === "light" ? "text-gray-300" : "text-gray-700"
                              }`}>
                                Include Previous Due
                              </label>
                              <button
                                type="button"
                                onClick={() => setIncludePreviousDue(!includePreviousDue)}
                                className={`${
                                  includePreviousDue
                                    ? "bg-indigo-600"
                                    : "bg-gray-200"
                                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                              >
                                <span className="sr-only">Include Previous Due</span>
                                <span
                                  className={`${
                                    includePreviousDue
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                />
                              </button>
                            </div>
                            <p className={`mt-2 text-xs ${
                              theme === "light" ? "text-gray-400" : "text-gray-500"
                            }`}>
                              If you want to promote students and there is no previous due, please make sure you check this option.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        type="submit"
                        className={`${
                          theme === "light"
                            ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                            : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
                        } text-white font-bold px-6 py-2 rounded-lg shadow transition-all duration-200`}
                        onClick={bulkSubmit}
                        disabled={bulkPromotionLoading}
                      >
                        {bulkPromotionLoading ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          </div>
                        ) : (
                          <>
                            <FaArrowUp className="mr-2" /> Promote Students
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl">
            <Table className={`w-full border ${
              theme === "light" ? "bg-gray-800 border-gray-600" : "bg-white border-indigo-200"
            }`}>
              <TableHeader className={`${
                theme === "light" 
                  ? "bg-gradient-to-r from-gray-700 to-gray-600" 
                  : "bg-gradient-to-r from-indigo-100 to-blue-100"
              }`}>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead
                      key={index}
                      className={`py-4 px-4 text-left ${
                        theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-indigo-200"
                      } border`}
                    >
                      {header === "S.No" ? (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              selectedStudents.length === paginatedData.length && paginatedData.length > 0
                            }
                            onChange={handleSelectAll}
                            className={`w-4 h-4 ${
                              theme === "light" 
                                ? "bg-gray-700 border-gray-600 text-indigo-600" 
                                : "bg-white border-gray-300 text-indigo-600"
                            } rounded focus:ring-indigo-500`}
                          />
                          <span className="ml-2">{header}</span>
                        </div>
                      ) : (
                        header
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData?.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <TableRow
                      key={item.id || index}
                      className={`${
                        theme === "light" 
                          ? index % 2 === 0 ? "bg-gray-800" : "bg-gray-750 hover:bg-gray-700" 
                          : index % 2 === 0 ? "bg-white" : "bg-indigo-50 hover:bg-indigo-100"
                      } transition-colors`}
                    >
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(item.admissionNumber)}
                            onChange={() => handleStudentSelection(item.admissionNumber)}
                            className={`w-4 h-4 ${
                              theme === "light" 
                                ? "bg-gray-700 border-gray-600 text-indigo-600" 
                                : "bg-white border-gray-300 text-indigo-600"
                            } rounded focus:ring-indigo-500`}
                          />
                          <span className="ml-2">
                            {(currentPage - 1) * rowsPerPage + index + 1}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.admissionNumber}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.rollNo}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                        } border font-medium`}
                      >
                        {item.studentName}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.className} ({item.section})
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.fatherName} / {item.motherName}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.gender}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light" ? "border-gray-600" : "border-indigo-200"
                        } border`}
                      >
                        <div className="flex justify-center items-center">
                          <Dialog
                            open={dialogOpen && itemdata === item.admissionNumber}
                            onOpenChange={(open) => {
                              setDialogOpen(open);
                              if (!open) setItemdata("");
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                className={`${
                                  theme === "light"
                                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                              } text-white font-bold px-4 py-2 rounded-lg shadow transition-all duration-200 flex items-center justify-center gap-2 text-sm`}
                              onClick={() => {
                                setItemdata(item.admissionNumber);
                              }}
                            >
                              <FaArrowUp className="text-xs" /> Promote
                            </Button>
                          </DialogTrigger>

                          <DialogContent
                            className={`sm:max-w-[500px] ${
                              theme === "light" ? "bg-gray-800 text-white" : "bg-white"
                            }`}
                          >
                            <DialogHeader>
                              <DialogTitle className={`text-xl font-bold ${
                                theme === "light" ? "text-white" : "text-gray-800"
                              }`}>
                                Promote Student
                              </DialogTitle>
                            </DialogHeader>

                            <form className="mt-4">
                              <div className="grid gap-4 py-4 grid-cols-1">
                                <div className="relative w-full">
                                  {/* New Class Name Select */}
                                  <div className="mb-4">
                                    <label className={`block mb-2 text-sm font-medium ${
                                      theme === "light" ? "text-gray-300" : "text-gray-700"
                                    }`}>
                                      New Class
                                    </label>
                                    <select
                                      className={`w-full px-4 py-2 rounded-md ${
                                        theme === "light" 
                                          ? "bg-gray-700 border-gray-600 text-white" 
                                          : "bg-white border-gray-300 text-gray-800"
                                      } border`}
                                      onChange={(e) => setNewClassName(e.target.value)}
                                      value={newClassName}
                                      required
                                    >
                                      <option value="">Select Class</option>
                                      {allClass.map((cls, index) => (
                                        <option key={index} value={cls}>
                                          {cls}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* New Section Select */}
                                  <div className="mb-4">
                                    <label className={`block mb-2 text-sm font-medium ${
                                      theme === "light" ? "text-gray-300" : "text-gray-700"
                                    }`}>
                                      New Section
                                    </label>
                                    <select
                                      className={`w-full px-4 py-2 rounded-md ${
                                        theme === "light" 
                                          ? "bg-gray-700 border-gray-600 text-white" 
                                          : "bg-white border-gray-300 text-gray-800"
                                      } border`}
                                      onChange={(e) => setNewSection(e.target.value)}
                                      value={newSection}
                                      required
                                    >
                                      <option value="">Select Section</option>
                                      {allSection.map((section, index) => (
                                        <option key={index} value={section}>
                                          {section}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* New Session Select */}
                                  <div className="mb-4">
                                    <label className={`block mb-2 text-sm font-medium ${
                                      theme === "light" ? "text-gray-300" : "text-gray-700"
                                    }`}>
                                      New Session
                                    </label>
                                    <select
                                      className={`w-full px-4 py-2 rounded-md ${
                                        theme === "light" 
                                          ? "bg-gray-700 border-gray-600 text-white" 
                                          : "bg-white border-gray-300 text-gray-800"
                                      } border`}
                                      onChange={(e) => setNewSession(e.target.value)}
                                      value={newSession}
                                      required
                                    >
                                      <option value="">Select Session</option>
                                      {/* Generate session options for current year and next 4 years */}
                                      {Array.from({ length: 5 }).map((_, i) => {
                                        const year = new Date().getFullYear() + i;
                                        const session = `${year}-${year + 1}`;
                                        return (
                                          <option key={i} value={session}>
                                            {session}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <DialogFooter className="mt-4">
                                <Button
                                  type="submit"
                                  className={`${
                                    theme === "light"
                                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                                      : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
                                  } text-white font-bold px-6 py-2 rounded-lg shadow transition-all duration-200`}
                                  onClick={editStudent}
                                  disabled={promotionLoading}
                                >
                                  {promotionLoading ? (
                                    <div className="flex items-center">
                                      <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                    </div>
                                  ) : (
                                    <>
                                      <FaArrowUp className="mr-2" /> Promote Student
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className={`py-10 text-center ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FaExclamationCircle className="text-5xl mb-4" />
                      <p className="text-xl font-medium">No students found</p>
                      <p className="mt-2">Try selecting different search criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {paginatedData.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className={`text-sm ${
                theme === "light" ? "text-gray-300" : "text-gray-700"
              }`}>
                Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, dataLength)} of {dataLength} entries
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <label className={`mr-2 text-sm ${
                    theme === "light" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Show:
                  </label>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                    className={`px-2 py-1 rounded ${
                      theme === "light" 
                        ? "bg-gray-700 text-white border-gray-600" 
                        : "bg-white text-gray-800 border-gray-300"
                    } border`}
                  >
                    {[5, 10, 25, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {filteredData.length === 0 && !paginatedData.length && (
          <div className={`flex flex-col items-center justify-center py-16 ${
            theme === "light" ? "text-gray-400" : "text-gray-500"
          }`}>
            <FaSearch className="text-5xl mb-4" />
            <p className="text-xl font-medium">Search for students to promote</p>
            <p className="mt-2">Select a class and section to view students</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default PromoteStudentPage;