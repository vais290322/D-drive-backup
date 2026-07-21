import React, { use, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Listbox } from "@headlessui/react";
import { ChequeUrl, getAuthHeaders } from "../config/config";
import { useNavigate } from "react-router-dom";
function Cheque() {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [filteredCheques, setFilteredCheques] = useState([]);
  const navigate = useNavigate();
  const statuses = [
    { name: "Pending", color: "text-yellow-500" },
    { name: "Cleared", color: "text-green-500" },
    { name: "Bounced", color: "text-red-500" },
  ];
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCheque, setSelectedCheque] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [statusOption, setStatusOption] = useState("Pending");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");
  const [bankFilter, setBankFilter] = useState("");

  const [date, setDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const fetchCheques = async () => {
      try {
        const res = await axios.get(`${ChequeUrl.getSortCheques}`, {
          headers: getAuthHeaders(),
        });

        console.log("Checques Data:", res.data.data);

        if (res?.status === 200) {
          console.log("Fetched Cheques:", res.data);

          const data = res.data.data || [];
          

          setCheques(data || []);

          const newData = res.data.data.filter(
            (cheque) => cheque.status == statusOption
          );

          console.log("Filtered Cheques:", newData);
          

          setFilteredCheques(newData || []);
        }
      } catch (error) {
        console.error("Error fetching cheques:", error);
        toast.error(
          err.response?.data?.message || "Error fetching cheque data"
        );
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${ChequeUrl.getSummary}`, {
          headers: getAuthHeaders(),
        });
        setSummary(res.data.data || null);
        console.log(res.data.data);
      } catch (error) {
        toast.error(err.response?.data?.message || "Error fetching summary");
      }
    };
    fetchCheques();
    fetchSummary();
  }, []);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentCheques = filteredCheques.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCheques.length / rowsPerPage);
  // Modal handler
  const handleEditClick = (cheque) => {
    setSelectedCheque(cheque);
    setStatusOption(cheque.status || "NA");
    setModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedCheque) return;
    try {
      await axios.put(
        `${ChequeUrl.putStatus}/${selectedCheque.id}?status=${statusOption}`,
        {},
        { headers: getAuthHeaders() }
      );
      // Update local state after success
      setCheques((prev) =>
        prev.map((c) =>
          c.id === selectedCheque.id ? { ...c, status: statusOption } : c
        )
      );
      setModalOpen(false);
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };  

  const handleBankFilter = async (value) => {
    setBankFilter(value);
    setStatusFilter(""); // Only one filter at a time
    if (value) {
      setLoading(true);
      try {
        const res = await axios.get(
          `${ChequeUrl.getBankFilter}/${value}`,
          { headers: getAuthHeaders() }
        );
        setCheques(res.data.data || []);
      } catch (err) {
        toast.error("Failed to filter by bank");
      } finally {
        setLoading(false);
      }
    } else {
      // Reset to all cheques if cleared
      setLoading(true);
      try {
        const res = await axios.get(`${ChequeUrl.getCheques}`, {
          headers: getAuthHeaders(),
        });
        setCheques(res.data.data || []);
      } finally {
        setLoading(false);
      }
    }
  };

  const uniqueBankNames = Array.from(
    new Set(cheques.map((chq) => chq.bankName?.toUpperCase()).filter(Boolean))
  ).sort();

  const handleEditChecque = async (id, status) => {
    setPending(true);
    try {
      const response = await axios.put(
        `${ChequeUrl.putStatus}/${id}?status=${status}`,
        {}, // empty body
        { headers: getAuthHeaders() } // authorization token here
      );

      if (response.status === 200) {
        toast.success("Cheque status updated successfully");
        setFilteredCheques((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: statusOption } : c))
        );
        // fetchCheques()
      }
    } catch (error) {
      console.log(
        "Error updating cheque status:",
        error?.response?.data?.message
      );
      toast.error(
        error?.response?.data?.message || "Failed to update cheque status"
      );
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    const handleStatusFilter = async () => {
      try {
        const response = await axios.get(
          `${ChequeUrl.getStatusFilter}/${status}`,
          {
            headers: getAuthHeaders(),
          }
        );
        setFilteredCheques(response.data.data || []);
      } catch (error) {
        console.error("Error fetching cheques:", error);
        toast.error(
          error.response?.data?.message || "Error fetching cheque data"
        );
      }
    };

    handleStatusFilter();
  }, [status]);

  useEffect(() => {
    const handleSortBy = async () => {
      try {
        const response = await axios.get(
          `${ChequeUrl.getSortCheques}?${sortOption}`,
          {
            headers: getAuthHeaders(),
          }
        );
        setFilteredCheques(response.data.data || []);
      } catch (error) {
        console.error("Error fetching cheques:", error);
        toast.error(
          error.response?.data?.message || "Error fetching cheque data"
        );
      }
    };

    handleSortBy();
  }, [sortOption]);

  useEffect(() => {
    if (date) {
      const filtered = cheques?.filter((cheque) => {
        const chequeDate = new Date(cheque.chequeDate)
          .toISOString()
          .split("T")[0];
        const selectedDate = new Date(date).toISOString().split("T")[0];
        return chequeDate === selectedDate;
      });
      setFilteredCheques(filtered);
    } else {
      setFilteredCheques(cheques);
    }
  }, [date]);

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = cheques?.filter(
        (cheque) =>
          cheque.studentName?.toLowerCase().includes(lowerCaseQuery) ||
          cheque.studentId?.toLowerCase().includes(lowerCaseQuery) ||
          cheque.chequeNumber?.toString().includes(lowerCaseQuery) ||
          cheque.bankName?.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredCheques(filtered);
    } else {
      setFilteredCheques(cheques);
    }
  }, [searchQuery]);

  return (
    <div className="p-4">
      {/* Stat Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-5">
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-md my-2">Total Pending Cheque</p>
          <p className="text-2xl font-bold">
            {summary ? summary.pendingCheques.toLocaleString() : "--"}
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-md p-4">Total Pending Amount</p>
          <p className="text-2xl font-bold">
            ₹{summary ? summary.pendingAmount.toLocaleString() : "--"}
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-md p-4">30 Days Approved Amount</p>
          <p className="text-2xl font-bold">
            ₹{summary ? summary.clearedAmount.toLocaleString() : "--"}
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-md p-4">Oldest Pending</p>
          <p className="text-2xl font-bold">
            ₹{summary ? summary.pendingAmount.toLocaleString() : "--"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col w-full">
        <h2 className="text-lg font-semibold mb-2">Generate New Receipt</h2>
        <div className="flex gap-6">
          <input
            type="text"
            name="query"
            id="query"
            placeholder="Search by Name/ID/Amount"
            className="border rounded-md px-3 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <input
            type="date"
            name="date"
            id="date"
            className="border rounded-md px-3 py-2 w- sm:w-auto"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className="border rounded-md px-3 py-2 w- sm:w-auto"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="A_TO_Z">A to Z (Name)</option>
            <option value="Z_TO_A">Z to A (Name)</option>
            <option value="HIGHEST_DUE">Highest Due</option>
            <option value="LOWEST_DUE">Lowest Due</option>
            <option value="OLDEST_TO_NEWEST">Oldest to Newest</option>
            <option value="NEWEST_TO_OLDEST">Newest to Oldest</option>
          </select>

          <select
            className="border rounded-md px-3 py-2 w-full sm:w-auto"
            value={sortOption}
            onChange={async (e) => {
              const value = e.target.value;
              setPaymentMode(value);
            }}
          >
            <option value="">Payment Mode</option>
            <option value="A_TO_Z">Cheque</option>
            <option value="Z_TO_A">Demand Draft</option>
          </select>

          <select
            className="border rounded-md px-3 py-2 w-full sm:w-auto"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Successful</option>
            <option value="Rejected">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md px-10 py-6">
          <table className="min-w-full table-auto text-sm text-center">
            <thead className=" text-gray-700">
              <tr className=" border-black border-b-[1px] ">
                <th className="px-4 py-3 font-semibold">Receipt No.</th>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Student ID</th>
                <th className="px-4 py-3 font-semibold">Cheque No</th>
                <th className="px-4 py-3 font-semibold">Bank Name</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheques.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-400">
                    No cheque data found.
                  </td>
                </tr>
              ) : (
                filteredCheques.map((cheque, index) => (
                  <tr
                    key={cheque.id}
                    className={`border-t hover:bg-gray-50 transition-colors
                       ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                     border-gray-400 border-b-[1px]`}
                  >
                    <td className="px-4 py-3">{cheque.receiptNo || "N/A"}</td>
                    <td className="px-4 py-3">{cheque.studentName || "N/A"}</td>
                    <td className="px-4 py-3 capitalize">
                      {cheque.studentId || "N/A"}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {cheque.chequeNumber || "N/A"}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {cheque.bankName?.toUpperCase() || "N/A"}
                    </td>
                    <td className="px-4 py-3">{cheque.chequeDate || "N/A"}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">
                      ₹{cheque.payment?.amount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className=" text-sm  text-white bg-red-700 px-2 py-1 rounded-md mr-2"
                        onClick={() => handleEditChecque(cheque.id, "Rejected")}
                        disabled={pending}
                      >
                        Reject
                      </button>
                      <button
                        className=" text-sm  text-white bg-green-700 px-2 py-1 rounded-md"
                        onClick={() => handleEditChecque(cheque.id, "Approved")}
                        disabled={pending}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-xs sm:max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
              Update Cheque Status
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Status
              </label>
              <div className="flex flex-col gap-2">
                {statuses.map((status) => (
                  <label
                    key={status.name}
                    className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer border transition
                ${
                  statusOption === status.name
                    ? `${status.color} border-current bg-gray-50`
                    : "border-gray-200"
                }`}
                  >
                    <input
                      type="radio"
                      name="cheque-status"
                      value={status.name}
                      checked={statusOption === status.name}
                      onChange={() => setStatusOption(status.name)}
                      className="accent-current"
                    />
                    <span className={`font-medium ${status.color}`}>
                      {status.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                onClick={handleStatusChange}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cheque;
