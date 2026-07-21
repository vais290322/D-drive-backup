import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/db/api";
import { generateLoanLedger, calculateLoanSummary, isLoanDelayed, calculateDaysDelayed } from "@/utils/loanCalculations";
import { ArrowLeft, Download, Printer, AlertCircle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Loan, Customer, EmiPayment, Penalty } from "@/types/types";

export default function DelayedEMIsReport() {
  const [delayedLoans, setDelayedLoans] = useState<Array<{
    loan: Loan;
    customer: Customer;
    daysDelayed: number;
    outstanding: number;
    nextDueDate: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loansData, customersData, paymentsData, penaltiesData] = await Promise.all([
        api.loans.getAll(),
        api.customers.getAll(),
        api.payments.getAll(),
        api.penalties.getAll()
      ]);

      const activeLoans = loansData.filter(l => l.status === "active");
      const delayed: Array<{
        loan: Loan;
        customer: Customer;
        daysDelayed: number;
        outstanding: number;
        nextDueDate: string;
      }> = [];

      for (const loan of activeLoans) {
        if (!loan.first_emi_date) continue;

        const loanPayments = paymentsData.filter(p => p.loan_id === loan.id);
        const loanPenalties = penaltiesData.filter(p => p.loan_id === loan.id);
        const ledger = generateLoanLedger(loan, loanPayments, loanPenalties);
        const summary = calculateLoanSummary(ledger, loan);

        // Use the new isLoanDelayed function
        if (isLoanDelayed(loan, summary)) {
          const customer = customersData.find(c => c.id === loan.customer_id);
          if (customer) {
            const daysDelayed = calculateDaysDelayed(loan, summary);
            
            // Get next overdue EMI date from schedule
            let nextDueDate = loan.first_emi_date;
            try {
              const emiSchedule = await api.emiSchedule.getByLoan(loan.id);
              const nextOverdueEmi = emiSchedule.find(emi => 
                emi.status === 'overdue' || emi.status === 'partial'
              );
              if (nextOverdueEmi) {
                nextDueDate = nextOverdueEmi.due_date;
              }
            } catch (error) {
              console.error(`Error loading EMI schedule for loan ${loan.id}:`, error);
            }
            
            delayed.push({
              loan,
              customer,
              daysDelayed,
              outstanding: summary.totalOutstanding,
              nextDueDate
            });
          }
        }
      }

      // Sort by days delayed (descending)
      delayed.sort((a, b) => b.daysDelayed - a.daysDelayed);
      setDelayedLoans(delayed);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalOutstanding = delayedLoans.reduce((sum, item) => sum + item.outstanding, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = [
      ["Loan ID", "Customer Name", "Phone", "Loan Amount", "Outstanding", "Days Delayed", "Next Due Date"].join(","),
      ...delayedLoans.map(({ loan, customer, daysDelayed, outstanding, nextDueDate }) => [
        loan.id,
        customer.full_name,
        customer.mobile_primary || "",
        loan.principal_amount || 0,
        outstanding,
        daysDelayed,
        new Date(nextDueDate || "").toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `delayed-emis-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              Delayed EMIs Report
            </h1>
            <p className="text-muted-foreground">Loans with pending payments</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-center">Delayed EMIs Report</h1>
        <p className="text-center text-sm text-muted-foreground">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Delayed Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{delayedLoans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalOutstanding)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Delay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {delayedLoans.length > 0
                ? Math.round(delayedLoans.reduce((sum, item) => sum + item.daysDelayed, 0) / delayedLoans.length)
                : 0}{" "}
              days
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delayed Loan Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-muted" />
              ))}
            </div>
          ) : delayedLoans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-success" />
              <p className="text-lg font-medium">No delayed EMIs!</p>
              <p className="text-sm">All loans are up to date.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Loan Amount</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Days Delayed</TableHead>
                  <TableHead>Next Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delayedLoans.map(({ loan, customer, daysDelayed, outstanding, nextDueDate }) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.id?.slice(0, 8)}</TableCell>
                    <TableCell>{customer.full_name}</TableCell>
                    <TableCell>{customer.mobile_primary || "-"}</TableCell>
                    <TableCell>{formatCurrency(loan.principal_amount || 0)}</TableCell>
                    <TableCell className="text-destructive font-semibold">
                      {formatCurrency(outstanding)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-destructive/10 text-destructive">
                        {daysDelayed} days
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(nextDueDate || "").toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
