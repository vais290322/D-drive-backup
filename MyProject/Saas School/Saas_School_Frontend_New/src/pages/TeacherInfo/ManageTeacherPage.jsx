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
import { FaDownload, FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription
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
import { Loader2, User, Users, View } from "lucide-react";
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
import MatiaStaffIdCardComponent from "@/components/ForTeacher/MatiaStaffIdCardComponent";

const ManageTeacherPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const [loading, setLoading] = useState(false);
  const [postApiLoading, setPostApiLoading] = useState(false);
  const allReligions =
    useSelector((state) => state.settings.religionNames) || [];
  const allTeacherInfo =
    useSelector((state) => state.teacherInfo.teacherInfo) || [];
  const allBloodGroups =
    useSelector((state) => state.settings.bloodGroupNames) || [];
  const allGenders = useSelector((state) => state.settings.genderNames) || [];
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [currentTeacher, setCurrentTeacher] = useState("");
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isOpenMatia, setIsOpenMatia] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Input classes for consistent styling
  const inputClasses = `w-full px-3 py-2 border ${isDarkMode
    ? "bg-[#0f172a] border-gray-700 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`;

  const labelClasses = `block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"
    }`;

  // Select classes for consistent styling
  const selectClasses = `w-full px-3 py-2 ${isDarkMode
    ? "bg-[#0f172a] border-gray-700 text-white"
    : "bg-white border-gray-300 text-gray-900"
    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`;

  const [input, setInput] = useState({
    teachersName: "",
    religion: "",
    phone: "",
    email: "",
    gender: "",
    bloodGroup: "",
    maritalStatus: "",
    joiningDate: "",
    pincode: "",
    state: "",
    city: "",
    district: "",
    country: "",
    policeStation: "",
    villagePost: "",
  });

  const dataLength = allTeacherInfo?.length;

  const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString || !dateString.includes("-")) return "";

  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

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

  // for fetch the teacher data
  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${teacherEdpLibraryanUrlApi.addTeacher.url}/${schoolId}`
      );
      if (response) {
        dispatch(setTeacherInfo(response?.data?.data || []));
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

  // for update teacher
  const editTeacher = async (e) => {
    e.preventDefault();

    try {
      setPostApiLoading(true);

      // Create FormData object
      const formData = new FormData();

      // Add all input fields to formData
      Object.keys(input).forEach((key) => {
        if (key !== "teachersImage") {
          formData.append(key, input[key]);
        }
      });

      // Add the file if selected
      if (selectedFile) {
        formData.append("teachersImage", selectedFile);
      }

      const response = await axios.put(
        `${teacherEdpLibraryanUrlApi.addTeacher.url}/${currentTeacher.id}/${schoolId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        toast.success(response.data.message);
        fetchTeacherData();
        setSelectedFile(null);
        setPreviewUrl("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating teacher");
    } finally {
      setPostApiLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setPreviewUrl(item.teachersImage);
    setCurrentTeacher(item);
    setInput({
      teachersName: item.teachersName,
      religion: item.religion,
      phone: item.phone,
      email: item.email,
      gender: item.gender,
      bloodGroup: item.bloodGroup,
      maritalStatus: item.maritalStatus,
      joiningDate: formatDateToYYYYMMDD(item.joiningDate),
      pincode: item.pincode,
      state: item.state,
      city: item.city,
      district: item.district,
      country: item.country,
      policeStation: item.policeStation,
      villagePost: item.villagePost,
    });
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = allTeacherInfo?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // console.log("paginatedData", paginatedData);

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    // Adjust current page if it exceeds the new total pages
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const handleSelectTeacher = async (item) => {
    setCurrentTeacher(item);
  };

  return (
    <div
      className={`min-h-[86vh] ${isDarkMode ? "bg-[#0f172a] text-white" : "bg-gray-50 text-gray-800"
        } transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mb-6 p-4 rounded-lg shadow-md ${isDarkMode
            ? "bg-[#1e293b] border border-[rgba(193,193,193,0.2)]"
            : "bg-white border border-gray-200"
            }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
                }`}
            >
              <Users
                className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
              />
            </div>
            <h1 className="text-2xl font-bold">Manage Teachers</h1>
          </div>
          <p
            className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            View, edit and manage all teaching staff members
          </p>
        </div>

        {/* Table Section */}
        <div
          className={`rounded-lg shadow-md overflow-hidden ${isDarkMode
            ? "bg-[#1e293b] border border-[rgba(193,193,193,0.2)]"
            : "bg-white border border-gray-200"
            }`}
        >
          {/* Table Header */}
          <div
            className={`p-4 border-b ${isDarkMode ? "border-[rgba(193,193,193,0.2)]" : "border-gray-200"
              }`}
          >
            <h2 className="text-lg font-semibold">Teaching Staff List</h2>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
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
                  <TableHeader
                    className={isDarkMode ? "bg-[#0f172a]" : "bg-gray-50"}
                  >
                    <TableRow>
                      {[
                        "S.No",
                        "Teacher Name",
                        "Email",
                        "Phone",
                        "View",
                        "Action",
                      ].map((header, index) => (
                        <TableHead
                          key={index}
                          className={`px-4 py-3 ${isDarkMode
                            ? "text-gray-200 border-[rgba(193,193,193,0.2)]"
                            : "text-gray-700 border-gray-200"
                            } font-semibold ${header === "Action" ? "text-right" : "text-left"
                            } ${["S.No", "Email"].includes(header)
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
                    {paginatedData?.length > 0 ? (
                      paginatedData.map((item, index) => (
                        <TableRow
                          key={item.id}
                          className={`hover:bg-opacity-70 ${isDarkMode
                            ? "hover:bg-[#1e293b] border-[rgba(193,193,193,0.2)]"
                            : "hover:bg-gray-50 border-gray-200"
                            }`}
                        >
                          <TableCell
                            className={`px-4 py-3 ${isDarkMode
                              ? "border-[rgba(193,193,193,0.2)]"
                              : "border-gray-200"
                              } hidden sm:table-cell`}
                          >
                            {(currentPage - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${isDarkMode
                              ? "border-[rgba(193,193,193,0.2)]"
                              : "border-gray-200"
                              } font-medium`}
                          >
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-200">
                                {item.teachersImage ? (
                                  <img
                                    src={item.teachersImage}
                                    alt={item.teachersName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <UserIcon className="h-full w-full p-1 text-gray-500" />
                                )}
                              </div>
                              {item.teachersName}
                            </div>
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${isDarkMode
                              ? "border-[rgba(193,193,193,0.2)]"
                              : "border-gray-200"
                              } hidden sm:table-cell`}
                          >
                            {item.email}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${isDarkMode
                              ? "border-[rgba(193,193,193,0.2)]"
                              : "border-gray-200"
                              }`}
                          >
                            {item.phone}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${isDarkMode
                              ? "border-[rgba(193,193,193,0.2)]"
                              : "border-gray-200"
                              }`}
                          >
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`rounded-full ${isDarkMode
                                    ? "hover:bg-slate-700 text-blue-400"
                                    : "hover:bg-blue-50 text-blue-600"
                                    }`}
                                  onClick={() => handleSelectTeacher(item)}
                                >
                                  <EyeIcon className="h-5 w-5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent
                                className={`p-6 rounded-xl shadow-2xl max-w-2xl ${isDarkMode
                                  ? "bg-[#1e293b] border-gray-700 text-white"
                                  : "bg-white border-gray-200"
                                  }`}
                              >
                                <DialogHeader>
                                  <DialogTitle
                                    className={`text-2xl font-semibold border-b pb-3 flex items-center gap-2 ${isDarkMode
                                      ? "text-white border-gray-700"
                                      : "text-gray-800 border-gray-200"
                                      }`}
                                  >
                                    <UserIcon
                                      className={`${isDarkMode
                                        ? "text-blue-400"
                                        : "text-blue-600"
                                        } w-6 h-6`}
                                    />
                                    Teacher's Details
                                  </DialogTitle>
                                </DialogHeader>

                                {currentTeacher && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-2 gap-4 mt-4"
                                  >
                                    {/* Profile Image */}
                                    <div className="col-span-2 flex justify-center">
                                      <img
                                        src={currentTeacher?.teachersImage}
                                        alt="teacher"
                                        className={`w-32 h-32 rounded-full object-cover border shadow-md ${isDarkMode
                                          ? "border-gray-700"
                                          : "border-gray-300"
                                          }`}
                                      />
                                    </div>

                                    {/* Staff Details */}
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <UserIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Teacher Name:
                                      </strong>{" "}
                                      {currentTeacher?.teachersName}
                                    </p>

                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <UserIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Teacher Code:
                                      </strong>{" "}
                                      {currentTeacher?.teachersCode}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <UserIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Teacher's Subject:
                                      </strong>{" "}
                                      {currentTeacher?.subject}
                                    </p>

                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <CalendarIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Joining Date:
                                      </strong>{" "}
                                      {currentTeacher?.joiningDate}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 text-wrap ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <MailIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Email:
                                      </strong>{" "}
                                      <span className="truncate">
                                        {currentTeacher?.email}
                                      </span>
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <PhoneIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Phone:
                                      </strong>{" "}
                                      {currentTeacher?.phone}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <GraduationCapIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Gender:
                                      </strong>{" "}
                                      {currentTeacher?.gender}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <UsersIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Blood Group:
                                      </strong>{" "}
                                      {currentTeacher?.bloodGroup}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <UsersIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Marital Status:
                                      </strong>{" "}
                                      {currentTeacher?.maritalStatus}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <UsersIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Religion:
                                      </strong>{" "}
                                      {currentTeacher?.religion}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <HeartIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        City:
                                      </strong>{" "}
                                      {currentTeacher?.city}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <User
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Designation:
                                      </strong>{" "}
                                      {currentTeacher?.country}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <MapPinIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        District:
                                      </strong>{" "}
                                      {currentTeacher?.district}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <MapPinIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Pin Code:
                                      </strong>{" "}
                                      {currentTeacher?.pincode}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <MapPinIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Police Station :
                                      </strong>{" "}
                                      {currentTeacher?.policeStation}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 col-span-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <MapPinIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        Village:
                                      </strong>{" "}
                                      {currentTeacher?.villagePost}
                                    </p>
                                    <p
                                      className={`flex items-center gap-2 col-span-2 ${isDarkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                        }`}
                                    >
                                      <MapPinIcon
                                        className={`w-5 h-5 ${isDarkMode
                                          ? "text-blue-400"
                                          : "text-blue-500"
                                          }`}
                                      />
                                      <strong
                                        className={
                                          isDarkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                        }
                                      >
                                        State:
                                      </strong>{" "}
                                      {currentTeacher?.state}
                                    </p>
                                  </motion.div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell
                            className={`px-4 py-3 ${isDarkMode
                              ? "border-[rgba(193,193,193,0.2)]"
                              : "border-gray-200"
                              }`}
                          >
                            <div className="flex justify-end items-center gap-2">

                              {
                                schoolId === '69118d20c4c6be31096c1ab4' && (
                                  <Button
                                    onClick={() => {
                                      setSelectedTeacher(item);
                                      setIsOpenMatia(true);
                                    }}

                                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                  >
                                    <FaDownload className="h-4 w-4" />
                                    {/* <span className="hidden sm:inline">Download</span> */}
                                  </Button>
                                )
                              }

                              <Dialog>
                                <DialogTrigger asChild>
                                  <FaEdit
                                    className={`${isDarkMode
                                      ? "bg-amber-700 hover:bg-amber-800 text-white"
                                      : "bg-amber-500 hover:bg-amber-600 text-white"
                                      } rounded-md sm:w-8 sm:h-8 w-6 h-6 bg-[#FF9F00] text-white p-1 sm:p-2 cursor-pointer `}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClick(item);
                                    }}
                                  />
                                </DialogTrigger>
                                <DialogContent
                                  className={`sm:max-w-[50%] max-h-[80vh] overflow-hidden flex flex-col ${isDarkMode
                                    ? "bg-[#1e293b] border-gray-700 text-white"
                                    : "bg-white border-gray-200"
                                    }`}
                                >
                                  <DialogHeader
                                    className={`sticky top-0 z-10 pb-2 border-b ${isDarkMode
                                      ? "bg-[#1e293b] border-gray-700"
                                      : "bg-white border-gray-200"
                                      }`}
                                  >
                                    <DialogTitle className="text-xl font-semibold">
                                      Edit Teacher Profile
                                    </DialogTitle>
                                  </DialogHeader>

                                  <form
                                    onSubmit={editTeacher}
                                    className="overflow-y-auto"
                                  >
                                    <div className="grid gap-4 py-4 grid-cols-1 sm:grid-cols-2">
                                      {/* for name */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="teachersName"
                                          className={labelClasses}
                                        >
                                          Teacher's Name
                                        </Label>
                                        <input
                                          id="teachersName"
                                          name="teachersName"
                                          value={input.teachersName}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      {/* for phone */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="phone"
                                          className={labelClasses}
                                        >
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
                                        <Label
                                          htmlFor="email"
                                          className={labelClasses}
                                        >
                                          Email
                                        </Label>
                                        <input
                                          id="email"
                                          name="email"
                                          type="email"
                                          value={input.email}
                                          onChange={changeEventHandler}
                                          className={`${inputClasses} cursor-not-allowed`}
                                          readOnly
                                        />
                                      </div>

                                      {/* for joining date */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="joiningDate"
                                          className={labelClasses}
                                        >
                                          Joining Date
                                        </Label>
                                        <input
                                          id="joiningDate"
                                          name="joiningDate"
                                          type="date"
                                          value={formatDateToYYYYMMDD(input.joiningDate)}
                                          onChange={changeEventHandler}
                                          className={`${inputClasses} cursor-not-allowed`}
                                          readOnly
                                        />
                                      </div>

                                      {/* for gender */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="gender"
                                          className={labelClasses}
                                        >
                                          Gender
                                        </Label>
                                        <select
                                          id="gender"
                                          name="gender"
                                          value={input.gender}
                                          onChange={changeEventHandler}
                                          className={selectClasses}
                                        >
                                          <option value="">
                                            Select gender
                                          </option>
                                          {allGenders.map((item, index) => (
                                            <option key={index} value={item}>
                                              {item}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* for blood group */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="bloodGroup"
                                          className={labelClasses}
                                        >
                                          Blood Group
                                        </Label>
                                        <select
                                          id="bloodGroup"
                                          name="bloodGroup"
                                          value={input.bloodGroup}
                                          onChange={changeEventHandler}
                                          className={selectClasses}
                                        >
                                          <option value="">
                                            Select blood group
                                          </option>
                                          {allBloodGroups.map((item, index) => (
                                            <option key={index} value={item}>
                                              {item}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* for religion */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="religion"
                                          className={labelClasses}
                                        >
                                          Religion
                                        </Label>
                                        <select
                                          id="religion"
                                          name="religion"
                                          value={input.religion}
                                          onChange={changeEventHandler}
                                          className={selectClasses}
                                        >
                                          <option value="">
                                            Select religion
                                          </option>
                                          {allReligions.map((item, index) => (
                                            <option key={index} value={item}>
                                              {item}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* for marital status */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="maritalStatus"
                                          className={labelClasses}
                                        >
                                          Marital Status
                                        </Label>
                                        <select
                                          id="maritalStatus"
                                          name="maritalStatus"
                                          value={input.maritalStatus}
                                          onChange={changeEventHandler}
                                          className={selectClasses}
                                        >
                                          <option value="">
                                            Select marital status
                                          </option>
                                          <option value="unmarried">
                                            Single
                                          </option>
                                          <option value="married">
                                            Married
                                          </option>
                                          <option value="Divorced">
                                            Divorced
                                          </option>
                                          <option value="Widowed">
                                            Widowed
                                          </option>
                                        </select>
                                      </div>

                                      {/* for designation */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="country"
                                          className={labelClasses}
                                        >
                                          Designation
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
                                        <Label
                                          htmlFor="state"
                                          className={labelClasses}
                                        >
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
                                        <Label
                                          htmlFor="district"
                                          className={labelClasses}
                                        >
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
                                        <Label
                                          htmlFor="city"
                                          className={labelClasses}
                                        >
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
                                        <Label
                                          htmlFor="pincode"
                                          className={labelClasses}
                                        >
                                          Pin Code
                                        </Label>
                                        <input
                                          id="pincode"
                                          name="pincode"
                                          value={input.pincode}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      {/* for police station */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="policeStation"
                                          className={labelClasses}
                                        >
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
                                        <Label
                                          htmlFor="villagePost"
                                          className={labelClasses}
                                        >
                                          Village/Post
                                        </Label>
                                        <input
                                          id="villagePost"
                                          name="villagePost"
                                          value={input.villagePost}
                                          onChange={changeEventHandler}
                                          className={inputClasses}
                                        />
                                      </div>

                                      {/* for teacher image */}
                                      <div className="space-y-2 col-span-2">
                                        <Label
                                          htmlFor="teachersImage"
                                          className={labelClasses}
                                        >
                                          Teacher Image
                                        </Label>
                                        <div className="flex items-center gap-4">
                                          <div
                                            className={`h-24 w-24 rounded-md overflow-hidden border ${isDarkMode
                                              ? "border-gray-700"
                                              : "border-gray-300"
                                              } flex items-center justify-center`}
                                          >
                                            {previewUrl ? (
                                              <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                              />
                                            ) : (
                                              <UserIcon className="h-12 w-12 text-gray-400" />
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <input
                                              id="teachersImage"
                                              name="teachersImage"
                                              type="file"
                                              onChange={handleFileChange}
                                              className={`${isDarkMode
                                                ? "text-gray-200 file:bg-gray-700 file:text-gray-200 file:border-gray-600"
                                                : "text-gray-700 file:bg-gray-100 file:text-gray-700 file:border-gray-300"
                                                } file:rounded-md file:px-3 file:py-2 file:mr-4 file:border file:cursor-pointer cursor-pointer block w-full text-sm`}
                                            />
                                            <p
                                              className={`mt-1 text-xs ${isDarkMode
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                                }`}
                                            >
                                              PNG, JPG or JPEG up to 2MB
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <DialogFooter className="mt-6 gap-2 flex-wrap">
                                      {/* <Button
                                        type="button"
                                        variant="outline"
                                        className={`${
                                          isDarkMode
                                            ? "bg-transparent border-gray-600 text-gray-200 hover:bg-gray-800"
                                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                        onClick={() => {
                                          setInput({
                                            teachersName: "",
                                            religion: "",
                                            phone: "",
                                            email: "",
                                            gender: "",
                                            bloodGroup: "",
                                            maritalStatus: "",
                                            joiningDate: "",
                                            pincode: "",
                                            state: "",
                                            city: "",
                                            district: "",
                                            country: "",
                                            policeStation: "",
                                            villagePost: "",
                                          });
                                          setSelectedFile(null);
                                          setPreviewUrl("");
                                        }}
                                      >
                                        Reset
                                      </Button> */}

                                      <Button
                                        type="submit"
                                        className={`${isDarkMode
                                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                                          : "bg-blue-600 hover:bg-blue-700 text-white"
                                          }`}
                                        disabled={postApiLoading}
                                      >
                                        {postApiLoading ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                          </>
                                        ) : (
                                          "Update Teacher"
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>

                              <DeleteComponent
                                name={item.teachersName} // Name of the item
                                deletePath={`${teacherEdpLibraryanUrlApi.addTeacher.url}/${item.id}/${schoolId}`} // API endpoint for deletion
                                onDelete={() => {
                                  const updatedData = allTeacherInfo?.filter(
                                    (data) => data.id !== item.id
                                  );
                                  dispatch(setTeacherInfo(updatedData)); // Update the Redux state after deletion
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
                          className={`text-center py-8 ${isDarkMode
                            ? "text-gray-400 border-[rgba(193,193,193,0.2)]"
                            : "text-gray-500 border-gray-200"
                            }`}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Users
                              className={`h-12 w-12 ${isDarkMode ? "text-gray-600" : "text-gray-400"
                                } mb-2`}
                            />
                            <p className="text-lg font-medium">
                              No teachers found
                            </p>
                            <p
                              className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"
                                }`}
                            >
                              Add teachers to see them listed here
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {dataLength > 0 && (
                <div
                  className={`p-4 border-t ${isDarkMode
                    ? "border-[rgba(193,193,193,0.2)]"
                    : "border-gray-200"
                    }`}
                >
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {
          isOpenMatia && (
            <Dialog open={isOpenMatia} onOpenChange={setIsOpenMatia}>
              <DialogContent className=" max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Teacher ID Card Preview And Download</DialogTitle>
                  <DialogDescription>
                    Preview of the teacher ID card for {selectedTeacher?.teachersName}.
                  </DialogDescription>
                </DialogHeader>
                <MatiaStaffIdCardComponent
                  photoUrl={selectedTeacher?.teachersImage}
                  teacherName={selectedTeacher?.teachersName}
                  designation={selectedTeacher?.country}
                  address={selectedTeacher?.villagePost}
                  mobile={selectedTeacher?.phone}
                  bloodGroup={selectedTeacher?.bloodGroup}
                  teachersCode={selectedTeacher?.teachersCode}
                  open={isOpenMatia}
                  onOpenChange={setIsOpenMatia}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" onClick={() => setSelectedTeacher(null)}>Cancel</Button>
                  </DialogClose>

                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }

      </div>
    </div>
  );
};

export default ManageTeacherPage;
