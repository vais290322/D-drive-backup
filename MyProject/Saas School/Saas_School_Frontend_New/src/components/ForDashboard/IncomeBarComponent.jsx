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
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { ArrowUpRight } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeBarComponent = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const [incomeData, setIncomeData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  const schoolId = useSelector((state) => state.auth.schoolId);
  const [totalIncome, setTotalIncome] = useState(0);

  // Fetch Income Data from API
  const fetchIncome = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${accountApi}/income/yearly-breakdown/${currentYear}/${schoolId}`
      );

      // console.log("Income Data:", response.data);

      if (response?.data?.data) {
        setIncomeData(response.data.data);
        
        // Calculate total income
        const total = Object.values(response.data.data).reduce(
          (sum, value) => sum + (value || 0), 
          0
        );
        setTotalIncome(total);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load income data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [schoolId]);

  // Ensure all months exist in incomeData, default to 0 if missing
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const incomeValues = months.map(month => incomeData[month] ?? 0);

  // Find the month with highest income
  const maxIncomeMonth = months[incomeValues.indexOf(Math.max(...incomeValues))] || "N/A";
  
  const chartData = {
    labels: months.map(m => m.substring(0, 3)),
    datasets: [
      {
        label: "Income",
        data: incomeValues,
        backgroundColor: isDarkMode ? "#7dd87d" : "rgba(34, 197, 94, 0.8)",
        borderRadius: 6,
        barThickness: 14,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#111c38" : "rgba(255, 255, 255, 0.9)",
        titleColor: isDarkMode ? "#e2e8f0" : "#1e293b",
        bodyColor: isDarkMode ? "#e2e8f0" : "#1e293b",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Income: ${context.parsed.y.toLocaleString('en-US', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { 
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? "#a3b1ff" : "#64748b",
          font: { size: 11 },
        },
        border: {
          display: false
        }
      },
      y: {
        grid: { 
          color: isDarkMode ? "rgba(163, 177, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: isDarkMode ? "#a3b1ff" : "#64748b",
          font: { size: 11 },
          callback: (value) => {
            if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
            return `₹${value}`;
          }
        },
        border: {
          display: false
        },
        min: 0,
      },
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={`w-full h-full flex flex-col p-4 ${isDarkMode ? "bg-[#111c38] text-white" : ""}`}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Income Overview
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
            {currentYear} Financial Year
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {isLoading ? "Loading..." : formatCurrency(totalIncome)}
            </span>
            <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
          </div>
          <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
            Highest in {maxIncomeMonth}
          </p>
        </div>
      </div>
      
      <div className="flex-grow h-[calc(100%-60px)] min-h-[180px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default IncomeBarComponent;