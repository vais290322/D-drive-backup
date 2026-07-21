import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Info } from 'lucide-react';

export default function AdminOrders() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Orders Management</h1>
                <p className="text-muted-foreground">View and manage customer orders</p>
            </div>

            <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-blue-900">Orders are Managed Through Bookings</CardTitle>
                    </div>
                    <CardDescription className="text-blue-700">
                        All customer orders are tracked as bookings in the system
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-blue-800">
                        In the current system, hotel bookings serve as orders. All order management functionality
                        including payment tracking, status updates, and customer information is available through
                        the Bookings management page.
                    </p>

                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            What You Can Do in Bookings
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                View all customer orders (bookings)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                Track payment status (pending, paid, failed, refunded)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                Monitor booking status (pending, confirmed, cancelled, completed)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                View customer and hotel details
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                Filter and search orders
                            </li>
                        </ul>
                    </div>

                    <Button asChild>
                        <Link to="/admin/bookings">
                            Go to Bookings Management
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
