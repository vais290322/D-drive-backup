import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { Loader2 } from "lucide-react";

// Import the logo
import mnsLogo from "../assets/mns.jpg";
import toast from "react-hot-toast";
import { backendDomainA } from "../common/index";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  const navigate = useNavigate();
  const { token } = useParams();
  // console.log("token : ",token);
  
  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
    
    // Check password criteria when newPassword changes
    if (e.target.name === 'newPassword') {
      const password = e.target.value;
      setPasswordCriteria({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    
    // Check if all password criteria are met
    const allCriteriaMet = Object.values(passwordCriteria).every(criterion => criterion === true);
    if (!allCriteriaMet) {
      return toast.error("Password does not meet all requirements");
    }
    
    try {
      setLoading(true);
      // reset-password/:token
      const response = await axios.post(`${backendDomainA}/api/v1/auth/reset-password/${token}`, {
        password: passwords.newPassword,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        toast.success(response?.data?.message || "Password reset successful");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-center">
            <div className="flex justify-center mb-4">
              <img 
                src={mnsLogo} 
                alt="MNS Logo" 
                className="h-20 w-auto rounded-full border-2 border-white shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-purple-100">Create your new password</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium mb-2">Password must contain:</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  {passwordCriteria.length ? 
                    <FaCheck className="text-green-500 mr-2" /> : 
                    <FaTimes className="text-red-500 mr-2" />}
                  <span className={passwordCriteria.length ? "text-green-500" : "text-gray-600"}>
                    At least 8 characters
                  </span>
                </li>
                <li className="flex items-center">
                  {passwordCriteria.uppercase ? 
                    <FaCheck className="text-green-500 mr-2" /> : 
                    <FaTimes className="text-red-500 mr-2" />}
                  <span className={passwordCriteria.uppercase ? "text-green-500" : "text-gray-600"}>
                    One uppercase letter
                  </span>
                </li>
                <li className="flex items-center">
                  {passwordCriteria.lowercase ? 
                    <FaCheck className="text-green-500 mr-2" /> : 
                    <FaTimes className="text-red-500 mr-2" />}
                  <span className={passwordCriteria.lowercase ? "text-green-500" : "text-gray-600"}>
                    One lowercase letter
                  </span>
                </li>
                <li className="flex items-center">
                  {passwordCriteria.number ? 
                    <FaCheck className="text-green-500 mr-2" /> : 
                    <FaTimes className="text-red-500 mr-2" />}
                  <span className={passwordCriteria.number ? "text-green-500" : "text-gray-600"}>
                    One number
                  </span>
                </li>
                <li className="flex items-center">
                  {passwordCriteria.special ? 
                    <FaCheck className="text-green-500 mr-2" /> : 
                    <FaTimes className="text-red-500 mr-2" />}
                  <span className={passwordCriteria.special ? "text-green-500" : "text-gray-600"}>
                    One special character
                  </span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div>
              {loading ? (
                <button 
                  disabled
                  className="w-full py-3 px-4 bg-purple-400 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting password...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  Reset Password
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;