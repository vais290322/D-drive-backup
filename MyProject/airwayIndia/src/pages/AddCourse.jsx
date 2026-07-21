import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CourseUrl, PlanUrl, getAuthHeaders } from '../config/config';

const AddCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    durationYears: '',
    planId: '',
  });

  const [plans, setPlans] = useState([]);
  const [errors, setErrors] = useState({});

  const durations = [
    { label: '1 Year', value: 1 },
    { label: '2 Years', value: 2 },
    { label: '3 Years', value: 3 },
    { label: '4 Years', value: 4 },
    { label: '5 Years', value: 5 },
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const headers = getAuthHeaders();
      // console.log('Request headers:', headers);
      const res = await axios.get(`${PlanUrl.getPlans}`, { headers: getAuthHeaders() } );
      setPlans(res.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch plans');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.courseName) newErrors.courseName = 'Course name is required';
    if (!formData.durationYears) newErrors.durationYears = 'Duration is required';
    if (!formData.planId) newErrors.planId = 'Fee plan is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const headers = getAuthHeaders();
      console.log('Request headers:', headers);
      await axios.post(CourseUrl.postCourse, formData, { headers: getAuthHeaders() } );
      navigate('/courses');
      toast.success('Course added successfully!');
    } catch (err) {
      console.error('Failed to add course:', err);
      toast.error(err.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Add New Course</h2>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Course Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            placeholder="e.g., B.Tech Computer Science"
            className="w-full border p-2 rounded-md"
            required
          />
          {errors.courseName && <p className="text-sm text-red-500">{errors.courseName}</p>}
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the course"
            className="w-full border p-2 rounded-md"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Duration (Years) <span className="text-red-500">*</span></label>
            <select
              name="durationYears"
              value={formData.durationYears}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            >
              <option value="">Select duration</option>
              {durations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            {errors.durationYears && (
              <p className="text-sm text-red-500">{errors.durationYears}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Fee Plan <span className="text-red-500">*</span></label>
            <select
              name="planId"
              value={formData.planId}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            >
              <option value="">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.planName} - ₹{plan.yearlyFee.toLocaleString()}/yr
                </option>
              ))}
            </select>
            {errors.planId && <p className="text-sm text-red-500">{errors.planId}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <button
            type="submit"
            className="bg-[#da3232] text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            Add Course
          </button>
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="border px-5 py-2 rounded-md"
          >
            Back to Courses
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
