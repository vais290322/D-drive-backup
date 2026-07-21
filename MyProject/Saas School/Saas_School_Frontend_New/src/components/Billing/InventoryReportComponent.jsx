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

const InventoryReportComponent = () => {
  const { theme } = useTheme();
  const isDark = theme === "light";
  const schoolId = useSelector((state) => state.auth.schoolId);

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/reports/${schoolId}/inventory`
      );
      if (res.data.success) {
        setReportData(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch inventory report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  //   if (!reportData) return <div>Loading...</div>;
  if (!reportData) {
    return (
      <div className="p-6 text-center text-gray-400">
        Loading inventory report...
      </div>
    );
  }

  const { summary, allItems, lowStockItems, outOfStockItems } = reportData;

  const getCurrentItems = () => {
    switch (currentTab) {
      case "low":
        return lowStockItems;
      case "out":
        return outOfStockItems;
      default:
        return allItems;
    }
  };

  const filteredData = getCurrentItems().filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const itemDate = new Date(item.createdAt);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    const matchesDate =
      (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);
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

  const downloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Inventory Report");

      // Add headers
      worksheet.columns = [
        { header: "SL", key: "sl", width: 5 },
        { header: "Name", key: "name", width: 20 },
        { header: "Code", key: "code", width: 15 },
        { header: "Category", key: "category", width: 15 },
        { header: "Sub Category", key: "subCategory", width: 15 },
        { header: "Unit", key: "unit", width: 10 },
        { header: "Stock", key: "stock", width: 10 },
        { header: "Price", key: "price", width: 10 },
        { header: "Total Value", key: "totalValue", width: 15 },
        { header: "Purchase Stock", key: "purchaseStock", width: 15 },
        { header: "Sell Stock", key: "sellStock", width: 15 },
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
      filteredData.forEach((item, index) => {
        worksheet.addRow({
          sl: index + 1,
          name: item.name,
          code: item.code,
          category: item.category,
          subCategory: item.subCategory,
          unit: item.unit,
          stock: item.stock,
          price: item.price,
          totalValue: item.totalPrice,
          purchaseStock: item.totalPurchaseStock,
          sellStock: item.totalSellStock,
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
      a.download = "inventory_report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Excel file downloaded successfully");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Failed to download Excel file");
    }
  };

  //   useEffect(() => {
  //     setCurrentPage(1);
  //   }, [searchTerm, dateFrom, dateTo, currentTab]);

  return (
    <div
      className={`rounded-xl p-6 shadow-lg ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">Inventory Report</h2>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`
        ${
          isDark
            ? "bg-gray-800 text-white border border-purple-300"
            : "bg-blue-100 text-gray-800 border border-blue-600"
        }

        p-4 rounded-lg text-center`}
        >
          <h3 className="text-lg font-semibold">Total Items</h3>
          <p className="text-2xl">{summary.totalItems}</p>
        </div>
        <div
          className={`${
            isDark
              ? "bg-gray-800 text-white border border-purple-300"
              : "bg-green-100 text-gray-800 border border-green-600"
          } p-4 rounded-lg text-center`}
        >
          <h3 className="text-lg font-semibold">Total Stock</h3>
          <p className="text-2xl">{summary.totalStock}</p>
        </div>
        <div
          className={`
            
          ${
            isDark
              ? "bg-gray-800 text-white border border-purple-300"
              : "bg-yellow-100 text-gray-800 border border-yellow-600"
          }
            
            p-4 rounded-lg text-center`}
        >
          <h3 className="text-lg font-semibold">Total Value</h3>
          <p className="text-2xl">₹{summary.totalValue.toFixed(2)}</p>
        </div>
        <div
          className={` 
            
              ${
                isDark
                  ? "bg-gray-800 text-white border border-purple-300"
                  : "bg-red-100 text-gray-800 border border-red-600"
              }
            p-4 rounded-lg text-center`}
        >
          <h3 className="text-lg font-semibold">Low Stock Items</h3>
          <p className="text-2xl">{summary.lowStockItems}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setCurrentTab("all")}
          className={`px-4 py-2 rounded ${
            currentTab === "all"
              ? "bg-blue-500 text-white"
              : "bg-transparent border border-purple-300"
          }`}
        >
          All Items ({allItems.length})
        </button>
        <button
          onClick={() => setCurrentTab("low")}
          className={`px-4 py-2 rounded ${
            currentTab === "low"
              ? "bg-yellow-500 text-white"
              : "bg-transparent border border-purple-300"
          }`}
        >
          Low Stock ({lowStockItems.length})
        </button>
        <button
          onClick={() => setCurrentTab("out")}
          className={`px-4 py-2 rounded ${
            currentTab === "out"
              ? "bg-red-500 text-white"
              : "bg-transparent border border-purple-300"
          }`}
        >
          Out of Stock ({outOfStockItems.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <Label>Search</Label>
          <Input
            type="text"
            placeholder="Search by Name, Code, Category, or Sub Category"
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
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Sub Category</th>
              <th className="px-4 py-3 text-center">Unit</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Total Value</th>
              <th className="px-4 py-3 text-center">Purchase Stock</th>
              <th className="px-4 py-3 text-center">Sell Stock</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item, index) => (
              <tr
                key={item._id}
                className={`border-t ${
                  isDark
                    ? "border-purple-500/30 hover:bg-[#1e293b]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-3">{startIndex + index + 1}</td>
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">{item.code}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.subCategory}</td>
                <td className="px-4 py-3 text-center">{item.unit}</td>
                <td className="px-4 py-3 text-right">{item.stock}</td>
                <td className="px-4 py-3 text-right">
                  ₹{item.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  ₹{item.totalPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  {item.totalPurchaseStock}
                </td>
                <td className="px-4 py-3 text-center">{item.totalSellStock}</td>
              </tr>
            ))}
            {!loading && currentPageData.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-6 text-gray-400">
                  No items found
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

export default InventoryReportComponent;
