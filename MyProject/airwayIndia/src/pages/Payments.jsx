import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaShareAlt } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { PaymentUrl, getAuthHeaders,StudentUrl } from "../config/config";
import { Eye } from "lucide-react";
import ReactModal from "react-modal";
import toast from "react-hot-toast";

const Payments = () => {
  const [timeFrame, setTimeFrame] = useState("30days");
  const [feesData, setFeesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [filterDate, setFilterDate] = useState(""); // Add this state
  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rowsPerPageOptions = [5, 10, 20, 50,100,200,500,1000,2000];
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28FD0",
    "#FF6666",
    "#FFB6B9",
  ];
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${PaymentUrl.feesCollection}`;
        const params = [];
        if (timeFrame !== "today") params.push(`timeFrame=${timeFrame}`);
        if (paymentMode) params.push(`paymentMode=${paymentMode}`);
        if (params.length) url += "?" + params.join("&");
        const response = await axios.get(url, {
          headers: getAuthHeaders(),
        });
        setFeesData(response?.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err.message || "Failed to fetch data");
        toast.error(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeFrame, paymentMode]);

  // Dummy data for the left chart
  const monthlyData = [
    { name: "Jan", amount: 12000 },
    { name: "Feb", amount: 19000 },
    { name: "Mar", amount: 3000 },
    { name: "Apr", amount: 5000 },
    { name: "May", amount: 2000 },
    { name: "Jun", amount: 3000 },
    { name: "Jul", amount: 8000 },
    { name: "Aug", amount: 9000 },
    { name: "Sep", amount: 10000 },
    { name: "Oct", amount: 11000 },
    { name: "Nov", amount: 12000 },
    { name: "Dec", amount: 13000 },
  ];

  // Prepare data for payment method distribution pie chart
  const methodDistributionData = feesData
    ? Object.entries(feesData?.data?.methodDistribution).map(
        ([name, value]) => ({ name, value })
      )
    : [];

  const paymentsRaw = feesData?.data?.payments || [];
  let filteredPayments = paymentsRaw;

  // Filter by payment mode (frontend)
  if (paymentMode) {
    filteredPayments = filteredPayments.filter(
      (p) => p.paymentMode === paymentMode
    );
  }

  // Filter by student name, payingAmount, or transactionId (frontend)
  if (activeFilter === "name" && studentName) {
    const searchValue = studentName.toLowerCase();
    filteredPayments = filteredPayments.filter((p) =>
      (p.fullName && p.fullName.toLowerCase().includes(searchValue)) ||
      (p.payingAmount && p.payingAmount.toString().includes(searchValue)) ||
      (p.transactionId && p.transactionId.toLowerCase().includes(searchValue))
    );
  }

  // Filter by single date (frontend)
  if (filterDate) {
    filteredPayments = filteredPayments.filter((p) => {
      const paymentDate = new Date(p.paymentDate).toISOString().slice(0, 10);
      return paymentDate === filterDate;
    });
  }

  const payments = filteredPayments;

  const totalPayments = payments.length;
  const totalPages = Math.ceil(totalPayments / rowsPerPage);
  const paginatedPayments = payments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to first page if rowsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, timeFrame]);

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-6">Fees Collection Dashboard</h1> */}
      <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow">
        <div className="flex flex-wrap items-center gap-3  ">
          <h2 className="text-xl font-semibold">Fees Collection</h2>
          <select
            className="border rounded px-3 py-1"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="15days">15days</option>
            <option value="30days">30days</option>
            <option value="6months">6months</option>
            <option value="yearly">yearly</option>
            <option value="lifetime">lifetime</option>
          </select>
        </div>
        <h3 className="text-lg font-medium mb-2">
          Total Collection: ₹
          {feesData?.data?.totalAmount?.toLocaleString() || 0}
        </h3>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Chart */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Fees Collection
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={monthlyData}
              margin={{
                top: 15,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#b91c1c" name="Amount (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Right Data */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : feesData ? (
            <div>
              <div className="mb-6">
                <div className="h-64">
                  <h4 className="text-md font-medium mb-2 text-center">
                    Payment Method Distribution
                  </h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={methodDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {methodDistributionData?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `₹${value.toLocaleString()}`,
                          "Amount",
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-end justify-end mt-3">
        <div className="flex w-full flex-col md:flex-row md:items-end gap-4 mb-6 bg-white p-4 rounded-lg shadow">
          {/* Student Name Search */}
          <div className="flex flex-col w-full">
            <label className="text-xs font-medium mb-1">Student Name</label>
            <input
              type="text"
              className="border rounded px-3 py-2"
              placeholder="Name, Transaction ID, or Amount"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                setActiveFilter("name");
              }}
              disabled={activeFilter && activeFilter !== "name"}
            />
          </div>
          {/* Date Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Date</label>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          {/* Payment Mode Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Payment Mode</label>
            <select
              className="border rounded px-3 py-2"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="">Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Online">Online</option>
              <option value="Cheque">Cheque</option>
              <option value="Demand Draft">Demand Draft</option>
              <option value="NEFT">NEFT</option>
            </select>
          </div>
          {/* Remove Search and Reset buttons
          <button
            className="bg-green-600 text-white px-4 py-2 text-sm rounded-md font-semibold hover:bg-green-700 transition"
            onClick={() => navigate(`/add-payment`)}
          >
            Add Payment
          </button> */}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 pt-4">
          <div className="text-gray-700 text-sm">
            Showing{" "}
            <span className="font-semibold">
              {(currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(currentPage * rowsPerPage, totalPayments)}
            </span>{" "}
            of <span className="font-semibold">{totalPayments}</span> payments
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Rows per page:</span>
            <select
              className="border rounded px-2 py-1"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              {rowsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <table className="min-w-full table-auto text-sm text-center mt-2">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 font-semibold">Receipt No.</th>
              <th className="px-4 py-2 font-semibold">Student Name</th>
              <th className="px-4 py-2 font-semibold">Course</th>
              <th className="px-4 py-2 font-semibold">Amount</th>
              <th className="px-4 py-2 font-semibold">Date</th>
              <th className="px-4 py-2 font-semibold">Transaction ID</th>
              <th className="px-4 py-2 font-semibold">Mode</th>
              <th className="px-4 py-2 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedPayments.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  No payments found.
                </td>
              </tr>
            ) : (
              paginatedPayments.map((payment, index) => (
                <tr
                  key={index}
                  className={`border-t hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-2">{payment?.receiptNo || "-"}</td>
                  <td className="px-4 py-2">{payment?.fullName || "-"}</td>
                  <td className="px-4 py-2 truncate max-w-[180px]">
                    {payment?.courseName || "-"}
                  </td>
                  <td className="px-4 py-2 text-green-600 font-semibold">
                    ₹{payment?.payingAmount || 0}
                  </td>
                  <td className="px-4 py-2">
                    {payment?.paymentDate
                      ? new Date(payment.paymentDate).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {payment?.transactionId || "-"}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {payment?.paymentMode || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center text-xl">
                    <Eye
                      className="inline-block cursor-pointer hover:text-blue-600"
                      onClick={async () => {
                        setPreviewLoading(true);
                        setIsPreviewOpen(true);
                        try {
                          const res = await axios.get(
                            `${StudentUrl.receiptPreview}/${payment.id}`,
                            {
                              headers: getAuthHeaders(),
                              responseType: "blob",
                            }
                          );
                          // console.log("View",res);
                          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
                          const pdfUrl = URL.createObjectURL(pdfBlob);
                          setPreviewData(pdfUrl);
                        } catch (err) {
                          setPreviewData(null);
                          toast.error("Failed to fetch receipt preview");
                        } finally {
                          setPreviewLoading(false);
                        }
                      }}
                    />
                    {/* <FaShareAlt className="inline-block cursor-pointer hover:text-blue-600" /> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-4 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      <ReactModal
        isOpen={isPreviewOpen}
        onRequestClose={() => {
          setIsPreviewOpen(false);
          if (previewData) {
            URL.revokeObjectURL(previewData);
            setPreviewData(null);
          }
        }}
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl w-full min-h-[80vh] relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            onClick={() => {
              setIsPreviewOpen(false);
              if (previewData) {
                URL.revokeObjectURL(previewData);
                setPreviewData(null);
              }
            }}
          >
            &times;
          </button>
          <h2 className="text-lg font-bold mb-4">Receipt Preview</h2>
          {previewLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : previewData ? (
            <iframe
              src={previewData}
              title="PDF Preview"
              className="w-full h-[75vh] border rounded"
            />
          ) : (
            <div className="text-center py-8 text-red-600">No data</div>
          )}
        </div>
      </ReactModal>
    </div>
  );
};

export default Payments;
