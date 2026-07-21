import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Navigation, MapPin, CheckCircle } from "lucide-react";
import { DeliverySidebar } from "./DeliverySidebar";
import { useState } from "react";

interface InTransitDelivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  status: string;
  estimatedDelivery: string;
  currentLocation: string;
  progress: number;
}

const initialInTransit: InTransitDelivery[] = [
  { id: "IT1001", orderId: "1001", customer: "John Doe", address: "123 Main St, Bangalore", status: "Out for Delivery", estimatedDelivery: "2:30 PM", currentLocation: "Near MG Road", progress: 75 },
  { id: "IT1002", orderId: "1002", customer: "Sarah Smith", address: "456 Park Ave, Bangalore", status: "In Transit", estimatedDelivery: "4:00 PM", currentLocation: "On NH7", progress: 40 },
  { id: "IT1003", orderId: "1005", customer: "Robert Brown", address: "567 Elm St, Bangalore", status: "Picked Up", estimatedDelivery: "5:30 PM", currentLocation: "Warehouse", progress: 10 },
];

const statuses = ["Picked Up", "In Transit", "Out for Delivery"];

export default function InTransitPage() {
  const [inTransit, setInTransit] = useState<InTransitDelivery[]>(initialInTransit);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<InTransitDelivery | null>(null);

  // Filter in-transit deliveries based on search and status filter
  const filteredInTransit = inTransit.filter(delivery => {
    const matchesSearch = delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         delivery.orderId.includes(searchTerm);
    const matchesStatus = filterStatus === "All" || delivery.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditDelivery = (delivery: InTransitDelivery) => {
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
    setInTransit(inTransit.map(delivery => 
      delivery.id === id ? { ...delivery, status: "Delivered" } : delivery
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Out for Delivery": return "bg-blue-100 text-blue-800";
      case "In Transit": return "bg-purple-100 text-purple-800";
      case "Picked Up": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Delivery" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <DeliverySidebar activeSection="in-transit" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">In Transit</h1>
                <p className="text-muted-foreground">Track deliveries currently in transit</p>
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
                <CardTitle>In Transit Deliveries</CardTitle>
                <CardDescription>Deliveries currently being transported</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Est. Delivery</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead className="text-right">Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInTransit.map(delivery => (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <Navigation className="h-4 w-4" />
                            </div>
                            <span className="font-medium">#{delivery.orderId}</span>
                          </div>
                        </TableCell>
                        <TableCell>{delivery.customer}</TableCell>
                        <TableCell className="max-w-xs truncate" title={delivery.address}>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{delivery.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}>
                            {delivery.status}
                          </span>
                        </TableCell>
                        <TableCell>{delivery.estimatedDelivery}</TableCell>
                        <TableCell className="max-w-xs truncate" title={delivery.currentLocation}>
                          {delivery.currentLocation}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${delivery.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs w-10">{delivery.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditDelivery(delivery)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          {delivery.status !== "Delivered" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8"
                              onClick={() => handleMarkDelivered(delivery.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                              Delivered
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