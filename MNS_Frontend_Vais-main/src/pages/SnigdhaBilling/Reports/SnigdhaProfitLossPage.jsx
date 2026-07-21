import React, { useState, useRef, useEffect } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";
import { backendDomainS } from "../../../common/index";
// Import Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);
import { IoMdClose } from "react-icons/io";

const fetchInventoryUrl = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN;

const fetchInvoice = import.meta.env.VITE_BASE_URL_C;

const SnigdhaProfitLossPage = () => {
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(
    Math.ceil((new Date().getMonth() + 1) / 3)
  );

  const [salsesData, setSalseData]= useState({});

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentItem, setCurrentItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [totalSellingAmount, setTotalSellingAmount] = useState(0);
  const [currentInventory, setCurrentInventory] = useState([]);
  const [itemId, setItemId] = useState("");
const [itemDetails, setItemDetails] = useState(null);
const [itemPurchaseOrders, setItemPurchaseOrders] = useState([]);
const [isItemLoading, setIsItemLoading] = useState(false);
const [showItemDetails, setShowItemDetails] = useState(false);

const [totalProfit, setTotalProfit]= useState("")

  const componentRef = useRef();

  // console.log("item details : ",itemPurchaseOrders)

  const fetchSalesAnalysis = async ()=>{
    const response = await axios.get(`${backendDomainS}/api/v1/analytics/sales`)
    // console.log("response from sales analysis : ",response);
    if(response){
      setSalseData(response?.data?.data);
      setTotalSellingAmount(response?.data?.data?.totalSellingAmount);
      setTotalProfit(response?.data?.data?.totalProfit);
    }
  }

  const fetchCurrentInventory = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(fetchInventoryUrl);
      setCurrentInventory(response?.data?.data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      if (error.response) {
        // toast.error(error.response.data.message);
      } else {
        // console.error("Error fetching current inventory:", error.message);
      }
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentInventory();
    fetchSalesAnalysis();
  }, []);

  // Calculate totals
  const totalInventoryValue = currentInventory?.reduce((sum, item) => {
    const itemValue = (item?.quantity || 0) * (item?.unit_prize || 0);
    return sum + itemValue;
  }, 0);

  // Calculate profit
  // const calculateProfit = () => {
  //   return totalSellingAmount - totalInventoryValue;
  // };

  const calculateProfit = totalProfit;

  // Prepare data for pie chart
  const pieChartData = {
    labels: ["Total Inventory Value", "Total Selling Amount", "Profit"],
    datasets: [
      {
        data: [
          totalInventoryValue,
          totalSellingAmount,
          Math.abs(calculateProfit),
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          calculateProfit >= 0
            ? "rgba(75, 192, 75, 0.8)"
            : "rgba(255, 99, 132, 0.8)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          calculateProfit >= 0
            ? "rgba(75, 192, 75, 1)"
            : "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for bar chart
  const barChartData = {
    labels: ["Inventory Value", "Selling Amount", "Profit"],
    datasets: [
      {
        label: "Financial Overview",
        data: [
          totalInventoryValue,
          totalSellingAmount,
          Math.abs(calculateProfit),
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          calculateProfit >= 0
            ? "rgba(75, 192, 75, 0.6)"
            : "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          calculateProfit >= 0
            ? "rgba(75, 192, 75, 1)"
            : "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Financial Performance",
      },
    },
  };

  // console.log(totalSellingAmount, totalInventoryValue);
  // console.log("curent item : ",currentItem)

  const handleOpenModal = (item) => {
    setCurrentItem(item);
    setOpenModal(true);
  };

  const filteredData = data?.filter((item) => {
    const matchesSearch =
      item?.receiverDetails?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item?.receiverDetails?.phoneNumber?.includes(searchTerm);

    return matchesSearch;
  });

  const fetchAllPO = async () => {
    try {
      const response = await axios.get(
        `${fetchInvoice}/api/v2/invoice/invoices`
      );
      // console.log("response : ", response);

      if (response) {
        // toast.success(response?.data?.message);
        setData(response?.data?.data);

        // Calculate total selling amount
        const total = response?.data?.data?.reduce((sum, item) => {
          return sum + (parseFloat(item?.grandTotal) || 0);
        }, 0);
        // setTotalSellingAmount(total);
      }
    } catch (error) {
      // console.log("error : ", error);
      // toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchAllPO();
  }, []);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);




  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "";
      }
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "";
    }
  };
  // console.log("current row : ",data);
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get period label
  const getPeriodLabel = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (period === "monthly") {
      return `${months[month - 1]} ${year}`;
    } else if (period === "quarterly") {
      return `Q${quarter} ${year}`;
    } else {
      return `FY ${year}`;
    }
  };

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Profit_Loss_Statement",
  });

  // Handle Excel export
  const handleExcelExport = () => {
    // Prepare data for export
    const purchaseOrderData = currentRows.map((item, index) => ({
      "S.No": indexOfFirstRow + index + 1,
      "Buyer Name": item?.receiverDetails?.name || "",
      Contact: item?.receiverDetails?.phoneNumber || "",
      "Total Amount": item?.grandTotal || 0,
      "Ship Location": item?.location || "",
      Date: item?.date ? new Date(item.date)?.toISOString().split("T")[0] : "",
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add purchase orders sheet
    const poWS = XLSX.utils.json_to_sheet(purchaseOrderData);
    XLSX.utils.book_append_sheet(workbook, poWS, "Purchase Orders");

    // Add summary sheet
    const summaryData = [
      { Summary: "Total Inventory Value", Amount: totalInventoryValue },
      { Summary: "Total Selling Amount", Amount: totalSellingAmount },
      { Summary: "Profit/Loss", Amount: calculateProfit },
    ];

    const summaryWS = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWS, "Summary");

    // Save file
    XLSX.writeFile(
      workbook,
      `Profit_Loss_${getPeriodLabel().replace(/\s/g, "_")}.xlsx`
    );
  };

  // Handle PDF export
  const handlePdfExport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(`Profit & Loss Statement `,14,20);

    // Add summary section
    doc.setFontSize(14);
    doc.text("Financial Summary", 14, 35);

    const summaryData = [
      ["Category", "Amount"],
      [
        "Total Inventory Value",
        formatCurrency(totalInventoryValue).replace("₹", "Rs."),
      ],
      [
        "Total Selling Amount",
        formatCurrency(totalSellingAmount).replace("₹", "Rs."),
      ],
      [
        calculateProfit >= 0 ? "Profit" : "Loss",
        formatCurrency(Math.abs(calculateProfit)).replace("₹", "Rs."),
      ],
    ];

    doc.autoTable({
      head: [summaryData[0]],
      body: summaryData.slice(1),
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    // Add purchase orders table
    const poStartY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Purchase Orders", 14, poStartY - 5);

    const poColumns = [
      "S.No",
      "Buyer Name",
      "Contact",
      "Total Amount",
      "Ship Location",
      "Date",
    ];
    const poRows = currentRows.map((item, index) => [
      indexOfFirstRow + index + 1,
      item?.receiverDetails?.name || "",
      item?.receiverDetails?.phoneNumber || "",
      formatCurrency(item?.grandTotal || 0).replace("₹", "Rs."),
      item?.location || "",
      item?.date ? new Date(item.date)?.toISOString().split("T")[0] : "",
    ]);

    doc.autoTable({
      head: [poColumns],
      body: poRows,
      startY: poStartY,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    doc.save(`Profit_Loss_${getPeriodLabel().replace(/\s/g, "_")}.pdf`);
  };

  
// Add this new function to fetch item details
const fetchItemDetails = async () => {
  if (!itemId.trim()) {
    toast.error("Please enter an item ID");
    return;
  }

  setIsItemLoading(true);
  setShowItemDetails(false);

  try {
    const response = await axios.get(
      `${backendDomainS}/api/v1/inventory/details-and-orders/${itemId.trim()}`
    );

    // console.log("response from profit and loss : ",response);

    if (response.data.success) {
      setItemDetails(response.data.data.itemDetails);
      setItemPurchaseOrders(response.data.data.purchaseOrders || []);
      setShowItemDetails(true);
      // toast.success(response.data.message);
    } else {
      toast.error(response.data.message || "Failed to fetch item details");
    }
  } catch (error) {
    console.error("Error fetching item details:", error);
    toast.error(
      error?.response?.data?.message || "Failed to fetch item details"
    );
  } finally {
    setIsItemLoading(false);
  }
};

// Calculate total sold quantity and amount for the item
const calculateItemSales = () => {
  if (!itemPurchaseOrders || itemPurchaseOrders.length === 0) {
    return { totalQuantity: 0, totalAmount: 0 };
  }

  return itemPurchaseOrders?.reduce(
    (totals, order) => {
      const itemInOrder = order.items.find((item) => item.id === itemId);
      if (itemInOrder) {
        totals.totalQuantity += parseInt(itemInOrder.quantity) || 0;
        totals.totalAmount += parseFloat(itemInOrder.amount) || 0;
      }
      return totals;
    },
    { totalQuantity: 0, totalAmount: 0 }
  );
};

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
        
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Profit & Loss Statement for Snigdha
        </h1>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-medium opacity-90">
              Total Inventory Value
            </h3>
            <p className="text-3xl font-bold mt-2">
              ₹ {totalInventoryValue.toLocaleString()}
            </p>
            <div className="mt-2 text-sm opacity-80">
              <span>Based on {currentInventory.length} inventory items</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-medium opacity-90">
              Total Selling Amount
            </h3>
            <p className="text-3xl font-bold mt-2">
              ₹ {salsesData?.totalSellingAmount?.toLocaleString()}
            </p>
            <div className="mt-2 text-sm opacity-80">
              <span>From {data.length} Invoice </span>
            </div>
          </div>

          <div
            className={`bg-gradient-to-r ${
              calculateProfit >= 0
                ? "from-green-500 to-green-600"
                : "from-red-500 to-red-600"
            } text-white p-6 rounded-xl shadow-lg`}
          >
            <h3 className="text-lg font-medium opacity-90">
              {calculateProfit >= 0 ? "Profit" : "Remaning Stock Amount"}
            </h3>
            <p className="text-3xl font-bold mt-2">
              ₹ {salsesData?.totalProfit?.toLocaleString()}
            </p>
            <div className="mt-2 text-sm opacity-80">
              <span>
                {calculateProfit >= 0 ? "Net profit" : "Net amount"} for the
                period
              </span>
            </div>
          </div>
        </div>




        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Financial Distribution
            </h3>
            <div className="h-80">
              <Pie
                data={pieChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Financial Comparison
            </h3>
            <div className="h-80">
              <Bar
                data={barChartData}
                options={{ ...barChartOptions, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* search item section  */}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">
    Item Details Lookup
  </h2>

  <div className="flex flex-col md:flex-row gap-4 mb-6">
    <div className="flex-grow">
      <label
        htmlFor="itemId"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Enter Item ID
      </label>
      <div className="flex">
        <input
          type="text"
          id="itemId"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          placeholder="e.g. l2"
          className="flex-grow border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchItemDetails}
          disabled={isItemLoading}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition duration-300"
        >
          {isItemLoading ? "Loading..." : "Search"}
        </button>
      </div>
    </div>
  </div>

  {showItemDetails && itemDetails && (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Item Details Card */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium opacity-90">Item Details</h3>
          <p className="text-2xl font-bold mt-2">{itemDetails.item_name}</p>
          <div className="mt-4 space-y-2">
            <p>
              <span className="opacity-80">Item ID:</span> {itemDetails.item_id}
            </p>
            <p>
              <span className="opacity-80">Current Stock:</span>{" "}
              {itemDetails.quantity} units
            </p>
            <p>
              <span className="opacity-80">Unit Price:</span> ₹{" "}
              {itemDetails.unit_prize}
            </p>
            <p>
              <span className="opacity-80">Selling Price:</span> ₹{" "}
              {itemDetails.sellingPrice}
            </p>
            <p>
              <span className="opacity-80">Total Inventory Value:</span> ₹{" "}
              {itemDetails.total_prize}
            </p>
          </div>
        </div>

        {/* Sales Summary Card */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium opacity-90">Sales Summary</h3>
          <div className="mt-4 space-y-2">
            {(() => {
              const { totalQuantity, totalAmount } = calculateItemSales();
              const profit =
                totalAmount - itemDetails.unit_prize * totalQuantity;

              return (
                <>
                  <p>
                    <span className="opacity-80">Total Orders:</span>{" "}
                    {itemPurchaseOrders.length}
                  </p>
                  <p>
                    <span className="opacity-80">Total Sold Quantity:</span>{" "}
                    {totalQuantity} units
                  </p>
                  <p>
                    <span className="opacity-80">Total Sales Amount:</span> ₹{" "}
                    {totalAmount.toLocaleString()}
                  </p>
                  <p>
                    <span className="opacity-80">Cost of Goods Sold:</span> ₹{" "}
                    {(itemDetails.unit_prize * totalQuantity).toLocaleString()}
                  </p>
                  <p className="text-xl font-bold mt-4">
                    <span className="opacity-80">
                      {profit >= 0 ? "Profit:" : "Loss:"}
                    </span>{" "}
                    ₹ {Math.abs(profit).toLocaleString()}
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Purchase Orders Table */}
      {itemPurchaseOrders?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Purchase Orders for this Item
          </h3>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Buyer
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
              {itemPurchaseOrders?.map((order) => {
  const itemInOrder = order.items.find(
    (item) => item.id === itemId
  );
  return (
    <tr
      key={order._id}
      className="hover:bg-blue-50 transition-colors"
    >
      <td className="border border-gray-300 px-4 py-3">
        {formatDate(order.date)}
      </td>
      <td className="border border-gray-300 px-4 py-3">
        {order.receiverDetails.name}
      </td>
      <td className="border border-gray-300 px-4 py-3">
        {itemInOrder ? itemInOrder.quantity : "N/A"}
      </td>
      <td className="border border-gray-300 px-4 py-3 font-medium">
        ₹{" "}
        {itemInOrder
          ? parseFloat(itemInOrder.amount)
          : "N/A"}
      </td>
      <td className="border border-gray-300 px-4 py-3">
        {order.location}
      </td>
    </tr>
  );
})}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )}
</div>


        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
         

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
            {/* <button
              onClick={handlePrint}
              className="flex items-center cursor-pointer gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              <FaPrint /> Print
            </button> */}
          </div>
        </div>

      
        {/* for searching by name or email, segment, and status */}
        <div className="bg-white p-4 mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <input
            type="text"
            placeholder="Search name or number "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
        </div>

        {/* table */}
        <div className="overflow-x-auto bg-white" ref={componentRef} >
          <div className="max-h-auto overflow-y-auto border border-b-none border-gray-300 rounded-lg">
            <p className="bg-amber-300 pl-2 font-bold">All selling order </p>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    S.No
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Buyer Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Contact
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Total Amount
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Ship Location
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
              {currentRows.map((item, index) => (
  <tr
    key={item.id}
    className="hover:bg-gray-200 cursor-pointer"
    onClick={() => handleOpenModal(item)}
  >
    <td className="border border-gray-300 px-4 py-2 text-left">
      {indexOfFirstRow + index + 1}
    </td>
    <td className="border border-gray-300 px-4 py-2">
      {item?.receiverDetails?.name}
    </td>
    <td className="border border-gray-300 px-4 py-2">
      {item?.receiverDetails?.phoneNumber}
    </td>
    <td className="border border-gray-300 px-4 py-2">
      {item?.grandTotal}
    </td>
    <td className="border border-gray-300 px-4 py-2">
      {item?.location}
    </td>
    <td className="border border-gray-300 px-4 py-2">
      {formatDate(item?.date)}
    </td>
  </tr>
))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange("prev")}
            className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 "
          >
            Previous
          </button>
          <div>
            <select
              className="border p-2 rounded"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange("next")}
            className="bg-gradient-to-r from-pink-500 to-blue-500 cursor-pointer text-black px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-500 transition duration-300 border-amber-300 hover:to-pink-500 disabled:opacity-50 "
          >
            Next
          </button>
        </div>

        {openModal && currentItem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white w-[60%] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setOpenModal(false)}
                className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={24} />
              </button>

              {/* Modal Header */}
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4">
                Purchase Order Details
              </h2>

              {/* General Details */}
              <div className="mb-6 grid grid-cols-2 gap-4 text-gray-700">
                <p>
                  <strong className="text-gray-900">PO ID:</strong>{" "}
                  {currentItem._id}
                </p>
                {currentItem?.date && (
  <p>
    <strong className="text-gray-900">Date:</strong>{" "}
    {formatDate(currentItem?.date)}
  </p>
)}
                
                
                <p>
                  <strong className="text-gray-900">Billing Location:</strong>{" "}
                  {currentItem.location}
                </p>
                <p>
                  <strong className="text-gray-900">Client ID:</strong>{" "}
                  {currentItem?.receiverDetails?.name}
                </p>
              </div>

              {/* Buyer & Seller Details */}
              <div className="grid grid-cols-2 gap-6">
                {/* Buyer Section */}
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Buyer Details
                  </h3>
                  <p>
                    <strong>Buyer Name:</strong> {currentItem?.receiverDetails?.name}
                  </p>
                  <p>
                    <strong>Contact Person's Name:</strong>{" "}
                    {currentItem?.receiverDetails?.phoneNumber}
                  </p>
                  
                  <p>
                  <strong>Address:</strong>{" "}
                  {currentItem?.receiverDetails?.address}
                </p>
                
                </div>

                {/* Seller Section */}
                {/* <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Seller Details
                </h3>
                <p>
                  <strong>Name:</strong>{" "}
                  {currentItem?.seller_details?.seller_name}
                </p>
                <p>
                  <strong>Phone:</strong> {currentItem?.seller_details?.ph_no}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {currentItem?.seller_details?.address}
                </p>
                <p>
                  <strong>Email:</strong> {currentItem?.seller_details?.email}
                </p>
              </div>  */}
              </div>

              {/* Company Details */}
              {/* <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Company Details
                </h3>
                <p>
                  <strong>Company Name:</strong>{" "}
                  {currentItem?.companyDetails?.companyName}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {currentItem?.companyDetails?.companyAddress}
                </p>
                <p>
                  <strong>Email:</strong> {currentItem?.companyDetails?.email}
                </p>
                <p>
                  <strong>GSTIN:</strong> {currentItem?.companyDetails?.GST_IN}
                </p>
                <p>
                  <strong>PAN No:</strong> {currentItem?.companyDetails?.panNo}
                </p>
                <p>
                  <strong>Phone:</strong> {currentItem?.companyDetails?.ph_no}
                </p>
              </div> */}

              {/* Item Details Table */}
              {currentItem?.items && currentItem?.items?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Items
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-200 text-gray-700">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Item Name
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Quantity
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Total Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                      {currentItem?.items?.map((item, index) => (
  <tr key={index} className="border-b last:border-0">
    <td className="border border-gray-300 px-4 py-2">
      {item.itemName}
    </td>
    <td className="border border-gray-300 px-4 py-2">
      {item.quantity}
    </td>
    <td className="border border-gray-300 px-4 py-2">
      {item.amount}
    </td>
  </tr>
))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Purchase Order Summary */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Purchase Order Summary
                </h3>
                <p>
                  <strong>Requested By:</strong> {currentItem?.receiverDetails?.name}
                </p>
                
                {/* <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${
                    currentItem.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {currentItem?.status}
                </span>
              </p> */}
                <p>
                  <strong>Total Amount:</strong>{" "}
                  <span className="text-lg font-bold text-gray-800">
                    {currentItem?.grandTotal} INR
                  </span>
                </p>
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setOpenModal(false)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SnigdhaProfitLossPage 