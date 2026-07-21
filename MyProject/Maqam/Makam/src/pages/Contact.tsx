import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-xl text-muted-foreground">We're here to help with your pilgrimage journey</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Phone</CardTitle>
                  <CardDescription>Call us anytime</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg">+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground">24/7 Support Available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>Send us a message</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg">info@maquamholidays.com</p>
              <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>WhatsApp</CardTitle>
                  <CardDescription>Chat with us</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg">+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground">Quick responses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Office</CardTitle>
                  <CardDescription>Visit us</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg">123 Travel Street</p>
              <p className="text-sm text-muted-foreground">New York, NY 10001</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
            <CardDescription>For travelers currently on pilgrimage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-primary">+966 (555) 999-8888</p>
            <p className="text-sm text-muted-foreground mt-2">Available 24/7 for emergencies during your journey</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
