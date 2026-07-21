import React from 'react';
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

const ExpenseBarComponent = () => {
  const {theme }= useTheme();
  const chartData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Income',
              data: [2000, 3000, 4000, 2800, 2000, 3000, 3000,6000, 3200, 4800, 2600, 5300],
              backgroundColor: 'blue',
              borderRadius: 5, // Optional for rounded bars
              barThickness: 15, // Set thickness of bars
            },
          ],
        };
      
        const chartOptions = {
          responsive: true,
          plugins: {
            legend: {
              display: false, // Hides the legend
            },
            title: {
              display: true,
              text: 'Total Expense',
              align: 'start', // Align the title to the start
              font: {
                size: 16,
                weight: 'bold',
              },
              // color: '#000', // Title color
              color: `${theme === 'light' ? '#fff' : '#000'}`, // Title color
            },
          },
          scales: {
            x: {
              grid: {
                display: false, // Removes grid lines on x-axis
              },
              ticks: {
                color: '#a0aec0', // Light gray color for month names
                font: {
                  size: 14,
                },
              },
            },
            y: {
              grid: {
                // color: '#e2e8f0', // Light grid lines
                color: `${theme === 'light' ? '#9e9595' : '#e2e8f0'}`, // Light grid lines
              },
              ticks: {
                color: '#a0aec0', // Light gray for y-axis numbers
                font: {
                  size: 12,
                },
                callback: function (value) {
                  return `${value / 1000}k`; // Display values in 'k' format
                },
              },
              min: 1000, // Minimum value of y-axis
              max: 7000, // Maximum value of y-axis
            },
          },
        };
      
        return (
          <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }} >
            <Bar data={chartData} options={chartOptions} />
          </div>
        );
}

export default ExpenseBarComponent