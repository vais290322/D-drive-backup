import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  ShoppingCart, 
  Box,
  Tag,
  ClipboardList
} from "lucide-react";
import { useState } from "react";
import { StaffSidebar } from "./StaffSidebar";

export default function StaffDashboard() {
  const [currentUserRole] = useState("Staff");

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Staff" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <StaffSidebar activeSection="dashboard" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Staff Dashboard</h1>
                <p className="text-muted-foreground">Manage products and orders</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                  {currentUserRole}
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Need processing</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">Assigned to you</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Staff Specific Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5" />
                    Daily Operations
                  </CardTitle>
                  <CardDescription>Tasks assigned to your role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Package className="h-6 w-6" />
                      <span>Inventory Management</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <ShoppingCart className="h-6 w-6" />
                      <span>Order Processing</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Tag className="h-6 w-6" />
                      <span>Price Updates</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <ClipboardList className="h-6 w-6" />
                      <span>Task List</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your assigned tasks for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Process pending orders</p>
                      <p className="text-xs text-muted-foreground">9:00 AM - 11:00 AM</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Restock low inventory items</p>
                      <p className="text-xs text-muted-foreground">11:00 AM - 12:00 PM</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">Update product prices</p>
                      <p className="text-xs text-muted-foreground">2:00 PM - 3:00 PM</p>
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