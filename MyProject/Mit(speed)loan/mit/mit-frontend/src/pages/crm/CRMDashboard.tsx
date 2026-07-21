import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  TrendingUp,
  CheckSquare,
  DollarSign,
  Target,
  Activity,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
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

  const winRate = stats.totalDeals > 0 ? (stats.wonDeals / stats.totalDeals * 100) : 0;
  const avgDealValue = stats.wonDeals > 0 ? stats.totalRevenue / stats.wonDeals : 0;

  const primaryKPIs = [
    {
      title: 'Total Companies',
      value: stats.totalCompanies,
      icon: Building2,
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      link: '/crm/companies',
      trend: '+15%',
      trendUp: true,
    },
    {
      title: 'Total Contacts',
      value: stats.totalContacts,
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      link: '/crm/contacts',
      trend: '+22%',
      trendUp: true,
    },
    {
      title: 'Active Deals',
      value: stats.activeDeals,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      link: '/crm/deals',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Won Deals',
      value: stats.wonDeals,
      icon: Target,
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
      link: '/crm/deals',
      trend: '+12%',
      trendUp: true,
    },
  ];

  const revenueKPIs = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      gradient: 'from-green-500 to-teal-500',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
      link: '/crm/deals',
      subtitle: 'From won deals',
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(stats.pipelineValue),
      icon: Briefcase,
      gradient: 'from-indigo-500 to-purple-500',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
      link: '/crm/deals',
      subtitle: 'Active opportunities',
    },
    {
      title: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: Target,
      gradient: 'from-pink-500 to-rose-500',
      iconBg: 'bg-pink-500/10',
      iconColor: 'text-pink-500',
      link: '/crm/deals',
      subtitle: 'Deal success rate',
    },
    {
      title: 'Avg Deal Value',
      value: formatCurrency(avgDealValue),
      icon: DollarSign,
      gradient: 'from-violet-500 to-purple-500',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      link: '/crm/deals',
      subtitle: 'Per won deal',
    },
  ];

  const performanceKPIs = [
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: CheckSquare,
      gradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
      link: '/crm/tasks',
      subtitle: 'Requires attention',
    },
    {
      title: 'Total Deals',
      value: stats.totalDeals,
      icon: Activity,
      gradient: 'from-cyan-500 to-blue-500',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-500',
      link: '/crm/deals',
      subtitle: 'All time',
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
            CRM Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Customer relationships and sales pipeline overview
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/crm/contacts/new">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Users className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </Link>
          <Link to="/crm/deals/new">
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              New Deal
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPIs */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Pipeline Overview
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {primaryKPIs.map((kpi, index) => (
            <KPICard key={`primary-${index}`} kpi={kpi} index={index} />
          ))}
        </div>
      </div>

      {/* Revenue KPIs */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Revenue Metrics
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {revenueKPIs.map((kpi, index) => (
            <KPICard key={`revenue-${index}`} kpi={kpi} index={index} />
          ))}
        </div>
      </div>

      {/* Performance KPIs */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Performance
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {performanceKPIs.map((kpi, index) => (
            <KPICard key={`performance-${index}`} kpi={kpi} index={index} />
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
          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/crm/contacts/new">
              <div className="group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/50">
                <Users className="h-8 w-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-1">Add Contact</h3>
                <p className="text-sm text-muted-foreground">
                  Create new contact record
                </p>
              </div>
            </Link>
            <Link to="/crm/deals/new">
              <div className="group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:border-green-500/50">
                <TrendingUp className="h-8 w-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-1">Create Deal</h3>
                <p className="text-sm text-muted-foreground">
                  Start new sales opportunity
                </p>
              </div>
            </Link>
            <Link to="/crm/tasks">
              <div className="group block rounded-xl border border-border/50 p-6 transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:border-orange-500/50">
                <CheckSquare className="h-8 w-8 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-1">View Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Manage pending tasks
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

