import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Tag, TrendingUp } from "lucide-react";
import { StaffSidebar } from "./StaffSidebar";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  discount: number;
  lastUpdated: string;
}

const initialProducts: Product[] = [
  { id: "1", name: "Professional Power Drill", sku: "PD-001", category: "Tools", currentPrice: 4999, previousPrice: 5999, discount: 16.67, lastUpdated: "2025-03-15" },
  { id: "2", name: "Safety Helmet", sku: "SH-002", category: "Safety Gear", currentPrice: 899, previousPrice: 999, discount: 10, lastUpdated: "2025-03-10" },
  { id: "3", name: "Measuring Tape", sku: "MT-003", category: "Tools", currentPrice: 499, previousPrice: 599, discount: 16.67, lastUpdated: "2025-03-05" },
  { id: "4", name: "Work Gloves", sku: "WG-004", category: "Safety Gear", currentPrice: 349, previousPrice: 399, discount: 12.53, lastUpdated: "2025-02-28" },
];

const categories = ["Tools", "Safety Gear", "Electrical", "Plumbing"];

export default function PriceUpdatesPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products based on search and category filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSaveProduct = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would save to the backend here
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Staff" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <StaffSidebar activeSection="pricing" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Price Updates</h1>
                <p className="text-muted-foreground">Manage product pricing and discounts</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search products..."
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
                    <Button onClick={() => setEditingProduct(null)}>
                      <Tag className="mr-2 h-4 w-4" />
                      Update Price
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? "Edit Product Price" : "Update Product Price"}</DialogTitle>
                      <DialogDescription>
                        {editingProduct 
                          ? "Make changes to product pricing here." 
                          : "Enter new pricing for the product here."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveProduct}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Product
                          </Label>
                          <div className="col-span-3">
                            <p className="font-medium">{editingProduct?.name}</p>
                            <p className="text-sm text-muted-foreground">{editingProduct?.sku}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="currentPrice" className="text-right">
                            New Price (₹)
                          </Label>
                          <Input
                            id="currentPrice"
                            type="number"
                            defaultValue={editingProduct?.currentPrice || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="previousPrice" className="text-right">
                            Previous Price (₹)
                          </Label>
                          <Input
                            id="previousPrice"
                            type="number"
                            defaultValue={editingProduct?.previousPrice || ""}
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
                <CardTitle>Product Pricing</CardTitle>
                <CardDescription>View and update product prices and discounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Previous Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <Tag className="h-4 w-4" />
                            </div>
                            <span>{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-medium">₹{product.currentPrice.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className="line-through text-muted-foreground">₹{product.previousPrice.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {product.discount.toFixed(2)}% off
                          </span>
                        </TableCell>
                        <TableCell>{product.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditProduct(product)}
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