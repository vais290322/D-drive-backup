import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaCalendarAlt, FaExclamationCircle, FaHistory, FaArrowUp, FaSearch } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import mainUrlApi from "@/common/main";


const PromotionHistoryPage = () => {
  const { theme } = useTheme();
  const userDetails = useSelector((state) => state.auth.userDetails);
  const schoolId = userDetails.schoolId;
  const admissionNumber = userDetails.admissionNumber;

  const [academicYear, setAcademicYear] = useState("");
  const [promotionData, setPromotionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [academicYears, setAcademicYears] = useState([]);

  // Generate dynamic academic years
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

  const handleInputChange = (e) => {
    setAcademicYear(e.target.value);
  };

  const handleFetchPromotionHistory = async () => {
    if (!academicYear) {
      setError("Please select an academic year.");
      return; 
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.get(
        `${mainUrlApi.promotionHistory.url}/${admissionNumber}/${schoolId}?academicYear=${academicYear}`
      );
      setPromotionData(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch promotion history.");
      setPromotionData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-10 ${
      theme === "light" 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" 
        : "bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 text-gray-800"
    }`}>
      <div className={`container mx-auto max-w-7xl ${
        theme === "light"
          ? "bg-gray-800 border-2 border-gray-700"
          : "bg-white border-2 border-indigo-200"
      } rounded-3xl shadow-2xl p-6 md:p-10`}>
        
        {/* Header with Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
            theme === "light" ? "bg-indigo-700" : "bg-indigo-600"
          }`}>
            <FaHistory className="text-white text-3xl" />
          </div>
          <h1 className={`text-2xl md:text-3xl font-extrabold ${
            theme === "light"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-300"
              : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-600 to-purple-600"
          } drop-shadow-lg`}>
            Promotion History
          </h1>
        </div>
        
        {/* Search Controls */}
        <div className={`${
          theme === "light" ? "bg-gray-700" : "bg-indigo-50"
        } rounded-2xl p-6 mb-8 shadow-md`}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-auto">
              <label className={`block mb-2 font-medium ${
                theme === "light" ? "text-gray-300" : "text-indigo-700"
              }`}>
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={handleInputChange}
                className={`w-full sm:w-64 px-4 py-3 rounded-lg ${
                  theme === "light" 
                    ? "bg-gray-600 border-gray-500 text-white focus:ring-indigo-500" 
                    : "border border-indigo-300 focus:ring-indigo-400 text-gray-800"
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
                onClick={handleFetchPromotionHistory}
                disabled={!academicYear || loading}
                className={`w-full sm:w-auto ${
                  theme === "light"
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
                } text-white font-bold px-8 py-3 rounded-lg shadow transition-all duration-200 flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <FaSearch /> Show History
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className={`flex items-center justify-center font-semibold py-4 px-4 rounded-xl mb-6 ${
            theme === "light" ? "bg-red-900/30 text-red-300" : "bg-red-50 text-red-600"
          }`}>
            <FaExclamationCircle className="mr-2 text-xl" /> {error}
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className={`flex justify-center items-center py-10 ${
            theme === "light" ? "text-indigo-400" : "text-indigo-600"
          }`}>
            <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="ml-3 font-semibold text-lg">Loading promotion history...</span>
          </div>
        )}
        
        {/* Promotion Data Results */}
        {promotionData.length > 0 && !loading && (
          <div className={`${
            theme === "light" ? "bg-gray-700" : "bg-white"
          } rounded-2xl shadow-lg p-6 transition-all duration-300`}>
            <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
              theme === "light" ? "text-blue-300" : "text-blue-700"
            }`}>
              <div className={`p-2 rounded-full ${
                theme === "light" ? "bg-blue-900" : "bg-blue-100"
              }`}>
                <FaArrowUp className={`${
                  theme === "light" ? "text-blue-400" : "text-blue-500"
                }`} />
              </div>
              Promotion Records for {academicYear}
            </h2>
            
            <div className="overflow-x-auto rounded-xl">
              <table className={`w-full border ${
                theme === "light" ? "bg-gray-800 border-gray-600" : "bg-white border-indigo-200"
              }`}>
                <thead>
                  <tr className={`${
                    theme === "light" 
                      ? "bg-gradient-to-r from-gray-700 to-gray-600" 
                      : "bg-gradient-to-r from-indigo-100 to-blue-100"
                  }`}>
                    <th className={`py-4 px-4 text-left ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-indigo-200"
                    } border`}>Class Name</th>
                    <th className={`py-4 px-4 text-left ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-indigo-200"
                    } border`}>Academic Year</th>
                    <th className={`py-4 px-4 text-left ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-indigo-200"
                    } border`}>Promoted Date</th>
                    <th className={`py-4 px-4 text-left ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-indigo-200"
                    } border`}>Previous Class</th>
                    <th className={`py-4 px-4 text-left ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-indigo-200"
                    } border`}>Previous Section</th>
                    <th className={`py-4 px-4 text-left ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-indigo-200"
                    } border`}>Previous Year</th>
                    <th className={`py-4 px-4 text-left ${
                      theme === "light" ? "text-gray-200 border-gray-600" : "text-gray-800 border-indigo-200"
                    } border`}>Promotion Type</th>
                  </tr>
                </thead>
                <tbody>
                  {promotionData.map((item, idx) => (
                    <tr key={item.id || idx} className={`${
                      theme === "light" 
                        ? idx % 2 === 0 ? "bg-gray-800" : "bg-gray-750 hover:bg-gray-700" 
                        : idx % 2 === 0 ? "bg-white" : "bg-indigo-50 hover:bg-indigo-100"
                    } transition-colors`}>
                      <td className={`py-3 px-4 ${
                        theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                      } border`}>{item.className}</td>
                      <td className={`py-3 px-4 ${
                        theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                      } border`}>{item.academicYear}</td>
                      <td className={`py-3 px-4 ${
                        theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                      } border`}>{item.promotedDate}</td>
                      <td className={`py-3 px-4 ${
                        theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                      } border`}>{item.previousClassName}</td>
                      <td className={`py-3 px-4 ${
                        theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                      } border`}>{item.previousSection}</td>
                      <td className={`py-3 px-4 ${
                        theme === "light" ? "text-gray-300 border-gray-600" : "text-gray-800 border-indigo-200"
                      } border`}>{item.previousAcademicYear}</td>
                      <td className={`py-3 px-4 ${
                        theme === "light" ? "border-gray-600" : "border-indigo-200"
                      } border`}>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.promotionType === "PROMOTE" 
                            ? theme === "light" ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                            : theme === "light" ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {item.promotionType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary Card */}
            <div className={`mt-6 p-4 rounded-xl ${
              theme === "light" ? "bg-gray-700" : "bg-indigo-50"
            }`}>
              <div className="flex justify-between items-center">
                <span className={`font-medium ${
                  theme === "light" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Total Records:
                </span>
                <span className={`font-bold ${
                  theme === "light" ? "text-white" : "text-indigo-800"
                }`}>
                  {promotionData.length}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* No Results */}
        {promotionData.length === 0 && !loading && !error && academicYear && (
          <div className={`flex flex-col items-center justify-center py-16 ${
            theme === "light" ? "text-gray-400" : "text-gray-500"
          }`}>
            <FaExclamationCircle className="text-5xl mb-4" />
            <p className="text-xl font-medium">No promotion history found for this academic year.</p>
            <p className="mt-2">Try selecting a different academic year.</p>
          </div>
        )}
        
        {/* Initial State */}
        {!loading && !error && !academicYear && (
          <div className={`flex flex-col items-center justify-center py-16 ${
            theme === "light" ? "text-gray-400" : "text-gray-500"
          }`}>
            <FaCalendarAlt className="text-5xl mb-4" />
            <p className="text-xl font-medium">Select an academic year to view promotion history</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionHistoryPage;