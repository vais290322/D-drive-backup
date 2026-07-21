import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import assignmentUrlApi from "@/common/assignment";
import { useSelector } from "react-redux";
import axios from "axios";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { ImCross } from "react-icons/im";
import { IoMdDownload } from "react-icons/io";
// Add this import for Select components
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from "@radix-ui/react-select";
const StudentAssignment = () => {
    const [viewAssignment, setViewAssignment] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [searchSubject, setSearchSubject] = useState("");
    const [searchTeacher, setSearchTeacher] = useState("");
    // Add date states
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const userDetails = useSelector((state) => state.auth.userDetails);
    const teacherId = userDetails?.id;
    const className = userDetails?.className;
    const sectionName = userDetails?.section;
    const schoolId = useSelector((state) => state.auth.schoolId);
// console.log(schoolId);

    const { theme } = useTheme();
    const [assignments, setAssignments] = useState([]);
    // Add filtered assignments state
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Now pageSize is state

    // Calculate total pages
    const totalPages = Math.ceil(filteredAssignments.length / pageSize);

    // Get current page data
    const paginatedAssignments = filteredAssignments.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Reset to first page when filters or pageSize change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filteredAssignments, pageSize]);

    const fetchAssignments = async () => {
        try {
            const response = await axios.get(`${assignmentUrlApi.getAllAssignment.url}/school/${schoolId}/class/${className}/section/${sectionName}`);
            let data = Array.isArray(response.data?.data) ? response.data?.data : [];
            // Sort by assignmentDate descending (most recent first)
            data = data.sort((a, b) => new Date(b.assignmentDate) - new Date(a.assignmentDate));
            setAssignments(data);
            setFilteredAssignments(data);
        } catch (error) {
            setAssignments([]);
            setFilteredAssignments([]);
            // console.error("Error fetching assignments:", error);
        }
    };

    React.useEffect(() => {
        fetchAssignments();
    }, []);

    // Filtering logic
    const handleSearch = () => {
        let filtered = assignments;
        // if (searchSubject) {
        //     filtered = filtered.filter(a => a.subject === searchSubject);
        // }
        // if (searchTeacher) {
        //     filtered = filtered.filter(a => a.teacherName === searchTeacher);
        // }
        if (fromDate) {
            filtered = filtered.filter(a => new Date(a.assignmentDate) >= new Date(fromDate));
        }
        if (toDate) {
            filtered = filtered.filter(a => new Date(a.assignmentDate) <= new Date(toDate));
        }
        // Sort by assignmentDate descending (most recent first)
        filtered = filtered.sort((a, b) => new Date(b.assignmentDate) - new Date(a.assignmentDate));
        setFilteredAssignments(filtered);
    };

    const handleDownload = async (fileUrl, filename = "download") => {
        try {
            const response = await axios.get(fileUrl, {
                responseType: "blob",
           
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            // Optionally show a toast or alert
        }
    };
    // console.log(schoolId,className,sectionName);
    // console.log(assignments);
  return (
    <div className={`${theme === "light" ? "dark" : "light"} min-h-screen bg-gradient-to-b ${theme === "light" ? "from-gray-900 to-gray-800" : "from-gray-50 to-white"}`}>
  <div className={`${theme === "light" ? "bg-gray-700"  : "from-purple-100 to-blue-100"}  flex flex-col items-start gap-4 mt-6 mb-8 ml-4 mr-4 p-6 rounded-xl shadow-lg border border-blue-200"`}>
    <span className={`${theme === "light" ? "text-white" :"text-gray-800"} text-2xl font-bold mb-2 text-blue-900 tracking-wide"`}>
      🔍 Search Assignment
    </span>
    <div className="flex flex-wrap gap-4 items-end w-full">
      {/* From Date Picker */}
      <div className="flex flex-col">
        <label className={`${theme === "light" ? "text-white" :"text-gray-800" } text-sm font-semibold text-gray-700 mb-1"`}>From Date</label>
        <input
            type="date"
            className={`${theme === "light" ? "bg-black" :"bg-white" } w-40 border bg-black  rounded-xl  shadow px-3 py-2"`}
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            max={toDate || undefined}
        />
      </div>
      {/* To Date Picker */}
      <div className="flex flex-col">
        <label className={`${theme === "light" ? "text-white" :"text-gray-800"} "text-sm font-semibold text-gray-700 mb-1"`}>To Date</label>
        <input
            type="date"
            className="w-40 border border-gray-300 rounded-xl bg-white shadow px-3 py-2"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            min={fromDate || undefined}
        />
      </div>
      {/* Search Button */}
      <button
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-800 text-white font-semibold rounded-lg px-8 py-2 shadow-md transition-all duration-200 mt-5 sm:mt-0"
        style={{ fontFamily: "Poppins, sans-serif" }}
        onClick={handleSearch}
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          Search
        </span>
      </button>
    </div>
  </div>
      <div className="rounded-xl shadow-lg overflow-hidden m-4">
        {/* Header */}
        <div className={`${theme === "light" ? "bg-gray-700": "bg-gradient-to-r from-blue-600 to-white"}  rounded-t-xl px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3"`}>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span role="img" aria-label="assignment" className="text-2xl">📝</span>
            Assignment Management
          </h2>
        </div>
        {/* Content */}
        <div className={`p-6 ${theme === "light" ? "bg-gray-800" : "bg-white"} rounded-b-xl shadow-lg overflow-x-auto`}>

          <table className={`${theme === "light" ? "bg-gray-800" : "bg-white"} min-w-full text-left border-collapse`}>
            <thead>
              <tr className={`${theme === "light" ? "bg-gray-800" : "bg-blue-100"}`}>
                <th className="py-2 px-2 sm:px-4 rounded-tl-xl text-xs sm:text-sm">S.No</th>
                <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Teacher</th>
                <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Subject</th>
                <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Title</th>
                <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Description</th>
                <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Assignment Date</th>
                <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Due Date</th>
                <th className="py-2 px-2 sm:px-4 rounded-tr-xl text-xs sm:text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssignments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-400">
                    No assignments found.
                  </td>
                </tr>
              ) : (
                paginatedAssignments.map((assignment, idx) => (
                  <tr key={assignment.id || idx} className="border-b last:border-b-0">
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{assignment.teacherName}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{assignment.subject}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                      {assignment.title.length > 10
                        ? assignment.title.slice(0, 10) + "..."
                        : assignment.title}
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                      {assignment.description.length > 10
                        ? assignment.title.slice(0, 10) + "..."
                        : assignment.description}
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{assignment.assignmentDate}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{assignment.dueDate}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                          onClick={() => {
                            setViewAssignment(assignment);
                            setShowViewModal(true);
                          }}
                        >
                          View
                        </button>
                        {assignment.filePath && (
                 <a
                 href="#"
                 onClick={e => {
                     e.preventDefault();
                     handleDownload(assignment.filePath, assignment.filePath.split('/').pop());
                 }}
                 className="text-green-600 hover:text-green-800 transition"
                 title="Download Attachment"
                 style={{ display: "flex", alignItems: "center" }}
             >
                 <span className="text-2xl"><IoMdDownload /></span>
             </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="mt-4 flex align-middle justify-center">
                    {/* Page Size Dropdown */}
                    <div className="flex justify-end mt-4 mx-10">
            <label className={`${theme === "light" ? "text-white": "text-black"} mr-2 text-lg text-gray-700"`}>Rows per page:</label>
            <select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                className="border border-gray-300 text-black rounded px-2 py-1 text-sm"
            >
                {[5, 10, 20, 50].map(size => (
                    <option key={size} value={size}>{size}</option>
                ))}
            </select>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {/* View Modal */}
      {showViewModal && viewAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-gradient-to-br from-blue-100 via-white to-purple-100 rounded-3xl shadow-2xl w-full max-w-2xl p-12 relative border-2 border-blue-300 animate-fade-in">
            <button
              className="absolute top-5 right-5 text-red-400 hover:text-red-600 text-3xl transition"
              onClick={() => setShowViewModal(false)}
              title="Close"
            >
              <ImCross />
            </button>
            <div className="flex flex-col items-center mb-8">
              {/* <div className="bg-blue-200 rounded-full p-6 mb-3 shadow">
                <span role="img" aria-label="assignment" className="text-4xl">📝</span>
              </div> */}
              <h3 className="text-3xl font-extrabold text-blue-800 mb-2 tracking-wide drop-shadow">Assignment Details</h3>
              <p className="text-gray-500 text-base">Full information about this assignment</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* <div className="flex flex-col">
                <span className="text-xs text-blue-600 font-semibold uppercase">Class</span>
                <span className="text-lg font-bold text-blue-900 bg-blue-50 rounded px-4 py-2 shadow">{viewAssignment.className}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-blue-600 font-semibold uppercase">Section</span>
                <span className="text-lg font-bold text-blue-900 bg-blue-50 rounded px-4 py-2 shadow">{viewAssignment.section}</span>
              </div> */}
              <div className="flex flex-col">
                <span className="text-sm text-blue-600 font-semibold uppercase">Teacher Name</span>
                <span className="text-lg font-bold text-blue-900 bg-blue-50 rounded px-4 py-2 shadow">{viewAssignment.teacherName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-blue-600 font-semibold uppercase">Subject</span>
                <span className="text-lg font-bold text-blue-900 bg-blue-50 rounded px-4 py-2 shadow">{viewAssignment.subject}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-sm text-blue-600 font-semibold uppercase">Title</span>
                <span className="text-base font-bold text-blue-900 bg-blue-50 rounded px-4 py-2 shadow">{viewAssignment.title}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-xs text-blue-600 font-semibold uppercase">Description</span>
                <div className="bg-white rounded-lg px-4 py-3 shadow text-gray-700 text-base whitespace-pre-line min-h-[80px]">
                  {viewAssignment.description}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-blue-600 font-semibold uppercase">Assignment Date</span>
                <span className="text-lg text-blue-900 bg-blue-50 rounded px-4 py-2 shadow">{viewAssignment.assignmentDate}</span>
              </div>
              {viewAssignment.filePath &&  <div className="flex flex-col">
                <span className="text-xs text-blue-600 font-semibold uppercase">Due Date</span>
                <span className="text-lg text-blue-900 bg-blue-50 rounded px-4 py-2 shadow">{viewAssignment.dueDate}</span>
              </div>}
             
              {viewAssignment.filePath && (
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-blue-600 font-semibold uppercase">Attachment</span>
                  <a
                    href={viewAssignment.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-800 transition-all duration-200 hover:scale-105 mt-2"
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1 4v-4m0 0V9a4 4 0 10-8 0v3a4 4 0 008 0V9m0 0V5a4 4 0 018 0v4a4 4 0 01-8 0z" />
                    </svg>
                    View File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>

    

  );
};

export default StudentAssignment;
