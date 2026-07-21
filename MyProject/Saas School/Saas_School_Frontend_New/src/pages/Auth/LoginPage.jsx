import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import schoolLogo from "../../assets/schoolLogo.png";

import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { setIsLogin, setSchoolId, setUser, setUserDetails } from "@/utils/auth/authSlice";
import authUrlApi from "@/common/auth";
import { toast } from "sonner";

import "@/Animation.css";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
  const [loadig, setLoadig] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  // const user = useSelector(state => state.auth.user) || "";
  // console.log("user from login page : ", user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const isLogin = useSelector((state) => state?.auth?.islogin);
  // console.log("is login from login page : ", isLogin);

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
      const response = await axios.post(`${authUrlApi.login.url}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response) {
        // console.log("lgoin response : ",response);

        dispatch(setUser(response?.data?.role));
        dispatch(setUserDetails(response.data.userDetails));
        dispatch(setIsLogin(true));
        if(response?.data?.role=== "admin"){
          dispatch(setSchoolId(response?.data?.userDetails?.id)) 
        }else{
          dispatch(setSchoolId(response?.data?.userDetails?.schoolId))
        }
       
        navigate("/");
        toast.success(response?.data?.message || "login successfully");
        setInput({
          username: "",
          password: "",
        });
      }
    } catch (error) {
      // console.log("error in login function : ", error);
      toast.error(error?.response?.data?.message || "something went wrong");
      //  alert(error?.response?.data?.message || "something went wrong")
    } finally {
      setLoadig(false);
    }
  };

  return (
    <>
      <div className="text-container bg-purple-100 ">
        <div className="moving-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold text-center">
          Welcome back to <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-2xl font-bold text-center">  VaisAcademy! </span> Your gateway to seamless learning and
          academic excellence. Log in and continue your journey to success.
        </div>
      </div>

      <div className="flex items-center w-screen h-screen justify-center bg-purple-100">
        <form
          onSubmit={signInHandler}
          className="shadow-lg flex flex-col gap-4 p-8 bg-white rounded-lg"
        >
          <div className="my-3 flex justify-center items-center flex-col">
            {/* <Lottie animationData={icon1} className='w-32 h-32 ' /> */}
            <img src={schoolLogo} className="w-Full h-32" alt="school logo" />
            <p className="text-sm text-center text-wrap">
              Login to see our dashboard
            </p>
          </div>
          <div>
            <span className="font-medium">Admission Number / Email</span>
            <Input
              type="text"
              name="username"
              placeholder="username"
              className="focus-visible:ring-transparent my-2"
              value={input.username}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div>
            <span className="font-medium">Password</span>
            <div className="flex border rounded border-slate-200">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password ex: ddmmyyyy"
                className="focus-visible:ring-transparent my-2 border-none "
                value={input.password}
                onChange={changeEventHandler}
                required
              />
              <button
                type="button"
                className="cursor-pointer text-xl pr-3"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <Link
            to={"/forgot-password"}
            className="block w-fit text-blue-600  ml-auto hover:underline hover:text-pink-600"
          >
            Forgot password ?
          </Link>
          {loadig ? (
            <Button className="bg-green-500 hover:bg-green-700">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              please wait
            </Button>
          ) : (
            <Button
              className="bg-gradient-to-tl from-red-500 to-purple-600 hover:bg-gradient-to-tl hover:from-pink-600 hover:to-red-600  font-bold text-md md:text-lg"
              type="submit"
            >
              Login
            </Button>
          )}
          {/* <span className="text-center">
            Doesn't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span> */}
        </form>
      </div>
    </>
  );
};

export default LoginPage;




// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Loader2, User, Lock, GraduationCap } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import schoolLogo from "../../assets/schoolLogo.png";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { setSchoolId, setUser, setUserDetails } from "@/utils/auth/authSlice";
// import authUrlApi from "@/common/auth";
// import { toast } from "sonner";
// import { Input } from "@/components/ui/input";

// const LoginPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [input, setInput] = useState({
//     username: "",
//     password: "",
//   });

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const changeEventHandler = (e) => {
//     setInput({
//       ...input,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const signInHandler = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const response = await axios.post(`${authUrlApi.login.url}`, input, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       if (response) {
//         dispatch(setUser(response?.data?.role));
//         dispatch(setUserDetails(response.data.userDetails));
//         if (response?.data?.role === "admin") {
//           dispatch(setSchoolId(response?.data?.userDetails?.id));
//         } else {
//           dispatch(setSchoolId(response?.data?.userDetails?.schoolId));
//         }

//         navigate("/");
//         toast.success(response?.data?.message || "Login successfully");
//         setInput({
//           username: "",
//           password: "",
//         });
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200">
//       {/* Animated Welcome Banner */}
//       <div className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
//         <div className="container mx-auto px-4">
//           <div className="text-center animate-fade-in">
//             <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-2">
//               Welcome back to{" "}
//               <span className="inline-flex items-center gap-2">
//                 <GraduationCap className="w-6 h-6 md:w-8 md:h-8" />
//                 VaisAcademy
//               </span>
//             </h1>
//             <p className="text-purple-100 text-sm md:text-base">
//               Your gateway to seamless learning and academic excellence
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Login Form Section */}
//       <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-120px)]">
//         <div className="w-full max-w-md animate-slide-up">
//           {/* Header */}
//           <div className="text-center mb-6 animate-fade-in">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg">
//               <Lock className="w-8 h-8 text-white" />
//             </div>
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Sign In
//             </h2>
//             <p className="text-gray-600 text-sm mt-2">
//               Access your dashboard
//             </p>
//           </div>

//           {/* Login Card */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//             {/* School Logo */}
//             <div className="flex justify-center mb-6">
//               <img
//                 src={schoolLogo}
//                 className="w-auto h-24 object-contain"
//                 alt="school logo"
//               />
//             </div>

//             <form onSubmit={signInHandler} className="space-y-6">
//               {/* Username/Email Field */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Admission Number / Email <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
//                   </div>
//                   <Input
//                     type="text"
//                     name="username"
//                     placeholder="Enter admission number or email"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 focus-visible:ring-purple-500"
//                     value={input.username}
//                     onChange={changeEventHandler}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Password <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
//                   </div>
//                   <Input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="Enter your password"
//                     className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 focus-visible:ring-purple-500"
//                     value={input.password}
//                     onChange={changeEventHandler}
//                     required
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? (
//                       <FaEye className="h-5 w-5" />
//                     ) : (
//                       <FaEyeSlash className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Forgot Password Link */}
//               <div className="flex justify-end">
//                 <Link
//                   to="/forgot-password"
//                   className="text-sm text-purple-600 hover:text-pink-600 font-semibold hover:underline transition-colors"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center">
//                     <Loader2 className="animate-spin mr-2 h-5 w-5" />
//                     Signing in...
//                   </span>
//                 ) : (
//                   "Sign In"
//                 )}
//               </Button>
//             </form>

//             {/* Security Notice */}
//             <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
//               <p className="text-xs text-purple-900 font-medium mb-1">
//                 🔒 Secure Login
//               </p>
//               <p className="text-xs text-purple-700">
//                 Your credentials are encrypted and secure
//               </p>
//             </div>
//           </div>

//           {/* Footer */}
//           <p className="text-center text-xs text-gray-500 mt-6">
//             Need help?{" "}
//             <a
//               href="#"
//               className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
//             >
//               Contact Support
//             </a>
//           </p>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.5s ease-out;
//         }

//         .animate-slide-up {
//           animation: slide-up 0.6s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LoginPage;