import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  getDealById,
  createDeal,
  updateDeal,
  getCompanies,
  getContacts,
} from '@/db/crmApi';
import type { Company, Contact } from '@/types/types';

export default function DealForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [formData, setFormData] = useState({
    company_id: '',
    contact_id: '',
    title: '',
    description: '',
    value: '',
    currency: 'USD',
    stage: 'lead',
    probability: '0',
    expected_close_date: '',
    priority: 'medium',
    notes: '',
  });

  useEffect(() => {
    loadCompanies();
    loadContacts();
    if (id) {
      loadDeal();
    }
  }, [id]);

  const loadCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const loadDeal = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const deal = await getDealById(id);
      if (deal) {
        setFormData({
          company_id: deal.company_id || '',
          contact_id: deal.contact_id || '',
          title: deal.title,
          description: deal.description || '',
          value: deal.value.toString(),
          currency: deal.currency,
          stage: deal.stage,
          probability: deal.probability.toString(),
          expected_close_date: deal.expected_close_date || '',
          priority: deal.priority,
          notes: deal.notes || '',
        });
      }
    } catch (error) {
      console.error('Error loading deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to load deal',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.value) {
      toast({
        title: 'Validation Error',
        description: 'Title and value are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const dealData = {
        company_id: formData.company_id || null,
        contact_id: formData.contact_id || null,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        value: parseFloat(formData.value),
        currency: formData.currency,
        stage: formData.stage,
        probability: parseInt(formData.probability),
        expected_close_date: formData.expected_close_date || null,
        actual_close_date: null,
        lost_reason: null,
        priority: formData.priority,
        notes: formData.notes.trim() || null,
      };

      if (id) {
        await updateDeal(id, dealData);
        toast({
          title: 'Success',
          description: 'Deal updated successfully',
        });
      } else {
        await createDeal(dealData);
        toast({
          title: 'Success',
          description: 'Deal created successfully',
        });
      }
      navigate('/crm/deals');
    } catch (error) {
      console.error('Error saving deal:', error);
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'create'} deal`,
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
        <Button variant="ghost" onClick={() => navigate('/crm/deals')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Deals
        </Button>
        <h1 className="text-2xl xl:text-3xl font-bold">
          {id ? 'Edit Deal' : 'Create New Deal'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {id ? 'Update deal information' : 'Enter deal details'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Deal Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter deal title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the deal..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_id">Company</Label>
                    <Select
                      value={formData.company_id}
                      onValueChange={(value) => setFormData({ ...formData, company_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Company</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contact_id">Primary Contact</Label>
                    <Select
                      value={formData.contact_id}
                      onValueChange={(value) => setFormData({ ...formData, contact_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contact" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Contact</SelectItem>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.first_name} {contact.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Deal Value (₹) *</Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={handleChange}
                      required
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stage">Stage</Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value) => setFormData({ ...formData, stage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="won">Won</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="probability">Probability (%)</Label>
                    <Input
                      id="probability"
                      name="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.probability}
                      onChange={handleChange}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="expected_close_date">Expected Close Date</Label>
                  <Input
                    id="expected_close_date"
                    name="expected_close_date"
                    type="date"
                    value={formData.expected_close_date}
                    onChange={handleChange}
                  />
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
                  placeholder="Add any additional notes about this deal..."
                  rows={10}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : id ? 'Update Deal' : 'Create Deal'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/crm/deals')}
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

