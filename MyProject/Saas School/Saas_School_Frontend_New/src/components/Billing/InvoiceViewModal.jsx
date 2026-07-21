import React from "react";
import { useTheme } from "@/context/ThemeContext";
const InvoiceViewModal = ({ open, onClose, data, theme }) => {
    //   const { theme } = useTheme();
    // console.log("InvoiceViewModal theme:", theme);
      const isDark = theme === "light";
          // console.log("is dark", isDark);
  const fmt = (num) =>
    num !== undefined && num !== null ? Number(num).toFixed(2) : "0.00";
  if (!open || !data) return null;

  return (
<div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-[95vw]
 max-h-[90vh] overflow-y-auto
        ${isDark ? "bg-[#112038] text-white" : "bg-white text-gray-900"}
        rounded-xl shadow-2xl p-6 md:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-2xl font-bold opacity-60 hover:opacity-100"
          onClick={onClose}
        >
          ×
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b pb-4 mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-wide">SALE INVOICE</h2>
            <p className="text-sm opacity-70">
              Invoice No: {data.invoiceNumber}
            </p>
          </div>

          <div className="text-sm md:text-right space-y-1">
     
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(data.date).toLocaleDateString()}
            </p>
                      <p>
              <div className="font-medium">Created By:</div>{" "}
              <div>name:{" "}{data.createdBy?.name}</div>
              <div>Role:{" "}{data.createdBy?.role}</div>
            </p>
            <p>
              <span className="font-medium">Status:</span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
                {data.status || "Pending"}
              </span>
            </p>
          </div>
        </div>

        {/* Student Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-8 border p-5 rounded-xl">
          <div className="space-y-1">
            <p className="font-semibold uppercase text-xs opacity-70">
              Billed To
            </p>
            <p className="font-medium">{data.studentName}</p>
            <p>Admission No: {data.admissionNumber}</p>
            <p>Phone: {data.studentPhone}</p>
            <p >Address: {data.studentAddress}</p>
          </div>

          <div className="space-y-1 md:text-right">
            <p>Class: {data.className}</p>
            <p>Section: {data.section}</p>
            <p>Roll No: {data.rollNumber}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="relative mb-6 w-full">
        <div className=" overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className=" text-sm min-w-[1300px] w-full border-collapse">
            <thead
              className={`sticky top-0 z-10 ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <tr>
                <th className="px-3 py-2 text-left">Item</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Unit</th>
                <th className="px-3 py-2 text-left">₹/Unit</th>
                <th className="px-3 py-2 text-left">Qty</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Sub Category</th>
                <th className="px-3 py-2 text-left">Sell Price</th>
                <th className="px-3 py-2 text-left">Total</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(data.items) &&
                data.items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-gray-100/50 dark:hover:bg-gray-800"
                  >
                    <td className="px-3 py-2 font-medium whitespace-nowrap text-left">
                      {item.name}
                    </td>
                    <td className="px-3 py-2 max-w-[240px] truncate text-left">
                      {item.description}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-left">
                      {item.unit}
                    </td>
                    <td className="px-3 py-2 text-left">
                      ₹{fmt(item.price)}
                    </td>
                    <td className="px-3 py-2 text-left">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-left">
                      {item.category}
                    </td>
                    <td className="px-3 py-2 whitespace-nowra text-left">
                      {item.subCategory}
                    </td>
                    <td className="px-3 py-2  text-left">
                      ₹{fmt(item.sellPrice)}
                    </td>
                    <td className="px-3 py-2 text-left font-semibold">
                      ₹{fmt(item.totalPrice)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
</div>
        {/* Amount Summary */}
        <div className={`flex justify-end `}>
          <div className={`w-full md:w-1/2  rounded-lg p-4 text-sm space-y-2 ${isDark ? "text-white bg-[#112038]" : "text-black bg-white"}`}>
              
            <div className="flex justify-between">
              <span>Gross Amount</span>
              <span>₹{fmt(data.grossAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>- ₹{fmt(data.discount)}</span>
            </div>
             <div className="flex justify-between">
              <span>Net Amount</span>
              <span>₹{fmt(data.netAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Round Off</span>
              <span>₹{fmt(data.roundOff)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
              <span>Total Payable</span>
              <span>₹{fmt(data.totalAmount)}</span>
            </div>
            <div className="flex justify-between ">
              <span>Payment Mode</span>
              <span>{data.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewModal;
