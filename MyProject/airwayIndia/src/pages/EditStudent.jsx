import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { CourseUrl, StudentUrl, getAuthHeaders } from '../config/config';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    admissionNumber: '',
    joinYear: '',
    remarks: '',
    courseId: '',
  });

  useEffect(() => {
    fetchCourses();
    fetchStudent();
    // eslint-disable-next-line
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${CourseUrl.getCourses}`, { headers: getAuthHeaders() });
      setCourses(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch courses");
    }
  };

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`${StudentUrl.getStudents}/${id}`, { headers: getAuthHeaders() });
      const student = res.data.data;
      setForm({
        fullName: student.fullName || '',
        email: student.email || '',
        phoneNumber: student.phoneNumber || '',
        admissionNumber: student.admissionNumber || '',
        joinYear: student.joinYear || '',
        remarks: student.remarks || '',
        courseId: student.course?.id || '',
      });
    } catch (err) {
      toast.error("Failed to fetch student details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${StudentUrl.updateStudent}/${id}`,
        form,
        { headers: getAuthHeaders() }
      );
      toast.success('Student updated successfully!');
      navigate('/students');
    } catch (err) {
      toast.error('Failed to update student');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* <button
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 mb-4"
        onClick={() => navigate('/students')}
      >
        <FiArrowLeft /> Back to Students
      </button> */}

    

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Edit Student</h2>
      <p className="text-gray-500 mb-6">Update student information</p>
   

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fullName"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="phoneNumber"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Admission Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="admissionNumber"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={form.admissionNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* Course Dropdown */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              name="courseId"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={form.courseId}
              onChange={handleChange}
              required
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.courseName} - {course.feePlan?.planName || "No Plan"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Details Section */}
        {form.courseId && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4">
            <p className="font-semibold text-blue-800 mb-1">Course Details</p>
            <div className="flex justify-between text-sm text-blue-700">
              <p>
                <span className="font-medium">Plan:</span>{" "}
                {courses.find(c => c.id === form.courseId)?.feePlan?.planName || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Yearly Fee:</span>{" "}
                ₹{courses.find(c => c.id === form.courseId)?.feePlan?.yearlyFee?.toLocaleString('en-IN') || '0'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Session Year Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Session Year <span className="text-red-500">*</span>
            </label>
            <select
              name="joinYear"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={form.joinYear}
              onChange={handleChange}
              required
            >
              <option value="">Select year</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Remarks</label>
            <textarea
              name="remarks"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              rows={2}
              value={form.remarks}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-[#da3232]  transition text-white px-6 py-2 rounded-md font-medium "
          >
            Update Student
          </button>
          <button
            type="button"
            className="border border-gray-300 px-6 py-2 rounded-md font-medium hover:bg-gray-100"
            onClick={() => navigate('/students')}
          >
            Back to Students
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
