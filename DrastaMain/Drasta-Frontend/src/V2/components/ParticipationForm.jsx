import React, { useRef, useState } from "react";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaRegClock,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import api from "../service";
import { useToast } from "@/context/ToastContext";

export default function ParticipationForm({
  open,
  onClose,
  eventId,
  startDate,
  endDate,
  location,
  eventTitle,
  totalHours,
}) {
  const {showToast} = useToast();
  const modalRef = useRef();
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    location: location || "",
    eventTitle: eventTitle || "",
    totalHours: totalHours || "",
    startDate: startDate || "",
    endDate: endDate || "",
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.fullName.trim()) {
      showToast("Full Name is required.", "error");
      return;
    }
    if (!form.mobile.trim() || !/^\d{10,15}$/.test(form.mobile.trim())) {
      showToast("Valid Mobile Number is required.", "error");
      return;
    }
    if (
      !form.email.trim() ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email.trim())
    ) {
      showToast("Valid Email is required.", "error");
      return;
    }
    if (!form.location.trim()) {
      showToast("Location is required.", "error");
      return;
    }
    if (!form.eventTitle.trim()) {
      showToast("Event Title is required.", "error");
      return;
    }
    if (
      !form.totalHours ||
      isNaN(form.totalHours) ||
      Number(form.totalHours) <= 0
    ) {
      showToast("Total Hours must be a positive number.", "error");
      return;
    }
    if (!form.startDate) {
      showToast("Start Date is required.", "error");
      return;
    }
    if (!form.endDate) {
      showToast("End Date is required.", "error");
      return;
    }
    if (form.endDate < form.startDate) {
      showToast("End Date cannot be before Start Date.", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: form.fullName,
        mobileNumber: form.mobile,
        email: form.email,
        location: location || form.location,
        eventTitle: eventTitle || form.eventTitle,
        totalHours: totalHours || form.totalHours,
        startDate: startDate || form.startDate,
        endDate: endDate || form.endDate,
        eventId: eventId || null,
      };
      await api.post("/event-participation/register", payload);
      showToast("Participation submitted successfully!", "success");
      setForm({
        fullName: "",
        mobile: "",
        email: "",
        location: location || "",
        eventTitle: eventTitle || "",
        totalHours: totalHours || "",
        startDate: startDate || "",
        endDate: endDate || "",
      });
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to submit. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative animate-fadeInUp"
        style={{
          animation: "fadeInUp 0.5s cubic-bezier(.39,.575,.565,1) both",
        }}
        onMouseDown={(e) => e.stopPropagation()} // Prevent bubbling to backdrop
      >
        {/* Header */}
        <div className="bg-[#972626] rounded-t-xl px-6 py-4 flex items-center justify-between relative">
          <span className="text-white text-lg font-bold mx-auto flex items-center gap-2">
            <FaRegClock className="inline-block text-xl" />
            Participation Form
          </span>
          <button
            className="absolute right-4 top-4 cursor-pointer text-white text-2xl font-bold hover:scale-125 transition"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        {/* Form */}
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="text-sm font-semibold mb-1 flex items-center gap-2">
              <FaUser className="text-[#972626]" /> Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border border-[#f1d3d3] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#972626]/40"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mobile */}
            <div>
              <label className="text-sm mb-1 flex items-center gap-2">
                <FaPhoneAlt className="text-[#972626]" /> Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border border-[#f1d3d3] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#972626]/40"
                placeholder="Mobile Number"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm mb-1 flex items-center gap-2">
                <FaEnvelope className="text-[#972626]" /> E-Mail
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-[#f1d3d3] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#972626]/40"
                placeholder="E-Mail"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm mb-1 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#972626]" /> Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-[#f1d3d3] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#972626]/40"
                placeholder="Location"
                required
              />
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="text-sm mb-1 flex items-center gap-2">
              <FaRegClock className="text-[#972626]" /> Event Title
            </label>
            <input
              type="text"
              name="eventTitle"
              value={form.eventTitle}
              onChange={handleChange}
              className="w-full border border-[#f1d3d3] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#972626]/40"
              placeholder="Event Title"
              required
            />
          </div>

          {/* Bottom Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Hours */}
            {/* Total Hours */}
            <div className="relative">
              <label className="text-sm mb-1 flex items-center gap-2">
                <FaRegClock className="text-[#972626]" /> Total Hours
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="totalHours"
                  value={form.totalHours}
                  onChange={handleChange}
                  className="w-full border border-[#f1d3d3] rounded px-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#972626]/40"
                  placeholder="Total Hours"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  hr
                </span>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-sm mb-1 flex items-center gap-2">
                <FaCalendarAlt className="text-[#972626]" /> Starts From
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border border-[#f1d3d3] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#972626]/40"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm mb-1 flex items-center gap-2">
                <FaCalendarAlt className="text-[#972626]" /> End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border border-[#f1d3d3] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#972626]/40"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-[#972626] transition text-white py-2 rounded font-bold text-base sm:text-lg shadow-md disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Participate"}
            </button>
          </div>
        </form>

        {/* Animation keyframes */}
        <style>
          {`
            @keyframes fadeInUp {
              0% {
                opacity: 0;
                transform: translateY(40px) scale(0.98);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}
