import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BiLoaderCircle } from "react-icons/bi";
import { FiUser, FiMail, FiPhone, FiHash, FiBriefcase, FiCreditCard, FiSave, FiArrowLeft } from "react-icons/fi";
import axios from 'axios';
import { backendDomainN1 } from '../../../common';

const RegisterEmployeePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    employeeCode: '',
    department: '',
    rfidTag: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNo.replace(/[^0-9]/g, ''))) {
      newErrors.phoneNo = "Phone number should be 10 digits";
    }
    
    if (!formData.employeeCode.trim()) {
      newErrors.employeeCode = "Employee code is required";
    }
    
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }
    
    if (!formData.rfidTag.trim()) {
      newErrors.rfidTag = "RFID tag is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${backendDomainN1}/api/employees/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response) {
        toast.success('Employee registered successfully');
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phoneNo: '',
          employeeCode: '',
          department: '',
          rfidTag: '',
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Register New Employee</h1>
                <p className="text-blue-100">
                  Add a new employee with RFID tag for attendance tracking
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex cursor-pointer items-center px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to List
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter full name"
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="employeeCode"
                      required
                      placeholder="Enter employee code"
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.employeeCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                      value={formData.employeeCode}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.employeeCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.employeeCode}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter email address"
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phoneNo"
                      required
                      placeholder="Enter phone number"
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.phoneNo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                      value={formData.phoneNo}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phoneNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBriefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="department"
                      required
                      placeholder="Enter department"
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RFID Tag
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="rfidTag"
                      required
                      placeholder="Enter RFID tag number"
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.rfidTag ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                      value={formData.rfidTag}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.rfidTag && (
                    <p className="mt-1 text-sm text-red-600">{errors.rfidTag}</p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex cursor-pointer justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <BiLoaderCircle className="animate-spin mr-2" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Register Employee
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            All employee information will be securely stored and used for attendance tracking purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployeePage;