import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Clock } from "lucide-react";
import { DashboardUrl, getAuthHeaders, PaymentUrl } from "../config/config";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineCalendarToday,
  MdOutlinePayment,
  MdPayment,
} from "react-icons/md";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPayment, setRecentPayment] = useState(null);
  const [upcomingDues, setUpcomingDues] = useState([]);
  const navigate = useNavigate();
  const statusStyles = {
    paid: {
      badge: "bg-green-100 text-green-700",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    unpaid: {
      badge: "bg-red-100 text-red-700",
      icon: <Clock className="w-5 h-5 text-red-500" />,
    },
    pending: {
      badge: "bg-yellow-100 text-yellow-700",
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
    },
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardRes = await axios.get(`${DashboardUrl.getDashboard}`, {
          headers: getAuthHeaders(),
        });
        setStats(dashboardRes.data.data);

        const summaryRes = await axios.get(
          `${DashboardUrl.getRecentPayments}`,
          { headers: getAuthHeaders() }
        );
        setRecentPayment(summaryRes.data.data || []);

        const upcomingRes = await axios.get(
          `${DashboardUrl.getPaymentSummary}`,
          { headers: getAuthHeaders() }
        );
        setUpcomingDues(upcomingRes.data.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !stats) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5">
        <StatCard
          title="Total Students"
          value={stats.partialStudents + stats.paidStudents + stats.dueStudents}
        />
        <StatCard
          title="30 Days Fees Collection"
          value={formatCurrency(stats.totalRevenue)}
        />
        <StatCard
          title="Today's Fees Collection"
          value={formatCurrency(stats.currentMonthRevenue)}
        />
        <StatCard
          title="Outstanding Fees"
          value={formatCurrency(stats.totalDueAmount)}
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Recent Payments */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
          <div className="flex flex-row items-center justify-between gap-2 mb-5">
            <span className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <MdPayment size={25} />
              Recent Payments
            </span>
            <button
              className="bg-gradient-to-r bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              onClick={() => navigate("/payments")}
            >
              View all
            </button>
          </div>

          {recentPayment.length === 0 ? (
            <p className="text-sm text-gray-500">No recent payments.</p>
          ) : (
            <div className="space-y-4">
             {recentPayment.slice(0, 5).map((payment, index) => {

                const status = statusStyles[
                  payment.student?.paymentStatus?.toLowerCase()
                ] || {
                  badge: "bg-gray-200 text-gray-700",
                  icon: (
                    <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center">
                      ₹
                    </div>
                  ),
                };

                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl px-4 py-3"
                    onClick={() =>
                      navigate(`/payment-student/${payment?.student?.id}`)
                    }
                  >
                    {/* Left: Avatar, Name, Course */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold uppercase text-sm">
                        {payment.student?.fullName?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">
                          {payment.student?.fullName || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.student?.course?.courseName || "—"} •{" "}
                          {payment.paymentMethod || "Unknown Method"}
                        </p>
                      </div>
                    </div>

                    {/* Right: Amount, Status */}
                    <div className="text-left sm:text-right mt-3 sm:mt-0">
                      <p className="text-sm font-bold text-gray-800">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </p>
                      <div className="flex flex-wrap sm:flex-nowrap items-center sm:justify-end gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${status.badge} font-medium capitalize`}
                        >
                          {payment?.student?.paymentStatus || "-"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {payment?.paymentDate
                            ? new Date(payment.paymentDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Dues */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
          <div className="flex flex-row items-center justify-between gap-2 mb-5">
            <span className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <MdOutlineCalendarToday />
              Upcoming Dues
            </span>
            <button
              className="bg-gradient-to-r bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              onClick={() => navigate("/payments")}
            >
              View all
            </button>
          </div>

          {upcomingDues.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming dues.</p>
          ) : (
            <div className="space-y-4">
              {upcomingDues.slice(0, 5).map((student, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl px-4 py-3"
                  onClick={() => navigate(`/payment-student/${student?.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold uppercase text-sm">
                      {student.fullName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {student.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {student.course?.courseName || "—"} •{" "}
                        {student.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right mt-3 sm:mt-0">
                    <p className="text-sm font-bold text-gray-800">
                      ₹{student.dueAmount.toLocaleString("en-IN")}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                      Due
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow-md p-8 text-center">
    <p className="text-sm text-gray-600 mb-1">{title}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default Dashboard;
