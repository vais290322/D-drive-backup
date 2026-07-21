import React, { useState, useEffect } from 'react';

const baseUrl = import.meta.env.VITE_REACT_BASE_URL;
const apiUrl = `${baseUrl}/csr-content`;

function CSRContent() {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', pdfLink: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, entry: null });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => { setPage(1); }, [search]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        console.log('CSRContent fetched data:', data);
        
        if (Array.isArray(data.contents)) {
          setEntries(data.contents);
        } else if (Array.isArray(data.csrContent)) {
          setEntries(data.csrContent);
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
        title: entry.title || '',
        author: entry.author || '',
        pdfLink: entry.pdfLink || ''
      });
    } else {
      setForm({ title: '', author: '', pdfLink: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditEntry(null);
    setForm({ title: '', author: '', pdfLink: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let method = editEntry ? 'PUT' : 'POST';
      let url = editEntry ? `${apiUrl}/${editEntry._id || editEntry.id}` : apiUrl;
      let body = JSON.stringify(form);
      let headers = { 'Content-Type': 'application/json' };
      const res = await fetch(url, { method, body, headers });
      if (!res.ok) throw new Error('Failed to save entry');
      // Refresh entries
      const refreshed = await fetch(apiUrl).then((r) => r.json());
      if (Array.isArray(refreshed.contents)) {
        setEntries(refreshed.contents);
      } else if (Array.isArray(refreshed.csrContent)) {
        setEntries(refreshed.csrContent);
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
      const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      // Refresh entries
      const refreshed = await fetch(apiUrl).then((r) => r.json());
      if (Array.isArray(refreshed.contents)) {
        setEntries(refreshed.contents);
      } else if (Array.isArray(refreshed.csrContent)) {
        setEntries(refreshed.csrContent);
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
    (entry.title && entry.title.toLowerCase().includes(search.toLowerCase())) ||
    (entry.author && entry.author.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredEntries.length / pageSize) || 1;
  const paginatedEntries = filteredEntries.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-black text-[#E8B245] px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">CSR Content</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 rounded border border-[#E8B245] bg-transparent text-[#E8B245] focus:outline-none w-full sm:w-56"
          />
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#E8B245] text-black font-semibold rounded hover:bg-yellow-400 transition-colors cursor-pointer"
            onClick={() => handleOpenModal()}
          >
            Add Entry
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#E8B245] bg-[#181C2A]">
        <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
          <thead className="bg-[#E8B245] text-black">
            <tr>
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Title</th>
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Author</th>
              <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">PDF Link</th>
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
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[180px] md:max-w-none">{entry.title}</td>
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[180px] md:max-w-none">{entry.author}</td>
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[220px] md:max-w-none">
                    {entry.pdfLink ? (
                      <a href={entry.pdfLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">PDF</a>
                    ) : (
                      <span className="italic text-xs text-gray-400">No PDF</span>
                    )}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] text-center space-x-2">
                    <button
                      className="text-[#E8B245] hover:text-white cursor-pointer mr-2"
                      onClick={() => handleOpenModal(entry)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-white cursor-pointer"
                      onClick={() => openDeleteDialog(entry)}
                    >
                      Delete
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
          <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-md p-4 sm:p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={handleCloseModal}
            >
              ×
            </button>
            <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">{editEntry ? 'Edit Entry' : 'Add Entry'}</h3>
            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <div>
                <label className="block mb-1 text-xs sm:text-sm font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs sm:text-sm font-semibold">Author</label>
                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs sm:text-sm font-semibold">PDF Link</label>
                <input
                  type="text"
                  name="pdfLink"
                  value={form.pdfLink}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1 rounded bg-transparent border border-[#E8B245] text-[#E8B245] focus:outline-none"
                />
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
                  {editEntry ? 'Update' : 'Add'}
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

export default CSRContent;