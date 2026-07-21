import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../public/air logo 1.png";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  console.log("username", username);
  
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check if already logged in
  const token = localStorage.getItem("authToken");
  const userData = localStorage.getItem("userData");
  if (token && userData) {
    const from = location.state?.from?.pathname || "/";
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/v1/login`, { email: username, password });
      const { accessToken, data: user, message } = response.data;
      if (accessToken && user) {
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("userData", JSON.stringify(user));
        toast.success(message || "Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      const apiMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(apiMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/api/v1/forgot-password`, { email: forgotEmail });
      toast.success(res.data?.message || "Password reset link sent to your email!");
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center relative">

      {/* Login Card */}
      <div className="bg-white rounded-3xl shadow-2xl px-10 py-12 w-full max-w-md mt-24 border-t-4 border-[#c62828] relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-24 w-32 object-contain" />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-6 relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c62828] shadow-sm"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c62828] shadow-sm"
              disabled={isLoading}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Forgot Password */}
          <div className="mb-6 text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-[#c62828] hover:text-[#b71c1c] transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c62828] text-white py-3 rounded-xl shadow-md hover:bg-[#b71c1c] transition-all text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Forgot Password Dialog */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotEmail("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Forgot Password
              </h3>
              <p className="text-gray-500 text-sm">
                Enter your email address to receive a password reset link.
              </p>
            </div>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full pl-3 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c62828] shadow-sm mb-4"
                disabled={forgotLoading}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotEmail("");
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={forgotLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 bg-[#c62828] text-white py-3 px-4 rounded-xl hover:bg-[#b71c1c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
