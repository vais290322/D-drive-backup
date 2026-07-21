import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

const CircularChart = ({ data }) => {
  return (
    <div className="flex flex-col items-center w-[24%] bg-white ">
      <h3 className="text-md font-semibold mb-2">{data.name}</h3>
      <ResponsiveContainer width={180} height={180}>
        <RadialBarChart 
          innerRadius="40%" 
          outerRadius="100%" 
          barSize={12} 
          data={[data]} 
          startAngle={90} 
          endAngle={-270}
        >
          {/* Axis to properly align the circular progress */}
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          {/* Radial bar with progress color */}
          <RadialBar dataKey="value" background={{ fill: "#E0E0E0" }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <p className="text-lg font-bold">{data.value}%</p>
    </div>
  );
};

const DashboardCircularAnalytics = () => {
  const analyticsData = [
    { name: "GST", value: 50, fill: "#FF5C5C" },        // 50% filled
    { name: "Revenue", value: 80, fill: "#007BFF" },   // 80% filled
    { name: "Employees", value: 90, fill: "#4CAF50" }, // 100% filled
    { name: "Clients", value: 40, fill: "#FFA500" },   // 40% filled (New Chart)
  ];

  return (
    <div className="flex justify-between gap-6 w-full bg-white ">
      {analyticsData.map((item, index) => (
        <CircularChart key={index} data={item} />
      ))}
    </div>
  );
};

export default DashboardCircularAnalytics;



