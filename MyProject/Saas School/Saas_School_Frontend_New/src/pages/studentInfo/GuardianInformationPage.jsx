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
import {
  FaEdit,
  FaSearch,
  FaUserFriends,
  FaExclamationCircle,
} from "react-icons/fa";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TourButton from "@/components/Tour/TourButton";
import { guardianInformationPageSteps } from "@/components/Tour/Steps/StudentinfoSteps/Steps";
import { motion } from "framer-motion";

const GuardianInformationPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const studentInfo =
    useSelector((state) => state.studentInfo.studentInfo) || [];
  const role = useSelector((state) => state.auth.user);
  const schoolId = useSelector((state) => state.auth.schoolId);

  // Search states
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");

  const filteredData = studentInfo?.filter((item) => {
    return (
      (searchClass === "" ||
        item?.motherName
          ?.toLowerCase()
          ?.includes(searchClass?.toLowerCase())) &&
      (searchSection === "" ||
        item?.fatherName
          ?.toLowerCase()
          ?.includes(searchSection?.toLowerCase())) &&
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
    "Admission No",
    "Student Name",
    "Class(Section)",
    "Father Name",
    "Mother Name",
    "Guardian Mobile",
    "Guardian Email",
  ];

  if (["vais"].includes(role)) {
    headers.push("Action");
  }

  return (
    <div
      className={`min-h-screen py-10 ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 text-gray-800"
      }`}
    >
      <div
        className={`container mx-auto max-w-7xl ${
          theme === "light"
            ? "bg-gray-800 border-2 border-gray-700"
            : "bg-white border-2 border-indigo-200"
        } rounded-3xl shadow-2xl p-6 md:p-10`}
      >
        {/* Header with Icon */}
        <div className="flex items-center justify-center mb-8">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
              theme === "light" ? "bg-indigo-700" : "bg-indigo-600"
            }`}
          >
            <FaUserFriends className="text-white text-3xl" />
          </div>
          <h1
            className={`text-2xl md:text-3xl font-extrabold ${
              theme === "light"
                ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-300"
                : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-600 to-purple-600"
            } drop-shadow-lg`}
          >
            Guardian Information
          </h1>
          <div className="ml-4">
            <TourButton steps={guardianInformationPageSteps} />
          </div>
        </div>

        {/* Search Controls */}
        <div
          className={`${
            theme === "light" ? "bg-gray-700" : "bg-indigo-50"
          } rounded-2xl p-6 mb-8 shadow-md`}
        >
          <h2
            className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
              theme === "light" ? "text-blue-300" : "text-blue-700"
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                theme === "light" ? "bg-blue-900" : "bg-blue-100"
              }`}
            >
              <FaSearch
                className={`${
                  theme === "light" ? "text-blue-400" : "text-blue-500"
                }`}
              />
            </div>
            Search Guardians
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                className={`block mb-2 font-medium ${
                  theme === "light" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Mother Name
              </label>
              <Input
                type="text"
                placeholder="Search by mother name"
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  theme === "light"
                    ? "bg-gray-600 border-gray-500 text-white focus:ring-indigo-500"
                    : "border border-indigo-300 focus:ring-indigo-400 text-gray-800"
                } focus:outline-none focus:ring-2 text-lg`}
              />
            </div>

            <div>
              <label
                className={`block mb-2 font-medium ${
                  theme === "light" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Father Name
              </label>
              <Input
                type="text"
                placeholder="Search by father name"
                value={searchSection}
                onChange={(e) => setSearchSection(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  theme === "light"
                    ? "bg-gray-600 border-gray-500 text-white focus:ring-indigo-500"
                    : "border border-indigo-300 focus:ring-indigo-400 text-gray-800"
                } focus:outline-none focus:ring-2 text-lg`}
              />
            </div>

            <div>
              <label
                className={`block mb-2 font-medium ${
                  theme === "light" ? "text-gray-300" : "text-indigo-700"
                }`}
              >
                Admission No / Student Name
              </label>
              <Input
                type="text"
                placeholder="Search by admission no or student name"
                value={searchAdmissionNumber}
                onChange={(e) => setSearchAdmissionNumber(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  theme === "light"
                    ? "bg-gray-600 border-gray-500 text-white focus:ring-indigo-500"
                    : "border border-indigo-300 focus:ring-indigo-400 text-gray-800"
                } focus:outline-none focus:ring-2 text-lg`}
              />
            </div>
          </div>
        </div>

        {/* Guardian Information Table */}
        <div
          className={`${
            theme === "light" ? "bg-gray-700" : "bg-white"
          } rounded-2xl shadow-lg p-6 transition-all duration-300`}
        >
          <h2
            className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
              theme === "light" ? "text-blue-300" : "text-blue-700"
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                theme === "light" ? "bg-blue-900" : "bg-blue-100"
              }`}
            >
              <FaUserFriends
                className={`${
                  theme === "light" ? "text-blue-400" : "text-blue-500"
                }`}
              />
            </div>
            Guardian List
          </h2>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl">
            <Table
              className={`w-full border ${
                theme === "light"
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-indigo-200"
              }`}
            >
              <TableHeader
                className={`${
                  theme === "light"
                    ? "bg-gradient-to-r from-gray-700 to-gray-600"
                    : "bg-gradient-to-r from-indigo-100 to-blue-100"
                }`}
              >
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead
                      key={index}
                      className={`py-4 px-4 text-left ${
                        theme === "light"
                          ? "text-gray-200 border-gray-600"
                          : "text-gray-800 border-indigo-200"
                      } border`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData?.length > 0 ? (
                  paginatedData.map((item, index) => (
                    console.log("item", item),
                    <TableRow
                      key={item.id || index}
                      className={`${
                        theme === "light"
                          ? index % 2 === 0
                            ? "bg-gray-800"
                            : "bg-gray-750 hover:bg-gray-700"
                          : index % 2 === 0
                          ? "bg-white"
                          : "bg-indigo-50 hover:bg-indigo-100"
                      } transition-colors`}
                    >
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light"
                            ? "text-gray-300 border-gray-600"
                            : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light"
                            ? "text-gray-300 border-gray-600"
                            : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.admissionNumber}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light"
                            ? "text-gray-300 border-gray-600"
                            : "text-gray-800 border-indigo-200"
                        } border font-medium`}
                      >
                        {item.studentName}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light"
                            ? "text-gray-300 border-gray-600"
                            : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.className} ({item.section})
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light"
                            ? "text-gray-300 border-gray-600"
                            : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.fatherName}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light"
                            ? "text-gray-300 border-gray-600"
                            : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.motherName}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light"
                            ? "text-gray-300 border-gray-600"
                            : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.phone} / {item?.alternativePhone}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 ${
                          theme === "light"
                            ? "text-gray-300 border-gray-600"
                            : "text-gray-800 border-indigo-200"
                        } border`}
                      >
                        {item.email}
                      </TableCell>
                      {["vais"].includes(role) && (
                        <TableCell
                          className={`py-3 px-4 ${
                            theme === "light"
                              ? "border-gray-600"
                              : "border-indigo-200"
                          } border`}
                        >
                          <div className="flex justify-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className={`${
                                    theme === "light"
                                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                      : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                  } text-white font-bold px-4 py-2 rounded-lg shadow transition-all duration-200 flex items-center justify-center gap-2 text-sm`}
                                >
                                  <FaEdit className="text-xs" /> Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent
                                className={`sm:max-w-[500px] ${
                                  theme === "light"
                                    ? "bg-gray-800 text-white"
                                    : "bg-white"
                                }`}
                              >
                                <DialogHeader>
                                  <DialogTitle
                                    className={`text-xl font-bold ${
                                      theme === "light"
                                        ? "text-white"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    Edit Guardian Information
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                      <Label
                                        htmlFor="fatherName"
                                        className={`${
                                          theme === "light"
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        } mb-2 block`}
                                      >
                                        Father Name
                                      </Label>
                                      <Input
                                        id="fatherName"
                                        defaultValue={item.fatherName}
                                        className={`w-full px-4 py-2 rounded-md ${
                                          theme === "light"
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-white border-gray-300 text-gray-800"
                                        } border`}
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <Label
                                        htmlFor="motherName"
                                        className={`${
                                          theme === "light"
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        } mb-2 block`}
                                      >
                                        Mother Name
                                      </Label>
                                      <Input
                                        id="motherName"
                                        defaultValue={item.motherName}
                                        className={`w-full px-4 py-2 rounded-md ${
                                          theme === "light"
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-white border-gray-300 text-gray-800"
                                        } border`}
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <Label
                                        htmlFor="guardianMobile"
                                        className={`${
                                          theme === "light"
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        } mb-2 block`}
                                      >
                                        Guardian Mobile
                                      </Label>
                                      <Input
                                        id="guardianMobile"
                                        defaultValue={item.guardianMobile}
                                        className={`w-full px-4 py-2 rounded-md ${
                                          theme === "light"
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-white border-gray-300 text-gray-800"
                                        } border`}
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <Label
                                        htmlFor="guardianEmail"
                                        className={`${
                                          theme === "light"
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        } mb-2 block`}
                                      >
                                        Guardian Email
                                      </Label>
                                      <Input
                                        id="guardianEmail"
                                        defaultValue={item.guardianEmail}
                                        className={`w-full px-4 py-2 rounded-md ${
                                          theme === "light"
                                            ? "bg-gray-700 border-gray-600 text-white"
                                            : "bg-white border-gray-300 text-gray-800"
                                        } border`}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    type="submit"
                                    className={`${
                                      theme === "light"
                                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                                        : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
                                    } text-white font-bold px-6 py-2 rounded-lg shadow transition-all duration-200`}
                                    disabled={postApiLoading}
                                  >
                                    {postApiLoading ? (
                                      <div className="flex items-center">
                                        <svg
                                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          ></path>
                                        </svg>
                                        Processing...
                                      </div>
                                    ) : (
                                      "Save Changes"
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={headers.length}
                      className={`py-10 text-center ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <FaExclamationCircle className="text-5xl mb-4" />
                        <p className="text-xl font-medium">
                          No guardian information found
                        </p>
                        <p className="mt-2">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {paginatedData.length > 0 && (
            <div className="mt-6">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </div>
          )}

          {/* Empty State */}
          {filteredData.length === 0 && !paginatedData.length && (
            <div
              className={`flex flex-col items-center justify-center py-16 ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <FaSearch className="text-5xl mb-4" />
              <p className="text-xl font-medium">
                No guardian information found
              </p>
              <p className="mt-2">Try searching for guardian information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuardianInformationPage;
