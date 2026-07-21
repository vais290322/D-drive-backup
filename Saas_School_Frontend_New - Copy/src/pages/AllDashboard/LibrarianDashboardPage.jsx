import { useTheme } from "@/context/ThemeContext";
import React, { useEffect } from "react";
import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LiaSchoolSolid } from "react-icons/lia";
import RecentEventsComponent from "@/components/ForDashboard/RecentEventsComponent";
import axios from "axios";
import { useSelector } from "react-redux";
import { User } from "lucide-react";
const LibrarianDashboardPage = () => {
  const { theme } = useTheme();
  const [totalStudents, setTotalStudents] = React.useState(0);
  const userDetails = useSelector((state) => state?.auth?.userDetails);
  const user = useSelector((state) => state?.auth?.user);

  const schoolId = useSelector((state) => state?.auth?.schoolId);
  // console.log("id : ",schoolId);


  return (
    <div className={` ${theme === "light" ? "dark" : "light"} h-[100vh]`}>
      <div>
        {/* heading section  */}
        <div className="flex  gap-[10px] mx-14 mt-4 ">
          <div className="flex gap-[10px] flex-col">
            <div className="flex gap-[10px] ">
              <div
                className={` ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800 "
                    : "bg-white border-slate-200"
                }  w-[278px] h-[110px] border  rounded-xl flex`}
              >
                <PiStudentBold
                  size={50}
                  className="mt-6 ml-2  rounded-md p-1 bg-slate-100 text-black "
                />
                <div className="ml-6 mt-4">
                  <h1 className="text-2xl font-bold  mt-2">{totalStudents}</h1>
                  <h3 className="text-lg ">profile</h3>
                </div>
              </div>

              <div className="bg-[#043072] w-[278px] h-[110px] border border-[#E2E8F0] rounded-xl flex">
                <GiTeacher
                  size={50}
                  className="mt-6 ml-2  rounded-md p-1 bg-slate-100 text-[#858ef5]"
                />
                <div className="ml-6 mt-4">
                  <h1 className="text-2xl font-bold  mt-2 text-white">40 % </h1>
                  <h3 className="text-md text-white">Attendance Percentage </h3>
                </div>
              </div>

              <div
                className={` ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800"
                    : "bg-white border-slate-200"
                }  w-[278px] h-[110px] border  rounded-xl flex`}
              >
                <FaChalkboardTeacher
                  size={50}
                  className="mt-6 ml-2  rounded-md p-1 bg-slate-100 text-black"
                />
                <div className="ml-6 mt-4">
                  <h1 className="text-2xl font-bold  mt-2">1000</h1>
                  <h3 className="text-lg ">Due Fees</h3>
                </div>
              </div>

              <div
                className={` ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800 "
                    : "bg-white border-slate-200"
                }  w-[278px] h-[110px] border  rounded-xl flex`}
              >
                <LiaSchoolSolid
                  size={50}
                  className="mt-6 ml-2  rounded-md p-1 bg-slate-100 text-black "
                />
                <div className="ml-6 mt-4">
                  <h1 className="text-2xl font-bold  mt-2">2 Books Due</h1>
                  <h3 className="text-lg ">By 5th jun</h3>
                </div>
              </div>
            </div>

            <div className="flex gap-[10px] ">
              <div
                className={` w-[565px] h-[548px] border  rounded-xl ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800 "
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="p-5">
                  {/* Header Section */}
                  <div className="flex items-center gap-4 mb-6">
                    {/* Placeholder for Image */}
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold">
                      {userDetails.librarianImage ? (
                        <img
                          src={userDetails.librarianImage}
                          alt={userDetails.librarianName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{userDetails?.librarianName?.charAt(0)}</span>
                      )}
                    </div>
                    {/* Name and Roll Info */}
                    <div>
                      <h2 className="text-lg font-bold">
                        {userDetails.librarianName}
                      </h2>
                      <p className="text-sm text-gray-400">Roll No: {user}</p>
                    </div>
                  </div>

                  {/* Information Section */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold">Admission Number:</p>
                      <p>{userDetails.librarianCode}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Admission Date:</p>
                      <p>
                        {new Date(userDetails.joiningDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">Gender:</p>
                      <p>{userDetails.gender}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Religion:</p>
                      <p>{userDetails.religion}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Blood Group:</p>
                      <p>{userDetails.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Phone:</p>
                      <p>{userDetails.phone}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Alternative Phone:</p>
                      <p>{userDetails.alternativePhone}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Email:</p>
                      <p>{userDetails.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold">City:</p>
                      <p>{userDetails.city}</p>
                    </div>
                    <div>
                      <p className="font-semibold">State:</p>
                      <p>{userDetails.state}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Country:</p>
                      <p>{userDetails.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[10px] ">
                <div
                  className={` w-[565px] h-[268px] border  rounded-xl  ${
                    theme === "light"
                      ? "bg-[#212121] text-white border-gray-800 "
                      : "bg-white border-slate-200"
                  } `}
                >
                  <h1>Upcominig Exam Routines</h1>
                </div>

                <div
                  className={`  w-[565px] h-[268px] border  rounded-xl ${
                    theme === "light"
                      ? "bg-[#212121] text-white border-gray-800 "
                      : "bg-white border-slate-200"
                  } `}
                >
                  <h1>Class Routines</h1>
                </div>
              </div>
            </div>
          </div>
          <div className={` w-[430px] h-[667px] rounded-xl  `}>
            <RecentEventsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboardPage;
