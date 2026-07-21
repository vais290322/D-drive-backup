import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plane, Hotel, FileText } from 'lucide-react';

const CustomerDashboard = () => {
  const { profile } = useAuth();

  const stats = [
    {
      title: 'Total Bookings',
      value: '0',
      icon: Package,
      description: 'All time bookings'
    },
    {
      title: 'Flight Bookings',
      value: '0',
      icon: Plane,
      description: 'Active flights'
    },
    {
      title: 'Hotel Bookings',
      value: '0',
      icon: Hotel,
      description: 'Active hotels'
    },
    {
      title: 'Total Orders',
      value: '0',
      icon: FileText,
      description: 'Completed orders'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || profile?.username}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your travel bookings and activities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No recent activity to display
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Plane className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Book a Flight</h3>
              <p className="text-sm text-muted-foreground">Search and book flights</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Hotel className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Book a Hotel</h3>
              <p className="text-sm text-muted-foreground">Find hotels near holy sites</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Package className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Browse Packages</h3>
              <p className="text-sm text-muted-foreground">Hajj & Umrah packages</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
