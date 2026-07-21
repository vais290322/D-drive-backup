import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, User, Mail, Phone, CreditCard, Pencil, Trash2, Eye } from 'lucide-react';
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
import { getBankCustomers, deleteBankCustomer } from '@/db/bankingApi';
import { formatCurrency } from '@/lib/currency';
import type { BankCustomerWithAccount } from '@/types/types';

export default function Customers() {
  const [customers, setCustomers] = useState<BankCustomerWithAccount[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<BankCustomerWithAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<BankCustomerWithAccount | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getBankCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.full_name.toLowerCase().includes(term) ||
        customer.phone?.toLowerCase().includes(term) ||
        customer.email?.toLowerCase().includes(term) ||
        customer.accounts?.some((acc) => acc.account_number.toLowerCase().includes(term))
    );
    setFilteredCustomers(filtered);
  };

  const handleDeleteClick = (customer: BankCustomerWithAccount) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;

    try {
      await deleteBankCustomer(customerToDelete.id);
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      });
      loadCustomers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete customer',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const getTotalBalance = (customer: BankCustomerWithAccount) => {
    if (!customer.accounts || customer.accounts.length === 0) return 0;
    return customer.accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  };

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <div className="mb-6">
          <h1 className="text-2xl xl:text-3xl font-bold">Bank Customers</h1>
          <p className="text-muted-foreground mt-1">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl xl:text-3xl font-bold">Bank Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your banking customers</p>
        </div>
        <Link to="/banking/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
            <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
            <div className="relative w-full xl:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers or account numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No customers found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Get started by adding your first customer'}
              </p>
              {!searchTerm && (
                <Link to="/banking/customers/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Accounts</TableHead>
                    <TableHead>Total Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {customer.photo_url ? (
                            <img
                              src={customer.photo_url}
                              alt={customer.full_name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <Link
                            to={`/banking/customers/${customer.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {customer.full_name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {customer.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                              {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.accounts && customer.accounts.length > 0 ? (
                          <div className="space-y-1">
                            {customer.accounts.map((acc) => (
                              <div key={acc.id} className="flex items-center text-sm">
                                <CreditCard className="mr-2 h-3 w-3 text-muted-foreground" />
                                {acc.account_number}
                                <Badge
                                  className="ml-2"
                                  variant={acc.status === 'active' ? 'default' : 'secondary'}
                                >
                                  {acc.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No accounts</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-success">
                          {formatCurrency(getTotalBalance(customer))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/banking/customers/${customer.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/banking/customers/${customer.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(customer)}
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
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {customerToDelete?.full_name}? This will also delete
              all associated accounts and transactions. This action cannot be undone.
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

