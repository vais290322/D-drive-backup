import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Building2, Mail, Phone, Globe, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getCompanies, deleteCompany } from '@/db/crmApi';
import type { Company } from '@/types/types';

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [searchTerm, companies]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast({
        title: 'Error',
        description: 'Failed to load companies',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(term) ||
        company.industry?.toLowerCase().includes(term) ||
        company.email?.toLowerCase().includes(term) ||
        company.city?.toLowerCase().includes(term)
    );
    setFilteredCompanies(filtered);
  };

  const handleDeleteClick = (company: Company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;

    try {
      await deleteCompany(companyToDelete.id);
      toast({
        title: 'Success',
        description: 'Company deleted successfully',
      });
      loadCompanies();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete company',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <div className="mb-6">
          <h1 className="text-2xl xl:text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground mt-1">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl xl:text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground mt-1">Manage your company database</p>
        </div>
        <Link to="/crm/companies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
            <CardTitle>All Companies ({filteredCompanies.length})</CardTitle>
            <div className="relative w-full xl:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No companies found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first company'}
              </p>
              {!searchTerm && (
                <Link to="/crm/companies/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Company
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <Link
                          to={`/crm/companies/${company.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {company.name}
                        </Link>
                      </TableCell>
                      <TableCell>{company.industry || '-'}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {company.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                              {company.email}
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                              {company.phone}
                            </div>
                          )}
                          {company.website && (
                            <div className="flex items-center text-sm">
                              <Globe className="mr-2 h-3 w-3 text-muted-foreground" />
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary"
                              >
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.city && company.country
                          ? `${company.city}, ${company.country}`
                          : company.city || company.country || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/crm/companies/${company.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(company)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {companyToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
