import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, CreditCard, Pencil, FileText, 
  Calendar, Users, Briefcase, DollarSign, IdCard, Building2, AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getBankCustomerById, getTransactionsByAccount } from '@/db/bankingApi';
import { formatCurrency } from '@/lib/currency';
import type { BankCustomerWithAccount, BankTransaction } from '@/types/types';

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<BankCustomerWithAccount | null>(null);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCustomer();
    }
  }, [id]);

  const loadCustomer = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getBankCustomerById(id);
      if (data) {
        setCustomer(data);
        // Load transactions for first account
        if (data.accounts && data.accounts.length > 0) {
          const txns = await getTransactionsByAccount(data.accounts[0].id);
          setTransactions(txns.slice(0, 10)); // Show last 10 transactions
        }
      } else {
        toast({
          title: 'Not Found',
          description: 'Customer not found',
          variant: 'destructive',
        });
        navigate('/banking/customers');
      }
    } catch (error) {
      console.error('Error loading customer:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customer details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6 xl:p-8">
        <div className="mb-6">
          <h1 className="text-2xl xl:text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/banking/customers')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <h1 className="text-2xl xl:text-3xl font-bold">Customer Details</h1>
          <Link to={`/banking/customers/${customer.id}/edit`}>
            <Button>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Customer
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium">{customer.full_name}</p>
                </div>
                {customer.father_name && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Father's Name</p>
                    <p className="font-medium">{customer.father_name}</p>
                  </div>
                )}
                {customer.mother_name && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mother's Name</p>
                    <p className="font-medium">{customer.mother_name}</p>
                  </div>
                )}
                {customer.date_of_birth && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{formatDate(customer.date_of_birth)}</p>
                    </div>
                  </div>
                )}
                {customer.gender && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gender</p>
                    <p className="font-medium capitalize">{customer.gender}</p>
                  </div>
                )}
                {customer.marital_status && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Marital Status</p>
                    <p className="font-medium capitalize">{customer.marital_status}</p>
                  </div>
                )}
                {customer.nationality && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nationality</p>
                    <p className="font-medium">{customer.nationality}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customer.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Primary Phone</p>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                )}
                {customer.alternate_phone && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Alternate Phone</p>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{customer.alternate_phone}</p>
                    </div>
                  </div>
                )}
                {customer.email && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{customer.email}</p>
                    </div>
                  </div>
                )}
                {customer.emergency_contact_name && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Emergency Contact Name</p>
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{customer.emergency_contact_name}</p>
                    </div>
                  </div>
                )}
                {customer.emergency_contact_phone && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Emergency Contact Phone</p>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{customer.emergency_contact_phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {customer.address && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Address</p>
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="font-medium">{customer.address}</p>
                    </div>
                  </div>
                )}
                {customer.permanent_address && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Permanent Address</p>
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="font-medium">{customer.permanent_address}</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {customer.city && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">City</p>
                      <p className="font-medium">{customer.city}</p>
                    </div>
                  )}
                  {customer.state && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">State</p>
                      <p className="font-medium">{customer.state}</p>
                    </div>
                  )}
                  {customer.pincode && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">PIN Code</p>
                      <p className="font-medium">{customer.pincode}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional & Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional & Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customer.occupation && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Occupation</p>
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{customer.occupation}</p>
                    </div>
                  </div>
                )}
                {customer.annual_income && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Annual Income</p>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-success">{formatCurrency(customer.annual_income)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* KYC & Identity Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard className="h-5 w-5" />
                KYC & Identity Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customer.pan_number && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">PAN Number</p>
                    <div className="flex items-center">
                      <IdCard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium font-mono">{customer.pan_number}</p>
                    </div>
                  </div>
                )}
                {customer.aadhaar_number && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Aadhaar Number</p>
                    <div className="flex items-center">
                      <IdCard className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium font-mono">{customer.aadhaar_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Alternate Bank Details */}
          {(customer.alternate_bank_name || customer.alternate_bank_account_number) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Alternate Bank Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customer.alternate_bank_name && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                      <p className="font-medium">{customer.alternate_bank_name}</p>
                    </div>
                  )}
                  {customer.alternate_bank_account_number && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                      <p className="font-medium font-mono">{customer.alternate_bank_account_number}</p>
                    </div>
                  )}
                  {customer.alternate_bank_ifsc && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">IFSC Code</p>
                      <p className="font-medium font-mono">{customer.alternate_bank_ifsc}</p>
                    </div>
                  )}
                  {customer.alternate_bank_branch && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Branch</p>
                      <p className="font-medium">{customer.alternate_bank_branch}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Accounts ({customer.accounts?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.accounts && customer.accounts.length > 0 ? (
                <div className="space-y-4">
                  {customer.accounts.map((account) => (
                    <Card key={account.id} className="bg-muted">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="font-semibold">{account.account_number}</span>
                          </div>
                          <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                            {account.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Account Type</p>
                            <p className="font-medium capitalize">{account.account_type}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Balance</p>
                            <p className="font-semibold text-success text-lg">
                              {formatCurrency(account.balance)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Opening Date</p>
                            <p className="font-medium">{formatDate(account.opening_date)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/banking/statement?account=${account.account_number}`}>
                              <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-3 w-3" />
                                Statement
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No accounts found</p>
              )}
            </CardContent>
          </Card>

          {transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell>{formatDate(txn.transaction_date)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={txn.transaction_type === 'deposit' ? 'default' : 'destructive'}
                            >
                              {txn.transaction_type}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              txn.transaction_type === 'deposit' ? 'text-success' : 'text-destructive'
                            }`}
                          >
                            {txn.transaction_type === 'deposit' ? '+' : '-'}{formatCurrency(txn.amount)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(txn.balance_after)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Photo</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {customer.photo_url ? (
                <img
                  src={customer.photo_url}
                  alt={customer.full_name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-border"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                  <User className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to={`/banking/customers/${customer.id}/edit`}>
                <Button variant="outline" className="w-full justify-start">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Customer
                </Button>
              </Link>
              {customer.accounts && customer.accounts.length > 0 && (
                <>
                  <Link to={`/banking/deposit`}>
                    <Button variant="outline" className="w-full justify-start">
                      Make Deposit
                    </Button>
                  </Link>
                  <Link to={`/banking/withdraw`}>
                    <Button variant="outline" className="w-full justify-start">
                      Make Withdrawal
                    </Button>
                  </Link>
                  <Link to={`/banking/statement?account=${customer.accounts[0].account_number}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      View Statement
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

