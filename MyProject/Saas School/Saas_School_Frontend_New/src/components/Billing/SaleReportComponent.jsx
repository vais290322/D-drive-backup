import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import PaginationComponent from "../pagination/PaginationComponent";
import ExcelJS from "exceljs";

const BASE_URL = import.meta.env.VITE_REACT_BASE_URL_DEMO;

const SaleReportComponent = () => {
  const { theme } = useTheme();
  const isDark = theme === "light";
  const schoolId = useSelector((state) => state.auth.schoolId);

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterToday, setFilterToday] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/reports/${schoolId}/alltime/sales`
      );
      if (res.data.success && res.data.data) {
        setReportData(res.data.data);
      } else {
        toast.error("No sales data available");
        setReportData({ summary: {}, recentTransactions: [] });
      }
    } catch (error) {
      toast.error("Failed to fetch sales report");
      setReportData({ summary: {}, recentTransactions: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (!reportData) {
    return (
      <div className="p-6 text-center text-gray-400">
        Loading sales report...
      </div>
    );
  }

  const { summary, recentTransactions } = reportData;

  const filteredData = recentTransactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.invoiceNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.studentPhone.includes(searchTerm);

    const transactionDate = new Date(transaction.date);
    const today = new Date();
    const isToday = transactionDate.toDateString() === today.toDateString();
    const matchesToday = !filterToday || isToday;

    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    const matchesDate =
      (!fromDate || transactionDate >= fromDate) &&
      (!toDate || transactionDate <= toDate);

    return matchesSearch && matchesToday && matchesDate;
  });

  const filteredSummary = filterToday
    ? {
        totalTransactions: filteredData.length,
        totalGrossAmount: filteredData.reduce(
          (sum, t) => sum + t.grossAmount,
          0
        ),
        totalNetAmount: filteredData.reduce((sum, t) => sum + t.netAmount, 0),
        totalItemsSold: filteredData.reduce(
          (sum, t) => sum + t.items.length,
          0
        ),
      }
    : summary;

  const dataLength = filteredData.length;
  const totalPages = Math.ceil(dataLength / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setCurrentPage(1);
  };

  const downloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sales Report");

      // Add headers
      worksheet.columns = [
        { header: "SL", key: "sl", width: 5 },
        { header: "Invoice No", key: "invoiceNo", width: 15 },
        { header: "Date", key: "date", width: 12 },
        { header: "Student Name", key: "studentName", width: 20 },
        { header: "Phone", key: "phone", width: 15 },
        { header: "Class", key: "class", width: 10 },
        { header: "Item Names", key: "itemNames", width: 30 },
        { header: "Items", key: "items", width: 10 },
        { header: "Gross Amount", key: "grossAmount", width: 15 },
        { header: "Discount", key: "discount", width: 10 },
        { header: "Net Amount", key: "netAmount", width: 15 },
        { header: "Total Amount", key: "totalAmount", width: 15 },
      ];

      // Style the header row
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD3D3D3" }, // Grey color
        };
        cell.font = {
          bold: true,
          color: { argb: "FF000000" }, // Black text
          size: 12,
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });

      // Add data
      filteredData.forEach((transaction, index) => {
        const itemNames = transaction.items
          .map((item) => item.name || item.itemName || "Unknown Item")
          .join(", ");
        worksheet.addRow({
          sl: index + 1,
          invoiceNo: transaction.invoiceNumber,
          date: new Date(transaction.date).toLocaleDateString(),
          studentName: transaction.studentName,
          phone: transaction.studentPhone,
          class: transaction.className,
          itemNames: itemNames,
          items: transaction.items.length,
          grossAmount: transaction.grossAmount,
          discount: transaction.discount,
          netAmount: transaction.netAmount,
          totalAmount: transaction.totalAmount,
        });
      });

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Create blob and download
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const today = new Date().toISOString().split("T")[0];
      const fileName = filterToday
        ? `sales_report_today_${today}.xlsx`
        : "sales_report.xlsx";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(
        filterToday
          ? "Today's sales data downloaded successfully"
          : "Excel file downloaded successfully"
      );
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Failed to download Excel file");
    }
  };

  //   useEffect(() => {
  //     setCurrentPage(1);
  //   }, [searchTerm, dateFrom, dateTo, filterToday]);

  return (
    <div
      className={`rounded-xl p-6 shadow-lg ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">Sales Report</h2>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`${
            isDark
              ? "bg-gray-800 text-white border border-purple-300"
              : "bg-blue-100 text-gray-800 border border-blue-600"
          } p-4 rounded-lg text-center`}
        >
          <h3 className="text-lg font-semibold">Total Transactions</h3>
          <p className="text-2xl">{filteredSummary.totalTransactions || 0}</p>
        </div>
        <div
          className={`${
            isDark
              ? "bg-gray-800 text-white border border-purple-300"
              : "bg-green-100 text-gray-800 border border-green-600"
          } p-4 rounded-lg text-center`}
        >
          <h3 className="text-lg font-semibold">Total Gross Amount</h3>
          <p className="text-2xl">
            ₹{(filteredSummary.totalGrossAmount || 0).toFixed(2)}
          </p>
        </div>
        <div
          className={`${
            isDark
              ? "bg-gray-800 text-white border border-purple-300"
              : "bg-yellow-100 text-gray-800 border border-yellow-600"
          } p-4 rounded-lg text-center`}
        >
          <h3 className="text-lg font-semibold">Total Net Amount</h3>
          <p className="text-2xl">
            ₹{(filteredSummary.totalNetAmount || 0).toFixed(2)}
          </p>
        </div>
        <div
          className={`${
            isDark
              ? "bg-gray-800 text-white border border-purple-300"
              : "bg-red-100 text-gray-800 border border-red-600"
          } p-4 rounded-lg text-center`}
        >
          <h3 className="text-lg font-semibold">Total Items Sold</h3>
          <p className="text-2xl">{filteredSummary.totalItemsSold || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <Label>Search</Label>
          <Input
            type="text"
            placeholder="Search by Invoice No, Student Name, or Phone"
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
            onClick={() => setFilterToday(!filterToday)}
            variant={filterToday ? "default" : "outline"}
            className={`${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-transparent border-gray-600"
            } ${
              filterToday
                ? "bg-[#002e77] text-white"
                : "bg-[#112038] text-white"
            }`}
          >
            Today Only
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              setSearchTerm("");
              setDateFrom("");
              setDateTo("");
              setFilterToday(false);
              setCurrentPage(1);
            }}
            variant="outline"
            className={isDark ? "bg-gray-700 border-gray-600 text-white" : ""}
          >
            Reset
          </Button>
        </div>
        <div>
          <Button
            onClick={downloadExcel}
            className="bg-green-800 hover:bg-green-700 text-white"
          >
            Download Excel
          </Button>
        </div>
      </div>

      {/* Table */}
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
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-center">Items</th>
              <th className="px-4 py-3 text-right">Gross Amount</th>
              <th className="px-4 py-3 text-right">Discount</th>
              <th className="px-4 py-3 text-right">Net Amount</th>
              <th className="px-4 py-3 text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((transaction, index) => (
              <tr
                key={transaction._id}
                className={`border-t ${
                  isDark
                    ? "border-purple-500/30 hover:bg-[#1e293b]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-3">{startIndex + index + 1}</td>
                <td className="px-4 py-3 font-medium">
                  {transaction.invoiceNumber}
                </td>
                <td className="px-4 py-3">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">{transaction.studentName}</td>
                <td className="px-4 py-3">{transaction.studentPhone}</td>
                <td className="px-4 py-3">{transaction.className}</td>
                <td className="px-4 py-3 text-center">
                  {transaction.items.length}
                </td>
                <td className="px-4 py-3 text-right">
                  ₹{transaction.grossAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  ₹{transaction.discount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  ₹{transaction.netAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  ₹{transaction.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
            {!loading && currentPageData.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-6 text-gray-400">
                  No transactions found
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
  );
};

export default SaleReportComponent;
