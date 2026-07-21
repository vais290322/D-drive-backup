import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { PaymentUrl, StudentUrl, getAuthHeaders,CourseUrl, PlanUrl, SessionUrl, UpdateInstallment  } from "../config/config";
import { FiArrowLeft, FiDownload, FiChevronDown, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import ReactModal from "react-modal";
import { SquarePen } from "lucide-react";

function StudentPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [passedStudentState, setPassedStudentState] = useState(location.state?.student || null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSort, setSelectedSort] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const [students, setStudents] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    studentId: "",
    session: "",
    guardianName: "",
    planId: "",
    planName: "",
    courseId: "",
    courseName: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    address: ""
  });
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isEditInstallmentOpen, setIsEditInstallmentOpen] = useState(false);
  const [editInstallmentId, setEditInstallmentId] = useState(null);
  const [installmentName, setInstallmentName] = useState("");
const [editReceiptNumber, setEditReceiptNumber] = useState(null);
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${StudentUrl.getStudents}`, {
        headers: getAuthHeaders(),
      });
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };
  const fetchSortStudents = async () => {
    try {
      const res = await axios.get(`${StudentUrl.getSortStudents}/${id}`, {
        headers: getAuthHeaders(),
        params: {
          sortBy: selectedSort || undefined,
        },
      });
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${SessionUrl.getSessions}`, {
        headers: getAuthHeaders(),
      });
      setSessions(res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch sessions");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${CourseUrl.getCourses}`, { 
        headers: getAuthHeaders() 
      });
      setCourses(res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch courses");
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${PlanUrl.getPlans}`, { 
        headers: getAuthHeaders() 
      });
      setPlans(res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch plans");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${PaymentUrl.getStudentPayment}/${id}`, {
          headers: getAuthHeaders(),
        });
        setData(res.data.data);
      } catch (err) {
        setData(null);
        toast.error(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    fetchStudents();
    fetchSortStudents();
  }, [id, selectedSort, isEditing]); // Add isEditing as dependency

  useEffect(() => {
    if (isEditing) {
      fetchCourses();
      fetchPlans();
      fetchSessions();
    }
  }, [isEditing]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${StudentUrl.deleteStudent}/${passedStudentState?.id}`,
        {
          headers: getAuthHeaders(),
        }
      );
      toast.success("Student deleted successfully");
      navigate("/students");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete student");
    }
  };

  const editPayload = {
    fullName: editFormData.fullName,
    studentId: editFormData.studentId,
    session: editFormData.session,
    guardianName: editFormData.guardianName,
    planId: editFormData.planId,
    planName: editFormData.planName,
    courseId: editFormData.courseId,
    courseName: editFormData.courseName,
    mobile: editFormData.mobile,
    email: editFormData.email,
    dateOfBirth: editFormData.dateOfBirth,
    address: editFormData.address
  };

const handleEdit = async () => {
  try {
    console.log("Sending payload:", editPayload);

    const response = await axios.put(
      `${StudentUrl.updateStudent}/${passedStudentState?.id}`,
      editPayload,
      {
        headers: getAuthHeaders(),
      }
    );
    if (response.data.success === true) {
      setData(prev => ({
        ...prev,
        studentInfo: {
          ...prev.studentInfo,
          ...editPayload
        }
      }));
      
      setPassedStudentState(prev => ({
        ...prev,
        ...editPayload
      }));

      toast.success(response.data.message);
      setIsEditing(false);
      fetchStudents();
    } else {
      throw new Error(response.data.message || "Failed to update student");
    }

  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update student");
  }
};



const handleEditInstallmentName = async () => {
  try {
    await axios.put(
      `${UpdateInstallment.updateInstallment}/${editInstallmentId}`,
      { 
        nameOfInstallment: installmentName, 
        receiptNo: editReceiptNumber 
      },
      { headers: getAuthHeaders() }
    );
    toast.success("Installment name updated");

    setIsEditInstallmentOpen(false);
    setInstallmentName("");
    navigate(`/payment-student/${id}`);
  } catch (err) {
    toast.error("Failed to update installment name");
  }
};

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading student data...</p>
      </div>
    );
  }

  if (!data && !passedStudentState) {
    return (
      <div className="text-center p-12 text-red-600">Failed to load data.</div>
    );
  }

  // Use API data if available, otherwise fallback to passedStudent
  const studentInfo = data?.studentInfo || passedStudentState || {};
  const paymentHistory = data?.paymentHistory || [];
  const formatCurrency = (val) => `₹${val?.toLocaleString("en-IN") || "0"}`;

  // Filtering logic for payment history
  let filteredPayments = paymentHistory.filter((entry) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (entry.studentName &&
        entry.studentName.toLowerCase().includes(searchLower)) ||
      (entry.receiptNumber &&
        entry.receiptNumber.toString().includes(searchLower)) ||
      (entry.courseName &&
        entry.courseName.toLowerCase().includes(searchLower)) ||
      (entry.amount && entry.amount.toString().includes(searchLower));

    // Date filter (selectedDate is in YYYY-MM-DD)
    let matchesDate = true;
    if (selectedDate) {
      let entryDateStr = "";
      if (entry.paymentDate) {
        if (entry.paymentDate.includes("/")) {
          const [day, month, year] = entry.paymentDate.split("/");
          entryDateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
        } else {
          entryDateStr = entry.paymentDate;
        }
      }
      matchesDate = entryDateStr === selectedDate;
    }
    // Payment mode filter
    let matchesMode =
      selectedMode === "all" ||
      (entry.paymentMode &&
        entry.paymentMode.toLowerCase() === selectedMode.toLowerCase());
    return matchesSearch && matchesDate && matchesMode;
  });

  // Sorting logic
  if (selectedSort === "amount") {
    filteredPayments = filteredPayments.sort(
      (a, b) => (b.amount || 0) - (a.amount || 0)
    );
  } else if (selectedSort === "date") {
    filteredPayments = filteredPayments.sort(
      (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
    );
  }

  const sortOptions = [
    { value: "", label: "Sort by" },
    { value: "A_TO_Z", label: "A to Z" },
    { value: "Z_TO_A", label: "Z to A" },
    { value: "HIGHEST_DUE", label: "Highest Due" },
    { value: "LOWEST_DUE", label: "Lowest Due" },
    { value: "NEWEST", label: "Newest to Oldest" },
    { value: "OLDEST", label: "Oldest to Newest" },
  ];
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      {/* Header Bar */}
      <div className="bg-[#DF1221] text-white px-6 py-10 h-[250px] flex flex-col gap-2 rounded-b-lg shadow w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => navigate("/students")}
              className="text-white text-2xl mr-2 hover:bg-red-800 rounded-full p-1"
            >
              <FiArrowLeft />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="h-10 px-6 bg-white text-black rounded-full font-medium 
        relative overflow-hidden group transition-all duration-300 ease-in-out
        hover:text-black border border-red-600"
            >
              <span className="relative z-10">Remove Student</span>
              {/* <div className="absolute inset-0 bg-red-600 transform -translate-x-full 
        group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div> */}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-lg mt-1 ml-10">
          <div>
            <span className="text-5xl font-bold">
              {passedStudentState?.fullName || studentInfo?.fullName || "N/A"}
            </span>
          </div>
          <div className="flex justify-start gap-4">
            <span>Session: {passedStudentState?.session || "N/A"}</span>
            <span>ID: {passedStudentState?.studentId || "N/A"}</span>
            <span>M: {passedStudentState?.mobile || "N/A"}</span>
          </div>
        </div>
        <div className="flex justify-between gap-4 text-lg mt-1 ml-10">
          <span>{passedStudentState?.address || "N/A"}</span>
          <span>{passedStudentState?.courseName || "N/A"}</span>
        </div>
      </div>

      {/* Student Details Card */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold mt-10 ml-4 mb-5 text-gray-800">
          Student Details12
        </div>
        <button
          onClick={() => {
            setEditFormData({
              fullName: passedStudentState?.fullName || "",
              studentId: passedStudentState?.studentId || "",
              session: passedStudentState?.session || "",
              guardianName: passedStudentState?.guardianName || "",
              planId: passedStudentState?.planId || "",
              planName: passedStudentState?.planName || "",
              courseId: passedStudentState?.courseId || "",
              courseName: passedStudentState?.courseName || "",
              mobile: passedStudentState?.mobile || "",
              email: passedStudentState?.email || "",
              dateOfBirth: passedStudentState?.dateOfBirth || "",
              address: passedStudentState?.address || ""
            });
            setIsEditing(true);
            // Fetch dropdown data
            fetchCourses();
            fetchPlans();
            fetchSessions();
          }}
          className="bg-[#AA1C26] px-4 py-1 rounded-full text-[#FFFFFF]"
        >
          <span className="relative z-10">Edit Student</span>
        </button>
      </div>
      <div className="w-full  bg-white rounded shadow p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-base">
          <div className="flex flex-col gap-1">
            <div>
              <b>Name</b> : {passedStudentState?.fullName || "N/A"}
            </div>
            <div>
              <b>Student ID</b> : {passedStudentState?.studentId || "N/A"}
            </div>
            <div>
              <b>D.O.B.</b> :{" "}
              {(() => {
                const dob = passedStudentState?.dateOfBirth || studentInfo.dob;
                if (!dob) return "N/A";
                const date = new Date(dob);
                return `${String(date.getDate()).padStart(2, "0")}/${String(
                  date.getMonth() + 1
                ).padStart(2, "0")}/${date.getFullYear()}`;
              })()}
            </div>
            <div>
              <b>Contact</b> : {passedStudentState?.mobile || "N/A"}
            </div>
            <div>
              <b>Email</b> : {passedStudentState?.email || "N/A"}
            </div>
            <div>
              <b>Guardian Name</b> : {passedStudentState?.guardianName || "N/A"}
            </div>
            <div>
              <b>Total Inst. No.</b> : {passedStudentState?.noOfInstallment || "N/A"}
            </div>
            <div>
              <b>Fees per installment</b> :  ₹{passedStudentState?.feesPerInstallment || "N/A"}
            </div>
            <div>
              <b>Total Installment Amount</b> :  ₹{passedStudentState?.feesPerInstallment * passedStudentState?.noOfInstallment || "N/A"}
            </div>
            <div>
              <b>Address</b> : {passedStudentState?.address || "N/A"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <b>Course</b> : {passedStudentState?.courseName || "N/A"}
            </div>
            <div>
              <b>Year</b> : {passedStudentState?.currentYear || "N/A"}
            </div>
            <div>
              <b>Semester</b> : {passedStudentState?.currentSemester}
            </div>
            <div>
              <b>Total Admission Fees</b> :{" "}
              {formatCurrency(passedStudentState?.totalAdmissionFee || 0)}
            </div>
            <div>
              <b>Paid Admission Fees</b> :{" "}
              {formatCurrency(passedStudentState?.paidAdmissionFee || 0)}
            </div>
            <div>
              <b>Remaining Admission Fees</b> :{" "}
              {formatCurrency(passedStudentState?.dueAdmissionFee || 0)}
            </div>
            <div>
              <b>Total Fees</b> :{" "}
              {formatCurrency(passedStudentState?.totalFees || 0)}
            </div>
            <div>
              <b>Total Fees Paid</b> :{" "}
              {formatCurrency(passedStudentState?.totalFeesPaid || 0)}
            </div>
            <div>
              <b>Fees Due</b> : {formatCurrency(passedStudentState?.dueFees || 0)}
            </div>
            <div>
              <b>Inst. Left</b> : {passedStudentState?.remainingInstallments || 0}
            </div>
            <div>
              <b>Session</b> : {passedStudentState?.session || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="w-full mt-6 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2 w-full">
          <div className="text-xl font-bold text-gray-800">Payment History</div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => navigate("/")}
              className="h-10 px-4 border border-red-600 text-red-600 bg-white rounded hover:bg-red-50 text-base font-medium flex items-center"
            >
              Generate new Receipt
            </button>
            <div className="relative">
              <button className="h-10 px-4 bg-red-700 text-white rounded hover:bg-red-800 text-base font-medium flex items-center gap-2 pr-8">
                Export As <FiChevronDown className="ml-1" />
              </button>
              {/* Dropdown can be implemented here if needed */}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 w-full">
          <input
            type="text"
            className="h-10 border w-[400px] border-gray-300 rounded px-3 text-base focus:outline-none focus:border-gray-400 bg-white"
            placeholder="Search by Name/ID/Course/Amount"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="relative w-48">
            <input
              type="date"
              className="h-10 border border-gray-300 rounded pl-3 pr-10 text-base focus:outline-none focus:border-gray-400 bg-white w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-400"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="h-10 border border-gray-300 rounded px-3 text-base focus:outline-none focus:border-gray-400 bg-white"
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
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
        <div className="bg-white rounded shadow overflow-x-auto w-full">
          <table className="w-full text-base">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Receipt No.</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Paying Amount</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Mode</th>
                <th className="px-4 py-2 text-left">Transaction ID</th>
                <th className="px-4 py-2 text-left">Purpose Of Payment</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No payment history available.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{entry.receiptNo || "N/A"}</td>
                    <td className="px-4 py-2">
                      {formatCurrency(entry.totalFeePaid || 0)}
                    </td>
                    <td className="px-4 py-2">
                      {formatCurrency(entry.payingAmount || 0)}
                    </td>
                    <td className="px-4 py-2">{entry.paymentDate || "N/A"}</td>
                    <td className="px-4 py-2">{entry.paymentMode || "N/A"}</td>
                    <td className="px-4 py-2">{entry.transactionId || "-"}</td>
                    <td className="px-4 py-2">
                      {  entry.purpose ||  entry.purposeOfPayment || entry.remarks || "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="text-gray-500 hover:text-blue-600 text-xl"
                          title="View Receipt"
                          onClick={async () => {
                            setPreviewLoading(true);
                            setIsPreviewOpen(true);
                            try {
                              const res = await axios.get(
                                `${StudentUrl.receiptPreview}/${entry.id}`,
                                {
                                  headers: getAuthHeaders(),
                                  responseType: "blob",
                                }
                              );
                              const pdfBlob = new Blob([res.data], {
                                type: "application/pdf",
                              });
                              const pdfUrl = URL.createObjectURL(pdfBlob);
                              setPreviewData(pdfUrl);
                            } catch (err) {
                              setPreviewData(null);
                              toast.error("Failed to fetch receipt preview");
                            } finally {
                              setPreviewLoading(false);
                            }
                          }}
                        >
                          <FiEye />
                        </button>
 <button
  className="text-gray-500 hover:text-blue-600 text-xl"
  title="Edit Installment Name"
  onClick={() => {
    setEditInstallmentId(entry.id);
    setInstallmentName(entry.nameOfInstallment || "");
    setEditReceiptNumber(entry.receiptNo || entry.receiptNumber || null); // <-- add this
    setIsEditInstallmentOpen(true);
  }}
>
  <SquarePen />
</button>
                        <button
                          className="text-gray-500 hover:text-green-600 text-xl"
                          title="Download Receipt"
                          disabled={downloadingId === entry.id}
                          onClick={async () => {
                            setDownloadingId(entry.id);
                            try {
                              const res = await axios.get(
                                `${StudentUrl.receiptDownload}/${entry.id}`,
                                {
                                  headers: getAuthHeaders(),
                                  responseType: "blob",
                                }
                              );
                              const url = window.URL.createObjectURL(
                                new Blob([res.data], {
                                  type: "application/pdf",
                                })
                              );
                              const link = document.createElement("a");
                              link.href = url;
                              link.setAttribute(
                                "download",
                                `receipt_${entry.id}.pdf`
                              );
                              document.body.appendChild(link);
                              link.click();
                              link.parentNode.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            } catch (err) {
                              toast.error("Failed to download receipt");
                            } finally {
                              setDownloadingId(null);
                            }
                          }}
                        >
                          {downloadingId === entry.id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-green-600"
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
                                d="M4 12a8 8 0 018-8v8z"
                              ></path>
                            </svg>
                          ) : (
                            <FiDownload />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ReactModal
        isOpen={isPreviewOpen}
        onRequestClose={() => {
          setIsPreviewOpen(false);
          if (previewData) {
            URL.revokeObjectURL(previewData);
            setPreviewData(null);
          }
        }}
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl w-full min-h-[80vh] relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            onClick={() => {
              setIsPreviewOpen(false);
              if (previewData) {
                URL.revokeObjectURL(previewData);
                setPreviewData(null);
              }
            }}
          >
            &times;
          </button>
          <h2 className="text-lg font-bold mb-4">Receipt Preview</h2>
          {previewLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : previewData ? (
            <iframe
              src={previewData}
              title="PDF Preview"
              className="w-full h-[75vh] border rounded"
            />
          ) : (
            <div className="text-center py-8 text-red-600">No data</div>
          )}
        </div>
      </ReactModal>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[500px]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold pl-36">Delete Student</h2>
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="mb-6">
                <div className="flex gap-4">
                  <div>
                    <p className="text-gray-600">Student Name</p>
                    <p className="font-medium">{passedStudentState?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Student ID</p>
                    <p className="font-medium">{passedStudentState?.studentId}</p>
                  </div>
                   <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-6 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[800px]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-red-600">Edit Student</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block mb-1 text-sm">Full Name</label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Student ID</label>
                  <input
                    type="text"
                    value={editFormData.studentId}
                    onChange={(e) => setEditFormData({...editFormData, studentId: e.target.value})}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                {/* Season dropdown */}
                <div>
                  <label className="block mb-1 text-sm">Session</label>
                  <div className="relative">
                    <select
                      value={editFormData.session}
                      onChange={(e) => setEditFormData({...editFormData, session: e.target.value})}
                      className="w-full border px-3 py-2 rounded appearance-none bg-white pr-8"
                    >
                      <option value="">Select session</option>
                      {sessions.map((session) => (
                        <option 
                          key={session.id} 
                          value={session.session}
                          selected={session.session === passedStudentState?.session}
                        >
                          {session.session}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <FiChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Guardian Name</label>
                  <input
                    type="text"
                    value={editFormData.guardianName}
                    onChange={(e) => setEditFormData({...editFormData, guardianName: e.target.value})}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Course Plan</label>
                  <div className="relative">
                    <select
                      value={editFormData.planName}
                      onChange={(e) => {
                        const selectedPlan = plans.find(plan => plan?.plan?.planName === e.target.value);
                        setEditFormData({
                          ...editFormData,
                          planName: e.target.value,
                          planId: selectedPlan?.plan?.id || ''
                        });
                      }}
                      className="w-full border px-3 py-2 rounded appearance-none bg-white pr-8"
                    >
                      <option value="">Select course plan</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan?.plan?.planName}>
                          {plan?.plan?.planName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <FiChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Course Name dropdown */}
                <div>
                  <label className="block mb-1 text-sm">Course Name</label>
                  <div className="relative">
                    <select
                      value={editFormData.courseName}
                      onChange={(e) => {
                        const selectedCourse = courses.find(
                          course => course?.course?.courseName === e.target.value
                        );
                        setEditFormData({
                          ...editFormData,
                          courseName: e.target.value,
                          courseId: selectedCourse?.course?.id || ''
                        });
                      }}
                      className="w-full border px-3 py-2 rounded appearance-none bg-white pr-8"
                    >
                      <option value="">Select course</option>
                      {courses.map((course) => (
                        <option 
                          key={course.id} 
                          value={course?.course?.courseName}
                          selected={course?.course?.courseName === passedStudentState?.courseName}
                        >
                          {course?.course?.courseName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <FiChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue with other fields similar to the image */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block mb-1 text-sm">Mobile</label>
                  <input
                    type="text"
                    value={editFormData.mobile}
                    onChange={(e) => setEditFormData({...editFormData, mobile: e.target.value})}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Date Of Birth</label>
                  <input
                    type="date"
                    value={editFormData.dateOfBirth}
                    onChange={(e) => setEditFormData({...editFormData, dateOfBirth: e.target.value})}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block mb-1 text-sm">Address</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditInstallmentOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
    <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-red-600">Edit Installment Name</h2>
        <button
          onClick={() => setIsEditInstallmentOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ×
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm">Name of Installment</label>
        <input
          type="text"
          value={installmentName}
          onChange={e => setInstallmentName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setIsEditInstallmentOpen(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleEditInstallmentName}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default StudentPayment;
