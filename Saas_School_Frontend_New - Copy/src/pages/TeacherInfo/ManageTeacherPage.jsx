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
import { setTeacherInfo } from "@/utils/teacher/teacherInformationSlice";
import { Loader2 } from "lucide-react";
import teacherEdpLibraryanUrlApi from "@/common/teacherEdpLibraryan";
import {
  EyeIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  HeartIcon,
  GraduationCapIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { CountertopsRounded, DateRangeSharp, Email } from "@mui/icons-material";



const ManageTeacherPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allTeacherInfo =
    useSelector((state) => state.teacherInfo.teacherInfo) || [];
  const allReligions =
    useSelector((state) => state.settings.religionNames) || [];
  const allSubjects = useSelector((state) => state.subject.subjectNames) || [];
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const dispatch = useDispatch();
  const [currentStudent, setCurrentStudent] = useState("");
  const [input, setInput] = useState({
    // Personal information
    teachersName: "",
    teachersImage: null,
    religion: "",
    phone: "",
    maritalStatus: "",
    // Professional information
    subject: "",
    // Address information
    pincode: "",
    state: "",
    city: "",
    district: "",
    country: "",
    policeStation: "",
    villagePost: "",
  });
 
  const [searchInput, setSearchInput] = useState("");

  // console.log("curent teacher : ", currentStudent);
  
  const dataLength = allTeacherInfo?.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (item) => {
    setInput({
      teachersName: item.teachersName,
      teachersImage: item.teachersImage,
      religion: item.religion,
      phone: item.phone,
      maritalStatus: item.maritalStatus,
      subject: item.subject,
      pincode: item.pincode,
      state: item.state,
      city: item.city,
      district: item.district,
      country: item.country,
      policeStation: item.policeStation,
      villagePost: item.villagePost,
    });
  };

  // for fetch the teacher data
  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${teacherEdpLibraryanUrlApi.addTeacher.url}/${schoolId}`
      );

      // console.log("response : ", response);

      if (response) {
        dispatch(setTeacherInfo(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const editTeacher = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.put(
        `${teacherEdpLibraryanUrlApi.addTeacher.url}/${currentStudent}/${schoolId}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true,
        }
      );

      if (response) {
        toast.success(response.data.message);
        fetchTeacherData();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPostApiLoading(false);
    }
  };


  // Pagination state
  
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = allTeacherInfo.slice(
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

  const handleSelectStudent = async (item) => {
    setCurrentStudent(item);
  };

  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh] `}
    >
      <div>
        {/* for search function next version */}
        {/* <div
          className={` mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-start mx-4 sm:mx-14 gap-4 sm:h-20 ${
            theme === "light" ? "bg-[#212121] text-white" : "bg-white"
          } `}
        >
          <div className="pl-2 w-full"> 
          <form onSubmit={searchTeacher} className="flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="Search Teacher"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border border-gray-300 rounded-md mt-4 sm:mt-0 px-4 py-2 focus:outline-none w-[40%] sm:w-[20%] "
            />

            <Button type="submit" className="bg-[#452B90] hover:bg-[#c29732]">Search</Button>
          </form>
          </div>
        </div> */}

        {/* for table and add new class rooms */}
        <div
          className={`mt-10 sm:mt-4 border-[1px] rounded-[0.675rem] mx-4 sm:mx-14 ${
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
                All Teachers
              </span>
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
                  "Teacher Name",
                  "Subject",
                  "Email",
                  "Phone",
                  "View",
                  "Action",
                ].map((header, index) => (
                  <TableHead
                    key={index}
                    className={`px-4 py-2 border ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)] text-white "
                        : "border-slate-200 text-black"
                    } font-semibold  ${
                      header === "Action" ? "text-right" : "text-left"
                    } ${
                      ["S.No", "Email", "Address"].includes(header)
                        ? "hidden sm:table-cell"
                        : ""
                    } `}
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
                    className={`px-4 py-2 border hidden sm:table-cell text-left ${
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
                    {item.teachersName}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.subject}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border hidden sm:table-cell text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.email}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    {item.phone}
                  </TableCell>
                  <TableCell
                    className={`px-4 py-2 border hidden sm:table-cell text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } `}
                  >
                    <Dialog>
                        <DialogTrigger asChild>
                          <EyeIcon
                            className="text-blue-600 cursor-pointer hover:text-blue-800 transition duration-200"
                            onClick={() => handleSelectStudent(item)}
                          />
                        </DialogTrigger>
                        <DialogContent className="p-6 bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-gray-800 border-b pb-3 flex items-center gap-2">
                              <UserIcon className="text-blue-600 w-6 h-6" />{" "}
                              Teacher's  Details
                            </DialogTitle>
                          </DialogHeader>

                          {currentStudent && (
                            // console.log("current student", currentStudent),
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="grid grid-cols-2 gap-4 mt-4"
                            >
                              {/* Profile Image */}
                              <div className="col-span-2 flex justify-center">
                                <img
                                  src={currentStudent?.teachersImage}
                                  alt="teacher"
                                  className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow-md"
                                />
                              </div>

                              {/* Student Details */}
                              <p className="text-gray-700 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Teacher Name :
                                </strong>{" "}
                                {currentStudent?.teachersName}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Teacher Code :
                                </strong>{" "}
                                {currentStudent?.teachersCode}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <DateRangeSharp className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Joining Date:
                                </strong>{" "}
                                {currentStudent?.joiningDate}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <GraduationCapIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Subject :
                                </strong>{" "}
                              {currentStudent?.subject}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2 text-wrap">
                                <Email className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900 text-wrap ">
                                  Email :
                                </strong>{" "}
                               <p> {currentStudent?.email} </p>
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <PhoneIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Phone :
                                </strong>{" "}
                                {currentStudent?.phone}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <GraduationCapIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Gender :
                                </strong>{" "}
                                {currentStudent?.gender} 
                              </p>
  
                              <p className="text-gray-700 flex items-center gap-2">
                                <UsersIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                Blood Group  :
                                </strong>{" "}
                                {currentStudent?.bloodGroup} 
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <UsersIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Marital Status  :
                                </strong>{" "}
                                {currentStudent?.maritalStatus}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <UsersIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                Religion  :
                                </strong>{" "}
                                {currentStudent?.religion}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <HeartIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                City :
                                </strong>{" "}
                                {currentStudent?.city}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <CountertopsRounded className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                Country :
                                </strong>{" "}
                                {currentStudent?.country}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <MailIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                District :
                                </strong>{" "}
                                {currentStudent?.district}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                Pin Code :
                                </strong>{" "}
                                {currentStudent?.pincode}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2 col-span-2">
                                <MapPinIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Village:
                                </strong>{" "}
                                {currentStudent?.villagePost}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2 col-span-2">
                                <MapPinIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                State :
                                </strong>{" "}
                                {currentStudent?.state}
                              </p>

                            </motion.div>
                          )}
                        </DialogContent>
                      </Dialog>
                  </TableCell>
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
                          <FaEdit
                            className="sm:w-8 sm:h-8 w-6 h-6 hidden sm:block   bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(item);
                            }}
                          />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[50%]">
                          <DialogHeader>
                            <DialogTitle>Edit teacher's data</DialogTitle>
                          </DialogHeader>

                          <form onSubmit={editTeacher}>
                            <div className="grid gap-4 py-4 grid-cols-1 sm:grid-cols-2">
                              {/* for name  */}
                              <div className="grid grid-cols-1 items-center gap-4">
                                <Label htmlFor="teachersName" className="">
                                  Teacher's Name
                                </Label>
                                <input
                                  id="teachersName"
                                  name="teachersName"
                                  value={input.teachersName}
                                  onChange={changeEventHandler}
                                  className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                />
                              </div>
                              {/* for phone  */}
                              <div className="grid grid-cols-1 items-center gap-4">
                                <Label htmlFor="phone" className="">
                                  Phone Number
                                </Label>
                                <input
                                  id="phone"
                                  name="phone"
                                  value={input.phone}
                                  onChange={changeEventHandler}
                                  className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                />
                              </div>

                              {/* for Religion */}
                              <div className="flex flex-col items-start mt-4 ">
                                <label
                                  htmlFor="religion"
                                  className="text-sm font-medium "
                                >
                                  Religion <sup className="text-red-600">*</sup>
                                </label>
                                <Select
                                  className="border-red-600 border "
                                  onValueChange={(value) =>
                                    setInput({ ...input, religion: value })
                                  }
                                >
                                  <SelectTrigger className="w-full border border-gray-300 focus:ring-green-500 focus:border-green-500">
                                    <SelectValue placeholder={item.religion} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Religions</SelectLabel>
                                      {allReligions?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                          {capitalizeFirstLetter(item)}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* for maritial status  */}
                              <div className="grid grid-cols-1 items-center gap-4">
                                <label
                                  htmlFor="maritialStatus"
                                  className="text-sm font-medium "
                                >
                                  Maritial Status
                                </label>
                                <select
                                  required
                                  id="maritalStatus"
                                  name="maritalStatus"
                                  value={input.maritalStatus}
                                  onChange={changeEventHandler}
                                  placeholder={item.maritalStatus}
                                  className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md bg-white"
                                >
                                  <option value="">Select status</option>
                                  <option value="married">Married</option>
                                  <option value="unmarried">Unmarried</option>
                                </select>
                              </div>
                              {/* for subject */}
                              <div className="flex flex-col items-start mt-4 ">
                                <label
                                  htmlFor="subject"
                                  className="text-sm font-medium "
                                >
                                  Subject <sup className="text-red-600">*</sup>
                                </label>
                                <Select
                                  className="border-red-600 border "
                                  onValueChange={(value) =>
                                    setInput({ ...input, subject: value })
                                  }
                                >
                                  <SelectTrigger className="w-full border border-gray-300 focus:ring-green-500 focus:border-green-500">
                                    <SelectValue placeholder={item.subject} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Subjects</SelectLabel>
                                      {allSubjects?.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                          {capitalizeFirstLetter(item)}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* for country  */}
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
                              {/* for pin code  */}
                              <div className="grid grid-cols-1 items-center gap-4">
                                <Label htmlFor="pincode" className="">
                                  Pin Code
                                </Label>
                                <input
                                  id="pincode"
                                  name="pincode"
                                  value={input.pincode}
                                  onChange={changeEventHandler}
                                  className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                />
                              </div>
                              {/* for state  */}
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
                              {/* for district  */}
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
                              {/* for police station */}
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
                              {/* for city  */}
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
                              {/* for vill,post  */}
                              <div className="grid grid-cols-1 items-center gap-4">
                                <Label htmlFor="villagePost" className="">
                                  Vill, Post
                                </Label>
                                <input
                                  id="villagePost"
                                  name="villagePost"
                                  value={input.villagePost}
                                  onChange={changeEventHandler}
                                  className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md"
                                />
                              </div>
                            </div>
                          </form>

                          <DialogFooter>
                            {postApiLoading ? (
                              <Button className="bg-[#452B90] hover:bg-[#c29732]">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                Saving...
                              </Button>
                            ) : (
                              <Button
                                type="submit"
                                className="bg-[#452B90] hover:bg-[#c29732]"
                              >
                                Save changes
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      {/* for conformation delete the data start here */}
                      <DeleteComponent
                        name={item.teachersName} // Name of the class
                        deletePath={`${teacherEdpLibraryanUrlApi.addTeacher.url}/${item.id}/${schoolId}`} // API endpoint for deletion
                        onDelete={() => {
                          const updatedData = allTeacherInfo.filter(
                            (data) => data.id !== item.id
                          );
                          dispatch(setTeacherInfo(updatedData)); // Update the Redux state after deletion
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

export default ManageTeacherPage;
