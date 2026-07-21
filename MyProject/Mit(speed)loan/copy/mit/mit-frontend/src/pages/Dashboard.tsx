import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/db/api";
import type { DashboardStats, EmiPayment } from "@/types/types";
import {
  Users,
  FileText,
  CheckCircle,
  DollarSign,
  Wallet,
  Clock,
  Percent,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  QrCode,
  Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<import("@/types/types").DashboardEvent[]>([]);
  const [recentPayments, setRecentPayments] = useState<EmiPayment[]>([]);
  const [pendingEmis, setPendingEmis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    const { profile }: any = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [statsData, eventsData, recentPaymentsData, delayedEmisData] = await Promise.all([
        api.dashboard.getStats(),
        api.dashboard.getEvents(),
        api.payments.getRecent(3),
        api.dashboard.getDelayedEmis().catch(() => [])
      ]);
      setStats(statsData);
      setEvents(eventsData);
      setRecentPayments(recentPaymentsData);

      // Process delayed EMIs - Group by Loan ID
      const loanGroups: Record<string, {
        loan_id: any;
        amount_due: number;
        due_date: string;
      }> = {};

      (delayedEmisData as any[]).forEach((item: any) => {
        const loanId = item.loan_id?._id;
        if (!loanId) return;

        const outstandingAmount = (item.emi_amount || 0) - (item.paid_amount || 0);

        if (!loanGroups[loanId]) {
          loanGroups[loanId] = {
            loan_id: item.loan_id,
            amount_due: 0,
            due_date: item.due_date
          };
        }

        loanGroups[loanId].amount_due += outstandingAmount;

        // Track earliest due date
        if (new Date(item.due_date) < new Date(loanGroups[loanId].due_date)) {
          loanGroups[loanId].due_date = item.due_date;
        }
      });

      // Convert to array and sort by due date (oldest first)
      const formattedPendingEmis = Object.values(loanGroups).sort((a, b) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      );

      setPendingEmis(formattedPendingEmis.slice(0, 5)); // Get top 5 overdue loans
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Calculate additional KPIs
  const collectionRate = stats ? ((stats.total_disbursed - stats.total_outstanding) / stats.total_disbursed * 100) : 0;
  const avgLoanSize = stats && stats.active_loans > 0 ? stats.total_outstanding / stats.active_loans : 0;
  const delayRate = stats && stats.active_loans > 0 ? (stats.delayed_emis / stats.active_loans * 100) : 0;

  // Consolidated KPIs - All in one array
  const allKPIs = [
    {
      title: "Total Customers",
      value: stats?.total_customers || 0,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      path: "/customers",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Active Loans",
      value: stats?.active_loans || 0,
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      path: "/reports/active-loans",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Completed Loans",
      value: stats?.completed_loans || 0,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      path: "/reports/completed-loans",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Today's Collection",
      value: formatCurrency(stats?.total_collection_today || 0),
      icon: DollarSign,
      gradient: "from-amber-500 to-yellow-500",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      path: "/reports/today-collection",
      subtitle: "Collected today",
    },
    {
      title: "Collection Rate",
      value: formatPercent(collectionRate),
      icon: Target,
      gradient: "from-pink-500 to-rose-500",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-500",
      path: undefined, // Calculated metric - no specific page
      subtitle: "Recovery rate",
    },
    {
      title: "Average Loan Size",
      value: formatCurrency(avgLoanSize),
      icon: Activity,
      gradient: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      path: "/reports/active-loans", // Show active loans to see loan sizes
    },
    {
      title: "Delay Rate",
      value: formatPercent(delayRate),
      icon: Clock,
      gradient: "from-orange-500 to-red-500",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      path: "/reports/delayed-emis", // Links to delayed EMIs page
    },
  ];

  const loanStatusData = [
    { name: "Active", value: stats?.active_loans || 0, color: "#8b5cf6" },
    { name: "Completed", value: stats?.completed_loans || 0, color: "#10b981" },
    { name: "Delayed", value: stats?.delayed_emis || 0, color: "#ef4444" },
  ];

  const financialData = [
    {
      name: "Disbursed",
      amount: stats?.total_disbursed || 0,
    },
    {
      name: "Outstanding",
      amount: stats?.total_outstanding || 0,
    },
    {
      name: "Collected",
      amount: (stats?.total_disbursed || 0) - (stats?.total_outstanding || 0),
    },
  ];

  const KPICard = ({ kpi }: { kpi: any }) => {
    const Icon = kpi.icon;
    return (
      <Card
        className={`group relative overflow-hidden transition-all duration-200 hover:shadow-xl ${kpi.path ? 'hover:scale-105 cursor-pointer' : ''} border-0 bg-gradient-to-br ${kpi.gradient} p-[1px] backdrop-blur-sm`}
        onClick={() => kpi.path && navigate(kpi.path)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="relative bg-background/95 backdrop-blur-sm rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground truncate mr-2">
              {kpi.title}
            </CardTitle>
            <div className={`rounded-xl p-1.5 md:p-2 ${kpi.iconBg} ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-200`}>
              <Icon className={`h-3 w-3 md:h-4 md:w-4 ${kpi.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
            <div className={`text-lg md:text-2xl font-bold bg-gradient-to-r ${kpi.gradient} bg-clip-text text-transparent truncate`}>
              {kpi.value}
            </div>
            {kpi.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.subtitle}
              </p>
            )}
            {kpi.trend && (
              <div className="flex items-center gap-1 mt-1.5">
                {kpi.trendUp ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${kpi.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.trend}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    );
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Users className="h-4 w-4" />;
      case 'anniversary':
        return <Activity className="h-4 w-4" />;
      case 'loan_closure':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'birthday':
        return { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500' };
      case 'anniversary':
        return { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' };
      case 'loan_closure':
        return { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500' };
      default:
        return { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' };
    }
  };

  return (
    <div className="space-y-3 md:space-y-4 p-2 md:p-6 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      {/* Compact Header */}
      <div className="space-y-0.5 md:space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">
          Complete overview of your loan management system
        </p>
      </div>

      {/* Timeline Events - Readable Display */}
      {events.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2 p-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-indigo-500" />
              Events ({events.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {/* Scrollable container - shows ~2 events comfortably */}
            <div className="max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent hover:scrollbar-thumb-indigo-500/40 pr-2">
              <div className="space-y-2">
                {events.map((event, index) => {
                  const colors = getEventColor(event.type);
                  return (
                    <div
                      key={index}
                      className="relative pl-8 pb-3 last:pb-0 cursor-pointer group"
                      onClick={() => navigate(`/customers/${event.customer_id}`)}
                    >
                      {/* Timeline line */}
                      {index !== events.length - 1 && (
                        <div className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${colors.bg} opacity-20 group-hover:opacity-40 transition-opacity`} />
                      )}

                      {/* Timeline node */}
                      <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center ring-2 ring-background group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                        <div className="text-white scale-75">
                          {getEventIcon(event.type)}
                        </div>
                      </div>

                      {/* Event card */}
                      <div className="ml-1 p-3 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50 group-hover:border-indigo-200 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-950/20 transition-all duration-200 shadow-sm hover:shadow-md">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm text-foreground leading-tight">
                              {event.message}
                            </p>
                            <div className="text-xs text-muted-foreground whitespace-nowrap shrink-0 bg-background/50 px-1.5 py-0.5 rounded border border-border/50">
                              {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <div className={`text-xs ${colors.text} font-medium flex items-center gap-1.5`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                            {event.customer_name}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending/Overdue EMIs - Compact Display */}
      {pendingEmis.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500/5 to-orange-500/5 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2 p-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-red-500" />
                Pending EMIs ({pendingEmis.length})
              </CardTitle>
              <button
                onClick={() => navigate('/reports/delayed-emis')}
                className="text-xs text-primary hover:underline font-medium"
              >
                View All
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-500/20 scrollbar-track-transparent hover:scrollbar-thumb-red-500/40 pr-2">
                <div className="space-y-2">
                  {pendingEmis.map((emi, index) => {
                    const daysOverdue = Math.floor((new Date().getTime() - new Date(emi.due_date).getTime()) / (1000 * 60 * 60 * 24));
                    const customer = emi.loan_id?.customer_id;
                    const loanCode = emi.loan_id?.loan_code || 'N/A';

                    return (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-background/60 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
                        onClick={() => navigate(`/loans/${emi.loan_id?._id}`)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-xs md:text-sm text-foreground truncate">
                              {customer?.full_name || 'Unknown'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {loanCode} • Due: {new Date(emi.due_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-sm md:text-base text-red-600 dark:text-red-400">
                              ₹{emi.amount_due?.toLocaleString('en-IN') || '0'}
                            </p>
                            <p className="text-xs text-red-500 font-semibold mt-0.5">
                              {daysOverdue}d overdue
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Consolidated KPIs - Single Grid */}
      <div>
        <h2 className="text-sm md:text-base font-semibold mb-2 md:mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Key Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
              <Card key={`skeleton-${i}`} className="w-full border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-8 rounded-xl" />
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))
            : allKPIs.map((kpi, index) => (
              <KPICard key={`kpi-${index}`} kpi={kpi} />
            ))}
        </div>
      </div>

      {/* Charts - Reduced Height & Side by Side */}
      <div className="grid gap-3 md:gap-4 md:grid-cols-2">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="p-3 md:p-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Percent className="h-4 w-4 text-primary" />
              Loan Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={loanStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {loanStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="p-3 md:p-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Wallet className="h-4 w-4 text-primary" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={financialData}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6289ccff" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ backgroundColor: '#92b9f0ff', border: 'none', borderRadius: '8px' }}
                  />
                  <Bar dataKey="amount" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions - Compact */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="p-3 md:p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Radio className="h-4 w-4 text-primary" />
            Recent Online Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-0">
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="space-y-2.5">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-full ${payment.payment_mode === 'upi' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {payment.payment_mode === 'upi' ? <QrCode className="h-3.5 w-3.5" /> : <DollarSign className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <p className="font-medium text-xs md:text-sm">
                          {(payment.loan_id as any)?.customer_id?.full_name || 'Unknown Customer'}
                        </p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          {(payment.loan_id as any)?.loan_code || (payment.loan_id as any)?.loan_id || 'Loan ID N/A'} • {new Date(payment.payment_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xs md:text-sm text-green-500">+{formatCurrency(payment.amount_paid)}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground capitalize">{payment.payment_mode}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground text-xs py-4">No recent transactions</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions - Compact */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
        <CardHeader className="p-3 md:p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Target className="h-4 w-4 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">


            <div
              onClick={() => navigate("/customers/new")}
              className="group p-4 rounded-xl border border-border/50 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:border-blue-500/50 cursor-pointer"
            >
              <Users className="h-6 w-6 md:h-7 md:w-7 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-sm md:text-base mb-0.5">Add Customer</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Register new customer
              </p>
            </div>
  {
  ["super_admin", "admin","collection_agent","loan_manager"].includes(profile?.role) && (
    <> 
            <div
              onClick={() => navigate("/loans/new")}
              className="group p-4 rounded-xl border border-border/50 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/50 cursor-pointer"
            >
              <FileText className="h-6 w-6 md:h-7 md:w-7 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-sm md:text-base mb-0.5">Create Loan</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Disburse new loan
              </p>
            </div>
  
            <div
              onClick={() => navigate("/collections")}
              className="group p-4 rounded-xl border border-border/50 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:border-green-500/50 cursor-pointer"
            >
              <DollarSign className="h-6 w-6 md:h-7 md:w-7 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-sm md:text-base mb-0.5">Collect EMI</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Record payment
              </p>
            </div>
  </>
  )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
