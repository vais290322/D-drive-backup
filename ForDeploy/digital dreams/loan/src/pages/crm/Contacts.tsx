import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, User, Mail, Phone, Building2, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { getContacts, deleteContact } from '@/db/crmApi';
import type { ContactWithCompany } from '@/types/types';

export default function Contacts() {
  const [contacts, setContacts] = useState<ContactWithCompany[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<ContactWithCompany | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchTerm, contacts]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contacts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = contacts.filter(
      (contact) =>
        contact.first_name.toLowerCase().includes(term) ||
        contact.last_name.toLowerCase().includes(term) ||
        contact.email?.toLowerCase().includes(term) ||
        contact.phone?.toLowerCase().includes(term) ||
        contact.company?.name.toLowerCase().includes(term) ||
        contact.title?.toLowerCase().includes(term)
    );
    setFilteredContacts(filtered);
  };

  const handleDeleteClick = (contact: ContactWithCompany) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    try {
      await deleteContact(contactToDelete.id);
      toast({
        title: 'Success',
        description: 'Contact deleted successfully',
      });
      loadContacts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-chart-3',
      contacted: 'bg-chart-4',
      qualified: 'bg-success',
      unqualified: 'bg-muted',
    };
    return colors[status] || 'bg-muted';
  };

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <div className="mb-6">
          <h1 className="text-2xl xl:text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground mt-1">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl xl:text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground mt-1">Manage your contact database</p>
        </div>
        <Link to="/crm/contacts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
            <CardTitle>All Contacts ({filteredContacts.length})</CardTitle>
            <div className="relative w-full xl:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No contacts found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first contact'}
              </p>
              {!searchTerm && (
                <Link to="/crm/contacts/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Contact
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Link
                          to={`/crm/contacts/${contact.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {contact.first_name} {contact.last_name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {contact.company ? (
                          <Link
                            to={`/crm/companies/${contact.company.id}`}
                            className="flex items-center hover:text-primary"
                          >
                            <Building2 className="mr-2 h-3 w-3" />
                            {contact.company.name}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{contact.title || '-'}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {contact.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                              {contact.email}
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contact.lead_status)}>
                          {contact.lead_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/crm/contacts/${contact.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(contact)}
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
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {contactToDelete?.first_name}{' '}
              {contactToDelete?.last_name}? This action cannot be undone.
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
