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
import { Loader2, Users } from "lucide-react";
import {
  setEdpInfo,
  setLibrarianInfo,
} from "@/utils/teacher/teacherInformationSlice";
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

const ManageLibrarianPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allReligions =
    useSelector((state) => state.settings.religionNames) || [];
  const allLibrarianInfo =
    useSelector((state) => state.teacherInfo.librarianInfo) || [];
  const allBloodGroups =
    useSelector((state) => state.settings.bloodGroupNames) || [];
  const allGenders = useSelector((state) => state.settings.genderNames) || [];
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [currentStudent, setCurrentStudent] = useState("");
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Input classes for consistent styling
  const inputClasses = `w-full px-3 py-2 border ${
    isDarkMode 
      ? "bg-[#0f172a] border-gray-700 text-white placeholder-gray-400" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`;
  
  const labelClasses = `block text-sm font-medium ${
    isDarkMode ? "text-gray-200" : "text-gray-700"
  }`;

  // Select classes for consistent styling
  const selectClasses = `w-full px-3 py-2 ${
    isDarkMode 
      ? "bg-[#0f172a] border-gray-700 text-white" 
      : "bg-white border-gray-300 text-gray-900"
  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`;

  const [input, setInput] = useState({
    librarianName: "",
    religion: "",
    phone: "",
    email: "",
    gender: "",
    bloodGroup: "",
    maritialStatus: "",
    joiningDate: "",
    pinCode: "",
    state: "",
    city: "",
    district: "",
    country: "",
    policeStation: "",
    villPost: "",
  });

  const dataLength = allLibrarianInfo?.length;

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // for fetch the librarian data
  const fetchLibrarianData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${teacherEdpLibraryanUrlApi.addLibraryan.url}/${schoolId}`
      );
      if (response) {
        dispatch(setLibrarianInfo(response?.data?.data || []));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrarianData();
  }, []);

  // for update librarian
  const editLibrarian = async (e) => {
    e.preventDefault();

    try {
      setPostApiLoading(true);

      // Create FormData object
      const formData = new FormData();

      // Add all input fields to formData
      Object.keys(input).forEach((key) => {
        if (key !== "librarianImage") {
          formData.append(key, input[key]);
        }
      });

      // Add the file if selected
      if (selectedFile) {
        formData.append("librarianImage", selectedFile);
      }

      const response = await axios.put(
        `${teacherEdpLibraryanUrlApi.addLibraryan.url}/${currentStudent.id}/${schoolId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        toast.success(response.data.message);
        fetchLibrarianData();
        setSelectedFile(null);
        setPreviewUrl("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating librarian");
    } finally {
      setPostApiLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setPreviewUrl(item.librarianImage);
    setCurrentStudent(item);
    setInput({
      librarianName: item.librarianName,
      religion: item.religion,
      phone: item.phone,
      email: item.email,
      gender: item.gender,
      bloodGroup: item.bloodGroup,
      maritialStatus: item.maritialStatus,
      joiningDate: item.joiningDate,
      pinCode: item.pinCode,
      state: item.state,
      city: item.city,
      district: item.district,
      country: item.country,
      policeStation: item.policeStation,
      villPost: item.villPost,
    });
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = allLibrarianInfo.slice(
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
    <div className={`min-h-[86vh] ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-6 p-4 rounded-lg shadow-md ${
          isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <Users className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h1 className="text-2xl font-bold">Manage Librarians</h1>
          </div>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            View, edit and manage all librarian staff members
          </p>
        </div>
        
        {/* Table Section */}
        <div className={`rounded-lg shadow-md overflow-hidden ${
          isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-gray-200'
        }`}>
          {/* Table Header */}
          <div className={`p-4 border-b ${
            isDarkMode ? 'border-[rgba(193,193,193,0.2)]' : 'border-gray-200'
          }`}>
            <h2 className="text-lg font-semibold">Librarian Staff List</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {dataLength} staff members found
            </p>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Loading data...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className={isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}>
                    <TableRow>
                      {["S.No", "Librarian Name", "Email", "Phone", "View", "Action"].map(
                        (header, index) => (
                          <TableHead
                            key={index}
                            className={`px-4 py-3 ${
                              isDarkMode
                                ? "text-gray-200 border-[rgba(193,193,193,0.2)]"
                                : "text-gray-700 border-gray-200"
                            } font-semibold ${
                              header === "Action" ? "text-right" : "text-left"
                            } ${
                              ["S.No", "Email"].includes(header)
                                ? "hidden sm:table-cell"
                                : ""
                            }`}
                          >
                            {header}
                          </TableHead>
                        )
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData?.length > 0 ? (
                      paginatedData.map((item, index) => (
                        <TableRow
                          key={item.id}
                          className={`hover:bg-opacity-70 ${
                            isDarkMode
                              ? "hover:bg-[#1e293b] border-[rgba(193,193,193,0.2)]"
                              : "hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          <TableCell
                            className={`px-4 py-3 ${
                              isDarkMode
                                ? "border-[rgba(193,193,193,0.2)]"
                                : "border-gray-200"
                            } hidden sm:table-cell`}
                          >
                            {(currentPage - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${
                              isDarkMode
                                ? "border-[rgba(193,193,193,0.2)]"
                                : "border-gray-200"
                            } font-medium`}
                          >
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-200">
                                {item.librarianImage ? (
                                  <img 
                                    src={item.librarianImage} 
                                    alt={item.librarianName} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <UserIcon className="h-full w-full p-1 text-gray-500" />
                                )}
                              </div>
                              {item.librarianName}
                            </div>
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${
                              isDarkMode
                                ? "border-[rgba(193,193,193,0.2)]"
                                : "border-gray-200"
                            } hidden sm:table-cell`}
                          >
                            {item.email}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${
                              isDarkMode
                                ? "border-[rgba(193,193,193,0.2)]"
                                : "border-gray-200"
                            }`}
                          >
                            {item.phone}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${
                              isDarkMode
                                ? "border-[rgba(193,193,193,0.2)]"
                                : "border-gray-200"
                            }`}
                          >
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className={`rounded-full ${
                                    isDarkMode 
                                      ? "hover:bg-slate-700 text-blue-400" 
                                      : "hover:bg-blue-50 text-blue-600"
                                  }`}
                                  onClick={() => handleSelectStudent(item)}
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className={`p-6 rounded-xl shadow-2xl max-w-2xl ${
                                isDarkMode 
                                  ? "bg-[#1e293b] border-gray-700 text-white" 
                                  : "bg-white border-gray-200"
                              }`}>
                                <DialogHeader>
                                  <DialogTitle className={`text-2xl font-semibold border-b pb-3 flex items-center gap-2 ${
                                    isDarkMode ? "text-white border-gray-700" : "text-gray-800 border-gray-200"
                                  }`}>
                                    <UserIcon className={`${isDarkMode ? "text-blue-400" : "text-blue-600"} w-6 h-6`} /> 
                                    Librarian's Details
                                  </DialogTitle>
                                </DialogHeader>

                                {currentStudent && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-2 gap-4 mt-4"
                                  >
                                    {/* Profile Image */}
                                    <div className="col-span-2 flex justify-center">
                                      <img
                                        src={currentStudent?.librarianImage}
                                        alt="librarian"
                                        className={`w-32 h-32 rounded-full object-cover border shadow-md ${
                                          isDarkMode ? "border-gray-700" : "border-gray-300"
                                        }`}
                                      />
                                    </div>

                                    {/* Staff Details */}
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <UserIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Librarian Name:
                                      </strong>{" "}
                                      {currentStudent?.librarianName}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <UserIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Librarian Code:
                                      </strong>{" "}
                                      {currentStudent?.librarianCode}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <CalendarIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Joining Date:
                                      </strong>{" "}
                                      {currentStudent?.joiningDate}
                                    </p>
                                    <p className={`flex items-center gap-2 text-wrap ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <MailIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Email:
                                      </strong>{" "}
                                      <span className="truncate">{currentStudent?.email}</span>
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <PhoneIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Phone:
                                      </strong>{" "}
                                      {currentStudent?.phone}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <GraduationCapIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Gender:
                                      </strong>{" "}
                                      {currentStudent?.gender}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <UsersIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Blood Group:
                                      </strong>{" "}
                                      {currentStudent?.bloodGroup}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <UsersIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Marital Status:
                                      </strong>{" "}
                                      {currentStudent?.maritialStatus}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <UsersIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Religion:
                                      </strong>{" "}
                                      {currentStudent?.religion}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <HeartIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        City:
                                      </strong>{" "}
                                      {currentStudent?.city}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <MapPinIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Country:
                                      </strong>{" "}
                                      {currentStudent?.country}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <MapPinIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        District:
                                      </strong>{" "}
                                      {currentStudent?.district}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <MapPinIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Pin Code:
                                      </strong>{" "}
                                      {currentStudent?.pinCode}
                                    </p>
                                    <p className={`flex items-center gap-2 col-span-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <MapPinIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Village:
                                      </strong>{" "}
                                      {currentStudent?.villPost}
                                    </p>
                                    <p className={`flex items-center gap-2 col-span-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <MapPinIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        State:
                                      </strong>{" "}
                                      {currentStudent?.state}
                                    </p>
                                  </motion.div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${
                              isDarkMode
                                ? "border-[rgba(193,193,193,0.2)]"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex justify-end items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  
                                    <FaEdit className={`${
                                      isDarkMode
                                        ? "bg-amber-700 hover:bg-amber-800 text-white"
                                        : "bg-amber-500 hover:bg-amber-600 text-white"
                                    } rounded-md sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer `} onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClick(item);
                                    }}/>
                                  
                                </DialogTrigger>
                                <DialogContent className={`sm:max-w-[50%] max-h-[80vh] overflow-hidden flex flex-col ${
                                  isDarkMode 
                                    ? "bg-[#1e293b] border-gray-700 text-white" 
                                    : "bg-white border-gray-200"
                                }`}>
                                  <DialogHeader className={`sticky top-0 z-10 pb-2 border-b ${
                                    isDarkMode ? "bg-[#1e293b] border-gray-700" : "bg-white border-gray-200"
                                  }`}>
                                    <DialogTitle className="text-xl font-semibold">Edit Librarian Profile</DialogTitle>
                                  </DialogHeader>

                                  <form onSubmit={editLibrarian} className="overflow-y-auto">
                                    <div className="grid gap-4 py-4 grid-cols-1 sm:grid-cols-2">
                                      {/* for name */}
                                      <div className="space-y-2">
                                        <Label htmlFor="librarianName" className={labelClasses}>
                                          Librarian's Name
                                        </Label>
                                        <input
                                          id="librarianName"
                                          name="librarianName"
                                          value={input.librarianName}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>
                                      
                                      {/* for phone */}
                                      <div className="space-y-2">
                                        <Label htmlFor="phone" className={labelClasses}>
                                          Phone Number
                                        </Label>
                                        <input
                                          id="phone"
                                          name="phone"
                                          value={input.phone}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>
                                      
                                      {/* for email */}
                                      <div className="space-y-2">
                                        <Label htmlFor="email" className={labelClasses}>
                                          Email
                                        </Label>
                                        <input
                                          id="email"
                                          name="email"
                                          type="email"
                                          value={input.email}
                                          onChange={changeEventHandler}
                                          className={`${inputClasses} `}
                                          readOnly
                                        />
                                      </div>

                                      {/* for joining date */}
                                      <div className="space-y-2">
                                        <Label htmlFor="joiningDate" className={labelClasses}>
                                          Joining Date
                                        </Label>
                                        <input
                                          id="joiningDate"
                                          name="joiningDate"
                                          type="date"
                                          value={input.joiningDate}
                                          onChange={changeEventHandler}
                                          className={`${inputClasses} `}
                                          readOnly
                                        />
                                      </div>
                                      
                                      {/* for gender */}
                                      <div className="space-y-2">
                                        <Label htmlFor="gender" className={labelClasses}>
                                          Gender
                                        </Label>
                                        <select
                                          id="gender"
                                          name="gender"
                                          value={input.gender}
                                          onChange={changeEventHandler}
                                          className={selectClasses}
                                        >
                                          <option value="">Select gender</option>
                                          {allGenders.map((item, index) => (
                                            <option key={index} value={item}>
                                              {item}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                                                        {/* for blood group */}
                                                                        <div className="space-y-2">
                                        <Label htmlFor="bloodGroup" className={labelClasses}>
                                          Blood Group
                                        </Label>
                                        <select
                                          id="bloodGroup"
                                          name="bloodGroup"
                                          value={input.bloodGroup}
                                          onChange={changeEventHandler}
                                          className={selectClasses}
                                        >
                                          <option value="">Select blood group</option>
                                          {allBloodGroups.map((item, index) => (
                                            <option key={index} value={item}>
                                              {item}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* for religion */}
                                      <div className="space-y-2">
                                        <Label htmlFor="religion" className={labelClasses}>
                                          Religion
                                        </Label>
                                        <select
                                          id="religion"
                                          name="religion"
                                          value={input.religion}
                                          onChange={changeEventHandler}
                                          className={selectClasses}
                                        >
                                          <option value="">Select religion</option>
                                          {allReligions.map((item, index) => (
                                            <option key={index} value={item}>
                                              {capitalizeFirstLetter(item)}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* for marital status */}
                                      <div className="space-y-2">
                                        <Label htmlFor="maritialStatus" className={labelClasses}>
                                          Marital Status
                                        </Label>
                                        <select
                                          id="maritialStatus"
                                          name="maritialStatus"
                                          value={input.maritialStatus}
                                          onChange={changeEventHandler}
                                          className={selectClasses}
                                        >
                                          <option value="">Select status</option>
                                          <option value="married">Married</option>
                                          <option value="unmarried">Unmarried</option>
                                        </select>
                                      </div>

                                      {/* for country */}
                                      <div className="space-y-2">
                                        <Label htmlFor="country" className={labelClasses}>
                                          Country
                                        </Label>
                                        <input
                                          id="country"
                                          name="country"
                                          value={input.country}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      {/* for state */}
                                      <div className="space-y-2">
                                        <Label htmlFor="state" className={labelClasses}>
                                          State
                                        </Label>
                                        <input
                                          id="state"
                                          name="state"
                                          value={input.state}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      {/* for district */}
                                      <div className="space-y-2">
                                        <Label htmlFor="district" className={labelClasses}>
                                          District
                                        </Label>
                                        <input
                                          id="district"
                                          name="district"
                                          value={input.district}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      {/* for city */}
                                      <div className="space-y-2">
                                        <Label htmlFor="city" className={labelClasses}>
                                          City
                                        </Label>
                                        <input
                                          id="city"
                                          name="city"
                                          value={input.city}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      {/* for pin code */}
                                      <div className="space-y-2">
                                        <Label htmlFor="pinCode" className={labelClasses}>
                                          Pin Code
                                        </Label>
                                        <input
                                          id="pinCode"
                                          name="pinCode"
                                          value={input.pinCode}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      {/* for police station */}
                                      <div className="space-y-2">
                                        <Label htmlFor="policeStation" className={labelClasses}>
                                          Police Station
                                        </Label>
                                        <input
                                          id="policeStation"
                                          name="policeStation"
                                          value={input.policeStation}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      {/* for village/post */}
                                      <div className="space-y-2">
                                        <Label htmlFor="villPost" className={labelClasses}>
                                          Village/Post
                                        </Label>
                                        <input
                                          id="villPost"
                                          name="villPost"
                                          value={input.villPost}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      {/* Image Upload Field */}
                                      <div className="space-y-2 col-span-2">
                                        <Label htmlFor="librarianImage" className={labelClasses}>
                                          Profile Image
                                        </Label>
                                        <div className="flex items-center gap-4">
                                          {previewUrl && (
                                            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                              <img
                                                src={previewUrl}
                                                alt="Profile preview"
                                                className="h-full w-full object-cover"
                                              />
                                            </div>
                                          )}
                                          <input
                                            id="librarianImage"
                                            name="librarianImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className={`${inputClasses} flex-grow`}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <DialogFooter className={`mt-6 pt-4 border-t ${
                                      isDarkMode ? "border-gray-700" : "border-gray-200"
                                    }`}>
                                      {postApiLoading ? (
                                        <Button 
                                          disabled 
                                          className={`${
                                            isDarkMode 
                                              ? "bg-blue-700 hover:bg-blue-800" 
                                              : "bg-blue-600 hover:bg-blue-700"
                                          } text-white`}
                                        >
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Saving...
                                        </Button>
                                      ) : (
                                        <Button 
                                          type="submit" 
                                          className={`${
                                            isDarkMode 
                                              ? "bg-blue-700 hover:bg-blue-800" 
                                              : "bg-blue-600 hover:bg-blue-700"
                                          } text-white`}
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
                                name={item.librarianName}
                                deletePath={`${teacherEdpLibraryanUrlApi.addLibraryan.url}/${item.id}/${schoolId}`}
                                onDelete={() => {
                                  const updatedData = allLibrarianInfo?.filter(
                                    (data) => data.id !== item.id
                                  );
                                  dispatch(setLibrarianInfo(updatedData));
                                }}
                                buttonClassName={`${
                                  isDarkMode 
                                    ? "bg-red-700 hover:bg-red-800 text-white" 
                                    : "bg-red-500 hover:bg-red-600 text-white"
                                } rounded-md`}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className={`text-center py-8 ${
                            isDarkMode
                              ? "text-gray-400 border-[rgba(193,193,193,0.2)]"
                              : "text-gray-500 border-gray-200"
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <UsersIcon className={`h-12 w-12 ${
                              isDarkMode ? "text-gray-600" : "text-gray-400"
                            } mb-2`} />
                            <p className="text-lg font-medium">No librarians found</p>
                            <p className="text-sm">
                              There are no librarian records available at the moment
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {paginatedData?.length > 0 && (
                <div className={`p-4 border-t ${
                  isDarkMode ? "border-[rgba(193,193,193,0.2)]" : "border-gray-200"
                }`}>
                  <PaginationComponent
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    totalPages={totalPages}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageLibrarianPage;