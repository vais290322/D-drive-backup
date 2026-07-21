import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import axios from "axios";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Lottie from "lottie-react";
import monkeyAnimation from "../../assets/Intelligent monkey.json";

const LoginPage = () => {
  const [loadig, setLoadig] = useState(false);
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

  // Track cursor position in email field to make eyes follow
  const handleEmailInput = (e) => {
    if (lottieRef.current && isEmailFocused) {
      // Logic to update eye position based on cursor position would go here
      // This would require more complex manipulation of the Lottie animation
    }
  };

  // const signInHandler = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoadig(true);
  //     const response = await axios.post(`${backendDomainA}/api/v1/auth/login`, input, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       withCredentials: true,
  //     });

  //     if (response) {
  //       navigate("/");
  //       toast.success(response?.data?.message || "login successfully");
  //       dispatch(setUserDetails(response?.data?.user));
  //       // dispatch(setToken(response?.data?.token));
  //       dispatch(setUser(response?.data?.user?.role));
  //       setInput({
  //         email: "",
  //         password: "",
  //       });
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "something went wrong");
  //   } finally {
  //     setLoadig(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Monkey Animation in Rounded Div - Positioned above header */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-yellow-300 rounded-full w-32 h-32 flex items-center justify-center overflow-hidden shadow-lg border-4 border-white">
              <div className="relative w-full h-full">
                {/* Lottie Animation */}
                <Lottie 
                  animationData={monkeyAnimation} 
                  lottieRef={lottieRef}
                  className="w-full h-full"
                />
                
                {/* Shade overlay that comes from top when password is focused */}
                <div 
                  className={`absolute inset-x-0 bg-black transition-all duration-500 flex items-center justify-center text-white font-bold text-lg`}
                  style={{
                    top: isPasswordFocused ? '10%' : '-100%',
                    height: '70%',
                    opacity: isPasswordFocused ? 1 : 0
                  }}
                >
                  Vais
                </div>
              </div>
            </div>
          </div>

          {/* Header Section - Now without the logo */}
          <div className="bg-gradient-to-r from-sky-800 to-blue-500 p-6 pt-28 text-center"> {/* Added pt-16 for spacing */}
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-purple-100">Sign in to access your dashboard</p>
          </div>

          {/* Form Section */}
          <form onSubmit={""}  className="p-8 space-y-6 relative">
            {/* email Field */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={emailInputRef}
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={input.email}
                  onChange={changeEventHandler}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  onKeyUp={handleEmailInput}
                  onSelect={handleEmailInput}
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
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={input.password}
                  onChange={changeEventHandler}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <div>
              {loadig ? (
                <button 
                  disabled
                  className="w-full cursor-pointer py-3 px-4 bg-purple-400 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Please wait...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full cursor-pointer py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-300 w-full"></div>
              <span className="bg-white px-3 text-sm text-gray-500">or</span>
              <div className="border-t border-gray-300 w-full"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-800 transition-colors">
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
