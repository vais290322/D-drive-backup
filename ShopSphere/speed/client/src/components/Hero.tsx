import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, Gift } from "lucide-react";
import heroImage from "@assets/generated_images/E-commerce_hero_banner_image_ac9c87f9.png";

export function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url(${heroImage})`,
        }}
      />
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-white mb-4">
            Quality Engineering Tools
            <br />
            <span className="text-primary">Delivered to Your Door</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Shop premium tools with COD. Earn loyalty points on every purchase.
            Fast local delivery within your area.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="default"
              className="bg-primary hover:bg-primary text-primary-foreground border border-primary-border backdrop-blur-sm"
              data-testid="button-shop-now"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border-white/30"
              data-testid="button-browse-categories"
            >
              Browse Categories
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 mt-12">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">COD Available</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Gift className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Loyalty Rewards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
