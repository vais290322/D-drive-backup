import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaMoneyCheckAlt, FaHistory, FaSearch } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import paymentUrlApi from "@/common/payment";

const PaymentHistoryPage = () => {
  const { theme } = useTheme();
  const userDetails = useSelector((state) => state.auth.userDetails);
  const schoolId = userDetails.schoolId;
  const admissionNumber = userDetails.admissionNumber;
  const [academicYear, setAcademicYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [tuitionPayments, setTuitionPayments] = useState([]);
  const [error, setError] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);

  // Generate dynamic academic years (current year + 5 years back)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Generate academic years (current + next year, and 5 years back)
    for (let i = 1; i >= -5; i--) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    
    setAcademicYears(years);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setTuitionPayments([]);
    try {
      const res = await axios.get(
        `${paymentUrlApi.getPaymentHistoryApi.url}/${schoolId}/${admissionNumber}?academicYear=${academicYear}`
      );
      const dataArr = res.data.data;
      const record = dataArr.find((item) => item.academicYear === academicYear);
      
      if (record && record.tuitionFeePayments && record.tuitionFeePayments.length > 0) {
        setTuitionPayments(record.tuitionFeePayments);
      } else {
        setTuitionPayments([]);
        setError("No tuition fee payments found for this academic year.");
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError(err?.response?.data?.message || "Failed to fetch payment history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-10 ${
      theme === "light" 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" 
        : "bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 text-gray-800"
    }`}>
      <div className={`container mx-auto max-w-6xl ${
        theme === "light"
          ? "bg-gray-800 border-2 border-gray-700"
          : "bg-white border-2 border-purple-200"
      } rounded-3xl shadow-2xl p-6 md:p-10`}>
        
        {/* Header with Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
            theme === "light" ? "bg-purple-700" : "bg-purple-600"
          }`}>
            <FaHistory className="text-white text-3xl" />
          </div>
          <h1 className={`text-2xl md:text-3xl font-extrabold ${
            theme === "light"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-yellow-300"
              : "text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-500"
          } drop-shadow-lg`}>
            Tuition Fee Payment History
          </h1>
        </div>
        
        {/* Search Controls */}
        <div className={`${
          theme === "light" ? "bg-gray-700" : "bg-purple-50"
        } rounded-2xl p-6 mb-8 shadow-md`}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-auto">
              <label className={`block mb-2 font-medium ${
                theme === "light" ? "text-gray-300" : "text-purple-700"
              }`}>
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className={`w-full sm:w-64 px-4 py-3 rounded-lg ${
                  theme === "light" 
                    ? "bg-gray-600 border-gray-500 text-white focus:ring-purple-500" 
                    : "border border-purple-300 focus:ring-purple-400 text-gray-800"
                } focus:outline-none focus:ring-2 text-lg`}
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto mt-4 sm:mt-8">
              <button
                onClick={handleSearch}
                disabled={!academicYear || loading}
                className={`w-full sm:w-auto ${
                  theme === "light"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                } text-white font-bold px-8 py-3 rounded-lg shadow transition-all duration-200 flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FaSearch /> Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Rest of the component remains unchanged */}
        {/* Loading State */}
        {loading && (
          <div className={`flex justify-center items-center py-10 ${
            theme === "light" ? "text-purple-400" : "text-purple-600"
          }`}>
            <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="ml-3 font-semibold text-lg">Loading payment history...</span>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className={`flex items-center justify-center font-semibold py-8 px-4 rounded-xl ${
            theme === "light" ? "bg-red-900/30 text-red-300" : "bg-red-50 text-red-600"
          }`}>
            <FaExclamationCircle className="mr-2 text-xl" /> {error}
          </div>
        )}
        
        {/* Payment Results */}
        {!loading && tuitionPayments.length > 0 && (
          <div className={`${
            theme === "light" ? "bg-gray-700" : "bg-white"
          } rounded-2xl shadow-lg p-6 transition-all duration-300`}>
            <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
              theme === "light" ? "text-blue-300" : "text-blue-700"
            }`}>
              <div className={`p-2 rounded-full ${
                theme === "light" ? "bg-green-800" : "bg-green-100"
              }`}>
                <FaMoneyCheckAlt className={`${
                  theme === "light" ? "text-green-400" : "text-green-500"
                }`} />
              </div>
              Tuition Fee Payments for {academicYear}
            </h2>
            
            <div className="overflow-x-auto rounded-xl">
              <table className={`w-full border ${
                theme === "light" ? "bg-gray-800 border-gray-600" : "bg-white border-purple-200"
              }`}>
                <thead>
                  <tr className={`${
                    theme === "light" 
                      ? "bg-gradient-to-r from-gray-700 to-gray-600" 
                      : "bg-gradient-to-r from-purple-100 to-pink-100"
                  }`}>
                    <th className={`py-4 px-4 text-lg ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-purple-200"
                    } border`}>Amount</th>
                    <th className={`py-4 px-4 text-lg ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-purple-200"
                    } border`}>Payment Type</th>
                    <th className={`py-4 px-4 text-lg ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-purple-200"
                    } border`}>Transaction No</th>
                    <th className={`py-4 px-4 text-lg ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-purple-200"
                    } border`}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tuitionPayments.map((payment, idx) => (
                    <tr key={idx} className={`text-center ${
                      theme === "light" 
                        ? "hover:bg-gray-700 border-gray-600" 
                        : "hover:bg-purple-50 border-purple-200"
                    } transition-colors`}>
                      <td className={`py-4 px-4 border font-semibold ${
                        payment.fee >= 0 
                          ? theme === "light" ? "text-green-400" : "text-green-700"
                          : theme === "light" ? "text-red-400" : "text-red-600"
                      }`}>
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            payment.fee >= 0
                              ? theme === "light" ? "bg-green-900" : "bg-green-100"
                              : theme === "light" ? "bg-red-900" : "bg-red-100"
                          }`}>
                            <span className={payment.fee >= 0 ? "text-green-400" : "text-red-400"}>
                              {payment.fee >= 0 ? "+" : "-"}
                            </span>
                          </div>
                          ₹{Math.abs(payment.fee)}
                        </div>
                      </td>
                      <td className={`py-4 px-4 border ${
                        theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-700 border-purple-200"
                      }`}>
                        {payment.paymentType}
                      </td>
                      <td className={`py-4 px-4 border ${
                        theme === "light" ? "border-gray-600" : "border-purple-200"
                      }`}>
                        {payment.transactionNo || (
                          <span className={theme === "light" ? "text-gray-500" : "text-gray-400"}>-</span>
                        )}
                      </td>
                      <td className={`py-4 px-4 border ${
                        theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-700 border-purple-200"
                      }`}>
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary Card */}
            <div className={`mt-6 p-4 rounded-xl ${
              theme === "light" ? "bg-gray-700" : "bg-purple-50"
            }`}>
              <div className="flex justify-between items-center">
                <span className={`font-medium ${
                  theme === "light" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Total Transactions:
                </span>
                <span className={`font-bold ${
                  theme === "light" ? "text-white" : "text-purple-800"
                }`}>
                  {tuitionPayments.length}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* No Results */}
        {!loading && !error && tuitionPayments.length === 0 && academicYear && (
          <div className={`flex flex-col items-center justify-center py-16 ${
            theme === "light" ? "text-gray-400" : "text-gray-500"
          }`}>
            <FaExclamationCircle className="text-5xl mb-4" />
            <p className="text-xl font-medium">No tuition fee payments found for this academic year.</p>
            <p className="mt-2">Try selecting a different academic year.</p>
          </div>
        )}
        
        {/* Initial State */}
        {!loading && !error && !academicYear && (
          <div className={`flex flex-col items-center justify-center py-16 ${
            theme === "light" ? "text-gray-400" : "text-gray-500"
          }`}>
            <FaCalendarAlt className="text-5xl mb-4" />
            <p className="text-xl font-medium">Select an academic year to view payment history</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;