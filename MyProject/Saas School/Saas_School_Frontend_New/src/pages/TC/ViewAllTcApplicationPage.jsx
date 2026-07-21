import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Removed Badge import
import { format } from "date-fns";
import {
  FaSearch,
  FaFilter,
  FaFileDownload,
  FaEye,
  FaCheck,
  FaTimes,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import TcApplicationTour from "@/components/Tour/TcApplicationTour";
import TourButton from "@/components/Tour/TourButton";
import { viewAllTcPageSteps } from "@/components/Tour/Steps/TcSteps/Steps";
import mainUrlApi from "@/common/main";

const ViewAllTcApplicationPage = () => {
  const { theme } = useTheme();
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "requestDate",
    direction: "desc",
  });

  // Add state for the approval form
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalFormData, setApprovalFormData] = useState({
    lastAttendanceDate: "",
    conductAndBehavior: "Good",
    remarks: "",
    feesCleared: true,
  });
  const [applicationToApprove, setApplicationToApprove] = useState(null);

  // Add state for the rejection form
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionFormData, setRejectionFormData] = useState({
    adminRemarks: "",
  });
  const [applicationToReject, setApplicationToReject] = useState(null);

  // console.log("application : ",applicationToApprove);

  // Add state for the detail popup
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Add state for TC number download
  const [tcNumber, setTcNumber] = useState("");
  const [isTcDownloading, setIsTcDownloading] = useState(false);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedApplications, setPaginatedApplications] = useState([]);

  // Fetch TC applications
  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${mainUrlApi?.tcDetails?.url}/requests/${schoolId}`
      );
      // console.log("all application : ", response);
      if (response.data && response.data.data) {
        setApplications(response.data.data);
        setFilteredApplications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching TC applications:", error);
      toast.error("Failed to load TC applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [schoolId]);

  // Filter and sort applications
  useEffect(() => {
    let result = [...applications];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (app) =>
          app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.admissionNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          app.className.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((app) => app.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredApplications(result);
  }, [applications, searchTerm, statusFilter, sortConfig]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const handleApprovalFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setApprovalFormData({
      ...approvalFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openApprovalModal = (application) => {
    setApplicationToApprove(application);
    setApprovalFormData({
      lastAttendanceDate: new Date().toISOString().split("T")[0],
      conductAndBehavior: "Good",
      remarks: "",
      feesCleared: true,
    });
    setShowApprovalModal(true);
  };

  // Submit approval form
  const submitApprovalForm = async (e) => {
    e.preventDefault();

    if (!approvalFormData.lastAttendanceDate) {
      toast.error("Please enter the last attendance date");
      return;
    }

    if (!approvalFormData.remarks) {
      toast.error("Please enter remarks");
      return;
    }

    try {
      setIsLoading(true);
      const encodedRemarks = encodeURIComponent(approvalFormData.remarks);
      const response = await axios.post(
        `${mainUrlApi?.tcRequest?.url}/approve/${applicationToApprove.id}?adminRemarks=${encodedRemarks}`,
        {
          lastAttendanceDate: approvalFormData.lastAttendanceDate,
          conductAndBehavior: approvalFormData.conductAndBehavior,
          remarks: approvalFormData.remarks,
          feesCleared: approvalFormData.feesCleared,
        }
      );

      if (response.status === 200) {
        toast.success("Application approved successfully");
        setShowApprovalModal(false);
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error(
        error.response?.data?.message || "Failed to approve application"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // View application details
  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  // Approve application
  const approveApplication = (application) => {
    openApprovalModal(application);
  };

  // Handle rejection form input changes
  const handleRejectionFormChange = (e) => {
    const { name, value } = e.target;
    setRejectionFormData({
      ...rejectionFormData,
      [name]: value,
    });
  };

  // Open rejection modal
  const openRejectionModal = (application) => {
    setApplicationToReject(application);
    setRejectionFormData({
      adminRemarks: "",
    });
    setShowRejectionModal(true);
  };

  // Submit rejection form
  const submitRejectionForm = async (e) => {
    e.preventDefault();

    if (!rejectionFormData.adminRemarks) {
      toast.error("Please enter rejection remarks");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${mainUrlApi?.tcRequest?.url}/reject/${applicationToReject.id}`,
        {
          adminRemarks: rejectionFormData.adminRemarks,
        }
      );

      if (response.status === 200) {
        toast.success("Application rejected successfully");
        setShowRejectionModal(false);
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error(
        error.response?.data?.message || "Failed to reject application"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reject application
  const rejectApplication = (application) => {
    openRejectionModal(application);
  };

  // Add download TC function
  const downloadTC = async (tcId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${mainUrlApi?.tcRequest?.url}/download/${tcId}/${schoolId}`,
        { responseType: "blob" }
      );

      // Create a blob URL for the file
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `TC_${tcId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success("Transfer Certificate downloaded successfully");
    } catch (error) {
      // console.error("Error downloading TC:", error);
      toast.error("Failed to download Transfer Certificate");
    } finally {
      setIsLoading(false);
    }
  };

  // Get status badge - replaced with custom implementationDownload TC
  const getStatusBadge = (status) => {
    let bgColor = "";
    let textColor = "text-white";

    switch (status) {
      case "approved":
        bgColor = "bg-green-500";
        break;
      case "rejected":
        bgColor = "bg-red-500";
        break;
      case "pending":
        bgColor = "bg-yellow-500";
        break;
      default:
        bgColor = "bg-gray-500";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Add download TC by number function
  const downloadTcByNumber = async () => {
    if (!tcNumber.trim()) {
      toast.error("Please enter a TC number");
      return;
    }

    try {
      setIsTcDownloading(true);
      const response = await axios.get(
        `${mainUrlApi?.tcRequest?.url}/download?tcNumber=${encodeURIComponent(
          tcNumber
        )}`,
        { responseType: "blob" }
      );

      // Create a blob URL for the file
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `TC_${tcNumber.replace(/[\/\\:*?"<>|]/g, "_")}.pdf`
      );
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success("Transfer Certificate downloaded successfully");
      setTcNumber(""); // Clear the input after successful download
    } catch (error) {
      console.error("Error downloading TC by number:", error);
      toast.error(
        "Failed to download Transfer Certificate. Please verify the TC number."
      );
    } finally {
      setIsTcDownloading(false);
    }
  };

  // ... existing useEffects ...

  // Update pagination when filtered applications change
  useEffect(() => {
    if (filteredApplications.length > 0) {
      setTotalPages(Math.ceil(filteredApplications.length / rowsPerPage));

      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = Math.min(
        startIndex + rowsPerPage,
        filteredApplications.length
      );
      setPaginatedApplications(
        filteredApplications.slice(startIndex, endIndex)
      );
    } else {
      setPaginatedApplications([]);
      setTotalPages(1);
    }
  }, [filteredApplications, currentPage, rowsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div
      className={`min-h-screen py-4 sm:py-8 px-2 sm:px-4 ${
        theme === "light"
          ? "bg-gray-900 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Transfer Certificate Applications
        </h1>

        <Card
          className={`shadow-lg mb-6 ${
            theme === "light" ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Download TC by Number</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter TC Number (e.g. TC/206b/2023/001)"
                  value={tcNumber}
                  onChange={(e) => setTcNumber(e.target.value)}
                  className={`${
                    theme === "light" ? "bg-gray-700 border-gray-600" : ""
                  }`}
                />
              </div>
              <Button
                onClick={downloadTcByNumber}
                disabled={isTcDownloading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isTcDownloading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Downloading...
                  </div>
                ) : (
                  <>
                    <FaFileDownload className="mr-2" /> Download TC
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`shadow-lg mb-20 ${
            theme === "light" ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-xl">All Applications</CardTitle>
            <div>
              <TourButton
                steps={viewAllTcPageSteps}
                tourName={"viewAllTcPageTour"}
              />
            </div>
          </CardHeader>

          <CardContent>
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 searchInput">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name, admission number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10  ${
                    theme === "light" ? "bg-gray-700 border-gray-600" : ""
                  }`}
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger
                    className={`w-[180px] SelectTrigger ${
                      theme === "light" ? "bg-gray-700 border-gray-600" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaFilter className="text-gray-400" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setSortConfig({ key: "requestDate", direction: "desc" });
                  }}
                  className={`restBtn ${
                    theme === "light"
                      ? "border-gray-600 bg-gray-700 hover:bg-gray-700"
                      : ""
                  }`}
                >
                  <MdRefresh className="mr-1" /> Reset
                </Button>
              </div>
            </div>

            {/* Applications Table */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg">No applications found</p>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader
                    className={
                      theme === "light" ? "bg-gray-700" : "bg-gray-100"
                    }
                  >
                    <TableRow>
                      <TableHead className="w-[80px]">S.No</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => requestSort("admissionNumber")}
                      >
                        Admission No.
                        {sortConfig.key === "admissionNumber" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => requestSort("studentName")}
                      >
                        Student Name
                        {sortConfig.key === "studentName" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => requestSort("requestDate")}
                      >
                        Request Date
                        {sortConfig.key === "requestDate" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => requestSort("status")}
                      >
                        Status
                        {sortConfig.key === "status" && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications?.map((application, index) => (
                      <TableRow
                        key={application.id}
                        className={
                          theme === "light"
                            ? "border-gray-700"
                            : "border-gray-200"
                        }
                      >
                        <TableCell>
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{application.admissionNumber}</TableCell>
                        <TableCell className="font-medium">
                          {application.studentName}
                        </TableCell>
                        <TableCell>{application.className}</TableCell>
                        <TableCell>{application.section}</TableCell>
                        <TableCell>
                          {formatDate(application.requestDate)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(application.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 DropdownMenuTrigger "
                              >
                                <span className="sr-only">Open menu</span>
                                <svg
                                  className="h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  viewApplicationDetails(application)
                                }
                              >
                                <FaEye className="mr-2 cursor-pointer" /> View
                                Details
                              </DropdownMenuItem>
                              {application.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      approveApplication(application)
                                    }
                                  >
                                    <FaCheck className="mr-2 text-green-500 cursor-pointer" />{" "}
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      rejectApplication(application)
                                    }
                                  >
                                    <FaTimes className="mr-2 text-red-500 cursor-pointer" />{" "}
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {application.status === "approved" &&
                                application.tcId && (
                                  <DropdownMenuItem
                                    onClick={() => downloadTC(application.tcId)}
                                  >
                                    <FaFileDownload className="mr-2 text-blue-500 cursor-pointer" />{" "}
                                    Download TC
                                  </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {filteredApplications.length > 0 && (
              <div className="pagination-component">
                <PaginationComponent
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  totalPages={totalPages}
                  onRowsPerPageChange={(value) => {
                    setRowsPerPage(value);
                    setCurrentPage(1); // Reset to first page when changing rows per page
                  }}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
              theme === "light"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex justify-between items-center p-4 border-b border-gray-200 bg-inherit rounded-t-lg">
              <h3 className="text-xl font-semibold">
                Transfer Certificate Application Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium border-b pb-2 mb-3">
                    Student Information
                  </h4>

                  <div>
                    <p className="text-sm text-gray-500">Admission Number</p>
                    <p className="font-medium">
                      {selectedApplication.admissionNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="font-medium">
                      {selectedApplication.studentName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="font-medium">
                      {selectedApplication.className}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Section</p>
                    <p className="font-medium">{selectedApplication.section}</p>
                  </div>

                  {selectedApplication.status === "approved" &&
                    selectedApplication.tcId && (
                      <div>
                        <p className="text-sm text-gray-500">TC ID</p>
                        <p className="font-medium">
                          {selectedApplication.tcId}
                        </p>
                      </div>
                    )}
                </div>

                {/* Application Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium border-b pb-2 mb-3">
                    Application Information
                  </h4>

                  <div>
                    <p className="text-sm text-gray-500">Request Date</p>
                    <p className="font-medium">
                      {formatDate(selectedApplication.requestDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      {getStatusBadge(selectedApplication.status)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Reason for Leaving</p>
                    <p className="font-medium">
                      {selectedApplication.reasonForLeaving}
                    </p>
                  </div>

                  {selectedApplication.approvalDate && (
                    <div>
                      <p className="text-sm text-gray-500">Approval Date</p>
                      <p className="font-medium">
                        {formatDate(selectedApplication.approvalDate)}
                      </p>
                    </div>
                  )}

                  {selectedApplication.adminRemarks && (
                    <div>
                      <p className="text-sm text-gray-500">Admin Remarks</p>
                      <p className="font-medium">
                        {selectedApplication.adminRemarks}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents Section */}
              <div className="mt-6">
                <h4 className="text-lg font-medium border-b pb-2 mb-3">
                  Submitted Documents
                </h4>

                {selectedApplication.requiredDocumentPaths &&
                selectedApplication.requiredDocumentPaths.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedApplication.requiredDocumentPaths.map(
                      (doc, index) => {
                        const fileName = doc.split("\\").pop();
                        return (
                          <li key={index} className="flex items-center">
                            <FaFileDownload className="mr-2 text-blue-500" />
                            <span>{fileName}</span>
                          </li>
                        );
                      }
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500">No documents submitted</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3 justify-end">
                {selectedApplication.status === "pending" && (
                  <>
                    <Button
                      onClick={() => {
                        approveApplication(selectedApplication);
                        setShowDetailModal(false);
                      }}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <FaCheck className="mr-2" /> Approve Application
                    </Button>
                    <Button
                      onClick={() => {
                        rejectApplication(selectedApplication);
                        setShowDetailModal(false);
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <FaTimes className="mr-2" /> Reject Application
                    </Button>
                  </>
                )}

                {selectedApplication.status === "approved" &&
                  selectedApplication.tcId && (
                    <Button
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => downloadTC(selectedApplication.tcId)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Downloading...
                        </div>
                      ) : (
                        <>
                          <FaFileDownload className="mr-2 cursor-pointer" />{" "}
                          Download TC
                        </>
                      )}
                    </Button>
                  )}

                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                  className={
                    theme === "light" ? "border-gray-600 hover:bg-gray-700 bg-gray-500" : ""
                  }
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApprovalModal && applicationToApprove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`relative w-full max-w-2xl rounded-lg shadow-xl ${
              theme === "light"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex justify-between items-center p-4 border-b border-gray-200 bg-inherit rounded-t-lg">
              <h3 className="text-xl font-semibold">
                Approve Transfer Certificate
              </h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-medium">
                  {applicationToApprove.studentName} (
                  {applicationToApprove.admissionNumber})
                </p>
              </div>

              <form onSubmit={submitApprovalForm}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Attendance Date
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="lastAttendanceDate"
                        value={approvalFormData.lastAttendanceDate}
                        onChange={handleApprovalFormChange}
                        className={`w-full pl-10 py-2 border rounded-md ${
                          theme === "light"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Conduct and Behavior
                    </label>
                    <select
                      name="conductAndBehavior"
                      value={approvalFormData.conductAndBehavior}
                      onChange={handleApprovalFormChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        theme === "light"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Satisfactory">Satisfactory</option>
                      <option value="Needs Improvement">
                        Needs Improvement
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Remarks
                    </label>
                    <textarea
                      name="remarks"
                      value={approvalFormData.remarks}
                      onChange={handleApprovalFormChange}
                      placeholder="Enter remarks about the student"
                      className={`w-full px-3 py-2 border rounded-md ${
                        theme === "light"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="feesCleared"
                      name="feesCleared"
                      checked={approvalFormData.feesCleared}
                      onChange={handleApprovalFormChange}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="feesCleared" className="ml-2 block text-sm">
                      All fees have been cleared
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowApprovalModal(false)}
                    className={
                      theme === "light"
                        ? "border-gray-600 bg-gray-700 hover:bg-gray-700"
                        : ""
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <FaCheck className="mr-2" /> Approve
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && applicationToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`relative w-full max-w-2xl rounded-lg shadow-xl ${
              theme === "light"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex justify-between items-center p-4 border-b border-gray-200 bg-inherit rounded-t-lg">
              <h3 className="text-xl font-semibold">
                Reject Transfer Certificate Application
              </h3>
              <button
                onClick={() => setShowRejectionModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaTimesCircle size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-medium">
                  {applicationToReject.studentName} (
                  {applicationToReject.admissionNumber})
                </p>
              </div>

              <form onSubmit={submitRejectionForm}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rejection Remarks
                    </label>
                    <textarea
                      name="adminRemarks"
                      value={rejectionFormData.adminRemarks}
                      onChange={handleRejectionFormChange}
                      placeholder="Enter reason for rejection (e.g., Fees not cleared, Incomplete documents)"
                      className={`w-full px-3 py-2 border rounded-md ${
                        theme === "light"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRejectionModal(false)}
                    className={
                      theme === "light"
                        ? "border-gray-600 bg-gray-700 hover:bg-gray-700"
                        : ""
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <FaTimes className="mr-2" /> Reject
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllTcApplicationPage;
