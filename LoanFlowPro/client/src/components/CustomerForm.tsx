import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pan: "",
    aadhaar: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Customer form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
                data-testid="input-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                data-testid="input-email"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                required
                data-testid="input-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pan">PAN Card *</Label>
              <Input
                id="pan"
                name="pan"
                placeholder="ABCDE1234F"
                value={formData.pan}
                onChange={handleChange}
                className="font-mono"
                required
                data-testid="input-pan"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="aadhaar">Aadhaar Number *</Label>
              <Input
                id="aadhaar"
                name="aadhaar"
                placeholder="1234 5678 9012"
                value={formData.aadhaar}
                onChange={handleChange}
                className="font-mono"
                required
                data-testid="input-aadhaar"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              required
              data-testid="input-address"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit">
              Create Customer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
