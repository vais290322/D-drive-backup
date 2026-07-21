import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi";

const baseUrl = import.meta.env.VITE_REACT_BASE_URL;

const DirectorsDesk = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, entry: null });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;



  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch(`${baseUrl}/directors-desk`);
        const data = await res.json();
        console.log("Fetched entries:", data);
        if (data && Array.isArray(data.directors)) {
          setEntries(data.directors);
        } else if (Array.isArray(data)) {
          setEntries(data);
        } else {
          setEntries([]);
        }
      } catch {
        setEntries([]);
      }
    };
    fetchEntries();
  }, []);

  const handleOpenModal = (entry = null) => {
    setEditEntry(entry);
    setForm(entry ? { ...entry } : { name: "", description: "", image: "" });
    setImagePreview(entry && entry.image ? entry.image : "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditEntry(null);
    setForm({ name: "", description: "", image: "" });
    setImagePreview("");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setForm({ ...form, image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let method = editEntry ? "PUT" : "POST";
      let url = editEntry
        ? `${baseUrl}/directors-desk/${editEntry._id || editEntry.id}`
        : `${baseUrl}/directors-desk`;
      let body;
      let headers = {};
      if (form.image && form.image instanceof File) {
        body = new FormData();
        body.append("name", form.name);
        body.append("description", form.description);
        body.append("image", form.image);
      } else {
        body = JSON.stringify({
          name: form.name,
          description: form.description,
          image: form.image,
        });
        headers["Content-Type"] = "application/json";
      }
      const res = await fetch(url, {
        method,
        body,
        headers,
      });
      if (!res.ok) throw new Error("Failed to save entry");
      // Refresh entries
      const refreshed = await fetch(`${baseUrl}/directors-desk`).then((r) => r.json());
      if (refreshed && Array.isArray(refreshed.directors)) {
        setEntries(refreshed.directors);
      } else if (Array.isArray(refreshed)) {
        setEntries(refreshed);
      } else {
        setEntries([]);
      }
      handleCloseModal();
    } catch (err) {
      // Optionally show error UI
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/directors-desk/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      // Refresh entries
      const refreshed = await fetch(`${baseUrl}/directors-desk`).then((r) => r.json());
      if (refreshed && Array.isArray(refreshed.directors)) {
        setEntries(refreshed.directors);
      } else if (Array.isArray(refreshed)) {
        setEntries(refreshed);
      } else {
        setEntries([]);
      }
      setDeleteDialog({ open: false, entry: null });
    } catch (err) {
      setDeleteDialog({ open: false, entry: null });
      // Optionally show error UI
    }
  };

  const openDeleteDialog = (entry) => {
    setDeleteDialog({ open: true, entry });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, entry: null });
  };

  // Filter and paginate entries
  const filteredEntries = entries.filter((entry) =>
    entry.name && entry.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEntries.length / pageSize) || 1;
  const paginatedEntries = filteredEntries.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-black text-[#E8B245] mt-8 px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Director's Desk</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 rounded border border-[#E8B245] bg-transparent text-[#E8B245] focus:outline-none w-full sm:w-56"
          />
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#E8B245] text-black font-semibold rounded hover:bg-yellow-400 transition-colors"
            onClick={() => handleOpenModal()}
          >
            <FiPlus /> Add Entry
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#E8B245] bg-[#181C2A]">
        <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
          <thead className="bg-[#E8B245] text-black">
            <tr>
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Name</th>
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Description</th>
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Image</th>
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEntries.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-[#E8B245]">No entries found.</td>
              </tr>
            ) : (
              paginatedEntries.map((entry) => (
                <tr key={entry._id || entry.id} className="hover:bg-[#2a2a2a] transition-colors duration-200">
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[120px] md:max-w-none">{entry.name}</td>
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[200px] md:max-w-none">{entry.description || "-"}</td>
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] text-center">
                    {entry.image ? (
                      <img
                        src={entry.image}
                        alt={entry.name}
                        className="w-16 h-16 object-cover rounded mx-auto border border-[#E8B245]"
                      />
                    ) : (
                      <span className="italic text-xs text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] text-center space-x-2">
                    <button
                      className="text-[#E8B245] hover:text-white cursor-pointer"
                      onClick={() => handleOpenModal(entry)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-white cursor-pointer"
                      onClick={() => openDeleteDialog(entry)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded border border-[#E8B245] text-[#E8B245] disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="px-2">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded border border-[#E8B245] text-[#E8B245] disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300 px-2">
          <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-xs sm:max-w-md p-4 sm:p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto">
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={handleCloseModal}
            >
              <FiX size={24} />
            </button>
            <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">{editEntry ? "Edit Entry" : "Add Entry"}</h3>
            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <div>
                <label className="block mb-1 text-xs sm:text-sm font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs sm:text-sm font-semibold">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs sm:text-sm font-semibold">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none file:bg-[#E8B245] file:text-black file:rounded file:px-2 file:py-1"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded mt-2 border border-[#E8B245] mx-auto"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-[#E8B245] text-[#E8B245] rounded hover:bg-[#E8B245] hover:text-black"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E8B245] text-black font-semibold rounded hover:bg-yellow-400"
                >
                  {editEntry ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    {/* Delete Confirmation Dialog */}
    {deleteDialog.open && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300 px-2">
        <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-xs sm:max-w-sm p-4 sm:p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto">
          <button
            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#E8B245] cursor-pointer hover:text-white"
            onClick={closeDeleteDialog}
          >
            <FiX size={24} />
          </button>
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Are you sure you want to delete this entry?</h3>
          <div className="flex justify-end gap-2 w-full">
            <button
              className="px-4 py-2 border border-[#E8B245] text-[#E8B245] rounded hover:bg-[#E8B245] hover:text-black cursor-pointer"
              onClick={closeDeleteDialog}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 cursor-pointer"
              onClick={() => handleDelete(deleteDialog.entry._id || deleteDialog.entry.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default DirectorsDesk;