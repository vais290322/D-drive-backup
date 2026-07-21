import authUrlApi from "@/common/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import schoolLogo from "../../assets/schoolLogo.png";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

   try {
     const response = await axios.post(authUrlApi.forgotPassword.url, {
       username: email,
     }, {
       headers: { "Content-Type": "application/json" },
     });
     console.log("response : ", response);
 
     if (response) {
       toast.success(response?.data || "Check your email for password reset link");
    //    navigate("/login");
       setEmail("");
     }
   } catch (error) {
     toast.error("something went wrong");
    
   }

  };

  return (
    <section
      id="login"
      className="w-full h-screen flex justify-center items-center bg-purple-200"
    >
      <div className="mx-auto container p-4 rounded-lg shadow-lg bg-white w-full max-w-md">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="my-3 flex justify-center items-center flex-col">
            <img
              src={schoolLogo}
              className="w-auto h-auto mb-4"
              alt="school logo"
            />
            <p className="text-sm text-center text-wrap">
              Forgot your password? No worries! Enter your email address and
              we'll send you a link to reset your password.
            </p>
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label className="text-sm font-bold">
                *Please enter your email address
              </label>
              <div className="bg-slate-100 p-2 mt-6">
                <input
                  type="email"
                  placeholder="enter email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full outline-none bg-transparent "
                />
              </div>
            </div>

            <Link
              to={"/login"}
              className="block text-sm text-slate-500 w-fit ml-auto hover:underline hover:text-red-600"
            >
              Back to Login
            </Link>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[200px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
