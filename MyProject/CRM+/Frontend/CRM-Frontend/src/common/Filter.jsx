import React, { useState } from 'react'

const Filter = () => {
    const [searchText, setSearchText] = useState("");

    const handleSearchChange = (e) => {
      setSearchText(e.target.value);
    };
  
    const clearFilters = () => {
      setSearchText("");
      // Additional logic to reset other filters if necessary
    };
  
    return (
      <div className="p-4 bg-white rounded-md shadow-md">
        <h3 className="text-gray-800 font-semibold mb-2">Call Types</h3>
        <div className="flex flex-wrap gap-4 items-center ">
          {/* Checkbox Filters */}
          {[
            "Select All",
            "Hot Call",
            "Warm Call",
            "Cold Call",
            "Deal Closed",
            "Switch Off",
            "Ringing",
            "Need to call back",
            "Archived",
          ].map((type) => (
            <div key={type} className="flex items-center gap-1   ">
              <input
                type="checkbox"
                id={type}
                className="rounded border-gray-300 text-purple-500 focus:ring-purple-500 w-4 h-4 "
              />
              <label htmlFor={type} className="text-gray-700 text-md">
                {type}
              </label>
            </div>
          ))}
  
          {/* Filter Buttons */}
          {/* <div className="flex gap-2 mt-2">
            {["All", "Monthly", "Weekly", "Today"].map((filter) => (
              <button
                key={filter}
                className="px-3 py-1 bg-purple-500 text-white font-medium text-sm rounded-md shadow hover:bg-purple-600"
              >
                {filter}
              </button>
            ))}
          </div> */}
  
          {/* Filter and Search and Clear Buttons */}

          <div className='flex justify-between  w-full'>
          
          <div className="flex gap-2 mt-2">
            {["All", "Monthly", "Weekly", "Today"].map((filter) => (
              <button
                key={filter}
                className="px-3 py-1 bg-purple-500 text-white font-medium text-sm rounded-md shadow hover:bg-purple-600"
              >
                {filter}
              </button>
            ))}
          </div>
         

          <div className="flex gap-2  items-center">

            <input
              type="text"
              placeholder="Search here"
              value={searchText}
              onChange={handleSearchChange}
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-yellow-400 text-white font-medium text-sm rounded-md shadow hover:bg-yellow-500"
            >
              Clear All
            </button>
            <button
              className="px-3 py-1 bg-purple-500 text-white font-medium text-sm rounded-md shadow hover:bg-purple-600"
            >
              Search
            </button>
          </div>

          </div>

        </div>
      </div>
    );
  };

export default Filter