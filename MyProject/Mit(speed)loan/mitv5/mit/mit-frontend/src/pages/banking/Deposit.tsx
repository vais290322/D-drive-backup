import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDownToLine, Search, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  getBankAccounts,
  processDeposit,
  getBankAccountByNumber,
  uploadTransactionDocument
} from '@/db/bankingApi';
import { formatCurrency } from '@/lib/currency';
import TransactionReceipt from '@/components/banking/TransactionReceipt';
import type { BankAccountWithCustomer } from '@/types/types';

export default function Deposit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [accounts, setAccounts] = useState<BankAccountWithCustomer[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccountWithCustomer | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    transactionId: string;
    amount: number;
    newBalance: number;
    transactionDate: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    account_id: '',
    amount: '',
    reference_note: '',
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await getBankAccounts();
      const activeAccounts = data.filter((acc) => acc.status === 'active');
      setAccounts(activeAccounts);
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
      const account = await getBankAccountByNumber(searchTerm.trim());
      if (account) {
        if (account.status !== 'active') {
          toast({
            title: 'Account Inactive',
            description: 'This account is not active',
            variant: 'destructive',
          });
          return;
        }
        setSelectedAccount(account);
        setFormData({ ...formData, account_id: account.id });
        toast({
          title: 'Account Found',
          description: `${account.customer?.full_name} - ${account.account_number}`,
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
        description: 'Failed to search account',
        variant: 'destructive',
      });
    }
  };

  const handleAccountSelect = (accountId: string) => {
    const account = accounts.find((acc) => (acc._id || acc.id) === accountId);
    setSelectedAccount(account || null);
    setFormData({ ...formData, account_id: accountId });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate files
    const validFiles: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: `${file.name}: Only JPEG, PNG, WEBP, GIF, and PDF are allowed.`,
          variant: 'destructive',
        });
        continue;
      }

      if (file.size > 5242880) {
        toast({
          title: 'File Too Large',
          description: `${file.name}: File must be less than 5 MB.`,
          variant: 'destructive',
        });
        continue;
      }

      validFiles.push(file);
    }

    setSelectedFiles([...selectedFiles, ...validFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.account_id) {
      toast({
        title: 'Validation Error',
        description: 'Please select an account',
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid amount greater than 0',
        variant: 'destructive',
      });
      return;
    }

    setConfirmDialogOpen(true);
  };

  const handleConfirmDeposit = async () => {
    try {
      setLoading(true);
      const amount = parseFloat(formData.amount);
      const result = await processDeposit(
        formData.account_id,
        amount,
        formData.reference_note || undefined
      );

      // Upload documents if any
      if (selectedFiles.length > 0 && result.transaction_id) {
        setUploading(true);
        setUploadProgress(0);

        const totalFiles = selectedFiles.length;
        let uploadedCount = 0;

        for (const file of selectedFiles) {
          try {
            await uploadTransactionDocument(result.transaction_id, file);
            uploadedCount++;
            setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
          } catch (error: any) {
            console.error('Error uploading document:', error);
            toast({
              title: 'Document Upload Warning',
              description: `Failed to upload ${file.name}: ${error.message}`,
              variant: 'destructive',
            });
          }
        }

        setUploading(false);
      }

      toast({
        title: 'Deposit Successful',
        description: `Amount: ${formatCurrency(amount)} | New Balance: ${formatCurrency(result.new_balance)}`,
      });

      // Show receipt
      setReceiptData({
        transactionId: result.transaction_id || 'N/A',
        amount,
        newBalance: result.new_balance,
        transactionDate: new Date().toISOString(),
      });
      setReceiptDialogOpen(true);

      // Reset form
      setFormData({
        account_id: '',
        amount: '',
        reference_note: '',
      });
      setSearchTerm('');
      setSelectedFiles([]);
      setConfirmDialogOpen(false);

      // Reload accounts to update balances
      loadAccounts();
    } catch (error: any) {
      console.error('Error processing deposit:', error);
      toast({
        title: 'Deposit Failed',
        description: error.message || 'Failed to process deposit',
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
        <Button variant="ghost" onClick={() => navigate('/banking')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl xl:text-3xl font-bold">Make Deposit</h1>
        <p className="text-muted-foreground mt-1">Add funds to a customer account</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Selection</CardTitle>
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
                    <Button type="button" onClick={handleAccountSearch}>
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
                  <Label htmlFor="account_id">Select Account</Label>
                  <Select value={formData.account_id} onValueChange={handleAccountSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account._id || account.id} value={account._id || account.id}>
                          {account.account_number} - {account.customer?.full_name} (Balance: {formatCurrency(account.balance)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedAccount && (
                  <Card className="bg-muted">
                    <CardContent className="pt-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Customer:</span>
                          <span className="font-medium">{selectedAccount.customer?.full_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Number:</span>
                          <span className="font-medium">{selectedAccount.account_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Type:</span>
                          <span className="font-medium capitalize">{selectedAccount.account_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current Balance:</span>
                          <span className="font-semibold text-success">
                            {formatCurrency(selectedAccount.balance)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deposit Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Deposit Amount (₹) *</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="reference_note">Reference Note (Optional)</Label>
                  <Textarea
                    id="reference_note"
                    name="reference_note"
                    value={formData.reference_note}
                    onChange={handleChange}
                    placeholder="Add a note about this deposit..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Supporting Documents (Optional)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Upload images or PDFs (max 5 MB each)
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div className="flex items-center gap-2">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploading && (
                    <div className="mt-4">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Uploading documents... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={loading || uploading}>
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Process Deposit
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/banking')}
                disabled={loading || uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deposit</DialogTitle>
            <DialogDescription>
              Please review the deposit details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-medium">{selectedAccount?.customer?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Number:</span>
              <span className="font-medium">{selectedAccount?.account_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Balance:</span>
              <span className="font-medium">{formatCurrency(selectedAccount?.balance || 0)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Deposit Amount:</span>
              <span className="font-bold text-success">{formatCurrency(parseFloat(formData.amount || '0'))}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold">New Balance:</span>
              <span className="font-bold text-primary">
                {formatCurrency(Number(selectedAccount?.balance || 0) + parseFloat(formData.amount || '0'))}
              </span>
            </div>
            {formData.reference_note && (
              <div>
                <span className="text-muted-foreground">Note:</span>
                <p className="text-sm mt-1">{formData.reference_note}</p>
              </div>
            )}
            {selectedFiles.length > 0 && (
              <div>
                <span className="text-muted-foreground">Documents:</span>
                <p className="text-sm mt-1">{selectedFiles.length} file(s) will be uploaded</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDeposit} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Deposit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Receipt */}
      {selectedAccount && receiptData && (
        <TransactionReceipt
          open={receiptDialogOpen}
          onClose={() => {
            setReceiptDialogOpen(false);
            setSelectedAccount(null);
            setReceiptData(null);
          }}
          transactionType="deposit"
          account={selectedAccount}
          amount={receiptData.amount}
          referenceNote={formData.reference_note}
          transactionId={receiptData.transactionId}
          transactionDate={receiptData.transactionDate}
          newBalance={receiptData.newBalance}
        />
      )}
    </div>
  );
}

