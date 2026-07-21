import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";
// import { toast } from 'react-toastify';
import { backendDomainS } from "../../../common/index";

const SnigdhaMasterLedgerReportPage = () => {
  // State variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState("master");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activeTab, setActiveTab] = useState("all"); // State for active tab

  // Fetch report data
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = `${backendDomainS}/api/v1/master-ledger/${reportType}`;

      // Build query parameters
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axios.get(`${endpoint}?${params.toString()}`);

      if (response.data.success) {
        setReportData(response.data.data);
        toast.success("Report data loaded successfully");
      } else {
        throw new Error(response.data.message || "Failed to fetch report data");
      }
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError(
        err.message || "An error occurred while fetching the report data"
      );
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  // Export report to Excel
  const exportToExcel = async () => {
    setLoading(true);
    try {
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();

      // Prepare data based on active tab
      let data = [];
      let sheetName = "";

      if (activeTab === "all") {
        // Headers for all transactions
        const headers = [
          "Sl. No.",
          "Date",
          "Invoice No.",
          "Type",
          "Income",
          "Expense",
          "Person",
        ];

        // Data rows for all transactions
        const rows = getFilteredData().map((item, index) => [
          index + 1,
          dayjs(item.date).format("DD-MM-YYYY"),
          item.invoiceNumber || "",
          item.type || "",
          item.type === "Sales" ? formatCurrency(item.amount || 0) : "",
          item.type === "Purchase" ? formatCurrency(item.amount || 0) : "",
          item.personName || item.customerName || item.vendorName || "",
        ]);

        data = [headers, ...rows];
        sheetName = "All Transactions";
      } else {
        // Headers for customer-wise data
        const headers = [
          "DATE RANGE",
          "CUSTOMER/VENDOR",
          "TYPE",
          "NO. OF INVOICES",
          "INCOME",
          "EXPENSE",
        ];

        // Data rows for customer-wise data
        const rows = getCustomerWiseData().map((item) => [
          `${dayjs(item.minDate).format("MM/DD/YYYY")} to ${dayjs(
            item.maxDate
          ).format("MM/DD/YYYY")}`,
          item.name || "",
          item.finalType === "sales" ? "Sales" : "Purchase",
          item.invoices.length,
          item.finalType === "sales"
            ? `+${formatCurrency(item.income || 0).replace("₹", "")}`
            : "",
          item.finalType === "purchase"
            ? `-${formatCurrency(item.expense || 0).replace("₹", "")}`
            : "",
        ]);

        // Add summary row
        const totalInvoices = getCustomerWiseData().reduce(
          (sum, item) => sum + item.invoices.length,
          0
        );
        const totalIncome = getCustomerWiseData()
          .filter((item) => item.finalType === "sales")
          .reduce((sum, item) => sum + (item.income || 0), 0);

        const totalExpense = getCustomerWiseData()
          .filter((item) => item.finalType === "purchase")
          .reduce((sum, item) => sum + (item.expense || 0), 0);

        rows.push([
          "",
          "Summary (Total)",
          "",
          `${totalInvoices} invoices`,
          `+${formatCurrency(totalIncome).replace("₹", "")}`,
          `-${formatCurrency(totalExpense).replace("₹", "")}`,
        ]);

        data = [headers, ...rows];
        sheetName = "Customer Wise";
      }

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(data);

      // Set column widths
      const colWidths =
        activeTab === "all"
          ? [8, 12, 15, 15, 12, 15, 30]
          : [25, 25, 12, 15, 15, 15];

      ws["!cols"] = colWidths.map((wch) => ({ wch }));

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Generate Excel file and trigger download
      XLSX.writeFile(
        wb,
        `Snigdha_Master_Ledger_${activeTab}_${dayjs().format(
          "YYYY-MM-DD"
        )}.xlsx`
      );

      toast.success("Excel report downloaded successfully");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      toast.error("Failed to download Excel report");
    } finally {
      setLoading(false);
    }
  };

  // Export report to PDF
  const exportToPDF = async () => {
    setLoading(true);
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Add title
      doc.setFontSize(16);
      doc.text(
        `Snigdha Master Ledger Report - ${
          activeTab === "all" ? "All Transactions" : "Customer Wise"
        }`,
        14,
        15
      );
      doc.setFontSize(10);

      // Format date range
      const dateRangeText =
        startDate && endDate
          ? `Period: ${dayjs(startDate).format("DD-MM-YYYY")} to ${dayjs(
              endDate
            ).format("DD-MM-YYYY")}`
          : "Period: All Time";

      doc.text(dateRangeText, 14, 22);

      // Prepare data based on active tab
      if (activeTab === "all") {
        // Headers for all transactions
        const headers = [
          "Sl. No.",
          "Date",
          "Invoice No.",
          "Type",
          "Income",
          "Expense",
          "Person",
        ];

        // Data rows for all transactions
        const rows = getFilteredData().map((item, index) => [
          index + 1,
          dayjs(item.date).format("DD-MM-YYYY"),
          item.invoiceNumber || "",
          item.type || "",
          item.type === "Sales" ? formatCurrency(item.amount || 0) : "",
          item.type === "Purchase" ? formatCurrency(item.amount || 0) : "",
          item.personName || item.customerName || item.vendorName || "",
        ]);

        // Generate table
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 30,
          styles: { fontSize: 8, cellPadding: 1 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          theme: "grid",
          margin: { top: 30, right: 10, bottom: 10, left: 10 },
          didDrawPage: (data) => {
            // Add page number
            doc.setFontSize(8);
            doc.text(
              `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
              data.settings.margin.left,
              doc.internal.pageSize.height - 5
            );
          },
        });
      } else {
        // Headers for customer-wise data
        const headers = [
          "DATE RANGE",
          "CUSTOMER/VENDOR",
          "TYPE",
          "NO. OF INVOICES",
          "INCOME",
          "EXPENSE",
        ];

        // Data rows for customer-wise data
        const customerWiseData = getCustomerWiseData();
        const rows = customerWiseData.map((item) => {
          // Format the income and expense values with + and - symbols
          const income =
            item.finalType === "sales"
              ? `+${formatCurrency(item.income || 0)}`
              : "";
          const expense =
            item.finalType === "purchase"
              ? `-${formatCurrency(item.expense || 0)}`
              : "";

          return [
            `${dayjs(item.minDate).format("MM/DD/YYYY")} to ${dayjs(
              item.maxDate
            ).format("MM/DD/YYYY")}`,
            item.name || "",
            item.finalType === "sales" ? "Sales" : "Purchase",
            item.invoices.length,
            income,
            expense,
          ];
        });

        // Generate table
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 30,
          styles: { fontSize: 9, cellPadding: 2 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          theme: "striped",
          margin: { top: 30, right: 10, bottom: 10, left: 10 },
          didDrawPage: (data) => {
            // Add page number
            doc.setFontSize(8);
            doc.text(
              `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
              data.settings.margin.left,
              doc.internal.pageSize.height - 5
            );
          },
          // Add custom styles for income and expense columns
          didDrawCell: (data) => {
            // Skip header row
            if (data.row.index === -1) return;

            // Apply green color to Income column
            if (
              data.column.index === 4 &&
              data.cell.text &&
              data.cell.text[0]?.startsWith("+")
            ) {
              doc.setTextColor(0, 128, 0); // Green
              doc.text(data.cell.text[0], data.cell.x + 2, data.cell.y + 5);
              doc.setTextColor(0, 0, 0); // Reset to black
              data.cell.text = [""];
            }

            // Apply red color to Expense column
            if (
              data.column.index === 5 &&
              data.cell.text &&
              data.cell.text[0]?.startsWith("-")
            ) {
              doc.setTextColor(255, 0, 0); // Red
              doc.text(data.cell.text[0], data.cell.x + 2, data.cell.y + 5);
              doc.setTextColor(0, 0, 0); // Reset to black
              data.cell.text = [""];
            }
          },
        });

        // Add summary row at the bottom
        const totalInvoices = customerWiseData.reduce(
          (sum, item) => sum + item.invoices.length,
          0
        );
        const totalIncome = customerWiseData
          .filter((item) => item.finalType === "sales")
          .reduce((sum, item) => sum + (item.income || 0), 0);

        const totalExpense = customerWiseData
          .filter((item) => item.finalType === "purchase")
          .reduce((sum, item) => sum + (item.expense || 0), 0);

        // Add summary as a separate table
        doc.autoTable({
          body: [
            [
              "",
              "Summary (Total)",
              "",
              `${totalInvoices} invoices`,
              `+${formatCurrency(totalIncome)}`,
              `-${formatCurrency(totalExpense)}`,
            ],
          ],
          startY: doc.lastAutoTable.finalY + 2,
          styles: { fontSize: 9, fontStyle: "bold", cellPadding: 2 },
          theme: "plain",
          tableWidth: "auto",
          margin: { left: 10, right: 10 },
          didDrawCell: (data) => {
            // Apply green color to Income column
            if (data.column.index === 4) {
              doc.setTextColor(0, 128, 0); // Green
              doc.text(data.cell.text[0], data.cell.x + 2, data.cell.y + 5);
              doc.setTextColor(0, 0, 0); // Reset to black
              data.cell.text = [""];
            }

            // Apply red color to Expense column
            if (data.column.index === 5) {
              doc.setTextColor(255, 0, 0); // Red
              doc.text(data.cell.text[0], data.cell.x + 2, data.cell.y + 5);
              doc.setTextColor(0, 0, 0); // Reset to black
              data.cell.text = [""];
            }
          },
        });
      }

      // Save PDF file
      doc.save(
        `Snigdha_Master_Ledger_${activeTab}_${dayjs().format("YYYY-MM-DD")}.pdf`
      );

      toast.success("PDF report downloaded successfully");
    } catch (err) {
      console.error("Error exporting to PDF:", err);
      toast.error("Failed to download PDF report");
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setReportType("master");
    setSearchTerm("");
    setSortField("date");
    setSortDirection("desc");
  };

  // Get filtered and sorted data for display
  const getFilteredData = () => {
    if (!reportData) return [];

    let allItems = [];

    // Collect all items from different ledgers
    if (reportData.salesLedger) {
      Object.entries(reportData.salesLedger.customers).forEach(
        ([customerName, data]) => {
          data.invoices.forEach((invoice) => {
            allItems.push({
              ...invoice,
              customerName,
              type: "Sales",
              category: invoice.type,
            });
          });
        }
      );
    }

    if (reportData.purchaseLedger) {
      Object.entries(reportData.purchaseLedger.vendors).forEach(
        ([vendorName, data]) => {
          data.purchases.forEach((purchase) => {
            allItems.push({
              ...purchase,
              vendorName,
              type: "Purchase",
              category: purchase.type,
            });
          });
        }
      );
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      allItems = allItems.filter(
        (item) =>
          (item.customerName &&
            item.customerName.toLowerCase().includes(search)) ||
          (item.vendorName && item.vendorName.toLowerCase().includes(search)) ||
          (item.invoiceNumber &&
            item.invoiceNumber.toLowerCase().includes(search)) ||
          (item.type && item.type.toLowerCase().includes(search)) ||
          (item.category && item.category.toLowerCase().includes(search))
      );
    }

    // Apply sorting
    allItems.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return allItems;
  };

  // Get paginated data
  const getPaginatedData = () => {
    const filteredData = getFilteredData();
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  };

  // Calculate total amount from filtered data
  const calculateTotalAmount = () => {
    const filteredData = getFilteredData();
    return filteredData.reduce((total, item) => total + (item.amount || 0), 0);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get customer-wise aggregated data
  const getCustomerWiseData = () => {
    const filteredData = getFilteredData();

    // Group data by customer/vendor name
    const groupedData = filteredData.reduce((acc, item) => {
      const name = item.customerName || item.vendorName;
      if (!acc[name]) {
        acc[name] = {
          name,
          invoices: [],
          minDate: new Date(item.date),
          maxDate: new Date(item.date),
          income: 0,
          expense: 0,
          finalType: "",
        };
      }

      // Track min and max dates
      const currentDate = new Date(item.date);
      if (currentDate < acc[name].minDate) {
        acc[name].minDate = currentDate;
      }
      if (currentDate > acc[name].maxDate) {
        acc[name].maxDate = currentDate;
      }

      // Add invoice to the list
      acc[name].invoices.push(item);

      // Update income or expense based on type
      if (item.type === "Sales") {
        acc[name].income += item.amount || 0;
        acc[name].finalType = "sales";
      } else if (item.type === "Purchase") {
        acc[name].expense += item.amount || 0;
        acc[name].finalType = "purchase";
      }

      return acc;
    }, {});

    // Convert to array and sort
    return Object.values(groupedData).sort((a, b) => {
      let aValue = a[sortField] || a.name;
      let bValue = b[sortField] || b.name;

      if (sortField === "date") {
        aValue = a.minDate;
        bValue = b.minDate;
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Get paginated customer-wise data
  const getPaginatedCustomerWiseData = () => {
    const customerWiseData = getCustomerWiseData();
    return customerWiseData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  };

  // Calculate total income from customer-wise data
  const calculateTotalIncome = () => {
    const customerWiseData = getCustomerWiseData();
    return customerWiseData.reduce((total, item) => total + item.income, 0);
  };

  // Calculate total expense from customer-wise data
  const calculateTotalExpense = () => {
    const customerWiseData = getCustomerWiseData();
    return customerWiseData.reduce((total, item) => total + item.expense, 0);
  };

  // Load data on initial render
  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Snigdha Pending Ledger Report
        </h1>
        <p className="text-gray-600">
          View and analyze all pending receivables and payables for Snigdha
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="report-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Report Type
            </label>
            <select
              id="report-type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="master">All Ledgers</option>
              <option value="sales">Sales Ledger</option>
              <option value="purchases">Purchases Ledger</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={fetchReportData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {loading ? "Loading..." : "Apply Filters"}
            </button>
            <button
              onClick={handleResetFilters}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for view selection */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Transactions
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "customer"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("customer")}
          >
            Customer/Vendor Wise
          </button>
        </div>
      </div>

      {/* Search and Export Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by customer, vendor, invoice number..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={exportToExcel}
              disabled={loading || !reportData}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export to Excel
            </button>

            <button
              onClick={exportToPDF}
              disabled={loading || !reportData}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clipRule="evenodd"
                />
              </svg>
              Export to PDF
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && !error && reportData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {reportData.salesLedger && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  Sales Receivables
                </h3>
                <p className="text-2xl font-bold mb-1">
                  {formatCurrency(reportData.salesLedger.totalPending)}
                </p>
                <p className="text-sm text-gray-600">
                  {Object.keys(reportData.salesLedger.customers).length}{" "}
                  Customers
                </p>
              </div>
            </div>
          )}

          {reportData.purchaseLedger && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-orange-600 mb-2">
                  Purchases Payables
                </h3>
                <p className="text-2xl font-bold mb-1">
                  {formatCurrency(reportData.purchaseLedger.totalPending)}
                </p>
                <p className="text-sm text-gray-600">
                  {Object.keys(reportData.purchaseLedger.vendors).length}{" "}
                  Vendors
                </p>
              </div>
            </div>
          )}

          {reportData.summary && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-purple-500 md:col-span-2">
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                      Total Receivables
                    </h4>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(reportData.summary.totalReceivables)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                      Total Payables
                    </h4>
                    <p className="text-xl font-bold text-orange-600">
                      {formatCurrency(reportData.summary.totalPayables)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                      Net Position
                    </h4>
                    <p
                      className={`text-xl font-bold ${
                        reportData.summary.netPosition >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(reportData.summary.netPosition)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Transactions Tab Content */}
      {!loading && !error && reportData && activeTab === "all" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sl.No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("customerName")}
                  >
                    <div className="flex items-center">
                      Customer/Vendor
                      {sortField === "customerName" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("invoiceNumber")}
                  >
                    <div className="flex items-center">
                      Invoice Number
                      {sortField === "invoiceNumber" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center">
                      Date
                      {sortField === "date" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center">
                      Amount
                      {sortField === "amount" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center">
                      Type
                      {sortField === "type" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedData().map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page * rowsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.customerName || item.vendorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dayjs(item.date).format("DD-MM-YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          item.type === "Sales"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                  </tr>
                ))}

                {getPaginatedData().length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={(page + 1) * rowsPerPage >= getFilteredData().length}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {getFilteredData().length > 0 ? page * rowsPerPage + 1 : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      (page + 1) * rowsPerPage,
                      getFilteredData().length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {getFilteredData().length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="rows-per-page"
                    className="text-sm text-gray-600"
                  >
                    Rows per page:
                  </label>
                  <select
                    id="rows-per-page"
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[5, 10, 25, 50].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({
                    length: Math.ceil(getFilteredData().length / rowsPerPage),
                  })
                    .slice(
                      Math.max(0, page - 2),
                      Math.min(
                        Math.ceil(getFilteredData().length / rowsPerPage),
                        page + 3
                      )
                    )
                    .map((_, index) => {
                      const pageNumber = Math.max(0, page - 2) + index;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handleChangePage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pageNumber
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber + 1}
                        </button>
                      );
                    })}

                  <button
                    onClick={() => handleChangePage(page + 1)}
                    disabled={
                      (page + 1) * rowsPerPage >= getFilteredData().length
                    }
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer/Vendor Wise Tab Content */}
      {!loading && !error && reportData && activeTab === "customer" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sl.No
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Customer/Vendor
                      {sortField === "name" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("finalType")}
                  >
                    <div className="flex items-center">
                      Type
                      {sortField === "finalType" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Range
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("invoices.length")}
                  >
                    <div className="flex items-center">
                      Invoices
                      {sortField === "invoices.length" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("income")}
                  >
                    <div className="flex items-center">
                      Income
                      {sortField === "income" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("expense")}
                  >
                    <div className="flex items-center">
                      Expense
                      {sortField === "expense" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedCustomerWiseData().map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page * rowsPerPage + index + 1}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          item.finalType === "sales"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {item.finalType === "sales" ? "Sales" : "Purchase"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dayjs(item.minDate).format("DD-MM-YYYY")} to{" "}
                      {dayjs(item.maxDate).format("DD-MM-YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.invoices.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {item.finalType === "sales"
                        ? formatCurrency(item.income)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {item.finalType === "purchase"
                        ? formatCurrency(item.expense)
                        : "-"}
                    </td>
                  </tr>
                ))}

                {getPaginatedCustomerWiseData().length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                )}

                {/* Summary row */}
                <tr className="bg-gray-50 font-medium">
                  <td
                    colSpan={4}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    Summary (Total)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getCustomerWiseData().reduce(
                      (sum, item) => sum + item.invoices.length,
                      0
                    )}{" "}
                    invoices
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {formatCurrency(calculateTotalIncome())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {formatCurrency(calculateTotalExpense())}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={
                  (page + 1) * rowsPerPage >= getCustomerWiseData().length
                }
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {getCustomerWiseData().length > 0
                      ? page * rowsPerPage + 1
                      : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      (page + 1) * rowsPerPage,
                      getCustomerWiseData().length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {getCustomerWiseData().length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="customer-rows-per-page"
                    className="text-sm text-gray-600"
                  >
                    Rows per page:
                  </label>
                  <select
                    id="customer-rows-per-page"
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[5, 10, 25, 50].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({
                    length: Math.ceil(
                      getCustomerWiseData().length / rowsPerPage
                    ),
                  })
                    .slice(
                      Math.max(0, page - 2),
                      Math.min(
                        Math.ceil(getCustomerWiseData().length / rowsPerPage),
                        page + 3
                      )
                    )
                    .map((_, index) => {
                      const pageNumber = Math.max(0, page - 2) + index;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handleChangePage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pageNumber
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber + 1}
                        </button>
                      );
                    })}

                  <button
                    onClick={() => handleChangePage(page + 1)}
                    disabled={
                      (page + 1) * rowsPerPage >= getCustomerWiseData().length
                    }
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading &&
        !error &&
        (!reportData ||
          (reportData &&
            getFilteredData().length === 0 &&
            activeTab === "all")) && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No data available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {startDate || endDate
                ? "No transactions found for the selected date range."
                : "No transactions found. Try adjusting your filters or adding new transactions."}
            </p>
            <div className="mt-6">
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default SnigdhaMasterLedgerReportPage;
