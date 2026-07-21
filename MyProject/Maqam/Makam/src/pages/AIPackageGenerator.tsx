import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, CheckCircle, DollarSign, Users, Calendar } from 'lucide-react';
import { packagesApi, flightsApi, hotelsApi } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function AIPackageGenerator() {
  const [loading, setLoading] = useState(false);
  const [generatedPackages, setGeneratedPackages] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    budget: '',
    duration: '',
    travelers: '1',
    packageType: 'umrah',
    serviceLevel: 'standard',
    specialRequests: '',
    startDate: '',
    endDate: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const generatePackages = async () => {
    setLoading(true);
    try {
      const budget = parseFloat(formData.budget);
      const duration = parseInt(formData.duration);
      
      const [allPackages, flights, hotels] = await Promise.all([
        packagesApi.getAll(),
        flightsApi.getAll(),
        hotelsApi.getByCity('Makkah'),
      ]);

      const filtered = allPackages.filter(pkg => 
        pkg.package_type === formData.packageType &&
        pkg.price <= budget * 1.2 &&
        Math.abs(pkg.duration_days - duration) <= 3
      );

      const suggestions = filtered.slice(0, 5).map((pkg, idx) => ({
        ...pkg,
        matchScore: 100 - (idx * 10),
        highlight: idx === 0 ? 'Best Value' : idx === 1 ? 'Most Popular' : idx === 2 ? 'Premium Choice' : 'Great Option',
      }));

      setGeneratedPackages(suggestions);
      
      toast({
        title: 'Success',
        description: `Generated ${suggestions.length} package suggestions for you`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate packages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Package Generator</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us your preferences and let our intelligent system create the perfect pilgrimage package for you
          </p>
        </div>

        <Card className="mb-8 max-w-4xl mx-auto border-none shadow-lg bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Your Preferences</h2>
              <p className="text-muted-foreground">Tell us what you're looking for and we'll create the perfect package</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Budget (INR)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 250000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Duration (days)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="h-12 text-base"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="h-12 text-base"
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="travelers" className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Number of Travelers
                </Label>
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packageType" className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Package Type
                </Label>
                <Select
                  value={formData.packageType}
                  onValueChange={(value) => setFormData({ ...formData, packageType: value })}
                >
                  <SelectTrigger id="packageType" className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umrah">🌙 Umrah</SelectItem>
                    <SelectItem value="hajj">🕋 Hajj</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceLevel" className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Preferred Service Level
                </Label>
                <Select
                  value={formData.serviceLevel}
                  onValueChange={(value) => setFormData({ ...formData, serviceLevel: value })}
                >
                  <SelectTrigger id="serviceLevel" className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">💼 Economy</SelectItem>
                    <SelectItem value="standard">⭐ Standard</SelectItem>
                    <SelectItem value="premium">👑 Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 xl:col-span-2">
                <Label htmlFor="requests" className="text-sm font-semibold">Special Requests (Optional)</Label>
                <Textarea
                  id="requests"
                  placeholder="e.g., wheelchair access, family rooms, dietary requirements..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="min-h-[100px] text-base"
                />
              </div>
            </div>
            <Button onClick={generatePackages} className="w-full mt-8 h-14 text-lg font-semibold" size="lg" disabled={loading}>
              <Sparkles className="h-5 w-5 mr-2" />
              {loading ? 'Generating Packages...' : 'Generate Custom Packages'}
            </Button>
          </CardContent>
        </Card>

        {generatedPackages.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Your Personalized Package Suggestions</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {generatedPackages.map((pkg, idx) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={pkg.image_url || 'https://miaoda-site-img.s3cdn.medo.dev/images/026674c5-7dc2-4e9e-abbd-229857234305.jpg'}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                      {pkg.highlight}
                    </Badge>
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                      {pkg.matchScore}% Match
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {pkg.name}
                      <span className="text-2xl text-primary">₹{pkg.price.toLocaleString('en-IN')}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
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
                      {pkg.includes?.slice(0, 4).map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate('/booking', { state: { type: 'package', packageId: pkg.id, price: pkg.price } })}
                    >
                      Book This Package
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
