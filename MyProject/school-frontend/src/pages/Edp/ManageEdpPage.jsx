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
import { Label } from "@/components/ui/label";
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
import { Loader2 } from "lucide-react";
import { setEdpInfo } from "@/utils/teacher/teacherInformationSlice";
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

const ManageEdpPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allReligions =
    useSelector((state) => state.settings.religionNames) || [];
  const allEdpInfo = useSelector((state) => state.teacherInfo.edpInfo) || [];
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [currentStudent, setCurrentStudent] = useState("");

  // console.log("current : ", currentStudent);

  const [input, setInput] = useState({
    edpName: "",
    religion: "",
    phone: "",
    maritialStatus: "",
    pinCode: "",
    state: "",
    city: "",
    district: "",
    country: "",
    policeStation: "",
    villPost: "",
  });

  const dataLength = allEdpInfo.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // for fetch the edp data
  const fetchEdpData = async () => {
    try {
      const response = await axios.get(`${teacherEdpLibraryanUrlApi.addEdp.url}`);
      // console.log("response : ", response);
      if (response) {
        dispatch(setEdpInfo(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchEdpData();
  }, []);

  // for update edp
  const editEdp = async (e) => {
    e.preventDefault();
    try {
      setPostApiLoading(true);
      const response = await axios.post(`${teacherEdpLibraryanUrlApi.addEdp.url}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
      });

      // console.log("response : ", response);

      if(response){
        toast.success(response.data.message);
        fetchEdpData();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setInput({
      edpName: item.edpName,
      religion: item.religion,
      phone: item.phone,
      maritalStatus: item.maritalStatus,
      pincode: item.pincode,
      state: item.state,
      city: item.city,
      district: item.district,
      country: item.country,
      policeStation: item.policeStation,
      villagePost: item.villagePost,
    });
  };

  // const searchEdp = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `http://192.168.0.141:8086/api/teachers/search?teachersName=${searchInput}`
  //     );
  //     if (response) {
  //       console.log("response : ", response);
  //       // dispatch(setTeacherInfo(response.data.data));
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Error searching data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = allEdpInfo.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const handleSelectStudent = async (item) => {
    setCurrentStudent(item);
  };

  return (
    <div
      className={` ${
        theme === "light" ? "dark" : "light"
      } font-poppins h-[100vh] `}
    >
      <div className={`  `}>
        {/* for search function next version */}
        {/* <div
          className={` mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-start mx-4 sm:mx-14 gap-4 sm:h-20 ${
            theme === "light" ? "bg-[#212121] text-white" : "bg-white"
          } `}
        >
          <form onSubmit={searchEdp} className="flex items-center w-full">
            <input
              type="text"
              placeholder="Search Edp"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border text-black border-gray-300 rounded-md px-4 py-2 focus:outline-none mt-4 sm:mt-0 ml-4 w-[80%] sm:w-[20%]"
            />
            {loading ? (
              <Button className="bg-[#452B90] hover:bg-[#c29732] ml-4 mb-4 sm:mb-0">
                <Loader2 className="animate-spin" />
                Searching....
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-[#452B90] hover:bg-[#c29732] ml-4 mb-4 sm:mb-0"
              >
                Search
              </Button>
            )}
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
                Edp Information
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
                  "Edp Name",
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
                    {item.edpName}
                  </TableCell>

                  <TableCell
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } hidden sm:table-cell `}
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
                    className={`px-4 py-2 border text-left ${
                      theme === "light"
                        ? "border-[rgba(193,193,193,0.3)]"
                        : "border-slate-200"
                    } hidden sm:table-cell `}
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
                              Edp's  Details
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
                                  src={currentStudent?.edpImage}
                                  alt="edp"
                                  className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow-md"
                                />
                              </div>

                              {/* Student Details */}
                              <p className="text-gray-700 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Teacher Name :
                                </strong>{" "}
                                {currentStudent?.edpName}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Teacher Code :
                                </strong>{" "}
                                {currentStudent?.edpCode}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <DateRangeSharp className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Joining Date:
                                </strong>{" "}
                                {currentStudent?.joiningDate}
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
                                {currentStudent?.maritialStatus}
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
                                {currentStudent?.pinCode}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2 col-span-2">
                                <MapPinIcon className="w-5 h-5 text-blue-500" />
                                <strong className="text-gray-900">
                                  Village:
                                </strong>{" "}
                                {currentStudent?.villPost}
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
                            className="sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer rounded-sm hidden sm:block "
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(item);
                            }}
                          />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[50%]">
                          <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                          </DialogHeader>

                          <form onSubmit={editEdp}>
                            <div className="grid gap-4 py-4 grid-cols-1 sm:grid-cols-2">
                              {/* for name  */}
                              <div className="grid grid-cols-1 items-center gap-4">
                                <Label htmlFor="edpName" className="">
                                  Edp's Name
                                </Label>
                                <input
                                  id="edpName"
                                  name="edpName"
                                  value={input.edpName}
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
                                      {allReligions.map((item, index) => (
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
                                  id="maritialStatus"
                                  name="maritialStatus"
                                  value={input.maritialStatus}
                                  onChange={changeEventHandler}
                                  placeholder={item.maritialStatus}
                                  className="px-2 py-2 focus:outline-none border border-slate-200 rounded-md bg-white"
                                >
                                  <option value="">Select status</option>
                                  <option value="married">Married</option>
                                  <option value="unmarried">Unmarried</option>
                                </select>
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
                        name={item.edpName} // Name of the item
                        deletePath={`${teacherEdpLibraryanUrlApi.addEdp.url}/${item.id}`} // API endpoint for deletion
                        onDelete={() => {
                          const updatedData = allEdpInfo.filter(
                            (data) => data.id !== item.id
                          );
                          dispatch(setEdpInfo(updatedData)); // Update the Redux state after deletion
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

export default ManageEdpPage;
