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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddNewClassRoutines from "@/components/ForRoutines/AddNewClassRoutines";
import { useDispatch, useSelector } from "react-redux";
import { setClassRoutine } from "@/utils/routines/classRoutineSlice";
import { Calendar, Download, Loader2, Search } from "lucide-react";
import UpdateClassRoutineComponent from "@/components/ForRoutines/UpdateClassRoutineComponent";
import routineUrlApi from "@/common/routines";

const ClassRoutinesPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const dispatch = useDispatch();
  const classTime = useSelector((state) => state.classTime.classTime);
  const classRoutineTime =
    useSelector((state) => state.classRoutine.classRoutine) || [];
  const allClass = useSelector((state) => state.class.classNames);
  const allSection = useSelector((state) => state.section.sectionNames);
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state)=>state?.auth?.schoolId);

  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
  });
  const [searchRoutineData, setSearchRoutineData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const dataLength = searchRoutineData?.length;

  // for fetch the class data
  const fetchClassRoutine = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${routineUrlApi.getRoutine.url}/${schoolId}`
      );
      dispatch(setClassRoutine(response.data.data));
    } catch (error) {
      // toast.error(error?.response?.data?.message || "Failed to fetch routines");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClassRoutine();
  }, []);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = searchRoutineData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const capitalizeFirstLetter = (str) =>
    str?.charAt(0).toUpperCase() + str.slice(1);

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const searchClass = async (e) => {
    e.preventDefault();
    if (!searchData.className || !searchData.section) {
      toast.error("Please select both class and section");
      return;
    }
    
    try {
      setIsSearching(true);
      const response = await axios.get(
        `${routineUrlApi.getRoutine.url}/${schoolId}/search?className=${searchData.className}&section=${searchData.section}`
      );
      if (response) {
        setSearchRoutineData(response?.data);
        if (response.data.length === 0) {
          toast.info("No routines found for the selected class and section");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    } finally {
      setIsSearching(false);
    }
  };

  const sortedClassTime = [...classTime].sort((a, b) => {
    const periodOrder = (period) => {
      if (period.toLowerCase().includes("break")) return 4.5; // Place "break period" after 4th period
      const match = period.match(/\d+/); // Extract the number (e.g., 1, 2, 3)
      return match ? parseInt(match[0], 10) : Infinity; // Non-numbered periods go to the end
    };

    return periodOrder(a.periods) - periodOrder(b.periods);
  });

  const downloadRoutine = async (e) => {
    e.preventDefault();
    // console.log("searchData", searchData);
    if (!searchData.className || !searchData.section) {
     
      toast.error("Please select both class and section before downloading");
      return;
    }
    
    try {
      const response = await axios.get(
        `${routineUrlApi.getRoutine.url}/${schoolId}/search/download?className=${searchData.className}&section=${searchData.section}`,
        {
          responseType: "blob",
        }
      );

      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Set the filename for the download
        link.setAttribute(
          "download",
          `routine_${searchData.className}_${searchData.section}.pdf`
        );

        // Append the link to the document and trigger a click to download
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
        
        toast.success("Routine downloaded successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while downloading the routine");
    }
  };

  const isDarkMode = theme === "light";
  const bgColor = isDarkMode ? "bg-[#0f172a]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const borderColor = isDarkMode ? "border-[rgba(193,193,193,0.2)]" : "border-slate-200";

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300 font-poppins`}>
      {/* Search Section */}
      <div className={`mt-4 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
      }`}>
        <div className={`p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${
          isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
              <Search className={`h-5 w-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Search Class Routines</h2>
          </div>
          
          <form onSubmit={searchClass} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-auto">
              <Select
                onValueChange={(value) => setSearchData({ ...searchData, className: value })}
              >
                <SelectTrigger className={`w-full sm:w-[180px] ${isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white'}`}>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : ''}>
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
              <Select
                onValueChange={(value) => setSearchData({ ...searchData, section: value })}
              >
                <SelectTrigger className={`w-full sm:w-[180px] ${isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white'}`}>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : ''}>
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

            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                type="submit" 
                className={`${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white flex-1 sm:flex-none`}
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
                onClick={downloadRoutine}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Routines Table Section */}
      <div className={`mt-6 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
      }`}>
        {/* Page Header Section */}
        <div className={`flex justify-between items-center p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${
          isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <Calendar className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Class Routines
              {searchData.className && searchData.section && (
                <span className={`ml-2 text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ({capitalizeFirstLetter(searchData.className)} - {capitalizeFirstLetter(searchData.section)})
                </span>
              )}
            </h2>
          </div>

          {["edp", "admin", "vais"].includes(role) && (
            <div>
              <AddNewClassRoutines />
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading routines...</span>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader className={`${isDarkMode ? 'bg-[#1e293b]/80' : 'bg-gray-50'} sticky top-0 z-10`}>
                  <TableRow>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      S.No
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Day
                    </TableHead>

                    {/* Dynamic Period Headers */}
                    {sortedClassTime?.map((period) => (
                      <TableHead
                        key={period.id}
                        className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}
                      >
                        <div className="flex flex-col">
                          <span>{period.periods}</span>
                          <span className="text-xs font-normal opacity-75 mt-1">
                            {period.startTime} - {period.endTime}
                          </span>
                        </div>
                      </TableHead>
                    ))}

                    {/* Action Header */}
                    <TableHead className={`px-4 py-3 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {searchRoutineData?.length > 0 ? (
                    paginatedData?.map((item, index) => {
                      // Calculate remaining periods for each row
                      const remainingPeriods = Array(9 - item.periods.length).fill(
                        "No class"
                      );

                      return (
                        <TableRow
                          key={item.id}
                          className={`transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-[#1e293b]/70 border-[rgba(193,193,193,0.2)]' 
                              : 'hover:bg-blue-50/30 border-slate-200'
                          }`}
                        >
                          {/* S.No */}
                          <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${
                              isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {(currentPage - 1) * rowsPerPage + index + 1}
                            </span>
                          </TableCell>

                          {/* Day */}
                          <TableCell className={`px-4 py-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            <span className={`inline-block px-3 py-1 rounded-md text-sm ${
                              isDarkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {item.day}
                            </span>
                          </TableCell>

                          {/* Periods */}
                          {item.periods.map((period, idx) => (
                            <TableCell
                              key={idx}
                              className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                            >
                              <div className={`p-2 rounded ${
                                isDarkMode ? 'bg-[#0f172a]/60' : 'bg-gray-50'
                              }`}>
                                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {period.subjectName}
                                </div>
                                <div className="text-sm mt-1 opacity-80">
                                  {period.teacherName}
                                </div>
                              </div>
                            </TableCell>
                          ))}

                          {/* Fill empty cells for remaining periods */}
                          {remainingPeriods.map((_, idx) => (
                            <TableCell
                              key={`remaining-${idx}`}
                              className={`px-4 py-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} italic`}
                            >
                              <div className={`p-2 rounded ${
                                isDarkMode ? 'bg-[#0f172a]/30' : 'bg-gray-50/50'
                              } text-center`}>
                                No class
                              </div>
                            </TableCell>
                          ))}

                          {/* Actions */}
                          <TableCell className="px-4 py-3 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <UpdateClassRoutineComponent routineData={item} />
                              <DeleteComponent
                                name={item.day}
                                deletePath={`${routineUrlApi.getRoutine.url}/${item.id}/${schoolId}`}
                                onDelete={() => {
                                  const updatedData = classRoutineTime?.filter(
                                    (data) => data.id !== item.id
                                  );
                                  dispatch(setClassRoutine(updatedData));
                                  setSearchRoutineData(prev => prev.filter(data => data.id !== item.id));
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan="100%"
                        className={`py-16 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">No Routines Found</h3>
                        <p className="mt-2">
                          {searchData.className && searchData.section 
                            ? "No routines available for the selected class and section" 
                            : "Please select a class and section to view routines"}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Section */}
            {searchRoutineData.length > 0 && (
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

export default ClassRoutinesPage;