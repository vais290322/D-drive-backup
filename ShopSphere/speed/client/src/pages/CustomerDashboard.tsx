import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoyaltyPoints } from "@/components/LoyaltyPoints";
import { OrderStatusCard } from "@/components/OrderStatusCard";
import { DashboardStats } from "@/components/DashboardStats";
import { ShoppingBag, Heart, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={2} isLoggedIn={true} userName="John Doe" />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John Doe!</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <DashboardStats
              title="Total Orders"
              value="24"
              icon={ShoppingBag}
              description="All time"
            />
            <DashboardStats
              title="Wishlist Items"
              value="12"
              icon={Heart}
              description="Saved for later"
            />
            <DashboardStats
              title="Delivery Address"
              value="1"
              icon={MapPin}
              description="Saved addresses"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="orders" data-testid="tab-orders">My Orders</TabsTrigger>
                  <TabsTrigger value="active" data-testid="tab-active">Active</TabsTrigger>
                  <TabsTrigger value="completed" data-testid="tab-completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="orders" className="space-y-4 mt-4">
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
                </TabsContent>
                <TabsContent value="active" className="space-y-4 mt-4">
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
                </TabsContent>
                <TabsContent value="completed" className="space-y-4 mt-4">
                  <OrderStatusCard
                    orderId="12342"
                    status="delivered"
                    orderDate="Mar 10, 2025"
                    totalAmount={7999}
                    itemCount={1}
                  />
                  <OrderStatusCard
                    orderId="12341"
                    status="delivered"
                    orderDate="Mar 5, 2025"
                    totalAmount={3499}
                    itemCount={2}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <LoyaltyPoints
                currentPoints={750}
                pointsToNextReward={1000}
                totalEarned={2450}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
