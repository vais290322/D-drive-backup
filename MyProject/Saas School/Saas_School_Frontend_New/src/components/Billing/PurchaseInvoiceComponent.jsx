import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Edit, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "@/context/ThemeContext";
import InvoicePDF from "./PurchaseInvoicePDF";
import EditPurchaseDialog from "./EditPurchasecomponent";
import PaginationComponent from "../pagination/PaginationComponent";

const BASE_URL = import.meta.env.VITE_REACT_BASE_URL_DEMO;

const PurchaseInvoiceComponent = () => {
  const { theme } = useTheme();
  const isDark = theme === "light";
  const schoolId = useSelector((state) => state.auth.schoolId);
  const schooldetails = useSelector((state) => state.institute.institute);
  // console.log(schooldetails);

  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  /* ================= FETCH ALL PURCHASE INVOICES ================= */

  const fetchPurchaseInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/purchase/all/${schoolId}`);
      // console.log(res.data.data);
      if (res.data.success) {
        setPurchaseInvoices(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch purchase invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseInvoices();
  }, []);

  const filteredData = purchaseInvoices.filter((inv) => {
    const matchesSearch =
      searchTerm === "" ||
      inv.purchaseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
    const invDate = new Date(inv.date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    const matchesDate =
      (!fromDate || invDate >= fromDate) && (!toDate || invDate <= toDate);
    return matchesSearch && matchesDate;
  });

  const dataLength = filteredData.length;
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFrom, dateTo]);

  return (
    <>
      <div
        className={`rounded-xl p-6 shadow-lg ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">Purchase Invoices</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div className="flex-1 min-w-[200px]">
            <Label>Search</Label>
            <Input
              type="text"
              placeholder="Search by Invoice No or Seller Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={isDark ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Label>Date From</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={isDark ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Label>Date To</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={isDark ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>
          <div>
            <Button
              onClick={() => {
                setSearchTerm("");
                setDateFrom("");
                setDateTo("");
                setCurrentPage(1);
              }}
              variant="outline"
              className={isDark ? "bg-gray-700 border-gray-600 text-white" : ""}
            >
              Reset
            </Button>
          </div>
        </div>

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
                <th className="px-4 py-3 text-left">Seller Name</th>
                <th className="px-4 py-3 text-right">Total Amount</th>
                <th className="px-4 py-3 text-center">Seller Address</th>
                <th className="px-4 py-3 text-center">Seller Phone</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentPageData.map((inv, index) => (
                <tr
                  key={inv._id}
                  className={`border-t ${
                    isDark
                      ? "border-purple-500/30 hover:bg-[#1e293b]"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{startIndex + index + 1}</td>
                  <td className="px-4 py-3 font-medium">{inv.purchaseNo}</td>
                  <td className="px-4 py-3">
                    {new Date(inv.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">{inv.sellerName}</td>
                  <td className="px-4 py-3 text-right">
                    ₹{Number(inv.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">{inv.sellerAddress}</td>
                  <td className="px-4 py-3 text-center">{inv.sellerPhone}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className={`${
                          isDark
                            ? "bg-[#112038] text-gray-200"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setOpenView(true);
                        }}
                      >
                        <Eye size={16} />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className={`${
                          isDark
                            ? "bg-[#112038] text-gray-200"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => {
                          setEditInvoice(inv);
                          setOpenEdit(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>

                      <PDFDownloadLink
                        document={
                          <InvoicePDF
                            data={inv}
                            schooldetails={schooldetails}
                          />
                        }
                        fileName="Tax-Invoice.pdf"
                        className="download-btn"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className={`${
                            isDark
                              ? "bg-[#112038] text-gray-200"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <Download size={16} />
                        </Button>
                      </PDFDownloadLink>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && purchaseInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    No purchase invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          dataLength={dataLength}
          theme={theme}
        />
      </div>
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent
          className={`max-w-5xl rounded-xl ${
            isDark ? "bg-[#0f172a] text-gray-200" : "bg-white text-gray-800"
          }`}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Purchase Invoice
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6 text-sm">
              {/* ===== HEADER INFO ===== */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-400">Invoice No</p>
                  <p className="font-semibold">{selectedInvoice.purchaseNo}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">Invoice Date</p>
                  <p className="font-semibold">
                    {new Date(selectedInvoice.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ===== SELLER DETAILS ===== */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Seller Details</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p>{selectedInvoice.sellerName}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p>{selectedInvoice.sellerPhone}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Address</p>
                    <p>{selectedInvoice.sellerAddress}</p>
                  </div>
                </div>
              </div>
                {/* ===== CREATE BY DETAILS ===== */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Create By</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p>{selectedInvoice.createdBy?.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p>{selectedInvoice.createdBy?.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Role</p>
                    <p>{selectedInvoice.createdBy?.role}</p>
                  </div>
                </div>
              </div>

              {/* ===== ITEMS TABLE ===== */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead
                    className={`${
                      isDark
                        ? "bg-[#112038] text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <tr>
                      <th className="px-3 py-2 text-left">SL</th>
                      <th className="px-3 py-2 text-left">Item</th>
                      <th className="px-3 py-2 text-left">Category</th>
                      <th className="px-3 py-2 text-center">Unit</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-right">Price</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedInvoice.items.map((item, i) => (
                      <tr
                        key={item._id}
                        className={`border-t ${
                          isDark ? "border-purple-500/30" : "border-gray-200"
                        }`}
                      >
                        <td className="px-3 py-2">{i + 1}</td>
                        <td className="px-3 py-2">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-400">
                            Code: {item.code}
                          </p>
                        </td>
                        <td className="px-3 py-2">
                          <p>{item.category}</p>
                          <p className="text-xs text-gray-400">
                            {item.subCategory}
                          </p>
                        </td>
                        <td className="px-3 py-2 text-center">{item.unit}</td>
                        <td className="px-3 py-2 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2 text-right">
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold">
                          ₹{item.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===== TOTALS ===== */}
              <div className="flex justify-end">
                <div className="w-72 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Gross Amount</span>
                    <span>₹{selectedInvoice.grossAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>₹{selectedInvoice.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span> Net Amount </span>
                    <span>₹{selectedInvoice.netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Round Off</span>
                    <span>₹{selectedInvoice.roundOff.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between border-t pt-2 font-bold text-base">
                    <span>Total Amount</span>
                    <span className="text-green-600">
                      ₹{selectedInvoice.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ===== ACTIONS ===== */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className={`${
                    isDark
                      ? "bg-[#0f172a] text-gray-200"
                      : "bg-white text-gray-800"
                  }`}
                  onClick={() => setOpenView(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <EditPurchaseDialog
        open={openEdit}
        setOpen={setOpenEdit}
        invoice={editInvoice}
        schoolId={schoolId}
        onUpdated={fetchPurchaseInvoices}
      />
    </>
  );
};

export default PurchaseInvoiceComponent;
  