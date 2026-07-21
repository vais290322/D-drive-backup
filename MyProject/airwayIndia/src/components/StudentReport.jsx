import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { getAuthHeaders, StudentUrl } from "../config/config";

// First, update the COLORS constant with all uppercase keys
const COLORS = {
  GOLD: "#C41E3A",      // dark red
  DIAMOND: "#2E8B57",   // green
  PLATINUM: "#A8AA1B",  // olive/gold
  SILVER: "#B0C4DE",    // light blue
  BRONZE: "#CD853F",    // brown
  PREMIUM: "#FF6B6B",   
  BASIC: "#FFEEAD",    
  STANDARD: "#FF9F1C", 
  ELITE: "#9B5DE5",    
  PROFESSIONAL: "#00BBF9",
  ENTERPRISE: "#00F5D4",
  CUSTOM: "#FF85EA"    
};

const StudentReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${StudentUrl.reportStudent}`,{ headers: getAuthHeaders() })
      .then((res) => {
        setReport(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching report:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !report) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Then update the pieData transformation in your component
  const pieData = Object.entries(report.categories).map(([key, value]) => ({
    name: key.toUpperCase(), // Convert to uppercase when creating the data
    value: value.percentage,
    count: value.count,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 ">
      {/* Cards */}
      <div className=" grid grid-cols-2 gap-4 md:col-span-2">
        <Card title="Total Students" className="" value={report.totalStudents} />
        <Card title="New Admission" value={report.newAdmissions} />
        <Card title="Last Month" value={report.lastMonth} />
        <Card title="This Month" value={report.thisMonth} />
      </div>

      {/* Pie Chart */}
<div className="rounded-xl p-4 bg-white shadow-sm col-span-1 flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4">
  <h2 className="text-center font-semibold text-lg mb-2 w-full sm:w-auto">
    Student Report
  </h2>
  
  <div className="flex  flex-col sm:flex-row w-full items-center justify-center gap-4">
    {/* Pie Chart */}
    <div className="w-full sm:w-1/2 h-56">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label={false}
            startAngle={90}
            endAngle={450}
          >
            {/* Update the Cell component in the Pie chart (no need for toUpperCase here anymore) */}
            {pieData.map((entry, index) => (
              <Cell 
                key={index} 
                fill={COLORS[entry.name] || '#FFB6B9'}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Legend */}
    <div className="w-full sm:w-1/2">
      <ul className="space-y-3 text-sm text-gray-700">
        {pieData.map((entry, index) => {
          const count = entry.value || 0;
          const rounded = (Math.ceil(count * 100) / 100);
          return (
            <li key={index} className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: COLORS[entry.name] || '#FFB6B9' }}
              ></span>
              <span className="capitalize font-medium">
                {entry.name} ({rounded}%)
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
</div>

    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-center items-center">
    <h3 className="text-gray-700 font-medium">{title}</h3>
    <p className="text-2xl font-bold text-black mt-1">{value}</p>
  </div>
);

export default StudentReport;
