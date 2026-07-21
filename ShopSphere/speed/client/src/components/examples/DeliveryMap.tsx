import { DeliveryMap } from "../DeliveryMap";

export default function DeliveryMapExample() {
  return (
    <div className="p-6">
      <DeliveryMap
        storeLocation={[12.9716, 77.5946]}
        deliveryRadius={5000}
        customerLocation={[12.9850, 77.6100]}
        height="500px"
      />
    </div>
  );
}
