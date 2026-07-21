import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { Loader2 } from "lucide-react";

// Import the logo
// import mnsLogo from "../assets/mns.jpg";
import ganita from "../assets/ganita.png"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-slate-700 rounded-2xl shadow-2xl overflow-hidden border border-slate-600">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-center border-b border-slate-600">
            <div className="flex justify-center mb-4">
              <img 
                src={ganita} 
                alt="Logo" 
                className="h-20 w-auto rounded-full border-2 border-teal-300 shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-teal-300">Create your new password</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="block text-teal-300 font-medium">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-teal-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-300 hover:text-teal-100 transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-teal-300 font-medium">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-teal-300" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-300 hover:text-teal-100 transition-colors"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="text-sm text-slate-300 space-y-1">
              <p className="font-medium mb-2 text-teal-300">Password must contain:</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  {passwordCriteria.length ? 
                    <FaCheck className="text-teal-300 mr-2" /> : 
                    <FaTimes className="text-red-500 mr-2" />}
                  <span className={passwordCriteria.length ? "text-teal-300" : "text-slate-400"}>
                    At least 8 characters
                  </span>
                </li>
                <li className="flex items-center">
                  {passwordCriteria.uppercase ? 
                    <FaCheck className="text-teal-300 mr-2" /> : 
                    <FaTimes className="text-red-500 mr-2" />}
                  <span className={passwordCriteria.uppercase ? "text-teal-300" : "text-slate-400"}>
                    One uppercase letter
                  </span>
                </li>
                <li className="flex items-center">
                  {passwordCriteria.lowercase ? 
                    <FaCheck className="text-teal-300 mr-2" /> : 
                    <FaTimes className="text-red-500 mr-2" />}
                  <span className={passwordCriteria.lowercase ? "text-teal-300" : "text-slate-400"}>
                    One lowercase letter
                  </span>
                </li>
                <li className="flex items-center">
                  {passwordCriteria.number ? 
                    <FaCheck className="text-teal-300 mr-2" /> : 
                    <FaTimes className="text-red-500 mr-2" />}
                  <span className={passwordCriteria.number ? "text-teal-300" : "text-slate-400"}>
                    One number
                  </span>
                </li>
                <li className="flex items-center">
                  {passwordCriteria.special ? 
                    <FaCheck className="text-teal-300 mr-2" /> : 
                    <FaTimes className="text-red-500 mr-2" />}
                  <span className={passwordCriteria.special ? "text-teal-300" : "text-slate-400"}>
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
                  className="w-full py-3 px-4 bg-teal-700 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting password...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
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