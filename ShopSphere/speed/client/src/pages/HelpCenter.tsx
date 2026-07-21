import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Phone, Mail, MessageCircle, HelpCircle, ShoppingCart, User, CreditCard } from "lucide-react";

export default function HelpCenter() {
  const faqCategories = [
    {
      id: "ordering",
      title: "Ordering & Payment",
      icon: <ShoppingCart className="h-5 w-5" />,
      faqs: [
        {
          question: "How do I place an order?",
          answer: "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You can pay online or choose cash on delivery."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept cash on delivery, UPI payments, credit/debit cards, and net banking. All transactions are secure."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "You can modify or cancel your order as long as it hasn't been packed. Contact our customer support immediately for assistance."
        }
      ]
    },
    {
      id: "delivery",
      title: "Delivery & Returns",
      icon: <MessageCircle className="h-5 w-5" />,
      faqs: [
        {
          question: "What are your delivery hours?",
          answer: "We deliver from 9 AM to 8 PM, Monday through Saturday. Orders placed after 4 PM will be processed the next business day."
        },
        {
          question: "Do you deliver to my area?",
          answer: "We currently deliver within a 5km radius of our store in Bangalore. Enter your pin code in the delivery area checker to confirm."
        },
        {
          question: "What is your return policy?",
          answer: "We offer a 7-day return policy for unused, undamaged items in original packaging. Contact support to initiate a return."
        }
      ]
    },
    {
      id: "account",
      title: "Account & Profile",
      icon: <User className="h-5 w-5" />,
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click on the 'Login' button in the header and select 'Register'. Fill in your details to create an account."
        },
        {
          question: "How do I reset my password?",
          answer: "On the login page, click 'Forgot Password' and enter your email address. We'll send you a link to reset your password."
        },
        {
          question: "Can I update my delivery address?",
          answer: "Yes, you can update your delivery address in your account settings or during checkout."
        }
      ]
    },
    {
      id: "loyalty",
      title: "Loyalty Program",
      icon: <CreditCard className="h-5 w-5" />,
      faqs: [
        {
          question: "How do I earn loyalty points?",
          answer: "You earn 10 points for every ₹100 spent and 50 bonus points for each completed order."
        },
        {
          question: "How do I redeem my points?",
          answer: "You can redeem points during checkout or convert them to gift cards in your account dashboard."
        },
        {
          question: "Do loyalty points expire?",
          answer: "No, your points never expire as long as your account remains active."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} isLoggedIn={false} />
      
      <main className="flex-1">
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                Help Center
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find answers to common questions or contact our support team
              </p>
              
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search help articles..."
                  className="w-full pl-10 py-6 text-base"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                <Card className="hover-elevate transition-all">
                  <CardHeader>
                    <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Phone className="h-6 w-6" />
                    </div>
                    <CardTitle>Call Us</CardTitle>
                    <CardDescription>Mon-Sat, 9AM-6PM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold font-heading mb-4">+91 1234567890</p>
                    <Button variant="outline" className="w-full">Call Now</Button>
                  </CardContent>
                </Card>
                
                <Card className="hover-elevate transition-all">
                  <CardHeader>
                    <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6" />
                    </div>
                    <CardTitle>Email Us</CardTitle>
                    <CardDescription>24/7 support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold font-heading mb-4">support@Sppeeds.com</p>
                    <Button variant="outline" className="w-full">Send Email</Button>
                  </CardContent>
                </Card>
                
                <Card className="hover-elevate transition-all">
                  <CardHeader>
                    <div className="bg-primary/10 text-primary rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <CardTitle>Live Chat</CardTitle>
                    <CardDescription>Instant assistance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Chat with our support team</p>
                    <Button className="w-full">Start Chat</Button>
                  </CardContent>
                </Card>
              </div>
              
              <h2 className="text-3xl font-bold font-heading mb-8 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {faqCategories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {category.icon}
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible>
                        {category.faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-primary/10 text-primary rounded-full p-4 inline-block mb-6">
                <HelpCircle className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-bold font-heading mb-4">
                Still Need Help?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our customer support team is ready to assist you with any questions or concerns
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Support
                </Button>
                <Button size="lg" variant="outline">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Support
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}