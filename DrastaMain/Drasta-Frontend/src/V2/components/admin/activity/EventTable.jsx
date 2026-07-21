import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "../../DeleteConfirmDialog";

export function EventTable({
  events,
  categories,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return <div className="flex justify-center py-10">Loading...</div>;
  }

  return (
    <div className="overflow-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">S.No.</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? events.map((evt, index) => (
            <tr key={evt.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{evt.eventTitle}</td>
              <td className="px-4 py-2">{evt.eventDate}</td>
              <td className="px-4 py-2">{evt.location || "—"}</td>
              <td className="px-4 py-2">
                {categories.find((c) => c.id === evt.categoryId)?.title || "—"}
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => onView(evt)}
                  className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onEdit(evt)}
                  className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                >
                  <Edit size={18} />
                </button>
                <DeleteConfirmDialog
                  onConfirm={() => onDelete(evt.id)}
                  renderTrigger={(triggerProps) => (
                    <button
                      {...triggerProps}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                No events found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
