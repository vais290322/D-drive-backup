import { useToast } from "@/context/ToastContext";
import api from "@/V2/service";
import { Download, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Dialog = ({ open, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target.id === "dialog-backdrop") onClose();
  };

  return (
    <div
      id="dialog-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center px-2 py-6"
    >
      <div className="relative w-full max-w-7xl sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 animate-fade-in-up border border-red-100 overflow-y-auto max-h-[90vh]">
        <button
          className="absolute cursor-pointer top-2 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold transition-transform duration-200 hover:scale-110"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
        <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(30px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
        `}</style>
      </div>
    </div>
  );
};

export default Dialog;

export const DashboardDonation = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState({});
  const [donorsData, setDonorsData] = useState([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [searchType, setSearchType] = useState("name"); // <-- added
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    amount: "",
    mode: "",
    txnId: "",
    note: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchStats();
    fetchDonors();
  }, []);

  async function fetchStats() {
    try {
      const { data } = await api.get("/admin/donations/stats");
      showToast("Donation stats fetched successfully", "success");
      setStats(data.data || {});
    } catch {
      showToast("Failed to fetch donation stats", "error");
    }
  }

  async function fetchDonors() {
    try {
      const {
        data: { data },
      } = await api.get("/admin/donations/list");
      setDonorsData(data.content || []);
    } catch {
      setDonorsData([]);
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      date: "",
      amount: "",
      mode: "",
      txnId: "",
      note: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        donateAmount: Number(form.amount),
        paymentMode: form.mode,
        transactionId: form.txnId,
        note: form.note,
        paymentType: "manual",
      };
      const res = await api.post("/admin/donations/manual-entry", payload);
      if (res.data?.success) {
        showToast("Manual donation entry added successfully!", "success");
        handleReset();
        fetchDonors();
        fetchStats();
      } else {
        showToast(res.data?.message || "Failed to add entry.", "error");
      }
    } catch {
      showToast("Error adding manual entry.", "error");
    }
  };

  const filteredDonors = donorsData.filter((item) => {
    const value = searchType === "email" ? item.email : item.name;
    return value?.toLowerCase().includes(search.toLowerCase());
  });
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);
  const paginatedDonors = filteredDonors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleEyeClick = (donor) => {
    setSelectedDonor(donor);
    setDialogOpen(true);
  };

  const handleDownloadReceipt = async (id) => {
    try {
      const response = await api.get(`/donate/receipt/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      showToast("Failed to download receipt.", "error");
    }
  };
  const handleDownloadReceiptBulk = async () => {
    try {
      const donationIds = donorsData.map((donor) => donor.id);
      const response = await api.post("/donate/receipts/bulk", donationIds, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `donation-receipts.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      showToast("Failed to download receipt ZIP.", "error");
    }
  };

  return (
    <>
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
        {[
          { label: "Total Donation", value: `₹${stats.totalDonations}` },
          { label: "Total Donors", value: stats.totalDonors },
          { label: "This Month", value: stats.thisMonth },
        ].map((item, i) => (
          <div
            key={i}
            className="border rounded-xl px-6 py-4 text-center shadow-sm bg-white"
          >
            <h3 className="font-semibold text-base text-gray-800 mb-1">
              {item.label}
            </h3>
            <p className="text-4xl font-bold text-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-xl w-full m-4">
        <div className="w-full mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 flex-wrap md:flex-nowrap w-full items-stretch ">
            <input
              type="text"
              placeholder="Search by Donors Name or Email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-0 text-base px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full md:w-52 px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              <option value="name">Search by Name</option>
              <option value="email">Search by Email</option>
            </select>
            {/* <div className="relative w-full md:w-[200px]">
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                className="w-full text-base px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 pr-10"
              />
              <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
            </div> */}
            {/* <button className="bg-black text-white font-semibold w-full md:w-[150px] px-5 py-3 rounded-md hover:opacity-90 transition">
              Filter
            </button> */}
            <button
              onClick={() => handleDownloadReceiptBulk()}
              className="bg-[#fef7f7] border border-red-100 text-black font-semibold w-full md:w-[200px] px-5 py-3 rounded-md hover:bg-red-100 transition"
            >
              Download All Receipt
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-md md:mr-5">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full table-fixed text-sm text-left ">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr>
                  <th className="px-4 py-3 w-1/6">Donor Name</th>
                  <th className="px-4 py-3 w-1/6">Email</th>
                  <th className="px-4 py-3 w-1/6">Amount</th>
                  <th className="px-4 py-3 w-1/6">Payment Mode</th>
                  <th className="px-4 py-3 w-1/3">Transaction ID</th>
                  <th className="px-4 py-3 w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDonors.length ? (
                  paginatedDonors.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{item.email}</td>
                      <td className="px-4 py-3">₹{item.donateAmount}</td>
                      <td className="px-4 py-3">{item.paymentMode || "NA"}</td>
                      <td className="px-4 py-3">
                        {item.transactionId ||
                          item.paymentDetails?.[0]?.orderId ||
                          "NA"}
                      </td>
                      <td className="px-4 flex justify-center gap-2 py-3">
                        <button onClick={() => handleEyeClick(item)}>
                          <EyeIcon className="text-black text-lg cursor-pointer" />
                        </button>
                        <button onClick={() => handleDownloadReceipt(item.id)}>
                          <Download className="text-black text-lg cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No donation records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attractive Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : " hover:bg-red-100 text-[#972626]"
              }`}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`px-3 py-1 rounded-full border transition-all mx-1 cursor-pointer ${
                  currentPage === idx + 1
                    ? "bg-[#972626] text-white border-[#972626] scale-110 shadow"
                    : " text-[#972626]  hover:bg-red-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : " hover:bg-red-100 text-[#972626] "
              }`}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        {selectedDonor && (
          <div className="w-full px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#972626] flex items-center justify-center gap-2">
              🎁 Donor Payment Details
            </h2>
            <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-xl">
              {selectedDonor.paymentDetails?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedDonor.paymentDetails.map((pd, i) => (
                    <div
                      key={i}
                      className="border border-red-100 bg-white rounded-lg p-4 shadow hover:shadow-md transition-all"
                    >
                      <p className="text-base font-semibold text-gray-800 mb-1">
                        {/* 📄 Order <span className="text-gray-600">{pd.orderId}</span> */}
                      </p>
                      <p className="text-base text-gray-700 mb-1">
                        💰 <b>Amount:</b>{" "}
                        <span className="text-green-600 font-bold">
                          ₹{pd.paidAmount}
                        </span>
                      </p>
                      <p className="text-base text-gray-700 mb-1">
                        📅 <b>Paid On:</b> {pd.paidOn}
                      </p>
                      <p className="text-base text-gray-700 mb-1">
                        🆔 <b>Txn ID:</b>{" "}
                        <span className="text-blue-600 underline">
                          {pd.paymentId}
                        </span>
                      </p>
                      <p className="text-base text-gray-700">
                        ✅ <b>Status:</b>{" "}
                        <span className="text-green-600 font-semibold">
                          {pd.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-6">
                  No payment details available.
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>

      {/* Manual Entry Form */}
      <div className="max-w-8xl m-4 p-4 bg-white rounded-md shadow-md">
        <h3 className="text-center text-lg font-medium mb-4">Manual Entry</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {["name", "email", "date"].map((field, i) => (
              <div className="flex-1" key={i}>
                <label className="text-sm font-medium capitalize">
                  {field}
                </label>
                <input
                  type={field === "date" ? "date" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 bg-red-50"
                  required={field !== "date"}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border rounded-md p-2 bg-red-50"
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Payment Mode</label>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="w-full border rounded-md p-2 bg-red-50"
                required
              >
                <option value="">Select</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Transaction ID</label>
              <input
                type="text"
                name="txnId"
                value={form.txnId}
                onChange={handleChange}
                className="w-full border rounded-md p-2 bg-red-50"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-md p-2 bg-red-50"
            ></textarea>
            <p className="md:text-xl md:font-semibold text-xs text-red-600 mt-1 italic">
              *Entry cannot be edited after submission.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 bg-red-50 border rounded-md font-semibold"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-md font-semibold"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
