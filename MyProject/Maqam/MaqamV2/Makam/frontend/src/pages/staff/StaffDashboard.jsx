import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Users, MessageSquare, CheckCircle } from 'lucide-react';

const StaffDashboard = () => {
  const { profile } = useAuth();

  const stats = [
    {
      title: 'Pending Tasks',
      value: '0',
      icon,
      description: 'Tasks to complete'
    },
    {
      title: 'Active Customers',
      value: '0',
      icon,
      description: 'Customers assigned'
    },
    {
      title: 'Support Tickets',
      value: '0',
      icon,
      description: 'Open tickets'
    },
    {
      title: 'Completed Today',
      value: '0',
      icon,
      description: 'Tasks completed'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || profile?.username}!</h1>
        <p className="text-muted-foreground mt-2">
          Manage your tasks and customer support from this dashboard
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
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No tasks assigned yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No support tickets to display
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
              <ClipboardList className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">View Tasks</h3>
              <p className="text-sm text-muted-foreground">Check assigned tasks</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <MessageSquare className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Support Tickets</h3>
              <p className="text-sm text-muted-foreground">Respond to customer queries</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Users className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Customer List</h3>
              <p className="text-sm text-muted-foreground">View customer information</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDashboard;

