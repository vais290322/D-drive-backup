import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  Check
} from "lucide-react";
import { useState } from "react";
import { UserSidebar } from "./UserSidebar";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Home",
      street: "123 Main Street",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
      isDefault: true
    },
    {
      id: "2",
      name: "Office",
      street: "456 Business Park",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560002",
      country: "India",
      isDefault: false
    }
  ]);
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    });
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setIsAddingNew(false);
    setFormData({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country
    });
  };

  const handleSave = () => {
    if (editingId) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingId 
          ? { ...addr, ...formData } 
          : addr
      ));
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddress]);
    }
    
    // Reset form
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    });
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={3} isLoggedIn={true} userName="John Doe" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <UserSidebar activeSection="address" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Address Management</h1>
                <p className="text-muted-foreground">Manage your delivery addresses</p>
              </div>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            </div>
            
            <div className="space-y-6">
              {isAddingNew && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Address</CardTitle>
                    <CardDescription>Enter your new delivery address</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Address Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="e.g., Home, Office"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Textarea
                        id="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Street address"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Check className="mr-2 h-4 w-4" />
                        Save Address
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {addresses.map(address => (
                <Card key={address.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {address.name}
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {!address.isDefault && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(address)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
              
              {addresses.length === 0 && !isAddingNew && (
                <Card>
                  <CardContent className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No addresses added</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first delivery address to get started
                    </p>
                    <Button onClick={handleAddNew}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Address
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}