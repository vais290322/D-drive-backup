import React, { useEffect } from "react";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { Loader2 } from "lucide-react";

// Import the logo
// import mnsLogo from "../assets/mns.jpg";
import ganita from "../assets/ganita.png"
import toast from "react-hot-toast";
import { backendDomainA } from "../common/index";
import { setToken, setUser, setUserDetails } from "../utils/auth/authSlice";

const LoginPage = () => {
  const [loadig, setLoadig] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const signInHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadig(true);
      const response = await axios.post(`${backendDomainA}/api/v1/auth/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response) {
        navigate("/");
        toast.success(response?.data?.message || "login successfully");
        dispatch(setUserDetails(response?.data?.user));
        // dispatch(setToken(response?.data?.token));
        dispatch(setUser(response?.data?.user?.role));
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    } finally {
      setLoadig(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-slate-700 rounded-2xl shadow-2xl overflow-hidden border border-slate-600">
          {/* Header Section with Logo */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-center border-b border-slate-600">
            <div className="flex justify-center mb-4">
              <img 
                src={ganita} 
                alt="Logo" 
                className="h-20 w-auto rounded-full border-2 border-teal-300 shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-teal-300">Sign in to access your dashboard</p>
          </div>

          {/* Form Section */}
          <form onSubmit={signInHandler} className="p-8 space-y-6">
            {/* email Field */}
            <div className="space-y-2">
              <label className="block text-teal-300 font-medium">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-teal-300" />
                </div>
                <input
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                  value={input.email}
                  onChange={changeEventHandler}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-teal-300 font-medium">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-teal-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                  value={input.password}
                  onChange={changeEventHandler}
                  required
                />
                <button
                  type="button"
                  className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-teal-300 hover:text-teal-100 transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-teal-300 hover:text-teal-100 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <div>
              {loadig ? (
                <button 
                  disabled
                  className="w-full cursor-pointer py-3 px-4 bg-teal-700 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Please wait...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full cursor-pointer py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-600 w-full"></div>
              <span className="bg-slate-700 px-3 text-sm text-teal-300">or</span>
              <div className="border-t border-slate-600 w-full"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-slate-300">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-teal-300 hover:text-teal-100 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
