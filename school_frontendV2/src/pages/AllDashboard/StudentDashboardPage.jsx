import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LiaSchoolSolid } from "react-icons/lia";
import RecentEventsComponent from "@/components/ForDashboard/RecentEventsComponent";
import axios from "axios";
import { useSelector } from "react-redux";
import { accountApi } from "@/common/main";
const StudentDashboardPage = () => {
  const { theme } = useTheme();
  const [totalStudents, setTotalStudents] = React.useState(0);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const [dueFees, setDueFees] = useState("");
  console.log("userDetails : ", dueFees);

  // State to track the selected day
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTab, setSelectedTab] = useState("Upcoming");

  // Mock data for routines
  const routines = {
    Mon: [
      {
        time: "08h00",
        title: "Maths Lecture",
        location: "Room 101",
        notes: "Professor Smith",
      },
      {
        time: "10h00",
        title: "Physics Lab",
        location: "Lab 2",
        notes: "Experiment 3",
      },
    ],
    Tue: [
      {
        time: "09h00",
        title: "History Seminar",
        location: "Room 202",
        notes: "Bring textbook",
      },
      {
        time: "11h30",
        title: "Biology Lab",
        location: "Lab 1",
        notes: "Dissection class",
      },
    ],
    Wed: [
      {
        time: "08h15",
        title: "Quantitative Literacy",
        location: "Bsc Lab 3rd floor RM301",
        notes: "Professor Gilmor",
      },
      {
        time: "09h30",
        title: "Quantitative Literacy Tut Group",
        location: "Bsc Lab 3rd floor RM303",
        notes: "Assignment Due 17 December",
      },
      {
        time: "10h15",
        title: "Organisational Psychology",
        location: "PC lab 1",
        notes: "",
      },
      {
        time: "12h15",
        title: "Economic History",
        location: "Upper Campus Beattie Building RM202",
        notes: "",
      },
    ],
    Thu: [
      {
        time: "09h00",
        title: "Chemistry Lecture",
        location: "Room 301",
        notes: "Homework due",
      },
      {
        time: "11h00",
        title: "Computer Science Lab",
        location: "Lab 3",
        notes: "Project discussion",
      },
    ],
    Fri: [
      {
        time: "08h30",
        title: "English Literature",
        location: "Room 102",
        notes: "Essay submission",
      },
      {
        time: "10h30",
        title: "Art Class",
        location: "Art Studio",
        notes: "Bring supplies",
      },
    ],
    Sat: [
      {
        time: "08h30",
        title: "English Literature",
        location: "Room 102",
        notes: "Essay submission",
      },
      {
        time: "10h30",
        title: "Art Class",
        location: "Art Studio",
        notes: "Bring supplies",
      },
      {
        time: "08h30",
        title: "English Literature",
        location: "Room 102",
        notes: "Essay submission",
      },
      {
        time: "10h30",
        title: "Art Class",
        location: "Art Studio",
        notes: "Bring supplies",
      },
      {
        time: "break",
        title: "Break",
      },
      {
        time: "08h30",
        title: "English Literature",
        location: "Room 102",
        notes: "Essay submission",
      },
      {
        time: "10h30",
        title: "Art Class",
        location: "Art Studio",
        notes: "Bring supplies",
      },
      {
        time: "08h30",
        title: "English Literature",
        location: "Room 102",
        notes: "Essay submission",
      },
      {
        time: "10h30",
        title: "Art Class",
        location: "Art Studio",
        notes: "Bring supplies",
      },
    ],
  };

  const examData = {
    Upcoming: [
      {
        date: "Today",
        time: "09:00 - 09:30",
        name: "Rosemarie Smitham",
        email: "rosemarie12@gmail.com",
        event: "Cansas Studio New Inquiry Discussions",
      },
      {
        date: "Today",
        time: "10:00 - 10:30",
        name: "James Lockman",
        email: "jamesloc@gmail.com",
        event: "Refining User Interface Elements",
      },
      {
        date: "Tomorrow",
        time: "13:00 - 14:30",
        name: "Wilson Kovacek",
        email: "wilsonk@gmail.com",
        event: "Ensuring Alignment with Client Vision",
      },
      {
        date: "Tomorrow",
        time: "17:00 - 18:00",
        name: "Elena Connelly",
        email: "elena@gmail.com",
        event: "Cansas Studio New Inquiry Discussions",
      },
      {
        date: "Thu, 14 Dec",
        time: "09:00 - 09:30",
        name: "Enrique Grady",
        email: "enrique89@gmail.com",
        event: "Analyzing User Interactions and Feedback",
      },
    ],
    Pending: [
      {
        date: "Mon, 11 Dec",
        time: "11:00 - 11:45",
        name: "Steve Jobs",
        email: "steve.jobs@gmail.com",
        event: "Product Review Session",
      },
    ],
    Past: [
      {
        date: "Fri, 8 Dec",
        time: "15:00 - 15:30",
        name: "Mark Wayne",
        email: "mark.wayne@gmail.com",
        event: "Final Presentation",
      },
    ],
  };

  // Map JavaScript days to routine keys (exclude Sunday)
  const dayMapping = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Set the default day to today's day (if it's not Sunday)
  useEffect(() => {
    const today = new Date();
    const currentDay = dayMapping[today.getDay()];
    if (currentDay !== "Sun") {
      setSelectedDay(currentDay);
    }
  }, []); // Runs once when the component mounts

  // Handle click for day buttons
  const handleDayClick = (day) => {
    // console.log(`Day clicked: ${day}`);
    setSelectedDay(day);
  };

  // Handle click for timeline events
  const handleEventClick = (event) => {
    // console.log(`Event clicked: ${event.title}`);
    alert(
      `Event: ${event?.title}\nLocation: ${event?.location}\nNotes: ${event?.notes}`
    );
  };


  const fetchDueFees = async ()=>{
    const response = await axios.get(`${accountApi}/student-admission-fee/admissionNumber/${userDetails.admissionNumber}`)

    if(response){
      setDueFees(response?.data?.data)
    }
  }

  useEffect(() => {
    fetchDueFees()
  }, [])

  return (
    <div
      className={` ${theme === "light" ? "dark" : "light"} h-auto md:h-[100vh]`}
    >
      <div>
        <div className="flex flex-col md:flex-row gap-[10px] mx-4 md:mx-14 mt-4 ">
          <div className="flex gap-[10px] flex-col">
            {/* heading section 4 div */}
            <div className="flex gap-[10px] flex-col md:flex-row">
              <div
                className={` ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800 "
                    : "bg-white border-slate-200"
                } w-[335px] md:w-[278px] h-[110px] border  rounded-xl flex`}
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

              <div className="bg-[#043072] w-[335px] md:w-[278px] h-[110px] border border-[#E2E8F0] rounded-xl flex">
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
                } w-[335px] md:w-[278px] h-[110px] border  rounded-xl flex`}
              >
                <FaChalkboardTeacher
                  size={50}
                  className="mt-6 ml-2  rounded-md p-1 bg-slate-100 text-black"
                />
                <div className="ml-6 mt-4">
                  <h1 className="text-2xl font-bold  mt-2">{dueFees?.remainingFee}</h1>
                  <h3 className="text-lg ">Due Fees</h3>
                </div>
              </div>

              <div
                className={` ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800 "
                    : "bg-white border-slate-200"
                } w-[335px] md:w-[278px] h-[110px] border  rounded-xl flex`}
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
            {/* 3 div for profile routine  */}
            <div className="flex gap-[10px] flex-col md:flex-row ">
              {/* for profile  */}
              <div
                className={`w-[335px] md:w-[565px] h-auto md:h-[548px] border  rounded-xl ${
                  theme === "light"
                    ? "bg-[#212121] text-white border-gray-800 "
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="p-5 ">
                  {/* Header Section */}
                  <div className="flex items-center gap-4 mb-6">
                    {/* Placeholder for Image */}
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold">
                      {userDetails.studentImage ? (
                        <img
                          src={userDetails.studentImage}
                          alt={userDetails.studentName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{userDetails.studentName.charAt(0)}</span>
                      )}
                    </div>
                    {/* Name and Roll Info */}
                    <div>
                      <h2 className="text-lg font-bold">
                        {userDetails.studentName}
                      </h2>
                      <p className="text-sm text-gray-400">
                        Roll No: {userDetails.rollNo} | Section:{" "}
                        {userDetails.section}
                      </p>
                    </div>
                  </div>

                  {/* Information Section */}
                  <div className="grid  md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold">Admission Number:</p>
                      <p>{userDetails.admissionNumber}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Admission Date:</p>
                      <p>
                        {new Date(
                          userDetails.admissionDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Father's Name:</p>
                      <p>{userDetails.fatherName}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Mother's Name:</p>
                      <p>{userDetails.motherName}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Class:</p>
                      <p>{userDetails.className}</p>
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
                      <p className="font-semibold">Parent's Phone:</p>
                      <p>{userDetails.phone}</p>
                    </div>
                    <div>
                      <p className="font-semibold">
                        Parent's Alternative Phone:
                      </p>
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
                      <p className="font-semibold">DOB:</p>
                      <p>{userDetails.dob}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Country:</p>
                      <p>{userDetails.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2 routines          */}
              <div className="flex flex-col gap-[10px] ">
                {/* for class routine  */}

                <div
                  className={`w-[335px] md:w-[565px] h-auto sm:h-[268px] border rounded-xl p-4 overflow-y-auto ${
                    theme === "light"
                      ? "bg-[#212121] text-white border-gray-800"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <h1 className="text-xl font-bold mb-4">Class Routines</h1>

                  {/* Day Tabs */}
                  <div className="flex flex-wrap justify-start sm:justify-between text-center text-sm font-medium mb-4">
                    {Object.keys(routines).map((day) => (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)} // Day button click handler
                        className={`py-1 px-3 rounded mb-2 sm:mb-0 ${
                          selectedDay === day
                            ? "bg-yellow-500 text-white"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div className="relative mt-4">
                    {/* Timeline Line */}
                    <div className="absolute top-0 left-[15px] h-full w-[2px] bg-gray-300"></div>

                    {/* Timeline Events */}
                    <div className="pl-8 space-y-4">
                      {routines[selectedDay]?.map((event, index) => (
                        <div
                          key={index}
                          className="flex items-start cursor-pointer gap-10"
                          onClick={() => handleEventClick(event)} // Event click handler
                        >
                          <span className="text-sm font-medium w-16 sm:w-10">
                            {event.time}
                          </span>
                          <div>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-xs text-gray-600">
                              {event?.location}
                            </p>
                            {event.notes && (
                              <p className="text-xs text-gray-400">
                                {event?.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500">
                          No routines available for {selectedDay}.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* for exam routine  */}

                <div
                  className={` w-[335px] md:w-[565px] h-[268px] border rounded-xl p-4 overflow-y-auto ${
                    theme === "light"
                      ? "bg-[#212121] text-white border-gray-800"
                      : "bg-white text-black border-slate-200"
                  }`}
                >
                  <h1 className="text-xl font-bold mb-4">Exam Routines</h1>

                  {/* Tabs */}
                  <div className="flex space-x-4 border-b pb-2">
                    {["Upcoming", "Pending", "Past"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`py-1 px-3 font-medium ${
                          selectedTab === tab
                            ? "border-b-2 border-blue-500 text-blue-500"
                            : "text-gray-500 hover:text-blue-400"
                        } ${tab=== "Pending" && "hidden md:block"} ${tab=== "Past" && "hidden md:block"}`}
                      >
                        {tab} ({examData[tab]?.length || 0})
                      </button>
                    ))}
                  </div>

                  {/* Table */}
                  <div className="mt-4">
                    <table className="w-full table-auto">
                      <thead className="text-left text-sm text-gray-500 border-b">
                        <tr>
                          <th className="py-2">Date</th>
                          <th>Subject Name</th>
                          <th className="hidden md:table-cell">Time</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {examData[selectedTab]?.map((exam, index) => (
                          <tr
                            key={index}
                            className="border-b hover:bg-gray-100"
                          >
                            <td className="py-2">
                              <div className="font-medium">{exam.date}</div>
                              <div className="text-gray-400 ">{exam.time}</div>
                            </td>
                            <td>
                              <div className="font-medium">{exam.name}</div>
                            </td>
                            <td className="hidden md:table-cell">{exam.event}</td>
                          </tr>
                        ))}
                        {!examData[selectedTab]?.length && (
                          <tr>
                            <td
                              colSpan="3"
                              className="text-center py-4 text-gray-500"
                            >
                              No data available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`w-[335px] md:w-[430px] h-[667px] rounded-xl  `}>
            <RecentEventsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
