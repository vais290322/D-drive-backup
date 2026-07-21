import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Truck, 
  MapPin, 
  Clock,
  CheckCircle,
  Package
} from "lucide-react";
import { useState } from "react";
import { DeliverySidebar } from "./DeliverySidebar";

export default function DeliveryDashboard() {
  const [currentUserRole] = useState("Delivery");

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Delivery" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <DeliverySidebar activeSection="dashboard" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Delivery Dashboard</h1>
                <p className="text-muted-foreground">Manage deliveries and shipments</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                  {currentUserRole}
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">For today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Currently delivering</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Awaiting pickup</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Delivery Specific Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Routes
                  </CardTitle>
                  <CardDescription>Today's delivery schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">#1001 - Alice Johnson</p>
                        <p className="text-sm text-muted-foreground">123 Main Street, Bangalore</p>
                      </div>
                      <Button size="sm">Mark Delivered</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">#1002 - Bob Smith</p>
                        <p className="text-sm text-muted-foreground">456 Oak Avenue, Bangalore</p>
                      </div>
                      <Button size="sm">Mark Delivered</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">#1003 - Carol Davis</p>
                        <p className="text-sm text-muted-foreground">789 Pine Road, Bangalore</p>
                      </div>
                      <Button size="sm">In Transit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Map</CardTitle>
                  <CardDescription>Optimized route for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Delivery route map</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Optimize Route</Button>
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