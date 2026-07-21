import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OrderStatusCard } from "@/components/OrderStatusCard";
import { Search, Package, MapPin, Clock } from "lucide-react";

export default function TrackOrder() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} isLoggedIn={false} />
      
      <main className="flex-1">
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                Track Your Order
              </h1>
              <p className="text-xl text-muted-foreground">
                Enter your order number to get real-time updates on your delivery
              </p>
            </div>
            
            <Card className="max-w-md mx-auto mb-16">
              <CardHeader>
                <CardTitle>Track Order</CardTitle>
                <CardDescription>Enter your order number below</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="order-number">Order Number</Label>
                    <Input
                      id="order-number"
                      placeholder="Enter your order number (e.g. #12345)"
                    />
                  </div>
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Track Order
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold font-heading mb-6 text-center">
                How Order Tracking Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 text-primary rounded-full p-4 inline-block mb-4">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Order Placed</h3>
                  <p className="text-muted-foreground">
                    We receive your order and begin processing it in our warehouse
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 text-primary rounded-full p-4 inline-block mb-4">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Order Shipped</h3>
                  <p className="text-muted-foreground">
                    Your order is packed and handed over to our delivery partner
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 text-primary rounded-full p-4 inline-block mb-4">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Out for Delivery</h3>
                  <p className="text-muted-foreground">
                    Your order is on its way and will be delivered today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold font-heading mb-8 text-center">
                Recent Orders
              </h2>
              <div className="space-y-6">
                <OrderStatusCard
                  orderId="12345"
                  status="out_for_delivery"
                  orderDate="Mar 15, 2025"
                  totalAmount={8499}
                  itemCount={3}
                />
                <OrderStatusCard
                  orderId="12344"
                  status="packed"
                  orderDate="Mar 14, 2025"
                  totalAmount={4999}
                  itemCount={1}
                />
                <OrderStatusCard
                  orderId="12343"
                  status="pending"
                  orderDate="Mar 13, 2025"
                  totalAmount={2499}
                  itemCount={2}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}