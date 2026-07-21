import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTrash,
  FaFilePdf,
} from "react-icons/fa";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { backendDomainR1 } from "../../Common";

export default function ViewFormComponent() {
  const [reports, setReports] = useState([]);
  console.log(reports);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewReport, setViewReport] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  useEffect(() => {
    fetch(`${backendDomainR1}/api/v1/site-visits`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReports(data);
        } else if (Array.isArray(data.data)) {
          setReports(data.data);
        } else {
          setReports([]);
        }
      })
      .catch((err) => {
        toast.error("Failed to fetch reports!");
        console.error(err);
      });
  }, []);

  // --- Filtering and Pagination Logic ---
  const filteredReports = Array.isArray(reports)
    ? reports.filter(
        (r) =>
          (r.executiveName || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (r.siteName || "").toLowerCase().includes(search.toLowerCase()) ||
          (r.address || "").toLowerCase().includes(search.toLowerCase())
      )
    : [];
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage) || 1;
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // --- Action Handlers ---
  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;
    const id = reportToDelete._id || reportToDelete.id;
    if (!id) {
      toast.error("No report ID found!");
      setDeleteDialogOpen(false);
      return;
    }
    try {
      const response = await fetch(
        `${backendDomainR1}/api/v1/site-visits/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        toast.error("Failed to delete report!");
        setDeleteDialogOpen(false);
        return;
      }
      toast.success("Report deleted!");
      fetch(`${backendDomainR1}/api/v1/site-visits`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setReports(data);
          else if (Array.isArray(data.data)) setReports(data.data);
          else setReports([]);
        });
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    } catch (err) {
      toast.error("Error deleting report!");
      setDeleteDialogOpen(false);
      setReportToDelete(null);
      console.error(err);
    }
  };

  const handleBackendPDFDownload = async (report) => {
    const id = report._id || report.id;
    if (!id) {
      toast.error("No report ID found!");
      return;
    }
    const url = `${backendDomainR1}/api/v1/site-visits/generate-pdf/${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        toast.error("Failed to download PDF!");
        return;
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `site-visit-report-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      toast.error("Error downloading PDF!");
      console.error(err);
    }
  };

  // --- Modal Dialog Overlay ---
  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 backdrop-blur-[8px]"
        onClick={onClose}
      ></div>
      <div className="relative z-10 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-5xl">
        {children}
      </div>
    </div>
  );

  // --- Table Component ---
  return (
    <>
      <div className="p-0 w-full min-h-screen bg-transparent">
        {/* Table and Controls */}
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200 mb-6 w-full max-w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-4 bg-white shadow-sm rounded-lg">
              {/* Search Input */}
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search Executive, Site, Address..."
                  className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.242 1.156a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              {/* <label htmlFor="rowsPerPage" className="text-gray-700">Rows per page:</label> */}
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={100}>200</option>
                <option value={100}>300</option>
                <option value={100}>500</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Executive
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Site
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Address
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Convenience
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Observations
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-400">
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  paginatedReports?.map((r, idx) => {
                    const globalIdx = (currentPage - 1) * rowsPerPage + idx;
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{r.date}</td>
                        <td className="px-4 py-2 text-sm">{r.time}</td>
                        <td className="px-4 py-2 text-sm">{r.executiveName}</td>
                        <td className="px-4 py-2 text-sm">{r.siteName}</td>
                        <td className="px-4 py-2 text-sm">{r.address}</td>
                        <td className="px-4 py-2 text-sm">{r.convenience || "-"}</td>
                        <td className="px-4 py-2 text-sm">{r.observations}</td>
                        <td className="px-4 py-2 flex text-center text-sm">
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition cursor-pointer "
                            title="View"
                            onClick={() => setViewReport(r)}
                          >
                            <FaEye size={18} />
                          </button>
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition cursor-pointer"
                            title="Delete"
                            onClick={() => handleDeleteClick(r)}
                          >
                            <FaTrash size={18} />
                          </button>
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition cursor-pointer"
                            title="Download PDF"
                            onClick={() => handleBackendPDFDownload(r)}
                          >
                            <FaFilePdf size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 w-full gap-4">
            <span className="text-sm text-gray-600">
              Showing{" "}
              {filteredReports.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
              -{Math.min(currentPage * rowsPerPage, filteredReports.length)} of{" "}
              {filteredReports.length}
            </span>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  className={`w-6 h-6 flex items-center justify-center rounded-full border transition-all ${
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-blue-100 text-blue-600 cursor-pointer"
                  }`}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`w-6 h-7 flex items-center justify-center rounded-full border transition-all mx-0.5
                      ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white shadow ring-2 ring-blue-300 border-blue-600 font-bold"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100 hover:text-blue-700"
                      }
                    `}
                    style={{ minWidth: 32 }}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className={`w-6 h-6 flex items-center justify-center rounded-full border transition-all ${
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-blue-100 text-blue-600 cursor-pointer"
                  }`}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Report Modal */}
        {viewReport && (
          <Modal onClose={() => setViewReport(null)}>
            <div className="p-6 space-y-6 w-full relative">
              <button
                type="button"
                onClick={() => setViewReport(null)}
                className="absolute top-4 right-4 text-red-500 font-bold text-2xl cursor-pointer z-20"
              >
                &times;
              </button>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-blue-700">
                  Report Details
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Date:</span> {viewReport.date}
                </div>
                <div>
                  <span className="font-semibold">Time:</span> {viewReport.time}
                </div>
                <div>
                  <span className="font-semibold">Executive:</span>{" "}
                  {viewReport.executiveName}
                </div>
                <div>
                  <span className="font-semibold">Site:</span>{" "}
                  {viewReport.siteName}
                </div>
                <div className="md:col-span-2">
                  <span className="font-semibold">Address:</span>{" "}
                  {viewReport.locationAddress || viewReport.address}
                </div>
                 <div className="md:col-span-2">
                  <span className="font-semibold">Convenience:</span>{" "}
                  {viewReport.convenience || "-" }
                </div>
                <div className="md:col-span-2">
                  <span className="font-semibold">Observations:</span>{" "}
                  {viewReport.observations}
                </div>
                <div className="md:col-span-2">
                  <span className="font-semibold">Complaints:</span>{" "}
                  {viewReport.complaints}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Questions & Answers
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          #
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Question
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Answer
                        </th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(viewReport.checklistItems || []).map((q, i) => (
                        <tr key={q.id || i}>
                          <td className="px-2 py-1 text-xs">{i + 1}</td>
                          <td className="px-2 py-1 text-xs">{q.description}</td>
                          <td
                            className={`px-2 py-1 text-sm font-bold ${
                              q.status === "Yes"
                                ? "text-green-500"
                                : q.status === "No"
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {q.status}
                          </td>
                          <td className="px-2 py-1 text-xs">{q.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-100 text-red-600 rounded-full p-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-red-600">
                  Delete Report
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to permanently delete this report? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
