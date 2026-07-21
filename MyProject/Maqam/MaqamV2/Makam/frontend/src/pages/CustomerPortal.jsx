import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Receipt, User, FileText, Shield } from 'lucide-react';
import { bookingsApi, ordersApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';

export default function CustomerPortal() {
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, ordersData] = await Promise.all([
        bookingsApi.getUserBookings(),
        ordersApi.getUserOrders(),
      ]);
      setBookings(bookingsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(orders);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {isAdmin && (
          <Card className="mb-6 border-primary bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Admin Account</p>
                    <p className="text-sm text-muted-foreground">You have administrator privileges</p>
                  </div>
                </div>
                <Button onClick={() => navigate('/admin')}>
                  <Shield className="h-4 w-4 mr-2" />
                  Go to Admin Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your bookings and account information</p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            {loading ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No bookings yet</p>
                </CardContent>
              </Card>
            ) : (
              bookings?.data?.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Booking #{booking.booking_reference}</CardTitle>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {new Date(booking.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Type:</strong> {booking.booking_type}</p>
                      <p><strong>Travelers:</strong> {booking.travelers_count}</p>
                      <p><strong>Total:</strong> ₹{booking.total_price.toLocaleString('en-IN')}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            ) : (
              orders?.data?.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {new Date(order.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Amount:</strong> ₹{(order.total_amount / 100).toLocaleString('en-IN')}</p>
                      {order.completed_at && (
                        <p><strong>Completed:</strong> {new Date(order.completed_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-muted-foreground">{profile?.username || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-muted-foreground">{profile?.email || user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                    {profile?.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                    {profile?.role || 'user'}
                  </Badge>
                </div>
                {isAdmin && (
                  <div className="pt-4 border-t">
                    <Button onClick={() => navigate('/admin')} className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Access Admin Panel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

