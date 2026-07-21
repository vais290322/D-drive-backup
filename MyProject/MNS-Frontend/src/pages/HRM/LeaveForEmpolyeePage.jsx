import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import mns from "../../assets/mns.jpg";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BiLoaderCircle } from "react-icons/bi";
import { FiCalendar, FiMail, FiUser, FiFileText, FiCheckCircle, FiClock } from "react-icons/fi";
import { backendDomainN } from "../../common/index";

const LeaveForEmployeePage = () => {
  const [formData, setFormData] = useState({
    employeeCode: "",
    employeeName: "",
    email: "",
    leaveDescription: "",
    leaveStartDate: "",
    leaveEndDate: "",
  });
  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState("form"); // Possible values: "form", "otp", "message"
  const [isLoading, setIsLoading] = useState(false); // Loading state for the form submission
  const token = useParams();
  const [countdown, setCountdown] = useState(120);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // for otp countdown
  useEffect(() => {
    if (currentStep === "otp" && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, countdown]);

  const fetchEmployeeDetails = async (email) => {
    try {
      const response = await axios.get(
        `${backendDomainN}/api/employees/search?email=${encodeURIComponent(
          email
        )}`
      );
      const { employeeCode, employeeName } = response?.data[0];
      setFormData((prev) => ({
        ...prev,
        employeeCode,
        employeeName,
      }));
    } catch (error) {
      toast.error("Failed to fetch employee details.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email" && value.trim()) {
      fetchEmployeeDetails(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.employeeCode ||
      !formData.employeeName ||
      !formData.email ||
      !formData.leaveDescription ||
      !formData.leaveStartDate
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${backendDomainN}/api/leaves/apply?token=${token.token}`,
        {
          ...formData,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response) {
        throw new Error("Failed to submit leave request.");
      }

      toast.success("Check your email for OTP.");
      setFormData({
        employeeCode: "",
        employeeName: "",
        email: "",
        leaveDescription: "",
        leaveStartDate: "",
        leaveEndDate: "",
      });

      setCurrentStep("otp");
    } catch (error) {
      toast.error(error?.response?.data || "Failed to submit leave request.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      // You would need to implement the actual resend OTP API call here
      // For now, we'll just reset the countdown
      setCountdown(120);
      toast.success("OTP has been resent to your email");
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendDomainN}/api/leaves/verifyOtp`,
        { otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response) {
        throw new Error("Failed to verify OTP.");
      }

      toast.success("OTP verified successfully.");
      setOtp("");
      setCurrentStep("message");
    } catch (error) {
      toast.error(error?.response?.data || "Failed to verify OTP.");
    }
  };

  // Calculate the number of leave days
  const calculateLeaveDays = () => {
    if (!formData.leaveStartDate || !formData.leaveEndDate) return null;
    
    const start = new Date(formData.leaveStartDate);
    const end = new Date(formData.leaveEndDate);
    
    // Return null if dates are invalid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    
    // Calculate the difference in days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    
    return diffDays;
  };

  const leaveDays = calculateLeaveDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img src={mns} alt="MNS Logo" className="h-14 mr-4 rounded-lg shadow-md" />
            <div>
              <h1 className="text-3xl font-bold">Employee Leave Portal</h1>
              <p className="text-blue-100">Manage your leave requests efficiently</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg shadow-inner">
            <p className="text-sm font-medium">Need assistance?</p>
            <p className="text-xs">Contact HR: hr@mns.com</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex flex-col items-center ${currentStep === "form" ? "text-blue-600" : "text-gray-500"}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${
                  currentStep === "form" 
                    ? "bg-blue-100 border-2 border-blue-500" 
                    : currentStep === "otp" || currentStep === "message" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gray-200"
                }`}>
                  <FiFileText className={`w-5 h-5 ${currentStep === "form" ? "text-blue-600" : currentStep === "otp" || currentStep === "message" ? "text-green-600" : "text-gray-500"}`} />
                </div>
                <span className="text-sm font-medium">Form</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${currentStep === "form" ? "bg-gray-300" : "bg-green-500"}`}></div>
              
              <div className={`flex flex-col items-center ${currentStep === "otp" ? "text-blue-600" : currentStep === "form" ? "text-gray-500" : "text-green-600"}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${
                  currentStep === "otp" 
                    ? "bg-blue-100 border-2 border-blue-500" 
                    : currentStep === "message" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gray-200"
                }`}>
                  <FiMail className={`w-5 h-5 ${currentStep === "otp" ? "text-blue-600" : currentStep === "message" ? "text-green-600" : "text-gray-500"}`} />
                </div>
                <span className="text-sm font-medium">Verification</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${currentStep === "message" ? "bg-green-500" : "bg-gray-300"}`}></div>
              
              <div className={`flex flex-col items-center ${currentStep === "message" ? "text-green-600" : "text-gray-500"}`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${
                  currentStep === "message" 
                    ? "bg-green-100 border-2 border-green-500" 
                    : "bg-gray-200"
                }`}>
                  <FiCheckCircle className={`w-5 h-5 ${currentStep === "message" ? "text-green-600" : "text-gray-500"}`} />
                </div>
                <span className="text-sm font-medium">Completed</span>
              </div>
            </div>
          </div>

          {currentStep === "message" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-white text-center">
                <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FiCheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Success!</h2>
                <p className="text-green-100 mt-2">Your leave request has been submitted</p>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Leave Request has been sent to HR
                </h3>
                <p className="text-gray-600 mb-6">
                  You will receive an email notification once your request has been processed.
                </p>
                <div className="inline-block bg-gray-100 rounded-lg px-6 py-4 text-left">
                  <p className="text-sm text-gray-500">Reference Number</p>
                  <p className="text-lg font-medium text-gray-800">{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === "form" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
                <h2 className="text-2xl font-bold text-center">Leave Request Form</h2>
                <p className="text-center text-blue-100 mt-2">
                  Fill in the details below to submit your leave request
                </p>
              </div>
              
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Code
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="employeeCode"
                          placeholder="Employee Code"
                          value={formData.employeeCode}
                          readOnly
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="employeeName"
                          placeholder="Employee Name"
                          value={formData.employeeName}
                          readOnly
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave Description <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <FiFileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        name="leaveDescription"
                        placeholder="Describe the reason for your leave request"
                        value={formData.leaveDescription}
                        onChange={handleChange}
                        rows="4"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Leave Start Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="leaveStartDate"
                          value={formData.leaveStartDate}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Leave End Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="leaveEndDate"
                          value={formData.leaveEndDate}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {leaveDays && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <FiClock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Total Leave Duration: <span className="font-bold">{leaveDays} day{leaveDays !== 1 ? 's' : ''}</span>
                        </p>
                        <p className="text-xs text-blue-600">
                          From {new Date(formData.leaveStartDate).toLocaleDateString()} to {formData.leaveEndDate ? new Date(formData.leaveEndDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 cursor-pointer px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
                      isLoading 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-gradient-to-r cursor-pointer from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <BiLoaderCircle className="animate-spin mr-2" size={20} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      "Submit Leave Request"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {currentStep === "otp" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FiMail className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Verify Your Email</h2>
                <p className="text-indigo-100 mt-2">
                  We've sent a verification code to your email
                </p>
              </div>
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    Please enter the 6-digit verification code sent to your email address
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    className="w-full p-4 text-center text-2xl tracking-widest border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    maxLength="6"
                  />
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-indigo-600">
                    <FiClock className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">
                      {countdown > 0 ? (
                        <>
                          Code expires in: {Math.floor(countdown / 60)}:
                          {countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60}
                        </>
                      ) : (
                        "Code expired"
                      )}
                    </span>
                  </div>
                  
                  {countdown <= 0 && (
                    <button
                      onClick={handleResendOtp}
                      disabled={isResendingOtp}
                      className={`text-sm  cursor-pointer font-medium flex items-center ${
                        isResendingOtp 
                          ? "text-gray-400 cursor-not-allowed" 
                          : "text-indigo-600 hover:text-indigo-800"
                      }`}
                    >
                      {isResendingOtp ? (
                        <>
                          <BiLoaderCircle className="animate-spin mr-1" size={16} />
                          Resending...
                        </>
                      ) : (
                        "Resend Code"
                      )}
                    </button>
                  )}
                </div>
                
                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-3 px-4 cursor-pointer rounded-lg text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Verify & Continue
                </button>
                
                <p className="text-center text-sm text-gray-500 mt-6">
                  Didn't receive the code? Check your spam folder or contact HR support.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MNS Corporation. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            For any issues with the leave application system, please contact IT support.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LeaveForEmployeePage;