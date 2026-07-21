import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ClipboardList } from "lucide-react";
import {
  IndianRupee,
  CreditCard,
  Banknote,
  Wallet,
  Building2,
  Smartphone,
  Landmark,
  BadgeIndianRupee,
  HelpCircle,
  ChevronDown,
  User,
  ListChecks,
  ShieldAlert,
} from "lucide-react";
import {
  ChequeUrl,
  PaymentUrl,
  StudentUrl,
  getAuthHeaders,
} from "../config/config";
import toast from "react-hot-toast";

// const [chequeDetails, setChequeDetails] = useState({
//   chequeNumber: "",
//   chequeDate: "",
//   bankName: "",
//   branchName: "",
//   accountHolder: "",
// });
const paymentModes = [
  { label: "Cash", icon: <IndianRupee size={16} /> },
  { label: "Cheque", icon: <Banknote size={16} /> },
  { label: "Credit Card", icon: <CreditCard size={16} /> },
  { label: "Debit Card", icon: <CreditCard size={16} /> },
  { label: "UPI", icon: <Wallet size={16} /> },
  { label: "Bank Transfer", icon: <Building2 size={16} /> },
  { label: "Net Banking", icon: <Landmark size={16} /> },
  { label: "Demand Draft", icon: <BadgeIndianRupee size={16} /> },
  { label: "Others", icon: <HelpCircle size={16} /> },
];

const categories = [
  "Tuition Fee",
  "Library Fee",
  "Hostel Fee",
  "Lab Fee",
  "Exam Fee",
  "Late Fee",
  "Penalty Fee",
  "Other",
];

