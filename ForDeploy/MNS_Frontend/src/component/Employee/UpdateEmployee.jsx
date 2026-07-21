import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  updateEmployee,
  clearError,
  setError,
  setLoading,
} from "../../utils/employee/employeeSlice";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";
import axios from "axios";

const updateEmployeeUri = import.meta.env.VITE_REACT_UPDATE_EMPLOYEE;

const UpdateEmployee = ({ employee, onClose, onUpdateSuccess }) => {
  const [updatedEmployee, setUpdatedEmployee] = useState(employee);
  const [currentStep, setCurrentStep] = useState(1);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.employee || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setUpdatedEmployee((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading());
    try {
      const formData = new FormData();
      Object.keys(updatedEmployee).forEach((key) => {
        if (
          updatedEmployee[key] !== null &&
          updatedEmployee[key] !== undefined
        ) {
          formData.append(key, updatedEmployee[key]);
        }
      });

      const response = await axios.put(
        `${updateEmployeeUri}/${employee.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(updateEmployee(response?.data));
      toast.success("Employee updated successfully");
      dispatch(clearError());
      onUpdateSuccess();
    } catch (error) {
      dispatch(setError("Failed to update employee"));
      toast.error("Failed to update employee", error);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Update Employee</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            >
              ×
            </button>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

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
                      value={updatedEmployee.employeeName}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Enter Name"
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
                    {updatedEmployee?.employeeImage && (
                      <img
                        src={
                          typeof updatedEmployee.employeeImage === "string"
                            ? updatedEmployee.employeeImage
                            : URL.createObjectURL(updatedEmployee.employeeImage)
                        }
                        alt="Employee"
                        className="mt-2 h-20 w-20 object-cover rounded-full"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={updatedEmployee.email}
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
                      value={updatedEmployee.phone}
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
                        value={updatedEmployee.gender}
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
                        value={updatedEmployee.bloodGroup}
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
                        value={updatedEmployee.religion}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Religion"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Marital Status</label>
                      <select
                        name="maritialStatus"
                        value={updatedEmployee.maritialStatus}
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
                      value={updatedEmployee?.joiningDate?.substring(0, 10)}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Status</label>
                    <select
                      name="status"
                      value={updatedEmployee.status}
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
                <div className="flex justify-end mt-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={updatedEmployee.city}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Pin Code</label>
                      <input
                        type="text"
                        name="pinCode"
                        value={updatedEmployee.pinCode}
                        onChange={handleChange}
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
                        value={updatedEmployee.state}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">District</label>
                      <input
                        type="text"
                        name="district"
                        value={updatedEmployee.district}
                        onChange={handleChange}
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
                      value={updatedEmployee.country}
                      onChange={handleChange}
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
                        value={updatedEmployee.policeStation}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Police Station"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Village/Post</label>
                      <input
                        type="text"
                        name="villPost"
                        value={updatedEmployee.villPost}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Village/Post"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={updatedEmployee.panNumber}
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
                    {updatedEmployee.panImage && (
                      <img
                        src={
                          typeof updatedEmployee.panImage === "string"
                            ? updatedEmployee.panImage
                            : URL.createObjectURL(updatedEmployee.panImage)
                        }
                        alt="PAN"
                        className="mt-2 h-20 w-20 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Aadhar Number</label>
                    <input
                      type="text"
                      name="aadherNumber"
                      value={updatedEmployee.aadherNumber}
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
                    {updatedEmployee?.aatherImage && (
                      <img
                        src={
                          typeof updatedEmployee.aatherImage === "string"
                            ? updatedEmployee.aatherImage
                            : URL.createObjectURL(updatedEmployee.aatherImage)
                        }
                        alt="Aadhar"
                        className="mt-2 h-20 w-20 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Base Salary</label>
                    <input
                      type="text"
                      name="baseSalary"
                      value={updatedEmployee.baseSalary}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Base Salary"
                    />
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
                        value={updatedEmployee.bankName}
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
                        value={updatedEmployee.ifscCode}
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
                      value={updatedEmployee.accountNo}
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
                        value={updatedEmployee.branch}
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
                        value={updatedEmployee.accHeadName}
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
                    {updatedEmployee?.frontPageImage && (
                      <img
                        src={
                          typeof updatedEmployee.frontPageImage === "string"
                            ? updatedEmployee.frontPageImage
                            : URL.createObjectURL(updatedEmployee.frontPageImage)
                        }
                        alt="Bank Document"
                        className="mt-2 h-20 w-20 object-cover rounded-lg"
                      />
                    )}
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
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="mr-2">Updating...</span>
                        <FiLoader className="animate-spin" />
                      </>
                    ) : (
                      "Update Employee"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

UpdateEmployee.propTypes = {
  employee: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    employeeName: PropTypes.string,
    email: PropTypes.string,
    gender: PropTypes.string,
    bloodGroup: PropTypes.string,
    religion: PropTypes.string,
    phone: PropTypes.string,
    maritialStatus: PropTypes.string,
    joiningDate: PropTypes.string,
    status: PropTypes.string,
    pinCode: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    district: PropTypes.string,
    country: PropTypes.string,
    policeStation: PropTypes.string,
    villPost: PropTypes.string,
    baseSalary: PropTypes.string,
    panNumber: PropTypes.string,
    aadharNumber: PropTypes.string,
    bankName: PropTypes.string,
    ifscCode: PropTypes.string,
    accountNo: PropTypes.string,
    branch: PropTypes.string,
    accHeadName: PropTypes.string,
    employeeImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    panImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    aatherImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    frontPageImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default UpdateEmployee;


