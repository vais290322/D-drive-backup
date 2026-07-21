// import React, { useState } from "react";
// import { FaEye } from "react-icons/fa";
// import { FaEyeSlash } from "react-icons/fa";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";
// import authUrlApi from "@/common/auth";
// import schoolLogo from "../../assets/schoolLogo.png";
// import axios from "axios";

// const CreateNewPasswordPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassrod] = useState("");
//   const navigate = useNavigate();
//   const { token } = useParams();
//   const url = `${authUrlApi.resetPassword.url}?token=${token}`;
//   // console.log("url=",url);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password === confirmPassword) {
//         try {
//             setLoading(true);
//             const response = await axios.post(url, {
//                 newPassword: password,
//             }, {
//                 headers: { "Content-Type": "application/json" },
//             });
//             if (response) {
//                 toast.success(response.data.message);
//                 navigate("/login");
//             }
//         } catch (error) {
//             toast.error("something went wrong");   
//         } finally {
//             setLoading(false);
//         }
      
//     } else {
//       toast.error("Please check password and confirm password");
//     }
//   };

//   return (
//     <section id="login " className="w-full h-screen flex justify-center items-center bg-purple-200">
//       <div className="mx-auto container p-4 rounded-lg shadow-lg bg-white w-full max-w-md">
//         <div className="bg-white p-5 w-full max-w-sm mx-auto">
//           <div className="my-3 flex justify-center items-center flex-col">
//             <img
//               src={schoolLogo}
//               className="w-auto h-auto mb-4"
//               alt="school logo"
//             />
//             <p className="text-sm text-center text-wrap">
//                 Create a new password for your account
//             </p>
//           </div>
//           <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
//             <div>
//               <div className="bg-slate-100 p-2 flex mb-4 ">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="New Password"
//                   value={password}
//                   name="password"
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full h-full outline-none bg-transparent border rounded-sm border-green-500 border-r-0 rounded-r-none "
//                 />

//                 <div
//                   className="cursor-pointer text-xl  border p-2 rounded-sm border-green-500 border-l-0 rounded-l-none"
//                   onClick={() => setShowPassword((preve) => !preve)}
//                 >
//                   <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
//                 </div>
                
//               </div>

//               <div className="bg-slate-100 p-2 flex mb-4">
//                 <input
//                   type="password"
//                   placeholder="Confirm New Password"
//                   value={confirmPassword}
//                   name="ConfirmPassword"
//                   onChange={(e) => setConfirmPassrod(e.target.value)}
//                   required
//                   className="w-full h-full border border-green-500 outline-none bg-transparent"
//                 />
//               </div>

//             </div>

//             <button
//               type="submit"
//               className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[200px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
//             >
//               Reset Password
//             </button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CreateNewPasswordPage;


import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import authUrlApi from "@/common/auth";
import schoolLogo from "../../assets/schoolLogo.png";
import axios from "axios";
import { Loader2, Lock, CheckCircle, KeyRound, ShieldCheck } from "lucide-react";

const CreateNewPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();
  const url = `${authUrlApi.resetPassword.url}?token=${token}`;
  const [loading, setLoading] = useState(false);

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: (strength / 5) * 100, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength: (strength / 5) * 100, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength: (strength / 5) * 100, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = passwordStrength(password);
  const passwordsMatch = confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        setLoading(true);
        const response = await axios.post(url, {
          newPassword: password,
        }, {
          headers: { "Content-Type": "application/json" },
        });
        if (response) {
          toast.success(response.data.message);
          navigate("/login");
        }
      } catch (error) {
        toast.error(error?.response?.data || "Something went wrong");   
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header Section */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Create New Password
          </h1>
          <p className="text-gray-600 text-sm">
            Set a strong password to secure your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={schoolLogo}
                className="w-auto h-24 object-contain"
                alt="school logo"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-sm text-center text-gray-600 leading-relaxed">
              Create a new password for your account. Make sure it's strong and unique.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1 animate-fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Password strength</span>
                    <span className={`font-semibold ${
                      strength.label === 'Weak' ? 'text-red-600' :
                      strength.label === 'Fair' ? 'text-yellow-600' :
                      strength.label === 'Good' ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300 ease-out`}
                      style={{ width: `${strength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle className={`h-5 w-5 transition-colors ${
                    passwordsMatch
                      ? 'text-green-500'
                      : 'text-gray-400 group-focus-within:text-purple-500'
                  }`} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  name="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-600 animate-fade-in">Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-green-600 animate-fade-in flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Passwords match!
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs text-purple-900 font-medium mb-2">🔒 Security Tips:</p>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• Use at least 8 characters</li>
              <li>• Mix uppercase, lowercase, numbers & symbols</li>
              <li>• Avoid common words or personal information</li>
              <li>• Don't reuse passwords from other accounts</li>
            </ul>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Remembered your password?{" "}
          <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
            Sign in here
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </section>
  );
};

export default CreateNewPasswordPage;