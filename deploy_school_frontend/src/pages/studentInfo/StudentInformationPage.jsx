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
import { FaEdit } from "react-icons/fa";
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
import { useDispatch, useSelector } from "react-redux";
import { setStudentInfo } from "@/utils/studentInformation/studentInfoSlice";
import mainUrlApi from "@/common/main";

const StudentInformationPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const studentInfo =
    useSelector((state) => state.studentInfo.studentInfo) || [];
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);
  const [searchData, setSearchData] = useState({
    className: "",
    section: "",
    rollNo: "",
  });
  const [input, setInput] = useState({
    // Personal information
    studentName: "",
    studentImage: null,
    gender: "",
    bloodGroup: "",
    religion: "",
    class: "",
    section: "",
    dob: "",
    // Address information
    pinCode: "",
    state: "",
    city: "",
    district: "",
    country: "",
    policeStation: "",
    villPost: "",
  });

  // console.log("input : ", input);

  const dataLength = studentInfo.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // for fetch the class data
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${mainUrlApi.studentInfo.url}`);

      // console.log("response : ", response);
      if (response) {
        dispatch(setStudentInfo(response.data.data));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  // // for add new Subject data
  // const editStudent = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setPostApiLoading(true);
  //     const response = await axios.post("url", input, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       // withCredentials: true,
  //     });

  //     console.log("response : ", response);

  //     if (response.success) {
  //       setInput({
  //         studentName: "",
  //         studentImage: null,
  //         gender: "",
  //         bloodGroup: "",
  //         religion: "",
  //         class: "",
  //         section: "",
  //         dob: "",
  //         // Address information
  //         pinCode: "",
  //         state: "",
  //         city: "",
  //         district: "",
  //         country: "",
  //         policeStation: "",
  //         villPost: "",
  //       });
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   } finally {
  //     setPostApiLoading(false);
  //   }
  // };

  // const searchStudent = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log("searchData : ", searchData);
  //     const response = await axios.get(
  //       `http://192.168.0.141:8084/api/v1/routine/search?className=${searchData.className}&section=${searchData.section}`
  //     );
  //     if (response) {
  //       setSearchRoutineData(response.data.data);
  //       // setShowSearchData(true);
  //       // console.log("search response : ", response);
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Error searching data");
  //   }
  // };
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = studentInfo.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const headers = [
    "S.No",
    "Admission No",
    "Roll No",
    "Student Name",
    "Class(Section)",
    "Guardian Name",
    "Gender",
  ]
  // "edp", "admin",
  if (["vais"].includes(role)) {
    headers.push("Action");
  }

  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh]`}
    >
      <div>
        {/* for search function  */}
        {/* <div
          className={` mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-start mx-4 sm:mx-14 gap-4 sm:h-20 ${
            theme === "light" ? "bg-[#212121] text-white" : "bg-white"
          } `}
        >
          <p className="text-2xl font-semibold ml-2 hidden sm:block">
            Search Students{" "}
          </p>

          <form onSubmit={searchStudent} className="flex gap-4">
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

            <input
              type="text"
              placeholder="enter roll no "
              value={searchData.rollNo}
              onChange={(e) =>
                setSearchData({ ...searchData, rollNo: e.target.value })
              }
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
            />

            <Button type="submit" className="bg-[#452B90] hover:bg-[#c29732]">
              Search
            </Button>
          </form>
        </div> */}

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
            className={`flex justify-between items-center p-3 sm:p-4 border-b-[1px] ${
              theme === "light"
                ? "border-[rgba(193,193,193,0.3)]"
                : "border-slate-200"
            }`}
          >
            <div>
              <span className="text-[1rem] sm:text-[1.5rem] font-bold">
                All Students
              </span>
            </div>
          </div>

          {/* Table */}
          <div className=" overflow-x-scroll mt-10 sm:mt-0">
            <Table className="table-auto w-full border-collapse border border-slate-200">
              <TableHeader
                className={`bg-gray-100 text-left ${
                  theme === "light" ? "bg-[#212121]" : "light"
                }`}
              >
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead
                      key={index}
                      className={`px-4 py-2 border ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)] text-white "
                          : "border-slate-200 text-black"
                      } font-semibold  ${
                        header === "Action" ? "text-right" : "text-left"
                      }`}
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
                      {item.className}({item.section})
                    </TableCell>
                    <TableCell
                      className={`px-4 py-2 border text-left ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      } `}
                    >
                      {item.fatherName} / {item.motherName}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-2 border text-left ${
                        theme === "light"
                          ? "border-[rgba(193,193,193,0.3)]"
                          : "border-slate-200"
                      } `}
                    >
                      {item.gender}
                    </TableCell>
                    {
                      // "admin", "edp",
                      ["vais"].includes(role) && (<TableCell
                        className={`px-4 py-2 border text-left ${
                          theme === "light"
                            ? "border-[rgba(193,193,193,0.3)]"
                            : "border-slate-200"
                        } `}
                      >
                        <div className="flex justify-end items-center gap-2">
                          {/* {["admin", "edp", "vais"].includes(role) && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <FaEdit className="sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm hidden sm:block" />
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[50%]">
                                <DialogHeader>
                                  <DialogTitle>Edit profile</DialogTitle>
                                </DialogHeader>
  
                                <form onSubmit={editStudent}>
                                  <div className="grid gap-4 py-4 grid-cols-1 sm:grid-cols-2">
                               
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <Label htmlFor="studentName" className="">
                                        Student's Name
                                      </Label>
                                      <input
                                        id="studentName"
                                        name="studentName"
                                        value={input.studentName}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                      />
                                    </div>
  
                                   
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <label
                                        htmlFor="gender"
                                        className="text-sm font-medium "
                                      >
                                        Gender
                                      </label>
                                      <select
                                        required
                                        id="gender"
                                        name="gender"
                                        value={input.gender}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md bg-white"
                                      >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="others">Others</option>
                                      </select>
                                    </div>
                                
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <label
                                        htmlFor="bloodGroup"
                                        className="text-sm font-medium "
                                      >
                                        Blood Group
                                      </label>
                                      <select
                                        required
                                        id="bloodGroup"
                                        name="bloodGroup"
                                        value={input.bloodGroup}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md bg-white"
                                      >
                                        <option value="">
                                          Select Blood Group
                                        </option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                      </select>
                                    </div>
                              
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <label
                                        htmlFor="religion"
                                        className="text-sm font-medium "
                                      >
                                        Religion
                                      </label>
                                      <select
                                        required
                                        id="religion"
                                        name="religion"
                                        value={input.religion}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md bg-white"
                                      >
                                        <option value="">Select Religion</option>
                                        <option value="hindu">Hindu</option>
                                        <option value="muslim">Muslim</option>
                                        <option value="sikh">Sikh</option>
                                        <option value="christian">
                                          Christian
                                        </option>
                                        <option value="others">Others</option>
                                      </select>
                                    </div>
  
                                    
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <label
                                        htmlFor="class"
                                        className="text-sm font-medium "
                                      >
                                        Class
                                      </label>
                                      <select
                                        required
                                        id="class"
                                        name="class"
                                        value={input.class}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md bg-white"
                                      >
                                        <option value="">Select class</option>
                                        <option value="married">one</option>
                                        <option value="unmarried">two</option>
                                      </select>
                                    </div>
                                
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <label
                                        htmlFor="section"
                                        className="text-sm font-medium "
                                      >
                                        Section
                                      </label>
                                      <select
                                        required
                                        id="section"
                                        name="section"
                                        value={input.section}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md bg-white"
                                      >
                                        <option value="">Select section</option>
                                        <option value="bengali">A</option>
                                        <option value="english">B</option>
                                      </select>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <Label htmlFor="studentImage" className="">
                                        Student's Image
                                      </Label>
                                      <input
                                        type="file"
                                        id="studentImage"
                                        name="studentImage"
                                        value={input.studentImage}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                      />
                                    </div>
                                   
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <Label htmlFor="dob" className="">
                                        Date of birth
                                      </Label>
                                      <input
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        value={input.dob}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                      />
                                    </div>
                                   
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <Label htmlFor="country" className="">
                                        Country
                                      </Label>
                                      <input
                                        id="country"
                                        name="country"
                                        value={input.country}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                      />
                                    </div>
                                  
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <Label htmlFor="pinCode" className="">
                                        Pin Code
                                      </Label>
                                      <input
                                        id="pinCode"
                                        name="pinCode"
                                        value={input.pinCode}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <Label htmlFor="state" className="">
                                        State
                                      </Label>
                                      <input
                                        id="state"
                                        name="state"
                                        value={input.state}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                      />
                                    </div>
                                   
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <Label htmlFor="district" className="">
                                        District
                                      </Label>
                                      <input
                                        id="district"
                                        name="district"
                                        value={input.district}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <Label htmlFor="policeStation" className="">
                                        Police Station
                                      </Label>
                                      <input
                                        id="policeStation"
                                        name="policeStation"
                                        value={input.policeStation}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                      />
                                    </div>
                                 
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <Label htmlFor="city" className="">
                                        City
                                      </Label>
                                      <input
                                        id="city"
                                        name="city"
                                        value={input.city}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                      />
                                    </div>
                                   
                                    <div className="grid grid-cols-1 items-center gap-4">
                                      <Label htmlFor="villPost" className="">
                                        Vill, Post
                                      </Label>
                                      <input
                                        id="villPost"
                                        name="villPost"
                                        value={input.villPost}
                                        onChange={changeEventHandler}
                                        className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                      />
                                    </div>
                                  </div>
                                </form>
  
                                <DialogFooter>
                                  <Button
                                    type="submit"
                                    className="bg-[#452B90] hover:bg-[#c29732]"
                                  >
                                    Save changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )} */}
  
                          {role === "vais" && <DeleteComponent />}
                        </div>
                      </TableCell>)
                    }
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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

export default StudentInformationPage;
