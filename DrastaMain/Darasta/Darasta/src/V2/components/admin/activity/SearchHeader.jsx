import { Filter, Plus, Settings } from "lucide-react";
import { useEffect, useState } from "react";

export function SearchHeader({
  onSearchParamsChange,
  onNewEvent,
  onManageCategories,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Notify parent when filters change
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchParamsChange({
        searchTerm,
        searchDate,
        filterStartDate,
        filterEndDate,
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, searchDate, filterStartDate, filterEndDate]);

  const resetAll = () => {
    setSearchTerm("");
    setSearchDate("");
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterOpen(false);
    onSearchParamsChange({
      searchTerm: "",
      searchDate: "",
      filterStartDate: "",
      filterEndDate: "",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 ">
      {/* Controls Container */}
      <div className="flex flex-wrap items-center gap-2 flex-1 overflow-x-auto">
        <input
          type="text"
          placeholder="Search events by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="min-w-[150px] flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />

        {!filterOpen && (
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-36 border border-gray-300 rounded px-3 py-2 focus:outline-none"
          />
        )}

        {filterOpen && (
          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-36 border border-gray-300 rounded px-3 py-2 focus:outline-none"
              placeholder="Start"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-36 border border-gray-300 rounded px-3 py-2 focus:outline-none"
              placeholder="End"
            />
          </div>
        )}

        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="cursor-pointer flex items-center gap-1 px-3 h-10 border border-gray-300 rounded hover:bg-gray-100 text-sm"
        >
          <Filter size={14} />
          Filter
        </button>
        
        <button
          onClick={resetAll}
          className="cursor-pointer flex items-center justify-center gap-1 px-4 h-10 border border-gray-300 rounded hover:bg-gray-100 text-sm"
        >
          Reset
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch">
        <button
          onClick={onManageCategories}
          className="cursor-pointer flex items-center justify-center gap-1 px-4 h-10 border border-gray-300 rounded hover:bg-gray-100 text-sm"
        >
          <Settings size={16} />
          Manage Categories
        </button>

        <button
          onClick={onNewEvent}
          className="cursor-pointer flex items-center justify-center gap-2 px-5 h-10 bg-[var(--primary-color)] text-white rounded hover:opacity-90 text-sm"
        >
          <Plus size={16} />
          New Event
        </button>
      </div>
    </div>
);
}
