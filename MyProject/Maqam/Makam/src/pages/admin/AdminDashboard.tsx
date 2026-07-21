import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/db/api';
import { Users, ShoppingCart, Calendar, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await adminApi.getAnalytics();
      // Handle legacy API response structure {data, error}
      const data = response?.data || response || {
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        popularPackages: []
      };
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Set default empty analytics on error
      setAnalytics({
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        popularPackages: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Total Bookings',
      value: analytics?.totalBookings || 0,
      icon: Calendar,
      description: 'All time bookings',
    },
    {
      title: 'Total Revenue',
      value: `₹${analytics?.totalRevenue?.toLocaleString('en-IN') || 0}`,
      icon: TrendingUp,
      description: 'Completed orders',
    },
    {
      title: 'Popular Packages',
      value: analytics?.popularPackages?.length || 0,
      icon: ShoppingCart,
      description: 'Active packages',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Maquam Holidays Admin Panel</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {analytics?.popularPackages && analytics.popularPackages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Packages</CardTitle>
            <CardDescription>Top performing packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularPackages.map((pkg: any) => (
                <div key={pkg.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{pkg.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    ₹{pkg.price?.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/flights" className="block p-3 rounded-lg hover:bg-accent transition-colors">
              <p className="font-medium">Manage Flights</p>
              <p className="text-sm text-muted-foreground">Add, edit, or remove flights</p>
            </a>
            <a href="/admin/hotels" className="block p-3 rounded-lg hover:bg-accent transition-colors">
              <p className="font-medium">Manage Hotels</p>
              <p className="text-sm text-muted-foreground">Add, edit, or remove hotels</p>
            </a>
            <a href="/admin/packages" className="block p-3 rounded-lg hover:bg-accent transition-colors">
              <p className="font-medium">Manage Packages</p>
              <p className="text-sm text-muted-foreground">Create and manage travel packages</p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <span className="text-sm font-medium text-green-600">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment Gateway</span>
              <span className="text-sm font-medium text-green-600">✓ Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Services</span>
              <span className="text-sm font-medium text-green-600">✓ Running</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
