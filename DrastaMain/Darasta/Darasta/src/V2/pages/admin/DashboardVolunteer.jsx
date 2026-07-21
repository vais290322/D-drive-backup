import React, { useEffect, useState } from "react";
import { Check, X, Eye } from "lucide-react";
import api from "../../service/index.js";
import { VolunteerTable } from "@/V2/components/admin/volunteer/index.js";
import { useToast } from "@/context/ToastContext.jsx";

// UI Components
const StatCard = ({ label, value }) => (
  <div className="bg-white shadow-md rounded-xl p-6 text-center w-full sm:w-1/3 transform transition duration-300 hover:scale-[1.03]">
    <p className="text-gray-500 font-medium mb-2">{label}</p>
    <p className="text-3xl font-bold text-purple-600">{value}</p>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-lg w-5">{icon}</div>
    <p>
      <span className="font-semibold text-gray-900">{label}:</span>{" "}
      <span className="text-gray-800">{value}</span>
    </p>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

export function DashboardVolunteer() {
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [volunteerStats, setVolunteerStats] = useState({});

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [confirmApprove, setConfirmApprove] = useState(false);
  const [approveId, setApproveId] = useState(null);

  const [confirmReject, setConfirmReject] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [allVolunteers, setAllVolunteers] = useState([]);

  const { showToast } = useToast();

  const fetchAllVolunteers = async () => {
    try {
      const {
        data: { data },
      } = await api.get("/volunteer");
      setAllVolunteers(data);
    } catch (error) {
      console.error("Error fetching active volunteers:", error);
    }
  };

  const fetchPendingVolunteers = async () => {
    try {
      const {
        data: { data },
      } = await api.get("/volunteer?active=false");
      setPendingVolunteers(data);
    } catch (error) {
      console.error("Error fetching pending volunteers:", error);
    }
  };

  const fetchVolunteerStats = async () => {
    try {
      const {
        data: { data },
      } = await api.get("/volunteer/stats");
      setVolunteerStats(data);
    } catch (error) {
      console.error("Error fetching volunteer stats:", error);
    }
  };

  const approveVolunteerRequest = async (requestId) => {
    try {
      const response = await api.put(`/volunteer/approved/${requestId}`);
      if (response.status === 200) {
        setPendingVolunteers((prev) =>
          prev.filter((req) => req._id !== requestId)
        );
        showToast("Volunteer approved successfully", "success");
        setOpenDialog(false);
        setConfirmApprove(false);
        setApproveId(null);
        fetchPendingVolunteers();
        fetchAllVolunteers();
      }
    } catch {
      showToast("Failed to approve volunteer", "error");
    }
  };

  const rejectVolunteerRequest = async (requestId) => {
    try {
      const response = await api.put(`/volunteer/reject/${requestId}`, {
        reason: rejectionReason,
      });
      if (response.status === 200) {
        setPendingVolunteers((prev) =>
          prev.filter((req) => req._id !== requestId)
        );
        showToast("Volunteer rejected successfully", "success");
        setOpenDialog(false);
        setConfirmReject(false);
        setRejectionReason("");
        setRejectId(null);
        fetchPendingVolunteers();
        fetchAllVolunteers();
      }
    } catch {
      showToast("Failed to reject volunteer", "error");
    }
  };

  useEffect(() => {
    fetchVolunteerStats();
    fetchPendingVolunteers();
    fetchAllVolunteers();
  }, []);

  return (
    <div className="p-8 md:px-20 bg-[#faf7fc] min-h-screen">
      <h1 className="text-2xl font-semibold mb-10">
        Administration - <span className="text-purple-600">Volunteer</span>
      </h1>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        <StatCard
          label="Active Volunteers"
          value={volunteerStats.activeCount}
        />
        <StatCard
          label="Last Month Activity"
          value={volunteerStats.lastMonthRegistered}
        />
        <StatCard
          label="Pending Requests"
          value={volunteerStats.inactiveCount}
        />
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-center font-semibold text-lg mb-6">
          Pending Volunteer Requests
        </h2>
        <div className="max-h-[400px] overflow-y-auto pr-2">
          {pendingVolunteers.length > 0 ? (
            pendingVolunteers.map((req, index) => (
              <div
                key={index}
                className="bg-[#fbeff2] rounded-xl p-4 mb-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={req.profileImage || "https://i.pravatar.cc/150?img=1"}
                    alt={req.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-xs text-gray-400">Requested By</p>
                    <p className="font-semibold text-black">{req.fullName}</p>
                    <p className="text-xs text-gray-400 mt-1">Skills</p>
                    <p className="text-sm text-gray-600">{req.skill}</p>
                  </div>
                </div>
                <div className="flex gap-2 pr-2">
                  <Eye
                    size={18}
                    className="text-purple-600 hover:scale-110 cursor-pointer"
                    onClick={() => {
                      setSelectedRequest(req);
                      setOpenDialog(true);
                    }}
                  />
                  <X
                    size={18}
                    className="text-red-500 hover:scale-110 cursor-pointer"
                    onClick={() => {
                      setRejectId(req.id);
                      setConfirmReject(true);
                    }}
                  />
                  <Check
                    size={18}
                    className="text-green-500 hover:scale-110 cursor-pointer"
                    onClick={() => {
                      setApproveId(req.id);
                      setConfirmApprove(true);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm opacity-80 p-4 flex justify-center">
              No records found
            </div>
          )}
        </div>
      </div>

      {/* Approved Volunteer Table */}
      <VolunteerTable
        volunteers={allVolunteers}
        fetchAllVolunteers={fetchAllVolunteers}
        fetchPendingVolunteers={fetchPendingVolunteers}
        fetchVolunteerStats={fetchVolunteerStats}
      />

      {/* Volunteer Details Dialog */}
      {openDialog && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
          <div className="bg-white/90 backdrop-blur-lg border border-white/30 shadow-xl rounded-3xl p-8 max-w-md w-full animate-scale-in transition-all duration-300 relative">
            <button
              className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600 transition"
              onClick={() => setOpenDialog(false)}
            >
              ❌
            </button>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🎯</span>
              <h3 className="text-2xl font-bold text-gray-800">
                Volunteer Details
              </h3>
            </div>
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <DetailItem
                icon="🙍‍♂️"
                label="Name"
                value={selectedRequest.fullName}
              />
              <DetailItem
                icon="📧"
                label="Email"
                value={
                  <a
                    href={`mailto:${selectedRequest.email}`}
                    className="text-blue-600 underline"
                  >
                    {selectedRequest.email}
                  </a>
                }
              />
              <DetailItem
                icon="📅"
                label="Date of Birth"
                value={formatDate(selectedRequest.dob)}
              />
              <DetailItem
                icon="💉"
                label="Blood Group"
                value={selectedRequest.bloodGroup || "N/A"}
              />
              <DetailItem
                icon="📞"
                label="Phone Number"
                value={selectedRequest.number}
              />
              <DetailItem
                icon="🗣️"
                label="Language"
                value={selectedRequest.language}
              />
              <DetailItem
                icon="🛠️"
                label="Skill"
                value={selectedRequest.skill}
              />
              <DetailItem
                icon="🎓"
                label="Preferred Role"
                value={selectedRequest.preferredRole}
              />
              <DetailItem
                icon="🏙️"
                label="Preferred City"
                value={selectedRequest.preferredCity}
              />
              <DetailItem
                icon="🗺️"
                label="Preferred State"
                value={selectedRequest.preferredState}
              />
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Dialog */}
      {confirmApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full text-center animate-scale-in transition-all duration-300 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setConfirmApprove(false)}
            >
              ×
            </button>
            <div className="mb-4">
              <span className="inline-block text-4xl mb-2 text-green-500">
                ✔️
              </span>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Approve Volunteer?
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to approve this volunteer request?
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow hover:scale-105 transition"
                onClick={() => approveVolunteerRequest(approveId)}
              >
                Yes, Approve
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
                onClick={() => setConfirmApprove(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {confirmReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full text-center animate-scale-in transition-all duration-300 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setConfirmReject(false)}
            >
              ×
            </button>
            <div className="mb-4">
              <span className="inline-block text-4xl mb-2 text-red-500">
                ✖️
              </span>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Reject Volunteer?
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject this volunteer request?
              </p>
              <input
                type="text"
                placeholder="Enter rejection reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                className="w-full px-3 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:scale-105 transition"
                onClick={() => {
                  rejectVolunteerRequest(rejectId);
                  setConfirmReject(false);
                }}
              >
                Yes, Reject
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
                onClick={() => setConfirmReject(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
