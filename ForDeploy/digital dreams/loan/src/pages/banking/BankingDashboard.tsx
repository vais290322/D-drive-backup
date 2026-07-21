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

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.total_customers,
      icon: Users,
      color: 'text-primary',
      link: '/banking/customers',
    },
    {
      title: 'Total Accounts',
      value: stats.total_accounts,
      icon: CreditCard,
      color: 'text-accent',
      link: '/banking/customers',
    },
    {
      title: 'Active Accounts',
      value: stats.active_accounts,
      icon: CreditCard,
      color: 'text-success',
      link: '/banking/customers',
    },
    {
      title: 'Total Balance',
      value: formatCurrency(stats.total_balance),
      icon: DollarSign,
      color: 'text-chart-3',
      link: '/banking/reports',
    },
    {
      title: 'Deposits Today',
      value: formatCurrency(stats.total_deposits_today),
      icon: TrendingUp,
      color: 'text-success',
      link: '/banking/reports',
    },
    {
      title: 'Withdrawals Today',
      value: formatCurrency(stats.total_withdrawals_today),
      icon: TrendingDown,
      color: 'text-destructive',
      link: '/banking/reports',
    },
    {
      title: 'Transactions Today',
      value: stats.total_transactions_today,
      icon: FileText,
      color: 'text-chart-4',
      link: '/banking/reports',
    },
    {
      title: 'Net Change Today',
      value: formatCurrency(stats.total_deposits_today - stats.total_withdrawals_today),
      icon: DollarSign,
      color:
        stats.total_deposits_today - stats.total_withdrawals_today >= 0
          ? 'text-success'
          : 'text-destructive',
      link: '/banking/reports',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <div className="mb-6">
          <h1 className="text-2xl xl:text-3xl font-bold text-foreground">Banking Dashboard</h1>
          <p className="text-muted-foreground mt-1">Loading statistics...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl xl:text-3xl font-bold text-foreground">Banking Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage customers, accounts, and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/banking/customers/new">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl xl:text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/banking/customers/new">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Customer
              </Button>
            </Link>
            <Link to="/banking/deposit">
              <Button variant="outline" className="w-full justify-start">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Make Deposit
              </Button>
            </Link>
            <Link to="/banking/withdraw">
              <Button variant="outline" className="w-full justify-start">
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                Make Withdrawal
              </Button>
            </Link>
            <Link to="/banking/statement">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Statement
              </Button>
            </Link>
            <Link to="/banking/reports">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your banking customers and their accounts. Add new customers, view details,
              and track account balances.
            </p>
            <Link to="/banking/customers">
              <Button variant="link" className="px-0">
                View All Customers →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
