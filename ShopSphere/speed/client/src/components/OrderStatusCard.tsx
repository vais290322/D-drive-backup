import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle2, Truck, Clock } from "lucide-react";

interface OrderStatusCardProps {
  orderId: string;
  status: "pending" | "packed" | "out_for_delivery" | "delivered";
  orderDate: string;
  totalAmount: number;
  itemCount: number;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-500",
    variant: "secondary" as const,
  },
  packed: {
    label: "Packed",
    icon: Package,
    color: "bg-blue-500",
    variant: "secondary" as const,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: Truck,
    color: "bg-purple-500",
    variant: "secondary" as const,
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "bg-green-500",
    variant: "default" as const,
  },
};

export function OrderStatusCard({
  orderId,
  status,
  orderDate,
  totalAmount,
  itemCount,
}: OrderStatusCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-order-${orderId}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Order #{orderId}</CardTitle>
        <Badge variant={config.variant} className="gap-1" data-testid={`badge-status-${orderId}`}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold font-heading" data-testid={`text-amount-${orderId}`}>
              ₹{totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <div className={`h-12 w-12 rounded-full ${config.color} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Ordered on {orderDate}</span>
          <span className="font-medium">COD</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" data-testid={`button-track-${orderId}`}>
            Track Order
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" data-testid={`button-details-${orderId}`}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
