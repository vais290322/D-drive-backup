import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock, CheckCircle, Package as PackageIcon, Star, Calendar } from 'lucide-react';
import { packagesApi } from '@/db/api';
import type { Package, SearchFilters } from '@/types';

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const result = await packagesApi.search(filters);
      // Handle both direct array and { data, error } response formats
      const data = Array.isArray(result) ? result : (result?.data || []);
      setPackages(data);
    } catch (error) {
      console.error('Failed to load packages:', error);
      setPackages([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadPackages();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Hajj & Umrah Packages</h1>
          <p className="text-muted-foreground">Complete pilgrimage packages with flights, hotels, and guidance</p>
        </div>

        {/* Modern Filter Card */}
        <Card className="mb-8 border-none shadow-lg bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Filter Packages</h2>
              <p className="text-muted-foreground">Customize your search to find the perfect pilgrimage package</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <PackageIcon className="h-4 w-4 text-primary" />
                  Package Type
                </Label>
                <Select
                  value={filters.package_type}
                  onValueChange={(value: any) => setFilters({ ...filters, package_type: value })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hajj">🕋 Hajj</SelectItem>
                    <SelectItem value="umrah">🌙 Umrah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Service Level
                </Label>
                <Select
                  value={filters.service_level}
                  onValueChange={(value: any) => setFilters({ ...filters, service_level: value })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">💼 Economy</SelectItem>
                    <SelectItem value="standard">⭐ Standard</SelectItem>
                    <SelectItem value="premium">👑 Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Travel Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 text-base"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Travel End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 text-base"
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full mt-6 h-12 text-base font-semibold" size="lg">
              Apply Filters
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardHeader>
              </Card>
            ))
          ) : (
            packages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img
                    src={pkg.image_url || 'https://miaoda-site-img.s3cdn.medo.dev/images/026674c5-7dc2-4e9e-abbd-229857234305.jpg'}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">
                    {pkg.package_type.toUpperCase()}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {pkg.name}
                    <span className="text-2xl text-primary">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {pkg.duration_days} days
                    </span>
                    <Badge variant="outline" className="capitalize">
                      {pkg.service_level}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="space-y-2 mb-4">
                    {pkg.includes?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/packages/${pkg.id || (pkg as any)._id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
