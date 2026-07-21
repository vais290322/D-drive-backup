import React, { useState, useEffect } from "react";
import api from "../../../service/index.js";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
} from "recharts";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-2 rounded shadow-sm text-sm">
        <p className="text-gray-700 font-medium">{label}</p>
        <p className="text-blue-600 font-semibold">${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const DashboardHeroSection = () => {
  const [donationOverTime, setDonationOverTime] = useState(null);
  const [resentActivity, setResentActivity] = useState([]);
  const [upcomingEvent, setUpcomingEvent] = useState([]);
  const [matrics, setMatrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((p) => Math.min(100, p + Math.floor(Math.random() * 10) + 5));
      }, 300);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data: dashData },
        } = await api.get("/admin/dashboard");
        const metricsArray = Object.entries(dashData.metrics || {}).map(
          ([key, value]) => ({
            title: key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase()),
            value,
          })
        );
        let recent = Array.isArray(dashData.recentActivity)
          ? dashData.recentActivity
          : dashData.recentActivity?.recentPosts || [];
        setResentActivity(recent);
        setUpcomingEvent(dashData.recentActivity.upcomingEvents || []);
        setMatrics(metricsArray);
      } catch {} finally {
        setLoading(false);
      }
    })();
    (async () => {
      try {
        const {
          data: { data: donData },
        } = await api.get("/admin/donations/over-time");
        setDonationOverTime(donData);
      } catch {} 
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-400 border-dashed rounded-full animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading… {progress}%</p>
        </div>
      </div>
    );
  }

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  const year = donationOverTime?.endDate
    ? new Date(donationOverTime.endDate).getFullYear()
    : new Date().getFullYear();
  const lookup = {};
  donationOverTime?.monthly?.forEach(({ period, amount }) => {
    lookup[period] = amount;
  });
  const chartData = monthNames.map((m, idx) => {
    const mm = String(idx + 1).padStart(2, "0");
    const key = `${year}-${mm}`;
    return { month: m, amount: lookup[key] || 0 };
  });
  const hasAny = Object.values(lookup).some((amt) => amt > 0);

  return (
    <section className="bg-gray-100 font-sans py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">📊 Key Metrics</h2>
          <p className="text-gray-500 mb-4">Monitor the impact your NGO is making.</p>
          <button className="mb-6 bg-black hover:bg-gray-800 text-white py-2 px-4 sm:px-6 rounded-md transition">
            View All Metrics
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {matrics.map((metric, idx) => (
              <div
                key={idx}
                className="border border-gray-200 p-4 rounded-xl bg-gray-50 hover:shadow transition"
              >
                <p className="text-sm text-gray-500">{metric.title.replace("Count","")}</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            🕒 Recent Activity
          </h3>
          <ul className="space-y-2">
            {resentActivity.map((activity, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-b-0"
              >
                <span className="text-gray-900 font-medium">
                  • {activity.title.length > 30 ? activity.title.slice(0,30)+"…" : activity.title}
                </span>
                <span className="text-xs text-gray-500">{activity.timeAgo}</span>
              </li>
            ))}
          </ul>
          {upcomingEvent.length > 0 && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-dashed border-blue-200">
              <h4 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">📅 Upcoming Event</h4>
              <ul className="space-y-1">
                {upcomingEvent.map((e, i) => (
                  <li key={i} className="text-gray-800 text-sm">
                    <span className="font-semibold">{e.title.length>50?e.title.slice(0,50)+"…":e.title}</span>
                    <span className="text-gray-600"> – {new Date(e.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          📈 Donations Over Time
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Total Donations ($){" "}
          <span className="font-medium">
            {donationOverTime?.totalAmount?.toLocaleString()}
          </span>
        </p>

        {hasAny ? (
          <div className="w-full h-64 sm:h-72 md:h-80 transition-transform duration-300 hover:scale-[1.02]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="amount"
                  fill="#3B82F6"
                  barSize={chartData.length <= 4 ? 48 : 32}
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400 italic">
            No donation data available
          </div>
        )}

        <p className="text-right text-sm text-gray-400 mt-3">
          Time (in months)
        </p>
      </div>
    </section>
  );
};
