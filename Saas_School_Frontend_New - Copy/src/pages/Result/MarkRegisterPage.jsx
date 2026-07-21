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
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { Button } from "@/components/ui/button";
import { Save, SaveAllIcon } from "lucide-react";
import SaveAllComponent from "@/components/ForResult/SaveAllComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setExamType } from "@/utils/routines/examTypeSlice";
import resultUrlApi from "@/common/result";

const MarkRegisterPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [searchClass, setSearchClass] = useState([]);
  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
  });
  const [selectedExamType, setSelectedExamType] = useState(null);
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const examTypeData = useSelector((state) => state.examType.examType) || [];
  const teacherDetails = useSelector((state) => state.auth.userDetails) || [];
  const [marksData, setMarksData] = useState({}); // State to store marks input for each student
  const dispatch = useDispatch();
  const schoolId=useSelector((state)=>state?.auth?.schoolId)
  console.log("school id : ",schoolId);
  // console.log("teacherDetails : ", teacherDetails);
  const dataLength = searchClass?.length;


  const searchMarkRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${resultUrlApi.searchStudentForMark.url}/${schoolId}/attendance/students?className=${searchData.className}&section=${searchData.section}`
      );
      if (response) {
        toast.success("Data fetched successfully");
        const sortedData = response.data.sort((a, b) => a.rollNo - b.rollNo);
        setSearchClass(sortedData);
        setMarksData(
          sortedData.reduce(
            (acc, item) => ({
              ...acc,
              [item.id]: item.marks || "", // Initialize marks for each student
            }),
            {}
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    }
  };

  const handleMarksChange = (id, value) => {
    setMarksData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveAll = async () => {
    // Check if any marks field is empty
    const hasEmptyMarks = searchClass?.some(
      (student) => !marksData[student.id]?.trim()
    );

    if(searchData.className === '' || searchData.section === '') {
      toast.error("Please select class and section");
      return;
    }

    if(selectedExamType === null) {
      toast.error("Please select exam type");
      return;
    }

    if (hasEmptyMarks) {
      toast.error("All students' marks are required");
      return;
    }
  
    try {
      setPostApiLoading(true);
      const payload = searchClass.map((student) => ({
        roll: student.rollNo,
        name: student.studentName,
        mark: marksData[student.id],
      }));

      const dataSend = {
        className: searchData.className,
        section: searchData.section,
        marks: payload,
        subject:teacherDetails.subject,
        teacherName:teacherDetails.teachersName,
        examType:selectedExamType,
        fullMarks:selectedFullMarks
      };

      // console.log("dataSend : ", dataSend);
      const response = await axios.post(
        `${resultUrlApi.markRegister.url}/${schoolId}`,
        dataSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true,
        }
      );
      if (response) {
        toast.success("Marks saved successfully for all students");
        // console.log("response : ", response);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save marks");
    } finally {
      setPostApiLoading(false);
    }
  };

  const fetchExamTypeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${resultUrlApi.fetchExamType.url}/${schoolId}`
      );

      // console.log("response : ", response)
      dispatch(setExamType(response.data.data));
    } catch (error) {
      toast.error(error.response.data.message || "Failed to fetch the data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExamTypeData();
  }, []);

  const selectedFullMarks =
    examTypeData.find((type) => type.examTypeName === selectedExamType)
      ?.examMarks || 0;

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
            className={`w-full  text-2xl pl-2 font-semibold ${
              theme === "light" ? " text-white" : ""
            } hidden sm:block `}
          >
            Search Class{" "}
          </p>
          <form
            onSubmit={searchMarkRegister}
            className="flex items-center gap-2 w-full"
          >
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
                    <SelectItem key={index + 1} value={item}>
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
              required
            >
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>sections</SelectLabel>
                  {allSection.map((item, index) => (
                    <SelectItem key={index + item} value={item}>
                      {capitalizeFirstLetter(item)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

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
                Mark Register
              </span>
            </div>
            {/* exam type and full marks display */}
            <div className="flex gap-6 items-center">
              {/* Exam Type Dropdown */}
              <Select
                className="border-red-600 border"
                onValueChange={(value) => setSelectedExamType(value)} // Update selected exam type
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Exam Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Exam Types</SelectLabel>
                    {examTypeData.map((item, index) => (
                      <SelectItem key={index} value={item.examTypeName}>
                        {capitalizeFirstLetter(item.examTypeName)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Full Marks Display */}
              <h2>
                Full Marks: {selectedFullMarks ? selectedFullMarks : "0"}
              </h2>
            </div>
            <div>
              
              <SaveAllComponent handleSaveAll={handleSaveAll} />

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
                  "Roll No",
                  "Student Name",
                  "Class (Section)",
                  "Subject",
                  "Marks",
                ].map((header, index) => (
                  <TableHead
                    key={index + 1}
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
                    {item.className}({item.section})
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {teacherDetails.subject}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <div>
                      <input
                        type="text"
                        name="marks"
                        placeholder="Enter Marks"
                        value={marksData[item.id]}
                        onChange={(e) =>
                          handleMarksChange(item.id, e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
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

export default MarkRegisterPage;

