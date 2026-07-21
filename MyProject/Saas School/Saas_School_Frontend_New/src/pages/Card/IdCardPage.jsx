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
import { Button } from "@/components/ui/button";
import { Download, DownloadCloud, Search, View } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "@react-pdf-viewer/core/lib/styles/index.css";
import mainUrlApi from "@/common/main";
import { IoIdCard } from "react-icons/io5";
import TourButton from "@/components/Tour/TourButton";
import { idCardPageSteps } from "@/components/Tour/Steps/CardSteps/Steps";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MatiaIdCardComponent from "@/components/ForCard/MatiaIdCardComponent";

const IdCardPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
  });
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [searchClass, setSearchClass] = useState([]);
  const [isOpenMatia, setIsOpenMatia] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);


  // console.log(isOpenMatia, schoolId === '69118d20c4c6be31096c1ab4' ? true : false);
  // console.log(selectedStudent);

  const searchClassForIdCard = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `${mainUrlApi.searchIdCard.url}/${schoolId}/attendance/students?className=${searchData.className}&section=${searchData.section}`
      );
      if (response) {
        toast.success("Data fetched successfully");
        const sortedData = response.data.sort((a, b) => a.rollNo - b.rollNo);
        setSearchClass(sortedData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    } finally {
      setLoading(false);
    }
  };

  const downloadAllIdCard = async () => {
    try {
      if (!searchData.section || !searchData.className) {
        return toast.error("Please select class and section");
      }

      // Set loading state for download button
      setLoading(true);

      const response = await axios.get(
        `${mainUrlApi.searchIdCard.url}/admissions/generate-class-id-cards/${schoolId}/${searchData.className}/${searchData.section}`,
        {
          responseType: 'blob' // Important: Set responseType to 'blob' to handle binary data
        }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/zip' });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;

      // Set the download attribute with a filename
      link.setAttribute('download', `id_cards_${searchData.className}_${searchData.section}.zip`);

      // Append to the document
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up by removing the link and revoking the URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("ID cards downloaded successfully");

    } catch (error) {
      toast.error(error.response?.data?.message || "Error downloading ID cards");
      console.error("Download error:", error);
    } finally {
      setLoading(false);
    }
  }

  const dataLength = searchClass?.length;

  const downloadIdCard = async (e, item) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${mainUrlApi.searchIdCard.url}/admissions/generate-id-card/${item.admissionNumber}/${schoolId}`,
        {
          responseType: "blob",
        }
      );

      if (response) {
        const blob = new Blob([response.data], { type: "image/png" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `id_card_${item.admissionNumber}.png`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error downloading ID card");
    }
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = searchClass?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      className={`min-h-screen ${theme === "light"
        ? "bg-gray-900 text-white"
        : "bg-gray-50 text-gray-800"
        }`}
    >
      <div className="container mx-auto py-8 px-4">
        {/* Page Header with Gradient */}
        <div
          className={`mb-6 ${theme === "light" ? "text-white" : "text-gray-800"
            }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold relative inline-block">
                ID Card Management
                <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
              </h1>
              <p className="mt-2 text-sm md:text-base opacity-80">
                Generate and download student ID cards
              </p>
            </div>
            <div className="flex items-center h-full">
              <TourButton steps={idCardPageSteps} tourName="id_card" />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div
          className={`mb-6 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${theme === "light"
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
            }`}
        >
          <div
            className={`p-4 sm:p-6 border-b ${theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${theme === "light" ? "text-white" : "text-gray-800"
                }`}
            >
              Search Students
            </h2>

            <form
              onSubmit={searchClassForIdCard}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="w-full sm:w-auto">
                <label
                  className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Class
                </label>
                <Select
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, className: value })
                  }
                  required
                >
                  <SelectTrigger
                    className={`w-full sm:w-[180px] ${theme === "light"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white"
                      }`}
                  >
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Class</SelectLabel>
                      {allClass.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto">
                <label
                  className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Section
                </label>
                <Select
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, section: value })
                  }
                  required
                >
                  <SelectTrigger
                    className={`w-full sm:w-[180px] ${theme === "light"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white"
                      }`}
                  >
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Section</SelectLabel>
                      {allSection.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto self-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Results Card */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${theme === "light"
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
            }`}
        >
          {/* Card Header */}
          <div
            className={`flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-b ${theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <div className="mb-4 sm:mb-0">
              <h2
                className={`text-xl font-bold flex items-center ${theme === "light" ? "text-white" : "text-gray-800"
                  }`}
              >
                <IoIdCard className="mr-2 h-5 w-5" />
                Student ID Cards
              </h2>

              <p
                className={`text-sm mt-1 ${theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {searchClass?.length || 0} students found
              </p>
            </div>

            <div >
              <Button className={`bg-green-400 hover:bg-green-700`} onClick={downloadAllIdCard}>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Download All
              </Button>
            </div>

            {searchClass.length > 0 && (
              <div
                className={`px-4 py-2 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-100"
                  }`}
              >
                <span
                  className={`font-medium ${theme === "light" ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Class:
                </span>
                <span
                  className={`ml-2 font-bold ${theme === "light" ? "text-white" : "text-gray-900"
                    }`}
                >
                  {searchData.className} ({searchData.section})
                </span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : searchClass?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <svg
                className="w-16 h-16 mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                ></path>
              </svg>
              <p
                className={`text-lg font-medium ${theme === "light" ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                No students found
              </p>
              <p
                className={`text-sm mt-2 ${theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Select a class and section to view students
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader
                  className={`${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                >
                  <TableRow>
                    {[
                      "S.No",
                      "Admission ID",
                      "Roll No",
                      "Student Name",
                      "Class (Section)",
                      "Action",
                    ].map((header, index) => (
                      <TableHead
                        key={index}
                        className={`px-4 py-3 ${theme === "light" ? "text-gray-200" : "text-gray-700"
                          } font-semibold text-sm ${header === "Action" ? "text-right" : "text-left"
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
                      key={item.id || index}
                      className={`transition-colors hover:bg-opacity-10 ${theme === "light"
                        ? "hover:bg-gray-600 border-t border-gray-700"
                        : "hover:bg-gray-100 border-t border-gray-200"
                        }`}
                    >
                      <TableCell
                        className={`px-4 py-3 ${theme === "light" ? "text-gray-300" : "text-gray-600"
                          }`}
                      >
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 font-medium ${theme === "light" ? "text-white" : "text-gray-800"
                          }`}
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.admissionNumber}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${theme === "light" ? "text-white" : "text-gray-800"
                          }`}
                      >
                        {item.rollNo}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${theme === "light" ? "text-white" : "text-gray-800"
                          }`}
                      >
                        {item.studentName}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${theme === "light" ? "text-white" : "text-gray-800"
                          }`}
                      >
                        {item.className} ({item.section})
                      </TableCell>
                      <TableCell className={`px-4 py-3  flex justify-end gap-2`}>
                        {
                          schoolId === '69118d20c4c6be31096c1ab4' && (
                            <Button
                              onClick={() => {
                                setSelectedStudent(item);
                                setIsOpenMatia(true);
                              }}

                              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <View className="mr-2 h-4 w-4" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          )
                        }
                        <Button
                          onClick={(e) => downloadIdCard(e, item)}
                          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination with improved styling */}
          {searchClass?.length > 0 && (
            <div
              className={`p-4 border-t ${theme === "light" ? "border-gray-700" : "border-gray-200"
                }`}
            >
              <PaginationComponent
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalPages={totalPages}
                onRowsPerPageChange={handleRowsPerPageChange}
                onPageChange={setCurrentPage}
                className={`${theme === "light" ? "text-white" : "text-gray-800"
                  }`}
              />
            </div>
          )}
        </div>
      </div>

      {
        isOpenMatia && (
          <Dialog open={isOpenMatia} onOpenChange={setIsOpenMatia}>
            <DialogContent className=" max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Student ID Card Preview And Download</DialogTitle>
                <DialogDescription>
                 Preview of the student ID card for {selectedStudent?.studentName}.
                </DialogDescription>
              </DialogHeader>
              <MatiaIdCardComponent
                photoUrl={selectedStudent?.studentImage}
                studentName={selectedStudent?.studentName}
                fatherName={selectedStudent?.fatherName}
                admissionNo={selectedStudent?.admissionNumber}
                address={selectedStudent?.villagePost}
                mobile={selectedStudent?.phone}
                open={isOpenMatia}
                onOpenChange={setIsOpenMatia}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={() => setSelectedStudent(null)}>Cancel</Button>
                </DialogClose>

              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }

    </div>
  );
};

export default IdCardPage;
