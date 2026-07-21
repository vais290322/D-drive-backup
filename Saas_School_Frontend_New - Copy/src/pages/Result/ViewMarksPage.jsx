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
import { Save, SaveAllIcon } from "lucide-react";
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
import resultUrlApi from "@/common/result";

const ViewMarksPage = () => {
  const schoolId=useSelector((state)=>state?.auth?.schoolId)
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allClass = useSelector((state) => state.class.classNames);
  const allSection = useSelector((state) => state.section.sectionNames);
  const examTypeData = useSelector((state) => state.examType.examType) || [];
  const userDetails = useSelector((state) => state.auth.userDetails) || [];
  const allSubject = useSelector((state) => state.subject.subjectNames) || [];
  const role = useSelector((state) => state.auth.user);
  const [searchReasult, setSearchReasult] = useState([]);
  // console.log("role : ", role);
  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
    // roll: "",
    subject: "",
    examType: "",
  });
  const dataLength = searchReasult?.length;

  console.log("search : ",searchReasult);

const searchViewMark = async (e) => {
  e.preventDefault();
  try {
    let response;
    // console.log("searchData : ", searchData);

    if (role === "teacher") {
      // Teacher-specific API call
      response = await axios.get(
        `${resultUrlApi.viewMarks.url}/${schoolId}/get/search?className=${searchData.className}&section=${searchData.section}&examType=${searchData.examType}&subject=${userDetails?.subject}`
      );
    } else if (role === "edp" || role === "admin") {
      // EDP or Admin-specific API call
      response = await axios.get(
        `${resultUrlApi.viewMarks.url}/${schoolId}/get/search?className=${searchData.className}&section=${searchData.section}&subject=${searchData.subject}&examType=${searchData.examType}`
      );
    } else if (role === "student") {
      // Student-specific API call
      response = await axios.get(
        `${resultUrlApi.viewMarks.url}/${schoolId}/search?className=${searchData.className}&section=${searchData.section}&examType=${searchData.examType}&roll=${userDetails?.rollNo}`
      );
    } else {
      throw new Error("Invalid role");
    }

    if (response) {
      setSearchReasult(response?.data?.data);
    }
 
    // console.log("API Response: ", response);
  } catch (error) {
    toast.error(error.response?.data?.message || "Error searching data");
  }
};

  
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = searchReasult?.slice(
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
            theme === "light" ? "bg-[#212121] text-black" : "bg-white"
          } `}
        >
          <p
            className={`  text-2xl pl-2 font-semibold ${
              theme === "light" ? " text-white" : ""
            } hidden sm:block `}
          >
            Search Marks
          </p>
          <form
            onSubmit={searchViewMark}
            className="flex items-center gap-2 w-full"
          >
            {/* for class  */}
            <Select
              className="border-red-600 border "
              onValueChange={(value) =>
                setSearchData({ ...searchData, className: value })
              }
              required
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
            {/* for section  */}
            <Select
              className="border-red-600 border "
              onValueChange={(value) =>
                setSearchData({ ...searchData, section: value })
              }
              required
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
            {/* for subject  */}
            {
              role === "edp" || role === "admin" && (<Select
                className="border-red-600 border "
                onValueChange={(value) =>
                  setSearchData({ ...searchData, subject: value })
                }
                
              >
                <SelectTrigger className="w-[180px] ">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>subjects</SelectLabel>
                    {allSubject?.map((item, index) => (
                      <SelectItem key={index} value={item}>
                        {capitalizeFirstLetter(item)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              )
            }
            
            {/* for exam type */}
            <Select
              className="border-red-600 border "
              onValueChange={(value) =>
                setSearchData({ ...searchData, examType: value })
              }
              required
            >
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Select a examType" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>examType</SelectLabel>
                  {examTypeData?.map((item, index) => (
                    <SelectItem key={index} value={item.examTypeName}>
                      {capitalizeFirstLetter(item.examTypeName)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
              {/* {
                role === "student" && (
                <input
                  type="text"
                  placeholder="Search by roll no"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none placeholder:text-sm"
                  onChange={(e) =>
                    setSearchData({ ...searchData, roll: e.target.value })
                  }
                  value={searchData.roll}
                />)
              } */}
            
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
                View Marks
              </span>
            </div>

            {/* save all button  */}
            {/* <div>
              <Button
                className="bg-[#452B90] hover:bg-[#c29732]"
                onClick={editStudent}
              >
                <SaveAllIcon /> <span>Save All</span>
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
                  "S.No",
                  "Roll No",
                  "Student Name",
                  "Class (Section)",
                  "Subject",
                  "Marks",
                  "Teacher Name",
                  // "Save",
                ].map((header, index) => (
                  <TableHead
                    key={index}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold  ${
                      header === "Save" ? "text-right" : "text-left"
                    }`}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                paginatedData?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Search to see the data
                    </TableCell>
                  </TableRow>
                ): (paginatedData?.map((item, index) => (
                 
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
                      {item.roll}
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
                      {searchData.className} ({searchData.section})
                    </TableCell>
                    <TableCell
                      className={`px-4 py-2 border text-left ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      } `}
                    >
                      {searchData?.subject}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-2 border text-left ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      } `}
                    >
                      {item.marks}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-2 border text-left ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      } `}
                    >
                      {item.Teacher}
                    </TableCell>
  
                    {/* <TableCell
                      className={`px-4 py-2 border  text-right ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      } `}
                    >
                      <Button
                        className="bg-[#452B90] hover:bg-[#c29732]"
                        onClick={() => editStudent(item.id)}
                      >
                        <Save /> <span className="hidden sm:inline">Save</span>
                      </Button>
                    </TableCell> */}
                  </TableRow>
                )))
              }
              
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

export default ViewMarksPage;
