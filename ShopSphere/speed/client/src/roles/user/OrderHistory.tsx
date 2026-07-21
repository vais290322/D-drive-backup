import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Search,
  Filter,
  Eye
} from "lucide-react";
import { useState } from "react";
import { UserSidebar } from "./UserSidebar";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
  paymentMethod: string;
}

export default function OrderHistory() {
  const [orders] = useState<Order[]>([
    {
      id: "1001",
      date: "Mar 15, 2025",
      status: "Delivered",
      total: 5999,
      items: 3,
      paymentMethod: "Cash on Delivery"
    },
    {
      id: "1002",
      date: "Mar 10, 2025",
      status: "Processing",
      total: 2499,
      items: 1,
      paymentMethod: "Online"
    },
    {
      id: "1003",
      date: "Mar 5, 2025",
      status: "Shipped",
      total: 7999,
      items: 2,
      paymentMethod: "Cash on Delivery"
    },
    {
      id: "1004",
      date: "Feb 28, 2025",
      status: "Delivered",
      total: 3499,
      items: 2,
      paymentMethod: "Online"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Processing": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-gray-100 text-gray-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(searchTerm) || 
                         order.date.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={3} isLoggedIn={true} userName="John Doe" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <UserSidebar activeSection="orders" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Order History</h1>
                <p className="text-muted-foreground">View and manage your past orders</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-8 pr-4 py-2 border rounded-md text-sm w-40"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="All">All Statuses</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Order #{order.id}
                          </CardTitle>
                          <CardDescription>
                            Placed on {order.date} • {order.items} {order.items === 1 ? 'item' : 'items'}
                          </CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="font-medium">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Payment: {order.paymentMethod}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {order.status === "Delivered" && (
                            <Button size="sm">Reorder</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button>Continue Shopping</Button>
                </CardContent>
              </Card>
            )}
            
            {filteredOrders.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button variant="outline" disabled>Previous</Button>
                  <Button variant="outline" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}