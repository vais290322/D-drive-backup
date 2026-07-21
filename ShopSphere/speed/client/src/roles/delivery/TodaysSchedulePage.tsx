import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Clock, CheckCircle, XCircle } from "lucide-react";
import { DeliverySidebar } from "./DeliverySidebar";
import { useState } from "react";

interface ScheduledDelivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  timeSlot: string;
  status: string;
  notes: string;
}

const initialSchedule: ScheduledDelivery[] = [
  { id: "S1001", orderId: "1001", customer: "John Doe", address: "123 Main St, Bangalore", timeSlot: "9:00 AM - 11:00 AM", status: "Pending", notes: "Call before delivery" },
  { id: "S1002", orderId: "1002", customer: "Sarah Smith", address: "456 Park Ave, Bangalore", timeSlot: "11:00 AM - 1:00 PM", status: "In Transit", notes: "Fragile items" },
  { id: "S1003", orderId: "1003", customer: "Mike Johnson", address: "789 Oak St, Bangalore", timeSlot: "1:00 PM - 3:00 PM", status: "Delivered", notes: "" },
  { id: "S1004", orderId: "1004", customer: "Emma Wilson", address: "321 Pine St, Bangalore", timeSlot: "3:00 PM - 5:00 PM", status: "Pending", notes: "Gate code: 1234" },
];

const statuses = ["Pending", "In Transit", "Delivered", "Failed"];

export default function TodaysSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduledDelivery[]>(initialSchedule);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<ScheduledDelivery | null>(null);

  // Filter schedule based on search and status filter
  const filteredSchedule = schedule.filter(delivery => {
    const matchesSearch = delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         delivery.orderId.includes(searchTerm);
    const matchesStatus = filterStatus === "All" || delivery.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditDelivery = (delivery: ScheduledDelivery) => {
    setEditingDelivery(delivery);
    setIsDialogOpen(true);
  };

  const handleSaveDelivery = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would save to the backend here
    setIsDialogOpen(false);
    setEditingDelivery(null);
  };

  const handleMarkDelivered = (id: string) => {
    setSchedule(schedule.map(delivery => 
      delivery.id === id ? { ...delivery, status: "Delivered" } : delivery
    ));
  };

  const handleMarkFailed = (id: string) => {
    setSchedule(schedule.map(delivery => 
      delivery.id === id ? { ...delivery, status: "Failed" } : delivery
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "In Transit": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Delivery" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <DeliverySidebar activeSection="schedule" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Today's Schedule</h1>
                <p className="text-muted-foreground">View and manage your delivery schedule for today</p>
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
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Deliveries</CardTitle>
                <CardDescription>Today's delivery schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead className="text-right">Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedule.map(delivery => (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <Clock className="h-4 w-4" />
                            </div>
                            <span className="font-medium">#{delivery.orderId}</span>
                          </div>
                        </TableCell>
                        <TableCell>{delivery.customer}</TableCell>
                        <TableCell className="max-w-xs truncate" title={delivery.address}>
                          {delivery.address}
                        </TableCell>
                        <TableCell>{delivery.timeSlot}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}>
                            {delivery.status}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={delivery.notes}>
                          {delivery.notes}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditDelivery(delivery)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {delivery.status === "Pending" && (
                            <div className="flex justify-end gap-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleMarkDelivered(delivery.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleMarkFailed(delivery.id)}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          )}
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