import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUniversity, FaUser, FaIdCard, FaMapMarkerAlt, FaRegSave } from "react-icons/fa";
import { MdAccountBalance, MdOutlineCancel } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";

const bankUrl = import.meta.env.VITE_BASE_URL_Local;

function AddBank() {
  const [errors, setErrors] = useState({});
  const [fetchedData, setFetchedData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for form values
  const [bankDetails, setBankDetails] = useState({
    _id: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    accountHolderName: "",
  });
  const [hasExistingData, setHasExistingData] = useState(false);

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(`${bankUrl}/api/v1/bank/getBankDetails`);
      
      // Check if data exists in response
      if (
        response.data &&
        response.data.data &&
        Object.keys(response.data.data).length > 0
      ) {
        const bankData = response.data.data;
        setFetchedData(bankData);
        // Populate form values so user can edit the data
        setBankDetails({
          _id: bankData?._id,
          bankName: bankData?.bankName || "",
          accountNumber: bankData?.accountNumber || "",
          ifscCode: bankData?.ifscCode || "",
          branchName: bankData?.branchName || "",
          accountHolderName: bankData?.accountHolderName || "",
        });
        setHasExistingData(true);
      } else {
        // No data in DB; clear the form
        setFetchedData({});
        setBankDetails({
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          branchName: "",
          accountHolderName: "",
        });
        setHasExistingData(false);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      toast.error("Failed to fetch bank details");
      setHasExistingData(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!bankDetails.accountHolderName?.trim()) {
      newErrors.accountHolderName = "Account Holder Name is required";
    }
    if (!bankDetails.bankName?.trim()) {
      newErrors.bankName = "Bank name is required";
    }
    if (!bankDetails.accountNumber) {
      newErrors.accountNumber = "Account number is required";
    } else if (
      bankDetails.accountNumber.length < 9 ||
      bankDetails.accountNumber.length > 18
    ) {
      newErrors.accountNumber =
        "Account number must be between 9 and 18 digits";
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!bankDetails.ifscCode) {
      newErrors.ifscCode = "IFSC code is required";
    } else if (!ifscRegex.test(bankDetails.ifscCode.toUpperCase())) {
      newErrors.ifscCode = "Invalid IFSC code format";
    }
    if (!bankDetails.branchName?.trim()) {
      newErrors.branchName = "Branch details are required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Use the update endpoint if data exists, otherwise use add endpoint.
      const endpoint = hasExistingData
        ? `${bankUrl}/api/v1/bank/updateBankDetails/${fetchedData[0]?._id}`
        : `${bankUrl}/api/v1/bank/addBankDetails`;
      const method = hasExistingData ? "put" : "post";

      // Build payload; note that _id is included for update operations.
      const payload = {
        ...bankDetails,
        _id: bankDetails?._id, // include id for update
        bankName: bankDetails?.bankName?.toUpperCase(),
        ifscCode: bankDetails?.ifscCode?.toUpperCase(),
        branchName: bankDetails?.branchName?.toUpperCase(),
        accountHolderName: bankDetails?.accountHolderName?.toUpperCase(),
      };

      // Make the API call using the appropriate method (PUT or POST)
      const response = await axios[method](endpoint, payload);
      if (response.data.success) {
        toast.success(
          hasExistingData
            ? "Bank details updated successfully!"
            : "Bank details added successfully!"
        );
        fetchBankDetails(); // Refresh the fetched data after update/add
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error processing bank details:", error);
      toast.error("Failed to process bank details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBankDetails({
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      accountHolderName: "",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl shadow-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 py-5 px-6 sm:px-10 flex items-center">
          <MdAccountBalance className="text-white text-3xl mr-4" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {hasExistingData ? "Update Bank Account" : "Add Bank Account"}
          </h1>
        </div>
        
        <div className="p-4 sm:p-6 md:p-10">
          {hasExistingData && (
            <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border-l-4 border-green-500 flex items-start">
              <div className="mr-3 mt-0.5">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Your bank details are already present.</p>
                <p className="text-sm">You can update them below if you want to make changes.</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <FaUser className="mr-2 text-blue-500" />
                  <span>Account Holder Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="accountHolderName"
                    value={bankDetails?.accountHolderName?.toUpperCase()}
                    onChange={handleChange}
                    placeholder="JOHN DOE"
                    className={`w-full border ${
                      errors.accountHolderName ? "border-red-400" : "border-gray-300"
                    } rounded-lg p-3 pl-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700`}
                  />
                </div>
                {errors.accountHolderName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.accountHolderName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <FaUniversity className="mr-2 text-blue-500" />
                  <span>Bank Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="bankName"
                    value={bankDetails?.bankName?.toUpperCase()}
                    onChange={handleChange}
                    placeholder="STATE BANK OF INDIA"
                    className={`w-full border ${
                      errors.bankName ? "border-red-400" : "border-gray-300"
                    } rounded-lg p-3 pl-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700`}
                  />
                </div>
                {errors.bankName && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <FaIdCard className="mr-2 text-blue-500" />
                  <span>Account Number</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="accountNumber"
                    value={bankDetails?.accountNumber}
                    onChange={handleChange}
                    placeholder="12345678901"
                    className={`w-full border ${
                      errors.accountNumber ? "border-red-400" : "border-gray-300"
                    } rounded-lg p-3 pl-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700`}
                  />
                </div>
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <FaIdCard className="mr-2 text-blue-500" />
                  <span>IFSC Code</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="ifscCode"
                    value={bankDetails?.ifscCode?.toUpperCase()}
                    onChange={handleChange}
                    placeholder="SBIN0006969"
                    className={`w-full border ${
                      errors.ifscCode ? "border-red-400" : "border-gray-300"
                    } rounded-lg p-3 pl-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700`}
                  />
                </div>
                {errors.ifscCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  <span>Branch</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="branchName"
                    value={bankDetails?.branchName?.toUpperCase()}
                    onChange={handleChange}
                    placeholder="NEW DELHI"
                    className={`w-full border ${
                      errors.branchName ? "border-red-400" : "border-gray-300"
                    } rounded-lg p-3 pl-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700`}
                  />
                </div>
                {errors.branchName && (
                  <p className="text-red-500 text-sm mt-1">{errors.branchName}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MdOutlineCancel className="text-lg" />
                <span>Reset</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center cursor-pointer justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-colors shadow-md disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <BiLoaderCircle className="animate-spin text-lg" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaRegSave className="text-lg" />
                    <span>{hasExistingData ? "Update Details" : "Save Details"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBank;