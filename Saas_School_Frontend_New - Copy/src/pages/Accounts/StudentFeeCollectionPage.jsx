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
import { accountApi } from "@/common/main";

const StudentFeeCollectionPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [transctionId, setTransctionId] = useState("");
  const allStudents = useSelector((state) => state?.studentInfo?.studentInfo) || [];
  const [classFeeStructure, setClassFeeStructure] = useState("");
  const [currentStudent, setCurrentStudent] = useState("");
  const dispatch = useDispatch();
  const schoolInfo = useSelector((state) => state?.institute?.institute) || [];
  // console.log("schoolInfo : ", schoolInfo);
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");
  const schoolId = useSelector((state)=>state?.auth?.schoolId);

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
      const response = await axios.get(`${mainUrlApi.studentInfo.url}/${schoolId}`);

      // console.log("response : ", response);

      if (response) {
        dispatch(setStudentInfo(response?.data?.data));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
      setClassFeeStructure(response?.data?.data);
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

      console.log("response : ", response);

      if (response) {
        toast.success(response?.data?.message || "Payment saved successfully!");
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
      toast.error( error?.response?.data?.message || "Failed to save payment. Please try again.");
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
      <p className="text-lg font-semibold text-green-600">{value}</p>
    </div>
  );

  const generatePaymentSlip = (student, feeStructure, transactionNumber, paymentMethod, schoolInfo) => {
    const slipElement = document.createElement('div');
    slipElement.style.position = 'absolute';
    slipElement.style.left = '-9999px';
    slipElement.style.width = '210mm'; // A4 width
    slipElement.style.padding = '20px';
    slipElement.style.fontFamily = 'Arial, sans-serif';
  
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
          <p><strong>Class:</strong> ${student?.className} (${student?.section})</p>
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
            'Tuition Fees': feeStructure.tuitionFees,
            'Admission Fees': feeStructure.admission_Fees,
            'Books': feeStructure.books,
            'Donation': feeStructure.donation,
            'ID Card': feeStructure.id_Card_Charges,
            'Transportation': feeStructure.transportationalFees,
            'Uniform': feeStructure.uniform_Charges,
            'Late Fees': feeStructure.late_Fees,
            'Miscellaneous': feeStructure.miscellaneous,
            'Fine': feeStructure.fine,
          })
            .map(([key, value]) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">${key}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${value}</td>
              </tr>
            `).join('')}
          <tr style="font-weight: bold;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">Total:</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₹${feeStructure.totalFees}</td>
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
        <p></p>For any queries, please contact ${schoolInfo?.schoolPhone} ${schoolInfo?.schoolEmail}</p>
      </div>

      <div style="margin-top: 20px; text-align: center;">
        <p></p></p>This is a system generated invoice no signature required.</p>
      </div>
    `;
  
    document.body.appendChild(slipElement);
  
    html2canvas(slipElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`payment_slip_${student.admissionNumber}.pdf`);
      document.body.removeChild(slipElement);
    });
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
                Student Fee Collection
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
                  "Roll No",
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
              {paginatedData.map((item, index) => (
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
                    {item.rollNo}
                  </TableCell>

                  {
                    item?.status==="pending" ? (
                    
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
                                Add Payment Details
                              </DialogTitle>
                            </DialogHeader>
  
                            {/* Student Details Section */}
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                              <h2 className="text-lg font-semibold text-gray-700 text-center border-b pb-2">
                                Student Details
                              </h2>
                              <div className="grid grid-cols-2 gap-6 py-4 text-gray-800">
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
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                              <h2 className="text-lg font-semibold text-gray-700 text-center border-b pb-2">
                                Payment Details
                              </h2>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-4 text-gray-800">
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
                                <InfoRow
                                  label="Other Fee"
                                  value={classFeeStructure?.other || 0}
                                />
                                <div className="flex flex-col">
                                  <Label className="text-lg font-bold">
                                    Total Amount:
                                  </Label>
                                  <p className="text-xl font-bold text-green-700">
                                    ₹{classFeeStructure?.totalFees}
                                  </p>
                                </div>
                              </div>
                            </div>
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
                              className="space-y-6"
                            >
                              {/* Payment Method Selection */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                  <Label>
                                    Select a Payment Method{" "}
                                    <sup className="text-red-600">*</sup>
                                  </Label>
                                  <Select
                                    onValueChange={(e) =>
                                      setInput({ ...input, paymentMethod: e })
                                    }
                                    required
                                  >
                                    <SelectTrigger className="w-full border-gray-300 shadow-sm">
                                      <SelectValue placeholder="Select a method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Payment Methods</SelectLabel>
                                        <SelectItem value="online">
                                          Online
                                        </SelectItem>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="card">Card</SelectItem>
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
                                    value={input?.transactionNumber}
                                    id="transactionNumber"
                                    name="transactionNumber"
                                    onChange={(e) =>
                                      setInput({
                                        ...input,
                                        transactionNumber: e.target.value,
                                      })
                                    }
                                    className="border-gray-300 shadow-sm px-3 py-2 rounded-md"
                                  />
                                </div>
                              </div>
  
                              {/* Save Button */}
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
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                    ) : ( <TableCell
                      className={`px-4 py-2 border text-right text-green-700 font-bold ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      } `}
                    >
                      Paid
                    </TableCell>)
                  }

                  


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

export default StudentFeeCollectionPage;
