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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

import { useSelector } from "react-redux";
import { Calendar1, EyeIcon, Search } from "lucide-react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ClipboardList,
  User,
  Book,
  DollarSign,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { FaBook, FaMoneyBill } from "react-icons/fa";
import {
  AttachMoney,
  MonetizationOn,
  Money,
  MoneyOffCsred,
  MoneyOffCsredOutlined,
  MoneyOutlined,
  MoneyTwoTone,
} from "@mui/icons-material";
import {
  FaMoneyBill1,
  FaMoneyBill1Wave,
  FaMoneyBillWheat,
} from "react-icons/fa6";
import { PiMoneyWavyLight } from "react-icons/pi";
import { RiMoneyCnyCircleLine } from "react-icons/ri";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { accountApi } from "@/common/main";
import TourButton from "@/components/Tour/TourButton";
import { tuitionFeeCollectionPageSteps } from "@/components/Tour/Steps/AccountsSteps/Step";

const Badge = ({ children, variant = "default", className = "" }) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-[#452B90] text-white",
    // outline: "border border-gray-300 text-gray-700 dark:border-red-600 dark:text-red-300",
    outline:  "bg-[#452B90] text-white",
    destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 dark:border dark:border-red-800/30",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:border dark:border-green-800/30",
  };
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};


const TuitionFeesCollectionPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [classFeeStructure, setClassFeeStructure] = useState([]);
  const [currentStudent, setCurrentStudent] = useState("");
  const schoolInfo = useSelector((state) => state?.institute?.institute) || [];
  const schoolId = useSelector((state)=>state?.auth?.schoolId);

  // Search states
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");
  const [paymentSaved, setPaymentSaved] = useState(false);
  const [paymentSlipUrl, setPaymentSlipUrl] = useState(null);

  const [input, setInput] = useState({
    fee: 0,
    paymentType: "",
    transactionNo: "",
  });

  // ... existing code ...

  const closePaymentDialog = () => {
    setPaymentSaved(false);
    if (paymentSlipUrl) {
      URL.revokeObjectURL(paymentSlipUrl);
      setPaymentSlipUrl(null);
    }
  };

  const saveTutionFees = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${accountApi}/student-admission-fee/add-tuition-payment/${currentStudent?.id}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        response?.data?.message || "Tuition fees saved successfully"
      );

      if (response?.data?.message==="Tuition Fee Payment Added Successfully") {
        fetchAdmissionFeeDone();

        // Dummy dynamic data (Replace with actual API data if available)
        const schoolDetails = {
          name: `${schoolInfo?.schoolName}`,
          address: `${schoolInfo?.schoolAddress}`,
          contact: `Phone: +91 ${schoolInfo?.schoolPhone} | Email: ${schoolInfo?.schoolEmail}`,
        };

        // Generate PDF using jsPDF
        const doc = new jsPDF({ format: "a4" });

        // Add School Name & Address (Dynamic)
        doc.setFontSize(16);
        doc.text(schoolDetails.name, 105, 10, { align: "center" });
        doc.setFontSize(12);
        doc.text(schoolDetails.address, 105, 18, { align: "center" });
        doc.text(schoolDetails.contact, 105, 26, { align: "center" });

        // Add Title
        doc.setFontSize(18);
        doc.text("Tuition Fees Payment Slip", 105, 40, { align: "center" });

        // Student Details
        const studentDetails = [
          ["Name", currentStudent?.studentName || "N/A"],
          ["Admission Number", currentStudent?.admissionNumber || "N/A"],
          [
            "Class",
            `${currentStudent?.className || "N/A"} (${
              currentStudent?.section || "N/A"
            })`,
          ],
        ];

        // ... rest of PDF generation code ...

        // Payment Details
        const paymentDate = new Date().toLocaleDateString("en-GB");
        const paymentDetails = [
          ["Payment Amount", ` ${input?.fee || "0"}`],
          ["Payment Type", input?.paymentType || "N/A"],
          ["Transaction Number", input?.transactionNo || "N/A"],
          ["Date", paymentDate],
        ];

        // Add Student Details Table
        doc.setFontSize(14);
        doc.text("Student Details", 10, 50);
        doc.setFontSize(12);
        doc.autoTable({
          body: studentDetails,
          startY: 55,
          styles: { halign: "left", cellPadding: 3, lineWidth: 0.1 },
          columnStyles: { 0: { fontStyle: "bold" } },
        });

        // Payment Details Table
        const paymentHeaderY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text("Payment Details", 10, paymentHeaderY);
        doc.setFontSize(12);
        doc.autoTable({
          body: paymentDetails,
          startY: paymentHeaderY + 5,
          styles: { halign: "left", cellPadding: 3, lineWidth: 0.1 },
          columnStyles: { 0: { fontStyle: "bold" } },
        });

        // Footer: School Contact Details (Dynamic)
        doc.setFontSize(10);
        doc.text(schoolDetails.contact, 105, 280, { align: "center" });

        // Footer: System-generated Invoice Message
        doc.setFontSize(10);
        doc.text(
          "This is a system-generated invoice. No signature required.",
          105,
          290,
          { align: "center" }
        );

        // Generate and download PDF
        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Tuition_fee_payment_slip.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setPaymentSaved(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ... existing code ...

  // Filtered Data
  const filteredData = classFeeStructure?.filter((item) => {
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

  const dataLength = filteredData?.length;

  const fetchAdmissionFeeDone = async () => {
    try {
      const response = await axios.get(
        `${accountApi}/student-admission-fee/all/${schoolId}`
      );

      if (response) {
        setClassFeeStructure(response?.data?.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };

  useEffect(() => {
    fetchAdmissionFeeDone();
  }, []);

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
    setPaymentSaved(false);
  };

  return (
    <div className={`${theme === "light" ? "bg-[#0f172a] text-white" : "light"} min-h-screen pb-8`}>
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-6 mt-4">
          <h1 className={`text-2xl md:text-3xl font-bold ${theme === "light" ? "text-white" : "text-gray-800"}`}>
            Tuition Fee Collection
          </h1>
          <p className={`mt-2 ${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
            Manage and track student tuition fee payments
          </p>
        </div>

        {/* Search Card */}
        <Card className={`mb-6 ${theme === "light" ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
            <div className={`p-2 rounded-full ${theme === "light" ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <Search className={`h-5 w-5 ${theme === "light" ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold ${theme === "light" ? 'text-white' : 'text-black'}`}>Search Students</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="searchClass" className={theme === "light" ? "text-gray-200" : ""}>Class</Label>
                <div className="relative">
                  <Input
                    id="searchClass"
                    placeholder="Search by class"
                    value={searchClass}
                    onChange={(e) => setSearchClass(e.target.value)}
                    className={`pl-3 ${theme === "light" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" : ""}`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="searchSection" className={theme === "light" ? "text-gray-200" : ""}>Section</Label>
                <div className="relative">
                  <Input
                    id="searchSection"
                    placeholder="Search by section"
                    value={searchSection}
                    onChange={(e) => setSearchSection(e.target.value)}
                    className={`pl-3 ${theme === "light" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" : ""}`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="searchAdmission" className={theme === "light" ? "text-gray-200" : ""}>Student</Label>
                <div className="relative">
                  <Input
                    id="searchAdmission"
                    placeholder="Admission Number or Name"
                    value={searchAdmissionNumber}
                    onChange={(e) => setSearchAdmissionNumber(e.target.value)}
                    className={`pl-3 ${theme === "light" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" : ""}`}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <TourButton
                steps={tuitionFeeCollectionPageSteps}
                tourName={"tuitionFeesCollectionPage-tour"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className={`${theme === "light" ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-slate-200'}`}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className={`${theme === "light" ? 'text-white' : 'text-black'} text-xl font-bold`}>
              Student's Tuition Fee Collection
            </CardTitle>
            <Badge variant={theme === "light" ? "secondary" : "secondary"} className="ml-2">
              {dataLength} Records
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className={`w-full ${theme === "light" ? "text-gray-200" : ""}`}>
                <TableHeader className={theme === "light" ? "bg-[#0f172a]" : "bg-gray-50"}>
                  <TableRow>
                    {[
                      "S.No",
                      "Admission Number",
                      "Student Name",
                      "Class (Section)",
                      "Remaining Fees",
                      "Actions",
                    ].map((header, index) => (
                      <TableHead
                        key={index}
                        className={`py-3 ${
                          theme === "light" ? "text-gray-200" : "text-gray-700"
                        } ${header === "Actions" ? "text-right" : "text-left"}`}
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData?.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={`${
                          theme === "light" 
                            ? "border-gray-700 hover:bg-gray-600" 
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <TableCell className="font-medium">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{item.admissionNumber}</TableCell>
                        <TableCell>{item.studentName}</TableCell>
                        <TableCell>
                          {item.className} ({item.section})
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.remainingFee > 0 ? "destructive" : "success"}
                            className={`${
                              item.remainingFee > 0 
                                ? "bg-red-100 text-red-800" 
                                : "bg-green-100 text-green-800"
                            } ${theme === "light" ? "border border-gray-600" : ""}`}
                          >
                            ₹ {item.remainingFee}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                          <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`${
                                    theme === "light" 
                                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600" 
                                      : ""
                                  }`}
                                  onClick={() => handleSelectStudent(item)}
                                >
                                  <EyeIcon className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className={`w-full max-w-[95%] md:max-w-[85%] lg:max-w-[75%] xl:max-w-[65%] 2xl:max-w-[55%] p-4 md:p-6 ${theme === "light" ? 'bg-[#1e293b] border-[rgba(193,193,193,0.2)] text-white' : 'bg-white border-slate-200'}`}>
                                <DialogHeader>
                                  <DialogTitle className={`text-xl font-semibold border-b pb-3 flex items-center gap-2 ${theme === "light" ? "text-white border-gray-700" : "text-gray-900"}`}>
                                    <ClipboardList className="w-6 h-6 text-blue-600" />
                                    Student Fee Details
                                  </DialogTitle>
                                </DialogHeader>

                                <div className="overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="space-y-4"
                                  >
                                    {/* Student Details Section */}
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 rounded-lg ${theme === "light" ? "bg-[#0f172a]" : "bg-gray-50"}`}>
                                      <div className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-indigo-600" />
                                        <p>
                                          <strong>Student:</strong>{" "}
                                          {currentStudent?.studentName}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Book className="w-5 h-5 text-green-600" />
                                        <p>
                                          <strong>Class:</strong>{" "}
                                          {currentStudent?.className} -{" "}
                                          {currentStudent?.section}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <BadgeCheck className="w-5 h-5 text-purple-600" />
                                        <p>
                                          <strong>Admission No:</strong>{" "}
                                          {currentStudent?.admissionNumber}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <BadgeCheck className="w-5 h-5 text-purple-600" />
                                        <p>
                                          <strong>Academic Year :</strong>{" "}
                                          {currentStudent?.academicYear || "Not provided"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <p>
                                          <strong>Payment Method:</strong>{" "}
                                          {currentStudent?.paymentType || "N/A"}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Fee Details Section */}
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 rounded-lg ${theme === "light" ? "bg-[#0f172a]" : "bg-gray-50"}`}>
                                      <h3 className="col-span-1 md:col-span-2 font-semibold text-lg flex items-center gap-2">
                                        <FaMoneyBill className="text-green-600" />
                                        Admission Fee Details
                                      </h3>

                                      <div className="flex items-center gap-2">
                                        <FaBook className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong>Books Cost: </strong> ₹{" "}
                                          {currentStudent?.books || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <AttachMoney className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong>Donation: </strong> ₹{" "}
                                          {currentStudent?.donation || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <RiMoneyCnyCircleLine className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong>Fine: </strong> ₹{" "}
                                          {currentStudent?.fine || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <PiMoneyWavyLight className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong>Late Fees: </strong> ₹{" "}
                                          {currentStudent?.lateFees || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <FaMoneyBillWheat className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong>Miscellaneous: </strong> ₹{" "}
                                          {currentStudent?.miscellaneous || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <FaMoneyBill1Wave className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong> Admission Fee: </strong> ₹{" "}
                                          {currentStudent?.admissionFees || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <FaMoneyBill1 className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong>Id Card Charges: </strong> ₹{" "}
                                          {currentStudent?.idCardCharges || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <MoneyOffCsredOutlined className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong>Transport Charges: </strong> ₹{" "}
                                          {currentStudent?.transportationalFees || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <MonetizationOn className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong>Uniform Charges: </strong> ₹{" "}
                                          {currentStudent?.uniformCharges || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <MonetizationOn className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong>Other Charges: </strong> ₹{" "}
                                          {currentStudent?.other || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <FaMoneyBill className="w-5 h-5 text-gray-600" />
                                        <p>
                                          <strong>Total Admission Fee: </strong> ₹{" "}
                                          {currentStudent?.miscellaneous || "N/A"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <p>
                                          <strong>Admission Fee Status:</strong> Paid
                                        </p>
                                      </div>
                                    </div>

                                    {/* Tuition Fee History */}
                                    <div className={`p-4 rounded-lg ${theme === "light" ? "bg-[#0f172a]" : "bg-gray-50"}`}>
                                      <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                                        <Calendar1 className="text-blue-600" />
                                        Tuition Fees History
                                      </h3>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                                        <div className="flex items-center gap-2">
                                          <Money className="w-5 h-5 text-gray-600" />
                                          <p>
                                            <strong>Yearly Tuition Fees: </strong> ₹{" "}
                                            {currentStudent?.yearFees || "N/A"}
                                          </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <FaMoneyBill className="w-5 h-5 text-gray-600" />
                                          <p>
                                            <strong>Paid Tuition Fees : </strong> ₹{" "}
                                            {currentStudent?.tuitionFees || "N/A"}
                                          </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <DollarSign className="w-5 h-5 text-red-600" />
                                          <p>
                                            <strong>Remaining Tuition Fees:</strong> ₹
                                            {currentStudent?.remainingFee}
                                          </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                          {currentStudent?.status === "Pending" ? (
                                            <XCircle className="w-5 h-5 text-red-600" />
                                          ) : (
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                          )}
                                          <p>
                                            <strong>Tuition Fee Status:</strong>{" "}
                                            <Badge variant={currentStudent?.status === "Pending" ? "destructive" : "success"}>
                                              {currentStudent?.status}
                                            </Badge>
                                          </p>
                                        </div>
                                      </div>
                                      
                                      {/* Payment History */}
                                      <div className="mt-4">
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                          <Calendar1 className="w-4 h-4 text-gray-600" />
                                          <strong>All tuition fee submissions: </strong>
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                          {currentStudent?.tuitionFeePayments?.length > 0 ? (
                                            currentStudent?.tuitionFeePayments?.map((item, index) => (
                                              <div
                                                key={index}
                                                className={`border p-3 rounded-lg ${
                                                  theme === "light" 
                                                    ? "border-gray-700 bg-[#0f172a]" 
                                                    : "border-gray-200 bg-white"
                                                }`}
                                              >
                                                <div className="flex justify-between items-center mb-2">
                                                  <Badge variant="outline">
                                                    {new Date(item?.createdAt).toLocaleDateString("en-GB")}
                                                  </Badge>
                                                  <Badge variant="secondary">
                                                    ₹ {item?.fee}
                                                  </Badge>
                                                </div>
                                                <p className="text-sm">
                                                  <strong>Payment Type:</strong>{" "}
                                                  {item?.paymentType}
                                                </p>
                                                <p className="text-sm truncate">
                                                  <strong>Transaction:</strong>{" "}
                                                  {item?.transactionNo}
                                                </p>
                                              </div>
                                            ))
                                          ) : (
                                            <p className="col-span-3 text-center text-gray-500">No payment history available</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {item?.status === "Pending" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => handleSelectStudent(item)}
                                  >
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Pay
                                  </Button>
                                </DialogTrigger>

                                <DialogContent className={`sm:max-w-[500px] p-6 ${theme === "light" ? 'bg-[#1e293b] border-[rgba(193,193,193,0.2)] text-white' : 'bg-white border-slate-200'}`}>
                                  <DialogHeader>
                                    <DialogTitle className={`text-xl font-semibold border-b pb-3 ${theme === "light" ? "text-white border-gray-700" : "text-gray-900"}`}>
                                      {paymentSaved
                                        ? "Payment Saved"
                                        : "Add Payment Details"}
                                    </DialogTitle>
                                  </DialogHeader>

                                  {paymentSaved ? (
                                    <div className="mt-4 space-y-4">
                                      <div className={`p-4 rounded-lg text-center ${theme === "light" ? "bg-[#2a2a2a]" : "bg-green-50"}`}>
                                        <div className="flex justify-center mb-4">
                                          <CheckCircle className="h-16 w-16 text-green-500" />
                                        </div>
                                        <h3 className={`text-xl font-medium mb-2 ${theme === "light" ? "text-white" : "text-green-800"}`}>
                                          Payment Successful!
                                        </h3>
                                        <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
                                          The payment has been recorded successfully and a receipt has been generated.
                                        </p>
                                      </div>
                                      
                                      <div className="flex justify-end gap-2 mt-4">
                                        <Button 
                                          variant="outline" 
                                          onClick={closePaymentDialog}
                                          className={theme === "light" ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700" : ""}
                                        >
                                          Close
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <form onSubmit={saveTutionFees} className="mt-4 space-y-4">
                                      <div className={`p-4 rounded-lg ${theme === "light" ? "bg-[#0f172a]" : "bg-gray-50"}`}>
                                        <div className="grid grid-cols-1 gap-4">
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <Label htmlFor="studentName" className={theme === "light" ? "text-gray-200" : ""}>
                                                Student Name
                                              </Label>
                                              <Badge variant={theme === "light" ? "outline" : "secondary"}>
                                                {currentStudent?.className} ({currentStudent?.section})
                                              </Badge>
                                            </div>
                                            <Input
                                              id="studentName"
                                              value={currentStudent?.studentName || ""}
                                              disabled
                                              className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-100"}`}
                                            />
                                          </div>
                                          
                                          <div className="space-y-2">
                                            <Label htmlFor="admissionNumber" className={theme === "light" ? "text-gray-200" : ""}>
                                              Admission Number
                                            </Label>
                                            <Input
                                              id="admissionNumber"
                                              value={currentStudent?.admissionNumber || ""}
                                              disabled
                                              className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-100"}`}
                                            />
                                          </div>
                                          
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <Label htmlFor="remainingFee" className={theme === "light" ? "text-gray-200" : ""}>
                                                Remaining Fee
                                              </Label>
                                              <Badge variant="destructive">
                                                ₹ {currentStudent?.remainingFee || 0}
                                              </Badge>
                                            </div>
                                            <Input
                                              id="remainingFee"
                                              value={`₹ ${currentStudent?.remainingFee || 0}`}
                                              disabled
                                              className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-100"}`}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className={`p-4 rounded-lg ${theme === "light" ? "bg-[#0f172a]" : "bg-gray-50"}`}>
                                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                          <DollarSign className="h-5 w-5 text-green-600" />
                                          Payment Details
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 gap-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="fee" className={theme === "light" ? "text-gray-200" : ""}>
                                              Payment Amount (₹)
                                            </Label>
                                            <Input
                                              id="fee"
                                              type="number"
                                              placeholder="Enter amount"
                                              value={input.fee}
                                              onChange={(e) => setInput({ ...input, fee: e.target.value })}
                                              required
                                              min="1"
                                              max={currentStudent?.remainingFee || 0}
                                              className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" : ""}`}
                                            />
                                            <p className={`text-xs ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
                                              Maximum amount: ₹ {currentStudent?.remainingFee || 0}
                                            </p>
                                          </div>
                                          
                                          <div className="space-y-2">
                                            <Label htmlFor="paymentType" className={theme === "light" ? "text-gray-200" : ""}>
                                              Payment Method
                                            </Label>
                                            <Select
                                              value={input.paymentType}
                                              onValueChange={(value) => setInput({ ...input, paymentType: value })}
                                              required
                                            >
                                              <SelectTrigger className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-white" : ""}`}>
                                                <SelectValue placeholder="Select payment method" />
                                              </SelectTrigger>
                                              <SelectContent className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-white" : ""}`}>
                                                <SelectGroup>
                                                  <SelectLabel className={theme === "light" ? "text-gray-300" : ""}>
                                                    Payment Methods
                                                  </SelectLabel>
                                                  <SelectItem value="Cash">Cash</SelectItem>
                                                  <SelectItem value="UPI">UPI</SelectItem>
                                                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                                  <SelectItem value="Cheque">Cheque</SelectItem>
                                                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                                                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          
                                          <div className="space-y-2">
                                            <Label htmlFor="transactionNo" className={theme === "light" ? "text-gray-200" : ""}>
                                              Transaction Reference
                                            </Label>
                                            <Input
                                              id="transactionNo"
                                              placeholder="Enter transaction reference"
                                              value={input.transactionNo}
                                              onChange={(e) => setInput({ ...input, transactionNo: e.target.value })}
                                              required
                                              className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" : ""}`}
                                            />
                                            <p className={`text-xs ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
                                              For cash payments, you can enter "Cash Payment" or receipt number
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <DialogFooter>
                                        <Button 
                                          type="button" 
                                          variant="outline" 
                                          onClick={closePaymentDialog}
                                          className={theme === "light" ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700" : ""}
                                        >
                                          Cancel
                                        </Button>
                                        <Button 
                                          type="submit" 
                                          disabled={loading || !input.fee || !input.paymentType || !input.transactionNo}
                                          className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                          {loading ? (
                                            <>
                                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                              </svg>
                                              Processing...
                                            </>
                                          ) : (
                                            <>Save Payment</>
                                          )}
                                        </Button>
                                      </DialogFooter>
                                    </form>
                                  )}
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className={`p-3 rounded-full ${theme === "light" ? "bg-gray-800" : "bg-gray-100"}`}>
                            <Search className={`h-6 w-6 ${theme === "light" ? "text-gray-400" : "text-gray-500"}`} />
                          </div>
                          <h3 className="font-medium text-lg">No records found</h3>
                          <p className={`text-sm ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
                            Try adjusting your search criteria or clear filters
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {paginatedData?.length > 0 && (
              <div className={`mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === "light" ? "text-gray-200" : ""}`}>
                <div className="flex items-center gap-2">
                  <Label htmlFor="rowsPerPage" className="text-sm">Rows per page:</Label>
                  <Select
                    value={rowsPerPage.toString()}
                    onValueChange={(value) => handleRowsPerPageChange(Number(value))}
                  >
                    <SelectTrigger id="rowsPerPage" className={`w-[80px] h-8 ${theme === "light" ? "bg-gray-800 border-gray-700" : ""}`}>
                      <SelectValue placeholder={rowsPerPage} />
                    </SelectTrigger>
                    <SelectContent className={theme === "light" ? "bg-gray-800 border-gray-700 text-white" : ""}>
                      {[5, 10, 25, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Previous
                  </Button>
                  
                  <span className="mx-2">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""} ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`${theme === "light" ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""} ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Last
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

    
  );
};

export default TuitionFeesCollectionPage;