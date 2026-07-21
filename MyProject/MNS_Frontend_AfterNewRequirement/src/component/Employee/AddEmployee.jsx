import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addEmployee,
  clearError,
  setError,
  setLoading,
} from "../../utils/employee/employeeSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { FiLoader } from "react-icons/fi";

const addEmployeeUri = import.meta.env.VITE_REACT_ADD_EMPLOYEE;

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    // details
    employeeName: "",
    employeeCode: "", // Added employee code field
    employeeImage: null,
    email: "",
    gender: "",
    bloodGroup: "",
    religion: "",
    phone: "",
    maritialStatus: "",
    joiningDate: "",
    status: "",
    // permanent address
    pinCode: "",
    state: "",
    city: "",
    district: "",
    country: "",
    policeStation: "",
    villPost: "",
    // present address
    presentPinCode: "",
    presentState: "",
    presentCity: "",
    presentDistrict: "",
    presentCountry: "",
    presentPoliceStation: "",
    presentVillPost: "",
    // other details
    panNumber: "",
    panImage: null,
    aadherNumber: "",
    aatherImage: null,
    // baseSalary: "",
    // bank details
    bankName: "",
    ifscCode: "",
    accountNo: "",
    branch: "",
    accHeadName: "",
    frontPageImage: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [sameAsPermAddress, setSameAsPermAddress] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.employee || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: files[0],
    }));
  };

  const handleSameAddressChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsPermAddress(isChecked);
    
    if (isChecked) {
      // Copy permanent address to present address
      setEmployee(prev => ({
        ...prev,
        presentPinCode: prev.pinCode,
        presentState: prev.state,
        presentCity: prev.city,
        presentDistrict: prev.district,
        presentCountry: prev.country,
        presentPoliceStation: prev.policeStation,
        presentVillPost: prev.villPost,
      }));
    } else {
      // Clear present address fields when unchecked
      setEmployee(prev => ({
        ...prev,
        presentPinCode: "",
        presentState: "",
        presentCity: "",
        presentDistrict: "",
        presentCountry: "",
        presentPoliceStation: "",
        presentVillPost: "",
      }));
    }
  };

  // Update present address when permanent address changes and checkbox is checked
  const handlePermanentAddressChange = (e) => {
    const { name, value } = e.target;
    
    setEmployee(prev => {
      const updatedEmployee = {
        ...prev,
        [name]: value,
      };
      
      // If same address checkbox is checked, update present address too
      if (sameAsPermAddress) {
        const presentField = name.replace('permanent', 'present');
        updatedEmployee[presentField] = value;
      }
      
      return updatedEmployee;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading());
    try {
      const formData = new FormData();
      Object.keys(employee).forEach((key) => {
        if (employee[key]) {
          formData.append(key, employee[key]);
        }
      });

      const response = await axios.post(addEmployeeUri, formData, 
        {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("respnose : ",response)

      dispatch(addEmployee(response?.data));
      toast.success(response?.data?.message || "Employee added successfully");
      dispatch(clearError());
    } catch (error) {
      console.error("Error adding employee:", error);
      dispatch(setError("Failed to add employee"));
      toast.error("Failed to add employee", error?.response?.data?.message);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Employee</h2>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="border-b-2 pb-6">
            <h3 className="text-xl font-semibold mb-4">Employee Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Employee Name</label>
                <input
                  type="text"
                  name="employeeName"
                  value={employee.employeeName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter Name"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Employee Code</label>
                <input
                  type="text"
                  name="employeeCode"
                  value={employee.employeeCode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter Employee Code"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Employee Image</label>
                <input
                  type="file"
                  name="employeeImage"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter Email"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter Phone Number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Gender</label>
                  <select
                    name="gender"
                    value={employee.gender}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-2">Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={employee.bloodGroup}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Blood Group"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={employee.religion}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Religion"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Marital Status</label>
                  <select
                    name="maritialStatus"
                    value={employee.maritialStatus}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={employee.joiningDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={employee.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                  <option value="terminated">Terminated</option>
                  <option value="leave">Leave</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 cursor-pointer "
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="border-b-2 pb-6">
            <h3 className="text-xl font-semibold mb-4">Employee Address</h3>
            
            {/* Permanent Address Section */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3 text-blue-700">Permanent Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={employee.city}
                      onChange={handlePermanentAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Pin Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={employee.pinCode}
                      onChange={handlePermanentAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Pin Code"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={employee.state}
                      onChange={handlePermanentAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">District</label>
                    <input
                      type="text"
                      name="district"
                      value={employee.district}
                      onChange={handlePermanentAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="District"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={employee.country}
                    onChange={handlePermanentAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Country"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Police Station</label>
                    <input
                      type="text"
                      name="policeStation"
                      value={employee.policeStation}
                      onChange={handlePermanentAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Police Station"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Village/Post</label>
                    <input
                      type="text"
                      name="villPost"
                      value={employee.villPost}
                      onChange={handlePermanentAddressChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Village/Post"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Same as Permanent Address Checkbox */}
            <div className="mb-4 mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sameAsPermAddress}
                  onChange={handleSameAddressChange}
                  className="mr-2 h-5 w-5"
                />
                <span className="text-md font-medium">Present address same as permanent address</span>
              </label>
            </div>
            
            {/* Present Address Section */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3 text-blue-700">Present Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">City</label>
                    <input
                      type="text"
                      name="presentCity"
                      value={employee.presentCity}
                      onChange={handleChange}
                      disabled={sameAsPermAddress}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${sameAsPermAddress ? 'bg-gray-100' : ''}`}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Pin Code</label>
                    <input
                      type="text"
                      name="presentPinCode"
                      value={employee.presentPinCode}
                      onChange={handleChange}
                      disabled={sameAsPermAddress}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${sameAsPermAddress ? 'bg-gray-100' : ''}`}
                      placeholder="Pin Code"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">State</label>
                    <input
                      type="text"
                      name="presentState"
                      value={employee.presentState}
                      onChange={handleChange}
                      disabled={sameAsPermAddress}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${sameAsPermAddress ? 'bg-gray-100' : ''}`}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">District</label>
                    <input
                      type="text"
                      name="presentDistrict"
                      value={employee.presentDistrict}
                      onChange={handleChange}
                      disabled={sameAsPermAddress}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${sameAsPermAddress ? 'bg-gray-100' : ''}`}
                      placeholder="District"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-2">Country</label>
                  <input
                    type="text"
                    name="presentCountry"
                    value={employee.presentCountry}
                    onChange={handleChange}
                    disabled={sameAsPermAddress}
                    className={`w-full p-3 border border-gray-300 rounded-lg ${sameAsPermAddress ? 'bg-gray-100' : ''}`}
                    placeholder="Country"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Police Station</label>
                    <input
                      type="text"
                      name="presentPoliceStation"
                      value={employee.presentPoliceStation}
                      onChange={handleChange}
                      disabled={sameAsPermAddress}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${sameAsPermAddress ? 'bg-gray-100' : ''}`}
                      placeholder="Police Station"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Village/Post</label>
                    <input
                      type="text"
                      name="presentVillPost"
                      value={employee.presentVillPost}
                      onChange={handleChange}
                      disabled={sameAsPermAddress}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${sameAsPermAddress ? 'bg-gray-100' : ''}`}
                      placeholder="Village/Post"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3 text-blue-700">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={employee.panNumber}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="PAN Number"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">PAN Image</label>
                  <input
                    type="file"
                    name="panImage"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Aadhar Number</label>
                  <input
                    type="text"
                    name="aadherNumber"
                    value={employee.aadherNumber}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Aadhar Number"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Aadhar Image</label>
                  <input
                    type="file"
                    name="aatherImage"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                {/* <div>
                  <label className="block font-medium mb-2">Base Salary</label>
                  <input
                    type="text"
                    name="baseSalary"
                    value={employee.baseSalary}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Base Salary"
                  />
                </div> */}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="pb-6">
            <h3 className="text-xl font-semibold mb-4">Employee Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={employee.bankName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Bank Name"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={employee.ifscCode}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="IFSC Code"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">Account No</label>
                <input
                  type="text"
                  name="accountNo"
                  value={employee.accountNo}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Account Number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={employee.branch}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Branch"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Account Holder</label>
                  <input
                    type="text"
                    name="accHeadName"
                    value={employee.accHeadName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Account Holder"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">Front Page Image</label>
                <input
                  type="file"
                  name="frontPageImage"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">Adding...</span>
                    <FiLoader className="animate-spin" />
                  </>
                ) : (
                  "Add Employee"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddEmployee;