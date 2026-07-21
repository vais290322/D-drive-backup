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
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { Button } from "@/components/ui/button";
import AddNewExamRoutines from "@/components/ForRoutines/AddNewExamRoutines";
import { Calendar, Download, FileText, Loader2, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setExamRoutine } from "@/utils/routines/examRoutineSlice";
import UpdateExamRoutine from "@/components/ForRoutines/UpdateExamRoutine";
import routineUrlApi from "@/common/routines";
import resultUrlApi from "@/common/result";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ExamRoutinesPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const examRoutines =
    useSelector((state) => state.examRoutine.examRoutine) || [];
  const dispatch = useDispatch();
  const allClass = useSelector((state) => state.class.classNames);
  const [searchData, setSearchData] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const examTypeData = useSelector((state) => state?.examType?.examType) || [];
  const [examType, setExamType] = useState("");
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const dataLength = examRoutines.length;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchData || !examType) {
      toast.error("Please select both class and exam type");
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.get(
        `${routineUrlApi.getExamRoutine.url}/${schoolId}/search?className=${searchData}&examType=${examType}`
      );
      if (response) {
        dispatch(setExamRoutine(response?.data?.data));
        setHasSearched(true);
        if (response.data.data.length === 0) {
          toast.info("No exam routines found for the selected criteria");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch data");
    } finally {
      setIsSearching(false);
    }
  };

  const downloadExamRoutine = async (e) => {
    e.preventDefault();
    if (!searchData || !examType) {
      toast.error("Please select both class and exam type before downloading");
      return;
    }

    try {
      const response = await axios.get(
        `${routineUrlApi.getExamRoutine.url}/${schoolId}/search/download?className=${searchData}&examType=${examType}`,
        {
          responseType: "blob",
        }
      );

      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `exam_routine_${searchData}_${examType}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        toast.success("Exam routine downloaded successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Search before downloading");
    }
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = examRoutines.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const capitalizeFirstLetter = (str) =>
    str?.charAt(0).toUpperCase() + str.slice(1);



  const isDarkMode = theme === "light";
  const bgColor = isDarkMode ? "bg-[#0f172a]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const borderColor = isDarkMode ? "border-[rgba(193,193,193,0.2)]" : "border-slate-200";


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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300 font-poppins`}>
      {/* Search Section */}
      <div className={`mt-4 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
        }`}>
        <div className={`p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
          }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
              <Search className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Search Exam Routines</h2>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-auto">
              <Select
                onValueChange={(value) => setSearchData(value)}
              >
                <SelectTrigger className={`w-full sm:w-[180px] ${isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white'}`}>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : ''}>
                  <SelectGroup>
                    <SelectLabel>Class</SelectLabel>
                    {allClass.map((className, index) => (
                      <SelectItem key={index} value={className}>
                        {capitalizeFirstLetter(className)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <Select
                onValueChange={(value) => setExamType(value)}
              >
                <SelectTrigger className={`w-full sm:w-[180px] ${isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white'}`}>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : ''}>
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

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="submit"
                className={`${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white flex-1 sm:flex-none`}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>

              <Button
                className={`${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white flex-1 sm:flex-none`}
                onClick={downloadExamRoutine}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Exam Routines Table Section */}
      <div className={`mt-6 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
        }`}>
        {/* Page Header Section */}
        <div className={`flex justify-between items-center p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
              <Calendar className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Exam Routines
              {searchData && examType && (
                <span className={`ml-2 text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ({capitalizeFirstLetter(searchData)} - {examType})
                </span>
              )}
            </h2>
          </div>

          {["edp", "admin", "vais"].includes(role) && (
            <div>
              <AddNewExamRoutines />
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-lg">Loading exam routines...</span>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              {!hasSearched ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText className={`h-16 w-16 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    No Exam Routines Displayed
                  </h3>
                  <p className={`max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Please select a class and exam type above and click search to view exam routines.
                  </p>
                </div>
              ) : examRoutines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Calendar className={`h-16 w-16 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    No Exam Routines Found
                  </h3>
                  <p className={`max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    There are no exam routines available for {capitalizeFirstLetter(searchData)} - {examType}.
                  </p>
                </div>
              ) : (
                <Table className="w-full">
                  <TableHeader className={`${isDarkMode ? 'bg-[#1e293b]/80' : 'bg-gray-50'} sticky top-0 z-10`}>
                    <TableRow>
                      <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                        S.No
                      </TableHead>
                      <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                        Class
                      </TableHead>
                      <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                        Exam Type
                      </TableHead>
                      <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                        Subject
                      </TableHead>
                      <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                        Exam Date
                      </TableHead>
                      <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider text-center `}>
                        Time
                      </TableHead>
                      <TableHead className={`px-4 py-3 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedData.map((classItem, classIndex) =>
                      classItem.subjects.map((subject, subjectIndex) => (
                        <TableRow
                          key={`${classItem.id}-${subjectIndex}`}
                          className={`transition-colors ${isDarkMode
                              ? 'hover:bg-[#1e293b]/70 border-[rgba(193,193,193,0.2)]'
                              : 'hover:bg-purple-50/30 border-slate-200'
                            }`}
                        >
                          {/* S.No */}
                          <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                              }`}>
                              {(currentPage - 1) * rowsPerPage + classIndex + subjectIndex + 1}
                            </span>
                          </TableCell>

                          {/* Class Name */}
                          <TableCell className={`px-4 py-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {capitalizeFirstLetter(classItem.className)}
                          </TableCell>

                          {/* Exam Type */}
                          <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800'
                              }`}>
                              {classItem?.examType}
                            </span>
                          </TableCell>

                          {/* Subject Name */}
                          <TableCell className={`px-4 py-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {subject.subjectName}
                          </TableCell>

                          {/* Exam Date */}
                          <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                              }`}>
                              {new Date(subject.examDate).toLocaleDateString("en-GB")}
                            </span>
                          </TableCell>

                          {/* Time */}
                          <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <div className={`p-1.5 rounded ${isDarkMode ? 'bg-[#0f172a]/60' : 'bg-gray-50'}`}>
                              <div className="flex items-center justify-between text-xs">
                                <span>{formatTo12Hour(subject.startTime)}</span>
                                <span className="mx-1">-</span>
                                <span>{formatTo12Hour(subject.endTime)}</span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="px-4 py-3 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <UpdateExamRoutine data={classItem} />
                              <DeleteComponent
                                name={subject.subjectName}
                                customData="all routine for this exam type"
                                deletePath={`${resultUrlApi.deleteExamRoutine.url}/${classItem.id}/${schoolId}`}
                                onDelete={() => {
                                  const updatedData = examRoutines.map((routine) => ({
                                    ...routine,
                                    subjects: routine.subjects.filter(
                                      (_, index) => index !== subjectIndex
                                    ),
                                  }));
                                  dispatch(setExamRoutine(updatedData));
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Pagination Section */}
            {hasSearched && examRoutines.length > 0 && (
              <div className={`border-t ${isDarkMode ? 'border-[rgba(193,193,193,0.2)]' : 'border-slate-200'}`}>
                <PaginationComponent
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  totalPages={totalPages}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExamRoutinesPage;