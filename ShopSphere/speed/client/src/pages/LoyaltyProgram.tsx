import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoyaltyPoints } from "@/components/LoyaltyPoints";
import { Gift, TrendingUp, Award, Star } from "lucide-react";

export default function LoyaltyProgram() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} isLoggedIn={false} />
      
      <main className="flex-1">
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                Sppeeds Loyalty Program
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Earn points on every purchase and redeem them for amazing rewards
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary text-primary-foreground border border-primary-border">
                Start Earning Points
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <LoyaltyPoints
                currentPoints={750}
                pointsToNextReward={1000}
                totalEarned={2450}
              />
              
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <Card>
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                    <CardDescription>Earn and redeem points easily</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary rounded-full p-2 mt-1">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Earn Points</h3>
                        <p className="text-sm text-muted-foreground">
                          Earn 10 points for every ₹100 spent on eligible purchases
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary rounded-full p-2 mt-1">
                        <Gift className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Bonus Points</h3>
                        <p className="text-sm text-muted-foreground">
                          Earn 50 bonus points for every completed order
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary rounded-full p-2 mt-1">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Redeem Rewards</h3>
                        <p className="text-sm text-muted-foreground">
                          Redeem 10 points for ₹1 off your next purchase
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Redemption Options</CardTitle>
                    <CardDescription>Use your points for great rewards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold">Discount on Purchase</h3>
                        <p className="text-sm text-muted-foreground">10 points = ₹1 off</p>
                      </div>
                      <Button variant="outline" size="sm">Redeem</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold">Free Delivery</h3>
                        <p className="text-sm text-muted-foreground">500 points</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Redeem</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold">₹100 Gift Card</h3>
                        <p className="text-sm text-muted-foreground">1000 points</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Redeem</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold font-heading mb-4 text-center">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-center mb-12">
                Everything you need to know about our loyalty program
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      How do I join?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Simply create an account on Sppeeds and start earning points immediately on your next purchase.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Do points expire?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      No, your points never expire as long as your account remains active.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Can I gift points?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, you can transfer points to friends and family through our gifting feature.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Where can I check my balance?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Your current point balance is always visible in your account dashboard and on your receipts.
                    </p>
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