import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '@/context/ThemeContext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import mainUrlApi from '@/common/main';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttendanceBarComponent = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const [activeView, setActiveView] = useState('Yearly');
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const schoolId = useSelector((state) => state.auth.schoolId);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  // Fetch attendance data based on the active view
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        let endpoint = '';
        
        if (activeView === 'Yearly') {
          endpoint = `${mainUrlApi.attendance.url}/attendance/calculate/current-year/${schoolId}`;
        } else if (activeView === 'Monthly') {
          endpoint = `${mainUrlApi.attendance.url}/attendance/calculate/current-month/${schoolId}`;
        } else if (activeView === 'Weekly') {
          endpoint = `${mainUrlApi.attendance.url}/attendance/calculate/current-week/${schoolId}`;
        }
        
        const response = await axios.get(endpoint);
        setAttendanceData(response.data);
        setAttendancePercentage(response.data.attendancePercentage || 0);
        
        // Process the data for the chart
        processChartData(response.data, activeView);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast.error("Failed to load attendance data");
        // Fall back to sample data if API fails
        processChartData(null, activeView);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, [activeView, schoolId]);

  // Process the API response into chart data
  const processChartData = (data, view) => {
    if (!data) {
      // Fallback to sample data if API data is not available
      const sampleData = generateSampleData(view);
      setChartData(sampleData);
      setChartOptions(getChartOptions(view));
      return;
    }
    
    let labels = [];
    let presentData = [];
    let absentData = [];
    let leaveData = [];
    let holidayData = [];
    
    if (view === 'Yearly' && data.monthWiseStats) {
      labels = Object.keys(data.monthWiseStats).map(month => month.substring(0, 3));
      
      Object.values(data.monthWiseStats).forEach(stats => {
        presentData.push(stats.present);
        absentData.push(stats.absent);
        leaveData.push(stats.leave);
        holidayData.push(stats.holiday);
      });
    } else if (view === 'Monthly' && data.dateWiseStats) {
      // Extract dates and format them as day numbers
      labels = Object.keys(data.dateWiseStats).map(date => new Date(date).getDate().toString());
      
      Object.values(data.dateWiseStats).forEach(stats => {
        presentData.push(stats.present);
        absentData.push(stats.absent);
        leaveData.push(stats.leave);
        holidayData.push(stats.holiday);
      });
    } else if (view === 'Weekly' && data.dayWiseStats) {
      labels = Object.keys(data.dayWiseStats);
      
      Object.values(data.dayWiseStats).forEach(stats => {
        presentData.push(stats.present);
        absentData.push(stats.absent);
        leaveData.push(stats.leave);
        holidayData.push(stats.holiday);
      });
    }
    
    const chartDataset = {
      labels,
      datasets: [
        {
          label: 'Present',
          data: presentData,
          backgroundColor: isDarkMode ? "#7dd87d" : "rgba(34, 197, 94, 0.8)",
          borderRadius: 5,
          barThickness: view === 'Monthly' && labels.length > 20 ? 8 : 12,
        },
        {
          label: 'Absent',
          data: absentData,
          backgroundColor: isDarkMode ? "#ff7b7b" : "rgba(239, 68, 68, 0.8)",
          borderRadius: 5,
          barThickness: view === 'Monthly' && labels.length > 20 ? 8 : 12,
        }
      ],
    };
    
    // Add leave and holiday datasets if they have non-zero values
    const hasLeave = leaveData.some(value => value > 0);
    const hasHoliday = holidayData.some(value => value > 0);
    
    if (hasLeave) {
      chartDataset.datasets.push({
        label: 'Leave',
        data: leaveData,
        backgroundColor: isDarkMode ? "#ffcc80" : "rgba(249, 115, 22, 0.8)",
        borderRadius: 5,
        barThickness: view === 'Monthly' && labels.length > 20 ? 8 : 12,
      });
    }
    
    if (hasHoliday) {
      chartDataset.datasets.push({
        label: 'Holiday',
        data: holidayData,
        backgroundColor: isDarkMode ? "#90caf9" : "rgba(59, 130, 246, 0.8)",
        borderRadius: 5,
        barThickness: view === 'Monthly' && labels.length > 20 ? 8 : 12,
      });
    }
    
    setChartData(chartDataset);
    setChartOptions(getChartOptions(view));
  };

  // Sample data as fallback
  const generateSampleData = (view) => {
    if (view === 'Yearly') {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Present',
            data: [85, 88, 92, 78, 82, 90, 86, 84, 91, 87, 89, 93],
            backgroundColor: isDarkMode ? "#7dd87d" : "rgba(34, 197, 94, 0.8)",
            borderRadius: 5,
            barThickness: 12,
          },
          {
            label: 'Absent',
            data: [15, 12, 8, 22, 18, 10, 14, 16, 9, 13, 11, 7],
            backgroundColor: isDarkMode ? "#ff7b7b" : "rgba(239, 68, 68, 0.8)",
            borderRadius: 5,
            barThickness: 12,
          }
        ],
      };
    } else if (view === 'Monthly') {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      return {
        labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
        datasets: [
          {
            label: 'Present',
            data: Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 40) + 60),
            backgroundColor: isDarkMode ? "#7dd87d" : "rgba(59, 130, 246, 0.8)",
            borderRadius: 5,
            barThickness: daysInMonth > 20 ? 8 : 12,
          },
          {
            label: 'Absent',
            data: Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 20)),
            backgroundColor: isDarkMode ? "#ff7b7b" : "rgba(239, 68, 68, 0.8)",
            borderRadius: 5,
            barThickness: daysInMonth > 20 ? 8 : 12,
          }
        ],
      };
    } else if (view === 'Weekly') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Present',
            data: [92, 88, 95, 90, 87, 93, 85],
            backgroundColor: isDarkMode ? "#a3b1ff" : "rgba(168, 85, 247, 0.8)",
            borderRadius: 5,
            barThickness: 16,
          },
          {
            label: 'Absent',
            data: [8, 12, 5, 10, 13, 7, 15],
            backgroundColor: isDarkMode ? "#ff7b7b" : "rgba(239, 68, 68, 0.8)",
            borderRadius: 5,
            barThickness: 16,
          }
        ],
      };
    }
  };

  const getChartOptions = (view) => {
    const titleText = view === 'Yearly' 
      ? `Attendance Overview (${currentYear})` 
      : view === 'Monthly' 
        ? `Attendance for ${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })}` 
        : 'Weekly Attendance';
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: isDarkMode ? "#a3b1ff" : "#64748b",
            font: { size: 12 }
          }
        },
        title: {
          display: true,
          text: titleText,
          color: isDarkMode ? "#e2e8f0" : "#1e293b",
          font: { size: 16, weight: 'bold' },
          padding: { bottom: 20 }
        },
        tooltip: {
          backgroundColor: isDarkMode ? "#111c38" : "rgba(255, 255, 255, 0.9)",
          titleColor: isDarkMode ? "#e2e8f0" : "#1e293b",
          bodyColor: isDarkMode ? "#e2e8f0" : "#1e293b",
          padding: 12,
          cornerRadius: 8,
          displayColors: true
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
            maxRotation: view === 'Monthly' ? 90 : 0,
            minRotation: view === 'Monthly' ? 90 : 0
          },
          border: {
            display: false
          },
          stacked: true
        },
        y: {
          grid: { 
            color: isDarkMode ? "rgba(163, 177, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
            drawBorder: false,
          },
          ticks: {
            color: isDarkMode ? "#a3b1ff" : "#64748b",
            font: { size: 11 },
            callback: (value) => `${value}`
          },
          border: {
            display: false
          },
          stacked: true
        }
      }
    };
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className={`w-full h-full flex flex-col p-4 ${isDarkMode ? "bg-[#111c38] text-white" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-1 sm:mb-0`}>
            Attendance Report
          </h3>
          {attendanceData && (
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
              Overall attendance: <span className="font-medium">{attendancePercentage.toFixed(1)}%</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
          <button
            onClick={() => handleViewChange('Yearly')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeView === 'Yearly' 
                ? 'bg-[#2563eb] text-white' 
                : isDarkMode 
                  ? 'bg-[#1a2747] text-gray-300 hover:bg-[#1e2e52]' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Yearly
          </button>
          <button
            onClick={() => handleViewChange('Monthly')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeView === 'Monthly' 
                ? 'bg-[#2563eb] text-white' 
                : isDarkMode 
                  ? 'bg-[#1a2747] text-gray-300 hover:bg-[#1e2e52]' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleViewChange('Weekly')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeView === 'Weekly' 
                ? 'bg-[#2563eb] text-white' 
                : isDarkMode 
                  ? 'bg-[#1a2747] text-gray-300 hover:bg-[#1e2e52]' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>
      
      <div className="flex-grow h-[calc(100%-60px)] min-h-[300px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader2 className={`h-8 w-8 animate-spin ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
            <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Loading attendance data...</p>
          </div>
        ) : chartData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            No attendance data available
          </p>
        )}
      </div>
    </div>
  );
};

export default AttendanceBarComponent;