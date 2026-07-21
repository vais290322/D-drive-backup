import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import mainUrlApi from "@/common/main";
import { Plus, Minus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const InvoiceEditModal = ({ open, onClose, data, theme, onSuccess }) => {
  const isDark = theme === "light";
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [searchResult, setSearchResult] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ discount: 0 });
  const [searchData, setSearchData] = useState({ className: "", section: "" });
  const [searchLoading, setSearchLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_REACT_BASE_URL_LOCAL;
  const fmt = (num) =>
    num !== undefined && num !== null ? Number(num).toFixed(2) : "0.00";
  // Dropdowns
  const categoryList = ["Books", "Uniform", "Stationary", "Exam Fee", "Other"];
  const unitList = ["PCS", "KG", "LTR", "SET"];


  const paymentModes = [
  "Cash",
  "Card",
  "Online",
 
  "Cheque",
 
];

  const [paymentMode, setPaymentMode] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({ cardNo: "", cardHolderName: "", authCode: "" });
  const [chequeDetails, setChequeDetails] = useState({ chequeNo: "", bankName: "", branchName: "", accountHolderName: "" });
  const [onlineDetails, setOnlineDetails] = useState({ transactionId: "", transactionDate: "" });
  // Populate fields from data
  useEffect(() => {
    if (data) {
      setInvoiceNumber(data.invoiceNumber || "");
      setInvoiceDate(data.date ? data.date.slice(0, 10) : "");
      setPaymentMode(data.paymentMethod || "");
      setCardDetails(data.cardDetails || { cardNo: "", cardHolderName: "", authCode: "" });
      setChequeDetails(data.chequeDetails || { chequeNo: "", bankName: "", branchName: "", accountHolderName: "" });
      setOnlineDetails(data.onlineDetails || { transactionId: "", transactionDate: "" });
      setSelectedStudent({
        studentName: data.studentName,
        admissionNumber: data.admissionNumber,
        phone: data.studentPhone,
        villagePost: data.studentAddress,
        className: data.className,
        section: data.section,
        rollNo: data.rollNumber,
        city: "",
        state: "",
      });
      setItems(
        Array.isArray(data.items)
          ? data.items.map((item) => ({
              name: item.name,
              description: item.description || "",
              category: item.category || "",
              subCategory: item.subCategory || "",
              unit: item.unit || "",
              qty: item.quantity || 1,
              unitPrice: item.price || 0,
              sellingPrice: item.sellPrice || 0,
              amount: item.totalPrice || 0,
            }))
          : []
      );
      setSummary({ discount: data.discount || 0 });
    }
  }, [data]);

  // Totals
  const grossAmount = items.reduce((sum, i) => sum + Number(i.amount), 0);
  const afterDiscount = grossAmount - Number(summary.discount || 0);
  const roundOffValue = (() => {
    const decimal = afterDiscount - Math.floor(afterDiscount);
    if (decimal >= 0.5) return +(1 - decimal).toFixed(2);
    else return -decimal.toFixed(2);
  })();
  const totalPayable = afterDiscount + Number(roundOffValue);

  // Handlers
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    updated[index].amount =
      Number(updated[index].qty) * Number(updated[index].sellingPrice);
    setItems(updated);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        name: "",
        description: "",
        category: "",
        subCategory: "",
        unit: "",
        qty: 1,
        unitPrice: 0,
        sellingPrice: 0,
        amount: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Open payment modal instead of submitting directly
  const handleSaveInvoiceClick = () => {
    if (!selectedStudent) {
      toast.error("Please select a student");
      return;
    }
    if (!items.length || items.some((i) => !i.name)) {
      toast.error("Please add at least one item");
      return;
    }
    setShowPaymentModal(true);
  };

  // Actual submit after payment details
  const handleSubmit = async () => {
    try {
      const payload = {
        schoolId,
        invoiceNumber,
        date: invoiceDate,
        studentName: selectedStudent.studentName,
        admissionNumber: selectedStudent.admissionNumber || "",
        studentPhone: selectedStudent.phone || "",
        studentAddress: selectedStudent.villagePost || "",
        className: selectedStudent.className || "",
        section: selectedStudent.section || "",
        rollNumber: selectedStudent.rollNo || "",
        items: items.map((item) => {
          const inventoryItem = inventoryData.find(
            (inv) => inv.name === item.name
          );
          return {
            name: item.name,
            description: item.description || "",
            code: inventoryItem?.code || "NA",
            categoryId: inventoryItem?.categoryId,
            subCategoryId: inventoryItem?.subCategoryId,
            category: item.category,
            subCategory: item.subCategory || "",
            unit: item.unit,
            quantity: Number(item.qty),
            price: Number(item.unitPrice),
            sellPrice: Number(item.sellingPrice),
            totalPrice: Number(item.amount),
          };
        }),
        grossAmount,
        discount: Number(summary.discount || 0),
        netAmount: afterDiscount,
        roundOff: roundOffValue,
        totalAmount: totalPayable,
        paymentMethod: paymentMode,
        cardDetails: paymentMode === "Card" ? cardDetails : undefined,
        chequeDetails: paymentMode === "Cheque" ? chequeDetails : undefined,
        onlineDetails: paymentMode === "Online" ? onlineDetails : undefined,
      };
      await axios.put(
        `${BASE_URL}/api/sales/update-invoice/${schoolId}/${data._id}`,
        payload
      );
      toast.success("Invoice updated successfully");
      if (onSuccess) onSuccess();
      setShowPaymentModal(false);
      setPaymentMode("");
      setCardDetails({ cardNo: "", cardHolderName: "", authCode: "" });
      setChequeDetails({ chequeNo: "", bankName: "", branchName: "", accountHolderName: "" });
      setOnlineDetails({ transactionId: "", transactionDate: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update invoice");
    }
  };

  if (!open) return null;
  const inputClass = `w-full px-2 py-1 rounded border text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-gray-800"
  }`;
  const inventoryOptions = inventoryData.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const fetchInventory = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/inventory/school/${schoolId}`
      );
      // console.log(res.data.data);
      if (res.data.status === true) {
        setInventoryData(res.data.data);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch inventory"
      );
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [BASE_URL, schoolId]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className={`relative w-[90vw] max-w-[1100px] max-h-[95vh] overflow-y-auto
      rounded-lg p-6
      ${isDark ? "bg-[#112038] text-white" : "bg-white text-gray-900"}
    `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className={`absolute top-3 right-3 text-xl font-bold cursor-pointer
        ${isDark ? "text-white" : "text-gray-900"}
      `}
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Invoice</h2>


        {/* Invoice & Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            className={inputClass}
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          <input
            type="date"
            className={inputClass}
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Student Name"
            value={selectedStudent?.studentName || ""}
            onChange={(e) =>
              setSelectedStudent((prev) => ({ ...prev, studentName: e.target.value }))
            }
          />
          <input
            className={inputClass}
            placeholder="Admission No"
            value={selectedStudent?.admissionNumber || ""}
            onChange={(e) =>
              setSelectedStudent((prev) => ({ ...prev, admissionNumber: e.target.value }))
            }
          />
          <input
            className={inputClass}
            placeholder="Roll No"
            value={selectedStudent?.rollNo || ""}
            onChange={(e) =>
              setSelectedStudent((prev) => ({ ...prev, rollNo: e.target.value }))
            }
          />
          <input
            className={inputClass}
            placeholder="Student Phone"
            value={selectedStudent?.phone || ""}
            onChange={(e) =>
              setSelectedStudent((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <input
            className={inputClass}
            placeholder="Student Address"
            value={selectedStudent?.villagePost || ""}
            onChange={(e) =>
              setSelectedStudent((prev) => ({ ...prev, villagePost: e.target.value }))
            }
          />
          <input
            className={inputClass}
            placeholder="Class"
            value={selectedStudent?.className || ""}
            onChange={(e) =>
              setSelectedStudent((prev) => ({ ...prev, className: e.target.value }))
            }
          />
          <input
            className={inputClass}
            placeholder="Section"
            value={selectedStudent?.section || ""}
            onChange={(e) =>
              setSelectedStudent((prev) => ({ ...prev, section: e.target.value }))
            }
          />
        </div>

        {/* Items Table */}
        <div
          className={`overflow-x-auto rounded-lg border
        ${isDark ? "border-gray-700 bg-[#1e293b]" : "border-gray-200 bg-white"}
      `}
        >
          <table className=" w-full text-sm border-collapse">
            <thead
              className={`sticky top-0
            ${
              isDark
                ? "bg-[#112038] text-gray-200"
                : "bg-gray-100 text-gray-700"
            }
          `}
            >
              <tr>
                <th className="px-3 py-2">SL</th>
                <th className="px-3 py-2">Item Name</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Cat</th>
                <th className="px-3 py-2">Sub-Cat</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2 text-right">Qty</th>
                <th className="px-3 py-2 text-right">Unit Price</th>
                <th className="px-3 py-2 text-right">Selling Price</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((row, index) => (
                <tr
                  key={index}
                  className={`border-t
                ${
                  isDark
                    ? "border-gray-700 hover:bg-[#23304d]"
                    : "border-gray-200 hover:bg-gray-50"
                }
              `}
                >
                  <td className="px-3 py-2">{index + 1}</td>

                  <td className="px-3 py-2 ">
                    <Select
                      options={inventoryOptions}
                      value={
                        inventoryOptions.find((o) => o.label === row.name) ||
                        null
                      }
                      onChange={(option) => {
                        if (!option) return;

                        const selectedItem = inventoryData.find(
                          (inv) => inv._id === option.value
                        );

                        const updated = [...items];

                        updated[index] = {
                          ...updated[index],
                          name: selectedItem.name,
                          category: selectedItem.category || "",
                          subCategory: selectedItem.subCategory || "",
                          unit: selectedItem.unit || "",
                          unitPrice: selectedItem.price || 0,
                          sellingPrice: selectedItem.sellPrice || 0,
                          amount:
                            Number(updated[index].qty) *
                            Number(selectedItem.sellPrice || 0),
                        };

                        setItems(updated);
                      }}
                      placeholder="Select item"
                      isClearable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      classNamePrefix="react-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: isDark ? "#374151" : "#fff",
                          color: isDark ? "#fff" : "#111",
                          borderColor: isDark ? "#4b5563" : "#d1d5db",
                          minWidth: "120px",
                          width: "150px",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: isDark ? "#fff" : "#111",
                        }),
                        input: (base) => ({
                          ...base,
                          color: isDark ? "#fff" : "#111",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected
                            ? "#7c3aed" // selected
                            : state.isFocused
                            ? isDark
                              ? "#4c1d95"
                              : "#ede9fe"
                            : "transparent",
                          color: state.isSelected
                            ? "#fff"
                            : isDark
                            ? "#fff"
                            : "#111",
                          cursor: "pointer",
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: isDark ? "#374151" : "#fff",
                          color: isDark ? "#fff" : "#111",
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                    />
                    {/* Select remains unchanged */}
                    {/* react-select code stays as-is */}
                  </td>

                  <td className="px-3 py-2">
                    <input
                      className={inputClass}
                      value={row.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      disabled
                      className={`${inputClass} text-right`}
                      value={row.category}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      disabled
                      className={`${inputClass} text-right`}
                      value={row.subCategory}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      disabled
                      className={`${inputClass} text-right`}
                      value={row.unit}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className={`${inputClass} text-right`}
                      value={row.qty}
                      onChange={(e) =>
                        handleItemChange(index, "qty", e.target.value)
                      }
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      disabled
                      type="number"
                      className={`${inputClass} text-right`}
                      value={fmt(row.unitPrice)}
                    />
                  </td>

                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className={`${inputClass} text-right`}
                      value={fmt(row.sellingPrice)}
                      onChange={(e) =>
                        handleItemChange(index, "sellingPrice", e.target.value)
                      }
                    />
                  </td>

                  <td className="px-3 py-2 text-right font-medium">
                    {fmt(row.amount)}
                  </td>

                  <td className="px-3 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={addRow}>
                        <Plus size={16} />
                      </button>
                      <button onClick={() => removeRow(index)}>
                        <Minus size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-6">
          <div className="w-full md:w-1/3 space-y-2">
            <div className="flex justify-between">
              <span>Gross Amount</span>
              <span>{grossAmount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between gap-6">
              <span className="font-medium">Discount</span>
              <input
                type="number"
                className={`${inputClass} w-20 text-right`}
                value={summary.discount}
                onChange={(e) =>
                  setSummary({ ...summary, discount: e.target.value })
                }
              />
            </div>

            <div className="flex justify-between">
              <span>Round Off</span>
              <span>{Number(roundOffValue).toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total Payable</span>
              <span>{totalPayable.toFixed(2)}</span>
            </div>

            <button
              onClick={handleSaveInvoiceClick}
              className="w-full mt-3 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Save Invoice
            </button>
                {/* Payment Modal */}
                {showPaymentModal && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "rgba(0,0,0,0.7)",
                      zIndex: 2000,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => setShowPaymentModal(false)}
                  >
                    <div
                      style={{
                        width: "90vw",
                        maxWidth: 800,
                        background: isDark ? "#1e293b" : "#fff",
                        borderRadius: 8,
                        padding: 24,
                        boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                        color: isDark ? "#fff" : "#111",
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <h3 className="text-lg font-bold mb-4">Select Payment Mode</h3>
                      <div className="flex flex-row gap-2 mb-4">
                        {paymentModes.map((mode) => (
                          <label key={mode} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="modalPaymentMode"
                              value={mode}
                              checked={paymentMode === mode}
                              onChange={() => setPaymentMode(mode)}
                              className="accent-purple-600"
                            />
                            <span>{mode}</span>
                          </label>
                        ))}
                      </div>
                      {/* Card fields */}
                      {paymentMode === "Card" && (
                        <div className="flex flex-col gap-2 mb-2">
                          <input
                            className={inputClass}
                            placeholder="Last 4 digit card number"
                            maxLength={4}
                            value={cardDetails.cardNo}
                            onChange={e => setCardDetails({ ...cardDetails, cardNo: e.target.value.replace(/[^0-9]/g, "") })}
                          />
                          <input
                            className={inputClass}
                            placeholder="Card Holder Name"
                            value={cardDetails.cardHolderName}
                            onChange={e => setCardDetails({ ...cardDetails, cardHolderName: e.target.value })}
                          />
                          <input
                            className={inputClass}
                            placeholder="Auth Code"
                            value={cardDetails.authCode}
                            onChange={e => setCardDetails({ ...cardDetails, authCode: e.target.value })}
                          />
                        </div>
                      )}
                      {/* Cheque fields */}
                      {paymentMode === "Cheque" && (
                        <div className="flex flex-col gap-2 mb-2">
                          <input
                            className={inputClass}
                            placeholder="Cheque No"
                            value={chequeDetails.chequeNo}
                            onChange={e => setChequeDetails({ ...chequeDetails, chequeNo: e.target.value })}
                          />
                          <input
                            className={inputClass}
                            placeholder="Account Holder Name"
                            value={chequeDetails.accountHolderName}
                            onChange={e => setChequeDetails({ ...chequeDetails, accountHolderName: e.target.value })}
                          />
                          <input
                            className={inputClass}
                            placeholder="Bank Name"
                            value={chequeDetails.bankName}
                            onChange={e => setChequeDetails({ ...chequeDetails, bankName: e.target.value })}
                          />
                          <input
                            className={inputClass}
                            placeholder="Branch Name"
                            value={chequeDetails.branchName}
                            onChange={e => setChequeDetails({ ...chequeDetails, branchName: e.target.value })}
                          />
                        </div>
                      )}
                      {/* Online fields */}
                      {paymentMode === "Online" && (
                        <div className="flex flex-col gap-2 mb-2">
                          <input
                            className={inputClass}
                            placeholder="Transaction ID"
                            value={onlineDetails.transactionId}
                            onChange={e => setOnlineDetails({ ...onlineDetails, transactionId: e.target.value })}
                          />
                          <input
                            className={inputClass}
                            type="date"
                            placeholder="Date of Transaction"
                            value={onlineDetails.transactionDate}
                            onChange={e => setOnlineDetails({ ...onlineDetails, transactionDate: e.target.value })}
                          />
                        </div>
                      )}
                      <button
                        className="w-full mt-3 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
                        disabled={!paymentMode}
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditModal;
