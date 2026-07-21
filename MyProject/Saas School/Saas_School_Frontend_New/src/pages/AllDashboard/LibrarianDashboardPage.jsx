import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LiaSchoolSolid } from "react-icons/lia";
import RecentEventsComponent from "@/components/ForDashboard/RecentEventsComponent";
import axios from "axios";
import { useSelector } from "react-redux";
import { User, BookOpen, BookCopy, BookMarked, BookUp } from "lucide-react";
import libraryUrlApi from "@/common/library";

const LibrarianDashboardPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const [totalStudents, setTotalStudents] = React.useState(0);
  const userDetails = useSelector((state) => state?.auth?.userDetails);
  const user = useSelector((state) => state?.auth?.user);
  const [summary, setSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const fetchLibrarianSummary = async() => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${libraryUrlApi?.librarianSummary?.url}/${schoolId}`);
      if(response?.data?.data){
        setSummary(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching librarian summary:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLibrarianSummary(); 
  }, [schoolId]);

  // Card shimmer effect during loading
  const ShimmerCard = () => (
    <div className={`w-full h-[110px] border rounded-xl animate-pulse ${
      isDarkMode ? "bg-[#1a2747] border-[#1e2a4a]" : "bg-gray-200 border-gray-300"
    }`}></div>
  );

  return (
    <div className={`${isDarkMode ? "bg-[#0c1425]" : "bg-gray-50"} min-h-screen pb-16`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Content */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-full lg:w-3/4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              {isLoading ? <ShimmerCard /> : (
                <div className={`w-full h-[110px] border rounded-xl flex items-center transition-all duration-300 hover:shadow-lg ${
                  isDarkMode
                    ? "bg-[#111c38] text-white border-[#1e2a4a] hover:bg-[#162241]"
                    : "bg-white border-slate-200 hover:border-indigo-300"
                }`}>
                  <div className="flex-shrink-0 ml-4">
                    <div className={`p-3 rounded-lg ${
                      isDarkMode 
                        ? "bg-[#1a2747] text-indigo-400" 
                        : "bg-indigo-100 text-indigo-600"
                    }`}>
                      <BookOpen size={28} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold">{summary?.totalBook || 0}</h1>
                    <h3 className="text-sm">Total Books</h3>
                  </div>
                </div>
              )}

              {/* Card 2 */}
              {isLoading ? <ShimmerCard /> : (
                <div className={`w-full h-[110px] border rounded-xl flex items-center transition-all duration-300 hover:shadow-lg ${
                  isDarkMode
                    ? "bg-[#043072] text-white border-[#1a4b94] hover:bg-[#053a85]"
                    : "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700"
                }`}>
                  <div className="flex-shrink-0 ml-4">
                    <div className={`p-3 rounded-lg ${
                      isDarkMode 
                        ? "bg-[#1a4b94] text-blue-300" 
                        : "bg-indigo-500 text-white"
                    }`}>
                      <BookCopy size={28} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold">{summary?.totalLibraryQuantity || 0}</h1>
                    <h3 className="text-sm">Total Book's Quantity</h3>
                  </div>
                </div>
              )}

              {/* Card 3 */}
              {isLoading ? <ShimmerCard /> : (
                <div className={`w-full h-[110px] border rounded-xl flex items-center transition-all duration-300 hover:shadow-lg ${
                  isDarkMode
                    ? "bg-[#111c38] text-white border-[#1e2a4a] hover:bg-[#162241]"
                    : "bg-white border-slate-200 hover:border-green-300"
                }`}>
                  <div className="flex-shrink-0 ml-4">
                    <div className={`p-3 rounded-lg ${
                      isDarkMode 
                        ? "bg-[#1a2747] text-green-400" 
                        : "bg-green-100 text-green-600"
                    }`}>
                      <BookMarked size={28} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold">{summary?.totalIssueBook || 0}</h1>
                    <h3 className="text-sm">Total Issued Books</h3>
                  </div>
                </div>
              )}

              {/* Card 4 */}
              {isLoading ? <ShimmerCard /> : (
                <div className={`w-full h-[110px] border rounded-xl flex items-center transition-all duration-300 hover:shadow-lg ${
                  isDarkMode
                    ? "bg-[#111c38] text-white border-[#1e2a4a] hover:bg-[#162241]"
                    : "bg-white border-slate-200 hover:border-amber-300"
                }`}>
                  <div className="flex-shrink-0 ml-4">
                    <div className={`p-3 rounded-lg ${
                      isDarkMode 
                        ? "bg-[#1a2747] text-amber-400" 
                        : "bg-amber-100 text-amber-600"
                    }`}>
                      <BookUp size={28} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold">{summary?.totalPendingBook || 0}</h1>
                    <h3 className="text-sm">Total Return Pending</h3>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Card */}
            <div className={`w-full border rounded-xl transition-all duration-300 hover:shadow-lg ${
              isDarkMode
                ? "bg-[#111c38] text-white border-[#1e2a4a]"
                : "bg-white border-slate-200"
            }`}>
              <div className="p-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 border-b pb-4 border-opacity-20 border-gray-500">
                  {/* Profile Image */}
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-semibold overflow-hidden ${
                    isDarkMode ? "bg-[#1a2747]" : "bg-gray-200"
                  }`}>
                    {userDetails.librarianImage ? (
                      <img
                        src={userDetails.librarianImage}
                        alt={userDetails.librarianName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{userDetails?.librarianName?.charAt(0)}</span>
                    )}
                  </div>
                  
                  {/* Name and Role Info */}
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-bold">{userDetails.librarianName}</h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        isDarkMode ? "bg-[#1a2747] text-indigo-400" : "bg-indigo-100 text-indigo-600"
                      }`}>
                        Librarian
                      </span>
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        ID: {userDetails.librarianCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Information Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Admission Number
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails.librarianCode || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Joining Date
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails.joiningDate ? new Date(userDetails.joiningDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Gender
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails.gender || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Religion
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails.religion || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Blood Group
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails.bloodGroup || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Phone
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails.phone || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Alternative Phone
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails.alternativePhone || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Email
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium truncate`}>
                      {userDetails.email || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      City
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails.city || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      State
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails.state || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Country
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails.country || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Events */}
          <div className="w-full lg:w-1/4">
            <div className={`w-full h-full rounded-xl border transition-all duration-300 hover:shadow-lg ${
              isDarkMode ? "border-[#1e2a4a]" : "border-slate-200"
            }`}>
              <RecentEventsComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboardPage;
