import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Truck, ShieldCheck } from "lucide-react";
import { DeliveryMap } from "@/components/DeliveryMap";

export default function ShippingInfo() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} isLoggedIn={false} />
      
      <main className="flex-1">
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                Shipping Information
              </h1>
              <p className="text-xl text-muted-foreground">
                Fast, reliable delivery within Bangalore
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Delivery Area
                    </CardTitle>
                    <CardDescription>
                      We deliver within a 5km radius of our store
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Check if we deliver to your area"
                          className="pl-10"
                        />
                      </div>
                      <Button className="w-full">Check Delivery Area</Button>
                      <p className="text-sm text-muted-foreground text-center mt-4">
                        Enter your pin code to check if we deliver to your area
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Delivery Hours
                    </CardTitle>
                    <CardDescription>
                      Our delivery schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="font-medium">Monday - Saturday</span>
                        <span>9:00 AM - 8:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-medium">Sunday</span>
                        <span>10:00 AM - 6:00 PM</span>
                      </li>
                      <li className="flex justify-between pt-3 border-t">
                        <span className="font-medium">Order Processing</span>
                        <span>9:00 AM - 4:00 PM</span>
                      </li>
                      <li className="text-sm text-muted-foreground pt-3 border-t">
                        Orders placed after 4:00 PM will be processed the next business day
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-16">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Coverage Map
                  </CardTitle>
                  <CardDescription>
                    Our store location and 5km delivery radius
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <DeliveryMap
                      storeLocation={[12.9716, 77.5946]}
                      deliveryRadius={5000}
                      height="100%"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 text-primary rounded-full p-4 inline-block mb-4">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Same-Day Delivery</h3>
                  <p className="text-muted-foreground">
                    Orders placed before 2 PM are delivered the same day
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 text-primary rounded-full p-4 inline-block mb-4">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Packaging</h3>
                  <p className="text-muted-foreground">
                    All items are carefully packaged to prevent damage
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 text-primary rounded-full p-4 inline-block mb-4">
                    <Truck className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Contactless Delivery</h3>
                  <p className="text-muted-foreground">
                    Safe delivery with no direct contact required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold font-heading mb-8 text-center">
                Delivery Options
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Standard Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold font-heading mb-2">Free</div>
                    <p className="text-muted-foreground mb-4">
                      For all orders within our delivery area
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Delivery within 2-4 hours of ordering</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Cash on delivery available</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Free returns within 7 days</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Express Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold font-heading mb-2">₹99</div>
                    <p className="text-muted-foreground mb-4">
                      Priority delivery within 1-2 hours
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Delivery within 1-2 hours</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Dedicated delivery executive</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Same-day delivery guarantee</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-4">Select Express Delivery</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}