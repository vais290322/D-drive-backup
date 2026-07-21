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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { setClassTime } from "@/utils/routines/classTimeSlice";
import { AlarmClock, Clock, Edit, Loader2, Plus, Search } from "lucide-react";
import routineUrlApi from "@/common/routines";
import { FaEdit } from "react-icons/fa";
import TourButton from "@/components/Tour/TourButton";
import { classTimePageSteps } from "@/components/Tour/Steps/RoutineSteps/Steps";

const ClassTimePage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const dispatch = useDispatch();
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const classTime = useSelector((state) => state.classTime.classTime) || [];
  const role = useSelector((state) => state?.auth?.user);
  const [input, setInput] = useState({
    periods: "",
    startTime: "",
    endTime: "",
  });
  const [editInput, setEditInput] = useState({
    periods: "",
    startTime: "",
    endTime: "",
  });
  const dataLength = classTime?.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const editChangeEventHandler = (e) => {
    setEditInput({
      ...editInput,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch all class time data
  const fetchPeriodsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${routineUrlApi.getClassTime.url}/all/${schoolId}`
      );

      if (response) {
        dispatch(setClassTime(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodsData();
  }, []);

  // Add new time data
  const addNewPeriods = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(
        `${routineUrlApi.getClassTime.url}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status) {
        setInput({
          periods: "",
          startTime: "",
          endTime: "",
        });
        toast.success(response.data.message);
        fetchPeriodsData();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  // Update class time data
  const updateClassTimeData = async (e, id) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${routineUrlApi.getClassTime.url}/${id}/${schoolId}`,
        editInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.success("Class Time updated successfully!");
        const updatedData = classTime.map((item) =>
          item.id === id ? { ...item, ...editInput } : item
        );
        setEditInput({ periods: "", startTime: "", endTime: "" });
        dispatch(setClassTime(updatedData));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update class time"
      );
    } finally {
      setPostApiLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditInput({
      periods: item.periods,
      startTime: item.startTime,
      endTime: item.endTime,
    });
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = classTime.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const headers = ["S.No", "Periods", "Start Time", "End Time"];
  if (["edp", "admin", "vais"].includes(role)) {
    headers.push("Action");
  }

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
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
        <div className=" flex justify-between items-center">
          <div
            className={`mb-6 ${
              theme === "light" ? "text-white" : "text-gray-800"
            }`}
          >
            <h1 className="text-2xl md:text-3xl font-bold relative inline-block">
              Class Time Management
              <span className="absolute bottom-[-5px] left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
            </h1>
            <p className="mt-2 text-sm md:text-base opacity-80">
              Manage class periods and time schedules for your school
            </p>
          </div>

          <div>
            <TourButton
              steps={classTimePageSteps}
              tourName={"classTimePageTour"}
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
            <div className="classAvailable mb-4 md:mb-0">
              <h2
                className={`text-xl font-bold flex items-center ${
                  theme === "light" ? "text-white" : "text-gray-800"
                }`}
              >
                <AlarmClock className="mr-2 h-5 w-5" />
                Class Time Schedule
              </h2>
              <p
                className={`mt-1 text-sm ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {classTime?.length || 0} time periods configured
              </p>
            </div>

            {["edp", "admin", "vais"].includes(role) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className={`addClass ${
                      theme === "light"
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                        : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    } text-white shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Class Time</span>
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
                      Add New Time Schedule
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={addNewPeriods}>
                    <div className="grid gap-6 py-4">
                      {/* Class Periods */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="className"
                          className={
                            theme === "light"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }
                        >
                          Select a Class Period
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Select
                          onValueChange={(e) =>
                            setInput({ ...input, periods: e })
                          }
                          required
                        >
                          <SelectTrigger
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            <SelectValue placeholder="Select a period" />
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
                                Periods
                              </SelectLabel>
                              <SelectItem value="1st period">
                                1st period
                              </SelectItem>
                              <SelectItem value="2nd period">
                                2nd period
                              </SelectItem>
                              <SelectItem value="3rd period">
                                3rd period
                              </SelectItem>
                              <SelectItem value="4th period">
                                4th period
                              </SelectItem>
                              <SelectItem value="break period">
                                Break period
                              </SelectItem>
                              <SelectItem value="5th period">
                                5th period
                              </SelectItem>
                              <SelectItem value="6th period">
                                6th period
                              </SelectItem>
                              <SelectItem value="7th period">
                                7th period
                              </SelectItem>
                              <SelectItem value="8th period">
                                8th period
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Start Time */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="startTime"
                          className={
                            theme === "light"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }
                        >
                          Start Time<sup className="text-red-600">*</sup>
                        </Label>
                        <div
                          className={`flex items-center ${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-300"
                          } rounded-md border px-3`}
                        >
                          <Clock
                            className={`h-4 w-4 mr-2 ${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          />
                          <Input
                            required
                            type="time"
                            value={input.startTime}
                            id="startTime"
                            name="startTime"
                            onChange={changeEventHandler}
                            className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                              theme === "light"
                                ? "bg-gray-700 text-white"
                                : "bg-white text-gray-800"
                            }`}
                          />
                        </div>
                      </div>

                      {/* End Time */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="endTime"
                          className={
                            theme === "light"
                              ? "text-gray-300"
                              : "text-gray-700"
                          }
                        >
                          End Time<sup className="text-red-600">*</sup>
                        </Label>
                        <div
                          className={`flex items-center ${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-300"
                          } rounded-md border px-3`}
                        >
                          <Clock
                            className={`h-4 w-4 mr-2 ${
                              theme === "light"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          />
                          <Input
                            required
                            type="time"
                            value={input.endTime}
                            id="endTime"
                            name="endTime"
                            onChange={changeEventHandler}
                            className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                              theme === "light"
                                ? "bg-gray-700 text-white"
                                : "bg-white text-gray-800"
                            }`}
                          />
                        </div>
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
                          Save Schedule
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
                  Loading time schedules...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {!classTime || classTime.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <AlarmClock
                    className={`w-16 h-16 mb-4 ${
                      theme === "light" ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg font-medium ${
                      theme === "light" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No class time schedules found
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      theme === "light" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Add your first class time schedule to get started
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
                          {headers.map((header, index) => (
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
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item?.periods?.toLowerCase().includes("break")
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {item.periods}
                              </span>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-green-500" />
                                {formatTime(item.startTime)}
                              </div>
                            </TableCell>
                            <TableCell
                              className={`px-4 py-3 ${
                                theme === "light"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-red-500" />
                                {formatTime(item.endTime)}
                              </div>
                            </TableCell>

                            {["edp", "admin", "vais"].includes(role) && (
                              <TableCell
                                className={`px-4 py-3 ${
                                  theme === "light"
                                    ? "text-white"
                                    : "text-gray-800"
                                }`}
                              >
                                <div className="flex gap-2 justify-end">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <FaEdit
                                        className="editClass sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditClick(item);
                                        }}
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
                                          Edit Time Schedule
                                        </DialogTitle>
                                      </DialogHeader>

                                      <form
                                        onSubmit={(e) =>
                                          updateClassTimeData(e, item.id)
                                        }
                                      >
                                        <div className="grid gap-6 py-4">
                                          {/* Class Periods */}
                                          <div className="flex flex-col gap-2">
                                            <Label
                                              htmlFor="className"
                                              className={
                                                theme === "light"
                                                  ? "text-gray-300"
                                                  : "text-gray-700"
                                              }
                                            >
                                              Select a Class Period
                                              <sup className="text-red-600">
                                                *
                                              </sup>
                                            </Label>
                                            <Select
                                              defaultValue={item.periods}
                                              onValueChange={(e) =>
                                                setEditInput({
                                                  ...editInput,
                                                  periods: e,
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
                                                  placeholder={item.periods}
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
                                                    Periods
                                                  </SelectLabel>
                                                  <SelectItem value="1st period">
                                                    1st period
                                                  </SelectItem>
                                                  <SelectItem value="2nd period">
                                                    2nd period
                                                  </SelectItem>
                                                  <SelectItem value="3rd period">
                                                    3rd period
                                                  </SelectItem>
                                                  <SelectItem value="4th period">
                                                    4th period
                                                  </SelectItem>
                                                  <SelectItem value="break period">
                                                    Break period
                                                  </SelectItem>
                                                  <SelectItem value="5th period">
                                                    5th period
                                                  </SelectItem>
                                                  <SelectItem value="6th period">
                                                    6th period
                                                  </SelectItem>
                                                  <SelectItem value="7th period">
                                                    7th period
                                                  </SelectItem>
                                                  <SelectItem value="8th period">
                                                    8th period
                                                  </SelectItem>
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          {/* Start Time */}
                                          <div className="flex flex-col gap-2">
                                            <Label
                                              htmlFor="startTime"
                                              className={
                                                theme === "light"
                                                  ? "text-gray-300"
                                                  : "text-gray-700"
                                              }
                                            >
                                              Start Time
                                              <sup className="text-red-600">
                                                *
                                              </sup>
                                            </Label>
                                            <div
                                              className={`flex items-center ${
                                                theme === "light"
                                                  ? "bg-gray-700 border-gray-600"
                                                  : "bg-white border-gray-300"
                                              } rounded-md border px-3`}
                                            >
                                              <Clock
                                                className={`h-4 w-4 mr-2 ${
                                                  theme === "light"
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                                }`}
                                              />
                                              <Input
                                                required
                                                type="time"
                                                value={editInput.startTime}
                                                id="startTime"
                                                name="startTime"
                                                onChange={
                                                  editChangeEventHandler
                                                }
                                                className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                                                  theme === "light"
                                                    ? "bg-gray-700 text-white"
                                                    : "bg-white text-gray-800"
                                                }`}
                                              />
                                            </div>
                                          </div>

                                          {/* End Time */}
                                          <div className="flex flex-col gap-2">
                                            <Label
                                              htmlFor="endTime"
                                              className={
                                                theme === "light"
                                                  ? "text-gray-300"
                                                  : "text-gray-700"
                                              }
                                            >
                                              End Time
                                              <sup className="text-red-600">
                                                *
                                              </sup>
                                            </Label>
                                            <div
                                              className={`flex items-center ${
                                                theme === "light"
                                                  ? "bg-gray-700 border-gray-600"
                                                  : "bg-white border-gray-300"
                                              } rounded-md border px-3`}
                                            >
                                              <Clock
                                                className={`h-4 w-4 mr-2 ${
                                                  theme === "light"
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                                }`}
                                              />
                                              <Input
                                                required
                                                type="time"
                                                value={editInput.endTime}
                                                id="endTime"
                                                name="endTime"
                                                onChange={
                                                  editChangeEventHandler
                                                }
                                                className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                                                  theme === "light"
                                                    ? "bg-gray-700 text-white"
                                                    : "bg-white text-gray-800"
                                                }`}
                                              />
                                            </div>
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

                                  <DeleteComponent
                                    name={item?.periods}
                                    deletePath={`${routineUrlApi.getClassTime.url}/${item.id}/${schoolId}`}
                                    onDelete={() => {
                                      const updatedData = classTime?.filter(
                                        (data) => data.id !== item.id
                                      );
                                      dispatch(setClassTime(updatedData));
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

export default ClassTimePage;
