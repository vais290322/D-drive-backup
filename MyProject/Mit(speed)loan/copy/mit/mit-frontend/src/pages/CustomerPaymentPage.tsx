import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { api } from "@/db/api";
import type { LoanLedger, Customer, EmiPayment, Penalty, EmiSchedule } from "@/types/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { generateLoanLedger, calculateLoanSummary } from "@/utils/loanCalculations";
import { LedgerPrint } from "@/components/loan/LedgerPrint";
import { CustomerPaymentSchedule } from "@/components/loan/CustomerPaymentSchedule";
import { Zap, IndianRupee, TrendingUp, AlertCircle, CheckCircle2, Phone } from "lucide-react";
import mit from "../../public/images/logo/mit.png"


export default function CustomerPaymentPage() {
  const { id } = useParams();
  const [ledger, setLedger] = useState<LoanLedger | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadLedger();
    }
  }, [id]);

  const loadLedger = async () => {
    if (!id) return;
    try {
      setLoading(true);

      let loan;
      try {
        loan = await api.loans.get(id);
      } catch (e) {
        console.error('Failed to fetch loan:', e);
        throw new Error('Failed to fetch loan');
      }

      let payments: EmiPayment[] = [];
      try {
        payments = await api.payments.getByLoan(id);
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
        if (emiSchedule.length === 0) {
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

      let customer = null;
      let product = null;

      try {
        if (loan?.customer) {
          customer = loan.customer;
        } else if (typeof loan?.customer_id === 'object' && loan?.customer_id !== null) {
          customer = loan.customer_id;
        } else if (loan?.customer_id) {
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

      const ledgerEntries = generateLoanLedger(loan, payments, penalties);
      const summary = calculateLoanSummary(ledgerEntries, loan);

      const totalPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);
      const emiScheduleTotal = emiSchedule.length > 0 ? emiSchedule.reduce((sum, emi) => sum + emi.emi_amount, 0) : loan.total_payable;
      const totalInterestFromSchedule = emiSchedule.length > 0 ? emiSchedule.reduce((sum, emi) => sum + emi.interest_component, 0) : 0;
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
        interest: totalInterestFromSchedule || loan.total_interest || 0,
        processing_fee: loan.processing_fee,
        insurance_fee: loan.insurance_fee,
        total_penalties: totalPenalties,
        total_payable: actualTotalPayable || loan.total_payable,
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
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900">
        {/* Header Skeleton */}
        <div className="px-4 pt-8 pb-6 text-center space-y-2">
          <Skeleton className="h-8 w-48 bg-white/20 mx-auto rounded-full" />
          <Skeleton className="h-5 w-64 bg-white/10 mx-auto rounded" />
        </div>
        {/* Cards Skeleton */}
        <div className="px-4 pb-6 grid gap-3 grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="h-28 w-full bg-white/10 rounded-2xl" />
          ))}
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-t-3xl min-h-screen px-4 pt-6">
          <Skeleton className="h-10 w-full bg-muted rounded-xl" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!ledger) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 gap-4 px-4">
        <div className="bg-white/10 rounded-full p-6">
          <AlertCircle className="h-12 w-12 text-white" />
        </div>
        <p className="text-white text-xl font-semibold">Loan Not Found</p>
        <p className="text-white/60 text-sm text-center">Please check the link or contact MIT Electro World support.</p>
      </div>
    );
  }

  const paidPercent = ledger.total_payable > 0
    ? Math.min(100, Math.round((ledger.total_paid / ledger.total_payable) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900">

      {/* ── Brand Hero Header ── */}
      <div className="px-4 pt-8 pb-2 text-center relative">
        {/* Logo Icon */}
        <div className="flex items-center justify-center mb-3">
          <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl">
            <div className="bg-yellow-400 rounded-xl p-2">
              {/* <Zap className="h-5 w-5 text-yellow-900" fill="currentColor" /> */}
              <img src={mit} alt="" className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-white font-extrabold text-base sm:text-lg leading-tight tracking-wide">MIT Electro World</p>
              <p className="text-white/60 text-[10px] sm:text-xs tracking-widest uppercase">Customer Payment Portal</p>
            </div>
          </div>
        </div>

        {/* Customer greeting */}
        <h1 className="text-white font-bold text-xl sm:text-2xl mt-2 truncate px-2">
          {ledger.loan.customer?.full_name || "Welcome"}
        </h1>
        <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
          <span className="text-white/60 text-sm font-mono">{ledger.loan.loan_id}</span>
          <span className="text-white/30">•</span>
          {getStatusBadge(ledger.loan.status)}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 max-w-md mx-auto px-2">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>Repayment Progress</span>
            <span className="font-semibold text-white">{paidPercent}%</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${paidPercent}%`,
                background: paidPercent >= 100
                  ? "linear-gradient(90deg, #22c55e, #16a34a)"
                  : "linear-gradient(90deg, #60a5fa, #a78bfa)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="px-4 py-5 grid gap-3 grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
        {/* Principal */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex flex-col gap-1 shadow">
          <div className="flex items-center gap-1.5">
            <IndianRupee className="h-4 w-4 text-blue-300" />
            <p className="text-white/60 text-xs font-medium">Principal</p>
          </div>
          <p className="text-white font-bold text-base sm:text-lg leading-tight">{formatCurrency(ledger.principal)}</p>
        </div>

        {/* Total Payable */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex flex-col gap-1 shadow">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-purple-300" />
            <p className="text-white/60 text-xs font-medium">Total Payable</p>
          </div>
          <p className="text-white font-bold text-base sm:text-lg leading-tight">{formatCurrency(ledger.total_payable)}</p>
        </div>

        {/* Total Paid */}
        <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-4 flex flex-col gap-1 shadow">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-300" />
            <p className="text-green-200/70 text-xs font-medium">Paid</p>
          </div>
          <p className="text-green-300 font-bold text-base sm:text-lg leading-tight">{formatCurrency(ledger.total_paid)}</p>
        </div>

        {/* Outstanding */}
        <div className={`${ledger.total_outstanding > 0 ? "bg-red-500/20 border-red-400/30" : "bg-green-500/20 border-green-400/30"} backdrop-blur-sm border rounded-2xl p-4 flex flex-col gap-1 shadow`}>
          <div className="flex items-center gap-1.5">
            <AlertCircle className={`h-4 w-4 ${ledger.total_outstanding > 0 ? "text-red-300" : "text-green-300"}`} />
            <p className={`text-xs font-medium ${ledger.total_outstanding > 0 ? "text-red-200/70" : "text-green-200/70"}`}>Outstanding</p>
          </div>
          <p className={`font-bold text-base sm:text-lg leading-tight ${ledger.total_outstanding > 0 ? "text-red-300" : "text-green-300"}`}>
            {formatCurrency(ledger.total_outstanding)}
          </p>
        </div>
      </div>

      {/* ── White Sheet Content ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-t-3xl min-h-[60vh] px-3 sm:px-6 pt-6 pb-12 shadow-2xl">

        <Tabs defaultValue="schedule" className="w-full">
          {/* Scrollable Tabs */}
          <div className="overflow-x-auto pb-1 w-[95vw] sm:w-full">
            <TabsList className="w-max sm:w-full inline-flex bg-muted rounded-xl p-1 gap-1">
              <TabsTrigger value="schedule" className="text-xs sm:text-sm px-3 sm:px-5 rounded-lg flex-shrink-0">📅 Schedule</TabsTrigger>
              <TabsTrigger value="details" className="text-xs sm:text-sm px-3 sm:px-5 rounded-lg flex-shrink-0">📋 Loan Info</TabsTrigger>
              <TabsTrigger value="payments" className="text-xs sm:text-sm px-3 sm:px-5 rounded-lg flex-shrink-0">💸 Payments</TabsTrigger>
              <TabsTrigger value="penalties" className="text-xs sm:text-sm px-3 sm:px-5 rounded-lg flex-shrink-0">⚠️ Penalties</TabsTrigger>
            </TabsList>
          </div>

          {/* Payment Schedule */}
          <TabsContent value="schedule" className="mt-4">
            <CustomerPaymentSchedule
              schedule={ledger.loan.emi_schedule || []}
              emiDayOfMonth={ledger.loan.first_emi_date ? new Date(ledger.loan.first_emi_date).getDate() : 1}
              loanId={id}
              reloadLedger={loadLedger}
            />
          </TabsContent>

          {/* Loan Details */}
          <TabsContent value="details" className="space-y-4 mt-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Loan Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {[
                    { label: "Loan ID", value: ledger.loan.loan_id },
                    { label: "Customer", value: ledger.loan.customer?.full_name },
                    { label: "Product", value: ledger.loan.product ? `${ledger.loan.product.brand} ${ledger.loan.product.model}` : "No product" },
                    { label: "Loan Type", value: <span className="capitalize">{ledger.loan.loan_type}</span> },
                    { label: "Tenure", value: `${ledger.loan.tenure_months} months` },
                    { label: "Interest Rate", value: `${ledger.loan.interest_rate}% (${ledger.loan.interest_type})` },
                    { label: "Down Payment", value: formatCurrency(ledger.loan.down_payment || 0) },
                    { label: "Installment Amount", value: formatCurrency(ledger.loan.installment_amount) },
                    { label: "Frequency", value: "Monthly" },
                    { label: "Start Date", value: formatDate(ledger.loan.start_date) },
                    { label: "First EMI Date", value: formatDate(ledger.loan.first_emi_date) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5 py-2 border-b last:border-0">
                      <p className="text-xs font-medium text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                {ledger.loan.customer?.mobile_primary && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contact Numbers</p>
                      <p className="text-sm font-semibold">
                        {ledger.loan.customer?.mobile_primary}
                        {ledger.loan.customer?.mobile_secondary ? ` / ${ledger.loan.customer.mobile_secondary}` : ""}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {ledger.loan.guarantor_name && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Guarantor Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {[
                      { label: "Name", value: ledger.loan.guarantor_name },
                      { label: "Mobile", value: ledger.loan.guarantor_mobile || "-" },
                      { label: "Relation", value: ledger.loan.guarantor_relation || "-" },
                      { label: "Address", value: ledger.loan.guarantor_address || "-" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col gap-0.5 py-2 border-b last:border-0">
                        <p className="text-xs font-medium text-muted-foreground">{label}</p>
                        <p className="text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payment History */}
          <TabsContent value="payments" className="mt-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {ledger.payment_history.length === 0 ? (
                  <div className="py-12 flex flex-col items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-10 w-10 opacity-30" />
                    <p className="text-sm">No payments recorded yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto w-[95vw] sm:w-full -mx-1">
                    <Table className="min-w-[480px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ledger.payment_history.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="text-xs sm:text-sm">{formatDate(payment.payment_date)}</TableCell>
                            <TableCell className="font-semibold text-green-700 dark:text-green-400 text-xs sm:text-sm">{formatCurrency(payment.amount_paid)}</TableCell>
                            <TableCell className="capitalize text-xs sm:text-sm">{payment.payment_mode}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{payment.transaction_reference || "-"}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{payment.remarks || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penalties */}
          <TabsContent value="penalties" className="mt-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Penalties</CardTitle>
              </CardHeader>
              <CardContent>
                {ledger.penalty_history.length === 0 ? (
                  <div className="py-12 flex flex-col items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-10 w-10 text-green-400 opacity-60" />
                    <p className="text-sm">No penalties applied 🎉</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto w-[95vw] sm:w-full -mx-1">
                    <Table className="min-w-[380px]">
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
                            <TableCell className="text-xs sm:text-sm">{formatDate(penalty.applied_at)}</TableCell>
                            <TableCell className="capitalize text-xs sm:text-sm">{penalty.penalty_type.replace('_', ' ')}</TableCell>
                            <TableCell className="font-semibold text-destructive text-xs sm:text-sm">{formatCurrency(penalty.amount)}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{penalty.reason || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <div className="bg-yellow-400 rounded p-0.5">
              {/* <Zap className="h-3 w-3 text-yellow-900" fill="currentColor" /> */}
              <img src={mit} alt="" className="w-6 h-6"/>
            </div>
            <span className="font-semibold text-foreground">MIT Electro World</span>
          </div>
          <p>For support, contact your loan officer</p>
        </div>
      </div>

      {/* Hidden printable area */}
      <div className="hidden">
        <div ref={printRef}>
          <LedgerPrint
            loan={ledger.loan}
            customer={ledger.loan.customer || ({} as Customer)}
            ledger={generateLoanLedger(ledger.loan, ledger.payment_history, ledger.penalty_history)}
            summary={calculateLoanSummary(generateLoanLedger(ledger.loan, ledger.payment_history, ledger.penalty_history), ledger.loan)}
          />
        </div>
      </div>
    </div>
  );
}
