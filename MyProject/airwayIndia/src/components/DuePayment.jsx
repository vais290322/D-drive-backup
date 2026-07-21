import React from "react";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import axios from "axios";
import { StudentUrl, getAuthHeaders, } from "../config/config";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const sortOptions = [
  { value: "", label: "Sort by" },
  { value: "A_TO_Z", label: "A to Z" },
  { value: "Z_TO_A", label: "Z to A" },
  { value: "HIGHEST_DUE", label: "Highest Due" },
  { value: "LOWEST_DUE", label: "Lowest Due" },
  { value: "OLDEST", label: "Newest to Oldest" },
  { value: "NEWEST", label: "Oldest to Newest" },
];

const DuePayout = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  // Fetch student data
  useEffect(() => {
    const fetchDueStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(StudentUrl.getDueStudents, {
          headers: getAuthHeaders(),
        });
        setData(response.data?.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch due payouts");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDueStudents();
  }, []);

  // Filtering and sorting logic
  const filteredData = data
    .filter((row) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        (row.studentId && row.studentId.toLowerCase().includes(searchLower)) ||
        (row.fullName && row.fullName.toLowerCase().includes(searchLower)) ||
        (row.courseName && row.courseName.toLowerCase().includes(searchLower)) ||
        (row.totalFeePaid && row.totalFeePaid.toString().includes(searchLower)) ||
        (row.dueAmount && row.dueAmount.toString().includes(searchLower));

      const matchesDate =
        !selectedDate ||
        (row.nextDueDate &&
          dayjs(row.nextDueDate).format("YYYY-MM-DD") === selectedDate);

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "A_TO_Z":
          return (a.fullName || "").localeCompare(b.fullName || "");
        case "Z_TO_A":
          return (b.fullName || "").localeCompare(a.fullName || "");
        case "HIGHEST_DUE":
          return (b.dueAmount || 0) - (a.dueAmount || 0);
        case "LOWEST_DUE":
          return (a.dueAmount || 0) - (b.dueAmount || 0);
        case "NEWEST":
          return new Date(b.nextDueDate) - new Date(a.nextDueDate);
        case "OLDEST":
          return new Date(a.nextDueDate) - new Date(b.nextDueDate);
        default:
          return 0;
      }
    });

  // Handle view student details
  const handleViewStudent = async (row) => {
    try {
      const response = await axios.get(`${StudentUrl.getStudents}/${row.id}`, {
        headers: getAuthHeaders(),
      });
      const studentData = response.data?.data;

      navigate(`/payment-student/${row.id}`, {
        state: { student: studentData },
      });
    } catch (err) {
      console.error("Error fetching student details:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Due Payout</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 w-full">
        <input
          type="text"
          placeholder="Search by Name/ID/Course/Amount"
          className="border rounded px-3 py-2 w-full sm:w-1/3 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="relative w-full sm:w-1/4 flex items-center">
          <input
            type="date"
            placeholder="DD/MM/YYYY"
            className="border rounded px-3 py-2 w-full pl-10 text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <CalendarDays
            className="absolute left-2 top-2.5 text-gray-500"
            size={18}
          />
        </div>
        <select
          className="border rounded px-3 py-2 w-full sm:w-1/6 text-sm"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto red-scrollbar"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <table className="min-w-[800px] w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">
                  Student ID
                </th>
                <th className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">
                  Student Name
                </th>
                <th className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">
                  Course
                </th>
                <th className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">
                  Total Paid
                </th>
                <th className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">
                  Due Amount
                </th>
                <th className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">
                  Due From
                </th>
                <th className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">
                  No. Installment
                </th>
                <th className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    No due payouts found.
                  </td>
                </tr>
              ) : (
                filteredData.reverse().map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.studentId || "NA"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.fullName || "NA"}
                    </td>
                    <td className="px-3 py-2 truncate max-w-xs whitespace-nowrap">
                      {row.courseName || "NA"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.totalFeePaid != null ? `₹${row.totalFeePaid}` : "NA"}
                    </td>
                    <td className="px-3 py-2 text-red-600 font-medium whitespace-nowrap">
                      {row.dueAmount != null ? `₹${row.dueAmount}` : "NA"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.nextDueDate
                        ? dayjs(row.nextDueDate).format("DD/MM/YYYY")
                        : "NA"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.numberOfInstallments != null
                        ? row.numberOfInstallments
                        : "NA"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <button
                        onClick={() => handleViewStudent(row)}
                        className="px-4 py-1 bg-transparent text-black relative group text-sm
                          after:content-[''] after:absolute after:w-0 after:h-[1px] 
                          after:bottom-0 after:left-0 after:bg-black after:transition-all 
                          after:duration-300 hover:after:w-full"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DuePayout;
