import React, { useState, useRef, useEffect } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";
import axios from "axios";

const fetchInventoryUrl = import.meta.env.VITE_REACT_FETCH_ITEMS;

const InventoryReportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [currentInventory, setCurrentInventory] = useState([]);
  // Add missing state variables for tooltips
  const [showLowStockTooltip, setShowLowStockTooltip] = useState(false);
  const [showOutOfStockTooltip, setShowOutOfStockTooltip] = useState(false);
  const componentRef = useRef();
  // Add missing refs for tooltip positioning
  const lowStockRef = useRef(null);
  const outOfStockRef = useRef(null);

  // console.log("inventory : ",currentInventory)

  const fetchCurrentInventory = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(fetchInventoryUrl);
      // console.log("response",response);

      setCurrentInventory(response?.data?.data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        // console.error("Error fetching current inventory:", error.message);
      }
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentInventory();
  }, []);

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(currentInventory?.map((item) => item?.category)),
  ];
  // Filter data based on search query, category and stock status
  const filteredData = currentInventory?.filter((item) => {
    const matchesSearch =
      (item?.item_name?.toLowerCase() || "").includes(
        searchQuery?.toLowerCase()
      ) ||
      (item?.item_id?.toLowerCase() || "").includes(searchQuery?.toLowerCase());

    let matchesStockStatus = true;
    if (stockFilter !== "all") {
      const quantity = parseInt(item?.quantity) || 0;

      switch (stockFilter) {
        case "inStock":
          matchesStockStatus = quantity > 10;
          break;
        case "lowStock":
          matchesStockStatus = quantity > 0 && quantity <= 10;
          break;
        case "outOfStock":
          matchesStockStatus = quantity === 0;
          break;
        default:
          matchesStockStatus = true;
      }
    }

    return matchesSearch && matchesStockStatus;
  });

  // Sort data
  const sortedData = [...(filteredData || [])].sort((a, b) => {
    let aValue, bValue;

    // Map sort fields to the actual data structure
    switch (sortField) {
      case "name":
        aValue = a?.item_name || "";
        bValue = b?.item_name || "";
        break;
      case "sku":
        aValue = a?.item_id || "";
        bValue = b?.item_id || "";
        break;
      case "quantity":
        aValue = a?.quantity || 0;
        bValue = b?.quantity || 0;
        break;
      case "unitPrice":
        aValue = a?.unit_price || 0;
        bValue = b?.unit_price || 0;
        break;
      case "totalValue":
        aValue = (a?.quantity || 0) * (a?.unit_price || 0);
        bValue = (b?.quantity || 0) * (b?.unit_price || 0);
        break;
      default:
        aValue = a[sortField] || "";
        bValue = b[sortField] || "";
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData?.slice(indexOfFirstItem, indexOfLastItem);
  // console.log('current imtems ; ',currentItems);
  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

  // Calculate totals
  const totalInventoryValue = filteredData?.reduce((sum, item) => {
    const itemValue = (item?.quantity || 0) * (item?.unit_prize || 0);
    return sum + itemValue;
  }, 0);

  // Fix duplicate declarations and calculate based on real data structure
  const totalItems = filteredData?.reduce(
    (sum, item) => sum + (parseInt(item?.quantity) || 0),
    0
  );

  // Calculate low stock and out of stock items based on quantity
  const lowStockItems = filteredData?.filter(
    (item) =>
      (parseInt(item?.quantity) || 0) > 0 &&
      (parseInt(item?.quantity) || 0) <= 10
  ).length;

  const outOfStockItems = filteredData?.filter(
    (item) => (parseInt(item?.quantity) || 0) === 0
  ).length;

  // Add missing filtered lists for tooltips
  const lowStockItemsList = filteredData?.filter(
    (item) =>
      (parseInt(item?.quantity) || 0) > 0 &&
      (parseInt(item?.quantity) || 0) <= 10
  );

  const outOfStockItemsList = filteredData?.filter(
    (item) => (parseInt(item?.quantity) || 0) === 0
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Inventory_Report",
  });
  // Handle Excel export
  const handleExcelExport = () => {
    // Transform data for export
    const exportData = filteredData.map((item) => {
      const totalValue = (item?.quantity || 0) * (item?.unit_prize || 0);
      const status =
        (item?.quantity || 0) > 10
          ? "In Stock"
          : (item?.quantity || 0) > 0
          ? "Low Stock"
          : "Out of Stock";

      return {
        "Product Name": item?.item_name || "N/A",
        "Inventory ID": item?.item_id || "N/A",
        Category: item?.category || "N/A",
        Quantity: item?.quantity || 0,
        "Unit Price": item?.unit_prize || 0,
        "Total Value": totalValue,
        Status: status,
        Buyer: item?.buyer_details?.buyer_name || "N/A",
        Seller: item?.seller_details?.seller_name || "N/A",
        "Created Date": item?.createdAt || "N/A",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

    // Add summary data
    const summaryData = [
      { Summary: "Total Inventory Value", Value: totalInventoryValue },
      { Summary: "Total Items", Value: totalItems },
      { Summary: "Low Stock Items", Value: lowStockItems },
      { Summary: "Out of Stock Items", Value: outOfStockItems },
    ];

    const summaryWS = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWS, "Summary");

    // Save file
    XLSX.writeFile(
      workbook,
      `Inventory_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };
  // Handle PDF export
  const handlePdfExport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Inventory Report", 14, 22);

    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Create table
    const tableColumn = [
      "Name",
      "item_id",
      "Quantity",
      "Unit Price",
      "Total Value",
      "Status",
    ];
    const tableRows = [];

    filteredData.forEach((item) => {
      const totalValue = (item?.quantity || 0) * (item?.unit_prize || 0);
      const status =
        (item?.quantity || 0) > 10
          ? "In Stock"
          : (item?.quantity || 0) > 0
          ? "Low Stock"
          : "Out of Stock";

      const rowData = [
        item?.item_name || "N/A",
        item?.item_id || "N/A",
        item?.quantity || 0,
        formatCurrency(item?.unit_prize || 0).replace("₹", "Rs."),
        formatCurrency(totalValue).replace("₹", "Rs."),
        status,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    // Add summary
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.text("Summary", 14, finalY + 15);

    const summaryData = [
      [
        "Total Inventory Value",
        formatCurrency(totalInventoryValue).replace("₹", "Rs."),
      ],
      ["Total Items", totalItems.toString()],
    ];

    doc.autoTable({
      body: summaryData,
      startY: finalY + 20,
      theme: "plain",
      styles: { fontSize: 10 },
    });

    doc.save(`Inventory_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        ref={componentRef}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Inventory Report in MNS
        </h1>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center">
              <span className="mr-2 whitespace-nowrap">Stock Status:</span>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handlePdfExport}
              className="flex items-center cursor-pointer gap-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
            >
              <FaFilePdf /> PDF
            </button>
            <button
              onClick={handleExcelExport}
              className="flex items-center cursor-pointer gap-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
            >
              <FaFileExcel /> Excel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center cursor-pointer gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              <FaPrint /> Print
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 print:hidden">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Total Items
            </h3>
            <p className="text-2xl font-bold text-blue-900">{totalItems}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Total Value
            </h3>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(totalInventoryValue)}
            </p>
          </div>
          <div
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm relative"
            onMouseEnter={() => setShowLowStockTooltip(true)}
            onMouseLeave={() => setShowLowStockTooltip(false)}
            ref={lowStockRef}
          >
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Low Stock Items
            </h3>
            <p className="text-2xl font-bold text-yellow-900">
              {lowStockItems}
            </p>

            {showLowStockTooltip && lowStockItemsList.length > 0 && (
              <div className="absolute z-10 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3 mt-2 left-0 top-full">
                <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                  Low Stock Items
                </h4>
                <div className="max-h-60 overflow-y-auto">
                  {lowStockItemsList.map((item, index) => (
                    <div
                      key={index}
                      className="py-1 border-b border-gray-100 last:border-0"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {item?.item_name || "N/A"}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>ID: {item?.item_id || "N/A"}</span>
                        <span className="text-yellow-600 font-medium">
                          Qty: {item?.quantity || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm relative"
            onMouseEnter={() => setShowOutOfStockTooltip(true)}
            onMouseLeave={() => setShowOutOfStockTooltip(false)}
            ref={outOfStockRef}
          >
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Out of Stock
            </h3>
            <p className="text-2xl font-bold text-red-900">{outOfStockItems}</p>

            {showOutOfStockTooltip && outOfStockItemsList.length > 0 && (
              <div className="absolute z-10 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3 mt-2 right-0 top-full">
                <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                  Out of Stock Items
                </h4>
                <div className="max-h-60 overflow-y-auto">
                  {outOfStockItemsList.map((item, index) => (
                    <div
                      key={index}
                      className="py-1 border-b border-gray-100 last:border-0"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {item?.item_name || "N/A"}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>ID: {item?.item_id || "N/A"}</span>
                        <span className="text-red-600 font-medium">
                          Qty: {item?.quantity || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sl.No.
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Product Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="ml-1" />
                      ) : (
                        <FaSortAmountDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("sku")}
                >
                  <div className="flex items-center">
                    Item Id
                    {sortField === "sku" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="ml-1" />
                      ) : (
                        <FaSortAmountDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === "category" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="ml-1" />
                      ) : (
                        <FaSortAmountDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("quantity")}
                >
                  <div className="flex items-center justify-end">
                    Quantity
                    {sortField === "quantity" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="ml-1" />
                      ) : (
                        <FaSortAmountDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("unitPrice")}
                >
                  <div className="flex items-center justify-end">
                    Unit Price
                    {sortField === "unitPrice" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="ml-1" />
                      ) : (
                        <FaSortAmountDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("totalValue")}
                >
                  <div className="flex items-center justify-end">
                    Total Value
                    {sortField === "totalValue" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="ml-1" />
                      ) : (
                        <FaSortAmountDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center justify-center">
                    Status
                    {sortField === "status" &&
                      (sortDirection === "asc" ? (
                        <FaSortAmountUp className="ml-1" />
                      ) : (
                        <FaSortAmountDown className="ml-1" />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems?.map((item, index) => {
                // Calculate total value for each item
                const totalValue =
                  (item?.quantity || 0) * (item?.unit_price || 0);

                return (
                  <tr key={item?.item_id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item?.item_name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item?.item_id || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item?.group || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item?.quantity || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(item?.unit_prize || 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(item?.total_prize)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          (item?.quantity || 0) > 10
                            ? "bg-green-100 text-green-800"
                            : (item?.quantity || 0) > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(item?.quantity || 0) > 10
                          ? "In Stock"
                          : (item?.quantity || 0) > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 print:hidden">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ml-2">entries</span>
          </div>

          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredData.length)} of{" "}
              {filteredData.length} entries
            </span>

            <div className="flex">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 cursor-pointer border rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 cursor-pointer border-t border-b border-r ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 cursor-pointer border-t border-b border-r bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 cursor-pointer border-t border-b border-r rounded-r-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReportPage;
