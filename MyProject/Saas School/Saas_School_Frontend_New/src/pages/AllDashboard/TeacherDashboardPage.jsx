import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LiaSchoolSolid } from "react-icons/lia";
import RecentEventsComponent from "@/components/ForDashboard/RecentEventsComponent";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ChatWithSupport from "@/components/Chat/ChatWithSupport";
import { teacherRoutine } from "@/common/routines";
import teacherEdpLibraryanUrlApi from "@/common/teacherEdpLibraryan";

const TeacherDashboardPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const [totalStudents, setTotalStudents] = React.useState(0);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const user = useSelector((state) => state.auth.user);
  const schoolId=useSelector((state)=>state?.auth?.schoolId)
  const [summary, setSummary]= useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // console.log("id : ",schoolId)

  const downloadRoutine = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${teacherRoutine}/api/v1/routine/teacher/${schoolId}/pdf?teacherName=${userDetails?.teachersName}`,
        {
          responseType: "blob",
        }
      );

      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Set the filename for the download
        link.setAttribute(
          "download",
          `routine_${userDetails?.teachersName}.pdf`
        );

        // Append the link to the document and trigger a click to download
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);

        // console.log("PDF downloaded successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "no routine found for you enjoy your day"
      );
    }
  };

const fetchTeacherSummary = async () => {
  setIsLoading(true);
  try {
    // api/teacher-summary/{teacherId}/{schoolId}
    const response = await axios.get(`${teacherEdpLibraryanUrlApi?.fetchTeacherSummary?.url}/${userDetails?.id}/${schoolId}`);
    console.log("response from teacher dashboard: ", response);
    const data = response?.data?.data;
    setSummary(data);
  } catch (error) {
    console.error("Error fetching teacher summary:", error);
  } finally {
    setIsLoading(false);
  }
}

useEffect(() => {
  if (schoolId && userDetails?.id) {
    fetchTeacherSummary();
  }
}, [schoolId, userDetails?.id]);

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
        <div className="py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                      ? "bg-[#1a2747] text-[#a3b1ff]" 
                      : "bg-slate-100 text-gray-800"
                  }`}>
                    <PiStudentBold size={28} />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">{summary?.allAssignment || 0}</h1>
                  <h3 className="text-sm">All Assignment</h3>
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
                      ? "bg-[#1a4b94] text-[#a3b1ff]" 
                      : "bg-indigo-500 text-white"
                  }`}>
                    <GiTeacher size={28} />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">{summary?.activeAssignment || 0}</h1>
                  <h3 className="text-sm">Active Assignment</h3>
                </div>
              </div>
            )}

            {/* Card 3 */}
            {isLoading ? <ShimmerCard /> : (
              <div className={`w-full h-[110px] border rounded-xl flex items-center transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? "bg-[#111c38] text-white border-[#1e2a4a] hover:bg-[#162241]"
                  : "bg-white border-slate-200 hover:border-amber-300"
              }`}>
                <div className="flex-shrink-0 ml-4">
                  <div className={`p-3 rounded-lg ${
                    isDarkMode 
                      ? "bg-[#1a2747] text-[#a3b1ff]" 
                      : "bg-amber-100 text-amber-600"
                  }`}>
                    <FaChalkboardTeacher size={28} />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">{summary?.dueDateAssignment || 0}</h1>
                  <h3 className="text-sm">Due Assignment</h3>
                </div>
              </div>
            )}

            {/* Card 4 */}
            {isLoading ? <ShimmerCard /> : (
              <div className={`w-full h-[110px] border rounded-xl flex items-center transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? "bg-[#111c38] text-white border-[#1e2a4a] hover:bg-[#162241]"
                  : "bg-white border-slate-200 hover:border-green-300"
              }`}>
                <div className="flex-shrink-0 ml-4">
                  <div className={`p-3 rounded-lg ${
                    isDarkMode 
                      ? "bg-[#1a2747] text-[#a3b1ff]" 
                      : "bg-green-100 text-green-600"
                  }`}>
                    <LiaSchoolSolid size={28} />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">{summary?.closedAssignment || 0}</h1>
                  <h3 className="text-sm">Closed Assignment</h3>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Card */}
            <div className={`w-full border rounded-xl transition-all duration-300 hover:shadow-lg ${
              isDarkMode
                ? "bg-[#111c38] text-white border-[#1e2a4a]"
                : "bg-white border-slate-200"
            }`}>
              <div className="p-5">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-6 border-b pb-4 border-opacity-20 border-gray-500">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-semibold overflow-hidden ${
                    isDarkMode ? "bg-[#1a2747]" : "bg-gray-300"
                  }`}>
                    {userDetails?.teachersImage ? (
                      <img
                        src={userDetails.teachersImage}
                        alt={userDetails.teachersName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{userDetails?.teachersName?.charAt(0)}</span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      {userDetails?.teachersName || "Teacher"}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        isDarkMode ? "bg-[#1a2747] text-indigo-400" : "bg-indigo-100 text-indigo-600"
                      }`}>
                        {user || "Teacher"}
                      </span>
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        ID: {userDetails?.teachersCode || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Information Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Teacher's Code:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails?.teachersCode || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Joining Date:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails?.joiningDate ? new Date(userDetails.joiningDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Subject:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails?.subject || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Gender:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails?.gender || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Religion:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails?.religion || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Blood Group:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails?.bloodGroup || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Phone:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails?.phone || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Email:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium truncate`}>
                      {userDetails?.email || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      City:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails?.city || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      State:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails?.state || "N/A"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Country:
                    </p>
                    <p className={`${isDarkMode ? "text-white" : "text-gray-800"} font-medium`}>
                      {userDetails?.country || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex justify-center sm:justify-start">
                  <Button
                    onClick={(e) => {
                      downloadRoutine(e);
                    }}
                    className={`${isDarkMode ? "bg-[#2563eb] hover:bg-[#1d4ed8]" : "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500"}`}
                  >
                    Download Your Class Routine
                  </Button>
                </div>
              </div>
            </div>

            {/* Events Card */}
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

export default TeacherDashboardPage;
