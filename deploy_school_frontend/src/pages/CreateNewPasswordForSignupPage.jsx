import React, { useEffect } from 'react'
import { Input } from '../components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import schoolLogo from "../assets/schoolLogo.png"
import { toast } from 'sonner';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setUser, setUserDetails } from '@/utils/auth/authSlice';


const CreateNewPasswordForSignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    confirmPassword: "",
    password: ""
  });

  const user = useSelector(state => state.auth.user) || "";
  // console.log("user from login page : ", user);   
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const signInHandler = async (e) => {
    // console.log("input : ", input);
    toast.success("loading...");
    e.preventDefault();
    try {
      setLoading(true)
      if (input.password !== input.confirmPassword) {
        toast.error("password and confirm password does not match");
        return;
      }
      const response = await axios.post(`http://192.168.0.141:8092/api/auth/loginnnn`, { password: input.password }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      // console.log("lgoin response : ",response);
      if (response) {
        dispatch(setUser(response.data.role))
        dispatch(setUserDetails(response.data.userDetails))
        navigate("/");
        toast.success(response?.data?.message || "login successfully")
        setInput({
          confirmPassword: "",
          password: ""
        })
      } else {
        toast.error(response?.data?.message || "something went wrong")
      }
    } catch (error) {
      // console.log("error in login function : ", error);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
    finally {
      setLoading(false)
    }
  }



  return (
    <div className='flex items-center w-screen h-screen justify-center bg-purple-100'>
      <form onSubmit={signInHandler} className='shadow-lg flex flex-col gap-4 p-8 bg-white rounded-lg'>
        <div className='my-3 flex justify-center items-center flex-col'>
          {/* <Lottie animationData={icon1} className='w-32 h-32 ' /> */}
          <img src={schoolLogo} className="w-auto h-auto" alt="school logo" />
          <p className='text-sm text-center text-wrap'>Create Your won password</p>
        </div>
       
        <div>
          <span className='font-medium'>New Password</span>
          <div className='flex border rounded border-slate-200'>   
          <Input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="focus-visible:ring-transparent my-2 border-none "
            value={input.password}
            onChange={changeEventHandler}
          />
          <button
            type='button'
            className='cursor-pointer text-xl pr-3'
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          </div>
        </div>

        <div>
          <span className='font-medium'>Confirm New Password</span>
          <Input
            required
            type="confirmPassword"
            name="confirmPassword"
            placeholder="confirm Password"
            className="focus-visible:ring-transparent my-2"
            value={input.confirmPassword}
            onChange={changeEventHandler}
          />
        </div>

        {
          loading ? (
            <Button className="bg-green-500 hover:bg-green-700">
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              please wait
            </Button >
          ) : (<Button className="bg-gradient-to-tl from-red-500 to-purple-600 hover:bg-gradient-to-tl hover:from-pink-600 hover:to-red-600  font-bold text-md md:text-lg" type="submit">Verify</Button>)
        }
      </form>
    </div>
  )
}

export default CreateNewPasswordForSignupPage