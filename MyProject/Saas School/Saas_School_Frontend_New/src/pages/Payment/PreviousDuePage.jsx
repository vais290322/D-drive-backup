import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaHistory, FaMoneyBillWave, FaUserGraduate } from "react-icons/fa";
import paymentUrlApi from "@/common/payment";
import { useTheme } from "@/context/ThemeContext";

const PreviousDuePage = () => {
  const { theme } = useTheme();
  const userDetails = useSelector((state) => state.auth.userDetails);
  const schoolId = userDetails.schoolId;
  const admissionNumber = userDetails.admissionNumber;
  const [loading, setLoading] = useState(false);
  const [dueData, setDueData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDueData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${paymentUrlApi.getDuePaymentApi.url}/${admissionNumber}/${schoolId}`
        );
        setDueData(res.data.data);
      } catch (err) {
        setError("Failed to fetch previous dues.");
      }
      setLoading(false);
    };

    if (admissionNumber && schoolId) {
      fetchDueData();
    }
  }, [admissionNumber, schoolId]);

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
            Previous Due Details
          </h1>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className={`flex justify-center items-center py-10 ${
            theme === "light" ? "text-purple-400" : "text-purple-600"
          }`}>
            <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="ml-3 font-semibold text-lg">Loading due details...</span>
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
        
        {/* Due Data Results */}
        {dueData && (
          <div>
            {/* Student Info Card */}
            <div className={`flex flex-col sm:flex-row items-center justify-between ${
              theme === "light" 
                ? "bg-gray-700 border border-gray-600" 
                : "bg-gradient-to-r from-purple-200 via-pink-100 to-yellow-100 border border-purple-100"
            } rounded-xl p-6 mb-8 shadow-md`}>
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className={`p-3 rounded-full ${
                  theme === "light" ? "bg-purple-800" : "bg-purple-200"
                }`}>
                  <FaUserGraduate className={`text-2xl ${
                    theme === "light" ? "text-purple-300" : "text-purple-600"
                  }`} />
                </div>
                <div>
                  <div className={`font-bold text-xl ${
                    theme === "light" ? "text-white" : "text-gray-800"
                  }`}>
                    {dueData.studentName || admissionNumber}
                  </div>
                  <div className={`text-sm ${
                    theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Admission No: <span className="font-mono">{admissionNumber}</span>
                  </div>
                </div>
              </div>
              {dueData.totalOutstandingDue && (
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${
                    theme === "light" ? "bg-red-900" : "bg-red-100"
                  }`}>
                    <FaMoneyBillWave className={`text-xl ${
                      theme === "light" ? "text-red-400" : "text-red-500"
                    }`} />
                  </div>
                  <div>
                    <span className={`font-bold text-xl ${
                      theme === "light" ? "text-red-400" : "text-red-600"
                    }`}>
                      ₹{dueData.totalOutstandingDue}
                    </span>
                    <div className={`text-sm ${
                      theme === "light" ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Total Outstanding Due
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Dues Table */}
            <div className={`${
              theme === "light" ? "bg-gray-700 border border-gray-600" : "bg-white"
            } rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${
                theme === "light" ? "text-blue-300" : "text-blue-700"
              }`}>
                <div className={`p-2 rounded-full ${
                  theme === "light" ? "bg-blue-900" : "bg-blue-100"
                }`}>
                  <FaCalendarAlt className={`${
                    theme === "light" ? "text-blue-400" : "text-blue-500"
                  }`} />
                </div>
                Dues By Academic Year
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
                      } border`}>Academic Year</th>
                      <th className={`py-4 px-4 text-lg ${
                        theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-purple-200"
                      } border`}>Date</th>
                      <th className={`py-4 px-4 text-lg ${
                        theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-purple-200"
                      } border`}>Class</th>
                      <th className={`py-4 px-4 text-lg ${
                        theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-purple-200"
                      } border`}>Section</th>
                      <th className={`py-4 px-4 text-lg ${
                        theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-purple-200"
                      } border`}>Remaining Fee</th>
                      <th className={`py-4 px-4 text-lg ${
                        theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-purple-200"
                      } border`}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dueData.duesByAcademicYear &&
                      Object.entries(dueData.duesByAcademicYear).map(([year, info]) => (
                        <tr key={year} className={`text-center ${
                          theme === "light" 
                            ? "hover:bg-gray-700 border-gray-600" 
                            : "hover:bg-purple-50 border-purple-200"
                        } transition-colors`}>
                          <td className={`py-4 px-4 border font-semibold ${
                            theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-purple-200"
                          }`}>{year}</td>
                          <td className={`py-4 px-4 border ${
                            theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-700 border-purple-200"
                          }`}>{info.date}</td>
                          <td className={`py-4 px-4 border ${
                            theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-700 border-purple-200"
                          }`}>{info.className}</td>
                          <td className={`py-4 px-4 border ${
                            theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-700 border-purple-200"
                          }`}>{info.section}</td>
                          <td className={`py-4 px-4 border font-semibold ${
                            theme === "light" ? "text-red-400 border-gray-600" : "text-red-600 border-purple-200"
                          }`}>₹{info.remainingFee}</td>
                          <td className={`py-4 px-4 border ${
                            theme === "light" ? "border-gray-600" : "border-purple-200"
                          }`}>
                            {info.status === "Pending" ? (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-semibold ${
                                theme === "light" ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-800"
                              }`}>
                                <FaExclamationCircle className="mr-2" /> Pending
                              </span>
                            ) : (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-semibold ${
                                theme === "light" ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-800"
                              }`}>
                                <FaCheckCircle className="mr-2" /> {info.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* No Data State */}
        {!loading && !error && !dueData && (
          <div className={`flex flex-col items-center justify-center py-16 ${
            theme === "light" ? "text-gray-400" : "text-gray-500"
          }`}>
            <FaExclamationCircle className="text-5xl mb-4" />
            <p className="text-xl font-medium">No previous due data found.</p>
            <p className="mt-2">You don't have any outstanding dues from previous academic years.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousDuePage;