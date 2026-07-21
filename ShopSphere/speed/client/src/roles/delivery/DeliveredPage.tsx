import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, CheckCircle, Calendar } from "lucide-react";
import { DeliverySidebar } from "./DeliverySidebar";
import { useState } from "react";

interface DeliveredOrder {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  signature: string;
  notes: string;
}

const initialDelivered: DeliveredOrder[] = [
  { id: "D1001", orderId: "1003", customer: "Mike Johnson", address: "789 Oak St, Bangalore", deliveryDate: "Mar 15, 2025", deliveryTime: "10:30 AM", signature: "Mike Johnson", notes: "Left at doorstep" },
  { id: "D1002", orderId: "1006", customer: "Lisa Anderson", address: "345 Cedar St, Bangalore", deliveryDate: "Mar 14, 2025", deliveryTime: "2:15 PM", signature: "Lisa Anderson", notes: "Signed by neighbor" },
  { id: "D1003", orderId: "1007", customer: "David Wilson", address: "678 Maple St, Bangalore", deliveryDate: "Mar 14, 2025", deliveryTime: "4:45 PM", signature: "David Wilson", notes: "" },
  { id: "D1004", orderId: "1008", customer: "Jennifer Lee", address: "901 Birch St, Bangalore", deliveryDate: "Mar 13, 2025", deliveryTime: "11:20 AM", signature: "Jennifer Lee", notes: "Fragile items handled with care" },
];

const timeFilters = ["Today", "Yesterday", "This Week", "Last Week", "This Month"];

export default function DeliveredPage() {
  const [delivered, setDelivered] = useState<DeliveredOrder[]>(initialDelivered);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTime, setFilterTime] = useState("This Week");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<DeliveredOrder | null>(null);

  // Filter delivered orders based on search and time filter
  const filteredDelivered = delivered.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.orderId.includes(searchTerm);
    // In a real app, you would implement proper time filtering based on deliveryDate
    return matchesSearch;
  });

  const handleEditOrder = (order: DeliveredOrder) => {
    setEditingOrder(order);
    setIsDialogOpen(true);
  };

  const handleSaveOrder = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would save to the backend here
    setIsDialogOpen(false);
    setEditingOrder(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Delivery" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <DeliverySidebar activeSection="delivered" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Delivered</h1>
                <p className="text-muted-foreground">View completed deliveries</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search deliveries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 w-40"
                  />
                </div>
                <Select value={filterTime} onValueChange={setFilterTime}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeFilters.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Delivered Orders</CardTitle>
                <CardDescription>Completed deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Delivery Time</TableHead>
                      <TableHead>Signature</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDelivered.map(order => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                            <span className="font-medium">#{order.orderId}</span>
                          </div>
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="max-w-xs truncate" title={order.address}>
                          {order.address}
                        </TableCell>
                        <TableCell>{order.deliveryDate}</TableCell>
                        <TableCell>{order.deliveryTime}</TableCell>
                        <TableCell>{order.signature}</TableCell>
                        <TableCell className="max-w-xs truncate" title={order.notes}>
                          {order.notes}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}