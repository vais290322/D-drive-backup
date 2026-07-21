import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminSidebar } from "./AdminSidebar";
import { useState, useEffect } from "react";
import { Save, Store, Clock, CreditCard, Truck } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import summaryApi from "@/common/api";
import { toast } from "sonner";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

export default function StoreSettingsPage() {
  const [formData, setFormData] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    shippingCost: "",
    freeShippingCost: "",
    deliveryRadiusKm: "",
    enablePickup: false,
  });

  const [storePosition, setStorePosition] = useState([12.9716, 77.5946]); // Default: Bangalore
  const [userPosition, setUserPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasStoreProfile, setHasStoreProfile] = useState(false); // Track if store profile exists

  // Fetch store information on component mount
  useEffect(() => {
    fetchStoreInformation();
  }, []);

  // Fetch store information from API
  const fetchStoreInformation = async () => {
    try {
      setIsLoading(true);
      
      // Use fetchStoreProfile endpoint to get store information
      const response = await axios.get(summaryApi.fetchStoreProfile, {
        withCredentials: true,
      });
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        // Store profile exists, populate form with existing data
        const storeData = response.data.data[0];
        setFormData({
          name: storeData.name || "",
          addressLine1: storeData.addressLine1 || "",
          addressLine2: storeData.addressLine2 || "",
          city: storeData.city || "",
          state: storeData.state || "",
          postalCode: storeData.postalCode || "",
          country: storeData.country || "",
          phoneNumber: storeData.phoneNumber || "",
          shippingCost: storeData.shippingCost?.toString() || "",
          freeShippingCost: storeData.freeShippingCost?.toString() || "",
          deliveryRadiusKm: storeData.deliveryRadiusKm?.toString() || "",
          enablePickup: storeData.enablePickup || false,
        });
        
        // Set position from stored coordinates if available
        if (storeData.latitude && storeData.longitude) {
          setStorePosition([storeData.latitude, storeData.longitude]);
        }
        
        setHasStoreProfile(true);
      } else {
        // No store profile exists, show empty form
        setHasStoreProfile(false);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching store information:", error);
      setIsLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle switch toggle
  const handleSwitchChange = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle marker drag
  const handleMarkerDrag = (event) => {
    const { lat, lng } = event.target.getLatLng();
    setStorePosition([lat, lng]);
  };

  // Handle map click to select new position
  function LocationSelector({ onLocationSelect }) {
    useMapEvents({
      click(e) {
        onLocationSelect([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  }

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data according to the required structure
    const storeData = {
      name: formData.name,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
      phoneNumber: formData.phoneNumber,
      latitude: storePosition[0],
      longitude: storePosition[1],
      deliveryRadiusKm: parseFloat(formData.deliveryRadiusKm),
      shippingCost: parseFloat(formData.shippingCost),
      freeShippingCost: parseFloat(formData.freeShippingCost),
      enablePickup: formData.enablePickup,
    };

    try {
      let response;
      
      if (hasStoreProfile) {
        // Update existing store profile
        response = await axios.post(summaryApi.addStoreProfile, storeData, {
          withCredentials: true,
        });
      } else {
        // Create new store profile
        response = await axios.post(summaryApi.addStoreProfile, storeData, {
          withCredentials: true,
        });
        setHasStoreProfile(true); // Mark that store now exists
      }
      
      if (response.data.success) {
        toast.success(hasStoreProfile ? "Store settings updated successfully!" : "Store profile created successfully!");
        // Refresh store information after successful save
        fetchStoreInformation();
      } else {
        toast.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error saving store settings:", error);
      toast.error("Failed to save store settings");
    }
  };

  // Open dialog when user clicks edit button
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar activeSection="settings" />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Store Settings</h1>
                <p className="text-muted-foreground">Manage your store configuration</p>
              </div>
              <Button onClick={openDialog}>
                <Save className="mr-2 h-4 w-4" />
                {hasStoreProfile ? "Edit Settings" : "Add Store"}
              </Button>
            </div>

            {/* Dialog for editing store settings */}
            {isDialogOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">{hasStoreProfile ? "Edit Store Settings" : "Add Store Information"}</h2>
                      <button 
                        onClick={closeDialog}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Store className="h-5 w-5" />
                          Store Information
                        </CardTitle>
                        <CardDescription>Basic information about your store</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="name">Store Name</Label>
                          <Input id="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div>
                          <Label htmlFor="addressLine1">Address Line 1</Label>
                          <Input id="addressLine1" value={formData.addressLine1} onChange={handleInputChange} required />
                        </div>
                        <div>
                          <Label htmlFor="addressLine2">Address Line 2</Label>
                          <Input id="addressLine2" value={formData.addressLine2} onChange={handleInputChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" value={formData.city} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input id="state" value={formData.state} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input id="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" value={formData.country} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="phoneNumber">Contact Phone</Label>
                            <Input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} required />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="h-5 w-5" />
                          Shipping
                        </CardTitle>
                        <CardDescription>Configure shipping options and location</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="shippingCost">Shipping Cost (₹)</Label>
                            <Input id="shippingCost" type="number" value={formData.shippingCost} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="freeShippingCost">Free Shipping Threshold (₹)</Label>
                            <Input
                              id="freeShippingCost"
                              type="number"
                              value={formData.freeShippingCost}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="deliveryRadiusKm">Delivery Radius (km)</Label>
                            <Input
                              id="deliveryRadiusKm"
                              type="number"
                              value={formData.deliveryRadiusKm}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>In-Store Pickup</Label>
                            <p className="text-sm text-muted-foreground">Allow customers to pickup orders at store</p>
                          </div>
                          <Switch checked={formData.enablePickup} onCheckedChange={() => handleSwitchChange("enablePickup")} />
                        </div>

                        {/* Leaflet Map */}
                        <div className="h-[400px] w-full rounded-lg overflow-hidden shadow mt-4">
                          <MapContainer
                            center={storePosition}
                            zoom={13}
                            scrollWheelZoom={true}
                            className="h-full w-full"
                          >
                            {/* Enable clicking on map to change store location */}
                            <LocationSelector onLocationSelect={(pos) => setStorePosition(pos)} />

                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker
                              position={storePosition}
                              draggable={true}
                              eventHandlers={{ dragend: handleMarkerDrag }}
                            >
                              <Popup>
                                Store Location <br />
                                Latitude: {storePosition[0].toFixed(6)} <br />
                                Longitude: {storePosition[1].toFixed(6)}
                              </Popup>
                            </Marker>

                            {userPosition && (
                              <Marker position={userPosition}>
                                <Popup>Your Location</Popup>
                              </Marker>
                            )}
                          </MapContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={closeDialog}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        {hasStoreProfile ? "Save Changes" : "Create Store"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Display current store settings */}
            {!isDialogOpen && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Store Information</h2>
                  <p className="text-muted-foreground">Basic information about your store</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Store Name</Label>
                    <p className="mt-1 text-gray-900">{formData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Address Line 1</Label>
                    <p className="mt-1 text-gray-900">{formData.addressLine1}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Address Line 2</Label>
                    <p className="mt-1 text-gray-900">{formData.addressLine2}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">City</Label>
                    <p className="mt-1 text-gray-900">{formData.city}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">State</Label>
                    <p className="mt-1 text-gray-900">{formData.state}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Postal Code</Label>
                    <p className="mt-1 text-gray-900">{formData.postalCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Country</Label>
                    <p className="mt-1 text-gray-900">{formData.country}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Contact Phone</Label>
                    <p className="mt-1 text-gray-900">{formData.phoneNumber}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Shipping</h2>
                  <p className="text-muted-foreground">Configure shipping options and location</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Shipping Cost (₹)</Label>
                    <p className="mt-1 text-gray-900">{formData.shippingCost}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Free Shipping Threshold (₹)</Label>
                    <p className="mt-1 text-gray-900">{formData.freeShippingCost}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Delivery Radius (km)</Label>
                    <p className="mt-1 text-gray-900">{formData.deliveryRadiusKm}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">In-Store Pickup</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to pickup orders at store</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.enablePickup ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </div>

                <div className="h-[400px] w-full rounded-lg overflow-hidden shadow">
                  <MapContainer
                    center={storePosition}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={storePosition}>
                      <Popup>
                        Store Location <br />
                        Latitude: {storePosition[0].toFixed(6)} <br />
                        Longitude: {storePosition[1].toFixed(6)}
                      </Popup>
                    </Marker>

                    {userPosition && (
                      <Marker position={userPosition}>
                        <Popup>Your Location</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}