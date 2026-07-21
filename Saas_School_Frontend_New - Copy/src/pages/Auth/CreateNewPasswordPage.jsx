import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import authUrlApi from "@/common/auth";
import schoolLogo from "../../assets/schoolLogo.png";
import axios from "axios";

const CreateNewPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassrod] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();
  const url = `${authUrlApi.resetPassword.url}?token=${token}`;
  console.log("url=",url);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
        try {
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
            toast.error("something went wrong");   
        }
      
    } else {
      toast.error("Please check password and confirm password");
    }
  };

  return (
    <section id="login " className="w-full h-screen flex justify-center items-center bg-purple-200">
      <div className="mx-auto container p-4 rounded-lg shadow-lg bg-white w-full max-w-md">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="my-3 flex justify-center items-center flex-col">
            <img
              src={schoolLogo}
              className="w-auto h-auto mb-4"
              alt="school logo"
            />
            <p className="text-sm text-center text-wrap">
                Create a new password for your account
            </p>
          </div>
          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div>
              <div className="bg-slate-100 p-2 flex mb-4 ">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-full outline-none bg-transparent border rounded-sm border-green-500 border-r-0 rounded-r-none "
                />

                <div
                  className="cursor-pointer text-xl  border p-2 rounded-sm border-green-500 border-l-0 rounded-l-none"
                  onClick={() => setShowPassword((preve) => !preve)}
                >
                  <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
                
              </div>

              <div className="bg-slate-100 p-2 flex mb-4">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  name="ConfirmPassword"
                  onChange={(e) => setConfirmPassrod(e.target.value)}
                  required
                  className="w-full h-full border border-green-500 outline-none bg-transparent"
                />
              </div>

            </div>

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

export default CreateNewPasswordPage;
