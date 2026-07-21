import { useToast } from "@/context/ToastContext";
import { Loader } from "@/V2/components";
import api from "@/V2/service";

import { useEffect, useState } from "react";

import { FaEdit, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { Pagination } from "@/V2/components";

export const DashboardNotices = () => {
  const { showToast } = useToast();

  // data + loading flags
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // zero-based pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // new-notice form
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    date: "",
  });

  // modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNotice, setDeletingNotice] = useState(null);

  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
  const [togglingNotice, setTogglingNotice] = useState(null);

  // form handlers
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // fetch page of notices
  const fetchNotices = async (page = 0) => {
    try {
      setLoading(true);
      const res = await api.get("/notice", {
        params: { page, size: limit },
        headers: { "Content-Type": "application/json" },
      });
      const { content, totalPages: tp } = res.data.data;
      setNotices(content);
      setTotalPages(tp);
    } catch {
      showToast("Failed to fetch notices", "error");
    } finally {
      setLoading(false);
    }
  };

  // initial & whenever page changes
  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  // create
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.title || !formData.link) {
      showToast("Please fill all the fields", "error");
      return;
    }
    try {
      const newNotice = {
        date: formData.date,
        content: formData.title,
        redirectUrl: formData.link,
      };
      const res = await api.post("/notice", newNotice, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.success) {
        showToast(res.data.message, "success");
        setFormData({ title: "", link: "", date: "" });
        fetchNotices(currentPage);
      }
    } catch {
      showToast("Upload failed", "error");
      setFormData({ title: "", link: "", date: "" });
    }
  };

  // update
  const handleUpdateNotice = async () => {
    if (!editingNotice) return;
    setUpdating(true);
    try {
      const res = await api.put(
        `/notice/${editingNotice.id}`,
        {
          content: editingNotice.content,
          redirectUrl: editingNotice.redirectUrl,
          date: editingNotice.date,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.success) {
        showToast(res.data.message, "success");
        setIsEditModalOpen(false);
        fetchNotices(currentPage);
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Update failed", "error");
    } finally {
      setUpdating(false);
    }
  };

  // delete
  const handleDeleteNotice = async () => {
    if (!deletingNotice) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/notice/${deletingNotice.id}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.success) {
        showToast(res.data.message, "success");
        setIsDeleteModalOpen(false);
        fetchNotices(currentPage);
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  // toggle show/hide
  const handleToggleVisibility = async () => {
    if (!togglingNotice) return;
    try {
      const res = await api.put(`/notice/set-primary/${togglingNotice.id}`);
      if (res.data.success) {
        showToast(res.data.message, "success");
        setIsVisibilityModalOpen(false);
        fetchNotices(currentPage);
      }
    } catch {
      showToast("Visibility update failed", "error");
    }
  };

  return (
    <>
      {/* Create Notice */}
      <div className="max-w-8xl m-4 p-4 bg-white rounded-md shadow border">
        <h3 className="text-center text-sm font-semibold mb-4">
          Create New Notice
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-md p-2 bg-red-50"
              placeholder="Notice title"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Redirect Link <span className="text-red-700">*</span>
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full border rounded-md p-2 bg-red-50"
                placeholder="https://example.com"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Date <span className="text-red-700">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded-md p-2 bg-red-50"
              />
            </div>
          </div>
          <div className="text-center pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white font-semibold rounded-md"
            >
              Upload
            </button>
          </div>
        </form>
      </div>

      {/* Notices List */}
      <div className="max-w-8xl m-4 p-4 bg-white rounded-md shadow border">
        <h3 className="text-center text-base font-semibold mb-4">Notices</h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader className="animate-spin" />
            </div>
          ) : (
            notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-red-50 border rounded-md p-4 flex justify-between items-center"
              >
                <div className="flex flex-col md:flex-row md:items-center md:gap-6 text-sm">
                  <div className="mb-2 md:mb-0">
                    <p className="text-gray-500 font-medium">Uploaded On</p>
                    <p className="font-bold text-lg text-black">
                      {notice.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Title</p>
                    <p className="font-semibold text-black">{notice.content}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Show / Hide */}
                  <button
                    title={notice.showNotice ? "Hide" : "Show"}
                    onClick={() => {
                      setTogglingNotice(notice);
                      setIsVisibilityModalOpen(!notice.primary);
                    }}
                    className="group flex items-center justify-center p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-300 w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                  >
                    {notice.showNotice ? (
                      <FaEye className="w-5 h-5 text-black group-hover:text-red-500" />
                    ) : (
                      <FaEyeSlash className="w-5 h-5 text-black group-hover:text-red-500" />
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    title="Edit"
                    onClick={() => {
                      setEditingNotice(notice);
                      setIsEditModalOpen(true);
                    }}
                    className="group flex items-center justify-center p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                  >
                    <FaEdit className="w-5 h-5 text-black group-hover:text-blue-500" />
                  </button>

                  {/* Delete */}
                  <button
                    title="Delete"
                    onClick={() => {
                      setDeletingNotice(notice);
                      setIsDeleteModalOpen(true);
                    }}
                    className="group flex items-center justify-center p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                  >
                    <FaTrash className="w-5 h-5 text-black group-hover:text-red-700" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingNotice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Edit Notice</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateNotice();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editingNotice.content}
                  onChange={(e) =>
                    setEditingNotice({
                      ...editingNotice,
                      content: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Redirect Link
                </label>
                <input
                  type="url"
                  value={editingNotice.redirectUrl || ""}
                  onChange={(e) =>
                    setEditingNotice({
                      ...editingNotice,
                      redirectUrl: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={editingNotice.date}
                  onChange={(e) =>
                    setEditingNotice({
                      ...editingNotice,
                      date: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-black text-white rounded-md"
                  disabled={updating}
                >
                  {updating ? <Loader /> : "Update"}
                </button>
              </div>
            </form>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setIsEditModalOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && deletingNotice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Delete Notice
            </h3>
            <p className="text-center mb-6 text-gray-700">
              Are you sure you want to delete this notice?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleDeleteNotice}
                disabled={deleting}
              >
                {deleting ? <Loader /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visibility Modal */}
      {isVisibilityModalOpen && togglingNotice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {togglingNotice.showNotice ? "Hide Notice" : "Show Notice"}
            </h3>
            <p className="text-center mb-6 text-gray-700">
              Are you sure you want to{" "}
              {togglingNotice.showNotice ? "hide" : "make visible"} this notice?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => setIsVisibilityModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleToggleVisibility}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