const RecordPayment = () => {
  const navigate = useNavigate();
  // const { id: studentIdFromParams } = useParams();
  const debounceRef = useRef(null);
  const containerRef = useRef(null);
  const { id: studentId } = useParams();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    feePlanId: "",
    amount: "",
    paymentDate: "",
    mode: "",
    transactionId: "",
    chequeNumber: "",
    chequeDate: "",
    bankName: "",
    branchName: "",
    accountHolderName: "",
    remarks: "",
    category: "",
  });
  // const handleChequeChange = (e) => {
  //   const { name, value } = e.target;
  //   setChequeDetails((prev) => ({ ...prev, [name]: value }));
  // };
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  // ✅ Get studentId from URL

  const selectedIcon = paymentModes.find((pm) => pm.label === form.mode)?.icon;

  useEffect(() => {
    console.log("studentId", studentId);
    if (studentId) {
      axios
        .get(`${StudentUrl.getStudents}/${studentId}`, {
          headers: getAuthHeaders(),
        })
        .then((res) => {
          const student = res.data.data;
          console.log("Student", student);
          setSelectedStudent(student);

          setForm((prevForm) => ({
            ...prevForm,
            studentId: student.id || "",
            courseId: student.course?.id || "",
            feePlanId: student.course?.feePlan?.id || "",
          }));
        })
        .catch((err) => {
          console.error("Failed to fetch student by ID", err);
        });
    }
  }, [studentId]);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      setShowStudentDropdown(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      axios
        .get(`${PaymentUrl.studentSearch}?name=${searchQuery}`, {
          headers: getAuthHeaders(),
        })
        .then((res) => {
          setSuggestions(res.data.data || []);
          setShowStudentDropdown(true);
        })
        .catch((err) => {
          toast.error(err.response.data.message || "data fetch failed");
          console.error("Student search failed", err);
          setShowStudentDropdown(false);
        });
    }, 500);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowStudentDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectStudent = (student) => {
    setForm((prev) => ({
      ...prev,
      studentId: student.id,
      studentName: student.fullName,
    }));
    setSelectedStudent(student);
    setSuggestions([]);
    setShowStudentDropdown(false);
  };

  const handleModeSelect = (mode) => {
    setForm((prev) => ({ ...prev, mode }));
    setShowDropdown(false);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!form.studentId) {
  //     toast.error("Please select a valid student");
  //     return;
  //   }

  //   const payload = {
  //     studentId: form.studentId,
  //     amount: form.amount,
  //     category: form.category,
  //     paymentMethod: form.mode,
  //     lastPaymentDate: form.lastPaymentDate,
  //     // receiptNumber: form.receiptNumber,
  //     remarks: form.remarks,
  //     // Cheque details
  //     chequeNumber: form.chequeNumber,
  //     chequeDate: form.chequeDate,
  //     bankName: form.bankName,
  //     branchName: form.branchName,
  //     accountHolderName: form.accountHolderName,
  //     // UPI/Online reference
  //     transactionId: form.transactionId,
  //   };

  //   setLoading(true);
  //   try {
  //     await axios.post(
  //       // "http://192.168.0.156:8080/api/v1/payments",
  //       `${PaymentUrl.postPayment}`,
  //       payload
  //     );
  //     toast.success("Payment recorded successfully!");
  //     navigate("/payments"); // or wherever you want to redirect
  //   } catch (err) {
  //     console.error("Error recording payment:", err);
  //     toast.error(err.response?.data?.message || "Failed to record payment");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   const fetchStudentDetails = async () => {
  //     try {
  //       if (studentId) {
  //         const res = await axios.get(
  //           `http://192.168.0.156:8080/api/v1/students/${studentId}`
  //         );
  //         setSelectedStudent(res.data); // 👈 Set the student data
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch student:", error);
  //     }
  //   };

  //   fetchStudentDetails();
  // }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId) {
      toast.error("Please select a valid student");
      return;
    }

    const payload = {
      studentId: form.studentId,
      amount: form.amount,
      category: form.category,
      paymentMethod: form.mode,
      lastPaymentDate: form.lastPaymentDate,
      remarks: form.remarks,
      chequeNumber: form.chequeNumber,
      chequeDate: form.chequeDate,
      bankName: form.bankName,
      branchName: form.branchName,
      accountHolderName: form.accountHolderName,
      transactionId: form.transactionId,
    };

    setLoading(true);
    try {
      // Primary Payment POST request
      const res = await axios.post(`${PaymentUrl.postPayment}`, payload, {
        headers: getAuthHeaders(),
      });
      console.log(res?.data?.data?.id);
      const paymentId = res?.data?.data?.id;
      toast.success("Payment recorded successfully!");

      // ➕ If mode is "Cheque", send cheque details to the cheque endpoint
      if (form.mode === "Cheque" && paymentId) {
        const chequePayload = {
          paymentId,
          chequeNumber: form.chequeNumber,
          chequeDate: form.chequeDate,
          bankName: form.bankName,
          branchName: form.branchName,
          accountHolderName: form.accountHolderName,
        };
        console.log("not entering?");
        try {
          await axios.post(`${ChequeUrl.postCheque}`, chequePayload, {
            headers: getAuthHeaders(),
          });
          // navigate(`/payments`);
          toast.success("Cheque details submitted successfully!");
        } catch (chequeErr) {
          console.error("Cheque submission failed:", chequeErr);
          toast.error(
            "Payment recorded, but cheque details submission failed."
          );
        }
      }

      // navigate(`/payment-student/${form.studentId}`);
      navigate(`/payments`);
    } catch (err) {
      console.error("Error recording payment:", err);
      toast.error(err.response?.data?.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Record Payment</h1>
        <p className="text-gray-500 mt-2">
          Add a new fee payment for a student
        </p>
      </div>

      <button
        onClick={() => navigate("/students")}
        className="bg-gradient-to-r bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all mb-5"
      >
        Back to Students
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="col-span-2 bg-white shadow-lg rounded-2xl p-6 space-y-6"
        >
          {/* Student Search */}
          <div className="space-y-1 relative" ref={containerRef}>
            <label className="block text-md font-medium text-gray-800">
              Select Student <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="studentName"
              value={
                selectedStudent ? selectedStudent.fullName : form.studentName
              }
              onChange={(e) => {
                setForm((prev) => ({ ...prev, studentName: e.target.value }));
                setSearchQuery(e.target.value);
              }}
              className="w-full rounded-md border-gray-200 border px-2 py-2 shadow-sm"
              placeholder="Search by name"
              required
              autoComplete="off"
            />
            {showStudentDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectStudent(s)}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {s.fullName}{" "}
                    <span className="text-sm text-gray-500">({s.email})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <InputField
              label="Payment Date"
              name="lastPaymentDate"
              type="date"
              value={form.lastPaymentDate}
              onChange={handleChange}
            />
            <InputField
              label="Payment Amount"
              name="amount"
              type="number"
              placeholder="Amount in ₹"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          {/* <div className="flex flex-col md:flex-row gap-6"> */}
          <div className=" space-y-1">
            <label className="block text-md font-medium text-gray-800">
              Payment Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            >
              <option value="">Select a category</option>
              {categories.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full  space-y-1 relative">
            <label className="block text-md font-medium text-gray-800">
              Payment Mode <span className="text-red-500">*</span>
            </label>
            <div
              className="w-full border border-gray-200 rounded-md px-3 py-2 flex items-center justify-between shadow-sm cursor-pointer bg-white"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <div className="flex items-center gap-2 text-sm text-gray-700">
                {selectedIcon}
                {form.mode || "Select payment mode"}
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </div>

            {showDropdown && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                {paymentModes.map((pm) => (
                  <div
                    key={pm.label}
                    onClick={() => handleModeSelect(pm.label)}
                    className="px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                  >
                    {pm.icon}
                    {pm.label}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              {form.mode === "Cheque" && (
                <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <Banknote size={18} /> Cheque Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                      <InputField
                        label="Cheque Number"
                        name="chequeNumber"
                        value={form.chequeNumber || ""}
                        onChange={handleChange}
                        placeholder="Enter cheque number"
                      />
                    </div>

                    <div>
                      <InputField
                        label="Cheque Date"
                        name="chequeDate"
                        type="date"
                        value={form.chequeDate || ""}
                        onChange={handleChange}
                        placeholder="dd-mm-yyyy"
                      />
                    </div>

<div className="w-full space-y-1">
  <label className="block text-md font-medium text-gray-800">
    Bank Name <span className="text-red-500">*</span>
  </label>
  <select
    name="bankName"
    value={form.bankName || ""}
    onChange={handleChange}
    className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    required
  >
    <option value="">Select bank...</option>
    
    {/* Major Public Sector Banks */}
    <optgroup label="Public Sector Banks">
      <option value="SBI">State Bank of India (SBI)</option>
      <option value="BANK OF BARODA">Bank of Baroda</option>
      <option value="PNB">Punjab National Bank (PNB)</option>
      <option value="CANARA">Canara Bank</option>
      <option value="UNION BANK">Union Bank of India</option>
    </optgroup>

    {/* Major Private Banks */}
    <optgroup label="Private Banks">
      <option value="HDFC">HDFC Bank</option>
      <option value="ICICI">ICICI Bank</option>
      <option value="AXIS">Axis Bank</option>
      <option value="KOTAK">Kotak Mahindra Bank</option>
      <option value="INDUSIND">IndusInd Bank</option>
    </optgroup>

    {/* Other Notable Banks */}
    <optgroup label="Other Banks">
      <option value="BANDHAN">Bandhan Bank</option>
      <option value="IDFC">IDFC First Bank</option>
      <option value="YES BANK">Yes Bank</option>
      <option value="PAYTM PAYMENTS BANK">Paytm Payments Bank</option>
    </optgroup>

    <option value="Other">Other</option>
  </select>
</div>

                    <div>
                      <InputField
                        label="Branch Name"
                        name="branchName"
                        value={form.branchName || ""}
                        onChange={handleChange}
                        placeholder="Enter branch name"
                      />
                    </div>

                    <div>
                      <InputField
                        label="Account Holder Name"
                        name="accountHolderName"
                        value={form.accountHolderName || ""}
                        onChange={handleChange}
                        placeholder="Enter account holder name"
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-4 rounded-lg">
                    <strong>Important Notes:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>
                        Cheque will be deposited and may take 3–5 working days
                        to clear
                      </li>
                      <li>
                        Ensure sufficient funds are available in the account
                      </li>
                      <li>
                        Post-dated cheques will be deposited on the specified
                        date
                      </li>
                      <li>Additional charges may apply for cheque bounce</li>
                    </ul>
                  </div>
                </div>
              )}
              {form.mode !== "Cheque" && form.mode !== "Cash" && (
                <div className="mt-5">
                  <InputField
                    label="Transaction ID"
                    name="transactionId"
                    value={form.transactionId || ""}
                    onChange={handleChange}
                    placeholder="Enter transaction reference"
                  />
                </div>
              )}
            </div>
          </div>

          {/* </div> */}

          {/* <InputField
            label="Receipt Number"
            name="receiptNumber"
            value={form.receiptNumber}
            onChange={handleChange}
            placeholder="Enter receipt number"
          /> */}

          <div className="space-y-1">
            <label className="block text-md font-medium text-gray-800">
              Remarks
            </label>
            <textarea
              name="remarks"
              rows={3}
              value={form.remarks}
              onChange={handleChange}
              className="w-full rounded-md border-gray-200 border px-2 py-2 shadow-sm"
              placeholder="Optional comments..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-md font-semibold transition"
          >
            {loading
              ? "Submitting..."
              : `Record Payment ₹${form.amount || "0"}`}
          </button>
        </form>

        {/* Student Detail Summary Panel */}
        {selectedStudent && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <User size={18} /> Student Summary
              </h2>
              <p className="font-medium">{selectedStudent.fullName}</p>
              <p className="text-sm text-gray-500">{selectedStudent.email}</p>
              <p className="text-sm text-gray-500">
                Ad No.-{selectedStudent.admissionNumber}
              </p>
              <hr className="my-2" />
              <p>
                <strong>Course:</strong> {selectedStudent.course?.courseName}
              </p>
              <p>
                <strong>Plan:</strong> {selectedStudent.category || "N/A"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <ListChecks size={18} /> Payment Breakdown
              </h2>
              <p className="text-sm">
                <strong>Base Amount:</strong> ₹
                {selectedStudent.totalFee?.toLocaleString()}
              </p>
              <p className="text-sm">
                <strong>Total Paid:</strong> ₹
                {selectedStudent.paidAmount?.toLocaleString()}
              </p>
              <p className="text-sm text-red-600 font-semibold">
                Remaining Due: ₹{selectedStudent.dueAmount?.toLocaleString()}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                <p>Last Payment: {selectedStudent.lastPaymentDate}</p>
                <p>Status: {selectedStudent.paymentStatus}</p>
              </div>
            </div>
          </div>
        )}
        {!selectedStudent && (
          <div className="bg-white p-4 rounded-xl shadow-md h-28 flex justify-center items-center">
            <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-400">
              <ShieldAlert size={18} /> Please select a student
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) => (
  <div className="w-full space-y-1">
    <label className="block text-md font-medium text-gray-800">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border-gray-200 border px-2 py-2 shadow-sm"
      placeholder={placeholder}
      required
    />
  </div>
);

export default RecordPayment;
