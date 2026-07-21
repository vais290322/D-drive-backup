import resultUrlApi from "@/common/result";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { markRegisterPageSteps } from "@/components/Tour/Steps/ResultSteps/Steps";
import TourButton from "@/components/Tour/TourButton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/context/ThemeContext";
import { setExamType } from "@/utils/routines/examTypeSlice";
import axios from "axios";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

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
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectMarks, setSubjectMarks] = useState({
    subjectMark: 0,
    projectMark: 0,
  });
  const [marksInputData, setMarksInputData] = useState({});
  const [projectMarksData, setProjectMarksData] = useState({});

  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const examTypeData = useSelector((state) => state.examType.examType) || [];
  const teacherDetails = useSelector((state) => state.auth.userDetails) || [];
  const userRole = useSelector((state) => state.auth.user) || "teacher";

  const [marksData, setMarksData] = useState({}); // State to store marks input for each student
  const dispatch = useDispatch();
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const [examInfo, setExamInfo] = useState([]);
  const [subjectError, setSubjectError] = useState("");

  // console.log("school id : ", schoolId);
  // console.log("teacherDetails : ", teacherDetails);
  const dataLength = searchClass?.length;

  const searchMarkRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${resultUrlApi.searchStudentForMark1.url}/${schoolId}/attendance/students?className=${searchData.className}&section=${searchData.section}`
      );
      if (response) {
        toast.success("Data fetched successfully");
        const sortedData = response.data.sort((a, b) => a.rollNo - b.rollNo);
        setSearchClass(sortedData);
        // In the searchMarkRegister function, after setting searchClass
        setMarksInputData(
          sortedData.reduce(
            (acc, item) => ({
              ...acc,
              [item.id]: "", // Initialize subject marks for each student
            }),
            {}
          )
        );
        setProjectMarksData(
          sortedData.reduce(
            (acc, item) => ({
              ...acc,
              [item.id]: "", // Initialize project marks for each student
            }),
            {}
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    }
  };

  // const handleMarksChange = (id, value) => {
  //   setMarksData((prev) => ({ ...prev, [id]: value }));
  // };

  // const handleSaveAll = async () => {
  //   // Check if any marks field is empty
  //   const hasEmptyMarks = searchClass?.some(
  //     (student) => !marksData[student.id]?.trim()
  //   );

  //   if (searchData.className === "" || searchData.section === "") {
  //     toast.error("Please select class and section");
  //     return;
  //   }

  //   if (selectedExamType === null) {
  //     toast.error("Please select exam type");
  //     return;
  //   }

  //   if (hasEmptyMarks) {
  //     toast.error("All students' marks are required");
  //     return;
  //   }

  //   try {
  //     setPostApiLoading(true);
  //     const payload = searchClass.map((student) => ({
  //       roll: student.rollNo,
  //       name: student.studentName,
  //       mark: marksData[student.id],
  //     }));

  //     const dataSend = {
  //       className: searchData.className,
  //       section: searchData.section,
  //       marks: payload,
  //       subject: teacherDetails.subject,
  //       teacherName: teacherDetails.teachersName,
  //       examType: selectedExamType,
  //       fullMarks: selectedFullMarks,
  //     };

  //     // console.log("dataSend : ", dataSend);
  //     const response = await axios.post(
  //       `${resultUrlApi.markRegister.url}/${schoolId}`,
  //       dataSend,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         // withCredentials: true,
  //       }
  //     );
  //     if (response) {
  //       toast.success("Marks saved successfully for all students");
  //       // console.log("response : ", response);
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to save marks");
  //   } finally {
  //     setPostApiLoading(false);
  //   }
  // };

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

  const fetchExamInfo = async () => {
    if (!searchData.className || !selectedExamType) return;

    try {
      const response = await axios.get(
        `https://collage.vaisacademy.com/service6/api/schools/criteria/search/${schoolId}?className=${searchData.className}&examType=${selectedExamType}`
      );
      // console.log("response from fetch exam info: ", response);
      if (response?.data?.success) {
        setExamInfo(response?.data?.data);

        // If user is a teacher, automatically select their subject if it exists in examInfo
        if (userRole === "teacher" && teacherDetails.subject) {
          const teacherSubject = response?.data?.data.find(
            (subject) =>
              subject.subjectName.toLowerCase() ===
              teacherDetails.subject.toLowerCase()
          );

          if (teacherSubject) {
            setSelectedSubject(teacherSubject.subjectName);
            setSubjectMarks({
              subjectMark: teacherSubject.subjectMark || 0,
              projectMark: teacherSubject.projectMark || 0,
            });
            setSubjectError("");
          } else {
            setSubjectError(
              "You can't give marks for this exam as your subject is not included"
            );
          }
        } else if (userRole === "admin" && response?.data?.data.length > 0) {
          // For admin, default to first subject
          setSelectedSubject("");
          setSubjectMarks({
            subjectMark: 0,
            projectMark: 0,
          });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch the data");
    }
  };

  useEffect(() => {
    fetchExamInfo();
  }, [searchData.className, selectedExamType]);

  // Handle subject change for admin
  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
    const selectedSubjectInfo = examInfo.find(
      (subject) => subject.subjectName === value
    );
    if (selectedSubjectInfo) {
      setSubjectMarks({
        subjectMark: selectedSubjectInfo.subjectMark || 0,
        projectMark: selectedSubjectInfo.projectMark || 0,
      });
    }
  };

  // Validate marks input
  const handleMarksChange = (id, value, type) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const numValue = value === "" ? "" : parseInt(value, 10);

    if (type === "subject") {
      // Check if value exceeds subject mark
      if (numValue !== "" && numValue > subjectMarks.subjectMark) {
        toast.error(`Subject mark cannot exceed ${subjectMarks.subjectMark}`);
        return;
      }
      setMarksInputData((prev) => ({ ...prev, [id]: value }));
    } else {
      // Check if value exceeds project mark
      if (numValue !== "" && numValue > subjectMarks.projectMark) {
        toast.error(`Project mark cannot exceed ${subjectMarks.projectMark}`);
        return;
      }
      setProjectMarksData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSaveAll = async () => {
    // Validate inputs
    if (searchData.className === "" || searchData.section === "") {
      toast.error("Please select class and section");
      return;
    }

    if (selectedExamType === null) {
      toast.error("Please select exam type");
      return;
    }

    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }

    // Check for missing marks
    const studentsWithMissingMarks = [];
    searchClass.forEach((student) => {
      if (
        !marksInputData[student.id] ||
        marksInputData[student.id].trim() === ""
      ) {
        studentsWithMissingMarks.push(student.studentName);
      }
      if (
        !projectMarksData[student.id] ||
        projectMarksData[student.id].trim() === ""
      ) {
        if (!studentsWithMissingMarks.includes(student.studentName)) {
          studentsWithMissingMarks.push(student.studentName);
        }
      }
    });

    if (studentsWithMissingMarks.length > 0) {
      toast.error(
        `Marks are missing for: ${studentsWithMissingMarks.join(", ")}`
      );
      return;
    }

    try {
      setPostApiLoading(true);
      const payload = searchClass.map((student) => ({
        roll: student.rollNo,
        name: student.studentName,
        mark: marksInputData[student.id],
        projectMark: projectMarksData[student.id],
      }));

      const dataSend = {
        className: searchData.className,
        section: searchData.section,
        marks: payload,
        subject: selectedSubject,
        teacherName:
          userRole === "teacher" ? teacherDetails.teachersName : "Admin",
        examType: selectedExamType,
        subjectFullMark: subjectMarks.subjectMark,
        projectFullMark: subjectMarks.projectMark,
        fullMarks: subjectMarks.subjectMark + subjectMarks.projectMark,
        userRole: userRole,
      };

      // console.log("dataSend: ", dataSend);
      // ${resultUrlApi.markRegister.url}/${schoolId}
      const response = await axios.post(
        `https://collage.vaisacademy.com/service6/api/marks-register/${schoolId}`,
        dataSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Marks saved successfully for all students");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save marks");
    } finally {
      setPostApiLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto py-8 px-4">
        {/* Page Header with Gradient */}
        <div
          className={`mb-6 ${
            theme === "light" ? "text-white" : "text-gray-800"
          }`}
        >
          <h1 className="text-2xl md:text-3xl font-bold relative inline-block">
            Mark Register
            <span className="absolute bottom-[-5px] left-0 w-full h-1  bg-gradient-to-r from-purple-500 to-pink-500"></span>
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-80">
            Record and manage student marks for different subjects and exams
          </p>
        </div>

        {/* Search Section */}
        <div
          className={`mb-6 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            theme === "light"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          } flex justify-between`}
        >
          <div
            className={`p-4 sm:p-6 border-b ${
              theme === "light" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                theme === "light" ? "text-white" : "text-gray-800"
              }`}
            >
              Search Class
            </h2>

            <form
              onSubmit={searchMarkRegister}
              className="searchBox flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="w-full sm:w-auto">
                <Select
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, className: value })
                  }
                  required
                >
                  <SelectTrigger
                    className={`w-full sm:w-[180px] ${
                      theme === "light"
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
                        <SelectItem key={index + 1} value={item}>
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto">
                <Select
                  onValueChange={(value) =>
                    setSearchData({ ...searchData, section: value })
                  }
                  required
                >
                  <SelectTrigger
                    className={`w-full sm:w-[180px] ${
                      theme === "light"
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
                        <SelectItem key={index + item} value={item}>
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Tour button */}
          <div className=" p-6">
            <TourButton
              steps={markRegisterPageSteps}
              tourName={"markRegisterPageTour"}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            theme === "light"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Card Header with Actions */}
          <div
            className={`flex flex-col md:flex-row justify-between items-center p-4 sm:p-6 border-b ${
              theme === "light" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="registerAvailable mb-4 md:mb-0">
              <h2
                className={`text-xl font-bold ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                Mark Register
              </h2>
              <p
                className={`text-sm mt-1 ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {searchClass?.length || 0} students found
              </p>
            </div>

            <div className="flex items-center gap-4">
              {userRole === "teacher" ? (
                <h1>
                  Subject:{" "}
                  {selectedSubject || teacherDetails.subject || "Not selected"}
                </h1>
              ) : (
                <div className="w-full sm:w-auto">
                  <Select
                    onValueChange={handleSubjectChange}
                    value={selectedSubject}
                  >
                    <SelectTrigger
                      className={`w-full sm:w-[180px] ${
                        theme === "light"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Subjects</SelectLabel>
                        {examInfo.map(
                          (item, index) => (
                            console.log("item : ", item),
                            (
                              <SelectItem key={index} value={item.subjectName}>
                                {capitalizeFirstLetter(item.subjectName)}
                              </SelectItem>
                            )
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Exam Type Dropdown */}
              <div>
                <Select onValueChange={(value) => setSelectedExamType(value)}>
                  <SelectTrigger
                    className={`examType w-full sm:w-[180px] ${
                      theme === "light"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white"
                    }`}
                  >
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
              </div>

              {/* Save All Button */}
              <Button
                onClick={handleSaveAll}
                disabled={postApiLoading}
                className="saveMarks bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {postApiLoading ? (
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save All Marks
                  </>
                )}
              </Button>
            </div>
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <p
                className={`text-lg font-medium ${
                  theme === "light" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No students found
              </p>
              <p
                className={`text-sm mt-2 ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Select a class and section to view students
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader
                  className={`${
                    theme === "light" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <TableRow>
                    {[
                      "S.No",
                      "Roll No",
                      "Student Name",
                      "Class (Section)",
                      `Subject's Mark (${subjectMarks.subjectMark})`,
                      `Project's Mark (${subjectMarks.projectMark})`,
                    ].map((header, index) => (
                      <TableHead
                        key={index + 1}
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-gray-200" : "text-gray-700"
                        } font-semibold text-sm text-left`}
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
                      className={`transition-colors hover:bg-opacity-10 ${
                        theme === "light"
                          ? "hover:bg-gray-600 border-t border-gray-700"
                          : "hover:bg-gray-100 border-t border-gray-200"
                      }`}
                    >
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 font-medium ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.rollNo}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.studentName}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.className} ({item.section})
                        </span>
                      </TableCell>

                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <input
                          type="text"
                          name="subjectMarks"
                          placeholder={`Enter Marks (max: ${subjectMarks.subjectMark})`}
                          value={marksInputData[item.id] || ""}
                          onChange={(e) =>
                            handleMarksChange(
                              item.id,
                              e.target.value,
                              "subject"
                            )
                          }
                          className={`w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent    ${
                          theme === "light" ? "text-white bg-gray-800 border border-gray-600" : "text-black border border-gray-200"
                        }`}
                          disabled={!!subjectError}
                        />
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3 ${
                          theme === "light" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <input
                          type="text"
                          name="projectMarks"
                          placeholder={`Enter Marks (max: ${subjectMarks.projectMark})`}
                          value={projectMarksData[item.id] || ""}
                          onChange={(e) =>
                            handleMarksChange(
                              item.id,
                              e.target.value,
                              "project"
                            )
                          }
                          className={`w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent    ${
                            theme === "light" ? "text-white bg-gray-800 border border-gray-600" : "text-black border border-gray-200"
                          }`}
                          disabled={!!subjectError}
                        />
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
              className={`p-4 border-t ${
                theme === "light" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <PaginationComponent
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalPages={totalPages}
                onRowsPerPageChange={handleRowsPerPageChange}
                onPageChange={setCurrentPage}
                className={`${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkRegisterPage;
