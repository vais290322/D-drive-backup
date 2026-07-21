import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { api, deleteLoan } from "@/db/api";
import { getBusinessSettings } from "@/db/settingsApi";
import type { LoanLedger, Loan, Customer, EmiPayment, Penalty, EmiSchedule, BusinessSettings } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, DollarSign, AlertTriangle, FileText, Download, Printer, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateLoanLedger, calculateLoanSummary } from "@/utils/loanCalculations";
import { LedgerPrint } from "@/components/loan/LedgerPrint";
import { PaymentReceipt } from "@/components/loan/PaymentReceipt";
import { LoanAgreement } from "@/components/loan/LoanAgreement";
import { NOC } from "@/components/loan/NOC";
import { RepaymentSchedule } from "@/components/loan/RepaymentSchedule";

const paymentSchema = z.object({
  amount_paid: z.string().min(1, "Amount is required"),
  payment_mode: z.string().min(1, "Payment mode is required"),
  transaction_reference: z.string().optional(),
  remarks: z.string().optional(),
});

const penaltySchema = z.object({
  penalty_type: z.string().min(1, "Penalty type is required"),
  amount: z.string().min(1, "Amount is required"),
  reason: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;
type PenaltyFormData = z.infer<typeof penaltySchema>;

export default function LoanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ledger, setLedger] = useState<LoanLedger | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const receiptPrintRef = useRef<HTMLDivElement>(null);
  const agreementPrintRef = useRef<HTMLDivElement>(null);
  const nocPrintRef = useRef<HTMLDivElement>(null);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<EmiPayment | null>(null);

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount_paid: "",
      payment_mode: "cash",
      transaction_reference: "",
      remarks: "",
    },
  });

  const penaltyForm = useForm<PenaltyFormData>({
    resolver: zodResolver(penaltySchema),
    defaultValues: {
      penalty_type: "late_emi",
      amount: "",
      reason: "",
    },
  });

  // Print ledger function
  const handlePrintLedger = () => {
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (printWindow && printRef.current) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Loan Ledger - ${ledger?.loan.loan_id}</title>
              <style>
                @media print {
                  @page { margin: 0.5cm; }
                  body { margin: 0; padding: 20px; }
                }
                body { font-family: Arial, sans-serif; }
                .no-print { display: none !important; }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }, 100);
  };

  // Download ledger as CSV
  const handleDownloadLedger = () => {
    if (!ledger) return;

    const calculatedLedger = generateLoanLedger(
      ledger.loan,
      ledger.payment_history,
      ledger.penalty_history
    );

    const csvContent = [
      ['Date', 'Description', 'Debit', 'Credit', 'Principal', 'Interest', 'Penalty', 'Balance'],
      ...calculatedLedger.map(entry => [
        entry.date,
        entry.description,
        entry.debit.toFixed(2),
        entry.credit.toFixed(2),
        entry.principal.toFixed(2),
        entry.interest.toFixed(2),
        entry.penalty.toFixed(2),
        entry.balance.toFixed(2),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ledger_${ledger.loan.loan_id}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Ledger downloaded successfully');
  };

  const printWindowRef = useRef<Window | null>(null);
  const [isPrintingReceipt, setIsPrintingReceipt] = useState(false);

  // ... (handlePrintLedger same)

  // ... (handleDownloadLedger same)

  // Print individual receipt
  const handlePrintReceipt = (payment: EmiPayment) => {
    setSelectedPaymentForReceipt(payment);
    setIsPrintingReceipt(true);
    // Open window immediately to avoid popup blockers
    const win = window.open('', '_blank');
    if (win) {
      win.document.write('<html><body><p>Preparing receipt...</p></body></html>');
      printWindowRef.current = win;
    }
  };

  useEffect(() => {
    if (isPrintingReceipt && selectedPaymentForReceipt && receiptPrintRef.current && printWindowRef.current) {
      // Small delay to ensure render
      const timer = setTimeout(() => {
        const printWindow = printWindowRef.current;
        if (printWindow && receiptPrintRef.current) {
          printWindow.document.body.innerHTML = ''; // Clear "Preparing..."
          printWindow.document.write(`
              <html>
                <head>
                  <title>Payment Receipt</title>
                  <style>
                    @media print {
                      @page { margin: 0.5cm; }
                      body { margin: 0; padding: 20px; }
                    }
                    body { font-family: Arial, sans-serif; }
                    .no-print { display: none !important; }
                  </style>
                </head>
                <body>
                  ${receiptPrintRef.current.innerHTML}
                  <script>
                    window.onload = function() {
                      window.print();
                      window.onafterprint = function() {
                        window.close();
                      };
                    };
                  </script>
                </body>
              </html>
            `);
          printWindow.document.close();
          // Trigger print manually in case onload fired already (since we overwrote doc)
          // But writing a new doc with script usually works. 
          // Better to just call print() directly if possible, but the script injection is robust for keeping window open until print done.

          setIsPrintingReceipt(false);
          printWindowRef.current = null;
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPrintingReceipt, selectedPaymentForReceipt]);

  // Print Loan Agreement
  const handlePrintAgreement = () => {
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (printWindow && agreementPrintRef.current) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Loan Agreement</title>
              <style>
                @media print {
                  @page { margin: 1cm; }
                  body { margin: 0; padding: 20px; }
                }
                body { font-family: Arial, sans-serif; }
                .no-print { display: none !important; }
              </style>
            </head>
            <body>
              ${agreementPrintRef.current.innerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }, 100);
  };

  // Print NOC
  const handlePrintNOC = () => {
    if (!ledger || ledger.total_outstanding > 0) {
      toast.error("NOC can only be generated for fully paid loans");
      return;
    }

    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (printWindow && nocPrintRef.current) {
        printWindow.document.write(`
          <html>
            <head>
              <title>No Objection Certificate</title>
              <style>
                @media print {
                  @page { margin: 1cm; }
                  body { margin: 0; padding: 20px; }
                }
                body { font-family: Arial, sans-serif; }
                .no-print { display: none !important; }
              </style>
            </head>
            <body>
              ${nocPrintRef.current.innerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }, 100);
  };

  // Close Loan
  const handleCloseLoan = async () => {
    if (!id || !ledger) return;

    if (ledger.total_outstanding > 0) {
      toast.error("Cannot close loan with outstanding balance. Please collect all payments first.");
      return;
    }

    if (window.confirm("Are you sure you want to close this loan? This action cannot be undone.")) {
      try {
        setSubmitting(true);
        await api.loans.update(id, {
          status: "completed",
          closed_date: new Date().toISOString(),
        });
        toast.success("Loan closed successfully");
        loadLedger();
      } catch (error) {
        console.error("Error closing loan:", error);
        toast.error("Failed to close loan");
      } finally {
        setSubmitting(false);
      }
    }
  };

  // ... (other handlers same)

  useEffect(() => {
    if (id) {
      loadLedger();
      getBusinessSettings().then(setSettings).catch(console.error);
    }
  }, [id]);

  const loadLedger = async () => {
    if (!id) return;
    try {
      setLoading(true);
      console.log('Fetching details for loan:', id);

      let loan;
      try {
        loan = await api.loans.get(id);
        console.log('Loan fetched:', loan);
      } catch (e) {
        console.error('Failed to fetch loan:', e);
        throw new Error('Failed to fetch loan');
      }

      let payments: EmiPayment[] = [];
      try {
        payments = await api.payments.getByLoan(id);
        console.log('Payments fetched:', payments);
      } catch (e) {
        console.error('Failed to fetch payments:', e);
        toast.error('Failed to load payments history');
      }

      let penalties: Penalty[] = [];
      try {
        penalties = await api.penalties.getByLoan(id);
      } catch (e) {
        console.error('Failed to fetch penalties:', e);
        toast.error('Failed to load penalties');
      }

      let emiSchedule: EmiSchedule[] = [];
      try {
        emiSchedule = await api.schedule.get(id);
        console.log('Schedule fetched:', emiSchedule);

        // Auto-regenerate if empty
        if (emiSchedule.length === 0) {
          console.log('Schedule empty, regenerating...');
          await api.schedule.regenerate(id);
          emiSchedule = await api.schedule.get(id);
        }
      } catch (e) {
        console.error('Failed to fetch schedule:', e);
        try {
          await api.schedule.regenerate(id);
          emiSchedule = await api.schedule.get(id);
        } catch (retryError) {
          console.error('Failed to regenerate schedule:', retryError);
          toast.error('Failed to load EMI schedule - check backend configuration');
        }
      }

      // Fetch customer and product details
      let customer = null;
      let product = null;

      try {
        // Handle both populated object and ID string for customer_id
        if (loan.customer) {
          customer = loan.customer;
        } else if (typeof loan.customer_id === 'object' && loan.customer_id !== null) {
          customer = loan.customer_id;
        } else if (loan.customer_id) {
          customer = await api.customers.get(loan.customer_id);
        }
      } catch (e) {
        console.error('Error fetching customer', e);
      }

      try {
        product = loan.product_id ? await api.products.get(loan.product_id) : null;
      } catch (e) {
        console.error('Error fetching product', e);
      }

      // Calculate ledger data using proper ledger system
      const ledgerEntries = generateLoanLedger(loan, payments, penalties);
      const summary = calculateLoanSummary(ledgerEntries, loan);

      const totalPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);

      // Calculate total payable from EMI schedule (source of truth)
      // EMI schedule already includes principal, interest, and fees
      const emiScheduleTotal = emiSchedule.length > 0 ? emiSchedule.reduce((sum, emi) => sum + emi.emi_amount, 0) : loan.total_payable;

      // Calculate interest from EMI schedule
      const totalInterestFromSchedule = emiSchedule.length > 0 ? emiSchedule.reduce((sum, emi) => sum + emi.interest_component, 0) : 0;

      // Total payable = EMI schedule total + penalties
      const actualTotalPayable = emiScheduleTotal + totalPenalties;

      setLedger({
        loan: {
          ...loan,
          customer: customer || undefined,
          product: product || undefined,
          payments,
          penalties,
          emi_schedule: emiSchedule,
        },
        principal: loan.principal_amount,
        interest: totalInterestFromSchedule || loan.total_interest || 0, // Fallback
        processing_fee: loan.processing_fee,
        insurance_fee: loan.insurance_fee,
        total_penalties: totalPenalties,
        total_payable: actualTotalPayable || loan.total_payable, // Fallback
        total_paid: summary.totalPaid,
        total_outstanding: summary.totalOutstanding,
        payment_history: payments,
        penalty_history: penalties,
      });
    } catch (error) {
      console.error("Error loading loan ledger:", error);
      toast.error("Failed to load loan details");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (data: PaymentFormData) => {
    if (!id) return;
    try {
      setSubmitting(true);
      await api.payments.create({
        loan_id: id,
        payment_date: new Date().toISOString().split("T")[0],
        amount_paid: Number(data.amount_paid),
        payment_mode: data.payment_mode as "cash" | "upi" | "bank_transfer",
        transaction_reference: data.transaction_reference || null,
        collected_by: null,
        remarks: data.remarks || null,
      });
      toast.success("Payment recorded successfully");
      setPaymentDialogOpen(false);
      paymentForm.reset();
      loadLedger();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePenalty = async (data: PenaltyFormData) => {
    if (!id) return;
    try {
      setSubmitting(true);
      await api.penalties.create({
        loan_id: id,
        penalty_type: data.penalty_type as "cheque_bounce" | "ecs_return" | "late_emi" | "manual",
        amount: Number(data.amount),
        reason: data.reason || null,
        applied_by: null,
        applied_at: new Date().toISOString(),
      });
      toast.success("Penalty applied successfully");
      setPenaltyDialogOpen(false);
      penaltyForm.reset();
      loadLedger();
    } catch (error) {
      console.error("Error applying penalty:", error);
      toast.error("Failed to apply penalty");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLoan = async () => {
    if (!id) return;
    try {
      setDeleting(true);
      const result = await deleteLoan(id);
      if (result.success) {
        toast.success(result.message);
        navigate("/loans");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting loan:", error);
      toast.error("Failed to delete loan");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      completed: "secondary",
      defaulted: "destructive",
      closed: "secondary",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 bg-muted" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="h-32 w-full bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!ledger) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Loan not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/loans")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{ledger.loan.loan_id}</h1>
            <p className="text-muted-foreground">
              {ledger.loan.customer?.full_name} • {getStatusBadge(ledger.loan.status)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <DollarSign className="mr-2 h-4 w-4" />
                Collect EMI
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record EMI Payment</DialogTitle>
              </DialogHeader>
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(handlePayment)} className="space-y-4">
                  <FormField
                    control={paymentForm.control}
                    name="amount_paid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="Enter amount" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="payment_mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Mode *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="transaction_reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Reference</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter reference number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter remarks" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPaymentDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Recording..." : "Record Payment"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={penaltyDialogOpen} onOpenChange={setPenaltyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Add Penalty
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply Penalty</DialogTitle>
              </DialogHeader>
              <Form {...penaltyForm}>
                <form onSubmit={penaltyForm.handleSubmit(handlePenalty)} className="space-y-4">
                  <FormField
                    control={penaltyForm.control}
                    name="penalty_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Penalty Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="late_emi">Late EMI</SelectItem>
                            <SelectItem value="cheque_bounce">Cheque Bounce</SelectItem>
                            <SelectItem value="ecs_return">ECS Return</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={penaltyForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="Enter amount" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={penaltyForm.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter reason" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPenaltyDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Applying..." : "Apply Penalty"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handlePrintAgreement}>
            <FileText className="mr-2 h-4 w-4" />
            Loan Agreement
          </Button>

          {ledger.total_outstanding === 0 && (
            <>
              <Button variant="outline" onClick={handlePrintNOC}>
                <FileText className="mr-2 h-4 w-4" />
                Print NOC
              </Button>
              {ledger.loan.status !== "completed" && (
                <Button variant="default" onClick={handleCloseLoan} disabled={submitting}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Close Loan
                </Button>
              )}
            </>
          )}

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Loan</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this loan? This action cannot be undone.
                  <span className="block mt-2 text-destructive font-medium">
                    Warning: This will permanently delete the loan and all associated data including EMI schedule, payments, penalties, and guarantors.
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteLoan} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete Loan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Principal Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(ledger.principal)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(ledger.total_payable)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">{formatCurrency(ledger.total_paid)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(ledger.total_outstanding)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Loan Details</TabsTrigger>
          <TabsTrigger value="schedule">Repayment Schedule</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="penalties">Penalties</TabsTrigger>
          <TabsTrigger value="ledger">Ledger Breakup</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loan ID</p>
                <p className="text-base">{ledger.loan.loan_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer</p>
                <p className="text-base">{ledger.loan.customer?.full_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Product</p>
                <p className="text-base">
                  {ledger.loan.product
                    ? `${ledger.loan.product.brand} ${ledger.loan.product.model}`
                    : "No product"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loan Type</p>
                <p className="text-base capitalize">{ledger.loan.loan_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tenure</p>
                <p className="text-base">{ledger.loan.tenure_months} months</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                <p className="text-base">{ledger.loan.interest_rate}% ({ledger.loan.interest_type})</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Installment Amount</p>
                <p className="text-base">{formatCurrency(ledger.loan.installment_amount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                <p className="text-base">Monthly</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <p className="text-base">{formatDate(ledger.loan.start_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">First EMI Date</p>
                <p className="text-base">{formatDate(ledger.loan.first_emi_date)}</p>
              </div>
            </CardContent>
          </Card>

          {ledger.loan.guarantor_name && (
            <Card>
              <CardHeader>
                <CardTitle>Guarantor Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{ledger.loan.guarantor_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                  <p className="text-base">{ledger.loan.guarantor_mobile || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Relation</p>
                  <p className="text-base">{ledger.loan.guarantor_relation || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-base">{ledger.loan.guarantor_address || "-"}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schedule">
          <RepaymentSchedule
            schedule={ledger.loan.emi_schedule || []}
            emiDayOfMonth={ledger.loan.first_emi_date ? new Date(ledger.loan.first_emi_date).getDate() : 1}
          />
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {ledger.payment_history.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No payments recorded</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledger.payment_history.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.payment_date)}</TableCell>
                        <TableCell>{formatCurrency(payment.amount_paid)}</TableCell>
                        <TableCell className="capitalize">{payment.payment_mode}</TableCell>
                        <TableCell>{payment.transaction_reference || "-"}</TableCell>
                        <TableCell>{payment.remarks || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handlePrintReceipt(payment)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="penalties">
          <Card>
            <CardHeader>
              <CardTitle>Penalties</CardTitle>
            </CardHeader>
            <CardContent>
              {ledger.penalty_history.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No penalties applied</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledger.penalty_history.map((penalty) => (
                      <TableRow key={penalty.id}>
                        <TableCell>{formatDate(penalty.applied_at)}</TableCell>
                        <TableCell className="capitalize">{penalty.penalty_type.replace('_', ' ')}</TableCell>
                        <TableCell>{formatCurrency(penalty.amount)}</TableCell>
                        <TableCell>{penalty.reason || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ledger Breakup</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrintLedger}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadLedger}>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>


              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generateLoanLedger(ledger.loan, ledger.payment_history, ledger.penalty_history).map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className={entry.debit > 0 ? "text-destructive" : ""}>
                        {entry.debit > 0 ? formatCurrency(entry.debit) : "-"}
                      </TableCell>
                      <TableCell className={entry.credit > 0 ? "text-success" : ""}>
                        {entry.credit > 0 ? formatCurrency(entry.credit) : "-"}
                      </TableCell>
                      <TableCell>{formatCurrency(entry.balance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden printable areas - Moved outside tabs to ensure availability */}
      <div className="hidden">
        <div ref={printRef}>
          <LedgerPrint
            loan={ledger.loan}
            customer={ledger.loan.customer || ({} as Customer)}
            ledger={generateLoanLedger(ledger.loan, ledger.payment_history, ledger.penalty_history)}
            summary={calculateLoanSummary(generateLoanLedger(ledger.loan, ledger.payment_history, ledger.penalty_history), ledger.loan)}
          />
        </div>
        <div ref={receiptPrintRef}>
          {selectedPaymentForReceipt && (
            <PaymentReceipt
              payment={selectedPaymentForReceipt}
              loan={ledger.loan}
              customer={ledger.loan.customer || ({} as Customer)}
              settings={settings}
            />
          )}
        </div>
        <div ref={agreementPrintRef}>
          <LoanAgreement
            loan={ledger.loan}
            customer={ledger.loan.customer || ({} as Customer)}
            product={ledger.loan.product}
            settings={settings}
          />
        </div>
        <div ref={nocPrintRef}>
          <NOC
            loan={ledger.loan}
            customer={ledger.loan.customer || ({} as Customer)}
            product={ledger.loan.product}
            settings={settings}
          />
        </div>
      </div>
    </div>
  );
}
