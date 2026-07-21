import { useTheme } from "@/context/ThemeContext";
import React, { useEffect } from "react";
import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LiaSchoolSolid } from "react-icons/lia";
import AttendanceBarComponent from "@/components/ForDashboard/AttendanceBarComponent";
import IncomeBarComponent from "@/components/ForDashboard/IncomeBarComponent";
import ExpenseBarComponent from "@/components/ForDashboard/ExpenseBarComponent";
import RecentEventsComponent from "@/components/ForDashboard/RecentEventsComponent";
import axios from "axios";
import { useSelector } from "react-redux";
import mainUrlApi from "@/common/main";
const DashboardPage = () => {
  const { theme } = useTheme();
  const [totalStudents, setTotalStudents] = React.useState(0);
  const totalTeachers = useSelector((state) => state.teacherInfo.teacherCount);
  const totalEdp = useSelector((state) => state.teacherInfo.edpCount);
  const totalClass= useSelector((state) => state.class.classCount);
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  // console.log("user : ", schoolId);
   

  // console.log("totalTeachers", totalTeachers,totalEdp);

  const fetchtotalStudents = async () => {
    const response = await axios.get(
      `${mainUrlApi.totalStudent.url}/${schoolId}`
    );
    // console.log("response : ", response.data.data);
    if (response) {
      setTotalStudents(response.data.data);
    }
  };

  useEffect(() => {
    fetchtotalStudents();
  }, []);

  return (
    <div className={` ${theme === "light" ? "dark" : "light"} h-auto lg:h-[100vh]`}>
      <div>
        {/* heading section  */}
        <div className="flex  gap-[10px] mx-14 mt-4 flex-col lg:flex-row">
          <div className="flex gap-[10px] flex-col">

            <div className="flex gap-[10px] flex-col lg:flex-row ">
              <div
                className={` ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800 "
                    : "bg-white border-slate-200"
                } w-[430px] lg:w-[278px] h-[110px] border  rounded-xl flex`}
              >
                <PiStudentBold
                  size={50}
                  className="mt-6 ml-2  rounded-md p-1 bg-slate-100 text-black "
                />
                <div className="ml-6 mt-4">
                  <h1 className="text-2xl font-bold  mt-2">{totalStudents}</h1>
                  <h3 className="text-lg ">Total Students</h3>
                </div>
              </div>

              <div className="bg-[#043072] w-[430px] lg:w-[278px] h-[110px] border border-[#E2E8F0] rounded-xl flex">
                <GiTeacher
                  size={50}
                  className="mt-6 ml-2  rounded-md p-1 bg-slate-100 text-[#858ef5]"
                />
                <div className="ml-6 mt-4">
                  <h1 className="text-2xl font-bold  mt-2 text-white">{totalTeachers}</h1>
                  <h3 className="text-lg text-white">Total Teachers</h3>
                </div>
              </div>

              <div
                className={` ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800"
                    : "bg-white border-slate-200"
                } w-[430px]  lg:w-[278px] h-[110px] border  rounded-xl flex`}
              >
                <FaChalkboardTeacher
                  size={50}
                  className="mt-6 ml-2  rounded-md p-1 bg-slate-100 text-black"
                />
                <div className="ml-6 mt-4">
                  <h1 className="text-2xl font-bold  mt-2">{totalEdp}</h1>
                  <h3 className="text-lg ">Total Edp</h3>
                </div>
              </div>

              <div
                className={` ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800 "
                    : "bg-white border-slate-200"
                } w-[430px] lg:w-[278px] h-[110px] border  rounded-xl flex`}
              >
                <LiaSchoolSolid
                  size={50}
                  className="mt-6 ml-2  rounded-md p-1 bg-slate-100 text-black "
                />
                <div className="ml-6 mt-4">
                  <h1 className="text-2xl font-bold  mt-2">{totalClass}</h1>
                  <h3 className="text-lg ">Total Class</h3>
                </div>
              </div>
            </div>

            <div className="flex gap-[10px] flex-col lg:flex-row mt-4">
              <div
                className={`w-[425px] lg:w-[565px] h-[548px] border  rounded-xl ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800 "
                    : "bg-white border-slate-200"
                }`}
              >
                <AttendanceBarComponent />
              </div>

              <div className="flex flex-col gap-[10px] ">
                <div
                  className={`w-[430px] lg:w-[565px] h-[268px] border  rounded-xl  ${
                    theme === "light"
                      ? "bg-[#212121] text-white border-gray-800 "
                      : "bg-white border-slate-200"
                  } `}
                >
                  <IncomeBarComponent />
                </div>

                <div
                  className={` w-[430px] lg:w-[565px] h-[268px] border  rounded-xl ${
                    theme === "light"
                      ? "bg-[#212121] text-white border-gray-800 "
                      : "bg-white border-slate-200"
                  } `}
                >
                  <ExpenseBarComponent />
                </div>
              </div>
            </div>
          </div>
          <div className={` w-[430px] h-[667px] rounded-xl mb-20 `}>
            <RecentEventsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
