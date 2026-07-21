import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/db/api";
import type { DashboardStats } from "@/types/types";
import {
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Wallet,
  TrendingDown,
  Clock,
  Percent,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Area, AreaChart } from "recharts";

export default function Dashboard() {


  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<import("@/types/types").DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [statsData, eventsData] = await Promise.all([
        api.dashboard.getStats(),
        api.dashboard.getEvents()
      ]);
      setStats(statsData);
      setEvents(eventsData);
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

  const primaryKPIs = [
    {
      title: "Total Customers",
      value: stats?.total_customers || 0,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      path: "/reports/customers",
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
      title: "Delayed EMIs",
      value: stats?.delayed_emis || 0,
      icon: AlertCircle,
      gradient: "from-red-500 to-orange-500",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      path: "/reports/delayed-emis",
      trend: "-5%",
      trendUp: false,
    },
  ];

  const financialKPIs = [
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
      title: "Total Outstanding",
      value: formatCurrency(stats?.total_outstanding || 0),
      icon: TrendingUp,
      gradient: "from-indigo-500 to-purple-500",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      path: "/reports/financial",
      subtitle: "Amount pending",
    },
    {
      title: "Total Disbursed",
      value: formatCurrency(stats?.total_disbursed || 0),
      icon: Wallet,
      gradient: "from-teal-500 to-cyan-500",
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-500",
      path: "/reports/financial",
      subtitle: "Loans disbursed",
    },
    {
      title: "Collection Rate",
      value: formatPercent(collectionRate),
      icon: Target,
      gradient: "from-pink-500 to-rose-500",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-500",
      path: "/reports/financial",
      subtitle: "Recovery rate",
    },
  ];

  const performanceKPIs = [
    {
      title: "Average Loan Size",
      value: formatCurrency(avgLoanSize),
      icon: Activity,
      gradient: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },
    {
      title: "Delay Rate",
      value: formatPercent(delayRate),
      icon: Clock,
      gradient: "from-orange-500 to-red-500",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
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

  const KPICard = ({ kpi, index }: { kpi: any; index: number }) => {
    const Icon = kpi.icon;
    return (
      <Card
        className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border-0 bg-gradient-to-br ${kpi.gradient} p-[1px]`}
        onClick={() => kpi.path && navigate(kpi.path)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative bg-background rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <div className={`rounded-xl p-2.5 ${kpi.iconBg} ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r ${kpi.gradient} bg-clip-text text-transparent">
              {kpi.value}
            </div>
            {kpi.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.subtitle}
              </p>
            )}
            {kpi.trend && (
              <div className="flex items-center gap-1 mt-2">
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

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete overview of your loan management system
        </p>
      </div>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Upcoming Events ({events.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <div
                  key={`event-${index}`}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/60 dark:bg-black/20 border shadow-sm cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-200 transition-all active:scale-95 touch-manipulation"
                  onClick={() => navigate(`/customers/${event.event?.customer_id || event.customer_id}`)}
                >
                  <div className={`p-3 rounded-full shrink-0 ${event.type === 'birthday' ? 'bg-pink-100 text-pink-600' :
                      event.type === 'anniversary' ? 'bg-amber-100 text-amber-600' :
                        'bg-red-100 text-red-600'
                    }`}>
                    {event.type === 'birthday' && <Users className="h-5 w-5" />}
                    {event.type === 'anniversary' && <Activity className="h-5 w-5" />}
                    {event.type === 'loan_closure' && <CheckCircle className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground line-clamp-2">{event.message}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span className="font-medium truncate">{event.customer_name}</span>
                      <span>•</span>
                      <span className="truncate">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Primary KPIs */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Key Performance Indicators
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={`skeleton-${i}`} className="border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </CardContent>
              </Card>
            ))
            : primaryKPIs.map((kpi, index) => (
              <KPICard key={`primary-${index}`} kpi={kpi} index={index} />
            ))}
        </div>
      </div>

      {/* Financial KPIs */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Financial Metrics
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={`skeleton-fin-${i}`} className="border-0">
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))
            : financialKPIs.map((kpi, index) => (
              <KPICard key={`financial-${index}`} kpi={kpi} index={index} />
            ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Performance Metrics
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
              <Card key={`skeleton-perf-${i}`} className="border-0">
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))
            : performanceKPIs.map((kpi, index) => (
              <KPICard key={`performance-${index}`} kpi={kpi} index={index} />
            ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />
              Loan Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={loanStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
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

        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={financialData}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  />
                  <Bar dataKey="amount" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/customers/new"
              className="group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:border-blue-500/50"
            >
              <Users className="h-8 w-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-1">Add New Customer</h3>
              <p className="text-sm text-muted-foreground">
                Register a new customer with KYC details
              </p>
            </a>
            <a
              href="/loans/new"
              className="group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/50"
            >
              <FileText className="h-8 w-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-1">Create New Loan</h3>
              <p className="text-sm text-muted-foreground">
                Disburse a new loan to a customer
              </p>
            </a>
            <a
              href="/collections"
              className="group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:border-green-500/50"
            >
              <DollarSign className="h-8 w-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-1">Collect EMI</h3>
              <p className="text-sm text-muted-foreground">
                Record EMI payment from customers
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

