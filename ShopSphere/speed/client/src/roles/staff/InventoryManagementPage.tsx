import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Plus, Package } from "lucide-react";
import { StaffSidebar } from "./StaffSidebar";
import { useState } from "react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  status: string;
}

const initialInventory: InventoryItem[] = [
  { id: "1", name: "Professional Power Drill", sku: "PD-001", category: "Tools", quantity: 25, reserved: 5, available: 20, reorderLevel: 10, status: "In Stock" },
  { id: "2", name: "Safety Helmet", sku: "SH-002", category: "Safety Gear", quantity: 50, reserved: 10, available: 40, reorderLevel: 20, status: "In Stock" },
  { id: "3", name: "Measuring Tape", sku: "MT-003", category: "Tools", quantity: 100, reserved: 20, available: 80, reorderLevel: 30, status: "In Stock" },
  { id: "4", name: "Work Gloves", sku: "WG-004", category: "Safety Gear", quantity: 0, reserved: 0, available: 0, reorderLevel: 20, status: "Out of Stock" },
];

const categories = ["Tools", "Safety Gear", "Electrical", "Plumbing"];

export default function InventoryManagementPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Filter inventory based on search and category filter
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSaveItem = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would save to the backend here
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-green-100 text-green-800";
      case "Low Stock": return "bg-yellow-100 text-yellow-800";
      case "Out of Stock": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Staff" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <StaffSidebar activeSection="inventory" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Inventory Management</h1>
                <p className="text-muted-foreground">Track and manage product inventory</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 w-40"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingItem(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}</DialogTitle>
                      <DialogDescription>
                        {editingItem 
                          ? "Make changes to inventory item details here." 
                          : "Enter details for the new inventory item here."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveItem}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            defaultValue={editingItem?.name || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="sku" className="text-right">
                            SKU
                          </Label>
                          <Input
                            id="sku"
                            defaultValue={editingItem?.sku || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="category" className="text-right">
                            Category
                          </Label>
                          <Select defaultValue={editingItem?.category || "Tools"}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="quantity" className="text-right">
                            Quantity
                          </Label>
                          <Input
                            id="quantity"
                            type="number"
                            defaultValue={editingItem?.quantity || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="reorderLevel" className="text-right">
                            Reorder Level
                          </Label>
                          <Input
                            id="reorderLevel"
                            type="number"
                            defaultValue={editingItem?.reorderLevel || ""}
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
                <CardTitle>Inventory Items</CardTitle>
                <CardDescription>View and manage all inventory items</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Reserved</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <Package className="h-4 w-4" />
                            </div>
                            <span>{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.reserved}</TableCell>
                        <TableCell>{item.available}</TableCell>
                        <TableCell>{item.reorderLevel}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditItem(item)}
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