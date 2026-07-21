import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Settings, Truck, Package, ShoppingCart } from "lucide-react";
import { Link } from "wouter";

export default function DemoLogin() {
  const handleDemoLogin = (role: string) => {
    // In a real app, this would call an authentication API
    console.log(`Demo login as ${role}`);
    
    // Redirect based on role
    switch (role) {
      case "supadmin":
        window.location.href = "/dashboard/supadmin";
        break;
      case "admin":
        window.location.href = "/dashboard/admin";
        break;
      case "staff":
        window.location.href = "/dashboard/staff";
        break;
      case "delivery":
        window.location.href = "/dashboard/delivery";
        break;
      case "customer":
        window.location.href = "/dashboard/customer";
        break;
      case "user":
        window.location.href = "/dashboard/user";
        break;
      default:
        window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} isLoggedIn={false} />
      
      <main className="flex-1 bg-muted/30 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Demo Login</h1>
            <p className="text-muted-foreground text-lg">
              Quick access to all roles for demonstration purposes
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Use these demo accounts to explore different role dashboards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* SupAdmin Role */}
            <Card className="h-full">
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
                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="font-medium">Username:</span> supadmin@Sppeeds.com
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Password:</span> supadmin123
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
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
                <Button 
                  className="w-full" 
                  onClick={() => handleDemoLogin("supadmin")}
                >
                  Login as SupAdmin
                </Button>
              </CardContent>
            </Card>
            
            {/* Admin Role */}
            <Card className="h-full">
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
                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="font-medium">Username:</span> admin@Sppeeds.com
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Password:</span> admin123
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
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
                <Button 
                  className="w-full" 
                  onClick={() => handleDemoLogin("admin")}
                >
                  Login as Admin
                </Button>
              </CardContent>
            </Card>
            
            {/* Staff Role */}
            <Card className="h-full">
              <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6" />
                </div>
                <CardTitle className="text-center">Staff</CardTitle>
                <CardDescription className="text-center">
                  Manage products and orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="font-medium">Username:</span> staff@Sppeeds.com
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Password:</span> staff123
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
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
                <Button 
                  className="w-full" 
                  onClick={() => handleDemoLogin("staff")}
                >
                  Login as Staff
                </Button>
              </CardContent>
            </Card>
            
            {/* Delivery Role */}
            <Card className="h-full">
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
                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="font-medium">Username:</span> delivery@Sppeeds.com
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Password:</span> delivery123
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
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
                <Button 
                  className="w-full" 
                  onClick={() => handleDemoLogin("delivery")}
                >
                  Login as Delivery
                </Button>
              </CardContent>
            </Card>
            
            {/* Customer Role */}
            <Card className="h-full">
              <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <User className="h-6 w-6" />
                </div>
                <CardTitle className="text-center">Customer</CardTitle>
                <CardDescription className="text-center">
                  Shop and manage orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="font-medium">Username:</span> customer@Sppeeds.com
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Password:</span> customer123
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Browse products
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Place orders
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Track deliveries
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleDemoLogin("customer")}
                >
                  Login as Customer
                </Button>
              </CardContent>
            </Card>
            
            {/* Regular User Role */}
            <Card className="h-full">
              <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <CardTitle className="text-center">User</CardTitle>
                <CardDescription className="text-center">
                  Personal account management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="font-medium">Username:</span> user@Sppeeds.com
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Password:</span> user123
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Profile management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Address book
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Order history
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Wishlist
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleDemoLogin("user")}
                >
                  Login as User
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/auth">
              <a className="text-primary hover:underline">
                Return to regular authentication
              </a>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}