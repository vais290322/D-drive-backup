import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Plus, UserCog, Shield } from "lucide-react";
import { SupAdminSidebar } from "./SupAdminSidebar";
import { useState } from "react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string;
  users: number;
  status: string;
}

const initialRoles: Role[] = [
  { id: "1", name: "SupAdmin", description: "Full system access", permissions: "All permissions", users: 1, status: "Active" },
  { id: "2", name: "Admin", description: "Manage store operations", permissions: "Store management", users: 3, status: "Active" },
  { id: "3", name: "Staff", description: "Handle products and orders", permissions: "Inventory, Orders", users: 12, status: "Active" },
  { id: "4", name: "Delivery", description: "Manage deliveries", permissions: "Delivery management", users: 8, status: "Active" },
  { id: "5", name: "Customer", description: "Shop and manage orders", permissions: "Shopping, Orders", users: 1250, status: "Active" },
];

const statuses = ["Active", "Inactive"];

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Filter roles based on search and status filter
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || role.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleSaveRole = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would save to the backend here
    setIsDialogOpen(false);
    setEditingRole(null);
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
          <SupAdminSidebar activeSection="roles" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Role Management</h1>
                <p className="text-muted-foreground">Manage user roles and permissions</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search roles..."
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingRole(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingRole ? "Edit Role" : "Add New Role"}</DialogTitle>
                      <DialogDescription>
                        {editingRole 
                          ? "Make changes to role details here." 
                          : "Enter details for the new role here."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveRole}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Role Name
                          </Label>
                          <Input
                            id="name"
                            defaultValue={editingRole?.name || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            defaultValue={editingRole?.description || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="permissions" className="text-right">
                            Permissions
                          </Label>
                          <Input
                            id="permissions"
                            defaultValue={editingRole?.permissions || ""}
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
                <CardTitle>User Roles</CardTitle>
                <CardDescription>View and manage all user roles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map(role => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <UserCog className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{role.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>{role.permissions}</TableCell>
                        <TableCell>{role.users}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(role.status)}`}>
                            {role.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditRole(role)}
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