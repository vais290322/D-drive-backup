import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, RotateCcw, Truck, ShieldCheck, AlertCircle } from "lucide-react";

export default function ReturnsRefunds() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} isLoggedIn={false} />
      
      <main className="flex-1">
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                Returns & Refunds
              </h1>
              <p className="text-xl text-muted-foreground">
                Our hassle-free return policy for your peace of mind
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
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Return Policy
                    </CardTitle>
                    <CardDescription>
                      Our 7-day return guarantee
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-1">7 Days</Badge>
                        <div>
                          <h3 className="font-semibold">Time Limit</h3>
                          <p className="text-sm text-muted-foreground">
                            Return items within 7 days of delivery
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-1">Unused</Badge>
                        <div>
                          <h3 className="font-semibold">Condition</h3>
                          <p className="text-sm text-muted-foreground">
                            Items must be unused, undamaged, and in original packaging
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-1">Free</Badge>
                        <div>
                          <h3 className="font-semibold">Return Shipping</h3>
                          <p className="text-sm text-muted-foreground">
                            We provide free return shipping for all eligible items
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RotateCcw className="h-5 w-5 text-primary" />
                      Non-Returnable Items
                    </CardTitle>
                    <CardDescription>
                      Items that cannot be returned
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Opened consumables (batteries, adhesives, etc.)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Custom-made or engraved items</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Software or digital downloads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Items damaged due to misuse</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Clearance or sale items (unless defective)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-16">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    How to Return an Item
                  </CardTitle>
                  <CardDescription>
                    Simple steps to initiate a return
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <span className="font-bold">1</span>
                      </div>
                      <h3 className="font-semibold mb-2">Request Return</h3>
                      <p className="text-sm text-muted-foreground">
                        Contact support or use the return form in your account
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <span className="font-bold">2</span>
                      </div>
                      <h3 className="font-semibold mb-2">Get Approval</h3>
                      <p className="text-sm text-muted-foreground">
                        We'll review your request and provide a return authorization
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <span className="font-bold">3</span>
                      </div>
                      <h3 className="font-semibold mb-2">Ship Item</h3>
                      <p className="text-sm text-muted-foreground">
                        Pack the item securely and schedule a pickup or drop-off
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <span className="font-bold">4</span>
                      </div>
                      <h3 className="font-semibold mb-2">Receive Refund</h3>
                      <p className="text-sm text-muted-foreground">
                        We'll process your refund within 3-5 business days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Refund Process</CardTitle>
                    <CardDescription>
                      How and when you'll receive your refund
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li>
                        <h3 className="font-semibold mb-1">Processing Time</h3>
                        <p className="text-sm text-muted-foreground">
                          Refunds are processed within 3-5 business days after we receive the item
                        </p>
                      </li>
                      <li>
                        <h3 className="font-semibold mb-1">Refund Method</h3>
                        <p className="text-sm text-muted-foreground">
                          Refunds are issued to the original payment method
                        </p>
                      </li>
                      <li>
                        <h3 className="font-semibold mb-1">Original Shipping</h3>
                        <p className="text-sm text-muted-foreground">
                          Original shipping costs are non-refundable unless the return is due to our error
                        </p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>
                      Contact our support team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        If you have questions about returns or need assistance, our support team is here to help.
                      </p>
                      <Button className="w-full">
                        Contact Support
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <div className="text-center text-sm text-muted-foreground">
                        <p>Mon-Sat, 9AM-6PM</p>
                        <p>+91 1234567890</p>
                      </div>
                    </div>
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