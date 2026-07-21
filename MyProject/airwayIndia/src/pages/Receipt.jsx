import React, { useEffect, useState } from "react";
import axios from "axios";
import { Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { getAuthHeaders, PaymentUrl } from "../config/config";

const ReceiptPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${PaymentUrl.getReceipts}`, {
        headers: getAuthHeaders(),
      });
      if (res.data.success) {
        setReceipts(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching receipts", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (paymentId) => {
    try {
      const res = await axios.get(
        `${PaymentUrl.receiptDownload}/${paymentId}`,
        {
          headers: getAuthHeaders(),
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt_${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(receipts.length / limit);
  const paginatedReceipts = receipts.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Receipt Management
      </h2>
      <div className="flex mb-5 items-end justify-end">
        <label id="row">Rows per page</label>
        <select
          value={limit}
          HtmlFor="row"
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setCurrentPage(1); // Reset to first page
          }}
          className="ml-5 border text-sm px-2 py-1 rounded "
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm table-auto">
              <thead className="bg-gray-200 text-gray-800 font-semibold text-center">
                <tr>
                  <th className="px-4 py-3 border-b">Sl. No.</th>
                  <th className="px-4 py-3 border-b">Receipt No</th>
                  <th className="px-4 py-3 border-b">Date</th>
                  <th className="px-4 py-3 border-b">Student</th>
                  <th className="px-4 py-3 border-b">Course</th>
                  <th className="px-4 py-3 border-b">Amount</th>
                  <th className="px-4 py-3 border-b">Payment Mode</th>
                  <th className="px-4 py-3 border-b">Transaction ID</th>
                  <th className="px-4 py-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700">
                {paginatedReceipts.map((r, index) => (
                  <tr key={r.id} className="hover:bg-gray-100 text-center">
                    <td className="px-4 py-3 border-b">
                      {(currentPage - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3 border-b">{r.receiptNumber}</td>
                    <td className="px-4 py-3 border-b">{r.date}</td>
                    <td className="px-4 py-3 border-b font-medium">
                      {r.studentName}
                    </td>
                    <td className="px-4 py-3 border-b">{r.diploma}</td>
                    <td className="px-4 py-3 border-b text-green-600 font-semibold">
                      ₹{r.installmentAmount}
                    </td>
                    <td className="px-4 py-3 border-b "><span className="bg-gray-100 border border-gray-400 py-1 px-3 rounded-2xl">{r.paymentMode}</span></td>
                    <td className="px-4 py-3 border-b">{r.transactionId}</td>
                    <td className="px-4 py-3 border-b text-center">
                      <button
                        onClick={() => downloadReceipt(r.paymentId)}
                        className="text-blue-600 hover:underline"
                      >
                        <Download className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
                {receipts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-500">
                      No receipts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-2 rounded bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-2 rounded bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReceiptPage;
