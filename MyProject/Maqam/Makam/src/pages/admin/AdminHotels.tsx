import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { hotelsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Search, CheckCircle, XCircle, Eye, Trash2, MapPin, Star, Plus } from 'lucide-react';

interface Hotel {
    _id: string;
    name: string;
    location: string;
    city: string;
    country: string;
    price_per_night: number;
    currency: string;
    star_rating: number;
    is_active: boolean;
    is_verified: boolean;
    images: string[];
    owner_id: any;
}

export default function AdminHotels() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [filterVerified, setFilterVerified] = useState<string>('all');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newHotel, setNewHotel] = useState({
        name: '',
        location: '',
        city: '',
        country: '',
        price_per_night: '',
        currency: 'SAR',
        star_rating: '3',
        description: '',
        amenities: '',
        prayer_facilities: true,
        halal_food: true,
    });
    const { toast } = useToast();

    useEffect(() => {
        loadHotels();
    }, []);

    const loadHotels = async () => {
        try {
            setLoading(true);
            const response: any = await hotelsAPI.getHotels();
            setHotels(response.hotels || []);
        } catch (error: any) {
            console.error('Failed to load hotels:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to load hotels',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyHotel = async (hotelId: string, currentStatus: boolean) => {
        try {
            if (!currentStatus) {
                await hotelsAPI.verifyHotel(hotelId);
                toast({
                    title: 'Success',
                    description: 'Hotel verified successfully',
                });
            } else {
                toast({
                    title: 'Info',
                    description: 'Hotel is already verified',
                });
            }
            loadHotels();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to verify hotel',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteHotel = async (hotelId: string) => {
        if (!confirm('Are you sure you want to delete this hotel?')) return;

        try {
            await hotelsAPI.deleteHotel(hotelId);
            toast({
                title: 'Success',
                description: 'Hotel deleted successfully',
            });
            loadHotels();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete hotel',
                variant: 'destructive',
            });
        }
    };

    const handleCreateHotel = async () => {
        try {
            setCreating(true);
            const hotelData = {
                ...newHotel,
                address: newHotel.location,
                price_per_night: parseFloat(newHotel.price_per_night),
                star_rating: parseInt(newHotel.star_rating),
                amenities: newHotel.amenities.split(',').map(a => a.trim()).filter(Boolean),
            };

            await hotelsAPI.createHotel(hotelData);
            toast({
                title: 'Success',
                description: 'Hotel created successfully',
            });
            setCreateDialogOpen(false);
            resetForm();
            loadHotels();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create hotel',
                variant: 'destructive',
            });
        } finally {
            setCreating(false);
        }
    };

    const resetForm = () => {
        setNewHotel({
            name: '',
            location: '',
            city: '',
            country: '',
            price_per_night: '',
            currency: 'SAR',
            star_rating: '3',
            description: '',
            amenities: '',
            prayer_facilities: true,
            halal_food: true,
        });
    };

    const filteredHotels = hotels.filter((hotel) => {
        const matchesSearch =
            hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.city.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = !filterCity || hotel.city.toLowerCase().includes(filterCity.toLowerCase());

        const matchesVerified =
            filterVerified === 'all' ||
            (filterVerified === 'verified' && hotel.is_verified) ||
            (filterVerified === 'unverified' && !hotel.is_verified);

        return matchesSearch && matchesCity && matchesVerified;
    });

    const cities = Array.from(new Set(hotels.map((h) => h.city)));

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading hotels...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Hotels Management</h1>
                    <p className="text-muted-foreground">Manage and verify hotels in the system</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Hotel
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search hotels..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">City</label>
                            <Input
                                placeholder="Filter by city..."
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Verification Status</label>
                            <select
                                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                value={filterVerified}
                                onChange={(e) => setFilterVerified(e.target.value)}
                            >
                                <option value="all">All Hotels</option>
                                <option value="verified">Verified Only</option>
                                <option value="unverified">Unverified Only</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Hotels</CardDescription>
                        <CardTitle className="text-3xl">{hotels.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Verified</CardDescription>
                        <CardTitle className="text-3xl text-green-600">
                            {hotels.filter((h) => h.is_verified).length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Unverified</CardDescription>
                        <CardTitle className="text-3xl text-orange-600">
                            {hotels.filter((h) => !h.is_verified).length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Cities</CardDescription>
                        <CardTitle className="text-3xl">{cities.length}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Hotels List */}
            <Card>
                <CardHeader>
                    <CardTitle>Hotels ({filteredHotels.length})</CardTitle>
                    <CardDescription>
                        {filteredHotels.length === hotels.length
                            ? 'Showing all hotels'
                            : `Showing ${filteredHotels.length} of ${hotels.length} hotels`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredHotels.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No hotels found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredHotels.map((hotel) => (
                                <div
                                    key={hotel._id}
                                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{hotel.name}</h3>
                                                {hotel.is_verified ? (
                                                    <Badge variant="default" className="bg-green-600">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Unverified
                                                    </Badge>
                                                )}
                                                {!hotel.is_active && (
                                                    <Badge variant="destructive">Inactive</Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {hotel.city}, {hotel.country}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    {hotel.star_rating} Star
                                                </div>
                                                <div className="font-semibold text-foreground">
                                                    {hotel.currency} {hotel.price_per_night.toLocaleString()}/night
                                                </div>
                                            </div>

                                            <p className="text-sm text-muted-foreground">{hotel.location}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            {!hotel.is_verified && (
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => handleVerifyHotel(hotel._id, hotel.is_verified)}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Verify
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteHotel(hotel._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Hotel Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Hotel</DialogTitle>
                        <DialogDescription>Add a new hotel to the system</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Hotel Name *</Label>
                                <Input
                                    id="name"
                                    value={newHotel.name}
                                    onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                                    placeholder="Grand Hotel"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    value={newHotel.city}
                                    onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}
                                    placeholder="Mecca"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Input
                                    id="country"
                                    value={newHotel.country}
                                    onChange={(e) => setNewHotel({ ...newHotel, country: e.target.value })}
                                    placeholder="Saudi Arabia"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Full Address *</Label>
                                <Input
                                    id="location"
                                    value={newHotel.location}
                                    onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
                                    placeholder="123 Main St, Mecca"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price per Night *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={newHotel.price_per_night}
                                    onChange={(e) => setNewHotel({ ...newHotel, price_per_night: e.target.value })}
                                    placeholder="500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency *</Label>
                                <select
                                    id="currency"
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                    value={newHotel.currency}
                                    onChange={(e) => setNewHotel({ ...newHotel, currency: e.target.value })}
                                >
                                    <option value="SAR">SAR</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="star_rating">Star Rating *</Label>
                                <select
                                    id="star_rating"
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                    value={newHotel.star_rating}
                                    onChange={(e) => setNewHotel({ ...newHotel, star_rating: e.target.value })}
                                >
                                    <option value="1">1 Star</option>
                                    <option value="2">2 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="5">5 Stars</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                                value={newHotel.description}
                                onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                                placeholder="Hotel description..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                            <Input
                                id="amenities"
                                value={newHotel.amenities}
                                onChange={(e) => setNewHotel({ ...newHotel, amenities: e.target.value })}
                                placeholder="WiFi, Pool, Gym, Restaurant"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="prayer_facilities"
                                    checked={newHotel.prayer_facilities}
                                    onChange={(e) => setNewHotel({ ...newHotel, prayer_facilities: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="prayer_facilities">Prayer Facilities</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="halal_food"
                                    checked={newHotel.halal_food}
                                    onChange={(e) => setNewHotel({ ...newHotel, halal_food: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="halal_food">Halal Food</Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setCreateDialogOpen(false); resetForm(); }}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateHotel} disabled={creating || !newHotel.name || !newHotel.city}>
                            {creating ? 'Creating...' : 'Create Hotel'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
