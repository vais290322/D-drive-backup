import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel, Calendar, Users, DollarSign } from 'lucide-react';

const HotelierDashboard = () => {
  const { profile } = useAuth();

  const stats = [
    {
      title: 'Total Hotels',
      value: '0',
      icon: Hotel,
      description: 'Properties listed'
    },
    {
      title: 'Active Bookings',
      value: '0',
      icon: Calendar,
      description: 'Current reservations'
    },
    {
      title: 'Total Guests',
      value: '0',
      icon: Users,
      description: 'All time guests'
    },
    {
      title: 'Revenue',
      value: '₹0',
      icon: DollarSign,
      description: 'This month'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || profile?.username}!</h1>
        <p className="text-muted-foreground mt-2">
          Manage your hotels and bookings from this dashboard
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No recent bookings to display
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No data available
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Hotel className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Add New Hotel</h3>
              <p className="text-sm text-muted-foreground">List a new property</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Manage Bookings</h3>
              <p className="text-sm text-muted-foreground">View and update reservations</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Users className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Guest Management</h3>
              <p className="text-sm text-muted-foreground">Manage guest information</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelierDashboard;
