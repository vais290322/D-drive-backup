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
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";

const GuardianInformationPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const studentInfo =
    useSelector((state) => state.studentInfo.studentInfo) || [];
  const role = useSelector((state) => state.auth.user);

  // Search states
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");

  const [input, setInput] = useState({
    // Parent Information
    fatherName: "",
    motherName: "",
    phone: "",
    alternativePhone: "",
    email: "",
    jointImage: null,
  });

  // console.log("input : ", input);

  const filteredData = studentInfo?.filter((item) => {
    return (
      (searchClass === "" ||
        item?.motherName?.toLowerCase()?.includes(searchClass?.toLowerCase()) ) &&
      (searchSection === "" ||
        item?.fatherName?.toLowerCase()?.includes(searchSection?.toLowerCase())) &&
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

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // for update new  data
  const editParent = async (e) => {
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
          // Parent Information
          fatherName: "",
          motherName: "",
          phone: "",
          alternativePhone: "",
          email: "",
          jointImage: null,
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
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const headers = [
    "S.No",
    "Student's Admission No",
    "Father's Name",
    "Mother's Name",
    "Phone Number",
    "Student Name",
  ];
  // "edp", "admin",
  if (["vais"].includes(role)) {
    headers.push("Action");
  }

  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh] min-h-screen md:h-auto`}
    >
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
            placeholder="Mother Name"
            className="border border-gray-300 rounded-md px-4 py-2 placeholder:text-sm ml-2"
            value={searchClass}
            onChange={(e) => setSearchClass(e.target.value)}
          />
          <input
            type="text"
            placeholder="Father Name"
            className="border border-gray-300 rounded-md px-4 py-2 placeholder:text-sm"
            value={searchSection}
            onChange={(e) => setSearchSection(e.target.value)}
          />

<input
            type="text"
            placeholder="admission number or name"
            className="border border-gray-300 rounded-md px-4 py-2 placeholder:text-sm"
            value={searchAdmissionNumber}
            onChange={(e) => setSearchAdmissionNumber(e.target.value)}
          />
          
        </div>

        {/* for table and add new class rooms */}
        <div
          className={`mt-4 border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)]"
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
                All Guardians
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
                {headers.map((header, index) => (
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
              {paginatedData.map((item, index) => (
                <TableRow
                  key={index + 1}
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
                    {item.fatherName}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.motherName}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.phone}
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
                  {/* "admin", "edp", */}
                  {["vais"].includes(role) && (
                    <TableCell
                      className={`px-4 py-2 border text-left ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      } `}
                    >
                      <div className="flex justify-end items-center gap-2">
                        {/* "admin", "edp", */}
                        {["vais"].includes(role) && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <FaEdit className="sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm hidden sm:block" />
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[50%]">
                              <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                              </DialogHeader>

                              <form onSubmit={editParent}>
                                <div className="grid gap-4 py-4 grid-cols-1 sm:grid-cols-2">
                                  {/* for father name  */}
                                  <div className="grid grid-cols-1 items-center gap-4">
                                    <Label htmlFor="fatherName" className="">
                                      Father's Name
                                    </Label>
                                    <input
                                      id="fatherName"
                                      name="fatherName"
                                      value={input.fatherName}
                                      onChange={changeEventHandler}
                                      className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                    />
                                  </div>
                                  {/* for mother name  */}
                                  <div className="grid grid-cols-1 items-center gap-4">
                                    <Label htmlFor="motherName" className="">
                                      Mother's Name
                                    </Label>
                                    <input
                                      id="motherName"
                                      name="motherName"
                                      value={input.motherName}
                                      onChange={changeEventHandler}
                                      className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                    />
                                  </div>
                                  {/* for phone no  */}
                                  <div className="grid grid-cols-1 items-center gap-4">
                                    <Label htmlFor="phone" className="">
                                      Phone Number
                                    </Label>
                                    <input
                                      id="phone"
                                      name="phone"
                                      value={input.phone}
                                      onChange={changeEventHandler}
                                      className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                    />
                                  </div>
                                  {/* for alt phone no  */}
                                  <div className="grid grid-cols-1 items-center gap-4">
                                    <Label
                                      htmlFor="alternativePhone"
                                      className=""
                                    >
                                      Alternative Phone Number
                                    </Label>
                                    <input
                                      id="alternativePhone"
                                      name="alternativePhone"
                                      value={input.alternativePhone}
                                      onChange={changeEventHandler}
                                      className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                    />
                                  </div>
                                  {/* for email  */}
                                  <div className="grid grid-cols-1 items-center gap-4">
                                    <Label htmlFor="email" className="">
                                      Email
                                    </Label>
                                    <input
                                      type="email"
                                      id="email"
                                      name="email"
                                      value={input.email}
                                      onChange={changeEventHandler}
                                      className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                    />
                                  </div>
                                  {/* for joint image  */}
                                  <div className="grid grid-cols-1 items-center gap-4">
                                    <Label htmlFor="jointImage" className="">
                                      Parent's Image
                                    </Label>
                                    <input
                                      type="file"
                                      id="jointImage"
                                      name="jointImage"
                                      value={input.jointImage}
                                      onChange={changeEventHandler}
                                      className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                    />
                                  </div>
                                </div>
                              </form>

                              <DialogFooter>
                                <Button
                                  type="submit"
                                  className="bg-[#452B90] hover:bg-[#c29732]"
                                >
                                  Save changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        {role === "vais" && <DeleteComponent />}
                      </div>
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

export default GuardianInformationPage;
