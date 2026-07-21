import React, { useContext, useState } from "react";
import loginIcons from "../assest/signin.gif";
import { FaEye, FaEyeSlash, FaLeaf, FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common/index";
import { toast } from "react-toastify";
import Context from "../context";
import Green from "../assest/logo/Green.png";
import GreenLogo3 from "../assest/logo/GreenLogo3.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);
 
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();
    console.log("current user : ", dataApi);
    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate("/");
      fetchUserDetails();
      fetchUserAddToCart();
    }
    if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  return (
    <section id="login" className="bg-gradient-to-b from-emerald-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full opacity-50 z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-200 rounded-full opacity-40 z-0"></div>
            
            {/* Header */}
            <div className="bg-emerald-800 text-white py-6 px-8 relative">
              <div className="absolute inset-0 opacity-10" 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '20px'
                  }}>
              </div>
              <div className="flex items-center justify-center relative z-10">
                <img src={GreenLogo3} alt="Green City Nursery" className="h-12 mr-3 bg-white p-1 rounded-md" />
                <h2 className="text-2xl font-bold">Admin Login</h2>
              </div>
            </div>
            
            {/* Form */}
            <div className="p-8 relative z-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-emerald-600" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={data.email}
                      onChange={handleOnChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    {/* <Link
                      to="/forgot-password"
                      className="text-sm text-emerald-600 hover:text-emerald-800 hover:underline"
                    >
                      Forgot password?
                    </Link> */}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-emerald-600" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={data.password}
                      onChange={handleOnChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword((preve) => !preve)}
                    >
                      {showPassword ? 
                        <FaEyeSlash className="text-gray-500 hover:text-emerald-600" /> : 
                        <FaEye className="text-gray-500 hover:text-emerald-600" />
                      }
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2"
                >
                  <FaLeaf size={16} />
                  Login
                </button>
              </form>

              {/* <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
