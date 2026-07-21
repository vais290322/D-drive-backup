import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { CustomDialog } from "@/components";
import api from "@/V2/service";
import { ReusableVolunteerForm } from "../../volunteer";
import { EditVolunteerForm } from ".";
import { useToast } from "@/context/ToastContext";

export function VolunteerTable({
  volunteers = [],
  fetchAllVolunteers,
  fetchVolunteerStats,
  fetchPendingVolunteers,
}) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [editData, setEditData] = useState({});

  const { showToast } = useToast();

  const handleViewDetails = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setViewOpen(true);
  };

  const handleEdit = (volunteer) => {
    setEditData(volunteer);
    setEditOpen(true);
  };

  const handleDelete = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/volunteer/${selectedVolunteer.id}`);
      setDeleteOpen(false);
      showToast("Volunteer deleted successfully", "success");
      fetchAllVolunteers();
    } catch {
      showToast("Failed to delete volunteer", "error");
    }
  };

  return (
    <div className="mt-10 bg-whit p-8 rounded-2xl shadow-lg ">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        All Volunteers
      </h2>

      <div className="overflow-auto max-h-[500px] h-full ">
        <table className="w-full">
          <thead className="text-sm text-gray-600 uppercase bg-gray-100 ">
            <tr>
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 hidden md:table-cell">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 hidden md:table-cell">Phone</th>
              <th className="px-4 py-3 hidden lg:table-cell">State</th>
              <th className="px-4 py-3 hidden lg:table-cell">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.length > 0 ? (
              volunteers.map((vol, index) => (
                <tr
                  key={vol.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {vol.fullName}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell break-all">
                    {vol.email}
                  </td>
                  <td className="px-4 py-3">{vol.preferredRole}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {vol.number}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {vol.preferredState}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                        vol.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : vol.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {vol.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-4">
                      <Eye
                        className="w-5 h-5 text-purple-600 cursor-pointer hover:scale-110 transition"
                        onClick={() => handleViewDetails(vol)}
                      />
                      <Pencil
                        className="w-5 h-5 text-blue-600 cursor-pointer hover:scale-110 transition"
                        onClick={() => handleEdit(vol)}
                      />
                      <Trash2
                        className="w-5 h-5 text-red-600 cursor-pointer hover:scale-110 transition"
                        onClick={() => handleDelete(vol)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-8">
                  No volunteers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Dialog */}
      <CustomDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        title="Volunteer Details"
      >
        {selectedVolunteer && (
          <div className="p-4">
            <div className="flex justify-center mb-4">
              <img
                src={
                  selectedVolunteer.profileImage ||
                  "https://i.pravatar.cc/150?img=1"
                }
                alt={selectedVolunteer.fullName}
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "fullName",
                "email",
                "number",
                "preferredRole",
                "language",
                "skill",
                "bloodGroup",
                "preferredState",
                "preferredCity",
                "description",
                "status",
                "createdAt",
              ].map((field) => (
                <div key={field} className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="text-base text-gray-800 break-all">
                    {selectedVolunteer[field]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CustomDialog>

      {/* Edit Dialog */}
      <CustomDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Volunteer"
      >
        {editData && (
          <EditVolunteerForm
            data={editData}
            onClose={() => setEditOpen(false)}
            onSuccess={() => {
              fetchAllVolunteers();
              fetchPendingVolunteers();
              fetchPendingVolunteers();
            }}
          />
        )}
      </CustomDialog>

      {/* Delete Confirmation Dialog */}
      <CustomDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Confirm Delete"
      >
        <div className="p-4">
          <p className="text-gray-800">
            Are you sure you want to delete{" "}
            <strong>{selectedVolunteer?.fullName}</strong>?
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
}
