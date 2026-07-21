import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Hotel as HotelIcon, Package, Star, MapPin, Clock, Users, CheckCircle, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { packagesApi } from '@/db/api';
import { hotelsAPI } from '@/lib/api';
import type { Package as PackageType, Hotel } from '@/types';

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState<PackageType[]>([]);
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotelsLoading, setHotelsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedPackages();
    loadFeaturedHotels();
  }, []);

  const loadFeaturedPackages = async () => {
    try {
      const result = await packagesApi.getFeatured();
      const packages = Array.isArray(result) ? result : (result?.data || []);
      setFeaturedPackages(packages);
    } catch (error) {
      console.error('Failed to load packages:', error);
      setFeaturedPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedHotels = async () => {
    try {
      const response = await hotelsAPI.getHotels({ city: 'Makkah' });
      const hotels = Array.isArray(response) ? response : (response?.hotels || response?.data || []);
      // Get top 3 hotels by star rating
      const featured = hotels
        .filter((h: Hotel) => h.is_active && h.star_rating >= 4)
        .sort((a: Hotel, b: Hotel) => (b.star_rating || 0) - (a.star_rating || 0))
        .slice(0, 3);
      setFeaturedHotels(featured);
    } catch (error) {
      console.error('Failed to load hotels:', error);
      setFeaturedHotels([]);
    } finally {
      setHotelsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh-animated page-transition">
      {/* Ultra-Luxury Hero with Particles */}
      <section className="relative h-[750px] flex items-center justify-center overflow-hidden particles">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://miaoda-site-img.s3cdn.medo.dev/images/ea9c3fef-f03c-4393-800f-80240635528f.jpg"
            alt="Kaaba Makkah"
            className="w-full h-full object-cover scale-110 animate-[scale-in_2s_ease-out]"
          />
          <div className="absolute inset-0 gradient-aurora opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-background/95" />
        </div>

        {/* Premium Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="glass-premium max-w-5xl mx-auto p-10 md:p-16 rounded-[2rem] animate-scale-bounce hover-float-3d shadow-luxury">
            <Badge className="mb-8 px-8 py-3 text-base font-bold bg-secondary text-secondary-foreground shadow-neon animate-pulse-glow">
              <Sparkles className="h-5 w-5 mr-2 animate-bounce-slow" />
              World-Class Travel Experience
            </Badge>

            <h1 className="text-6xl md:text-8xl font-black mb-8 text-shimmer leading-tight">
              Your Journey to the Holy Lands
            </h1>

            <p className="text-xl md:text-3xl mb-10 text-foreground/95 max-w-4xl mx-auto leading-relaxed font-medium">
              Experience the spiritual journey of a lifetime with{' '}
              <span className="font-black text-glow">Maquam Holidays</span>
              {' '}— Your trusted partner for unforgettable Hajj and Umrah pilgrimages
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="btn-premium group h-16 px-10 text-xl shadow-glow-intense hover:shadow-neon font-bold rounded-2xl"
              >
                <Link to="/packages">
                  <Package className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  Browse Packages
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="btn-premium h-16 px-10 text-xl glass-ultra border-2 border-white/30 hover:border-white/50 font-bold rounded-2xl shadow-luxury"
              >
                <Link to="/ai-package-generator">
                  <Sparkles className="h-6 w-6 mr-3 animate-pulse" />
                  AI Custom Package
                  <Zap className="h-5 w-5 ml-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Floating Elements */}
        <div className="absolute top-32 left-20 w-24 h-24 rounded-full bg-primary/30 blur-3xl animate-float shadow-glow" />
        <div className="absolute bottom-32 right-20 w-40 h-40 rounded-full bg-secondary/30 blur-3xl animate-float [animation-delay:1.5s] shadow-gold" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-accent/20 blur-3xl animate-float [animation-delay:0.75s]" />
      </section>

      {/* Ultra-Premium Service Cards */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pattern-islamic opacity-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 animate-slide-up">
            <Badge className="mb-6 px-6 py-3 bg-primary/10 text-primary border-2 border-primary/30 font-bold text-base shadow-glow">
              <Star className="h-5 w-5 mr-2 animate-pulse" />
              Premium Services
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-shimmer">
              Start Your Journey
            </h2>
            <p className="text-muted-foreground text-2xl max-w-3xl mx-auto font-medium">
              Choose your perfect pilgrimage experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Flights Card */}
            <Card className="group relative overflow-hidden border-none shadow-luxury hover-float-3d transition-all duration-700 animate-fade-blur">
              <div className="absolute inset-0 gradient-islamic opacity-0 group-hover:opacity-15 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/b333d56c-5724-4d87-af3a-e095dc57f19a.jpg"
                  alt="Book Flights"
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-primary rounded-2xl shadow-glow-intense group-hover:shadow-neon transition-shadow duration-500 animate-pulse-glow">
                      <Plane className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-white text-4xl font-black">Flights</CardTitle>
                  </div>
                </div>
              </div>

              <CardContent className="p-8 space-y-6">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Premium flights to Jeddah and Madinah with flexible schedules and best prices
                </p>
                <Button asChild className="btn-premium w-full h-14 text-lg font-bold shadow-glow hover:shadow-neon rounded-xl group/btn">
                  <Link to="/flights">
                    Search Flights
                    <Plane className="h-5 w-5 ml-3 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Hotels Card */}
            <Card className="group relative overflow-hidden border-none shadow-luxury hover-float-3d transition-all duration-700 animate-fade-blur [animation-delay:150ms]">
              <div className="absolute inset-0 gradient-islamic opacity-0 group-hover:opacity-15 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/dc416959-c565-49bc-9992-a7d88060882d.jpg"
                  alt="Book Hotels"
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-primary rounded-2xl shadow-glow-intense group-hover:shadow-neon transition-shadow duration-500 animate-pulse-glow">
                      <HotelIcon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-white text-4xl font-black">Hotels</CardTitle>
                  </div>
                </div>
              </div>

              <CardContent className="p-8 space-y-6">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Luxury accommodations near Haram and Masjid an-Nabawi with premium amenities
                </p>
                <Button asChild className="btn-premium w-full h-14 text-lg font-bold shadow-glow hover:shadow-neon rounded-xl group/btn">
                  <Link to="/hotels">
                    Search Hotels
                    <HotelIcon className="h-5 w-5 ml-3 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Packages Card */}
            <Card className="group relative overflow-hidden border-none shadow-luxury hover-float-3d transition-all duration-700 animate-fade-blur [animation-delay:300ms]">
              <div className="absolute inset-0 gradient-gold opacity-0 group-hover:opacity-15 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent" />

              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/10801a18-ad94-4d69-8753-24679f169641.jpg"
                  alt="Complete Packages"
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-secondary rounded-2xl shadow-gold animate-pulse-glow">
                      <Package className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <CardTitle className="text-white text-4xl font-black">Packages</CardTitle>
                  </div>
                </div>
              </div>

              <CardContent className="p-8 space-y-6">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  All-inclusive Hajj and Umrah packages with flights, hotels, and dedicated support
                </p>
                <Button asChild variant="secondary" className="btn-premium w-full h-14 text-lg font-bold shadow-gold rounded-xl group/btn">
                  <Link to="/packages">
                    View Packages
                    <Package className="h-5 w-5 ml-3 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Featured Hotels */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="absolute inset-0 pattern-islamic opacity-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 animate-slide-up">
            <Badge className="mb-6 px-6 py-3 bg-primary/10 text-primary border-2 border-primary/30 font-bold text-base shadow-glow">
              <HotelIcon className="h-5 w-5 mr-2 animate-pulse" />
              Premium Accommodations
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-shimmer">
              Featured Hotels
            </h2>
            <p className="text-muted-foreground text-2xl max-w-3xl mx-auto font-medium">
              Luxury stays near the holy sites
            </p>
          </div>

          {hotelsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border-none shadow-luxury animate-pulse">
                  <div className="h-72 bg-gradient-to-br from-muted/50 to-muted/30" />
                  <CardHeader className="space-y-4 p-8">
                    <div className="h-8 bg-muted/50 rounded-xl w-3/4" />
                    <div className="h-6 bg-muted/50 rounded-lg w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredHotels.map((hotel, idx) => (
                <Card
                  key={hotel._id}
                  className="group overflow-hidden border-none shadow-luxury hover-float-3d transition-all duration-700 animate-rotate-in"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={hotel.image_url || 'https://miaoda-site-img.s3cdn.medo.dev/images/dc416959-c565-49bc-9992-a7d88060882d.jpg'}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Star Rating Badge */}
                    <Badge className="absolute top-6 right-6 bg-secondary text-secondary-foreground shadow-neon px-4 py-2 text-sm font-bold">
                      {[...Array(hotel.star_rating || 5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 inline fill-current" />
                      ))}
                    </Badge>

                    {/* City Badge */}
                    <Badge className="absolute top-6 left-6 glass-premium text-white px-4 py-2 text-sm font-bold">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hotel.city}
                    </Badge>
                  </div>

                  <CardHeader className="p-8">
                    <CardTitle className="text-3xl font-black group-hover:text-gradient transition-colors mb-3">
                      {hotel.name}
                    </CardTitle>
                    <CardDescription className="flex items-start gap-2 text-base font-medium">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span className="line-clamp-2">{hotel.address || hotel.location}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6 p-8">
                    {hotel.description && (
                      <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                        {hotel.description}
                      </p>
                    )}

                    <div className="glass-premium p-6 rounded-2xl">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-4xl font-black text-gradient">
                            ₹{hotel.price_per_night?.toLocaleString()}
                          </span>
                          <span className="text-base text-muted-foreground font-medium ml-2">per night</span>
                        </div>
                        <Badge variant="outline" className="border-primary/30 text-primary font-bold">
                          {hotel.currency || 'INR'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-8">
                    <Button
                      asChild
                      className="btn-premium w-full h-14 text-lg group/btn shadow-glow-intense hover:shadow-neon font-bold rounded-xl"
                    >
                      <Link to={`/hotels`} state={{ selectedHotel: hotel._id }}>
                        Book Now
                        <ArrowRight className="h-5 w-5 ml-3 group-hover/btn:translate-x-2 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* View All Hotels CTA */}
          <div className="text-center mt-16 animate-fade-in">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="btn-premium h-16 px-12 text-xl glass-ultra border-2 border-primary/30 hover:border-primary/50 font-bold rounded-2xl shadow-luxury"
            >
              <Link to="/hotels">
                <HotelIcon className="h-6 w-6 mr-3" />
                View All Hotels
                <ArrowRight className="h-6 w-6 ml-3" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Featured Packages */}
      <section className="py-24 relative bg-gradient-to-b from-transparent via-muted/40 to-transparent overflow-hidden">
        <div className="absolute inset-0 particles opacity-40" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 animate-slide-up">
            <Badge className="mb-6 px-6 py-3 bg-secondary/10 text-secondary border-2 border-secondary/30 font-bold text-base shadow-gold">
              <Star className="h-5 w-5 mr-2 animate-pulse" />
              Handpicked Excellence
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-shimmer">
              Featured Packages
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Curated experiences for your spiritual journey
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border-none shadow-luxury animate-pulse">
                  <div className="h-72 bg-gradient-to-br from-muted/50 to-muted/30" />
                  <CardHeader className="space-y-4 p-8">
                    <div className="h-8 bg-muted/50 rounded-xl w-3/4" />
                    <div className="h-6 bg-muted/50 rounded-lg w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-3 p-8">
                    <div className="h-5 bg-muted/50 rounded w-full" />
                    <div className="h-5 bg-muted/50 rounded w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredPackages.map((pkg, idx) => (
                <Card
                  key={pkg.id}
                  className="group overflow-hidden border-none shadow-luxury hover-float-3d transition-all duration-700 animate-rotate-in"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={pkg.image_url || 'https://miaoda-site-img.s3cdn.medo.dev/images/026674c5-7dc2-4e9e-abbd-229857234305.jpg'}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <Badge className="absolute top-6 right-6 bg-secondary text-secondary-foreground shadow-neon px-4 py-2 text-sm font-bold animate-shimmer">
                      <Star className="h-4 w-4 mr-2" />
                      {pkg.category}
                    </Badge>
                  </div>

                  <CardHeader className="p-8">
                    <CardTitle className="text-3xl font-black group-hover:text-gradient transition-colors mb-3">
                      {pkg.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-lg font-medium">
                      <MapPin className="h-5 w-5 text-primary" />
                      {pkg.destination || 'Makkah & Madinah'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6 p-8">
                    <div className="flex items-center justify-between text-base font-medium">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        {pkg.duration || '7'} Days
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-5 w-5" />
                        Max {pkg.max_participants || '50'}
                      </div>
                    </div>

                    <div className="glass-premium p-6 rounded-2xl">
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-gradient">
                          ₹{pkg.price?.toLocaleString()}
                        </span>
                        <span className="text-base text-muted-foreground font-medium">per person</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-8">
                    <Button asChild className="btn-premium w-full h-14 text-lg group/btn shadow-glow-intense hover:shadow-neon font-bold rounded-xl">
                      <Link to={`/packages/${pkg.id}`}>
                        View Details
                        <ArrowRight className="h-5 w-5 ml-3 group-hover/btn:translate-x-2 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ultra-Premium Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-aurora opacity-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-shimmer">
              Why Choose Maquam Holidays
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Excellence in every detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle, title: "100% Verified", desc: "All services thoroughly verified", color: "primary" },
              { icon: Users, title: "24/7 Support", desc: "Expert assistance anytime", color: "primary" },
              { icon: Star, title: "Premium Quality", desc: "Uncompromising standards", color: "secondary" },
              { icon: Sparkles, title: "Best Value", desc: "Transparent competitive pricing", color: "secondary" }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass-premium p-10 rounded-3xl text-center hover-magnetic transition-all duration-500 shadow-luxury hover:shadow-glow-intense animate-scale-bounce"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <div className={`inline-flex p-5 rounded-3xl mb-6 shadow-${feature.color === 'secondary' ? 'gold' : 'glow-intense'} ${feature.color === 'secondary' ? 'bg-secondary/20' : 'bg-primary/20'} animate-pulse-glow`}>
                  <feature.icon className={`h-10 w-10 ${feature.color === 'secondary' ? 'text-secondary' : 'text-primary'}`} />
                </div>
                <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-lg font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
