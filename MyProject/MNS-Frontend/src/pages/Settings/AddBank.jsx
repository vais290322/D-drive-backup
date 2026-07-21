import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const bankUrl = import.meta.env.VITE_BASE_URL_Local;

function AddBank() {
  const [errors, setErrors] = useState({});
  // State for fetched data (for placeholder purposes)
  const [fetchedData, setFetchedData] = useState({});
  console.log("fatchdata",fetchedData[0]?._id);
  
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
console.log("bankDetails",bankDetails);

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(`${bankUrl}/api/v1/bank/getBankDetails`);
      console.log("API Response:", response.data.data);
      
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
    }
  };

  return (
    <div className="h-screen w-full flex items-top justify-center bg-gray-100">
      <div className="h-auto w-[80%] bg-white mt-10 rounded-2xl shadow-xl shadow-gray-200">
        <h1 className="text-4xl bg-blue-400 rounded-t-2xl py-5 px-10 text-gray-200">
          {hasExistingData ? "Update Bank Account" : "Add Bank Account"}
        </h1>
        <div className="w-auto p-10 bg-gray-100 mx-10 mt-10 shadow-2xl shadow-gray-200 rounded-2xl">
          {hasExistingData && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
              Your bank details are already present. You can update them below if you want to make changes.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <legend className="text-xl text-gray-600 font-semibold">
                Account Holder Name
              </legend>
              <input
                type="text"
                name="accountHolderName"
                value={bankDetails?.accountHolderName?.toUpperCase()}
                onChange={handleChange}
                placeholder={
                  fetchedData[0]?.accountHolderName
                    ? fetchedData[0]?.accountHolderName.toUpperCase()
                    : "John Doe"
                }
                className={`w-full border-b-2 ${
                  errors.accountHolderName
                    ? "border-red-400"
                    : "border-gray-400"
                } outline-none bg-transparent p-2 text-lg`}
              />
              {errors.accountHolderName && (
                <p className="text-red-500 text-sm">
                  {errors.accountHolderName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <legend className="text-xl text-gray-600 font-semibold">
                Bank Name
              </legend>
              <input
                type="text"
                name="bankName"
                value={bankDetails?.bankName?.toUpperCase()}
                onChange={handleChange}
                placeholder={
                  fetchedData[0]?.bankName
                    ? fetchedData[0]?.bankName.toUpperCase()
                    : "State Bank of India"
                }
                className={`w-full border-b-2 ${
                  errors.bankName ? "border-red-400" : "border-gray-400"
                } outline-none bg-transparent p-2 text-lg`}
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm">{errors.bankName}</p>
              )}
            </div>

            <div className="space-y-2">
              <legend className="text-xl text-gray-600 font-semibold">
                Account Number
              </legend>
              <input
                type="number"
                name="accountNumber"
                value={bankDetails?.accountNumber}
                onChange={handleChange}
                placeholder={fetchedData[0]?.accountNumber
                ? fetchedData[0]?.accountNumber : "12345678901"}
                className={`w-full border-b-2 ${
                  errors.accountNumber ? "border-red-400" : "border-gray-400"
                } outline-none bg-transparent p-2 text-lg`}
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm">{errors.accountNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <legend className="text-xl text-gray-600 font-semibold">
                IFSC Code
              </legend>
              <input
                type="text"
                name="ifscCode"
                value={bankDetails?.ifscCode?.toUpperCase()}
                onChange={handleChange}
                placeholder={
                  fetchedData[0]?.ifscCode
                    ? fetchedData[0]?.ifscCode.toUpperCase()
                    : "SBIN0006969"
                }
                className={`w-full border-b-2 ${
                  errors.ifscCode ? "border-red-400" : "border-gray-400"
                } outline-none bg-transparent p-2 text-lg`}
              />
              {errors.ifscCode && (
                <p className="text-red-500 text-sm">{errors.ifscCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <legend className="text-xl text-gray-600 font-semibold">
                Branch
              </legend>
              <input
                type="text"
                name="branchName"
                value={bankDetails?.branchName?.toUpperCase()}
                onChange={handleChange}
                placeholder={
                  fetchedData[0]?.branchName
                   ? fetchedData[0]?.branchName.toUpperCase()
                    : "New Delhi"
                    
                }
                className={`w-full border-b-2 ${
                  errors.branchName ? "border-red-400" : "border-gray-400"
                } outline-none bg-transparent p-2 text-lg`}
              />
              {errors.branchName && (
                <p className="text-red-500 text-sm">{errors.branchName}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-8 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {hasExistingData ? "Update Details" : "Add Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBank;
