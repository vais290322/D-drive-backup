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
  UserCog,
  Shield,
  Settings
} from "lucide-react";
import { useState } from "react";
import { SupAdminSidebar } from "./SupAdminSidebar";

export default function SupAdminDashboard() {
  const [currentUserRole] = useState("SupAdmin");

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="SupAdmin" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <SupAdminSidebar activeSection="dashboard" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">SupAdmin Dashboard</h1>
                <p className="text-muted-foreground">Full system access and control</p>
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
            
            {/* SupAdmin Specific Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5" />
                    System Administration
                  </CardTitle>
                  <CardDescription>Manage system-wide settings and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Shield className="h-6 w-6" />
                      <span>Role Management</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Settings className="h-6 w-6" />
                      <span>System Settings</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Users className="h-6 w-6" />
                      <span>User Permissions</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <BarChart3 className="h-6 w-6" />
                      <span>Audit Logs</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Database</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Operational</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API Server</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Operational</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Gateway</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Operational</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Service</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Degraded</span>
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