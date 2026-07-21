import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Plus, Lock, Shield } from "lucide-react";
import { SupAdminSidebar } from "./SupAdminSidebar";
import { useState } from "react";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  roles: string[];
  status: string;
}

const initialPermissions: Permission[] = [
  { id: "1", name: "View Dashboard", description: "Access to view dashboard", category: "Dashboard", roles: ["SupAdmin", "Admin", "Staff", "Delivery"], status: "Active" },
  { id: "2", name: "Manage Users", description: "Create, edit, and delete users", category: "User Management", roles: ["SupAdmin", "Admin"], status: "Active" },
  { id: "3", name: "Manage Roles", description: "Create, edit, and delete roles", category: "User Management", roles: ["SupAdmin"], status: "Active" },
  { id: "4", name: "Manage Products", description: "Add, edit, and delete products", category: "Product Management", roles: ["SupAdmin", "Admin", "Staff"], status: "Active" },
  { id: "5", name: "Process Orders", description: "View and process customer orders", category: "Order Management", roles: ["SupAdmin", "Admin", "Staff"], status: "Active" },
  { id: "6", name: "Manage Deliveries", description: "Assign and track deliveries", category: "Delivery Management", roles: ["SupAdmin", "Admin", "Delivery"], status: "Active" },
  { id: "7", name: "View Reports", description: "Access to system reports", category: "Analytics", roles: ["SupAdmin", "Admin"], status: "Active" },
  { id: "8", name: "System Configuration", description: "Modify system settings", category: "System", roles: ["SupAdmin"], status: "Active" },
];

const categories = ["Dashboard", "User Management", "Product Management", "Order Management", "Delivery Management", "Analytics", "System"];
const statuses = ["Active", "Inactive"];

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  // Filter permissions based on search and filters
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || permission.category === filterCategory;
    const matchesStatus = filterStatus === "All" || permission.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setIsDialogOpen(true);
  };

  const handleSavePermission = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would save to the backend here
    setIsDialogOpen(false);
    setEditingPermission(null);
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
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="SupAdmin" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <SupAdminSidebar activeSection="permissions" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Permissions</h1>
                <p className="text-muted-foreground">Manage system permissions and access control</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 w-40"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
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
                    <Button onClick={() => setEditingPermission(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Permission
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingPermission ? "Edit Permission" : "Add New Permission"}</DialogTitle>
                      <DialogDescription>
                        {editingPermission 
                          ? "Make changes to permission details here." 
                          : "Enter details for the new permission here."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSavePermission}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Permission Name
                          </Label>
                          <Input
                            id="name"
                            defaultValue={editingPermission?.name || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            defaultValue={editingPermission?.description || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="category" className="text-right">
                            Category
                          </Label>
                          <Select defaultValue={editingPermission?.category || "Dashboard"}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                <CardTitle>System Permissions</CardTitle>
                <CardDescription>View and manage all system permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.map(permission => (
                      <TableRow key={permission.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <Lock className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{permission.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{permission.description}</TableCell>
                        <TableCell>{permission.category}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {permission.roles.map((role, index) => (
                              <span key={index} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {role}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(permission.status)}`}>
                            {permission.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditPermission(permission)}
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