import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LiaSchoolSolid } from "react-icons/lia";
import RecentEventsComponent from "@/components/ForDashboard/RecentEventsComponent";
import axios from "axios";
import { useSelector } from "react-redux";
import mainUrlApi, { accountApi } from "@/common/main";
import routineUrlApi from "@/common/routines";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import libraryUrlApi from "@/common/library";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const StudentDashboardPage = () => {
  const { theme } = useTheme();
  const [totalStudents, setTotalStudents] = React.useState(0);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const [dueFees, setDueFees] = useState("");
  const [dueBook, setDueBook] = useState([]);
  const [totalAttandance, setTotalAttendance] = useState([]);

  const schoolId = useSelector((state)=>state?.auth?.schoolId);
  // console.log("userDetails : ", userDetails);

  // State to track the selected day
  const [selectedDay, setSelectedDay] = useState("");
  const [routineData, setRoutineData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const examTypeData = useSelector((state) => state?.examType?.examType) || [];
  const [examType, setExamType] = useState("");
  
  const [showDueBooksDialog, setShowDueBooksDialog] = useState(false);

  const handleDueBooksClick = () => {
    setShowDueBooksDialog(true);
  };

  const isDarkMode = theme === "light";
 

  // Map JavaScript days to routine keys (exclude Sunday)
  const dayMapping = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Format period data from API response
  const formatPeriodData = (period) => {
    return {
      time: period.periodName.replace(/period/i, "").trim(),
      title: period.subjectName || "No Subject",
      // location: period.location || "Not specified",
      notes: period.teacherName || "No Teacher",
    };
  };

  // Process routine data from API
  const processRoutineData = (data) => {
    const formattedData = {};
    
    // Initialize days
    dayMapping.forEach(day => {
      formattedData[day] = [];
    });
    
    // Map for full day names to abbreviated versions
    const fullDayToAbbr = {
      "Sunday": "Sun",
      "Monday": "Mon",
      "Tuesday": "Tue",
      "Wednesday": "Wed",
      "Thursday": "Thu",
      "Friday": "Fri",
      "Saturday": "Sat"
    };
    
    // Process each routine item
    data.forEach(item => {
      // Convert full day name to abbreviated version if needed
      const dayAbbr = fullDayToAbbr[item.day] || item.day;
      
      if (item.day && item.periods && Array.isArray(item.periods)) {
        // Format each period for this day
        const formattedPeriods = item.periods
          .filter(period => period && period.periodName) // Filter out empty periods
          .map(formatPeriodData);
        
        // Add to the appropriate day
        if (formattedData[dayAbbr]) {
          formattedData[dayAbbr] = formattedPeriods;
        }
      }
    });
    
    return formattedData;
  };

  // Set the default day to today's day (if it's not Sunday)
  useEffect(() => {
    const today = new Date();
    const currentDay = dayMapping[today.getDay()];
    if (currentDay !== "Sun") {
      setSelectedDay(currentDay);
    } else {
      setSelectedDay("Mon"); // Default to Monday if it's Sunday
    }
  }, []); // Runs once when the component mounts

  // Handle click for day buttons
  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  // Handle click for timeline events
  const handleEventClick = (event) => {
    alert(
      `Subject: ${event?.title}\n\Teacher: ${event?.notes}`
    );
  };


  const fetchDueFees = async ()=>{
    const response = await axios.get(`${accountApi}/student-admission-fee/calculate-dues/${userDetails.admissionNumber}/${schoolId}`)

    // console.log("response for due fees : ", response);

    if(response){
      setDueFees(response?.data?.data?.totalDues || 0);
    }
  }

  useEffect(() => {
    if (userDetails?.admissionNumber && schoolId) {
      fetchDueFees();
    }
  }, [userDetails, schoolId]);

  const fetchRoutineData = async () => {
    if (!userDetails?.className || !userDetails?.section || !schoolId) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${routineUrlApi.getRoutine.url}/${schoolId}/search?className=${userDetails.className}&section=${userDetails.section}`
      );
      
      if (response.data && Array.isArray(response.data)) {
        const formattedRoutines = processRoutineData(response.data);
        setRoutineData(formattedRoutines);
        
        if (response.data.length === 0) {
          toast.info("No routines found for your class and section");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching routine data");
      console.error("Error fetching routine data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails?.className && userDetails?.section && schoolId) {
      fetchRoutineData();
    }
  }, [userDetails, schoolId]);


  // Add this state for exam routine data
  const [examRoutineData, setExamRoutineData] = useState([]);
  const [examRoutineLoading, setExamRoutineLoading] = useState(false);
  
  // Process exam routine data from API
  const processExamRoutineData = (data) => {
    if (!data || !data.subjects || !Array.isArray(data.subjects)) {
      return [];
    }
    
    // Format the exam subjects data
    return data.subjects.map(subject => ({
      date: subject.examDate ? new Date(subject.examDate).toLocaleDateString() : "N/A",
      time: `${subject.startTime} - ${subject.endTime}`,
      name: subject.subjectName || "N/A",
      examType: data.examType || "N/A"
    }));
  };

  const handleSearch = async () => {
    if (!examType) {
      toast.error("Please select exam type");
      return;
    }
    
    try {
      setExamRoutineLoading(true);
      const response = await axios.get(
        `${routineUrlApi.getExamRoutine.url}/${schoolId}/search?className=${userDetails?.className}&examType=${examType}`
      );

      // console.log("response for exam routine : ", response);

      if (response && response.data && response.data.data) {
        // Process the exam routine data
        const processedData = processExamRoutineData(response.data.data[0]);
        setExamRoutineData(processedData);
        
        if (response.data.data.length === 0) {
          toast.info("No exam routines found for the selected criteria");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch data");
    } finally {
      setExamRoutineLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails?.className && schoolId && examType) {
      handleSearch();
    }
  }, [userDetails, schoolId, examType]);

  const downloadExamRoutine = async (e) => {
    console.log("class , exam ",userDetails.className, examType)
    e.preventDefault();
    if (!userDetails?.className || !examType) {
      toast.error("Please select exam type before downloading");
      return;
    }
    
    try {
      const response = await axios.get(
        `${routineUrlApi.getExamRoutine.url}/${schoolId}/search/download?className=${userDetails?.className}&examType=${examType}`,
        {
          responseType: "blob",
        }
      );

      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `exam_routine_${userDetails?.className}_${examType}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        
        toast.success("Exam routine downloaded successfully");
      }
    } catch (error) {
      // console.error("Error downloading exam routine:", error);
      toast.error(error.response?.data?.message || "");
    }
  };

  const downloadRoutine = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.get(
        `${routineUrlApi.getRoutine.url}/${schoolId}/search/download?className=${userDetails?.className}&section=${userDetails?.section}`,
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
          `routine_${userDetails.className}_${userDetails.section}.pdf`
        );

        // Append the link to the document and trigger a click to download
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
        
        toast.success("Routine downloaded successfully");
      }
    } catch (error) {
      // console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong while downloading the routine or no routine found");
    }
  };

  const fetchDueBooks = async () => {
    try {
      const response = await axios.get(`${libraryUrlApi?.pendingBook?.url}/${userDetails.admissionNumber}/${schoolId}`);
      // console.log("response for due books : ", response);
      if (response) {
        setDueBook(response?.data?.data || {});
      } 
    } 
    catch (error) {
      console.error("Error fetching due books:", error); 
    }
  }

  const fetchTotalAttendancePercentage = async () => {
    try {
      
      const response = await axios.get(`${mainUrlApi?.attendance?.url}/attendance/student/current-month/${schoolId}/${userDetails.rollNo}?className=${userDetails?.className}&section=${userDetails?.section}`);
      // console.log("response for total attendance percentage : ", response.data?.attendancePercentage);
      if (response) {
        setTotalAttendance(response?.data?.attendancePercentage || 0);
      }
    } catch (error) {
      console.error("Error fetching total attendance percentage:", error);
    }
  }

  useEffect(() => {
    if (userDetails?.admissionNumber && schoolId) {
      fetchDueBooks();
      fetchTotalAttendancePercentage();
      // fetchTotalAttendancePercentage();
    }
  }, [userDetails, schoolId]);


  return (
    <div
      className={`${theme === "light" ? "bg-[#0c1425]" : "bg-gray-50"} min-h-screen pb-16`}
    >
      <div>
        <div className="flex flex-col lg:flex-row gap-[10px] mx-4 lg:mx-14 mt-4">
          <div className="flex gap-[10px] flex-col flex-1">
            {/* heading section 4 div */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
              <div
                className={`${
                  theme === "light"
                    ? "bg-[#111c38] text-white border-[#1e2a4a]"
                    : "bg-white border-slate-200"
                } w-full h-[110px] border rounded-xl flex items-center`}
              >
                <div className="flex-shrink-0 ml-4">
                  <div className={`p-2 rounded-md ${
                    theme === "light" 
                      ? "bg-[#1a2747] text-[#a3b1ff]" 
                      : "bg-slate-100 text-gray-800"
                  }`}>
                    <PiStudentBold size={36} />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-red-500">{totalStudents }</h1>
                  <h3 className="text-sm md:text-base">Profile</h3>
                </div>
              </div>

              <div className="bg-[#043072] w-full h-[110px] border border-[#1a4b94] rounded-xl flex items-center">
                <div className="flex-shrink-0 ml-4">
                  <div className="p-2 rounded-md bg-[#1a4b94] text-[#a3b1ff]">
                    <GiTeacher size={36} />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-white">{totalAttandance} %</h1>
                  <h3 className="text-sm md:text-base text-white">Attendance Percentage</h3>
                </div>
              </div>

              <div
                className={`${
                  theme === "light"
                    ? "bg-[#111c38] text-white border-[#1e2a4a]"
                    : "bg-white border-slate-200"
                } w-full h-[110px] border rounded-xl flex items-center`}
              >
                <div className="flex-shrink-0 ml-4">
                  <div className={`p-2 rounded-md ${
                    theme === "light" 
                      ? "bg-[#1a2747] text-[#a3b1ff]" 
                      : "bg-slate-100 text-gray-800"
                  }`}>
                    <FaChalkboardTeacher size={36} />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">{dueFees  || 0}</h1>
                  <h3 className="text-sm md:text-base">Total Due Fees</h3>
                </div>
              </div>

              <div
                className={`${
                  theme === "light"
                    ? "bg-[#111c38] text-white border-[#1e2a4a]"
                    : "bg-white border-slate-200"
                } w-full h-[110px] border rounded-xl flex items-center cursor-pointer hover:opacity-90 transition-opacity`}
                onClick={handleDueBooksClick}
              >
                <div className="flex-shrink-0 ml-4">
                  <div className={`p-2 rounded-md ${
                    theme === "light" 
                      ? "bg-[#1a2747] text-[#a3b1ff]" 
                      : "bg-slate-100 text-gray-800"
                  }`}>
                    <LiaSchoolSolid size={36} />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-sm md:text-base"> <span className="text-2xl font-bold mr-2">{dueBook.count || 0}</span>Books Due</h1>
                  <h3 className="text-sm md:text-base">
                    {dueBook?.books && dueBook?.books.length > 0 && dueBook?.books[0].returnDate 
                      ? `By ${new Date(dueBook.books[0].returnDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}` 
                      : "No due date"}
                  </h3>
                </div>
              </div>

            </div>
            
            {/* 3 div for profile routine  */}
            <div className="flex gap-[10px] flex-col lg:flex-row">
              {/* for profile  */}
              <div
                className={`w-full lg:w-1/2 h-auto lg:h-[548px] border rounded-xl ${
                  theme === "light"
                    ? "bg-[#111c38] text-white border-[#1e2a4a]"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="p-5 overflow-y-auto max-h-[548px]">
                  {/* Header Section */}
                  <div className="flex items-center gap-4 mb-6">
                    {/* Placeholder for Image */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-semibold ${
                      theme === "light" ? "bg-[#1a2747]" : "bg-gray-300"
                    }`}>
                      {userDetails?.studentImage ? (
                        <img
                          src={userDetails.studentImage}
                          alt={userDetails.studentName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{userDetails?.studentName?.charAt(0) || "S"}</span>
                      )}
                    </div>
                    {/* Name and Roll Info */}
                    <div>
                      <h2 className="text-lg font-bold">
                        {userDetails?.studentName || "Student Name"}
                      </h2>
                      <p className={`text-sm ${theme === "light" ? "text-gray-300" : "text-gray-400"}`}>
                        Roll No: {userDetails?.rollNo || "N/A"} | Section:{" "}
                        {userDetails?.section || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Information Section */}
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Admission Number:</p>
                      <p>{userDetails?.admissionNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Admission Date:</p>
                      <p>
                        {userDetails?.admissionDate ? new Date(userDetails.admissionDate).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Father's Name:</p>
                      <p>{userDetails?.fatherName || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Mother's Name:</p>
                      <p>{userDetails?.motherName || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Class:</p>
                      <p>{userDetails?.className || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Gender:</p>
                      <p>{userDetails?.gender || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Religion:</p>
                      <p>{userDetails?.religion || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Blood Group:</p>
                      <p>{userDetails?.bloodGroup || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Parent's Phone:</p>
                      <p>{userDetails?.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>
                        Parent's Alternative Phone:
                      </p>
                      <p>{userDetails?.alternativePhone || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Email:</p>
                      <p>{userDetails?.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>City:</p>
                      <p>{userDetails?.city || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>State:</p>
                      <p>{userDetails?.state || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>DOB:</p>
                      <p>{userDetails?.dob || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Country:</p>
                      <p>{userDetails?.country || "N/A"}</p>
                    </div>
                    <div>
                      <p className={`font-semibold ${theme === "light" ? "text-gray-300" : ""}`}>Academic Year:</p>
                      <p>{userDetails?.academicYear || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2 routines */}
              <div className="flex flex-col gap-[10px] w-full lg:w-1/2">
                {/* for class routine  */}
                <div
                  className={`w-full h-auto sm:h-[268px] border rounded-xl p-4 overflow-y-auto ${
                    theme === "light"
                      ? "bg-[#111c38] text-white border-[#1e2a4a]"
                      : "bg-white border-slate-200"
                  }`}
                >
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Class Routines</h1>
                    <button
                      onClick={downloadRoutine}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      disabled={!userDetails?.className || !userDetails?.section}
                    >
                      Download
                    </button>
                  </div>

                  {/* Day Tabs */}
                  <div className="flex flex-wrap justify-start gap-2 text-center text-sm font-medium mb-4">
                    {dayMapping.filter(day => day !== "Sun").map((day) => (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        className={`py-1 px-3 rounded ${
                          selectedDay === day
                            ? "bg-[#2563eb] text-white"
                            : theme === "light"
                              ? "bg-[#1a2747] text-gray-300 hover:bg-[#1e2e52]"
                              : "hover:bg-gray-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {/* Timeline */}
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="relative mt-4">
                      {/* Timeline Line */}
                      <div className="absolute top-0 left-[15px] h-full w-[2px] bg-gray-300"></div>

                      {/* Timeline Events */}
                      <div className="pl-8 space-y-4">
                        {routineData[selectedDay] && routineData[selectedDay].length > 0 ? (
                          routineData[selectedDay].map((event, index) => (
                            <div
                              key={index}
                              className="flex items-start cursor-pointer gap-4"
                              onClick={() => handleEventClick(event)}
                            >
                              <span className="text-sm font-medium w-16 sm:w-14">
                                {event.time}
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold">{event.title}</p>
                                <p className={`text-xs ${theme === "light" ? "text-gray-400" : "text-gray-600"}`}>
                                  {event.location}
                                </p>
                                {event.notes && (
                                  <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                                    {event.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className={theme === "light" ? "text-gray-400" : "text-gray-500"}>
                            No routines available for {selectedDay}.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* for exam routine  */}
                <div
                  className={`w-full h-[268px] border rounded-xl p-4 overflow-y-auto ${
                    theme === "light"
                      ? "bg-[#111c38] text-white border-[#1e2a4a]"
                      : "bg-white text-black border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Exam Routines</h1>
                    {/* <button
                      onClick={downloadExamRoutine}
                      className="px-3 py-1 cursor-pointer text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                      disabled={!examType}
                    >
                      Download
                    </button> */}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-full sm:w-auto">
                      <Select
                        onValueChange={(value) => setExamType(value)}
                      >
                        <SelectTrigger className={`w-full sm:w-[180px] ${isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : 'bg-white'}`}>
                          <SelectValue placeholder="Select exam type" />
                        </SelectTrigger>
                        <SelectContent className={isDarkMode ? 'bg-[#1e293b] border-gray-700 text-white' : ''}>
                          <SelectGroup>
                            <SelectLabel>Exam Type</SelectLabel>
                            {examTypeData?.map((item, index) => (
                              <SelectItem key={index} value={item.examTypeName}>
                                {item.examTypeName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="mt-4">
                    {examRoutineLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <table className="w-full table-auto">
                        <thead className="text-left text-sm border-b">
                          <tr>
                            <th className={`py-2 ${theme === "light" ? "text-gray-300" : "text-gray-500"}`}>Date</th>
                            <th className={theme === "light" ? "text-gray-300" : "text-gray-500"}>Subject Name</th>
                            <th className={`hidden md:table-cell ${theme === "light" ? "text-gray-300" : "text-gray-500"}`}>Time</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {examRoutineData.length > 0 ? (
                            examRoutineData.sort((a, b) => new Date(a.date) - new Date(b.date)).map((exam, index) => (
                              // console.log("exam : ",exam),
                              <tr
                                key={index}
                                className={`border-b ${theme === "light" ? "hover:bg-[#1a2747]" : "hover:bg-gray-100"}`}
                              >
                                <td className="py-2">
                                  <div className="font-medium">{new Date(exam.date).toLocaleDateString("en-GB")}</div>
                                </td>
                                <td>
                                  <div className="font-medium">{exam.name}</div>
                                </td>
                                <td className="hidden md:table-cell">{exam.time}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="3"
                                className={`text-center py-4 ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}
                              >
                                {examType ? "No exam routines available." : "Please select an exam type."}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`w-full lg:w-[430px] h-auto lg:h-[667px] rounded-xl border ${
            theme === "light" ? "border-[#1e2a4a]" : "border-slate-200"
          }`}>
            <RecentEventsComponent />
          </div>
        </div>

        <Dialog open={showDueBooksDialog} onOpenChange={setShowDueBooksDialog}>
        <DialogContent className={`sm:max-w-md ${theme === "light" ? "bg-[#111c38] text-white border-[#1e2a4a]" : "bg-white border-slate-200"}`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Due Books</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {dueBook?.books && dueBook?.books.length > 0 ? (
              <div className="space-y-4">
                {dueBook?.books?.map((book, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${theme === "light" ? "bg-[#1a2747]" : "bg-gray-100"}`}
                  >
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className={`font-semibold ${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>Book Name:</p>
                        <p className="font-medium">{book.bookName || "N/A"}</p>
                      </div>
                      <div>
                        <p className={`font-semibold ${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>Book Number:</p>
                        <p className="font-medium">{book.bookNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className={`font-semibold ${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>Quantity:</p>
                        <p className="font-medium">{book.quantity || "N/A"}</p>
                      </div>
                      <div>
                        <p className={`font-semibold ${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>Return Date:</p>
                        <p className="font-medium">{book.returnDate ? new Date(book.returnDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <div>
                        <p className={`font-semibold ${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>Status:</p>
                        <p className={`font-medium ${book.status === "Pending" ? "text-yellow-500" : "text-green-500"}`}>
                          {book.status || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className={`font-semibold ${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>Issue Date:</p>
                        <p className="font-medium">{book.issueDate ? new Date(book.issueDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4">No due books found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>


      </div>
    </div>
  );
};

export default StudentDashboardPage;
