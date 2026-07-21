import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, type LoanStatus } from "./StatusBadge";
import { FileText, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LoanDetails {
  id: string;
  customerName: string;
  loanType: string;
  amount: number;
  interestRate: number;
  duration: number;
  emiAmount: number;
  status: LoanStatus;
  disbursedDate?: string;
  paidEmis: number;
  totalEmis: number;
  outstandingBalance: number;
}

export function LoanDetailsCard() {
  // TODO: remove mock data - replace with real data from API
  const loan: LoanDetails = {
    id: "LN001",
    customerName: "Rajesh Kumar",
    loanType: "Personal Loan",
    amount: 500000,
    interestRate: 12.5,
    duration: 24,
    emiAmount: 23603,
    status: "disbursed",
    disbursedDate: "2024-01-15",
    paidEmis: 8,
    totalEmis: 24,
    outstandingBalance: 352794,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const progress = (loan.paidEmis / loan.totalEmis) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="mb-2">Loan Details</CardTitle>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">
                {loan.id}
              </span>
              <StatusBadge status={loan.status} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("View schedule")}
              data-testid="button-view-schedule"
            >
              <FileText className="h-4 w-4 mr-2" />
              EMI Schedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Download loan agreement")}
              data-testid="button-download-agreement"
            >
              <Download className="h-4 w-4 mr-2" />
              Agreement
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Customer Name</p>
            <p className="text-base font-medium">{loan.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Loan Type</p>
            <p className="text-base font-medium">{loan.loanType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Principal Amount</p>
            <p className="text-lg font-bold font-mono">
              {formatCurrency(loan.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Interest Rate</p>
            <p className="text-lg font-bold font-mono">{loan.interestRate}% p.a.</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">EMI Amount</p>
            <p className="text-lg font-bold font-mono">
              {formatCurrency(loan.emiAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-lg font-bold">{loan.duration} Months</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Repayment Progress</span>
            <span className="font-medium">
              {loan.paidEmis} / {loan.totalEmis} EMIs paid
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="p-4 bg-muted rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Outstanding Balance</span>
            <span className="text-xl font-bold font-mono" data-testid="text-outstanding">
              {formatCurrency(loan.outstandingBalance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
