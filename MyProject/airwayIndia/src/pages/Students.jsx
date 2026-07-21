import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StudentUrl, getAuthHeaders } from "../config/config";
import toast from "react-hot-toast";
import ViewStudentModal from "../components/ViewStudentModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import StudentReport from "../components/StudentReport";
import AddStudentModal from "../components/AddStudentModal";
import ImportStudentModal from "../components/ImportStudentModal";


const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewStudent, setViewStudent] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [exportLoading, setExportLoading] = useState("");

  const handleStudentAdded = () => {
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${StudentUrl.getStudents}`, {
        headers: getAuthHeaders(),
      });
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${StudentUrl.deleteStudent}/${selectedStudentId}`, {
        headers: getAuthHeaders(),
      });
      toast.success("Student deleted successfully");
      fetchStudents();
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete student");
    } finally {
      setDeleting(false);
    }
  };

  const handleExcelUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(StudentUrl.importStudents, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Student list imported successfully");
      fetchStudents();
      setIsImportModalOpen(false);
    } catch (error) {
      console.error("Excel upload error:", error);
      toast.error(
        error.response?.data?.message || "Failed to import student list"
      );
    }
  };

  const filteredStudents = students
    .filter((student) => {
      const searchLower = search.toLowerCase();
      // Search by name, email, admission number, course, plan, mobile, address, amount
      const matchesSearch =
        (student.fullName &&
          student.fullName.toLowerCase().includes(searchLower)) ||
        (student.email && student.email.toLowerCase().includes(searchLower)) ||
        (student.admissionNumber &&
          student.admissionNumber.toLowerCase().includes(searchLower)) ||
        (student.courseName &&
          student.courseName.toLowerCase().includes(searchLower)) ||
        (student.planName &&
          student.planName.toLowerCase().includes(searchLower)) ||
        (student.mobile &&
          student.mobile.toLowerCase().includes(searchLower)) ||
        (student.address &&
          student.address.toLowerCase().includes(searchLower)) ||
        (student.amount && student.amount.toString().includes(searchLower));

      // Filter by status
      const matchesStatus =
        selectedStatus === "all" ||
        (student.paymentStatus &&
          student.paymentStatus.toLowerCase() === selectedStatus.toLowerCase());

      // Filter by payment mode
      const matchesPaymentMode =
        selectedPaymentMode === "all" ||
        (student.paymentMode &&
          student.paymentMode.toLowerCase() ===
            selectedPaymentMode.toLowerCase());

      // Filter by date of birth (assuming student.dateOfBirth is in YYYY-MM-DD)
      const matchesDate =
        !selectedDate ||
        (student.dateOfBirth && student.dateOfBirth.startsWith(selectedDate));

      return (
        matchesSearch && matchesStatus && matchesPaymentMode && matchesDate
      );
    })
    .sort((a, b) => {
      if (selectedSort === "A_TO_Z") {
        return (a.fullName || "").localeCompare(b.fullName || "");
      } else if (selectedSort === "Z_TO_A") {
        return (b.fullName || "").localeCompare(a.fullName || "");
      } else if (selectedSort === "HIGHEST_DUE") {
        return (b.dueFees || 0) - (a.dueFees || 0);
      } else if (selectedSort === "LOWEST_DUE") {
        return (a.dueFees || 0) - (b.dueFees || 0);
      } else if (selectedSort === "NEWEST") {
        return new Date(b.date) - new Date(a.date);
      } else if (selectedSort === "OLDEST") {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

  // const startIndex = (currentPage - 1) * limit;
  // const endIndex = startIndex + limit;
  // const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
  const paginatedStudents = filteredStudents;

  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen">
      <StudentReport />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <input
              type="text"
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400 text-sm"
              placeholder="Search by Name/ID/Course/Amount"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-400 text-sm w-full sm:w-auto"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="Search by DOB"
            aria-label="Search by Date of Birth"
          />
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-400 text-sm w-full sm:w-auto"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="A_TO_Z">A to Z</option>
            <option value="Z_TO_A">Z to A</option>
            <option value="HIGHEST_DUE">Highest Due</option>
            <option value="LOWEST_DUE">Lowest Due</option>
            <option value="NEWEST">Newest to Oldest</option>
            <option value="OLDEST">Oldest to Newest</option>
          </select>
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-400 text-sm w-full sm:w-auto"
            value={selectedPaymentMode}
            onChange={(e) => setSelectedPaymentMode(e.target.value)}
          >
            <option value="all">Payment mode</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Online">Online</option>
            <option value="Cheque">Cheque</option>
            <option value="Demand Draft">Demand Draft</option>
            <option value="NEFT">NEFT</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <button
            className="px-4 py-1.5 text-red-600 border border-red-600 rounded hover:bg-red-50 w-full sm:w-auto text-sm"
            onClick={() => setIsAddStudentOpen(true)}
          >
            Add New Student
          </button>
          <button
            className="px-4 py-1.5 text-red-600 border border-red-600 rounded hover:bg-red-50 w-full sm:w-auto text-sm"
            onClick={() => setIsImportModalOpen(true)}
          >
            Import Student List
          </button>
          <div className="relative w-full sm:w-auto">
            <select
              className="px-4 py-1.5 text-white border bg-red-600 border-red-600 rounded w-full sm:w-auto text-sm"
              value=""
              onChange={async (e) => {
                const val = e.target.value;
                if (!val) return;
                setExportLoading(val);
                try {
                  let url = "";
                  let fileName = "";
                  if (val === "PDF") {
                    url = StudentUrl.exportInPdf;
                    fileName = "students.pdf";
                  } else if (val === "Excel") {
                    url = StudentUrl.exportInExcel;
                    fileName = "students.xlsx";
                  }
                  if (url) {
                    const res = await axios.get(url, {
                      headers: getAuthHeaders(),
                      responseType: "blob",
                    });
                    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = blobUrl;
                    link.setAttribute("download", fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                  }
                } catch (err) {
                  toast.error("Failed to export students");
                } finally {
                  setExportLoading("");
                  e.target.value = "";
                }
              }}
            >
              <option value="">Export As</option>
              <option value="PDF">{exportLoading === "PDF" ? "Exporting..." : "PDF"}</option>
              <option value="Excel">{exportLoading === "Excel" ? "Exporting..." : "Excel"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add scrollable wrapper for the table */}
      <div className="bg-white rounded shadow overflow-x-auto red-scrollbar max-h-[500px]" style={{ overflowY: 'auto' }}>
        <table className="w-full min-w-[700px] sm:min-w-full text-sm sm:text-base">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500">
                Student ID
              </th>
              <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500">
                Student Name
              </th>
              <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500">
                Course
              </th>
              <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500">
                Course Plan
              </th>
              <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500">
                Year
              </th>
              <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500">
                Session
              </th>
              <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500">
                Mobile
              </th>
              <th className="text-left px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-500">
                Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
                onClick={() =>
                  navigate(`/payment-student/${student.id}`, {
                    state: { student },
                  })
                }
              >
                <td className="px-2 sm:px-4 py-2 sm:py-4 text-gray-900">
                  {student.studentId || "NA"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 text-gray-900">
                  {student.fullName || "NA"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 text-gray-900">
                  {student.courseName || "NA"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 text-gray-900">
                  {student.planName || "NA"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 text-gray-900">
                  {student.currentYear || "NA"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 text-gray-900">
                  {student.session || "NA"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 text-gray-900">
                  {student.mobile || "NA"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-4 text-gray-900">
                  {student.address || "NA"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ViewStudentModal
        student={viewStudent}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />
      <ConfirmDeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onStudentAdded={handleStudentAdded}
      />
      <ImportStudentModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSubmit={handleExcelUpload}
      />
    </div>
  );
};

export default Students;
