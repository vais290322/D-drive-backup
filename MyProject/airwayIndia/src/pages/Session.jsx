import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getAuthHeaders, SessionUrl } from "../config/config";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

function SessionManagement() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionInput, setSessionInput] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SessionUrl.getSessions}`, {
        headers: getAuthHeaders(),
      });
      setSessions(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchSessions();
  // }, []);

  const handleAdd = () => {
    setEditMode(false);
    setSessionInput("");
    setModalOpen(true);
  };

  const handleEdit = (session) => {
    setEditMode(true);
    setSelectedSession(session);
    setSessionInput(session.session);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${SessionUrl.deleteSession}/${selectedSessionId}`, {
        headers: getAuthHeaders(),
      });
      toast.success("Session deleted successfully");
      fetchSessions();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete session");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (!sessionInput.trim()) return toast.error("Session cannot be empty");

    try {
      if (editMode) {
        await axios.put(
          `${SessionUrl.updateSession}/${selectedSession.id}`,
          { session: sessionInput },
          { headers: getAuthHeaders() }
        );
        toast.success("Session updated");
      } else {
        await axios.post(
          `${SessionUrl.postSession}`,
          { session: sessionInput },
          { headers: getAuthHeaders() }
        );
        toast.success("Session added");
      }
      setModalOpen(false);
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Session Management
        </h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 text-sm rounded-md font-semibold hover:bg-green-700 transition"
        >
          Add Session
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading sessions...</p>
      ) : (
        <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200 overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-hide">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-gray-100 text-gray-700 uppercase text-md tracking-wider">
              <tr>
                <th className="py-3 px-5">Sl No.</th>
                <th className="py-3 px-5">Session</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, idx) => (
                <tr
                  key={session.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-5">{idx + 1}</td>
                  <td className="py-3 px-5 font-medium ">{session.session}</td>
                  <td className="py-3 px-5 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(session)}
                        className="flex items-center gap-1 text-sm px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                      >
                        <FiEdit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSessionId(session.id);
                          setIsDeleteOpen(true);
                        }}
                        className="flex items-center gap-1 text-sm px-4 py-1.5 text-red-500 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No sessions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editMode ? "Edit Session" : "Add Session"}
            </h3>
            <input
              type="text"
              value={sessionInput}
              onChange={(e) => setSessionInput(e.target.value)}
              placeholder="e.g., 2025-26"
              className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {editMode ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}

export default SessionManagement;
