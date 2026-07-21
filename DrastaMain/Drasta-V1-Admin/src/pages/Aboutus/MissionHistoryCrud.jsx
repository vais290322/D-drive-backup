import React, { useState, useEffect } from "react";

const initialFields = {
  mission: "",
  research: "",
  history: "",
  trainingAwareness: ""
};

const baseUrl = import.meta.env.VITE_REACT_BASE_URL;
const MissionHistoryCrud = () => {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialFields);
  const [entryId, setEntryId] = useState(null);

  // Fetch entry from API
  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/mission-history`);
        const data = await res.json();
        if (data && data.success && data.missionHistory) {
          setEntry(data.missionHistory);
          setEntryId(data.missionHistory._id || null);
        } else {
          setEntry(null);
          setEntryId(null);
        }
      } catch (err) {
        setError("Failed to fetch entry");
      }
      setLoading(false);
    };
    fetchEntry();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new entry if none exists
  const handleAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/mission-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to add entry");
      const data = await res.json();
      if (data && data.success && data.missionHistory) {
        setEntry(data.missionHistory);
        setEntryId(data.missionHistory._id || null);
      }
      setEditMode(false);
    } catch (err) {
      setError("Add failed");
    }
    setLoading(false);
  };

  // Update entry if exists
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/mission-history`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to update entry");
      setEntry({ ...form, _id: entryId });
      setEditMode(false);
    } catch (err) {
      setError("Update failed");
    }
    setLoading(false);
  };

  // Prepare form for edit
  const handleEdit = () => {
    setForm({
      mission: entry?.mission || "",
      research: entry?.research || "",
      history: entry?.history || "",
      trainingAwareness: entry?.trainingAwareness || ""
    });
    setEditMode(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a1a] via-black to-[#2d1a00] text-[#E8B245] px-0 py-0 flex flex-col items-center">
      <div className="w-full">
        <h2 className="text-4xl font-extrabold mb-4 border-b-4 border-[#E8B245] pb-2 w-full text-center bg-[#181818] shadow-lg">Mission, Research, History & Training Awareness</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-24 w-full">
          <svg className="animate-spin h-8 w-8 text-[#E8B245] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#E8B245" strokeWidth="4"></circle>
            <path className="opacity-75" fill="#E8B245" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-[#E8B245] text-lg font-semibold">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center w-full text-lg font-bold">{error}</div>
      ) : (
        <div className="w-full px-2 md:px-6 lg:px-12 xl:px-24 py-4">
          <div className="w-full bg-[#181818] border-2 border-[#E8B245] rounded-xl shadow-xl p-4 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-2">
              <h3 className="text-xl md:text-2xl font-bold text-[#E8B245]">Entry</h3>
              {entryId ? (
                <button
                  className="px-4 py-1 border-2 border-[#E8B245] text-[#E8B245] cursor-pointer rounded-full hover:bg-[#E8B245] hover:text-black font-bold shadow-md transition-all duration-200"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              ) : (
                <button
                  className="px-4 py-1 border-2 border-[#E8B245] text-[#E8B245] cursor-pointer rounded-full hover:bg-[#E8B245] hover:text-black font-bold shadow-md transition-all duration-200"
                  onClick={() => { setForm(initialFields); setEditMode(true); }}
                >
                  Add
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-[#E8B245]">Mission:</span>
                <div className="whitespace-pre-line break-words text-white text-base leading-relaxed tracking-wide bg-[#222] rounded-lg p-2 shadow-inner min-h-[40px]">{entry?.mission || "No mission available."}</div>
              </div>
              <div>
                <span className="font-bold text-[#E8B245]">Research:</span>
                <div className="whitespace-pre-line break-words text-white text-base leading-relaxed tracking-wide bg-[#222] rounded-lg p-2 shadow-inner min-h-[40px]">{entry?.research || "No research available."}</div>
              </div>
              <div>
                <span className="font-bold text-[#E8B245]">History:</span>
                <div className="whitespace-pre-line break-words text-white text-base leading-relaxed tracking-wide bg-[#222] rounded-lg p-2 shadow-inner min-h-[40px]">{entry?.history || "No history available."}</div>
              </div>
              <div>
                <span className="font-bold text-[#E8B245]">Training Awareness:</span>
                <div className="whitespace-pre-line break-words text-white text-base leading-relaxed tracking-wide bg-[#222] rounded-lg p-2 shadow-inner min-h-[40px]">{entry?.trainingAwareness || "No training awareness available."}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#181818] text-[#E8B245] w-full max-w-2xl p-10 rounded-2xl border-2 border-[#E8B245] shadow-2xl relative flex flex-col items-center justify-center mx-auto">
            <h3 className="text-3xl font-bold mb-6">{entryId ? "Edit Entry" : "Add Entry"}</h3>
            <div className="w-full grid grid-cols-1 gap-4 mb-6">
              {Object.keys(initialFields).map((field) => (
                <textarea
                  key={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                  className="border-2 border-[#E8B245] bg-black text-white rounded-xl p-4 shadow-inner w-full min-h-[60px] resize-none"
                />
              ))}
            </div>
            <div className="flex gap-6">
              <button
                className="px-6 py-2 bg-[#E8B245] text-black cursor-pointer rounded-full hover:bg-[#cfa23c] font-bold shadow-md transition-all duration-200"
                onClick={entryId ? handleUpdate : handleAdd}
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-black inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="black" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="black" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : null}
                {entryId ? "Save" : "Add"}
              </button>
              <button
                className="px-6 py-2 border-2 border-[#E8B245] text-[#E8B245] cursor-pointer rounded-full hover:bg-[#E8B245] hover:text-black font-bold shadow-md transition-all duration-200"
                onClick={() => setEditMode(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
            {error && <div className="text-red-500 mt-4 text-lg font-bold">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionHistoryCrud;
