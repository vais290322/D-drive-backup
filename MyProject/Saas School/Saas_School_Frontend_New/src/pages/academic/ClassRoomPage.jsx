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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setClassRoom } from "@/utils/academic/classRoomSlice";
import { Building, Edit, Loader2, Plus, Search } from "lucide-react";
import { academicUrlApi } from "@/common";
import { FaEdit } from "react-icons/fa";
import TourButton from "@/components/Tour/TourButton";
import { classRoomPageSteps } from "@/components/Tour/Steps/AcademicSteps/Steps";

const ClassRoomPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allClass = useSelector((state) => state.class.classNames);
  const allSection = useSelector((state) => state.section.sectionNames);
  const dispatch = useDispatch();
  const classRooms = useSelector((state) => state.classRoom.classRoom) || [];
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const role = useSelector((state) => state?.auth?.user);
  // console.log("room role : ", role);
  const [input, setInput] = useState({
    classId: "",
    roomNo: "",
    sectionId: "",
  });
  const [editInput, setEditInput] = useState({
    classId: "",
    roomNo: "",
    sectionId: "",
  });
  const [searchClass, setSearchClass] = useState("");
  const [searchClassData, setSearchClassData] = useState([]);
  const [showSearchData, setShowSearchData] = useState(false);

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setEditInput({
      classId: item.classId,
      roomNo: item.roomNo,
      sectionId: item.sectionId,
    });
  };

  // Fetch all class room data
  const fetchClassRoomData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${academicUrlApi.getAllClassRoom.url}/${schoolId}`
      );
      dispatch(setClassRoom(response.data));
      setShowSearchData(false); // Reset to default data
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassRoomData();
  }, []);

  // Add new class room
  const addNewClassRoom = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${academicUrlApi.getAllClassRoom.url}/${schoolId}`,
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
          roomNo: "",
          sectionId: "",
        });
        toast.success(response?.data || "Classroom added successfully");
        fetchClassRoomData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add class room");
    } finally {
      setPostApiLoading(false);
    }
  };

  // Update class room data
  const updateClassRoomData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${academicUrlApi.getAllClassRoom.url}/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success(response?.data || "Class Room updated successfully!");
        const updatedData = classRooms.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({ classId: "", roomNo: "", sectionId: "" });
        dispatch(setClassRoom(updatedData));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update class room"
      );
    } finally {
      setPostApiLoading(false);
    }
  };

  // Handle search
  const searchRooms = async (e) => {
    e.preventDefault();
    try {
      if (searchClass === "") {
        toast.error("Please select a class name to search");
        return;
      }
      setLoading(true);
      const response = await axios.get(
        `${academicUrlApi.getAllClassRoom.url}/${schoolId}/search?classId=${searchClass}`
      );
      if (response) {
        setSearchClassData(response.data);
        setShowSearchData(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    } finally {
      setLoading(false);
    }
  };

  // Reset search results
  const resetSearch = () => {
    setShowSearchData(false);
    setSearchClass("");
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const dataToShow = showSearchData ? searchClassData : classRooms;
  const dataLength = dataToShow?.length || 0;

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = dataToShow?.slice(
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

  const hasEditPermission = ["admin", "edp", "vais"].includes(role);

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
            Classroom Management
            <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-80">
            Manage classrooms and room assignments for your school
          </p>
        </div>

        {/* Search Card */}
        <div
          className={`mb-6 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            theme === "light"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          } flex justify-between items-center`}
        >
          <div className="searchBox p-4 sm:p-6">
            <h2
              className={`text-lg font-semibold mb-4 flex items-center ${
                theme === "light" ? "text-white" : "text-gray-800"
              }`}
            >
              <Search className="mr-2 h-5 w-5" />
              Search Classrooms
            </h2>

            <form
              onSubmit={searchRooms}
              className="flex flex-col sm:flex-row gap-4 items-center"
            >
              <div className="w-full sm:w-auto">
                <Select
                  onValueChange={(value) => setSearchClass(value)}
                  value={searchClass}
                >
                  <SelectTrigger
                    className={`w-full sm:w-[200px] ${
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
                          theme === "light" ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        Class
                      </SelectLabel>
                      {allClass?.map((item, index) => (
                        <SelectItem
                          key={index}
                          value={item}
                          className={
                            theme === "light"
                              ? "text-white hover:bg-gray-600"
                              : "text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {capitalizeFirstLetter(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="submit"
                  className={`${
                    theme === "light"
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                      : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  } text-white shadow-md hover:shadow-lg transition-all duration-300`}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>

                {showSearchData && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetSearch}
                    className={`${
                      theme === "light"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </div>
          <div className=" px-6">
            <TourButton
              tourName={"classroompage-tour"}
              steps={classRoomPageSteps}
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
          {/* Card Header */}
          <div
            className={`flex flex-col md:flex-row justify-between items-center p-4 sm:p-6 border-b ${
              theme === "light" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="classroomsAvailable mb-4 md:mb-0">
              <h2
                className={`text-xl font-bold flex items-center ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                <Building className="mr-2 h-5 w-5" />
                Classrooms
              </h2>
              <p
                className={`mt-1 text-sm ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {showSearchData
                  ? `${
                      searchClassData?.length || 0
                    } classrooms found for "${searchClass}"`
                  : `${classRooms?.length || 0} classrooms available`}
              </p>
            </div>

            {hasEditPermission && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className={`addClasroom ${
                      theme === "light"
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                        : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    } text-white shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Classroom</span>
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
                      Add New Classroom
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={addNewClassRoom}>
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
                              {allClass?.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={item}
                                  className={
                                    theme === "light"
                                      ? "text-white hover:bg-gray-600"
                                      : "text-gray-800 hover:bg-gray-100"
                                  }
                                >
                                  {capitalizeFirstLetter(item)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Section Selection */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="sectionName"
                          className={
                            theme === "light"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }
                        >
                          Select a Section
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setInput({ ...input, sectionId: value })
                          }
                        >
                          <SelectTrigger
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            <SelectValue placeholder="Select a section" />
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
                                Section
                              </SelectLabel>
                              {allSection?.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={item}
                                  className={
                                    theme === "light"
                                      ? "text-white hover:bg-gray-600"
                                      : "text-gray-800 hover:bg-gray-100"
                                  }
                                >
                                  {capitalizeFirstLetter(item)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Room Number Input */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="roomNo"
                          className={
                            theme === "light"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }
                        >
                          Room Number
                        </Label>
                        <Input
                          id="roomNo"
                          name="roomNo"
                          className={`w-full ${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600 text-black"
                              : "bg-white border-gray-300"
                          }`}
                          placeholder="Enter Room Number"
                          value={input.roomNo}
                          onChange={changeEventHandler}
                        />
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
                          Save Classroom
                        </Button>
                      )}
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
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
                  Loading classrooms...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {!dataToShow || dataToShow.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Building
                    className={`w-16 h-16 mb-4 ${
                      theme === "light" ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg font-medium ${
                      theme === "light" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {showSearchData
                      ? `No classrooms found for "${searchClass}"`
                      : "No classrooms found"}
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {showSearchData
                      ? "Try searching for a different class"
                      : "Add your first classroom to get started"}
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
                            "Section Name",
                            "Room No",
                            ...(hasEditPermission ? ["Action"] : []),
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
                                header === "S.No" ? "hidden sm:table-cell" : ""
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
                              {item.sectionId}
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {item.roomNo}
                              </span>
                            </TableCell>

                            {hasEditPermission && (
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
                                        className={`editClassroom ${
                                          theme === "light"
                                            ? "bg-amber-600 hover:bg-amber-700"
                                            : "bg-amber-500 hover:bg-amber-600"
                                        } sm:w-8 sm:h-8 w-6 h-6 text-white p-1 sm:p-2 cursor-pointer rounded-sm`}
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
                                          Edit Classroom
                                        </DialogTitle>
                                      </DialogHeader>
                                      <form
                                        onSubmit={(e) =>
                                          updateClassRoomData(e, item.id)
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

                                          {/* Section Selection */}
                                          <div className="flex flex-col gap-2">
                                            <Label
                                              htmlFor="sectionName"
                                              className={
                                                theme === "light"
                                                  ? "text-gray-300"
                                                  : "text-gray-700"
                                              }
                                            >
                                              Select a Section
                                            </Label>
                                            <Select
                                              defaultValue={item.sectionId}
                                              onValueChange={(value) =>
                                                setEditInput({
                                                  ...editInput,
                                                  sectionId: value,
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
                                                  placeholder={item.sectionId}
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
                                                    Section
                                                  </SelectLabel>
                                                  {allSection?.map(
                                                    (section, idx) => (
                                                      <SelectItem
                                                        key={idx}
                                                        value={section}
                                                        className={
                                                          theme === "light"
                                                            ? "text-white hover:bg-gray-600"
                                                            : "text-gray-800 hover:bg-gray-100"
                                                        }
                                                      >
                                                        {capitalizeFirstLetter(
                                                          section
                                                        )}
                                                      </SelectItem>
                                                    )
                                                  )}
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          {/* Room Number Input */}
                                          <div className="flex flex-col gap-2">
                                            <Label
                                              htmlFor="roomNo"
                                              className={
                                                theme === "light"
                                                  ? "text-gray-300"
                                                  : "text-gray-700"
                                              }
                                            >
                                              Room Number
                                            </Label>
                                            <Input
                                              id="roomNo"
                                              value={editInput.roomNo}
                                              onChange={(e) =>
                                                setEditInput({
                                                  ...editInput,
                                                  roomNo: e.target.value,
                                                })
                                              }
                                              className={`w-full ${
                                                theme === "light"
                                                  ? "bg-gray-700 border-gray-600 text-black"
                                                  : "bg-white border-gray-300"
                                              }`}
                                              placeholder="Enter Room Number"
                                            />
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
                                    name={`${item.classId} - ${item.sectionId} (Room ${item.roomNo})`}
                                    deletePath={`${academicUrlApi.getAllClassRoom.url}/${item.id}/${schoolId}`}
                                    onDelete={() => {
                                      const updatedData = classRooms.filter(
                                        (data) => data.id !== item.id
                                      );
                                      dispatch(setClassRoom(updatedData));
                                    }}
                                    buttonClassName={`${
                                      theme === "light"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-red-500 hover:bg-red-600"
                                    } text-white transition-colors`}
                                  />
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div
                    className={`p-4 border-t ${
                      theme === "light" ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      totalItems={dataLength}
                      theme={theme}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassRoomPage;
