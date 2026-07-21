import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/db/api";
import { ArrowLeft, Download, Printer, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Loan, Customer } from "@/types/types";

export default function CompletedLoansReport() {
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
      const loansData = await api.dashboard.getCompletedLoans();
      setLoans(loansData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (loan: any) => {
    if (loan.customer_id && typeof loan.customer_id === 'object') {
      return (loan.customer_id as any).full_name || "Unknown";
    }
    return "Unknown";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalDisbursed = loans.reduce((sum, l) => sum + (Number(l.principal_amount) || 0), 0);
  const totalPayable = loans.reduce((sum, l) => sum + (Number(l.total_payable) || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = [
      ["Loan ID", "Customer Name", "Loan Amount", "Total Collected", "Tenure", "Start Date", "Completion Date"].join(","),
      ...loans.map(l => [
        l.id || l._id,
        getCustomerName(l),
        l.principal_amount || 0,
        l.total_payable || 0,
        `${l.tenure_months || 0} months`,
        new Date(l.start_date || "").toLocaleDateString(),
        l.updated_at ? new Date(l.updated_at).toLocaleDateString() : "-"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `completed-loans-report-${new Date().toISOString().split("T")[0]}.csv`;
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
              <CheckCircle className="h-8 w-8 text-success" />
              Completed Loans Report
            </h1>
            <p className="text-muted-foreground">All fully paid loans</p>
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
        <h1 className="text-2xl font-bold text-center">Completed Loans Report</h1>
        <p className="text-center text-sm text-muted-foreground">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Completed Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Disbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDisbursed)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPayable)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
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
                  <TableHead>Loan Amount</TableHead>
                  <TableHead>Total Collected</TableHead>
                  <TableHead>Tenure</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Completion Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id || loan._id}>
                    <TableCell className="font-medium">{(loan.loan_id || loan.id || loan._id)?.slice(0, 8)}</TableCell>
                    <TableCell>{getCustomerName(loan)}</TableCell>
                    <TableCell>{formatCurrency(Number(loan.principal_amount) || 0)}</TableCell>
                    <TableCell className="text-success">{formatCurrency(Number(loan.total_payable) || 0)}</TableCell>
                    <TableCell>{loan.tenure_months} months</TableCell>
                    <TableCell>
                      {new Date(loan.start_date || "").toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {loan.updated_at ? new Date(loan.updated_at).toLocaleDateString() : "-"}
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

