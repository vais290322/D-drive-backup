import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaTimes, FaCheck } from "react-icons/fa";
import { Loader2 } from "lucide-react";

// Import the logo
// import mnsLogo from "../assets/mns.jpg";
import {toast} from "sonner";
// import { backendDomainA } from "../common/index";

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    
    // Check password criteria when password changes
    if (e.target.name === 'password') {
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

  // const signUpHandler = async (e) => {
  //   e.preventDefault();
    
  //   // Check if all password criteria are met
  //   const allCriteriaMet = Object.values(passwordCriteria).every(criterion => criterion === true);
  //   if (!allCriteriaMet) {
  //     return toast.error("Password does not meet all requirements");
  //   }
    
  //   try {
  //     setLoading(true);
  //     const response = await axios.post(`${backendDomainA}/api/v1/auth/signup`, input, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       withCredentials: true,
  //     });
  //     // console.log("response signup : ", response);
  //     if (response) {
  //       navigate("/login");
  //       toast.success(response?.data?.message || "Account created successfully");
  //       setInput({
  //         username: "",
  //         email: "",
  //         password: "",
  //       });
  //     }
  //   } catch (error) {
  //     console.log("error : ", error)
  //     toast.error(error?.response?.data?.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-center">
            <div className="flex justify-center mb-4">
              <img 
                // src={mnsLogo} 
                alt="Logo" 
                className="h-20 w-auto rounded-full border-2 border-white shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-purple-100">Join us to get started</p>
          </div>

          {/* Form Section */}
          <form onSubmit={""} className="p-8 space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={input.username}
                  onChange={changeEventHandler}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={input.email}
                  onChange={changeEventHandler}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={input.password}
                  onChange={changeEventHandler}
                  required
                />
                <button
                  type="button"
                  className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
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
                  className="w-full py-3 cursor-pointer px-4 bg-purple-400 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full cursor-pointer py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  Sign Up
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-300 w-full"></div>
              <span className="bg-white px-3 text-sm text-gray-500">or</span>
              <div className="border-t border-gray-300 w-full"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-purple-600 hover:text-purple-800 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;