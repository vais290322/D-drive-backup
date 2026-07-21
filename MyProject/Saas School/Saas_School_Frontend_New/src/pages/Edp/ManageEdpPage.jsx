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
import { Loader2, Search } from "lucide-react";
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
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { CountertopsRounded, DateRangeSharp, Email } from "@mui/icons-material";

const ManageEdpPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allReligions =
    useSelector((state) => state.settings.religionNames) || [];
  const allBloodGroups =
    useSelector((state) => state.settings.bloodGroupNames) || [];
  const allGenders = useSelector((state) => state.settings.genderNames) || [];
  const allEdpInfo = useSelector((state) => state.teacherInfo.edpInfo) || [];
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
    edpName: "",
    religion: "",
    phone: "",
    email: "",
    gender: "",
    bloodGroup: "",
    joiningDate: "",
    maritialStatus: "",
    edpImage: null,
    pinCode: "",
    state: "",
    city: "",
    district: "",
    country: "",
    policeStation: "",
    villPost: "",
  });

  const dataLength = allEdpInfo?.length;

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
  
  // for fetch the edp data
  const fetchEdpData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${teacherEdpLibraryanUrlApi.addEdp.url}/${schoolId}`
      );
      if (response) {
        dispatch(setEdpInfo(response?.data?.data || []));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
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

      // Create FormData if there's a file to upload
      let requestData = input;

      if (selectedFile) {
        const formData = new FormData();
        // Add all input fields to formData
        Object.keys(input).forEach((key) => {
          formData.append(key, input[key]);
        });
        // Add the file
        formData.append("edpImage", selectedFile);
        requestData = formData;
      }

      const response = await axios.put(
        `${teacherEdpLibraryanUrlApi.addEdp.url}/${currentStudent.id}/${schoolId}`,
        requestData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        toast.success(response.data.message);
        fetchEdpData();
        setSelectedFile(null);
        setPreviewUrl("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setPostApiLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setPreviewUrl(item.edpImage);
    setCurrentStudent(item);
    setInput({
      edpName: item.edpName,
      religion: item.religion,
      phone: item.phone,
      email: item.email,
      gender: item.gender,
      bloodGroup: item.bloodGroup,
      joiningDate: item.joiningDate,
      maritialStatus: item.maritialStatus,
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
  const paginatedData = allEdpInfo?.slice(
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

  // Search function
  const searchEdp = (e) => {
    e.preventDefault();
    // Implement search functionality here
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
            <h1 className="text-2xl font-bold">Manage EDP Staff</h1>
          </div>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            View, edit and manage all EDP staff members
          </p>
        </div>
        
        {/* Search Section */}
        {/* <div className={`mb-6 p-4 rounded-lg shadow-md ${
          isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-gray-200'
        }`}>
          <form onSubmit={searchEdp} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full ${
                  isDarkMode 
                    ? "bg-[#0f172a] border-gray-700 text-white placeholder-gray-400" 
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <Button 
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto ${
                loading 
                  ? "bg-gray-500 cursor-not-allowed" 
                  : isDarkMode 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </form>
        </div> */}

        {/* Table Section */}
        <div className={`rounded-lg shadow-md overflow-hidden ${
          isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-gray-200'
        }`}>
          {/* Table Header */}
          <div className={`p-4 border-b ${
            isDarkMode ? 'border-[rgba(193,193,193,0.2)]' : 'border-gray-200'
          }`}>
            <h2 className="text-lg font-semibold">EDP Staff List</h2>
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
                      {["S.No", "Edp Name", "Email", "Phone", "View", "Action"].map(
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
                                {item.edpImage ? (
                                  <img 
                                    src={item.edpImage} 
                                    alt={item.edpName} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <UserIcon className="h-full w-full p-1 text-gray-500" />
                                )}
                              </div>
                              {item.edpName}
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
                                    Edp's Details
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
                                        src={currentStudent?.edpImage}
                                        alt="edp"
                                        className={`w-32 h-32 rounded-full object-cover border shadow-md ${
                                          isDarkMode ? "border-gray-700" : "border-gray-300"
                                        }`}
                                      />
                                    </div>

                                    {/* Staff Details */}
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <UserIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Teacher Name:
                                      </strong>{" "}
                                      {currentStudent?.edpName}
                                    </p>
                                    <p className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      <UserIcon className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                      <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                                        Teacher Code:
                                      </strong>{" "}
                                      {currentStudent?.edpCode}
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
                            } text-right`}
                          >
                            <div className="flex justify-end items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${
                                      isDarkMode
                                        ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-700"
                                        : "bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClick(item);
                                    }}
                                  >
                                    <FaEdit className="mr-1 h-4 w-4" />
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className={`sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col ${
                                  isDarkMode 
                                    ? "bg-[#1e293b] border-gray-700 text-white" 
                                    : "bg-white border-gray-200"
                                }`}>
                                  <DialogHeader className={`sticky top-0 z-10 pb-2 border-b ${
                                    isDarkMode ? "bg-[#1e293b] border-gray-700" : "bg-white border-gray-200"
                                  }`}>
                                    <DialogTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
                                      Edit EDP Staff
                                    </DialogTitle>
                                  </DialogHeader>

                                  <form onSubmit={editEdp} className="overflow-y-auto">
                                    <div className="grid gap-4 py-4 grid-cols-1 sm:grid-cols-2">
                                      {/* Profile Image Preview */}
                                      <div className="col-span-2 flex justify-center mb-4">
                                        <div className="relative">
                                          <img
                                            src={previewUrl || currentStudent?.edpImage}
                                            alt="Profile Preview"
                                            className={`w-24 h-24 rounded-full object-cover border ${
                                              isDarkMode ? "border-gray-700" : "border-gray-300"
                                            }`}
                                          />
                                          <label 
                                            htmlFor="edpImage" 
                                            className={`absolute bottom-0 right-0 p-1 rounded-full cursor-pointer ${
                                              isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"
                                            }`}
                                          >
                                            <FaEdit className="h-4 w-4" />
                                            <input
                                              type="file"
                                              id="edpImage"
                                              name="edpImage"
                                              onChange={handleFileChange}
                                              className="hidden"
                                              accept="image/*"
                                            />
                                          </label>
                                        </div>
                                      </div>
{/* Basic Information Fields */}
                                      <div className="space-y-2">
                                        <Label htmlFor="edpName" className={labelClasses}>
                                          EDP Name
                                        </Label>
                                        <input
                                          type="text"
                                          id="edpName"
                                          name="edpName"
                                          value={input.edpName}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                          required
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="email" className={labelClasses}>
                                          Email
                                        </Label>
                                        <input
                                          type="email"
                                          id="email"
                                          name="email"
                                          value={input.email}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                          required
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="phone" className={labelClasses}>
                                          Phone
                                        </Label>
                                        <input
                                          type="text"
                                          id="phone"
                                          name="phone"
                                          value={input.phone}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                          required
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="joiningDate" className={labelClasses}>
                                          Joining Date
                                        </Label>
                                        <input
                                          type="date"
                                          id="joiningDate"
                                          name="joiningDate"
                                          value={input.joiningDate}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="gender" className={labelClasses}>
                                          Gender
                                        </Label>
                                        <Select
                                          value={input.gender}
                                          onValueChange={(value) =>
                                            setInput({ ...input, gender: value })
                                          }
                                        >
                                          <SelectTrigger className={selectClasses}>
                                            <SelectValue placeholder="Select gender" />
                                          </SelectTrigger>
                                          <SelectContent className={isDarkMode ? "bg-[#1e293b] text-white border-gray-700" : ""}>
                                            <SelectGroup>
                                              <SelectLabel className={isDarkMode ? "text-gray-300" : ""}>
                                                Gender
                                              </SelectLabel>
                                              {allGenders.map((gender) => (
                                                <SelectItem
                                                  key={gender}
                                                  value={gender}
                                                  className={isDarkMode ? "hover:bg-[#0f172a]" : ""}
                                                >
                                                  {gender}
                                                </SelectItem>
                                              ))}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="bloodGroup" className={labelClasses}>
                                          Blood Group
                                        </Label>
                                        <Select
                                          value={input.bloodGroup}
                                          onValueChange={(value) =>
                                            setInput({ ...input, bloodGroup: value })
                                          }
                                        >
                                          <SelectTrigger className={selectClasses}>
                                            <SelectValue placeholder="Select blood group" />
                                          </SelectTrigger>
                                          <SelectContent className={isDarkMode ? "bg-[#1e293b] text-white border-gray-700" : ""}>
                                            <SelectGroup>
                                              <SelectLabel className={isDarkMode ? "text-gray-300" : ""}>
                                                Blood Group
                                              </SelectLabel>
                                              {allBloodGroups.map((bloodGroup) => (
                                                <SelectItem
                                                  key={bloodGroup}
                                                  value={bloodGroup}
                                                  className={isDarkMode ? "hover:bg-[#0f172a]" : ""}
                                                >
                                                  {bloodGroup}
                                                </SelectItem>
                                              ))}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="religion" className={labelClasses}>
                                          Religion
                                        </Label>
                                        <Select
                                          value={input.religion}
                                          onValueChange={(value) =>
                                            setInput({ ...input, religion: value })
                                          }
                                        >
                                          <SelectTrigger className={selectClasses}>
                                            <SelectValue placeholder="Select religion" />
                                          </SelectTrigger>
                                          <SelectContent className={isDarkMode ? "bg-[#1e293b] text-white border-gray-700" : ""}>
                                            <SelectGroup>
                                              <SelectLabel className={isDarkMode ? "text-gray-300" : ""}>
                                                Religion
                                              </SelectLabel>
                                              {allReligions.map((religion) => (
                                                <SelectItem
                                                  key={religion}
                                                  value={religion}
                                                  className={isDarkMode ? "hover:bg-[#0f172a]" : ""}
                                                >
                                                  {religion}
                                                </SelectItem>
                                              ))}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="maritialStatus" className={labelClasses}>
                                          Marital Status
                                        </Label>
                                        <Select
                                          value={input.maritialStatus}
                                          onValueChange={(value) =>
                                            setInput({ ...input, maritialStatus: value })
                                          }
                                        >
                                          <SelectTrigger className={selectClasses}>
                                            <SelectValue placeholder="Select marital status" />
                                          </SelectTrigger>
                                          <SelectContent className={isDarkMode ? "bg-[#1e293b] text-white border-gray-700" : ""}>
                                            <SelectGroup>
                                              <SelectLabel className={isDarkMode ? "text-gray-300" : ""}>
                                                Marital Status
                                              </SelectLabel>
                                              {["Single", "Married", "Divorced", "Widowed"].map((status) => (
                                                <SelectItem
                                                  key={status}
                                                  value={status}
                                                  className={isDarkMode ? "hover:bg-[#0f172a]" : ""}
                                                >
                                                  {status}
                                                </SelectItem>
                                              ))}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* Address Information */}
                                      <div className="col-span-2 mt-4 border-t pt-4 border-gray-700">
                                        <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                          Address Information
                                        </h3>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="country" className={labelClasses}>
                                          Country
                                        </Label>
                                        <input
                                          type="text"
                                          id="country"
                                          name="country"
                                          value={input.country}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="state" className={labelClasses}>
                                          State
                                        </Label>
                                        <input
                                          type="text"
                                          id="state"
                                          name="state"
                                          value={input.state}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="district" className={labelClasses}>
                                          District
                                        </Label>
                                        <input
                                          type="text"
                                          id="district"
                                          name="district"
                                          value={input.district}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="city" className={labelClasses}>
                                          City
                                        </Label>
                                        <input
                                          type="text"
                                          id="city"
                                          name="city"
                                          value={input.city}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="pinCode" className={labelClasses}>
                                          Pin Code
                                        </Label>
                                        <input
                                          type="text"
                                          id="pinCode"
                                          name="pinCode"
                                          value={input.pinCode}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="policeStation" className={labelClasses}>
                                          Police Station
                                        </Label>
                                        <input
                                          type="text"
                                          id="policeStation"
                                          name="policeStation"
                                          value={input.policeStation}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      <div className="space-y-2 col-span-2">
                                        <Label htmlFor="villPost" className={labelClasses}>
                                          Village/Post Office
                                        </Label>
                                        <input
                                          type="text"
                                          id="villPost"
                                          name="villPost"
                                          value={input.villPost}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>
                                    </div>

                                    <DialogFooter className={`sticky bottom-0 pt-4 border-t ${
                                      isDarkMode ? "bg-[#1e293b] border-gray-700" : "bg-white border-gray-200"
                                    }`}>
                                      <Button
                                        type="submit"
                                        disabled={postApiLoading}
                                        className={`${
                                          postApiLoading
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : isDarkMode
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-blue-500 hover:bg-blue-600"
                                        } text-white transition-colors`}
                                      >
                                        {postApiLoading ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                          </>
                                        ) : (
                                          "Update EDP Staff"
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>

                              <DeleteComponent
                        name={item.edpName} // Name of the item
                        deletePath={`${teacherEdpLibraryanUrlApi.addEdp.url}/${item.id}/${schoolId}`} // API endpoint for deletion
                        onDelete={() => {
                          const updatedData = allEdpInfo?.filter(
                            (data) => data.id !== item.id
                          );
                          dispatch(setEdpInfo(updatedData)); // Update the Redux state after deletion
                        }}
                      />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className={`px-4 py-8 text-center ${
                            isDarkMode
                              ? "border-[rgba(193,193,193,0.2)] text-gray-300"
                              : "border-gray-200 text-gray-500"
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Users className={`h-12 w-12 ${
                              isDarkMode ? "text-gray-600" : "text-gray-300"
                            } mb-3`} />
                            <p className="text-lg font-medium">No EDP staff found</p>
                            <p className="text-sm mt-1">
                              Add new EDP staff members to see them here
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
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    dataLength={dataLength}
                    isDarkMode={isDarkMode}
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

export default ManageEdpPage;