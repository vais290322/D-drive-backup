import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const baseUrl = import.meta.env.VITE_REACT_BASE_URL;
const apiUrl = `${baseUrl}/csr-blog`;

function CSR() {
  const [entries, setEntries] = useState([]);
  const [viewDialog, setViewDialog] = useState({ open: false, entry: null });
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [form, setForm] = useState({
    abstract: "",
    details: [
      { heading: "", content: "", subDetails: [{ subHeading: "", subContent: "" }] }
    ],
    references: [
      { title: "", link: "" }
    ]
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, entry: null });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => { setPage(1); }, [search]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        console.log("CSR entries fetched:", data);
        
        // Accept both { blogs: [...] } and { csrBlogs: [...] } and fallback to array
        if (data && Array.isArray(data.blogs)) {
          setEntries(data.blogs);
        } else if (data && Array.isArray(data.csrBlogs)) {
          setEntries(data.csrBlogs);
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
    if (entry) {
      setForm({
        abstract: entry.abstract || "",
        details: entry.details && entry.details.length ? entry.details.map(d => ({
          heading: d.heading || "",
          content: d.content || "",
          subDetails: d.subDetails && d.subDetails.length ? d.subDetails.map(s => ({
            subHeading: s.subHeading || "",
            subContent: s.subContent || ""
          })) : [{ subHeading: "", subContent: "" }]
        })) : [{ heading: "", content: "", subDetails: [{ subHeading: "", subContent: "" }] }],
        references: entry.references && entry.references.length ? entry.references.map(r => ({
          title: r.title || "",
          link: r.link || ""
        })) : [{ title: "", link: "" }]
      });
    } else {
      setForm({
        abstract: "",
        details: [{ heading: "", content: "", subDetails: [{ subHeading: "", subContent: "" }] }],
        references: [{ title: "", link: "" }]
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditEntry(null);
    setForm({
      abstract: "",
      image: "",
      details: [{ heading: "", content: "", subDetails: [{ subHeading: "", subContent: "" }] }],
      references: [{ title: "", link: "" }]
    });
    setImagePreview("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Nested details and references handlers (payload correction)
  const handleDetailChange = (idx, field, value) => {
    const details = [...form.details];
    details[idx][field] = value;
    setForm({ ...form, details });
  };
  const handleSubDetailChange = (dIdx, sIdx, field, value) => {
    const details = [...form.details];
    details[dIdx].subDetails[sIdx][field] = value;
    setForm({ ...form, details });
  };
  const addDetail = () => {
    setForm({ ...form, details: [...form.details, { heading: "", content: "", subDetails: [{ subHeading: "", subContent: "" }] }] });
  };
  const removeDetail = (idx) => {
    const details = form.details.filter((_, i) => i !== idx);
    setForm({ ...form, details });
  };
  const addSubDetail = (dIdx) => {
    const details = [...form.details];
    details[dIdx].subDetails.push({ subHeading: "", subContent: "" });
    setForm({ ...form, details });
  };
  const removeSubDetail = (dIdx, sIdx) => {
    const details = [...form.details];
    details[dIdx].subDetails = details[dIdx].subDetails.filter((_, i) => i !== sIdx);
    setForm({ ...form, details });
  };
  const handleReferenceChange = (idx, field, value) => {
    const references = [...form.references];
    references[idx][field] = value;
    setForm({ ...form, references });
  };
  const addReference = () => {
    setForm({ ...form, references: [...form.references, { title: "", link: "" }] });
  };
  const removeReference = (idx) => {
    const references = form.references.filter((_, i) => i !== idx);
    setForm({ ...form, references });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let method = editEntry ? "PUT" : "POST";
      let url = editEntry ? `${apiUrl}/${editEntry._id || editEntry.id}` : apiUrl;
      let body;
      let headers = {};
      body = JSON.stringify({
        abstract: form.abstract,
        details: form.details.map(d => ({
          heading: d.heading,
          content: d.content,
          subDetails: d.subDetails.map(s => ({ subHeading: s.subHeading, subContent: s.subContent }))
        })),
        references: form.references.map(r => ({ title: r.title, link: r.link })),
      });
      headers["Content-Type"] = "application/json";
      const res = await fetch(url, { method, body, headers });
      if (!res.ok) throw new Error("Failed to save entry");
      // Refresh entries (handle blogs/csrBlogs/array)
      const refreshed = await fetch(apiUrl).then((r) => r.json());
      if (refreshed && Array.isArray(refreshed.blogs)) {
        setEntries(refreshed.blogs);
      } else if (refreshed && Array.isArray(refreshed.csrBlogs)) {
        setEntries(refreshed.csrBlogs);
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
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      // Refresh entries (handle blogs/csrBlogs/array)
      const refreshed = await fetch(apiUrl).then((r) => r.json());
      if (refreshed && Array.isArray(refreshed.blogs)) {
        setEntries(refreshed.blogs);
      } else if (refreshed && Array.isArray(refreshed.csrBlogs)) {
        setEntries(refreshed.csrBlogs);
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
    entry.abstract && entry.abstract.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEntries.length / pageSize) || 1;
  const paginatedEntries = filteredEntries.slice((page - 1) * pageSize, page * pageSize);

  // View dialog handlers
  const openViewDialog = (entry) => setViewDialog({ open: true, entry });
  const closeViewDialog = () => setViewDialog({ open: false, entry: null });

  return (
    <div className="min-h-screen bg-black text-[#E8B245] px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">CSR Blog</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
          <input
            type="text"
            placeholder="Search by abstract..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 rounded border border-[#E8B245] bg-transparent text-[#E8B245] focus:outline-none w-full sm:w-56"
          />
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#E8B245] text-black font-semibold rounded hover:bg-yellow-400 transition-colors cursor-pointer"
            onClick={() => handleOpenModal()}
          >
            <FaPlus /> Add Entry
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#E8B245] bg-[#181C2A]">
        <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
          <thead className="bg-[#E8B245] text-black">
            <tr>
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Abstract</th>
                  {/* <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Image</th> */}
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Details</th>
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">References</th>
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEntries.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-[#E8B245]">No entries found.</td>
              </tr>
            ) : (
              paginatedEntries.map((entry) => (
                <tr key={entry._id || entry.id} className="hover:bg-[#2a2a2a] transition-colors duration-200">
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[180px] md:max-w-none">{entry.abstract}</td>
                  {/* <td className="py-2 px-2 sm:px-4 border border-[#E8B245] text-center">
                    {entry.image ? (
                      <img
                        src={entry.image}
                        alt="CSR"
                        className="w-16 h-16 object-cover rounded mx-auto border border-[#E8B245]"
                      />
                    ) : (
                      <span className="italic text-xs text-gray-400">No image</span>
                    )}
                  </td> */}
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[300px] md:max-w-none text-left">
                    {entry.details && entry.details.length > 0 && (
                      <ul className="list-disc ml-4">
                        <li className="mb-2">
                          <span className="font-semibold text-[#E8B245]">{entry.details[0].heading}</span>: {entry.details[0].content}
                          {entry.details[0].subDetails && entry.details[0].subDetails.length > 0 && (
                            <ul className="list-circle ml-4 mt-1">
                              {entry.details[0].subDetails.map((s, j) => (
                                <li key={j}>
                                  <span className="font-semibold">{s.subHeading}</span>: {s.subContent}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      </ul>
                    )}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[200px] md:max-w-none text-left">
                    {entry.references && entry.references.length > 0 && (
                      <ul className="list-disc ml-4">
                        {entry.references.map((r, i) => (
                          <li key={i}>
                            <span className="font-semibold">{r.title}</span>: <a href={r.link} className="underline text-blue-400" target="_blank" rel="noopener noreferrer">{r.link}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="py-2 px-2  sm:px-4 border border-[#E8B245] text-center space-x-2">
                    <button
                      className="text-blue-400 hover:text-white cursor-pointer mr-2 flex items-center gap-1"
                      onClick={() => openViewDialog(entry)}
                    >
                      <FaEye /> View
                    </button>
                    <button
                      className="text-[#E8B245] hover:text-white cursor-pointer mr-2 flex items-center gap-1"
                      onClick={() => handleOpenModal(entry)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-white cursor-pointer flex items-center gap-1"
                      onClick={() => openDeleteDialog(entry)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
      {/* View Dialog */}
      {viewDialog.open && viewDialog.entry && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300 px-2">
          <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-2xl p-4 sm:p-6 rounded-lg border border-[#E8B245] relative flex flex-col mx-auto overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={closeViewDialog}
            >
              ×
            </button>
            <h3 className="text-lg sm:text-2xl font-bold mb-4">CSR Blog Details</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Abstract:</span>
                <div className="whitespace-pre-line break-words">{viewDialog.entry.abstract}</div>
              </div>
              <div>
                <span className="font-semibold">Details:</span>
                {viewDialog.entry.details && viewDialog.entry.details.length > 0 ? (
                  <ul className="list-disc ml-4">
                    <li className="mb-2">
                      <span className="font-semibold text-[#E8B245]">{viewDialog.entry.details[0].heading}</span>: {viewDialog.entry.details[0].content}
                      {viewDialog.entry.details[0].subDetails && viewDialog.entry.details[0].subDetails.length > 0 && (
                        <ul className="list-circle ml-4 mt-1">
                          {viewDialog.entry.details[0].subDetails.map((s, j) => (
                            <li key={j}>
                              <span className="font-semibold">{s.subHeading}</span>: {s.subContent}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  </ul>
                ) : (
                  <div className="italic text-gray-400">No details</div>
                )}
              </div>
              <div>
                <span className="font-semibold">References:</span>
                {viewDialog.entry.references && viewDialog.entry.references.length > 0 ? (
                  <ul className="list-disc ml-4">
                    {viewDialog.entry.references.map((r, i) => (
                      <li key={i}>
                        <span className="font-semibold">{r.title}</span>: <a href={r.link} className="underline text-blue-400" target="_blank" rel="noopener noreferrer">{r.link}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="italic text-gray-400">No references</div>
                )}
              </div>
              {viewDialog.entry.createdAt && (
                <div>
                  <span className="font-semibold">Created At:</span> {new Date(viewDialog.entry.createdAt).toLocaleString()}
                </div>
              )}
              {viewDialog.entry.updatedAt && (
                <div>
                  <span className="font-semibold">Updated At:</span> {new Date(viewDialog.entry.updatedAt).toLocaleString()}
                </div>
              )}
              {viewDialog.entry._id && (
                <div>
                  <span className="font-semibold">ID:</span> {viewDialog.entry._id}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
          <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-2xl p-4 sm:p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={handleCloseModal}
            >
              ×
            </button>
            <h3 className="text-lg sm:text-2xl font-bold">{editEntry ? "Edit Entry" : "Add Entry"}</h3>
            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <div>
                <label className="block mb-1 text-xs sm:text-sm font-semibold">Abstract</label>
                <textarea
                  name="abstract"
                  value={form.abstract}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none resize-none"
                />
              </div>
              {/* Image field removed */}
              {/* Details */}
              <div>
                <label className="block mb-1 text-xs sm:text-sm font-semibold">Details</label>
                {form.details.map((d, i) => (
                  <div key={i} className="mb-4 border border-[#E8B245] rounded p-2">
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Heading"
                        value={d.heading}
                        onChange={e => handleDetailChange(i, "heading", e.target.value)}
                        className="w-1/2 px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Content"
                        value={d.content}
                        onChange={e => handleDetailChange(i, "content", e.target.value)}
                        className="w-1/2 px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none"
                      />
                      <button type="button" className="text-red-500 ml-2 cursor-pointer flex items-center gap-1" onClick={() => removeDetail(i)}>
                        <FaTrash /> Remove
                      </button>
                    </div>
                    {/* SubDetails */}
                    <div className="ml-4">
                      <label className="block mb-1 text-xs sm:text-sm font-semibold">Sub Details</label>
                      {d.subDetails.map((s, j) => (
                        <div key={j} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Sub Heading"
                            value={s.subHeading}
                            onChange={e => handleSubDetailChange(i, j, "subHeading", e.target.value)}
                            className="w-1/2 px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none"
                          />
                          <textarea
                            placeholder="Sub Content"
                            value={s.subContent}
                            onChange={e => handleSubDetailChange(i, j, "subContent", e.target.value)}
                            className="w-1/2 px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none resize-none"
                            rows={2}
                          />
                          <button type="button" className="text-red-500 ml-2 cursor-pointer flex items-center gap-1" onClick={() => removeSubDetail(i, j)}>
                            <FaTrash /> Remove
                          </button>
                        </div>
                      ))}
                      <button type="button" className="text-[#E8B245] mt-1 cursor-pointer flex items-center gap-1" onClick={() => addSubDetail(i)}>
                        <FaPlus /> Add Sub Detail
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" className="text-[#E8B245] mt-2 cursor-pointer flex items-center gap-1" onClick={addDetail}>
                  <FaPlus /> Add Detail
                </button>
              </div>
              {/* References */}
              <div>
                <label className="block mb-1 text-xs sm:text-sm font-semibold">References</label>
                {form.references.map((r, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={r.title}
                      onChange={e => handleReferenceChange(i, "title", e.target.value)}
                      className="w-1/2 px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Link"
                      value={r.link}
                      onChange={e => handleReferenceChange(i, "link", e.target.value)}
                      className="w-1/2 px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none"
                    />
                    <button type="button" className="text-red-500 ml-2 cursor-pointer flex items-center gap-1" onClick={() => removeReference(i)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="text-[#E8B245] mt-2 cursor-pointer flex items-center gap-1" onClick={addReference}>
                  <FaPlus /> Add Reference
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-[#E8B245] text-[#E8B245] rounded hover:bg-[#E8B245] hover:text-black cursor-pointer"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E8B245] text-black font-semibold rounded hover:bg-yellow-400 cursor-pointer"
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
              ×
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
}

export default CSR;