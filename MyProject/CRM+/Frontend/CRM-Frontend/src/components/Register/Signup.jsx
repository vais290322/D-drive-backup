import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetRegisterState } from '../../utils/store/registerSlice';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [input, setInput] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { loading, success, error } = useSelector((state) => state.register); // Use the correct state slice
  const dispatch = useDispatch();

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const registerHandler = async (e) => {
    e.preventDefault();

    if (input.password !== input.confirmPassword) {
      toast.error('Password and Confirm Password must match');
      return;
    }

    const result = await dispatch(registerUser({ name: input.name, email: input.email, password: input.password }));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Registration successful');
      setInput({ name: '', email: '', password: '', confirmPassword: '' });
      dispatch(resetRegisterState());
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-[#182336]">
      <form onSubmit={registerHandler} className="shadow-lg flex flex-col gap-4 p-8 bg-[#fff] sm:w-[25%]">
        <div className="my-4 flex flex-col justify-center items-center">
          <p className="text-sm text-center">Sign Up</p>
        </div>
        <div>
          <label className="font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            className="focus-visible:ring-transparent my-2 w-full p-2 border rounded"
            value={input.name}
            onChange={changeHandler}
            required
          />
        </div>
        <div>
          <label className="font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="focus-visible:ring-transparent my-2 w-full p-2 border rounded"
            value={input.email}
            onChange={changeHandler}
            required
          />
        </div>
        <div>
          <label className="font-medium">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="focus-visible:ring-transparent my-2 w-full p-2 border rounded"
            value={input.password}
            onChange={changeHandler}
            required
          />
        </div>
        <div>
          <label className="font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            className="focus-visible:ring-transparent my-2 w-full p-2 border rounded"
            value={input.confirmPassword}
            onChange={changeHandler}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? 'bg-green-500 cursor-not-allowed' : 'bg-[#44308d] hover:bg-[#f7d74e] hover:text-black'
          } text-white font-bold p-2 rounded-md`}
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>User registered successfully!</p>}
        <span className="text-center">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
