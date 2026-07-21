import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/db/api";
import { ArrowLeft, Download, Printer, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { EmiPayment, Loan, Customer } from "@/types/types";

export default function TodayCollectionReport() {
  const [payments, setPayments] = useState<EmiPayment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsData, loansData, customersData] = await Promise.all([
        api.payments.getAll(),
        api.loans.getAll(),
        api.customers.getAll()
      ]);

      const today = new Date().toISOString().split("T")[0];
      const todayPayments = paymentsData.filter(p => 
        p.payment_date?.startsWith(today)
      );

      setPayments(todayPayments);
      setLoans(loansData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return "Unknown";
    const customer = customers.find(c => c.id === loan.customer_id);
    return customer?.full_name || "Unknown";
  };

  const getLoanId = (loanId: string) => {
    return loanId?.slice(0, 8) || "-";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalCollection = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  const cashPayments = payments.filter(p => p.payment_mode === "cash");
  const upiPayments = payments.filter(p => p.payment_mode === "upi");
  const bankPayments = payments.filter(p => p.payment_mode === "bank_transfer");

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = [
      ["Payment ID", "Loan ID", "Customer Name", "Amount", "Payment Method", "Payment Date", "Remarks"].join(","),
      ...payments.map(p => [
        p.id,
        getLoanId(p.loan_id || ""),
        getCustomerName(p.loan_id || ""),
        p.amount_paid || 0,
        p.payment_mode || "",
        new Date(p.payment_date || "").toLocaleString(),
        p.remarks || ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `today-collection-report-${new Date().toISOString().split("T")[0]}.csv`;
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
              <DollarSign className="h-8 w-8 text-accent" />
              Today's Collection Report
            </h1>
            <p className="text-muted-foreground">All payments received today</p>
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
        <h1 className="text-2xl font-bold text-center">Today's Collection Report</h1>
        <p className="text-center text-sm text-muted-foreground">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{formatCurrency(totalCollection)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cash Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(cashPayments.reduce((sum, p) => sum + (p.amount_paid || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{cashPayments.length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">UPI Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(upiPayments.reduce((sum, p) => sum + (p.amount_paid || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{upiPayments.length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bank Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(bankPayments.reduce((sum, p) => sum + (p.amount_paid || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{bankPayments.length} transactions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-muted" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-medium">No collections today</p>
              <p className="text-sm">No payments have been received yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id?.slice(0, 8)}</TableCell>
                    <TableCell>{getLoanId(payment.loan_id || "")}</TableCell>
                    <TableCell>{getCustomerName(payment.loan_id || "")}</TableCell>
                    <TableCell className="font-semibold text-accent">
                      {formatCurrency(payment.amount_paid || 0)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary capitalize">
                        {payment.payment_mode?.replace("_", " ") || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(payment.payment_date || "").toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {payment.remarks || "-"}
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
