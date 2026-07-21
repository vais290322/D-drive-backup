import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmiSchedule } from "@/types/types";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router";

// Extend Window to include PhonePe SDK (injected via index.html script)
declare global {
  interface Window {
    PhonePeCheckout?: {
      transact: (options: {
        tokenUrl: string;
        callback: (status: string) => void;
        type: "IFRAME" | "REDIRECT";
      }) => void;
    };
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://collage.vaisacademy.com/mitloan";

interface CustomerPaymentScheduleProps {
  schedule: EmiSchedule[];
  emiDayOfMonth: number;
  loanId?: string;
  reloadLedger: () => void;
}

export function CustomerPaymentSchedule({ schedule, emiDayOfMonth, loanId, reloadLedger }: CustomerPaymentScheduleProps) {
  const [payingEmiId, setPayingEmiId] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const hasChecked = useRef(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handlePayEmi = async (emi: EmiSchedule) => {
    if (!loanId) {
      toast.error("Loan ID is missing. Cannot initiate payment.");
      return;
    }
    // console.log("emi : ",emi)

    setPayingEmiId(emi.id);
    try {
      const res = await fetch(
        `${API_BASE_URL}/createPayment/${loanId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emiId: emi.id,
            emiNumber: emi.emi_number,
            amount: emi.emi_amount,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to initiate payment.");
        return;
      }

      const checkoutUrl: string = data.checkoutUrl;

      if (!checkoutUrl) {
        toast.error("No checkout URL received from PhonePe.");
        return;
      }

      if (window.PhonePeCheckout) {
        window.PhonePeCheckout.transact({
          tokenUrl: checkoutUrl,
          callback: (status: string) => {
            if (status === "SUCCESS") {
              toast.success(`EMI #${emi.emi_number} payment successful! 🎉`);
            } else if (status === "FAILED") {
              toast.error(`Payment for EMI #${emi.emi_number} failed.`);
            } else {
              toast.info(`Payment status: ${status}`);
            }
          },
          type: "REDIRECT",
        });
      } else {
        toast.info("Redirecting to PhonePe...");
        window.open(checkoutUrl, "_self");
      }

    } catch (err) {
      console.error("PhonePe payment error:", err);
      toast.error("Something went wrong while initiating payment.");
    } finally {
      setPayingEmiId(null);
    }
  };

  const checkStatus = async (orderId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/checkOrderStatus/${orderId}`);
      const data = await res.json();

      if (data?.data?.state === "COMPLETED") {
        toast.success("Payment successful 🎉");
        reloadLedger();
      } else if (data?.data?.state === "FAILED") {
        toast.error("Payment failed");
      } else {
        toast.info("Payment pending");
      }
    } catch (error) {
      toast.error("Unable to verify payment");
    }
  };

  useEffect(() => {
    if (hasChecked.current) return;

    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");

    if (orderId) {
      hasChecked.current = true;

      (async () => {
        await checkStatus(orderId);
        navigate(location.pathname, { replace: true });
        window.location.reload();
      })();
    }
  }, [location]);

  const getStatusBadge = (status: EmiSchedule['status']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 gap-1">
            <AlertCircle className="h-3 w-3" />
            Overdue
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20 gap-1">
            <Clock className="h-3 w-3" />
            Partial
          </Badge>
        );
      default:
        return null;
    }
  };

  const paidCount = schedule.filter(e => e.status === 'paid').length;
  const pendingCount = schedule.filter(e => e.status === 'pending' || e.status === 'overdue').length;

  const PayButton = ({ emi }: { emi: EmiSchedule }) => (
    
    <Button
      size="sm"
      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-sm border-0 w-full sm:w-auto"
      disabled={payingEmiId !== null}
      onClick={() => handlePayEmi(emi)}
    >
      {payingEmiId === emi.id ? (
        <>
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          Processing…
        </>
      ) : (
        "Pay Now"
      )}
    </Button>
  );

  return (
    <Card className="w-full border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Repayment Schedule
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              EMI due on{" "}
              <span className="font-semibold text-foreground">
                {emiDayOfMonth}
                {emiDayOfMonth === 1 ? "st" : emiDayOfMonth === 2 ? "nd" : emiDayOfMonth === 3 ? "rd" : "th"}
              </span>{" "}
              of every month
            </p>
          </div>

          {/* Summary Pills */}
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-1.5 text-center min-w-[70px]">
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="text-base font-bold text-green-600">{paidCount}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-1.5 text-center min-w-[70px]">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-base font-bold text-blue-600">{pendingCount}</p>
            </div>
            <div className="bg-muted rounded-xl px-3 py-1.5 text-center min-w-[70px]">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-base font-bold">{schedule.length}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6">

        {/* ── Mobile Card View (shown below md) ── */}
        <div className="md:hidden space-y-3">
          {schedule.map((emi) => (
            <div
              key={emi.id}
              className={`rounded-xl border p-4 space-y-3 transition-colors
                                ${emi.status === 'paid' ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200/60 dark:border-green-800/40' :
                  emi.status === 'overdue' ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200/60 dark:border-red-800/40' :
                    'bg-card border-border'}`}
            >
              {/* Row 1: EMI # and Status */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">EMI #{emi.emi_number}</span>
                {getStatusBadge(emi.status)}
              </div>

              {/* Row 2: Amount and Due Date */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-bold text-base text-foreground">{formatCurrency(emi.emi_amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="font-medium text-sm">{format(new Date(emi.due_date), "dd MMM yyyy")}</p>
                </div>
              </div>

              {/* Row 3: Paid Date (if paid) OR Pay Button */}
              {emi.status === 'paid' && emi.paid_date ? (
                <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Paid on {format(new Date(emi.paid_date), "dd MMM yyyy")}
                </div>
              ) : emi.status === 'pending' ? (
                <PayButton emi={emi} />
              ) : null}
            </div>
          ))}
        </div>

        {/* ── Desktop Table View (shown at md+) ── */}
        <div className="hidden md:block rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px] font-semibold">EMI #</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="text-center font-semibold">Amount</TableHead>
                <TableHead className="text-center font-semibold">Status</TableHead>
                <TableHead className="text-center font-semibold">Paid Date</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {schedule.map((emi) => (
                <TableRow
                  key={emi.id}
                  className={
                    emi.status === 'paid'
                      ? 'bg-green-50/40 dark:bg-green-900/10'
                      : emi.status === 'overdue'
                        ? 'bg-red-50/40 dark:bg-red-900/10'
                        : ''
                  }
                >
                  <TableCell className="font-bold">#{emi.emi_number}</TableCell>
                  <TableCell>{format(new Date(emi.due_date), "dd MMM yyyy")}</TableCell>
                  <TableCell className="text-center font-semibold">{formatCurrency(emi.emi_amount)}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(emi.status)}</TableCell>
                  <TableCell className="text-center text-muted-foreground text-sm">
                    {emi.paid_date ? format(new Date(emi.paid_date), "dd MMM yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {(emi.status === "pending") && (
                      <PayButton emi={emi} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </CardContent>
    </Card>
  );
}
