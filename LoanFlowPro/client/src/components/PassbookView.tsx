import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Printer } from "lucide-react";

interface Transaction {
  date: string;
  type: "disbursement" | "payment" | "interest";
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export function PassbookView() {
  // TODO: remove mock data - replace with real data from API
  const customerName = "Rajesh Kumar";
  const loanId = "LN001";
  const transactions: Transaction[] = [
    {
      date: "2024-01-15",
      type: "disbursement",
      description: "Loan Disbursement",
      debit: 0,
      credit: 500000,
      balance: 500000,
    },
    {
      date: "2024-02-14",
      type: "payment",
      description: "EMI Payment #1",
      debit: 23603,
      credit: 0,
      balance: 476397,
    },
    {
      date: "2024-03-15",
      type: "payment",
      description: "EMI Payment #2",
      debit: 23603,
      credit: 0,
      balance: 452794,
    },
    {
      date: "2024-04-12",
      type: "payment",
      description: "EMI Payment #3",
      debit: 23603,
      credit: 0,
      balance: 429191,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="mb-2">Loan Passbook</CardTitle>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">Customer:</span>{" "}
                <span className="font-medium">{customerName}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Loan ID:</span>{" "}
                <span className="font-mono font-medium">{loanId}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => console.log("Print passbook")}
              data-testid="button-print"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              onClick={() => console.log("Download PDF")}
              data-testid="button-download"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn, index) => (
                <TableRow key={index} data-testid={`row-transaction-${index}`}>
                  <TableCell className="font-medium">
                    {formatDate(txn.date)}
                  </TableCell>
                  <TableCell>{txn.description}</TableCell>
                  <TableCell className="text-right font-mono">
                    {txn.debit > 0 ? formatCurrency(txn.debit) : "-"}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {txn.credit > 0 ? formatCurrency(txn.credit) : "-"}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {formatCurrency(txn.balance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 p-4 bg-muted rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Outstanding Balance:</span>
            <span className="text-xl font-bold font-mono" data-testid="text-outstanding-balance">
              {formatCurrency(transactions[transactions.length - 1].balance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
