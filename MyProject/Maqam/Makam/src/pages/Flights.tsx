import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plane, Calendar, Users, MapPin, Clock, DollarSign } from 'lucide-react';
import { amadeusApi } from '@/lib/api';

import type { Flight, SearchFilters } from '@/types';
import { demoFlights } from '@/data/demoFlights';
import { useToast } from '@/hooks/use-toast';

export default function Flights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [filters, setFilters] = useState<SearchFilters>({
    departure_city: '',
    arrival_city: '',
    travelers: 1,
  });
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [airportOptions, setAirportOptions] = useState<any[]>([]);
  const [airportDropdownOpen, setAirportDropdownOpen] = useState(false);
  const [airportLoading, setAirportLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  // Airport search handler
  const handleAirportSearch = async () => {
    if (!filters.departure_city) return;
    setAirportLoading(true);
    setAirportDropdownOpen(false);
    try {
      const res = await amadeusApi.searchAirports(filters.departure_city);
      if (res && Array.isArray(res.data)) {
        // Only show those with iataCode
        setAirportOptions(res.data.filter((item: any) => item.iataCode));
        setAirportDropdownOpen(true);
      } else {
        setAirportOptions([]);
        setAirportDropdownOpen(false);
      }
    } catch (err) {
      setAirportOptions([]);
      setAirportDropdownOpen(false);
      toast({ title: 'Airport Search Error', description: 'Could not fetch airports', variant: 'destructive' });
    } finally {
      setAirportLoading(false);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    setLoading(true);
    try {
      // Use Amadeus API
      // Note: We need mapping logic if the backend returns raw Amadeus response
      // For now assuming backend returns list of flights
      const result = await amadeusApi.searchFlights({
        origin: filters.departure_city || 'DEL',
        destination: filters.arrival_city === 'Madinah' ? 'MED' : 'JED',
        date: departureDate || new Date().toISOString().split('T')[0],
        adults: filters.travelers
      });

      // Backend now returns normalized Flight[] array directly
      let data = Array.isArray(result) ? result : [];

      if (data.length === 0) {
        console.log('No flights found, using demo data');
        data = demoFlights;
      }

      setFlights(data);
    } catch (error) {
      console.error('Failed to load flights, using demo data', error);
      setFlights(demoFlights);

      toast({
        title: 'Network Error',
        description: 'Showing demo flights as server is unreachable.',
        variant: 'default',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadFlights();
  };

  const handleBookFlight = (flight: Flight) => {
    navigate('/booking', { state: { type: 'flight', flight, price: flight.price } });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Search Flights</h1>
          <p className="text-muted-foreground">Find the best flights to Jeddah and Madinah</p>
        </div>

        {/* Modern Search Form */}
        <Card className="mb-8 border-none shadow-lg bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Find Your Flight</h2>
              <p className="text-muted-foreground">Search for the best flights to holy destinations</p>
            </div>

            {/* Trip Type Selector */}
            <div className="mb-6">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={tripType === 'one-way' ? 'default' : 'outline'}
                  onClick={() => setTripType('one-way')}
                  className="flex-1"
                >
                  One-Way
                </Button>
                <Button
                  type="button"
                  variant={tripType === 'round-trip' ? 'default' : 'outline'}
                  onClick={() => setTripType('round-trip')}
                  className="flex-1"
                >
                  Round-Trip
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="departure" className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  From
                </Label>
                <div className="relative flex gap-2">
                  <Input
                    id="departure"
                    placeholder="Departure city"
                    value={filters.departure_city}
                    onChange={(e) => setFilters({ ...filters, departure_city: e.target.value })}
                    className="h-12 text-base"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-12 px-4"
                    onClick={handleAirportSearch}
                    disabled={airportLoading || !filters.departure_city}
                  >
                    {airportLoading ? 'Searching...' : 'Search'}
                  </Button>
                  {airportDropdownOpen && airportOptions.length > 0 && (
                    <div className="absolute left-0 top-full z-10 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-auto">
                      {airportOptions.map((item) => (
                        <div
                          key={item.iataCode}
                          className="px-4 py-2 hover:bg-muted cursor-pointer flex justify-between"
                          onClick={() => {
                            setFilters({ ...filters, departure_city: item.iataCode });
                            setAirportDropdownOpen(false);
                          }}
                        >
                          <span>{item.name}</span>
                          <span className="text-muted-foreground">{item.iataCode}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrival" className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  To
                </Label>
                <Select
                  value={filters.arrival_city}
                  onValueChange={(value) => setFilters({ ...filters, arrival_city: value })}
                >
                  <SelectTrigger id="arrival" className="h-12 text-base">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jeddah">Jeddah, Saudi Arabia</SelectItem>
                    <SelectItem value="Madinah">Madinah, Saudi Arabia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="departureDate" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Departure Date
                </Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="h-12 text-base"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {tripType === 'round-trip' && (
                <div className="space-y-2">
                  <Label htmlFor="returnDate" className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Return Date
                  </Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="h-12 text-base"
                    min={departureDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="travelers" className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Travelers
                </Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  value={filters.travelers}
                  onChange={(e) => setFilters({ ...filters, travelers: parseInt(e.target.value) || 1 })}
                  className="h-12 text-base"
                />
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full mt-6 h-12 text-base font-semibold" size="lg">
              <Plane className="h-5 w-5 mr-2" />
              Search Flights
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading flights...</p>
            </div>
          ) : !Array.isArray(flights) || flights.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No flights found. Try adjusting your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            flights.map((flight) => (
              <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Plane className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{flight.airline}</h3>
                          <p className="text-sm text-muted-foreground">{flight.flight_number}</p>
                        </div>
                        {flight.is_direct && (
                          <Badge variant="secondary">Direct Flight</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{flight.departure_city}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(flight.departure_time).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {Math.round((new Date(flight.arrival_time).getTime() - new Date(flight.departure_time).getTime()) / (1000 * 60 * 60))}h
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{flight.arrival_city}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(flight.arrival_time).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {flight.available_seats} seats available
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">₹{flight.price.toLocaleString('en-IN')}</p>
                        <p className="text-sm text-muted-foreground">per person</p>
                      </div>
                      <Button onClick={() => handleBookFlight(flight)}>
                        Book Now
                      </Button>
                    </div>
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
