import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { CourseUrl, getAuthHeaders, PlanUrl } from "../config/config";
import toast from "react-hot-toast";

function EditCourseModal({ open, onClose, courseId, onUpdate }) {
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    durationYears: "",
    totalCourseFee: "",
    planId: "",
  });

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const durations = [
    { label: "1 Year", value: 1 },
    { label: "2 Years", value: 2 },
    { label: "3 Years", value: 3 },
    { label: "4 Years", value: 4 },
    { label: "5 Years", value: 5 },
  ];

  useEffect(() => {
    if (open && courseId) {
      fetchPlans();
      fetchCourseDetails(courseId);
    }
  }, [open, courseId]);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${PlanUrl.getPlans}`, { headers: getAuthHeaders() } );
      setPlans(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      toast.error("Error fetching plans");
    }
  };

  const fetchCourseDetails = async (id) => {
    try {
      const res = await axios.get(`${CourseUrl.getCourses}/${id}`, { headers: getAuthHeaders() } );
      const data = res.data.data;
      setFormData({
        courseName: data.course.courseName || "",
        description: data.course.description || "",
        durationYears: data.course.durationYears || "",
        totalCourseFee: data.course.totalCourseFee || "",
        planId: data.course.planId || "",
      });
    } catch (err) {
      console.error("Failed to fetch course:", err);
      toast.error("Error loading course details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "durationYears" || name === "totalCourseFee"
          ? Number(value)
          : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(`${CourseUrl.updateCourse}/${courseId}`,  { headers: getAuthHeaders() } ,formData);
      toast.success("Course updated successfully");
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
            Edit Course
          </Dialog.Title>

          <div className="space-y-4">
            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            {/* Duration and Fee */}
            <div className="grid grid-cols-2 gap-4">
              {/* Duration Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (Years)
                </label>
                <select
                  name="durationYears"
                  value={formData.durationYears}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">Select duration</option>
                  {durations.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Fee Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fee Plan
                </label>
                <select
                  name="planId"
                  value={formData.planId}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">Select a plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.planName} - ₹{plan.yearlyFee.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default EditCourseModal;
