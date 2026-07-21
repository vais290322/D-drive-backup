import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaImage, FaRupeeSign } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import AddReceipt from "../components/AddReceipt";
import DuePayment from "../components/DuePayment";
import { DashboardUrl,getAuthHeaders} from "../config/config";
// const DashboardUrl = "http://192.168.0.156:8080/api/v1/payments/dashboard";

// const PaymentUrl = "http://192.168.0.156:8080/api/v1/payments";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  // const [formData, setFormData] = useState({});

  useEffect(() => {
    axios
      .get(`${DashboardUrl.getDashboard}`, { headers: getAuthHeaders() })
      // .get(DashboardUrl)
      .then((res) => setDashboardData(res.data.data))
      .catch((err) => console.error("Dashboard fetch error", err));
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = () => {
  //   axios
  //     .post(PaymentUrl, formData)
  //     .then(() => alert("Receipt Generated Successfully!"))
  //     .catch((err) => console.error("Submit error", err));
  // };

  return (
    <div className="p-6 space-y-4">
      {/* Dashboard Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard label="Total Students" 
        value={formatCurrency(dashboardData?.totalStudents || 0)}
        />
        <DashboardCard
          label="30 Days Fees Collection"
          value={formatCurrency(dashboardData?.last30DaysFeeCollection || 0)}
        />
        <DashboardCard
          label="Today's Fees Collection"
          value={formatCurrency(dashboardData?.todayFeeCollection || 0)}
        />
        <DashboardCard
          label="Outstanding Fees"
          value={formatCurrency(dashboardData?.outstandingDues|| 0)}
        />
      </div>

      {/* Form Section */}
      {/* <div className="bg-white p-6 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-4">Generate New Receipt</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input name="fullName" label="Full Name" onChange={handleChange} />
          <Input name="studentId" label="Student ID" onChange={handleChange} />
          <Input name="session" label="Session" onChange={handleChange} />

          <Input
            name="guardianName"
            label="Guardian Name"
            onChange={handleChange}
          />
          <Input name="planName" label="Course Plan" onChange={handleChange} />
          <Input
            name="courseName"
            label="Course Name"
            onChange={handleChange}
          />

          <Input name="mobile" label="Mobile" onChange={handleChange} />
          <Input name="email" label="Email" onChange={handleChange} />
          <Input name="totalFees" label="Total Fees" onChange={handleChange} />

          <Input
            name="purposeOfPayment"
            label="Purpose of Payment"
            onChange={handleChange}
          />
          <Input
            name="totalFeePaid"
            label="Total Fees Paid"
            onChange={handleChange}
          />
          <Input
            name="outStandingFees"
            label="Outstanding Fees"
            onChange={handleChange}
          />

          <Input
            name="paymentMode"
            label="Payment Mode"
            onChange={handleChange}
          />
          <Input
            name="transactionId"
            label="Transaction ID/ Cheque No"
            onChange={handleChange}
          />
          <Input
            name="payingAmount"
            label="Paying Amount"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-medium mb-1">Remark (optional)</label>
            <textarea
              name="remarks"
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Supporting Document
            </label>
            <div className="border rounded px-4 py-4 flex items-center justify-center bg-gray-200 text-gray-700">
              <FaImage size={24} />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-6 py-2 rounded font-semibold"
          >
            Generate
          </button>
        </div>
      </div> */}
      <AddReceipt/> 
      <DuePayment />
    </div>
  );
};

const DashboardCard = ({ label, value }) => (
  <div className="bg-white p-4 shadow rounded text-center">
    <p className="text-sm text-gray-500 font-medium">{label}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
  </div>
);

// const Input = ({ name, label, onChange }) => (
//   <div>
//     <label className="block text-sm font-medium mb-1">{label}</label>
//     <input
//       name={name}
//       onChange={onChange}
//       className="w-full border rounded px-3 py-2"
//       type="text"
//     />
//   </div>
// );

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default Dashboard;
