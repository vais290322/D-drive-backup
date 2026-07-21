import { academicUrlApi } from "@/common";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import { subjectAssignPageSteps } from "@/components/Tour/Steps/AcademicSteps/Steps";
import TourButton from "@/components/Tour/TourButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { setSubjectAssign } from "@/utils/academic/subjectAssignSlice";
import axios from "axios";
import { BookOpen, Loader2, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const SubjectAssignPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [input, setInput] = useState({
    classId: "",
    subjectId: "",
  });
  const [editInput, setEditInput] = useState({
    classId: "",
    subjectId: "",
    roomNo: "",
  });

  const allClass = useSelector((state) => state.class.classNames);
  const allSubject = useSelector((state) => state.subject.subjectNames);
  const subjectAssign =
    useSelector((state) => state.subjectAssign.subjectAssign) || [];
  const dispatch = useDispatch();

  // Filter data based on search term
  const filteredData = subjectAssign?.filter(
    (item) =>
      item.classId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subjectId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dataLength = filteredData?.length || 0;

  // for fetch the class data
  const fetchSubjectAssignData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${academicUrlApi.SubjectAssign.url}/${schoolId}`
      );
      dispatch(setSubjectAssign(response.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectAssignData();
  }, []);

  // for add new Subject Assign data
  const addNewSubjectAssign = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${academicUrlApi.SubjectAssign.url}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setInput({
          classId: "",
          subjectId: "",
        });
        toast.success(response.data.message || "Subject assigned successfully");
        fetchSubjectAssignData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error assigning subject");
    } finally {
      setPostApiLoading(false);
    }
  };

  const updateSubjectAssignData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${academicUrlApi.SubjectAssign.url}/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        // Ensure we're passing a string to toast.success
        if (typeof response?.data === "string") {
          toast.success(response.data);
        } else if (response?.data?.message) {
          toast.success(response.data.message);
        } else {
          toast.success("Subject assignment updated successfully!");
        }

        // Update the local state with the edited data
        const updatedData = subjectAssign.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({ classId: "", subjectId: "" });
        dispatch(setSubjectAssign(updatedData));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update subject assignment"
      );
    } finally {
      setPostApiLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditInput({
      classId: item.classId,
      subjectId: item.subjectId,
    });
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

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

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
            Subject Assignment
            <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-80">
            Assign subjects to classes for your school curriculum
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
            <div className="assignmentAvailable mb-4 md:mb-0">
              <h2
                className={`text-xl font-bold flex items-center ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Subject Assignments
              </h2>
              <p
                className={`mt-1 text-sm ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {subjectAssign?.length || 0} assignments available
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
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Add New Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className={`assignSubject ${
                      theme === "light"
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                        : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    } text-white shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Assign Subject</span>
                  </Button>
                </DialogTrigger>

                <DialogContent
                  className={`sm:max-w-[425px] ${
                    theme === "light"
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-white text-gray-800 border-gray-200"
                  }`}
                >
                  <DialogHeader>
                    <DialogTitle
                      className={
                        theme === "light" ? "text-white" : "text-gray-800"
                      }
                    >
                      Assign New Subject
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={addNewSubjectAssign}>
                    <div className="grid gap-6 py-4">
                      {/* Class Selection */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="className"
                          className={
                            theme === "light"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }
                        >
                          Select a Class
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setInput({ ...input, classId: value })
                          }
                        >
                          <SelectTrigger
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent
                            className={
                              theme === "light"
                                ? "bg-gray-700 text-white border-gray-600"
                                : "bg-white text-gray-800 border-gray-200"
                            }
                          >
                            <SelectGroup>
                              <SelectLabel
                                className={
                                  theme === "light"
                                    ? "text-gray-300"
                                    : "text-gray-700"
                                }
                              >
                                Class
                              </SelectLabel>
                              {allClass?.map((className, index) => (
                                <SelectItem
                                  key={index + 1}
                                  value={className}
                                  className={
                                    theme === "light"
                                      ? "text-white hover:bg-gray-600"
                                      : "text-gray-800 hover:bg-gray-100"
                                  }
                                >
                                  {capitalizeFirstLetter(className)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* subject Selection */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="sectionName"
                          className={
                            theme === "light"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }
                        >
                          Select a Subject
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setInput({ ...input, subjectId: value })
                          }
                        >
                          <SelectTrigger
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent
                            className={
                              theme === "light"
                                ? "bg-gray-700 text-white border-gray-600"
                                : "bg-white text-gray-800 border-gray-200"
                            }
                          >
                            <SelectGroup>
                              <SelectLabel
                                className={
                                  theme === "light"
                                    ? "text-gray-300"
                                    : "text-gray-700"
                                }
                              >
                                Subject
                              </SelectLabel>
                              {allSubject?.map((subject, index) => (
                                <SelectItem
                                  key={index + 1}
                                  value={subject}
                                  className={
                                    theme === "light"
                                      ? "text-white hover:bg-gray-600"
                                      : "text-gray-800 hover:bg-gray-100"
                                  }
                                >
                                  {capitalizeFirstLetter(subject)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      {postApiLoading ? (
                        <Button className="flex items-center justify-center bg-gray-500 text-white cursor-not-allowed">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className={`w-full ${
                            theme === "light"
                              ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                              : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                          } text-white shadow-md hover:shadow-lg transition-all duration-300`}
                        >
                          Save Assignment
                        </Button>
                      )}
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Tour button */}
              <TourButton
                steps={subjectAssignPageSteps}
                tourName={"subjectAssignPage-tour"}
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
                  Loading assignments...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {!subjectAssign || subjectAssign.length === 0 ? (
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
                    No subject assignments found
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Assign your first subject to a class to get started
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
                            "Class Name",
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
                              } ${
                                header === "Subject Code" || header === "S.No"
                                  ? "hidden sm:table-cell"
                                  : ""
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
                              className={`px-4 py-3 hidden sm:table-cell ${
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
                              {item.classId}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.subjectId}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 hidden sm:table-cell ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {item.subjectCode}
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
                                {/* Edit Dialog */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <FaEdit
                                      className="sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm"
                                      onClick={() => handleEditClick(item)}
                                    />
                                  </DialogTrigger>

                                  <DialogContent
                                    className={`sm:max-w-[425px] ${
                                      theme === "light"
                                        ? "bg-gray-800 text-white border-gray-700"
                                        : "bg-white text-gray-800 border-gray-200"
                                    }`}
                                  >
                                    <DialogHeader>
                                      <DialogTitle
                                        className={
                                          theme === "light"
                                            ? "text-white"
                                            : "text-gray-800"
                                        }
                                      >
                                        Edit Subject Assignment
                                      </DialogTitle>
                                    </DialogHeader>
                                    <form
                                      onSubmit={(e) =>
                                        updateSubjectAssignData(e, item.id)
                                      }
                                    >
                                      <div className="grid gap-6 py-4">
                                        {/* Class Selection */}
                                        <div className="flex flex-col gap-2">
                                          <Label
                                            htmlFor="className"
                                            className={
                                              theme === "light"
                                                ? "text-gray-300"
                                                : "text-gray-700"
                                            }
                                          >
                                            Select a Class
                                          </Label>
                                          <Select
                                            defaultValue={item.classId}
                                            onValueChange={(value) =>
                                              setEditInput({
                                                ...editInput,
                                                classId: value,
                                              })
                                            }
                                          >
                                            <SelectTrigger
                                              className={`w-full ${
                                                theme === "light"
                                                  ? "bg-gray-700 border-gray-600 text-white"
                                                  : "bg-white border-gray-300"
                                              }`}
                                            >
                                              <SelectValue
                                                placeholder={item.classId}
                                              />
                                            </SelectTrigger>
                                            <SelectContent
                                              className={
                                                theme === "light"
                                                  ? "bg-gray-700 text-white border-gray-600"
                                                  : "bg-white text-gray-800 border-gray-200"
                                              }
                                            >
                                              <SelectGroup>
                                                <SelectLabel
                                                  className={
                                                    theme === "light"
                                                      ? "text-gray-300"
                                                      : "text-gray-700"
                                                  }
                                                >
                                                  Class
                                                </SelectLabel>
                                                {allClass?.map(
                                                  (className, idx) => (
                                                    <SelectItem
                                                      key={idx}
                                                      value={className}
                                                      className={
                                                        theme === "light"
                                                          ? "text-white hover:bg-gray-600"
                                                          : "text-gray-800 hover:bg-gray-100"
                                                      }
                                                    >
                                                      {capitalizeFirstLetter(
                                                        className
                                                      )}
                                                    </SelectItem>
                                                  )
                                                )}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* Subject Selection */}
                                        <div className="flex flex-col gap-2">
                                          <Label
                                            htmlFor="sectionName"
                                            className={
                                              theme === "light"
                                                ? "text-gray-300"
                                                : "text-gray-700"
                                            }
                                          >
                                            Select a Subject
                                          </Label>
                                          <Select
                                            defaultValue={item.subjectId}
                                            onValueChange={(value) =>
                                              setEditInput({
                                                ...editInput,
                                                subjectId: value,
                                              })
                                            }
                                          >
                                            <SelectTrigger
                                              className={`w-full ${
                                                theme === "light"
                                                  ? "bg-gray-700 border-gray-600 text-white"
                                                  : "bg-white border-gray-300"
                                              }`}
                                            >
                                              <SelectValue
                                                placeholder={item.subjectId}
                                              />
                                            </SelectTrigger>
                                            <SelectContent
                                              className={
                                                theme === "light"
                                                  ? "bg-gray-700 text-white border-gray-600"
                                                  : "bg-white text-gray-800 border-gray-200"
                                              }
                                            >
                                              <SelectGroup>
                                                <SelectLabel
                                                  className={
                                                    theme === "light"
                                                      ? "text-gray-300"
                                                      : "text-gray-700"
                                                  }
                                                >
                                                  Subject
                                                </SelectLabel>
                                                {allSubject?.map(
                                                  (subject, idx) => (
                                                    <SelectItem
                                                      key={idx}
                                                      value={subject}
                                                      className={
                                                        theme === "light"
                                                          ? "text-white hover:bg-gray-600"
                                                          : "text-gray-800 hover:bg-gray-100"
                                                      }
                                                    >
                                                      {capitalizeFirstLetter(
                                                        subject
                                                      )}
                                                    </SelectItem>
                                                  )
                                                )}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>

                                      <DialogFooter>
                                        {postApiLoading ? (
                                          <Button className="flex items-center justify-center bg-gray-500 text-white cursor-not-allowed">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            <span>Saving...</span>
                                          </Button>
                                        ) : (
                                          <Button
                                            type="submit"
                                            className={`w-full ${
                                              theme === "light"
                                                ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                                                : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                                            } text-white shadow-md hover:shadow-lg transition-all duration-300`}
                                          >
                                            Save Changes
                                          </Button>
                                        )}
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>

                                {/* Delete Component */}
                                <DeleteComponent
                                  name={`${item.classId} - ${item.subjectId}`}
                                  deletePath={`${academicUrlApi.SubjectAssign.url}/${item.id}/${schoolId}`}
                                  onDelete={() => {
                                    const updatedData = subjectAssign.filter(
                                      (data) => data.id !== item.id
                                    );
                                    dispatch(setSubjectAssign(updatedData));
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

export default SubjectAssignPage;
