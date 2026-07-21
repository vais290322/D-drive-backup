import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  UserPlus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity,
  Wallet,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBankingDashboardStats } from '@/db/bankingApi';
import { formatCurrency } from '@/lib/currency';
import type { BankingDashboardStats } from '@/types/types';

export default function BankingDashboard() {
  const [stats, setStats] = useState<BankingDashboardStats>({
    total_customers: 0,
    total_accounts: 0,
    active_accounts: 0,
    total_deposits_today: 0,
    total_withdrawals_today: 0,
    total_balance: 0,
    total_transactions_today: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getBankingDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading banking stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const netChange = stats.total_deposits_today - stats.total_withdrawals_today;
  const avgAccountBalance = stats.total_accounts > 0 ? stats.total_balance / stats.total_accounts : 0;

  const primaryKPIs = [
    {
      title: 'Total Customers',
      value: stats.total_customers,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      link: '/banking/customers',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Active Accounts',
      value: stats.active_accounts,
      icon: CreditCard,
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
      link: '/banking/customers',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Total Balance',
      value: formatCurrency(stats.total_balance),
      icon: Wallet,
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      link: '/banking/reports',
      trend: '+18%',
      trendUp: true,
    },
    {
      title: 'Transactions Today',
      value: stats.total_transactions_today,
      icon: Activity,
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      link: '/banking/reports',
      trend: '+5%',
      trendUp: true,
    },
  ];

  const financialKPIs = [
    {
      title: 'Deposits Today',
      value: formatCurrency(stats.total_deposits_today),
      icon: TrendingUp,
      gradient: 'from-green-500 to-teal-500',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
      link: '/banking/deposit',
      subtitle: 'Money in',
    },
    {
      title: 'Withdrawals Today',
      value: formatCurrency(stats.total_withdrawals_today),
      icon: TrendingDown,
      gradient: 'from-red-500 to-rose-500',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500',
      link: '/banking/withdraw',
      subtitle: 'Money out',
    },
    {
      title: 'Net Change Today',
      value: formatCurrency(netChange),
      icon: DollarSign,
      gradient: netChange >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500',
      iconBg: netChange >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
      iconColor: netChange >= 0 ? 'text-green-500' : 'text-red-500',
      link: '/banking/reports',
      subtitle: netChange >= 0 ? 'Surplus' : 'Deficit',
    },
    {
      title: 'Avg Account Balance',
      value: formatCurrency(avgAccountBalance),
      icon: Target,
      gradient: 'from-indigo-500 to-purple-500',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      link: '/banking/reports',
      subtitle: 'Per account',
    },
  ];

  const KPICard = ({ kpi, index }: { kpi: any; index: number }) => {
    const Icon = kpi.icon;
    return (
      <Link to={kpi.link}>
        <Card
          className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border-0 bg-gradient-to-br ${kpi.gradient} p-[1px]`}
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
              <div className={`text-3xl font-bold bg-gradient-to-r ${kpi.gradient} bg-clip-text text-transparent`}>
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
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8 p-6 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
        <div className="space-y-2">
          <div className="h-10 bg-muted rounded w-64 animate-pulse" />
          <div className="h-6 bg-muted rounded w-96 animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="border-0">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-32 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Banking Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage customers, accounts, and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/banking/customers/new">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPIs */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Account Overview
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {primaryKPIs.map((kpi, index) => (
            <KPICard key={`primary-${index}`} kpi={kpi} index={index} />
          ))}
        </div>
      </div>

      {/* Financial KPIs */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Today's Activity
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {financialKPIs.map((kpi, index) => (
            <KPICard key={`financial-${index}`} kpi={kpi} index={index} />
          ))}
        </div>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/banking/customers/new">
              <div className="group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:border-blue-500/50">
                <UserPlus className="h-8 w-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-1">Add Customer</h3>
                <p className="text-sm text-muted-foreground">
                  Register new banking customer
                </p>
              </div>
            </Link>
            <Link to="/banking/deposit">
              <div className="group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:border-green-500/50">
                <ArrowDownToLine className="h-8 w-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-1">Make Deposit</h3>
                <p className="text-sm text-muted-foreground">
                  Process customer deposit
                </p>
              </div>
            </Link>
            <Link to="/banking/withdraw">
              <div className="group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:border-orange-500/50">
                <ArrowUpFromLine className="h-8 w-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-1">Withdrawal</h3>
                <p className="text-sm text-muted-foreground">
                  Process customer withdrawal
                </p>
              </div>
            </Link>
            <Link to="/banking/reports">
              <div className="group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/50">
                <FileText className="h-8 w-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-1">View Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Banking analytics & reports
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

