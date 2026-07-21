import { OrderStatusCard } from "../OrderStatusCard";

export default function OrderStatusCardExample() {
  return (
    <div className="p-6 max-w-sm space-y-4">
      <OrderStatusCard
        orderId="12345"
        status="out_for_delivery"
        orderDate="Mar 15, 2025"
        totalAmount={8499}
        itemCount={3}
      />
      <OrderStatusCard
        orderId="12344"
        status="delivered"
        orderDate="Mar 10, 2025"
        totalAmount={4999}
        itemCount={1}
      />
    </div>
  );
}
