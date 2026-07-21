import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import { Loader2 } from "lucide-react";

// Import the logo
// import mnsLogo from "../assets/mns.jpg";
import ganita from "../assets/ganita.png"
import toast from "react-hot-toast";
import { backendDomainA } from "../common/index";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${backendDomainA}/api/v1/auth/forgot-password`, { email }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("response : ", response)

      if (response) {
        toast.success(response?.data?.message || "Reset link sent to your email");
        setEmail("");
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
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-teal-300">Enter your email to reset your password</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-teal-300 font-medium">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-teal-300" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className="w-full pl-10 pr-3 py-3 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              {loading ? (
                <button 
                  disabled
                  className="w-full py-3 px-4 cursor-pointer bg-teal-700 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending reset link...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 cursor-pointer px-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  Send Reset Link
                </button>
              )}
            </div>

            {/* Back to Login Link */}
            <div className="text-center">
              <p className="text-slate-300">
                Remember your password?{" "}
                <Link to="/login" className="font-medium text-teal-300 hover:text-teal-100 transition-colors">
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;