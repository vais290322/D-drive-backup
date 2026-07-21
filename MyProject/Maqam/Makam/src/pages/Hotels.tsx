import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Hotel as HotelIcon, MapPin, Star, CheckCircle, DollarSign, Calendar } from 'lucide-react';

import { hotelsAPI } from '@/lib/api';
import type { Hotel, SearchFilters } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    city: 'Makkah',
  });
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const response = await hotelsAPI.getHotels({
        city: filters.city,
        min_price: 0,
        max_price: filters.max_price,
        star_rating: filters.star_rating
      });

      console.log('Hotels API Response:', response);

      // Handle both direct array and { hotels, pagination } response from backend
      // Backend returns { hotels: [...], pagination: {...} }
      let data = Array.isArray(response?.hotels) ? response?.hotels : (response?.hotels || response?.hotels || []);

      // Fallback to demo data if empty
      if (data.length === 0) {
        console.log('No hotels found from API, using demo data');
        data = demoHotels.filter(h =>
          (!filters.city || h.city === filters.city) &&
          (!filters.star_rating || h.star_rating === filters.star_rating)
        );
      }

      setHotels(data);
    } catch (error) {
      console.error('Failed to load hotels, using demo data', error);
      // Fallback to demo data on error
      const data = demoHotels.filter(h =>
        (!filters.city || h.city === filters.city) &&
        (!filters.star_rating || h.star_rating === filters.star_rating)
      );
      setHotels(data);

      toast({
        title: 'Network Error',
        description: 'Showing demo data as server is unreachable.',
        variant: 'default',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadHotels();
  };

  const handleBookHotel = (hotelId: string, price: number) => {
    navigate('/booking', { state: { type: 'hotel', hotelId, price } });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Search Hotels</h1>
          <p className="text-muted-foreground">Find Islamic-friendly hotels near holy sites</p>
        </div>

        {/* Modern Search Form */}
        <Card className="mb-8 border-none shadow-lg bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Find Your Hotel</h2>
              <p className="text-muted-foreground">Discover Islamic-friendly accommodations near holy sites</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  City
                </Label>
                <Select
                  value={filters.city}
                  onValueChange={(value) => setFilters({ ...filters, city: value })}
                >
                  <SelectTrigger id="city" className="h-12 text-base">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Makkah">Makkah</SelectItem>
                    <SelectItem value="Madinah">Madinah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating" className="text-sm font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Star Rating
                </Label>
                <Select
                  value={filters.star_rating?.toString()}
                  onValueChange={(value) => setFilters({ ...filters, star_rating: parseInt(value) })}
                >
                  <SelectTrigger id="rating" className="h-12 text-base">
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="checkIn" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Check-in Date
                </Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="h-12 text-base"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Check-out Date
                </Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="h-12 text-base"
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice" className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Max Price/Night (INR)
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="Any price"
                  value={filters.max_price || ''}
                  onChange={(e) => setFilters({ ...filters, max_price: parseFloat(e.target.value) || undefined })}
                  className="h-12 text-base"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full mt-6 h-12 text-base font-semibold" size="lg">
              <HotelIcon className="h-5 w-5 mr-2" />
              Search Hotels
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground">Loading hotels...</p>
            </div>
          ) : hotels.length === 0 ? (
            <Card className="col-span-2">
              <CardContent className="py-12 text-center">
                <HotelIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No hotels found. Try adjusting your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            hotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={hotel.image_url || 'https://miaoda-site-img.s3cdn.medo.dev/images/f56369c8-ba44-40e1-b3a9-5334fdc66e26.jpg'}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-secondary text-secondary-foreground">
                      {hotel.star_rating} <Star className="h-3 w-3 ml-1 inline" />
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{hotel.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {hotel.location}, {hotel.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{hotel.description}</p>
                  <div className="space-y-2 mb-4">
                    {hotel.distance_to_haram && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{hotel.distance_to_haram} km to Haram</span>
                      </div>
                    )}
                    {hotel.distance_to_masjid_nabawi && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{hotel.distance_to_masjid_nabawi} km to Masjid an-Nabawi</span>
                      </div>
                    )}
                    {hotel.has_prayer_facilities && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Prayer facilities</span>
                      </div>
                    )}
                    {hotel.has_halal_food && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Halal food</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">₹{hotel.price_per_night.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-muted-foreground">per night</p>
                    </div>
                    <Button onClick={() => handleBookHotel(hotel.id || (hotel as any)._id, hotel.price_per_night)}>
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
