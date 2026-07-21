import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaImage, FaChevronDown } from "react-icons/fa";
import debounce from "lodash.debounce";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PaymentUrl, StudentUrl, getAuthHeaders } from "../config/config";
import { Loader2 } from "lucide-react";

// const StudentSearchUrl = "http://192.168.0.156:8080/api/v1/students";
// const StudentDetailUrl = (id) => `http://192.168.0.156:8080/api/v1/students/${id}`;

function AddReceipt() {
  // const PaymentUrl = `${PaymentUrl.postPayment}`;
  const StudentSearchUrl = `${StudentUrl.getStudents}`;
  const StudentDetailUrl = (id) => `${StudentUrl.getStudents}/${id}`;

  const [formData, setFormData] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiRawData, setApiRawData] = useState([]); // Added state for raw API data
  const [supportingDocument, setSupportingDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [errors, setErrors] = useState({}); // Added state for form errors

  const searchRef = useRef(null);
  // Automatically hide suggestions after 5 seconds
  // useEffect(() => {
  //   if (showSuggestions) {
  //     const timer = setTimeout(() => {
  //       setShowSuggestions(false);
  //     }, 5000); // hide after 5 seconds

  //     return () => clearTimeout(timer); // cleanup on re-render/unmount
  //   }
  // }, [showSuggestions]);

  // Memoize the debounced function
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query) return setSuggestions([]);
      try {
        const res = await axios.get(StudentSearchUrl, { headers: getAuthHeaders() });
        // Show raw API data for debugging
        setApiRawData(res.data.data);
        const filtered = res.data.data.filter(
          (s) =>
            typeof s.fullName === "string" &&
            s.fullName.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching suggestions", err);
        toast.error("Failed to fetch suggestions");
        setSuggestions([]);
      }
    }, 300),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (name === "payingAmount" && errors.payingAmount) {
      setErrors(prev => ({ ...prev, payingAmount: "" }));
    }

    if (name === "fullName") fetchSuggestions(value);
  };

  useEffect(() => {
    if (selectedStudentData) {
      if (formData.purposeOfPayment === "Admission Fee") {
        setFormData((prev) => ({
          ...prev,
          dueFees: selectedStudentData.dueAdmissionFee,
          payingAmount: selectedStudentData.dueAdmissionFee,
          NumberOfInstallments: 0
        }));
      } else if (formData.purposeOfPayment === "Installment" || formData.purposeOfPayment === "Semester") {
        setFormData((prev) => ({
          ...prev,
          dueFees: selectedStudentData.dueFees,
          payingAmount: selectedStudentData.feesPerInstallment,
          NumberOfInstallments: 1
        }));
      } else if (formData.purposeOfPayment === "University Enrollment") {
        setFormData((prev) => ({
          ...prev,
          dueFees: 0,
          payingAmount: 0,
          NumberOfInstallments: 0
        }));
      }
    }
  }, [formData.purposeOfPayment, selectedStudentData]);

  // Validation function for paying amount
  const validatePayingAmount = (amount, purpose) => {
    if (!selectedStudentData) return true;

    const amountValue = parseFloat(amount);

    if (purpose === "Admission Fee") {
      const maxAmount = parseFloat(selectedStudentData.dueAdmissionFee);
      if (amountValue > maxAmount) {
        return false;
      }
    } else if (purpose === "Installment" || purpose === "Semester") {
      const maxAmount = parseFloat(selectedStudentData.feesPerInstallment);
      if (amountValue > maxAmount) {
        return false;
      }
    }
    return true;
  };

  // Update handleSelectStudent function to include dueFees
  const handleSelectStudent = async (student) => {
    setShowSuggestions(false);
    try {
      const res = await axios.get(StudentDetailUrl(student.id), { headers: getAuthHeaders() });
      const data = res.data.data;
      setSelectedStudentData(data);
      setFormData({
        fullName: data.fullName,
        studentId: data.studentId,
        session: data.session,
        guardianName: data.guardianName,
        planName: data.planName,
        courseName: data.courseName,
        mobile: data.mobile,
        email: data.email,
        totalFees: data.totalFees,
        dueFees: data.dueFees,
        purposeOfPayment: 'Installment',
        totalFeePaid: data.totalFeesPaid,
        outStandingFees: data.dueFees,
        paymentMode: data.paymentMode,
        transactionId: data.transactionId,
        payingAmount: data.feesPerInstallment,
        remarks: data.remark,
        NumberOfInstallments: 1,
        paidDate: new Date().toISOString().split("T")[0],
        paymentMode: "UPI",
        // nameOfInstallments: data.NumberOfInstallments
      });
      // Clear any previous errors
      setErrors(prev => ({ ...prev, payingAmount: "" }));
    } catch (err) {
      console.error("Error fetching student details", err);
    }
  };

  const handleFileChange = (e) => {
    setSupportingDocument(e.target.files[0]);
  };
  // First, update the handleSubmit function to clear the form after successful submission
  const handleSubmit = async () => {
    // Validate paying amount before submitting
    if (formData.purposeOfPayment && formData.payingAmount) {
      const isValid = validatePayingAmount(formData.payingAmount, formData.purposeOfPayment);
      if (!isValid) {
        if (formData.purposeOfPayment === "Admission Fee") {
          setErrors(prev => ({
            ...prev,
            payingAmount: `Amount cannot exceed ${selectedStudentData.dueAdmissionFee} for Admission Fee`
          }));
        } else if (formData.purposeOfPayment === "Installment" || formData.purposeOfPayment === "Semester") {
          setErrors(prev => ({
            ...prev,
            payingAmount: `Amount cannot exceed ${selectedStudentData.feesPerInstallment} for ${formData.purposeOfPayment}`
          }));
        }
        return; // Prevent submission if validation fails
      }
    }

    try {
      setLoading(true);
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "chequeDate" && value) {
            const date = new Date(value);
            const formattedDate = date.toISOString().split("T")[0];
            if (!isNaN(date)) {
              payload.append(key, formattedDate);
            }
          } else {
            payload.append(key, value);
          }
        }
      });

      // append nameOfInstallment with same value as NumberOfInstallments
      const numberOfInstallments =
        formData.NumberOfInstallments ?? formData.numberOfInstallments ?? "";
      if (numberOfInstallments !== "" && !formData.nameOfInstallment) {
        payload.append("nameOfInstallment", numberOfInstallments);
      }

      if (supportingDocument) {
        payload.append("supportingDocs", supportingDocument);
      }

      await axios.post(`${PaymentUrl.postPayment}`, payload, {
        headers: getAuthHeaders(),
      });

      // Clear form data and file
      setFormData({});
      setSupportingDocument(null);
      setErrors({}); // Clear errors on successful submission
      toast.success("Receipt Generated Successfully!");
    } catch (err) {
      console.error("Submit error", err);
      toast.error(err.response?.data?.message || "Failed to generate receipt!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow relative">
      <h2 className="text-lg font-semibold mb-4">Generate New Receipt</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        <div className="relative" ref={searchRef}>
          <Input
            name="fullName"
            label="Full Name"
            value={formData.fullName || ""}
            onChange={handleChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search by Student name..."
          />
          {showSuggestions && (
            <ul className="absolute z-10 bg-white border w-full rounded mt-1 shadow">
              {suggestions.length === 0 ? (
                <li className="px-3 py-2 text-gray-400">No matches found</li>
              ) : (
                suggestions.map((student) => (
                  <li
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {student.fullName}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <Input
          name="studentId"
          label="Student ID"
          value={formData.studentId || ""}
          onChange={handleChange}

        />
        <Input
          name="session"
          label="Session"
          value={formData.session || ""}
          onChange={handleChange}
        />
        <Input
          name="guardianName"
          label="Guardian Name"
          value={formData.guardianName || ""}
          onChange={handleChange}
        />
        <Input
          name="planName"
          label="Course Plan"
          value={formData.planName || ""}
          onChange={handleChange}
        />
        <Input
          name="courseName"
          label="Course Name"
          value={formData.courseName || ""}
          onChange={handleChange}
        />
        <Input
          name="mobile"
          label="Mobile(Optional)"
          value={formData.mobile || ""}
          onChange={handleChange}
        />
        <Input
          name="email"
          label="Email"
          value={formData.email || ""}
          onChange={handleChange}
        />
        <Input
          name="totalFees"
          label="Total Fees"
          value={formData.totalFees || ""}
          onChange={handleChange}
        />

        {/* Purpose of Payment Dropdown */}
        <Select
          name="purposeOfPayment"
          label="Purpose of Payment"
          value={formData.purposeOfPayment || ""}
          onChange={handleChange}
          options={[
            { value: "", label: "Select Purpose" },
            { value: "Installment", label: "Installment" },
            { value: "Semester", label: "Semester" },
            { value: "Admission Fee", label: "Admission Fee" },
            // { value: "Seat Booking", label: "Seat Booking" },
            { value: "University Enrollment", label: "University Enrollment" }
          ]}
        />

        {/* Add these two new fields */}
        <Input
          name="NumberOfInstallments"
          label="No of Installment(s)"
          value={formData.NumberOfInstallments || ""}
          onChange={handleChange}
          type="number"
        />

        <Input
          name="nameOfInstallment"
          label="Name of Installment"
          value={formData.nameOfInstallment || ""}
          onChange={handleChange}
          placeholder="e.g., 1st, 2nd"
        />

        <Input
          name="paidDate"
          label="Date of Installment(s)"
          value={formData.paidDate || ""}
          onChange={handleChange}
          type="date"
        />
        <Input
          name="dueFees"
          label="Due Fees"
          value={formData.dueFees || ""}
          onChange={handleChange}
          type="number"
          disabled={true} // Make it read-only since it's auto-fetched
        />

        {/* Payment Mode Dropdown */}
        <Select
          name="paymentMode"
          label="Payment Mode"
          value={formData.paymentMode || ""}
          onChange={handleChange}
          options={[
            { value: "", label: "Select Mode" },
            { value: "Cash", label: "Cash" },
            { value: "UPI", label: "UPI" },
            { value: "Online", label: "Online" },
            { value: "Cheque", label: "Cheque" },
            { value: "Demand Draft", label: "Demand Draft" },
            { value: "NEFT", label: "NEFT" }
          ]}
          required={true}
        />
        {formData.paymentMode === "Cheque" && (
          <>
            <Input
              name="bankName"
              label="Bank Name"
              value={formData.bankName || ""}
              onChange={handleChange}
            />
            <Input
              name="chequeNumber"
              label="Cheque Number"
              value={formData.chequeNumber || ""}
              onChange={handleChange}
            />
            <Input
              name="chequeDate"
              label="Cheque Date"
              value={formData.chequeDate || ""}
              onChange={handleChange}
              type="date"
            />
          </>
        )}
        {formData.paymentMode !== "Cash" &&
          formData.paymentMode !== "Cheque" && (
            <Input
              name="transactionId"
              label="Transaction ID / Cheque No"
              value={formData.transactionId || ""}
              onChange={handleChange}
            />
          )}
        <div >
          <Input
            name="payingAmount"
            label="Paying Amount"
            value={formData.payingAmount || ""}
            onChange={handleChange}

          />
          {errors.payingAmount && (
            <div className="text-red-500 col-span-3  text-sm whitespace-pre-wrap mt-2 mb-2">
              {errors.payingAmount}
            </div>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block font-medium mb-1">Remark (optional)</label>
          <textarea
            name="remarks"
            value={formData.remarks || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>

        <div className="relative">
          <label className="block font-medium mb-1">Supporting Document</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2 pr-10" // Add padding for icon
            style={{ cursor: "pointer" }}
          />
          <FaImage
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
          {supportingDocument && (
            <div className="mt-2 text-sm text-gray-500">
              {supportingDocument.name} (
              {(supportingDocument.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        {
          loading ? (
            <div className="text-red-600 font-semibold flex items-center justify-center gap-2"> <Loader2 className="w-4 h-4 animate-spin" /> Please Wait! Generating Receipt...</div>
          ) : (<button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-6 py-2 rounded font-semibold"
          >
            Generate
          </button>)
        }

      </div>
    </div>
  );
}

const Input = ({ name, label, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-normal mb-2">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border rounded-md px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 ${name === "payingAmount" ? "col-span-3" : ""
        }`}
      type={type}
    />
  </div>
);

const Select = ({ name, label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-normal mb-2">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 appearance-none bg-white pr-10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <FaChevronDown className="h-4 w-4 text-gray-500" />
      </div>
    </div>
  </div>
);

export default AddReceipt;
