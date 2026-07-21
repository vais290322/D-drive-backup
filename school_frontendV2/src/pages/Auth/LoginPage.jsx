import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import schoolLogo from "../../assets/schoolLogo.png";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setUser, setUserDetails } from "@/utils/auth/authSlice";
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

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const signInHandler = async (e) => {
    // console.log("input : ", input);
    // toast.success("loading...");
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
            <span className="font-medium">username/Email</span>
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
                placeholder="Password"
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
          <span className="text-center">
            Does't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
