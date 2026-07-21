import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/db/api";
import type { DashboardStats } from "@/types/types";
import { Users, FileText, CheckCircle, AlertCircle, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.dashboard.getStats();
      setStats(data);
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

  const statCards = [
    {
      title: "Total Customers",
      value: stats?.total_customers || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      path: "/reports/customers",
    },
    {
      title: "Active Loans",
      value: stats?.active_loans || 0,
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
      path: "/reports/active-loans",
    },
    {
      title: "Completed Loans",
      value: stats?.completed_loans || 0,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      path: "/reports/completed-loans",
    },
    {
      title: "Delayed EMIs",
      value: stats?.delayed_emis || 0,
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      path: "/reports/delayed-emis",
    },
    {
      title: "Today's Collection",
      value: formatCurrency(stats?.total_collection_today || 0),
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10",
      path: "/reports/today-collection",
    },
    {
      title: "Total Outstanding",
      value: formatCurrency(stats?.total_outstanding || 0),
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      path: "/reports/financial",
    },
    {
      title: "Total Disbursed",
      value: formatCurrency(stats?.total_disbursed || 0),
      icon: Wallet,
      color: "text-success",
      bgColor: "bg-success/10",
      path: "/reports/financial",
    },
  ];

  const loanStatusData = [
    { name: "Active", value: stats?.active_loans || 0, color: "#10b981" },
    { name: "Completed", value: stats?.completed_loans || 0, color: "#1e3a8a" },
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your loan management system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Card key={`skeleton-${i}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24 bg-muted" />
                  <Skeleton className="h-4 w-4 rounded-full bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 bg-muted" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={`stat-${index}`} 
                  className="transition-all hover:shadow-lg cursor-pointer hover:scale-105"
                  onClick={() => navigate(stat.path)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`rounded-full p-2 ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to view details
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full bg-muted" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
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

        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full bg-muted" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="amount" fill="#1e3a8a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/customers/new"
              className="block rounded-lg border p-4 transition-colors hover:bg-accent/5"
            >
              <h3 className="font-semibold">Add New Customer</h3>
              <p className="text-sm text-muted-foreground">
                Register a new customer with KYC details
              </p>
            </a>
            <a
              href="/loans/new"
              className="block rounded-lg border p-4 transition-colors hover:bg-accent/5"
            >
              <h3 className="font-semibold">Create New Loan</h3>
              <p className="text-sm text-muted-foreground">
                Disburse a new loan to a customer
              </p>
            </a>
            <a
              href="/collections"
              className="block rounded-lg border p-4 transition-colors hover:bg-accent/5"
            >
              <h3 className="font-semibold">Collect EMI</h3>
              <p className="text-sm text-muted-foreground">
                Record EMI payment from customers
              </p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">System Name</p>
              <p className="text-sm text-muted-foreground">
                Digital Dreems Loan Management CRM
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Designed & Developed By</p>
              <p className="text-sm text-muted-foreground">
                Vais Engineering Pvt Ltd
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Version</p>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
