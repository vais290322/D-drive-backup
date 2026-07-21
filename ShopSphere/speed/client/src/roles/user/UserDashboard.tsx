import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  ShoppingCart, 
  Heart, 
  MapPin, 
  CreditCard,
  Settings,
  Gift,
  Bell
} from "lucide-react";
import { useState } from "react";
import { UserSidebar } from "./UserSidebar";

export default function UserDashboard() {
  const [currentUserRole] = useState("Customer");

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={3} isLoggedIn={true} userName="John Doe" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <UserSidebar activeSection="dashboard" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">My Account</h1>
                <p className="text-muted-foreground">Manage your profile, orders, and preferences</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                  {currentUserRole}
                </div>
              </div>
            </div>
            
            {/* Welcome Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                      JD
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Welcome back, John!</h2>
                      <p className="text-muted-foreground">Member since March 2024</p>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-muted-foreground">Orders</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Wishlist</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold">750</p>
                      <p className="text-sm text-muted-foreground">Points</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold">₹2.4K</p>
                      <p className="text-sm text-muted-foreground">Spent</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Account Management Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Management
                  </CardTitle>
                  <CardDescription>Manage your account settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <User className="h-6 w-6" />
                      <span>Profile Information</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <MapPin className="h-6 w-6" />
                      <span>Address Book</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <CreditCard className="h-6 w-6" />
                      <span>Payment Methods</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                      <Bell className="h-6 w-6" />
                      <span>Notification Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Loyalty Points
                    </CardTitle>
                    <CardDescription>Your rewards and benefits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-4">
                      <p className="text-3xl font-bold">750</p>
                      <p className="text-muted-foreground mb-4">Points Available</p>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <p className="text-sm text-muted-foreground">250 points to next reward</p>
                      <Button className="w-full mt-4">Redeem Points</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest purchases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">#1001</p>
                          <p className="text-sm text-muted-foreground">Mar 15, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹5,999</p>
                          <p className="text-sm text-green-600">Delivered</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">#1002</p>
                          <p className="text-sm text-muted-foreground">Mar 10, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹2,499</p>
                          <p className="text-sm text-blue-600">Processing</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">View All Orders</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}