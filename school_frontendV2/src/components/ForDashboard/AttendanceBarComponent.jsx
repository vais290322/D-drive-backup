import React, { useState } from 'react';
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


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttendanceBarComponent = () => {
  const {theme }= useTheme();
  const [activeView, setActiveView] = useState('Yearly'); // Track active view
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Attendance',
        data: [100, 120, 200, 80, 50, 150, 90, 70, 110, 130, 95, 105],
        backgroundColor: 'rgba(75, 0, 130, 0.7)',
      },
    ],
  });

  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Attendance Report',
      },
    },
  });

  const handleViewChange = (view) => {
    setActiveView(view); // Set active view state
    if (view === 'Yearly') {
      setChartData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Attendance',
            data: [100, 120, 200, 80, 50, 150, 90, 70, 110, 130, 95, 105],
            // backgroundColor: 'rgba(75, 0, 130, 0.7)',
            backgroundColor: `${theme==="light"?"#ade0ad":"green"}`,
          },
        ],
      });
    } else if (view === 'Monthly') {
      setChartData({
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: 'Attendance',
            data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 200)),
            backgroundColor: 'rgba(0, 123, 255, 0.7)',
          },
        ],
      });
    } else if (view === 'Weekly') {
      setChartData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Attendance',
            data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 200)),
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
          },
        ],
      });
    }
  };

  return (
    <div style={{ width: '90%' }} className="my-5">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold ml-2">Attendance Report</h3>
        <div style={{ marginBottom: '20px' }} >
          <button
            onClick={() => handleViewChange('Yearly')}
            className={`mr-2 rounded-full px-4 py-1 ${
              activeView === 'Yearly' && 'bg-purple-500 text-white' 
            }`}
          >
            Yearly
          </button>
          <button
            onClick={() => handleViewChange('Monthly')}
            className={`mr-2 rounded-full px-4 py-1 ${
              activeView === 'Monthly' && 'bg-green-500 text-white' 
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleViewChange('Weekly')}
            className={`mr-2 rounded-full px-4 py-1 ${
              activeView === 'Weekly' && 'bg-red-500 text-white' 
            }`}
          >
            Weekly
          </button>
        </div>
      </div>
      <Bar data={chartData} options={chartOptions} width={200} className='ml-2' />
    </div>
  );
};

export default AttendanceBarComponent;
