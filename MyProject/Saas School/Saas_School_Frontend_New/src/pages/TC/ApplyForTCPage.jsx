import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from "@/context/ThemeContext";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaGraduationCap, FaFileAlt, FaUpload, FaRegSave, FaSearch, FaFileDownload, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import mainUrlApi from '@/common/main';

const ApplyForTCPage = () => {
  const { theme } = useTheme();
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  // const schoolId = "dkljfaj9845u7894375";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    admissionNumber: '',
    reasonForLeaving: '',
    requiredDocs: []
  });

  // New states for TC status and details
  const [statusCheckAdmissionNumber, setStatusCheckAdmissionNumber] = useState('');
  const [tcNumberForDownload, setTcNumberForDownload] = useState('');
  const [requestStatus, setRequestStatus] = useState(null);
  const [tcDetails, setTcDetails] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('apply'); // 'apply', 'status', 'download'

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

   // Add drag and drop handlers
   const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFormData(prev => ({
        ...prev,
        requiredDocs: [...prev.requiredDocs, ...droppedFiles]
      }));
      e.dataTransfer.clearData();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      requiredDocs: [...prev.requiredDocs, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredDocs: prev.requiredDocs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.admissionNumber  || !formData.reasonForLeaving) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('admissionNumber', formData.admissionNumber);
      submitData.append('schoolId', schoolId);
    
      submitData.append('reasonForLeaving', formData.reasonForLeaving);
      
      // Append each file
      formData.requiredDocs.forEach(file => {
        submitData.append('requiredDocs', file);
      });

      // Replace with your actual API endpoint
      const response = await axios.post(
        `${mainUrlApi.tcRequest.url}/${formData.admissionNumber}/${schoolId}?reasonForLeaving=${formData?.reasonForLeaving}`, 
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Transfer Certificate request submitted successfully");
        // Reset form
        setFormData({
          admissionNumber: '',
          reasonForLeaving: '',
          requiredDocs: []
        });
      }
    } catch (error) {
      console.error("Error submitting TC request:", error);
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  // New function to check TC request status - modified to handle multiple applications
  const checkRequestStatus = async () => {
    if (!statusCheckAdmissionNumber) {
      toast.error("Please enter your admission number");
      return;
    }

    setIsCheckingStatus(true);
    setRequestStatus(null);
    
    try {
      const response = await axios.get(
        `${mainUrlApi?.tcStatus.url}/${statusCheckAdmissionNumber}/${schoolId}`
      );
      
      if (response.status === 200 && response.data.data) {
        // Handle both array and single object responses
        const statusData = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];
        
        setRequestStatus(statusData);
        
        // If any application is approved and has TC ID, fetch TC details
        const approvedApplication = statusData.find(app => 
          app.status === 'approved' && app.tcId
        );
        
        if (approvedApplication) {
          fetchTcDetails(statusCheckAdmissionNumber);
        }
      }
    } catch (error) {
      console.error("Error checking TC request status:", error);
      toast.error(error.response?.data?.message || "Failed to retrieve request status");
    } finally {
      setIsCheckingStatus(false);
    }
  };


  // New function to fetch TC details
  const fetchTcDetails = async (admissionNumber) => {
    try {
      const response = await axios.get(
        `${mainUrlApi?.tcDetails?.url}/${admissionNumber}/${schoolId}`
      );
      
      if (response.status === 200 && response.data.data) {
        setTcDetails(response.data.data);
        setTcNumberForDownload(response.data.data.tcNumber);
      }
    } catch (error) {
      console.error("Error fetching TC details:", error);
      // Not showing toast here as this is a secondary request
    }
  };

  // New function to download TC by number
  const downloadTcByNumber = async () => {
    if (!tcNumberForDownload) {
      toast.error("Please enter a TC number");
      return;
    }
    
    setIsDownloading(true);
    
    try {
      const response = await axios.get(
        `${mainUrlApi?.tcDetails?.url}/download?tcNumber=${encodeURIComponent(tcNumberForDownload)}`,
        { responseType: 'blob' }
      );
      
      // Create a blob URL for the file
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TC_${tcNumberForDownload.replace(/[\/\\:*?"<>|]/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success("Transfer Certificate downloaded successfully");
    } catch (error) {
      console.error("Error downloading TC:", error);
      toast.error("Failed to download Transfer Certificate. Please verify the TC number.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    let bgColor = '';
    let textColor = 'text-white';
    let icon = null;
    
    switch (status) {
      case 'approved':
        bgColor = 'bg-green-500';
        icon = <FaCheckCircle className="mr-1" />;
        break;
      case 'rejected':
        bgColor = 'bg-red-500';
        icon = <FaTimesCircle className="mr-1" />;
        break;
      case 'pending':
        bgColor = 'bg-yellow-500';
        icon = <FaInfoCircle className="mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-500';
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${bgColor} ${textColor}`}>
        {icon}
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className={`min-h-screen py-4 sm:py-8 px-2 sm:px-4 ${theme === "light" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2 sm:gap-3">
            <FaGraduationCap className="text-purple-500" size={24} />
            <span>Transfer Certificate Portal</span>
          </h1>
          <p className={`mt-1 sm:mt-2 text-sm sm:text-base ${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
            Apply for a new TC, check your application status, or download your TC
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm sm:text-base ${
              activeTab === 'apply' 
                ? 'border-b-2 border-purple-500 text-purple-500' 
                : `${theme === "light" ? 'text-gray-300' : 'text-gray-600'}`
            }`}
            onClick={() => setActiveTab('apply')}
          >
            Apply for TC
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm sm:text-base ${
              activeTab === 'status' 
                ? 'border-b-2 border-purple-500 text-purple-500' 
                : `${theme === "light" ? 'text-gray-300' : 'text-gray-600'}`
            }`}
            onClick={() => setActiveTab('status')}
          >
            Check Status
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm sm:text-base ${
              activeTab === 'download' 
                ? 'border-b-2 border-purple-500 text-purple-500' 
                : `${theme === "light" ? 'text-gray-300' : 'text-gray-600'}`
            }`}
            onClick={() => setActiveTab('download')}
          >
            Download TC
          </button>
        </div>

        {/* Apply for TC Tab */}
        {activeTab === 'apply' && (
          <Card className={`shadow-xl mb-20 border-t-4 ${theme === "light" ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-purple-500"}`}>
            <CardHeader className="space-y-1 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <MdSchool className="text-purple-500" />
                Student Information
              </CardTitle>
              <CardDescription className={`text-sm ${theme === "light" ? "text-gray-300" : "text-gray-500"}`}>
                Please provide accurate student details for the TC request
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Admission Number */}
                  <div className="space-y-2">
                    <Label htmlFor="admissionNumber" className="font-medium">
                      Admission Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="admissionNumber"
                      name="admissionNumber"
                      placeholder="Enter admission number"
                      value={formData.admissionNumber}
                      onChange={handleInputChange}
                      required
                      className={`${theme === "light" ? "bg-gray-700 border-gray-600" : ""}`}
                    />
                  </div>
                </div>

                {/* Reason for Leaving */}
                <div className="space-y-2">
                  <Label htmlFor="reasonForLeaving" className="font-medium">
                    Reason for Leaving <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="reasonForLeaving"
                    name="reasonForLeaving"
                    placeholder="Please provide detailed reason for requesting Transfer Certificate"
                    value={formData.reasonForLeaving}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                      theme === "light" 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                {/* Document Upload */}
                <div className="space-y-4">
                  <Label className="font-medium flex items-center gap-2">
                    <FaFileAlt className="text-purple-500" />
                    Supporting Document
                  </Label>
                  
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all duration-200 hover:bg-opacity-70 cursor-pointer ${
                      isDragging ? "border-purple-500 bg-purple-100 bg-opacity-20" : ""
                    } ${
                      theme === "light" 
                        ? "border-gray-600 bg-gray-700/50 hover:border-purple-500" 
                        : "border-gray-300 bg-gray-50 hover:border-purple-500"
                    }`}
                    onClick={() => fileInputRef.current.click()}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <FaUpload className={`mx-auto mb-2 ${isDragging ? "text-purple-400" : "text-purple-500"}`} size={24} />
                    <p className="mb-1 sm:mb-2 text-sm sm:text-base">
                      {isDragging ? "Drop files here" : "Drag and drop files here or click to browse"}
                    </p>
                    <p className={`text-xs sm:text-sm ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
                      Upload any supporting documents (Max 5MB each)
                    </p>
                    <Input
                      type="file"
                      id="requiredDocs"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={`  mt-3 sm:mt-4 text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 ${theme === "light" ? "bg-gray-700 text-gray-900 border-gray-800" : "" }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current.click();
                      }}
                    >
                      Browse Files
                    </Button>
                  </div>

                  {/* File List - remains the same */}
                  {formData.requiredDocs.length > 0 && (
                    <div className={`mt-4 p-4 rounded-md ${theme === "light" ? "bg-gray-700" : "bg-gray-100"}`}>
                      <h3 className="font-medium mb-2">Uploaded Files:</h3>
                      <ul className="space-y-2">
                        {formData.requiredDocs.map((file, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="truncate max-w-xs">{file.name}</span>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    admissionNumber: '',
                    reasonForLeaving: '',
                    requiredDocs: []
                  });
                }}
                className={`w-full sm:w-auto ${theme === "light" ? "bg-gray-700 text-gray-900 border-gray-800" : "" }`}
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaRegSave />
                    Submit Request
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

                     {/* Check Status Tab */}
                     {activeTab === 'status' && (
                  <Card className={`shadow-xl mb-20 border-t-4 ${theme === "light" ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-purple-500"}`}>
                    <CardHeader className="space-y-1 p-4 sm:p-6">
                      <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                        <FaInfoCircle className="text-purple-500" />
                        Check Application Status
                      </CardTitle>
                      <CardDescription className={`text-sm ${theme === "light" ? "text-gray-300" : "text-gray-500"}`}>
                        Enter your admission number to check the status of your TC application
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative flex-1">
                            <Input
                              placeholder="Enter your admission number"
                              value={statusCheckAdmissionNumber}
                              onChange={(e) => setStatusCheckAdmissionNumber(e.target.value)}
                              className={`${theme === "light" ? "bg-gray-700 border-gray-600" : ""}`}
                            />
                          </div>
                          <Button
                            onClick={checkRequestStatus}
                            disabled={isCheckingStatus}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {isCheckingStatus ? (
                              <span className="flex items-center justify-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Checking...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <FaSearch />
                                Check Status
                              </span>
                            )}
                          </Button>
                        </div>

                        {requestStatus && requestStatus.length > 0 && (
                          <div className="mt-6 space-y-6">
                            <h3 className="text-lg font-semibold mb-4">Your TC Applications</h3>
                            
                            {requestStatus.map((application, index) => (
                              <div 
                                key={application.id} 
                                className={`p-6 rounded-lg ${
                                  theme === "light" ? "bg-gray-700" : "bg-gray-50"
                                } ${index !== requestStatus.length - 1 ? "mb-6" : ""}`}
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <p className={`text-sm ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
                                      Application {index + 1} • {formatDate(application.requestDate)}
                                    </p>
                                    <h4 className="text-lg font-medium mt-1">{application.studentName}</h4>
                                  </div>
                                  <div>{getStatusBadge(application.status)}</div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <p className={`text-sm ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>Admission Number</p>
                                      <p className="font-medium">{application.admissionNumber}</p>
                                    </div>
                                    <div>
                                      <p className={`text-sm ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>Class & Section</p>
                                      <p className="font-medium">{application.className} {application.section}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <p className={`text-sm ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>Reason for Leaving</p>
                                      <p className="font-medium">{application.reasonForLeaving || "Not specified"}</p>
                                    </div>
                                    {application.status !== 'pending' && (
                                      <div>
                                        <p className={`text-sm ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>Admin Remarks</p>
                                        <p className="font-medium">{application.adminRemarks || "No remarks"}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {application.status === 'approved' && application.tcId && (
                                  <div className="mt-6 pt-4 border-t border-gray-200">
                                    <p className="mb-4 font-medium">Your TC has been approved and is ready for download.</p>
                                    <Button 
                                      onClick={() => downloadTcByNumber()}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <FaFileDownload className="mr-2" /> Download TC
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {requestStatus && requestStatus.length === 0 && (
                          <div className={`mt-6 p-6 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"} text-center`}>
                            <FaInfoCircle className="mx-auto text-yellow-500 mb-2" size={24} />
                            <p className="text-lg font-medium">No applications found</p>
                            <p className={`mt-2 ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
                              You haven't submitted any TC applications yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

        {/* Download TC Tab */}
        {activeTab === 'download' && (
          <Card className={`shadow-xl border-t-4 ${theme === "light" ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-purple-500"}`}>
            <CardHeader className="space-y-1 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <FaFileDownload className="text-purple-500" />
                Download Transfer Certificate
              </CardTitle>
              <CardDescription className={`text-sm ${theme === "light" ? "text-gray-300" : "text-gray-500"}`}>
                Enter your TC number to download your Transfer Certificate
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Enter TC Number (e.g. TC/206b/2023/001)"
                      value={tcNumberForDownload}
                      onChange={(e) => setTcNumberForDownload(e.target.value)}
                      className={`${theme === "light" ? "bg-gray-700 border-gray-600" : ""}`}
                    />
                  </div>
                  <Button
                    onClick={downloadTcByNumber}
                    disabled={isDownloading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isDownloading ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin" />
                        Downloading...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FaFileDownload />
                        Download
                      </span>
                    )}
                  </Button>
                </div>
                
                <div className={`mt-4 p-4 rounded-md ${theme === "light" ? "bg-gray-700/50" : "bg-blue-50"}`}>
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm">
                        If you don't know your TC number, you can check your application status using your admission number in the "Check Status" tab.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplyForTCPage;
