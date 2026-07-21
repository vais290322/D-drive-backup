import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import { accountApi } from "@/common/main";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeBarComponent = () => {
  const { theme } = useTheme();
  const [incomeData, setIncomeData] = useState({});
  const currentYear = new Date().getFullYear();

  // console.log("incomedata : ", incomeData);

  // Fetch Income Data from API
  const fetchIncome = async () => {
    try {
      const response = await axios.get(
        `${accountApi}/income/yearly-breakdown/${currentYear}`
      );
      if (response?.data?.data) {
        setIncomeData(response.data.data);
      }
    } catch (error) {
      // console.error("Error fetching income data:", error);
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // console.log("Fetched incomeData:", incomeData);

  // Ensure all months exist in incomeData, default to 0 if missing
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const incomeValues = months.map(month => incomeData[month] ?? 0); // Use 0 if month is missing

  const chartData = {
    labels: months.map(m => m.substring(0, 3)), // Convert full month names to short form (Jan, Feb, etc.)
    datasets: [
      {
        label: "Income",
        data: incomeValues, // Use dynamic values from API
        backgroundColor: `${theme === "light" ? "#ade0ad" : "green"}`,
        borderRadius: 5, 
        barThickness: 15, 
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Total Income (${currentYear})`,
        align: "start",
        font: { size: 16, weight: "bold" },
        color: `${theme === 'light' ? '#fff' : '#000'}`,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#a0aec0",
          font: { size: 14 },
        },
      },
      y: {
        grid: { color: `${theme === "light" ? "#555555" : "#e2e8f0"}` },
        ticks: {
          color: "#a0aec0",
          font: { size: 12 },
          callback: (value) => `${value / 1000}k`, // Display values in 'k' format
        },
        min: 0, 
      },
    },
  };

  return (
    <div className="w-full max-w-[400px] mx-0 my-auto lg:max-w-[500px]">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default IncomeBarComponent;
