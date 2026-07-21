import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DeliveryMapProps {
  storeLocation?: [number, number];
  deliveryRadius?: number;
  customerLocation?: [number, number];
  height?: string;
}

export function DeliveryMap({
  storeLocation = [12.9716, 77.5946],
  deliveryRadius = 5000,
  customerLocation,
  height = "400px",
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(storeLocation, 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const storeIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: hsl(142, 71%, 45%); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker(storeLocation, { icon: storeIcon }).addTo(map);

    L.circle(storeLocation, {
      color: "hsl(142, 71%, 45%)",
      fillColor: "hsl(142, 71%, 45%)",
      fillOpacity: 0.1,
      radius: deliveryRadius,
    }).addTo(map);

    if (customerLocation) {
      const customerIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: hsl(25, 95%, 53%); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker(customerLocation, { icon: customerIcon }).addTo(map);

      const bounds = L.latLngBounds([storeLocation, customerLocation]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [storeLocation, deliveryRadius, customerLocation]);

  return <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg overflow-hidden" data-testid="map-delivery" />;
}
