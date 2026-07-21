
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const profitLossData = [
  { name: "Jan", profit: 2000, loss: 1000 },
  { name: "Feb", profit: 2500, loss: 1200 },
  { name: "Mar", profit: 3000, loss: 1800 },
  { name: "Apr", profit: 5000, loss: 2500 },
  { name: "May", profit: 4000, loss: 2000 },
  { name: "June", profit: 3500, loss: 1500 },
];

const orderVolumeData = [
  { name: "Jan", orders: 2000 },
  { name: "Feb", orders: 2200 },
  { name: "Mar", orders: 2800 },
  { name: "Apr", orders: 5000 },
  { name: "May", orders: 3500 },
  { name: "June", orders: 4000 },
  { name: "July", orders: 3800 },
  { name: "Aug", orders: 4500 },
  { name: "Sep", orders: 4700 },
];

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Profit & Loss Bar Chart */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Profit & Loss</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profitLossData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="profit" fill="#4CAF50" name="Profit" />
            <Bar dataKey="loss" fill="#F44336" name="Loss" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Order Volume Bar Graph */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Order Volume</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orderVolumeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#673AB7" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
