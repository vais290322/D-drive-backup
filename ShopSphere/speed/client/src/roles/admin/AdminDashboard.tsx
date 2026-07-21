import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  User,
  Box,
  Truck,
  Settings
} from "lucide-react";
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";

export default function AdminDashboard() {
  const [currentUserRole] = useState("Admin");

  return (
    <div className="min-h-screen flex flex-col">
     
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar activeSection="dashboard" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage store operations and staff</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                  {currentUserRole}
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">₹45,231</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">+2% from last month</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Admin Specific Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Store Management
                  </CardTitle>
                  <CardDescription>Manage store operations and staff</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <User className="h-6 w-6" />
                      <span>Staff Management</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Box className="h-6 w-6" />
                      <span>Product Catalog</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <ShoppingCart className="h-6 w-6" />
                      <span>Order Processing</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Truck className="h-6 w-6" />
                      <span>Delivery Management</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions by staff</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                        S
                      </div>
                      <div>
                        <p className="font-medium text-sm">Sarah Staff</p>
                        <p className="text-xs text-muted-foreground">Added 5 new products</p>
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                        M
                      </div>
                      <div>
                        <p className="font-medium text-sm">Mike Manager</p>
                        <p className="text-xs text-muted-foreground">Processed 12 orders</p>
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">5 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}