import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Eye, Truck, MapPin } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { useState } from "react";

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  status: string;
  assignedTo: string;
  estimatedDelivery: string;
}

const initialDeliveries: Delivery[] = [
  {
    id: "D1001",
    orderId: "1001",
    customer: "John Doe",
    address: "123 Main St, Bangalore",
    status: "In Transit",
    assignedTo: "Raj Kumar",
    estimatedDelivery: "Mar 16, 2025"
  },
  {
    id: "D1002",
    orderId: "1002",
    customer: "Sarah Smith",
    address: "456 Park Ave, Bangalore",
    status: "Pending",
    assignedTo: "Not Assigned",
    estimatedDelivery: "Mar 12, 2025"
  },
  {
    id: "D1003",
    orderId: "1003",
    customer: "Mike Johnson",
    address: "789 Oak St, Bangalore",
    status: "Delivered",
    assignedTo: "Priya Sharma",
    estimatedDelivery: "Mar 6, 2025"
  },
  {
    id: "D1004",
    orderId: "1004",
    customer: "Emma Wilson",
    address: "321 Pine St, Bangalore",
    status: "Scheduled",
    assignedTo: "Amit Patel",
    estimatedDelivery: "Mar 18, 2025"
  }
];

const statuses = ["Pending", "Scheduled", "In Transit", "Delivered", "Cancelled"];
const deliveryPersons = ["Raj Kumar", "Priya Sharma", "Amit Patel", "Not Assigned"];

export default function DeliveryManagementPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "In Transit": return "bg-blue-100 text-blue-800";
      case "Scheduled": return "bg-purple-100 text-purple-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter deliveries based on search and status filter
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.id.includes(searchTerm) || 
                         delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderId.includes(searchTerm);
    const matchesStatus = filterStatus === "All" || delivery.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditDelivery = (delivery: Delivery) => {
    setEditingDelivery(delivery);
    setIsDialogOpen(true);
  };

  const handleSaveDelivery = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would save to the backend here
    setIsDialogOpen(false);
    setEditingDelivery(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Admin" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar activeSection="delivery" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Delivery Management</h1>
                <p className="text-muted-foreground">Manage and track deliveries</p>
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
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Deliveries</CardTitle>
                <CardDescription>View and manage all deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Est. Delivery</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliveries.map(delivery => (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <Truck className="h-4 w-4" />
                            </div>
                            <span>{delivery.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>#{delivery.orderId}</TableCell>
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
                        <TableCell>{delivery.assignedTo}</TableCell>
                        <TableCell>{delivery.estimatedDelivery}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
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