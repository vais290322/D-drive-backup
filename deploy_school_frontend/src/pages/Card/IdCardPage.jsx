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
import { Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Preview } from "@mui/icons-material";
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
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Modal from "@/components/ForCard/ModalComponent";
import mainUrlApi from "@/common/main";

const IdCardPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const allClass = useSelector((state) => state.class.classNames);
  const allSection = useSelector((state) => state.section.sectionNames);
  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
    // rollNo: "",
    // studentName: "",
  });

  const [searchClass, setSearchClass] = useState([]);

  const searchClassForIdCard = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${mainUrlApi.searchIdCard.url}/attendance/students?className=${searchData.className}&section=${searchData.section}`
      );
      if (response) {
        // console.log("response : ", response);
        toast.success("Data fetched successfully");
        const sortedData = response.data.sort((a, b) => a.rollNo - b.rollNo);
        // dispatch(setSearchClass(sortedData));
        setSearchClass(sortedData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    }
  };

  const dataLength = searchClass.length;

// next version 
  // const handlePreviewClick = async (id) => {
  //   try {
  //     const response = await axios.get(`http://192.168.0.141:8085/admission/generate-id-card/${id}`, {
  //       responseType: "blob", // Get binary data
  //     });
  
  //     if (response) {
  //       // Create a URL for the PNG blob
  //       const imageUrl = URL.createObjectURL(
  //         new Blob([response.data], { type: "image/png" })
  //       );
  //       setSelectedPdf(imageUrl); // Rename `setSelectedPdf` to a more generic name if necessary
  //       setPreviewOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching PNG:", error);
  //     toast.error("Failed to load the preview");
  //   }
  // };
  
// next version 
  // const closePreview = () => {
  //   setPreviewOpen(false);
  //   URL.revokeObjectURL(selectedPdf); // Clean up the URL object
  //   setSelectedPdf(null);
  // };
  

  const downloadIdCard = async (e, item) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${mainUrlApi.searchIdCard.url}/admissions/generate-id-card/${item.admissionNumber}`,
        {
          responseType: "blob",
        }
      );
  
      if (response) {
        // Create a blob from the response data
        const blob = new Blob([response.data], { type: "image/png" });
        const url = window.URL.createObjectURL(blob);
  
        // Create an anchor element to trigger the download
        const link = document.createElement("a");
        link.href = url;
  
        // Set the filename for the download
        link.setAttribute(
          "download",
          `id_card_${item.admissionNumber}.png`
        );
  
        // Append the link to the document, trigger the download, and clean up
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
  
        // console.log("PNG downloaded successfully!");
      }
    } catch (error) {
      // toast.error(error.response?.data?.message || "Search before downloading");
      console.error("Error downloading PNG:", error);
    }
  };
  

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = searchClass.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh] `}
    >
      <div className={`  `}>
        {/* for search function  */}
        <div
          className={`mt-6 flex items-center justify-start mx-4 sm:mx-14 gap-4 h-20 ${
            theme === "light" ? "bg-[#212121]" : "bg-white"
          } `}
        >
          <p className="text-2xl font-semibold ml-2 hidden sm:block">
            Search Id Card{" "}
          </p>
          <form
            onSubmit={searchClassForIdCard}
            className="flex items-center gap-2 w-full"
          >
            <Select
              className="border-red-600 border "
              onValueChange={(value) =>
                setSearchData({ ...searchData, className: value })
              }
            >
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>class</SelectLabel>
                  {allClass.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {capitalizeFirstLetter(item)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              className="border-red-600 border "
              onValueChange={(value) =>
                setSearchData({ ...searchData, section: value })
              }
            >
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>sections</SelectLabel>
                  {allSection.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {capitalizeFirstLetter(item)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* next version  */}
            {/* <input
              type="text"
              placeholder="Search by roll no"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm"
            />
            <input
              type="text"
              placeholder="Search by student name"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm "
            /> */}

            <Button
              type="submit"
              className="bg-[#452B90] hover:bg-[#c29732] mr-2"
            >
              Search
            </Button>
          </form>
        </div>

        {/* for table and add new class rooms */}
        <div
          className={`mt-4 border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)] bg-[#212121]"
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
                All Id Card
              </span>
            </div>

            {/* next version  */}
            {/* <div>
              <Button
                className="bg-[#452B90] hover:bg-[#c29732]"
                onClick={editStudent}
              >
                <Download /> Download All
              </Button>
            </div> */}
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
                  // <div className="flex items-center space-x-2 ">
                  //   <Switch id="select All" />
                  // </div>,
                  "S.No",
                  "Admission Id",
                  "Roll No",
                  "Student Name",
                  "Class (Section)",
                  // "Preview",
                  "Download",
                ].map((header, index) => (
                  <TableHead
                    key={index}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold  ${
                      header === "Download" || header === "Preview"
                        ? "text-right"
                        : "text-left"
                    } ${header === "Preview" ? "hidden sm:block" : ""} `}
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
                  {/* next version  */}
                  {/* <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <div className="flex items-center space-x-2 ">
                      <Switch id="select" />
                    </div>
                  </TableCell> */}

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
                    {item.rollNo}
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
                  {/* for action  */}
                    {/* for preview next version  */}
                  {/* <TableCell
                    className={`px-4 py-2 border  text-right ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } hidden sm:block `}
                  >
                    <Button
                      className="bg-[#452B90] hover:bg-[#c29732]"
                      onClick={() => handlePreviewClick(item.id)}
                    >
                      <Preview />{" "}
                      <span className="hidden sm:block">Preview</span>
                    </Button>
                  </TableCell> */}

                  <TableCell
                    className={`px-4 py-2 border text-right ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <Button
                      className="bg-[#452B90] hover:bg-[#c29732]"
                      onClick={(e) => downloadIdCard(e, item)}
                    >
                      <Download />{" "}
                      <span className="hidden sm:block">Download </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Modal for Previewing the PDF */}
          {/* <Modal isOpen={isPreviewOpen} onClose={closePreview}>
            <div style={{ height: "100%" }}>
              {selectedPdf && (
                <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.15.349/pdf.worker.min.js">
                  <Viewer fileUrl={selectedPdf} />
                </Worker>
              )}
            </div>
          </Modal> */}

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

export default IdCardPage;
