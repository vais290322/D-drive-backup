import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} isLoggedIn={false} />
      
      <main className="flex-1">
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                About Sppeeds
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your trusted partner for quality engineering tools and equipment in Bangalore.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-heading mb-6">
                  Our Story
                </h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2020, Sppeeds began with a simple mission: to make quality engineering tools accessible to professionals and DIY enthusiasts in Bangalore. What started as a small local shop has grown into a trusted e-commerce platform serving thousands of customers.
                </p>
                <p className="text-muted-foreground mb-4">
                  We understand that the right tools make all the difference in getting the job done right. That's why we carefully curate our inventory to include only the best brands and products that we would trust in our own workshops.
                </p>
                <p className="text-muted-foreground">
                  Today, we're proud to offer fast local delivery, cash on delivery options, and a loyalty program that rewards your continued support.
                </p>
              </div>
              <div className="bg-muted rounded-lg h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-primary/10 text-primary rounded-full p-4 inline-block mb-4">
                    <Users className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Our Team</h3>
                  <p className="text-muted-foreground">
                    Experienced professionals passionate about tools and customer service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at Sppeeds
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6" />
                  </div>
                  <CardTitle>Quality First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We never compromise on quality. Every product in our inventory is carefully selected and tested.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6" />
                  </div>
                  <CardTitle>Customer Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your satisfaction is our success. We go above and beyond to ensure you have the best experience.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We're proud to be part of the Bangalore community and support local professionals and DIYers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold font-heading mb-6">
                Ready to Experience Sppeeds?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of satisfied customers who trust us for their tool needs.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary text-primary-foreground border border-primary-border">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}