import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, ArrowDownToLine, ArrowUpFromLine, Eye, FileText, Printer, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  getBankAccounts,
  getBankAccountByNumber,
  getTransactionsByAccount,
  getTransactionDocuments,
} from '@/db/bankingApi';
import { formatCurrency } from '@/lib/currency';
import TransactionReceipt from '@/components/banking/TransactionReceipt';
import type { BankAccountWithCustomer, BankTransaction, BankTransactionDocument } from '@/types/types';

export default function Statement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<BankAccountWithCustomer[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccountWithCustomer | null>(null);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Date range filter state
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Receipt dialog state
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    transaction: BankTransaction;
    account: BankAccountWithCustomer;
  } | null>(null);
  
  // Transaction details dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | null>(null);
  const [transactionDocuments, setTransactionDocuments] = useState<BankTransactionDocument[]>([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await getBankAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load accounts',
        variant: 'destructive',
      });
    }
  };

  const handleAccountSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter an account number',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const account = await getBankAccountByNumber(searchTerm.trim());
      if (account) {
        setSelectedAccount(account);
        const txns = await getTransactionsByAccount(account.id);
        setAllTransactions(txns);
        setTransactions(txns);
        setFromDate('');
        setToDate('');
        toast({
          title: 'Statement Loaded',
          description: `Found ${txns.length} transactions`,
        });
      } else {
        toast({
          title: 'Not Found',
          description: 'Account number not found',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load statement',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelect = async (accountId: string) => {
    try {
      setLoading(true);
      const account = accounts.find((acc) => acc.id === accountId);
      if (account) {
        setSelectedAccount(account);
        const txns = await getTransactionsByAccount(accountId);
        setAllTransactions(txns);
        setTransactions(txns);
        setFromDate('');
        setToDate('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    if (!fromDate && !toDate) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one date',
        variant: 'destructive',
      });
      return;
    }

    let filtered = [...allTransactions];

    if (fromDate) {
      const fromDateTime = new Date(fromDate);
      fromDateTime.setHours(0, 0, 0, 0);
      filtered = filtered.filter((txn) => {
        const txnDate = new Date(txn.transaction_date);
        return txnDate >= fromDateTime;
      });
    }

    if (toDate) {
      const toDateTime = new Date(toDate);
      toDateTime.setHours(23, 59, 59, 999);
      filtered = filtered.filter((txn) => {
        const txnDate = new Date(txn.transaction_date);
        return txnDate <= toDateTime;
      });
    }

    setTransactions(filtered);
    toast({
      title: 'Filter Applied',
      description: `Showing ${filtered.length} transactions`,
    });
  };

  const handleClearFilter = () => {
    setFromDate('');
    setToDate('');
    setTransactions(allTransactions);
    toast({
      title: 'Filter Cleared',
      description: `Showing all ${allTransactions.length} transactions`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadReceipt = (transaction: BankTransaction) => {
    if (!selectedAccount) return;
    setReceiptData({ transaction, account: selectedAccount });
    setReceiptDialogOpen(true);
  };

  const handleViewDetails = async (transaction: BankTransaction) => {
    setSelectedTransaction(transaction);
    setDetailsDialogOpen(true);
    
    try {
      const docs = await getTransactionDocuments(transaction.id);
      setTransactionDocuments(docs);
    } catch (error) {
      console.error('Error loading transaction documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transaction documents',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadDocument = (doc: BankTransactionDocument) => {
    window.open(doc.file_url, '_blank');
  };

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 12mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm;
            height: 297mm;
            font-size: 10pt;
            line-height: 1.3;
          }
          
          /* Hide all non-print elements */
          .print\\:hidden {
            display: none !important;
          }
          
          /* Print header that repeats on every page */
          .print-statement-header {
            display: block !important;
            position: relative;
            margin-bottom: 8mm;
          }
          
          .print-statement-header .header-content {
            border-bottom: 2px solid #000;
            padding-bottom: 4mm;
            margin-bottom: 4mm;
          }
          
          .print-statement-header h1 {
            font-size: 18pt;
            font-weight: bold;
            margin: 0 0 2mm 0;
            text-align: center;
          }
          
          .print-statement-header p {
            font-size: 9pt;
            margin: 1mm 0;
            text-align: center;
          }
          
          .print-account-info {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 3mm;
            font-size: 9pt;
            margin-bottom: 4mm;
          }
          
          .print-account-info p {
            margin: 0.5mm 0;
          }
          
          .print-account-info .label {
            font-weight: 600;
            color: #333;
          }
          
          /* Page break controls */
          .print-avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .print-page-break {
            page-break-after: always !important;
            break-after: always !important;
          }
          
          /* Table styling for print */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: auto !important;
            font-size: 9pt !important;
            margin: 0 !important;
          }
          
          thead {
            display: table-header-group !important;
            break-inside: avoid !important;
          }
          
          tbody {
            display: table-row-group !important;
          }
          
          tfoot {
            display: table-footer-group !important;
            break-inside: avoid !important;
          }
          
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: auto !important;
          }
          
          th {
            background-color: #e5e7eb !important;
            border: 1px solid #6b7280 !important;
            padding: 2mm !important;
            font-weight: bold !important;
            font-size: 9pt !important;
            text-align: left !important;
            color: #000 !important;
          }
          
          td {
            border: 1px solid #d1d5db !important;
            padding: 1.5mm !important;
            font-size: 8.5pt !important;
            color: #000 !important;
          }
          
          /* Summary box styling */
          .print-summary {
            background-color: #f3f4f6 !important;
            border: 1.5px solid #9ca3af !important;
            padding: 3mm !important;
            margin: 4mm 0 !important;
            page-break-inside: avoid !important;
          }
          
          .print-summary .summary-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 3mm !important;
          }
          
          .print-summary p {
            margin: 1mm 0 !important;
            font-size: 9pt !important;
          }
          
          .print-summary .label {
            font-weight: 600 !important;
            color: #374151 !important;
          }
          
          .print-summary .value {
            font-size: 11pt !important;
            font-weight: bold !important;
            color: #000 !important;
          }
          
          /* Footer styling */
          .print-footer {
            border-top: 2px solid #000 !important;
            padding-top: 3mm !important;
            margin-top: 5mm !important;
            page-break-inside: avoid !important;
          }
          
          .print-footer .summary-section {
            margin-bottom: 4mm !important;
          }
          
          .print-footer .summary-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 2mm !important;
            font-size: 9pt !important;
          }
          
          .print-footer .footer-text {
            text-align: center !important;
            font-size: 8pt !important;
            color: #6b7280 !important;
            margin-top: 3mm !important;
          }
          
          .print-footer .footer-text p {
            margin: 1mm 0 !important;
          }
          
          /* Remove shadows and rounded corners */
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:border-0 {
            border: 0 !important;
          }
          
          /* Text alignment */
          .text-right {
            text-align: right !important;
          }
          
          .text-center {
            text-align: center !important;
          }
          
          /* Font weights */
          .font-semibold {
            font-weight: 600 !important;
          }
          
          .font-bold {
            font-weight: 700 !important;
          }
          
          /* Colors for amounts */
          .text-success {
            color: #16a34a !important;
          }
          
          .text-destructive {
            color: #dc2626 !important;
          }
          
          /* Ensure proper spacing */
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:mb-4 {
            margin-bottom: 4mm !important;
          }
          
          .print\\:mt-8 {
            margin-top: 8mm !important;
          }
          
          .print\\:pt-4 {
            padding-top: 4mm !important;
          }
        }
      `}</style>
      
      <div className="p-6 xl:p-8">
        <div className="mb-6 print:hidden">
          <Button variant="ghost" onClick={() => navigate('/banking')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl xl:text-3xl font-bold">Account Statement</h1>
          <p className="text-muted-foreground mt-1">View transaction history for any account</p>
        </div>

      <div className="space-y-6">
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Select Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Search by Account Number</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Enter account number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAccountSearch())}
                />
                <Button type="button" onClick={handleAccountSearch} disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or select from list</span>
              </div>
            </div>

            <div>
              <Label>Select Account</Label>
              <Select
                value={selectedAccount?.id || ''}
                onValueChange={handleAccountSelect}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_number} - {account.customer?.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedAccount && (
          <>
            {/* Print Header - Repeats on every page */}
            <div className="hidden print:block print-statement-header">
              <div className="header-content">
                <h1>Digital Dreems</h1>
                <p>Banking Services</p>
                <p>Account Statement</p>
              </div>
              <div className="print-account-info">
                <div>
                  <p className="label">Account Holder:</p>
                  <p>{selectedAccount.customer?.full_name}</p>
                </div>
                <div>
                  <p className="label">Account Number:</p>
                  <p>{selectedAccount.account_number}</p>
                </div>
                <div>
                  <p className="label">Account Type:</p>
                  <p className="capitalize">{selectedAccount.account_type}</p>
                </div>
                <div>
                  <p className="label">Statement Date:</p>
                  <p>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <Card className="print:shadow-none print:border-0">
              <CardHeader className="flex flex-row items-center justify-between print:hidden">
                <CardTitle>Account Information</CardTitle>
                <Button onClick={handlePrint} variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Statement
                </Button>
              </CardHeader>
              <CardContent className="print:p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p className="font-medium">{selectedAccount.customer?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-medium">{selectedAccount.account_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium capitalize">{selectedAccount.account_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="font-semibold text-success text-lg">
                      {formatCurrency(selectedAccount.balance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Status</p>
                    <Badge variant={selectedAccount.status === 'active' ? 'default' : 'secondary'}>
                      {selectedAccount.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Opening Date</p>
                    <p className="font-medium">{formatDate(selectedAccount.opening_date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="print:shadow-none print:border-0">
              <CardHeader className="print:hidden">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                  <CardTitle>Transaction History ({transactions.length})</CardTitle>
                  
                  {/* Date Range Filter */}
                  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <div className="space-y-1">
                        <Label htmlFor="fromDate" className="text-xs">From Date</Label>
                        <Input
                          id="fromDate"
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="w-full sm:w-40"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="toDate" className="text-xs">To Date</Label>
                        <Input
                          id="toDate"
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="w-full sm:w-40"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleDateFilter}
                        variant="default"
                        size="sm"
                        disabled={!fromDate && !toDate}
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        Apply Filter
                      </Button>
                      {(fromDate || toDate) && (
                        <Button
                          onClick={handleClearFilter}
                          variant="outline"
                          size="sm"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="print:p-0">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Print: Summary before transactions */}
                    <div className="hidden print:block print-summary print:mb-4">
                      <div className="summary-grid">
                        <div>
                          <p className="label">Opening Balance:</p>
                          <p className="value">{formatCurrency(transactions[transactions.length - 1]?.balance_after - transactions[transactions.length - 1]?.amount || 0)}</p>
                        </div>
                        <div>
                          <p className="label">Total Transactions:</p>
                          <p className="value">{transactions.length}</p>
                        </div>
                        <div>
                          <p className="label">Current Balance:</p>
                          <p className="value">{formatCurrency(selectedAccount.balance)}</p>
                        </div>
                      </div>
                    </div>

                    <Table>
                      <TableHeader className="print:bg-gray-200">
                        <TableRow>
                          <TableHead className="print:border print:border-gray-400 print:font-bold print:text-black">Date</TableHead>
                          <TableHead className="print:border print:border-gray-400 print:font-bold print:text-black">Time</TableHead>
                          <TableHead className="print:border print:border-gray-400 print:font-bold print:text-black">Type</TableHead>
                          <TableHead className="text-right print:border print:border-gray-400 print:font-bold print:text-black">Debit (Dr)</TableHead>
                          <TableHead className="text-right print:border print:border-gray-400 print:font-bold print:text-black">Credit (Cr)</TableHead>
                          <TableHead className="text-right print:border print:border-gray-400 print:font-bold print:text-black">Balance</TableHead>
                          <TableHead className="print:border print:border-gray-400 print:font-bold print:text-black">Reference</TableHead>
                          <TableHead className="text-center print:hidden">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((txn) => (
                          <TableRow key={txn.id} className="print:border print:border-gray-300">
                            <TableCell className="print:border print:border-gray-300 print:text-xs">{formatDate(txn.transaction_date)}</TableCell>
                            <TableCell className="print:border print:border-gray-300 print:text-xs">{formatTime(txn.transaction_date)}</TableCell>
                            <TableCell className="print:border print:border-gray-300 print:text-xs">
                              <div className="flex items-center gap-2">
                                {txn.transaction_type === 'deposit' ? (
                                  <>
                                    <ArrowDownToLine className="h-4 w-4 text-success print:hidden" />
                                    <Badge className="bg-success print:hidden">Deposit</Badge>
                                    <span className="hidden print:inline">Deposit</span>
                                  </>
                                ) : (
                                  <>
                                    <ArrowUpFromLine className="h-4 w-4 text-destructive print:hidden" />
                                    <Badge variant="destructive" className="print:hidden">Withdrawal</Badge>
                                    <span className="hidden print:inline">Withdrawal</span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right print:border print:border-gray-300 print:text-xs">
                              <span className={txn.transaction_type === 'withdrawal' ? 'text-destructive font-semibold' : ''}>
                                {txn.transaction_type === 'withdrawal' ? formatCurrency(txn.amount) : '-'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right print:border print:border-gray-300 print:text-xs">
                              <span className={txn.transaction_type === 'deposit' ? 'text-success font-semibold' : ''}>
                                {txn.transaction_type === 'deposit' ? formatCurrency(txn.amount) : '-'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium print:border print:border-gray-300 print:text-xs print:font-bold">
                              {formatCurrency(txn.balance_after)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground print:border print:border-gray-300 print:text-xs">
                              {txn.reference_note || '-'}
                            </TableCell>
                            <TableCell className="print:hidden">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadReceipt(txn)}
                                  title="Download Receipt"
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(txn)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Print: Footer on last page */}
                    <div className="hidden print:block print-footer print:mt-8 print:pt-4">
                      <div className="summary-section">
                        <p className="font-semibold" style={{ marginBottom: '2mm', fontSize: '10pt' }}>Statement Summary:</p>
                        <div className="summary-grid">
                          <p><span className="font-semibold">Total Deposits:</span> {formatCurrency(transactions.filter(t => t.transaction_type === 'deposit').reduce((sum, t) => sum + t.amount, 0))}</p>
                          <p><span className="font-semibold">Total Withdrawals:</span> {formatCurrency(transactions.filter(t => t.transaction_type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0))}</p>
                          <p><span className="font-bold">Closing Balance:</span> <span className="font-bold">{formatCurrency(selectedAccount.balance)}</span></p>
                        </div>
                      </div>
                      <div className="footer-text">
                        <p>This is a computer-generated statement and does not require a signature.</p>
                        <p>For any queries, please contact Digital Dreems Banking Services.</p>
                        <p>Generated on: {new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Transaction Receipt Dialog */}
      {receiptData && (
        <TransactionReceipt
          open={receiptDialogOpen}
          onClose={() => setReceiptDialogOpen(false)}
          transactionType={receiptData.transaction.transaction_type}
          account={receiptData.account}
          amount={receiptData.transaction.amount}
          referenceNote={receiptData.transaction.reference_note || undefined}
          transactionId={receiptData.transaction.id}
          transactionDate={receiptData.transaction.transaction_date}
          newBalance={receiptData.transaction.balance_after}
        />
      )}

      {/* Transaction Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                      <p className="font-mono font-semibold">{selectedTransaction.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="font-semibold">
                        {formatDate(selectedTransaction.transaction_date)} at {formatTime(selectedTransaction.transaction_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <Badge
                        className={
                          selectedTransaction.transaction_type === 'deposit'
                            ? 'bg-success'
                            : 'bg-destructive'
                        }
                      >
                        {selectedTransaction.transaction_type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className={`text-xl font-bold ${
                        selectedTransaction.transaction_type === 'deposit'
                          ? 'text-success'
                          : 'text-destructive'
                      }`}>
                        {selectedTransaction.transaction_type === 'deposit' ? '+' : '-'}
                        {formatCurrency(selectedTransaction.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Balance After</p>
                      <p className="text-lg font-semibold">{formatCurrency(selectedTransaction.balance_after)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created By</p>
                      <p className="font-medium">{selectedTransaction.created_by || 'System'}</p>
                    </div>
                  </div>
                  
                  {selectedTransaction.reference_note && (
                    <div>
                      <p className="text-sm text-muted-foreground">Reference Note</p>
                      <p className="font-medium">{selectedTransaction.reference_note}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Attached Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Attached Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionDocuments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No documents attached to this transaction</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactionDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-semibold">{doc.file_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.file_type} • {doc.file_size ? `${(doc.file_size / 1024).toFixed(2)} KB` : 'Unknown size'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Uploaded: {formatDate(doc.uploaded_at)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}
