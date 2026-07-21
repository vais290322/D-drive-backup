import React, { useState } from "react";
import signupImage from "@/assets/signupImage.png";
import schoolNew1 from "@/assets/schoolNew1.png";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import mainUrlApi from "@/common/main";
import "@/Animation.css";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    schoolName: "",
    address: "",
    instituteType: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
        const response = await axios.post(`${mainUrlApi.signUp.url}`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response) {
          navigate("/login");
          // console.log("Form Submitted: ", formData);
          toast.success("Signup form submitted successfully!");
        }

      }
     catch (error) {
      console.error("Error submitting form signup first page :", error);
    }
  };

  return (
    <> 
    <div className="text-container bg-gradient-to-r from-[#ebc092] to-[#52ece9]">
  <div className="moving-text bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent text-2xl font-bold text-center">
    Join the <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-2xl font-bold text-center">  VaisAcademy </span> family today! Discover endless opportunities and take the first step toward a brighter future. Sign up now to start your academic adventure.
  </div>
</div>

    <div
      className="min-h-screen bg-gradient-to-r from-[#ebc092] to-[#52ece9] flex items-center justify-center"
      // style={{
      //   backgroundImage: `url(${schoolNew1})`,
      //   contain: "content",
      //   backgroundSize: "cover",
      // }}
    >
      <div className="bg-gradient-to-r from-[#693A85] to-[#693A85] p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Form Section */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-6">
              Create An Account
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Fields */}
              {[
                { label: "Username", name: "userName", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone Number", name: "phoneNumber", type: "text" },
                { label: "School Name", name: "schoolName", type: "text" },
                { label: "School Address", name: "address", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block text-white text-sm font-semibold mb-2"
                  >
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-gray-300"
                    required
                  />
                </div>
              ))}

              {/* Password Field with Show/Hide Functionality */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-white text-sm font-semibold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-white text-sm font-semibold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md border border-gray-300"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="instituteType"
                  className="block text-white text-sm font-semibold mb-2"
                >
                  Institute Type
                </label>
                <select
                  id="instituteType"
                  className="w-full p-2 rounded-md border border-gray-300"
                  onChange={(e) =>
                    setFormData({ ...formData, instituteType: e.target.value })
                  }
                >
                  <option value="">Select Institute Type</option>
                  <option value="school">School</option>
                  <option value="college">College</option>
                  <option value="coaching">Coaching</option>
                </select>
              </div>

              {/* Terms and Conditions */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate("/login")}
              >
                <span className="text-white text-sm hover:text-blue-600 hover:underline">
                  Back to Login
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#991d48] hover:bg-[#4d4d8e] text-white font-bold py-2 px-4 rounded-lg"
              >
                Create Account
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-white text-center mb-4">
              Let's Make it Happen Together!
            </h2>
            <img
              src={signupImage}
              alt="Support"
              className="w-68 h-auto rounded-lg shadow-lg"
            />
            <p className="text-white text-center mt-4">
              Ping us for any inquiries!
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignupPage;

