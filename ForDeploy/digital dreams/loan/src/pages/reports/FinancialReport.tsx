import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/db/api";
import { generateLoanLedger, calculateLoanSummary } from "@/utils/loanCalculations";
import { ArrowLeft, Download, Printer, Wallet, TrendingUp, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Loan, Customer, EmiPayment, Penalty } from "@/types/types";

export default function FinancialReport() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<EmiPayment[]>([]);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
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
      setLoans(loansData);
      setCustomers(customersData);
      setPayments(paymentsData);
      setPenalties(penaltiesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.full_name || "Unknown";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate financial metrics
  const totalDisbursed = loans.reduce((sum, l) => sum + (l.principal_amount || 0), 0);
  const totalCollected = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  
  let totalOutstanding = 0;
  const loanDetails = loans.map(loan => {
    const loanPayments = payments.filter(p => p.loan_id === loan.id);
    const loanPenalties = penalties.filter(p => p.loan_id === loan.id);
    const ledger = generateLoanLedger(loan, loanPayments, loanPenalties);
    const summary = calculateLoanSummary(ledger, loan);
    
    if (loan.status === "active") {
      totalOutstanding += summary.totalOutstanding;
    }
    
    return {
      loan,
      summary,
      customerName: getCustomerName(loan.customer_id || "")
    };
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = [
      ["Loan ID", "Customer Name", "Disbursed Amount", "Total Payable", "Collected", "Outstanding", "Status"].join(","),
      ...loanDetails.map(({ loan, summary, customerName }) => [
        loan.id,
        customerName,
        loan.principal_amount || 0,
        loan.total_payable || 0,
        summary.totalPaid,
        summary.totalOutstanding,
        loan.status || ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split("T")[0]}.csv`;
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
              <Wallet className="h-8 w-8" />
              Financial Report
            </h1>
            <p className="text-muted-foreground">Complete financial overview</p>
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
        <h1 className="text-2xl font-bold text-center">Financial Report</h1>
        <p className="text-center text-sm text-muted-foreground">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
            <Wallet className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDisbursed)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total loan amount disbursed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCollected)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total payments received
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending amount to be collected
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan-wise Financial Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-muted" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Disbursed</TableHead>
                  <TableHead>Total Payable</TableHead>
                  <TableHead>Collected</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanDetails.map(({ loan, summary, customerName }) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.id?.slice(0, 8)}</TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>{formatCurrency(loan.principal_amount || 0)}</TableCell>
                    <TableCell>{formatCurrency(loan.total_payable || 0)}</TableCell>
                    <TableCell className="text-success">{formatCurrency(summary.totalPaid)}</TableCell>
                    <TableCell className="text-primary">{formatCurrency(summary.totalOutstanding)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          loan.status === "completed"
                            ? "bg-success/10 text-success"
                            : loan.status === "active"
                            ? "bg-accent/10 text-accent"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Total Loans:</span>
              <span className="text-lg font-bold">{loans.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Active Loans:</span>
              <span className="text-lg font-bold">{loans.filter(l => l.status === "active").length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Completed Loans:</span>
              <span className="text-lg font-bold">{loans.filter(l => l.status === "completed").length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Total Disbursed:</span>
              <span className="text-lg font-bold text-success">{formatCurrency(totalDisbursed)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Total Collected:</span>
              <span className="text-lg font-bold text-accent">{formatCurrency(totalCollected)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Total Outstanding:</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(totalOutstanding)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t-2 border-primary">
              <span className="font-bold text-lg">Collection Rate:</span>
              <span className="text-xl font-bold text-accent">
                {totalDisbursed > 0 ? ((totalCollected / totalDisbursed) * 100).toFixed(2) : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
