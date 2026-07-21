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

import { useSelector } from "react-redux";
import { Calendar1, EyeIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ClipboardList,
  User,
  Book,
  DollarSign,
  CheckCircle,
  XCircle,
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

const TuitionFeesCollectionPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [classFeeStructure, setClassFeeStructure] = useState([]);
  const [currentStudent, setCurrentStudent] = useState("");
  const schoolInfo = useSelector((state) => state?.institute?.institute) || [];
  const schoolId = useSelector((state)=>state?.auth?.schoolId);

  // console.log("current : ",currentStudent)
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

  const closePaymentDialog = () => {
    setPaymentSaved(false);
    if (paymentSlipUrl) {
      URL.revokeObjectURL(paymentSlipUrl);
      setPaymentSlipUrl(null);
    }
  };

  const saveTutionFees = async (e) => {
    e.preventDefault();
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
      if (response) {
        toast.success(
          response?.data?.message || "Tuition fees saved successfully"
        );

        // Dummy dynamic data (Replace with actual API data if available)
        const schoolDetails = {
          // name: "XYZ Public School",
          name: `${schoolInfo?.schoolName}`,
          // address: "123 Main Street, City, State - 123456",
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
          columnStyles: { 0: { fontStyle: "bold" } }, // Make labels bold
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
      // console.log("error : ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

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

      // console.log("response from tuition fee : ", response);
      if (response) {
        setClassFeeStructure(response?.data?.data);
      }
    } catch (error) {
      // console.log("error : ", error);
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
    <div className={` ${theme === "light" ? "dark" : "light"} h-[100vh]`}>
      <div>
        {/* Search Inputs */}
        <div
          className={`mt-4 flex items-center mx-4 sm:mx-14 gap-4 h-20 ${
            theme === "light" ? "bg-[#212121] text-white" : "bg-white"
          }`}
        >
          <p className="text-2xl font-semibold ml-2 hidden sm:block">
            Search Student
          </p>
          <input
            type="text"
            placeholder="Search by class"
            className="border border-gray-300 rounded-md px-4 py-2 placeholder:text-sm ml-2"
            value={searchClass}
            onChange={(e) => setSearchClass(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by section"
            className="border border-gray-300 rounded-md px-4 py-2 placeholder:text-sm"
            value={searchSection}
            onChange={(e) => setSearchSection(e.target.value)}
          />
          <input
            type="text"
            placeholder="Admission Number or Name"
            className="border border-gray-300 rounded-md px-4 py-2 placeholder:text-sm"
            value={searchAdmissionNumber}
            onChange={(e) => setSearchAdmissionNumber(e.target.value)}
          />
        </div>

        {/* for table and add new botton  */}
        <div
          className={`mt-4 font-poppins border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)]"
              : " border-slate-200 bg-white"
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
              <span className="text-[1rem] sm:text-[1.5rem] font-bold font-poppins">
                Student's Tuition Fee Collection
              </span>
            </div>
          </div>

          {/* Table */}
          <Table className="table-auto w-full border-collapse border border-slate-200">
            <TableHeader
              className={`bg-gray-100 text-left ${
                theme === "light" ? "bg-[#212121]" : "light"
              }`}
            >
              <TableRow>
                {[
                  "S.No",
                  "Admission Number",
                  "Student Name",
                  "Class (Section)",
                  "Remaning Tuition Fees",
                  "View",
                  "Payment",
                ].map((header, index) => (
                  <TableHead
                    key={index}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold  ${
                      header === "Payment"
                        ? "text-right hidden sm:table-cell"
                        : "text-left"
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
                  className={`hover:bg-gray-50 border ${
                    theme === "light"
                      ? "border-[rgba(193,193,193,0.3)]"
                      : "border-slate-200"
                  }`}
                >
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.admissionNumber}
                  </TableCell>

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.studentName}
                  </TableCell>

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.className} ({item.section})
                  </TableCell>

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.remainingFee}
                  </TableCell>

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <EyeIcon
                          className="text-blue-600 cursor-pointer"
                          onClick={() => handleSelectStudent(item)}
                        />
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[60%] p-6 bg-white rounded-lg shadow-lg border">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold text-gray-900 border-b pb-3 flex items-center gap-2">
                            <ClipboardList className="w-6 h-6 text-blue-600" />
                            Student Fee Details
                          </DialogTitle>
                        </DialogHeader>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="space-y-4 text-gray-800"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <p>
                                <strong>Payment Method:</strong>{" "}
                                {currentStudent?.paymentType || "N/A"}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-5 h-5 text-blue-900" />
                              <p>
                                <strong>Transaction ID:</strong>{" "}
                                {currentStudent?.transactionNumber || "N/A"}
                              </p>
                            </div>

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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4 ">
                            <div className="">
                              <h3>Tuition Fees History</h3>
                            </div>

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
                                {currentStudent?.status}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p>
                              <div className="flex gap-2">
                                <Calendar1 className="w-5 h-5 text-gray-600" />
                                <strong>All tution fee submission: </strong>
                              </div>
                              <div className="mt-2 gap-2 flex flex-wrap">
                                {currentStudent?.tuitionFeePayments?.map(
                                  (item, index) => (
                                    <div
                                      key={index}
                                      className="border p-2 rounded mb-2 "
                                    >
                                      <p>
                                        <strong>Fee:</strong> ₹ {item?.fee}
                                      </p>
                                      <p>
                                        <strong>Payment Type:</strong>{" "}
                                        {item?.paymentType}
                                      </p>
                                      <p>
                                        <strong>Transaction No:</strong>{" "}
                                        {item?.transactionNo}
                                      </p>
                                      <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(
                                          item?.createdAt
                                        ).toLocaleDateString("en-GB")}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </p>
                          </div>
                        </motion.div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                  {item?.status === "Pending" ? (
                    <TableCell
                      className={`px-4 py-2 border text-right ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      } hidden sm:table-cell `}
                    >
                      <div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              onClick={() => handleSelectStudent(item)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
                            >
                              Add Payment
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-[45%] p-6 bg-white rounded-lg shadow-lg border">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-semibold text-gray-900 border-b pb-3">
                                {paymentSaved
                                  ? "Payment Saved"
                                  : "Add Payment Details"}
                              </DialogTitle>
                            </DialogHeader>

                            {paymentSaved ? (
                              <div className="space-y-4">
                                <p>
                                  Payment saved successfully and slip
                                  downloaded.
                                </p>
                                <Button
                                  variant="secondary"
                                  className="mt-4"
                                  onClick={closePaymentDialog}
                                >
                                  Close
                                </Button>
                              </div>
                            ) : (
                              <form
                                className="space-y-6"
                                onSubmit={saveTutionFees}
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="flex flex-col gap-2">
                                    <Label>
                                      Tuition Fees{" "}
                                      <sup className="text-red-600">*</sup>
                                    </Label>
                                    <Input
                                      required
                                      type="number"
                                      value={input?.fee}
                                      id="fee"
                                      name="fee"
                                      onChange={(e) =>
                                        setInput({
                                          ...input,
                                          fee: e.target.value,
                                        })
                                      }
                                      className="border-gray-300 shadow-sm px-3 py-2 rounded-md"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Label>
                                      Select a Payment Method{" "}
                                      <sup className="text-red-600">*</sup>
                                    </Label>
                                    <Select
                                      onValueChange={(e) =>
                                        setInput({ ...input, paymentType: e })
                                      }
                                      required
                                    >
                                      <SelectTrigger className="w-full border-gray-300 shadow-sm">
                                        <SelectValue placeholder="Select a method" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>
                                            Payment Methods
                                          </SelectLabel>
                                          <SelectItem value="online">
                                            Online
                                          </SelectItem>
                                          <SelectItem value="cash">
                                            Cash
                                          </SelectItem>
                                          <SelectItem value="card">
                                            Card
                                          </SelectItem>
                                          <SelectItem value="cheque">
                                            Cheque
                                          </SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Label>
                                      Transaction ID or Receipt No{" "}
                                      <sup className="text-red-600">*</sup>
                                    </Label>
                                    <Input
                                      required
                                      type="text"
                                      value={input?.transactionNo}
                                      id="transactionNo"
                                      name="transactionNo"
                                      onChange={(e) =>
                                        setInput({
                                          ...input,
                                          transactionNo: e.target.value,
                                        })
                                      }
                                      className="border-gray-300 shadow-sm px-3 py-2 rounded-md"
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="mt-4">
                                  {loading ? (
                                    <Button
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
                                      disabled
                                    >
                                      Saving...
                                    </Button>
                                  ) : (
                                    <Button
                                      type="submit"
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
                                    >
                                      Save Payment
                                    </Button>
                                  )}
                                </DialogFooter>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell
                      className={`px-4 py-2 border text-right text-green-600 font-bold ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      } `}
                    >
                      All Paid
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

export default TuitionFeesCollectionPage;
