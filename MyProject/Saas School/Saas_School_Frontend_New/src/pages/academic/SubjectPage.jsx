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
import AddNewComponents from "@/components/Addnew/AddNewComponents";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import EditDataComponent from "@/components/EditData/EditDataComponent";
import { useDispatch, useSelector } from "react-redux";
import { setSubject } from "@/utils/academic/subjectSlice";
import { academicUrlApi } from "@/common";
import { BookOpen, Loader2, Search } from "lucide-react";
import TourButton from "@/components/Tour/TourButton";
import { subjectPageSteps } from "@/components/Tour/Steps/AcademicSteps/Steps";

const SubjectPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [input, setInput] = useState({
    subjectName: "",
    subject_index: "",
  });
  const [editInput, setEditInput] = useState({
    subjectName: "",
    subject_index: "",
  });

  const dispatch = useDispatch();
  const subjectData = useSelector((state) => state.subject.subject) || [];
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  // Filter data based on search term
  const filteredData = subjectData?.filter(
    (item) =>
      item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject_index.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dataLength = filteredData?.length || 0;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setEditInput({
      subjectName: item.subjectName,
      subject_index: item.subject_index,
    });
  };

  // for fetch the class data
  const fetchSubjectData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${academicUrlApi.getAllSubject.url}/${schoolId}` 
      );
      if (response) {
        dispatch(setSubject(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectData();
  }, []);

  // for add new Subject data
  const addNewSubject = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${academicUrlApi.getAllSubject.url}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setInput({
          subjectName: "",
          subject_index: "",
        });
        toast.success(response.data.message || "Subject added successfully");
        fetchSubjectData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding subject");
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateSubjectData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);

      // Ensure no empty fields are sent in the request
      if (!editInput.subjectName || !editInput.subject_index) {
        toast.error("Both Subject Name and Subject Code are required!");
        return;
      }

      const response = await axios.put(
        `${academicUrlApi.getAllSubject.url}/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        // Update the specific subject in the Redux store
        const updatedData = subjectData.map((item) =>
          item.id === id
            ? {
                ...item,
                subjectName: editInput.subjectName,
                subject_index: editInput.subject_index,
              }
            : item
        );
        dispatch(setSubject(updatedData)); // Update Redux store
        toast.success(response.data.message || "Subject updated successfully!");
        setEditInput({ subjectName: "", subject_index: "" }); // Clear input fields
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update subject");
    } finally {
      setPostApiLoading(false);
    }
  };

  const dialogHeader = "Subject";
  const formData = [
    {
      name: "subjectName",
      label: "Subject Name",
      type: "text",
      placeholder: "Subject Name",
      required: true,
    },
    {
      name: "subject_index",
      label: "Subject Code",
      type: "text",
      placeholder: "Subject Code",
      required: true,
    },
  ];

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
            Subject Management
            <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-80">
            Create and manage subjects for your school
          </p>
        </div>

        {/* Main Content Card */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            theme === "light"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Card Header */}
          <div
            className={`flex flex-col md:flex-row justify-between items-center p-4 sm:p-6 border-b ${
              theme === "light" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="subjectAvailable mb-4 md:mb-0">
              <h2
                className={`text-xl font-bold flex items-center ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Subjects
              </h2>
              <p
                className={`mt-1 text-sm ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {subjectData?.length || 0} subjects available
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Search Input */}
              <div
                className={`searchBox relative w-full md:w-64 ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  className={`pl-10 pr-4 py-2 w-full rounded-md border ${
                    theme === "light" 
                      ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500" 
                      : "bg-white border-gray-300 focus:border-purple-500"
                  } focus:outline-none`}
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Add New Button */}
              <AddNewComponents
                onChangeFunctin={changeEventHandler}
                onSubmitFunction={addNewSubject}
                dialogHeader={dialogHeader}
                formData={formData}
                inputValue={input}
                postApiLoading={postApiLoading}
                buttonClassName={`${
                  theme === "light"
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                } text-white shadow-md hover:shadow-lg transition-all duration-300`}
              />

              {/* Tour button */}
              <TourButton
                steps={subjectPageSteps}
                tourName={"subjectPage-tour"}
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="flex flex-col items-center">
                <Loader2
                  className={`h-12 w-12 animate-spin ${
                    theme === "light" ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <p
                  className={`mt-4 ${
                    theme === "light" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Loading subjects...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {!subjectData || subjectData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <BookOpen
                    className={`w-16 h-16 mb-4 ${
                      theme === "light" ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg font-medium ${
                      theme === "light" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No subjects found
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Add your first subject to get started
                  </p>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader
                        className={`${
                          theme === "light" ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <TableRow>
                          {[
                            "S.No",
                            "Subject Name",
                            "Subject Code",
                            "Action",
                          ].map((header, index) => (
                            <TableHead
                              key={index}
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-gray-200"
                                  : "text-gray-700"
                              } font-semibold text-sm ${
                                header === "Action" ? "text-right" : "text-left"
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
                            className={`transition-colors hover:bg-opacity-10 ${
                              theme === "light"
                                ? "hover:bg-gray-600 border-t border-gray-700"
                                : "hover:bg-gray-100 border-t border-gray-200"
                            }`}
                          >
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {(currentPage - 1) * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 font-medium ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.subjectName}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {item.subject_index}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <div className="flex gap-2 justify-end">
                                <EditDataComponent
                                  formData={formData}
                                  postApiLoading={postApiLoading}
                                  onChangeFunctin={(e) =>
                                    setEditInput({
                                      ...editInput,
                                      [e.target.name]: e.target.value,
                                    })
                                  }
                                  inputValue={editInput}
                                  onSubmitFunction={(e) =>
                                    updateSubjectData(e, item.id)
                                  }
                                  onEditClick={() => handleEditClick(item)}
                                  buttonClassName={`${
                                    theme === "light"
                                      ? "bg-amber-600 hover:bg-amber-700"
                                      : "bg-amber-500 hover:bg-amber-600"
                                  } text-white transition-colors`}
                                />
                                <DeleteComponent
                                  name={item.subjectName}
                                  deletePath={`${academicUrlApi.getAllSubject.url}/${item.id}/${schoolId}`}
                                  onDelete={() => {
                                    const updatedData = subjectData.filter(
                                      (data) => data.id !== item.id
                                    );
                                    dispatch(setSubject(updatedData));
                                  }}
                                  buttonClassName={`${
                                    theme === "light"
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-red-500 hover:bg-red-600"
                                  } text-white transition-colors`}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* No Results State */}
                  {searchTerm && filteredData.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Search
                        className={`w-12 h-12 mb-3 ${
                          theme === "light" ? "text-gray-400" : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-lg font-medium ${
                          theme === "light" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        No results found
                      </p>
                      <p
                        className={`text-sm mt-2 ${
                          theme === "light" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Try adjusting your search term
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {filteredData.length > 0 && (
                    <div
                      className={`p-4 border-t ${
                        theme === "light"
                          ? "border-gray-700"
                          : "border-gray-200"
                      }`}
                    >
                      <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        dataLength={dataLength}
                        theme={theme}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
