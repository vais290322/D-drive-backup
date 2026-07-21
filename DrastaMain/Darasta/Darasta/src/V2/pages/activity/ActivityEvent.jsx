import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import api from "@/V2/service";
import ParticipationForm from "@/V2/components/ParticipationForm";
import { BackButton } from "@/V2/components/BackButton";
import { useToast } from "@/context/ToastContext";
import { getFormattedDate } from "@/V2/utils";

export function ActivityEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [volunteerLoading, setVolunteerLoading] = useState(false);

  const handleVolunteerRegister = async () => {
    if (!eventId) return;
    setVolunteerLoading(true);
    try {
      await api.post(`/event-participation/volunteer-register/${eventId}`, {
        eventId,
      });
      showToast("You have successfully applied as a volunteer!", "success");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to apply as volunteer.";
      showToast(
        msg.toLowerCase().includes("unauthorized")
          ? "Please login as volunteer."
          : msg,
        "error"
      );
    } finally {
      setVolunteerLoading(false);
    }
  };

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const {
          data: { data },
        } = await api.get(`/events/${eventId}`);
        setEvent(data);
      } catch (error) {
        showToast(
          error?.response?.data?.message ||
            error.message ||
            "Failed to fetch event",
          "error"
        );
        navigate(-1);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 animate-pulse">
        <span className="text-2xl font-semibold text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <>
        <div className="fixed flex items-center gap-4 px-6 md:px-20 pt-10 pb-6 animate-fade-in-down">
          <BackButton className="text-[#972626] bg-white border border-[#f1d3d3] rounded-full p-3 shadow-lg hover:bg-[#f9eaea] hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex justify-center items-center py-16">
          <span className="text-2xl font-semibold text-gray-500">
            Event not found.
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className="fixed top-[7%] md:top-[8%] flex items-center gap-3 px-4 sm:px-6 md:px-20 pt-6 sm:pt-8 pb-4 sm:pb-6 animate-fade-in-down scale-[0.9] sm:scale-100 z-10">
        <BackButton className="text-[#972626] bg-white border border-[#f1d3d3] rounded-full p-2 sm:p-3 shadow-lg hover:bg-[#f9eaea] hover:scale-105 transition-transform duration-300" />
      </div>

      <div className="max-w-full md:max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-10 sm:py-14 animate-fade-in-up">
        {/* Banner */}
        {event.eventBannerUrl && (
          <div className="w-full flex justify-center mb-10 border-1 border-gray-200 rounded-xl overflow-hidden ">
            <img
              src={event.eventBannerUrl}
              alt={event.eventTitle || "Event Banner"}
              className="w-full max-h-[300px] md:max-h-[500px] object-cover rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02] bg-gray-100"
            />
          </div>
        )}

        {/* Title */}
        {event.eventTitle && (
          <h2 className="text-3xl md:text-5xl font-extrabold text-center text-[#222] mb-8">
            {event.eventTitle}
          </h2>
        )}

        {/* Info Row */}
        <div className="flex flex-wrap justify-center gap-6 text-[#444] text-base sm:text-lg mb-10">
          {event.eventDate && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>
                <strong>Start:</strong> {getFormattedDate(event.eventDate)}
              </span>
            </div>
          )}
          {event.eventEndDate && (
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>
                <strong>End:</strong> {getFormattedDate(event.eventEndDate)}
              </span>
            </div>
          )}
          {event.totalHours && (
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{event.totalHours} Hours</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <div className="text-[#333] text-base sm:text-lg leading-relaxed mb-12">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              About the Event
            </h3>
            <p>{event.description}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center mt-10 gap-6">
          <button
            onClick={() => setOpenForm(true)}
            className="cursor-pointer bg-[rgba(var(--primary-color-rgb),0.9)] hover:bg-[rgb(var(--primary-color-rgb),1)] text-white text-lg font-semibold py-3 px-10 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            Participate
          </button>
          <button
            onClick={handleVolunteerRegister}
            disabled={volunteerLoading}
            className="cursor-pointer text-[rgb(var(--primary-color-rgb),0.9)] border-2 border-[var(--primary-color)] hover:bg-[rgb(var(--primary-color-rgb),1)] hover:text-white text-lg font-semibold py-3 px-10 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-60"
          >
            {volunteerLoading ? "Applying..." : "Apply as Volunteer"}
          </button>
        </div>
      </div>

      {/* Modal Form */}
      <ParticipationForm
        eventId={eventId}
        open={openForm}
        startDate={event.eventDate}
        endDate={event.eventEndDate}
        location={event.location}
        eventTitle={event.eventTitle}
        totalHours={event.totalHours}
        onClose={() => setOpenForm(false)}
      />
    </>
  );
}
