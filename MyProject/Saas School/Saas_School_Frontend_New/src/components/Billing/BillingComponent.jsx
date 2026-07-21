import React, { useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import Select from "react-select";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
// For API endpoint (same as MarkAttendancePage)
import mainUrlApi from "@/common/main";
import { Plus, Minus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const paymentModes = ["Cash", "Card", "Online", "Cheque"];

const BillingComponent = () => {
  const { theme } = useTheme();

  const isDark = theme === "light";
  const schooldetails = useSelector((state) => state.institute.institute);
  // ====== SEARCH SECTION STATE ======
  const allClass = useSelector((state) => state.class.classNames) || [];
  const allSection = useSelector((state) => state.section.sectionNames) || [];
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [searchData, setSearchData] = useState({ className: "", section: "" });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const BASE_URL = import.meta.env.VITE_REACT_BASE_URL_LOCAL;
  const createdByName = useSelector(
    (state) => state?.auth?.userDetails?.userName
  );
  const createdByRole = useSelector((state) => state?.auth?.user);
  const createdByEmail = useSelector(
    (state) => state?.auth?.userDetails?.email
  );

  // react-select options
  const classOptions = allClass.map((c) => ({
    value: c,
    label: c.charAt(0).toUpperCase() + c.slice(1),
  }));
  const sectionOptions = allSection.map((s) => ({
    value: s,
    label: s.charAt(0).toUpperCase() + s.slice(1),
  }));
  // Search handler (same API as MarkAttendancePage)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchData.className || !searchData.section) {
      toast.error("Please select class and section");
      return;
    }
    try {
      setSearchLoading(true);
      const response = await axios.get(
        `${mainUrlApi.attendance.url}/${schoolId}/attendance/students?className=${searchData.className}&section=${searchData.section}`
      );
      if (response) {
        toast.success("Data fetched successfully");
        setSearchResult(response.data);
        // console.log("Search Result:", response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching data");
    } finally {
      setSearchLoading(false);
    }
  };

  const searchedOptions = searchResult.map((s) => ({
    value: s.id,
    label: `${s.rollNo} - ${s.studentName}`,
  }));

  const inventoryOptions = inventoryData.map((item) => ({
    value: item._id,
    label: item.name,

  }));
  const inventoryOptions1 = inventoryData.map((item) => ({
    value: item._id,
    label: `${item.name} - qty: ${item.stock} - ${item.code}`,  

  }));

  /* ================= DROPDOWNS ================= */


  /* ================= STATE ================= */
  const [items, setItems] = useState([
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

  const [summary, setSummary] = useState({
    discount: 0,
  });
  // Payment mode state
  const [paymentMode, setPaymentMode] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [savedInvoice, setSavedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNo: "",
    cardHolderName: "",
    authCode: "",
  });
  const [chequeDetails, setChequeDetails] = useState({
    chequeNo: "",
    bankName: "",
    branchName: "",
    accountHolderName: "",
  });
  const [onlineDetails, setOnlineDetails] = useState({
    transactionId: "",
    transactionDate: "",
  });

  /* ================= ROUND OFF LOGIC ================= */
  const calculateRoundOff = (amount) => {
    const decimal = amount - Math.floor(amount);

    if (decimal >= 0.5) {
      return +(1 - decimal).toFixed(2); // + value
    } else {
      return -decimal.toFixed(2); // - value
    }
  };

  /* ================= ITEM LOGIC ================= */
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    updated[index].amount =
      Number(updated[index].qty) * Number(updated[index].sellingPrice);

    setItems(updated);
  };

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
    setSaveLoading(true);
    try {
      const payload = {
        schoolId,
        invoiceNumber: invoiceNumber,
        date: invoiceDate,
        studentName: selectedStudent.studentName,
        admissionNumber: selectedStudent.admissionNumber || "",
        studentPhone: selectedStudent.phone || "",
        studentAddress: selectedStudent
          ? `${selectedStudent.villagePost}, ${selectedStudent.city}, ${selectedStudent.state}`
          : "",
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
        grossAmount: grossAmount,
        discount: Number(summary.discount || 0),
        netAmount: afterDiscount,
        roundOff: roundOffValue,
        totalAmount: totalPayable,
        paymentMethod: paymentMode,
        cardDetails:
          paymentMode === "Card"
            ? {
                cardNo: cardDetails.cardNo,
                cardHolderName: cardDetails.cardHolderName,
                authCode: cardDetails.authCode,
              }
            : undefined,
        chequeDetails:
          paymentMode === "Cheque"
            ? {
                chequeNo: chequeDetails.chequeNo,
                bankName: chequeDetails.bankName,
                branchName: chequeDetails.branchName,
                accountHolderName: chequeDetails.accountHolderName,
              }
            : undefined,
        onlineDetails:
          paymentMode === "Online"
            ? {
                transactionId: onlineDetails.transactionId,
                transactionDate: onlineDetails.transactionDate,
              }
            : undefined,
        createdBy: {
          name: createdByName || "",
          role: createdByRole || "",
          email: createdByEmail || "",
        },
      };
      const res = await axios.post(
        `${BASE_URL}/api/sales/create-invoice/${schoolId}`,
        payload
      );
      if (res.data && res.data.data) {
        setSavedInvoice(res.data.data);
        setShowPDF(true);
      }
      toast.success("Invoice created successfully");
      // OPTIONAL: reset form
      setInvoiceNumber("");
      setInvoiceDate("");
      setItems([
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
      setSelectedStudent(null);
      setSummary({ discount: 0 });
      setPaymentMode("");
      setCardDetails({ cardNo: "", cardHolderName: "", authCode: "" });
      setChequeDetails({
        chequeNo: "",
        bankName: "",
        branchName: "",
        accountHolderName: "",
      });
      setOnlineDetails({ transactionId: "", transactionDate: "" });
      setShowPaymentModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create invoice");
    }
    setSaveLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);
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

  /* ================= TOTALS ================= */
  const grossAmount = items.reduce((sum, i) => sum + i.amount, 0);
  const afterDiscount = grossAmount - Number(summary.discount || 0);
  const roundOffValue = calculateRoundOff(afterDiscount);
  const totalPayable = afterDiscount + roundOffValue;

  /* ================= INPUT STYLE ================= */
  const inputClass = `w-full px-2 py-1 rounded border text-sm ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-gray-800"
  }`;

  return (
    <div
      className={`rounded-xl p-6 shadow-md ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Student Sales Invoice</h2>

      <div
        className={`mb-6 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <div
          className={`p-4 sm:p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Search Students
          </h2>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-end gap-4"
          >
            <div className="w-full sm:w-auto min-w-[180px]">
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Class
              </label>
              <Select
                options={classOptions}
                value={
                  classOptions.find((o) => o.value === searchData.className) ||
                  null
                }
                onChange={(option) =>
                  setSearchData((prev) => ({
                    ...prev,
                    className: option ? option.value : "",
                  }))
                }
                placeholder="Select a class"
                isClearable
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                className="react-select-container"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: isDark ? "#374151" : "#fff",
                    color: isDark ? "#fff" : "#111",
                    borderColor: isDark ? "#4b5563" : "#d1d5db",
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
                    color: state.isSelected ? "#fff" : isDark ? "#fff" : "#111",
                    cursor: "pointer",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: isDark ? "#fff" : "#111",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: isDark ? "#374151" : "#fff",
                    color: isDark ? "#fff" : "#111",
                  }),
                }}
              />
            </div>
            <div className="w-full sm:w-auto min-w-[180px]">
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Section
              </label>
              <Select
                options={sectionOptions}
                value={
                  sectionOptions.find((o) => o.value === searchData.section) ||
                  null
                }
                onChange={(option) =>
                  setSearchData((prev) => ({
                    ...prev,
                    section: option ? option.value : "",
                  }))
                }
                placeholder="Select a section"
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
                    color: state.isSelected ? "#fff" : isDark ? "#fff" : "#111",
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
            </div>
            <div className="w-full sm:w-auto">
              <button
                type="submit"
                disabled={searchLoading}
                className="w-full px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* for select student name */}
            <Select
              options={searchedOptions}
              value={
                searchedOptions.find((o) => o.value === selectedStudent?.id) ||
                null
              }
              onChange={(option) => {
                if (!option) {
                  setSelectedStudent(null);
                  return;
                }

                const student = searchResult.find((s) => s.id === option.value);

                setSelectedStudent(student);
              }}
              placeholder="Search student"
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
                  color: state.isSelected ? "#fff" : isDark ? "#fff" : "#111",
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
          </form>
        </div>
      </div>

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
          placeholder="Invoice Date"
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
          placeholder="Student Address "
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

      <div
        className={`overflow-x-auto rounded-lg border ${
          isDark ? "border-gray-700 bg-[#1e293b]" : "border-gray-200 bg-white"
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
                className={`border-t ${
                  isDark
                    ? "border-gray-700 hover:bg-[#23304d]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <td className="px-3 py-2">{index + 1}</td>

                <td className="px-3 py-2">
                  <Select
                    options={inventoryOptions1}
                    value={
                      inventoryOptions.find((o) => o.label === row.name) || null
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
                    onChange={(e) =>
                      handleItemChange(index, "category", e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    disabled
                    className={`${inputClass} text-right`}
                    value={row.subCategory}
                    onChange={(e) =>
                      handleItemChange(index, "subCategory", e.target.value)
                    }
                  />
                </td>

                <td className="px-3 py-2">
                  {/* <select
                    className={inputClass}
                    value={row.unit}
                         
                    onChange={(e) =>
                      handleItemChange(index, "unit", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {unitList.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select> */}
                  <input
                    disabled
                    className={`${inputClass} text-right`}
                    value={row.unit}
                    onChange={(e) =>
                      handleItemChange(index, "unit", e.target.value)
                    }
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
                    type="number"
                    disabled
                    className={`${inputClass} text-right`}
                    value={row.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                  />
                </td>

                <td className="px-3 py-2">
                  <input
                    type="number"
                    className={`${inputClass} text-right`}
                    value={row.sellingPrice}
                    onChange={(e) =>
                      handleItemChange(index, "sellingPrice", e.target.value)
                    }
                  />
                </td>

                <td className="px-3 py-2 text-right font-medium">
                  {row.amount.toFixed(2)}
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

      {/* ================= TOTAL SECTION ================= */}
      <div className="flex justify-end mt-6">
        <div className="w-full md:w-1/3 space-y-2">
          <div className="flex justify-between">
            <span>Gross Amount</span>
            <span>{grossAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-end gap-32">
            <span className="text-md font-medium">Discount</span>

            <input
              type="number"
              className={`${inputClass} w-5  text-right`}
              value={summary.discount}
              onChange={(e) =>
                setSummary({ ...summary, discount: e.target.value })
              }
            />
          </div>

          <div className="flex justify-between">
            <span>Round Off</span>
            <span>{roundOffValue.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total Payable</span>
            <span>{totalPayable.toFixed(2)}</span>
          </div>

          <button
            onClick={handleSaveInvoiceClick}
            className="w-full mt-3 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
            disabled={saveLoading}
          >
            {saveLoading ? "Saving..." : "Save Invoice"}
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
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold mb-4">Select Payment Mode</h3>
                <div className="flex flex-row gap-2 mb-4">
                  {paymentModes.map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-2 cursor-pointer"
                    >
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
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          cardNo: e.target.value.replace(/[^0-9]/g, ""),
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Card Holder Name"
                      value={cardDetails.cardHolderName}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          cardHolderName: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Auth Code"
                      value={cardDetails.authCode}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          authCode: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setChequeDetails({
                          ...chequeDetails,
                          chequeNo: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Account Holder Name"
                      value={chequeDetails.accountHolderName}
                      onChange={(e) =>
                        setChequeDetails({
                          ...chequeDetails,
                          accountHolderName: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Bank Name"
                      value={chequeDetails.bankName}
                      onChange={(e) =>
                        setChequeDetails({
                          ...chequeDetails,
                          bankName: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      placeholder="Branch Name"
                      value={chequeDetails.branchName}
                      onChange={(e) =>
                        setChequeDetails({
                          ...chequeDetails,
                          branchName: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setOnlineDetails({
                          ...onlineDetails,
                          transactionId: e.target.value,
                        })
                      }
                    />
                    <input
                      className={inputClass}
                      type="date"
                      placeholder="Date of Transaction"
                      value={onlineDetails.transactionDate}
                      onChange={(e) =>
                        setOnlineDetails({
                          ...onlineDetails,
                          transactionDate: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                <button
                  className="w-full mt-3 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
                  disabled={saveLoading || !paymentMode}
                  onClick={handleSubmit}
                >
                  {saveLoading ? "Saving..." : "Submit"}
                </button>
              </div>
            </div>
          )}
          {/* PDF Modal */}
          {showPDF && savedInvoice && (
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
                    data={savedInvoice}
                    schoolDetails={schooldetails}
                  />
                </PDFViewer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingComponent;
