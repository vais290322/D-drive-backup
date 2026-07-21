import React,{useState,useEffect} from "react";





const baseUrl = import.meta.env.VITE_REACT_BASE_URL;

const Overview = () => {
  const [overview, setOverview] = useState("");
  console.log("Overview component rendered", overview);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [overviewId, setOverviewId] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/overview`);
        const data = await res.json();
        // New API: { success: true, entries: [ { _id, overview, ... } ] }
        if (Array.isArray(data.entries) && data.entries.length > 0) {
          setOverview(data.entries[0].overview || "");
          setOverviewId(data.entries[0]._id || null);
        } else {
          setOverview("");
          setOverviewId(null);
        }
      } catch (err) {
        setError("Failed to fetch overview");
      }
      setLoading(false);
    };
    fetchOverview();
  }, []);

  const handleEdit = () => {
    setEditValue(overview);
    setEditMode(true);
  };

  // Add new overview if none exists
  const handleAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/overview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overview: editValue }),
      });
      if (!res.ok) throw new Error("Failed to add overview");
      const data = await res.json();
      if (Array.isArray(data.entries) && data.entries.length > 0) {
        setOverview(data.entries[0].overview || "");
        setOverviewId(data.entries[0]._id || null);
      }
      setEditMode(false);
    } catch (err) {
      setError("Add failed");
    }
    setLoading(false);
  };

  // Update overview if exists
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/overview/${overviewId || ""}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overview: editValue }),
      });
      if (!res.ok) throw new Error("Failed to update overview");
      setOverview(editValue);
      setEditMode(false);
    } catch (err) {
      setError("Update failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a1a] via-black to-[#2d1a00] text-[#E8B245] px-0 py-0 flex flex-col items-center">
      <div className="w-full">
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-4 border-b-4 border-[#E8B245] pb-2 w-full text-center bg-[#181818] shadow-lg">Overview</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-20 sm:h-24 w-full">
          <svg className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-[#E8B245] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#E8B245" strokeWidth="4"></circle>
            <path className="opacity-75" fill="#E8B245" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-[#E8B245] text-base sm:text-lg font-semibold">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center w-full text-base sm:text-lg font-bold">{error}</div>
      ) : (
        <div className="w-full px-2 sm:px-6 lg:px-12 xl:px-24 py-3 sm:py-4">
          <div className="w-full bg-[#181818] border-2 border-[#E8B245] rounded-xl shadow-xl p-2 sm:p-4 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-2 gap-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#E8B245]">Organization Overview</h3>
              {overviewId ? (
                <button
                  className="px-3 sm:px-4 py-1 border-2 border-[#E8B245] text-[#E8B245] cursor-pointer rounded-full hover:bg-[#E8B245] hover:text-black font-bold shadow-md transition-all duration-200 w-full sm:w-auto"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              ) : (
                <button
                  className="px-3 sm:px-4 py-1 border-2 border-[#E8B245] text-[#E8B245] cursor-pointer rounded-full hover:bg-[#E8B245] hover:text-black font-bold shadow-md transition-all duration-200 w-full sm:w-auto"
                  onClick={() => { setEditValue(""); setEditMode(true); }}
                >
                  Add
                </button>
              )}
            </div>
            <div className="whitespace-pre-line break-words text-white text-sm sm:text-base leading-relaxed tracking-wide bg-[#222] rounded-lg p-2 sm:p-4 shadow-inner min-h-[80px] sm:min-h-[100px]">
              {overview || "No overview available."}
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-all duration-300 px-2">
          <div className="bg-[#181818] text-[#E8B245] w-full max-w-xs sm:max-w-2xl p-4 sm:p-10 rounded-2xl border-2 border-[#E8B245] shadow-2xl relative flex flex-col items-center justify-center mx-auto">
            <h3 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6">{overviewId ? "Edit Overview" : "Add Overview"}</h3>
            <textarea
              className="w-full h-32 sm:h-48 p-2 sm:p-4 rounded-xl border-2 border-[#E8B245] bg-black text-white mb-4 sm:mb-6 focus:outline-none text-sm sm:text-lg resize-none shadow-inner"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full justify-center">
              <button
                className="px-4 sm:px-6 py-2 bg-[#E8B245] text-black cursor-pointer rounded-full hover:bg-[#cfa23c] font-bold shadow-md transition-all duration-200 w-full sm:w-auto"
                onClick={overviewId ? handleUpdate : handleAdd}
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-black inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="black" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="black" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : null}
                {overviewId ? "Save" : "Add"}
              </button>
              <button
                className="px-4 sm:px-6 py-2 border-2 border-[#E8B245] text-[#E8B245] cursor-pointer rounded-full hover:bg-[#E8B245] hover:text-black font-bold shadow-md transition-all duration-200 w-full sm:w-auto"
                onClick={() => setEditMode(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
            {error && <div className="text-red-500 mt-2 sm:mt-4 text-base sm:text-lg font-bold w-full text-center">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;