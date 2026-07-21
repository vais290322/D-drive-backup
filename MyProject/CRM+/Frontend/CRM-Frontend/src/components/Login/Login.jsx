import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../utils/store/logSlice';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(input));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Login successful');
      navigate('/ main'); // Redirect on successful login
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-[#182336] ">
      <form onSubmit={loginHandler} className="shadow-lg flex flex-col gap-4 p-8 sm:w-[25%] bg-white">
        <div className="my-4 flex justify-center items-center flex-col">
          <p className="text-md text-center">Login</p>
        </div>
        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="focus-visible:ring-transparent my-2"
            value={input.email}
            onChange={changeHandler}
            required
          />
        </div>
        <div>
          <span className="font-medium">Password</span>
          <div className="flex border rounded">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="focus-visible:ring-transparent my-2 border-none"
              value={input.password}
              onChange={changeHandler}
              required
            />
            <button
              type="button"
              className="cursor-pointer text-xl pr-3 bg-white rounded-sm h-10 mt-2"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div>
          {loading ? (
            <Button className="bg-green-500 hover:bg-green-700">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="bg-[#44308d] hover:bg-[#f7d74e] hover:text-black font-bold text-md md:text-lg" type="submit">
              Login
            </Button>
          )}
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <span className="text-center">
          Don't have an account? <Link to="/signup" className="text-blue-600">Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
