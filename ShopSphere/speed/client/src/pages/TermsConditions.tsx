import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsConditions() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} isLoggedIn={false} />
      
      <main className="flex-1">
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                Terms & Conditions
              </h1>
              <p className="text-xl text-muted-foreground">
                Please read these terms carefully before using our services
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>1. Introduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Welcome to Sppeeds ("we," "our," or "us"). These Terms and Conditions govern your use of our website, services, and products. By accessing or using our services, you agree to be bound by these terms.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>2. Use of Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>You must be at least 18 years old to use our services</li>
                    <li>You agree to provide accurate and complete information when creating an account</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>You agree not to use our services for any illegal or unauthorized purposes</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>3. Products and Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>All products are subject to availability</li>
                    <li>Prices are subject to change without prior notice</li>
                    <li>We strive to display accurate product information, but errors may occur</li>
                    <li>We reserve the right to correct any pricing errors</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>4. Orders and Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Orders are confirmed upon receipt and acceptance by Sppeeds</li>
                    <li>Payment must be made in full at the time of order placement</li>
                    <li>We accept cash on delivery, UPI, credit/debit cards, and net banking</li>
                    <li>All payments are processed through secure payment gateways</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>5. Delivery Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>We deliver within a 5km radius of our Bangalore store</li>
                    <li>Delivery times are estimates and not guaranteed</li>
                    <li>We are not responsible for delays caused by traffic or weather conditions</li>
                    <li>Risk of loss and title for products transfers when customer takes possession</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>6. Returns and Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Refer to our Returns & Refunds policy for detailed information</li>
                    <li>All returns must be initiated within 7 days of delivery</li>
                    <li>Items must be unused, undamaged, and in original packaging</li>
                    <li>Refunds are processed to the original payment method</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>7. Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Sppeeds shall not be liable for any indirect, incidental, or consequential damages</li>
                    <li>Our total liability shall not exceed the purchase price of the products</li>
                    <li>We do not guarantee uninterrupted or error-free service</li>
                    <li>We are not responsible for damages caused by misuse of products</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>8. Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>All content on our website is owned by or licensed to Sppeeds</li>
                    <li>You may not use our content without prior written permission</li>
                    <li>Trademarks and logos are the property of their respective owners</li>
                    <li>Unauthorized use may result in legal action</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>9. Governing Law</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Bangalore.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>10. Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified terms.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms and Conditions, please contact us at:
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold">Sppeeds by Vais Engineering Pvt Ltd</p>
                    <p className="text-muted-foreground">Bangalore, India</p>
                    <p className="text-muted-foreground">Email: support@Sppeeds.com</p>
                    <p className="text-muted-foreground">Phone: +91 1234567890</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}