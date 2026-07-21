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
import { Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setExamRoutine } from "@/utils/routines/examRoutineSlice";
import UpdateExamRoutine from "@/components/ForRoutines/UpdateExamRoutine";
import routineUrlApi from "@/common/routines";

const ExamRoutinesPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const examRoutines =
    useSelector((state) => state.examRoutine.examRoutine) || [];
  const dispatch = useDispatch();
  const allClass = useSelector((state) => state.class.classNames);
  const [searchData, setSearchData] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // New state to track if search has been performed

  const dataLength = examRoutines.length;

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${routineUrlApi.getExamRoutine.url}/search?className=${searchData}`
      );
      // console.log("response : ", response);
      if (response) {
        dispatch(setExamRoutine(response.data.data));
        setHasSearched(true); // Set to true after search
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    }
  };

  const downloadExamRoutine = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${routineUrlApi.getExamRoutine.url}/search/download?className=${searchData}`,
        {
          responseType: "blob",
        }
      );

      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Set the filename for the download
        link.setAttribute("download", `exam_routine_${searchData}.pdf`);

        // Append the link to the document and trigger a click to download
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);

        // console.log("PDF downloaded successfully!");
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

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  return (
    <div
      className={` ${theme === "light" ? "dark" : "light"} font-poppins h-[100vh] `}
    >
      <div className={`  `}>
        {/* for search function  */}
        <div
          className={`mt-6 flex items-center justify-start mx-4 sm:mx-14 gap-4 h-20 ${
            theme === "light" ? "bg-[#212121]" : "bg-white"
          } `}
        >
          <p className="text-2xl font-semibold ml-2 hidden sm:block">
            Search Exam Routines{" "}
          </p>
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 w-full"
          >
            <select
              id="class"
              className="w-[20%] border rounded p-2 mt-1"
              required
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            >
              <option value="" disabled>
                Select Class
              </option>
              {allClass.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>

            <Button type="submit" className="bg-[#452B90] hover:bg-[#c29732]">
              Search
            </Button>
          </form>
        </div>

       
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
                  All Exams Routines
                </span>
              </div>

              <div>
                <Button
                  className="bg-[#452B90] hover:bg-[#c29732]"
                  onClick={(e) => downloadExamRoutine(e)}
                >
                  <Download /> Download PDF
                </Button>
              </div>

              <div>
                <AddNewExamRoutines />
              </div>
            </div>
              {
                !hasSearched ? (
                  <div className="mt-10 text-center text-gray-500 text-lg">
                    Search to see the data
                  </div>
                ) : (
                  <Table className="table-auto w-full border-collapse border border-slate-200">
              <TableHeader
                className={`bg-gray-100 text-left ${
                  theme === "light" ? "bg-[#212121]" : "light"
                }`}
              >
                <TableRow>
                  {[
                    "S.No",
                    "Class",
                    "Subject",
                    "Exam Date",
                    "Start Time",
                    "End Time",
                    "Action",
                  ].map((header, index) => (
                    <TableHead
                      key={index}
                      className={`px-4 py-2 border ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)] text-white "
                          : "border-slate-200 text-black"
                      } font-semibold  ${
                        header === "Action" ? "text-right" : "text-left"
                      }`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map((classItem, classIndex) =>
                  classItem.subjects.map((subject, subjectIndex) => (
                    <TableRow
                      key={`${classItem.id}-${subjectIndex}`}
                      className={`hover:bg-gray-50 border ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      }`}
                    >
                      {/* Serial Number */}
                      <TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        } `}
                      >
                        {(currentPage - 1) * rowsPerPage +
                          classIndex +
                          subjectIndex +
                          1}
                      </TableCell>

                      {/* Class Name */}
                      <TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        } `}
                      >
                        {classItem.className}
                      </TableCell>

                      {/* Subject Name */}
                      <TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        } `}
                      >
                        {subject.subjectName}
                      </TableCell>

                      {/* Exam Date */}
                      <TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        } `}
                      >
                        {subject.examDate}
                      </TableCell>

                      {/* Start Time */}
                      <TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        } `}
                      >
                        {subject.startTime}
                      </TableCell>

                      {/* End Time */}
                      <TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        } `}
                      >
                        {subject.endTime}
                      </TableCell>

                      {/* Actions */}
                      <TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        } `}
                      >
                        <div className="flex justify-end items-center gap-2">
                          <UpdateExamRoutine />
                          <DeleteComponent
                            name={subject.subjectName}
                            deletePath={`http://192.168.0.141:8084/api/exam-routines/${classItem.id}`}
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
                )
              }
            {/* Table */}
            

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

export default ExamRoutinesPage;
