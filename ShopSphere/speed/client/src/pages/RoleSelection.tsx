import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Settings, Truck } from "lucide-react";
import { Link } from "wouter";

export default function RoleSelection() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} isLoggedIn={true} userName="User" />
      
      <main className="flex-1 bg-muted/30 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Select Your Role</h1>
            <p className="text-muted-foreground text-lg">
              Choose the dashboard that matches your role in the organization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/supadmin">
              <a className="block">
                <Card className="h-full hover:bg-muted transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-center">SupAdmin</CardTitle>
                    <CardDescription className="text-center">
                      Full system access and control
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Manage all users and roles
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        System configuration
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Audit and security
                      </li>
                    </ul>
                    <Button className="w-full mt-4">Access Dashboard</Button>
                  </CardContent>
                </Card>
              </a>
            </Link>
            
            <Link href="/dashboard/admin">
              <a className="block">
                <Card className="h-full hover:bg-muted transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Settings className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-center">Admin</CardTitle>
                    <CardDescription className="text-center">
                      Manage store operations and staff
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Manage staff accounts
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Product catalog management
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Order processing oversight
                      </li>
                    </ul>
                    <Button className="w-full mt-4">Access Dashboard</Button>
                  </CardContent>
                </Card>
              </a>
            </Link>
            
            <Link href="/dashboard/staff">
              <a className="block">
                <Card className="h-full hover:bg-muted transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <User className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-center">Staff</CardTitle>
                    <CardDescription className="text-center">
                      Manage products and orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Inventory management
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Order processing
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Price updates
                      </li>
                    </ul>
                    <Button className="w-full mt-4">Access Dashboard</Button>
                  </CardContent>
                </Card>
              </a>
            </Link>
            
            <Link href="/dashboard/delivery">
              <a className="block">
                <Card className="h-full hover:bg-muted transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-center">Delivery</CardTitle>
                    <CardDescription className="text-center">
                      Manage deliveries and shipments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Delivery route management
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Package tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Delivery status updates
                      </li>
                    </ul>
                    <Button className="w-full mt-4">Access Dashboard</Button>
                  </CardContent>
                </Card>
              </a>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}