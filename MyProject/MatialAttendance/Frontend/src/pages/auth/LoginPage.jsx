import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Lottie from "lottie-react";
import monkeyAnimation from "../../assets/Intelligent monkey.json";
import api from "../../common/api";
import { setAuth } from "../../utils/auth/authSlice";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const emailInputRef = useRef(null);
  const lottieRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailInput = () => {
    if (lottieRef.current && isEmailFocused) {
      // Reserved for future eye-tracking logic
    }
  };

  const signInHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/api/v1/users/login", input);

      if (response) {
        navigate("/");
        toast.success(response?.data?.message || "Login successful");

        dispatch(setAuth(response.data.data.email));

        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-sky-200 to-cyan-100 p-4">
      {/* Hero Header */}
      <div className=" hidden md:block relative overflow-hidden">
        {/* Decorative blur circles */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-cyan-300/30 rounded-full blur-3xl" />
        <div className="absolute top-0 right-10 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 pt-8 md:pt-12">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-xl">
            <div className="grid lg:grid-cols-2 gap-8 items-center p-6 md:p-10">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm text-sky-800 font-semibold text-sm mb-5">
                  🎓 Attendance Management System
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                  Matia Ankur Academy
                </h1>

                <p className="mt-4 text-base md:text-lg text-slate-700 max-w-xl">
                  Smart attendance tracking platform designed to manage
                  employee attendance, monitor daily records, and generate
                  accurate reports with ease.
                </p>

                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow">
                    <div className="text-2xl mb-2">⏱️</div>
                    <h3 className="font-semibold text-slate-800">
                      Real-Time Tracking
                    </h3>
                    <p className="text-sm text-slate-600">
                      Instant attendance updates.
                    </p>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow">
                    <div className="text-2xl mb-2">📊</div>
                    <h3 className="font-semibold text-slate-800">
                      Smart Reports
                    </h3>
                    <p className="text-sm text-slate-600">
                      Attendance analytics & exports.
                    </p>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow">
                    <div className="text-2xl mb-2">👨‍🏫</div>
                    <h3 className="font-semibold text-slate-800">
                      Staff Management
                    </h3>
                    <p className="text-sm text-slate-600">
                      Centralized employee records.
                    </p>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow">
                    <div className="text-2xl mb-2">🔒</div>
                    <h3 className="font-semibold text-slate-800">
                      Secure Access
                    </h3>
                    <p className="text-sm text-slate-600">
                      Protected login & authentication.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Info */}
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />

                  <div className="relative bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/40">
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <span className="text-green-500 text-xl">✓</span>
                        <span className="font-medium text-slate-800">
                          Daily Attendance Monitoring
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-green-500 text-xl">✓</span>
                        <span className="font-medium text-slate-800">
                          Employee Attendance History
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-green-500 text-xl">✓</span>
                        <span className="font-medium text-slate-800">
                          Monthly Attendance Reports
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-green-500 text-xl">✓</span>
                        <span className="font-medium text-slate-800">
                          Secure Cloud Access
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] overflow-hidden relative border border-slate-200">
            {/* Monkey Animation */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-br from-cyan-100 to-sky-200 rounded-full w-32 h-32 flex items-center justify-center overflow-hidden shadow-xl border-4 border-white">
                <div className="relative w-full h-full">
                  <Lottie
                    animationData={monkeyAnimation}
                    lottieRef={lottieRef}
                    className="w-full h-full"
                  />

                  {/* Password Cover */}
                  <div
                    className="absolute inset-x-0 bg-slate-900 transition-all duration-500 flex items-center justify-center text-white font-semibold text-sm px-2 text-center"
                    style={{
                      top: isPasswordFocused ? "10%" : "-100%",
                      height: "70%",
                      opacity: isPasswordFocused ? 1 : 0,
                    }}
                  >
                    Matia Ankur Academy
                  </div>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-sky-800 to-cyan-600 p-6 pt-28 text-center">
              <h1 className="text-3xl font-bold tracking-wide text-white mb-2">
                Welcome Back
              </h1>

              <p className="text-sky-100">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={signInHandler} className="p-8 space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-medium">
                  Email
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-slate-400" />
                  </div>

                  <input
                    ref={emailInputRef}
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    value={input.email}
                    onChange={changeEventHandler}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    onKeyUp={handleEmailInput}
                    onSelect={handleEmailInput}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-medium">
                  Password
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-slate-400" />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={input.password}
                    onChange={changeEventHandler}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                    className="w-full pl-10 pr-10 py-3 border border-slate-300 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:bg-white transition-all"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div>
                {loading ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 bg-sky-500 text-white font-medium rounded-xl flex items-center justify-center"
                  >
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Please wait...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full cursor-pointer py-3 px-4 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;