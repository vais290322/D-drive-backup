import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, TrendingUp, CheckSquare, DollarSign, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCRMStats } from '@/db/crmApi';
import { formatCurrency } from '@/lib/currency';

export default function CRMDashboard() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalContacts: 0,
    totalDeals: 0,
    activeDeals: 0,
    wonDeals: 0,
    totalRevenue: 0,
    pipelineValue: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getCRMStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading CRM stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Companies',
      value: stats.totalCompanies,
      icon: Building2,
      color: 'text-primary',
      link: '/crm/companies',
    },
    {
      title: 'Total Contacts',
      value: stats.totalContacts,
      icon: Users,
      color: 'text-accent',
      link: '/crm/contacts',
    },
    {
      title: 'Active Deals',
      value: stats.activeDeals,
      icon: TrendingUp,
      color: 'text-chart-3',
      link: '/crm/deals',
    },
    {
      title: 'Won Deals',
      value: stats.wonDeals,
      icon: Target,
      color: 'text-success',
      link: '/crm/deals',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-success',
      link: '/crm/deals',
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(stats.pipelineValue),
      icon: TrendingUp,
      color: 'text-chart-4',
      link: '/crm/deals',
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: CheckSquare,
      color: 'text-chart-5',
      link: '/crm/tasks',
    },
    {
      title: 'Total Deals',
      value: stats.totalDeals,
      icon: Target,
      color: 'text-primary',
      link: '/crm/deals',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <div className="mb-6">
          <h1 className="text-2xl xl:text-3xl font-bold text-foreground">CRM Dashboard</h1>
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
          <h1 className="text-2xl xl:text-3xl font-bold text-foreground">CRM Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your customer relationships and sales pipeline</p>
        </div>
        <div className="flex gap-2">
          <Link to="/crm/contacts/new">
            <Button>Add Contact</Button>
          </Link>
          <Link to="/crm/deals/new">
            <Button variant="outline">New Deal</Button>
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
            <Link to="/crm/contacts/new">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Add New Contact
              </Button>
            </Link>
            <Link to="/crm/companies/new">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="mr-2 h-4 w-4" />
                Add New Company
              </Button>
            </Link>
            <Link to="/crm/deals/new">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Create New Deal
              </Button>
            </Link>
            <Link to="/crm/tasks">
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="mr-2 h-4 w-4" />
                View All Tasks
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your recent interactions, deals, and tasks here.
            </p>
            <Link to="/crm/activities">
              <Button variant="link" className="px-0 mt-2">
                View All Activities →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
