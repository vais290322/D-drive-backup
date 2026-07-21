import React, { useEffect } from "react";
import { useState } from "react";

import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import InvoiceViewModal from "./InvoiceViewModal";

import { Eye, Edit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import InvoiceEditModal from "./InvoiceEditModal";
import { useSelector } from "react-redux";
import DeleteComponent from "../DeleteData/DeleteComponent";

const InvoiceesComponent = () => {
  const { theme } = useTheme();
  const isDark = theme === "light";
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const schooldetails = useSelector((state) => state.institute.institute);

  const schoolId = schooldetails?.schoolId;
  const BASE_URL = import.meta.env.VITE_REACT_BASE_URL_LOCAL;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // console.log("schooldetails in invoicees", schooldetails);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/sales//get-all-invoice/${schoolId}`
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInvoices(json.data);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      setInvoices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const statusBadge = (status) => {
    if (status === "Paid") {
      return "bg-green-600/20 text-green-400 border border-green-600/40";
    }
    return "bg-yellow-600/20 text-yellow-400 border border-yellow-600/40";
  };

  // Pagination logic
  const totalPages = Math.ceil(invoices.length / rowsPerPage);
  const paginatedData = invoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div
      className={`rounded-xl p-6 shadow-lg ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">Sales Invoices</h2>

      <div
        className={`overflow-x-auto rounded-xl border ${
          isDark ? "border-purple-500/40" : "border-gray-200"
        }`}
      >
        <table className="min-w-full text-sm">
          <thead
            className={`${
              isDark
                ? "bg-[#112038] text-gray-200"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <tr>
              <th className="px-4 py-3 text-left">SL</th>
              <th className="px-4 py-3 text-left">Invoice No</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Student Name</th>
              <th className="px-4 py-3 text-right">Total Amount</th>
              <th className="px-4 py-3 text-center">Payment Method</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((inv, index) => (
                <tr
                  key={inv._id}
                  className={`border-t ${
                    isDark
                      ? "border-purple-500/30 hover:bg-[#1e293b]"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td className="px-4 py-3 font-medium">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3">
                    {new Date(inv.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">{inv.studentName}, {inv.className}, {inv.section}, {inv.rollNumber}</td>
                  <td className="px-4 py-3 text-right">
                    ₹{Number(inv.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {inv.paymentMethod || " "}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className={`${
                          isDark
                            ? "bg-gray-700 border-gray-100 text-white hover:bg-gray-200"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowViewModal(true);
                        }}
                      >
                        <Eye size={16} />
                      </Button>
                 
                      {showViewModal && selectedInvoice && (
                        <InvoiceViewModal
                          open={showViewModal}
                          onClose={() => setShowViewModal(false)}
                          data={selectedInvoice}
                          theme={theme}
                        />
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className={`${
                          isDark
                            ? "bg-gray-700 border-gray-100 text-white hover:bg-gray-200"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                 
                      {showEditModal && selectedInvoice && (
                        <InvoiceEditModal
                          open={showEditModal}
                          onClose={() => setShowEditModal(false)}
                          data={selectedInvoice}
                          theme={theme}
                          onSuccess={() => {
                            fetchInvoices();
                            setShowEditModal(false);
                            setSelectedInvoice(null);
                          }}
                        />
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className={`${
                          isDark
                            ? "bg-gray-700 border-gray-100 text-white hover:bg-gray-200"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowPDF(true);
                        }}
                      >
                        <Download size={16} />
                      </Button>
                      <DeleteComponent
                        deletePath={`${BASE_URL}/api/sales/delete-invoice/${schoolId}/${inv._id}`}
                        name={"Sale Invoice"}
                        onDelete={() => {
                          setInvoices(
                            invoices.filter((item) => item._id !== inv._id)
                          );
                        }}
                        buttonClassName={`${
                          theme === "light"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white transition-colors`}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={`flex items-center justify-between mt-4 ${isDark ? "bg-gray-800 border-gray-100 text-white " : ""}`}>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            className={`border rounded px-2 py-1 ${isDark ? "bg-gray-700 border-gray-100 text-white" : "bg-white border-gray-300 text-gray-800"}`}
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border rounded"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-2 py-1 border rounded"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>

      {showPDF && selectedInvoice && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowPDF(false)}
        >
          <div
            style={{
              width: "80vw",
              height: "90vh",
              background: "#fff",
              borderRadius: 8,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <PDFViewer width="100%" height="100%">
              <InvoicePDF
                data={selectedInvoice}
                schoolDetails={schooldetails}
              />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
};
export default InvoiceesComponent;
