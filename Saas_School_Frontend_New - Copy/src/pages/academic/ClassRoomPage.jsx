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
import { FaEdit, FaPlus } from "react-icons/fa";
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
import { Loader2 } from "lucide-react";
import { academicUrlApi } from "@/common";

const ClassRoomPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allClass = useSelector((state) => state.class.classNames);
  const allSection = useSelector((state) => state.section.sectionNames);
  const dispatch = useDispatch();
  const classRooms = useSelector((state) => state.classRoom.classRoom);
  const schoolId = useSelector((state)=>state?.auth?.schoolId);
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
        toast.success(response?.data);
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
        toast.success("Class Room updated successfully!");
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
      const response = await axios.get(
        `${academicUrlApi.getAllClassRoom.url}/${schoolId}/search?classId=${searchClass}`
      );
      if (response) {
        setSearchClassData(response.data);
        setShowSearchData(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    }
  };

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const dataToShow = showSearchData ? searchClassData : classRooms;
  const dataLength = dataToShow?.length;

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

  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh]`}
    >
      <div className={` `}>
        {/* for search function  */}
        <div
          className={`mt-4 sm:mx-14 flex items-center justify-center gap-4 h-20 ${
            theme === "light" ? "bg-[#212121]" : "bg-white"
          } `}
        >
          <p className="text-2xl font-semibold hidden sm:block ">
            Search Class Room
          </p>
          <form onSubmit={searchRooms} className="flex items-center gap-4">
            <Select
              className="border-red-600 border "
              onValueChange={(value) => setSearchClass(value)}
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
            <Button type="submit" className="bg-[#452B90] hover:bg-[#c29732]">
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
            className={`flex flex-col sm:flex-row gap-8 justify-between items-center p-3 sm:p-4 border-b-[1px] ${
              theme === "light"
                ? "border-[rgba(193,193,193,0.3)]"
                : "border-slate-200"
            }`}
          >
            <div>
              <span className="text-[1.5rem] sm:text-[1.5rem] font-bold">
                Class rooms
              </span>
            </div>

            <div className="flex items-center text-[1.25rem]">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#452B90] hover:bg-[#c29732] text-white ">
                    <span>
                      <FaPlus />
                    </span>
                    <span>Add New Class Room</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add A New Room</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={addNewClassRoom}>
                    <div className="grid gap-6 py-4">
                      {/* Class Selection */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="className">Select a Class</Label>
                        <Select
                          onValueChange={(value) =>
                            setInput({ ...input, classId: value })
                          }
                        >
                          <SelectTrigger className="w-full">
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

                      {/* Section Selection */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="sectionName">Select a Section</Label>
                        <Select
                          onValueChange={(value) =>
                            setInput({ ...input, sectionId: value })
                          }
                        >
                          <SelectTrigger className="w-full">
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

                      {/* Room Number Input */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="roomNo">Room No</Label>
                        <Input
                          id="roomNo"
                          name="roomNo"
                          className="w-full"
                          placeholder="Enter Room No"
                          value={input.roomNo}
                          onChange={changeEventHandler}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      {postApiLoading ? (
                        <Button className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="w-full bg-[#452B90] hover:bg-[#c29732] "
                        >
                          Save
                        </Button>
                      )}
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table */}
          <Table
            className={`table-auto w-full border-collapse border border-slate-200    `}
          >
            <TableHeader
              className={`bg-gray-100 text-left ${
                theme === "light" ? "bg-[#212121]" : "light"
              }`}
            >
              <TableRow>
                {[
                  "S.No",
                  "Class Name",
                  "Section Name",
                  "Room No",
                  "Action",
                ].map((n, index) => (
                  <TableHead
                    key={index}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold  ${
                      n === "Action" ? "text-right" : "text-left"
                    }
                 ${n === "S.No" ? "hidden sm:table-cell" : ""}
                `} 
                  >
                    {n}
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
                    className={`px-4 py-2 border text-left hidden sm:table-cell ${
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
                    {item.classId}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.sectionId}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.roomNo}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <div className="flex justify-end items-center gap-2 ">
                      {/* for edit data */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <FaEdit className="sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm" onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(item);
                          }} />
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit this data</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={(e)=>{updateClassRoomData(e, item.id)}} >
                            <div className="grid gap-6 py-4">
                              {/* Class Selection */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="className">
                                  Select a Class
                                </Label>
                                <Select defaultValue={item.classId} onValueChange={(e) => setEditInput({...editInput, classId: e})} >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={item.classId} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Class</SelectLabel>
                                      {
                                      allClass.map((item, index) => (
                                        <SelectItem
                                          key={index}
                                          value={item}
                                        >
                                          {item}
                                        </SelectItem>
                                      ))
                                    }
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Section Selection */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="sectionName">
                                  Select a Section
                                </Label>
                                <Select defaultValue={item.sectionId} onValueChange={(e) => setEditInput({...editInput, sectionId: e})} >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={item.sectionId} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Section</SelectLabel>
                                      {
                                      allSection.map((item, index) => (
                                        <SelectItem
                                          key={index}
                                          value={item}
                                        >
                                          {item}
                                        </SelectItem>
                                      ))
                                      }
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Room Number Input */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="roomNo">Room No</Label>
                                <Input
                                  id="roomNo"
                                  value={editInput.roomNo}
                                  onChange={(e) => setEditInput({...editInput, roomNo: e.target.value})}
                                  name="roomNo"
                                  className="w-full"
                                  placeholder="Enter Room No"
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              {postApiLoading ? (
                                <Button className="flex items-center justify-center">
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  <span>Saving...</span>
                                </Button>
                              ) : (
                                <Button
                                  type="submit"
                                  className="w-full bg-[#452B90] hover:bg-[#c29732] "
                                >
                                  Save
                                </Button>
                              )}
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      {/* here we update the edit function later  */}

                      {/* for conformation delete the data start here */}
                      <DeleteComponent
                      name={item.classId} 
                      deletePath={`${academicUrlApi.getAllClassRoom.url}/${item.id}/${schoolId}`} 
                      onDelete={() => {
                        const updatedData = classRooms.filter(
                          (data) => data.id !== item.id
                        );
                        dispatch(setClassRoom(updatedData)); // Update the Redux state after deletion
                      }}
                    />
                      {/* till now delete section  */}
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

export default ClassRoomPage;
