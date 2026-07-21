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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";
import { setStudentInfo } from "@/utils/studentInformation/studentInfoSlice";
import mainUrlApi, { accountApi } from "@/common/main";
import TourButton from "@/components/Tour/TourButton";
import { studentFeeCollectionPageSteps } from "@/components/Tour/Steps/AccountsSteps/Step";
import { BookOpen, Calendar, CreditCard, Loader2, Search, User, X } from "lucide-react";

const StudentFeeCollectionPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);


  // const allStudents = useSelector((state) => state?.studentInfo?.studentInfo) || [];
  const [allStudents, setAllStudents] = useState([]);


  const [classFeeStructure, setClassFeeStructure] = useState("");
  const [currentStudent, setCurrentStudent] = useState("");

  // console.log("current student : ", currentStudent);

  const dispatch = useDispatch();
  const schoolInfo = useSelector((state) => state?.institute?.institute) || [];
  // console.log("schoolInfo : ", schoolInfo);
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");
  const schoolId = useSelector((state) => state?.auth?.schoolId);


  console.log("allStudents from direct: ", allStudents);





  const [input, setInput] = useState({
    paymentMethod: "",
    transactionNumber: "",
  });

  // Filtered Data
  const filteredData = allStudents?.filter((item) => {
    return (
      (searchClass === "" ||
        item?.className?.toLowerCase()?.includes(searchClass?.toLowerCase())) &&
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
  });

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${mainUrlApi.studentInfo.url}/${schoolId}`
      );

      // console.log("response from student fee  : ", response);

      if (response) {
        setAllStudents(response?.data?.data || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const dataLength = filteredData?.length;

  const fetchClassFeeStructure = async () => {
    try {
      const response = await axios.get(
        `${accountApi}/api/fees-structure/${currentStudent?.className}/${schoolId}`
      );

      // console.log("response : ", response);
      setClassFeeStructure(response?.data?.data || []);
    } catch (error) {
      // console.log("error : ", error);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };

  useEffect(() => {
    fetchClassFeeStructure();
  }, [currentStudent]);

  const handleSavePayment = async (
    currentStudent,
    classFeeStructure,
    input,
    setLoading,
    fetchStudentData,
    schoolInfo
  ) => {
    try {
      setLoading(true); // Disable button while submitting

      const payload = {
        admissionNumber: currentStudent?.admissionNumber,
        studentName: currentStudent?.studentName,
        className: currentStudent?.className,
        section: currentStudent?.section,
        admissionFees: classFeeStructure?.admission_Fees || 0,
        books: classFeeStructure?.books || 0,
        donation: classFeeStructure?.donation || 0,
        fine: classFeeStructure?.fine || 0,
        idCardCharges: classFeeStructure?.id_Card_Charges || 0,
        lateFees: classFeeStructure?.late_Fees || 0,
        miscellaneous: classFeeStructure?.miscellaneous || 0,
        transportationalFees: classFeeStructure?.transportationalFees || 0,
        tuitionFees: classFeeStructure?.tuitionFees || 0,
        uniformCharges: classFeeStructure?.uniform_Charges || 0,
        paymentMethod: input?.paymentMethod,
        transactionNumber: input?.transactionNumber,
        academicYear: currentStudent?.academicYear,
      };

      const transactionNumber = input.transactionNumber;
      const paymentMethod = input.paymentMethod;

      // console.log("payload : ", payload);
      const response = await axios.post(
        `${accountApi}/student-admission-fee/create/${schoolId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("response : ", response);
      toast.success(response?.data?.message || "Payment saved successfully!");

      if (response?.data?.message==="Student Admission Fee Created Successfully") {
        
        generatePaymentSlip(
          currentStudent,
          classFeeStructure,
          transactionNumber,
          paymentMethod,
          schoolInfo
        );

        setInput({
          paymentMethod: "",
          transactionNumber: "",
        });
        setTimeout(() => {
          fetchStudentData();
        }, 500);
      }
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save payment. Please try again."
      );
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = filteredData?.slice(
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

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col">
      <Label className="text-lg font-bold">{label}:</Label>
      <p className="text-lg font-semibold text-blue-600">{value}</p>
    </div>
  );

  const generatePaymentSlip = (
    student,
    feeStructure,
    transactionNumber,
    paymentMethod,
    schoolInfo
  ) => {
    const slipElement = document.createElement("div");
    slipElement.style.position = "absolute";
    slipElement.style.left = "-9999px";
    slipElement.style.width = "210mm"; // A4 width
    slipElement.style.padding = "20px";
    slipElement.style.fontFamily = "Arial, sans-serif";

    slipElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>${schoolInfo?.schoolName}</h2>
        <p>${schoolInfo?.schoolAddress}</p>
      </div>
      
      <h3 style="text-align: center; color: #2c3e50; margin-bottom: 25px;">PAYMENT RECEIPT</h3>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
        <div>
          <p><strong>Admission Number:</strong> ${student?.admissionNumber}</p>
          <p><strong>Student Name:</strong> ${student?.studentName}</p>
          <p><strong>Class:</strong> ${student?.className} (${
      student?.section
    })</p>
        </div>
        <div>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Receipt No:</strong> ${transactionNumber}</p>
        </div>
      </div>
  
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Fee Type</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries({
            "Tuition Fees": feeStructure.tuitionFees,
            "Admission Fees": feeStructure.admission_Fees,
            Books: feeStructure.books,
            Donation: feeStructure.donation,
            "ID Card": feeStructure.id_Card_Charges,
            Transportation: feeStructure.transportationalFees,
            Uniform: feeStructure.uniform_Charges,
            "Late Fees": feeStructure.late_Fees,
            Miscellaneous: feeStructure.miscellaneous,
            Fine: feeStructure.fine,
          })
            .map(
              ([key, value]) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">${key}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${value}</td>
              </tr>
            `
            )
            .join("")}
          <tr style="font-weight: bold;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">Total:</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₹${
              feeStructure.totalFees
            }</td>
          </tr>
        </tbody>
      </table>
  
      <div style="margin-top: 30px;">
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Transaction ID:</strong> ${transactionNumber}</p>
      </div>
  
      <div style="margin-top: 50px; text-align: right;">
        <p>Authorized Signature</p>
        <p style="border-top: 1px solid #000; width: 200px; margin-left: auto;"></p>
      </div>

      <div style="margin-top: 20px; text-align: center;">
        <p>Thank you for your payment!</p>
      </div>

      <div style="margin-top: 20px; text-align: center;">
        <p></p>For any queries, please contact ${schoolInfo?.schoolPhone} ${
      schoolInfo?.schoolEmail
    }</p>
      </div>

      <div style="margin-top: 20px; text-align: center;">
        <p></p></p>This is a system generated invoice no signature required.</p>
      </div>
    `;

    document.body.appendChild(slipElement);

    html2canvas(slipElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`payment_slip_${student.admissionNumber}.pdf`);
      document.body.removeChild(slipElement);
    });
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
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <Search className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Search Students</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-auto flex-1">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by class..."
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-md border ${
                  isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-200'
                } focus:outline-none focus:ring-2 ${
                  isDarkMode ? 'focus:ring-blue-500/50' : 'focus:ring-blue-500/50'
                }`}
              />
              {searchClass && (
                <button 
                  onClick={() => setSearchClass("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-auto flex-1">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by section..."
                value={searchSection}
                onChange={(e) => setSearchSection(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-md border ${
                  isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-200'
                } focus:outline-none focus:ring-2 ${
                  isDarkMode ? 'focus:ring-blue-500/50' : 'focus:ring-blue-500/50'
                }`}
              />
              {searchSection && (
                <button 
                  onClick={() => setSearchSection("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-auto flex-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Admission No. or Name..."
                value={searchAdmissionNumber}
                onChange={(e) => setSearchAdmissionNumber(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-md border ${
                  isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-200'
                } focus:outline-none focus:ring-2 ${
                  isDarkMode ? 'focus:ring-blue-500/50' : 'focus:ring-blue-500/50'
                }`}
              />
              {searchAdmissionNumber && (
                <button 
                  onClick={() => setSearchAdmissionNumber("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <Button
              className={`${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
              onClick={() => {
                setSearchClass("");
                setSearchSection("");
                setSearchAdmissionNumber("");
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Student Fee Collection Table Section */}
      <div className={`mt-6 mx-4 sm:mx-8 md:mx-14 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'
      }`}>
        {/* Page Header Section */}
        <div className={`flex justify-between items-center p-4 sm:p-6 border-b ${borderColor} bg-gradient-to-r ${
          isDarkMode ? 'from-[#1e293b] to-[#0f172a]' : 'from-white to-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <CreditCard className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Student Fee Collection
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <TourButton steps={studentFeeCollectionPageSteps} tourName="studentFeeCollectionPage-tour" />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading student records...</span>
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
                      Admission No.
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Student Name
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Class (Section)
                    </TableHead>
                    <TableHead className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Roll No
                    </TableHead>
                    <TableHead className={`px-4 py-3 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold text-sm uppercase tracking-wider`}>
                      Payment
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                
                  {paginatedData?.map((item, index) => (
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

                      {/* Admission Number */}
                      <TableCell className={`px-4 py-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                          isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {item.admissionNumber}
                        </span>
                      </TableCell>

                      {/* Student Name */}
                      <TableCell className={`px-4 py-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {item.studentName}
                      </TableCell>

                      {/* Class (Section) */}
                      <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                          isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.className} ({item.section})
                        </span>
                      </TableCell>

                      {/* Roll No */}
                      <TableCell className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.rollNo}
                        </span>
                      </TableCell>

                      {/* Payment Action */}
                        {item?.status === "pending" ? (
                      <TableCell className="px-4 py-3 text-right">
                        <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="default"
                                onClick={() => handleSelectStudent(item)}
                                className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-md px-4 py-2`}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Add Payment
                              </Button>
                            </DialogTrigger>

                            <DialogContent className={`w-full max-w-[95%] md:max-w-[85%] lg:max-w-[75%] xl:max-w-[65%] 2xl:max-w-[55%] p-4 md:p-6 rounded-lg shadow-lg border ${
                              isDarkMode ? 'bg-[#1e293b] border-[rgba(193,193,193,0.2)] text-white' : 'bg-white border-slate-200'
                            }`}>
                              <DialogHeader>
                                <DialogTitle className={`text-xl font-semibold border-b pb-3 ${
                                  isDarkMode ? 'text-white border-[rgba(193,193,193,0.2)]' : 'text-gray-900 border-slate-200'
                                }`}>
                                  Add Payment Details
                                </DialogTitle>
                              </DialogHeader>

                              <div className="overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
                                {/* Student Details Section */}
                                <div className={`p-4 rounded-lg shadow-sm ${
                                  isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-100'
                                }`}>
                                  <h2 className={`text-lg font-semibold text-center border-b pb-2 ${
                                    isDarkMode ? 'text-blue-400 border-[rgba(193,193,193,0.2)]' : 'text-gray-700 border-gray-300'
                                  }`}>
                                    Student Details
                                  </h2>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 py-4">
                                    <InfoRow
                                      label="Admission Number"
                                      value={currentStudent?.admissionNumber}
                                    />
                                    <InfoRow
                                      label="Student's Name"
                                      value={currentStudent?.studentName}
                                    />
                                    <InfoRow
                                      label="Class"
                                      value={currentStudent?.className}
                                    />
                                    <InfoRow
                                      label="Section"
                                      value={currentStudent?.section}
                                    />
                                  </div>
                                </div>

                                {/* Payment Details Section */}
                                <div className={`p-4 rounded-lg shadow-sm mt-4 ${
                                  isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-100'
                                }`}>
                                  <h2 className={`text-lg font-semibold text-center border-b pb-2 ${
                                    isDarkMode ? 'text-blue-400 border-[rgba(193,193,193,0.2)]' : 'text-gray-700 border-gray-300'
                                  }`}>
                                    Payment Details
                                  </h2>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 py-4">
                                    <InfoRow
                                      label="Admission Fee"
                                      value={classFeeStructure?.admission_Fees}
                                    />
                                    <InfoRow
                                      label="Tuition Fee"
                                      value={classFeeStructure?.tuitionFees}
                                    />
                                    <InfoRow
                                      label="Donation Fee"
                                      value={classFeeStructure?.donation}
                                    />
                                    <InfoRow
                                      label="Books Fee"
                                      value={classFeeStructure?.books}
                                    />
                                    <InfoRow
                                      label="ID Card Fee"
                                      value={classFeeStructure?.id_Card_Charges}
                                    />
                                    <InfoRow
                                      label="Late Fee"
                                      value={classFeeStructure?.late_Fees}
                                    />
                                    <InfoRow
                                      label="Fine Fee"
                                      value={classFeeStructure?.fine}
                                    />
                                    <InfoRow
                                      label="Transport Fee"
                                      value={classFeeStructure?.transportationalFees}
                                    />
                                    <InfoRow
                                      label="Miscellaneous Fee"
                                      value={classFeeStructure?.miscellaneous}
                                    />
                                    <InfoRow
                                      label="Uniform Charges"
                                      value={classFeeStructure?.uniform_Charges}
                                    />
                                    <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-3 mt-2 pt-2 border-t">
                                      <Label className="text-lg font-bold">
                                        Total Amount:
                                      </Label>
                                      <p className="text-xl font-bold text-blue-700">
                                        ₹{classFeeStructure?.totalFees || 
                                          (classFeeStructure?.admission_Fees || 0) +
                                          (classFeeStructure?.tuitionFees || 0) +
                                          (classFeeStructure?.donation || 0) +
                                          (classFeeStructure?.books || 0) +
                                          (classFeeStructure?.id_Card_Charges || 0) +
                                          (classFeeStructure?.late_Fees || 0) +
                                          (classFeeStructure?.fine || 0) +
                                          (classFeeStructure?.transportationalFees || 0) +
                                          (classFeeStructure?.miscellaneous || 0) +
                                          (classFeeStructure?.uniform_Charges || 0)
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Form moved inside DialogContent */}
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSavePayment(
                                      currentStudent,
                                      classFeeStructure,
                                      input,
                                      setLoading,
                                      fetchStudentData,
                                      schoolInfo
                                    );
                                  }}
                                  className="space-y-6 mt-4"
                                >
                                  {/* Payment Method Selection */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                      <Label className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                                        Select a Payment Method{" "}
                                        <sup className="text-red-600">*</sup>
                                      </Label>
                                      <Select
                                        onValueChange={(e) =>
                                          setInput({ ...input, paymentMethod: e })
                                        }
                                        required
                                      >
                                        <SelectTrigger className={`w-full ${
                                          isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-300'
                                        } shadow-sm`}>
                                          <SelectValue placeholder="Select a method" />
                                        </SelectTrigger>
                                        <SelectContent className={isDarkMode ? 'bg-[#1e293b] text-white' : ''}>
                                          <SelectGroup>
                                            <SelectLabel>Payment Methods</SelectLabel>
                                            <SelectItem value="online">Online</SelectItem>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="card">Card</SelectItem>
                                            <SelectItem value="cheque">Cheque</SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                      <Label className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                                        Transaction ID or Receipt No{" "}
                                        <sup className="text-red-600">*</sup>
                                      </Label>
                                      <Input
                                        required
                                        type="text"
                                        value={input?.transactionNumber}
                                        id="transactionNumber"
                                        name="transactionNumber"
                                        onChange={(e) =>
                                          setInput({
                                            ...input,
                                            transactionNumber: e.target.value,
                                          })
                                        }
                                        className={`${
                                          isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white border-gray-300'
                                        } shadow-sm px-3 py-2 rounded-md`}
                                      />
                                    </div>
                                  </div>

                                  {/* Save Button */}
                                  <DialogFooter className="mt-4 pt-2 border-t">
                                    {loading ? (
                                      <Button
                                        className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold px-4 py-2 rounded-md`}
                                        disabled
                                      >
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                      </Button>
                                    ) : (
                                      <Button
                                        type="submit"
                                        className={`${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold px-4 py-2 rounded-md`}
                                      >
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Save Payment
                                      </Button>
                                    )}
                                  </DialogFooter>
                                </form>
                              </div>
                            </DialogContent>
                          </Dialog>
                        
                        </TableCell>
                    ) : (
                      <TableCell className="px-4 py-3 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                        }`}>
                          Paid
                        </span>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* No data state */}
          {filteredData.length === 0 && !loading && (
            <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No Students Found</h3>
              <p className="mt-2">
                {searchClass || searchSection || searchAdmissionNumber 
                  ? "Try adjusting your search filters" 
                  : "Add students to start collecting fees"}
              </p>
            </div>
          )}

          {/* Pagination Section */}
          {filteredData.length > 0 && !loading && (
            <div className={`p-4 border-t ${borderColor}`}>
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

export default StudentFeeCollectionPage;

