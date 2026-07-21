import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LiaSchoolSolid } from "react-icons/lia";
import { Calendar, Mail, Phone, MapPin, Briefcase, User } from "lucide-react";
import RecentEventsComponent from "@/components/ForDashboard/RecentEventsComponent";
import axios from "axios";
import { useSelector } from "react-redux";
import mainUrlApi, { accountApi } from "@/common/main";
import teacherEdpLibraryanUrlApi from "@/common/teacherEdpLibraryan";

const EdpDashboardPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light"; // Consistent with other components
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const userDetails = useSelector((state) => state.auth.userDetails) || {};
  const user = useSelector((state) => state.auth.user) || {};
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const teachersCount = useSelector((state)=>state?.teacherInfo?.teacherCount)
  const [summary, setSummary]=useState({});

  // Fetch total students
  useEffect(() => {
    const fetchTotalStudents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${mainUrlApi.totalStudent.url}/${schoolId}`
        );
        if (response) {
          setTotalStudents(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEdpSummary  = async ()=>{
      try {
        const response = await axios.get(
          `${accountApi}/income/edp-summary/${schoolId}`
        ); 
        if(response){
          setSummary(response.data.data);
        }
      }catch(error){
        console.log("error in fetching edp summary : ", error);
      }
    }

    if (schoolId) {
      fetchTotalStudents();
      fetchEdpSummary();
    }
  }, [schoolId]);

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Profile info item component
  const ProfileInfoItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-2">
      {Icon && <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />}
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{label}</p>
        <p className={`${isDarkMode ? "text-white" : "text-gray-900"} truncate`}>{value || "Not available"}</p>
      </div>
    </div>
  );

  // Card shimmer effect during loading
  const ShimmerCard = () => (
    <div className={`rounded-xl border shadow-sm p-4 flex items-center animate-pulse ${
      isDarkMode ? "bg-[#111c38] border-[#1e2a4a]" : "bg-gray-200 border-gray-300"
    }`}>
      <div className={`w-12 h-12 rounded-lg mr-4 ${isDarkMode ? "bg-[#1a2747]" : "bg-gray-300"}`}></div>
      <div className="flex-1">
        <div className={`h-3 w-24 rounded ${isDarkMode ? "bg-[#1a2747]" : "bg-gray-300"} mb-2`}></div>
        <div className={`h-5 w-16 rounded ${isDarkMode ? "bg-[#1a2747]" : "bg-gray-300"}`}></div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-16 ${isDarkMode ? "bg-[#0c1425]" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          EDP Dashboard
        </h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {isLoading ? <ShimmerCard /> : (
            <div className={`rounded-xl border shadow-sm p-3 sm:p-4 flex items-center transition-all duration-300 hover:shadow-md ${
              isDarkMode
                ? "bg-[#111c38] text-white border-[#1e2a4a] hover:bg-[#162241]"
                : "bg-white border-slate-200 hover:border-indigo-300"
            }`}>
              <div className={`p-2 sm:p-3 rounded-lg ${isDarkMode ? "bg-[#1a2747]" : "bg-slate-100"} mr-3 sm:mr-4`}>
                <PiStudentBold size={24} className={isDarkMode ? "text-[#a3b1ff]" : "text-gray-800"} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm opacity-80">Total Students</h3>
                <p className="text-lg sm:text-xl font-bold">{isLoading ? "..." : totalStudents}</p>
              </div>
            </div>
          )}

          <div className={`rounded-xl border shadow-sm p-3 sm:p-4 flex items-center transition-all duration-300 hover:shadow-md
            bg-[#043072] text-white border-[#1a4b94] hover:bg-[#053a85]`}>
            <div className="p-2 sm:p-3 rounded-lg bg-[#1a4b94] mr-3 sm:mr-4">
              <GiTeacher size={24} className="text-[#a3b1ff]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm opacity-80">Total Teacher </h3>
              <p className="text-lg sm:text-xl font-bold">{teachersCount || 0}</p>
            </div>
          </div>

          <div className={`rounded-xl border shadow-sm p-3 sm:p-4 flex items-center transition-all duration-300 hover:shadow-md ${
            isDarkMode
              ? "bg-[#111c38] text-white border-[#1e2a4a] hover:bg-[#162241]"
              : "bg-white border-slate-200 hover:border-amber-300"
          }`}>
            <div className={`p-2 sm:p-3 rounded-lg ${isDarkMode ? "bg-[#1a2747]" : "bg-amber-100"} mr-3 sm:mr-4`}>
              <FaChalkboardTeacher size={24} className={isDarkMode ? "text-[#a3b1ff]" : "text-amber-600"} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm opacity-80">Total Income</h3>
              <p className="text-lg sm:text-xl font-bold">{summary?.totalIncome || 0}</p>
            </div>
          </div>

          <div className={`rounded-xl border shadow-sm p-3 sm:p-4 flex items-center transition-all duration-300 hover:shadow-md ${
            isDarkMode
              ? "bg-[#111c38] text-white border-[#1e2a4a] hover:bg-[#162241]"
              : "bg-white border-slate-200 hover:border-green-300"
          }`}>
            <div className={`p-2 sm:p-3 rounded-lg ${isDarkMode ? "bg-[#1a2747]" : "bg-green-100"} mr-3 sm:mr-4`}>
              <LiaSchoolSolid size={24} className={isDarkMode ? "text-[#a3b1ff]" : "text-green-600"} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm opacity-80">Total Expense</h3>
              <p className="text-lg sm:text-xl font-bold">{summary?.totalExpense || 0}</p>
              {/* <p className="text-xs opacity-70">By 5th Jun</p> */}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Profile Section */}
          <div className={`rounded-xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg ${
            isDarkMode
              ? "bg-[#111c38] text-white border-[#1e2a4a]"
              : "bg-white border-slate-200"
          }`}>
            <div className={`p-3 sm:p-4 border-b ${isDarkMode ? "border-[#1e2a4a]" : "border-gray-100"}`}>
              <h2 className="text-base sm:text-lg font-bold">Profile Information</h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-xl sm:text-2xl font-semibold overflow-hidden flex-shrink-0 ${
                  isDarkMode ? "bg-[#1a2747]" : "bg-gray-200"
                }`}>
                  {userDetails.edpImage ? (
                    <img
                      src={userDetails.edpImage}
                      alt={userDetails.edpName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userDetails?.edpName?.charAt(0) || "U"}</span>
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-bold mb-1">
                    {userDetails.edpName || "EDP Staff"}
                  </h2>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isDarkMode ? "bg-[#1a4b94] text-blue-200" : "bg-blue-100 text-blue-800"
                  }`}>
                    <span>{user || "EDP"}</span>
                  </div>
                  <p className={`mt-2 text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Staff ID: {userDetails.edpCode || "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 sm:gap-x-6">
                <div className="space-y-3 sm:space-y-4">
                  <ProfileInfoItem 
                    label="Staff Code" 
                    value={userDetails.edpCode} 
                    icon={User}
                  />
                  <ProfileInfoItem 
                    label="Joining Date" 
                    value={formatDate(userDetails.joiningDate)} 
                    icon={Calendar}
                  />
                  <ProfileInfoItem 
                    label="Department" 
                    value={userDetails.className} 
                    icon={Briefcase}
                  />
                  <ProfileInfoItem 
                    label="Gender" 
                    value={userDetails.gender} 
                  />
                  <ProfileInfoItem 
                    label="Religion" 
                    value={userDetails.religion} 
                  />
                  <ProfileInfoItem 
                    label="Blood Group" 
                    value={userDetails.bloodGroup} 
                  />
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <ProfileInfoItem 
                    label="Phone" 
                    value={userDetails.phone} 
                    icon={Phone}
                  />
                  <ProfileInfoItem 
                    label="Email" 
                    value={userDetails.email} 
                    icon={Mail}
                  />
                  <ProfileInfoItem 
                    label="Address" 
                    value={[userDetails.city, userDetails.state, userDetails.country].filter(Boolean).join(', ')} 
                    icon={MapPin}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Events Section - Fixed for scrolling */}
          <div className={`rounded-xl border shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg ${
            isDarkMode
              ? "bg-[#111c38] text-white border-[#1e2a4a]"
              : "bg-white border-slate-200"
          }`}>
            <div className="flex-1 overflow-auto max-h-[600px]">
              <RecentEventsComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdpDashboardPage;