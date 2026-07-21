import React, { useEffect, useState,useMemo } from "react";
import toast from "react-hot-toast";

import {backendDomainA} from "../../../common/index"
import axios from "axios";

const SetUnitsPage = () => {
  const [unitData, setUnitData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllUnitsInfo = async () => {
    try {
        setLoading(true);
      // Fetching units data from the server
      const getUnitsData = await fetch(`${backendDomainA}/api/v1/units/all-units`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await getUnitsData.json();
      // console.log(res?.data);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      // toast.success("Units data fetched successfully.");
      setUnitData(res?.data || []);
    } catch (error) {
      toast.error(res.message);
      // console.log(error);
    }
    finally{
        setLoading(false);
    }
  };

  useEffect(() => {
    getAllUnitsInfo();
  }, []);
  return (
    <div>
      <SetUnitsForm getAllUnitsInfo={getAllUnitsInfo} unitData={unitData} setUnitData={setUnitData} />
      {/* <h1>Set Units Page</h1> */}
      {!loading && <PaginationTable data={unitData} />}
    </div>
  );   
};

export default SetUnitsPage;

const SetUnitsForm = ({getAllUnitsInfo,unitData,setUnitData}) => {
  // Initial state for the unit
  const [unit, setUnit] = useState({
    name: "",
    symbol: "",
    measure: {
      type: "",
      conversionFactor: "",
    },
  });

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update nested "measure" fields separately
    if (name === "type" || name === "conversionFactor") {
      setUnit((prevState) => ({
        ...prevState,
        measure: {
          ...prevState.measure,
          // Convert conversionFactor to a number if needed
          [name]: name === "conversionFactor" ? Number(value) : value,
        },
      }));
    } else {
      // Update top-level fields (name, symbol)
      setUnit((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can handle the form submission (e.g., API call)
    // console.log("Submitted Unit:", unit);
    try {
      const sendData = await fetch(`${backendDomainA}/api/v1/units/create-unit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unit),
      });
      const res = await sendData.json();
      console.log(res);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Unit created successfully.");
      setUnit({
        name: "",
        symbol: "",
        measure: {
          type: "",
          conversionFactor: "",
        },
      });
      setUnitData((prev) => {
        return [...prev, res?.data];
      })
      getAllUnitsInfo();
    } catch (error) {
        toast.error(res.message);
        console.error(error);
    }
  };
  useEffect(()=> {
    getAllUnitsInfo()
  },[])

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md"
    >
      {/* Unit Name Field */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Unit Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Kilometer"
          value={unit.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Unit Symbol Field */}
      <div className="mb-4">
        <label htmlFor="symbol" className="block text-gray-700 font-bold mb-2">
          Unit Symbol
        </label>
        <input
          type="text"
          id="symbol"
          name="symbol"
          placeholder="Km"
          value={unit.symbol}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Measure Type Field */}
      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
          Measure Type
        </label>
        <input
          type="text"
          id="type"
          name="type"
          placeholder="length"
          value={unit.measure.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Conversion Factor Field */}
      <div className="mb-4">
        <label
          htmlFor="conversionFactor"
          className="block text-gray-700 font-bold mb-2"
        >
          Conversion Factor
        </label>
        <input
          type="number"
          id="conversionFactor"
          name="conversionFactor"
          placeholder="1000"
          value={unit.measure.conversionFactor}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Save Unit
        </button>
      </div>
    </form>
  );
};


const PaginationTable = ({data}) => {
  // Sample data matching your API response format.
  const initialUnits = [
    {
      _id: "67a9cfe9429dc2210baff5b0",
      name: "Meter",
      symbol: "m",
      measure: { type: "length", conversionFactor: 1 },
      createdAt: "2025-02-10T10:07:37.171Z",
      updatedAt: "2025-02-10T10:07:37.171Z",
      __v: 0,
    },
    {
      _id: "67a9d00f429dc2210baff5b2",
      name: "Kilometer",
      symbol: "Km",
      measure: { type: "length", conversionFactor: 1000 },
      createdAt: "2025-02-10T10:08:15.873Z",
      updatedAt: "2025-02-10T10:08:15.873Z",
      __v: 0,
    },
    // Add more items here for testing pagination...
  ];

  // State for the unit records.
  const [units, setUnits] = useState(data || []);
  // State for pagination.
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State for sorting configuration.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Create a sorted copy of the units array.
  const sortedUnits = useMemo(() => {
    let sortableUnits = [...units];
    if (sortConfig.key !== null) {
      sortableUnits.sort((a, b) => {
        let aValue, bValue;

        // Sorting top-level string fields.
        if (["name", "symbol", "_id"].includes(sortConfig.key)) {
          aValue = a[sortConfig.key].toLowerCase();
          bValue = b[sortConfig.key].toLowerCase();
        }
        // Sorting the nested measure type.
        else if (sortConfig.key === "measureType") {
          aValue = a.measure.type.toLowerCase();
          bValue = b.measure.type.toLowerCase();
        }
        // Sorting the nested conversion factor.
        else if (sortConfig.key === "conversionFactor") {
          aValue = a.measure.conversionFactor;
          bValue = b.measure.conversionFactor;
        }
        // Sorting by creation date.
        else if (sortConfig.key === "createdAt") {
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableUnits;
  }, [units, sortConfig]);

  // Determine items to display on the current page.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUnits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(units.length / itemsPerPage);

  // Update the sort configuration when a header is clicked.
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Display an arrow next to the header if it is being sorted.
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  // Delete handler.
  const handleDelete =async (_id) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      const response = await axios.post(`${backendDomainA}/api/v1/units/delete-unit/${_id}`)
      if(response){
        toast.success('item deleted successfully!')
      }
    }
  };

  // Update handler.
  const handleUpdate = (_id) => {
    // Replace this with your own update logic (e.g., open a modal or navigate to an edit page).
    alert(`Update unit with id: ${_id}`);
  };
  useEffect(() => {

  },[])

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => requestSort("_id")}
              >
                ID{getSortIndicator("_id")}
              </th>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Name{getSortIndicator("name")}
              </th>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => requestSort("symbol")}
              >
                Symbol{getSortIndicator("symbol")}
              </th>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => requestSort("measureType")}
              >
                Measure Type{getSortIndicator("measureType")}
              </th>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => requestSort("conversionFactor")}
              >
                Conversion Factor{getSortIndicator("conversionFactor")}
              </th>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => requestSort("createdAt")}
              >
                Created At{getSortIndicator("createdAt")}
              </th>
              {/* <th className="py-2 px-4 border">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((unit, index) => (
              <tr key={unit._id} className="text-center">
                <td className="py-2 px-4 border">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="py-2 px-4 border">{unit.name}</td>
                <td className="py-2 px-4 border">{unit.symbol}</td>
                <td className="py-2 px-4 border">{unit.measure.type}</td>
                <td className="py-2 px-4 border">
                  {unit.measure.conversionFactor}
                </td>
                <td className="py-2 px-4 border">
                  {new Date(unit.createdAt).toLocaleDateString()}
                </td>
                {/* <td className="py-2 px-4 border space-x-2">
                  <button
                    onClick={() => handleUpdate(unit._id)}
                    className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(unit._id)}
                    className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td> */}
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center">
                  No units available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 "
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 cursor-pointer rounded ${
              currentPage === idx + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300  text-gray-700"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 "
        >
          Next
        </button>
      </div>
    </div>
  );
};
