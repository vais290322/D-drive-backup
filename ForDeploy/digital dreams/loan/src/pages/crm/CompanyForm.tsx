import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getCompanyById, createCompany, updateCompany } from '@/db/crmApi';
import type { Company } from '@/types/types';

export default function CompanyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    employee_count: '',
    annual_revenue: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      loadCompany();
    }
  }, [id]);

  const loadCompany = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const company = await getCompanyById(id);
      if (company) {
        setFormData({
          name: company.name,
          industry: company.industry || '',
          website: company.website || '',
          phone: company.phone || '',
          email: company.email || '',
          address: company.address || '',
          city: company.city || '',
          state: company.state || '',
          country: company.country || '',
          postal_code: company.postal_code || '',
          employee_count: company.employee_count?.toString() || '',
          annual_revenue: company.annual_revenue?.toString() || '',
          notes: company.notes || '',
        });
      }
    } catch (error) {
      console.error('Error loading company:', error);
      toast({
        title: 'Error',
        description: 'Failed to load company',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Company name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const companyData = {
        name: formData.name.trim(),
        industry: formData.industry.trim() || null,
        website: formData.website.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        country: formData.country.trim() || null,
        postal_code: formData.postal_code.trim() || null,
        employee_count: formData.employee_count ? parseInt(formData.employee_count) : null,
        annual_revenue: formData.annual_revenue ? parseFloat(formData.annual_revenue) : null,
        notes: formData.notes.trim() || null,
      };

      if (id) {
        await updateCompany(id, companyData);
        toast({
          title: 'Success',
          description: 'Company updated successfully',
        });
      } else {
        await createCompany(companyData);
        toast({
          title: 'Success',
          description: 'Company created successfully',
        });
      }
      navigate('/crm/companies');
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'create'} company`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/crm/companies')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Button>
        <h1 className="text-2xl xl:text-3xl font-bold">
          {id ? 'Edit Company' : 'Add New Company'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {id ? 'Update company information' : 'Enter company details'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter company name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee_count">Employee Count</Label>
                    <Input
                      id="employee_count"
                      name="employee_count"
                      type="number"
                      value={formData.employee_count}
                      onChange={handleChange}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="annual_revenue">Annual Revenue (₹)</Label>
                    <Input
                      id="annual_revenue"
                      name="annual_revenue"
                      type="number"
                      step="0.01"
                      value={formData.annual_revenue}
                      onChange={handleChange}
                      placeholder="1000000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="United States"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes about this company..."
                  rows={10}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : id ? 'Update Company' : 'Create Company'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/crm/companies')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
