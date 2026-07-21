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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaChevronDown } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { RiBus2Line } from "react-icons/ri";
import axios from "axios";
import { toast } from "sonner";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setStudentInfo } from "@/utils/studentInformation/studentInfoSlice";
import mainUrlApi from "@/common/main";
import { motion } from "framer-motion";
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
  Search,
  Loader2,
} from "lucide-react";
import serviceUrlApi from "@/common/service";

const StudentServiceFeesPaymentPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const [loading, setLoading] = useState(false);
  const [currentStudent, setCurrentStudent] = useState("");
  // Add these state variables for edit functionality

  const studentInfo =
    useSelector((state) => state.studentInfo.studentInfo) || [];
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user);
  const schoolId = useSelector((state) => state.auth.schoolId);
  // Search states
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");
  const [options, setOptions] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [itemdata, setItemdata] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);

  // Toggle option selection
  const toggleOption = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Fetch available services
  useEffect(() => { 
    const fetchClass = async () => {
      try {
        const api = `${serviceUrlApi.getServiceApi.url}/${schoolId}`;
        const response = await axios.get(`${api}`);
        setOptions(response.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchClass();
  }, []);

  // Handle service assignment to student
  const editStudent = (e) => {
    e.preventDefault();
    setServiceLoading(true);

    const selectedServices = options
      .filter((service) => selected.includes(service.serviceType))
      .map((service) => ({
        serviceType: service.serviceType,
        description: service.description,
        charge: service.charge,
      }));

    const api = `${serviceUrlApi?.schoolAdmissionServic?.url}/${itemdata}/services/${schoolId}`;
    axios
      .post(api, selectedServices)
      .then((response) => {
        toast.success(response.data.message);
        setIsOpen(false);
        setDialogOpen(false);
        setSelected([]);
        fetchStudentData();
      })
      .catch((error) => {
        toast.error("Error updating student");
      })
      .finally(() => {
        setServiceLoading(false);
      });
  };

  // Filter student data based on search criteria
  const filteredData = studentInfo?.filter((item) => {
    return (
      (searchClass === "" ||
        item?.className?.toLowerCase()?.includes(searchClass?.toLowerCase()) ||
        item?.rollNo?.toLowerCase()?.includes(searchClass?.toLowerCase())) &&
      (searchSection === "" ||
        item?.section?.toLowerCase()?.includes(searchSection?.toLowerCase())) &&
      (searchAdmissionNumber === "" ||
        item?.admissionNumber
          ?.toLowerCase()
          ?.includes(searchAdmissionNumber?.toLowerCase()) ||
        item?.studentName
          ?.toLowerCase()
          ?.includes(searchAdmissionNumber?.toLowerCase()))
    );
  });

  const dataLength = filteredData?.length;

  // Fetch student data
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${mainUrlApi.studentInfo.url}/${schoolId}`
      );

      if (response) {
        dispatch(setStudentInfo(response.data.data));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    const newTotalPages = Math.ceil(dataLength / newRowsPerPage);
    setCurrentPage((prev) => Math.min(prev, newTotalPages));
  };

  const handleSelectStudent = async (item) => {
    setCurrentStudent(item);
  };

  const headers = [
    "S.No",
    "Admission No",
    "Roll No",
    "Student Name",
    "Class(Section)",
    "Guardian Name",
    "Gender",
    "View",
    "Action",
  ];
  
  if (["vais"].includes(role)) {
    headers.push("Action");
  }

  const handleClick = async (service) => {
    const api = `${serviceUrlApi?.schoolAdmissionServic?.url}/${currentStudent?.admissionNumber}/services/${schoolId}/${service}`;
    const response = await axios.delete(`${api}`);
    if (response) {
      toast.success(response.data.message);
      setViewDialogOpen(false);
      fetchStudentData();
    }
  };

  return (
    <div className={`${isDarkMode ? "bg-[#0c1425]" : "bg-gray-50"} min-h-screen pb-16`}>
      <div className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Student Service Fees Management
          </h1>
          <p className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Assign and manage service fees for students
          </p>
        </div>

        {/* Search Section */}
        <div className={`p-4 rounded-lg shadow-md mb-6 ${
          isDarkMode ? "bg-[#111c38] border border-[#1e2a4a]" : "bg-white border border-gray-200"
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <Search className={`mr-2 h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
              <input
                type="text"
                placeholder="Search by class or roll no"
                className={`border rounded-md px-3 py-2 w-full md:w-auto text-sm ${
                  isDarkMode 
                    ? "bg-[#1a2747] border-[#1e2a4a] text-white placeholder:text-gray-400" 
                    : "border-gray-300 placeholder:text-gray-500"
                }`}
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
              />
            </div>
            
            <div className="flex items-center w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by section"
                className={`border rounded-md px-3 py-2 w-full md:w-auto text-sm ${
                  isDarkMode 
                    ? "bg-[#1a2747] border-[#1e2a4a] text-white placeholder:text-gray-400" 
                    : "border-gray-300 placeholder:text-gray-500"
                }`}
                value={searchSection}
                onChange={(e) => setSearchSection(e.target.value)}
              />
            </div>
            
            <div className="flex items-center w-full md:w-auto">
              <input
                type="text"
                placeholder="Admission Number or Name"
                className={`border rounded-md px-3 py-2 w-full md:w-auto text-sm ${
                  isDarkMode 
                    ? "bg-[#1a2747] border-[#1e2a4a] text-white placeholder:text-gray-400" 
                    : "border-gray-300 placeholder:text-gray-500"
                }`}
                value={searchAdmissionNumber}
                onChange={(e) => setSearchAdmissionNumber(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className={`rounded-lg shadow-md overflow-hidden ${
          isDarkMode ? "bg-[#111c38] border border-[#1e2a4a]" : "bg-white border border-gray-200"
        }`}>
          {/* Table Header */}
          <div className={`flex justify-between items-center p-4 border-b ${
            isDarkMode ? "border-[#1e2a4a]" : "border-gray-200"
          }`}>
            <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              All Students ({dataLength})
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className={`h-8 w-8 animate-spin ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
              </div>
            ) : (
              <Table className="w-full">
                <TableHeader className={isDarkMode ? "bg-[#1a2747]" : "bg-gray-50"}>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead
                        key={index}
                        className={`px-4 py-3 text-sm font-medium ${
                          isDarkMode ? "text-gray-300 border-[#1e2a4a]" : "text-gray-600 border-gray-200"
                        } ${header === "Action" ? "text-right" : "text-left"}`}
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <TableRow
                        key={index}
                        className={`${
                          isDarkMode 
                            ? "hover:bg-[#1a2747] border-b border-[#1e2a4a]" 
                            : "hover:bg-gray-50 border-b border-gray-200"
                        }`}
                      >
                        <TableCell className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {item.admissionNumber}
                        </TableCell>
                        <TableCell className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {item.rollNo}
                        </TableCell>
                        <TableCell className={`px-4 py-3 font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {item.studentName}
                        </TableCell>
                        <TableCell className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {item.className} ({item.section})
                        </TableCell>
                        <TableCell className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {item.fatherName}
                        </TableCell>
                        <TableCell className={`px-4 py-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {item.gender}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`flex items-center gap-1 ${
                                  isDarkMode 
                                    ? "bg-[#1a2747] text-[#a3b1ff] hover:bg-[#243660] border-[#1e2a4a]" 
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                                }`}
                                onClick={() => {
                                  setCurrentStudent(item);
                                  setViewDialogOpen(true);
                                }}
                              >
                                <EyeIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className={`sm:max-w-md ${
                              isDarkMode ? "bg-[#111c38] text-white border-[#1e2a4a]" : "bg-white"
                            }`}>
                              <DialogHeader>
                                <DialogTitle className={isDarkMode ? "text-white" : ""}>
                                  Student Services
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                                    isDarkMode ? "bg-[#1a2747]" : "bg-blue-100"
                                  }`}>
                                    <UserIcon className={`h-8 w-8 ${
                                      isDarkMode ? "text-[#a3b1ff]" : "text-blue-600"
                                    }`} />
                                  </div>
                                  <div>
                                    <h3 className={`font-semibold text-lg ${isDarkMode ? "text-white" : ""}`}>
                                      {currentStudent?.studentName}
                                    </h3>
                                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                      Class: {currentStudent?.className} ({currentStudent?.section})
                                    </p>
                                  </div>
                                </div>
                                
                                <div className={`p-4 rounded-lg ${
                                  isDarkMode ? "bg-[#1a2747]" : "bg-gray-50"
                                }`}>
                                  <h4 className={`font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                    Assigned Services
                                  </h4>
                                  
                                  {currentStudent?.services?.length > 0 ? (
                                    <div className="space-y-2">
                                      {currentStudent?.services?.map((service, index) => (
                                        <div 
                                          key={index}
                                          className={`flex justify-between items-center p-2 rounded ${
                                            isDarkMode ? "bg-[#243660] text-white" : "bg-white"
                                          }`}
                                        >
                                          <div>
                                            <p className="font-medium">{service.serviceType}</p>
                                            <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                              {service.description}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <span className={`font-medium ${
                                              isDarkMode ? "text-[#a3b1ff]" : "text-blue-600"
                                            }`}>
                                              ₹{service.charge}
                                            </span>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className={`p-1 rounded-full ${
                                                isDarkMode 
                                                  ? "hover:bg-[#0c1425] text-red-400" 
                                                  : "hover:bg-red-50 text-red-500"
                                              }`}
                                              onClick={() => handleClick(service.serviceType)}
                                            >
                                              <MdDelete size={18} />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className={`text-sm italic ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                      No services assigned yet.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`flex items-center gap-1 ${
                                  isDarkMode 
                                    ? "bg-[#1a2747] text-[#a3b1ff] hover:bg-[#243660] border-[#1e2a4a]" 
                                    : "bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                }`}
                                onClick={() => {
                                  setItemdata(item.admissionNumber);
                                  setSelected(
                                    item?.services?.map((service) => service.serviceType) || []
                                  );
                                }}
                              >
                                <FaEdit className="h-3 w-3" />
                                <span className="hidden sm:inline">Assign</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className={`sm:max-w-md ${
                              isDarkMode ? "bg-[#111c38] text-white border-[#1e2a4a]" : "bg-white"
                            }`}>
                              <DialogHeader>
                                <DialogTitle className={isDarkMode ? "text-white" : ""}>
                                  Assign Services
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                  Select services to assign to {item.studentName}
                                </p>
                                
                                <div className={`grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto p-2 rounded-md ${
                                  isDarkMode ? "bg-[#1a2747]" : "bg-gray-50"
                                }`}>
                                  {options.map((option, index) => (
                                    <div 
                                      key={index}
                                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                                        selected.includes(option.serviceType)
                                          ? isDarkMode 
                                            ? "bg-[#2563eb] text-white" 
                                            : "bg-blue-100 border border-blue-300"
                                          : isDarkMode 
                                            ? "bg-[#243660] hover:bg-[#2a3e6e]" 
                                            : "bg-white hover:bg-gray-100 border border-gray-200"
                                      }`}
                                      onClick={() => toggleOption(option.serviceType)}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-md ${
                                          isDarkMode ? "bg-[#1a2747]" : "bg-blue-50"
                                        }`}>
                                          <RiBus2Line className={
                                            isDarkMode ? "text-[#a3b1ff]" : "text-blue-600"
                                          } />
                                        </div>
                                        <div>
                                          <p className="font-medium">{option.serviceType}</p>
                                          <p className={`text-xs ${
                                            isDarkMode ? "text-gray-300" : "text-gray-600"
                                          }`}>
                                            {option.description}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className={`font-medium ${
                                          isDarkMode ? "text-[#a3b1ff]" : "text-blue-600"
                                        }`}>
                                          ₹{option.charge}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setDialogOpen(false)}
                                  className={isDarkMode 
                                    ? "bg-[#1a2747] text-white border-[#1e2a4a] hover:bg-[#243660]" 
                                    : "border-gray-300"
                                  }
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  onClick={editStudent}
                                  disabled={serviceLoading}
                                  className={isDarkMode 
                                    ? "bg-[#2563eb] hover:bg-[#1d4ed8]" 
                                    : "bg-blue-600 hover:bg-blue-700"
                                  }
                                >
                                  {serviceLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    "Save Changes"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={headers.length}
                        className={`px-4 py-8 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        No students found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          <div className={`p-4 `}>
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              dataLength={dataLength}
              
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentServiceFeesPaymentPage;