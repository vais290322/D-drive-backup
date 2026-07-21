import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LiaSchoolSolid } from "react-icons/lia";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import AttendanceBarComponent from "@/components/ForDashboard/AttendanceBarComponent";
import IncomeBarComponent from "@/components/ForDashboard/IncomeBarComponent";
import ExpenseBarComponent from "@/components/ForDashboard/ExpenseBarComponent";
import RecentEventsComponent from "@/components/ForDashboard/RecentEventsComponent";
import axios from "axios";
import { useSelector } from "react-redux";
import mainUrlApi from "@/common/main";
import TourButton from "@/components/Tour/TourButton";
import { dashboardSteps } from "@/components/Tour/Steps/DashboardSteps/Steps";

const DashboardPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [studentGrowth, setStudentGrowth] = useState(0);
  const totalTeachers = useSelector((state) => state.teacherInfo.teacherCount);
  const totalEdp = useSelector((state) => state.teacherInfo.edpCount);
  const totalClass = useSelector((state) => state.class.classCount);
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  // const isLogin = useSelector((state) => state?.auth?.islogin);
  // console.log("is login from admin dashboard : ",isLogin)

  const fetchTotalStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${mainUrlApi.totalStudent.url}/${schoolId}`
      );
      if (response) {
        setTotalStudents(response.data.data);
        // Simulate growth data - in a real app, this would come from the API
        setStudentGrowth(Math.floor(Math.random() * 15) + 1);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalStudents();
  }, [schoolId]);

  // Stat card component for reusability
  const StatCard = ({ icon: Icon, count, title, color, growth, isLoading }) => (
    <div
      className={`stat-card w-full sm:w-[48%] md:w-[48%] lg:w-[23%] h-[110px] border rounded-xl flex items-center transition-all duration-200 ${
        color === "blue"
          ? "bg-[#043072] text-white border-[#1a4b94]"
          : isDarkMode
          ? "bg-[#111c38] text-white border-[#1e2a4a]"
          : "bg-white text-gray-800 border-slate-200 hover:shadow-md"
      }`}
    >
      <div className="flex-shrink-0 ml-4">
        <div className={`p-2 rounded-md ${
          color === "blue" 
            ? "bg-[#1a4b94] text-[#a3b1ff]" 
            : isDarkMode 
              ? "bg-[#1a2747] text-[#a3b1ff]" 
              : "bg-slate-100 text-gray-800"
        }`}>
          <Icon size={36} />
        </div>
      </div>
      <div className="ml-4">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <h1 className="text-2xl font-bold">{count}</h1>
          )}
          {growth !== undefined && (
            <div className={`flex items-center text-xs font-medium ${
              growth > 0 ? "text-green-400" : "text-red-400"
            }`}>
              {growth > 0 ? (
                <TrendingUp className="h-3 w-3 mr-0.5" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-0.5" />
              )}
              {Math.abs(growth)}%
            </div>
          )}
        </div>
        <h3 className="text-sm md:text-base">{title}</h3>
      </div>
    </div>
  );

  return (
    <div
      className={`${isDarkMode ? "bg-[#0c1425]" : "bg-gray-50"} min-h-screen pb-16`}
    >
      <div className="container mx-auto px-4 py-6">
        <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          School Dashboard
        </h1>
        
        {/* Stats Section */}
        <div className="flex flex-wrap gap-4 mb-6">
          <StatCard 
            icon={PiStudentBold} 
            count={totalStudents} 
            title="Total Students" 
            growth={studentGrowth}
            isLoading={isLoading}
          />
          <StatCard 
            icon={GiTeacher} 
            count={totalTeachers} 
            title="Total Teachers" 
            color="blue"
            growth={3}
            isLoading={isLoading}
          />
          <StatCard 
            icon={FaChalkboardTeacher} 
            count={totalEdp} 
            title="Total EDP Staff" 
            growth={1}
            isLoading={isLoading}
          />
          <StatCard 
            icon={LiaSchoolSolid} 
            count={totalClass} 
            title="Total Classes" 
            isLoading={isLoading}
          />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Attendance Chart */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              <div className={`rounded-xl border ${
                isDarkMode
                  ? "bg-[#111c38] text-white border-[#1e2a4a]"
                  : "bg-white border-slate-200"
              } overflow-hidden shadow-sm h-[500px]`}>
                <AttendanceBarComponent />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`rounded-xl border ${
                  isDarkMode
                    ? "bg-[#111c38] text-white border-[#1e2a4a]"
                    : "bg-white border-slate-200"
                } overflow-hidden shadow-sm h-[280px]`}>
                  <IncomeBarComponent />
                </div>
                
                <div className={`rounded-xl border ${
                  isDarkMode
                    ? "bg-[#111c38] text-white border-[#1e2a4a]"
                    : "bg-white border-slate-200"
                } overflow-hidden shadow-sm h-[280px]`}>
                  <ExpenseBarComponent />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Events */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl border ${
              isDarkMode
                ? "bg-[#111c38] text-white border-[#1e2a4a]"
                : "bg-white border-slate-200"
            } overflow-hidden shadow-sm h-[800px]`}>
              <RecentEventsComponent />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tour button positioned at bottom-right */}
      <div className="fixed bottom-6 right-6 z-10">
        <TourButton steps={dashboardSteps} tourName={"dashboardTour"} />
      </div>
    </div>
  );
};

export default DashboardPage;