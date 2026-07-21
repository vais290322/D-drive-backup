import React, { useState, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import InventoryReportComponent from "./InventoryReportComponent";
import PurchaseReportComponent from "./PurchaseReportComponent";
import SaleReportComponent from "./SaleReportComponent";

const ReportComponent = () => {
  const { theme } = useTheme();
  const isDark = theme === "light";

  const [reportType, setReportType] = useState("inventory");

  /* ===================== DUMMY DATA ===================== */

  const cardBase = `rounded-xl p-5 shadow-md transition ${
    isDark
      ? "bg-gray-800 text-white border border-purple-500/20"
      : "bg-white text-gray-800 border border-gray-200"
  }`;

  const tableWrapper = `overflow-x-auto rounded-xl mt-6 ${
    isDark ? "bg-gray-800 border border-purple-500/20" : "bg-white border"
  }`;

  const theadClass = isDark
    ? "bg-gray-800 text-gray-200"
    : "bg-gray-100 text-gray-700";

  const rowClass = isDark
    ? "border-t border-purple-500/20 hover:bg-[#1e293b]"
    : "border-t hover:bg-gray-50";

  return (
    <div
      className={`rounded-xl p-6 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Reports</h2>

        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className={`px-4 py-2 rounded-md border ${
            isDark
              ? "bg-[#112038] border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        >
          <option value="inventory">Inventory Report</option>
          <option value="purchase">Purchase Report</option>
          <option value="sales">Sales Report</option>
        </select>
      </div>

      {/* ===================== SUMMARY BOXES ===================== */}

      {/* ===================== TABLE ===================== */}
      {reportType === "inventory" ? (
        <InventoryReportComponent />
      ) : reportType === "purchase" ? (
        <PurchaseReportComponent />
      ) : reportType === "sales" ? (
        <SaleReportComponent />
      ) : null}
    </div>
  );
};

export default ReportComponent;