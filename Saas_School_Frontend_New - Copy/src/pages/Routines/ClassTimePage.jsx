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
import { FaEdit, FaPlus } from "react-icons/fa";
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
import { Loader2 } from "lucide-react";
import routineUrlApi from "@/common/routines";

const ClassTimePage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const dispatch = useDispatch();
  const schoolId=useSelector((state)=>state?.auth?.schoolId)
  const classTime = useSelector((state) => state.classTime.classTime) || [];
  const role = useSelector((state) => state?.auth?.user);
  // console.log("role : ", role);
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

  // for fetch the class data
  const fetchPeriodsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${routineUrlApi.getClassTime.url}/all/${schoolId}`
      );

      // console.log("response : ", response);
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

  // for add new  time data
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
          // withCredentials: true,
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
      if(response){
        toast.success("Class Time updated successfully!");
      const updatedData = classTime.map((item) =>
        item.id === id ? { ...item, ...editInput } : item
      );
      setEditInput({periods: "", startTime: "", endTime: "",});
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

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const headers = ["S.No", "Periods", "Start Time", "End Time"];
  if (["edp", "admin","vais"].includes(role)) {
    headers.push("Action");
  }


  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh] `}
    >
      <div className={` ${theme === "light" ? "bg-[#212121]" : ""} `}>
        {/* for table and add new class rooms */}
        <div
          className={`mt-4 border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
            theme === "light"
              ? "border-[rgba(193,193,193,0.3)]"
              : "border-slate-200 bg-white"
          }`}
        >
          {/* Page Header Section */}
          <div
            className={`flex justify-between flex-col sm:flex-row gap-5 items-center p-3 sm:p-4 border-b-[1px] ${
              theme === "light"
                ? "border-[rgba(193,193,193,0.3)]"
                : "border-slate-200"
            }`}
          >
            <div>
              <span className="text-[1rem] sm:text-[1.5rem] font-bold">
                Class Time & Schedule
              </span>
            </div>

            {
              ["edp", "admin", "vais"].includes(role) && (
                <div className="flex items-center text-[1.25rem]">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#452B90] hover:bg-[#c29732] text-white mb-4">
                    <span>
                      <FaPlus />
                    </span>
                    <span>Add New Class Time</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-[300px] sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add new time schedul</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={addNewPeriods}>
                    <div className="grid gap-6 py-4">
                      {/* Class Periods */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="className">
                          Select a Class periods
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Select
                          onValueChange={(e) =>
                            setInput({ ...input, periods: e })
                          }
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Periods</SelectLabel>
                              <SelectItem value="1st period">1st period</SelectItem>
                              <SelectItem value="2nd period">2nd period</SelectItem>
                              <SelectItem value="3rd period">3rd period</SelectItem>
                              <SelectItem value="4th period">4th period</SelectItem>
                              <SelectItem value="break period">
                                Break period
                              </SelectItem>
                              <SelectItem value="5th period">5th period</SelectItem>
                              <SelectItem value="6th period">6th period</SelectItem>
                              <SelectItem value="7th period">7th period</SelectItem>
                              <SelectItem value="8th period">8th period</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* for start time */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="startTime">
                          Select Start Time<sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="time"
                          value={input.startTime}
                          id="startTime"
                          name="startTime"
                          onChange={changeEventHandler}
                        />
                      </div>

                      {/* for end time */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="endTime">
                          Select Start Time{" "}
                          <sup className="text-red-600">*</sup>
                        </Label>
                        <Input
                          required
                          type="time"
                          value={input.endTime}
                          id="endTime"
                          name="endTime"
                          onChange={changeEventHandler}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="submit"
                        className="w-full bg-[#452B90] hover:bg-[#c29732] "
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
              )
            }
          </div>

          {/* Table */}
          <Table className="table-auto w-full border-collapse border border-slate-200">
            <TableHeader
              className={`bg-gray-100 text-left ${
                theme === "light" ? "bg-[#212121]" : "light"
              }`}
            >
              <TableRow>
                {headers?.map(
                  (header, index) => (
                    <TableHead
                      key={index}
                      className={`px-4 py-2 border ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)] text-white "
                          : "border-slate-200 text-black"
                      } font-semibold  ${
                        header === "Action" ? "text-right" : "text-left"
                      } ${header === "S.No" ? "hidden sm:table-cell" : ""}`}
                    >
                      {header}
                    </TableHead>
                  )
                )}
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
                    } hidden sm:table-cell `}
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
                    {item.periods}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.startTime}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.endTime}

                  </TableCell>

                {
                  ["edp", "admin", "vais"].includes(role) && (
                    <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <div className="flex justify-end items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <FaEdit className="sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm" onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(item);
                          }} />
                        </DialogTrigger>
                        <DialogContent className="max-w-[300px] sm:max-w-[30%]">
                          <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                          </DialogHeader>

                          <form onSubmit={(e)=>{updateClassTimeData(e,item.id)}}>
                            <div className="grid gap-6 py-4">
                              {/* Class Periods */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="className">
                                  Select a Class periods{" "}
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Select
                                  onValueChange={(e) =>
                                    setEditInput({ ...editInput, periods: e })
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={item.periods} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Periods</SelectLabel>
                                      <SelectItem value="1st">
                                        1st period
                                      </SelectItem>
                                      <SelectItem value="2nd">
                                        2nd period
                                      </SelectItem>
                                      <SelectItem value="3rd">
                                        3rd period
                                      </SelectItem>
                                      <SelectItem value="4th">
                                        4th period
                                      </SelectItem>
                                      <SelectItem value="break">
                                        Break period
                                      </SelectItem>
                                      <SelectItem value="5th">
                                        5th period
                                      </SelectItem>
                                      <SelectItem value="6th">
                                        6th period
                                      </SelectItem>
                                      <SelectItem value="7th">
                                        7th period
                                      </SelectItem>
                                      <SelectItem value="8th">
                                        8th period
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* for start time */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="startTime">
                                  Select Start Time
                                  <sup className="text-red-600">*</sup>{" "}
                                </Label>
                                <Input
                                  required
                                  type="time"
                                  value={editInput.startTime}
                                  id="startTime"
                                  name="startTime"
                                  onChange={editChangeEventHandler}
                                />
                              </div>

                              {/* for end time */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="endTime">
                                  Select End Time
                                  <sup className="text-red-600">*</sup>
                                </Label>
                                <Input
                                  required
                                  type="time"
                                  value={editInput.endTime}
                                  id="endTime"
                                  name="endTime"
                                  onChange={editChangeEventHandler}
                                />
                              </div>
                            </div>

                            <DialogFooter>
                            {postApiLoading ? (
                              <Button
                                className="w-full bg-[#452B90] hover:bg-[#c29732] "
                                type="submit"
                              >
                                <Loader2
                                 className="animate-spin"></Loader2>
                                Loading...
                              </Button>
                            ) : (
                              <Button
                                type="submit"
                                className="w-full bg-[#452B90] hover:bg-[#c29732] "
                              >
                                Save changes
                              </Button>
                            )}
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <DeleteComponent
                      name={item?.periods} // Name of the class
                      deletePath={`${routineUrlApi.getClassTime.url}/${item.id}/${schoolId}`} // API endpoint for deletion
                      onDelete={() => {
                        const updatedData = classTime?.filter(
                          (data) => data.id !== item.id
                        );
                        dispatch(setClassTime(updatedData)); // Update the Redux state after deletion
                      }}
                    />
                    </div>
                  </TableCell>
                  )
                }


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

export default ClassTimePage;
