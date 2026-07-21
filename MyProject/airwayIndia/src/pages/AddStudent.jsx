import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CourseUrl, PlanUrl, StudentUrl, getAuthHeaders, SessionUrl } from "../config/config";
import toast from "react-hot-toast";
// ... imports remain unchanged
function AddStudent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    admissionNumber: "",
    joinYear: "2025",
    courseId: "",
    category: "",
    remarks: "",
  });

  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
const [sessions, setSessions] = useState([]);
useEffect(() => {
  fetchCourses();
  fetchPlans();
  fetchSessions(); 
}, []);

const fetchSessions = async () => {
  try {
    const res = await axios.get(`${SessionUrl.getSessions}`, {
      headers: getAuthHeaders(),
    });
    setSessions(res.data?.data || []);
  } catch (err) {
    console.error("Failed to fetch sessions:", err);
    toast.error(err.response?.data?.message || "Failed to fetch sessions");
  }
};


  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${CourseUrl.getCourses}`, { headers: getAuthHeaders() });
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      toast.error(err.response?.data?.message || "Failed to fetch courses");
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${PlanUrl.getPlans}`, { headers: getAuthHeaders() });
      setPlans(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      toast.error(err.response?.data?.message || "Failed to fetch plans");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find selected course
    const selectedCourse = courses.find(c => c.id === formData.courseId);
    const selectedPlanName = selectedCourse?.feePlan?.planName || "";

    const payload = {
      ...formData,
      category: selectedPlanName
    };

    try {
      await axios.post(`${StudentUrl.postStudent}`, payload, { headers: getAuthHeaders() });
      toast.success("Student added successfully!");
      navigate("/students");
    } catch (err) {
      console.error("Error adding student:", err);
      toast.error(err.response?.data?.message || "Failed to add student");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-5">
      <h2 className="text-2xl font-bold mb-1 text-gray-800">Add New Student</h2>
      <p className="text-sm text-gray-500 mb-6">Register a new student</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Full Name <span className="text-red-500">*</span></label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email Address <span className="text-red-500">*</span></label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Phone Number <span className="text-red-500">*</span></label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="+91 9876543210"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Admission Number <span className="text-red-500">*</span></label>
            <input
              name="admissionNumber"
              value={formData.admissionNumber}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="2024001"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Course <span className="text-red-500">*</span></label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-md"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName} - {course.feePlan?.planName || "No Plan"}
                </option>
              ))}
            </select>
          </div>
<div>
  <label className="block mb-1 font-medium">Session Year <span className="text-red-500">*</span></label>
  <select
    name="joinYear"
    value={formData.joinYear}
    onChange={handleChange}
    required
    className="w-full border px-4 py-2 rounded-md"
  >
    <option value="">Select a session year</option>
    {sessions.map((session) => (
      <option key={session.id} value={session.sessionYear}>
        {session.session}
      </option>
    ))}
  </select>
</div>


        </div>

        {/* <div>
          <label className="block mb-1 font-medium">Plan</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          >
            <option value="">Select a plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.planName}>
                {plan.planName}
              </option>
            ))}
          </select>
        </div> */}

        <div>
          <label className="block mb-1 font-medium">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            placeholder="Any additional notes about the student"
          ></textarea>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className=" bg-green-600 text-white rounded-md font-medium  transition px-6 py-2 "
          >
            Add Student
          </button>
          <button
            type="button"
            onClick={() => navigate("/students")}
            className="bg-[#da3232] text-white font-medium  transition px-6 py-2 rounded-md"
          >
            Back to Students
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudent;
