import React, { useState } from "react";
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
import AddNewComponents from "@/components/Addnew/AddNewComponents";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import EditDataComponent from "@/components/EditData/EditDataComponent";
import { Button } from "@/components/ui/button";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const StudentFeeCollectionPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [transctionId, setTransctionId] = useState("");
  const [input, setInput] = useState({
    studentId: "",
    studentName: "",
    class: "",
    section: "",
    feesCategory: "",
    feesAmount: "",
    paymentDate: "",
    status: "",
    paymentMethod: "",
  });

  // console.log("input : ", input);

  // table data
  const data = [
    {
      id: 1,
      studentId: "Sc1-1",
      studentName: "dk",
      class: "one",
      rollNo: "1",
      feesAmount: "5400",
      paymentDate: "pending",
      status: "not paid",
    },
    {
      id: 2,
      studentId: "Sc1-2",
      studentName: "sk",
      class: "zero",
      rollNo: "1",
      feesAmount: "4000",
      paymentDate: "pending",
      status: "not paid",
    },
  ];
  const dataLength = data.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // for fetch the class data
  const fetchClassData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("url");

      // console.log("response : ", response);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // for add new Subject data
  const addNewExamType = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post("url", input, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
      });

      // console.log("response : ", response);

      if (response.success) {
        setInput({
          studentId: "",
          studentName: "",
          class: "",
          section: "",
          feesCategory: "",
          feesAmount: "",
          paymentDate: "",
          status: "",
          paymentMethod: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const downloadPDF = () => {
    const attendanceReport = document.getElementById("forpdf");
    const downloadButton = document.querySelector(".download-button"); 
  
    // Temporarily hide the "Download All" button and Pagination component
    if (downloadButton) {
      downloadButton.style.display = "none";
    }
    
  
    // Generate the PDF
    html2canvas(attendanceReport, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.5); // Lower quality for smaller size (50%)
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, "", "FAST"); // Use FAST compression
      pdf.save("paymentRecept.pdf");
  
      // Restore visibility of the "Download All" button and Pagination component
      if (downloadButton) {
        downloadButton.style.display = "";
      }
      
    });
  };

  return (
    <div className={` ${theme === "light" ? "dark" : "light"} h-[100vh]`}>
      <div>
        {/* for search function  */}
        <div
          className={`mt-4  flex items-center justify-start mx-4 sm:mx-14 gap-4 h-20 ${
            theme === "light" ? "bg-[#212121] text-white" : "bg-white"
          } `}
        >
          <p className="text-2xl font-semibold ml-2 hidden sm:block">
            Search Student{" "}
          </p>
          <input
            type="text"
            placeholder="Search by class"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm ml-2"
          />
          <input
            type="text"
            placeholder="Search by section"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm "
          />
          <input
            type="text"
            placeholder="Search by Admission Number"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm "
          />

          <Button className="bg-[#452B90] hover:bg-[#c29732] mr-2">
            Search
          </Button>
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
                  "Student Id",
                  "Student Name",
                  "Class",
                  "Roll No",
                  "Fees Amount",
                  "Payment Date",
                  "Status",
                  "Payment",
                ].map((header, index) => (
                  <TableHead
                    key={index}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold  ${
                      header === "Action"
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
                    {item.studentId}
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
                    {item.class}
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

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.feesAmount}
                  </TableCell>

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.paymentDate}
                  </TableCell>

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.status}
                  </TableCell>

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } hidden sm:table-cell `}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Add Payment</Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[36%]">
                        <DialogHeader>
                          <DialogTitle>Add Payment Details </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={addNewExamType}>
                          <div>
                            <h1 className="text-2xl font-bold flex justify-center items-center w-full">
                              Student Details{" "}
                            </h1>
                            <div className="grid grid-cols-2 gap-6 py-4">
                              {/* for student id */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="studentId">
                                  Student's Id{" "}
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.studentId}
                                  id="studentId"
                                  name="studentId"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              {/* for student name */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="studentName ">
                                  Student's Name
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.studentName}
                                  id="studentName"
                                  name="studentName "
                                  onChange={changeEventHandler}
                                />
                              </div>
                              {/* for class */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="class">
                                  Class
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.class}
                                  id="class"
                                  name="class"
                                  onChange={changeEventHandler}
                                />
                              </div>
                              {/* for section */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="section">
                                  Section
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.section}
                                  id="section"
                                  name="section"
                                  onChange={changeEventHandler}
                                />
                              </div>
                            </div>

                            <h1 className="text-2xl font-bold flex justify-center items-center w-full">
                              Payment Details{" "}
                            </h1>
                            {/* payment section  */}
                            {/* for admission fee */}
                            <div className="grid grid-cols-2 gap-6 py-4">
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Admission Fee
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Tuition Fee
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Donation
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Books Fee
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Id Card Fee
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Late Fee
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Fine Fee
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Transport Fee
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Miscellaneous
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Uniform Charges
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Other Fee
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="text"
                                  value={input.feesAmount}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <Label htmlFor="feesAmount">
                                  Total Amount
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  readOnly
                                  type="text"
                                  value={5400}
                                  id="feesAmount"
                                  name="feesAmount"
                                  onChange={changeEventHandler}
                                />
                              </div>

                              {/* for payment method */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="className">
                                  Select a Payment Method
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Select
                                  onValueChange={(e) => {
                                    setInput({ ...input, paymentMethod: e });
                                    if (
                                      ["cash", "card", "cheque"].includes(e)
                                    ) {
                                      setTransctionId(""); // Reset description when a new payment method is selected
                                    }
                                  }}
                                  required
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Status</SelectLabel>
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

                              {/* for rendering the transction filed when payment method is not online  */}
                              {["cash", "card", "cheque"].includes(
                                input.paymentMethod
                              ) && (
                                <div className="flex flex-col gap-2 ">
                                  <Label htmlFor="description">
                                    Transction Id
                                    <sup className="text-red-600">*</sup>
                                  </Label>
                                  <Input
                                    required
                                    type="text"
                                    value={transctionId}
                                    id="transctionId"
                                    name="transctionId"
                                    onChange={(e) =>
                                      setTransctionId(e.target.value)
                                    }
                                  />
                                </div>
                              )}

                              {/* for status availability */}
                              {/* <div className="flex flex-col gap-2">
                                <Label htmlFor="className">
                                  Select a status
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Select
                                  onValueChange={(e) =>
                                    setInput({ ...input, status: e })
                                  }
                                  required
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Status</SelectLabel>
                                      <SelectItem value="pending">
                                        Pending
                                      </SelectItem>
                                      <SelectItem value="completed">
                                        Completed
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div> */}
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              type="submit"
                              className=" bg-[#452B90] hover:bg-[#c29732] "
                            >
                              Save
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
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
