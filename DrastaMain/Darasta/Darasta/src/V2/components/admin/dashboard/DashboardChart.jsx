// DonationsChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", amount: 4200 },
  { month: "Feb", amount: 3500 },
  { month: "Mar", amount: 2600 },
  { month: "Apr", amount: 3400 },
  { month: "May", amount: 3000 },
  { month: "Jun", amount: 4000 },
  { month: "Jul", amount: 3100 },
];

export const DashboardChart = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Donations Over Time</h3>
      <p className="text-sm text-gray-500 mb-4">Amount ($)</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#6B7280" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-right text-sm text-gray-500 mt-2">Months</p>
    </div>
  );
};

