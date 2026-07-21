import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Plus, MapPin, Route } from "lucide-react";
import { DeliverySidebar } from "./DeliverySidebar";
import { useState } from "react";

interface DeliveryRoute {
  id: string;
  name: string;
  area: string;
  distance: number;
  estimatedTime: string;
  assignedTo: string;
  status: string;
}

const initialRoutes: DeliveryRoute[] = [
  { id: "R1001", name: "North Bangalore", area: "North Bangalore", distance: 15.5, estimatedTime: "2 hours", assignedTo: "Raj Kumar", status: "Active" },
  { id: "R1002", name: "South Bangalore", area: "South Bangalore", distance: 12.3, estimatedTime: "1.5 hours", assignedTo: "Priya Sharma", status: "Active" },
  { id: "R1003", name: "East Bangalore", area: "East Bangalore", distance: 18.7, estimatedTime: "2.5 hours", assignedTo: "Amit Patel", status: "Inactive" },
  { id: "R1004", name: "West Bangalore", area: "West Bangalore", distance: 14.2, estimatedTime: "2 hours", assignedTo: "Not Assigned", status: "Active" },
];

const areas = ["North Bangalore", "South Bangalore", "East Bangalore", "West Bangalore"];
const statuses = ["Active", "Inactive"];

export default function DeliveryRoutesPage() {
  const [routes, setRoutes] = useState<DeliveryRoute[]>(initialRoutes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<DeliveryRoute | null>(null);

  // Filter routes based on search and filters
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         route.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea === "All" || route.area === filterArea;
    const matchesStatus = filterStatus === "All" || route.status === filterStatus;
    return matchesSearch && matchesArea && matchesStatus;
  });

  const handleEditRoute = (route: DeliveryRoute) => {
    setEditingRoute(route);
    setIsDialogOpen(true);
  };

  const handleSaveRoute = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would save to the backend here
    setIsDialogOpen(false);
    setEditingRoute(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Delivery" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <DeliverySidebar activeSection="routes" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Delivery Routes</h1>
                <p className="text-muted-foreground">Manage and optimize delivery routes</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search routes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 w-40"
                  />
                </div>
                <Select value={filterArea} onValueChange={setFilterArea}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter by area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Areas</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingRoute(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Route
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingRoute ? "Edit Route" : "Add New Route"}</DialogTitle>
                      <DialogDescription>
                        {editingRoute 
                          ? "Make changes to route details here." 
                          : "Enter details for the new route here."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveRoute}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Route Name
                          </Label>
                          <Input
                            id="name"
                            defaultValue={editingRoute?.name || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="area" className="text-right">
                            Area
                          </Label>
                          <Select defaultValue={editingRoute?.area || "North Bangalore"}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                            <SelectContent>
                              {areas.map(area => (
                                <SelectItem key={area} value={area}>{area}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="distance" className="text-right">
                            Distance (km)
                          </Label>
                          <Input
                            id="distance"
                            type="number"
                            step="0.1"
                            defaultValue={editingRoute?.distance || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="estimatedTime" className="text-right">
                            Est. Time
                          </Label>
                          <Input
                            id="estimatedTime"
                            defaultValue={editingRoute?.estimatedTime || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="assignedTo" className="text-right">
                            Assigned To
                          </Label>
                          <Input
                            id="assignedTo"
                            defaultValue={editingRoute?.assignedTo || ""}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Delivery Routes</CardTitle>
                <CardDescription>View and manage all delivery routes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>Area</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Est. Time</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoutes.map(route => (
                      <TableRow key={route.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <Route className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{route.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{route.area}</TableCell>
                        <TableCell>{route.distance} km</TableCell>
                        <TableCell>{route.estimatedTime}</TableCell>
                        <TableCell>{route.assignedTo}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(route.status)}`}>
                            {route.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditRoute(route)}
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