import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Package, Clock, CheckCircle } from "lucide-react";
import { DeliverySidebar } from "./DeliverySidebar";
import { useState } from "react";

interface PendingPickup {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  pickupDate: string;
  pickupTime: string;
  status: string;
  notes: string;
}

const initialPending: PendingPickup[] = [
  { id: "PP1001", orderId: "1009", customer: "Thomas Clark", address: "135 Oak St, Bangalore", pickupDate: "Mar 17, 2025", pickupTime: "10:00 AM - 12:00 PM", status: "Scheduled", notes: "Fragile items" },
  { id: "PP1002", orderId: "1010", customer: "Amanda Roberts", address: "246 Pine St, Bangalore", pickupDate: "Mar 17, 2025", pickupTime: "2:00 PM - 4:00 PM", status: "Scheduled", notes: "Call before pickup" },
  { id: "PP1003", orderId: "1011", customer: "Christopher Hall", address: "357 Elm St, Bangalore", pickupDate: "Mar 18, 2025", pickupTime: "9:00 AM - 11:00 AM", status: "Scheduled", notes: "" },
  { id: "PP1004", orderId: "1012", customer: "Michelle Young", address: "468 Maple St, Bangalore", pickupDate: "Mar 18, 2025", pickupTime: "3:00 PM - 5:00 PM", status: "Rescheduled", notes: "Previous attempt failed" },
];

const statuses = ["Scheduled", "Rescheduled", "Completed", "Cancelled"];

export default function PendingPickupPage() {
  const [pending, setPending] = useState<PendingPickup[]>(initialPending);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPickup, setEditingPickup] = useState<PendingPickup | null>(null);

  // Filter pending pickups based on search and status filter
  const filteredPending = pending.filter(pickup => {
    const matchesSearch = pickup.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pickup.orderId.includes(searchTerm);
    const matchesStatus = filterStatus === "All" || pickup.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditPickup = (pickup: PendingPickup) => {
    setEditingPickup(pickup);
    setIsDialogOpen(true);
  };

  const handleSavePickup = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would save to the backend here
    setIsDialogOpen(false);
    setEditingPickup(null);
  };

  const handleMarkCompleted = (id: string) => {
    setPending(pending.map(pickup => 
      pickup.id === id ? { ...pickup, status: "Completed" } : pickup
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Scheduled": return "bg-blue-100 text-blue-800";
      case "Rescheduled": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Delivery" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <DeliverySidebar activeSection="pending" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Pending Pickup</h1>
                <p className="text-muted-foreground">View scheduled pickups</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search pickups..."
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
                <CardTitle>Pending Pickups</CardTitle>
                <CardDescription>Scheduled item pickups</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Pickup Date</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead className="text-right">Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPending.map(pickup => (
                      <TableRow key={pickup.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <Package className="h-4 w-4" />
                            </div>
                            <span className="font-medium">#{pickup.orderId}</span>
                          </div>
                        </TableCell>
                        <TableCell>{pickup.customer}</TableCell>
                        <TableCell className="max-w-xs truncate" title={pickup.address}>
                          {pickup.address}
                        </TableCell>
                        <TableCell>{pickup.pickupDate}</TableCell>
                        <TableCell>{pickup.pickupTime}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(pickup.status)}`}>
                            {pickup.status}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={pickup.notes}>
                          {pickup.notes}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditPickup(pickup)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          {pickup.status !== "Completed" && pickup.status !== "Cancelled" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8"
                              onClick={() => handleMarkCompleted(pickup.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                              Complete
                            </Button>
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