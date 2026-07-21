import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Eye, Truck, CreditCard } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  status: string;
  total: number;
  date: string;
  payment: string;
  items: number;
}

const initialOrders: Order[] = [
  { id: "1001", customer: "Alice Johnson", status: "Delivered", total: 5999, date: "2025-03-15", payment: "COD", items: 3 },
  { id: "1002", customer: "Bob Smith", status: "Processing", total: 2499, date: "2025-03-16", payment: "Online", items: 1 },
  { id: "1003", customer: "Carol Davis", status: "Shipped", total: 7999, date: "2025-03-16", payment: "COD", items: 2 },
  { id: "1004", customer: "David Wilson", status: "Pending", total: 3499, date: "2025-03-17", payment: "Online", items: 1 },
];

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders based on search and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(searchTerm) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order Management</span>
          <div className="flex gap-2">
            <div className="relative">
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 w-40"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        <CardDescription>Manage customer orders and shipments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>₹{order.total.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {order.payment === "COD" ? (
                      <Truck className="h-4 w-4" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    <span>{order.payment}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Select onValueChange={(value) => handleUpdateStatus(order.id, value)}>
                      <SelectTrigger className="h-8 w-24">
                        <SelectValue placeholder="Update" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions
                          .filter(status => status !== order.status)
                          .map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Payment Method</Label>
                  <p className="font-medium">{selectedOrder.payment}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Items</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span>Power Drill</span>
                    <span>₹4,999</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Safety Helmet</span>
                    <span>₹899</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹5,898</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Shipping Address</Label>
                <p className="font-medium mt-1">
                  123 Main Street, Bangalore, Karnataka 560001
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}