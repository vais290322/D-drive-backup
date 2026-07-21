import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, User, Mail, Phone, CreditCard, Pencil, Trash2, Eye, ArrowUpDown, X, Calendar as CalendarIcon, Download } from 'lucide-react';
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

import { Calendar } from 'lucide-react';
import NextPaymentDateDialog from '@/components/NextPaymentDateDialog';
import { updateBankCustomer } from '@/db/bankingApi';
import { useAuth } from '@/components/auth/AuthProvider';



export default function Customers() {
  const [customers, setCustomers] = useState<BankCustomerWithAccount[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<BankCustomerWithAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<BankCustomerWithAccount | null>(null);

  // Next Payment Date State
  const [paymentDateDialogOpen, setPaymentDateDialogOpen] = useState(false);
  const [selectedCustomerForDate, setSelectedCustomerForDate] = useState<BankCustomerWithAccount | null>(null);

  // Filter & Sort State
  const [sortOrder, setSortOrder] = useState<'upcoming_payment' | 'default'>('default');
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({ start: '', end: '' });

  const { toast } = useToast();

  const { profile }: any = useAuth();

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers, sortOrder, dateFilter]);

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
    let filtered = [...customers];

    // 1. Search Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.full_name.toLowerCase().includes(term) ||
          customer.phone?.toLowerCase().includes(term) ||
          customer.email?.toLowerCase().includes(term) ||
          customer.accounts?.some((acc) => acc.account_number.toLowerCase().includes(term))
      );
    }

    // 2. Date Range Filter (Next Payment Date)
    if (dateFilter.start || dateFilter.end) {
      filtered = filtered.filter((customer) => {
        if (!customer.next_payment_date) return false;
        const paymentDate = new Date(customer.next_payment_date).getTime();
        const start = dateFilter.start ? new Date(dateFilter.start).getTime() : 0;
        const end = dateFilter.end ? new Date(dateFilter.end).getTime() : Infinity;
        // End date should include the full day
        const endOfDay = dateFilter.end ? new Date(dateFilter.end).setHours(23, 59, 59, 999) : Infinity;

        return paymentDate >= start && paymentDate <= endOfDay;
      });
    }

    // 3. Sorting
    if (sortOrder === 'upcoming_payment') {
      filtered.sort((a, b) => {
        const dateA = a.next_payment_date ? new Date(a.next_payment_date).getTime() : Infinity; // Empty dates go last
        const dateB = b.next_payment_date ? new Date(b.next_payment_date).getTime() : Infinity;
        return dateA - dateB; // Ascending (Soonest first)
      });
    }

    setFilteredCustomers(filtered);
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Accounts', 'Total Balance', 'Next Payment Date'];
    const rows = filteredCustomers.map(customer => {
      const accounts = customer.accounts?.map(acc => acc.account_number).join(', ') || '';
      const balance = getTotalBalance(customer);
      const nextPayment = customer.next_payment_date
        ? new Date(customer.next_payment_date).toLocaleDateString()
        : '';

      return [
        `"${customer.full_name}"`,
        `"${customer.phone || ''}"`,
        `"${customer.email || ''}"`,
        `"${accounts}"`,
        `"${balance}"`,
        `"${nextPayment}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'bank_customers.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
      <div className="p-3 sm:p-6 xl:p-8">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold">Bank Customers</h1>
          <p className="text-muted-foreground mt-1">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 xl:p-8">
      {/* ── Page Header ── */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold">Bank Customers</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your banking customers</p>
        </div>
        {/* 2-col grid on mobile, row on sm+ */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={downloadCSV}>
            <Download className="mr-1 h-4 w-4" />
            Export CSV
          </Button>
          <Link to="/banking/customers/new" className="w-full sm:w-auto">
            <Button size="sm" className="w-full">
              <Plus className="mr-1 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base sm:text-lg">All Customers ({filteredCustomers.length})</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* ── Filter Bar ── */}
          <div className="mb-4 flex flex-col gap-3 border-b pb-4">
            {/* Date filters — stack on mobile, row on sm+ */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-end">
              <div className="grid gap-1 flex-1 min-w-[130px]">
                <label className="text-xs font-medium text-muted-foreground">From Date</label>
                <Input
                  type="date"
                  className="h-8 text-xs"
                  value={dateFilter.start}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="grid gap-1 flex-1 min-w-[130px]">
                <label className="text-xs font-medium text-muted-foreground">To Date</label>
                <Input
                  type="date"
                  className="h-8 text-xs"
                  value={dateFilter.end}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
              {(dateFilter.start || dateFilter.end) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 self-end"
                  onClick={() => setDateFilter({ start: '', end: '' })}
                  title="Clear date filter"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Sort button */}
            <div>
              <Button
                variant={sortOrder === 'upcoming_payment' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'upcoming_payment' ? 'default' : 'upcoming_payment')}
                className="gap-2 w-full sm:w-auto"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort by Upcoming Payment
              </Button>
            </div>
          </div>

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
            <div className="overflow-x-auto w-[95vw] sm:w-full">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Accounts</TableHead>
                    <TableHead>Total Balance</TableHead>
                    <TableHead>Next Payment</TableHead>
                    <TableHead>Last Feedback</TableHead>
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
                              src={customer.photo_url?.[0]?.fileUrl}
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
                              <a
                                href={`tel:${customer.phone}`}
                                className="text-blue-600 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {customer.phone}
                              </a>
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
                      <TableCell>
                        {customer.next_payment_date ? (
                          <div className="flex items-center text-sm gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{new Date(customer.next_payment_date).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {customer.payment_feedback_history && customer.payment_feedback_history.length > 0 ? (
                          <div className="max-w-[250px]">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-xs text-muted-foreground">
                                {new Date(customer.payment_feedback_history[customer.payment_feedback_history.length - 1].date).toLocaleDateString()}
                              </p>
                              {customer.payment_feedback_history[customer.payment_feedback_history.length - 1].payment_date && (
                                <span className="text-xs font-medium text-blue-600">
                                  → {new Date(customer.payment_feedback_history[customer.payment_feedback_history.length - 1].payment_date!).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm truncate" title={customer.payment_feedback_history[customer.payment_feedback_history.length - 1].feedback}>
                              {customer.payment_feedback_history[customer.payment_feedback_history.length - 1].feedback}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No feedback</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCustomerForDate(customer);
                              setPaymentDateDialogOpen(true);
                            }}
                            title="Set Next Payment Date"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
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
                          {["super_admin", "collection_agent"].includes(profile?.role) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(customer)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
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
        <DialogContent className="max-w-[90vw] sm:max-w-md">
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

      {selectedCustomerForDate && (
        <NextPaymentDateDialog
          key={selectedCustomerForDate.id} // Re-mount on customer change
          entityName={selectedCustomerForDate.full_name}
          initialDate={selectedCustomerForDate.next_payment_date}
          open={paymentDateDialogOpen}
          onOpenChange={setPaymentDateDialogOpen}
          feedbackHistory={selectedCustomerForDate.payment_feedback_history || []}
          onSave={async (date, feedback) => {
            const newFeedbackEntry = {
              date: new Date().toISOString(),
              feedback: feedback,
              created_by: 'Admin', // You can replace this with actual user name from auth context
              payment_date: date
            };

            const updatedHistory = [
              ...(selectedCustomerForDate.payment_feedback_history || []),
              newFeedbackEntry
            ];

            await updateBankCustomer(selectedCustomerForDate.id, {
              next_payment_date: date,
              payment_feedback_history: updatedHistory
            });
            loadCustomers(); // Refresh list
          }}
        />
      )}
    </div>
  );
}

