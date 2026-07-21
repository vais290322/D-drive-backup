import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { api } from "@/db/api";
import type { LoanWithDetails, EmiPayment } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Eye, Printer } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PaymentReceipt } from "@/components/loan/PaymentReceipt";
import { generateLoanLedger, calculateLoanSummary } from "@/utils/loanCalculations";

const paymentSchema = z.object({
  amount_paid: z.string().min(1, "Amount is required"),
  payment_mode: z.string().min(1, "Payment mode is required"),
  transaction_reference: z.string().optional(),
  remarks: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function Collections() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<LoanWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<LoanWithDetails | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastPayment, setLastPayment] = useState<EmiPayment | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount_paid: "",
      payment_mode: "cash",
      transaction_reference: "",
      remarks: "",
    },
  });

  // Print receipt function
  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && printRef.current) {
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
  };

  useEffect(() => {
    loadActiveLoans();
  }, []);

  const loadActiveLoans = async () => {
    try {
      setLoading(true);
      const allLoans = await api.loans.getAll();
      const activeLoans = allLoans.filter(loan => loan.status === "active");
      
      // Load EMI schedules for all active loans to get next payment date
      const loansWithSchedule = await Promise.all(
        activeLoans.map(async (loan) => {
          try {
            const emiSchedule = await api.emiSchedule.getByLoan(loan.id);
            // Find the next unpaid EMI
            const nextEmi = emiSchedule.find(emi => 
              emi.status === 'pending' || emi.status === 'overdue' || emi.status === 'partial'
            );
            return {
              ...loan,
              next_emi_date: nextEmi?.due_date || loan.first_emi_date,
              next_emi_status: nextEmi?.status || 'pending',
            };
          } catch (error) {
            console.error(`Error loading EMI schedule for loan ${loan.id}:`, error);
            return {
              ...loan,
              next_emi_date: loan.first_emi_date,
              next_emi_status: 'pending',
            };
          }
        })
      );
      
      setLoans(loansWithSchedule);
    } catch (error) {
      console.error("Error loading loans:", error);
      toast.error("Failed to load loans");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (data: PaymentFormData) => {
    if (!selectedLoan) return;
    
    try {
      setSubmitting(true);
      
      // Calculate current outstanding amount
      const payments = await api.payments.getByLoan(selectedLoan.id);
      const penalties = await api.penalties.getByLoan(selectedLoan.id);
      const ledger = generateLoanLedger(selectedLoan, payments, penalties);
      const summary = calculateLoanSummary(ledger, selectedLoan);
      
      const paymentAmount = Number(data.amount_paid);
      
      // Validate payment amount
      if (paymentAmount <= 0) {
        toast.error("Payment amount must be greater than zero");
        return;
      }
      
      if (paymentAmount > summary.totalOutstanding) {
        const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          }).format(amount);
        };
        
        toast.error(
          `Payment amount cannot be greater than outstanding amount. Outstanding: ${formatCurrency(summary.totalOutstanding)}`,
          { duration: 8000 }
        );
        return;
      }
      
      const payment = await api.payments.create({
        loan_id: selectedLoan.id,
        payment_date: new Date().toISOString().split("T")[0],
        amount_paid: paymentAmount,
        payment_mode: data.payment_mode as "cash" | "upi" | "bank_transfer",
        transaction_reference: data.transaction_reference || null,
        collected_by: null,
        remarks: data.remarks || null,
      });
      
      // Store payment and loan for receipt printing
      setLastPayment(payment);
      
      // Show success message and auto-open receipt for printing
      toast.success("Payment recorded successfully! Preparing receipt...", { duration: 4000 });

      // Give React a tick so the hidden receipt DOM mounts, then open print
      setTimeout(() => {
        try {
          handlePrintReceipt();
        } catch (err) {
          console.error('Auto-print failed:', err);
        }
      }, 300);
      
      setPaymentDialogOpen(false);
      paymentForm.reset();
      loadActiveLoans();
      
      // Don't clear selectedLoan immediately - wait for potential print
      setTimeout(() => {
        // Keep loan data for printing
      }, 100);
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  const openPaymentDialog = (loan: LoanWithDetails) => {
    setSelectedLoan(loan);
    paymentForm.setValue("amount_paid", loan.installment_amount.toString());
    setPaymentDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">EMI Collections</h1>
        <p className="text-muted-foreground">Record EMI payments from customers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="h-16 w-full bg-muted" />
              ))}
            </div>
          ) : loans.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No active loans found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>EMI Amount</TableHead>
                    <TableHead>Next EMI Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => {
                    const isOverdue = (loan as any).next_emi_status === 'overdue';
                    const isPartial = (loan as any).next_emi_status === 'partial';
                    
                    return (
                      <TableRow key={loan.id} className={isOverdue ? 'bg-red-50 dark:bg-red-950/20' : ''}>
                        <TableCell className="font-medium">{loan.loan_id}</TableCell>
                        <TableCell>{loan.customer?.full_name || "-"}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(Number(loan.installment_amount))}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{formatDate((loan as any).next_emi_date || loan.first_emi_date)}</span>
                            {isOverdue && (
                              <Badge variant="destructive" className="text-xs">Overdue</Badge>
                            )}
                            {isPartial && (
                              <Badge variant="secondary" className="text-xs">Partial</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{loan.status.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/loans/${loan.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openPaymentDialog(loan)}
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Collect
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record EMI Payment</DialogTitle>
          </DialogHeader>
          {selectedLoan && (
            <div className="mb-4 rounded-lg border bg-muted/50 p-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan ID:</span>
                  <span className="font-medium">{selectedLoan.loan_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">{selectedLoan.customer?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EMI Amount:</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(Number(selectedLoan.installment_amount))}
                  </span>
                </div>
              </div>
            </div>
          )}
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
                  onClick={() => {
                    setPaymentDialogOpen(false);
                    setSelectedLoan(null);
                  }}
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

      {/* Hidden print component */}
      {lastPayment && selectedLoan && selectedLoan.customer && (
        <div className="hidden">
          <div ref={printRef}>
            <PaymentReceipt
              payment={lastPayment}
              loan={selectedLoan}
              customer={selectedLoan.customer}
            />
          </div>
        </div>
      )}
    </div>
  );
}

