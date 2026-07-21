import { useEffect, useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { bookingsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Calendar, User, Hotel, DollarSign, Eye } from 'lucide-react';



export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPayment, setFilterPayment] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { toast } = useToast();

    useEffect(() => {
        loadBookings();
    }, [currentPage, filterStatus, filterPayment]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 20,
            };

            if (filterStatus !== 'all') params.status = filterStatus;
            if (filterPayment !== 'all') params.payment_status = filterPayment;

            const response = await bookingsAPI.getAllBookings(params);
            setBookings(response.bookings || []);

            if (response.pagination) {
                setTotalPages(response.pagination.pages || 1);
            }
        } catch (error) {
            console.error('Failed to load bookings:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to load bookings',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const variants= {
            pending: { variant: 'secondary' },
            confirmed: { variant: 'default', className: 'bg-green-600' },
            cancelled: { variant: 'destructive' },
            completed: { variant: 'default', className: 'bg-blue-600' },
        };

        return variants[status] || { variant: 'secondary' };
    };

    const getPaymentBadge = (status) => {
        const variants= {
            pending: { variant: 'secondary' },
            paid: { variant: 'default', className: 'bg-green-600' },
            failed: { variant: 'destructive' },
            refunded: { variant: 'default', className: 'bg-orange-600' },
        };

        return variants[status] || { variant: 'secondary' };
    };

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        pending: bookings.filter((b) => b.status === 'pending').length,
        paid: bookings.filter((b) => b.payment_status === 'paid').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Bookings Management</h1>
                <p className="text-muted-foreground">View and manage all hotel bookings</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Bookings</CardDescription>
                        <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Confirmed</CardDescription>
                        <CardTitle className="text-3xl text-green-600">{stats.confirmed}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Pending</CardDescription>
                        <CardTitle className="text-3xl text-orange-600">{stats.pending}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Paid</CardDescription>
                        <CardTitle className="text-3xl text-blue-600">{stats.paid}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Booking Status</label>
                            <select
                                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Payment Status</label>
                            <select
                                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                value={filterPayment}
                                onChange={(e) => {
                                    setFilterPayment(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Payment Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings List */}
            <Card>
                <CardHeader>
                    <CardTitle>Bookings</CardTitle>
                    <CardDescription>
                        Page {currentPage} of {totalPages}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No bookings found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge {...getStatusBadge(booking.status)}>
                                                    {booking.status.toUpperCase()}
                                                </Badge>
                                                <Badge {...getPaymentBadge(booking.payment_status)}>
                                                    {booking.payment_status.toUpperCase()}
                                                </Badge>
                                            </div>

                                            <div className="grid gap-2 md:grid-cols-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{booking.guest_name}</span>
                                                    <span className="text-muted-foreground">({booking.guest_email})</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm">
                                                    <Hotel className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        {typeof booking.hotel_id === 'object' && booking.hotel_id?.name
                                                            ? booking.hotel_id.name
                                                            : 'Hotel'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        {new Date(booking.check_in_date).toLocaleDateString()} -{' '}
                                                        {new Date(booking.check_out_date).toLocaleDateString()}
                                                    </span>
                                                    <span className="font-medium">({booking.nights} nights)</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-semibold text-foreground">
                                                        {booking.currency} {booking.total_amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                Booked on {new Date(booking.created_at).toLocaleString()} • {booking.guests}{' '}
                                                guest{booking.guests > 1 ? 's' : ''}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}



